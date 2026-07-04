<?php

namespace App\Http\Controllers;

use App\Models\Wedding;
use Barryvdh\DomPDF\Facade\Pdf;
use Dompdf\Dompdf;
use Inertia\Inertia;
use Inertia\Response;

class AdminWeddingController extends Controller
{
    public function index(): Response
    {
        $admin = auth()->user();

        $weddings = Wedding::with(['venue', 'guests'])
            ->whereHas('venue.users', function ($query) use ($admin) {
                $query->where('users.id', $admin->id);
            })
            ->orderBy('date')
            ->get()->map(fn ($wedding) => [
                'id' => $wedding->id,
                'name' => $wedding->partnerA_firstname . ' & ' . $wedding->partnerB_firstname,
                'date' => $wedding->date,
                'venue' => $wedding->venue->name,
                'guest_count' => $wedding->guests->count(),
            ]);

        return Inertia::render('admin/select-wedding', [
            'weddings' => $weddings,
        ]);
    }

    public function show(Wedding $wedding): Response
    {

        $wedding->load([
            'venue',
            'seat_plan',
            'guests.menuItem',
        ]);

        $seatPlan = $wedding->seat_plan;

        $layout = $seatPlan?->layout ?? [];

        $tables = collect($layout['tables'] ?? []);

        $allocations = $layout['allocations'] ?? [];

        $guestsById = $wedding->guests->keyBy('id');

        $mappedTables = $tables->map(function ($table) use ($allocations, $guestsById) {

            $raw = $allocations[$table['id']] ?? [];

            $guestIds = collect($raw)->flatten()->values();

            $guests = $guestIds->map(function ($id) use ($guestsById) {
                $guest = $guestsById[$id] ?? null;

                if (!$guest) return null;

                return [
                    'id' => $guest->id,
                    'name' => $guest->name,
                    'menu_item' => $guest->menuItem,
                    'notes' => $guest->notes,
                ];
            })->filter()->values();

            return [
                'id' => $table['id'],
                'name' => $table['name'],
                'guests' => $guests,
            ];
        });

        $totalGuests = $wedding->guests->count();

        $seatedGuests = collect($allocations)->flatten()->unique()->count();

        $seatCompletion = $totalGuests > 0 ? ($seatedGuests / $totalGuests) * 100 : 0;
        $allSeated = $totalGuests === $seatedGuests;

        return Inertia::render('admin/wedding-summary', [
            'wedding' => [
                'id' => $wedding->id,
                'name' => $wedding->partnerA_firstname . ' & ' . $wedding->partnerB_firstname,
                'date' => optional($wedding->date)?->toDateString(),
                'venue' => $wedding->venue->name,

                'seat_completion' => $seatCompletion,
                'all_seated' => $allSeated,

                'tables' => $mappedTables->values(),

                'guests' => $wedding->guests->map(fn ($guest) => [
                    'id' => $guest->id,
                    'name' => $guest->name,
                    'menu_item' => $guest->menuItem,
                    'notes' => $guest->notes,
                ]),
            ],
        ]);
    }

    /**
     * @throws \Throwable
     */
    public function export(Wedding $wedding): \Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Http\Response
    {
        $wedding->load([
            'venue',
            'seat_plan',
            'guests.menuItem',
        ]);

        $seatPlan = $wedding->seat_plan;

        $layout = $seatPlan?->layout ?? [];

        $tables = collect($layout['tables'] ?? []);

        $allocations = $layout['allocations'] ?? [];

        $guestsById = $wedding->guests->keyBy('id');

        $mappedTables = $tables->map(function ($table) use ($allocations, $guestsById) {

            $raw = $allocations[$table['id']] ?? [];

            $guestIds = collect($raw)->flatten()->values();

            $guests = $guestIds->map(function ($id) use ($guestsById) {
                $guest = $guestsById[$id] ?? null;

                if (!$guest) return null;

                return [
                    'id' => $guest->id,
                    'name' => $guest->name,
                    'menu_item' => $guest->menuItem,
                    'notes' => $guest->notes,
                ];
            })->filter()->values();

            return [
                'id' => $table['id'],
                'name' => $table['name'],
                'guests' => $guests,
            ];
        });

        $pdf = Pdf::loadView('pdf.wedding-job-sheet', ['wedding' => $wedding, 'tables' => $mappedTables])->setPaper('A4', 'portrait');

        $filename = $wedding->partnerA_lastname . '-' . $wedding->partnerB_lastname . 'wedding-jobsheet.pdf';
        return $pdf->stream($filename);
    }
}
