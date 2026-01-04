import { intervalToDuration, Duration } from 'date-fns';

// formatTime.ts
interface TimeUnits {
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isFinished: boolean;
}

/**
 * Calculer le temps restant en un objet d'unités formatées (MM, JJ, HH, MM, SS).
 */
export function calculateTimeRemaining(targetDate: String | Date): TimeUnits {
  const now = new Date();
  let future = new Date();

  // Si le temps est écoulé
  if (typeof targetDate !== "string" && !isDate(targetDate) ) {
    return { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isFinished: false };
  }else if(typeof targetDate === "string" ){
    future = new Date(targetDate);
  }else{
    future = targetDate;
  }

  // Calculer la durée
  const duration: Duration = intervalToDuration({
    start: now,
    end: future
  });

  const isFinished = future < now

  const months = nothingNegative(duration.months);
  const days = nothingNegative(duration.days);
  const hours = nothingNegative(duration.hours);
  const minutes = nothingNegative(duration.minutes);
  const seconds = nothingNegative(duration.seconds);

  return {
    months,
    days,
    hours,
    minutes,
    seconds,
    isFinished
  };
}

const nothingNegative = (value: number | undefined): number => {
  if(typeof value === "undefined") return 0
  const negative = (value < 0)
  return negative ? 0 : value
}

const isDate = (value: unknown): value is Date => {
  return value instanceof Date && !isNaN(value.getTime());
}
