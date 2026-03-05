<?php

namespace Database\Factories;

use App\Models\Venue;
use App\Models\MenuItem;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class MenuFactory extends Factory
{
    protected $model = MenuItem::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'description' => $this->faker->text(),
            'is_plant_based' => $this->faker->boolean(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),

            'venue_id' => Venue::factory(),
        ];
    }
}
