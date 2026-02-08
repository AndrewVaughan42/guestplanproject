import { Head } from '@inertiajs/react'
import { seatplan} from '@/routes';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Layer, Rect, Stage } from 'react-konva';

export default function Seatplan() {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'My Seatplan',
            href: seatplan.url(),
        },
    ];
    //const canvasRef = useRef<HTMLCanvasElement>(null);
    //const canvas = document.getElementById('seatplan');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Seatplan"/>
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex-1 rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                    <Stage width={window.innerWidth} height={window.innerHeight}>
                        <Layer>
                            <Rect
                                x={20}
                                y={50}
                                width={100}
                                height={100}
                                fill="red"
                                shadowBlur={5}
                                />
                        </Layer>
                    </Stage>
                </div>
            </div>
        </AppLayout>
    )
}
