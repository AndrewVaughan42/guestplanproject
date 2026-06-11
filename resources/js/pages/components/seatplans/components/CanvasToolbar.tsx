interface CanvasToolbarProps {
    scale: number;
    saving: boolean;
    onReset: () => void;
    onSave: () => void;
    onAutoSeat: () => void;
}

export function CanvasToolbar({
    scale,
    saving,
    onReset,
    onSave,
    onAutoSeat,
}: CanvasToolbarProps) {
    return (
        <div className={'flex items-center gap-2 border-b p-2'}>
            <button onClick={onReset}>Reset</button>

            <span className={'text-sm'}>Scale: {Math.round(scale * 100)}%</span>

            <div className={'ml-auto flex gap-2'}>
                <button
                    onClick={onAutoSeat}
                    className={'flex gap-2 border px-3'}
                >
                    Auto Seat
                </button>

                <button onClick={onSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save'}
                </button>
            </div>
        </div>
    );
}
