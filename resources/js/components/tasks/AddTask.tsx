import { useForm } from '@inertiajs/react';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';
import tasks from '@/routes/tasks';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function AddTask({ open, setOpen }: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {

    type TaskForm = {
        title: string;
        status: string | null;
        due_date: string | null;
    }

    const { data, setData, post, processing, reset, errors } = useForm<TaskForm>({
        title: '',
        status: null,
        due_date: null,
    });

    function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        post(tasks.store().url,
            {
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
                    <DialogTitle>Add New Task</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Task Title</Label>
                        {/* Task Title */}
                        <Input
                            id="title"
                            required
                            aria-required="true"
                            type="text"
                            value={data.title}
                            placeholder="Enter task name"
                            onChange={(e) => setData('title', e.target.value)}
                        />
                        {errors.title && (
                            <span className="text-sm text-destructive">
                                {errors.title}
                            </span>
                        )}
                    </div>
                    {/* Task Status */}
                    <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={data.status ?? undefined}
                            onValueChange={(value) =>
                                setData('status', value || null)
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Status (Optional)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Status</SelectLabel>
                                    <SelectItem value="pending">
                                        Pending
                                    </SelectItem>
                                    <SelectItem value="in progress">
                                        In Progress
                                    </SelectItem>
                                    <SelectItem value="completed">
                                        Completed
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    {/* Task Due Date */}
                    <div className="grid gap-2">
                        <Label htmlFor="due_date">Due Date</Label>
                        <Input
                            id="due_date"
                            type="date"
                            value={data.due_date || ''}
                            onChange={(e) =>
                                setData('due_date', e.target.value)
                            }
                        />
                        {errors.due_date && (
                            <span className="text-sm text-destructive">
                                {errors.due_date}
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
                            {processing ? 'Adding...' : 'Add Task'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
