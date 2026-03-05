<?php

namespace App\Http\Controllers;

use App\Models\Venue;
use App\Models\VenueLayer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VenueLayerController extends Controller
{
    public function index()
    {
        $venueLayers = VenueLayer::whereHas('venue.users', function ($query) {
            $query->where('user_id', auth()->id());
        })->get();

        return Inertia::render('admin/layout-editor', [
            'venueLayers' => $venueLayers,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'venue_id' => ['required', 'exists:venues,id'],
            'tableAmount' => ['required', 'integer'],
            'tableLayout' => ['required'],
        ]);

        $venue = Venue::findOrFail($data['venue_id']);
        if (!$venue->users()->where('user_id', auth()->id())->exists()) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'message' => 'You are not authorized to create layers for this venue.',
            ]);
        }

        return VenueLayer::create($data);
    }

    public function show(VenueLayer $venueLayer)
    {
        if (!$venueLayer->venue->users()->where('user_id', auth()->id())->exists()) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'message' => 'You are not authorized to view this venue layer.',
            ]);
        }
        return $venueLayer;
    }

    public function update(Request $request, VenueLayer $venueLayer)
    {
        if (!$venueLayer->venue->users()->where('user_id', auth()->id())->exists()) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'message' => 'You are not authorized to edit this venue layer.',
            ]);
        }

        $data = $request->validate([
            'venue_id' => ['required', 'exists:venues,id'],
            'tableAmount' => ['required', 'integer'],
            'tableLayout' => ['required'],
        ]);

        $venueLayer->update($data);

        return $venueLayer;
    }

    public function destroy(VenueLayer $venueLayer)
    {
        if (!$venueLayer->venue->users()->where('user_id', auth()->id())->exists()) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'message' => 'You are not authorized to delete this venue layer.',
            ]);
        }

        $venueLayer->delete();

        return response()->json();
    }
}
