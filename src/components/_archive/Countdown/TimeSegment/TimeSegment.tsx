import { useEffect, useMemo, useState, useRef } from "react";
import './TimeSegment.scss'

interface TimeSegmentProps {
  value: number;
  max?: number;
}

export default function TimeSegment({ value, max=9 }: TimeSegmentProps) {
  const chars = '0123456789'.split('');
  
  const [currentValue, setCurrentValue] = useState(0);
  const [flip, setFlip] = useState(false);
  const finalFlip = useRef<boolean>(false);
  const animationRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstMount = useRef(true);
  const [isFirstFlip, setIsFirstFlip] = useState(true);
  
  useEffect(() => {
    if (isFirstMount.current) {
      setCurrentValue(0);
      timeoutRef.current = setTimeout(() => {
        isFirstMount.current = false;
        setCurrentValue(max);
      }, 150);
      return;
    }

    if (currentValue === value) {
      setFlip(false);
      setIsFirstFlip(false);
      finalFlip.current = false;
      setCurrentValue(value);
      return;
    } 
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    if (currentValue !== value) {
      setFlip(true);
      finalFlip.current = true;
      const speed = isFirstFlip ? 300 : 500; 

      const animate = () => {
        timeoutRef.current = setTimeout(() => {
          setCurrentValue((prev) => (prev - 1) < 0 ? max : prev - 1);
          setFlip(false);

          timeoutRef.current = setTimeout(() => {
            finalFlip.current = false;
            animationRef.current = requestAnimationFrame(animate);
          }, 50);
        }, speed);

      };
      animate();
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [value, currentValue, setCurrentValue, isFirstFlip, setIsFirstFlip, setFlip]);
 
  const currentValue1 = chars[currentValue]
  const currentValue_1 = useMemo(() =>{
    const _1Value = currentValue-1 === -1 ? max : currentValue-1;
    
    if(flip && !finalFlip.current){
      return (chars[currentValue])
    }

    if(flip && finalFlip.current){
      return (chars[_1Value])
    }

    return chars[currentValue];
  },[currentValue, flip, finalFlip]);

  return (
    // .time-segment
    <div className="block text-3xl sm:text-5xl lg:text-6xl xl:text-8xl font-black w-6 2xs:w-8 xs:w-10 sm:w-12 md:w-14 lg:w-20 xl:w-24">
      
      {/* .segment-display */}
      <div className="relative h-full font-['Open Sans']">
        
        {/* .segment-display__top */}
        <div className="relative h-[50%] w-full overflow-hidden text-center bg-(--color-seconde-black) text-(--color-primary) rounded-t-md xs:rounded-t-lg md:rounded-t-xl leading-[1.5] transition-all">
          <div className="fixTranslateTop">{currentValue_1}</div>
        </div>


        {/* .segment-display__bottom */}
        <div className="relative bottom-1 h-[50%] w-full overflow-hidden text-center bg-(--color-seconde-black) text-(--color-primary) rounded-b-md xs:rounded-b-lg md:rounded-b-xl leading-[0] border-t-1 xs:border-t-2 border-black transition-all">
          <div className="fixTranslateBottom">{currentValue1}</div>
        </div>

        {/* .segment-overlay */}
        <div 
            className={`segment-overlay absolute top-0 h-full w-6 2xs:w-8 xs:w-10 sm:w-12 md:w-14 lg:w-20 xl:w-24 perspective-[400px] ${flip ? 'flip' : ''} ${isFirstFlip ? 'first-flip' : ''}`}
        >
          
          {/* .segment-overlay__top */}
          <div 
            className={`segment-overlay__top absolute z-10 top-0 h-[50%] w-full overflow-hidden text-center bg-(--color-seconde-black) text-(--color-primary) rounded-t-md xs:rounded-t-lg md:rounded-t-xl leading-[1.5] origin-bottom transition-all`}
          >
            <div className="fixTranslateTop">{flip ? currentValue1 : currentValue_1}</div>
          </div>

          {/* .segment-overlay__bottom */}
          <div 
            className={`segment-overlay__bottom absolute z-10 bottom-1 h-[50%] w-full overflow-hidden text-center bg-(--color-seconde-black) text-(--color-primary) rounded-b-md xs:rounded-b-lg md:rounded-b-xl leading-[0] border-t-1 xs:border-t-2 border-black origin-top transition-all`}
          >
            <div className="fixTranslateBottom">{currentValue_1}</div>
          </div>
        </div>
      </div>
    </div>
  );
}