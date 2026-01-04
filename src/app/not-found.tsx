import { Metadata } from 'next'
import PageLayout, { viewport } from "@/components/layout/PageLayout/PageLayout";
import { BouncingLogo } from '@/components/ui/branding/BouncingLogo/BouncingLogo';
export { viewport };

export const metadata: Metadata = {
  title: "Page introuvable | JNM 2026",
}

export default function Custom404() {
  return <PageLayout>
      <main className="flex flex-col items-center justify-center h-dvh text-center px-4">
        <BouncingLogo />
        <h1 className="text-center text-8xl xl:text-[150px] font-['Oswald'] font-bold text-(--color-primary) my-[20px]">404</h1>
        <p className="text-xl xl:text-3xl font-['Oswald'] border-2 border-(--color-primary) rounded-2xl p-6">Oups! La page que vous recherchez n'existe pas.</p>
      </main>
  </PageLayout>
}