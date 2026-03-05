import { LINES } from "./data";
import { LineId, MetroLine } from "./types";

type MetroHeaderProps = {
    hoveredLine: LineId | null;
    setHoveredLine: (lineId: LineId | null) => void;
};

export function MetroHeader({ hoveredLine, setHoveredLine }: MetroHeaderProps) {
    return (
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
    );
}