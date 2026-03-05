<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\RelationshipStatus;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Enum;

class GroupController extends Controller
{
    public function index()
    {
        $wedding = auth()->user()->wedding;
        if (!$wedding) {
            return [];
        }
        return Group::where('wedding_id', $wedding->id)->get();
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

        return Group::create($data);
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

        return $group;
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

        return response()->json();
    }
}
