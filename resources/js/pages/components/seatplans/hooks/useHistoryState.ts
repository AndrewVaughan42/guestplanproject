import { useState } from 'react';

function useHistoryState<T>(initialValue: T) {
    const [past, setPast] = useState<T[]>([initialValue]);
    const [present, setPresent] = useState<T>(initialValue);
    const [future, setFuture] = useState<T[]>([]);

    const set = (value: T) => {
        setFuture([]);
        setPast([...past, present]);
        setPresent(value);
    };

    const undo = () => {
        if (past.length > 1) {
            setFuture([present, ...future]);
            setPresent(past[past.length - 2]);
            setPast(past.slice(0, -1));
        }
    };

    const redo = () => {
        if (future.length > 0) {
            setPast([...past, present]);
            setPresent(future[0]);
            setFuture(future.slice(1));
        }
    };

    return { present, set, undo, redo };
}
