import { PartenaitCard } from "@/components/features/PartenariatCard";
import PageTemplate from "@/components/layout/PageTemplate/PageTemplate";
import Section from "@/components/layout/Section/Section";
import { majorPartnerData, ledaPartnerData, actorPartnerData, partnersList } from "../../../data/partenaires";
import { MiageLogo } from "@/components/ui/branding/MiageLogo/MiageLogo";
import { LogoSvg } from "@/components/ui/branding/logo/LogoSvg";
import { PartnerCarousel } from "@/components/features/PartnerCarousel/PartnerCarousel";

export default function PartenairesPage() {
    return (
        <PageTemplate variant="theme" className="organigramme !bg-(--color-secondary) dark:!bg-(--color-seconde-black)" titleClassName="!text-(--color-primary)">
            <section className="flex flex-col md:flex-row -mb-10 md:-mb-14">
                <div className="flex mx-auto md:mx-0">
                    <LogoSvg className="w-32 md:w-42 px-4 !h-auto" fill="var(--color-primary)" />
                    <MiageLogo className="w-48 md:w-58 px-4 !h-auto" fill="var(--color-primary)" />
                </div>
                <h1 className="text-4xl md:text-6xl text-center md:text-left mb-1 font-bold">REMERCIENT TOUS NOS PARTENAIRES</h1>
            </section>
            <Section variant="neutral" maxWidth="full" contentClassName="w-full">
                <h2 className="text-3xl text-(--color-primary)" >En étroite collaboration avec</h2>
                {/* Wrapper avec une hauteur proportionnelle pour absorber le 'scale' de la carte sans casser le flux */}
                <div className="sm:mt-2 flex justify-center items-center w-full h-[220px] md:h-[300px] lg:h-[350px] xl:h-[450px]">
                    <PartenaitCard data={majorPartnerData} className="scale-110 sm:scale-125 md:scale-150 lg:scale-200 xl:scale-250" />
                </div>
            </Section>

            <Section variant="neutral" maxWidth="full" contentClassName="w-full">
                <h2 className="text-3xl text-(--color-primary)" >En partenariat avec</h2>
                <div className="sm:mt-2 flex flex-wrap justify-center items-center gap-y-6 md:gap-y-10 xl:gap-y-18 gap-x-8 md:gap-x-20 xl:gap-x-26 w-full">
                    {ledaPartnerData.map((data, index) => (
                        <PartenaitCard key={index} data={data} className="scale-90 lg:scale-100 xl:scale-120" />
                    ))}
                </div>
            </Section>

            <Section variant="neutral" maxWidth="full" contentClassName="w-full">
                <h2 className="text-3xl text-(--color-primary)" >Avec le soutien de</h2>
                <div className="sm:mt-2 flex flex-wrap justify-center items-center gap-y-6 md:gap-y-10 xl:gap-y-18 gap-x-8 md:gap-x-20 xl:gap-x-26 w-full">
                    {actorPartnerData.map((data, index) => (
                        <PartenaitCard key={index} data={data} className="scale-90 lg:scale-100 xl:scale-120" />
                    ))}
                </div>
            </Section>

            <Section variant="neutral" maxWidth="full" contentClassName="!px-0 !pb-2 !md:pb-0 !w-full">
                <h2 className="text-2xl md:text-5xl font-bold text-(--color-primary) text-center">MERCI À TOUS NOS PARTENAIRES</h2>
                <PartnerCarousel partnersList={partnersList} />
            </Section>
        </PageTemplate>
    );
}
