<?php

use App\Http\Controllers\GroupController;
use App\Http\Controllers\GuestConflictsController;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\MenuItemController;
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
                //All Venues for now
            ]);
    })->name('dashboard');

    //Renders task-list page via index
    Route::resource('tasks', TaskController::class)->except('show');

    //Check if needed?
    Route::resource('weddings', WeddingController::class);

    //Renders guest-manager page via index, + additional post-route for importing guests via list
    Route::resource('guests', GuestController::class);
    Route::post('guests/import', [GuestController::class, 'bulkStore'])->name('guests.import');

    //Renders Group Management via Index
    Route::resource('groups', GroupController::class);

    //Renders Conflicts page via index
    Route::post('groups/{group}/guests', [GroupController::class, 'attachGuest'])->name('groups.guests.attach');
    Route::delete('groups/{group}/guests', [GroupController::class, 'detachGuest'])->name('groups.guests.detach');
    Route::resource('conflicts', GuestConflictsController::class);

    //Meal Choices, no Page, part of Venue Management
    Route::resource('menu-items', MenuItemController::class);

    //Renders seat plan page via index
    Route::resource('seat-plans', SeatplanController::class);

    //Admin-only routes
    Route::middleware(['CheckAdmin'])->group(function () {

        Route::resource('venues', VenueController::class);
        Route::resource('venue-layers', VenueLayerController::class);
    });
});
require __DIR__.'/settings.php';
