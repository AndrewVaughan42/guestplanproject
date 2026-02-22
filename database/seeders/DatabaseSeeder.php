<?php

namespace Database\Seeders;

use App\Models\User;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Venue;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        //Admin Account For Testing
        User::firstOrCreate(
            ['email' => 'andrew@laravel.com'],
            [
                'name' => 'Andrew Vaughan',
                'password' => 'qwertyuiop',
                'email_verified_at' => now(),
                'isAdmin' => true
            ]
        );
        //User Account For Testing
        User::firstOrCreate(
            ['email' => 'user@laravel.com'],
            [
                'name' => 'Ube Serr',
                'password' => 'asdfghjkl',
                'email_verified_at' => now(),
                'isAdmin' => false
            ]
        );


    }
}
