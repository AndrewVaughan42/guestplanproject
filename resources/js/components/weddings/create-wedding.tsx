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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Venue } from '@/types';
import weddings from '@/routes/weddings/index';

// import weddings from '@/routes/weddings';

export default function CreateWedding({ open, setOpen, venuesList }: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    venuesList: Venue[];
}) {


    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        date: '',
        venue_id: '' as string | number,
    });

    function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        post(weddings.store().url,
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
                    <DialogTitle>Create New Wedding</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Wedding Name</Label>
                        <Input
                            id="name"
                            required
                            aria-required="true"
                            type="text"
                            value={data.name}
                            placeholder="e.g. Smith & Jones Wedding"
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && (
                            <span className="text-sm text-destructive">
                                {errors.name}
                            </span>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="date">Wedding Date</Label>
                        <Input
                            id="date"
                            required
                            type="date"
                            value={data.date}
                            onChange={(e) => setData('date', e.target.value)}
                        />
                        {errors.date && (
                            <span className="text-sm text-destructive">
                                {errors.date}
                            </span>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="venue_id">Venue</Label>
                        <Select
                            value={data.venue_id?.toString()}
                            onValueChange={(value) => {
                                setData('venue_id', parseInt(value));
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a venue" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Venues</SelectLabel>
                                    {venuesList.map((venue) => (
                                        <SelectItem key={venue.id} value={venue.id?.toString() || ''}>
                                            {venue.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {errors.venue_id && (
                            <span className="text-sm text-destructive">
                                {errors.venue_id}
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
                            {processing ? 'Creating...' : 'Create Wedding'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
