// components/FlipCountdown.tsx
'use client';

import React, { useEffect, useState } from 'react';
import FlipUnit from './FlipUnit';

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

interface FlipCountdownProps {
  targetDate: string; // Format ISO ou date string
}

const FlipCountdown: React.FC<FlipCountdownProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      
      if (difference > 0) {
        return {
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return { hours: 0, minutes: 0, seconds: 0 };
    };

    // Initialisation immédiate pour éviter le flash "00:00:00"
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-8 p-8 bg-black min-h-[300px] items-center rounded-3xl">
      <FlipUnit value={timeLeft.hours} label="Heures" />
      <FlipUnit value={timeLeft.minutes} label="Minutes" />
      <FlipUnit value={timeLeft.seconds} label="Secondes" />
    </div>
  );
};

export default FlipCountdown;