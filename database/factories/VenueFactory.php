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
        $minNum = $this->faker->numberBetween(20, 30);
        $maxNum = $this->faker->numberBetween(60, 100);
        return [
            'name' => $this->faker->name(),
            'minimumCapacity' => $minNum,
            'maximumCapacity' => $maxNum,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ];
    }
}
