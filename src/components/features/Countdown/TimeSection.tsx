import { useEffect, useRef, useState } from 'react';
import FlipDigit from "./FlipDigit";

interface TimeSectionProps {
  label: string;
  value: number;
  maxDigits?: number;
}

export default function TimeSection({ label, value, maxDigits = 2 }: TimeSectionProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isInitializing, setIsInitializing] = useState(true);

  const hasStartedAnimating = useRef(false);

  // Animation de démarrage : compter de MAX jusqu'à la vraie valeur avec requestAnimationFrame
  useEffect(() => {
    if (!isInitializing) return;
    if (hasStartedAnimating.current) return;
    hasStartedAnimating.current = true;

    const maxValue = Math.pow(10, maxDigits) - 1;
    const startValue = maxValue;
    let endValue = value;
    if (label === "SECONDES") {
      endValue = value === 0 ? 59 : value - 1;
    }
    const duration = 1800; // 1.8 seconde d'animation
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentValue = Math.floor(startValue - (startValue - endValue) * progress);

      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
        setIsInitializing(false);
      }
    };

    requestAnimationFrame(animate);
  }, [isInitializing, value, maxDigits, displayValue, label]);

  // Mettre à jour displayValue quand l'initialisation est terminée et que value change
  useEffect(() => {
    if (isInitializing) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDisplayValue(value);
  }, [value, isInitializing]);

  const digits = displayValue.toString().padStart(maxDigits, '0').split('').map(Number);

  return (
    <div className="text-center flex-[0_1_max-content]">
      <p className="text-start mb-1 md:mb-2 xl:mb-3 text-(--color-secondary) text-xs 2xs:text-md xs:text-lg md:text-2xl lg:text-3xl xl:text-4xl tracking-wide font-['Oswald'] font-bold">
        {label}
      </p>
      <div className="flex gap-0.5 md:gap-1 xl:gap-2.5 justify-center">
        {digits.map((digit, index) => (
          <FlipDigit key={index} value={digit} skipFlip={isInitializing} />
        ))}
      </div>
    </div>
  );
}
