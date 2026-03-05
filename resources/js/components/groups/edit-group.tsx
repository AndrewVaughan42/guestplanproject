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
import groups from '@/routes/groups';
import { Group } from '@/types';
import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';

export default function EditGroup({
    open,
    setOpen,
    group,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    group: Group | null;
}) {
    const { data, setData, put, processing, reset, errors } = useForm<
        Partial<Group>
    >({
        name: group?.name || '',
        relationship: group?.relationship || '',
    });

    useEffect(() => {
        if (group) {
            setData({
                name: group.name,
                relationship: group.relationship,
            });
        }
    }, [group, setData]);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!group?.id) return;

        put(groups.update(group.id).url, {
            onSuccess: () => {
                setOpen(false);
                reset()
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
                        <Label htmlFor="edit-relationship">Relationship</Label>
                        <Select
                            value={data.relationship}
                            onValueChange={(value: Group['relationship']) =>
                                setData('relationship', value)
                            }
                        >
                            <SelectTrigger id="edit-relationship">
                                <SelectValue placeholder="Select relationship status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="together">
                                    Keep Together
                                </SelectItem>
                                <SelectItem value="close">
                                    Keep Close
                                </SelectItem>
                                <SelectItem value="away">
                                    Keep Away
                                </SelectItem>
                                <SelectItem value="far">Keep Far Away</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.relationship && (
                            <span className="text-sm text-destructive">
                                {errors.relationship}
                            </span>
                        )}
                    </div>

                    <DialogFooter className="mt-4">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => {
                                setOpen(false);
                                reset()
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
