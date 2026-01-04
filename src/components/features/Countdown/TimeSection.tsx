import TimeSegment from "./TimeSegment/TimeSegment";

interface TimeSectionProps {
  label: string;
  value: number;
}

export default function TimeSection({ label, value }: TimeSectionProps) {
  const firstNumber = Math.floor(value / 10);
  const secondNumber = value % 10;

  return (
    <div className="text-center flex-[0_1_max-content]">
        <p className="text-start mb-3 text-(--color-secondary) text-lg md:text-3xl xl:text-4xl tracking-wide font-['Oswald'] font-bold">
          {label}
        </p>
        <div className="flex gap-0.5 md:gap-1 xl:gap-2.5 justify-center">
            <TimeSegment value={firstNumber} />
            <TimeSegment value={secondNumber} />
        </div>
    </div>
  );
}
