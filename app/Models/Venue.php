<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Venue extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'minimumTableAmount',
        'maximumTableAmount',
        'minimumCapacity',
        'maximumCapacity',
    ];

    public function venueLayers(): HasMany {
        return $this->hasMany(VenueLayer::class);
    }

    public function weddings(): HasMany
    {
        return $this->hasMany(Wedding::class);
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'venue_coordinators');
    }

    public function venueMenuItems(): HasMany
    {
        return $this->hasMany(MenuItem::class);
    }
}


