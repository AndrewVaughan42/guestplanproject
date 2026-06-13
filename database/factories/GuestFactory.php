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
            'name' => $this->faker->name(),
            'menu_item_id' => MenuItem::factory(),
            'notes' => $this->faker->sentence(),
            'status' => GuestStatus::INVITED->value,
            'role' => GuestRole::NORMAL->value,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),

            'wedding_id' => Wedding::factory(),
        ];
    }
}
