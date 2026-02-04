interface StatCardProps {
    value: string | number;
    title: string;
    subtitle?: string;
    variant?: 'primary' | 'secondary' | 'tertiary';
    customClassName?: string;
}

export default function StatCard({ value, title, subtitle, variant = 'tertiary', customClassName }: StatCardProps) {
    const getBackgroundClass = () => {
        switch (variant) {
            case 'primary':
                return 'bg-(--color-primary) text-(--color-secondary) dark:text-(--color-seconde-black)';
            case 'secondary':
                return 'bg-(--color-secondary) text-(--color-primary)';
            case 'tertiary':
                return 'bg-(--color-tertiary) text-(--color-secondary) dark:text-(--color-seconde-black)';
            default:
                return 'bg-(--color-tertiary) text-(--color-secondary) dark:text-(--color-seconde-black)';
        }
    };

    return (
        <div className={`flex flex-col items-center text-center p-8 rounded-2xl shadow-lg ${customClassName ?? getBackgroundClass()}`}>
            <div className="text-5xl md:text-6xl lg:text-7xl font-bold mb-3">
                {value}
            </div>
            <div className="text-xl md:text-2xl font-semibold">
                {title}
            </div>
            {subtitle && (
                <div className="text-lg md:text-xl opacity-80">
                    {subtitle}
                </div>
            )}
        </div>
    );
}
