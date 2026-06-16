<?php

namespace Database\Factories;

use App\Models\Venue;
use App\Models\MenuItem;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class MenuItemFactory extends Factory
{
    protected $model = MenuItem::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(),
            'is_plant_based' => $this->faker->boolean(),
            'venue_id' => Venue::factory(),
        ];
    }
}
