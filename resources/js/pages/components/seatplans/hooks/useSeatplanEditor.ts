import { useBaseCanvasEditor } from '@/pages/shared/hooks/useBaseCanvasEditor';
import seatPlans from '@/routes/seat-plans';
import {
    Allocations,
    Guest,
    GuestConflict,
    RoundTable,
    Table,
    TopTable,
} from '@/types';
import { router } from '@inertiajs/react';
import { useCallback, useMemo, useState } from 'react';

interface EditorProps {
    seatPlanId: number;
    guests: Guest[];
    tables: Table[];
    conflicts: GuestConflict[];
    lockedGuests: number[];
    initialAllocations: Allocations;
    initialTablePositions: Record<string, { x: number; y: number }>;
}

//Ensures seats unassigned if seat_count reduced.
function cleanRoundAllocation(
    allocation: Allocations,
    table: RoundTable,
    newCount: number,
) {
    const next = structuredClone(allocation);

    const tableAlloc = next[table.id];
    if (!tableAlloc) return next;

    Object.keys(tableAlloc).forEach((seat) => {
        const i = Number(seat);
        if (i >= newCount) {
            delete tableAlloc[seat];
        }
    });
    return next;
}

//For top tables, ensures seats unassigned if count reduced and placement of wedding couple always at centre
//This took way, WAY, too long to figure out.
function cleanTopAllocation(
    allocation: Allocations,
    table: TopTable,
    newSeatsPerSide: number,
    lockedGuests: number[] = [],
) {
    const next = structuredClone(allocation);
    const tableAlloc = next[table.id];
    if (!tableAlloc) return next;

    const oldTotalSeats = table.seats_per_side * 2 + 2;
    const newTotalSeats = newSeatsPerSide * 2 + 2;

    const oldBrideIndex = Math.floor(oldTotalSeats / 2) - 1;
    const oldGroomIndex = Math.floor(oldTotalSeats / 2);

    const newBrideIndex = Math.floor(newTotalSeats / 2) - 1;
    const newGroomIndex = Math.floor(newTotalSeats / 2);

    const brideId = tableAlloc[oldBrideIndex] || tableAlloc[String(oldBrideIndex)];
    const groomId = tableAlloc[oldGroomIndex] || tableAlloc[String(oldGroomIndex)];

    const isBrideLocked = brideId && lockedGuests.includes(Number(brideId));
    const isGroomLocked = groomId && lockedGuests.includes(Number(groomId));

    const newAlloc: Record<string, number> = {};

    Object.keys(tableAlloc).forEach((seat) => {
        const i = Number(seat);
        const guestId = tableAlloc[seat];
        if (!guestId) return;

        if (i === oldBrideIndex && isBrideLocked) {
            newAlloc[String(newBrideIndex)] = Number(guestId);
        } else if (i === oldGroomIndex && isGroomLocked) {
            newAlloc[String(newGroomIndex)] = Number(guestId);
        } else if (i < newTotalSeats && i !== newBrideIndex && i !== newGroomIndex) {
            // Keep other guests if they fit and don't clash with new middle seats
            newAlloc[seat] = Number(guestId);
        }
    });

    next[table.id] = newAlloc;
    return next;
}

