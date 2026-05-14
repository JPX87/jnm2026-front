import { PartenaitCard } from "@/components/features/PartenariatCard";
import PageTemplate from "@/components/layout/PageTemplate/PageTemplate";
import Section from "@/components/layout/Section/Section";
import { majorPartnerData, ledaPartnerData } from "./data";

export default function PartenairesPage() {
    return (
        <PageTemplate variant="theme" className="organigramme !bg-(--color-secondary) dark:!bg-(--color-seconde-black)" titleClassName="!text-(--color-primary)">
            <Section variant="neutral" maxWidth="full" contentClassName="w-full">
                <h2 className="text-3xl" >Avec le soutien de</h2>
                {/* Wrapper avec une hauteur proportionnelle pour absorber le 'scale' de la carte sans casser le flux */}
                <div className="sm:mt-2 flex justify-center items-center w-full h-[220px] md:h-[300px] lg:h-[350px] xl:h-[450px]">
                    <PartenaitCard data={majorPartnerData} className="scale-110 sm:scale-125 md:scale-150 lg:scale-200 xl:scale-250" />
                </div>
            </Section>

            <Section variant="neutral" maxWidth="full" contentClassName="w-full">
                <h2 className="text-3xl" >Avec le soutien de</h2>

                <div className="sm:mt-2 flex flex-wrap justify-center items-center gap-y-6 md:gap-y-10 xl:gap-y-18 gap-x-8 md:gap-x-20 xl:gap-x-26 w-full">
                    {ledaPartnerData.map((data, index) => (
                        <PartenaitCard key={index} data={data} className="scale-90 lg:scale-100 xl:scale-120" />
                    ))}
                </div>
            </Section>
        </PageTemplate>
    );
}
