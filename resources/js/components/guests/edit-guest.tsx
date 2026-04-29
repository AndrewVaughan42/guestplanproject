import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import guests from '@/routes/guests';
import { Guest, GuestStatus } from '@/types';
import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { Textarea } from '@headlessui/react';
import { Select, SelectItem, SelectTrigger } from '@radix-ui/react-select';
import { SelectContent, SelectValue } from '@/components/ui/select';

export default function EditGuest({
    open,
    setOpen,
    guest,
}: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    guest: Guest | null;
}) {
    const { data, setData, put, processing, reset, errors } = useForm<Guest>({
        id: guest?.id || 0,
        name: guest?.name || '',
        status: guest?.status || 'invited',
        menu_item_id: guest?.menu_item_id || null,
        notes: guest?.notes || '',
    });

    useEffect(() => {
        if (guest) {
            setData({
                id: guest.id,
                name: guest.name,
                status: guest.status,
                menu_item_id: guest.menu_item_id || null,
                notes: guest.notes || '',
            });
        }
    }, [guest, setData]);

    function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!guest?.id) return;

        put(guests.update(guest.id).url, {
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit Guest</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="edit-name">Guest Name</Label>
                        <Input
                            id="edit-name"
                            required
                            aria-required="true"
                            type="text"
                            value={data.name}
                            placeholder="Enter guest name"
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && (
                            <span className="text-sm text-destructive">
                                {errors.name}
                            </span>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="edit-status">Status</Label>
                        <Select
                            value={data.status}
                            onValueChange={(value: GuestStatus) =>
                                setData('status', value)
                            }
                        >
                            <SelectTrigger id="edit-status">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="invited">Invited</SelectItem>
                                <SelectItem value="confirmed">
                                    Confirmed
                                </SelectItem>
                                <SelectItem value="declined">
                                    Declined
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.status && (
                            <span className="text-sm text-destructive">
                                {errors.status}
                            </span>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="edit-notes">Notes</Label>
                        <Textarea
                            id="edit-notes"
                            value={data.notes || ''}
                            placeholder="Allergies, special requirements, etc."
                            onChange={(e: {
                                target: { value: string | null };
                            }) => setData('notes', e.target.value)}
                        />
                        {errors.notes && (
                            <span className="text-sm text-destructive">
                                {errors.notes}
                            </span>
                        )}
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
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
