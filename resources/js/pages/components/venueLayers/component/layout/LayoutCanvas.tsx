import { EditorTableGroup } from '@/pages/components/venueLayers/component/layout/EditorTableGroup';
import { Table } from '@/types';
import { KonvaEventObject } from 'konva/lib/Node';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Layer, Stage } from 'react-konva';

interface LayoutCanvasProps {
    tables: Table[];
    selectedId: string | null;
    onSelect: (id: string | null) => void;
    onMove: (id: string, x: number, y: number) => void;
    scale: number;
    position: { x: number; y: number };
    setScale: (scale: number) => void;
    setPosition: (pos: { x: number; y: number }) => void;
}
export function LayoutCanvas({
    tables,
    selectedId,
    onSelect,
    onMove,
    scale,
    position,
    setScale,
    setPosition,
}: LayoutCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const hasCentered = useRef(false);

    useEffect(() => {
        const updateSize = () => {
            setDimensions({
                width: containerRef.current?.clientWidth ?? 0,
                height: containerRef.current?.clientHeight ?? 0,
            });
        };
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    const centreTables = useCallback(() => {
        if (tables.length === 0) return;

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

        tables.forEach(table => {
            const padding = 100;
            minX = Math.min(minX, table.x - padding)
            maxX = Math.max(maxX, table.x + padding)
            minY = Math.min(minY, table.y - padding)
            maxY = Math.max(maxY, table.y + padding)
        })

        const contentWidth = maxX - minX;
        const contentHeight = maxY - minY;

        const paddingPercentage = 0.8;
        const scaleX = (dimensions.width * paddingPercentage) / contentWidth;
        const scaleY = (dimensions.height * paddingPercentage) / contentHeight;

        const newScale = Math.min(scaleX, scaleY, 1);

        const newPos = {
            x: (dimensions.width - contentWidth * newScale) / 2 - minX * newScale,
            y: (dimensions.height - contentHeight * newScale) / 2 - minY * newScale,
        }
        setScale(newScale);
        setPosition(newPos);
    }, [tables, dimensions, setScale, setPosition]);

    useEffect(() => {
        if (tables.length > 0 && dimensions.width > 0 && !hasCentered.current) {
            centreTables()
            hasCentered.current = true;
        }
    }, [centreTables, dimensions.width, tables.length]);

    const handleWheel = useCallback(
        (e: KonvaEventObject<WheelEvent>) => {
            e.evt.preventDefault();

            const stage = e.target.getStage();
            if (!stage) return;

            const oldScale = scale;
            const pointer = stage.getPointerPosition();
            if (!pointer) return;

            const mousePointTo = {
                x: (pointer.x - position.x) / oldScale,
                y: (pointer.y - position.y) / oldScale,
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
            setPosition(newPos);
        },
        [scale, position, setScale, setPosition],
    );

    const { width, height } = dimensions;
    const [isPanning, setIsPanning] = useState(false);

    return (
        <div
            ref={containerRef}
            className={'h-full w-full border border-border'}
            style={{ cursor: isPanning ? 'grabbing' : 'default' }}
        >
            <Stage
                width={width}
                height={height}
                scaleX={scale}
                scaleY={scale}
                x={position.x}
                y={position.y}
                draggable={isPanning}
                onMouseDown={(e) => {
                    if (e.evt.button === 1) {
                        e.evt.preventDefault();
                        setIsPanning(true);

                        const stage = e.target.getStage();
                        if (stage) {
                            stage.startDrag();
                        }
                    }
                }}
                onMouseUp={() => setIsPanning(false)}
                onMouseLeave={() => setIsPanning(false)}
                onDragMove={(e) => {
                    if (e.target === e.target.getStage()) {
                        setPosition({ x: e.target.x(), y: e.target.y() });
                    }
                }}
                onDragEnd={(e) => {
                    if (e.target === e.target.getStage()) {
                        setPosition({ x: e.target.x(), y: e.target.y() });
                    }
                }}
                onWheel={handleWheel}
                onClick={(e) => {
                    if (e.target === e.target.getStage()) onSelect(null);
                }}
            >
                <Layer>
                    {tables.map((table) => (
                        <EditorTableGroup
                            key={table.id}
                            table={table}
                            selected={table.id === selectedId}
                            onSelect={() => onSelect(table.id)}
                            onMove={onMove}
                        />
                    ))}
                </Layer>
            </Stage>
        </div>
    );
}
