<?php

use App\Http\Controllers\GuestController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\VenueController;
use App\Http\Controllers\WeddingController;
use App\Models\Venue;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

//The Welcome Page
Route::get('/', static function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

//User Routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', static function () {
            return Inertia::render('user/dashboard', [
                'venues' => Venue::all(),
            ]);
    })->name('dashboard');

    Route::resource('tasks', TaskController::class)->except('show');
    Route::resource('weddings', WeddingController::class);


    Route::get('guest-manager', static function () {
        return Inertia::render('user/guest-manager');
    })->name('guest-manager');
    Route::resource('guests', GuestController::class);

    Route::get('seat-plan', static function () {
        return Inertia::render('user/seat-plan');
    })->name('seat-plan');

    //Admin-only routes
    Route::middleware(['CheckAdmin'])->group(function () {
        Route::get('venue-manager', static function () {
            return Inertia::render('admin/venue-manager');
        })->name('venue-manager');
        Route::resource('venues', VenueController::class);

        Route::get('layout-editor', static function () {
            return Inertia::render('admin/layout-editor');
        })->name('layout-editor');
    });
});
require __DIR__.'/settings.php';
