import { ReactNode } from "react";
import { PartnerCarouselLogo } from '@/components/ui/PartnerCarouselLogo/PartnerCarouselLogo';
import { partnersList } from '@/data/partenaires';

interface PageTemplateProps {
    title?: string;
    children: ReactNode;
    className?: string;
    titleClassName?: string;
}

export default function PageTemplate({
    title,
    children,
    className = "",
    titleClassName = ""
}: PageTemplateProps) {
    return (
        <main className={`relative bg-(--color-primary) min-h-screen text-(--color-secondary) dark:text-(--color-seconde-black) ${className}`}>
            <div className="flex flex-col gap-8 md:gap-12 py-8 md:py-12 pt-24 md:pt-32">
                <PartnerCarouselLogo partnersList={partnersList} />

                {/* Hero Section - Title */}
                {title && (<div className="w-full">
                    <h1 className={`text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold my-[20px] md:my-[30px] ${titleClassName}`}>
                        {title}
                    </h1>
                </div>
                )}

                {/* Content Section */}
                {children}
            </div>
        </main>
    );
}
