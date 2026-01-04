// TimeUnitDisplay.tsx
interface TimeUnitProps {
  label: string;
  value: number;
}

/**
 * Affiche une unité de temps (ex: Mois) avec sa valeur.
 */
export default function TimeUnitDisplay({ label, value }: TimeUnitProps) {
  return (
    <div className="flex flex-col items-center mx-1 md:mx-4 py-2 md:py-3 px-3 md:px-5 bg-gray-100 rounded-lg shadow-lg">
      {/* La valeur du décompte (ex: 01) */}
      <div suppressHydrationWarning className="text-xl md:text-6xl font-bold font-mono text-JNM-primary">
        {value}
      </div>
      {/* Le label (ex: Mois) */}
      <div className="text-[10px] md:text-xs uppercase text-gray-600 md:mt-1">
        {label}
      </div>
    </div>
  );
}