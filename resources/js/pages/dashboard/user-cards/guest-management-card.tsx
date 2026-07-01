import { usePage } from '@inertiajs/react';
import { SharedData } from 'resources/js/types';
import { DashCard } from '@/pages/dashboard/dash-card';
import {
    Bar,
    BarChart,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';


export default function GuestManagementCard() {
    const { auth } = usePage<SharedData>().props
    const wedding = auth.user.wedding;
    const  weddingMenuItems = auth.user.wedding?.menu_items;

    const statusData = [
        {
            "name": "Confirmed",
            "value": wedding!.guests.filter((guest) => guest.status === "confirmed").length
        },
        {
            "name": "Invited",
            "value": wedding!.guests.filter((guest) => guest.status === "invited").length
        },
        {
            "name": "Declined",
            "value": wedding!.guests.filter((guest) => guest.status === "declined").length
        },
    ]
    const statusColours = [
        '#22c55e', // confirmed
        '#f59e0b', // pending
        '#ef4444', // declined
        ];

    const statsMinThresh = (wedding!.guests.length ?? 0) >= 10;

    if (!weddingMenuItems) {
        return (
            <DashCard title={"Guests"} content={<p>Start entering guest details</p>}/>
        );
    } else {
        console.log(statusData);
        return (
            <DashCard
                title={'Guest Management'}
                content={
                    <>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="rounded-lg bg-neutral-100 p-3 dark:bg-neutral-900">
                                <p className="text-xs text-muted-foreground">
                                    Total Guests
                                </p>
                                <p className="text-xl font-bold">
                                    {wedding!.guests.length}
                                </p>
                            </div>

                            <div className="rounded-lg bg-neutral-100 p-3 dark:bg-neutral-900">
                                <p className="text-xs text-muted-foreground">
                                    Response Rate
                                </p>
                                <p className="text-xl font-bold">
                                    {Math.round(
                                        (statusData[0].value /
                                            wedding!.guests.length) *
                                            100,
                                    )}
                                    %
                                </p>
                            </div>

                            <div className="rounded-lg bg-neutral-100 p-3 dark:bg-neutral-900">
                                <p className="text-xs text-muted-foreground">
                                    Awaiting Reply
                                </p>
                                <p className="text-xl font-bold">
                                    {statusData[1].value}
                                </p>
                            </div>
                        </div>
                        {!statsMinThresh ? (
                            <div className="mt-4 flex items-center justify-center border border-dashed border-neutral-200 rounded-xl p-6">
                                <p className={'text-xs text-neutral-500'}>
                                    Guest Statistics will show once you
                                    have at least 10 guests.
                                </p>
                            </div>
                        ) : (
                            <div className={'h-48 w-full border'}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={statusData}
                                        layout={'vertical'}
                                        margin={{ left: 20, right: 30 }}
                                    >
                                        <XAxis
                                            type={'number'}
                                            hide
                                        />
                                        <YAxis
                                            dataKey="name"
                                            type={'category'}
                                            width={90}
                                        />
                                        <Tooltip />

                                        <Bar
                                            dataKey="value"
                                            radius={[0, 4, 4, 0]}
                                            barSize={20}
                                        >
                                            {statusData.map((_, index) => (
                                                <Cell
                                                    key={index}
                                                    fill={statusColours[index]}
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </>
                }
            />
        );
    }
}
