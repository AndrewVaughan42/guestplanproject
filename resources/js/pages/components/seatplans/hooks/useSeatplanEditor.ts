import { Allocations, Guest, GuestConflict, Table } from '@/types';
import { router } from '@inertiajs/react';
import { useCallback, useMemo, useState } from 'react';
import { useBaseCanvasEditor } from '@/pages/shared/hooks/useBaseCanvasEditor';

interface EditorProps {
    seatPlanId: number;
    guests: Guest[];
    tables: Table[];
    conflicts: GuestConflict[];
    initialAllocations: Allocations;
    initialTablePositions: Record<string, { x: number; y: number }>;
}

export function useSeatplanEditor({
    tables: initialTables,
    initialTablePositions,
    initialAllocations,
    conflicts,
    guests,
    seatPlanId,
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
    const [saving, setSaving] = useState(false);

    const guestMap = useMemo(
        () => new Map(guests.map((g) => [g.id, g])),
        [guests],
    );

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
        [setAllocations],
    );

    const unassignGuest = useCallback(
        ({ tableId, seatIndex }: { tableId: string; seatIndex: string }) => {
            setAllocations((prev) => {
                const next = structuredClone(prev);

                if (next[tableId]) {
                    delete next[tableId][seatIndex];
                }

                return next;
            });
        },
        [setAllocations],
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
                if (conflictsMap.get(unassigned.id)?.has(unassigned.id)) {
                    set.add(assignedId);
                }
            }),
        );
        return set;
    }, [assignedGuestIds, conflictsMap, unassignedGuests]);

    const updateTableSeatCount = useCallback(
        (table: Table, requestedCount: number) => {
            if (table.type === 'top') return;
            const seatCount = Math.max(
                table.seat_minimum,
                Math.min(table.seat_maximum, requestedCount),
            );

            updateTable(table.id, { seat_count: seatCount });
        },
        [updateTable],
    );

    const save = useCallback(() => {
        setSaving(true);
        router.patch(
            `seat-plans/${seatPlanId}`,
            {
                allocations,
                table_data: JSON.parse(JSON.stringify(tables)),
            },
            {
                preserveScroll: true,
                onFinish: () => setSaving(false),
            },
        );
    }, [allocations, seatPlanId, tables]);

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
        assignGuest,
        unassignGuest,
        updateTableSeatCount,
        save,
        saving,
    };
}
