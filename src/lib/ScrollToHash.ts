"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

export default function ScrollToHash() {
    const params = useParams();

    useEffect(() => {
        const hash = window.location.hash;

        if (hash) {
            const id = hash.replace("#", "");
            const element = document.getElementById(id);

            if (element) {
                // Scroll vers l'élément
                element.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });

                // Nettoyage de l'URL
                if (id === "top") {
                    const cleanupTimeout = setTimeout(() => {
                        // ReplaceState pour retirer le hash sans rafraîchir
                        window.history.replaceState(
                            null,
                            "",
                            window.location.pathname + window.location.search
                        );
                    }, 800);
                    return () => clearTimeout(cleanupTimeout);
                }
                return
            }
        }
    }, [params]);

    return null;
}