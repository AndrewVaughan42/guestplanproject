<?php

namespace Database\Factories;

use App\Models\Group;
use App\Models\Wedding;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class GroupFactory extends Factory
{
    protected $model = Group::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'priority' => $this->faker->numberBetween(1, 10),
            'description' => $this->faker->sentence(),
            'colour' => $this->faker->safeColorName(),
            'wedding_id' => Wedding::factory(),
        ];
    }
}
