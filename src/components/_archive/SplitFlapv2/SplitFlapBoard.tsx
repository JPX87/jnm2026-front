import React, { useState, useEffect, useCallback } from 'react';

interface SplitFlapProps {
  character: string;
  delay?: number;
  color: string | undefined;
  onStartFlipping: () => void;
  onEndFlipping: () => void;
}

const SplitFlap: React.FC<SplitFlapProps> = ({ character, delay = 10, color, onStartFlipping, onEndFlipping }) => {
  const [currentChar, setCurrentChar] = useState(' ');
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipPhase, setFlipPhase] = useState<'top' | 'bottom'>('top');
 
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:-|./? '.split('');
  
  useEffect(() => {
    if(character !== " ") onStartFlipping();
    
    const timer = setTimeout(() => {
      if (currentChar !== character ) {
        setIsFlipping(true);

        const currentIndex = chars.indexOf(currentChar);
        
        let index = currentIndex;
        const interval = setInterval(() => {
          setFlipPhase('top');
          setTimeout(() => setFlipPhase('bottom'), 25);
          
          index = (index + 1) % chars.length;
          setCurrentChar(chars[index]);
          
          if (chars[index] === character) {
            clearInterval(interval);
            setIsFlipping(false);
            onEndFlipping();
          }
        }, 50);
        
        return () => clearInterval(interval);
      }

    }, delay);

  
    return () => clearTimeout(timer);
  }, [character]);

  return (
    <div className="relative w-6 h-12 bg-black rounded-sm overflow-hidden shadow-lg">
      {/* Ligne de séparation horizontale */}
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-900 z-10" />
      
      {/* Volet supérieur */}
      <div className={`absolute top-0 left-0 right-0 h-1/2 overflow-hidden bg-gray-900 ${
            isFlipping && flipPhase === 'top' ? 'animate-flip-top' : ''
          }`}>
        <div 
          className={`absolute left-0 right-0 top-0 flex items-center justify-center text-amber-100 font-mono text-xl font-bold transition-transform duration-50`}
          style={{ 
            textShadow: '0 0 10px rgba(251, 191, 36, 0.5)',
            transformOrigin: 'bottom',
            height: '200%',
            clipPath: 'inset(0 0 50% 0)',
            color
          }}
        >
          {currentChar}
        </div>
      </div>
      
      {/* Volet inférieur */}
      <div className={`absolute bottom-0 left-0 right-0 h-1/2 overflow-hidden bg-gray-800 ${
            isFlipping && flipPhase === 'bottom' ? 'animate-flip-bottom' : ''
          }`}>
        <div 
          className={`absolute left-0 right-0 bottom-0 flex items-center justify-center text-amber-100 font-mono text-xl font-bold transition-transform duration-50`}
          style={{ 
            textShadow: '0 0 10px rgba(251, 191, 36, 0.5)',
            transformOrigin: 'top',
            height: '200%',
            clipPath: 'inset(50% 0 0 0)',
            color
          }}
        >
          {currentChar}
        </div>
      </div>
      
      {/* Reflets et texture */}
      <div className="absolute inset-0 bg-linear-to-br from-white/5 via-transparent to-black/20 pointer-events-none" />
    </div>
  );
};

interface FlightInfo {
  time: string;
  destination: string;
  flight: string;
  gate: string;
  status: string;
}

interface SplitFlapBoardProps {
  rows?: FlightInfo[];
  title?: string;
  columns?: { label: string; width: number }[];
}

