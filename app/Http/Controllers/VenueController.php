<?php

namespace App\Http\Controllers;

use App\Models\Venue;
use Illuminate\Http\Request;

class VenueController extends Controller
{
    public function index()
    {
        return Venue::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required'],
            'minimumTableAmount' => ['required', 'integer'],
            'maximumTableAmount' => ['required'],
            'minimumCapacity' => ['required', 'integer'],
            'maximumCapacity' => ['required'],
        ]);

        $venue = Venue::create($data);

        $venue->venueCoordinators()->create(['user_id' => auth()->id()]);

        return $venue;
    }

    public function show(Venue $venue)
    {
        return $venue;
    }

    public function update(Request $request, Venue $venue)
    {
        $data = $request->validate([
            'name' => ['required'],
            'minimumTableAmount' => ['required', 'integer'],
            'maximumTableAmount' => ['required'],
            'minimumCapacity' => ['required', 'integer'],
            'maximumCapacity' => ['required'],
        ]);

        $venue->update($data);

        return $venue;
    }

    public function destroy(Venue $venue)
    {
        $venue->delete();

        return response()->json();
    }
}
