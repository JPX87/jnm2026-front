import Link from "next/link";
import { ThemeSelector } from "@/components/ui/theme/ThemeSelector/ThemeSelector";
import { LogoSvg } from "@/components/ui/branding/logo/LogoSvg";

export default function HeaderGrid() {
  return (
    <>
        <header className="fixed z-10 top-0 grid grid-cols-3 items-center w-full h-16 md:h-20 px-3 sm:px-6 bg-(--color-primary)">
            {/* Logo */}
            <Link href="/" className="justify-self-start">
                {/*
                <img className='w-20 sm:w-24 md:w-32' src="LOGO_FINAL_SANS_FOND_SIMPLE_NOIR.png" alt='Logo' />
                */}
                <LogoSvg className="h-16 md:h-20 w-20 sm:w-24 md:w-32 fill-(--color-secondary) dark:fill-(--color-seconde-black)" />
            </Link>

            {/* Date */}
            <div className="relative flex justify-self-center gap-8 text-(--color-secondary) dark:text-(--color-seconde-black) font-['Oswald'] font-bold">
                <span className="mb-6 text-xs sm:text-lg md:text-2xl lg:text-4xl text-center">26 - 27 - 28 - 29 MAI</span>
                <span className="absolute left-0 right-0 bottom-0 mx-auto text-base sm:text-lg md:text-xl text-center">TOULOUSE</span>
            </div>

            {/* Actions */}
            <div className="justify-self-end flex items-center gap-4 font-['Oswald']">
                {/*<button className="bg-black text-white text-2xl font-bold rounded-3xl py-2 px-10 hover:bg-gray-800 transition cursor-pointer">
                TICKETS
                </button>
                <button className="text-gray-600 hover:text-black cursor-pointer">Menu</button>*/}
                <ThemeSelector />
            </div>
        </header>
    </>
  );
}