const SplitFlapBoard: React.FC<SplitFlapBoardProps> = ({ 
  rows = [
    { time: '2023', destination: 'PARIS - NANTERRE', flight: 'THEME', gate: '39', status: 'PASSED' },
    { time: '2024', destination: 'ORLEANS', flight: 'NOBLESSE', gate: '40', status: 'PASSED' },
    { time: '2025', destination: 'AIX-MARSEILLE', flight: 'SEA/SUN', gate: '41', status: 'PASSED' },
    { time: '', destination: '', flight: '', gate: '', status: '' },
    { time: '', destination: 'POURQUOI', flight: 'PAS', gate: '', status: '' },
    { time: '2026', destination: 'TOULOUSE?', flight: 'VOYAGE', gate: '42', status: 'ON TIME', color: "#EF6A9F" },  
  ],
  title = 'DEPARTURES',
  columns = [
    { label: 'TIME', width: 4 },
    { label: 'DESTINATION', width: 16 },
    { label: 'FLIGHT', width: 8 },
    { label: 'GATE', width: 4 },
    { label: 'STATUS', width: 9 },
  ]
}) => {
  const [displayRows, setDisplayRows] = useState(rows);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loadingCount, setLoadingCount] = useState(0);

  const updateBoard = () => {
    setRefreshKey(prev => prev + 1);
  };

  const formatRowData = (row: FlightInfo): string[] => {
    return [
      row.time.padEnd(columns[0].width),
      row.destination.padEnd(columns[1].width),
      row.flight.padEnd(columns[2].width),
      row.gate.padEnd(columns[3].width),
      row.status.padEnd(columns[4].width),
    ];
  };

  useEffect(() => {
    setDisplayRows(rows)
  }, [rows])

  useEffect(() => {
    console.log(loadingCount)
  }, [loadingCount])

  const isLoading = loadingCount > 0;

  useEffect(() => {
    if(!isLoading)
      console.log("Finish !")
    else
      console.log("Et non !")
  }, [isLoading])

  const handleStartFlipping = useCallback(() => {
    setLoadingCount((prev) => prev + 1);
  }, []);

  const handleEndFlipping = useCallback(() => {
    setLoadingCount((prev) => Math.max(prev - 1, 0));
  }, []);


  return (
    <div className="min-h-screen bg-linear-to-br from-slate-800 via-slate-700 to-slate-800 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-6xl">
        {/* En-tête */}
        <div className="mb-6 text-center">
          <h1 className="text-5xl font-bold text-amber-400 mb-2 tracking-wider" style={{ textShadow: '0 0 20px rgba(251, 191, 36, 0.5)' }}>
            {title}
          </h1>
          <div className="h-1 w-48 bg-linear-to-r from-transparent via-amber-400 to-transparent mx-auto" />
        </div>

        {/* Tableau principal */}
        <div className="bg-gray-950 rounded-lg p-6 shadow-2xl border border-gray-800">
          {/* En-têtes de colonnes */}
          <div className="flex gap-2 mb-4 px-2">
            {columns.map((col, idx) => (
              <div 
                key={idx}
                className="text-amber-400 text-xs font-bold tracking-wider"
                style={{ width: `${col.width * 2}rem` }}
              >
                {col.label}
              </div>
            ))}
          </div>

          {/* Lignes de vols */}
          <div className="space-y-3">
            {displayRows.map((row, rowIdx) => {
              const rowData = formatRowData(row);
              return (
                <div key={`${rowIdx}-${refreshKey}`} className="flex gap-2">
                  {rowData.map((section, sectionIdx) => (
                    <div key={sectionIdx} className="flex gap-0.5">
                      {section.split('').map((char, charIdx) => (
                          <SplitFlap
                            key={`${rowIdx}-${sectionIdx}-${charIdx}`}
                            character={char}
                            delay={rowIdx * 1500 + sectionIdx * 100 + charIdx * 30}
                            color={row?.color}
                            onStartFlipping={handleStartFlipping}
                            onEndFlipping={handleEndFlipping}
                          />
                        )
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          {/* Contrôles */}
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={updateBoard}
              className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold rounded transition-colors shadow-lg"
            >
              RAFRAÎCHIR
            </button>
            <button
              onClick={() => {
                const newRow: FlightInfo = {
                  time: '23:45',
                  destination: 'PARIS-CDG',
                  flight: 'AF' + Math.floor(Math.random() * 1000),
                  gate: String(Math.floor(Math.random() * 20) + 1).padStart(2, '0'),
                  status: ['ON TIME', 'BOARDING', 'DELAYED'][Math.floor(Math.random() * 3)]
                };
                setDisplayRows([newRow, ...displayRows.slice(0, 3)]);
                setRefreshKey(prev => prev + 1);
              }}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded transition-colors shadow-lg"
            >
              AJOUTER VOL
            </button>
          </div>
        </div>

        {/* Son de clic (simulation) */}
        <div className="mt-4 text-center text-gray-500 text-sm">
          🔊 Cliquetis caractéristique des volets mécaniques
        </div>
      </div>

      <style>{`
        @keyframes flip-top {
          0% { transform: perspective(200px) rotateX(0deg); }
          100% { transform: perspective(200px) rotateX(-90deg); }
        }
        
        @keyframes flip-bottom {
          0% { transform: perspective(200px) rotateX(90deg); }
          100% { transform: perspective(200px) rotateX(0deg); }
        }
        
        .animate-flip-top {
          animation: flip-top 25ms linear;
           transform: perspective(200px);
          transform-origin: center bottom;
        }
        
        .animate-flip-bottom {
          animation: flip-bottom 25ms linear;
          transform: perspective(200px);
          transform-origin: center top;
        }
      `}</style>
    </div>
  );
};

export default SplitFlapBoard;