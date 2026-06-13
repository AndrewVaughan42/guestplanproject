import { Table, TopTable } from '@/types';

export const SEAT_RADIUS = 22;
export const SEAT_DISTANCE = 15;

export function getTableDimensions(table: Table) {
    if (table.type === 'round') {

        const tableSpacing = 60;
        const circumference = table.seat_count * tableSpacing;
        const radius = circumference / (2 * Math.PI);

        const finalRadius = Math.max(radius, 40);
        return {
            radius: finalRadius,
            seatDistance: finalRadius + SEAT_RADIUS + 10
        };
    }

    const totalSeats = table.seats_per_side * 2 + 2;
    const tableWidthSpacing = 60;
    const width = Math.max(100, totalSeats * tableWidthSpacing);
    const height = 60;

    return {
        width,
        height
    };
}

export function getSeatPosition(index: number, table: Table) {
    const dims = getTableDimensions(table);
    if (table.type === 'round') {
        const angle = (2 * Math.PI * index) / table.seat_count;
        const seatDistance = dims.seatDistance as number;
        return {
            x: Math.cos(angle) * seatDistance,
            y: Math.sin(angle) * seatDistance,
        };
    }

    const top = table as TopTable;
    const { width, height } = dims as { width: number; height: number };
    const totalSeats = top.seats_per_side * 2 + 2;
    const spacing = width / totalSeats;


    const startX = -((totalSeats - 1) * spacing) / 2;
    const xPos = startX + index * spacing;
    const yPos = -height / 2 - SEAT_RADIUS - 10;

    return {
        x: xPos,
        y: yPos,
    };
}
