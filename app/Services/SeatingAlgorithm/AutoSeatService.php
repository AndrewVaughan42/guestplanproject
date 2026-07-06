<?php

namespace App\Services\SeatingAlgorithm;

use App\Models\VenueLayer;
use App\Models\Wedding;
use Closure;
use Illuminate\Support\Collection;

class AutoSeatService
{
    protected GroupScorer $scorer;
    protected TableBalancer $balancer;
    protected ConflictResolver $conflicts;
    protected LayerSelector $selector;

    protected Collection $guestMap;

    public function __construct()
    {
        $this->scorer = new GroupScorer();
        $this->balancer = new TableBalancer();
        $this->conflicts = new ConflictResolver();
        $this->selector = new LayerSelector();
    }

    public function generate(Wedding $wedding, VenueLayer $inLayer, array $options = []): array
    {
        $guests = $wedding->guests()->with(['groups', 'menuItem'])->get();
        $this->guestMap = $guests->keyBy('id');
        $this->scorer->setGuestMap($this->guestMap);
        $this->conflicts->setGuestMap($this->guestMap);

        $layer = $this->resolveLayer($wedding, $inLayer, $guests->count());

        if (!$layer) {
            throw new \RuntimeException('No suitable layer found');
        }
        $tables = collect($layer->table_data)->map(function ($table) use ($options) {
            if (isset($options['currentTables'])) {
                $currentTable = collect($options['currentTables'])->firstWhere('id', $table['id']);
                if ($currentTable) {
                    $table = array_merge($table, $currentTable);
                }
            }

            if ($table['type'] === 'top') {
                $table['guest_count'] = count($options['currentAllocations'][$table['id']] ?? []);
            }
            return $table;
        });

        $tables = $this->balancer->balance($tables, $guests->count());

        if (!$tables) {
            throw new \RuntimeException('Insufficient capacity in the selected layer');
        }

        $allocation = $this->initAllocation($tables);

        // Seed guests (initially seated or partners)
        $unassigned = $guests;
        foreach ($tables->where('type', 'top') as $topTable) {
            $alreadySeatedIds = $options['currentAllocations'][$topTable['id']] ?? [];


            foreach ($alreadySeatedIds as $index => $guestId) {
                if ($guestId) {
                    $allocation[$topTable['id']][$index] = (int)$guestId;
                    $unassigned = $unassigned->reject(fn($g) => $g->id == $guestId);
                }
            }


        }

        [$allocation, $unassigned] = $this->seedGuests($unassigned, $tables, $allocation);

        [$allocation, $unassigned] = $this->placeRemainingGuests($unassigned, $tables, $allocation, $options);

        // Increase optimization passes for better grouping
        for ($j = 0; $j < 5; $j++) {
             $allocation = $this->optimise($allocation, $tables, $wedding);
        }

        $allocation = $this->conflicts->resolve($allocation, $wedding);

        return
            [
                'allocations' => $allocation,
                'tables' => $tables,
                'venue_layer_id' => $layer->id,
                'score' => $this->scorer->scoreFull($allocation, $wedding)
            ];
    }

    private function initAllocation(Collection $tables): array
    {
        $allocation = [];

        foreach ($tables as $table) {
            $allocation[$table['id']] = [];
        }

        return $allocation;
    }

    private function resolveLayer(Wedding $wedding, VenueLayer $usersLayer, int $guestCount): ?VenueLayer
    {
        if ($this->layerFits($usersLayer,$guestCount)) {
            return $usersLayer;
        }
        return $this->selector->select($wedding->venue->venueLayers, $guestCount);
    }

    private function layerFits(VenueLayer $layer, int $guestCount): bool
    {

        $tables = collect($layer->table_data);

        $capacity = $tables->sum(fn($t) => $t['seat_maximum'] ?? $t['seat_count'] ?? 0);
        return $capacity >= $guestCount;
    }

