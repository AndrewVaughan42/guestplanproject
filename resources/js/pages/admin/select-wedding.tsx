import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import adminWeddings from '@/routes/admin-weddings';

interface Wedding {
    id: number;
    name: string;
    date: string;
    venue: string;
    guest_count: number;
}

export default function SelectWedding() {
    const { weddings } = usePage<{
        weddings: Wedding[];
    }>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Wedding Summary',
            href: adminWeddings.index().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Select Wedding" />
            <div className={'p-6'}>
                <h1 className={'mb-4 text-2xl font-bold'}>Select Wedding</h1>
                <ul>
                    {weddings.map((w) => (
                        <Link
                            key={w.id}
                            href={adminWeddings.show(w.id).url}
                            className="hover:bg-guestplan-50 dark:hover:bg-guestplan-700 block rounded-lg border px-4 transition hover:border-guestplan"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="font-semibold">{w.name}</h2>
                                    <p className="text-sm text-muted-foreground">
                                        {w.venue}
                                    </p>
                                </div>
                                <div>
                                    <div className={'text-right'}>
                                        <p className={'text-sm'}>
                                            {new Date(
                                                w.date,
                                            ).toLocaleDateString()}
                                        </p>
                                        <p
                                            className={
                                                'text-xs text-muted-foreground'
                                            }
                                        >
                                            {w.guest_count} guests
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </ul>
            </div>
        </AppLayout>
    );
}
