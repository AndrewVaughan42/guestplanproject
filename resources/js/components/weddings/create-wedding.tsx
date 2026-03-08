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
import { Venue, Wedding } from '@/types';
import weddings from '@/routes/weddings/index';
import { Checkbox } from '@/components/ui/checkbox';


// import weddings from '@/routes/weddings';

export default function CreateWedding({ open, setOpen, venuesList }: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    venuesList: Venue[];
}) {


    const { data, setData, post, processing, reset, errors } = useForm<Wedding>({
        partnerA_firstname: '',
        partnerA_lastname: '',
        partnerB_firstname: '',
        partnerB_lastname: '',
        date: '',
        venue_id: 0,
        groupTemplates: false,
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
                    {/* PartnerA First Name */}
                    <div className="grid gap-2">
                        <Label>Partner (A)</Label>
                        <div className={'grid grid-cols-2 gap-2'}>
                            <Input
                                id="partnerA_firstname"
                                required
                                aria-required="true"
                                type="text"
                                value={data.partnerA_firstname}
                                placeholder="First Name"
                                onChange={(e) =>
                                    setData(
                                        'partnerA_firstname',
                                        e.target.value,
                                    )
                                }
                            />
                            <Input
                                id="partnerA_lastname"
                                required
                                aria-required="true"
                                type="text"
                                value={data.partnerA_lastname}
                                placeholder="Last Name"
                                onChange={(e) =>
                                    setData('partnerA_lastname', e.target.value)
                                }
                            />
                            {errors.partnerA_firstname && (
                                <span className="text-sm text-destructive">
                                    {errors.partnerA_firstname}
                                </span>
                            )}
                            {errors.partnerA_lastname && (
                                <span className="text-sm text-destructive">
                                    {errors.partnerA_lastname}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* PartnerB First Name */}
                    <div className="grid gap-2">
                        <Label htmlFor="partnerA_firstname">Partner (B)</Label>
                        <div className={'grid grid-cols-2 gap-2'}>
                            <Input
                                id="partnerA_firstname"
                                required
                                aria-required="true"
                                type="text"
                                value={data.partnerB_firstname}
                                placeholder="First Name"
                                onChange={(e) =>
                                    setData(
                                        'partnerB_firstname',
                                        e.target.value,
                                    )
                                }
                            />
                            <Input
                                id="partnerA_lastname"
                                required
                                aria-required="true"
                                type="text"
                                value={data.partnerB_lastname}
                                placeholder="Last Name"
                                onChange={(e) =>
                                    setData('partnerB_lastname', e.target.value)
                                }
                            />
                            {errors.partnerB_firstname && (
                                <span className="text-sm text-destructive">
                                    {errors.partnerB_firstname}
                                </span>
                            )}
                            {errors.partnerB_lastname && (
                                <span className="text-sm text-destructive">
                                    {errors.partnerB_lastname}
                                </span>
                            )}
                        </div>
                    </div>
                    {/* Wedding Date */}
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
                    {/* Wedding Venue */}
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
                                        <SelectItem
                                            key={venue.id}
                                            value={venue.id?.toString() || ''}
                                        >
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
                    <div className="flex items-center space-x-2 py-2">
                        <Checkbox
                            id="terms"
                            checked={data.groupTemplates}
                            onCheckedChange={(checked: boolean) =>
                                setData('groupTemplates', checked)
                            }
                        />
                        <div className="grid gap-1.5 leading-none">
                            <Label
                                htmlFor="template-groups"
                                className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Set Up Template Groups?
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                By clicking this checkbox, Guestplan will create
                                several guest groups that are
                                commonly used.
                            </p>
                        </div>
                        {errors.groupTemplates && (
                            <span className="text-sm text-destructive">
                                {errors.groupTemplates}
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
