import { TopTable } from '@/types';

export function getTopTableSeatCount(table: TopTable) {
    return table.seats_per_side * 2 + 2;
}


export function isBrideSeat(index: number, table: TopTable) {
    const totalSeats = getTopTableSeatCount(table);
    return index === Math.floor(totalSeats / 2) - 1;
}

export function isGroomSeat(index: number, table: TopTable) {
    const totalSeats = getTopTableSeatCount(table);
    return index === Math.floor(totalSeats / 2);
}
