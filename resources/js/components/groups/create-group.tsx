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
import React from 'react';

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
        relationship: '',
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
                        <Label htmlFor="relationship">Relationship</Label>
                        <Select
                            value={data.relationship}
                            onValueChange={(value: Group['relationship']) =>
                                setData('relationship', value)
                            }
                        >
                            <SelectTrigger id="relationship">
                                <SelectValue placeholder="Select seating mode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="together">
                                    Must Be Sat Together
                                </SelectItem>
                                <SelectItem value="close">
                                    Keep Sat Close
                                </SelectItem>
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
