"use client"

import * as React from "react"
import { useTheme } from "next-themes"

// Configuration des thèmes disponibles pour l'affichage
// Les couleurs 'previewBg' sont des approximations visuelles de vos variables CSS
const themeOptions = [
  {
    name: "light",
    label: "Clair",
    previewBg: "bg-(--color-secondary)", // Représente --color-background-light
    previewBorder: "border-gray-300"
  },
  {
    name: "dark",
    label: "Sombre",
    previewBg: "bg-(--color-seconde-black)", // Représente --color-background-dark
    previewBorder: "border-slate-700"
  },
]

export function ThemeSelector() {
  const [mounted, setMounted] = React.useState(false)
  const { theme, setTheme,  } = useTheme()

  // Empêche le rendu côté serveur pour éviter les erreurs d'hydratation
  // Le composant ne s'affiche que lorsque le JS du navigateur est chargé.
  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    console.log("Thème actuel :", theme)
  }, [theme])

  if (!mounted) {
    // Rendu d'un placeholder invisible pour éviter le décalage de mise en page (CLS)
    return <div className="h-10 w-[180px]" aria-hidden="true" />
  }

  return (
    <div className="flex items-center gap-3 p-2 bg-(--color-secondary) dark:bg-(--color-seconde-black) rounded-full border border-gray-200 dark:border-gray-700 w-fit">
      {themeOptions.map((option) => {
        const isActive = theme === option.name

        return (
          <button
            key={option.name}
            onClick={() => setTheme(option.name)}
            title={`Passer en mode ${option.label}`}
            aria-label={`Passer en mode ${option.label}`}
            aria-pressed={isActive}
            className={`
              group relative h-8 w-8 rounded-full border-2 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-slate-900
              ${option.previewBg} 
              ${option.previewBorder}
              ${isActive ? 'scale-110 shadow-md ring-2 ring-offset-2 ring-(--color-primary) dark:ring-offset-slate-900 border-transparent' : 'hover:scale-105 opacity-80 hover:opacity-100'}
            `}
          >
             {/* Petit indicateur visuel pour le thème actif (optionnel) */}
             {isActive && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 ${option.name === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
             )}
            <span className="sr-only">{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}