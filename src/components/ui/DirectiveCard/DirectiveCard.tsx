import { ReactNode } from "react";

interface DirectiveCardProps {
    children?: ReactNode;
    className?: string;
    content?: string | ReactNode;
}

const stripesBg = `[background:repeating-linear-gradient(90deg,_var(--color-tertiary),_var(--color-tertiary)_2px,_transparent_2px,_transparent_6px),_linear-gradient(to_bottom,_#1a1a1a,_#0a0a0a)] 
                    dark:[background:repeating-linear-gradient(90deg,_white_0px,_white_2px,_transparent_2px,_transparent_6px),_linear-gradient(to_bottom,_#1a1a1a,_#0a0a0a)] 
                    ![background-size:8px_100%,_100%_100%] ![background-position:0_0,_0_0]`

export default function DirectiveCard({
    children,
    className = "",
    content
}: DirectiveCardProps) {
    return (
        <div className={`flex flex-col items-center m-auto w-24 sm:w-28 md:w-32 lg:w-40 ${className}`}>
            <div className="border-2 border-(--color-tertiary) dark:border-white w-full">
                {/* Top stripe */}
                <div className={`h-3 md:h-4 border-2 border-(--color-tertiary) dark:border-white ${stripesBg}`} />

                {/* Content */}
                <div className="text-center bg-(--color-seconde-black) text-(--color-tertiary) dark:text-white p-2 xl:p-4 h-16 sm:h-20 md:h-24 flex flex-col items-center justify-center">
                    {typeof content === 'string' ? (
                        <p className="text-xs sm:text-base md:text-lg xl:text-xl leading-tight">
                            {content}
                        </p>
                    ) : (
                        content
                    )}
                    {children && <div className="mt-1">{children}</div>}
                </div>

                {/* Bottom stripe */}
                <div className={`h-3 md:h-4 border-2 border-(--color-tertiary) dark:border-white ${stripesBg}`} />
            </div>
        </div>
    );
}
