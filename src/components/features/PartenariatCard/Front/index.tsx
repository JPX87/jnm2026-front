import { renderToStaticMarkup } from "react-dom/server";
import { Card } from "../Card";
import { CardLogo } from "./CardLogo";
import { ToulouseLogo } from "./ToulouseLogo";
import { SvgSource } from "@/components/ui/branding/logo/SvgSource";
import { PartnerData, PartnerInfo } from "../types";
import { formatDateToFrench, renderCardEnd } from "../helpers";

const top = (
    <div className="pt-1 px-3 flex items-center gap-2">
        <div className="pt-2">
            <h2 className="text-[9px] text-white dark:text-(--color-seconde-black) leading-[4px]">PARTENAIRE</h2>
            <span className="text-[7px]">PARTENAIRE</span>
        </div>
        <ToulouseLogo fill="#ef6a9f" className="m-auto w-16 h-8" />
        <CardLogo fill="#ef6a9f" className="w-10 h-8" />
    </div>
)

const info = (title: string, data: string) => (
    <div className="text-[9px] text-[#ef6a9f] mb-1">
        <h2 className="font-bold -mb-0.5">{title}</h2>
        <p>{data.toUpperCase()}</p>
    </div>
)

const middle = (logo: React.ReactNode, infos: PartnerInfo) => (
    <>
        <div className="w-9/20 h-full relative">
            {logo}
        </div>
        <div className="w-11/20 h-full relative">
            <div className="flex flex-end">
                <div className="w-2/5">
                    {info("Type", infos.type)}
                    {info("Nom", infos.name)}
                    {info("Nationalité", infos.nationality)}
                    {info("Date de délivrance", formatDateToFrench(infos.issueDate))}
                </div>
                <div className="w-3/5">
                    {info("Domicile", infos.address)}
                    {info("Date de naissance", formatDateToFrench(infos.birthDate))}
                    {info("Date d'expiration", formatDateToFrench(infos.expirationDate))}
                </div>
            </div>
            <span className="absolute top-1/2 right-3 -rotate-90 translate-x-[50%] -translate-y-1/2 text-[#ff89b8]"
            >
                JOURNÉES NATIONALES MIAGE
            </span>
        </div>
    </>
)

const getSvgBackground = (color: string): string => {
    // On génère le SVG avec la couleur souhaitée
    const svg = (SvgSource(undefined, color))

    // On convertit le SVG en une chaîne de caractères
    const render = renderToStaticMarkup(svg);

    // On encode la chaîne pour l'utiliser dans une URL
    return `url("data:image/svg+xml;utf8,${encodeURIComponent(render)}")`;
};

export function FrontCard(pros: { data: PartnerData }) {
    const { data } = pros;
    return (
        <Card
            top={top}
            middle={middle(data.mainLogo, data.infos)}
            middleClassName="flex bg-repeat bg-[length:50px_27px] bg-top-left pb-1"
            middleStyle={{ backgroundImage: getSvgBackground("#fdc9d8") }}
            end={renderCardEnd({ number: data.number, issueDate: data.infos.issueDate, expirationDate: data.infos.expirationDate })}
            endClassName="bg-[#ef6a9f]"
        />
    )
}