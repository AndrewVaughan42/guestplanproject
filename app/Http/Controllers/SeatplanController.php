<?php

namespace App\Http\Controllers;

use App\Models\Seatplan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Laravel\Wayfinder\Route;

class SeatplanController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $wedding = auth()->user()->wedding;
        if (!$wedding) {
            return redirect()->route('dashboard')->with('flash', [
                'type' => 'error',
                'message' => 'Please set up your wedding first.',
            ]);
        }

        $venueLayer = $wedding->venue->venueLayers()->first();
        if (!$venueLayer) {
            return redirect()->route('dashboard')->with('flash', [
                'type' => 'error',
                'message' => 'No venue layout found. Please contact your coordinator.',
            ]);
        }

        $seatplan = $wedding->seatplan()->firstorCreate([
            'wedding_id' => $wedding->id,
        ], [
            'user_id' => $user->id,
            'name' => $wedding->partnerA_firstname . ' & ' . $wedding->partnerB_firstname . ' Seatplan',
            'layout' => ['allocations' => [], 'tablePositions' => []],
            'venue_layer_id' => $wedding->venue->venueLayers()->first()->id,
        ]);



        return Inertia::render('user/seat-plan', [
            'seatplanId' => $seatplan->id,
            'initialAllocations' => $seatplan->layout['allocations'] ?? [],
            'initialTablePositions' => $seatplan->layout['tablePositions'] ?? [],
            'venueLayersLayout' => $venueLayer,
            'guests' => $wedding->guests,
            'conflicts' => $wedding->guestConflicts()->with(['guestA', 'guestB'])->get(),
        ]);
    }

    public function store(Request $request)
    {
        $wedding = auth()->user()->wedding;
        if (!$wedding) {
            return redirect()->back()->with('error', 'Please set up your wedding first.');
        }

        $data = $request->validate([
            'layout' => ['required'],
        ]);

        $data['wedding_id'] = $wedding->id;

        return Seatplan::create($data);
    }

    public function show(Seatplan $seatplan)
    {
        $user = auth()->user();
        if ($seatplan->wedding_id !== $user->wedding?->id) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'message' => 'You are not authorized to view this seat plan.',
            ]);
        }

        $wedding = $user->wedding;
        $venueLayer = $wedding->venue->venueLayers()->first();

        if (!$venueLayer) {
            return redirect()->route('task-list')->with('flash', [
                'type' => 'error',
                'message' => 'No venue layout found. Please contact your coordinator.',
            ]);
        }

        return Inertia::render('user/seat-plan', [
            'seatPlanId' => $seatplan->id,
            'initialAllocations' => $seatplan->layout['allocations'] ?? [],
            'initialTablePositions' => $seatplan->layout['tablePositions'] ?? [],
            'venueLayersLayout' => $venueLayer,
            'guests' => $wedding->guests,
            'conflicts' => $wedding->conflicts()->with(['guestA', 'guestB'])->get(),
        ]);
    }

    public function update(Request $request, Seatplan $seatplan)
    {
        if ($seatplan->wedding_id !== auth()->user()->wedding?->id) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'message' => 'You are not authorized to edit this seat plan.',
            ]);
        }

        $data = $request->validate([
            'layout' => ['required'],
        ]);

        $seatplan->update($data);

        return $seatplan;
    }

    public function destroy(Seatplan $seatplan)
    {
        if ($seatplan->wedding_id !== auth()->user()->wedding?->id) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'message' => 'You are not authorized to delete this seat plan.',
            ]);
        }

        $seatplan->delete();

        return response()->json();
    }
}
