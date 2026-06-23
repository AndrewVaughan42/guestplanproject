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
import ManageGroupMembers from '@/pages/components/groups/manage-group-members';
import groups from '@/routes/groups';
import { BreadcrumbItem, Group, Guest } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ArrowDown, ArrowUp, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import CreateGroup from '../components/groups/create-group';
import DeleteGroup from '../components/groups/delete-group';
import EditGroup from '../components/groups/edit-group';

function moveGroup(groupId: number, direction: 'up' | 'down') {
    router.patch(
        groups.move(groupId).url,
        {
            direction,
        },
        {
            preserveScroll: true,
        },
    );
}

export default function GuestGroupings({
    groups: groupList,
    guests,
}: {
    groups: Group[];
    guests: Guest[];
}) {
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [membersOpen, setMembersOpen] = useState(false);

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
                                    <TableHead className="text-xl font-bold">
                                        Group Name
                                    </TableHead>
                                    <TableHead className="text-xl font-bold">
                                        Colour
                                    </TableHead>
                                    <TableHead className="text-xl font-bold">
                                        Ranking
                                    </TableHead>
                                    <TableHead className="text-xl font-bold">
                                        Description
                                    </TableHead>
                                    <TableHead className="text-xl font-bold">
                                        Guest Count
                                    </TableHead>
                                    <TableHead className="text-right text-xl font-bold">
                                        Guests
                                    </TableHead>
                                    <TableHead className="text-right text-xl">
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
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={
                                                            'h-4 w-4 rounded-full border'
                                                        }
                                                        style={{
                                                            backgroundColor:
                                                                group.colour,
                                                        }}
                                                    ></span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="capitalize">
                                                <div
                                                    className={
                                                        'flex items-center gap-3'
                                                    }
                                                >
                                                    <span
                                                        className={
                                                            'min-h-5 text-center'
                                                        }
                                                    >
                                                        {group.ranking}
                                                    </span>

                                                    <div className="flex items-center gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            disabled={
                                                                group.ranking ===
                                                                1
                                                            }
                                                            onClick={() => {
                                                                if (
                                                                    group.ranking ===
                                                                    1
                                                                )
                                                                    return;
                                                                moveGroup(
                                                                    group.id,
                                                                    'up',
                                                                );
                                                            }}
                                                        >
                                                            <ArrowUp className="h-8 w-8" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-5 w-5"
                                                            disabled={
                                                                group.ranking ===
                                                                groupList.length
                                                            }
                                                            onClick={() => {
                                                                if (
                                                                    group.ranking ===
                                                                    groupList.length
                                                                )
                                                                    return;
                                                                moveGroup(
                                                                    group.id,
                                                                    'down',
                                                                );
                                                            }}
                                                        >
                                                            <ArrowDown className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {group.description}
                                            </TableCell>
                                            <TableCell className="capitalize">
                                                {group.guests_count}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    onClick={() => {
                                                        setSelectedGroup(group);
                                                        setMembersOpen(true);
                                                    }}
                                                    className="items-center bg-guestplan"
                                                >
                                                    Edit Members
                                                </Button>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-amber-400"
                                                        onClick={() =>
                                                            handleEdit(group)
                                                        }
                                                    >
                                                        <Edit />
                                                    </Button>

                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-destructive"
                                                        onClick={() =>
                                                            DeleteGroup(
                                                                group.id,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <CreateGroup
                        open={open}
                        setOpen={setOpen}
                        existingGroups={groupList}
                    />
                    <EditGroup
                        open={editOpen}
                        setOpen={setEditOpen}
                        group={selectedGroup}
                    />
                    {membersOpen && selectedGroup && (
                        <ManageGroupMembers
                            open={membersOpen}
                            setOpen={setMembersOpen}
                            group={selectedGroup!}
                            guests={guests}
                        />
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
