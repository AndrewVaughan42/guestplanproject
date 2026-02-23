<?php

use App\Http\Controllers\GuestController;
use App\Http\Controllers\SeatplanController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\VenueController;
use App\Http\Controllers\VenueLayerController;
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

    //Renders task-list page
    Route::resource('tasks', TaskController::class)->except('show');
    //Check if needed?
    Route::resource('weddings', WeddingController::class);
    //Renders guest-manager page
    Route::resource('guests', GuestController::class);

    Route::resource('seat-plans', SeatplanController::class);



    //Admin-only routes
    Route::middleware(['CheckAdmin'])->group(function () {

        Route::resource('venues', VenueController::class)->names('venues');
        Route::resource('venue-layers', VenueLayerController::class);
    });
});
require __DIR__.'/settings.php';
