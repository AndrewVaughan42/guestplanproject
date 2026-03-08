<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GuestConflict extends Model
{
    use HasFactory;

    protected $fillable = [
        'guest_a_id',
        'guest_b_id',
        'wedding_id',
    ];

    public function guestA(): BelongsTo
    {
        return $this->belongsTo(Guest::class, 'guest_a_id');
    }

    public function guestB(): BelongsTo
    {
        return $this->belongsTo(Guest::class, 'guest_b_id');
    }

    public function wedding(): BelongsTo
    {
        return $this->belongsTo(Wedding::class);
    }
}
