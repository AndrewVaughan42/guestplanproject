import { useBaseCanvasEditor } from '@/pages/shared/hooks/useBaseCanvasEditor';
import seatPlans from '@/routes/seat-plans';
import {
    Allocations,
    Guest,
    GuestConflict,
    RoundTable,
    Table,
    TopTable,
    VenueLayer,
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
    venueLayers: VenueLayer[];
    venue_layer_id: number;
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

    // Remove couple from ANY other table first to ensure they only exist on this one
    const brideId = lockedGuests[0] ?? null;
    const groomId = lockedGuests[1] ?? null;

    if (brideId !== null || groomId !== null) {
        Object.keys(next).forEach((tableId) => {
            const tableAlloc = next[tableId];
            Object.keys(tableAlloc).forEach((seat) => {
                const guestId = Number(tableAlloc[seat]);
                if (
                    (brideId !== null && guestId === brideId) ||
                    (groomId !== null && guestId === groomId)
                ) {
                    delete tableAlloc[seat];
                }
            });
        });
    }

    const tableAlloc = next[table.id] ?? {};
    const newTotalSeats = newSeatsPerSide * 2 + 2;

    const newBrideIndex = Math.floor(newTotalSeats / 2) - 1;
    const newGroomIndex = Math.floor(newTotalSeats / 2);

    const newAlloc: Record<string, number> = {};

    for (const [seatStr, guestId] of Object.entries(tableAlloc)) {
        const seat = Number(seatStr);
        if (!guestId) continue;

        const isBride = brideId !== null && Number(guestId) === brideId;
        const isGroom = groomId !== null && Number(guestId) === groomId;

        // Skip if it's the bride or groom, they'll be placed at the center
        if (isBride || isGroom) continue;

        // Skip if it's the new center seats (will be occupied by bride/groom)
        if (seat === newBrideIndex || seat === newGroomIndex) continue;

        // Skip if outside new bounds
        if (seat >= newTotalSeats) continue;

        newAlloc[seat] = Number(guestId);
    }

    if (brideId != null) {
        newAlloc[String(newBrideIndex)] = brideId;
    }

    if (groomId != null) {
        newAlloc[String(newGroomIndex)] = groomId;
    }
    next[table.id] = newAlloc;
    return next;
}
//Reassigning allocations during layer change
function reconcileAllocations(
    allocations: Allocations,
    tables: Table[],
): Allocations {
    const next: Allocations = structuredClone(allocations);
    const tableMap = new Map(tables.map((table) => [table.id, table]));

    for (const [tableId, seats] of Object.entries(next)) {
        const table = tableMap.get(tableId);
        if (!table) {
            delete next[tableId];
            continue;
        }

        const maxSeats =
            table.type === 'round'
                ? table.seat_count
                : table.seats_per_side * 2 + 2;

        for (const [seatIndex] of Object.entries(seats)) {
            const seat = Number(seatIndex);

            if (seat >= maxSeats) {
                delete next[tableId][seatIndex];
            }
        }
    }
    return next;
}

