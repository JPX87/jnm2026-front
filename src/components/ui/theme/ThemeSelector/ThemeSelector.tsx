"use client"

import * as React from "react"
import { useTheme } from "next-themes"

export function ThemeSelector() {
  const [mounted, setMounted] = React.useState(false)
  const { theme, setTheme } = useTheme()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Mini loading placeholder pour éviter le "flash" au chargement
    return <div className="w-26 md:w-32 h-10 md:h-12 rounded-full bg-gray-200 dark:bg-black text-center text-2xl">...</div>
  }

  // Configuration des options
  const tabs = [
    { id: "light", label: "Clair" },
    { id: "system", label: "Auto" },
    { id: "dark", label: "Sombre" },
  ]

  // Calcul de la position de la "pilule" d'arrière-plan en fonction du thème actif
  // On utilise des pourcentages pour que ça marche peu importe la largeur
  const activeIndex = tabs.findIndex((t) => t.id === theme)
  // Si le thème n'est pas trouvé (ex: au premier chargement), on se met sur system (index 1)
  const safeIndex = activeIndex === -1 ? 1 : activeIndex
  
  // Position gauche en pourcentage : 0%, 33.33%, ou 66.66%
  const translateValue = `${safeIndex * 100}%`

  return (
    <div 
      className="relative flex items-center p-1 rounded-full bg-gray-200 dark:bg-black border border-gray-300 dark:border-gray-700 w-fit"
      role="tablist"
      aria-label="Choix du thème"
    >
      {/* PILULE COULISSANTE (Background animé) 
        Elle est en position absolue et glisse derrière les boutons grâce au translateX
      */}
      <div
        className="absolute left-1 top-1 bottom-1 w-[calc(33.33%-3px)] rounded-full bg-white dark:bg-(--color-seconde-black) shadow-sm transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(${translateValue})` }}
        aria-hidden="true"
      />

      {/* BOUTONS (Foreground)
        Ils sont transparents (z-10) et servent juste à cliquer et afficher l'icône
      */}
      {tabs.map((tab) => {
        const isActive = theme === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => setTheme(tab.id)}
            role="tab"
            aria-selected={isActive}
            aria-label={`Activer le mode ${tab.label}`}
            className={`
              relative z-10 flex items-center justify-center w-8 sm:w-10 h-8 sm:h-10 rounded-full 
              transition-colors duration-200
              focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
              ${isActive 
                ? "text-black dark:text-white" // Couleur quand actif
                : "text-gray-500 hover:text-(--color-seconde-black) dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer" // Couleur quand inactif
              }
            `}
          >
            {/* Rendu conditionnel des icônes SVG */}
            {tab.id === "light" && (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            )}

            {tab.id === "system" && (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                 <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
              </svg>
            )}

            {tab.id === "dark" && (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        )
      })}
    </div>
  )
}