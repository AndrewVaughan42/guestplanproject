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
            'name' => $this->faker->word() . ' Seatplan',
            'layout' => [],
            'wedding_id' => Wedding::factory(),
            'user_id' => User::factory(),
            'venue_layer_id' => \App\Models\VenueLayer::factory(),
        ];
    }
}
