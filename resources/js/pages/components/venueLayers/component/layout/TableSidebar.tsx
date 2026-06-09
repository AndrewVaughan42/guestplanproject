import { Table } from '@/types';

interface TableSidebarProps {
    table: Table;
    onUpdate: <K extends keyof Table>(key: string, value: Table[K]) => void;
    onDelete: () => void;
}

export function TableSidebar({ table, onUpdate, onDelete }: TableSidebarProps) {
    const topSeatClam = (value: number) => Math.max(0, Math.min(4, value));
    return (
        <div
            className={
                'flex w-80 flex-col gap-3 border-l border-sidebar-border p-4'
            }
        >
            <h3 className={'text-sm font-semibold'}>
                {table.type === 'round' ? 'Round Table' : 'Top Table'}
            </h3>
            <input
                value={table.name}
                onChange={(e) => {
                    onUpdate('name', e.target.value);
                }}
                className={'rounded border bg-background p-1'}
            />
            {table.type === 'round' && (
                <>
                    <div className={'flex gap-2'}>
                        <label className={'text-sm'}>Minimum Seats</label>
                        <input
                            type={'number'}
                            value={table.seat_minimum}
                            onChange={(e) => {
                                onUpdate(
                                    'seat_minimum',
                                    Number(e.target.value),
                                );
                            }}
                            className={'w-16 rounded border bg-background p-1'}
                        />
                    </div>

                    <div className={'flex gap-2'}>
                        <label className={'text-sm'}>Total Seats</label>
                        <input
                            type={'number'}
                            value={table.seat_count}
                            onChange={(e) => {
                                onUpdate('seat_count', Number(e.target.value));
                            }}
                            className={'w-16 rounded border bg-background p-1'}
                        />
                    </div>

                    <div className={'flex gap-2'}>
                        <label className={'text-sm'}>Maximum Seats</label>
                        <input
                            type={'number'}
                            value={table.seat_maximum}
                            onChange={(e) => {
                                onUpdate(
                                    'seat_maximum',
                                    Number(e.target.value),
                                );
                            }}
                            className={'w-16 rounded border bg-background p-1'}
                        />
                    </div>

                    <div className="flex items-center justify-between rounded border p-2">
                        <label className="text-sm">Lock Table</label>

                        <button
                            type="button"
                            onClick={() => onUpdate('locked', !table.locked)}
                            className={`relative h-5 w-10 rounded-full transition ${table.locked ? 'bg-destructive' : 'bg-muted'} `}
                        >
                            <span
                                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${table.locked ? 'left-5' : 'left-0.5'} `}
                            />
                        </button>
                    </div>

                    <button onClick={onDelete} className={'mt-4 text-red-500'}>
                        Delete
                    </button>
                </>
            )}

            {table.type === 'top' && (
                <div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm">Seats Per Side</label>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() =>
                                    onUpdate(
                                        'seats_per_side',
                                        topSeatClam(table.seats_per_side - 1),
                                    )
                                }
                                disabled={table.seats_per_side <= 0}
                                className="w-8 rounded border bg-background text-center hover:bg-accent disabled:opacity-50"
                            >
                                −
                            </button>

                            <input
                                type="number"
                                value={table.seats_per_side}
                                onChange={(e) =>
                                    onUpdate(
                                        'seats_per_side',
                                        topSeatClam(Number(e.target.value)),
                                    )
                                }
                                className="w-16 rounded border bg-background p-1 text-center"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    onUpdate(
                                        'seats_per_side',
                                        topSeatClam(table.seats_per_side + 1),
                                    )
                                }
                                disabled={table.seats_per_side >= 4}
                                className="w-8 rounded border bg-background text-center hover:bg-accent disabled:opacity-50"
                            >
                                +
                            </button>
                        </div>

                        <p className="text-xs text-muted-foreground">
                            Min: 0, Max: 4
                        </p>
                    </div>

                    <div className={'rounded border bg-muted p-3 text-sm'}>
                        <p>Seats of the Couple are fixed.</p>

                        <p>Total seats: {table.seats_per_side * 2 + 2}.</p>

                        <p>Guest seats: {table.seats_per_side * 2}</p>
                    </div>
                    <div className={'text-sm text-muted-foreground'}>
                        Top Table cannot be deleted
                    </div>
                    <div className="flex items-center justify-between rounded border p-2">
                        <label className="text-sm">Lock Table</label>

                        <button
                            type="button"
                            onClick={() => onUpdate('locked', !table.locked)}
                            className={`relative h-5 w-10 rounded-full transition ${table.locked ? 'bg-destructive' : 'bg-muted'} `}
                        >
                            <span
                                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${table.locked ? 'left-5' : 'left-0.5'} `}
                            />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
