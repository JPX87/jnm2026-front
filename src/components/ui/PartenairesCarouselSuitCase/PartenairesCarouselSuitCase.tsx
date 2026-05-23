"use client";

import Image from "next/image";
//import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const partners = [
  { src: "/img/partenaires/soprasteria.png", alt: "Sopra Steria", tier: 0, maxW: "92%", maxH: "90%" },
  { src: "/img/partenaires/atos.jpg", alt: "Atos", tier: 1, maxW: "48%", maxH: "36%", backColor: "#fff" },
  { src: "/img/partenaires/capgemini.png", alt: "Capgemini", tier: 1, maxW: "68%", maxH: "76%" },
  { src: "/img/partenaires/cgi.jpg", alt: "CGI", tier: 1, maxW: "48%", maxH: "36%", backColor: "#fff" },
  { src: "/img/partenaires/extia.png", alt: "Extia", tier: 1, maxW: "48%", maxH: "36%" },
  { src: "/img/partenaires/orange.jpg", alt: "Orange", tier: 1 },
  { src: "/img/partenaires/pap.png", alt: "ProApro", tier: 2, maxW: "48%", maxH: "36%" },
  { src: "/img/partenaires/pwc.png", alt: "PwC", tier: 2, maxW: "48%", maxH: "36%" },
  { src: "/img/partenaires/AbsysCyborg.png", alt: "AbsysCyborg", tier: 3 },
  { src: "/img/partenaires/agirc-arrco.jpg", alt: "Agirc-Arrco", tier: 3, backColor: "#fff" },
  { src: "/img/partenaires/UT.png", alt: "Université de Toulouse", tier: 4, backColor: "#fff" },
  { src: "/img/partenaires/FSI.jpg", alt: "FSI", tier: 4, backColor: "#fff" },
  { src: "/img/partenaires/miage_tls.jpg", alt: "MIAGE Toulouse", tier: 4, backColor: "#fff" },
];

const tierConfig = [
  { bodyW: 200, bodyH: 155, handleW: 78, handleH: 22, logoW: 160, logoH: 62, maxW: "74%", maxH: "54%", label: "MAJEUR", labelSize: 13 },
  { bodyW: 200, bodyH: 155, handleW: 78, handleH: 22, logoW: 160, logoH: 62, maxW: "74%", maxH: "54%", label: "LEADER", labelSize: 13 },
  { bodyW: 200, bodyH: 155, handleW: 78, handleH: 22, logoW: 160, logoH: 62, maxW: "74%", maxH: "54%", label: "ACTEUR", labelSize: 13 },
  { bodyW: 200, bodyH: 155, handleW: 78, handleH: 22, logoW: 160, logoH: 62, maxW: "74%", maxH: "54%", label: "ASSOCIÉ", labelSize: 13 },
  { bodyW: 200, bodyH: 155, handleW: 78, handleH: 22, logoW: 160, logoH: 62, maxW: "74%", maxH: "54%", label: "", labelSize: 13 },
];

const GAP = 40;
const BG_DARK = "#111111";
const BG_WHITE = "#fff8f3";

const ROLLER_R = 11;
const LATTE_PITCH = 28;
const LATTE_W = 3;
const AUTO_SPEED = 0.5; // px par frame à 60fps

const totalTrackWidth =
  partners.reduce((acc, p) => acc + tierConfig[p.tier].bodyW, 0) +
  GAP * (partners.length - 1);

const LOOP_WIDTH = totalTrackWidth + GAP;

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
        style={{ position: "absolute", inset: 0, filter: `drop-shadow(0 6px 16px rgba(0,0,0,0.4))` }}
      >
        <ellipse cx={W / 2} cy={totalH - 1} rx={W * 0.42} ry={5} fill="rgba(0,0,0,0.4)" />
        <path
          d={`M ${legL} ${bodyY} A ${(HW - SW) / 2} ${HH * 0.9} 0 0 1 ${legR} ${bodyY}`}
          stroke="white" strokeWidth={SW} fill="none" strokeLinecap="round"
        />
        <rect x={legL - PW / 2} y={bodyY - PH / 2} width={PW} height={PH} rx={3} fill="#ddd" />
        <rect x={legR - PW / 2} y={bodyY - PH / 2} width={PW} height={PH} rx={3} fill="#ddd" />
        <rect x={2} y={bodyY} width={W - 4} height={BH - 3} rx={rx} fill="#ff89b8" stroke="#e0609a" strokeWidth={1.5} />
        <rect x={10} y={bodyY + 9} width={W - 20} height={BH - 21} rx={rx - 5} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
        {([
          [16, bodyY + 16], [W - 16, bodyY + 16],
          [16, bodyY + BH - 17], [W - 16, bodyY + BH - 17],
        ] as [number, number][]).map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={3.5} fill="rgba(255,255,255,0.5)" stroke="rgba(255,255,255,0.3)" strokeWidth={0.8} />
        ))}

        {/* Label de tier */}
        <text
          x={W / 2}
          y={bodyY + 22}
          textAnchor="middle"
          fontFamily="Oswald, sans-serif"
          fontSize={c.labelSize}
          fontWeight="700"
          letterSpacing="2"
          fill="rgba(255,255,255,0.85)"
        >
          {c.label}
        </text>
      </svg>
      <div
        style={{
          position: "absolute",
          left: 0, right: 0,
          top: bodyY,
          height: BH - 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Image
          src={partner.src}
          alt={partner.alt}
          width={c.logoW}
          height={c.logoH}
          draggable={false}
          style={{
            objectFit: "contain", maxWidth: partner.maxW ?? c.maxW, maxHeight: partner.maxH ?? c.maxH, pointerEvents: "none",
            // background
            padding: partner.backColor ? 6 : 0,
            borderRadius: partner.backColor ? 6 : 0,
            backgroundColor: partner.backColor ?? "transparent",
          }}
        />
      </div>
    </div>
  );
}

