<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Wedding extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'venue_id',
        'venue_layer_id',
        'partnerA_firstname',
        'partnerA_lastname',
        'partnerB_firstname',
        'partnerB_lastname',
        'date',
        'name',
        'priority',
        'description',
        'colour',
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

    public function groups(): HasMany
    {
        return $this->hasMany(Group::class);
    }

    public function seatplan(): HasOne
    {
        return $this->hasOne(Seatplan::class);
    }

    public function menuItems(): BelongsToMany
    {
        return $this->belongsToMany(MenuItem::class, 'menu_item_wedding', 'wedding_id', 'menu_item_id');
    }

    public function guestConflicts(): HasMany
    {
        return $this->hasMany(GuestConflict::class);
    }

    protected function casts(): array
    {
        return [
            'date' => 'date',
        ];
    }
}
