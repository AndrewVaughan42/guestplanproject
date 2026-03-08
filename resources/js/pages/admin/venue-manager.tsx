import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, MenuItem, Venue } from '@/types';
import venues from '@/routes/venues';
import { Button } from '@/components/ui/button';
import AddMenuItem from '@/components/menuItems/add-menu-item';
import { useState } from 'react';
import EditMenuItem from '@/components/menuItems/edit-menu-item';
import AddVenue from '@/components/venues/add-venue';
import EditVenue from '@/components/venues/edit-venue';
import DeleteMenuItem from '@/components/menuItems/delete-menu-item';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Venue Manager',
        href: venues.index().url,
    },
];

interface Props {
    venues: Venue[];
}


export default function VenueManager({ venues: initialVenues }: Props) {
    //Menu Item Use States for Dialog HTML Operations
    const [addMenuItemOpen, setAddMenuItemOpen] = useState(false);
    const [editMenuItemOpen, setEditMenuItemOpen] = useState(false);
    //Venue Use States for Dialog HTML Operations
    const [addVenueOpen, setAddVenueOpen] = useState(false);
    const [editVenueOpen, setEditVenueOpen] = useState(false);
    //Use State for selecting a menu item to edit
    const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(
        null,
    );
    const [selectedVenueId, setSelectedVenueId] = useState<number | null>(null);
    const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

    const handleAddMenuItemClick = (venueId: number) => {
        setSelectedVenueId(venueId);
        setAddMenuItemOpen(true);
    };

    const handleEditMenuItemClick = (item: MenuItem) => {
        setSelectedMenuItem(item);
        setEditMenuItemOpen(true);
    };

    const handleEditVenueClick = (venue: Venue) => {
        setSelectedVenue(venue);
        setEditVenueOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Venue Manager" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex-1 rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Venue Manager</h2>
                        <Button onClick={() => setAddVenueOpen(true)}>
                            Add Venue
                        </Button>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-2 font-semibold">
                        Managed Venue(s)
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {initialVenues.map((venue) => (
                            <div
                                key={venue.id}
                                className="rounded-lg border p-4 shadow-sm"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold">
                                        {venue.name}
                                    </h3>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            handleEditVenueClick(venue)
                                        }
                                    >
                                        Edit Venue
                                    </Button>


                                </div>

                                <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                                    <p>
                                        Capacity: {venue.minimum_capacity} -{' '}
                                        {venue.maximum_capacity} guests
                                    </p>
                                    <p>
                                        Tables: {venue.minimum_table_amount} -{' '}
                                        {venue.maximum_table_amount} tables
                                    </p>
                                </div>

                                <div className="mt-4">
                                    <h4 className="mb-2 text-sm font-semibold">
                                        Menu Items
                                    </h4>
                                    {venue.menu_items &&
                                    venue.menu_items.length > 0 ? (
                                        <ul className="list-disc space-y-1 pl-5 text-sm">
                                            {venue.menu_items.map((item) => (
                                                <li key={item.id}>
                                                    <span className="font-medium">
                                                        {item.name}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            handleEditMenuItemClick(
                                                                item,
                                                            )
                                                        }
                                                        className="ml-2 text-xs text-blue-600 hover:underline"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                    DeleteMenuItem(item.id)}
                                                        className="ml-2 text-xs text-red-600 hover:underline">
                                                        Delete
                                                    </button>
                                                    {item.is_plant_based && (
                                                        <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                                                            Plant-based
                                                        </span>
                                                    )}
                                                    {item.description && (
                                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                                            {item.description}
                                                        </p>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic">
                                            No menu items added yet.
                                        </p>
                                    )}
                                    <div className="mt-4">
                                        <Button
                                            onClick={() =>
                                                handleAddMenuItemClick(
                                                    venue.id!,
                                                )
                                            }
                                        >
                                            Add Menu Item
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {selectedVenueId && (
                        <AddMenuItem
                            open={addMenuItemOpen}
                            setOpen={setAddMenuItemOpen}
                            venueId={selectedVenueId}
                        />
                    )}
                    <EditMenuItem
                        open={editMenuItemOpen}
                        setOpen={setEditMenuItemOpen}
                        menuItem={selectedMenuItem}
                    />

                    <AddVenue open={addVenueOpen} setOpen={setAddVenueOpen} />

                    <EditVenue
                        open={editVenueOpen}
                        setOpen={setEditVenueOpen}
                        venue={selectedVenue}
                    />

                    {initialVenues.length === 0 && (
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
