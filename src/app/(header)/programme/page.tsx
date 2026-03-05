import PageTemplate from "@/components/layout/PageTemplate/PageTemplate";
import Section from "@/components/layout/Section/Section";
import Programme from "@/components/ui/Programme/Programme";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Programme",
}

export default function ProgrammePage() {
    return (
        <PageTemplate title="PROGRAMME" className="programme">
            <Section variant="tertiary" maxWidth="xl">
                <Programme />
            </Section>
        </PageTemplate>
    );
}
