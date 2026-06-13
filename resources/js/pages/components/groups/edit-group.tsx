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
import ColourPicker from '@/pages/shared/ColourPicker';
import groups from '@/routes/groups';
import { Textarea } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { Group } from 'resources/js/types';

export default function EditGroup({
    open,
    setOpen,
    group,
}: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    group: Group | null;
}) {
    const { data, setData, put, processing, reset, errors } = useForm<
        Partial<Group>
    >({
        name: '',
        description: '',
        priority: 0,
        colour: '',
    });

    useEffect(() => {
        if (!group) return;
        setData({
            name: group.name ?? '',
            description: group.description || '',
            priority: group.priority ?? 0,
            colour: group.colour ?? '',
        });
    }, [group, setData]);

    function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!group?.id) return;

        put(groups.update(group.id).url, {
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
                    <DialogTitle>Edit Group</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="edit-group-name">Group Name</Label>
                        <Input
                            id="edit-group-name"
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
                        <Label htmlFor="edit-priority">Seating Priority</Label>
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
                                setData('priority', parseInt(e.target.value))
                            }
                        />
                        {errors.priority && (
                            <span className="text-sm text-destructive">
                                {errors.priority}
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

                    <div className="grid gap-2">
                        <label htmlFor="colour">Colour</label>
                        <ColourPicker
                            value={data.colour ?? ''}
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
                                setOpen(false);
                                reset();
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
