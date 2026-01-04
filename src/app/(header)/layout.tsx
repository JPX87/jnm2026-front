// app/(header)/layout.tsx
import PageLayout, { metadata, viewport } from "@/components/layout/PageLayout/PageLayout";

export { metadata, viewport };

export default function HeaderLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageLayout>
      {children}
    </PageLayout>
  );
}