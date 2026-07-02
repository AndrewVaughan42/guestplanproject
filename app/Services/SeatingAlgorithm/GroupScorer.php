<?php


namespace App\Services\SeatingAlgorithm;

use App\Models\Guest;
use App\Models\Wedding;
use Illuminate\Support\Collection;


class GroupScorer
{
    final int $sameGroupBonus = 5;
    final int $penaltyRate = 50;

    protected Collection $guestMap;

    protected array $groupCache = [];
    protected array $conflictsCache = [];

    public function setGuestMap(Collection $guestMap): void
    {
        $this->guestMap = $guestMap;

        foreach ($guestMap as $guest) {

            $this->groupCache[$guest->id] = $guest->groups->pluck('id')->flip()->all();
        }

        foreach ($guestMap as $guest) {
            $this->conflictsCache[$guest->id] = [];

            foreach ($guest->conflictWith() as $other) {
                $this->conflictsCache[$guest->id][$other->id] = true;
            }
        }
    }

    public function scorePlacement(Guest $guest, array $table, array $allocation): float
    {

        $score = 0;

        $currentGuests = $allocation[$table['id']] ?? [];

        $score += $this->groupSeatingScore($guest, $currentGuests);

        $score += $this->conflictPenalty($guest, $currentGuests);

        $score += $this->balanceScore($table, $currentGuests);

        return $score;

    }

    //Get full score
    public function scoreFull(array $allocation, $wedding): float
    {
        $score = 0;

        foreach ($allocation as $guestIds) {

            $count = count($guestIds);

            if ($count < 2) {
                continue;
            }

            foreach ($guestIds as $i => $iValue) {

                for ($j=$i+1;$j<$count;$j++) {

                    $g1 = $this->guestMap[$iValue];
                    $g2 = $this->guestMap[$guestIds[$j]];

                    if (!$g1 || !$g2) {
                        continue;
                    }

                    $shared = array_intersect_key(
                        $this->groupCache[$g1->id],
                        $this->groupCache[$g2->id]
                    );

                    $score += count($shared) * $this->sameGroupBonus;
                }
            }
        }

        return $score;
    }

    public function groupSeatingScore(Guest $guest, array $tableGuests): float
    {
        $score = 0;

        // Build lookup table ONCE
        $guestGroups = $this->groupCache[$guest->id] ?? [];

        foreach ($tableGuests as $otherGuestId) {

            $otherGroups = $this->groupCache[$otherGuestId] ?? null;

            if (!$otherGroups) {
                continue;
            }

            // Fast intersection using hash lookup
            foreach ($this->groupCache[$otherGuestId] as $groupId => $_) {

                if (isset($guestGroups[$groupId])) {
                    $score += $this->sameGroupBonus;
                }
            }
        }

        return $score;
    }
    public function conflictPenalty(Guest $guest, array $tableGuests): float
    {

        $penalty = 0;

        $conflicts = $this->conflictCache[$guest->id] ?? [];

        foreach ($tableGuests as $otherGuestId) {

            if (isset($conflicts[$otherGuestId])) {
                $penalty -= $this->penaltyRate;
            }
        }

        return $penalty;
    }

    public function balanceScore(array $table, array $tableGuests): float
    {

        $capacity = $table['seat_count'] ?? $table['seat_maximum'] ?? $table['capacity'] ?? 0;
        $count = count($tableGuests);

        if ($capacity === 0) {
            return 0;
        }

        $diff = abs($capacity - $count);

        return -$diff * 2;
    }

    public function internalGroupScore(Collection $guests): float
    {
        return $guests->count() * 2;
    }

    public function scoreTable(array $tableGuestIds, array $table, Wedding $wedding): float
    {
        $score = 0;

        foreach ($tableGuestIds as $guestId) {
            $guest = $this->guestMap[$guestId] ?? null;
            if (!$guest) {
                continue;
            }

            foreach ($tableGuestIds as $otherId) {
                if ($guestId === $otherId) {
                    continue;
                }

                $other = $this->guestMap[$otherId] ?? null;
                if (!$other) {
                    continue;
                }

                $shared = $guest->groups->pluck('id')
                    ->intersect($other->groups->pluck('id'));

                $score += $shared->count() * $this->sameGroupBonus;
            }

            $score += $this->balanceScore($table, $tableGuestIds);
            $score += $this->conflictPenalty($guest, $tableGuestIds);
        }

        return $score;
    }

}
