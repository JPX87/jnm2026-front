import React, { useState, useEffect } from 'react';
import './SplitFlapCharacter.scss'; // Nous créerons ce fichier CSS

interface SplitFlapCharacterProps {
  current: string; // Le caractère actuel
  next: string;    // Le caractère cible (après rotation)
}

const SplitFlapCharacter: React.FC<SplitFlapCharacterProps> = ({ current, next }) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [displayChar, setDisplayChar] = useState(current);

  useEffect(() => {
    // Déclencher l'animation uniquement si le caractère change
    if (current !== next) {
      setIsFlipping(true);
      // Mettre à jour le caractère affiché après que l'animation est terminée (e.g., 500ms)
      const timeout = setTimeout(() => {
        setDisplayChar(next);
        setIsFlipping(false);
      }, 400); // Doit correspondre à la durée de l'animation CSS

      return () => clearTimeout(timeout);
    } else if (displayChar !== current) {
      // Pour les initialisations, s'assurer que le caractère est correct
      setDisplayChar(current);
    }
  }, [current, next, displayChar]);

  return (
    <div className="split-flap-char-container">
      <div className="char-static">{displayChar}</div>
      {isFlipping && (
        <div className="char-flipper">
          {/* La palette supérieure (celle qui tourne) */}
          <div className="top-half char-part">
            {current}
          </div>
          {/* La partie fixe inférieure du caractère de départ */}
          <div className="bottom-half char-part">
            {current}
          </div>
          {/* La partie supérieure fixe du caractère d'arrivée */}
          <div className="next-half char-part">
            {next}
          </div>
        </div>
      )}
    </div>
  );
};

export default SplitFlapCharacter;