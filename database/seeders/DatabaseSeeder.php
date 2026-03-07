<?php

namespace Database\Seeders;

use App\Models\User;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Venue;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

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

        $venue1 = Venue::firstOrCreate(
            ['name' => 'Fairyhill'],
            [
                'minimum_table_amount' => 1,
                'maximum_table_amount' => 10,
                'minimum_capacity' => 1,
                'maximum_capacity' => 100,
            ]
        );

        $venue2 = Venue::firstOrCreate(
            ['name' => 'Sant Ffraed House'],
            [
                'minimum_table_amount' => 1,
                'maximum_table_amount' => 10,
                'minimum_capacity' => 1,
                'maximum_capacity' => 100,
            ]
        );

        $adminUser->venues()->syncWithoutDetaching([$venue1->id, $venue2->id]);



    }
}
