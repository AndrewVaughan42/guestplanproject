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
        return Inertia::render('user/seat-plan', [
            'seatplans' => Seatplan::where('wedding_id', request('wedding_id'))->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'wedding_id' => ['required', 'exists:weddings'],
            'Layout' => ['required'],
        ]);

        return Seatplan::create($data);
    }

    public function show(Seatplan $seatplan)
    {
        return $seatplan;
    }

    public function update(Request $request, Seatplan $seatplan)
    {
        $data = $request->validate([
            'wedding_id' => ['required', 'exists:weddings'],
            'Layout' => ['required'],
        ]);

        $seatplan->update($data);

        return $seatplan;
    }

    public function destroy(Seatplan $seatplan)
    {
        $seatplan->delete();

        return response()->json();
    }
}
