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
import { useCallback, useEffect, useState } from 'react';
import TableChairsGroup from '../components/seatplans/components/table-chairs-group';

interface SeatPlanProps {
    venueLayers: VenueLayer[];
    guests: Guest[];
    initialAllocations: Allocations;
    initialTables: Table[];
    seatPlanId: number;
    conflicts: GuestConflict[];
    lockedGuests: number[];
    venue_layer_id: number;
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
    initialTables,
    venueLayers,
    guests,
    conflicts,
    lockedGuests,
    venue_layer_id,
}: SeatPlanProps) {
    const editor = useSeatplanEditor({
        venue_layer_id: venue_layer_id,
        lockedGuests,
        seatPlanId,
        initialAllocations,
        guests,
        conflicts,
        tables: initialTables,
        venueLayers
    });

    const { scale, pos, setPos, handleWithScrollWheel, centreTables } =
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
        isDirty,
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
        moveOrAssignGuest,
        switchLayer,
        currentLayerId,
    } = editor;

    const [selectedAllocatedSeat, setSelectedAllocatedSeat] = useState<{
        tableId: string;
        seatIndex: number;
    } | null>(null);

    const handleTableEndDrag = useCallback(
        (tableId: string, x: number, y: number) => {
            moveTable(tableId, x, y);
        },
        [moveTable],
    );

    const handleSave = useCallback(() => {
        save();
    }, [save]);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

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
    };

    const handleAutoSeat = useCallback(() => {
        //For Seating Algorithm     TODO
    }, []);

    const handleSeatClick = (seatId: string) => {
        const lastDash = seatId.lastIndexOf('-');
        const tableId = seatId.substring(0, lastDash);
        const seatIndex = Number(seatId.substring(lastDash + 1));

        const guestId = allocations[tableId]?.[String(seatIndex)];
        //Sidebar to Seatplan
        if (activeGuestId) {
            assignGuest({
                guestId: activeGuestId,
                tableId,
                seatIndex,
            });

            setActiveGuestId(null);
            return;
        }
        //Deselect
        if (
            selectedAllocatedSeat?.tableId === tableId &&
            selectedAllocatedSeat?.seatIndex === seatIndex
        ) {
            setSelectedAllocatedSeat(null);
            return;
        }

        if (selectedAllocatedSeat) {
            moveOrAssignGuest(selectedAllocatedSeat, {
                tableId,
                seatIndex: seatIndex,
            });
            setSelectedAllocatedSeat(null);
            return;
        }

        if (guestId) {
            if (lockedGuests.includes(guestId)) {
                return;
            }
            setSelectedAllocatedSeat({
                tableId,
                seatIndex,
            });
            return;
        }
    };

    const currentLayerIndex = venueLayers.findIndex(l => l.id === currentLayerId) + 1;

    const handlePreviousLayer = useCallback(() => {
        const currentIndex = venueLayers.findIndex(l => l.id === currentLayerId);
        if (currentIndex > 0) {
            switchLayer(venueLayers[currentIndex - 1].id);
        }
    }, [venueLayers, currentLayerId, switchLayer]);

    const handleNextLayer = useCallback(() => {
        const currentIndex = venueLayers.findIndex(l => l.id === currentLayerId);
        if (currentIndex < venueLayers.length - 1) {
            switchLayer(venueLayers[currentIndex + 1].id);
        }
    }, [venueLayers, currentLayerId, switchLayer]);

    if (!venueLayers) {
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
                        saving={saving}
                        onSave={handleSave}
                        onAutoSeat={handleAutoSeat}
                        currentLayer={currentLayerIndex}
                        totalLayers={venueLayers.length}
                        onPreviousLayer={handlePreviousLayer}
                        onNextLayer={handleNextLayer}
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
                                        unassignGuest({
                                            tableId,
                                            seatIndex: Number(seatIndex),
                                        });
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
                                    onSeatClick={(seatId) => handleSeatClick(seatId)}
                                    onSelectTable={setSelectedTableId}
                                    selectedAllocatedSeat={
                                        selectedAllocatedSeat
                                    }
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
