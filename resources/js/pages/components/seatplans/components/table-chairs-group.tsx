import Seat from '@/pages/components/seatplans/components/seat';
import { getSeatPosition, getTableDimensions } from '@/pages/components/seatplans/utils/getSeatPosition';
import {
    isBrideSeat,
    isGroomSeat,
} from '@/pages/components/venueLayers/component/utils/seatHelper';
import { Circle, Group, Rect, Text } from 'react-konva';
import { Guest, Table } from 'resources/js/types';
import { useAppearance } from '@/hooks/use-appearance';
import { canvasColours, isDarkMode } from '@/pages/components/seatplans/utils/seatStyle';



interface TableChairsGroupProps {
    table: Table;
    guestMap: Map<number, Guest>;
    tableAllocations: Record<string, number | null>;
    selectedSeat: string | null;
    hasConflict?: boolean;
    onDragEnd: (tableId: string, x: number, y: number) => void;
    onSeatClick: (seatId: string) => void;
}

export default function TableChairsGroup({
    table,
    guestMap,
    tableAllocations,
    selectedSeat,
    hasConflict = false,
    onDragEnd,
    onSeatClick,
}: TableChairsGroupProps) {
    const { appearance } = useAppearance();
    const dark = isDarkMode(appearance);
    const theme = dark ? canvasColours.dark : canvasColours.light;

    const tableFill = theme.table.fill;
    const tableStroke = theme.table.stroke;
    const textColor = theme.text;

    const isTableRound = table.type === 'round';
    const dims = getTableDimensions(table);
    const tableWidth = table.type === 'top' ? dims.width! : 100;
    const tableHeight = table.type === 'top' ? dims.height! : 60;
    const seatCount =
        table.type === 'round'
            ? table.seat_count
            : table.seats_per_side * 2 + 2;

    const radius = isTableRound
        ? dims.radius!
        : Math.max(tableWidth, tableHeight) / 2;

    return (
        <Group
            x={table.x}
            y={table.y}
            rotation={table.rotation ?? 0}
            draggable={false}
            onDragEnd={(e) => onDragEnd(table.id, e.target.x(), e.target.y())}
        >
            {/* Table Conflict Indicator */}
            {hasConflict && (
                <Circle
                    radius={radius + 5}
                    stroke={theme.indicators.conflict}
                    strokeWidth={2}
                    dash={[5, 5]}
                />
            )}

            {isTableRound ? (
                <Circle
                    radius={dims.radius!}
                    fill={tableFill}
                    stroke={tableStroke}
                    strokeWidth={2}
                />
            ) : (
                <Rect
                    x={-tableWidth / 2}
                    y={-tableHeight / 2}
                    width={tableWidth}
                    height={tableHeight}
                    fill={tableFill}
                    stroke={tableStroke}
                    strokeWidth={2}
                />
            )}
            {/* Label for Table Name */}
            <Text
                text={table.name}
                width={isTableRound ? dims.radius! * 2 : tableWidth}
                height={isTableRound ? dims.radius! * 2 : tableHeight}
                offsetX={isTableRound ? dims.radius! : tableWidth / 2}
                offsetY={isTableRound ? dims.radius! : tableHeight / 2}
                x={0}
                y={0}
                fontSize={12}
                fill={textColor}
                align={'center'}
                verticalAlign={'middle'}
            />
            {/* Seat Rendering */}
            {Array.from({ length: seatCount }).map((_, index) => {
                const seatId = `${table.id}-${index}`;
                const guestId = tableAllocations?.[String(index)] ?? null;

                const guest = guestId ? (guestMap.get(guestId) ?? null) : null;
                const pos = getSeatPosition(index, table);

                const isBrideOrGroom =
                    table.type === 'top' &&
                    (isBrideSeat(index, table) ||
                       isGroomSeat(index, table));

                return (
                    <Seat
                        key={index}
                        guest={guest}
                        isSelected={selectedSeat === seatId}
                        onClick={() => onSeatClick(seatId)}
                        x={pos.x}
                        y={pos.y}
                        isReserved={isBrideOrGroom}
                    />
                );
            })}

            {/* Minimum Seats Indicators */}
            {table.type === 'round' &&
                Array.from({ length: table.seat_minimum }).map((_, index) => {
                    const pos = getSeatPosition(index, table);
                    // Offset the indicator slightly inside the seat position
                    const indicatorX = pos.x * 0.8;
                    const indicatorY = pos.y * 0.8;
                    return (
                        <Circle
                            key={`min-${index}`}
                            radius={3}
                            x={indicatorX}
                            y={indicatorY}
                            fill={theme.indicators.minimum}
                        />
                    );
                })}
        </Group>
    );
}
