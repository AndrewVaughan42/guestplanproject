<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GuestController extends Controller
{
    public function index()
    {
        $wedding = auth()->user()->wedding;

        if (!$wedding) {
            return redirect()->route('dashboard')->with('flash', [
                'type' => 'error',
            'message' => 'Please set up your wedding first.'
            ]);
        }

        return Inertia::render('user/guest-manager', [
            'guests' => $wedding->guests,
        ]);
    }

    public function store(Request $request)
    {
        $wedding = auth()->user()->wedding;

        if (!$wedding) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'message' => 'Please set up your wedding first.'
            ]);
        }

        $data = $request->validate([
            'name' => ['required'],
            'mealChoice' => ['nullable'],
            'notes' => ['nullable'],
        ]);

        $data['wedding_id'] = $wedding->id;

        Guest::create($data);
        return redirect()->back()->with('flash', [
            'type' => 'success',
            'message' => 'Guest created successfully.'
        ]);
    }

    public function show(Guest $guest)
    {
        return $guest;
    }

    public function update(Request $request, Guest $guest)
    {
        $data = $request->validate([
            'name' => ['required'],
            'mealChoice' => ['nullable'],
            'notes' => ['nullable'],
        ]);

        $guest->update($data);

        return redirect()->back()->with('flash', [
            'type' => 'success',
            'message' => 'Guest updated successfully.'
        ]);
    }

    public function destroy(Guest $guest)
    {
        $guest->delete();

        return redirect()->back()->with('flash', [
            'type' => 'success',
            'message' => 'Guest deleted successfully.'
        ]);
    }
}
