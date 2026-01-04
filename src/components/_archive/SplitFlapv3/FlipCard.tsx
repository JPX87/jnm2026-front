// components/FlipCard.tsx
'use client';

import React, { useEffect, useState, useRef } from 'react';

interface FlipCardProps {
  digit: string | number;
  label?: string;
}

const FlipCard: React.FC<FlipCardProps> = ({ digit, label }) => {
  // On garde une trace de la valeur précédente et actuelle pour l'animation
  const [currentDigit, setCurrentDigit] = useState(digit);
  const [previousDigit, setPreviousDigit] = useState(digit);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (digit !== currentDigit) {
      setPreviousDigit(currentDigit);
      setCurrentDigit(digit);
      setIsFlipping(true);

      // Reset de l'animation après la fin (doit correspondre à la durée CSS)
      const timer = setTimeout(() => {
        setIsFlipping(false);
        setPreviousDigit(digit); // Synchronisation finale
      }, 600); 

      return () => clearTimeout(timer);
    }
  }, [digit, currentDigit]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-20 h-24 md:w-28 md:h-36 text-5xl md:text-7xl font-mono font-bold rounded-lg shadow-xl perspective-1000">
        
        {/* --- UPPER CARD (BACK) : Next Value --- */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-[#1e1e1e] text-[#e0e0e0] rounded-t-lg overflow-hidden border-b border-black/20 z-0 flex justify-center items-end">
          <span className="translate-y-1/2">{currentDigit}</span>
        </div>

        {/* --- LOWER CARD (BACK) : Previous Value --- */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[#1e1e1e] text-[#e0e0e0] rounded-b-lg overflow-hidden border-t border-black/20 z-0 flex justify-center items-start">
          <span className="-translate-y-1/2">{previousDigit}</span>
        </div>

        {/* --- FLIPPING CARD (ANIMATED) --- */}
        <div 
          className={`absolute top-0 left-0 w-full h-full transform-style-3d z-10 ${isFlipping ? 'animate-flip' : ''}`}
          style={{ transformOrigin: 'center' }} // Rotation au centre (la "charnière")
        >
          {/* FRONT OF FLIP: Upper Half of Previous Value */}
          <div className="absolute top-0 left-0 w-full h-1/2 bg-[#2d2d2d] text-[#f0f0f0] rounded-t-lg overflow-hidden backface-hidden border-b border-black/20 flex justify-center items-end">
            <span className="translate-y-1/2">{previousDigit}</span>
          </div>

          {/* BACK OF FLIP: Lower Half of Next Value */}
          <div className="absolute top-0 left-0 w-full h-1/2 bg-[#2d2d2d] text-[#f0f0f0] rounded-t-lg overflow-hidden backface-hidden rotate-x-180 flex justify-center items-end" 
               style={{ marginTop: '50%' /* Décalage pour simuler la partie basse lors de la rotation */ }}>
             {/* Astuce CSS: On affiche la partie basse en inversant la partie haute rotatée */}
             <span className="translate-y-[-50%] rotate-180 transform scale-x-[-1] block" style={{ transform: 'rotateX(180deg)' }}>
               {currentDigit}
             </span> 
          </div>
        </div>
        
        {/* Ligne de séparation esthétique au milieu */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-black/40 z-20 -translate-y-1/2 shadow-sm"></div>
      </div>

      {label && (
        <span className="text-xs md:text-sm uppercase font-semibold text-gray-500 tracking-widest">
          {label}
        </span>
      )}
    </div>
  );
};

// On utilise memo pour éviter les re-renders si le digit ne change pas (ex: les heures quand les secondes bougent)
export default React.memo(FlipCard);