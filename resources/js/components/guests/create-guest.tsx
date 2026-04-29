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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import guests from '@/routes/guests';
import { Guest, GuestStatus, MenuItem } from '@/types';
import { Textarea } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import React from 'react';

export default function CreateGuest({
    open,
    setOpen,
    menuItems = [],
}: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    menuItems: MenuItem[];
}) {
    const { data, setData, post, processing, reset, errors } = useForm<Guest>({
        name: '',
        menu_item_id: null,
        status: 'invited',
        notes: '',
    });

    function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        post(guests.store().url, {
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

                    {menuItems.length > 0 ? (
                        <div className="grid gap-2">
                            <Label htmlFor="menu_item_id">Meal Choice</Label>

                            <Select
                                value={data.menu_item_id?.toString() ?? ''}
                                onValueChange={(value) =>
                                    setData(
                                        'menu_item_id',
                                        value ? Number(value) : null,
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a meal" />
                                </SelectTrigger>

                                <SelectContent>
                                    {menuItems.map((item) => (
                                        <SelectItem
                                            key={item.id}
                                            value={item.id.toString()}
                                        >
                                            {item.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {errors.menu_item_id && (
                                <span className="text-sm text-destructive">
                                    {errors.menu_item_id}
                                </span>
                            )}
                        </div>
                    ) : (
                        <div className="text-sm text-muted-foreground">
                            Meal choice unavailable. Please add your menu items
                            first.
                        </div>
                    )}

                    <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={data.status}
                            onValueChange={(value: GuestStatus) =>
                                setData('status', value)
                            }
                        >
                            <SelectTrigger id="status">
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
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
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
