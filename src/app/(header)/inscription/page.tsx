import Image from "next/image";


export default function InscriptionPage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <Image src="/travaux.png" alt="Page en construction" width={150} height={150} className="mb-8 w-24 sm:w-40" />
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-center">Cette page est en construction</h1>
            <p className="text-xl sm:text-2xl">Revenez bientôt ! 😉</p>
        </div>
    );
}