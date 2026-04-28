import React from 'react';

type DashCardProps = {
    title: string;
    content: React.ReactNode;
};
export function DashCard({ title, content }: DashCardProps) {
    return (
        <div className="h-full rounded-2xl border border-white/10 bg-neutral-900 p-5 shadow-md">
            <div className="mb-4 text-sm font-semibold text-neutral-400">
                {title}
            </div>
            <div className="flec-col flex h-full">{content}</div>
        </div>
    );
}
