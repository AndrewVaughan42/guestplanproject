<?php

namespace App\Http\Controllers;

use App\Models\Wedding;
use Illuminate\Http\Request;

class WeddingController extends Controller
{
    public function index()
    {
        return auth()->user()->wedding;
    }

    public function store(Request $request)
    {
        if (Wedding::where('user_id', auth()->id())->exists()) {
            return redirect()->back()->with('error', 'You already have a wedding.');
        }

        $data = $request->validate([
            'venue_id' => ['required', 'exists:venues,id'],
            'partnerA_firstname' => ['required'],
            'partnerA_lastname' => ['required'],
            'partnerB_firstname' => ['required'],
            'partnerB_lastname' => ['required'],
            'date' => ['required', 'date'],
            'groupTemplates' => ['nullable', 'boolean'],
        ]);

        data_set($data, 'user_id', auth()->id()); //Check this works, it does
        $wedding = Wedding::create($data);

        if ($data['groupTemplates']) {
            $template = [
                ['name' => "$wedding->partnerA_lastname Family", 'priority' => 1, 'description' => "Family of $wedding->partnerA_firstname $wedding->partnerA_lastname, automatically created by Guestplan."],
                ['name' => "$wedding->partnerB_lastname Family", 'priority' => 1, 'description' => "Family of $wedding->partnerB_firstname $wedding->partnerB_lastname, automatically created by Guestplan."],
                ['name' => "Groomsmen", 'priority' => 1],
                ['name' => "Bridesmaids", 'priority' => 1],
                ['name' => "Friends of $wedding->partnerA_firstname", 'priority' => 2],
                ['name' => "Friends of $wedding->partnerB_firstname", 'priority' => 2],

            ];
            foreach ($template as $group) {
                $wedding->groups()->create([
                    'name' => $group['name'],
                    'priority' => $group['priority'],
                    'description' => $group['description'] ?? null,
                ]);
            }

        }
        return redirect()->back()->with('success', 'Task created successfully.');


    }

    public function show(Wedding $wedding)
    {
        if ($wedding->user_id !== auth()->id()) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'message' => 'You are not authorized to view this wedding.',
            ]);
        }
        return $wedding;
    }

    public function update(Request $request, Wedding $wedding)
    {
        if ($wedding->user_id !== auth()->id()) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'message' => 'You are not authorized to edit this wedding.',
            ]);
        }

        $data = $request->validate([
            'venue_id' => ['required', 'exists:venues,id'],
            'partnerA_firstname' => ['required'],
            'partnerA_lastname' => ['required'],
            'partnerB_firstname' => ['required'],
            'partnerB_lastname' => ['required'],
            'date' => ['required', 'date'],
        ]);

        data_set($data, 'partnerA', $data['partnerA_firstname'] . ' ' . $data['partnerA_lastname']);
        data_set($data, 'partnerB', $data['partnerB_firstname'] . ' ' . $data['partnerB_lastname']);

        $wedding->update($data);

        return $wedding;
    }

    public function destroy(Wedding $wedding)
    {
        if ($wedding->user_id !== auth()->id()) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'message' => 'You are not authorized to delete this wedding.',
            ]);
        }

        $wedding->delete();

        return redirect()->back()->with('flash', [
            'type' => 'success',
            'message' => 'Wedding deleted successfully.',
        ]);
    }
}
