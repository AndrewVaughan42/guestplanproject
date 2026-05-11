import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Venue } from 'resources/js/types';
import venues from '@/routes/venues';


export default function AddVenue({ open, setOpen }: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {

    const { data, setData, post, processing, reset, errors } =
        useForm<Venue>({
            name: '',
            minimum_capacity: 0,
            maximum_capacity: 0,
            minimum_table_amount: 0,
            maximum_table_amount: 0,
        });

    function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        post(venues.store().url, {
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
                    <DialogTitle>Add Venue</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Venue Name</Label>
                        <Input
                            id="name"
                            required
                            aria-required="true"
                            type="text"
                            value={data.name}
                            placeholder="Enter venue name"
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && (
                            <span className="text-sm text-destructive">
                                {errors.name}
                            </span>
                        )}
                    </div>
                    {/* Venue Minimum Capacity */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-minimum_capacity">
                                Min Capacity
                            </Label>
                            <Input
                                id="edit-minimum_capacity"
                                required
                                type="number"
                                value={data.minimum_capacity}
                                onChange={(e) =>
                                    setData(
                                        'minimum_capacity',
                                        parseInt(e.target.value),
                                    )
                                }
                            />
                            {errors.minimum_capacity && (
                                <span className="text-sm text-destructive">
                                    {errors.minimum_capacity}
                                </span>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-maximum_capacity">
                                Max Capacity
                            </Label>
                            <Input
                                id="edit-maximum_capacity"
                                required
                                type="number"
                                value={data.maximum_capacity}
                                onChange={(e) =>
                                    setData(
                                        'maximum_capacity',
                                        parseInt(e.target.value),
                                    )
                                }
                            />
                            {errors.maximum_capacity && (
                                <span className="text-sm text-destructive">
                                    {errors.maximum_capacity}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-minimum_table_amount">
                                Min Tables
                            </Label>
                            <Input
                                id="edit-minimum_table_amount"
                                required
                                type="number"
                                value={data.minimum_table_amount}
                                onChange={(e) =>
                                    setData(
                                        'minimum_table_amount',
                                        parseInt(e.target.value),
                                    )
                                }
                            />
                            {errors.minimum_table_amount && (
                                <span className="text-sm text-destructive">
                                    {errors.minimum_table_amount}
                                </span>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-maximum_table_amount">
                                Max Tables
                            </Label>
                            <Input
                                id="edit-maximum_table_amount"
                                required
                                type="number"
                                value={data.maximum_table_amount}
                                onChange={(e) =>
                                    setData(
                                        'maximum_table_amount',
                                        parseInt(e.target.value),
                                    )
                                }
                            />
                            {errors.maximum_table_amount && (
                                <span className="text-sm text-destructive">
                                    {errors.maximum_table_amount}
                                </span>
                            )}
                        </div>
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
                            {processing ? 'Adding...' : 'Add Venue'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

