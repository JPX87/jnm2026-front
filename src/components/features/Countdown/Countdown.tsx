"use client"

import { useEffect, useState } from "react";
import { calculateTimeRemaining } from "@/lib/formatTime";
import TimeSection from "./TimeSection";

interface CountdownProps {
  targetDate: Date;
  className?: string;
}

const defaultTime = {
  months: 0,
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  isFinished: false,
};

export default function Countdown({ targetDate, className }: CountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState<ReturnType<typeof calculateTimeRemaining> | null>(defaultTime);

  useEffect(() => {
    setTimeRemaining(calculateTimeRemaining(targetDate));

    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (!timeRemaining) return null;

  return (
    <div className={`w-11/12 sm:w-9/12 flex flex-wrap gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-7 font-sans md:w-max p-2 sm:p-4 md:p-6 justify-center rounded-3xl bg-(--color-primary) ${className}`}>
      <TimeSection label="MOIS" value={timeRemaining.months} />
      <TimeSection label="JOURS" value={timeRemaining.days} />
      <TimeSection label="HEURES" value={timeRemaining.hours} />
      <TimeSection label="MINUTES" value={timeRemaining.minutes} />
      <TimeSection label="SECONDES" value={timeRemaining.seconds} />
    </div>
  );
}