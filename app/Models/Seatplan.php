<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Seatplan extends Model
{
    use HasFactory;

    public function wedding(): BelongsTo
    {
        return $this->belongsTo(Wedding::class);
    }

    protected function casts(): array
    {
        return [
            'Layout' => 'array',
        ];
    }
}
