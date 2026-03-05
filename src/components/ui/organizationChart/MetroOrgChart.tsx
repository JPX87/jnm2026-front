"use client";

import { useState, useEffect, useRef } from "react";
import { LINES, NODES } from "./data";
import { LineId, NodeId, MetroLine } from "./types";
import { buildLinePath, getNodeState, getLineFlags, getLineIdFromNode } from "./helper";
import { NodeImage } from "./NodeImage";
import "./MetroOrgChart.scss";

// Map id → node for quick lookup
const NODE_MAP = Object.fromEntries(NODES.map((n) => [n.id, n]));
const PATH_IMG = "/img/orga/"

export default function MetroOrgChart() {
    const [active, setActive] = useState<NodeId | null>(null);
    const [hoveredLine, setHoveredLine] = useState<LineId | null>(null);
    const [animOffset, setAnimOffset] = useState(0);
    const svgRef = useRef<SVGSVGElement>(null);
    const [svgSize, setSvgSize] = useState({ w: 1000, h: 500 });

    const activeNode = active ? NODE_MAP[active] : null;
    const activeLine = activeNode ? LINES[Array.isArray(activeNode.line) ? activeNode.line[0] : activeNode.line] : null;

    // Resize observer
    useEffect(() => {
        const update = () => {
            if (svgRef.current) {
                const rect = svgRef.current.getBoundingClientRect();
                setSvgSize({ w: rect.width || 1000, h: rect.height || 500 });
            }
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

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
            <header className="px-2 sm:px-8 pt-1 pb-4 flex flex-col lg:flex-row items-end justify-between">
                <p
                    className="text-sm tracking-[0.3em] m-auto uppercase mb-1 flicker"
                    style={{ color: "#6B7280", fontFamily: "'Space Mono', monospace" }}
                >
                    Plan du réseau
                </p>
                {/* Legend */}
                <div className="flex gap-5 w-full sm:w-auto sm:mx-auto overflow-x-auto pt-2 mt-3 pb-1">
                    {(Object.values(LINES) as MetroLine[]).map((line) => (
                        <button
                            key={line.id}
                            onMouseEnter={() => setHoveredLine(line.id as LineId)}
                            onMouseLeave={() => setHoveredLine(null)}
                            className="flex flex-col select-none items-center gap-2 text-xs transition-all"
                            style={{
                                color: hoveredLine === line.id ? line.color : "#6B7280",
                                fontFamily: "'Space Mono', monospace",
                            }}
                        >
                            <span
                                className="inline-block rounded-full transition-all"
                                style={{
                                    width: 28,
                                    height: 7,
                                    background: line.color,
                                    opacity: hoveredLine && hoveredLine !== line.id ? 0.3 : 1,
                                    boxShadow: hoveredLine === line.id ? `0 0 10px ${line.color}` : "none",
                                }}
                            />
                            {line.name}
                        </button>
                    ))}
                </div>
            </header>

            {/* ── SVG Map ── */}
            <div className="flex-1 px-1 sm:px-8 relative" style={{ minHeight: 500 }}>
                <svg
                    ref={svgRef}
                    className="w-full h-full"
                    style={{ minHeight: 480 }}
                    viewBox={`0 0 ${svgSize.w} ${svgSize.h}`}
                    preserveAspectRatio="xMidYMid meet"
                >
                    <defs>
                        {(Object.values(LINES) as MetroLine[]).map((line) => (
                            <filter key={`glow-${line.id}`} id={`glow-${line.id}`}>
                                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        ))}
                    </defs>

                    {/* ── Lines ── */}
                    {(Object.values(LINES) as MetroLine[]).map((line) => {
                        const path = buildLinePath(NODE_MAP, line, svgSize.w, svgSize.h);
                        const { isHighlighted, isDimmed } = getLineFlags(line, hoveredLine, activeNode);
                        return (
                            <g
                                onMouseEnter={() => setHoveredLine(line.id as LineId)}
                                onMouseLeave={() => setHoveredLine(null)}
                                key={line.id}>
                                {/* Shadow / glow track */}
                                <path
                                    d={path}
                                    fill="none"
                                    stroke={line.color}
                                    //strokeWidth={isHighlighted ? 50 : 30}
                                    strokeOpacity={1}
                                    strokeLinecap="round"
                                    className={`${isHighlighted ? "stroke-25 lg:stroke-50" : "stroke-15 lg:stroke-30"}`}
                                />
                                {/* Main track */}
                                <path
                                    d={path}
                                    fill="none"
                                    stroke={line.color}
                                    strokeWidth={isHighlighted ? 5 : 3}
                                    strokeOpacity={isDimmed ? 0.2 : 0.8}
                                    strokeLinecap="round"
                                    filter={isHighlighted ? `url(#glow-${line.id})` : undefined}
                                    style={{ transition: "stroke-opacity 0.3s, stroke-width 0.3s" }}
                                />
                                {/* Animated "train" dash */}
                                {isHighlighted && (
                                    <path
                                        d={path}
                                        fill="none"
                                        stroke="white"
                                        strokeWidth={3}
                                        strokeLinecap="round"
                                        strokeDasharray="18 160"
                                        strokeDashoffset={animOffset}
                                        strokeOpacity={0.9}
                                    />
                                )}
                            </g>
                        );
                    })}

                    {/* ── Nodes ── */}
                    {NODES.map((node) => {
                        const cx = (node.x / 100) * svgSize.w;
                        const cy = (node.y / 100) * svgSize.h;
                        const { lineColor, isActive, isDimmedNode } =
                            getNodeState(node, active, activeNode, hoveredLine);

                        return (
                            <g
                                key={node.id}
                                transform={`translate(${cx},${cy})`}
                                className="cursor-pointer transition-all"
                                onClick={() => setActive(isActive ? null : node.id)}
                                opacity={isDimmedNode ? 0.25 : 1}
                                onMouseEnter={() => setHoveredLine(getLineIdFromNode(node))}
                                onMouseLeave={() => setHoveredLine(null)}
                            >

                                {/* Main circle */}
                                <circle
                                    r={18}
                                    stroke={lineColor}
                                    strokeWidth={node.isHub ? 3 : 2}
                                    style={{
                                        filter: isActive ? `drop-shadow(0 0 8px #FFF)` : "none",
                                        "--line-color": lineColor,
                                    } as React.CSSProperties}
                                    className={`
                                        node-circle
                                        ${isActive ? "active" : ""}
                                        [r:18px]
                                        sm:[r:25px] lg:[r:40px] 2xl:[r:50px] 3xl:[r:60px] 4xl:[r:80px]
                                        transition-all
                                    `}
                                />

                                {/* Label */}
                                <text
                                    className={`node-label select-none dark:fill-[#E5E7EB] sm:text-sm lg:text-lg`}
                                    x={0}
                                    y={svgSize.w < 950 ? -25 : svgSize.w < 1800 ? -45 : -70}
                                    textAnchor="middle"
                                    fontSize={10}
                                    fontWeight={700}
                                    fill={isActive ? "#FFF" : "#222"}
                                    style={{
                                        filter: isActive ? `drop-shadow(0 0 6px ${lineColor})` : "none",
                                        pointerEvents: "none",
                                    } as React.CSSProperties}
                                >
                                    {svgSize.w < 700 ? node.shortLabel : node.label}
                                </text>

                                {/* Image */}
                                <NodeImage
                                    className="node-image select-none"
                                    imageUrl={node.imageUrl}
                                    pathImg={PATH_IMG}
                                    label={node.label}
                                    isActive={isActive}
                                    svgSize={svgSize}
                                    isForeignObject
                                    quality={75}
                                    priority={false}
                                />

                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* ── Info Panel ── */}
            <div className={`fixed z-20 bottom-0 left-0 right-0 lg:m-auto lg:w-2/3 min-h-[90px] 
                    ${(activeNode && activeLine) ? "opacity-100" : "opacity-0 pointer-events-none"} transition-opacity
                    px-2 sm:px-8 pb-2 sm:pb-8}`}>
                <div
                    className="info-panel relative rounded-2xl px-2 sm:px-6 py-1 sm:py-4 flex items-center gap-6 bg-(--color-secondary) dark:bg-(--color-seconde-black) border transition-all"
                    style={{
                        backgroundImage: `linear-gradient(135deg, ${activeLine?.color}28, ${activeLine?.color}18)`,
                        borderColor: `${activeLine?.color}40`,
                        boxShadow: `0 0 30px ${activeLine?.color}20`,
                    } as React.CSSProperties}
                >
                    <div
                        className="profile flex-shrink-0 h-32 w-32 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-lg node-label transition-all"
                        style={{
                            backgroundColor: activeLine?.color,
                            boxShadow: `0 0 20px ${activeLine?.color}80`,
                        } as React.CSSProperties}
                    >
                        <NodeImage
                            imageUrl={activeNode?.imageUrl}
                            pathImg={PATH_IMG}
                            label={activeNode?.label || ""}
                            isActive={true}
                            svgSize={{ w: 100, h: 100 }}
                            quality={100}
                            priority={true}
                            fixedSize={120}
                        />
                    </div>
                    <div>
                        <p className="font-bold text-lg node-label" style={{ color: activeLine?.color }}>
                            {activeNode?.label}
                        </p>
                        <p className="text-sm" style={{ color: "#9CA3AF", fontFamily: "'Space Mono', monospace" }}>
                            {activeNode?.sublabel ?? "Membre"} · {activeLine?.name}
                        </p>
                    </div>
                    <div className="hidden sm:block ml-auto text-right text-[#374151] dark:text-[#9CA3AF]"
                        style={{ fontFamily: "'Space Mono', monospace" }}>
                        <p className="text-xs">
                            {activeNode?.isHub ? "Nœud d'interconnexion" : "Station"}
                        </p>
                        <p className="text-xs mt-1">
                            Ligne {activeLine?.id} — {activeLine?.nodes.length} arrêts
                        </p>
                    </div>
                    <span
                        className={`close absolute bottom-0 right-3 text-5xl sm:text-2xl text-gray-500 cursor-pointer 
                            opacity-50 hover:opacity-100 transition-opacity`}
                        onClick={() => setActive(null)}
                    >
                        &times;
                    </span>
                </div>
            </div>


            <p
                className={`${hoveredLine || activeLine ? "opacity-0" : "opacity-100"} text-center text-sm flicker transition-opacity py-6`}
                style={{ color: "#374151", fontFamily: "'Space Mono', monospace" } as React.CSSProperties}

            >
                ↑ Cliquez sur une station pour explorer · Survolez une ligne pour la mettre en valeur
            </p>

        </div>
    );
}