import { Input } from '@headlessui/react';
import { useState } from 'react';
import { Guest } from 'resources/js/types';

interface GuestSidebarProps {
    guests: Guest[];
    conflictsWithAssigned?: Set<number>;
    activeGuestId?: number | null;
    onGuestClick?: (guestId: number) => void;
}
export default function GuestSidebar({
    guests,
    conflictsWithAssigned,
    activeGuestId,
    onGuestClick,
}: GuestSidebarProps) {
    const [search, setSearch] = useState('');

    const filteredGuests = guests.filter((guest) =>
        guest.role === 'normal' &&
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
                            onClick={() => onGuestClick?.(guest.id)}
                            className={`cursor-pointer rounded-lg border p-2 text-sm shadow-sm transition-colors hover:bg-accent ${
                                activeGuestId === guest.id
                                    ? 'border-primary bg-primary/10 ring-2 ring-primary ring-inset'
                                    : 'border-sidebar-border bg-card'
                            }`}
                        >
                            <span>{guest.name}</span>
                            <div className="flex justify-between ">
                                {guest.groups?.map((group) => (
                                    <span
                                    key={group.id}
                                    title={group.name}
                                    className={"h-5 w-5 rounded-full border"}
                                    style={{backgroundColor: group.colour}}>
                                    </span>
                                ))}
                            </div>
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
