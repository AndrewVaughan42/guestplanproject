<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Venue;
use App\Models\VenueLayer;
use App\Models\Wedding;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;
use Nette\Utils\Random;

class WeddingFactory extends Factory
{
    protected $model = Wedding::class;

    public function definition(): array
    {
        return [
            'date' => Carbon::now()->addMonths(6),
            'partnerA_firstname' => $this->faker->firstName(),
            'partnerA_lastname' => $this->faker->lastName(),
            'partnerB_firstname' => $this->faker->firstName(),
            'partnerB_lastname' => $this->faker->lastName(),
            'user_id' => User::factory(),
            'venue_id' => Venue::factory(),
            'venue_layer_id' => VenueLayer::factory(),
        ];
    }
}
