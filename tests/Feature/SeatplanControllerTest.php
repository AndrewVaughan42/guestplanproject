<?php

namespace Tests\Feature;

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

       $this->actingAs($user)->get(route('seat-plans.index'))->assertOk();

       $this->assertDatabaseHas('seatplans', [
           'wedding_id' => $wedding->id,
       ]);
    }
}
