// components/FlipUnit.tsx
import React from 'react';
import FlipCard from './FlipCard';

interface FlipUnitProps {
  value: number;
  label: string;
}

const FlipUnit: React.FC<FlipUnitProps> = ({ value, label }) => {
  // Formater le nombre pour toujours avoir 2 chiffres (ex: 9 -> "09")
  const formattedValue = value.toString().padStart(2, '0');
  const digit1 = formattedValue[0];
  const digit2 = formattedValue[1];

  return (
    <div className="flex gap-2 bg-[#121212] p-4 rounded-xl border border-white/5 shadow-2xl">
      <FlipCard digit={digit1} />
      <FlipCard digit={digit2} label={label} />
    </div>
  );
};

export default React.memo(FlipUnit);