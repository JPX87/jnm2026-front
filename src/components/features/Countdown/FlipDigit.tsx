import { useEffect, useState } from 'react';
import './FlipDigit.css';

interface FlipDigitProps {
  value: number;
  skipFlip?: boolean;
}

export default function FlipDigit({ value, skipFlip = false }: FlipDigitProps) {
  const [state, setState] = useState({ current: value, next: value });
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (skipFlip) {
      // Pendant l'initialisation, juste mettre à jour sans flip
      setState({ current: value, next: value });
      return;
    }

    if (!flipping && state.current !== value) {
      setState(prev => ({ ...prev, next: value }));
      setFlipping(true);
    }
  }, [value, flipping, skipFlip]);

  // Cleanup : réinitialiser l'état si le composant est démonté pendant un flip
  useEffect(() => {
    return () => {
      if (flipping) {
        setState({ current: value, next: value });
        setFlipping(false);
      }
    };
  }, [flipping, value]);

  return (
    <div
      className="flip-digit-container relative font-black text-(--color-primary) bg-(--color-seconde-black) rounded-md xs:rounded-lg md:rounded-xl"
    >
      {/* Moitié supérieure statique - affiche NEXT avec flex-end */}
      <div className="flip-digit-text flip-digit-text-top">
        {state.next}
      </div>

      {/* Moitié inférieure statique - affiche CURRENT avec flex-start */}
      <div className="flip-digit-text flip-digit-text-bottom bg-(--color-seconde-black)">
        {state.current}
      </div>

      {/* Conteneur du flip 3D - moitié supérieure uniquement */}
      <div
        className={`flip-digit-overlay bg-(--color-seconde-black) ${flipping ? 'flipping' : ''}`}
        onTransitionEnd={() => {
          if (flipping) {
            setState({ current: value, next: value });
            setFlipping(false);
          }
        }}
      >
        {/* Face avant - affiche CURRENT avec flex-end */}
        <div
          className="flip-digit-face flip-digit-face-front bg-(--color-seconde-black)"
        >
          {state.current}
        </div>

        {/* Face arrière - affiche NEXT avec flex-start + rotateX(-180deg) */}
        <div
          className="flip-digit-face flip-digit-face-back bg-(--color-seconde-black)"
        >
          {state.next}
        </div>
      </div>
    </div>
  );
}