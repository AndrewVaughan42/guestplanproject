import AddTask from '../components/tasks/add-task';
import DeleteTask from '../components/tasks/delete-task';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import tasks from '@/routes/tasks';
import { type BreadcrumbItem, Task } from '@/types';
import { Head } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Task List',
        href: tasks.index().url,
    },
];

const dateFormatter = (date: string | null) => {
    if (!date) return null;

    return new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(date));
};

export default function TaskList({ tasks }: { tasks: Task[] }) {
    const [open, setOpen] = useState(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Task List" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex-1 rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border relative">
                    <h2 className="mb-4 text-xl font-semibold">
                        My Wedding Task List
                    </h2>
                    <div>
                        <div>
                            <Button
                                className={'mb-4'}
                                variant={'outline'}
                                onClick={() => setOpen(true)}
                            >
                                Add New Task
                            </Button>
                            <AddTask open={open} setOpen={setOpen} />
                        </div>
                        <Table className={'mt-4'}>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-left font-bold">
                                        <span className="text-2xl">Task</span>
                                    </TableHead>
                                    <TableHead className="text-center font-bold">
                                        <span className="text-2xl">Status</span>
                                    </TableHead>
                                    <TableHead className="text-right font-bold">
                                        <span className="text-2xl">Due Date</span>
                                    </TableHead>
                                    <TableHead className="text-right font-bold">
                                        <span className="text-2xl">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tasks.length > 0 ? tasks.map((task) => (
                                    <TableRow key={task.id}>
                                        <TableCell align={'left'}>
                                            {task.title}
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            {task.status}
                                        </TableCell>
                                        <TableCell align={'right'}>
                                            <span>
                                                {dateFormatter(task.due_date)}
                                            </span>
                                        </TableCell>
                                        <TableCell
                                            className={
                                                'flex items-center justify-end'
                                            }
                                        >
                                            <Button
                                                variant={'ghost'}
                                                size={'icon'}
                                                onClick={() =>
                                                    DeleteTask(task.id)
                                                }
                                            >
                                                <Trash2 />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">
                                            No tasks found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
