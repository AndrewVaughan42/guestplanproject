import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import CreateWedding from '@/components/weddings/create-wedding';
import { Plus } from 'lucide-react';

export default function ManageWeddingTile() {

    const { auth, venues } = usePage<SharedData>().props;

    const [open, setOpen] = useState(false);

    if (!auth?.user?.wedding) {
        return (
            <div className="flex h-full flex-col items-center justify-center bg-neutral-50 p-6 text-center transition-colors hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Plus className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">No Wedding Set Up</h3>
                <p className="mb-6 text-sm text-neutral-500 dark:text-neutral-400">Ready to start planning your big day?</p>
                <Button
                    size="lg"
                    className="cursor-pointer font-bold shadow-md transition-transform hover:scale-105"
                    onClick={() => setOpen(true)}
                >
                    <Plus className="mr-2 h-5 w-5" />
                    Create Wedding
                </Button>
                <CreateWedding open={open} setOpen={setOpen} venuesList={venues || []}/>
            </div>
        );
    } else {
        return (
            <div className="flex h-full flex-col items-center justify-center bg-neutral-100 p-4 text-center dark:bg-neutral-800">
                <span className="text-4xl font-bold text-neutral-900 dark:text-neutral-100">
                    You should see this if you've set up a wedding.
                    //TODO View Wedding
                </span>
            </div>
        );
    }
}
