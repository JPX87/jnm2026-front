"use client";

import Image from "next/image";

const partners = [
  { src: "/img/partenaires/soprasteria.png", alt: "Sopra Steria", tier: 0 },
  { src: "/img/partenaires/atos.png", alt: "Atos", tier: 1 },
  { src: "/img/partenaires/CGI.png", alt: "CGI", tier: 1 },
  { src: "/img/partenaires/extia.png", alt: "Extia", tier: 1 },
  { src: "/img/partenaires/orange.jpg", alt: "Orange", tier: 1 },
  { src: "/img/partenaires/pap.png", alt: "ProApro", tier: 2 },
  { src: "/img/partenaires/pwc.png", alt: "PwC", tier: 2 },
  { src: "/img/partenaires/AbsysCyborg.png", alt: "AbsysCyborg", tier: 3 },
  { src: "/img/partenaires/agirc-arrco.png", alt: "Agirc-Arrco", tier: 3 },
];

const tierConfig = [
  { bodyW: 260, bodyH: 200, handleW: 100, handleH: 28, logoW: 170, logoH: 58 },
  { bodyW: 200, bodyH: 155, handleW:  78, handleH: 22, logoW: 130, logoH: 46 },
  { bodyW: 158, bodyH: 124, handleW:  62, handleH: 18, logoW: 100, logoH: 36 },
  { bodyW: 128, bodyH: 100, handleW:  50, handleH: 14, logoW:  80, logoH: 28 },
];

const GAP         = 40;
const BG          = "#0e0e0e";
const ROLLER_R    = 11;
const LATTE_PITCH = 28;
const LATTE_W     = 3;

function Valise({ partner }: { partner: (typeof partners)[number] }) {
  const c = tierConfig[partner.tier];
  const W = c.bodyW;
  const BH = c.bodyH;
  const HW = c.handleW;
  const HH = c.handleH;
  const SW = Math.max(4, Math.round(HH * 0.34));
  const PW = Math.round(SW * 3);
  const PH = Math.round(SW * 1.8);
  const bodyY = HH + 6;
  const totalH = bodyY + BH;
  const rx = 14;
  const legL = W / 2 - HW / 2 + SW / 2;
  const legR = W / 2 + HW / 2 - SW / 2;

  return (
    <div style={{ width: W, height: totalH, flexShrink: 0, position: "relative" }}>
      <svg
        width={W}
        height={totalH}
        viewBox={`0 0 ${W} ${totalH}`}
        style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 6px 16px rgba(0,0,0,0.6))" }}
      >
        {/* Ombre portée */}
        <ellipse cx={W / 2} cy={totalH - 1} rx={W * 0.42} ry={5} fill="rgba(0,0,0,0.4)" />

        {/* Poignée */}
        <path
          d={`M ${legL} ${bodyY} A ${(HW - SW) / 2} ${HH * 0.9} 0 0 1 ${legR} ${bodyY}`}
          stroke="white" strokeWidth={SW} fill="none" strokeLinecap="round"
        />
        <rect x={legL - PW / 2} y={bodyY - PH / 2} width={PW} height={PH} rx={3} fill="#ddd" />
        <rect x={legR - PW / 2} y={bodyY - PH / 2} width={PW} height={PH} rx={3} fill="#ddd" />

        {/* Corps */}
        <rect x={2} y={bodyY} width={W - 4} height={BH - 3} rx={rx} fill="#f6f6f6" stroke="#d8d8d8" strokeWidth={1.5} />

        {/* Cadre intérieur */}
        <rect x={10} y={bodyY + 9} width={W - 20} height={BH - 21} rx={rx - 5} fill="none" stroke="#e4e4e4" strokeWidth={1} />

        {/* Rivets */}
        {([
          [16, bodyY + 16], [W - 16, bodyY + 16],
          [16, bodyY + BH - 17], [W - 16, bodyY + BH - 17],
        ] as [number, number][]).map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={3.5} fill="#d0d0d0" stroke="#bbb" strokeWidth={0.8} />
        ))}
      </svg>

      {/* Logo */}
      <div
        style={{
          position: "absolute",
          left: 0, right: 0,
          top: HH + 6,
          height: BH - 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          src={partner.src}
          alt={partner.alt}
          width={c.logoW}
          height={c.logoH}
          style={{ objectFit: "contain", maxWidth: "65%", maxHeight: "46%" }}
        />
      </div>
    </div>
  );
}

