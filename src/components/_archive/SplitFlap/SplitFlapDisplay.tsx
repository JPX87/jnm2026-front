import React, { useState, useEffect, useCallback } from 'react';
import SplitFlapRow from './SplitFlapRow';

// Définition de type pour une ligne de train
interface TrainLine {
  id: number;
  time: string;
  destination: string;
  track: string;
  delay: string;
}

const initialLines: TrainLine[] = [
  { id: 1, time: '14:05', destination: 'PARIS GARE LYON', track: '05', delay: 'A L HEURE' },
  { id: 2, time: '14:30', destination: 'BORDEAUX ST JEAN', track: '12', delay: 'EN RETARD' },
  { id: 3, time: '15:00', destination: 'MARSEILLE ST CH.', track: '08', delay: 'A L HEURE' },
];

// Longueurs maximales pour les colonnes
const MAX_TIME = 5;
const MAX_DEST = 20;
const MAX_TRACK = 2;
const MAX_DELAY = 10;
const ROW_MAX_LENGTH = MAX_TIME + 2 + MAX_DEST + 2 + MAX_TRACK + 2 + MAX_DELAY; // +2 pour les séparateurs

const SplitFlapDisplay: React.FC = () => {
  const [currentLines, setCurrentLines] = useState<TrainLine[]>(initialLines);
  const [previousLines, setPreviousLines] = useState<TrainLine[]>(initialLines);

  // Fonction pour formater une ligne complète
  const formatLine = (line: TrainLine): string => {
    return `${line.time.padEnd(MAX_TIME)}  ${line.destination.padEnd(MAX_DEST)}  ${line.track.padEnd(MAX_TRACK)}  ${line.delay.padEnd(MAX_DELAY)}`;
  };

  // Système automatique de mise à jour/ajout
  const updateBoard = useCallback(() => {
    setPreviousLines(currentLines); // La liste actuelle devient l'ancienne
    
    // Logique de mise à jour / rotation / ajout
    const newLines = [...currentLines];

    // 1. Ajouter une nouvelle ligne toutes les 10 secondes
    if (newLines.length < 5) {
        const nextId = newLines.length > 0 ? Math.max(...newLines.map(l => l.id)) + 1 : 1;
        newLines.push({
            id: nextId,
            time: `15:${nextId.toString().padStart(2, '0')}`,
            destination: `LYON PART DIEU ${nextId}`,
            track: nextId % 2 === 0 ? '01' : '03',
            delay: 'NOUVEAU',
        });
    }

    // 2. Simuler un changement de statut (e.g., retard)
    const lineToUpdate = newLines.find(line => line.id === 2);
    if (lineToUpdate) {
        lineToUpdate.delay = lineToUpdate.delay === 'EN RETARD' ? 'ANNULE' : 'EN RETARD';
    }

    setCurrentLines(newLines);

  }, [currentLines]);

  useEffect(() => {
    // Déclencheur automatique toutes les 5 secondes
    const interval = setInterval(updateBoard, 5000); 
    return () => clearInterval(interval);
  }, [updateBoard]);


  return (
    <div style={{ backgroundColor: '#222', padding: '20px', display: 'inline-block', border: '5px solid #000' }}>
      <div style={{ color: 'yellow', fontSize: '20px', marginBottom: '10px' }}>
        TGD - DÉPARTS - TRAINS
      </div>
      {currentLines.map(line => {
        const prevLine = previousLines.find(p => p.id === line.id) || { ...line, destination: ' ' }; // Utiliser un espace pour les nouvelles lignes

        return (
          <SplitFlapRow
            key={line.id}
            value={formatLine(line)}
            previousValue={formatLine(prevLine)}
            maxLength={ROW_MAX_LENGTH}
          />
        );
      })}
    </div>
  );
};

export default SplitFlapDisplay;