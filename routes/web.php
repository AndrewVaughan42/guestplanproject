<?php

use App\Http\Controllers\AdminWeddingController;
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
use App\Models\Wedding;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

//The Welcome Page
Route::get('/', static function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');
//Renders task-list page via index


//User Routes
Route::middleware(['auth', 'verified'])->group(function () {

    //Shared pge access
    Route::get('dashboard', static function () {
        $user = auth()->user();
        if ($user->isAdmin) {
            $weddings = Wedding::with('venue')->whereHas('venue.users', function ($query) use ($user) {
                $query->where('users.id', $user->id);
            })->whereDate('date', '>=', now())->orderBy('date')->take(5)->get();
            return Inertia::render('user/dashboard', [
                'upcomingWeddings' => $weddings,
            ]);
        }
        return Inertia::render('user/dashboard', [
            'venues' => $user->wedding ? [] : Venue::all(),
        ]);
    })->name('dashboard');

    Route::resource('weddings', WeddingController::class);
    Route::resource('tasks', TaskController::class)->except('show');

    Route::middleware(['CheckClient'])->group(function () {

        //Renders guest-manager page via index, + additional post-routes for importing guests via list and updating guest statuses
        Route::resource('guests', GuestController::class);
        Route::post('guests/import', [GuestController::class, 'bulkStore'])->name('guests.import');
        Route::patch('guests/{guest}/status', [GuestController::class, 'updateStatus'])->name('guests.updateStatus');


        //Renders Group Management via Index
        Route::resource('groups', GroupController::class);

        //Group routes
        Route::post('groups/{group}/guests', [GroupController::class, 'attachGuest'])->name('groups.guests.attach');
        Route::delete('groups/{group}/guests', [GroupController::class, 'detachGuest'])->name('groups.guests.detach');
        Route::patch('groups/{group}/sync', [GroupController::class, 'syncGuests'])->name('groups.syncGuests');
        Route::patch('groups/{group}/move', [GroupController::class, 'move'])->name('groups.move');

        //Renders Conflicts page via index
        Route::resource('conflicts', GuestConflictsController::class);

        //Meal Choices, no Page, part of Venue Management
        Route::resource('menu-items', MenuItemController::class);

        //Renders seat plan page via index
        Route::resource('seat-plans', SeatplanController::class)->only('index', 'update');
        Route::post('seat-plans/{seat_plan}/auto-seat', [SeatplanController::class, 'autoSeat'])->name('seat-plans.autoSeat');
    });

    //Admin-only routes
    Route::middleware(['CheckAdmin'])->group(function () {
        //Venue Manager page + routes
        Route::resource('venues', VenueController::class);
        // Layer Editor page + routes
        Route::resource('venue-layers', VenueLayerController::class);
        //Wedding Summary pages + routes
        Route::get('admin/weddings', [AdminWeddingController::class, 'index'])->name('admin-weddings.index');
        Route::get('admin/weddings/{wedding}', [AdminWeddingController::class, 'show'])->name('admin-weddings.show');
        Route::get('admin/weddings/{wedding}/export-pdf', [AdminWeddingController::class, 'export'])->name('admin-weddings.export');

    });
});
require __DIR__.'/settings.php';
