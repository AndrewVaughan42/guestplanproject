import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import CreateWedding from '@/components/weddings/create-wedding';
import { Plus } from 'lucide-react';
import WeddingManagementCard from '@/components/dashboard/user-cards/wedding-management-card';

export default function ManageWeddingTile() {

    const { auth, venues } = usePage<SharedData>().props;

    const [open, setOpen] = useState(false);

    if (!auth?.user?.wedding) {
        return ( // Render the tile if no wedding is set up
            <div className="flex h-full w-full flex-col items-center justify-center bg-neutral-50 p-6 text-center transition-colors hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-guestplan">
                    <Plus className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                    No Wedding Set Up
                </h3>
                <p className="mb-6 text-sm ">
                    Ready to start planning your big day?
                </p>
                <Button
                    size="lg"
                    className="cursor-pointer font-bold shadow-md transition-transform hover:scale-105"
                    onClick={() => setOpen(true)}
                >
                    <Plus className="mr-2 h-5 w-5 text-guestplan"/>
                    Create Wedding
                </Button>
                <CreateWedding open={open} setOpen={setOpen} venuesList={venues || []}/>
            </div>
        );
    } else {
        return ( // Render the tile if a wedding is set up
            <div className="relative aspect-video">
                <WeddingManagementCard/>
            </div>
        );
    }
}
