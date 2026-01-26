import AppLayout from '@/layouts/app-layout';
import { todoList as todoListRoute } from '@/routes';
import { type BreadcrumbItem, TodoItem } from '@/types';
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
        title: 'Todo List',
        href: todoListRoute().url,
    },
];

export default function TodoList( {todoList}: {todoList: TodoItem[]}) {
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
                            <Button>Add New Task</Button>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow></TableRow>
                            </TableHeader>
                            <TableBody>
                                {todoList.map((todoItem) => (
                                    <TableRow key={todoItem.id}>
                                        <TableCell>{todoItem.name}</TableCell>
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