    private function seedGuests($guests, $tables, $allocation): array
    {
        $unassigned = $guests;
        $otherTables = $tables->filter(fn($t) => $t['type'] !== 'top');

        $sortedGuests = $unassigned->sortByDesc(fn ($g) => optional($g->groups->first())->ranking ?? 0);

        foreach ($sortedGuests as $guest) {
            // If guest is already unassigned (removed by group placement), skip
            if (!$unassigned->contains('id', $guest->id)) continue;

            // Try to place guest AND their group members together
            $group = $guest->groups->first();
            if ($group) {
                $groupMembers = $unassigned->filter(fn($g) => $g->groups->contains('id', $group->id));

                $bestTable = null;
                $bestScore = -INF;

                foreach ($otherTables as $table) {
                    $capacity = $table['seat_count'] ?? $table['seat_maximum'] ?? $table['capacity'] ?? 0;
                    if (count($allocation[$table['id']]) + $groupMembers->count() > $capacity) {
                        continue;
                    }

                    $score = 0;
                    foreach ($groupMembers as $member) {
                        $score += $this->scorer->scorePlacement($member, $table, $allocation);
                    }

                    if ($score > $bestScore) {
                        $bestScore = $score;
                        $bestTable = $table['id'];
                    }
                }

                if ($bestTable !== null) {
                    foreach ($groupMembers as $member) {
                        $allocation[$bestTable][] = $member->id;
                        $unassigned = $unassigned->reject(fn($g) => $g->id === $member->id);
                    }
                    continue;
                }
            }

            [$allocation, $success] = $this->placeGuest($guest, $otherTables, $allocation);

            if ($success) {
                $unassigned = $unassigned->reject(fn ($g) => $g->id === $guest->id);
            }
        }

        return [$allocation, $unassigned];
    }

    private function placeGuest($guest, $tables, $allocation): array
    {
        $bestTable = null;
        $bestScore = -INF;

            foreach ($tables as $table) {
               $capacity = $table['seat_count'] ?? $table['seat_maximum'] ?? $table['capacity'] ?? 0;
               if (count($allocation[$table['id']]) >= $capacity) {
                   continue;
               }

               $score = $this->scorer->scorePlacement($guest, $table, $allocation);

               if ($score > $bestScore) {
                   $bestScore = $score;
                   $bestTable = $table['id'];
               }
            }
            if (!$bestTable) {
                return [$allocation, false];
            }
            $allocation[$bestTable][] = $guest->id;

        return [$allocation, true];
    }

    private function placeRemainingGuests($guests, $tables, $allocation, $options): array
    {
        $temp = $options['temperature'] ?? 1.0;
        $otherTables = $tables->filter(fn($t) => $t['type'] !== 'top');

        foreach ($guests as $guest) {
            $bestTable = null;
            $bestScore = -INF;

            foreach ($otherTables as $table) {
                $capacity = $table['seat_count'] ?? $table['seat_maximum'] ?? $table['capacity'] ?? 0;
                if (count($allocation[$table['id']]) >= $capacity) {
                    continue;
                }

                $score = $this->scorer->scorePlacement($guest, $table, $allocation);

                $prob = exp($score / max($temp, 0.01));

                if ($prob > $bestScore) {
                    $bestScore = $prob;
                    $bestTable = $table['id'];
                }
            }
            if ($bestTable) {
                $allocation[$bestTable][] = $guest->id;
            } else {

                foreach ($otherTables as $table) {
                    $absCapacity = $table['seat_maximum'] ?? $table['capacity'] ?? 0;
                    if (count($allocation[$table['id']]) < $absCapacity) {
                        $allocation[$table['id']][] = $guest->id;
                        break;
                    }
                }
            }
        }
        return [$allocation, collect([])];
    }

    private function optimise($allocation, $tables, $wedding): array
    {
        $tableMap = $tables->keyBy('id');
        $otherTableIds = $tables->filter(fn($t) => $t['type'] !== 'top')->pluck('id')->toArray();

        if (count($otherTableIds) < 2) {
            return $allocation;
        }

        for ($i = 0; $i < 60; $i++) {
            $a = $otherTableIds[array_rand($otherTableIds)];
            $b = $otherTableIds[array_rand($otherTableIds)];

            if ($a === $b) {
                continue;
            }

            $tableA = $allocation[$a];
            $tableB = $allocation[$b];

            $guestAId = $tableA[array_rand($tableA)];
            $guestBId = $tableB[array_rand($tableB)];

            if (!isset($this->guestMap[$guestAId], $this->guestMap[$guestBId])) {
                continue;
            }

            $oldScore = $this->scorer->scoreTable($tableA, $tableMap[$a], $wedding) +
                $this->scorer->scoreTable($tableB, $tableMap[$b], $wedding);

            $newA = array_values(array_diff($tableA, [$guestAId]));
            $newB = array_values(array_diff($tableB, [$guestBId]));

            $newA[] = $guestBId;
            $newB[] = $guestAId;

            $newScore = $this->scorer->scoreTable($newA, $tableMap[$a], $wedding) +
                $this->scorer->scoreTable($newB, $tableMap[$b], $wedding);
            if ($newScore > $oldScore) {
                $allocation[$a] = $newA;
                $allocation[$b] = $newB;
            }
        }
        return $allocation;
    }

}
