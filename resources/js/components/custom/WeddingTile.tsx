import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import CreateWedding from '@/components/weddings/CreateWedding';

export default function WeddingTile() {

    const { auth } = usePage<SharedData>().props;
    const hasWedding = auth.user?.wedding;

    const [open, setOpen] = useState(false);

    if (!hasWedding) {
        return (
            <div className="flex h-full flex-col items-center justify-center bg-neutral-100 p-4 text-center dark:bg-neutral-800">
                <Button className="text-4xl font-bold text-neutral-900 dark:text-neutral-100"
                onClick={() => setOpen(true)}>
                    Create Wedding
                </Button>
                <CreateWedding open={open} setOpen={setOpen} venuesList={[]}/>
            </div>
        );
    } else {
        return (
            <div className="flex h-full flex-col items-center justify-center bg-neutral-100 p-4 text-center dark:bg-neutral-800">
                <span className="text-4xl font-bold text-neutral-900 dark:text-neutral-100">

                </span>
                <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    Days to the Wedding
                </span>
            </div>
        );
    }
}
