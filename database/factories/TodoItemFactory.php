<?php

namespace Database\Factories;

use App\Models\TodoItem;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class TodoItemFactory extends Factory
{
    protected $model = TodoItem::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->text(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),

            'user_id' => User::factory(),
        ];
    }
}