function BeltStrip({ offsetRef }: { offsetRef: React.RefObject<number> }) {
  const latteRef = useRef<HTMLDivElement>(null);
  const BELT_H = 18;
  const TOTAL_H = BELT_H + ROLLER_R * 2 + 6;
  const rollerY = BELT_H + ROLLER_R + 3;
  const count = 32;
  const spacing = 52;
  const totalW = count * spacing;

  // sync latte position with main offset
  useEffect(() => {
    let raf: number;
    const tick = () => {
      if (latteRef.current) {
        const pos = (offsetRef.current % LATTE_PITCH + LATTE_PITCH) % LATTE_PITCH;
        latteRef.current.style.backgroundPosition = `${pos}px 0`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [offsetRef]);

  return (
    <div style={{ position: "relative", height: TOTAL_H, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: BELT_H,
          background: "linear-gradient(180deg, #252525 0%, #1a1a1a 100%)",
          borderTop: "1.5px solid #333",
          borderBottom: "1.5px solid #111",
          overflow: "hidden",
        }}
      >
        <div
          ref={latteRef}
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
          }}
        />
      </div>
      <svg
        width="100%"
        height={TOTAL_H}
        viewBox={`0 0 ${totalW} ${TOTAL_H}`}
        preserveAspectRatio="xMinYMid slice"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {Array.from({ length: count }).map((_, i) => {
          const cx = i * spacing + ROLLER_R + 10;
          return (
            <g key={i} style={{ animation: `rouleau-spin 2.5s linear infinite`, transformOrigin: `${cx}px ${rollerY}px` }}>
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

export default function PartenairesCarouselSuitCase() {
  const doubled = [...partners, ...partners];

  //const router = useRouter();
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const isDragging = useRef(false);
  const lastX = useRef(0);
  const startX = useRef(0);
  const dragVel = useRef(0);
  const coastVel = useRef(0);

  useEffect(() => {
    let raf: number;

    const tick = () => {
      if (isDragging.current) {
        // pendant le drag : juste appliquer le mouvement (géré dans les handlers)
      } else {
        // inertie : on ralentit progressivement vers AUTO_SPEED
        coastVel.current += (AUTO_SPEED - coastVel.current) * 0.06;
        offsetRef.current -= coastVel.current;
      }

      // boucle infinie
      if (offsetRef.current <= -LOOP_WIDTH) offsetRef.current += LOOP_WIDTH;
      if (offsetRef.current > 0) offsetRef.current -= LOOP_WIDTH;

      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${offsetRef.current}px)`;
      }

      raf = requestAnimationFrame(tick);
    };

    coastVel.current = AUTO_SPEED;
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    lastX.current = e.clientX;
    startX.current = e.clientX;
    dragVel.current = 0;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;
    dragVel.current = dx;
    offsetRef.current += dx;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    //const moved = Math.abs(e.clientX - startX.current);
    isDragging.current = false;
    coastVel.current = -dragVel.current;
    // clic simple (pas un drag) → redirection
    // if (moved < 6) router.push("/partenaires"); --> Désactiver le temps de mettre la page online ^^
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Label */}
      <p
        style={{
          fontFamily: "Oswald, sans-serif",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          fontSize: 28,
          fontWeight: 700,
          color: "var(--color-primary)",
          textAlign: "left",
          paddingLeft: 24,
          marginBottom: 10,
          opacity: 0.9,
        }}
      >
        Avec la participation de tous nos partenaires
      </p>

      {/* Bandeau sombre */}
      <div
        style={{
          width: "100%",
          overflow: "hidden",
          position: "relative",
          cursor: "grab",
          userSelect: "none",
          transition: "all 0.3s ease",
        }}
        className="pt-3 md:pt-5 carousel-belt bg-[#fff8f3] dark:bg-[#111111]"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        suppressHydrationWarning
      >
        {/* Valises */}
        <div
          ref={trackRef}
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: GAP,
            width: totalTrackWidth * 2 + GAP * 2,
            willChange: "transform",
          }}
        >
          {doubled.map((p, i) => (
            <Valise key={i} partner={p} />
          ))}
        </div>

        {/* Tapis + rouleaux */}
        <BeltStrip offsetRef={offsetRef} />

        {/* Dégradés latéraux */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            transition: "all 0.3s ease",
          }}
          className="carousel-gradient"
          suppressHydrationWarning
        />
      </div>

      <style>{`
        .carousel-belt:active { cursor: grabbing; }
        @keyframes rouleau-spin {
          0% { transform: rotate(360deg); }
          100%   { transform: rotate(0deg); }
        }
        .carousel-gradient {
          background: linear-gradient(90deg, #fff8f3 0%, transparent 10%, transparent 90%, #fff8f3 100%);
        }
        [data-theme='dark'] .carousel-gradient {
          background: linear-gradient(90deg, #111111 0%, transparent 10%, transparent 90%, #111111 100%);
        }
      `}</style>
    </div>
  );
}
