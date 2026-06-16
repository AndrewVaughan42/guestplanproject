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

    const statsMinThresh = (wedding.guest_count ?? 0) >= 10;

    return (
        <>
            <DashCard
                title={'Wedding Menu'}
                content={
                    <div className={'space-y-3'}>
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


                                {!statsMinThresh ? (
                                    <p className={'text-xs text-neutral-500'}>
                                        Wedding Statistics will show once you
                                        have at least 10 guests.
                                    </p>
                                ) : (
                                    <div className={'mt-3'}>
                                        <p
                                            className={
                                                'text-xs text-neutral-500'
                                            }
                                        >
                                            Meal Statistics
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
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
