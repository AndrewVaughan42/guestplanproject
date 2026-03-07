<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class MenuItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'venue_id',
        'name',
        'description',
        'is_plant_based',
    ];

    public function venue(): BelongsTo
    {
        return $this->belongsTo(Venue::class, 'venue_id');
    }

    public function weddings(): BelongsToMany
    {
        return $this->belongsToMany(Wedding::class, 'menu_item_wedding', 'menu_item_id', 'wedding_id');
    }

    protected function casts(): array
    {
        return [
            'is_plant_based' => 'boolean',
        ];
    }
}
