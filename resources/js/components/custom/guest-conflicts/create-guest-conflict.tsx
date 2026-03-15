import React from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { GuestConflict, Guest, SharedData } from '@/types';
import conflicts from '@/routes/conflicts';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@headlessui/react';
import { Button } from '@/components/ui/button';

export default function CreateGuestConflict({ open, setOpen, guests }: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    guests: Guest[];
}) {
    const { auth } = usePage<SharedData>().props;
    const weddingId = auth.user.wedding?.id;

    const { data, setData, post, processing, reset, errors } = useForm<Partial<GuestConflict>>({
        guest_a_id: 0,
        guest_b_id: 0,
        conflict_reason: '',
        wedding_id: weddingId,
    });

    function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        post(conflicts.store().url,
            {
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
                    <DialogTitle>Add Guest Conflict</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="guest_a_id">First Guest</Label>
                        <Select
                            onValueChange={(value) => setData('guest_a_id', parseInt(value))}
                            value={data.guest_a_id?.toString() === '0' ? undefined : data.guest_a_id?.toString()}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select first guest" />
                            </SelectTrigger>
                            <SelectContent>
                                {guests.map((guest) => (
                                    <SelectItem key={guest.id} value={guest.id?.toString() || ''}>
                                        {guest.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.guest_a_id && <span className="text-sm text-destructive">{errors.guest_a_id}</span>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="guest_b_id">Second Guest</Label>
                        <Select
                            onValueChange={(value) => setData('guest_b_id', parseInt(value))}
                            value={data.guest_b_id?.toString() === '0' ? undefined : data.guest_b_id?.toString()}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select second guest" />
                            </SelectTrigger>
                            <SelectContent>
                                {guests.map((guest) => (
                                    <SelectItem key={guest.id} value={guest.id?.toString() || ''}>
                                        {guest.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.guest_b_id && <span className="text-sm text-destructive">{errors.guest_b_id}</span>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="conflict_reason">Conflict Reason (Optional)</Label>
                        <Textarea
                            id="conflict_reason"
                            className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={data.conflict_reason || ''}
                            placeholder="Why do these guests have a conflict?"
                            onChange={(e) => setData('conflict_reason', e.target.value)}
                        />
                        {errors.conflict_reason && <span className="text-sm text-destructive">{errors.conflict_reason}</span>}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Add Conflict'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>

    );
}
