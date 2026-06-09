import { Input } from '@headlessui/react';
import { useState } from 'react';
import { Guest } from 'resources/js/types';

interface GuestSidebarProps {
    guests: Guest[];
    conflictsWithAssigned?: Set<number>;
}
export default function GuestSidebar({
    guests,
    conflictsWithAssigned,
}: GuestSidebarProps) {
    const [search, setSearch] = useState('');

    const filteredGuests = guests.filter((guest) =>
        guest.name.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <aside
            className={
                'flex w-64 flex-col min-h-0 gap-2 h-full border-r border-sidebar-border bg-sidebar p-4'
            }
        >
            <h2 className="text-lg font-semibold">Guests ({guests.length})</h2>

            <Input
                type="text"
                placeholder="Search guests..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mb-2 w-full rounded-md border border-sidebar-border bg-background px-3 py-1 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            />

            <div className="flex flex-col gap-2 flex-1 overflow-y-auto pr-1">
                {filteredGuests.length > 0 ? (
                    filteredGuests.map((guest) => (
                        <div
                            key={guest.id}
                            draggable
                            onDragStart={(e) => {
                                e.dataTransfer.setData(
                                    'guest_id',
                                    String(guest.id),
                                );
                            }}
                            className={`cursor-grab rounded-lg border border-sidebar-border p-2 text-sm shadow-sm hover:bg-accent active:cursor-grabbing ${
                                conflictsWithAssigned?.has(guest.id)
                                    ? 'border-red-200 bg-red-50 text-red-700'
                                    : 'bg-card'
                            }`}
                        >
                            <span>{guest.name}</span>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-sm text-muted-foreground">
                        No Guests found
                    </p>
                )}
            </div>
        </aside>
    );
}
