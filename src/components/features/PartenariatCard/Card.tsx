interface PropsCard {
    top?: React.ReactNode,
    topClassName?: string,
    topStyle?: React.CSSProperties,
    middle?: React.ReactNode,
    middleClassName?: string,
    middleStyle?: React.CSSProperties,
    end?: React.ReactNode,
    endClassName?: string,
    endStyle?: React.CSSProperties
}

export function Card({ top, middle, end, topClassName, topStyle, middleClassName, middleStyle, endClassName, endStyle }: PropsCard) {

    return (
        <div className="bg-[#ffd5df] text-[#ef6a9f] p-0 truncate rounded-lg w-[314px] h-[200px] font-['Oswald'] text-[10px] -select-none">
            {top && (
                <section className={`h-2/11 ${topClassName}`} style={topStyle}>
                    {top}
                </section>
            )}
            {middle && (
                <section className={`h-6/11 mt-[6px] mb-[12px] ${middleClassName}`} style={middleStyle}>
                    {middle}
                </section>
            )}
            {end && (
                <section className={`h-2/11 ${endClassName}`} style={endStyle}>
                    {end}
                </section>
            )}
        </div>
    );
}