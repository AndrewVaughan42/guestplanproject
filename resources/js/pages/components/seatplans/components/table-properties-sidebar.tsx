import { Button, Input } from '@headlessui/react';
import { Table } from 'resources/js/types';

interface TablePropertiesSidebarProps {
    table: Table;
    onUpdate: <K extends keyof Table>(key: string, value: Table[K]) => void;
    onClose: () => void;
}
export function TablePropertiesSidebar({
    table,
    onUpdate,
    onClose,
}: TablePropertiesSidebarProps) {
    return (
        <div className="flex h-full w-full flex-col gap-4 overflow-y-auto border-sidebar-border bg-sidebar p-4">
            {/*Header*/}
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Table Properties</h3>

                <Button onClick={onClose}>X</Button>
            </div>

            {/*Name*/}
            <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Table Name</label>
                    <input
                        type="text"
                        value={table.name}
                        onChange={(e) => onUpdate('name', e.target.value)}
                        className="w-full rounded-lg border bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-primary"
                    />
                </div>
            </div>

            {/*Seat Inputs (Round)*/}
            {table.type === 'round' && (
                <div className="flex flex-col gap-3">
                    <label className={'text-xs text-muted-foreground'}>
                        Seats
                    </label>
                    <div className={'flex items-center gap-2'}>
                        <Input
                            type={'number'}
                            min={0}
                            max={table.seat_maximum}
                            value={table.seat_minimum}
                            onChange={(e) =>
                                onUpdate('seat_count', Number(e.target.value))
                            }
                            className={'w-20 rounded border px-2 py-1 text-sm'}
                            placeholder={'Minimum'}
                        />

                        <span className={'text-xs'}>to</span>

                        <Input
                            type={'number'}
                            min={table.seat_minimum}
                            max={20}
                            value={table.seat_maximum}
                            onChange={(e) =>
                                onUpdate('seat_maximum', Number(e.target.value))
                            }
                            placeholder={'Maximum'}
                            className={'w-16'}
                        />
                    </div>
                    <p className={'text-xs text-muted-foreground'}>
                        Layer capacity: {table.seat_minimum}-
                        {table.seat_maximum} for this table
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
                            onUpdate(
                                'seats_per_side',
                                Number(
                                    e.target.value,
                                ),
                            )
                        }
                        className="w-20 border rounded px-2 py-1 text-sm"
                    />

                    <p className="text-xs text-muted-foreground">
                        Total seats:
                        {table.seats_per_side *
                            2 +
                            2}
                        (includes Bride & Groom)
                    </p>

                    <p className="text-xs text-muted-foreground">
                        Bride and Groom seats are
                        fixed and cannot be edited.
                    </p>
                </div>
            )}

            {/* Delete table (only for round tables) */}
            {table.type !== 'top' && (
                <button
                    className="text-red-500 text-sm mt-auto"
                    onClick={onClose}
                >
                    Delete Table
                </button>
            )}
        </div>
    );
}
