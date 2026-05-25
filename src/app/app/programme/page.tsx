import AppProgramme from '@/components/ui/Programme/AppProgramme';

export default function ProgrammePage() {
    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-0">
            {/* Header */}
            <div className="mb-6 sm:mb-8 flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#ff89b8] to-[#ef6a9f] flex items-center justify-center flex-shrink-0 shadow-lg">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold italic text-white drop-shadow-lg">
                        Programme
                    </h1>
                    <p className="text-white/70 text-sm mt-0.5">JNM 2026 · 26–29 mai · Toulouse</p>
                </div>
            </div>

            <AppProgramme />
        </div>
    );
}
