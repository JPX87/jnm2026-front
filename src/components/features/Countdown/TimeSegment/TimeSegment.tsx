import { useEffect, useMemo, useState } from "react";
import './TimeSegment.scss'

interface TimeSegmentProps {
  value: number;
}

export default function TimeSegment({ value }: TimeSegmentProps) {
    const chars = '0123456789'.split('');

    const [currentValue, setCurrentValue] = useState(value);
    const [flip, setFlip] = useState(false);

    useEffect(() => {
        if (currentValue !== value) {
            setFlip(true);
            const timeout = setTimeout(() => {
                setCurrentValue(value);
                setFlip(false);
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [value, currentValue, setCurrentValue, flip]);

    const currentValue1 = chars[currentValue]
    const currentValue_1 = useMemo(() =>{
        //console.log(currentValue, value)
        const _1Value = currentValue-1 === -1 ? value : currentValue-1;
        return flip ? (chars[_1Value]) : chars[currentValue];
    },[value, currentValue, flip])

    return (
    // .time-segment
    <div className="block text-5xl lg:text-6xl xl:text-8xl font-black w-12 md:w-14 lg:w-20 xl:w-24">
      
      {/* .segment-display */}
      <div className="relative h-full font-['Open Sans']">
        
        {/* .segment-display__top */}
        <div className="relative h-[50%] w-full overflow-hidden text-center bg-(--color-seconde-black) text-(--color-primary) rounded-t-lg md:rounded-t-xl leading-[1.5] transition-all">
          <div suppressHydrationWarning className="fixTranslateTop">{currentValue_1}</div>
        </div>


        {/* .segment-display__bottom */}
        <div className="relative bottom-1 h-[50%] w-full overflow-hidden text-center bg-(--color-seconde-black) text-(--color-primary) rounded-b-lg md:rounded-b-xl leading-[0] border-t-2 border-black transition-all">
          <div suppressHydrationWarning className="fixTranslateBottom">{currentValue}</div>
        </div>

        {/* .segment-overlay */}
        {/* [perspective:400px] est une syntaxe JIT Tailwind valide */}
        <div className={`segment-overlay absolute top-0 h-full w-12 md:w-14 lg:w-20 xl:w-24 perspective-[400px] ${flip ? 'flip' : ''}`}>
          
          {/* .segment-overlay__top */}
          <div className={`segment-overlay__top absolute z-10 top-0 h-[50%] w-full overflow-hidden text-center bg-(--color-seconde-black) text-(--color-primary) rounded-t-lg md:rounded-t-xl leading-[1.5] origin-bottom transition-all`}>
            <div suppressHydrationWarning className="fixTranslateTop">{currentValue}</div>
          </div>

          {/* .segment-overlay__bottom */}
          <div className={`segment-overlay__bottom absolute z-10 bottom-1 h-[50%] w-full overflow-hidden text-center bg-(--color-seconde-black) text-(--color-primary) rounded-b-lg md:rounded-b-xl leading-[0] border-t-2 border-black origin-top transition-all`}>
            <div suppressHydrationWarning className="fixTranslateBottom">{currentValue_1}</div>
          </div>
        </div>
      </div>
    </div>
  );
}