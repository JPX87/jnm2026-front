"use client";

import { useState, useEffect, useRef } from "react";
import { LINES, NODES } from "./data";
import { LineId, NodeId, MetroLine } from "./types";
import { buildLinePath } from "./helper";

// Map id → node
const NODE_MAP = Object.fromEntries(NODES.map((n) => [n.id, n]));

export default function MetroOrgChart() {
    const [active, setActive] = useState<NodeId | null>(null);
    const [hoveredLine, setHoveredLine] = useState<LineId | null>(null);
    const [animOffset, setAnimOffset] = useState(0);
    const svgRef = useRef<SVGSVGElement>(null);
    const [svgSize, setSvgSize] = useState({ w: 900, h: 500 });

    // Resize observer
    useEffect(() => {
        const update = () => {
            if (svgRef.current) {
                const rect = svgRef.current.getBoundingClientRect();
                setSvgSize({ w: rect.width || 900, h: rect.height || 500 });
            }
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    // Animate dash offset for "train" effect
    useEffect(() => {
        let raf: number;
        const tick = () => {
            setAnimOffset((o) => (o - 1.5) % 200);
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, []);

    const activeNode = active ? NODE_MAP[active] : null;
    const activeLine = activeNode ? LINES[activeNode.line] : null;

    return (
        <div className="min-h-[500px] w-full flex flex-col">

            {/* ── Header ── */}
            <header className="px-8 pt-8 pb-4 flex items-end justify-between">
                <div>
                    <p
                        className="text-xs tracking-[0.3em] uppercase mb-1 flicker"
                        style={{ color: "#6B7280", fontFamily: "'Space Mono', monospace" }}
                    >
                        Plan du réseau
                    </p>
                </div>

                {/* Legend */}
                <div className="flex gap-5">
                    {(Object.values(LINES) as MetroLine[]).map((line) => (
                        <button
                            key={line.id}
                            onMouseEnter={() => setHoveredLine(line.id as LineId)}
                            onMouseLeave={() => setHoveredLine(null)}
                            className="flex items-center gap-2 text-xs transition-all"
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
            <div className="flex-1 px-8 relative" style={{ minHeight: 500 }}>
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
                        const isHighlighted = hoveredLine === line.id || (activeNode && activeNode.line === line.id);
                        const isDimmed = (hoveredLine && hoveredLine !== line.id) || (activeNode && activeNode.line !== line.id);
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
                        const lineColor = LINES[node.line].color;
                        const isActive = active === node.id;
                        const isDimmedNode =
                            (hoveredLine && hoveredLine !== node.line) ||
                            (active && activeNode && activeNode.line !== node.line && !node.isHub);

                        return (
                            <g
                                key={node.id}
                                transform={`translate(${cx},${cy})`}
                                className="cursor-pointer"
                                onClick={() => setActive(isActive ? null : node.id)}
                                style={{ transition: "opacity 0.3s" }}
                                opacity={isDimmedNode ? 0.25 : 1}

                                onMouseEnter={() => setHoveredLine(node.line as LineId)}
                                onMouseLeave={() => setHoveredLine(null)}
                            >
                                {/* Pulse ring (active) */}
                                {isActive && (
                                    <circle
                                        className="pulse-ring"
                                        r={node.isHub ? 22 : 16}
                                        fill="none"
                                        stroke={lineColor}
                                        strokeWidth={2}
                                    />
                                )}

                                {/* Hub outer ring 
                                {node.isHub && (
                                    <circle
                                        r={18}
                                        fill="none"
                                        stroke={lineColor}
                                        strokeWidth={3}
                                        opacity={0.5}
                                    />
                                )}*/}

                                {/* Main circle */}
                                <circle
                                    r={15}
                                    fill={isActive ? lineColor : "#111827"}
                                    stroke={lineColor}
                                    strokeWidth={node.isHub ? 3 : 2}
                                    style={{
                                        filter: isActive ? `drop-shadow(0 0 8px ${lineColor})` : "none",
                                        transition: "fill 0.2s",
                                    }}
                                    className="sm:[r:25px]"
                                />

                                {/* Hub inner dot */}
                                {node.isHub && (
                                    <circle r={4} fill={lineColor} />
                                )}

                                {/* Label */}
                                <text
                                    className="node-label"
                                    x={0}
                                    y={node.isHub ? -22 : -17}
                                    textAnchor="middle"
                                    fontSize={node.isHub ? 13 : 11}
                                    fontWeight={700}
                                    fill={isActive ? "#FFF" : "#E5E7EB"}
                                    style={{
                                        filter: isActive ? `drop-shadow(0 0 6px ${lineColor})` : "none",
                                        pointerEvents: "none",
                                    }}
                                >
                                    {node.label}
                                </text>

                                {/* Sublabel */}
                                {node.sublabel && (
                                    <>
                                        <text
                                            x={0}
                                            y={node.isHub ? -10 : -7}
                                            textAnchor="middle"
                                            fontSize={8}
                                            fill="#6B7280"
                                            style={{ fontFamily: "'Space Mono', monospace", pointerEvents: "none" }}
                                        >
                                            {node.sublabel}
                                        </text>
                                        <defs>
                                            <rect id="rect" x="-2%" y="-3.5%" width="40" height="40" rx="40" />
                                            <clipPath id="clip">
                                                <use xlinkHref="#rect" />
                                            </clipPath>
                                        </defs>

                                        <image
                                            x="-20" y="-20"
                                            href="https://static.thenounproject.com/png/3901062-200.png"
                                            height="40" width="40"
                                            clipPath="url(#clip)"
                                        />
                                    </>
                                )}
                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* ── Info Panel ── */}
            <div className="fixed bottom-0 left-0 right-0 px-8 pb-8" style={{ minHeight: 90 }}>
                {activeNode && activeLine ? (
                    <div
                        className="slide-in rounded-2xl px-6 py-4 flex items-center gap-6"
                        style={{
                            background: `linear-gradient(135deg, ${activeLine.color}18, ${activeLine.color}08)`,
                            border: `1px solid ${activeLine.color}40`,
                            boxShadow: `0 0 30px ${activeLine.color}20`,
                        }}
                    >
                        <div
                            className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg node-label"
                            style={{
                                background: activeLine.color,
                                boxShadow: `0 0 20px ${activeLine.color}80`,
                            }}
                        >
                            {activeLine.id}
                        </div>
                        <div>
                            <p className="font-bold text-lg node-label" style={{ color: activeLine.color }}>
                                {activeNode.label}
                            </p>
                            <p className="text-sm" style={{ color: "#9CA3AF", fontFamily: "'Space Mono', monospace" }}>
                                {activeNode.sublabel} · {activeLine.name}
                            </p>
                        </div>
                        <div className="ml-auto text-right">
                            <p className="text-xs" style={{ color: "#4B5563", fontFamily: "'Space Mono', monospace" }}>
                                {activeNode.isHub ? "🔀 Nœud d'interconnexion" : "🚉 Station"}
                            </p>
                            <p className="text-xs mt-1" style={{ color: "#374151", fontFamily: "'Space Mono', monospace" }}>
                                Ligne {activeLine.id} — {activeLine.nodes.length} arrêts
                            </p>
                        </div>
                    </div>
                ) : (
                    <p
                        className="text-center text-sm flicker"
                        style={{ color: "#374151", fontFamily: "'Space Mono', monospace" }}
                    >
                        ↑ Cliquez sur une station pour explorer · Survolez une ligne pour la mettre en valeur
                    </p>
                )}
            </div>
        </div>
    );
}