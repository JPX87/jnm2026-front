"use client"

import { useEffect, useRef, useState } from "react";
import { calculateTimeRemaining } from "@/lib/formatTime";
import TimeSection from "./TimeSection";
import confetti from 'canvas-confetti';
import { useRouter } from "next/navigation";

interface CountdownProps {
  targetDate: Date;
  className?: string;
}

export default function Countdown({ targetDate, className }: CountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState<ReturnType<typeof calculateTimeRemaining> | null>(() => calculateTimeRemaining(targetDate));

  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const goToLogin = () => {
    router.push("/login");
  }

  useEffect(() => {
    // Fonction pour forcer la mise à jour manuellement au retour sur la page
    const updateTime = () => {
      setTimeRemaining(calculateTimeRemaining(targetDate));
    };

    const interval = setInterval(() => {
      updateTime();
    }, 1000);

    let delayTimeout: NodeJS.Timeout | null = null;
    let finishTimeout: NodeJS.Timeout | null = null;

    // If the target date has passed, confetti and await 2 seconds before animation ends
    if (calculateTimeRemaining(targetDate).isFinished && !isFinished) {
      let tirsRestants = 3;

      const defaults = {
        particleCount: 400,
        spread: 80,
        gravity: 0.8,
        ticks: 500,
        colors: ['#EF6A9F', '#FFF8F3', '#ff89b8', '#231f20'] // Couleurs personnalisées
      };

      // Attente de 3 secondes avant de commencer
      delayTimeout = setTimeout(() => {
        const firer = () => {
          if (tirsRestants > 0) {
            confetti({
              ...defaults,
              origin: { y: 0.6, x: tirsRestants % 2 === 0 ? 0.4 : 0.6 }
            });

            tirsRestants--;

            if (tirsRestants === 0 && intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;

              finishTimeout = setTimeout(() => setIsFinished(true), 1000);
            }
          }
        };

        // Premier tir
        firer();

        // Les 2 autres tirs espacés de 750ms
        if (tirsRestants > 0) {
          intervalRef.current = setInterval(firer, 750);
        }
      }, 2000);
    }

    // Gérer le retour sur la page (navigateur Back/Forward cache ou retour sur l'onglet)
    const handleVisibilityOrPageShow = (e: PageTransitionEvent | Event) => {
      if (document.visibilityState === 'visible' || (e as PageTransitionEvent).persisted) {
        updateTime();
      }
    };

    window.addEventListener('pageshow', handleVisibilityOrPageShow);
    document.addEventListener('visibilitychange', handleVisibilityOrPageShow);

    // Clean-up complet quand le composant est démonté (changement de page)
    return () => {
      clearInterval(interval);
      if (delayTimeout) clearTimeout(delayTimeout);
      if (finishTimeout) clearTimeout(finishTimeout);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      window.removeEventListener('pageshow', handleVisibilityOrPageShow);
      document.removeEventListener('visibilitychange', handleVisibilityOrPageShow);
    };
  }, [targetDate, isFinished]);

  if (!timeRemaining) return null;

  return (
    <div className="flex flex-col items-center">
      <div className={`relative z-10 w-11/12 flex flex-wrap gap-2 sm:gap-3 md:gap-4 ld:gap-5 xl:gap-7 font-sans w-max py-3 px-2 sm:p-4 md:p-6 justify-center rounded-xl xs:rounded-2xl md:rounded-3xl bg-(--color-primary) ${className}`}>
        <TimeSection label="MOIS" value={timeRemaining.months} maxDigits={2} />
        <TimeSection label="JOURS" value={timeRemaining.days} maxDigits={2} />
        <TimeSection label="HEURES" value={timeRemaining.hours} maxDigits={2} />
        <TimeSection label="MINUTES" value={timeRemaining.minutes} maxDigits={2} />
        <TimeSection label="SECONDES" value={timeRemaining.seconds} maxDigits={2} />
      </div>
      <button
        className={`absolute z-9 ${isFinished ? '-bottom-15 md:-bottom-22 opacity-100' : 'bottom-0 opacity-0'} bg-[#ff89b8] text-white text-3xl md:text-5xl font-bold py-4 px-6 border-2 border-white rounded-lg cursor-pointer hover:scale-105 transition-all`}
        onClick={goToLogin}
        disabled={!isFinished}>
        J'embarque !
      </button>
    </div>
  );
}