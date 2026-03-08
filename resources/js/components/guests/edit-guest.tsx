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
import { Guest } from '@/types';
import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { Textarea } from '@headlessui/react';

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
        meal_choice: guest?.meal_choice || '',
        notes: guest?.notes || '',
    });

    useEffect(() => {
        if (guest) {
            setData({
                id: guest.id,
                name: guest.name,
                meal_choice: guest.meal_choice || '',
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
                        <Label htmlFor="edit-meal_choice">Meal Choice</Label>
                        <Input
                            id="edit-meal_choice"
                            type="text"
                            value={data.meal_choice || ''}
                            placeholder="e.g. Beef, Vegan, etc."
                            onChange={(e) =>
                                setData('meal_choice', e.target.value)
                            }
                        />
                        {errors.meal_choice && (
                            <span className="text-sm text-destructive">
                                {errors.meal_choice}
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
