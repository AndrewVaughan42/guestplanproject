//TODO

import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import venues from '@/routes/venues';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Venue Manager',
        href: venues.index().url,
    },
];
export default function VenueManager() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Venue Manager" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex-1 rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                    <h2 className="mb-4 text-xl font-semibold">Venue Manager</h2>
                    <p className="text-muted-foreground">
                        This is where the venue manager will appear.
                    </p>
                </div>
                <div></div>
            </div>
        </AppLayout>
    );
}
