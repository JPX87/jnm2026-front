interface messageBubbleProps {
    classNameP: string;
    className: string;
    rounded?: boolean;
}

export default function MessageBubble({ classNameP, className, rounded }: messageBubbleProps) {
    return (
        <div className={`${classNameP}`}>
            <div className={`relative w-[100px] md:w-[170px] h-[60px] md:h-[100px] max-w-sm p-6 ${rounded ? "rounded-4xl" : "rounded-lg"} shadow-xl ${className}`}>
                <div className={`absolute left-9 bottom-[-18px] md:bottom-[-29.899px]  w-6 md:w-10 h-8 md:h-14
                            transform rotate-54 md:rotate-55
                            bg-(--color-tertiary)
                            border-r-4 border-b-4 border-(--color-primary) 
                            z-20 rounded-xs`}>
                </div>
            </div>
        </div>
    )
}