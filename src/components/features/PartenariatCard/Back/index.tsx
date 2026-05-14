import { renderToStaticMarkup } from "react-dom/server";
import { Card } from "../Card";
import { SvgSource } from "@/components/ui/branding/logo/SvgSource";
import { LogoSvg } from "@/components/ui/branding/logo/LogoSvg";
import { PartnerData, CardBackData } from "../types";
import { renderCardEnd } from "../helpers";

const top = (type: string) => (
    <div className="pt-1 px-3 flex items-center gap-2">
        <div className="pt-2">
            <h2 className="text-[9px] text-white leading-[4px]">PARTENAIRE</h2>
            <span className="text-[7px]">{type.toUpperCase()}</span>
        </div>
        <LogoSvg fill="#d75d91" className="m-auto w-10 h-8" />
        <LogoSvg fill="#d75d91" className="w-10 h-8" />
    </div>
)


const middle = (back: CardBackData) => (
    <div>
        <h1 className="text-[16px] text-[#ff89b8] text-center [text-shadow:_-2px_0_0_rgb(255_255_255_/_0.8)]">{back.title}</h1>
        <p className={`text-[8px] text-[#d75d91] text-justify mt-1 px-3 whitespace-normal break-words w-full ${back.classNameDescription || ''}`}>
            {back.description}
        </p>
    </div>
)

const getSvgBackground = (color: string): string => {
    // On génère le SVG avec la couleur souhaitée
    const svg = (SvgSource(undefined, color))

    // On convertit le SVG en une chaîne de caractères
    const render = renderToStaticMarkup(svg);

    // On encode la chaîne pour l'utiliser dans une URL
    return `url("data:image/svg+xml;utf8,${encodeURIComponent(render)}")`;
};

export function BackCard(pros: { data: PartnerData }) {
    const { data } = pros;
    return (
        <Card
            top={top(data.partnerType)}
            middle={middle(data.back)}
            middleClassName="flex bg-repeat bg-[length:50px_27px] bg-top-left pb-1"
            middleStyle={{ backgroundImage: getSvgBackground("#fdc9d8") }}
            end={renderCardEnd({ number: data.number, issueDate: data.infos.issueDate, expirationDate: data.infos.expirationDate })}
            endClassName="bg-[#ff89b8]"
        />
    )
}