import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Task } from '@/types';
import { tasks } from '@/routes';
import { Head } from '@inertiajs/react';
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@headlessui/react';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Task List',
        href: tasks().url,
    },
];

export default function TaskList({tasks}: {tasks: Task[]}) {
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
                            <Button>TODO Add New Task</Button>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableCell>Task</TableCell>
                                    <TableCell>Due Date</TableCell>

                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tasks.map((task) => (
                                    <TableRow key={task.id}>
                                        <TableCell>{task.title}</TableCell>
                                        <TableCell>{task.due_date}</TableCell>
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
