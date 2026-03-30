import PageTemplate from "@/components/layout/PageTemplate/PageTemplate";
import Programme from "@/components/ui/Programme/Programme";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Programme",
}

export default function ProgrammePage() {
    return (
        <PageTemplate title="PROGRAMME" className="!bg-(--color-secondary) dark:!bg-(--color-seconde-black) transition-all duration-300" titleClassName="text-(--color-primary)">
            {/* Content Section */}
            <Programme />
        </PageTemplate>
    );
}
