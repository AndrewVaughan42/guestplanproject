import { useState, useCallback } from 'react';

export function useHistoryState<T>(initialValue: T) {
    const [history, setHistory] = useState<T[]>([initialValue]);
    const [index, setIndex] = useState(0);

    const present = history[index];

    const set = useCallback((value: T) => {
        setHistory((prev) => {
            const next = prev.slice(0, index + 1);
            return [...next, value];
        });
        setIndex((prev) => prev + 1);
    }, [index]);

    const undo = useCallback(() => {
        if (index > 0) {
            setIndex((prev) => prev - 1);
        }
    }, [index]);

    const redo = useCallback(() => {
        if (index < history.length - 1) {
            setIndex((prev) => prev + 1);
        }
    }, [index, history.length]);

    return { present, set, undo, redo, history, index };
}
