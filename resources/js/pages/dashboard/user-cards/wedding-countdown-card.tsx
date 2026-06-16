import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { SharedData } from '@/types';
import { DashCard } from '@/pages/dashboard/dash-card';

function getDays(weddingDate: string | Date) {
    const today = new Date();
    const target = new Date(weddingDate);

    //Default midnight
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    return Math.max(
        0,
        Math.floor(
            (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        ),
    );
}

function getSeatplanDeadline(weddingDate: string | Date) {
    const date = new Date(weddingDate);
    date.setMonth(date.getMonth() - 1);
    return date;
}

export default function WeddingCountdownCard() {
    const { auth } = usePage<SharedData>().props;
    const weddingDate = auth.user.wedding?.date;

    const seatplanDeadline = weddingDate
        ? getSeatplanDeadline(weddingDate)
        : null;

    const [daysToWedding, setDaysToWedding] = useState<number>(() =>
        weddingDate ? getDays(weddingDate) : 0,
    );

    const [daysToSeatplanDeadline, setDaysToSeatplanDeadline] =
        useState<number>(() =>
            seatplanDeadline ? getDays(seatplanDeadline) : 0,
        );

    useEffect(() => {
        if (!weddingDate) return;

        const interval = setInterval(
            () => {
                setDaysToWedding(getDays(weddingDate));
                setDaysToSeatplanDeadline(
                    getDays(getSeatplanDeadline(weddingDate)),
                );
            },
            1000 * 60 * 60,
        );

        return () => clearInterval(interval);
    }, [weddingDate]);

    if (!weddingDate) {
        return (
            <DashCard
                title={'Your Wedding'}
                content={<p>No Wedding Set Up</p>}
            />
        );
    }

    const cardContent = (
        <div className="w-full">
            <div className="grid grid-cols-2 gap-4 text-center">
                {/* Wedding Date */}
                <div>
                    <div className="text-xs text-neutral-500">Wedding Date</div>
                    <div className="text-lg font-semibold">
                        {new Date(weddingDate).toLocaleDateString()}
                    </div>
                </div>

                {/* Days to Wedding */}
                <div>
                    <div className="text-xs text-neutral-500">
                        Days Till Wedding
                    </div>
                    <div className="text-4xl font-extrabold">
                        {daysToWedding}
                    </div>
                </div>

                {/* Deadline Date */}
                <div>
                    <div className="text-xs text-neutral-500">
                        Seatplan Deadline
                    </div>
                    <div className="text-lg font-semibold">
                        {seatplanDeadline
                            ? seatplanDeadline.toLocaleDateString()
                            : 'Not Set'}
                    </div>
                </div>

                {/* Days to Deadline */}
                <div>
                    <div className="text-xs text-neutral-500">
                        Days Till Seatplan Deadline
                    </div>
                    <div
                        className={`text-3xl font-bold ${
                            daysToSeatplanDeadline <= 7
                                ? 'animate-pulse text-red-500'
                                : daysToSeatplanDeadline <= 14
                                  ? 'text-yellow-500'
                                  : 'text-green-500'
                        }`}
                    >
                        {daysToSeatplanDeadline}
                    </div>
                </div>
            </div>
        </div>
    );

    return <DashCard title={'Your Wedding'} content={cardContent} />;
}
