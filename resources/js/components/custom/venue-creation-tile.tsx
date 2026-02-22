import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import CreateVenue from '@/components/venues/create-venue';

export default function VenueCreationTile(){
    const [open, setOpen] = useState(false);
    return (
        <div className="flex h-full flex-col items-center justify-center bg-neutral-50 p-6 text-center transition-colors hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Plus className="h-8 w-8" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                Set Up A New Venue
            </h3>
            <Button
                size="lg"
                className="cursor-pointer font-bold shadow-md transition-transform hover:scale-105"
                onClick={() => setOpen(true)}
            >
                <Plus className="mr-2 h-5 w-5" />
                Create Venue
            </Button>
            <CreateVenue
                open={open}
                setOpen={setOpen}
            />
        </div>
    );
};
