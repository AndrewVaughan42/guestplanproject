<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use Illuminate\Http\Request;

class GuestController extends Controller
{
    public function index()
    {
        return Guest::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required'],
            'wedding_id' => ['required', 'exists:weddings'],
            'mealChoice' => ['required'],
            'notes' => ['nullable'],
        ]);

        return Guest::create($data);
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
            'mealChoice' => ['required'],
            'notes' => ['nullable'],
        ]);

        $guest->update($data);

        return $guest;
    }

    public function destroy(Guest $guest)
    {
        $guest->delete();

        return response()->json();
    }
}
