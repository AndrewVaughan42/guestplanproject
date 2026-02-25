<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GuestController extends Controller
{
    public function index()
    {
        return Inertia::render('user/guest-manager', [
            'guests' => auth()->user()->wedding->guests ?? [],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required'],
            'mealChoice' => ['nullable'],
            'notes' => ['nullable'],
        ]);

        $data['wedding_id'] = auth()->user()->wedding->id;

        Guest::create($data);
        return redirect()->back()->with('success', 'Guest created successfully.');
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

        return redirect()->back()->with('success', 'Guest updated successfully.');
    }

    public function destroy(Guest $guest)
    {
        $guest->delete();

        return redirect()->back()->with('success', 'Guest deleted successfully.');
    }
}
