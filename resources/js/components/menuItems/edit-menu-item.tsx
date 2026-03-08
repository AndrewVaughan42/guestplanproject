import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { MenuItem } from '@/types';
import menuItems from '@/routes/menu-items';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@headlessui/react';

export default function EditMenuItem({
    open,
    setOpen,
    menuItem,
}: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    menuItem: MenuItem | null;
}) {
    const { data, setData, put, processing, reset, errors } = useForm<Partial<MenuItem>>
    ({
        name: menuItem?.name || '',
        description: menuItem?.description || '',
        is_plant_based: menuItem?.is_plant_based || false,
    });

    useEffect(() => {
        if (menuItem) {
            setData({
                id: menuItem.id,
                venue_id: menuItem.venue_id,
                name: menuItem.name,
                description: menuItem.description || '',
                is_plant_based: menuItem.is_plant_based || false,
            });
        }
    }, [menuItem, setData]);

    function handleUpdate(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!menuItem?.id) return;

        put(menuItems.update(menuItem.id).url, {
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit Menu Item</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleUpdate} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="edit-name">Menu Name</Label>
                        <Input
                            id="edit-name"
                            required
                            aria-required="true"
                            type="text"
                            value={data.name || ''}
                            placeholder="Enter menu item name"
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && (
                            <span className="text-sm text-destructive">
                                {errors.name}
                            </span>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="edit-description">Description</Label>
                        <Textarea
                            id="edit-description"
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

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="edit-is_plant_based"
                            checked={data.is_plant_based}
                            onCheckedChange={(checked: boolean) =>
                                setData('is_plant_based', checked)
                            }
                        />
                        <Label
                            htmlFor="edit-is_plant_based"
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
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
