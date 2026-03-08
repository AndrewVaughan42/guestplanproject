<?php

namespace App\Http\Controllers;

use App\Models\GuestConflict;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GuestConflictsController extends Controller
{
    public function index()
    {
        $wedding = auth()->user()->wedding;
        if (!$wedding) {
            return redirect()->route('dashboard')->with('flash', [
                'type' => 'error',
                'message' => 'Please set up your wedding first.'
            ]);
        }
        return Inertia::render('user/guest-conflicts', [
            'guest-conflicts' => GuestConflict::where('wedding_id', $wedding->id)->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'guest_a_id' => ['required', 'exists:guests'],
            'guest_b_id' => ['required', 'exists:guests'],
            'wedding_id' => ['required', 'exists:weddings'],
        ]);

        GuestConflict::create($data);

        return redirect()->back()->with('flash', [
            'type' => 'success',
            'message' => 'Guest conflict created successfully.'
        ]);
    }

    public function show(GuestConflict $guestConflicts)
    {
        return $guestConflicts;
    }

    public function update(Request $request, GuestConflict $guestConflicts): RedirectResponse
    {
        $data = $request->validate([
            'guest_a_id' => ['required', 'exists:guests'],
            'guest_b_id' => ['required', 'exists:guests'],
            'wedding_id' => ['required', 'exists:weddings'],
        ]);

        $guestConflicts->update($data);

        return redirect()->back()->with('flash', [
            'type' => 'success',
            'message' => 'Guest conflict updated successfully.'
        ]);
    }

    public function destroy(GuestConflict $guestConflicts): RedirectResponse
    {
        $guestConflicts->delete();

        return redirect()->back()->with('flash', [
            'type' => 'success',
            'message' => 'Guest conflict deleted successfully.'
        ]);
    }
}
