<?php

namespace Database\Seeders;

use App\GuestStatus;
use App\Models\Group;
use App\Models\Guest;
use App\Models\GuestConflict;
use App\Models\MenuItem;
use App\Models\User;
use App\Models\VenueLayer;
use App\Models\Wedding;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Venue;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();


        //Admin Account For Testing
        $adminUser = User::firstOrCreate(
            ['email' => 'andrew@laravel.com'],
            [
                'name' => 'Andrew Vaughan',
                'password' => Hash::make('qwertyuiop'),
                'email_verified_at' => now(),
                'isAdmin' => true
            ]
        );

        $sfh = Venue::firstOrCreate(
            ['name' => 'Sant Ffraed House'],
            [
                'minimum_table_amount' => 1,
                'maximum_table_amount' => 10,
                'minimum_capacity' => 1,
                'maximum_capacity' => 100,
            ]
        );



        //User Account For Testing
        $regularUser = User::firstOrCreate(
            ['email' => 'user@laravel.com'],
            [
                'name' => 'Ube Serr',
                'password' => Hash::make('asdfghjkl'),
                'email_verified_at' => now(),
                'isAdmin' => false
            ]
        );
        //Setting up Fairyhill and User full of fake data
        //Set up Fairyhill
        //Venue Params for easy testing
        $minTables = 3;
        $maxTables = 12;
        $minCapacity = 30;
        $maxCapacity = 100;

        $fh = Venue::firstOrCreate(
            ['name' => 'Fairyhill'],
            [
                'minimum_table_amount' => $minTables,
                'maximum_table_amount' => $maxTables,
                'minimum_capacity' => $minCapacity,
                'maximum_capacity' => $maxCapacity,
            ]
        );

        $adminUser->venues()->syncWithoutDetaching([$fh->id, $sfh->id]);

        $menuItems = collect([
            ['name' => 'Bread', 'description' => 'Baked bread, easy on the dough', 'is_plant_based' => false],
            ['name' => 'Roast Beef', 'description' => 'Roasted Beef, with a side of veg', 'is_plant_based' => false],
            ['name' => 'Chicken Casserole', 'description' => 'Chicken Casserole, recommended by the Chef', 'is_plant_based' => false],
            ['name' => 'Tofu', 'description' => "It's Tofu!", 'is_plant_based' => true],
            ['name' => 'Caesar Salad', 'description' => 'For those who long for the forest', 'is_plant_based' => true],
            ['name' => 'Fish and Chips', 'description' => 'Fish and Chips, with a side of chips', 'is_plant_based' => false],
            ['name' => 'Gravlax', 'description' => 'Salmon, cured in salt and sugar', 'is_plant_based' => false],
        ])->map(fn ($item) => MenuItem::firstOrCreate(
            ['venue_id' => $fh->id, 'name' => $item['name']],
            ['description' => $item['description'], 'is_plant_based' => $item['is_plant_based'],]
        ));

        $tableData = [
            // Top Table first
            [
                'id' => Str::uuid(),
                'type' => 'top',
                'name' => 'Top Table',
                'x' => 475,
                'y' => 100,
                'rotation' => 0,
                'seats_per_side' => 4,
                'seat_minimum' => 8,
                'locked' => true,
            ],
        ];

        // 12 Round Tables
        for ($i = 1; $i <= $maxTables; $i++) {
            $tableData[] = [
                'id' => Str::uuid(),
                'type' => 'round',
                'name' => 'Table ' . $i,
                'x' => 150 + (($i - 1) % 3) * 325,
                'y' => 350 + floor(($i - 1) / 3) * 325,
                'rotation' => 0,
                'seat_count' => 10,
                'seat_minimum' => 6,
                'locked' => true,
            ];
        }

        $venueLayer = VenueLayer::updateOrCreate(
            ['name' => 'Fairyhill Standard Layout', 'venue_id' => $fh->id],
            [
                'user_id' => $adminUser->id,
                'table_data' => $tableData
            ]
        );

        $userWedding = Wedding::firstOrCreate(
            ['user_id' => $regularUser->id],
            [
                'venue_id' => $fh->id,
                'partnerA_firstname' => 'Ube',
                'partnerA_lastname' => 'Serr',
                'partnerB_firstname' => 'Ada',
                'partnerB_lastname' => 'Minn',
                'date' => now()->addMonths(6),
            ]
        );

        $userWedding->menuItems()->sync($menuItems->pluck('id'));

        //Create Groups
        $groups = collect(['Family (Partner A)', 'Family (Partner B)', 'Bridsmaids', 'Groomsmen', 'Friends of Partner A', 'Friends of Partner B'])->map(fn ($name) => Group::firstOrCreate(
                ['wedding_id' => $regularUser->wedding->id, 'name' => $name, 'priority' => random_int(4, 10)],
            ));
        //Create Guests
        $guests = [];
        for ($i = 0; $i < 80; $i++) {
            $guests[] = Guest::create([
                'name' => fake()->name(),
                'wedding_id' => $regularUser->wedding->id,
                'status' =>  GuestStatus::CONFIRMED,
                'menu_item_id' => $userWedding->menuItems->random()->id,
                'notes' => (random_int(1, 5) === 1 ? fake()->sentence() : null)
            ]);
        }

        //Guests in Groups
        foreach ($guests as $index => $guest) {
            if ($index < 60) {
                $guest->groups()->attach($groups->random()->id);
            }
        }

        //Conflicts
        for ($i = 0; $i < 7; $i++) {
            $guestA = $guests[random_int(0, count($guests)/2)];
            $guestB = $guests[random_int(0, count($guests)/2)];
            if ($guestA->id !== $guestB->id) {
                GuestConflict::create([
                    'guest_a_id' => $guestA->id,
                    'guest_b_id' => $guestB->id,
                    'wedding_id' => $regularUser->wedding->id,
                    'conflict_reason' => fake()->sentence(),
                ]);
            }
        }

    }
}
