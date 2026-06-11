import { KonvaEventObject } from 'konva/lib/Node';
import { useCallback, useState } from 'react';
import { Table } from '@/types';

export function usePanZoom() {
    const [scale, setScale] = useState(1);
    const [pos, setPos] = useState({ x: 0, y: 0 });

    const handleWithScrollWheel = useCallback(
        (e: KonvaEventObject<WheelEvent>) => {
            e.evt.preventDefault();
            const stage = e.target.getStage();
            if (!stage) return;

            const oldScale = scale;
            const pointer = stage.getPointerPosition();
            if (!pointer) return;

            const mousePointTo = {
                x: (pointer.x - pos.x) / oldScale,
                y: (pointer.y - pos.y) / oldScale,
            };
            const scaleBy = 1.05;
            const direction = e.evt.deltaY > 0 ? -1 : 1;
            const newScale =
                direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

            const newPos = {
                x: pointer.x - mousePointTo.x * newScale,
                y: pointer.y - mousePointTo.y * newScale,
            };

            setScale(newScale);
            setPos(newPos);
        },
        [scale, pos],
    );

    const reset = useCallback(() => {
        setScale(1);
        setPos({ x: 0, y: 0 });
    }, []);

    const centreTables = useCallback(
        (tables: Table[], dimensions: { width: number; height: number }) => {
            if (tables.length === 0 || dimensions.width === 0) return;

            let minX = Infinity,
                minY = Infinity,
                maxX = -Infinity,
                maxY = -Infinity;

            tables.forEach((table) => {
                const padding = 100;
                minX = Math.min(minX, table.x - padding);
                maxX = Math.max(maxX, table.x + padding);
                minY = Math.min(minY, table.y - padding);
                maxY = Math.max(maxY, table.y + padding);
            });

            const contentWidth = maxX - minX;
            const contentHeight = maxY - minY;

            const paddingPercentage = 0.8;
            const scaleX = (dimensions.width * paddingPercentage) / contentWidth;
            const scaleY = (dimensions.height * paddingPercentage) / contentHeight;

            const newScale = Math.min(scaleX, scaleY, 1);

            const newPos = {
                x:
                    (dimensions.width - contentWidth * newScale) / 2 -
                    minX * newScale,
                y:
                    (dimensions.height - contentHeight * newScale) / 2 -
                    minY * newScale,
            };
            setScale(newScale);
            setPos(newPos);
        },
        [],
    );

    return {
        scale,
        setScale,
        pos,
        setPos,
        handleWithScrollWheel,
        reset,
        centreTables
    };
}
