<?php

namespace App\Http\Controllers;

use App\GuestRole;
use App\GuestStatus;
use App\Models\Guest;
use App\Models\Wedding;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

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

        //If template date wanted (groupTemplates = true)
        if ($data['groupTemplates']) {
            $template = [
                ['name' => "$wedding->partnerA_lastname Family", 'ranking' => 1, 'description' => "Family of $wedding->partnerA_firstname $wedding->partnerA_lastname, automatically created by Guestplan.", 'colour' => 'red'],
                ['name' => "$wedding->partnerB_lastname Family", 'ranking' => 2, 'description' => "Family of $wedding->partnerB_firstname $wedding->partnerB_lastname, automatically created by Guestplan.", 'colour' => 'blue'],
                ['name' => "Groomsmen", 'ranking' => 3, 'colour' => 'green'],
                ['name' => "Bridesmaids", 'ranking' => 4, 'colour' => 'pink'],
                ['name' => "Friends of $wedding->partnerA_firstname", 'ranking' => 5, 'colour' => 'yellow'],
                ['name' => "Friends of $wedding->partnerB_firstname", 'ranking' => 6, 'colour' => 'purple'],

            ];
            foreach ($template as $group) {
                $wedding->groups()->create([
                    'name' => $group['name'],
                    'ranking' => $group['ranking'],
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

    public function selectWedding()
    {
        if (auth()->user()->role !== 'admin') {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'message' => 'You are not authorized to view this.',
            ]);
        }

        $venues = auth()->user()->venues()->get();

        return Inertia::render('admin/select-wedding', [
            'venues' => $venues,
        ]);
    }

    //Route for wedding summary page, Admins only for that venue can access;
    public function summary(Wedding $wedding)
    {
        if (auth()->user()->role !== 'admin') {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'message' => 'You are not authorized to view this summary.',
            ]);
        }

        if ($wedding->venue->user_id !== auth()->id()) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'message' => 'You are not authorized to view this summary.',
            ]);
        }

        $guests = $wedding->guests()->with('menuItem')->get();

        $totalGuests = $guests->count();

        $confirmed = $guests->where('status', GuestStatus::CONFIRMED)->count();
        $invited = $guests->where('status', GuestStatus::INVITED)->count();
        $declined = $guests->where('status', GuestStatus::DECLINED)->count();

        $confirmRate = $totalGuests > 0 ? round(($confirmed / $totalGuests) * 100, 2) : 0;

        $menuBreakdown = $wedding->menuItems->map(function ($menuItem) use ($guests) {
            return [
                'id' => $menuItem->id,
                'name' => $menuItem->name,
                'description' => $menuItem->description,
                'count' => $guests->where('status', GuestStatus::CONFIRMED)->where('menu_item_id', $menuItem->id)->count(),
            ];
        });

        return Inertia::render('admin/wedding-summary', [
            'wedding' => $wedding,
            'guests' => $guests,
            'stats' => [
                'total' => $totalGuests,
                'confirmed' => $confirmed,
                'invited' => $invited,
                'declined' => $declined,
                'confirmRate' => $confirmRate,
            ],
            'menuItems' => $menuBreakdown,
        ]);

    }
}
