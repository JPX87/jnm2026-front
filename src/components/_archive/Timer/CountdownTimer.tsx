"use client"

import { useEffect, useState } from "react";

// Assurez-vous d'importer le micro-composant
import TimeUnitDisplay from "./TimeUnitDisplay"; 
// Assurez-vous d'importer la fonction utilitaire
import { calculateTimeRemaining } from "@/lib/formatTime"; 

interface CountdownProps {
  targetDate: string; // Ex: "2026-10-25T14:30:00"
}

export default function CountdownTimer({ targetDate }: CountdownProps) {
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
    <div className="flex flex-col items-center p-3 md:p-4 text-black">
      <h2 className="text-s md:text-xl font-bold mb-2 md:mb-4 text-center">🚀 JNM 2026 : Le lancement approche !</h2>
      
      {/* Conteneur Flex pour afficher les unités côte à côte */}
      <div className="flex justify-center items-start space-x-8">
        <TimeUnitDisplay label="Mois" value={timeRemaining.months} />
        <TimeUnitDisplay label="Jours" value={timeRemaining.days} />
        <TimeUnitDisplay label="Heures" value={timeRemaining.hours} />
        <TimeUnitDisplay label="Mins" value={timeRemaining.minutes} />
        <TimeUnitDisplay label="Secs" value={timeRemaining.seconds} />
      </div>
      
      {/* Message de fin */}
      {timeRemaining.isFinished && (
        <p className="mt-4 text-lg md:text-xl font-semibold text-green-700 p-2 bg-green-100 rounded-lg">
          🎉 Temps écoulé !
        </p>
      )}
    </div>
  );
}   