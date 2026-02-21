import { useForm } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';
import { Textarea } from '@headlessui/react';
import guests from '@/routes/guests';
import { Guest } from '@/types';


export default function CreateGuest({ open, setOpen }: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {

    const { data, setData, post, processing, reset, errors } = useForm<Guest>({
        name: '',
        mealChoice: '',
        notes: '',
    });

    function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        post(guests.store().url,
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
                    <DialogTitle>Add New Guest</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Guest Name</Label>
                        <Input
                            id="name"
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
                        <Label htmlFor="mealChoice">Meal Choice</Label>
                        <Input
                            id="mealChoice"
                            type="text"
                            value={data.mealChoice || ''}
                            placeholder="e.g. Beef, Vegan, etc."
                            onChange={(e) => setData('mealChoice', e.target.value)}
                        />
                        {errors.mealChoice && (
                            <span className="text-sm text-destructive">
                                {errors.mealChoice}
                            </span>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            value={data.notes || ''}
                            placeholder="Allergies, special requirements, etc."
                            onChange={(e) => setData('notes', e.target.value)}
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
                                reset();
                                setOpen(false);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Adding...' : 'Add Guest'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
