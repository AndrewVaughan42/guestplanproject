import { usePanZoom } from '@/pages/shared/hooks/usePanZoom';
import venueLayers from '@/routes/venue-layers';
import { Table, VenueLayer } from '@/types';
import { router } from '@inertiajs/react';
import { useCallback, useState, useMemo } from 'react';
import { useBaseCanvasEditor } from '@/pages/shared/hooks/useBaseCanvasEditor';

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

const gridSize = 20;

export function useVenueLayoutEditor(
    initial: VenueLayer | null,
    venueId: number,
) {
    const initTables: Table[] = useMemo(() => {
        return initial?.table_data?.length
            ? (initial.table_data as Table[])
            : [createTable(0, 'top')];
    }, [initial]);

    const base = useBaseCanvasEditor(initTables);
    const panZoom = usePanZoom();

    const [name, setName] = useState(initial?.name ?? 'New Layer');
    const [saving, setSaving] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    const [snapEnabled, setSnapEnabled] = useState(true);

    const setSelectedId = useCallback((id: string | null) => {
        base.setSelectedTableIds(id ? [id] : []);
    }, [base]);

    const snap = useCallback(
        (value: number) =>
            snapEnabled ? Math.round(value / gridSize) * gridSize : value,
        [snapEnabled],
    );

    const addRoundTable = useCallback(() => {
        base.setTables([...base.tables, createTable(base.tables.length, 'round')]);
        setIsDirty(true);
    }, [base]);

    const moveTableWithSnap = useCallback(
        (id: string, x: number, y: number) => {
            base.moveTable(id, x, y, snap);
            setIsDirty(true);
        },
        [base, snap],
    );

    const updateTableWithDirty = useCallback(
        (id: string, updates: Partial<Table>) => {
            base.updateTable(id, updates);
            setIsDirty(true);
        },
        [base],
    );

    const deleteTableWithDirty = useCallback(
        (id: string) => {
            base.deleteTable(id);
            setIsDirty(true);
        },
        [base],
    );

    const rotateTableWithDirty = useCallback(
        (id: string, deg = 90) => {
            base.rotateTable(id, deg);
            setIsDirty(true);
        },
        [base],
    );

    const save = useCallback(() => {
        setSaving(true);

        router.post(
            venueLayers.store().url,
            {
                venue_id: venueId,
                table_data: JSON.parse(JSON.stringify(base.tables)),
            },
            {
                onFinish: () => {
                    setSaving(false);
                    setIsDirty(false);
                },
            },
        );
    }, [base.tables, venueId]);

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
                    table_data: JSON.parse(JSON.stringify(base.tables)),
                },
                {
                    onFinish: () => {
                        setSaving(false);
                        setIsDirty(false);
                    },
                },
            );
        },
        [initial?.id, save, base.tables, venueId],
    );

    return {
        ...base,
        ...panZoom,
        name,
        setName,

        addRoundTable,

        deleteTable: deleteTableWithDirty,
        moveTable: moveTableWithSnap,
        rotateTable: rotateTableWithDirty,
        updateTable: updateTableWithDirty,

        setSelectedId,

        snapEnabled,
        setSnapEnabled,

        save,
        update,
        saving,
        isDirty,
    };
}
