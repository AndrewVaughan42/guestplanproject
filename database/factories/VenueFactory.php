<?php

namespace Database\Factories;

use App\Models\Venue;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class VenueFactory extends Factory
{
    protected $model = Venue::class;

    public function definition(): array
    {
        $minCap = $this->faker->numberBetween(20, 30);
        $maxCap = $this->faker->numberBetween(60, 100);
        $minTables = $this->faker->numberBetween(5, 10);
        $maxTables = $this->faker->numberBetween(15, 20);
        return [
            'name' => $this->faker->company(),
            'minimum_capacity' => $minCap,
            'maximum_capacity' => $maxCap,
            'minimum_table_amount' => $minTables,
            'maximum_table_amount' => $maxTables,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ];
    }
}
