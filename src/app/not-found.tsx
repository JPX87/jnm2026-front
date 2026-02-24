import { Metadata } from 'next'
import PageLayout, { viewport } from "@/components/layout/PageLayout/PageLayout";
import ErrorDisplay from "@/components/ui/ErrorDisplay/ErrorDisplay";
export { viewport };

export const metadata: Metadata = {
  title: "Page introuvable | JNM 2026",
}

export default function Custom404() {
  return (
    <PageLayout>
      <ErrorDisplay
        code={404}
        message={"Oups\u00a0! La page que vous recherchez n\u2019existe pas."}
        linkHref="/"
        linkLabel="Retour à l'accueil"
      />
    </PageLayout>
  )
}