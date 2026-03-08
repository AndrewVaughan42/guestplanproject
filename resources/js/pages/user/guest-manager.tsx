import { Head } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout';
import  { BreadcrumbItem, Guest, Group } from '@/types';
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
import AddGuestToGroup from '@/components/guest-group/add-guest-to-group';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Guest Manager',
        href: guests.index().url},
];
export default function GuestManager({ guests = [], groups = [] }: { guests: Guest[], groups: Group[] }) {
    //New Guest Dialog
    const [createOpen, setCreateOpen] = useState(false);
    //Edit Guest Dialog
    const [editOpen, setEditOpen] = useState(false);
    //Selection of Guest For EditING, Adding to Groups
    const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
    //Adding to Group UseState
    const [guestToPositiveOpen, setGuestToPositiveOpen] = useState(false);

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
                                className={'mb-4 hover:text-guestplan'}
                                variant={'outline'}
                                onClick={() => setCreateOpen(true)}
                            >
                                Create New Guest
                            </Button>
                            <CreateGuest
                                open={createOpen}
                                setOpen={setCreateOpen}
                            />
                            <Button
                                className={'mb-4 hover:text-guestplan'}
                                variant={'outline'}
                            >
                                Import Guests via File
                            </Button>
                            <EditGuest
                                open={editOpen}
                                setOpen={setEditOpen}
                                guest={selectedGuest}
                            />
                            TODO Import List
                        </div>
                        <Table className='mt-4'>
                            <TableHeader>
                                <TableRow className='text-guestplan'>
                                    <TableHead className="text-left font-bold">
                                        <span className="text-xl">Name</span>
                                    </TableHead>
                                    <TableHead className="text-center font-bold">
                                        <span className="text-xl">
                                            Meal Choice
                                        </span>
                                    </TableHead>
                                    <TableHead className="text-right font-bold">
                                        <span className="text-xl">Notes</span>
                                    </TableHead>
                                    <TableHead
                                        className='text-center font-bold'
                                    >
                                        <span className="text-xl">
                                            Grouping Actions
                                        </span>
                                    </TableHead>
                                    <TableHead className="text-right font-bold">
                                        <span className="text-xl">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {guests.length > 0 ? (
                                    guests.map((guest) => (
                                        <TableRow key={guest.id}>
                                            <TableCell className="text-left">
                                                {guest.name}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {guest.meal_choice}
                                            </TableCell>
                                            <TableCell className="text-center ">
                                                {guest.notes}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button
                                                        className={
                                                            'mb-4 hover:text-guestplan'
                                                        }
                                                        variant={'outline'}
                                                        onClick={() => {
                                                            setSelectedGuest(
                                                                guest,
                                                            );
                                                            setGuestToPositiveOpen(
                                                                true,
                                                            );
                                                        }}
                                                    >
                                                        Add to Seating Group
                                                    </Button>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant='brand'
                                                        size='icon'
                                                        onClick={() =>
                                                            handleEdit(guest)
                                                        }
                                                    >
                                                        <Edit />
                                                    </Button>
                                                    <Button
                                                        variant='brand'
                                                        size='icon'
                                                        onClick={() =>
                                                            DeleteGuest(
                                                                guest.id,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 />
                                                    </Button>
                                                </div>
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
                        <AddGuestToGroup
                            open={guestToPositiveOpen}
                            setOpen={setGuestToPositiveOpen}
                            guest={selectedGuest}
                            groups={groups}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
