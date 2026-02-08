import { Head } from '@inertiajs/react'
import { seatplan} from '@/routes';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

export default function Seatplan() {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'My Seatplan',
            href: seatplan.url(),
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Seatplan"/>
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex-1 rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                    <h2 className="mb-4 text-xl font-semibold">My Guests</h2>
                    <p className="text-muted-foreground">
                        This is where the seat planner will appear.
                    </p>
                </div>
            </div>
        </AppLayout>
    )
}
