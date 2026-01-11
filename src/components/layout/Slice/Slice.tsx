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
        <div className={`relative ${first ? 'min-h-screen pt-20 md:pt-0' : 'h-auto md:h-screen py-4 md:py-0'} ${first ? 'flex md:items-center items-start' : 'flex items-center'} justify-center`}>
            <div className={absolute ? `${first ? 'md:absolute' : 'absolute'} inset-0 ${first ? 'my-0 md:my-auto' : 'my-auto'} mx-auto w-full h-max ${first ? "md:top-12" : ""}` : "relative w-max h-max"}>
                {children}
            </div>
        </div>
    );
};