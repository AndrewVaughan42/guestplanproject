import { useState } from 'react';
import { Button } from '@/components/ui/button';

type ColourPickerProps = {
    value: string;
    onChange: (colour: string) => void;
}
 export const GROUP_COLOURS = [
    '#4C78A8',
    '#54A248',
    '#E45746',
    '#B279A2',
    '#7287B2',
    '#F2CF58',
    '#90755D',
    '#6C6C6C',
    '#8C6DAD',
    '#D2691E',
];
export default function ColourPicker({value, onChange}: ColourPickerProps) {
    const [open, setOpen] = useState(false);
    return (
        <div className="relative inline-block">
            <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setOpen((c) => !c)}
                >
                <span className="h-4 w-4 rounded-full border" style={{backgroundColor: value}}/>
                <span className="text-sm font-mono">{value}</span>
            </Button>

            {open && (
                <div className="absolute z-50 mt-2 w-48 rounded-md border bg-background p-2 shadow-md">
                    {GROUP_COLOURS?.length > 0 && (
                        <div className="grid grid-cols-5 gap-2">
                            {GROUP_COLOURS.map((colour) => (
                                <button
                                    key={colour}
                                    className={`h-6 w-6 rounded-full border transition hover:scale-105 ${colour === value ? 'ring-2 ring-black dark:ring-white' : ''}`}
                                    style={{backgroundColor: colour}}
                                    onClick={() => {
                                        onChange(colour);
                                        setOpen(false);
                                    }}
                                />
                            ))}

                        </div>
                    )}
                    <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                        Pick your own colour:
                        <input
                            type="color"
                            className="h-6 w-10 cursor-pointer rounded-full border-none"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                        />
                    </div>
                </div>

            )}
        </div>
    )
}
