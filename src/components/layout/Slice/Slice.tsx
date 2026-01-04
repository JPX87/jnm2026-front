import React from 'react';

interface SliceProps {
    children?: React.ReactNode;
    absolute?: boolean;
    first?: boolean;
}

export const Slice: React.FC<SliceProps> = ({ 
    children,
    absolute = false,
    first
}) => {
    return (
        <div className="relative h-screen items-center justify-center">
            <div className={absolute ? `absolute inset-0 m-auto w-full h-max ${first ? "top-12" : ""}` : "relative w-max h-max"}>
                {children}
            </div>
        </div>
    );
};