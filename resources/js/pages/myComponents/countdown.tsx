import { useEffect, useState } from 'react';

interface CountdownProps {
    weddingDate: string | Date;
    onComplete?: () => void;
}

function getDays(weddingDate: string | Date) {
    const today = new Date();
    const weddingDay = new Date(weddingDate);

    return Math.max(0, Math.floor((weddingDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
}


export default function Countdown({weddingDate, onComplete} : CountdownProps) {

    const [daysLeft, setDaysLeft] = useState<number>(() => getDays(weddingDate));

    useEffect(() => {
        const interval = setInterval(
            () => {
                const remaining = getDays(weddingDate);
                setDaysLeft(remaining);

                if (remaining <= 0) {
                    if (onComplete) {
                        onComplete();
                    }
                }
            },
            1000 * 60 * 60,
        );

        return () => clearInterval(interval);
    }, [weddingDate, onComplete]);

    return (
        <div className="flex h-full flex-col items-center justify-center bg-neutral-100 p-4 text-center dark:bg-neutral-800">
            <span className="text-4xl font-bold text-neutral-900 dark:text-neutral-100">{daysLeft}</span>
            <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Days to the Wedding</span>
        </div>
    );
}
