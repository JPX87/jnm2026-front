"use client";

import Link from "next/link";
import { useState } from "react";
import { ThemeSelector } from "@/components/ui/theme/ThemeSelector/ThemeSelector";
import { LogoSvg } from "@/components/ui/branding/logo/LogoSvg";

export default function HeaderGrid() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuItems = [
        { label: "ORGANIGRAMME", href: "/organigramme" },
        { label: "NOUS CONTACTER", href: "/contact" },
        { label: "INSCRIPTION", href: "/inscription" },
        { label: "KESAKO", href: "/kesako" },
    ];

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
                <div className="relative flex justify-self-center gap-2 sm:gap-4 md:gap-8 text-(--color-secondary) dark:text-(--color-seconde-black) font-['Oswald'] font-bold">
                    <span className="mb-6 text-sm sm:text-lg md:text-2xl lg:text-4xl text-center">26 - 27 - 28 - 29 MAI</span>
                    <span className="absolute left-0 right-0 bottom-0 mx-auto text-sm sm:text-base md:text-lg lg:text-xl text-center">TOULOUSE</span>
                </div>

                {/* Actions */}
                <div className="justify-self-end flex items-center gap-4 font-['Oswald'] relative">
                    {/* Hamburger Menu Button */}
                    <div className="relative z-[9999]">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex flex-col justify-center items-center w-10 h-10 gap-1.5 cursor-pointer group"
                            aria-label="Toggle menu"
                            aria-expanded={isMenuOpen}
                        >
                            <span
                                className={`block w-6 h-0.5 bg-(--color-secondary) dark:bg-(--color-seconde-black) transition-all duration-300 ease-in-out ${isMenuOpen ? "rotate-45 translate-y-2" : ""
                                    }`}
                            />
                            <span
                                className={`block w-6 h-0.5 bg-(--color-secondary) dark:bg-(--color-seconde-black) transition-all duration-300 ease-in-out ${isMenuOpen ? "opacity-0" : ""
                                    }`}
                            />
                            <span
                                className={`block w-6 h-0.5 bg-(--color-secondary) dark:bg-(--color-seconde-black) transition-all duration-300 ease-in-out ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""
                                    }`}
                            />
                        </button>

                        {/* Dropdown Menu */}
                        <div
                            className={`fixed right-0 top-0 h-full w-full sm:w-96 bg-(--color-primary) shadow-2xl transition-transform duration-300 ease-in-out z-[9999] ${isMenuOpen
                                ? "translate-x-0"
                                : "translate-x-full"
                                }`}
                            style={{ top: '4rem' }}
                        >
                            <nav className="flex flex-col h-full py-8 px-6 z-50">
                                {menuItems.map((item, index) => (
                                    <Link
                                        key={index}
                                        href={item.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center justify-between px-6 py-6 text-(--color-secondary) dark:text-(--color-seconde-black) hover:bg-(--color-secondary) hover:bg-opacity-10 transition-colors duration-200 font-bold text-2xl group border-b border-(--color-secondary) border-opacity-20"
                                    >
                                        <span>{item.label}</span>
                                        <div className="flex items-center justify-center w-10 h-10 bg-black rounded-full transition-transform duration-300 group-hover:scale-110">
                                            <svg
                                                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M5 12H19M19 12L12 5M19 12L12 19"
                                                    stroke="#FF69B4"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </div>
                                    </Link>
                                ))}

                                {/* Theme Selector right after menu items */}
                                <div className="mt-6 pt-6">
                                    <div className="flex items-center justify-between px-6 py-4">
                                        <span className="text-(--color-secondary) dark:text-(--color-seconde-black) font-bold text-xl">THÈME</span>
                                        <ThemeSelector />
                                    </div>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}