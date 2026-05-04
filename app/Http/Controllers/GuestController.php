<?php

namespace App\Http\Controllers;

use App\GuestStatus;
use App\Models\Guest;
use App\Models\Group;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GuestController extends Controller
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

        return Inertia::render('user/guest-manager', [
            'myGuests' => $wedding->guests,
            'myGroups' => Group::where('wedding_id', $wedding->id)->get(),
            'myMenuItems' => $wedding->menuItems,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $wedding = auth()->user()->wedding;

        if (!$wedding) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'message' => 'Please set up your wedding first.'
            ]);
        }

        $data = $request->validate([
            'name' => ['required', 'string','max:255'],
            'menu_item_id' => ['nullable', 'exists:menu_items,id'],
            'status' => ['required', 'in:invited,confirmed,declined'],
            'notes' => ['nullable'],
        ]);

        $data['wedding_id'] = $wedding->id;

        Guest::create($data);
        return redirect()->back()->with('flash', [
            'type' => 'success',
            'message' => 'Guest created successfully.'
        ]);
    }

    public function show(Guest $guest)
    {
        if ($guest->wedding_id !== auth()->user()->wedding?->id) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'message' => 'You are not authorized to view this guest.',
            ]);
        }
        return $guest;
    }

    public function update(Request $request, Guest $guest): RedirectResponse
    {
        $wedding = auth()->user()->wedding;
        if (!$wedding || $guest->wedding_id !== $wedding->id) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'message' => 'You are not authorized to edit this guest.',
            ]);
        }
        $data = $request->validate([
            'name' => ['required', 'string','max:255'],
            'menu_item_id' => ['nullable'],
            'status' => ['required', 'in:invited,confirmed,declined'],
            'notes' => ['nullable'],
        ]);

        $guest->update($data);

        return redirect()->back()->with('flash', [
            'type' => 'success',
            'message' => 'Guest updated successfully.'
        ]);
    }

    public function destroy(Guest $guest): RedirectResponse
    {
        if ($guest->wedding_id !== auth()->user()->wedding?->id) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'message' => 'You are not authorized to delete this guest.',
            ]);
        }

        $guest->delete();

        return redirect()->back()->with('flash', [
            'type' => 'success',
            'message' => 'Guest deleted successfully.'
        ]);
    }

    public function bulkStore(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'guests' => ['required', 'array'],
            'guests.*.name' => ['required', 'string','max:255'],
        ]);

        $wedding = auth()->user()->wedding;

        foreach ($data['guests'] as $guest) {
            Guest::create([
                'name' => $guest['name'],
                'wedding_id' => $wedding->id,
                'status' => GuestStatus::INVITED->value,
            ]);
    }
        return redirect()->back()->with('flash', [
            'type' => 'success',
            'message' => 'Guest list uploaded successfully.'
        ]);
    }
}
