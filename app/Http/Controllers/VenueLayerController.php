<?php

namespace App\Http\Controllers;

use App\Models\Venue;
use App\Models\VenueLayer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Validation\Rule;

class VenueLayerController extends Controller
{
    public function index(Request $request): Response // Return list of venue layouts for Venue
    {
        $venues = $this->getAuthVenues();

        $venueId = $request->query('venue_id');

        $selectedVenue = $venueId ? Venue::with('venueLayers')->find($venueId) : null;

        $layouts = $selectedVenue ? $selectedVenue->venueLayers->sortBy(fn($layer) => count($layer->table_data))->values() : [];

        return Inertia::render('admin/layout-editor', [
            'venues' => $venues,
            'layouts' => $layouts,
            'selectedVenue' => $selectedVenue,
            'layout' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        //Validate
        $data = $request->validate([
            'venue_id' => ['required', 'exists:venues,id'],
            'name' => ['nullable', 'string', 'max:255'],
            'table_data' => ['required', 'array'],
        ]);

        $venue = Venue::findOrFail($data['venue_id']);
        $this->authVenueCheck($venue);
        // Generate a unique name for the venue layer
        $tableCount = count($data['table_data']);
        $presetName = "{$venue->name} - {$tableCount} tables";

        $existingVenueLayer = $venue->venueLayers()->where('name', $presetName)->first();

        if ($existingVenueLayer) { // If a venue layer with the same name already exists, update it instead
            $existingVenueLayer->update([
                'table_data' => $data['table_data'],
                'user_id' => auth()->id(),
            ]);
            $venueLayer = $existingVenueLayer;
        } else {
            $venueLayer = $venue->venueLayers()->create([
                'user_id' => auth()->id(),
                'name' => $presetName,
                'table_data' => $data['table_data'],
            ]);

        }
        return redirect()
            ->route('venue-layers.show', $venueLayer)
            ->with('flash', [
                'type' => 'success',
                'message' => 'Venue Layer created successfully.'
            ]);

    }

    public function show(VenueLayer $venueLayer): Response
    {
        $this->authVenueLayerCheck($venueLayer);

        $layouts = $venueLayer-> venue->venueLayers->sortBy(fn($layer) => count($layer->table_data))->values();

        return Inertia::render('admin/layout-editor', [
            'venues' => $this->getAuthVenues(),
            'selectedVenue' => $venueLayer->venue,
            'layouts' => $layouts,
            'layout' => $venueLayer,
            'tables' => $venueLayer->table_data ?? [],
        ]);
    }

    public function update(Request $request, VenueLayer $venueLayer): RedirectResponse
    {
        $this->authVenueLayerCheck($venueLayer);

        $data = $request->validate([
            'venue_id' => ['required', 'exists:venues,id'],
            'table_data' => ['required', 'array'],
        ]);

        $tableCount = count($data['table_data']);
        $presetName = "{$venueLayer->venue->name} - {$tableCount} tables";
        $venue = $venueLayer->venue;

        $duplicateLayer = $venue->venueLayers()->where('name', $presetName)->where('id', '!=', $venueLayer->id)->first();

        if ($duplicateLayer) {
            $duplicateLayer->update([
                'table_data' => $data['table_data'],
            ]);
            $venueLayer->delete();
            $redirectLayer = $duplicateLayer;

        } else {
            $venueLayer->update([
                'table_data' => $data['table_data'],
                'name' => $presetName,
            ]);
            $redirectLayer = $venueLayer;
        }

        return redirect()->route('venue-layers.show', $redirectLayer)->with('flash', [
            'type' => 'success',
            'message' => 'Venue Layer updated successfully.',
        ]);
    }

    public function destroy(VenueLayer $venueLayer): RedirectResponse
    {
        if (!$venueLayer->venue->users()->where('user_id', auth()->id())->exists()) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'message' => 'You are not authorized to delete this venue layer.',
            ]);
        }

        $venueLayer->delete();

        return redirect()->back()->with('flash', [
            'type' => 'success',
            'message' => 'Venue layer deleted successfully.',
        ]);
    }

    private function authVenueCheck(Venue $venue): void
    {
        if (!$venue->users()->where('user_id', auth()->id())->exists()) {
            abort(403);
        }
    }

    private function authVenueLayerCheck(VenueLayer $venueLayer): void
    {
        if (!$venueLayer->venue->users()->where('user_id', auth()->id())->exists()) {
            abort(403);
        }
    }

    private function getAuthVenues()
    {
        return Venue::whereHas('users', static function ($query) {
            $query->where('user_id', auth()->id());
        })->get();
    }
}
