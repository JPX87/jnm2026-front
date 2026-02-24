import React from 'react';

interface SliceProps {
    children?: React.ReactNode;
    absolute?: boolean;
    id?: string;
    parentClassName?: string;
    className?: string;
    first?: boolean;
}

export const Slice: React.FC<SliceProps> = ({
    children,
    absolute = false,
    id,
    parentClassName,
    className = "",
    first
}) => {
    return (
        <div className={`relative items-center justify-center ${parentClassName ?? 'h-screen'}`}>
            <div id={id} className={absolute ? `absolute inset-0 m-auto w-full h-max ${first ? "top-12" : ""} ${className}` : `relative w-max h-max ${className}`}>
                {children}
            </div>
        </div>
    );
};