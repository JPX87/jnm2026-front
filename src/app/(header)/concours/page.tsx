'use client';
import PageTemplate from "@/components/layout/PageTemplate/PageTemplate";
import Section from "@/components/layout/Section/Section";
import { Arrow } from "@/components/ui/Arrow/Arrow";
import DirectiveCard from "@/components/ui/DirectiveCard/DirectiveCard";
import { PeopleAndCam } from "@/components/ui/PeopleAndCam/PeopleAndCam";
import { RugbyBall } from "@/components/ui/RugbyBall/RugbyBall";
import { RugbyPitch } from "@/components/ui/RugbyPitch/RugbyPitch";

const Corner = ({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) => {
    const posClass = {
        tl: 'top-5 sm:top-8 left-5 sm:left-8 border-l-2 sm:border-l-4 border-t-2 sm:border-t-4',
        tr: 'top-5 sm:top-8 right-5 sm:right-8 border-r-2 sm:border-r-4 border-t-2 sm:border-t-4',
        bl: 'bottom-5 sm:bottom-8 left-5 sm:left-8 border-l-2 sm:border-l-4 border-b-2 sm:border-b-4',
        br: 'bottom-5 sm:bottom-8 right-5 sm:right-8 border-r-2 sm:border-r-4 border-b-2 sm:border-b-4',
    };
    return <div className={`absolute w-20 md:w-30 h-20 md:h-30 border-(--color-seconde-black) dark:border-white transition-all ${posClass[position]}`} />;
};

const Ruler = () => (
    <div className="absolute left-10 sm:left-14 top-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className="relative w-1 h-44 scale-75 md:scale-100">
            {[...Array(19)].map((_, i) => (
                <div key={i} className="absolute left-0 bg-(--color-seconde-black) dark:bg-white" style={{
                    width: i % 3 === 0 ? '18px' : '8px',
                    height: '3px',
                    transform: `translateX(-${i % 3 === 0 ? '14px' : '6px'})`,
                    top: `${i * 10}px`
                }}>
                    {i % 3 === 0 && <span className="absolute -left-2 top-[0.5px] text-xs -translate-x-full -translate-y-1/2 text-(--color-seconde-black) dark:text-white">{(i / 3 - 3) * -1}</span>}
                </div>
            ))}
        </div>
        <div className="absolute left-0 bg-(--color-seconde-black) dark:bg-white w-2 h-1.5 top-[52%] left-3 -translate-y-1/2" />
    </div>
);

const RecLabel = () => (
    <div className="absolute top-12 sm:top-14 left-12 sm:left-14 flex items-center gap-2">
        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full" />
        <span className="text-(--color-seconde-black) dark:text-white font-bold text-base md:text-xl tracking-widest">REC</span>
    </div>
);

const BatteryIcon = () => (
    <div className="absolute top-12 sm:top-14 right-12 sm:right-14 flex items-center gap-[1px]">
        <div className="w-10 sm:w-14 md:w-16 h-6 sm:h-8 border-2 border-(--color-seconde-black) dark:border-white rounded flex items-center px-[1px] py-[1.5px] gap-[0.5px]">
            {[...Array(4)].map((_, i) => <div key={i} className="flex-1 h-full bg-(--color-seconde-black) dark:bg-white rounded-xs sm:rounded-sm" />)}
        </div>
        <div className="w-1.5 h-4 bg-(--color-seconde-black) dark:bg-white rounded-r-sm" />
    </div>
);

export default function ConcourPage() {
    const directives = [
        'Inclure un moyen de transport',
        'Intégrer un plaquage de rugby',
        'Promouvoir le Stade Toulousain ou le TFC',
    ];
    const directives2 = [
        'Montrer votre double compétence',
        'Respecter les droits d\'auteurs',
    ];
    const directives3 = [
        '2 minutes MIN',
        '8 minutes MAX',
    ];

    return (
        <PageTemplate className="!bg-(--color-secondary) dark:!bg-(--color-seconde-black) transition-all duration-300" titleClassName="!text-(--color-primary)">
            <section>
                <h1 className="text-4xl sm:text-xl md:text-5xl xl:text-6xl sm:text-left font-black text-(--color-tertiary) dark:text-white tracking-wider text-center mx-8 transition-all duration-300">
                    CONCOURS VIDÉO
                </h1>
                <Section variant="neutral" maxWidth="full" contentClassName="!relative !w-full gap-4">
                    {/* Frame decorators */}
                    <Corner position="tl" />
                    <Corner position="tr" />
                    <Corner position="bl" />
                    <Corner position="br" />
                    <Ruler />
                    <RecLabel />
                    <BatteryIcon />

                    {/* Directives Grid */}
                    <div className="relative pt-14 pb-18 px-6 sm:px-8 md:px-10 flex flex-col gap-4">
                        {/* Row 1 - 3 cards */}
                        <div className="flex gap-4 justify-center">
                            {directives.map(text => <DirectiveCard key={text} content={text} />)}
                        </div>

                        {/* Row 2 - 2 cards */}
                        <div className="flex gap-4 justify-center mx-4 xs:mx-10 sm:mx-20 lg:mx-40 xl:mx-60">
                            {directives2.map(text => <DirectiveCard key={text} content={text} />)}
                        </div>

                        {/* Row 3 - 3 cards */}
                        <div className="flex gap-4 justify-center">
                            {directives3.map(text => <DirectiveCard key={text} content={text} />)}
                            <DirectiveCard content={<PeopleAndCam className="-mb-3 xl:-mb-6 !w-20 !h-14 sm:!w-20 sm:!h-20 md:!w-24 md:!h-24 lg:!w-28 lg:!h-28 xl:!w-32 xl:!h-32" />} />
                        </div>
                    </div>

                    {/* Deadline */}
                    <div className="absolute bottom-8 left-0 right-0 text-center text-(--color-primary)">
                        <p className="text-lg md:text-xl lg:text-2xl font-bold">Lien de la vidéo à transmettre avant le</p>
                        <p className="text-xl md:text-2xl lg:text-3xl font-black tracking-wide">24/05/2026 23h59m59s</p>
                    </div>
                </Section>
            </section>

            <section>
                <h1 className="text-4xl sm:text-xl md:text-5xl xl:text-6xl sm:text-left font-black text-(--color-tertiary) dark:text-white tracking-wider text-center mx-8 transition-all duration-300">
                    CONCOURS BALLON DE RUGBY
                </h1>
                <Section variant="neutral" maxWidth="full" contentClassName="!relative !w-full gap-4">
                    <div className="relative flex flex-col h-[70vh] items-center gap-4 border-4 border-(--color-seconde-black) dark:border-white">
                        <div className="relative w-full h-2/18 border-b-4 border-(--color-seconde-black) dark:border-white">
                            <RugbyPitch className="absolute -bottom-[20px] w-full h-25 fill-(--color-seconde-black) dark:fill-white transition-all duration-300" />
                        </div>
                        <div className="w-full h-5/18 border-b-4 border-(--color-seconde-black) dark:border-white" />
                        <div className="w-full h-4/18 border-b-4 border-(--color-seconde-black) dark:border-white">
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-auto h-1/2">
                                <RugbyBall className="w-full h-full fill-(--color-seconde-black) dark:fill-white transition-all duration-300" />

                                <Arrow className="absolute bottom-15 xs:bottom-6 sm:-bottom-1 md:-bottom-3 lg:-bottom-2 -left-10 w-25 h-25 sm:w-30 sm:h-30 md:w-40 md:h-40 fill-(--color-seconde-black) dark:fill-white" />
                                <p className="absolute -bottom-1 xs:-bottom-3 sm:-bottom-6 md:-bottom-7 -left-20 sm:-left-30 text-lg md:text-xl lg:text-2xl w-2/3 xl:w-2/3 text-(--color-primary) text-center">
                                    Inclure le nom de la ville de ta MIAGE
                                </p>

                                <Arrow className="absolute top-12 xs:top-2 sm:-top-4 md:-top-9 -right-10 w-25 h-25 sm:w-30 sm:h-30 md:w-40 md:h-40 rotate-160 xs:rotate-180 fill-(--color-primary)" />
                                <p className="absolute -top-1 xs:-top-5 sm:-top-12 -right-20 xs:-right-30 sm:-right-40 text-lg md:text-xl lg:text-2xl w-10/9 sm:w-4/5 text-(--color-primary) text-center">
                                    Personnaliser le ballon pour représenter votre ville
                                </p>
                            </div>
                        </div>
                        <div className="relative w-full h-5/18 border-b-4 border-(--color-seconde-black) dark:border-white">
                            <RugbyPitch className="absolute -bottom-[20px] w-full h-25 fill-(--color-seconde-black) dark:fill-white transition-all duration-300" />
                        </div>
                        <div className="w-full h-2/18" />
                    </div>
                    <p className="text-2xl md:text-3xl font-bold text-center text-(--color-primary)">
                        Le ballon devra obligatoirement être présenté en physique
                    </p>
                </Section>
            </section>

        </PageTemplate>
    );
}
