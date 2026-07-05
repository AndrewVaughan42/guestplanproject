<?php


namespace App\Services\SeatingAlgorithm;

use App\Models\VenueLayer;
use Illuminate\Support\Collection;

class TableBalancer
{

    public function balance(Collection $tables, int $guestCount): ?Collection
    {
        $topTables = $tables->filter(fn($table) => $table['type'] === 'top');
        $otherTables = $tables->filter(fn($table) => $table['type'] !== 'top');

        $topTableGuestsCount = $topTables->sum(function($table) {
            return $table['guest_count'] ?? 0;
        });
        $remainingGuestsCount = max(0, $guestCount - $topTableGuestsCount);
        $totalMaxCapacityOther = $otherTables->sum(fn ($table) => $table['seat_maximum'] ?? $table['capacity'] ?? 0);
        if ($totalMaxCapacityOther < $remainingGuestsCount) {
            return null;
        }
        $tableCount = $otherTables->count();
        if ($tableCount > 0) {
            $base = intdiv($remainingGuestsCount, $tableCount);
            $remainder = $remainingGuestsCount % $tableCount;

            $balancedOtherTables = $otherTables->map(function ($table) use (&$remainder, $base) {
                $target = $base;

                if ($remainder > 0){
                    $target++;
                    $remainder--;
                }

                $table['seat_count'] = $target;
                return $table;
            });

            // Second pass: if any table's seat_count > its seat_maximum, redistribute
            $overflow = 0;
            $balancedOtherTables = $balancedOtherTables->map(function ($table) use (&$overflow) {
                $max = $table['seat_maximum'] ?? $table['capacity'] ?? 999;
                if ($table['seat_count'] > $max) {
                    $overflow += ($table['seat_count'] - $max);
                    $table['seat_count'] = $max;
                }
                return $table;
            });

            if ($overflow > 0) {
                while ($overflow > 0) {
                    foreach ($balancedOtherTables as &$table) {
                        if ($overflow <= 0) break;
                        $max = $table['seat_maximum'] ?? $table['capacity'] ?? 999;
                        if ($table['seat_count'] < $max) {
                            $table['seat_count']++;
                            $overflow--;
                        }
                    }
                }
            }

            return $topTables->concat($balancedOtherTables);
        }

        return $tables;
    }

    public function redistribute(Collection $tables, array $allocations): Collection
    {
        $counts = collect($allocations)->map(fn($g) => count($g));

        return $tables;
    }
}
