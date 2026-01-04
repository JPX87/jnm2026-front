"use client"

import React, { useEffect, useRef, useState } from 'react'
// Assurez-vous que le chemin d'import de votre LogoSvg est correct
import { LogoSvg } from '@/components/ui/branding/logo/LogoSvg'

// Vos couleurs de thème (assurez-vous qu'elles existent en CSS)
const COLORS = [
  'text-(--color-primary)',
  'text-(--color-seconde-black) dark:text-(--color-secondary)',
  'text-(--color-tertiary)',
  'text-(--color-error)',
  'text-(--color-success)',
  'text-(--color-warning)',
]

export function BouncingLogo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  
  // États pour la position et la couleur
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [colorIndex, setColorIndex] = useState(0)
  
  // Références mutables pour la physique (évite les re-renders inutiles)
  const physics = useRef({
    x: Math.random() * 100, // Position initiale aléatoire
    y: Math.random() * 100,
    dx: 2, // Vitesse horizontale (pixels par frame)
    dy: 2, // Vitesse verticale
  })

  useEffect(() => {
    const container = containerRef.current
    const logo = logoRef.current
    if (!container || !logo) return

    let animationFrameId: number

    const update = () => {
      // 1. Récupérer les dimensions
      const containerRect = container.getBoundingClientRect()
      const logoRect = logo.getBoundingClientRect()
      
      const maxWidth = containerRect.width - logoRect.width
      const maxHeight = containerRect.height - logoRect.height
      
      let { x, y, dx, dy } = physics.current
      let hasBounced = false

      // 2. Calculer la nouvelle position
      x += dx
      y += dy

      // 3. Gérer les rebonds sur les bords
      // Rebond à droite
      if (x >= maxWidth) {
        x = maxWidth
        dx = -dx
        hasBounced = true
      } 
      // Rebond à gauche
      else if (x <= 0) {
        x = 0
        dx = -dx
        hasBounced = true
      }

      // Rebond en bas
      if (y >= maxHeight) {
        y = maxHeight
        dy = -dy
        hasBounced = true
      } 
      // Rebond en haut
      else if (y <= 0) {
        y = 0
        dy = -dy
        hasBounced = true
      }

      // 4. Mettre à jour les états
      physics.current = { x, y, dx, dy }
      setPosition({ x, y })

      // 5. Changer de couleur si rebond
      if (hasBounced) {
        setColorIndex((prev) => (prev + 1) % COLORS.length)
      }

      // 6. Boucle d'animation suivante
      animationFrameId = requestAnimationFrame(update)
    }

    // Lancer l'animation
    animationFrameId = requestAnimationFrame(update)

    // Nettoyage
    return () => cancelAnimationFrame(animationFrameId)
  }, []) // Le tableau vide [] assure que l'effet ne tourne qu'une fois au montage

  return (
    // Conteneur qui prend toute la place disponible
    <div 
      ref={containerRef} 
      className="absolute top-15 sm:top-18 inset-0 overflow-hidden pointer-events-none z-0"
      aria-hidden="true" // Cacher aux lecteurs d'écran car c'est décoratif
    >
      <div
        ref={logoRef}
        className={`absolute transition-colors duration-300 ${COLORS[colorIndex]}`}
        style={{
          // Utiliser transform pour une animation performante (GPU)
          transform: `translate(${position.x}px, ${position.y}px)`,
          // Will-change informe le navigateur d'optimiser cet élément
          willChange: 'transform',
        }}
      >
        {/* Votre Logo SVG. Ajustez la taille ici (w-40 par exemple) */}
        <LogoSvg className="w-36 sm:w-48 md:w-64 h-auto opacity-80" />
      </div>
    </div>
  )
}