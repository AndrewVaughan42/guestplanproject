import { Table } from '@/types';
import { KonvaEventObject } from 'konva/lib/Node';
import React, {
    useEffect,
    useRef,
    useState,
} from 'react';
import { Layer, Stage } from 'react-konva';

interface LayoutCanvasProps {
    scale: number;
    pos: { x: number; y: number };
    setScale: (scale: number) => void;
    setPos: (pos: { x: number; y: number }) => void;
    handleWithScrollWheel: (e: KonvaEventObject<WheelEvent>) => void;
    centreTables: (
        tables: Table[],
        dimensions: { width: number; height: number },
    ) => void;
    tables: Table[];
    selectedId: string | null;
    onSelect: (id: string | null) => void;
    onMove: (id: string, x: number, y: number) => void;
    setPosition: (pos: { x: number; y: number }) => void;
    children?: React.ReactNode;
    onContextMenu?: (e: KonvaEventObject<PointerEvent>) => void;
    onSelectTable?: (
        value: ((prevState: string | null) => string | null) | string | null,
    ) => void;
}
export function LayoutCanvas({
    tables,
    onSelect,
    setPosition,
    scale,
    pos,
    handleWithScrollWheel,
    centreTables,
    children,
    onContextMenu,
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

    useEffect(() => {
        if (tables.length > 0 && dimensions.width > 0 && !hasCentered.current) {
            centreTables(tables, dimensions);
            hasCentered.current = true;
        }
    }, [centreTables, tables, dimensions]);

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
                x={pos.x}
                y={pos.y}
                draggable={isPanning}
                onMouseDown={(e) => {
                    const onStage = e.target === e.target.getStage();
                    if (e.evt.button === 0 && onStage) {
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
                onWheel={handleWithScrollWheel}
                onClick={(e) => {
                    if (e.target === e.target.getStage()) onSelect(null);
                }}
                onContextMenu={onContextMenu}
            >
                <Layer>{children}</Layer>
            </Stage>
        </div>
    );
}
