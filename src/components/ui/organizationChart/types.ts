
export type NodeId = string;

export interface MetroNode {
    id: NodeId;
    label: string;
    sublabel?: string;
    x: number; // 0–100 grid unit
    y: number;
    line: LineId; // primary line color
    isHub?: boolean; // junction node (appears on multiple lines)
}

export interface MetroLine {
    id: LineId;
    name: string;
    color: string;
    nodes: NodeId[];
}

export type LineId = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";