import AppLayout from '@/layouts/app-layout';

import GuestSidebar from '@/pages/components/seatplans/components/guest-sidebar';
import { CanvasToolbar } from '@/pages/components/seatplans/components/CanvasToolbar';

import { LayoutCanvas } from '@/pages/shared/LayoutCanvas';
import seatPlans from '@/routes/seat-plans';
import type {
    Allocations,
    BreadcrumbItem,
    Guest,
    GuestConflict,
    VenueLayer,
} from '@/types';
import { Head } from '@inertiajs/react';
import React, { useCallback } from 'react';
import TableChairsGroup from '../components/seatplans/components/table-chairs-group';
import { useSeatplanEditor } from '@/pages/components/seatplans/hooks/useSeatplanEditor';
import { usePanZoom } from '@/pages/shared/hooks/usePanZoom';

interface SeatPlanProps {
    venueLayersLayout: VenueLayer;
    guests: Guest[];
    initialAllocations: Allocations;
    initialTablePositions: Record<string, { x: number; y: number }>;
    seatPlanId: number;
    conflicts: GuestConflict[];
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
}: SeatPlanProps) {
    const editor = useSeatplanEditor({
        seatPlanId,
        initialAllocations,
        initialTablePositions,
        guests,
        conflicts,
        tables: venueLayersLayout.table_data
    });

    const { scale, pos, setPos, handleWithScrollWheel, reset, centreTables } = usePanZoom();

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

    const handleGuestUnassignment = (tableId: string, seatIndex: string) => {
        unassignGuest({ tableId, seatIndex });
    };

    const handleSave = useCallback(() => {
        save();
    }, [save]);

    const handleAutoSeat = useCallback(() => {
        //For Seating Algorithm
    }, []);

    if (!venueLayersLayout) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="SeatPlan" />
                <div className="flex h-full flex-1 items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold">No Venue Layout Found</h2>
                        <p className="text-muted-foreground mt-2">
                            Error: No Venue Layouts Found, please contact your wedding coordinator.
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
                />

                <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
                    <CanvasToolbar
                        scale={scale}
                        saving={saving}
                        onReset={reset}
                        onSave={handleSave}
                        onAutoSeat={handleAutoSeat}
                    />

                    <LayoutCanvas
                        tables={tables}
                        scale={scale}
                        pos={pos}
                        setPos={setPos}
                        setScale={() => {}}
                        handleWithScrollWheel={handleWithScrollWheel}
                        centreTables={centreTables}
                        setPosition={setPos}
                        onSelect={() => {}}
                        onMove={moveTable}
                        selectedId={null}
                        onDrop={(e) => {
                            e.preventDefault();
                            const guestId = Number(
                                e.dataTransfer.getData('guest_id'),
                            );

                            if (selectedSeat && !isNaN(guestId)) {
                                const [tableId, seatIndex] =
                                    selectedSeat.split('-');
                                handleGuestAssignment(
                                    guestId,
                                    tableId,
                                    seatIndex,
                                );
                                setSelectedSeat(null);
                            }
                        }}
                        onDragOver={(e) => e.preventDefault()}
                    >
                        {tables.map((table) => (
                            <TableChairsGroup
                                table={table}
                                key={table.id}
                                guestMap={guestMap}
                                tableAllocations={allocations[table.id]}
                                onDragEnd={handleTableEndDrag}
                                hasConflict={tableConflicts[table.id]}
                                onSeatClick={(seatId) => {
                                    if (selectedSeat === seatId) {
                                        setSelectedSeat(null);
                                        return;
                                    }

                                    const [tableId, seatIndex] =
                                        seatId.split('-');
                                    const existingGuestId =
                                        allocations[tableId]?.[
                                            seatIndex
                                        ];
                                    if (existingGuestId) {
                                        handleGuestUnassignment(
                                            tableId,
                                            seatIndex,
                                        );
                                    } else {
                                        setSelectedSeat(seatId);
                                    }
                                }}
                                selectedSeat={selectedSeat}
                            />
                        ))}
                    </LayoutCanvas>
                </div>
            </div>
        </AppLayout>
    );
}
