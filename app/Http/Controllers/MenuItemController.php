<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use App\Models\Venue;
use Illuminate\Http\Request;

class MenuItemController extends Controller
{
    public function index()
    {
        return MenuItem::whereHas('venue.users', function ($query) {
            $query->where('user_id', auth()->id());
        })->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'venue_id' => ['required', 'exists:venues,id'],
            'name' => ['required'],
            'description' => ['nullable'],
            'is_plant_based' => ['boolean'],
        ]);

        $venue = Venue::findOrFail($data['venue_id']);
        if (!$venue->users()->where('user_id', auth()->id())->exists()) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'message' => 'You are not authorized to create menu items for this venue.',
            ]);
        }

        return MenuItem::create($data);
    }

    public function show(MenuItem $venueMenuItem)
    {
        if (!$venueMenuItem->venue->users()->where('user_id', auth()->id())->exists()) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'message' => 'You are not authorized to view this menu item.',
            ]);
        }
        return $venueMenuItem;
    }

    public function update(Request $request, MenuItem $venueMenuItem)
    {
        if (!$venueMenuItem->venue->users()->where('user_id', auth()->id())->exists()) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'message' => 'You are not authorized to edit this menu item.',
            ]);
        }

        $data = $request->validate([
            'venue_id' => ['required', 'exists:venues,id'],
            'name' => ['required'],
            'description' => ['nullable'],
            'is_plant_based' => ['boolean'],
        ]);

        $venueMenuItem->update($data);

        return $venueMenuItem;
    }

    public function destroy(MenuItem $venueMenuItem)
    {
        if (!$venueMenuItem->venue->users()->where('user_id', auth()->id())->exists()) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'message' => 'You are not authorized to delete this menu item.',
            ]);
        }

        $venueMenuItem->delete();

        return response()->json();
    }
}
