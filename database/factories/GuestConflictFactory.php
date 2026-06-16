<?php

namespace Database\Factories;

use App\Models\Guest;
use App\Models\GuestConflict;
use App\Models\Wedding;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class GuestConflictFactory extends Factory
{
    protected $model = GuestConflict::class;

    public function definition(): array
    {
        return [
            'wedding_id' => Wedding::factory(),
            'guest_a_id' => Guest::factory(),
            'guest_b_id' => Guest::factory(),
            'conflict_reason' => $this->faker->sentence(),
        ];
    }
}
