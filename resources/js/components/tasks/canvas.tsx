import { useEffect, useRef } from 'react';

export function Canvas(props: {
    width: string | number | undefined;
    height: string | number | undefined;
}) {
    const canvasRef = useRef(null);

    useEffect(() => {
        // Draw canvas here...
    }, []);

    return <canvas ref={canvasRef} width={props.width} height={props.height} />;
}
