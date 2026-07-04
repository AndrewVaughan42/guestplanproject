<?php

namespace Tests\Feature;

use App\Models\Guest;
use App\Models\Seatplan;
use App\Models\User;
use App\Models\Venue;
use App\Models\VenueLayer;
use App\Models\Wedding;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class SeatplanControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_creates_seatplan_if_missing(): void
    {
       $user = User::factory()->create();

       $wedding = Wedding::factory()->for($user)->create();

       $venue = Venue::factory()->create();

       $wedding->update(['venue_id' => $venue->id]);

       $layer = VenueLayer::factory()->create([
           'venue_id' => $venue->id,
           'table_data' => [],
       ]);
        // Index creates a seatplan if missing, i.e., first time opening the page
       $this->actingAs($user)->get(route('seat-plans.index'))->assertOk();

       $this->assertDatabaseHas('seatplans', [
           'wedding_id' => $wedding->id,
       ]);
    }

    public function test_autoseat_returns_correct_format(): void
    {
        $user = User::factory()->create();
        $venue = Venue::factory()->create();
        $layer = VenueLayer::factory()->create([
            'venue_id' => $venue->id,
            'table_data' => [
                ['id' => 'table-1', 'type' => 'round', 'seat_maximum' => 10],
            ],
        ]);
        $wedding = Wedding::factory()->create([
            'user_id' => $user->id,
            'venue_id' => $venue->id,
            'venue_layer_id' => $layer->id,
        ]);
        $guests = Guest::factory()->count(5)->create(['wedding_id' => $wedding->id]);
        $seatplan = Seatplan::create([
            'wedding_id' => $wedding->id,
            'user_id' => $user->id,
            'venue_layer_id' => $layer->id,
            'name' => 'Default Plan',
            'layout' => ['allocations' => [], 'tables' => []],
        ]);
        $response = $this->actingAs($user)->post("/seat-plans/{$seatplan->id}/auto-seat");
        $response->assertOk();
        $response->assertJsonStructure([
            'allocations',
            'tables',
            'venue_layer_id',
        ]);

        $data = $response->json();

        // Check that tables stored as sequential array, not object
        $this->assertTrue(array_is_list($data['tables']), 'Tables should be a sequential JSON array');
        // Check types for frontend compatibility
        foreach ($data['allocations'] as $tableId => $seats) {
            $this->assertIsString($tableId);
            $this->assertIsArray($seats);
            foreach ($seats as $seatIndex => $guestId) {
                $this->assertIsString((string)$seatIndex);
                $this->assertIsInt($guestId);
            }
        }
    }

    //Checks to make sure top table allocations are preserved
    public function test_autoseat_preserves_top_table_allocations(): void
    {
        $user = User::factory()->create();
        $venue = Venue::factory()->create();
        $layer = VenueLayer::factory()->create([
            'venue_id' => $venue->id,
            'table_data' => [
                ['id' => 'top-1', 'type' => 'top', 'seat_maximum' => 4, 'seats_per_side' => 1],
                ['id' => 'round-1', 'type' => 'round', 'seat_maximum' => 10],
            ],
        ]);
        $wedding = Wedding::factory()->create([
            'user_id' => $user->id,
            'venue_id' => $venue->id,
            'venue_layer_id' => $layer->id,
        ]);
        $guests = Guest::factory()->count(5)->create(['wedding_id' => $wedding->id]);
        $guestToLock = $guests[0];
        $seatplan = Seatplan::create([
            'wedding_id' => $wedding->id,
            'user_id' => $user->id,
            'venue_layer_id' => $layer->id,
            'name' => 'Default Plan',
            'layout' => [
                'allocations' => [
                    'top-1' => [
                        '0' => $guestToLock->id
                    ]
                ],
                'tables' => $layer->table_data
            ],
        ]);
        $response = $this->actingAs($user)->post("/seat-plans/{$seatplan->id}/auto-seat");
        $response->assertOk();
        $data = $response->json();

        // Check that guestToLock is still on top table at index 0
        $this->assertEquals($guestToLock->id, $data['allocations']['top-1']['0']);
    }
}
