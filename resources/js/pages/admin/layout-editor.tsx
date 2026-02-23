//TODO

import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import venueLayers from '@/routes/venue-layers';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Layout Editor',
        href: venueLayers.index().url,
    },
];
export default function LayoutEditor() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Layout Editor" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex-1 rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                    <h2 className="mb-4 text-xl font-semibold">Layout Editor</h2>
                    <p className="text-muted-foreground">
                        This is where the layout editor will appear.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}

