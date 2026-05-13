'use client'; // Indispensable pour Three.js dans Next.js

import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, ThreeEvent, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { useSpring, a } from '@react-spring/three';
import { FrontCard } from './Front';
import { BackCard } from './Back';
import { PartnerData } from './types';
import { Card } from './Card';

// ========== COMPOSANT MESH 3D ==========
function MovingRectangle({
  data,
  isZoomed,
  onZoomChange,
}: {
  data: PartnerData
  isZoomed: boolean
  onZoomChange: (zoomed: boolean) => void
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { viewport } = useThree();
  const [isDragging, setIsDragging] = useState(false);

  // Sensibilité de la rotation
  const rotationSensitivity = 0.01;

  // 1. Début du drag (Clic droit UNIQUEMENT)
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (e.button === 2) {
      e.stopPropagation();
      setIsDragging(true);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }
  };

  // 2. Mouvement (Drag)
  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (isDragging && meshRef.current) {
      e.stopPropagation();
      const movementX = e.movementX || 0;
      const movementY = e.movementY || 0;
      meshRef.current.rotation.y += movementX * rotationSensitivity;
      meshRef.current.rotation.x += movementY * rotationSensitivity;
    }
  };

  // 3. Fin du drag
  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    if (isDragging) {
      setIsDragging(false);
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    }
  };

  // Réinitialise la rotation à 0 quand on dézoome (retour en haut à droite)
  useEffect(() => {
    if (!isZoomed && meshRef.current) {
      meshRef.current.rotation.set(0, -0.001, 0);
    }
  }, [isZoomed]);

  // Calcul position en haut à droite
  const topRightPosition = useMemo(() => {
    const horizontalMargin = viewport.width * 0.12;
    const verticalMargin = viewport.height * 0.12;
    const x = (viewport.width / 2) - 0.5 - horizontalMargin;
    const y = (viewport.height / 2) - 0.5 - verticalMargin;
    return [x, y, 0] as [number, number, number];
  }, [viewport.width, viewport.height]);

  // Animation React Spring (Position & Scale)
  const { position, scale } = useSpring({
    position: isZoomed ? [0, 0, 2] : topRightPosition,
    scale: isZoomed ? [1.5, 1.5, 1.5] : [1, 1, 1],
    config: { mass: 1, tension: 170, friction: 20 },
  });

  // Gestionnaire de Zoom (Clic gauche UNIQUEMENT)
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (e.button === 0) {
      e.stopPropagation();
      onZoomChange(!isZoomed);
    }
  };

  return (
    <a.mesh
      ref={meshRef}
      position={position as any}
      scale={scale as any}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      // Sécurité : on annule le drag si la souris sort brutalement de l'écran
      onPointerOut={(e) => {
        document.body.style.cursor = 'auto';
        handlePointerUp(e);
      }}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
    >
      {/* ⚠️ CRUCIAL : La hitbox 3D (invisible) */}
      {/* Three.js a besoin d'une géométrie pour détecter les clics. */}
      {/* Ajuste les dimensions (2.5, 3.5, 0.2) selon la taille de tes composants HTML */}
      <boxGeometry args={[4, 2.6, 0.2]} />
      <meshBasicMaterial transparent opacity={0} />

      {/* Faces de la carte HTML (pointerEvents: 'none' empêche le HTML de bloquer le clic 3D) */}
      <Html transform occlude position={[0, 0, 0.05]} scale={0.125} wrapperClass="[&>div>div]:!pointer-events-none" style={{ pointerEvents: 'none' }}>
        <div className='scale-[4] select-none'>
          <FrontCard data={data} />
        </div>
      </Html>

      <Html transform occlude position={[0, 0, 0]} rotation={[0, Math.PI, 0]} scale={0.125} wrapperClass="[&>div>div]:!pointer-events-none" style={{ pointerEvents: 'none' }} >
        <div className='scale-[4] select-none'>
          <Card />
        </div>
      </Html>

      <Html transform occlude position={[0, 0, -0.05]} rotation={[0, Math.PI, 0]} scale={0.125} wrapperClass="[&>div>div]:!pointer-events-none" style={{ pointerEvents: 'none' }}>
        <div className='scale-[4] select-none'>
          <BackCard data={data} />
        </div>
      </Html>
    </a.mesh>
  );
}

// ========== COMPOSANT PAGE ==========
export function PartenaitCard({ data, className = "" }: { data: PartnerData; className?: string }) {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <div
      className={`absolute z-10 w-full max-w-screen h-96 bg-transparent ${className}`}
      // ⚠️ CRUCIAL : C'est ICI qu'on empêche le menu du clic droit d'apparaître
      onContextMenu={(e) => e.preventDefault()}
    >
      <Canvas camera={{ position: [0, 0, 10], fov: 40 }}>
        <MovingRectangle
          data={data}
          isZoomed={isZoomed}
          onZoomChange={setIsZoomed}
        />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.7} />
      </Canvas>
    </div>
  );
}