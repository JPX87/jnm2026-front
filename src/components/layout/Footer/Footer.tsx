import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full bg-(--color-primary) text-(--color-secondary) dark:text-(--color-seconde-black) py-6 px-4 mt-auto">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm font-['Oswald']">
                <span className="font-bold text-base tracking-wide">
                    JNM 2026 — Toulouse
                </span>

                <nav className="flex items-center gap-4">
                    <Link
                        href="/mentions-legales"
                        className="underline underline-offset-4 hover:opacity-80 transition-opacity"
                    >
                        Mentions Légales
                    </Link>
                </nav>

                <span className="text-xs opacity-75">
                    © 2026 JNM — Tous droits réservés
                </span>
            </div>
        </footer>
    );
}
