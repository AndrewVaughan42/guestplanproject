import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <img
            src="public/images/Oldwalls-Collection-Icon.png"
            alt="logo icon"
            className={props.className || "size-8"}
        />
    );
}
