import React, { useMemo } from 'react';
import SplitFlapCharacter from './SplitFlapCharacter';

interface SplitFlapRowProps {
  value: string;         // La nouvelle valeur à afficher
  previousValue: string; // L'ancienne valeur pour l'animation
  maxLength: number;     // Longueur maximale pour le padding
}

const SplitFlapRow: React.FC<SplitFlapRowProps> = ({ value, previousValue, maxLength }) => {
  // Fonction pour padder la chaîne à la longueur maximale avec des espaces
  const padString = (str: string): string => {
    if (str.length >= maxLength) {
      return str.slice(0, maxLength);
    }
    return str.padEnd(maxLength, ' ');
  };

  const paddedValue = useMemo(() => padString(value), [value, maxLength]);
  const paddedPreviousValue = useMemo(() => padString(previousValue), [previousValue, maxLength]);

  // Créer un tableau de caractères pour itérer
  const characters = useMemo(() => {
    return Array.from({ length: maxLength }, (_, index) => {
      const current = paddedPreviousValue[index] || ' ';
      const next = paddedValue[index] || ' ';
      
      // On utilise le "next" comme "current" si c'est la première fois qu'on l'affiche
      return { current: current, next: next };
    });
  }, [paddedValue, paddedPreviousValue, maxLength]);

  return (
    <div style={{ display: 'flex', marginBottom: '5px' }}>
      {characters.map((charData, index) => (
        <SplitFlapCharacter
          key={index}
          current={charData.current}
          next={charData.next}
        />
      ))}
    </div>
  );
};

export default SplitFlapRow;