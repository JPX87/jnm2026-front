"use client";

import { useState, useEffect } from "react";
import { LINES, NODES } from "./data";
import { LineId, NodeId } from "./types";
import { MetroInfoPanel } from "./MetroInfoPanel";
import { MetroSVGMap } from "./MetroSVGMap";
import { MetroHeader } from "./MetroHeader";
import "./MetroOrgChart.scss";

// Map id → node for quick lookup
export const NODE_MAP = Object.fromEntries(NODES.map((n) => [n.id, n]));
export const PATH_IMG = "/img/orga/"

export default function MetroOrgChart() {
    const [active, setActive] = useState<NodeId | null>(null);
    const [hoveredLine, setHoveredLine] = useState<LineId | null>(null);
    const [animOffset, setAnimOffset] = useState(0);

    const activeNode = active ? NODE_MAP[active] : null;
    const activeNodeLines = activeNode ? (Array.isArray(activeNode.line) ? activeNode.line : [activeNode.line]) : [];
    const activeLine = activeNode ? LINES[Array.isArray(activeNode.line) ? activeNode.line[0] : activeNode.line] : null;

    // Animate dash offset for "train" effect
    useEffect(() => {
        if (!hoveredLine && !activeLine) {
            return;
        }

        let raf: number;
        const tick = () => {
            setAnimOffset((o) => (o - 1.5) % 180);
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => {
            cancelAnimationFrame(raf);
            setAnimOffset(0);
        };
    }, [hoveredLine, activeLine]);

    return (
        <div className="min-h-[500px] w-full flex flex-col">

            {/* ── Header ── */}
            <MetroHeader hoveredLine={hoveredLine} setHoveredLine={setHoveredLine} />

            {/* ── SVG Map ── */}
            <MetroSVGMap
                activeNode={activeNode}
                active={active}
                setActive={setActive}
                hoveredLine={hoveredLine}
                setHoveredLine={setHoveredLine}
                animOffset={animOffset}
            />

            {/* ── Info Panel ── */}
            <MetroInfoPanel
                activeNode={activeNode}
                activeLine={activeLine}
                activeNodeLines={activeNodeLines}
                setActive={setActive}
            />
            <p
                className={`${hoveredLine || activeLine ? "opacity-0" : "opacity-100"} text-center text-sm flicker transition-opacity py-6`}
                style={{ color: "#374151", fontFamily: "'Space Mono', monospace" } as React.CSSProperties}
            >
                <span className="hidden sm:block">↑ Survoler une ligne pour plus d’information et cliquez sur une station pour plus d’informations.</span>
                <span className="block sm:hidden">↑ Cliquez sur une station pour plus d’informations.</span>
            </p>
        </div>
    );
}