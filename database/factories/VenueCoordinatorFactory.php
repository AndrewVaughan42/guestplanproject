<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Venue;
use App\Models\VenueCoordinator;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class VenueCoordinatorFactory extends Factory
{
    protected $model = VenueCoordinator::class;

    public function definition(): array
    {
        return [
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),

            'venue_id' => Venue::factory(),
            'user_id' => User::factory(),
        ];
    }
}
