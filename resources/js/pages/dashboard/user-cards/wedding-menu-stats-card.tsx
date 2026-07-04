import { DashCard } from '@/pages/dashboard/dash-card';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

export function WeddingMenuStatsCard() {
    const { auth } = usePage<SharedData>().props;

    const wedding = auth.user.wedding;

    if (!wedding || wedding.menu_items?.length !== 3) {
        return null;
    }

    const statsMinThresh = (wedding.guests?.length ?? 0) >= 10;

    const graphColours = ['#007bff', '#28a745', '#dc3545'];

    const mealData = wedding.menu_items?.map((item) => {
        const count =
            wedding.guests?.filter((guest) => guest.menu_item_id === item.id)
                .length ?? 0;

        return {
            name: item.name,
            value: count,
        };
    }) || [];

    return (
        <DashCard
            title={'Meal Statics'}
            content={
                !statsMinThresh ? (
                    <div className="flex items-center justify-center rounded-xl border border-dashed border-neutral-200 p-6">
                        <p className={'text-xs text-neutral-500'}>
                            Wedding Statistics will show once you have at least
                            10 guests.
                        </p>
                    </div>
                ) : (
                    <div className={'flex flex-1 flex-col'}>
                        <div className="h-50 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                    <Pie
                                        data={mealData}
                                        dataKey="value"
                                        nameKey="name"
                                        outerRadius={80}
                                        innerRadius={40}
                                    >
                                        {mealData.map((_, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    graphColours[
                                                        index %
                                                            graphColours.length
                                                    ]
                                                }
                                                className="small stroke-guestplan stroke-2"
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )
            }
        />
    );
}
