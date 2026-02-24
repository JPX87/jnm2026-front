import { MetroNode, MetroLine } from "./types";

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