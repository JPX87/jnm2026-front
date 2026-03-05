export function ArrowRight({ className = "" }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
            className={`w-6 h-6 shrink-0 ${className}`}>
            <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
    );
}

export default function FormLink({ href, label }: { href: string; label: string }) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer"
            className="group flex items-center gap-3 bg-(--color-primary) text-(--color-secondary) dark:text-(--color-seconde-black) rounded-xl px-5 py-4 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] transition-all duration-200 cursor-pointer">
            <span className="text-xl">📝</span>
            <p className="text-base sm:text-lg font-bold uppercase flex-1">{label}</p>
            <ArrowRight className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
        </a>
    );
}
