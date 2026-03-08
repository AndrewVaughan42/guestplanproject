<?php

namespace Database\Factories;

use App\Models\Guest;
use App\Models\GuestConflict;
use App\Models\Wedding;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class GuestConflictsFactory extends Factory
{
    protected $model = GuestConflict::class;

    public function definition(): array
    {
        return [
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),

            'guest_a_id' => Guest::factory(),
            'guest_b_id' => Guest::factory(),
            'wedding_id' => Wedding::factory(),
        ];
    }
}
