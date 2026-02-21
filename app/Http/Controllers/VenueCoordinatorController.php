<?php

namespace App\Http\Controllers;

use App\Models\VenueCoordinator;
use Illuminate\Http\Request;

class VenueCoordinatorController extends Controller
{
    public function index()
    {
        return VenueCoordinator::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'venue_id' => ['required', 'exists:venues'],
            'user_id' => ['required', 'exists:users'],
        ]);

        return VenueCoordinator::create($data);
    }

    public function show(VenueCoordinator $venueCoordinator)
    {
        return $venueCoordinator;
    }

    public function update(Request $request, VenueCoordinator $venueCoordinator)
    {
        $data = $request->validate([
            'venue_id' => ['required', 'exists:venues'],
            'user_id' => ['required', 'exists:users'],
        ]);

        $venueCoordinator->update($data);

        return $venueCoordinator;
    }

    public function destroy(VenueCoordinator $venueCoordinator)
    {
        $venueCoordinator->delete();

        return response()->json();
    }
}
