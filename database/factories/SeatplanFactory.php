<?php

namespace Database\Factories;

use App\Models\Seatplan;
use App\Models\User;
use App\Models\Wedding;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class SeatplanFactory extends Factory
{
    protected $model = Seatplan::class;

    public function definition(): array
    {
        return [
            'Layout' => $this->faker->words(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),

            'wedding_id' => Wedding::factory(),
            'user_id' => User::factory(),
        ];
    }
}
