import { renderToStaticMarkup } from "react-dom/server";
import { Card } from "../Card";
import { SvgSource } from "@/components/ui/branding/logo/SvgSource";
import { LogoSvg } from "@/components/ui/branding/logo/LogoSvg";
import { title } from "process";

const top = (
    <div className="pt-1 px-3 flex items-center gap-2">
        <div className="pt-2">
            <h2 className="text-[9px] text-white dark:text-(--color-seconde-black) leading-[4px]">PARTENAIRE</h2>
            <span className="text-[7px]">PARTENAIRE</span>
        </div>
        <LogoSvg fill="#d75d91" className="m-auto w-10 h-8" />
        <LogoSvg fill="#d75d91" className="w-10 h-8" />
    </div>
)


const middle = (
    <div>
        <h1 className="text-[16px] text-[#ff89b8] text-center [text-shadow:_-2px_0_0_rgb(255_255_255_/_0.8)]">Plus qu’un emploi, choisissez une carrière. </h1>
        <p className="text-[8px] text-[#d75d91] text-justify tracking-[0.08em] mt-1 px-3 whitespace-normal break-words w-full">
            Aujourd'hui, nous sommes une équipe mondiale, leader du conseil et des services numériques, qui possèdent une connaissance fine des différents secteurs d’activité et une expertise technologique qui nous permettent d'anticiper les changements du marché, de fournir des conseils pertinents et des services complets, pour accompagner nos clients dans leur transformation à travers quatre métiers : le conseil, l’intégration de systèmes, les business solutions et les services managés. Perfectionnez vos compétences. Partagez vos perspectives. Libérez votre potentiel.
        </p>
    </div>
)

const end = (
    <h1 className="text-[9px] tracking-[0.15em] p-1 text-white dark:text-(--color-seconde-black)">{`
        PARTENAIRE<<JNM<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< `}< br />{`
        2605202629052026JNM2026TOULOUSE<<<<<<<<<<<<<<<<<<<<<<<<<01
    `}</h1>
)

const getSvgBackground = (color: string): string => {
    // On génère le SVG avec la couleur souhaitée
    const svg = (SvgSource(undefined, color))

    // On convertit le SVG en une chaîne de caractères
    const render = renderToStaticMarkup(svg);

    // On encode la chaîne pour l'utiliser dans une URL
    return `url("data:image/svg+xml;utf8,${encodeURIComponent(render)}")`;
};

export function BackCard() {
    return (
        <Card
            top={top}
            middle={middle}
            middleClassName="flex bg-repeat bg-[length:50px_27px] bg-top-left pb-1"
            middleStyle={{ backgroundImage: getSvgBackground("#fdc9d8") }}
            end={end}
            endClassName="bg-[#ff89b8]"
        />
    )
}