"use client"

import { useEffect, useState } from "react";
import { calculateTimeRemaining } from "@/lib/formatTime";
import TimeSection from "./TimeSection";

interface CountdownProps {
  targetDate: Date;
  className?: string;
}

export default function Countdown({ targetDate, className }: CountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState<ReturnType<typeof calculateTimeRemaining> | null>(() => calculateTimeRemaining(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (!timeRemaining) return null;

  return (
    <div className={`relative z-10 w-11/12 flex flex-wrap gap-2 sm:gap-3 md:gap-4 ld:gap-5 xl:gap-7 font-sans w-max py-3 px-2 sm:p-4 md:p-6 justify-center rounded-xl xs:rounded-2xl md:rounded-3xl bg-(--color-primary) ${className}`}>
      <TimeSection label="MOIS" value={timeRemaining.months} maxDigits={2} />
      <TimeSection label="JOURS" value={timeRemaining.days} maxDigits={2} />
      <TimeSection label="HEURES" value={timeRemaining.hours} maxDigits={2} />
      <TimeSection label="MINUTES" value={timeRemaining.minutes} maxDigits={2} />
      <TimeSection label="SECONDES" value={timeRemaining.seconds} maxDigits={2} />
    </div>
  );
}