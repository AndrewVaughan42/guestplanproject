import { useAppearance } from '@/hooks/use-appearance';
import Seat from '@/pages/components/seatplans/components/seat';
import {
    getSeatPosition,
    getTableDimensions,
} from '@/pages/shared/hooks/getSeatPosition';
import {
    canvasColours,
    isDarkMode,
} from '@/pages/shared/hooks/seatStyle';
import {
    isBrideSeat,
    isGroomSeat,
} from '@/pages/components/venueLayers/component/utils/seatHelper';
import { Circle, Group, Rect, Text } from 'react-konva';
import { Guest, Table } from 'resources/js/types';

interface TableChairsGroupProps {
    table: Table;
    guestMap: Map<number, Guest>;
    tableAllocations: Record<string, number | null>;
    selectedSeat: string | null;
    selectedTableId: string | null;
    activeGuestId?: number | null;
    hasConflict?: boolean;
    onDragEnd: (tableId: string, x: number, y: number) => void;
    onSeatClick: (seatId: string, isBrideOrGroom: boolean) => void;
    onSelectTable: (tableId: string | null) => void;
    selectedAllocatedSeat?: {
        tableId: string,
        seatIndex: number,
    } | null;
}

export default function TableChairsGroup({
    table,
    guestMap,
    tableAllocations,
    selectedSeat,
    selectedTableId,
    activeGuestId,
    hasConflict = false,
    onDragEnd,
    onSeatClick,
    onSelectTable,
    selectedAllocatedSeat,
}: TableChairsGroupProps) {
    const { appearance } = useAppearance();
    const dark = isDarkMode(appearance);
    const theme = dark ? canvasColours.dark : canvasColours.light;

    const tableFill = theme.table.fill;
    const tableStroke = theme.table.stroke;
    const textColor = theme.text;
    const tableSelected = theme.table.selectedFill;

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

    const isTableSelected = selectedTableId === table.id;



    const handleSelect = () => {
        if (activeGuestId) return;
        onSelectTable(selectedTableId === table.id ? null : table.id);
    };

    return (
        <Group
            x={table.x}
            y={table.y}
            onClick={handleSelect}
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
                    stroke={isTableSelected ? tableSelected : tableStroke}
                    strokeWidth={isTableSelected ? 3 : 2}
                    onClick={(e) => {
                        e.cancelBubble = true;
                        handleSelect();
                    }}
                />
            ) : (
                <Rect
                    x={-tableWidth / 2}
                    y={-tableHeight / 2}
                    width={tableWidth}
                    height={tableHeight}
                    fill={tableFill}
                    stroke={isTableSelected ? tableSelected : tableStroke}
                    strokeWidth={isTableSelected ? 3 : 2}
                    onClick={(e) => {
                        e.cancelBubble = true;
                        handleSelect();
                    }}
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
                const safeAllocations = tableAllocations || {};
                const guestId = safeAllocations[index] ?? safeAllocations[String(index)] ?? null;

                const guest = guestId ? (guestMap.get(Number(guestId)) ?? null) : null;
                const pos = getSeatPosition(index, table);

                const isSelectedAllocatedSeat =
                    selectedAllocatedSeat?.tableId === table.id &&
                    selectedAllocatedSeat.seatIndex === index;

                const isBrideOrGroom =
                    table.type === 'top' &&
                    (isBrideSeat(index, table) || isGroomSeat(index, table));

                return (
                    <Seat
                        seatId={seatId}
                        key={index}
                        guest={guest}
                        isSelected={selectedSeat === seatId}
                        isSelectedAllocatedSeat={isSelectedAllocatedSeat}
                        isActiveGuestAssignment={
                            Boolean(activeGuestId) && !guest
                        }
                        onClick={(e) => {
                            e.cancelBubble = true;
                            onSeatClick(seatId, isBrideOrGroom);
                        }}
                        x={pos.x}
                        y={pos.y}
                        isReserved={isBrideOrGroom && !guest}
                    />
                );
            })}
        </Group>
    );
}
