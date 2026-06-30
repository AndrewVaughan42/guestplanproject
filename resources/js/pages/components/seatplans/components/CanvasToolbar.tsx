import { Button } from '@headlessui/react';

interface CanvasToolbarProps {
    saving: boolean;
    onSave: () => void;
    onAutoSeat: () => void;

    currentLayer: number
    totalLayers: number
    onPreviousLayer: () => void
    onNextLayer: () => void
    isAutoSeatDisabled?: boolean
}

export function CanvasToolbar({
    saving,
    onSave,
    onAutoSeat,
    currentLayer,
    totalLayers,
    onPreviousLayer,
    onNextLayer,
    isAutoSeatDisabled = false
}: CanvasToolbarProps) {
    return (
        <div className={'flex items-center justify-between border-b px-4 py-2'}>
            <div className="flex items-center gap-2">
                <Button
                    onClick={onAutoSeat}
                    disabled={isAutoSeatDisabled}
                    className={
                        'rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed'
                    }
                >
                    Auto Seat
                </Button>
                {isAutoSeatDisabled && (
                    <span className="text-xs text-muted-foreground">
                        Fill top table to enable auto-seat
                    </span>
                )}
            </div>

            <div className={'flex items-center gap-3'}>
                <Button
                    onClick={onPreviousLayer}
                    disabled={currentLayer <= 1}
                    className={
                        'rounded-md border px-3 py-2 hover:bg-muted disabled:opacity-50'
                    }
                >
                    -
                </Button>
                <span className={'min-h-25 text-center text-sm font-medium'}>
                    Layer {currentLayer} / {totalLayers}
                </span>
                <Button
                    onClick={onNextLayer}
                    disabled={currentLayer >= totalLayers}
                    className={
                        'rounded-md border px-3 py-2 hover:bg-muted disabled:opacity-50'
                    }
                >
                    +
                </Button>
            </div>

            <Button
                onClick={onSave}
                disabled={saving}
                className={
                    'rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50 dark:bg-white text-black'
                }
            >
                {saving ? 'Saving...' : 'Save'}
            </Button>
        </div>
    );
}
