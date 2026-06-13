import {
    getSeatPosition,
    getTableDimensions,
    SEAT_RADIUS,
} from '@/pages/shared/hooks/getSeatPosition';
import { Table } from '@/types';
import { Circle, Group, Rect, Text } from 'react-konva';
import { getTopTableSeatCount, isBrideSeat, isGroomSeat } from '@/pages/components/venueLayers/component/utils/seatHelper';
import { useAppearance } from '@/hooks/use-appearance';
import { canvasColours, isDarkMode } from '@/pages/shared/hooks/seatStyle';
import { useRef } from 'react';


interface EditorTableGroupProps {
    table: Table;
    selected: boolean;
    onSelect: () => void;
    onMove: (Id: string, x: number, y: number) => void;
}

export function EditorTableGroup({
    table,
    selected,
    onSelect,
    onMove,
}: EditorTableGroupProps) {
    const { appearance } = useAppearance();
    const dark = isDarkMode(appearance);
    const theme = dark ? canvasColours.dark : canvasColours.light;

    const stroke = selected ? theme.table.selectedStroke : theme.table.stroke;
    const fill = selected ? theme.table.selectedFill : theme.table.fill;
    const textColor = theme.text;

    const seatCount = table.type === 'round' ? table.seat_count : getTopTableSeatCount(table);
    const dims = getTableDimensions(table);

    const tableWidth = table.type === 'top' ? dims.width! : 100;
    const tableHeight = table.type === 'top' ? dims.height! : 60;

    const dragStartPos = useRef<{x: number, y: number} | null>(null)

    return (
        <Group
            x={table.x}
            y={table.y}
            rotation={table.rotation ?? 0}
            draggable={!table.locked}
            onClick={onSelect}
            onDragStart={(e) => {
                if (e.evt && e.evt.button !== 0) {
                    e.target.stopDrag();
                    return;
                }
                dragStartPos.current = {x: e.target.x(), y: e.target.y()}
            }}
            onDragMove={(e) => {
                if (!e.evt.shiftKey || !dragStartPos.current) return;

                const node = e.target;
                const startPos = dragStartPos.current;

                const stage =node.getStage();
                const pointerPos = stage?.getPointerPosition();
                if (!stage || !pointerPos) return;

                const dx = Math.abs(node.x() - startPos.x);
                const dy = Math.abs(node.y() - startPos.y);

                if (dx < dy) {
                    node.x(startPos.x);
                } else {
                    node.y(startPos.y);
                }
            }}
            onDragEnd={(e) => {
                dragStartPos.current = null;
                onMove(table.id, e.target.x(), e.target.y())
            }}
            onMouseDown={(e) => {
                if (e.evt.button !== 0) {
                    e.cancelBubble = true;
                }
            }}


        >
            {table.type === 'round' ? (
                <Circle
                    radius={dims.radius!}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={2}
                />
            ) : (
                <Rect
                    x={-tableWidth / 2}
                    y={-tableHeight / 2}
                    width={tableWidth}
                    height={tableHeight}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={2}
                />
            )}
            <Text
                text={table.name}
                width={table.type === 'top' ? tableWidth : dims.radius! * 2}
                height={table.type === 'top' ? tableHeight : dims.radius! * 2}
                offsetX={table.type === 'top' ? tableWidth / 2 : dims.radius!}
                offsetY={table.type === 'top' ? tableHeight / 2 : dims.radius!}
                x={0}
                y={0}
                fontSize={12}
                fill={textColor}
                align={'center'}
                verticalAlign={'middle'}
            />

            {table.locked && <Text text={'🔒'} y={-50} offsetX={6} fill={textColor} />}

            {Array.from({ length: seatCount }).map((_, index) => {
                const pos = getSeatPosition(index, table);

                if (table.type === 'top') {
                    const brideSeat = isBrideSeat(index, table)
                    const groomSeat = isGroomSeat(index, table)

                    return (
                        <Group key={index}>
                            <Circle
                                x={pos.x}
                                y={pos.y}
                                radius={SEAT_RADIUS}
                                fill={
                                    brideSeat || groomSeat
                                        ? theme.indicators.brideGroom
                                        : theme.seat.special
                                }
                                stroke={theme.seat.stroke}
                            />

                            {(brideSeat || groomSeat) && (
                                <Text
                                    x={pos.x - 4}
                                    y={pos.y - 5}
                                    text={brideSeat ? 'B' : 'G'}
                                    fontSize={12}
                                    fill={theme.textOnSeat}
                                />
                            )}
                        </Group>
                    );

                }
                const required = index < table.seat_minimum;

                return (
                    <Circle
                        key={index}
                        radius={SEAT_RADIUS}
                        x={pos.x}
                        y={pos.y}
                        fill={required ? theme.indicators.conflict : theme.seat.special}
                        stroke={theme.seat.stroke}
                    />
                );
            })}
        </Group>
    );
}
