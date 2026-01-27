<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VenueLayer extends Model
{
    use HasFactory;

    protected $fillable = [
        'venue_id',
        'user_id',
        'tableAmount',
        'tableLayout',
    ];

    public function venue(): BelongsTo
    {
        return $this->belongsTo(Venue::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
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
