<?php

namespace App\Http\Controllers;

use App\Models\Venue;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VenueController extends Controller
{
    public function index()
    {
        $venues = Venue::whereHas('users', function ($query) {
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

        $venue->users()->attach(auth()->id());

        return redirect()->back()->with('flash', [
            'type' => 'success',
            'message' => 'Venue created successfully.'
            ]);
    }

    public function show(Venue $venue)
    {
        if (!$venue->users()->where('user_id', auth()->id())->exists()) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'message' => 'You are not authorized to view this venue.',
            ]);
        }
        return $venue;
    }

    public function update(Request $request, Venue $venue)
    {
        if (!$venue->users()->where('user_id', auth()->id())->exists()) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'message' => 'You are not authorized to edit this venue.',
            ]);
        }

        $data = $request->validate([
            'name' => ['required'],
            'minimumTableAmount' => ['required', 'integer'],
            'maximumTableAmount' => ['required'],
            'minimumCapacity' => ['required', 'integer'],
            'maximumCapacity' => ['required'],
        ]);

        $venue->update($data);

        return redirect()->back()->with('flash', [
            'type' => 'success',
            'message' => 'Venue updated successfully.'
        ]);
    }

    public function destroy(Venue $venue)
    {
        if (!$venue->users()->where('user_id', auth()->id())->exists()) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'message' => 'You are not authorized to delete this venue.',
            ]);
        }

        $venue->delete();

        return response()->json();
    }
}
