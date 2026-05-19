import { PartnerLogo } from "@/data/partenaires";
import Image from "next/image";


export const PartnerCarouselLogo = ({ partnersList }: { partnersList: PartnerLogo[] }) => {
    // Tri des partenaires de A à Z
    const sortedPartners = [...partnersList].sort((a, b) => a.name.localeCompare(b.name));

    // Duplication pour l'effet de boucle infinie (marquee)
    const carouselItems = [...sortedPartners, ...sortedPartners];

    return (
        <div className="w-full overflow-hidden flex -my-4 p-2 md:p-8 md:-my-12 rounded-xl">
            <style>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-scroll {
                    animation: scroll 35s linear infinite;
                }
                .animate-scroll:hover {
                    animation-play-state: paused;
                }
            `}</style>

            <div className="flex w-max animate-scroll items-center">
                {carouselItems.map((partner, index) => (
                    <div key={index} className="flex-none bg-[#ffd5df] px-2 py-4 mx-2 md:mx-6 w-32 md:w-64 h-20 md:h-32 rounded-xl md:rounded-2xl relative flex items-center justify-center transition-all duration-300 hover:scale-110" title={partner.name}>
                        <Image src={partner.url} alt={`Logo ${partner.name}`} width={200} height={120} className="object-contain max-h-full max-w-full rounded drop-shadow-md" />
                    </div>
                ))}
            </div>
        </div>
    );
};