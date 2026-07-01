import SetWeddingMenu from '@/pages/components/weddings/set-wedding-menu';
import { DashCard } from '@/pages/dashboard/dash-card';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import SetPartnerMeals from '@/pages/components/weddings/set-partner-meals';
import { Button } from '@/components/ui/button';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

export default function SetWeddingMenuCard() {
    const { auth } = usePage<SharedData>().props;

    const wedding = auth.user.wedding;

    const [open, setOpen] = useState(false);

    const [addPartnerMeal, setAddPartnerMealOpen] = useState(false);

    if (!wedding) {
        return (
            <DashCard
                title={'Wedding Menu'}
                content={<p>Set Your Wedding First</p>}
            />
        );
    }

    const hasMenu = (wedding.menu_items?.length ?? 0) === 3;
    const partnerA = wedding.guests.find((guest) => guest.role === 'partner_a');
    const partnerB = wedding.guests.find((guest) => guest.role === 'partner_b');
    const hasPartners = !!partnerA?.menu_item_id && !!partnerB?.menu_item_id;

    const statsMinThresh = (wedding.guests.length ?? 0) >= 10;

    const graphColours = ['#007bff', '#28a745', '#dc3545'];

    const mealData = wedding.menu_items?.map((item) => {
        const count = wedding.guests.filter((guest) => guest.menu_item_id === item.id).length ?? 0;

        return {
            name: item.name,
            value: count
        }
    })

    return (
        <>
            <DashCard
                title={'Wedding Menu'}
                content={
                    <div className={'w-full max-w-5xl mx-auto px-2 sm:px-4 lg:px-8'}>
                        <div className={"grid gap-4 lg:grid-cols-2"}>
                            {!hasMenu ? (
                                <>
                                    {/* No Menu */}
                                    <div
                                        className={
                                            'rounded-xl border border-dashed border-neutral-200 p-3 dark:border-neutral-800'
                                        }
                                    >
                                        <p className={'text-sm text-neutral-500'}>
                                            No Menu Set Up Yet
                                        </p>

                                        <p className={'text-xs text-neutral-500'}>
                                            Three dishes required, one of them
                                            plant-based.
                                        </p>

                                        <Button
                                            className={
                                                'mt-3 inline-flex items-center gap-2 rounded-lg bg-guestplan px-3 py-1.5 text-sm font-medium text-white hover:opacity-90'
                                            }
                                            onClick={() => setOpen(true)}
                                        >
                                            Set Wedding Menu
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Menu Set Up*/}
                                    <div>
                                        <div>
                                            <p>Wedding Menu Set Up</p>
                                            <ul className="text-sm">
                                                {wedding.menu_items?.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className={
                                                            'flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2 dark:bg-neutral-900'
                                                        }
                                                    >
                                                    <span
                                                        className={
                                                            'text-sm font-medium'
                                                        }
                                                    >
                                                        {item.name}
                                                    </span>

                                                        {item.is_plant_based && (
                                                            <span
                                                                className={
                                                                    'bg-green-500/20 px-1 py-2 text-xs font-medium text-green-400'
                                                                }
                                                            >
                                                            Plant Based
                                                        </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Sets Partner Menu Items*/}
                                        <Button
                                            className={
                                                'mt-3 inline-flex items-center gap-2 rounded-lg bg-guestplan px-3 py-1.5 text-sm font-medium text-white hover:opacity-90'
                                            }
                                            onClick={() =>
                                                setAddPartnerMealOpen(true)
                                            }
                                        >
                                            {hasPartners ?  'Edit Your Dishes' : 'Set Your Dishes'}
                                        </Button>
                                    </div>


                                    {!statsMinThresh ? (
                                        <div className="flex items-center justify-center border border-dashed border-neutral-200 rounded-xl p-6">
                                            <p className={'text-xs text-neutral-500'}>
                                                Wedding Statistics will show once you
                                                have at least 10 guests.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className={'mt-3'}>
                                            <p
                                                className={
                                                    'text-xs text-neutral-500'
                                                }
                                            >
                                                Meal Statistics
                                            </p>
                                            <div className="mt-4 h-64 w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={mealData}
                                                            dataKey="value"
                                                            nameKey="name"
                                                            outerRadius={80}
                                                            label
                                                        >
                                                            {mealData!.map((_, index) => (
                                                                <Cell
                                                                    key={`cell-${index}`}
                                                                    fill={graphColours[index % graphColours.length]}
                                                                    className="stroke-2 stroke-guestplan small"
                                                                />
                                                            ))}
                                                        </Pie>

                                                        <Tooltip />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>

                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                    </div>
                }
            />

            {!hasMenu && wedding.venue && (
                <SetWeddingMenu
                    open={open}
                    setOpen={setOpen}
                    wedding={wedding}
                    availableMenuItems={wedding.venue.menu_items || []}
                />
            )}

            {partnerA && partnerB && (
                <SetPartnerMeals
                    open={addPartnerMeal}
                    setOpen={setAddPartnerMealOpen}
                    partnerA={partnerA}
                    partnerB={partnerB}
                    menuItems={wedding.menu_items || []}
                    wedding={wedding}
                />
            )}

        </>
    );
}
