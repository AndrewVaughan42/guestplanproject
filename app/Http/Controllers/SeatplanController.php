<?php

namespace App\Http\Controllers;

use App\GuestRole;
use App\Models\Guest;
use App\Models\Seatplan;
use App\Models\VenueLayer;
use App\Models\Wedding;
use App\Services\SeatingAlgorithm\AutoSeatService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SeatplanController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $wedding = $user->wedding;

        if (!$wedding) {
            return redirect()->route('dashboard')->with('flash', [
                'type' => 'error',
                'message' => 'Please set up your wedding first.',
            ]);
        }

        $venueLayers = $wedding->venue->venueLayers()->get();

        if ($venueLayers->isEmpty()) {
            return redirect()->route('dashboard')->with('flash', [
                'type' => 'error',
                'message' => 'No venue layouts found. Please contact your coordinator.',
            ]);
        }

        $seat_plan = Seatplan::firstOrCreate([
            'wedding_id' => $wedding->id,
        ], [
            'wedding_id' => $wedding->id,
            'user_id' => $user->id,
            'name' => $wedding->partnerA_firstname . ' & ' . $wedding->partnerB_firstname . ' Seatplan',
            'layout' => ['allocations' => [], 'tables' => []],
            'venue_layer_id' => $venueLayers->first()->id,
        ]);

        $activeLayer = $venueLayers->firstWhere('id', $seat_plan->venue_layer_id) ?? $venueLayers->first();

        if (empty($seat_plan->layout['tables'] ?? null)) {
            $layout = $seat_plan->layout;
            $layout['tables'] = $activeLayer->table_data;
            $seat_plan->layout = $layout;
        }

        $seat_plan->layout = $this->ensurePartnerSeated($seat_plan->layout, $activeLayer, $wedding);

        $seat_plan->save();

        $partnerA = $wedding->guests()
            ->where('role', GuestRole::PARTNER_A->value)
            ->first();

        $partnerB = $wedding->guests()
            ->where('role', GuestRole::PARTNER_B->value)
            ->first();

        return Inertia::render('user/seat-plan', [
            'seatPlanId' => $seat_plan->id,
            'initialAllocations' => $seat_plan->layout['allocations'] ?? [],
            'initialTables' => $seat_plan->layout['tables'] ?? [],
            'venueLayers' => $venueLayers,
            'venue_layer_id' => $activeLayer->id,
            'guests' => Guest::where('wedding_id', $wedding->id)->with('groups')->get(),
            'conflicts' => $wedding->guestConflicts()->with(['guestA', 'guestB'])->get(),
            'lockedGuests' => array_values(array_filter([$partnerA?->id, $partnerB?->id]))
        ]);
    }

    public function store(Request $request)
    {
        $wedding = auth()->user()->wedding;
        if (!$wedding) {
            return redirect()->back()->with('error', 'Please set up your wedding first.');
        }

        $data = $request->validate([
            'venue_layer_id' => ['required', 'integer', 'exists:venue_layers,id'],
            'layout' => ['required'],
            'layout.allocations' => ['sometimes', 'array'],
            'layout.tables' => ['required', 'array'],
        ]);

        $data['wedding_id'] = $wedding->id;


        return Seatplan::create($data);
    }

    public function show(Seatplan $seat_plan)
    {
        $user = auth()->user();
        if ($seat_plan->wedding_id !== $user->wedding?->id) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'message' => 'You are not authorized to view this seat plan.',
            ]);
        }

        $wedding = $user->wedding;

        $venueLayers = $wedding->venue->venueLayers()->get();
        $activeLayer = $venueLayers->where('id', $seat_plan->venue_layer_id)->first() ?? $venueLayers->first();

        if ($venueLayers->isEmpty()) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'message' => 'No venue layout found. Please contact your coordinator.',
            ]);
        }

        $seat_plan->layout = $this->ensurePartnerSeated($seat_plan->layout, $activeLayer, $wedding);

        $seat_plan->save();

        $partnerA = $wedding->guests()
            ->where('role', GuestRole::PARTNER_A->value)
            ->first();

        $partnerB = $wedding->guests()
            ->where('role', GuestRole::PARTNER_B->value)
            ->first();

        return Inertia::render('user/seat-plan', [
            'seatPlanId' => $seat_plan->id,
            'initialAllocations' => $seat_plan->layout['allocations'] ?? [],
            'initialTables' => $seat_plan->layout['tables'] ?? [],
            'venueLayers' => $venueLayers,
            'venue_layer_id' => $activeLayer->id,
            'guests' => Guest::where('wedding_id', $wedding->id)->with('groups')->get(),
            'conflicts' => $wedding->guestConflicts()->with(['guestA', 'guestB'])->get(),
            'lockedGuests' => array_values(array_filter([$partnerA?->id, $partnerB?->id]))
        ]);
    }

    public function update(Request $request, Seatplan $seat_plan): RedirectResponse
    {
        $user = auth()->user();
        $wedding = $user->wedding;

        if ($seat_plan->wedding_id !== $wedding->id && $seat_plan->user_id !== auth()->id()) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'message' => 'You are not authorized to edit this seat plan.',
            ]);
        }

        $data = $request->validate([
            'venue_layer_id' => ['required', 'integer', 'exists:venue_layers,id'],
            'layout' => ['required'],
            'layout.allocations' => ['sometimes', 'array'],
            'layout.tables' => ['required', 'array'],
        ]);

        if (isset($data['venue_layer_id'])) {
            $seat_plan->venue_layer_id = $data['venue_layer_id'];
        }

        $seat_plan->layout = $data['layout'];

        $seat_plan->save();

        return redirect()->back()->with('flash', [
            'type' => 'success',
            'message' => 'Seat plan updated successfully.',
        ]);
    }

    public function destroy(Seatplan $seat_plan): RedirectResponse
    {
        if ($seat_plan->wedding_id !== auth()->user()->wedding?->id) {
            return redirect()->back()->with('flash', [
                'type' => 'error',
                'message' => 'You are not authorized to delete this seat plan.',
            ]);
        }

        $seat_plan->delete();

        return redirect()->back()->with('flash', [
            'type' => 'success',
            'message' => 'Seat plan deleted successfully.',
        ]);
    }

    private function ensurePartnerSeated(array $layout, $venueLayer, $wedding): array
    {
        $allocations = $layout['allocations'] ?? [];

        $partnerA = $wedding->guests()->where('role', GuestRole::PARTNER_A->value)->first();
        $partnerB = $wedding->guests()->where('role', GuestRole::PARTNER_B->value)->first();

        if (!$partnerA && !$partnerB) {
            return $layout;
        }

        $topTable = null;

        foreach ($venueLayer->table_data as $table) {
            if (($table['type'] ?? '') === 'top') {
                $topTable = $table;
                break;
            }
        }
        if (!$topTable) {
            return $layout;
        }

        $tableId = $topTable['id'];

        $seatsPerSide = $topTable['seats_per_side'];
        if (isset($layout['tables'])) {
            foreach ($layout['tables'] as $savedTable) {
                if ($savedTable['id'] == $tableId && isset($savedTable['seats_per_side'])) {
                    $seatsPerSide = $savedTable['seats_per_side'];
                    break;
                }
            }
        }

        // Remove partners from ANY table they might be on
        foreach ($allocations as $tId => $tableSeats) {
            foreach ($tableSeats as $seatIndex => $guestId) {
                if (($partnerA && (int)$guestId === (int)$partnerA->id) || ($partnerB && (int)$guestId === (int)$partnerB->id)) {
                    unset($allocations[$tId][$seatIndex]);
                }
            }
            $isTop = false;
            foreach($venueLayer->table_data as $td) {
                if ($td['id'] == $tId && ($td['type'] ?? '') === 'top') { $isTop = true; break; }
            }
            if (!$isTop) {
                $allocations[$tId] = array_values($allocations[$tId]);
            }
        }

        $allocations[$tableId] ??= [];

        $totalSeats = ($seatsPerSide * 2) + 2;
        $brideIndex = (int) floor($totalSeats / 2) - 1;
        $groomIndex = (int) floor($totalSeats / 2);

        if ($partnerA) {
            $allocations[$tableId][$brideIndex] = (string) $partnerA->id;
        }
        if ($partnerB) {
            $allocations[$tableId][$groomIndex] = (string) $partnerB->id;
        }
        $layout['allocations'] = $allocations;

        // Ensure tables array matches the seats_per_side used for calculation
        if (isset($layout['tables'])) {
            foreach ($layout['tables'] as &$table) {
                if ($table['id'] == $tableId) {
                    $table['seats_per_side'] = $seatsPerSide;
                }
            }
        }

        return $layout;
    }

    public function autoSeat(Request $request, $seat_plan_id, AutoSeatService $autoSeatService)
    {
        $seatplan = Seatplan::with('wedding')->find($seat_plan_id);

        if (!$seatplan) {
            return response()->json(['error' => 'Seatplan not found.'], 404);
        }

        $wedding = $seatplan->wedding;

        if ($request->has('layout')) {
            $seatplan->layout = $request->input('layout');
            if ($request->has('venue_layer_id')) {
                $seatplan->venue_layer_id = $request->input('venue_layer_id');
            }
            $seatplan->save();
        }

        $currentLayer = $seatplan->venueLayer ?: $wedding->venueLayer;

        if (!$currentLayer) {
            return response()->json(['error' => 'No venue layer found for this wedding.'], 422);
        }
        try {
            $options = [];
            if ($seatplan->layout) {
                if (isset($seatplan->layout['allocations'])) {
                    $options['currentAllocations'] = $seatplan->layout['allocations'];
                }
                if (isset($seatplan->layout['tables'])) {
                    $options['currentTables'] = $seatplan->layout['tables'];
                }
            }

            $result = $autoSeatService->generate($wedding, $currentLayer, $options);

            $formattedAllocations = [];
            foreach ($result['allocations'] as $tableId => $guestIds) {
                $formattedAllocations[(string)$tableId] = [];
                foreach ($guestIds as $index => $guestId) {
                    $formattedAllocations[(string)$tableId][(string)$index] = (int)$guestId;
                }
            }

            $layout = [
                'allocations' => $formattedAllocations,
                'tables' => array_values($result['tables']->toArray()),
            ];

            $layout = $this->ensurePartnerSeated($layout, $currentLayer, $wedding);


            return response()->json([
                'allocations' => $layout['allocations'],
                'tables' => $layout['tables'],
                'venue_layer_id' => $currentLayer->id,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

}
