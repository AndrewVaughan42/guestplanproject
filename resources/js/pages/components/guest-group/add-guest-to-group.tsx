import React, { useEffect } from 'react';
import { Guest, Group } from 'resources/js/types';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useForm } from '@inertiajs/react';

export default function AddGuestToGroup({
    open,
    setOpen,
    guest,
    groups,
}: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    guest: Guest | null;
    groups: Group[];
}) {
    const { data, setData, post, processing, reset } = useForm({
        group_id: '',
        guest_id: guest?.id,
    });

    useEffect(() => {
        if (guest) setData('guest_id', guest.id)
    }, [guest, setData]);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!guest?.id || !data.group_id) return;

        post(`groups/${data.group_id}/guests`, {
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Add {guest?.name} to Seating Group</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="group-select">Select Group</Label>
                        <Select
                            value={data.group_id}
                            onValueChange={(value) => setData('group_id', value)}
                        >
                            <SelectTrigger id="group-select">
                                <SelectValue placeholder="Select a group" />
                            </SelectTrigger>
                            <SelectContent>
                                {groups.map((group) => (
                                    <SelectItem key={group.id} value={group.id.toString()}>
                                        {group.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter className="mt-4">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => {
                                setOpen(false);
                                reset();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing || !data.group_id}>
                            {processing ? 'Adding...' : 'Add to Group'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
