<?php

namespace App\Services\SeatingAlgorithm;

use App\Models\Wedding;
use Illuminate\Support\Collection;

class ConflictResolver
{
    protected Collection $guestMap;

    public function setGuestMap(Collection $guestMap): void
    {
        $this->guestMap = $guestMap;
    }

    public function resolve(array $allocation, Wedding $wedding): array
    {
        $conflicts = $wedding->guestConflicts()->get();

        // Run multiple passes as moving one guest might cause another conflict
        for ($pass = 0; $pass < 3; $pass++) {
            $changed = false;
            foreach ($conflicts as $conflict) {
                foreach ($allocation as $tableId => $guestIds) {
                    if (in_array($conflict->guest_a_id, $guestIds, true) && in_array($conflict->guest_b_id, $guestIds, true)) {
                        $this->separate($allocation, $tableId, $conflict);
                        $changed = true;
                        // Reset guestIds for this table since it changed
                        $guestIds = $allocation[$tableId];
                    }
                }
            }
            if (!$changed) {
                break;
            }
        }

        return $allocation;
    }

    private function separate(array &$allocation, $tableId, $conflict): void
    {
        // Try moving guest_b first
        $guestId = $conflict->guest_b_id;
        $tempAllocation = $allocation;
        $tempAllocation[$tableId] = array_values(array_filter($tempAllocation[$tableId], static fn($id) => $id !== $guestId));
        $bestTable = $this->findBestTableForGuest($guestId, $tempAllocation, $tableId);

        if ($bestTable !== null) {
            $allocation[$tableId] = $tempAllocation[$tableId];
            $allocation[$bestTable][] = $guestId;
            return;
        }

        // If guest_b can't move, try moving guest_a
        $guestId = $conflict->guest_a_id;
        $tempAllocation = $allocation;
        $tempAllocation[$tableId] = array_values(array_filter($tempAllocation[$tableId], static fn($id) => $id !== $guestId));
        $bestTable = $this->findBestTableForGuest($guestId, $tempAllocation, $tableId);

        if ($bestTable !== null) {
            $allocation[$tableId] = $tempAllocation[$tableId];
            $allocation[$bestTable][] = $guestId;
        }
        // If neither can move without creating a new conflict, we might be stuck, but we moved B at least.
    }

    private function findBestTableForGuest($guestId, array $allocation, $currentTableId): string|int|null
    {
        $bestTable = null;
        $bestScore = -INF;
        $guest = $this->guestMap[$guestId] ?? null;

        if (!$guest) {
             return null;
        }

        foreach ($allocation as $tableId => $guestIds) {
            if ($tableId === $currentTableId) {
                continue;
            }

            // Check if moving guest here causes a new conflict
            $hasConflict = false;
            foreach ($guest->conflictWith() ?? [] as $conflict) {
                if (in_array($conflict->id, $guestIds, true)) {
                    $hasConflict = true;
                    break;
                }
            }
            if ($hasConflict) {
                continue;
            }

            // Also check if any guest already on this table has a conflict with the incoming guest
            foreach ($guestIds as $otherGuestId) {
                $otherGuest = $this->guestMap[$otherGuestId] ?? null;
                if ($otherGuest) {
                    foreach ($otherGuest->conflictWith() ?? [] as $otherConflict) {
                        if ($otherConflict->id === $guest->id) {
                            $hasConflict = true;
                            break 2;
                        }
                    }
                }
            }
            if ($hasConflict) {
                continue;
            }

            $score = 0;

            foreach ($guestIds as $otherGuestId) {
                $otherGuest = $this->guestMap[$otherGuestId] ?? null;

                if (!$otherGuest) {
                    continue;
                }

                $sharedGroups = $guest->groups->pluck('id')->intersect($otherGuest->groups->pluck('id'));

                $score += $sharedGroups->count() * 5;
            }

            if ($score > $bestScore) {
                $bestScore = $score;
                $bestTable = $tableId;
            }
        }

        return $bestTable;
    }
}