const totalTrackWidth =
  partners.reduce((acc, p) => acc + tierConfig[p.tier].bodyW, 0) +
  GAP * (partners.length - 1);

/* ── Bande tapis + rouleaux en un seul SVG ─────────────────────────────── */
function BeltStrip() {
  const BELT_H    = 18;
  const TOTAL_H   = BELT_H + ROLLER_R * 2 + 6;
  const rollerY   = BELT_H + ROLLER_R + 3;
  const rollerCount = 32;
  const spacing   = 52;
  const totalW    = rollerCount * spacing;

  return (
    <div style={{ position: "relative", height: TOTAL_H, overflow: "hidden" }}>
      {/* Lattes animées */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: BELT_H,
          background: `linear-gradient(180deg, #252525 0%, #1a1a1a 100%)`,
          borderTop: "1.5px solid #333",
          borderBottom: "1.5px solid #111",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent 0px,
              transparent ${LATTE_PITCH - LATTE_W}px,
              rgba(255,255,255,0.04) ${LATTE_PITCH - LATTE_W}px,
              rgba(255,255,255,0.04) ${LATTE_PITCH}px
            )`,
            backgroundSize: `${LATTE_PITCH}px 100%`,
            animation: `lattes ${(LATTE_PITCH / totalTrackWidth) * partners.length * 4}s linear infinite`,
          }}
        />
      </div>

      {/* Rouleaux SVG */}
      <svg
        width="100%"
        height={TOTAL_H}
        viewBox={`0 0 ${totalW} ${TOTAL_H}`}
        preserveAspectRatio="xMinYMid slice"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {Array.from({ length: rollerCount }).map((_, i) => {
          const cx = i * spacing + ROLLER_R + 10;
          return (
            <g key={i} style={{ animation: `rouleau-spin 1.6s linear infinite`, transformOrigin: `${cx}px ${rollerY}px` }}>
              <circle cx={cx} cy={rollerY} r={ROLLER_R} fill="#1c1c1c" stroke="#333" strokeWidth={1} />
              <line x1={cx} y1={rollerY - ROLLER_R + 2} x2={cx} y2={rollerY + ROLLER_R - 2} stroke="#333" strokeWidth={1.5} />
              <line x1={cx - ROLLER_R + 2} y1={rollerY} x2={cx + ROLLER_R - 2} y2={rollerY} stroke="#333" strokeWidth={1.5} />
              <circle cx={cx} cy={rollerY} r={2.5} fill="#3a3a3a" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function PartenairesCarousel() {
  const doubled = [...partners, ...partners];

  return (
    <div style={{ width: "100%", backgroundColor: BG, overflow: "hidden", paddingTop: 20, position: "relative" }}>

      {/* Label */}
      <p
        style={{
          fontFamily: "Oswald, sans-serif",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          fontSize: 11,
          color: "var(--color-primary)",
          textAlign: "center",
          marginBottom: 18,
          opacity: 0.85,
        }}
      >
        Avec les participations de tous nos partenaires
      </p>

      {/* Valises */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: GAP,
          width: totalTrackWidth * 2 + GAP * 2,
          animation: `tapie-roulant ${partners.length * 4}s linear infinite`,
        }}
      >
        {doubled.map((p, i) => (
          <Valise key={i} partner={p} />
        ))}
      </div>

      {/* Tapis + rouleaux */}
      <BeltStrip />

      {/* Dégradés latéraux */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `linear-gradient(90deg, ${BG} 0%, transparent 10%, transparent 90%, ${BG} 100%)`,
        }}
      />

      <style>{`
        @keyframes tapie-roulant {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-${totalTrackWidth + GAP}px); }
        }
        @keyframes lattes {
          0%   { background-position: 0 0; }
          100% { background-position: -${LATTE_PITCH}px 0; }
        }
        @keyframes rouleau-spin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
