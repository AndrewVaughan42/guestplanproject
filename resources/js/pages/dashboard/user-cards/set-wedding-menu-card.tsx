import SetWeddingMenu from '@/pages/components/weddings/set-wedding-menu';
import { DashCard } from '@/pages/dashboard/dash-card';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import SetPartnerMeals from '@/pages/components/weddings/set-partner-meals';
import { Button } from '@/components/ui/button';

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
                                    <div className="flex flex-col h-full">
                                        <div className="flex-1">
                                            <p className="mb-2 font-medium">Wedding Menu Set Up</p>
                                            <div className="space-y-2">
                                                {wedding.menu_items?.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className={
                                                            'flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2 dark:bg-neutral-900'
                                                        }
                                                    >
                                                        <span className={'text-sm font-medium'}>
                                                            {item.name}
                                                        </span>

                                                        {item.is_plant_based && (
                                                            <span
                                                                className={
                                                                    'rounded bg-green-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-600 dark:text-green-400'
                                                                }
                                                            >
                                                                Plant Based
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Sets Partner Menu Items*/}
                                        <div className="mt-4 flex justify-end">
                                            <Button
                                                className={
                                                    'inline-flex items-center gap-2 rounded-lg bg-guestplan px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity'
                                                }
                                                onClick={() => setAddPartnerMealOpen(true)}
                                            >
                                                {hasPartners ? 'Edit Your Dishes' : 'Set Your Dishes'}
                                            </Button>
                                        </div>
                                    </div>

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
