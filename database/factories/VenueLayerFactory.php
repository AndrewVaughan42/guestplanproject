<?php

namespace Database\Factories;

use App\Models\Venue;
use App\Models\VenueLayer;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class VenueLayerFactory extends Factory
{
    protected $model = VenueLayer::class;

    public function definition(): array
    {
        return [
            'table_amount' => $this->faker->numberBetween(5, 20),
            'table_layout' => [],
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),

            'venue_id' => Venue::factory(),
            'user_id' => \App\Models\User::factory(),
        ];
    }
}
