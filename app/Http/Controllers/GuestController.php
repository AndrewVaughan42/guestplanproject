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
            'guests' => Guest::where('wedding_id', request('wedding_id'))->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required'],
            'wedding_id' => ['required', 'exists:weddings'],
            'mealChoice' => ['nullable'],
            'notes' => ['nullable'],
        ]);

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
            'wedding_id' => ['required', 'exists:weddings'],
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
