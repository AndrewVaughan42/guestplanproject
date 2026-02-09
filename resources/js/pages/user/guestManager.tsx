import { Head } from '@inertiajs/react'
import { guestManager } from '@/routes';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Guest Manager',
        href: guestManager.url(),
    },
];
export default function GuestManager() {
    return (

            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Guest Manager" />
                <div className="flex h-full flex-1 flex-col gap-4 p-4">
                    <div className="flex-1 rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                        <h2 className="mb-4 text-xl font-semibold">My Guests</h2>
                        <p className="text-muted-foreground">
                            This is where the guest manager will appear.
                        </p>
                    </div>
                </div>
            </AppLayout>

    );
}
