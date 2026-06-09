import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { LayoutCanvas } from '@/pages/components/venueLayers/component/layout/LayoutCanvas';
import { TableSidebar } from '@/pages/components/venueLayers/component/layout/TableSidebar';
import { useVenueLayoutEditor } from '@/pages/components/venueLayers/hooks/useVenueLayerEditor';
import venueLayers from '@/routes/venue-layers';
import { VenueLayer, VenueSummary } from '@/types';
import { router } from '@inertiajs/react';
import { X } from 'lucide-react';

interface LayoutEditorPageProps {
    venues: VenueSummary[];
    selectedVenue: VenueSummary | null;
    layouts: VenueLayer[];
    layout: VenueLayer | null;
}

function LayerEditor({
    activeLayout,
    venueId,
    layouts,
}: {
    activeLayout: VenueLayer | null;
    venueId: number;
    layouts: VenueLayer[];
}) {
    const editor = useVenueLayoutEditor(activeLayout, venueId);

    const currentTableCount = editor.tables.length;
    const tableCountInAny = layouts.some(
        (l) =>
            l.table_data.length === currentTableCount,
    );
    const canUpdate = editor.isDirty && tableCountInAny && !editor.saving;
    const canSaveAsNew = !tableCountInAny && !editor.saving;

    return (
        <div className="flex h-full flex-col overflow-hidden bg-muted/40">
            <div className="flex items-center justify-between border-b bg-background px-3 py-2">
                <div className="flex items-center gap-2">
                    <span className={'px-3 py-1 text-sm font-semibold'}>
                        {editor.name}
                    </span>
                    <button
                        onClick={editor.addRoundTable}
                        className="rounded-md border bg-background px-3 py-1 text-sm hover:bg-accent"
                    >
                        + Round Table
                    </button>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={editor.undo}
                            className="rounded-md border bg-background px-3 py-1 text-sm hover:bg-accent"
                        >
                            Undo
                        </button>
                        <button
                            onClick={editor.redo}
                            className="rounded-md border bg-background px-3 py-1 text-sm hover:bg-accent"
                        >
                            Redo
                        </button>
                        <button
                            onClick={() => editor.update()}
                            className="rounded-md bg-foreground px-3 py-1 text-sm text-background hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!canUpdate}
                        >
                            Update
                        </button>
                        {editor.isDirty && (
                            <span className="rounded-md bg-destructive px-2 py-1 text-xs font-medium text-background">
                                Unsaved Changes
                            </span>
                        )}
                        <button
                            onClick={() => editor.save()}
                            className="rounded-md bg-foreground px-3 py-1 text-sm text-background hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!canSaveAsNew}
                        >
                            Save to New Layer
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                <div className="w-64 overflow-y-auto border-r bg-background p-3">
                    <h3 className="mb-2 font-semibold">Layouts</h3>

                    {layouts.length === 0 && (
                        <p className="text-sm text-gray-500">No layouts yet</p>
                    )}

                    {layouts.map((layer) => (
                        <div
                            key={layer.id}
                            className={cn(
                                'group relative mb-2 cursor-pointer rounded border p-3',
                                Number(activeLayout?.id) === Number(layer.id)
                                    ? 'bg-accent'
                                    : 'hover:bg-accent',
                            )}
                            onClick={() =>
                                router.get(venueLayers.show(layer.id).url)
                            }
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">
                                        {layer.name ?? 'Untitled'}
                                    </p>

                                    <p
                                        className={
                                            'text-xs text-muted-foreground'
                                        }
                                    >
                                        1 Top Table +{' '}
                                        {layer.table_data.length - 1} Round
                                        Tables
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm('Are you sure you want to delete this layer?')) {
                                            router.delete(venueLayers.destroy(layer.id).url);
                                        }
                                    }}
                                    className="absolute top-2 right-2 rounded-full bg-background p-1 hover:bg-accent"
                                >
                                    <X className="h-4 w-4 text-destructive" />
                                </button>
                            </div>

                        </div>
                    ))}
                </div>

                <div className="flex flex-1 flex-col overflow-hidden bg-muted/20">
                    <LayoutCanvas
                        tables={editor.tables}
                        selectedId={editor.selectedId}
                        onSelect={editor.setSelectedId}
                        onMove={editor.moveTable}
                        scale={editor.scale}
                        position={editor.pos}
                        setPosition={editor.setPos}
                        setScale={editor.setScale}
                    />
                </div>

                {editor.selectedTable && (
                    <TableSidebar
                        table={editor.selectedTable}
                        onUpdate={(key, value) =>
                            editor.updateTable(editor.selectedId!, {
                                [key]: value,
                            })
                        }
                        onDelete={() => editor.deleteTable(editor.selectedId!)}
                    />
                )}
            </div>
        </div>
    );
}
export default function LayoutEditor({
    venues,
    selectedVenue,
    layouts,
    layout,
}: LayoutEditorPageProps) {
    if (!selectedVenue) {
        return (
            <AppLayout>
                <div className="p-6">
                    <h2 className="mb-4 text-lg font-semibold">
                        Select a venue
                    </h2>

                    <select
                        className="rounded border bg-background p-2"
                        onChange={(e) => {
                            const venueId = e.target.value;
                            if (venueId) {
                                router.get('/venue-layers', {
                                    venue_id: venueId,
                                });
                            }
                        }}
                    >
                        <option value="">Choose venue...</option>
                        {venues.map((v) => (
                            <option key={v.id} value={v.id}>
                                {v.name}
                            </option>
                        ))}
                    </select>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="flex h-full flex-col">
                <div className="flex items-center gap-4 border-b p-3">
                    <select
                        value={selectedVenue.id}
                        onChange={(e) => {
                            router.get('/venue-layers', {
                                venue_id: e.target.value,
                            });
                        }}
                        className="rounded border bg-background p-1"
                    >
                        {venues.map((v) => (
                            <option key={v.id} value={v.id}>
                                {v.name}
                            </option>
                        ))}
                    </select>
                </div>

                <LayerEditor
                    activeLayout={layout}
                    venueId={selectedVenue.id}
                    layouts={layouts}
                />
            </div>
        </AppLayout>
    );
}
