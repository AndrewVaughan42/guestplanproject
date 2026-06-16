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
        $minCap = $this->faker->numberBetween(20, 50);
        $maxCap = $this->faker->numberBetween($minCap + 10, 200);
        $minTables = $this->faker->numberBetween(5, 10);
        $maxTables = $this->faker->numberBetween($minTables + 5, 30);
        return [
            'name' => $this->faker->company() . ' Venue',
            'minimum_capacity' => $minCap,
            'maximum_capacity' => $maxCap,
            'minimum_table_amount' => $minTables,
            'maximum_table_amount' => $maxTables,
        ];
    }
}
