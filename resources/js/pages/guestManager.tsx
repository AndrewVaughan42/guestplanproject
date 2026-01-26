import { Head } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { todoList as taskListRoute } from '@/routes';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Task List',
        href: taskListRoute().url,
    },
];
export default function guestManager() {
    return (

            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Guest Manager" />
                <div className="flex h-full flex-1 flex-col gap-4 p-4">
                    <div className="flex-1 rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                        <h2 className="mb-4 text-xl font-semibold">My Tasks</h2>
                        <p className="text-muted-foreground">
                            This is where the guest manager will appear.
                        </p>
                    </div>
                </div>
            </AppLayout>

    );
}
