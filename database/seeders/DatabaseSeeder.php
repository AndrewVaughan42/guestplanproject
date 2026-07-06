<?php

namespace Database\Seeders;

use App\GuestRole;
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

        $emptyUser = User::firstOrCreate(
            ['email' => 'empty@laravel.com'],
            [
                'name' => 'Andrew Vaughan',
                'password' => Hash::make('qwertyuiop'),
                'email_verified_at' => now(),
                'isAdmin' => false
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
            ['name' => 'Roast Beef', 'description' => 'Roasted Beef, with a side of veg', 'is_plant_based' => false],
            ['name' => 'Chicken Casserole', 'description' => 'Chicken Casserole, recommended by the Chef', 'is_plant_based' => false],
            ['name' => 'Tofu', 'description' => "It's Tofu!", 'is_plant_based' => true],
        ])->map(fn ($item) => MenuItem::firstOrCreate(
            ['venue_id' => $fh->id, 'name' => $item['name']],
            ['description' => $item['description'], 'is_plant_based' => $item['is_plant_based'],]
        ));

        $tableData = [
            // Top Table first
            [
                'id' => "venue-{$fh->id}-top-1",
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

        for ($i = 1; $i <= $maxTables - 1; $i++) {
            $tableData[] = [
                'id' => "round-{$i}"    ,
                'type' => 'round',
                'name' => 'Table ' . $i,
                'x' => 150 + (($i - 1) % 3) * 325,
                'y' => 350 + floor(($i - 1) / 3) * 325,
                'rotation' => 0,
                'seat_count' => 8,
                'seat_minimum' => 6,
                'seat_maximum' => 10,
                'locked' => true,
            ];
        }

        $venueLayer = VenueLayer::updateOrCreate(
            ['name' => 'Fairyhill - 11 Tables', 'venue_id' => $fh->id],
            [
                'user_id' => $adminUser->id,
                'table_data' => $tableData
            ]
        );

        $tableData2 = [
            // Top Table first
            [
                'id' => "venue-{$fh->id}-top-1",
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

        for ($i = 1; $i <= $maxTables; $i++) {
            $tableData2[] = [
                'id' => "round-{$i}",
                'type' => 'round',
                'name' => 'Table ' . $i,
                'x' => 150 + (($i - 1) % 3) * 325,
                'y' => 350 + floor(($i - 1) / 3) * 325,
                'rotation' => 0,
                'seat_count' => 8,
                'seat_minimum' => 6,
                'seat_maximum' => 10,
                'locked' => true,
            ];
        }

        $venueLayer = VenueLayer::updateOrCreate(
            ['name' => 'Fairyhill - 12 Tables', 'venue_id' => $fh->id],
            [
                'user_id' => $adminUser->id,
                'table_data' => $tableData2
            ]
        );

        $tableData3 = [
            // Top Table first
            [
                'id' => "venue-{$fh->id}-top-1",
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

        for ($i = 1; $i <= $maxTables + 1; $i++) {
            $tableData3[] = [
                'id' => "round-{$i}",
                'type' => 'round',
                'name' => 'Table ' . $i,
                'x' => 150 + (($i - 1) % 3) * 325,
                'y' => 350 + floor(($i - 1) / 3) * 325,
                'rotation' => 0,
                'seat_count' => 8,
                'seat_minimum' => 6,
                'seat_maximum' => 10,
                'locked' => true,
            ];
        }

        $venueLayer = VenueLayer::updateOrCreate(
            ['name' => 'Fairyhill - 13 Tables', 'venue_id' => $fh->id],
            [
                'user_id' => $adminUser->id,
                'table_data' => $tableData3
            ]
        );


        //User Wedding
        $userWedding = Wedding::firstOrCreate(
            ['user_id' => $regularUser->id],
            [
                'venue_id' => $fh->id,
                'partnerA_firstname' => 'Ube',
                'partnerA_lastname' => 'Serr',
                'partnerB_firstname' => 'Ada',
                'partnerB_lastname' => 'Minn',
                'date' => now()->addMonths(3),
            ]
        );


        $userWedding->menuItems()->sync($menuItems->all());

        $partnerA = Guest::create([
            'name' => $userWedding->partnerA_firstname . ' ' . $userWedding->partnerA_lastname,
            'wedding_id' => $userWedding->id,
            'status' => GuestStatus::CONFIRMED,
            'role' => GuestRole::PARTNER_A->value,
            'menu_item_id' => $userWedding->menuItems->random()->id,
        ]);

        $partnerB = Guest::create([
            'name' => $userWedding->partnerB_firstname . ' ' . $userWedding->partnerB_lastname,
            'wedding_id' => $userWedding->id,
            'status' => GuestStatus::CONFIRMED,
            'role' => GuestRole::PARTNER_B->value,
            'menu_item_id' => $userWedding->menuItems->random()->id,
        ]);


        //Create Groups
        $names = collect([
            'Family (Partner A)',
            'Family (Partner B)',
            'Bridesmaids',
            'Groomsmen',
            'Friends of Partner A',
            'Friends of Partner B',
        ]);

        $rankings = collect(range(1, $names->count()))
            ->shuffle(); // ensures unique rankings

        $groups = $names->map(function ($name) use ($regularUser, &$rankings) {
            return Group::firstOrCreate(
                [
                    'wedding_id' => $regularUser->wedding->id,
                    'name' => $name,
                ],
                [
                    'ranking' => $rankings->pop(),
                    'colour' => fake()->hexColor(),
                    'description' => null,
                ]
            );
        });


        //Create Guests
        $guests = [];
        for ($i = 0; $i < 98; $i++) {
            $guests[] = Guest::create([
                'name' => fake()->firstName() . ' ' . fake()->lastName(),
                'wedding_id' => $regularUser->wedding->id,
                'status' =>  GuestStatus::CONFIRMED,
                'menu_item_id' => $userWedding->menuItems->random()->id,
                'role' => GuestRole::NORMAL->value,
                'notes' => (random_int(1, 5) === 1 ? fake()->sentence() : null)
            ]);
        }

        //Guests in Groups
        foreach ($guests as $guest) {

            // 0–2 groups per guest (tweak as needed)
            $groupCount = match (true) {
                $guest->role !== GuestRole::NORMAL->value => 1,
                default => fake()->numberBetween(1, 3),
            };

            $selectedGroups = $groups->random($groupCount);

            foreach ($selectedGroups as $group) {
                $guest->groups()->attach($group->id);
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
