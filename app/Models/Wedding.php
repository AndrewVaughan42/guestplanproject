<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Wedding extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'venue_id',
        'venue_layer_id',
        'name',
        'date',
    ];

    public function venue(): BelongsTo
    {
        return $this->belongsTo(Venue::class);
    }

    public function venueLayer(): BelongsTo
    {
        return $this->belongsTo(VenueLayer::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function guests(): HasMany
    {
        return $this->hasMany(Guest::class);
    }

    public function seatplans(): HasMany
    {
        return $this->hasMany(Seatplan::class);
    }

    public function venueMenuItems(): BelongsToMany
    {
        return $this->belongsToMany(MenuItem::class, 'venue_menu_item_wedding', 'wedding_id', 'venue_menu_item_id');
    }

    protected function casts(): array
    {
        return [
            'date' => 'date',
        ];
    }
}
