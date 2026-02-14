import AddTask from '@/components/tasks/AddTask';
import DeleteTask from '@/components/tasks/DeleteTask';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
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
                <div className="flex-1 rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
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
                                    <TableCell
                                        align={'left'}
                                        className={'font-bold'}
                                    >
                                        <b className={'text-2xl'}>Task</b>
                                    </TableCell>
                                    <TableCell align={'center'}>
                                        <b className={'text-2xl'}>Status</b>
                                    </TableCell>
                                    <TableCell align={'right'}>
                                        <b className={'text-2xl'}>Due Date</b>
                                    </TableCell>
                                    <TableCell align={'right'}>
                                        <b className={'text-2xl'}>Actions</b>
                                    </TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tasks.map((task) => (
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
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
