import { Metadata } from 'next'
import PageTemplate from "@/components/layout/PageTemplate/PageTemplate";
import MetroOrgChart from "@/components/ui/organizationChart/MetroOrgChart";

export const metadata: Metadata = {
    title: "Organigramme",
}

export default function OrganigrammePage() {
    return (
        <PageTemplate title="ORGANIGRAMME" className="organigramme !bg-(--color-secondary) dark:!bg-(--color-seconde-black)" titleClassName="!text-(--color-primary)">
            <MetroOrgChart />
        </PageTemplate>
    )
}