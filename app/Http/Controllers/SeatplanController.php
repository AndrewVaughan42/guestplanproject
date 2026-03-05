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
        $wedding = auth()->user()->wedding;
        return Inertia::render('user/seat-plan', [
            'seatplans' => $wedding->seatplans ?? [],
        ]);
    }

    public function store(Request $request)
    {
        $wedding = auth()->user()->wedding;
        if (!$wedding) {
            return redirect()->back()->with('error', 'Please set up your wedding first.');
        }

        $data = $request->validate([
            'Layout' => ['required'],
        ]);

        $data['wedding_id'] = $wedding->id;

        return Seatplan::create($data);
    }

    public function show(Seatplan $seatplan)
    {
        if ($seatplan->wedding_id !== auth()->user()->wedding?->id) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'message' => 'You are not authorized to view this seat plan.',
            ]);
        }
        return $seatplan;
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
            'Layout' => ['required'],
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
