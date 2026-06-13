import AppLayout from '@/layouts/app-layout';

import { CanvasToolbar } from '@/pages/components/seatplans/components/CanvasToolbar';
import GuestSidebar from '@/pages/components/seatplans/components/guest-sidebar';

import { SeatplanTableSidebar } from '@/pages/components/seatplans/components/seatplan-table-sidebar';
import { useSeatplanEditor } from '@/pages/components/seatplans/hooks/useSeatplanEditor';
import { usePanZoom } from '@/pages/shared/hooks/usePanZoom';
import { LayoutCanvas } from '@/pages/shared/LayoutCanvas';
import seatPlans from '@/routes/seat-plans';
import type {
    Allocations,
    BreadcrumbItem,
    Guest,
    GuestConflict,
    Table,
    VenueLayer,
} from '@/types';
import { Head } from '@inertiajs/react';
import { useCallback } from 'react';
import TableChairsGroup from '../components/seatplans/components/table-chairs-group';

interface SeatPlanProps {
    venueLayersLayout: VenueLayer;
    guests: Guest[];
    initialAllocations: Allocations;
    initialTablePositions: Record<string, { x: number; y: number }>;
    seatPlanId: number;
    conflicts: GuestConflict[];
    lockedGuests: number[];
}
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'SeatPlan',
        href: seatPlans.index.url(),
    },
];

