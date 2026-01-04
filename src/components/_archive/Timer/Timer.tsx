import { useEffect, useState } from "react";

// Définit les props pour le composant, nécessitant une chaîne de caractères pour la date cible
interface CountdownProps {
  targetDate: string; // Ex: "2026-10-25T14:30:00"
}

export default function CountdownTimerOLD({ targetDate }: CountdownProps) {
  // Calcule le temps restant initial en millisecondes
  const calculateTimeRemaining = () => {
    const now = new Date().getTime();
    const target = new Date(targetDate).getTime();
    const timeRemaining = target - now;
    // S'assure que le temps restant n'est jamais négatif
    return Math.max(0, timeRemaining);
  };

  // Stocke le temps restant en millisecondes
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());

  // Logique de décompte (inchangée, elle met à jour les millisecondes)
  useEffect(() => {
    if (timeRemaining <= 0) return;

    const interval = setInterval(() => {
      // Recalcule la différence de temps à chaque seconde
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  /**
   * Convertit le temps restant en millisecondes en Mois, Jours, Heures, Minutes et Secondes.
   * Cette conversion est plus complexe car les mois n'ont pas un nombre fixe de jours.
   * Pour une précision simple, nous allons estimer un mois comme 30.44 jours (moyenne).
   * Pour un calcul plus précis, il faudrait manipuler directement les objets Date.
   */
  const formatTimeWithMonths = (ms: number) => {
    // Si le temps est écoulé
    if (ms <= 0) {
      return "00 : 00 : 00 : 00 : 00"; // Mois:Jours:Heures:Minutes:Secondes
    }

    const MS_PER_SECOND = 1000;
    const MS_PER_MINUTE = MS_PER_SECOND * 60;
    const MS_PER_HOUR = MS_PER_MINUTE * 60;
    const MS_PER_DAY = MS_PER_HOUR * 24;
    // Approximation: 365.25 jours / 12 mois = 30.4375 jours par mois
    const MS_PER_MONTH = MS_PER_DAY * 30.44; 

    // --- Calcul des composantes ---
    
    // 1. Mois
    const months = Math.floor(ms / MS_PER_MONTH);
    const msRemainderAfterMonths = ms % MS_PER_MONTH;

    // 2. Jours (à partir du reste après les mois)
    const days = Math.floor(msRemainderAfterMonths / MS_PER_DAY);
    const msRemainderAfterDays = msRemainderAfterMonths % MS_PER_DAY;

    // 3. Heures
    const hours = Math.floor(msRemainderAfterDays / MS_PER_HOUR);
    const msRemainderAfterHours = msRemainderAfterDays % MS_PER_HOUR;

    // 4. Minutes
    const minutes = Math.floor(msRemainderAfterHours / MS_PER_MINUTE);
    const msRemainderAfterMinutes = msRemainderAfterHours % MS_PER_MINUTE;

    // 5. Secondes
    const seconds = Math.floor(msRemainderAfterMinutes / MS_PER_SECOND);

    // --- Formatage ---
    const formattedMonths = months.toString().padStart(2, "0");
    const formattedDays = days.toString().padStart(2, "0");
    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");

    // Format final : MM:JJ:HH:MM:SS
    return `${formattedMonths} : ${formattedDays} : ${formattedHours} : ${formattedMinutes} : ${formattedSeconds}`;
  };

  const isFinished = timeRemaining <= 0;

  return (
    <div className="flex flex-col items-center p-4 bg-JNM-secondary">
      {/*<h2 className="text-xl font-bold mb-2">🚀 Compte à Rebours Détaillé</h2>*/}
      <div className="flex flex-row space-x-2 text-sm font-semibold m-3 bg-JNM-primary">
        <span>Mois</span>
        <span>Jours</span>
        <span>Heures</span>
        <span>Mins</span>
        <span>Secs</span>
      </div>
      <div className="text-4xl  m-3 font-mono text-JNM-primary">
        {formatTimeWithMonths(timeRemaining)}
      </div>
      {/* Affiche un message lorsque le compte à rebours est terminé */}
      {isFinished && (
        <p className="mt-2 text-lg font-semibold text-green-700">
          🎉 Temps écoulé !
        </p>
      )}
    </div>
  );
}