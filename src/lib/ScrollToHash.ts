"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

export default function ScrollToHash() {
    const params = useParams(); // Permet de réagir aux changements de route

    useEffect(() => {
        // On extrait le hash manuellement car Next Navigation n'a pas de useHash
        const hash = window.location.hash;

        if (hash) {
            const id = hash.replace("#", "");
            const element = document.getElementById(id);

            if (element) {
                // Petit timeout pour laisser le temps au DOM de finir de s'afficher
                setTimeout(() => {
                    element.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                }, 100);
            }
        }
    }, [params]); // Se déclenche à chaque changement de navigation

    return null;
}