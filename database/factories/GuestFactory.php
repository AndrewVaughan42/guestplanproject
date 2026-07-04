<?php

namespace Database\Factories;

use App\GuestRole;
use App\GuestStatus;
use App\Models\Guest;
use App\Models\MenuItem;
use App\Models\Wedding;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class GuestFactory extends Factory
{
    protected $model = Guest::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->firstName() . ' ' . $this->faker->lastName(),
            'notes' => $this->faker->sentence(),
            'status' => GuestStatus::INVITED->value,
            'role' => \App\GuestRole::NORMAL->value,
            'wedding_id' => Wedding::factory(),
            'menu_item_id' => null,
        ];
    }
}
