<?php

namespace Database\Factories;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class TaskFactory extends Factory
{
    protected $model = Task::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(),
            'status' => $this->faker->randomElement(['pending', 'completed', 'in_progress']),
            'due_date' => $this->faker->date(),
            'user_id' => User::factory(),
        ];
    }
}
