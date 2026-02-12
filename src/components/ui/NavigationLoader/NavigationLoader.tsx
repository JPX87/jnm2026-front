"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type LoaderState = "idle" | "loading" | "complete";

export default function NavigationLoader() {
    const [state, setState] = useState<LoaderState>("idle");
    const pathname = usePathname();
    const prevPathname = useRef(pathname);
    const cleanupTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Detect internal link clicks to START loading
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const anchor = (e.target as HTMLElement).closest("a");
            if (!anchor) return;

            const href = anchor.getAttribute("href");
            if (!href) return;

            // Only trigger for internal links (not external, not anchors, not same page)
            const isInternal = href.startsWith("/") || href.startsWith(".");
            const isSamePage = href === pathname || href === "";
            const isNewTab = anchor.target === "_blank";
            const isModifiedClick = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;

            if (isInternal && !isSamePage && !isNewTab && !isModifiedClick) {
                if (cleanupTimer.current) {
                    clearTimeout(cleanupTimer.current);
                }
                setState("loading");
            }
        };

        document.addEventListener("click", handleClick, true);
        return () => document.removeEventListener("click", handleClick, true);
    }, [pathname]);

    // Detect pathname change to COMPLETE loading
    useEffect(() => {
        if (pathname !== prevPathname.current) {
            prevPathname.current = pathname;

            // Only transition to complete if we were loading
            setState((current) => {
                if (current === "loading") {
                    return "complete";
                }
                return current;
            });

            // Reset to idle after completion animation
            cleanupTimer.current = setTimeout(() => {
                setState("idle");
            }, 400);
        }

        return () => {
            if (cleanupTimer.current) {
                clearTimeout(cleanupTimer.current);
            }
        };
    }, [pathname]);

    // Also handle browser back/forward (popstate triggers pathname change already,
    // but we need to start loading immediately)
    useEffect(() => {
        const handlePopState = () => {
            if (cleanupTimer.current) {
                clearTimeout(cleanupTimer.current);
            }
            setState("loading");
        };

        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, []);

    if (state === "idle") return null;

    return (
        <div
            className="fixed top-0 left-0 w-full h-[3px] z-[99999] pointer-events-none"
            role="progressbar"
            aria-label="Chargement de la page"
        >
            <div
                className={`navigation-loader-bar h-full bg-[var(--color-secondary)] rounded-r-sm shadow-[0_0_8px_var(--color-secondary)] origin-left will-change-[transform,opacity] ${state === "loading"
                        ? "animate-[loader-grow_2s_cubic-bezier(0.25,0.46,0.45,0.94)_forwards]"
                        : "animate-[loader-complete_0.3s_ease-out_forwards]"
                    }`}
            />
        </div>
    );
}
