import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import groups from '@/routes/groups';
import { Group, Guest } from '@/types';
import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';

export default function ManageGroupMembers({
    open,
    setOpen,
    group,
    guests,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    group: Group;
    guests: Guest[];
}) {
    type GroupMemberForm = {
        guest_ids: number[];
    };
    const { data, setData, patch, processing } = useForm<GroupMemberForm>({
        guest_ids: [],
    });
    const isSelected = (guest: Guest) => data.guest_ids.includes(Number(guest.id));
    const [search, setSearch] = React.useState('');

    const filteredGuests = guests.filter((guest) =>
        guest.name.toLowerCase().includes(search.toLowerCase()),
    );

    useEffect(() => {
        if (!open || !group) return;

        setData(
            'guest_ids', group.guests?.map((guest: Guest) => Number(guest.id)) ?? [],
        );
    }, [group, open, setData]);

    function toggleGuest(guest: Guest) {
        const id = Number(guest.id);
        setData(
            'guest_ids',
            data.guest_ids.includes(id)
                ? data.guest_ids.filter((selectedId: number) => selectedId !== id)
                : [...data.guest_ids, id],
        );
    }

    function submit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        patch(
            groups.syncGuests(group.id).url,
            {
                preserveScroll: true,
                onSuccess: () => setOpen(false),
            },
        );
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className={'flex max-h-125 flex-col sm:max-w-lg'}>
                <form onSubmit={submit} className="flex h-full flex-col overflow-hidden">
                    <DialogHeader>
                        <DialogTitle>Manage Group Members</DialogTitle>
                    </DialogHeader>

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={'Search guests...'}
                        className={
                            'mb-2 w-full rounded border bg-background px-2 py-1 text-sm text-guestplan'
                        }
                    />
                    <div className={'flex-1 space-y-2 overflow-y-auto pr-2'}>
                        {filteredGuests.map((guest) => (
                            <label
                                key={guest.id}
                                className={
                                    'flex cursor-pointer items-center gap-2 rounded p-2 transition'
                                }
                            >
                                <input
                                    type="checkbox"
                                    checked={data.guest_ids.includes(
                                        Number(guest.id),
                                    )}
                                    onChange={() => toggleGuest(guest)}
                                    className={"accent-guestplan"}
                                />
                                <span className={isSelected(guest) ? 'text-guestplan' : ''}>{guest.name}</span>
                            </label>
                        ))}
                    </div>

                    <DialogFooter className={'border-t pt-3'}>
                        <div className={'flex w-full justify-end gap-2'}>
                            <Button
                                type={'button'}
                                variant="outline"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing} >
                                Save
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
