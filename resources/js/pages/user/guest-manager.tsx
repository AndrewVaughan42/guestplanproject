import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import guestRoutes from '@/routes/guests';
import { BreadcrumbItem, Group, Guest, MenuItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import AddGuestToGroup from '../components/guest-group/add-guest-to-group';
import CreateGuest from '../components/guests/create-guest';
import DeleteGuest from '../components/guests/delete-guest';
import EditGuest from '../components/guests/edit-guest';
import GuestStatusBadge from '../components/guests/guest-status-badge';
import GuestlistUpload from '../components/guests/guestlist-upload';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Guest Manager',
        href: guestRoutes.index().url,
    },
];
export default function GuestManager({
    guests = [],
    groups = [],
    myMenuItems = [],
}: {
    guests: Guest[];
    groups: Group[];
    myMenuItems: MenuItem[];
}) {
    //New Guest Dialog
    const [createOpen, setCreateOpen] = useState(false);
    //Edit Guest Dialog
    const [editOpen, setEditOpen] = useState(false);
    //Selection of Guest For EditING, Adding to Groups
    const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
    //Adding to Group UseState
    const [guestToPositiveOpen, setGuestToPositiveOpen] = useState(false);

    //Import Guests in bulk
    const [importOpen, setImportOpen] = useState(false);

    const getMenuItemName = (id: number | null | undefined) => {
        return myMenuItems.find((item) => item.id === id)?.name ?? '—';
    };

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
                                menuItems={myMenuItems}
                            />
                            <Button
                                className={'mb-4 hover:text-guestplan'}
                                variant={'outline'}
                                onClick={() => setImportOpen(true)}
                            >
                                Import Guests
                            </Button>
                            <GuestlistUpload
                                onImport={(guestList) => {
                                    router.post(guestRoutes.import().url, {
                                        guests: guestList,
                                    });
                                }}
                                open={importOpen}
                                setOpen={setImportOpen}
                            />
                        </div>
                        <Table className="mt-4 w-full table-fixed">
                            <TableHeader>
                                <TableRow className="text-guestplan">
                                    <TableHead className="text-left font-bold">
                                        <span className="text-xl">Name</span>
                                    </TableHead>
                                    <TableHead className="text-center font-bold">
                                        <span className="text-xl">
                                            Meal Choice
                                        </span>
                                    </TableHead>
                                    <TableHead className="text-right font-bold">
                                        <span className="text-xl">Status</span>
                                    </TableHead>
                                    <TableHead className="text-center font-bold">
                                        <span className="text-xl">Notes</span>
                                    </TableHead>
                                    <TableHead className="text-center font-bold">
                                        <span className="text-xl">
                                            Quick-Group
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
                                                {getMenuItemName(
                                                    guest.menu_item_id,
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <GuestStatusBadge
                                                    guest={guest}
                                                    status={guest.status}
                                                />
                                            </TableCell>
                                            <TableCell className="text-center">
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
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-amber-400"
                                                        onClick={() => {
                                                            if (!guest) return;
                                                            handleEdit(guest);
                                                        }}
                                                    >
                                                        <Edit />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive"
                                                        onClick={() => {
                                                            if (!guest.id)
                                                                return;
                                                            DeleteGuest(
                                                                guest.id,
                                                            );
                                                        }}
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
                        <EditGuest
                            open={editOpen}
                            setOpen={setEditOpen}
                            guest={selectedGuest}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
