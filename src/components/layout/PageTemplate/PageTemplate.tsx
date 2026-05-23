import { ReactNode } from "react";
import { PartnerCarouselLogo } from '@/components/ui/PartnerCarouselLogo/PartnerCarouselLogo';
import { partnersList } from '@/data/partenaires';

interface PageTemplateProps {
    title?: string;
    children: ReactNode;
    className?: string;
    titleClassName?: string;
    parternersSlider?: boolean;
    variant?: 'primary' | 'secondary' | 'tertiary' | 'theme';
}

export default function PageTemplate({
    title,
    children,
    className = "",
    titleClassName = "",
    parternersSlider = true,
    variant = 'primary'
}: PageTemplateProps) {
    const getBackgroundClass = () => {
        switch (variant) {
            case 'primary':
                return 'bg-(--color-primary) text-(--color-secondary) dark:text-(--color-seconde-black)';
            case 'secondary':
                return 'bg-(--color-secondary) text-(--color-primary)';
            case 'tertiary':
                return 'bg-(--color-tertiary) text-(--color-secondary) dark:text-(--color-seconde-black)';
            case 'theme':
                return 'bg-(--color-secondary) text-(--color-primary) dark:bg-(--color-seconde-black) dark:text-(--color-secondary)';
            default:
                return 'bg-(--color-tertiary) text-(--color-secondary) dark:text-(--color-seconde-black)';
        }
    };

    return (
        <main className={`relative ${getBackgroundClass()} min-h-screen ${className}`}>
            <div className="flex flex-col gap-8 md:gap-12 py-8 md:py-12 pt-24 md:pt-32">
                {parternersSlider && <PartnerCarouselLogo partnersList={partnersList} />}

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
