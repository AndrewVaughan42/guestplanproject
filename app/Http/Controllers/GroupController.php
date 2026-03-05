<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\RelationshipStatus;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Enum;
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
                ->withCount('guests')->get()
        ]);

    }

    public function store(Request $request)
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
            'relationship' => ['required', new Enum(RelationshipStatus::class)],
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

    public function update(Request $request, Group $group)
    {
        if ($group->wedding_id !== auth()->user()->wedding?->id) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'message' => 'You are not authorized to edit this group.',
            ]);
        }

        $data = $request->validate([
            'name' => ['required'],
            'relationship' => ['required', new Enum(RelationshipStatus::class)],
        ]);

        $group->update($data);

        return redirect()->back()->with('flash', [
            'type' => 'success',
            'message' => 'Group updated successfully.'
        ]);
    }

    public function destroy(Group $group)
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
}
