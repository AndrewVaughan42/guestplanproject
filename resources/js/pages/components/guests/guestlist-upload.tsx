import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import { Textarea } from '@headlessui/react';

type ParsedGuest = { name: string; error?: string };
export default function GuestlistUpload({
    onImport,
    open,
    setOpen,
}: {
    onImport: (guests: { name: string }[]) => void;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [rawInput, setRawInput] = useState('');
    const [parsedInput, setParsedInput] = useState<ParsedGuest[]>([]);
    const [filename, setFilename] = useState<string | null>(null);

    const handleFile = (file: File) => {
        setFilename(file.name);

        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target) {
                const text = e.target.result as string;
                parseInput(text);
            }
        };
        reader.readAsText(file);
    };
    const handleChange = (value: string) => {
        setRawInput(value);
        parseInput(value);
    };

    const parseInput = (text: string) => {
        const names = text
            .split(/[\n]+/)
            .map((name) => name.trim())
            .filter(Boolean);

        const seen = new Set<string>();

        const parsed: ParsedGuest[] = names.map((name) => {
            const normalizedName = name.toLowerCase();
            if (seen.has(normalizedName)) {
                return { name, error: 'Duplicate name' };
            }
            if (!name.match(/^[a-zA-Z\s]+$/)) {
                return { name, error: 'Invalid name' };
            }
            seen.add(normalizedName);
            return { name };
        });
            setParsedInput(parsed);
    };

    const validGuests = parsedInput.filter((guest) => !guest.error);

    const clearSelection = () => {
        setRawInput('');
        setParsedInput([]);
        setFilename(null);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(val) => {
                if (!val) clearSelection();
                setOpen(val);
            }}
        >
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Import Guest List</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                    <div className={'flex items-center gap-2'}>
                        <Input
                            type="file"
                            accept=".csv,text/plain"
                            onChange={(e) => {
                                if (e.target.files) {
                                    handleFile(e.target.files[0]);
                                }
                            }}
                        />
                        {filename && (
                            <span className="text-sm text-muted-foreground">
                                {filename}
                            </span>
                        )}
                    </div>
                    <Textarea
                        placeholder="Paste guest names here (one per line)..."
                        className="h-40"
                        rows={5}
                        value={rawInput}
                        onChange={(e: { target: { value: string } }) =>
                            handleChange(e.target.value)
                        }
                    />

                    {parsedInput.length > 0 && (
                        <div className="flex max-h-48 flex-col gap-2 overflow-y-auto">
                            <h3 className="text-lg font-semibold">
                                ({validGuests.length} Guests Valid /{' '}
                                {parsedInput.length} Entered)
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                                {parsedInput.map((guest, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2"
                                    >
                                        <span
                                            className={`text-sm ${guest.error ? 'text-destructive' : 'text-muted-foreground'}`}
                                        >
                                            {guest.name}
                                            {guest.error && ` (${guest.error})`}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={clearSelection}>
                            Clear
                        </Button>

                        <Button
                            onClick={() => {
                                onImport(
                                    validGuests.map((g) => ({ name: g.name })),
                                );
                                setOpen(false);
                                clearSelection();
                            }}
                            disabled={validGuests.length === 0}
                        >
                            Import List
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