export function useSeatplanEditor({
    tables: initialTables,
    initialTablePositions,
    initialAllocations,
    conflicts,
    guests,
    seatPlanId,
    lockedGuests,
}: EditorProps) {
    const base = useBaseCanvasEditor(
        initialTables.map((t) => ({
            ...t,
            x: initialTablePositions[t.id]?.x ?? t.x,
            y: initialTablePositions[t.id]?.y ?? t.y,
        })),
    );
    const { tables, updateTable } = base;

    const [allocations, setAllocations] = useState<Allocations>(
        initialAllocations || {},
    );
    const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
    const [activeGuestId, setActiveGuestId] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);

    const guestMap = useMemo(
        () => new Map(guests.map((g) => [g.id, g])),
        [guests],
    );

    const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

    const selectedTable = tables.find((t) => t.id === selectedTableId) ?? null;

    const [lockedGuestIds] = useState<Set<number>>(new Set(lockedGuests));

    const isLockedGuest = useCallback((guestId: number) => lockedGuestIds.has(guestId), [lockedGuestIds]);

    const assignGuest = useCallback(
        ({
            guestId,
            tableId,
            seatIndex,
        }: {
            guestId: number;
            tableId: string;
            seatIndex: string;
        }) => {
            if (isLockedGuest(guestId)) return;
            setAllocations((prev) => {
                const next = structuredClone(prev);

                Object.values(next).forEach((table) => {
                    Object.keys(table).forEach((seat) => {
                        if (table[seat] === guestId) {
                            delete table[seat];
                        }
                    });
                });
                next[tableId] ??= {};
                next[tableId][seatIndex] = guestId;
                return next;
            });
        },
        [setAllocations, isLockedGuest],
    );

    const unassignGuest = useCallback(
        ({ tableId, seatIndex }: { tableId: string; seatIndex: number }) => {
            setAllocations((prev) => {
                const guestId = prev[tableId]?.[seatIndex];
                if (guestId && isLockedGuest(Number(guestId))) return prev;

                const next = structuredClone(prev);

                if (next[tableId]) {
                    delete next[tableId][seatIndex];
                }

                return next;
            });
        },
        [setAllocations, isLockedGuest],
    );

    const assignedGuestIds = useMemo(
        () =>
            new Set(
                Object.values(allocations).flatMap((table) =>
                    Object.values(table).filter(Boolean),
                ),
            ),
        [allocations],
    );

    const unassignedGuests = useMemo(
        () => guests.filter((guest) => !assignedGuestIds.has(guest.id)),
        [assignedGuestIds, guests],
    );

    const conflictsMap = useMemo(() => {
        const map = new Map<number, Set<number>>();
        conflicts.forEach((c) => {
            if (!map.has(c.guest_a_id)) {
                map.set(c.guest_a_id, new Set());
            }

            if (!map.has(c.guest_b_id)) {
                map.set(c.guest_b_id, new Set());
            }

            map.get(c.guest_a_id)?.add(c.guest_b_id);
            map.get(c.guest_b_id)?.add(c.guest_a_id);
        });
        return map;
    }, [conflicts]);

    const tableConflicts = useMemo(() => {
        const result: Record<string, boolean> = {};

        Object.entries(allocations).forEach(([tableId, tableAlloc]) => {
            const guestIds = Object.values(tableAlloc).filter(Boolean);
            let hasConflict = false;

            for (let i = 0; i < guestIds.length; i++) {
                for (let j = i + 1; j < guestIds.length; j++) {
                    if (
                        conflictsMap
                            .get(guestIds[i] as number)
                            ?.has(guestIds[j] as number)
                    ) {
                        hasConflict = true;
                        break;
                    }
                }
                if (hasConflict) break;
            }

            result[tableId] = hasConflict;
        });

        return result;
    }, [allocations, conflictsMap]);

    const conflictsWithUnassigned = useMemo(() => {
        const set = new Set<number>();
        unassignedGuests.forEach((unassigned: { id: number }) =>
            assignedGuestIds.forEach((assignedId) => {
                if (
                    conflictsMap.get(unassigned.id)?.has(assignedId as number)
                ) {
                    set.add(unassigned.id);
                }
            }),
        );
        return set;
    }, [assignedGuestIds, conflictsMap, unassignedGuests]);

    const updateRoundSeatCount = useCallback(
        (table: RoundTable, count: number) => {
            const safe = Math.max(
                table.seat_minimum,
                Math.min(table.seat_maximum, count),
            );

            updateTable(table.id, { seat_count: safe });

            setAllocations((prev) =>
                cleanRoundAllocation(prev, table, safe)
            );
        },
        [updateTable],
    );

    const updateTopSeatCount = useCallback(
        (table: TopTable, count: number) => {
            const safe = Math.max(0, Math.min(4, count));

            updateTable(table.id, { seats_per_side: safe });

            setAllocations((prev) =>
                cleanTopAllocation(prev, table, safe, lockedGuests)
            );
        },
        [updateTable, lockedGuests],
    );

    const cleanAllocations = Object.fromEntries(
        Object.entries(allocations).map(([tableId, guests]) => [
            String(tableId),
            Object.fromEntries(
                Object.entries(guests).map(([seat, guestId]) => [
                    String(seat),
                    guestId,
                ]),
            ),
        ]),
    );




    const save = useCallback(() => {
        if (!seatPlanId) return;

        setSaving(true);
        router.patch(
            seatPlans.update(seatPlanId).url,
            {
                layout: {
                    allocations: cleanAllocations,
                },
            },
            {
                preserveScroll: true,
                onFinish: () => setSaving(false),
            },
        );
    }, [cleanAllocations, seatPlanId]);

    return {
        ...base,
        allocations,
        guestMap,
        conflictsMap,
        tableConflicts,
        unassignedGuests,
        conflictsWithUnassigned,
        assignedGuestIds,

        selectedSeat,
        setSelectedSeat,
        selectedTableId,
        setSelectedTableId,
        selectedTable,
        activeGuestId,
        setActiveGuestId,
        assignGuest,
        unassignGuest,
        updateRoundSeatCount,
        updateTopSeatCount,
        save,
        saving,
    };
}
