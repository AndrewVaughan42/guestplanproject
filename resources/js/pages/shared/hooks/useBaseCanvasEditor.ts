import { useHistoryState } from '@/pages/components/seatplans/hooks/useHistoryState';
import { Table } from '@/types';
import { useCallback, useMemo, useState } from 'react';

export function useBaseCanvasEditor(initialTables: Table[]) {
    const {
        present: tables,
        set: setTables,
        undo,
        redo,
        history,
        index,
    } = useHistoryState(initialTables);

    const [selectedTableIds, setSelectedTableIds] = useState<string[]>([]);
    const selectedId = selectedTableIds[0] ?? null;
    const selectedTable = useMemo(
        () => tables.find((table) => table.id === selectedId) ?? null,
        [tables, selectedId],
    );

    const updateTable = useCallback(
        (id: string, updates: Partial<Table>) => {
            const nextTables = tables.map((table) =>
                table.id === id ? ({ ...table, ...updates } as Table) : table,
            );
            setTables(nextTables);
        },
        [tables, setTables],
    );

    const moveTable = useCallback(
        (id: string, x: number, y: number, snap?: (v: number) => number) => {
            updateTable(id, { x: snap ? snap(x) : x, y: snap ? snap(y) : y });
        },
        [updateTable],
    );

    const rotateTable = useCallback(
        (id: string, deg = 90) => {
            const table = tables.find((t) => t.id === id);
            if (!table) return;
            updateTable(id, { rotation: (table.rotation ?? 0) + deg });
        },
        [tables, updateTable],
    );

    const deleteTable = useCallback(
        (id: string) => {
            const next = tables.filter((t) => t.id !== id);
            setTables(next);
            setSelectedTableIds((p) => p.filter((x) => x !== id));
        },
        [tables, setTables],
    );

    return {
        tables,
        setTables,
        selectedId,
        selectedTable,
        selectedTableIds,
        setSelectedTableIds,
        updateTable,
        moveTable,
        rotateTable,
        deleteTable,
        undo,
        redo,
        canUndo: index > 0,
        canRedo: index < history.length - 1,
    };
}
