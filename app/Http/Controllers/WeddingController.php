<?php

namespace App\Http\Controllers;

use App\GuestRole;
use App\GuestStatus;
use App\Models\Guest;
use App\Models\Wedding;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class WeddingController extends Controller
{
    public function index()
    {
        return auth()->user()->wedding;
    }

    public function store(Request $request): RedirectResponse
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
        //Guests representing couple created
        $partnerA = Guest::create(
            ['name' => "$wedding->partnerA_firstname $wedding->partnerA_lastname", 'wedding_id' => $wedding->id, 'status' => GuestStatus::CONFIRMED->value, 'role' => GuestRole::PARTNER_A->value],
        );
        $partnerB = Guest::create(
            ['name' => "$wedding->partnerB_firstname $wedding->partnerB_lastname", 'wedding_id' => $wedding->id, 'status' => GuestStatus::CONFIRMED->value, 'role' => GuestRole::PARTNER_B->value],
        );

        //Links Guest ids of partners to wedding
        $wedding->update([
            'partnerA_guest_id' => $partnerA->id,
            'partnerB_guest_id' => $partnerB->id,
        ]);

        //If template date wanted (groupTemplates = true)
        if ($data['groupTemplates']) {
            $template = [
                ['name' => "$wedding->partnerA_lastname Family", 'priority' => 1, 'description' => "Family of $wedding->partnerA_firstname $wedding->partnerA_lastname, automatically created by Guestplan.", 'colour' => 'red'],
                ['name' => "$wedding->partnerB_lastname Family", 'priority' => 1, 'description' => "Family of $wedding->partnerB_firstname $wedding->partnerB_lastname, automatically created by Guestplan.", 'colour' => 'blue'],
                ['name' => "Groomsmen", 'priority' => 1, 'colour' => 'green'],
                ['name' => "Bridesmaids", 'priority' => 1, 'colour' => 'pink'],
                ['name' => "Friends of $wedding->partnerA_firstname", 'priority' => 2, 'colour' => 'yellow'],
                ['name' => "Friends of $wedding->partnerB_firstname", 'priority' => 2, 'colour' => 'purple'],

            ];
            foreach ($template as $group) {
                $wedding->groups()->create([
                    'name' => $group['name'],
                    'priority' => $group['priority'],
                    'description' => $group['description'] ?? null,
                    'colour' => $group['colour'],
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

    public function update(Request $request, Wedding $wedding): RedirectResponse
    {
        if ($wedding->user_id !== auth()->id()) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'message' => 'You are not authorized to edit this wedding.',
            ]);
        }

        $data = $request->validate([
            'venue_id' => ['sometimes', 'required', 'exists:venues,id'],
            'partnerA_firstname' => ['sometimes', 'required'],
            'partnerA_lastname' => ['sometimes', 'required'],
            'partnerB_firstname' => ['sometimes', 'required'],
            'partnerB_lastname' => ['sometimes', 'required'],
            'date' => ['sometimes', 'required', 'date'],
        ]);

        $menuItemsData = $request->validate([
            'menu_item_ids' => ['sometimes', 'array', 'size:3'],
            'menu_item_ids.*' => ['exists:menu_items,id'],
        ]);

        if (isset($data['partnerA_firstname'], $data['partnerA_lastname'])) {
            data_set($data, 'partnerA', $data['partnerA_firstname'] . ' ' . $data['partnerA_lastname']);
        }
        if (isset($data['partnerB_firstname'], $data['partnerB_lastname'])) {
            data_set($data, 'partnerB', $data['partnerB_firstname'] . ' ' . $data['partnerB_lastname']);
        }

        $wedding->update($data);

        if (isset($menuItemsData['menu_item_ids'])) {
            $wedding->menuItems()->sync($menuItemsData['menu_item_ids']);
        }

        return redirect()->back()->with('flash', [
            'type' => 'success',
            'message' => 'Wedding updated successfully.',
        ]);
    }

    public function destroy(Wedding $wedding): RedirectResponse
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
