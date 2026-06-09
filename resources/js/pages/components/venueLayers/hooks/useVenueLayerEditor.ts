import venueLayers from '@/routes/venue-layers';
import { Table, VenueLayer } from '@/types';
import { router } from '@inertiajs/react';
import { useCallback, useState } from 'react';

interface EditorSnapshot {
    tables: Table[];
}

function createTable(index: number, type: 'round' | 'top' = 'round'): Table {
    const base = {
        id: Math.random().toString(36).substring(2, 15),
        x: 0.1 + (index % 5) * 0.15,
        y: 0.1 + Math.floor(index / 5) * 0.15,
    };

    if (type === 'round') {
        return {
            ...base,
            name: `Table`,
            type: 'round',
            seat_minimum: 5,
            seat_maximum: 10,
            seat_count: 8,
        };
    } else {
        return {
            ...base,
            name: `Top Table`,
            type: 'top',
            seats_per_side: 4,
            width: 100,
            height: 60,
        };
    }
}

function createSnapshot(tables: Table[]): EditorSnapshot {
    return {
        tables: structuredClone(tables),
    };
}

const gridSize = 20;

export function useVenueLayoutEditor(
    initial: VenueLayer | null,
    venueId: number,
) {
    const initTables: Table[] = initial?.table_data?.length
        ? (initial.table_data as Table[])
        : [createTable(0, 'top')];

    const [tables, setTables] = useState<Table[]>(initTables);

    const [name, setName] = useState(initial?.name ?? 'New Layer');
    const [saving, setSaving] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    const [snapEnabled, setSnapEnabled] = useState(true);
    const [scale, setScale] = useState(1);
    const [pos, setPos] = useState({ x: 0, y: 0 });

    const [selectedTableIds, setSelectedTableIds] = useState<string[]>([]);
    const selectedId = selectedTableIds[0] ?? null;
    const setSelectedId = useCallback((id: string | null) => {
        setSelectedTableIds(id ? [id] : []);
    }, []);

    const selectedTable = tables.find((t) => t.id === selectedId) ?? null;

    const [history, setHistory] = useState<EditorSnapshot[]>([
        createSnapshot(initTables),
    ]);

    const [historyIndex, setHistoryIndex] = useState(0);

    const snap = useCallback(
        (value: number) =>
            snapEnabled ? Math.round(value / gridSize) * gridSize : value,
        [snapEnabled],
    );

    const commit = useCallback(
        (nextTables: Table[]) => {
            setTables(nextTables);
            setIsDirty(true);

            const trimmed = history.slice(0, historyIndex + 1);
            const nextHistory = [...trimmed, createSnapshot(nextTables)];

            setHistory(nextHistory);
            setHistoryIndex(nextHistory.length - 1);
        },
        [history, historyIndex],
    );

    const addRoundTable = useCallback(() => {
        const next = [...tables, createTable(tables.length, 'round')];
        commit(next);
    }, [tables, commit]);

    const deleteTable = useCallback(
        (id: string) => {
            const next = tables.filter((t) => t.id !== id);
            commit(next);
            setSelectedTableIds((p) => p.filter((x) => x !== id));
        },
        [tables, commit],
    );

    const moveTable = useCallback(
        (id: string, x: number, y: number) => {
            const next = tables.map((t) =>
                t.id === id ? { ...t, x: snap(x), y: snap(y) } : t,
            );
            commit(next);
        },
        [tables, commit, snap],
    );

    const rotateTable = useCallback(
        (id: string, deg = 90) => {
            const next = tables.map((t) =>
                t.id === id ? { ...t, rotation: (t.rotation ?? 0) + deg } : t,
            );
            commit(next);
        },
        [tables, commit],
    );

    const updateTable = useCallback(
        (id: string, updates: Partial<Table>) => {
            const next = tables.map((t) =>
                t.id === id ? ({ ...t, ...updates } as Table) : t,
            );
            commit(next);
        },
        [tables, commit],
    );

    const undo = useCallback(() => {
        if (historyIndex <= 0) return;

        const prev = history[historyIndex - 1];
        setTables(prev.tables);
        setHistoryIndex(historyIndex - 1);
    }, [history, historyIndex]);

    const redo = useCallback(() => {
        if (historyIndex >= history.length - 1) return;

        const next = history[historyIndex + 1];
        setTables(next.tables);
        setHistoryIndex(historyIndex + 1);
    }, [history, historyIndex]);

    const save = useCallback(() => {
        setSaving(true);

        router.post(
            venueLayers.store().url,
            {
                venue_id: venueId,
                table_data: JSON.parse(JSON.stringify(tables)),
            },
            {
                onFinish: () => {
                    setSaving(false);
                    setIsDirty(false);
                },
            },
        );
    }, [tables, venueId]);

    const update = useCallback(
        (layerId?: number) => {
            const id = layerId ?? initial?.id;
            if (!id) {
                save();
                return;
            }

            setSaving(true);

            router.put(
                venueLayers.update(id).url,
                {
                    venue_id: venueId,
                    table_data: JSON.parse(JSON.stringify(tables)),
                },
                {
                    onFinish: () => {
                        setSaving(false);
                        setIsDirty(false);
                    },
                },
            );
        },
        [initial?.id, save, tables, venueId],
    );

    return {
        tables,
        name,
        setName,

        addRoundTable,

        deleteTable,
        moveTable,
        rotateTable,
        updateTable,

        selectedTableIds,
        setSelectedTableIds,
        selectedId,
        setSelectedId,
        selectedTable,

        snapEnabled,
        setSnapEnabled,

        scale,
        setScale,
        pos,
        setPos,

        undo,
        redo,

        save,
        update,
        saving,
        isDirty,

        canUndo: historyIndex > 0,
        canRedo: historyIndex < history.length - 1,
    };
}
