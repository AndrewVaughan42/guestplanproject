<?php

namespace App\Http\Controllers;

use App\Models\VenueLayer;
use Illuminate\Http\Request;

class VenueLayerController extends Controller
{
    public function index()
    {
        return VenueLayer::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'venue_id' => ['required', 'exists:venues'],
            'tableAmount' => ['required', 'integer'],
            'tableLayout' => ['required'],
        ]);

        return VenueLayer::create($data);
    }

    public function show(VenueLayer $venueLayer)
    {
        return $venueLayer;
    }

    public function update(Request $request, VenueLayer $venueLayer)
    {
        $data = $request->validate([
            'venue_id' => ['required', 'exists:venues'],
            'tableAmount' => ['required', 'integer'],
            'tableLayout' => ['required'],
        ]);

        $venueLayer->update($data);

        return $venueLayer;
    }

    public function destroy(VenueLayer $venueLayer)
    {
        $venueLayer->delete();

        return response()->json();
    }
}
