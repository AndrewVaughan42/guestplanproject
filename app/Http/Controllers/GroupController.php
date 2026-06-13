<?php

namespace App\Http\Controllers;

use App\Models\Group;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GroupController extends Controller
{
    public function index()
    {
        $wedding = auth()->user()->wedding;
        if (!$wedding) {
            return redirect()->route('dashboard')->with('flash', [
                'type' => 'error',
                'message' => 'Please set up your wedding first.',
            ]);
        }

        return Inertia::render('user/guest-groupings', [
            'groups' => Group::where('wedding_id', $wedding->id)
                ->withCount('guests')->orderByDesc('priority')->get(),
        ]);

    }

    public function store(Request $request): RedirectResponse
    {
        $wedding = auth()->user()->wedding;
        if (!$wedding) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'message' => 'Please set up your wedding first.',
            ]);
        }

        $data = $request->validate([
            'name' => ['required'],
            'priority' => ['required', 'integer', 'min:1', 'max:10'],
            'description' => ['nullable'],
            'colour' => ['required', 'string', 'min:7', 'max:7'],
        ]);

        $data['wedding_id'] = $wedding->id;

        Group::create($data);

        return redirect()->back()->with('flash', [
            'type' => 'success',
            'message' => 'Group created successfully.'
        ]);
    }

    public function show(Group $group)
    {
        if ($group->wedding_id !== auth()->user()->wedding?->id) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'message' => 'You are not authorized to view this group.',
            ]);
        }
        return $group;
    }

    public function update(Request $request, Group $group): RedirectResponse
    {
        if ($group->wedding_id !== auth()->user()->wedding?->id) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'message' => 'You are not authorized to edit this group.',
            ]);
        }

        $data = $request->validate([
            'name' => ['required'],
            'priority' => ['required', 'integer', 'min:1', 'max:10'],
            'description' => ['nullable'],
            'colour' => ['required', 'string', 'min:7', 'max:7'],
        ]);

        $group->update($data);

        return redirect()->back()->with('flash', [
            'type' => 'success',
            'message' => 'Group updated successfully.'
        ]);
    }

    public function destroy(Group $group): RedirectResponse
    {
        if ($group->wedding_id !== auth()->user()->wedding?->id) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'message' => 'You are not authorized to delete this group.',
            ]);
        }

        $group->delete();

        return redirect()->back()->with('flash', [
            'type' => 'success',
            'message' => 'Group deleted successfully.'
        ]);
    }

    public function attachGuest(Request $request, Group $group): RedirectResponse
    {
        $data = $request->validate([
            'guest_id' => ['required', 'exists:guests,id'],
        ]);

        $group->guests()->syncWithoutDetaching($data['guest_id']);

        return redirect()->back()->with('flash', [
            'type' => 'success',
            'message' => 'Guest added to group successfully.'
        ]);
    }

    public function detachGuest(Request $request, Group $group): RedirectResponse
    {
        $group->guests()->detach($request->guest_id);

        return redirect()->back()->with('flash', [
            'type' => 'success',
            'message' => 'Guest removed from group successfully.'
        ]);
    }
}
