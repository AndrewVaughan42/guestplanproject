<?php

use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

//Welcome Page
Route::get('/', static function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

//User Routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', static function () {
            return Inertia::render('user/Dashboard');
    })->name('dashboard');

    Route::resource('tasks', TaskController::class);

    Route::get('guest-manager', static function () {
        return Inertia::render('user/GuestManager');
    })->name('guest-manager');

    Route::get('seat-plan', static function () {
        return Inertia::render('user/Seatplan');
    })->name('seat-plan');

    //Admin-only routes
    Route::middleware(['auth', 'verified', 'CheckAdmin'])->group(function () {
        Route::get('admin-dashboard', static function () {
            return Inertia::render('admin/AdminDashboard');
        })->name('admin-dashboard');
        Route::get('venue-manager', static function () {
            return Inertia::render('admin/VenueManager');
        })->name('venue-manager');
        Route::get('layout-editor', static function () {
            return Inertia::render('admin/LayoutEditor');
        })->name('layout-editor');
    });
});
require __DIR__.'/settings.php';
