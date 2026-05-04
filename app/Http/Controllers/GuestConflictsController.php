<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use App\Models\GuestConflict;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GuestConflictsController extends Controller
{
    public function index()
    {
        $wedding = auth()->user()->wedding;
        if (!$wedding && !auth()->user()->isAdmin) {
            return redirect()->route('dashboard')->with('flash', [
                'type' => 'error',
                'message' => 'Please set up your wedding first.'
            ]);
        }
        return Inertia::render('user/guest-conflicts', [
            'guest-conflicts' => GuestConflict::with(['guestA', 'guestB'])->where('wedding_id', $wedding->id)->get(),
            'guests' => Guest::where('wedding_id', $wedding->id)->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'guest_a_id' => ['required', 'exists:guests,id'],
            'guest_b_id' => ['required', 'exists:guests,id'],
            'wedding_id' => ['required', 'exists:weddings,id'],
            'conflict_reason'=> ['nullable']
        ]);

        GuestConflict::create($data);

        return redirect()->back()->with('flash', [
            'type' => 'success',
            'message' => 'Guest conflict created successfully.'
        ]);
    }

    public function show(GuestConflict $conflict)
    {
        return $conflict;
    }

    public function update(Request $request, GuestConflict $conflict): RedirectResponse
    {
        $data = $request->validate([
            'guest_a_id' => ['required', 'exists:guests,id'],
            'guest_b_id' => ['required', 'exists:guests,id'],
            'wedding_id' => ['required', 'exists:weddings,id'],
            'conflict_reason'=> ['nullable']
        ]);

        $conflict->update($data);

        return redirect()->back()->with('flash', [
            'type' => 'success',
            'message' => 'Guest conflict updated successfully.'
        ]);
    }

    public function destroy(GuestConflict $conflict): RedirectResponse
    {
        $conflict->delete();

        return redirect()->back()->with('flash', [
            'type' => 'success',
            'message' => 'Guest conflict deleted successfully.'
        ]);
    }
}
