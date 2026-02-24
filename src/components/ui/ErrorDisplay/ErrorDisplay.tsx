'use client'

import Link from "next/link"

const ERROR_CODES = [400, 401, 403, 404, 408, 500, 502, 503, 504] as const

function getColumnItems(code: number, radius = 3) {
    const idx = ERROR_CODES.indexOf(code as (typeof ERROR_CODES)[number])
    const center = idx === -1 ? ERROR_CODES.indexOf(500) : idx
    const len = ERROR_CODES.length
    const items: { code: number; distance: number }[] = []

    for (let d = -radius; d <= radius; d++) {
        const i = ((center + d) % len + len) % len
        items.push({ code: ERROR_CODES[i], distance: Math.abs(d) })
    }
    return items
}

function styleForDistance(distance: number): React.CSSProperties {
    if (distance === 0) {
        return { opacity: 1, fontWeight: 800, transform: 'scale(1)' }
    }
    const opacityMap: Record<number, number> = { 1: 0.45, 2: 0.2, 3: 0.08 }
    const scaleMap: Record<number, number> = { 1: 0.72, 2: 0.55, 3: 0.4 }
    return {
        opacity: opacityMap[distance] ?? 0.05,
        fontWeight: 400,
        transform: `scale(${scaleMap[distance] ?? 0.35})`,
    }
}

interface ErrorDisplayProps {
    code?: number
    message?: string
    onRetry?: () => void
    linkHref?: string
    linkLabel?: string
}

export default function ErrorDisplay({
    code = 500,
    message = "Oups\u00a0! Une erreur inattendue est survenue.",
    onRetry,
    linkHref,
    linkLabel = "Retour à l\u2019accueil",
}: ErrorDisplayProps) {
    const column = getColumnItems(code)

    return (
        <>
            <main
                className="flex flex-col items-center justify-center text-center px-4 overflow-hidden select-none"
                style={{ height: 'calc(100dvh - 4rem)' }}
            >
                <p
                    className="tracking-[0.3em] uppercase text-sm md:text-base mb-4"
                    style={{ color: 'var(--foreground)', opacity: 0.6 }}
                >
                    Erreur
                </p>

                <div className="relative flex flex-col items-center gap-0 leading-none animate-[slotBounce_0.6s_cubic-bezier(.34,1.56,.64,1)_both]">
                    {column.map(({ code: c, distance }, i) => {
                        const isCenter = distance === 0
                        return (
                            <span
                                key={i}
                                className="block transition-all duration-500 font-['Oswald']"
                                style={{
                                    ...styleForDistance(distance),
                                    fontSize: isCenter
                                        ? 'clamp(4rem, 12vw, 8rem)'
                                        : `clamp(${2 - distance * 0.4}rem, ${7 - distance * 2}vw, ${4.5 - distance * 1}rem)`,
                                    lineHeight: isCenter ? '1.1' : '1.15',
                                    color: isCenter ? 'var(--color-primary)' : 'var(--foreground)',
                                    letterSpacing: isCenter ? '0.08em' : '0.04em',
                                }}
                            >
                                {c}
                            </span>
                        )
                    })}

                    <div
                        className="pointer-events-none absolute inset-x-0 top-0 h-14"
                        style={{ background: 'linear-gradient(to bottom, var(--background), transparent)' }}
                    />
                    <div
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-14"
                        style={{ background: 'linear-gradient(to top, var(--background), transparent)' }}
                    />
                </div>

                {/* ── Message ── */}
                <p className="mt-6 text-base md:text-lg xl:text-xl font-['Oswald'] border-2 border-(--color-primary) rounded-2xl p-4 max-w-lg">
                    {message}
                </p>

                {/* ── Actions ── */}
                <div className="mt-5 flex flex-wrap gap-3 justify-center">
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="px-8 py-3 rounded-xl font-['Oswald'] text-base md:text-lg tracking-wide bg-(--color-primary) text-white hover:brightness-110 active:scale-95 transition-all duration-200 cursor-pointer"
                        >
                            Réessayer
                        </button>
                    )}
                    {linkHref && (
                        <Link
                            href={linkHref}
                            className="px-8 py-3 rounded-xl font-['Oswald'] text-base md:text-lg tracking-wide bg-(--color-primary) text-white hover:brightness-110 active:scale-95 transition-all duration-200 inline-block"
                        >
                            {linkLabel}
                        </Link>
                    )}
                </div>
            </main>

            {/* ── Inline keyframe ── */}
            <style>{`
        @keyframes slotBounce {
          0%   { opacity: 0; transform: translateY(-40px); }
          60%  { opacity: 1; transform: translateY(6px); }
          80%  { transform: translateY(-3px); }
          100% { transform: translateY(0); }
        }
        @media (min-width: 768px) {
          main { height: calc(100dvh - 5rem) !important; }
        }
      `}</style>
        </>
    )
}
