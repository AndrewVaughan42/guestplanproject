<?php

namespace App\Services\SeatingAlgorithm;
use App\Models\VenueLayer;
use Illuminate\Support\Collection;

class LayerSelector
{
    public function select(?Collection $layers, int $guestCount): ?VenueLayer
    {
        if (!$layers || $layers->isEmpty()) {
            return null;
        }
        $validLayer = $layers->filter(fn($layer) => $this->canFit($layer, $guestCount));
        if ($validLayer->isEmpty()) {
            return null;
        }
        return $validLayer->sortBy(fn ($layer) => collect($layer->table_data)->sum(fn ($table) => $table['seat_maximum'] ?? 0))->values()->first();
    }

    private function canFit(VenueLayer $layer, int $guestCount): bool
    {
        return collect($layer->table_data)->sum(fn ($table) => $table['seat_maximum'] ?? 0) >= $guestCount;
    }
}

