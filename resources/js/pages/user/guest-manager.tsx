import { Head } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout';
import  { BreadcrumbItem, Guest } from '@/types';
import guests from '@/routes/guests';
import { Trash2, Edit } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import DeleteGuest from '@/components/guests/delete-guest';
import CreateGuest from '@/components/guests/create-guest';
import EditGuest from '@/components/guests/edit-guest';
import AddGuestToPositiveGroup from '@/components/guest-group/add-guest-to-positive-group';
import AddGuestToNegativeGroup from '@/components/guest-group/add-guest-to-negative-group';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Guest Manager',
        href: guests.index().url},
];
export default function GuestManager({ guests = [] }: { guests: Guest[] }) {
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

    const handleEdit = (guest: Guest) => {
        setSelectedGuest(guest);
        setEditOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Guest Manager" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="relative flex-1 rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                    <h2 className="mb-4 text-xl font-semibold">My Guests</h2>
                    {/*Guest Table */}
                    <div>
                        {/*Guest Table Buttons*/}
                        <div id={'guestManagerButtons'}>
                            <Button
                                className={'mb-4'}
                                variant={'outline'}
                                onClick={() => setOpen(true)}
                            >
                                Create New Guest
                            </Button>
                            <CreateGuest open={open} setOpen={setOpen} />
                            <EditGuest
                                open={editOpen}
                                setOpen={setEditOpen}
                                guest={selectedGuest}
                            />
                            TODO Import List
                        </div>
                        <Table className={'mt-4'}>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-left font-bold">
                                        <span className="text-2xl">Name</span>
                                    </TableHead>
                                    <TableHead className="text-center font-bold">
                                        <span className="text-2xl">
                                            Meal Choice
                                        </span>
                                    </TableHead>
                                    <TableHead className="text-right font-bold">
                                        <span className="text-2xl">Notes</span>
                                    </TableHead>
                                    <TableHead className="text-right font-bold">
                                        <span className="text-2xl">
                                            Actions
                                        </span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {guests.length > 0 ? (
                                    guests.map((guest) => (
                                        <TableRow key={guest.id}>
                                            <TableCell align={'left'}>
                                                {guest.name}
                                            </TableCell>
                                            <TableCell align={'center'}>
                                                {guest.mealChoice}
                                            </TableCell>
                                            <TableCell align={'right'}>
                                                {guest.notes}
                                            </TableCell>
                                            <TableCell
                                                className={
                                                    'flex items-center justify-end gap-2'
                                                }
                                            >
                                                <Button
                                                    onClick={() =>
                                                        AddGuestToPositiveGroup(
                                                            guest.id,
                                                        )
                                                    }
                                                ></Button>
                                                <Button
                                                    onClick={() =>
                                                        AddGuestToNegativeGroup(
                                                            guest.id,
                                                        )
                                                    }
                                                ></Button>
                                                <Button
                                                    variant={'ghost'}
                                                    size={'icon'}
                                                    onClick={() =>
                                                        handleEdit(guest)
                                                    }
                                                >
                                                    <Edit />
                                                </Button>
                                                <Button
                                                    variant={'ghost'}
                                                    size={'icon'}
                                                    onClick={() =>
                                                        DeleteGuest(guest.id)
                                                    }
                                                >
                                                    <Trash2 />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="h-24 text-center"
                                        >
                                            No guests found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
