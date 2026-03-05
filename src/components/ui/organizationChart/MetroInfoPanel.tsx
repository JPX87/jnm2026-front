import { LINES } from "./data";
import { MetroLine, MetroNode, LineId, NodeId } from "./types";
import { PATH_IMG } from "./MetroOrgChart";
import { NodeImage } from "./NodeImage";

type MetroInfoPanelProps = {
    activeNode: MetroNode | null;
    activeLine: MetroLine | null;
    activeNodeLines: LineId[];
    setActive: (active: NodeId | null) => void;
};

export function MetroInfoPanel({
    activeNode,
    activeLine,
    activeNodeLines,
    setActive,
}: MetroInfoPanelProps) {
    return (
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
                        {activeNode?.sublabel ?? "Membre"} · {activeNodeLines.map((lineId) => LINES[lineId].name).join("/")}
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
    );
}