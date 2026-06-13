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
import ColourPicker, { GROUP_COLOURS } from '@/pages/shared/ColourPicker';
import groups from '@/routes/groups';
import { useForm } from '@inertiajs/react';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Group } from 'resources/js/types';


export default function CreateGroup({
    open,
    setOpen,
    existingGroups,
}: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    existingGroups: Group[];
}) {
    const getAvailableColour = useCallback((existingGroups: Group[]) => {
        const used = new Set(
            existingGroups.map((group) => group.colour?.toLowerCase()),
        );

        return (
            GROUP_COLOURS.find((colour) => !used.has(colour.toLowerCase())) ??
            GROUP_COLOURS[0]
        );
    }, []);

    const defaultColour = useMemo(() => {
        return getAvailableColour(existingGroups);
    }, [getAvailableColour, existingGroups]);

    type GroupForm = {
        name: string;
        priority: number;
        colour: string;
        description: string;
    };
    const { data, setData, post, processing, errors } =
        useForm<GroupForm>({
            name: '',
            priority: 0,
            colour: defaultColour,
            description: '',
        });

    function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        post(groups.store().url, {
            onSuccess: () => {
                resetForm();
                setOpen(false);
            },
        });
    }

    const resetForm = useCallback(() => {
        const colour = getAvailableColour(existingGroups);

        const initials: GroupForm = {
            name: '',
            priority: 0,
            colour: colour,
            description: '',
        };
        setData(initials);
    }, [existingGroups, getAvailableColour, setData]);

    useEffect(() => {
        if (open) {
            resetForm();
        }
    }, [open, resetForm]);

    return (
        <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Add New Group</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Group Name</Label>
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
                        <Label htmlFor="relationship">Seating Priority</Label>
                        <Input
                            type={'number'}
                            required
                            aria-required="true"
                            value={data.priority}
                            name="priority"
                            min={1}
                            max={10}
                            placeholder="Enter priority (From 1 to 10)"
                            onChange={(e) =>
                                setData(
                                    'priority',
                                    e.target.value
                                        ? parseInt(e.target.value)
                                        : 0,
                                )
                            }
                        />
                        {errors.priority && (
                            <span className="text-sm text-destructive">
                                {errors.priority}
                            </span>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value ?? '')
                            }
                        />
                        {errors.description && (
                            <span className="text-sm text-destructive">
                                {errors.description}
                            </span>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <label htmlFor="colour">Colour</label>
                        <ColourPicker
                            value={data.colour}
                            onChange={(col) => setData('colour', col)}
                        />
                        {errors.colour && (
                            <span className="text-sm text-destructive">
                                {errors.colour}
                            </span>
                        )}
                    </div>

                    <DialogFooter className="mt-4">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => {
                                resetForm();
                                setOpen(false);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Adding...' : 'Add Group'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
