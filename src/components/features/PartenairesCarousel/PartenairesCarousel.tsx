import Image from "next/image";

const partenaires = [
  { src: "/img/partenaires/CGI_logo_color_rgb.jpg", alt: "CGI", tier: 1 },
  { src: "/img/partenaires/atos.jpg", alt: "Atos", tier: 1 },
  { src: "/img/partenaires/extia.png", alt: "Extia", tier: 1 },
  { src: "/img/partenaires/orange.jpg", alt: "Orange", tier: 1 },
  { src: "/img/partenaires/pap (1).png", alt: "ProApro", tier: 2 },
  { src: "/img/partenaires/pwc.png", alt: "PwC", tier: 2 },
  { src: "/img/partenaires/AbsysCyborg.png", alt: "AbsysCyborg", tier: 3 },
  { src: "/img/partenaires/agirc-arrco.jpg", alt: "Agirc-Arrco", tier: 3 },
];

export default function PartenairesCarousel() {
  const tier1 = partenaires.filter((p) => p.tier === 1);
  const tier2 = partenaires.filter((p) => p.tier === 2);
  const tier3 = partenaires.filter((p) => p.tier === 3);

  return (
    <div className="relative w-full py-2">
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-center text-xs font-semibold uppercase tracking-widest opacity-40 mb-4">en partenariats avec</p>
          <div className="flex flex-wrap justify-center items-center gap-8 px-4">
            {tier1.map((p, i) => (
              <div key={i} className="flex items-center justify-center h-16">
                <Image src={p.src} alt={p.alt} width={200} height={64} className="h-16 w-auto object-contain" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-center text-xs font-semibold uppercase tracking-widest opacity-40 mb-4">avec le soutien de</p>
          <div className="flex flex-wrap justify-center items-center gap-8 px-4">
            {tier2.map((p, i) => (
              <div key={i} className="flex items-center justify-center h-12">
                <Image src={p.src} alt={p.alt} width={160} height={48} className="h-12 w-auto object-contain" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-center text-xs font-semibold uppercase tracking-widest opacity-40 mb-4">sponsorisé par</p>
          <div className="flex flex-wrap justify-center items-center gap-8 px-4">
            {tier3.map((p, i) => (
              <div key={i} className="flex items-center justify-center h-10">
                <Image src={p.src} alt={p.alt} width={140} height={40} className="h-10 w-auto object-contain" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
