<?php

namespace Database\Factories;

use App\Models\Venue;
use App\Models\VenueLayer;
use App\Models\Wedding;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class WeddingFactory extends Factory
{
    protected $model = Wedding::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'date' => Carbon::now(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),

            'venue_id' => Venue::factory(),
            'venue_layer_id' => VenueLayer::factory(),
        ];
    }
}