export function useSeatplanEditor({
    tables: initialTables,
    initialAllocations,
    conflicts,
    guests,
    seatPlanId,
    lockedGuests,
    venueLayers,
    venue_layer_id,
}: EditorProps) {
    const [currentLayerId, setCurrentLayerId] = useState(venue_layer_id);

    const activeLayer = useMemo(() => {
        return (
            venueLayers.find((layer) => layer.id === currentLayerId) ??
            venueLayers[0]
        );
    }, [currentLayerId, venueLayers]);

    const baseTables = useMemo(() => {
        return activeLayer.table_data.map((tempTable: Table) => {
            const savedTable = initialTables.find((t) => t.id === tempTable.id);
            if (!savedTable) return tempTable;

            return {
                ...tempTable,
                ...savedTable,
            } as Table;
        });
    }, [activeLayer.table_data, initialTables]);

    const base = useBaseCanvasEditor(baseTables);
    const { tables, updateTable, setTables } = base;

    const [isDirty, setIsDirty] = useState(false);

    //const [lockedGuestIds] = useState<Set<number>>(new Set(lockedGuests));

    const normalizedAllocations: Allocations = Object.fromEntries(
        Object.entries(initialAllocations).map(([tableId, seats]) => [
            tableId,
            Object.fromEntries(
                Object.entries(seats).map(([seat, guestId]) => [
                    seat,
                    Number(guestId),
                ]),
            ),
        ]),
    );

    const [allocations, setAllocations] = useState<Allocations>(
        normalizedAllocations || {},
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

    const isLockedGuest = useCallback(
        (guestId: number) => lockedGuestIds.has(guestId),
        [lockedGuestIds],
    );

    const assignGuest = useCallback(
        ({
            guestId,
            tableId,
            seatIndex,
        }: {
            guestId: number;
            tableId: string;
            seatIndex: number;
        }) => {
            const isPartner = isLockedGuest(guestId);
            setIsDirty(true);
            setAllocations((prev) => {
                const next = structuredClone(prev);

                const table = tables.find((t) => t.id === tableId);
                if (isPartner && table?.type === 'top') {
                    return cleanTopAllocation(
                        next,
                        table as TopTable,
                        (table as TopTable).seats_per_side,
                        lockedGuests,
                    );
                }

                if (isPartner) return prev; // Partners can only be assigned via cleanTopAllocation logic (which is automated)

                // Remove guest from any existing seat
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
        [setAllocations, isLockedGuest, tables, lockedGuests],
    );

    const moveOrAssignGuest = (
        from: { tableId: string; seatIndex: number },
        to: { tableId: string; seatIndex: number },
    ) => {
        setIsDirty(true);
        setAllocations((prev) => {
            const next = structuredClone(prev);

            const fromKey = from.seatIndex;
            const toKey = to.seatIndex;

            const sourceGuest = next[from.tableId]?.[fromKey] ?? null;
            const targetGuest = next[to.tableId]?.[toKey] ?? null;

            if (!sourceGuest) return prev;

            if (
                isLockedGuest(sourceGuest) ||
                (targetGuest && isLockedGuest(targetGuest))
            )
                return prev;

            next[from.tableId] ??= {};
            next[to.tableId] ??= {};

            // If empty target seat
            if (!targetGuest) {
                delete next[from.tableId][fromKey];
                next[to.tableId][toKey] = sourceGuest;
                return next;
            }
            //swap guests in seats
            next[from.tableId][fromKey] = targetGuest;
            next[to.tableId][toKey] = sourceGuest;
            return next;
        });
    };

    const getLayerTables = useCallback(
        (layer: VenueLayer) => {
            return layer.table_data.map((templateTable: Table) => {
                const savedTable = initialTables.find(
                    (t) => t.id === templateTable.id,
                );
                return savedTable
                    ? { ...templateTable, ...savedTable }
                    : templateTable;
            });
        },
        [initialTables],
    );


    const switchLayer = useCallback(
        (layerId: number) => {
            const nextLayer = venueLayers.find((l) => l.id === layerId);
            if (!nextLayer) return;

            const nextTables = getLayerTables(nextLayer);

            let nextAllocations = reconcileAllocations(allocations, nextTables);

            const topTable = nextTables.find(
                (t) => t.type === 'top',
            ) as TopTable;

            if (topTable) {
                nextAllocations = cleanTopAllocation(
                    nextAllocations,
                    topTable,
                    topTable.seats_per_side,
                    lockedGuests,
                );
            }

            setSelectedTableId(null);
            setSelectedSeat(null);
            setActiveGuestId(null);

            setAllocations(nextAllocations);
            setTables(nextTables);
            setCurrentLayerId(layerId);
            setIsDirty(true);
        },
        [
            allocations,
            getLayerTables,
            lockedGuests,
            setTables,
            venueLayers,
        ],
    );

    const unassignGuest = useCallback(
        ({ tableId, seatIndex }: { tableId: string; seatIndex: number }) => {
            setIsDirty(true);
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
            setIsDirty(true);

            setAllocations((prev) => cleanRoundAllocation(prev, table, safe));
        },
        [updateTable],
    );

    const updateTopSeatCount = useCallback(
        (table: TopTable, count: number) => {
            const safe = Math.max(0, count);

            updateTable(table.id, { seats_per_side: safe });
            setIsDirty(true);

            setAllocations((prev) =>
                cleanTopAllocation(prev, table, safe, lockedGuests),
            );
        },
        [updateTable, lockedGuests],
    );

    const cleanAllocations = useMemo(() => {
        return Object.fromEntries(
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
    }, [allocations]);

    type TablePayload = | {
        id: string;
        type: 'top';
        x: number;
        y: number;
        seats_per_side: number;
    } | {
        id: string;
        type: 'round';
        x: number;
        y: number;
        seat_count: number;
    }

    const save = useCallback(() => {
        if (!seatPlanId) return;

        setSaving(true);
        router.patch(
            seatPlans.update(seatPlanId).url,
            {
                venue_layer_id: currentLayerId,
                layout: {
                    allocations: cleanAllocations,
                    tables: initialTables.map<TablePayload>((table) => {
                        const current = tables.find((t) => t.id === table.id);
                        if (!current) return table;
                        return {
                            ...table,
                            x: current.x,
                            y: current.y,
                            ...(current.type === 'top'
                                ? { seats_per_side: current.seats_per_side }
                                : { seat_count: current.seat_count }),
                        };
                    }),
                },
            },
            {
                preserveScroll: true,
                onSuccess: () => setIsDirty(false),
                onFinish: () => setSaving(false),
            },
        );
    }, [
        cleanAllocations,
        currentLayerId,
        initialTables,
        seatPlanId,
        tables,
    ]);

    return {
        ...base,
        allocations,
        guestMap,
        conflictsMap,
        tableConflicts,
        unassignedGuests,
        conflictsWithUnassigned,
        assignedGuestIds,
        moveOrAssignGuest,
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
        isDirty,
        setAllocations,
        reconcileAllocations,
        switchLayer,
        currentLayerId,
    };
}
