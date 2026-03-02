<?php

namespace App\Http\Controllers;

use App\Models\Venue;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VenueController extends Controller
{
    public function index()
    {
        $venues = Venue::whereHas('venueCoordinators', function ($query) {
            $query->where('user_id', auth()->id());
        })->with('venueMenuItems')->get();
        return Inertia::render('admin/venue-manager', [
            'venues' => $venues,
        ]);

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

        return redirect()->back()->with('success', 'Venue created successfully.');
    }

    public function show(Venue $venue)
    {
        if (!auth()->user()->venues->contains($venue->id)) {
            abort(403);
        }
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
