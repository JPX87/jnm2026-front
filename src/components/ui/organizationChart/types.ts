
export type NodeId = string;

export interface MetroNode {
    id: NodeId;
    label: string;
    shortLabel: string;
    sublabel?: string;
    imageUrl?: string;
    x: number; // 0–100 grid unit
    y: number;
    line: LineId | LineId[]; // primary line color
    isHub?: boolean; // junction node (appears on multiple lines)
}

export interface MetroLine {
    id: LineId;
    name: string;
    color: string;
    nodes: NodeId[];
}

// helper-related types
export interface NodeState {
    nodeLines: LineId[];
    activeNodeLines: LineId[];
    lineColor: string;
    isActive: boolean;
    isDimmedByHover: boolean;
    isDimmedByActive: boolean;
    isDimmedNode: boolean;
}

export interface LineFlags {
    isHighlighted: boolean;
    isDimmed: boolean;
}

export type LineId = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";