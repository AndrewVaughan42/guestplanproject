import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Guest, GuestConflict } from '@/types';
import conflicts from '@/routes/conflicts';
import { Head } from '@inertiajs/react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CreateGuestConflict from '../components/guest-conflicts/create-guest-conflict';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import DeleteGuestConflict from '../components/guest-conflicts/delete-guest-conflict';
import { Trash2 } from 'lucide-react';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Guest Conflicts',
        href: conflicts.index.url(),
    },
];

interface Props {
    'guest-conflicts': GuestConflict[];
    guests: Guest[];
}

export default function GuestConflicts({ 'guest-conflicts': guestConflicts, guests }: Props) {
    const [open, setOpen] = React.useState(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Guest Conflicts" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Guest Conflicts</h2>
                    <Button onClick={() => setOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Conflict
                    </Button>
                </div>
                <div className="flex-1 rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                    {guestConflicts.length === 0 ? (
                        <p className="text-muted-foreground">
                            No guest conflicts found.
                        </p>
                    ) : (
                        <div className="grid gap-4">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Guest 1</TableHead>
                                        <TableHead>Guest 2</TableHead>
                                        <TableHead>Reason for Conflict</TableHead>
                                        <TableHead className="w-12.5"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {guestConflicts.map((conflict) => (
                                        <TableRow key={conflict.id}>
                                            <TableCell>{conflict.guest_a?.name}</TableCell>
                                            <TableCell>{conflict.guest_b?.name}</TableCell>
                                            <TableCell>
                                                {conflict.conflict_reason || (
                                                    <span className="text-muted-foreground italic">
                                                        No reason provided
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => DeleteGuestConflict(conflict.id)}
                                                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            </div>

            <CreateGuestConflict
                open={open}
                setOpen={setOpen}
                guests={guests}
            />
        </AppLayout>
    );
}
