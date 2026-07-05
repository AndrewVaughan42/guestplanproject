    import { DashCard } from '@/pages/dashboard/dash-card';
    import { Wedding } from '@/types';
    import { Link, usePage } from '@inertiajs/react';
    import adminWeddings from '@/routes/admin-weddings';

    export default function UpcomingWeddingsTile() {

    const { upcomingWeddings } = usePage<{ upcomingWeddings: Wedding[] }>().props;

        return (
            <DashCard title={"Upcoming Weddings"} content={
                <table className="w-full text-sm">
                    <thead>
                    <tr className={"border-b text-left text-muted-foreground"}>
                        <th className={"px-2 py-1"}>Couple</th>
                        <th className={"px-2 py-1"}>Venue</th>
                        <th className={"px-2 py-1"}>Date</th>
                        <th className={"px-2 py-1"}>Link</th>
                    </tr>
                    </thead>
                    <tbody>
                    {upcomingWeddings.length === 0 && (
                        <tr className={"border-b"}>
                            <td className={"px-2 py-1"} colSpan={4}>No upcoming weddings on your venues</td>
                        </tr>
                    )}
                    {upcomingWeddings.map((wedding) => (
                        <tr key={wedding.id} className={"border-b"}>
                            <td className={"px-2 py-1"}>{wedding.partnerA_lastname} & {wedding.partnerB_lastname}</td>
                            <td className={"px-2 py-1"}>{wedding.venue?.name}</td>
                            <td className={"px-2 py-1"}>{new Date(wedding.date).toLocaleDateString('en-GB')}</td>
                            <td className={"px-2 py-1"}><Link href={adminWeddings.show(Number(wedding.id)).url}>View</Link></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            }/>
        )
    };
