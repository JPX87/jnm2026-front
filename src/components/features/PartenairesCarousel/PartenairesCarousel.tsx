import Image from "next/image";

const tiers = [
  {
    level: 0,
    label: "en étroite collaboration avec",
    logos: [{ src: "/img/partenaires/soprasteria.png", alt: "Sopra Steria" }],
    imgHeight: 72,
    imgWidth: 300,
    featured: true,
  },
  {
    level: 1,
    label: "en partenariats avec",
    logos: [
      { src: "/img/partenaires/atos.png", alt: "Atos" },
      { src: "/img/partenaires/CGI.png", alt: "CGI" },
      { src: "/img/partenaires/extia.png", alt: "Extia" },
      { src: "/img/partenaires/orange.jpg", alt: "Orange" },
    ],
    imgHeight: 52,
    imgWidth: 180,
    featured: false,
  },
  {
    level: 2,
    label: "avec le soutien de",
    logos: [
      { src: "/img/partenaires/pap.png", alt: "ProApro" },
      { src: "/img/partenaires/pwc.png", alt: "PwC" },
    ],
    imgHeight: 40,
    imgWidth: 150,
    featured: false,
  },
  {
    level: 3,
    label: "sponsorisé par",
    logos: [
      { src: "/img/partenaires/AbsysCyborg.png", alt: "AbsysCyborg" },
      { src: "/img/partenaires/agirc-arrco.png", alt: "Agirc-Arrco" },
    ],
    imgHeight: 32,
    imgWidth: 120,
    featured: false,
  },
];

export default function PartenairesCarousel() {
  return (
    <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-6">
      {tiers.map(({ level, label, logos, imgHeight, imgWidth, featured }) => (
        <div key={level} className="flex flex-col items-center gap-3">
          {/* Label */}
          <div className="flex items-end justify-center h-10 w-full">
            <span
              className={`
                font-['Oswald'] tracking-wider uppercase text-center leading-tight
                ${featured
                  ? "text-xs text-(--color-primary) opacity-80"
                  : "text-[10px] opacity-40"
                }
              `}
            >
              {label}
            </span>
          </div>

          {/* Séparateur */}
          <div
            className="w-full h-px shrink-0"
            style={{ background: "var(--color-primary)", opacity: featured ? 0.5 : 0.15 }}
          />

          {/* Logos */}
          <div className={`flex flex-wrap justify-center items-center gap-4 ${featured ? "" : "opacity-90"}`}>
            {logos.map((p, j) => (
              <Image
                key={j}
                src={p.src}
                alt={p.alt}
                width={imgWidth}
                height={imgHeight}
                style={{ height: imgHeight, width: "auto", maxWidth: "100%" }}
                className="object-contain"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
