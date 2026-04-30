import { LineId, MetroLine, MetroNode, NodeId } from "./types";
import { LINES, NODES } from "./data";
import { buildLinePath, getLineFlags, getLineIdFromNode, getNodeState } from "./helper";
import { NODE_MAP, PATH_IMG } from "./MetroOrgChart";
import { NodeImage } from "./NodeImage";
import { useEffect, useRef, useState } from "react";

type MetroSVGMapProps = {
    activeNode: MetroNode | null;
    active: NodeId | null;
    setActive: (active: NodeId | null) => void;
    hoveredLine: LineId | null;
    setHoveredLine: (lineId: LineId | null) => void;
    animOffset: number;
};

export function MetroSVGMap({
    activeNode,
    active,
    setActive,
    hoveredLine,
    setHoveredLine,
    animOffset,
}: MetroSVGMapProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const [svgSize, setSvgSize] = useState({ w: 1000, h: 500 });

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

    return (
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
    )
}