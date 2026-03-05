"use client";

import { useRef, useEffect, useState } from "react";

function TimelinePlane({ progress }: { progress: number }) {
    const clamped = Math.max(0, Math.min(1, progress));
    return (
        <span
            className="absolute -left-[18px] z-10 drop-shadow-lg text-white transition-all duration-700 ease-in-out pointer-events-none"
            style={{ top: `calc(${clamped * 100}% - 16px)` }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                className="w-8 h-8 rotate-180">
                <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
            </svg>
            <span className="absolute inset-0 rounded-full bg-white/20 blur-md animate-pulse" />
        </span>
    );
}

function useTimelineProgress(
    containerRef: React.RefObject<HTMLDivElement | null>,
    stepRefs: React.RefObject<(HTMLDivElement | null)[]>,
    steps: { start: Date; end: Date }[],
): number {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const container = containerRef.current;
        const refs = stepRefs.current;
        if (!container || !refs || refs.length === 0) return;

        const now = new Date();
        const containerH = container.getBoundingClientRect().height;
        if (containerH === 0) return;

        let activeIdx = -1;
        for (let i = 0; i < steps.length; i++) {
            if (now >= steps[i].start && now <= steps[i].end) {
                activeIdx = i;
                break;
            }
            if (now > steps[i].end) {
                activeIdx = i;
            }
        }

        if (activeIdx === -1 || now < steps[0].start) {
            setProgress(0);
            return;
        }

        const step = steps[activeIdx];
        const stepEl = refs[activeIdx];
        if (!stepEl) return;

        const containerRect = container.getBoundingClientRect();
        const stepRect = stepEl.getBoundingClientRect();

        const stepTop = stepRect.top - containerRect.top;
        const stepBottom = stepRect.bottom - containerRect.top;

        const elapsed = now.getTime() - step.start.getTime();
        const total = step.end.getTime() - step.start.getTime();
        const timePct = Math.min(1, Math.max(0, elapsed / total));

        const isCompleted = now > step.end;
        const yPos = isCompleted
            ? stepBottom
            : stepTop + (stepBottom - stepTop) * timePct;

        setProgress(yPos / containerH);
    }, [containerRef, stepRefs, steps]);

    return progress;
}

export default function Timeline({
    steps,
    children,
}: {
    steps: { start: Date; end: Date }[];
    children: (setStepRef: (index: number, el: HTMLDivElement | null) => void) => React.ReactNode;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

    const setStepRef = (index: number, el: HTMLDivElement | null) => {
        stepRefs.current[index] = el;
    };

    const progress = useTimelineProgress(containerRef, stepRefs, steps);

    return (
        <div
            ref={containerRef}
            className="relative ml-2 pl-8 border-l-4 border-(--color-secondary) dark:border-(--color-seconde-black) flex flex-col gap-10 pb-4"
        >
            <TimelinePlane progress={progress} />
            {children(setStepRef)}
        </div>
    );
}
