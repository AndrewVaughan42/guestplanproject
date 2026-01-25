<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VenueLayer extends Model
{
    use HasFactory;

    public function venue(): BelongsTo
    {
        return $this->belongsTo(Venue::class);
    }

    public function weddings(): HasMany
    {
        return $this->hasMany(Wedding::class);
    }

    protected function casts(): array
    {
        return [
            'tableLayout' => 'array',
        ];
    }
}
