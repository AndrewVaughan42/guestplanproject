//TODO

import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Venue } from '@/types';
import venues from '@/routes/venues';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Venue Manager',
        href: venues.index().url,
    },
];

interface Props {
    venues: Venue[];
}

export default function VenueManager({ venues }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Venue Manager" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex-1 rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                    <h2 className="mb-4 text-xl font-semibold">Venue Manager</h2>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {venues.map((venue) => (
                            <div key={venue.id} className="rounded-lg border p-4 shadow-sm">
                                <h3 className="text-lg font-bold">{venue.name}</h3>

                                <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                                    <p>Capacity: {venue.minimum_capacity} - {venue.maximum_capacity} guests</p>
                                    <p>Tables: {venue.minimum_table_amount} - {venue.maximum_table_amount} tables</p>
                                </div>

                                <div className="mt-4">
                                    <h4 className="font-semibold text-sm mb-2">Menu Items</h4>
                                    {venue.menu_items && venue.menu_items.length > 0 ? (
                                        <ul className="list-disc pl-5 text-sm space-y-1">
                                            {venue.menu_items.map((item) => (
                                                <li key={item.id}>
                                                    <span className="font-medium">{item.name}</span>
                                                    {item.is_plant_based && (
                                                        <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                                                            Plant-based
                                                        </span>
                                                    )}
                                                    {item.description && (
                                                        <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic">No menu items added yet.</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {venues.length === 0 && (
                        <p className="text-muted-foreground">
                            You don't have any venues to manage.
                        </p>
                    )}
                </div>
                <div></div>
            </div>
        </AppLayout>
    );
}
