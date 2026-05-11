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
import { Group } from 'resources/js/types';
import { useForm } from '@inertiajs/react';
import React from 'react';
import { Textarea } from '@headlessui/react';
import groups from '@/routes/groups';

export default function CreateGroup({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const { data, setData, post, processing, reset, errors } = useForm<Partial<Group>
    >({
        name: '',
        priority: 0,
    });

    function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        post(groups.store().url, {
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
                                onChange={(e) => setData('priority', parseInt(e.target.value))}
                            />
                        {errors.priority && (
                            <span className="text-sm text-destructive">
                                {errors.priority}
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
                            {processing ? 'Adding...' : 'Add Group'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
