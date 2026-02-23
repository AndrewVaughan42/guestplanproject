import AppLayout from '@/layouts/app-layout';

import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { Circle, Layer, Stage } from 'react-konva';
import seatPlans from '@/routes/seat-plans';

export default function SeatPlan() {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'My SeatPlan',
            href: seatPlans.index.url(),
        },
    ];
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [size, setSize] = useState({ width: 0, height: 0 });

    const shapeSize = 100;
    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;
            setSize({ width, height });
        });

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="SeatPlan" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div
                    className="flex-1 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border"
                    style={{ overflow: 'hidden' }}
                >
                    <div className="h-full w-full p-4" ref={containerRef}>
                        <Stage width={size.width} height={size.height}>
                            <Layer>
                                <Circle //Test Circle
                                    x={20}
                                    y={50}
                                    radius={shapeSize / 2}
                                    stroke={'white'}
                                    draggable={true}
                                    dragBoundFunc={(pos) => {
                                        return {
                                            x: Math.max(
                                                0,
                                                Math.min(
                                                    pos.x,
                                                    size.width - shapeSize,
                                                ),
                                            ),
                                            y: Math.max(
                                                0,
                                                Math.min(
                                                    pos.y,
                                                    size.height - shapeSize,
                                                ),
                                            ),
                                        };
                                    }}
                                />
                            </Layer>
                        </Stage>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
