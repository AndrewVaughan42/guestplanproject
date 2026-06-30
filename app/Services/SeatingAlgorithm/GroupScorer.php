<?php


namespace App\Services\SeatingAlgorithm;

use App\Models\Guest;
use Illuminate\Support\Collection;


class GroupScorer
{
    final int $sameGroupBonus = 5;
    final int $penaltyRate = 50;

    protected Collection $guestMap;

    public function setGuestMap(Collection $guestMap): void
    {
        $this->guestMap = $guestMap;
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

        foreach ($allocation as $tableId => $guestIds) {
            $guests = $wedding->guests->whereIn('id', $guestIds);

            $score += $this->internalGroupScore($guests);
        }

        return $score;
    }

    public function groupSeatingScore(Guest $guest, array $tableGuests): float
    {

        $score = 0;

        foreach ($guest->groups ?? [] as $group) {
            foreach ($tableGuests as $otherGuestId) {
                $otherGuest = $this->guestMap[$otherGuestId] ?? null;
                if (!$otherGuest) {
                    continue;
                }
                $sharedGroups = $guest->groups->pluck('id')->intersect($otherGuest->groups->pluck('id'));

                $score += $sharedGroups->count() * $this->sameGroupBonus;
            }
        }

        return $score;
    }

    public function conflictPenalty(Guest $guest, array $tableGuests): float
    {

        $penalty = 0;

        foreach ($guest->conflictWith() ?? [] as $conflict) {
            if (in_array($conflict->id, $tableGuests, true)) {
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

}
