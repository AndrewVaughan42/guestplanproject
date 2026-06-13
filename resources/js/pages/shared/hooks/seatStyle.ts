import { Guest } from '@/types';
import { Appearance } from '@/hooks/use-appearance';

export const canvasColours = {
    light: {
        table: {
            fill: '#f8fafc',
            stroke: '#94a3b8',
            selectedFill: '#dbeafe',
            selectedStroke: '#2563eb',
            canvasSelectedFill: '#008000', // Used in LayoutCanvas
            canvasSelectedStroke: '#FFD700',
        },
        seat: {
            empty: '#ffffff',
            reserved: '#525252',
            selected: '#3b82f6',
            occupied: '#9ca3af',
            stroke: '#94a3b8',
            special: '#FFFFFF', // For EditorTableGroup non-bride/groom
        },
        text: '#0f172a',
        textOnSeat: '#0f172a',
        indicators: {
            conflict: 'red',
            minimum: '#ef4444',
            brideGroom: '#FACC15',
        }
    },
    dark: {
        table: {
            fill: '#1e293b',
            stroke: '#475569',
            selectedFill: '#1e3a8a',
            selectedStroke: '#2563eb',
            canvasSelectedFill: '#008000',
            canvasSelectedStroke: '#FFD700',
        },
        seat: {
            empty: '#f8fafc',
            reserved: '#94a3b8',
            selected: '#3b82f6',
            occupied: '#475569',
            stroke: '#1e293b',
            special: '#334155',
        },
        text: '#f8fafc',
        textOnSeat: '#f8fafc', // High contrast text for seat initials
        indicators: {
            conflict: 'red',
            minimum: '#ef4444',
            brideGroom: '#FACC15',
        }
    }
} as const;

export const isDarkMode = (appearance?: Appearance) => {
    return appearance === 'dark' || (appearance === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);
};


export function resolveSeatStyle(params: {
    guest: Guest | null;
    isSelected: boolean;
    isActiveGuestAssignment?: boolean;
    isReserved: boolean;
    appearance?: Appearance;
}) {
    const theme = isDarkMode(params.appearance) ? canvasColours.dark : canvasColours.light;
    const colors = theme.seat;

    if (params.guest) return colors.occupied;
    if (params.isSelected) return colors.selected;
    if (params.isActiveGuestAssignment) return '#bbf7d0'; // Light green for assignable
    if (params.isReserved) return colors.reserved;
    return colors.empty;
}
