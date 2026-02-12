"use client";

import { useRef } from "react";
import "./PartnerCard.css";

interface PartnerCardProps {
    name: string;
    description: string;
    logo: string;
    category: string;
    categoryColor?: string;
    website?: string;
}

function generateMRZ(name: string, category: string): [string, string] {
    const clean = name.toUpperCase().replace(/[^A-Z0-9]/g, "");
    const cat = category.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3);
    const pad = (s: string, len: number) => (s + "<".repeat(len)).slice(0, len);

    const line1 = `IDJNM<<${pad(clean, 20)}<<<${cat}<2026`;
    const line2 = `260526${pad(clean.split("").reverse().join(""), 14)}<<<<<<<<0`;
    return [pad(line1, 36), pad(line2, 36)];
}

export default function PartnerCard({
    name,
    description,
    logo,
    category,
    categoryColor = "bg-(--color-tertiary)",
    website,
}: PartnerCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const glossRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current;
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateY = ((x - centerX) / centerX) * 12;
        const rotateX = ((centerY - y) / centerY) * 12;

        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;

        if (glossRef.current) {
            glossRef.current.style.setProperty("--gloss-x", `${(x / rect.width) * 100}%`);
            glossRef.current.style.setProperty("--gloss-y", `${(y / rect.height) * 100}%`);
        }
    };

    const handleMouseLeave = () => {
        if (cardRef.current) {
            cardRef.current.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
        }
    };

    const [mrzLine1, mrzLine2] = generateMRZ(name, category);

    const CardContent = (
        <>
            {/* Watermark pattern */}
            <div className="partner-card__watermark" />

            {/* Glossy reflection */}
            <div ref={glossRef} className="partner-card__gloss" />

            {/* Tricolore stripe */}
            <div className="partner-card__tricolore">
                <div className="partner-card__tricolore-blue" />
                <div className="partner-card__tricolore-white" />
                <div className="partner-card__tricolore-red" />
            </div>

            {/* Blue header band */}
            <div className="partner-card__blue-header">
                <div className="partner-card__title-area">
                    <span className="partner-card__republic-text">JNM 2026 — Toulouse</span>
                    <span className="partner-card__card-title">Carte de Partenaire</span>
                </div>
                <span className={`partner-card__category-pill ${categoryColor}`}>
                    {category}
                </span>
            </div>

            {/* Body — photo + fields */}
            <div className="partner-card__body">
                {/* Photo / Logo frame */}
                <div className="partner-card__photo-frame">
                    <img src={logo} alt={`Logo ${name}`} />
                </div>

                {/* ID Fields */}
                <div className="partner-card__fields">
                    <div className="partner-card__field">
                        <span className="partner-card__label">Nom</span>
                        <span className="partner-card__value partner-card__value--name">{name}</span>
                    </div>
                    <div className="partner-card__field">
                        <span className="partner-card__label">Secteur</span>
                        <span className="partner-card__value partner-card__value--desc">{description}</span>
                    </div>
                    <div className="partner-card__field">
                        <span className="partner-card__label">Validité</span>
                        <span className="partner-card__value">26 — 29 Mai 2026</span>
                    </div>
                </div>
            </div>

            {/* Signature line */}
            <div className="partner-card__signature">
                <div className="partner-card__signature-line">
                    <span className="partner-card__signature-label">Signature du partenaire</span>
                </div>
            </div>

            {/* MRZ — 2 lines */}
            <div className="partner-card__mrz">
                <div className="partner-card__mrz-line">{mrzLine1}</div>
                <div className="partner-card__mrz-line">{mrzLine2}</div>
            </div>
        </>
    );

    return (
        <div className="partner-card-wrapper flex justify-center">
            <div
                ref={cardRef}
                className="partner-card"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                {website ? (
                    <a
                        href={website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contents"
                    >
                        {CardContent}
                    </a>
                ) : (
                    CardContent
                )}
            </div>
        </div>
    );
}
