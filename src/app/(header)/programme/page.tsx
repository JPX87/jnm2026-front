import PageTemplate from "@/components/layout/PageTemplate/PageTemplate";
import Section from "@/components/layout/Section/Section";
import Programme from "@/components/ui/Programme/Programme";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Programme",
}

export default function ProgrammePage() {
    return (
        <main className="relative bg-(--color-secondary) min-h-screen text-(--color-seconde-black) dark:bg-(--color-seconde-black) dark:text-(--color-secondary)">
            <div className="flex flex-col gap-8 md:gap-12 py-8 md:py-12 pt-24 md:pt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Section - Title */}
                <div className="w-full">
                    <h1 className="text-center text-3xl sm:text-4xl md:text-[3.5rem] lg:text-[4rem] font-black my-[20px] md:my-[30px] text-(--color-primary) uppercase tracking-wide">
                        PROGRAMME
                    </h1>
                </div>

                {/* Content Section */}
                <Programme />
            </div>
        </main>
    );
}
