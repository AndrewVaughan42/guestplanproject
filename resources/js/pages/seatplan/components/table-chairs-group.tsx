import Seat from '@/pages/seatplan/components/seat';
import { Guest, Table } from '@/types';
import { Circle, Group, Rect, Text } from 'react-konva';

const TABLE_RADIUS = 10; // Circular Tables
//Need to set up special rect table for main
interface TableChairsGroupProps {
    table: Table;
    guestMap: Map<number, Guest>;
    tableAllocations: Record<string, number | null>;
    selectedSeat: string | null;
    onDragEnd: (tableId: number, x: number, y: number) => void;
    onSeatClick: (seatId: string) => void;
}

export default function TableChairsGroup({
    table,
    guestMap,
    tableAllocations,
    selectedSeat,
    onDragEnd,
    onSeatClick,
}: TableChairsGroupProps) {
    const isTableRound = table.shape === 'round';
    return (
        <Group
            x={table.x}
            y={table.y}
            draggable
            onDragEnd={(e) => onDragEnd(table.id, e.target.x(), e.target.y())}
        >
            {isTableRound ? (
                <Circle
                    key={table.id}
                    radius={TABLE_RADIUS}
                    fill="red"
                    stroke={'blue'}
                    strokeWidth={2}
                />
            ) : (
                <Rect /> //Do later, get the basics done first
            )}

            <Text
                text={table.name}
                fontSize={12}
                fill="black"
                align={'center'}
                verticalAlign={'middle'}
                width={TABLE_RADIUS * 2}
                height={TABLE_RADIUS * 2}
                offsetY={TABLE_RADIUS}
                offsetX={TABLE_RADIUS}
                listening={false}
            />

            {Array.from({ length: table.seat_count }).map((_, index) => {
                const guestId = tableAllocations?.[String(index)] ?? null;
                const seatId = `${table.id}-${index}`
                const guest = guestId ? (guestMap.get(guestId) ?? null) : null;
                const isSelected = selectedSeat === `${table.id}-${index}`;

                return (
                    <Seat
                        key={index}
                        index={index}
                        totalSeats={table.seat_count}
                        guest={guest}
                        isSelected={isSelected}
                        onClick={() => onSeatClick(seatId)}
                    />
                );
            })}
        </Group>
    );
}
