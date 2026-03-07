import CreateGroup from '@/components/groups/create-group';
import EditGroup from '@/components/groups/edit-group';
import DeleteGroup from '@/components/groups/delete-group';
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
import groups from '@/routes/groups';
import { BreadcrumbItem, Group } from '@/types';
import { Head } from '@inertiajs/react';
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

export default function GuestGroupings({ groups: groupList }: { groups: Group[] }) {
    const [open, setOpen] = React.useState(false);
    const [editOpen, setEditOpen] = React.useState(false);
    const [selectedGroup, setSelectedGroup] = React.useState<Group | null>(null);

    const handleEdit = (group: Group) => {
        setSelectedGroup(group);
        setEditOpen(true);
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Guest Groupings',
            href: groups.index.url(),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Guest Groupings" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="relative flex-1 rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-semibold">My Groups</h2>
                        <Button
                            variant={'outline'}
                            onClick={() => setOpen(true)}
                        >
                            Create New Group
                        </Button>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Relationship</TableHead>
                                    <TableHead>Guest Count</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {groupList.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={3}
                                            className="h-24 text-center"
                                        >
                                            No groups found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    groupList.map((group) => (
                                        <TableRow key={group.id}>
                                            <TableCell className="font-medium">
                                                {group.name}
                                            </TableCell>
                                            <TableCell className="capitalize">
                                                {group.relationship}
                                            </TableCell>
                                            <TableCell className="capitalize">
                                                {group.guests_count}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="brand"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleEdit(group)
                                                    }
                                                >
                                                    <Edit />
                                                </Button>
                                                <Button
                                                    variant="brand"
                                                    size="sm"
                                                    className="text-destructive"
                                                    onClick={() =>
                                                        DeleteGroup(group.id)
                                                    }
                                                >
                                                    <Trash2 />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <CreateGroup open={open} setOpen={setOpen} />
                    <EditGroup
                        open={editOpen}
                        setOpen={setEditOpen}
                        group={selectedGroup}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
