import { ReactNode } from "react";

interface SectionProps {
    children: ReactNode;
    title?: string;
    className?: string;
    contentClassName?: string;
    titleClassName?: string;
    variant?: 'primary' | 'secondary' | 'tertiary';
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export default function Section({
    children,
    title,
    className = "",
    contentClassName = "",
    titleClassName = "",
    variant = 'tertiary',
    maxWidth = 'lg'
}: SectionProps) {
    const getBackgroundClass = () => {
        switch (variant) {
            case 'primary':
                return 'bg-(--color-primary) text-(--color-secondary) dark:text-(--color-seconde-black)';
            case 'secondary':
                return 'bg-(--color-secondary) text-(--color-primary)';
            case 'tertiary':
                return 'bg-(--color-tertiary) text-(--color-secondary) dark:text-(--color-seconde-black)';
            default:
                return 'bg-(--color-tertiary) text-(--color-secondary) dark:text-(--color-seconde-black)';
        }
    };

    const getMaxWidthClass = () => {
        switch (maxWidth) {
            case 'sm':
                return 'max-w-3xl';
            case 'md':
                return 'max-w-5xl';
            case 'lg':
                return 'max-w-6xl';
            case 'xl':
                return 'max-w-7xl';
            case 'full':
                return 'max-w-full';
            default:
                return 'max-w-5xl';
        }
    };

    return (
        <div className={`w-full ${className}`}>
            <div className={`relative w-10/12 md:w-11/12 ${getMaxWidthClass()} flex flex-col gap-6 py-8 md:py-10 px-8 md:px-12 rounded-3xl m-auto ${getBackgroundClass()} ${contentClassName}`}>
                {title && (
                    <h2 className={`text-center text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${titleClassName}`}>
                        {title}
                    </h2>
                )}
                {children}
            </div>
        </div>
    );
}
