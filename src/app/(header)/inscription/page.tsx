import { Metadata } from 'next';
import InscriptionContent from "@/components/features/InscriptionContent/InscriptionContent";

export const metadata: Metadata = { 
    title: "Inscription", 
}
export default function InscriptionPage() {
    return <InscriptionContent />;
}
