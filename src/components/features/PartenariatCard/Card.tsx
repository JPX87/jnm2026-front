interface PropsCard {
    top: React.ReactNode,
    topClassName?: string,
    middle: React.ReactNode,
    middleClassName?: string,
    middleStyle?: React.CSSProperties,
    end: React.ReactNode
    endClassName?: string
}

export function Card({ top, middle, end, topClassName, middleClassName, middleStyle, endClassName }: PropsCard) {

    return (
        <div className="bg-[#ffd5df] text-[#ef6a9f] p-0 truncate rounded-lg w-[314px] h-[200px] font-['Oswald'] text-[10px] -select-none">
            <section className={`h-2/11 ${topClassName}`}>
                {top}
            </section>
            <section className={`h-6/11 mt-[6px] mb-[12px] ${middleClassName}`} style={middleStyle}>
                {middle}
            </section>
            <section className={`h-2/11 ${endClassName}`}>
                {end}
            </section>
        </div>
    );
}