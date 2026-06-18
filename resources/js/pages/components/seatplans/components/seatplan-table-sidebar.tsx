import {
    isBrideSeat,
    isGroomSeat,
} from '@/pages/components/venueLayers/component/utils/seatHelper';
import { Button, Input } from '@headlessui/react';
import { Guest, Table } from 'resources/js/types';

interface TablePropertiesSidebarProps {
    table: Table;
    onClose: () => void;
    allocations?: Record<string, number | null>;
    guestMap?: Map<number, Guest>;
    onUpdate: (updates: Partial<Table>) => void;
    onUnassign?: (tableId: string, seatIndex: number) => void;
}
export function SeatplanTableSidebar({
    table,
    onUpdate,
    onClose,
    allocations,
    guestMap,
    onUnassign,
}: TablePropertiesSidebarProps) {
    const topSeatClam = (value: number) => Math.max(0, value);
    return (
        <div className="flex h-full w-80 flex-col gap-4 overflow-y-auto border-sidebar-border bg-sidebar p-4">
            {/*Header*/}
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Table Properties</h3>

                <Button onClick={onClose}>X</Button>
            </div>

            {/*Name*/}
            <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">
                        Table Name (Optional)
                    </label>
                    <input
                        type="text"
                        value={table.name}
                        onChange={(e) => onUpdate({ name: e.target.value })}
                        className="w-full rounded-lg border bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-primary"
                    />
                </div>
            </div>

            {/*Seat Inputs (Round)*/}
            {table.type === 'round' && (
                <div className="flex flex-col gap-3">
                    <label className={'text-xs text-muted-foreground'}>
                        Seat Count
                    </label>
                    <div className={'flex items-center gap-2'}>
                        <Input
                            type={'number'}
                            min={table.seat_minimum}
                            max={table.seat_maximum}
                            value={table.seat_count}
                            onChange={(e) =>
                                onUpdate({
                                    seat_count: Math.max(
                                        table.seat_minimum,
                                        Math.min(
                                            table.seat_maximum,
                                            Number(e.target.value),
                                        ),
                                    ),
                                })
                            }
                            className={'w-20 rounded border px-2 py-1 text-sm'}
                            placeholder={'Minimum'}
                        />
                    </div>
                    <p className={'text-xs text-muted-foreground'}>
                        Allowed Range: {table.seat_minimum} -{' '}
                        {table.seat_maximum}
                    </p>
                </div>
            )}

            {table.type === 'top' && (
                <div className="flex flex-col gap-3">
                    <label className="text-sm font-medium">
                        Seats Per Side
                    </label>

                    <input
                        type="number"
                        min={0}
                        max={4}
                        value={table.seats_per_side}
                        onChange={(e) =>
                            onUpdate({
                                seats_per_side: topSeatClam(Number(e.target.value)),
                            })
                        }
                        className="w-20 rounded border px-2 py-1 text-sm"
                    />

                    <p className="text-xs text-muted-foreground">
                        Guest seats:
                        {table.seats_per_side * 2}
                    </p>

                    <p className="text-xs text-muted-foreground">
                        Total seats:
                        {table.seats_per_side * 2 + 2} (includes Bride & Groom)
                    </p>

                    <p className="text-xs font-semibold text-muted-foreground">
                        Bride and Groom seats are fixed and cannot be edited.
                    </p>
                </div>
            )}

            <div className="flex flex-col gap-2">
                <h4 className="text-sm font-medium">Seat Assignments</h4>

                <div className="max-h-64 overflow-y-auto rounded border">
                    {Array.from({
                        length:
                            table.type === 'round'
                                ? table.seat_count
                                : table.seats_per_side * 2 + 2,
                    }).map((_, index) => {
                        const guestId =
                            allocations?.[index] ??
                            allocations?.[String(index)] ??
                            null;
                        const guest = guestId
                            ? guestMap?.get(Number(guestId))
                            : null;

                        let seatLabel = `Seat ${index + 1}: `;
                        let isFixed = false;
                        if (table.type === 'top') {
                            if (
                                isBrideSeat(index, table) ||
                                isGroomSeat(index, table)
                            ) {
                                seatLabel = 'Special: ';
                                isFixed = true;
                            }
                        }

                        return (
                            <div
                                key={index}
                                className="flex items-center gap-2 px-2 py-1"
                            >
                                <span
                                    className={
                                        isFixed
                                            ? 'font-semibold text-primary'
                                            : ''
                                    }
                                >
                                    {seatLabel}
                                </span>
                                <span
                                    className={`${isFixed ? 'font-semibold text-primary' : 'text-muted-foreground'}`}
                                >
                                    {guest?.name ?? 'Empty Seat'}
                                </span>

                                {guest && guest.role === 'normal' &&(
                                    <button
                                        className="ml-auto"
                                        onClick={() => onUnassign?.(table.id, index)}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
