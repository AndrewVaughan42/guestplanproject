<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Guest extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'wedding_id',
        'menu_item_id',
        'notes',
    ];

    public function wedding(): BelongsTo
    {
        return $this->belongsTo(Wedding::class);
    }

    public function menuItem(): BelongsTo
    {
        return $this->belongsTo(MenuItem::class);
    }

    public function groups(): BelongsToMany
    {
        return $this->belongsToMany(Group::class, 'group_guest', 'guest_id', 'group_id');
    }

    public function conflictAsA(): HasMany {
        return $this->hasMany(Guest::class, 'guest_conflict', 'guest_a_id');
    }

    public function conflictAsB(): HasMany {
        return $this->hasMany(Guest::class, 'guest_conflict', 'guest_a_id');
    }

    public function conflictWith() {
        return $this->conflictAsA->merge($this->conflictAsB);
    }
}
