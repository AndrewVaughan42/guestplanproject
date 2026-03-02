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

import venues from '@/routes/venues';
import { Button } from '@/components/ui/button';
import { Venue } from '@/types';

export default function AddVenue({ open, setOpen }: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {

    const { data, setData, post, processing, reset, errors } =
        useForm<Venue>({
            name: '',
            minimumCapacity: 0,
            maximumCapacity: 0,
            minimumTableAmount: 0,
            maximumTableAmount: 0,
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
                        <Label htmlFor="title">Task Title</Label>
                        {/* Venue Name */}
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
                    <div className="grid gap-2">
                        <Label htmlFor="minimumCapacity">
                            Minimum Capacity
                        </Label>
                        <Input
                            id={'minimumCapacity'}
                            required
                            type={'number'}
                            value={data.minimumCapacity}
                            onChange={(e) =>
                                setData(
                                    'minimumCapacity',
                                    parseInt(e.target.value),
                                )
                            }
                        />
                        {errors.minimumCapacity && (
                            <span className="text-sm text-destructive">
                                {errors.minimumCapacity}
                            </span>
                        )}
                    </div>
                    {/* Venue Maximum Capacity */}
                    <div className="grid gap-2">
                        <Label htmlFor="maximumCapacity">
                            Maximum Capacity
                        </Label>
                        <Input
                            id={'maximumCapacity'}
                            required
                            type={'number'}
                            value={data.maximumCapacity}
                            onChange={(e) =>
                                setData(
                                    'maximumCapacity',
                                    parseInt(e.target.value),
                                )
                            }
                        />
                        {errors.maximumCapacity && (
                            <span className="text-sm text-destructive">
                                {errors.maximumCapacity}
                            </span>
                        )}
                    </div>
                    {/* Venue Minimum Table Amount */}
                    <div className="grid gap-2">
                        <Label htmlFor="minimumTableAmount">
                            Minimum Amount of Tables
                        </Label>
                        <Input
                            id={'minimumTableAmount'}
                            required
                            type={'number'}
                            value={data.minimumTableAmount}
                            onChange={(e) =>
                                setData(
                                    'minimumTableAmount',
                                    parseInt(e.target.value),
                                )
                            }
                        />
                        {errors.minimumTableAmount && (
                            <span className="text-sm text-destructive">
                                {errors.minimumTableAmount}
                            </span>
                        )}
                    </div>
                    {/* Venue Maximum Table Amount */}
                    <div className="grid gap-2">
                        <Label htmlFor="maximumTableAmount">
                            Minimum Capacity
                        </Label>
                        <Input
                            id={'maximumTableAmount'}
                            required
                            type={'number'}
                            value={data.maximumTableAmount}
                            onChange={(e) =>
                                setData(
                                    'maximumTableAmount',
                                    parseInt(e.target.value),
                                )
                            }
                        />
                        {errors.maximumTableAmount && (
                            <span className="text-sm text-destructive">
                                {errors.maximumTableAmount}
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
                            {processing ? 'Adding...' : 'Add Venue'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

