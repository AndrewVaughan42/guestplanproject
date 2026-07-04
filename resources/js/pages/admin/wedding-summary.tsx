import AppLayout from '@/layouts/app-layout';
import adminWeddings from '@/routes/admin-weddings';
import { type BreadcrumbItem, MenuItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface SummaryGuest {
    id: number;
    name: string;
    menu_item: MenuItem;
    notes?: string;
}
interface SummaryTable {
    id: number;
    name: string;
    guests: SummaryGuest[];
}
interface WeddingSummary {
    id: number;
    name: string;
    date: string;
    venue: string;
    seat_completion: number;
    all_seated: boolean;
    tables: SummaryTable[];
    guests: SummaryGuest[];
}
export default function AdminWeddingSummary() {
    const { wedding } = usePage<{ wedding: WeddingSummary }>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Wedding Summary',
            href: adminWeddings.index().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={'Wedding Summary'} />

            <div className={'mb-6 border-b pb-4'}>
                <h1 className="text-2xl font-bold">{wedding.name}</h1>
                <p className={'text-sm text-neutral-500'}>
                    {wedding.venue} •{' '}
                    {wedding.date ? new Date(wedding.date).toLocaleDateString() : 'Date not set'}
                </p>
            </div>

            <div className={'mb-6 grid grid-cols-2 gap-4'}>
                <div className={"rounded border p-4"}>
                    <p className={'text-xs text-neutral-500'}>All Guests Seated?</p>
                    <p className={'text-2xl font-bold'}>{wedding.all_seated ? 'Yes' : 'No'}</p>
                </div>
            </div>

            <div className={"mb-6 flex justify-end"}>
                <a href={adminWeddings.export(wedding.id).url} target="_blank" rel="noopener">
                    <Button variant={'brand'}>Export Job Sheet (PDF)</Button>
                </a>
            </div>

            <div className={"space-y-6"}>
                {wedding.tables.map((table) => (
                    <div key={table.id} className={"break-inside-avoid border-r p-4"}>
                        <h2 className={'mb-2 font-semibold text-guestplan'}>Table {table.name}</h2>
                        <table className={'w-full text-sm table-fixed'}>
                            <thead>
                            <tr className={"text-left text-xs  text-neutral-500"}>
                                <th>Name</th>
                                <th>Meal</th>
                                <th>Notes</th>
                            </tr>
                            </thead>
                            <tbody>
                            {table.guests.map((guest) => (
                                <tr key={guest.id} className={"border-t"}>
                                    <td className={"py-1"}>{guest.name}</td>
                                    <td>{guest.menu_item?.name ?? 'Not Set'}</td>
                                    <td>{guest.notes ?? '-'}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        </AppLayout>
    );
}
