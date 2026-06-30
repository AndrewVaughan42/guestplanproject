<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Seatplan extends Model
{
    use HasFactory;

    protected $fillable = [
        'wedding_id',
        'venue_layer_id',
        'name',
        'user_id',
        'layout',
    ];

    public function wedding(): BelongsTo
    {
        return $this->belongsTo(Wedding::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function venueLayer(): BelongsTo
    {
        return $this->belongsTo(VenueLayer::class);
    }

    protected function casts(): array
    {
        return [
            'layout' => 'array',
        ];
    }
}
