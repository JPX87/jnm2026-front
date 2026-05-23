import { SvgSource } from './SvgSource';

export function LogoSvg({ className, fill = "currentColor" }: { className?: string, fill?: string }) {
    return ( SvgSource(className, fill) );
}