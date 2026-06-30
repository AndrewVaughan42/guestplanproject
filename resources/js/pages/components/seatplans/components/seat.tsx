import { Arc, Circle, Group, Text } from 'react-konva';
import { Guest } from 'resources/js/types';
import { resolveSeatStyle, canvasColours, isDarkMode } from '@/pages/shared/hooks/seatStyle';
import { useAppearance } from '@/hooks/use-appearance';
import { SEAT_RADIUS } from '@/pages/shared/hooks/getSeatPosition';
import { KonvaEventObject } from 'konva/lib/Node';


interface SeatProps {
    seatId: string;
    guest: Guest | null;
    isSelected: boolean;
    isActiveGuestAssignment?: boolean;
    isSelectedAllocatedSeat?: boolean;
    hasConflictWithActive?: boolean;
    isReserved: boolean;
    onClick: (e: KonvaEventObject<MouseEvent>) => void;
    x?: number;
    y?: number;
}
export default function Seat({
    seatId,
    guest,
    isSelected,
    isActiveGuestAssignment = false,
    isSelectedAllocatedSeat = false,
    hasConflictWithActive = false,
    isReserved,
    onClick,
    x,
    y,
}: SeatProps) {
    const { appearance } = useAppearance();
    const dark = isDarkMode(appearance);
    const theme = dark ? canvasColours.dark : canvasColours.light;

    const guestInitials = guest
        ? (guest.name.split(' ')[0]?.[0] ?? '') +
          (guest.name.split(' ')[1]?.[0] ?? '')
        : '';

    const seatFill = resolveSeatStyle({
        guest,
        isSelected : isReserved ? false : isSelected,
        isActiveGuestAssignment: isReserved ? false : isActiveGuestAssignment,
        hasConflictWithActive,
        isReserved,
        appearance,
    });
    const groupColours = guest?.groups?.map((group) => group.colour) ?? [];


    const strokeColor = theme.seat.stroke;
    const textColor = theme.textOnSeat;

    const isCoupleLocked = guest?.role === 'partner_a' || guest?.role === 'partner_b';


    return (
        <Group x={x} y={y} onClick={(e) => {
            if (isCoupleLocked) return;
            e.cancelBubble = true;
            onClick(e);
        }} name={seatId}>
            <Circle
                name={seatId}
                radius={SEAT_RADIUS}
                fill={seatFill}
                stroke={
                isSelectedAllocatedSeat ? theme.seat.selected :
                    groupColours.length === 1 ? groupColours[0] : strokeColor
                }
                strokeWidth={isSelectedAllocatedSeat ? 5 : groupColours.length <= 1 ? 3 : 1}

            />
            {/* Adds Group Colour Arcs */}
            {groupColours.length > 1 &&
                groupColours.map((colour, index) => {
                    const angle = 360 / groupColours.length;

                    return (
                        <Arc
                            key={`${seatId}-${index}`}
                            innerRadius={SEAT_RADIUS - 3}
                            outerRadius={SEAT_RADIUS}
                            angle={angle}
                            rotation={angle * index}
                            fill={colour}
                        />
                    );
                })}
            {/* Guest Initials */}
            {(guest || isReserved) && (
                <Text
                    text={guestInitials}
                    fontSize={12}
                    fill={isCoupleLocked ? theme.indicators.brideGroom : textColor}
                    align={'center'}
                    verticalAlign={'middle'}
                    width={SEAT_RADIUS * 2}
                    height={SEAT_RADIUS * 2}
                    offsetY={SEAT_RADIUS}
                    offsetX={SEAT_RADIUS}
                />
            )}
        </Group>
    );
}
