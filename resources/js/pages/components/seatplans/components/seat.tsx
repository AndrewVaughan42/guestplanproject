import { Circle, Group, Text } from 'react-konva';
import { Guest } from 'resources/js/types';
import { resolveSeatStyle, canvasColours, isDarkMode } from '@/pages/components/seatplans/utils/seatStyle';
import { useAppearance } from '@/hooks/use-appearance';
import { SEAT_RADIUS } from '@/pages/components/seatplans/utils/getSeatPosition';


interface SeatProps {
    guest: Guest | null;
    isSelected: boolean;
    isReserved: boolean;
    onClick: () => void;
    x?: number;
    y?: number;
}

export default function Seat({
    guest,
    isSelected,
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

    const seatFill = resolveSeatStyle({ guest, isSelected, isReserved, appearance})
    const strokeColor = theme.seat.stroke;
    const textColor = theme.textOnSeat;

    return (
        <Group x={x} y={y} onClick={onClick}>
            <Circle
                radius={SEAT_RADIUS}
                fill={seatFill}
                stroke={strokeColor}
                strokeWidth={1}
            />
            {guest && (
                <Text
                    text={guestInitials}
                    fontSize={12}
                    fill={textColor}
                    align={'center'}
                    verticalAlign={'middle'}
                    width={SEAT_RADIUS * 2}
                    height={SEAT_RADIUS * 2}
                    offsetY={SEAT_RADIUS}
                    offsetX={SEAT_RADIUS}
                />
            )}
            {isReserved && (
                <Text
                text={'R'}
                fontSize={12}
                fill={textColor}
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
