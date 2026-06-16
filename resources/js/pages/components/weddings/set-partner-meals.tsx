import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import guests from '@/routes/guests';
import { Guest, MenuItem, Wedding } from '@/types';
import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';

export default function SetPartnerMeals({
    open,
    setOpen,
    partnerA,
    partnerB,
    menuItems,
}: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    wedding: Wedding;
    partnerA: Guest;
    partnerB: Guest;
    menuItems: MenuItem[];
}) {
    const { data, setData, processing, put } = useForm({
        partnerA_meal: '',
        partnerB_meal: '',
    });

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Set partner meals
        put(guests.update(partnerA).url, {
            preserveScroll: true,
            onSuccess: () => setOpen(false),
        });
    };

    useEffect(() => {
        if (open) {
            setData({
                partnerA_meal: partnerA.menu_item_id?.toString() || '',
                partnerB_meal: partnerB.menu_item_id?.toString() || '',
            });
        }
    }, [open, partnerA, partnerB, setData]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Set Your Meals</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="partnerA_meal">
                            {partnerA.name}'s Meal
                        </Label>
                        <Select
                            value={data.partnerA_meal}
                            onValueChange={(value) =>
                                setData('partnerA_meal', value)
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
                                        {item.name}{' '}
                                        {item.is_plant_based
                                            ? '(Plant Based)'
                                            : ''}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="partnerB_meal">
                            {partnerB.name}'s Meal
                        </Label>
                        <Select
                            value={data.partnerB_meal}
                            onValueChange={(value) =>
                                setData('partnerB_meal', value)
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
                                        {item.name}{' '}
                                        {item.is_plant_based
                                            ? '(Plant Based)'
                                            : ''}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Meals'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
