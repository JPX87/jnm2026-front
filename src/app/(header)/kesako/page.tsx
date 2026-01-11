import { Slice } from "@/components/layout/Slice/Slice";

export default function KesakoPage() {
    return (
        <main className="kesako relative bg-(--color-primary) min-h-screen text-(--color-secondary) dark:text-(--color-seconde-black)">
            <div className="flex flex-col gap-8 md:gap-12 py-8 md:py-12 pt-24 md:pt-32">
                {/* Hero Section */}
                <div className="w-full">
                    <h1 className="text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold my-[20px] md:my-[30px]">
                        LES JOURNÉES NATIONALES MIAGISTES
                    </h1>
                </div>

                {/* Description Section */}
                <div className="w-full">
                    <div className="relative w-10/12 max-w-5xl flex flex-col gap-4 py-8 md:py-10 px-8 md:px-12 justify-center rounded-3xl bg-(--color-tertiary) text-(--color-secondary) dark:text-(--color-seconde-black) m-auto">
                        <p className="text-lg md:text-xl lg:text-2xl leading-relaxed">
                            Un rendez-vous annuel qui rassemble l'ensemble du réseau international MIAGE.
                        </p>

                        <p className="text-lg md:text-xl lg:text-2xl leading-relaxed">
                            Un temps fort pour le réseau de la MIAGE permettant de se regrouper, se développer et améliorer les connaissances des divers participants.
                        </p>

                        <p className="text-lg md:text-xl lg:text-2xl leading-relaxed">
                            Lors de ces trois journées de rencontre entre étudiants, diplômés, équipes pédagogiques et directeurs, les participants suivent des conférences et/ou des ateliers animés par des entreprises, se challengent entre MIAGE et participent à des jeux de cohésions.
                        </p>

                        <p className="text-lg md:text-xl lg:text-2xl leading-relaxed font-semibold">
                            Cet évènement se clôture chaque année avec un gala fabuleux.
                        </p>
                    </div>
                </div>

                {/* Statistics Section */}
                <div className="w-full">
                    <div className="relative w-11/12 max-w-6xl flex flex-col gap-6 py-8 md:py-10 px-8 md:px-12 rounded-3xl bg-(--color-primary) text-(--color-secondary) dark:text-(--color-seconde-black) m-auto">
                        <h2 className="text-center text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                            EN QUELQUES CHIFFRES
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {/* Stat 1 - Tertiary Color */}
                            <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-(--color-tertiary) text-(--color-secondary) dark:text-(--color-seconde-black) shadow-lg">
                                <div className="text-5xl md:text-6xl lg:text-7xl font-bold mb-3">
                                    21
                                </div>
                                <div className="text-xl md:text-2xl font-semibold">
                                    MIAGE
                                </div>
                                <div className="text-lg md:text-xl opacity-80">
                                    En France
                                </div>
                            </div>

                            {/* Stat 2 - Secondary Color */}
                            <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-(--color-secondary) text-(--color-primary) shadow-lg">
                                <div className="text-5xl md:text-6xl lg:text-7xl font-bold mb-3">
                                    +1200
                                </div>
                                <div className="text-xl md:text-2xl font-semibold">
                                    Diplômés par an
                                </div>
                            </div>

                            {/* Stat 3 - Tertiary Color */}
                            <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-(--color-tertiary) text-(--color-secondary) dark:text-(--color-seconde-black) shadow-lg">
                                <div className="text-5xl md:text-6xl lg:text-7xl font-bold mb-3">
                                    1970
                                </div>
                                <div className="text-xl md:text-2xl font-semibold">
                                    Création de la MIAGE
                                </div>
                            </div>

                            {/* Stat 4 - Secondary Color */}
                            <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-(--color-secondary) text-(--color-primary) shadow-lg">
                                <div className="text-5xl md:text-6xl lg:text-7xl font-bold mb-3">
                                    42
                                </div>
                                <div className="text-xl md:text-2xl font-semibold">
                                    Journées Nationales Miagistes
                                </div>
                            </div>

                            {/* Stat 5 - Tertiary Color */}
                            <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-(--color-tertiary) text-(--color-secondary) dark:text-(--color-seconde-black) shadow-lg md:col-span-2 lg:col-span-1">
                                <div className="text-5xl md:text-6xl lg:text-7xl font-bold mb-3">
                                    10
                                </div>
                                <div className="text-xl md:text-2xl font-semibold">
                                    Partenaires
                                </div>
                                <div className="text-lg md:text-xl opacity-80">
                                    sur cet évènement
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
