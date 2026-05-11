import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DialogFooter, DialogHeader } from '@/components/ui/dialog';
import { MenuItem, Wedding } from 'resources/js/types';
import { Form, useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog';
import { Select, SelectItem, SelectTrigger } from '@radix-ui/react-select';
import { AlertCircle } from 'lucide-react';
import React, { useState } from 'react';
import { Label } from 'react-konva';
import { Button } from '@/components/ui/button';
import weddings from '@/routes/weddings';

export default function SetWeddingMenu({
    open,
    setOpen,
    wedding,
    availableMenuItems,
}: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    wedding: Wedding;
    availableMenuItems: MenuItem[];
}) {
    const { data, setData, put, processing, errors, reset } = useForm({
        menu_item_ids: ['', '', ''] as string[],
    });

    const [validationError, setValidationError] = useState<string | null>(null);
    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setValidationError(null);

        //To ensure 3 menu items selected
        if (data.menu_item_ids.some((id) => id === '')) {
            setValidationError('Please select at least one menu item.');
            return;
        }

        //To ensure each menu item in unique
        const uniqueIDs = new Set(data.menu_item_ids);
        if (uniqueIDs.size !== 3) {
            setValidationError('Please select 3 different menu items.');
            return;
        }

        //To ensure 1 plant based meal
        const selectedItems = availableMenuItems.filter((item) =>
            data.menu_item_ids.includes(item.id.toString()),
        );
        const hasPlantBased = selectedItems.some((item) => item.is_plant_based);

        if (!hasPlantBased) {
            setValidationError(
                'Please select a minimum of one plant-based meal.',
            );
            return;
        }

        put(weddings.update(wedding.id!).url, {
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        });
    };

    const handleMenuItemChange = (index: number, value: string) => {
        const newIDs = [...data.menu_item_ids];
        newIDs[index] = value;
        setData('menu_item_ids', newIDs);
    };

    return (
        <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Set Your Wedding Menu</DialogTitle>
                </DialogHeader>

                <Form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <h3 className="text-lg font-medium">Menu Items</h3>
                        <p className="text-sm text-muted-foreground">
                            Select 3 different menu items that you would like to
                            include in your wedding menu. One must be
                            plant-based.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {[0, 1, 2].map((index) => (
                            <div key={index} className="space-y-2">
                                <Label htmlFor={`menu-item-${index}`}>
                                    Menu Item {index + 1}
                                </Label>
                                <Select
                                    value={data.menu_item_ids[index]}
                                    onValueChange={(value) =>
                                        handleMenuItemChange(index, value)
                                    }
                                >
                                    <SelectTrigger id={`menu-item-${index}`}>
                                        <SelectItem value="">
                                            Select a menu item
                                        </SelectItem>
                                        {availableMenuItems.map((item) => (
                                            <SelectItem
                                                key={item.id}
                                                value={item.id.toString()}
                                            >
                                                {item.name}
                                            </SelectItem>
                                        ))}
                                    </SelectTrigger>
                                </Select>
                            </div>
                        ))}
                    </div>
                        {validationError && (
                            <Alert variant="destructive" className="mt-4">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Selection Error</AlertTitle>
                                <AlertDescription>
                                    {validationError}
                                </AlertDescription>
                            </Alert>
                        )}

                        {errors.menu_item_ids && (
                            <p className="text-sm text-destructive">{errors.menu_item_ids}</p>
                        )}
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Menu'}
                        </Button>
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
