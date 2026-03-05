"use client";

import { useRef, useState, useCallback, useContext, createContext } from "react";

const SetStepRefContext = createContext<(index: number, el: HTMLDivElement | null) => void>(() => {});

export function useStepRef(index: number) {
    const setStepRef = useContext(SetStepRefContext);
    return useCallback((el: HTMLDivElement | null) => setStepRef(index, el), [setStepRef, index]);
}

function TimelinePlane({ progress }: { progress: number }) {
    const clamped = Math.max(0, Math.min(1, progress));
    return (
        <span
            className="absolute -left-[18px] z-10 drop-shadow-lg text-white transition-all duration-700 ease-in-out pointer-events-none"
            style={{ top: `calc(${clamped * 100}% - 16px)` }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 rotate-180">
                <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
            </svg>
            <span className="absolute inset-0 rounded-full bg-white/20 blur-md animate-pulse" />
        </span>
    );
}

export default function Timeline({
    steps,
    children,
}: {
    steps: { start: Date; end: Date }[];
    children: React.ReactNode;
}) {
    const [progress, setProgress] = useState(0);
    const stepEls = useRef<(HTMLDivElement | null)[]>([]);

    const setStepRef = useCallback((index: number, el: HTMLDivElement | null) => {
        stepEls.current[index] = el;
    }, []);

    const containerRef = useCallback((container: HTMLDivElement | null) => {
        if (!container) return;

        const now = new Date();
        const containerH = container.getBoundingClientRect().height;
        if (containerH === 0) return;

        let activeIdx = -1;
        for (let i = 0; i < steps.length; i++) {
            if (now >= steps[i].start && now <= steps[i].end) { activeIdx = i; break; }
            if (now > steps[i].end) activeIdx = i;
        }

        if (activeIdx === -1 || now < steps[0].start) return;

        const stepEl = stepEls.current[activeIdx];
        if (!stepEl) return;

        const step = steps[activeIdx];
        const cRect = container.getBoundingClientRect();
        const sRect = stepEl.getBoundingClientRect();
        const stepTop = sRect.top - cRect.top;
        const stepBottom = sRect.bottom - cRect.top;
        const timePct = Math.min(1, Math.max(0, (now.getTime() - step.start.getTime()) / (step.end.getTime() - step.start.getTime())));
        const yPos = now > step.end ? stepBottom : stepTop + (stepBottom - stepTop) * timePct;

        setProgress(yPos / containerH);
    }, [steps]);

    return (
        <SetStepRefContext.Provider value={setStepRef}>
            <div
                ref={containerRef}
                className="relative ml-2 pl-8 border-l-4 border-(--color-secondary) dark:border-(--color-seconde-black) flex flex-col gap-10 pb-4"
            >
                <TimelinePlane progress={progress} />
                {children}
            </div>
        </SetStepRefContext.Provider>
    );
}