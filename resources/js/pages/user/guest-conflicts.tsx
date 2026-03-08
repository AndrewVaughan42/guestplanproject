import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import conflicts from '@/routes/conflicts';
import { Head } from '@inertiajs/react';
import React from 'react';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Guest Conflicts',
        href: conflicts.index.url(),
    },
];
export default function GuestConflicts() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Guest Conflicts" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex-1 rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                    <h2 className="mb-4 text-xl font-semibold">Guest Conflicts</h2>
                    <p className="text-muted-foreground">
                        This is where the guest conflicts will appear.
                    </p>
                </div>
            </div>
        </AppLayout>

    )
}
