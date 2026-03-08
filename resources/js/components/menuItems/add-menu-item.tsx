import React from 'react';
import { useForm } from '@inertiajs/react';
import { MenuItem } from '@/types';
import { Textarea } from '@headlessui/react';
import menuItems from '@/routes/menu-items';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

export default function AddMenuItem({ open, setOpen, venueId}: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    venueId: number;
}) {
    const { data, setData, post, processing, reset, errors } = useForm<
        Partial<MenuItem>
    >({
        name: '',
        description: '',
        is_plant_based: false,
        venue_id: venueId,
    });

    React.useEffect(() => {
        setData('venue_id', venueId);
    }, [setData, venueId]);

    function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        post(menuItems.store().url, {
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
                    <DialogTitle>Add New Menu Item</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Menu Name</Label>
                        <Input
                            id="name"
                            required
                            aria-required="true"
                            type="text"
                            value={data.name}
                            placeholder="Enter group name"
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && (
                            <span className="text-sm text-destructive">
                                {errors.name}
                            </span>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={data.description || ''}
                            onChange={(e: {
                                target: { value: string | null };
                            }) => setData('description', e.target.value)}
                        />
                        {errors.description && (
                            <span className="text-sm text-destructive">
                                {errors.description}
                            </span>
                        )}
                    </div>
                    <Checkbox
                        id="terms"
                        checked={data.is_plant_based}
                        onCheckedChange={(checked: boolean) =>
                            setData('is_plant_based', checked)
                        }
                    />
                    <div className="grid gap-1.5 leading-none">
                        <Label
                            htmlFor="template-groups"
                            className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Plant-based Meal?
                        </Label>
                    </div>
                    {errors.is_plant_based && (
                        <span className="text-sm text-destructive">
                            {errors.is_plant_based}
                        </span>
                    )}

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
                            {processing ? 'Adding...' : 'Add Menu Item'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