export default function SeatPlan({
    seatPlanId,
    initialAllocations,
    initialTablePositions,
    venueLayersLayout,
    guests,
    conflicts,
    lockedGuests,
}: SeatPlanProps) {
    const editor = useSeatplanEditor({
        lockedGuests,
        seatPlanId,
        initialAllocations,
        initialTablePositions,
        guests,
        conflicts,
        tables: venueLayersLayout.table_data,
    });

    const { scale, pos, setPos, handleWithScrollWheel, reset, centreTables } =
        usePanZoom();

    const {
        tables,
        allocations,
        guestMap,
        tableConflicts,
        unassignedGuests,
        conflictsWithUnassigned,
        save,
        saving,
        moveTable,
        assignGuest,
        unassignGuest,
        selectedSeat,
        setSelectedSeat,
        selectedTableId,
        selectedTable,
        setSelectedTableId,
        activeGuestId,
        setActiveGuestId,
        updateTopSeatCount,
        updateRoundSeatCount,
    } = editor;

    const handleTableEndDrag = useCallback(
        (tableId: string, x: number, y: number) => {
            moveTable(tableId, x, y);
        },
        [moveTable],
    );

    const handleGuestAssignment = (
        guestId: number,
        tableId: string,
        seatIndex: string,
    ) => {
        assignGuest({ guestId, tableId, seatIndex });
    };

    const handleSave = useCallback(() => {
        save();
    }, [save]);

    const handleTableUpdate = useCallback(
        (updates: Partial<Table>) => {
            if (!selectedTable) return;

            if ('seat_count' in updates && selectedTable.type === 'round') {
                updateRoundSeatCount(selectedTable, updates.seat_count!);
            } else if (
                'seats_per_side' in updates &&
                selectedTable.type === 'top'
            ) {
                updateTopSeatCount(selectedTable, updates.seats_per_side!);
            } else {
                console.error('Invalid update type');
                return;
            }
        },
        [selectedTable, updateRoundSeatCount, updateTopSeatCount],
    );

    const handleUnassign = (tableId: string, seatIndex: number) => {
        unassignGuest({ tableId, seatIndex });
    }

    const handleAutoSeat = useCallback(() => {
        //For Seating Algorithm     TODO
    }, []);

    const handleSeatClick = (seatId: string, isBrideOrGroomSeat: boolean) => {
        if (activeGuestId) {
            const activeGuest = guestMap.get(activeGuestId);
            const isPartner =
                activeGuest?.role === 'partner_a' ||
                activeGuest?.role === 'partner_b';

            if (isBrideOrGroomSeat && !isPartner) {
                return;
            }
            if (activeGuestId) {
                const lastDash = seatId.lastIndexOf('-');
                const tableId = seatId.substring(0, lastDash);
                const seatIndex = seatId.substring(lastDash + 1);

                // Check if seat is already occupied
                const isOccupied = Boolean(
                    allocations[tableId]?.[String(seatIndex)],
                );
                if (isOccupied) {
                    setSelectedSeat(seatId);
                    return;
                }

                handleGuestAssignment(activeGuestId, tableId, seatIndex);
                setActiveGuestId(null);
                setSelectedSeat(null);
                return;
            }

            if (selectedSeat === seatId) {
                setSelectedSeat(null);
                return;
            }

            setSelectedSeat(seatId);
        }
    };

    if (!venueLayersLayout) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="SeatPlan" />
                <div className="flex h-full flex-1 items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold">Error!</h2>
                        <p className="mt-2 text-muted-foreground">
                            No Venue Layouts Found, please contact your wedding
                            coordinator.
                        </p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="SeatPlan" />
            <div className="flex h-[calc(100vh-65px)] min-h-0 overflow-hidden">
                <GuestSidebar
                    guests={unassignedGuests}
                    conflictsWithAssigned={conflictsWithUnassigned}
                    activeGuestId={activeGuestId}
                    onGuestClick={(guestId) =>
                        setActiveGuestId(
                            activeGuestId === guestId ? null : guestId,
                        )
                    }
                />
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                    <CanvasToolbar
                        scale={scale}
                        saving={saving}
                        onReset={reset}
                        onSave={handleSave}
                        onAutoSeat={handleAutoSeat}
                    />

                    <div className="relative flex min-h-0 flex-1 overflow-hidden">
                        <LayoutCanvas
                            tables={tables}
                            scale={scale}
                            pos={pos}
                            setPos={setPos}
                            setScale={() => {}}
                            handleWithScrollWheel={handleWithScrollWheel}
                            centreTables={centreTables}
                            setPosition={setPos}
                            onSelect={() => setSelectedTableId(null)}
                            onMove={moveTable}
                            selectedId={selectedTableId}
                            onContextMenu={(e) => {
                                e.evt.preventDefault();
                                const stage = e.target.getStage();
                                if (!stage) return;
                                const pos = stage.getPointerPosition();
                                if (!pos) return;

                                const element = stage.getIntersection(pos);
                                if (element && element.name()) {
                                    const seatId = element.name();
                                    if (seatId.includes('-')) {
                                        const [tableId, seatIndex] =
                                            seatId.split('-');
                                        unassignGuest({ tableId, seatIndex: Number(seatIndex) });
                                        if (selectedSeat === seatId)
                                            setSelectedSeat(null);
                                    }
                                }
                            }}
                        >
                            {tables.map((table) => (
                                <TableChairsGroup
                                    table={table}
                                    key={table.id}
                                    guestMap={guestMap}
                                    tableAllocations={allocations[table.id]}
                                    activeGuestId={activeGuestId}
                                    selectedSeat={selectedSeat}
                                    selectedTableId={selectedTableId}
                                    hasConflict={tableConflicts[table.id]}
                                    onDragEnd={handleTableEndDrag}
                                    onSeatClick={handleSeatClick}
                                    onSelectTable={setSelectedTableId}
                                />
                            ))}
                        </LayoutCanvas>

                        {selectedTableId && (
                            <div className="absolute top-0 right-0 z-10 h-full border-l bg-background shadow-lg">
                                <SeatplanTableSidebar
                                    table={selectedTable!}
                                    onUpdate={(table) =>
                                        handleTableUpdate(table)
                                    }
                                    onClose={() => setSelectedTableId(null)}
                                    allocations={allocations[selectedTableId]}
                                    guestMap={guestMap}
                                    onUnassign={handleUnassign}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
