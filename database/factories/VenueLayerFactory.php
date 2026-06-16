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
            'name' => $this->faker->word() . ' Layer',
            'table_data' => [],
            'venue_id' => Venue::factory(),
            'user_id' => \App\Models\User::factory(),
        ];
    }
}
