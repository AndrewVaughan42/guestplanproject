import guests from '@/routes/guests';
import { Guest, GuestStatus } from '@/types';
import { router } from '@inertiajs/react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function GuestStatusBadge({
    guest,
    status,
}: {
    guest: Guest;
    status: GuestStatus;
}) {
    const statusConfig = {
        invited: {
            color: 'bg-yellow-500 text-black',
            label: 'Invited',
        },
        confirmed: {
            color: 'bg-green-500 text-white',
            label: 'Confirmed',
        },
        declined: {
            color: 'bg-red-500 text-white',
            label: 'Declined',
        },
    } as const;

    const config = statusConfig[status];

    const updateStatus = (newStatus: GuestStatus) => {
        if (status === newStatus) return;
        router.patch(guests.update(guest.id).url, { status: newStatus });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <span
                    className={`cursor-pointer rounded-full px-2 py-1 text-xs font-semibold ${config.color}`}
                    title="Click to change status"
                >
                    {config.label}
                </span>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="center">
                {(
                    Object.entries(statusConfig) as [
                        GuestStatus,
                        (typeof statusConfig)[GuestStatus],
                    ][]
                ).map(([key, value]) => (
                    <DropdownMenuItem
                        key={key}
                        onClick={() => updateStatus(key)}
                        className={`flex items-center gap-2 ${
                            key === status ? 'cursor-default opacity-50' : ''
                        }`}
                    >
                        <span
                            className={`h-2 w-2 rounded-full ${value.color}`}
                        />
                        {value.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
