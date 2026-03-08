<?php

namespace App\Http\Controllers;

use App\Models\Venue;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VenueController extends Controller
{
    public function index(): Response
    {
        $venues = Venue::whereHas('users', function ($query) {
            $query->where('user_id', auth()->id());
        })->with('menuItems')->get();
        return Inertia::render('admin/venue-manager', [
            'venues' => $venues,
        ]);

    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required'],
            'minimum_table_amount' => ['required', 'integer'],
            'maximum_table_amount' => ['required', 'integer'],
            'minimum_capacity' => ['required', 'integer'],
            'maximum_capacity' => ['required', 'integer'],
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

    public function update(Request $request, Venue $venue): RedirectResponse
    {
        if (!$venue->users()->where('user_id', auth()->id())->exists()) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'message' => 'You are not authorized to edit this venue.',
            ]);
        }

        $data = $request->validate([
            'name' => ['required'],
            'minimum_table_amount' => ['required', 'integer'],
            'maximum_table_amount' => ['required', 'integer'],
            'minimum_capacity' => ['required', 'integer'],
            'maximum_capacity' => ['required', 'integer'],
        ]);

        $venue->update($data);

        return redirect()->back()->with('flash', [
            'type' => 'success',
            'message' => 'Venue updated successfully.'
        ]);
    }

    public function destroy(Venue $venue): RedirectResponse
    {
        if (!$venue->users()->where('user_id', auth()->id())->exists()) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'message' => 'You are not authorized to delete this venue.',
            ]);
        }

        $venue->delete();

        return redirect()->back()->with('flash', [
            'type' => 'success',
            'message' => 'Venue deleted successfully.'
        ]);
    }
}
