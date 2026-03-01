import { MetroNode, MetroLine, LineId, NodeId, NodeState, LineFlags } from "./types";
import { LINES } from "./data";

export function buildLinePath(nodeMap: Record<string, MetroNode>, line: MetroLine, svgW: number, svgH: number): string {
    const pts = line.nodes.map((id) => nodeMap[id]).filter(Boolean);
    if (pts.length < 2) return "";
    const toX = (x: number) => (x / 100) * svgW;
    const toY = (y: number) => (y / 100) * svgH;

    let d = `M ${toX(pts[0].x)} ${toY(pts[0].y)}`;
    for (let i = 1; i < pts.length; i++) {
        const prev = pts[i - 1];
        const curr = pts[i];
        const mx = (toX(prev.x) + toX(curr.x)) / 2;
        // Metro-style: horizontal then vertical ("L-shape" with a curve)
        d += ` C ${mx} ${toY(prev.y)}, ${mx} ${toY(curr.y)}, ${toX(curr.x)} ${toY(curr.y)}`;
    }
    return d;
}

// additional helpers extracted from MetroOrgChart
export const normalizeLines = (line: LineId | LineId[]): LineId[] =>
    Array.isArray(line) ? line : [line];

export function getLineIdFromNode(node: MetroNode): LineId {
    return Array.isArray(node.line) ? node.line[0] : node.line as LineId;
}

export function getNodeState(
    node: MetroNode,
    active: NodeId | null,
    activeNode: MetroNode | null,
    hoveredLine: LineId | null
): NodeState {
    const nodeLines = normalizeLines(node.line);
    const activeNodeLines = activeNode ? normalizeLines(activeNode.line) : [];
    const lineColor = LINES[nodeLines[0]].color;
    const isActive = active === node.id;
    const isDimmedByHover = !!hoveredLine && !nodeLines.includes(hoveredLine);
    const isDimmedByActive = !!active && !nodeLines.some((l) => activeNodeLines.includes(l));
    const isLineHighlighted = !!hoveredLine && nodeLines.includes(hoveredLine);

    return {
        nodeLines,
        activeNodeLines,
        lineColor,
        isActive,
        isDimmedByHover,
        isDimmedByActive,
        isDimmedNode: (isDimmedByHover || isDimmedByActive) && !isLineHighlighted,
    };
}

export function getLineFlags(
    line: MetroLine,
    hoveredLine: LineId | null,
    activeNode: MetroNode | null
): LineFlags {
    const isHighlighted =
        hoveredLine === line.id ||
        (!!activeNode && normalizeLines(activeNode.line).includes(line.id));
    const isDimmed =
        (!!hoveredLine && hoveredLine !== line.id) ||
        (!!activeNode && !normalizeLines(activeNode.line).includes(line.id));
    return { isHighlighted, isDimmed };
}
