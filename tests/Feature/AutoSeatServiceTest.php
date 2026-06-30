<?php

namespace Tests\Feature;

use App\GuestRole;
use App\Models\Venue;
use App\Models\VenueLayer;
use App\Models\Wedding;
use App\Models\User;
use App\Models\Guest;
use App\Models\Group;
use App\Models\GuestConflict;
use App\Services\SeatingAlgorithm\AutoSeatService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class AutoSeatServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_seating_allocation(): void
    {
        $user = User::factory()->create();
        $venue = Venue::factory()->create([]);

        $layer = VenueLayer::create([
            'venue_id' => $venue->id,
            'user_id' => $user->id,
            'name' => 'Layer 1',
            'table_data' => [
                [
                    'id' => 1,
                    'name' => 'Table 1',
                    'capacity' => 4,
                    'seat_minimum' => 2,
                    'seat_maximum' => 6,
                    'type' => 'round'
                ],
                [
                    'id' => 2,
                    'name' => 'Table 2',
                    'capacity' => 4,
                    'seat_minimum' => 2,
                    'seat_maximum' => 6,
                    'type' => 'round'
                ]
            ]
        ]);

        $wedding = Wedding::factory()->create([
            'user_id' => $user->id,
            'venue_id' => $venue->id,
            'venue_layer_id' => $layer->id,
        ]);

        $guests = Guest::factory()->count(8)->create([
            'wedding_id' => $wedding->id,
        ]);

        $service = new AutoSeatService();
        $result = $service->generate($wedding, $layer);

        $this->assertArrayHasKey('allocations', $result);
        $this->assertArrayHasKey('tables', $result);
        $this->assertArrayHasKey('venue_layer_id', $result);
        $this->assertArrayHasKey('score', $result);

        $totalAllocated = 0;
        foreach ($result['allocations'] as $tableGuests) {
            $totalAllocated += count($tableGuests);
        }

        $this->assertEquals(8, $totalAllocated);
    }

    public function test_seating_allocation_with_groups_and_conflicts(): void
    {
        $user = User::factory()->create();
        $venue = Venue::factory()->create([]);

        $layer = VenueLayer::create([
            'venue_id' => $venue->id,
            'user_id' => $user->id,
            'name' => 'Layer 1',
            'table_data' => [
                [
                    'id' => 1,
                    'name' => 'Table 1',
                    'capacity' => 4,
                    'seat_minimum' => 2,
                    'seat_maximum' => 6,
                    'type' => 'top'
                ],
                [
                    'id' => 2,
                    'name' => 'Table 2',
                    'capacity' => 4,
                    'seat_minimum' => 2,
                    'seat_maximum' => 6,
                    'type' => 'round'
                ]
            ]
        ]);

        $wedding = Wedding::factory()->create([
            'user_id' => $user->id,
            'venue_id' => $venue->id,
            'venue_layer_id' => $layer->id,
        ]);

        // Create partners
        $partnerA = Guest::factory()->create([
            'wedding_id' => $wedding->id,
            'role' => GuestRole::PARTNER_A->value,
            'name' => 'Partner A'
        ]);
        $partnerB = Guest::factory()->create([
            'wedding_id' => $wedding->id,
            'role' => GuestRole::PARTNER_B->value,
            'name' => 'Partner B'
        ]);

        // Create 2 groups
        $groupA = Group::create(['name' => 'Group A', 'wedding_id' => $wedding->id, 'ranking' => 1, 'colour' => '#ff0000']);
        $groupB = Group::create(['name' => 'Group B', 'wedding_id' => $wedding->id, 'ranking' => 2, 'colour' => '#00ff00']);

        // Create guests for Group A (3 guests)
        $guestsA = Guest::factory()->count(3)->create(['wedding_id' => $wedding->id]);
        foreach ($guestsA as $guest) {
            $guest->groups()->attach($groupA);
        }

        // Create guests for Group B (3 guests)
        $guestsB = Guest::factory()->count(3)->create(['wedding_id' => $wedding->id]);
        foreach ($guestsB as $guest) {
            $guest->groups()->attach($groupB);
        }

        // Create a conflict between two guests in Group A
        GuestConflict::create([
            'wedding_id' => $wedding->id,
            'guest_a_id' => $guestsA[0]->id,
            'guest_b_id' => $guestsA[1]->id,
            'conflict_reason' => 'Argument'
        ]);

        $service = new AutoSeatService();
        $result = $service->generate($wedding, $layer, [
            'currentAllocations' => [
                1 => [$partnerA->id, $partnerB->id]
            ]
        ]);

        // Assertions
        $allocation = $result['allocations'];

        // Partners should be on Table 1 (type top)
        $this->assertContains($partnerA->id, $allocation[1], 'Partner A should be on table 1');
        $this->assertContains($partnerB->id, $allocation[1], 'Partner B should be on table 1');

        // Guests with conflict should be on different tables
        $tableWithGuestA0 = null;
        $tableWithGuestA1 = null;

        foreach ($allocation as $tableId => $guestIds) {
            if (in_array($guestsA[0]->id, $guestIds)) {
                $tableWithGuestA0 = $tableId;
            }
            if (in_array($guestsA[1]->id, $guestIds)) {
                $tableWithGuestA1 = $tableId;
            }
        }

        $this->assertNotEquals($tableWithGuestA0, $tableWithGuestA1, 'Guests with conflict should be on different tables');

        // Check that group B stayed together if possible (3 guests, capacity is 4-6)
        $tableWithGroupB = null;
        $groupBCount = 0;
        foreach ($allocation as $tableId => $guestIds) {
            $count = 0;
            foreach ($guestsB as $guest) {
                if (in_array($guest->id, $guestIds)) {
                    $count++;
                }
            }
            if ($count > $groupBCount) {
                $groupBCount = $count;
                $tableWithGroupB = $tableId;
            }
        }
        $this->assertEquals(3, $groupBCount, 'Group B should be seated together');
    }

    public function test_seating_allocation_throws_exception_if_not_enough_capacity(): void
    {
        $user = User::factory()->create();
        $venue = Venue::factory()->create([]);

        $layer = VenueLayer::create([
            'venue_id' => $venue->id,
            'user_id' => $user->id,
            'name' => 'Small Layer',
            'table_data' => [
                [
                    'id' => 1,
                    'name' => 'Small Table',
                    'capacity' => 2,
                    'seat_minimum' => 1,
                    'seat_maximum' => 2,
                    'type' => 'round'
                ]
            ]
        ]);

        $wedding = Wedding::factory()->create([
            'user_id' => $user->id,
            'venue_id' => $venue->id,
            'venue_layer_id' => $layer->id,
        ]);

        // 3 guests for a capacity of 2
        Guest::factory()->count(3)->create(['wedding_id' => $wedding->id]);

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('No suitable layer found');

        $service = new AutoSeatService();
        $service->generate($wedding, $layer);
    }

    public function test_seating_allocation_with_string_table_ids(): void
    {
        $user = User::factory()->create();
        $venue = Venue::factory()->create([]);
        $layer = VenueLayer::factory()->create([
            'venue_id' => $venue->id,
            'table_data' => [
                ['id' => 'round-1', 'type' => 'round', 'seat_maximum' => 10],
                ['id' => 'round-2', 'type' => 'round', 'seat_maximum' => 10],
            ]
        ]);

        $wedding = Wedding::factory()->create([
            'venue_id' => $venue->id,
            'venue_layer_id' => $layer->id,
            'user_id' => $user->id
        ]);

        $guests = Guest::factory()->count(10)->create(['wedding_id' => $wedding->id]);

        // Create a conflict that MUST be resolved
        $guestA = $guests[0];
        $guestB = $guests[1];

        GuestConflict::create([
            'wedding_id' => $wedding->id,
            'guest_a_id' => $guestA->id,
            'guest_b_id' => $guestB->id
        ]);

        $service = new AutoSeatService();
        $result = $service->generate($wedding, $layer);

        $this->assertArrayHasKey('allocations', $result);

        // Check that guestA and guestB are on different tables
        $table1Guests = $result['allocations']['round-1'] ?? [];
        $table2Guests = $result['allocations']['round-2'] ?? [];

        $onTable1 = in_array($guestA->id, $table1Guests) && in_array($guestB->id, $table1Guests);
        $onTable2 = in_array($guestA->id, $table2Guests) && in_array($guestB->id, $table2Guests);

        $this->assertFalse($onTable1, 'Conflicting guests should not be on round-1 together');
        $this->assertFalse($onTable2, 'Conflicting guests should not be on round-2 together');
    }

    public function test_seating_allocation_locks_top_table(): void
    {
        $user = User::factory()->create();
        $venue = Venue::factory()->create([]);
        $layer = VenueLayer::factory()->create([
            'venue_id' => $venue->id,
            'table_data' => [
                ['id' => 'top-1', 'type' => 'top', 'seat_maximum' => 4, 'seats_per_side' => 1],
                ['id' => 'round-1', 'type' => 'round', 'seat_maximum' => 10],
            ]
        ]);

        $wedding = Wedding::factory()->create([
            'venue_id' => $venue->id,
            'venue_layer_id' => $layer->id,
            'user_id' => $user->id
        ]);

        $guests = Guest::factory()->count(10)->create(['wedding_id' => $wedding->id]);
        $guestToLock = $guests[0];

        $options = [
            'currentAllocations' => [
                'top-1' => [
                    '0' => $guestToLock->id
                ]
            ]
        ];

        $service = new AutoSeatService();
        $result = $service->generate($wedding, $layer, $options);

        $this->assertArrayHasKey('allocations', $result);
        $this->assertArrayHasKey('top-1', $result['allocations']);

        // The locked guest should still be on the top table at the same index
        $this->assertEquals($guestToLock->id, $result['allocations']['top-1'][0]);

        // Ensure the guest is not duplicated on other tables
        $totalOccurrences = 0;
        foreach ($result['allocations'] as $tableId => $guestIds) {
            foreach ($guestIds as $gid) {
                if ($gid == $guestToLock->id) {
                    $totalOccurrences++;
                }
            }
        }
        $this->assertEquals(1, $totalOccurrences, 'Locked guest should only appear once');
    }
}
