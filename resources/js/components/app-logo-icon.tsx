import { SVGAttributes } from 'react';
import logoIcon from '../../../public/images/Oldwalls-Collection-Icon.png';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <img
            src={logoIcon}
            alt="logo icon"
            className={props.className || "size-8"}
        />
    );
}
