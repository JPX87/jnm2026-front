"use client"

import { useEffect, useMemo, useState } from "react";
//import "./Countdown.css"
import { calculateTimeRemaining } from "@/lib/formatTime";
import TimeSection from "./TimeSection";

interface targetDateProps {
  targetDate: Date;
  className?: String;
}

export default function Countdown({ targetDate, className }: targetDateProps) {
   // Stocke le temps restant en millisecondes
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining(targetDate));

  // Logique de décompte (Met à jour le temps restant à chaque seconde)
  useEffect(() => {
    if (!timeRemaining) return;

    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);


  return (
    <div className={`w-11/12 sm:w-9/12 flex flex-wrap gap-3 md:gap-4 ld:gap-5 xl:gap-7 font-sans md:w-max p-2 sm:p-4 md:p-6 justify-center rounded-3xl bg-(--color-primary) ${className}`}>      
      <TimeSection label="MOIS" value={timeRemaining.months} />
      <TimeSection label="JOURS" value={timeRemaining.days} />
      <TimeSection label="HEURES" value={timeRemaining.hours} />
      <TimeSection label="MINUTES" value={timeRemaining.minutes} />
      <TimeSection label="SECONDES" value={timeRemaining.seconds} />
    </div>
  );
}
