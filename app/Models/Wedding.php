<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Wedding extends Model
{
    use HasFactory;

    public function venue(): BelongsTo
    {
        return $this->belongsTo(Venue::class);
    }

    public function venueLayer(): BelongsTo
    {
        return $this->belongsTo(VenueLayer::class);
    }

    protected function casts(): array
    {
        return [
            'date' => 'date',
        ];
    }
}
