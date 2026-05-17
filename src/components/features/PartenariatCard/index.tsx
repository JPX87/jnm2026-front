'use client'; // Indispensable pour Three.js dans Next.js

import { useRef, useState, useEffect } from 'react';
import { Canvas, ThreeEvent, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Html, RoundedBox } from '@react-three/drei';
import { useSpring, a } from '@react-spring/three';
import { useTheme } from "next-themes";
import { FrontCard } from './Front';
import { BackCard } from './Back';
import { PartnerData } from './types';

// Proportions exactes de la carte HTML (314x200) pour synchronisation parfaite
const MESH_WIDTH = 250;
const MESH_HEIGHT = MESH_WIDTH * (200 / 314);
const HTML_SCALE = MESH_WIDTH / 3140;
const MESH_DEPTH = 1.5; // Épaisseur cohérente (environ 1% de la largeur)
const BORDER_RADIUS = MESH_WIDTH * (8 / 314); // Arrondi correspondant au 'rounded-lg' de Tailwind

// ========== COMPOSANT MESH 3D ==========
function MovingRectangle({
  data,
  isZoomed,
  rotationX,
  rotationY,
  domRect,
  onAnimationComplete,
}: {
  data: PartnerData
  isZoomed: boolean
  rotationX: number
  rotationY: number
  domRect: DOMRect | null
  onAnimationComplete: () => void
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const { viewport, size } = useThree();

  // Calcule la position 3D et l'échelle exacte en fonction de la div HTML
  const getTarget = () => {
    if (!domRect) return { pos: [0, 0, 0], scale: [1, 1, 1] };
    const pixelX = (domRect.left + domRect.width / 2) - size.width / 2;
    const pixelY = size.height / 2 - (domRect.top + domRect.height / 2);
    const x = (pixelX / size.width) * viewport.width;
    const y = (pixelY / size.height) * viewport.height;
    const s = (domRect.width * viewport.width) / (MESH_WIDTH * size.width) * 100; // Échelle parfaite avec le HTML
    return { pos: [x, y, 0], scale: [s, s, s] };
  };

  const target = getTarget();

  // Calcule l'échelle de zoom dynamique pour s'adapter aux petits écrans (mobile/paysage)
  const maxZoomWidth = (viewport.width * 0.9) / (MESH_WIDTH / 100); // 90% de la largeur de l'écran
  const maxZoomHeight = (viewport.height * 0.8) / (MESH_HEIGHT / 100); // 80% de la hauteur de l'écran
  const zoomScaleValue = Math.min(15, maxZoomWidth, maxZoomHeight);

  // Animation React Spring (Position, Scale & Rotation)
  const { position, scale, rotation } = useSpring({
    from: {
      position: target.pos,
      scale: target.scale,
      rotation: [0, 0, 0]
    },
    to: {
      position: isZoomed ? [0, 0, 2] : target.pos,
      scale: isZoomed ? [zoomScaleValue, zoomScaleValue, zoomScaleValue] : target.scale,
      rotation: isZoomed ? [rotationX, rotationY, 0] : [0, 0, 0],
    },
    config: { mass: 1, tension: 170, friction: 20 },
    onRest: (result) => {
      if (!isZoomed && result.finished) {
        onAnimationComplete(); // Démonte le Canvas une fois l'animation de retour terminée
      }
    }
  });

  // Empêcher l'event de fermer la carte si on clique dessus pendant le zoom
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (e.button === 0 && isZoomed) {
      e.stopPropagation();
    }
  };

  return (
    <a.group
      ref={groupRef}
      position={position as any}
      scale={scale as any}
      rotation={rotation as any}
      onClick={handleClick}
      onPointerOver={() => { if (isZoomed) document.body.style.cursor = 'grab'; }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; }}
    >
      {/* Épaisseur 3D de la carte avec bords arrondis */}
      <RoundedBox args={[MESH_WIDTH / 100, MESH_HEIGHT / 100, MESH_DEPTH / 100]} radius={BORDER_RADIUS / 100} smoothness={4}>
        <meshStandardMaterial color="#ffd5df" roughness={0.3} />
      </RoundedBox>

      {/* Faces de la carte HTML */}
      <Html transform position={[0, 0, 0.01]} scale={HTML_SCALE} wrapperClass="[&>div>div]:!pointer-events-none" style={{ pointerEvents: 'none' }}>
        <div className='scale-[4] select-none'>
          <FrontCard data={data} />
        </div>
      </Html>

      <Html transform position={[0, 0, -0.01]} rotation={[0, Math.PI, 0]} scale={HTML_SCALE} wrapperClass="[&>div>div]:!pointer-events-none" style={{ pointerEvents: 'none' }}>
        <div className='scale-[4] select-none'>
          <BackCard data={data} />
        </div>
      </Html>
    </a.group>
  );
}

// ========== COMPOSANT PAGE ==========
export function PartenaitCard({ data, className = "" }: { data: PartnerData; className?: string }) {
  const [isOpen, setIsOpen] = useState(false); // Gère le montage du Canvas (optimisation extrême)
  const [isOpenLoading, setIsOpenLoading] = useState(false); // Gère le délai de transition pour éviter les flashs du Canvas
  const [isClosing, setIsClosing] = useState(false); // Gère le z-index pour passer derrière le header au dézoom
  const [isZoomed, setIsZoomed] = useState(false);
  const [domRect, setDomRect] = useState<DOMRect | null>(null);

  const [rotationX, setRotationX] = useState(-0.3);
  const [rotationY, setRotationY] = useState(-.2);
  const [isDragging, setIsDragging] = useState(false);
  const previousPositionRef = useRef({ x: 0, y: 0 });
  const trackerRef = useRef<HTMLDivElement | null>(null);

  const { resolvedTheme: currentTheme } = useTheme();

  // Sensibilité de la rotation
  const rotationSensitivity = 0.01;

  // Bloque le défilement de la page (scroll) pendant TOUTE la durée de l'ouverture et de l'animation
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Gestion du drag/tactile pour la rotation
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isZoomed) return;
    setIsDragging(true);
    previousPositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !isZoomed) return;

    const deltaX = e.clientX - previousPositionRef.current.x;
    const deltaY = e.clientY - previousPositionRef.current.y;

    // Rotation en fonction du mouvement
    setRotationY(prevY => prevY + deltaX * rotationSensitivity);
    setRotationX(prevX => prevX + deltaY * rotationSensitivity);

    previousPositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Remet la carte parfaitement de face
  const handleResetRotation = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRotationX(-0.01);
    setRotationY(0);
  };

  // Fait tourner la carte de 180° (Math.PI) sur l'axe Y à partir de sa position actuelle
  const handleFlipCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRotationX(-0.01);
    setRotationY(prev => prev + Math.PI);
  };

  // Clic pour ouvrir
  const handleOpen = () => {
    if (!isZoomed && trackerRef.current) {
      setIsClosing(false); // S'assure qu'on passe au-dessus du header à l'ouverture
      setDomRect(trackerRef.current.getBoundingClientRect());
      setIsOpen(true); // Monte le WebGL Canvas
      setIsOpenLoading(true)
      // Délai ultra court pour laisser le Canvas se positionner sur la carte HTML avant d'animer
      setTimeout(() => setIsZoomed(true), 70);
      setTimeout(() => setIsOpenLoading(false), 120);
    }
  };

  const closeCard = () => {
    setIsClosing(true); // Indique qu'on recule le calque pour glisser derrière le header
    // Met à jour la position au cas où la page aurait été scrollée en fond
    setDomRect(trackerRef.current?.getBoundingClientRect() || null);
    setIsZoomed(false);
    setRotationX(-0.3);
    setRotationY(-.2);
    document.body.style.cursor = 'auto';
  };

  // Clic en dehors de la carte pour dézoomer
  const handlePointerMissed = () => {
    if (isZoomed && trackerRef.current) closeCard();
  };

  // Appui sur Échap pour dézoomer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isZoomed && trackerRef.current) closeCard();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isZoomed]);

  return (
    <>
      {/* Version DOM standard (Performance max, 0 WebGL) */}
      <div
        ref={trackerRef}
        className={`relative z-10 w-[314px] h-[200px] shrink-0 bg-transparent cursor-pointer flex items-center justify-center ${className}`}
        onClick={handleOpen}
        aria-label="Zoomer sur la carte"
      >
        <div className={`select-none transition-opacity transition-transform duration-100  ${isOpen && !isOpenLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <FrontCard data={data} />
        </div>
      </div>

      {/* Overlay 3D monté UNIQUEMENT lors de l'interaction */}
      {isOpen && (
        <div
          className={`fixed inset-0 w-screen h-[100dvh] transition-all duration-300 ${isClosing ? 'z-10' : 'z-[100]'
            } ${isZoomed ? 'pointer-events-auto' : 'pointer-events-none'}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          style={{ touchAction: isZoomed ? 'none' : 'auto' }}
        >
          {/* Fond sombre */}
          <div className={`absolute inset-0 bg-black transition-opacity duration-500 pointer-events-none ${isZoomed ? 'opacity-60' : 'opacity-0'}`} />

          {/* Boutons de contrôle (Visibles uniquement si zoomé) */}
          <div
            className={`absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 flex gap-4 transition-opacity duration-300 z-[110] ${isZoomed ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            onPointerDown={(e) => e.stopPropagation()} // Empêche de déclencher la rotation 3D quand on clique sur la zone
          >
            <button
              onClick={handleResetRotation}
              className="px-4 sm:px-6 py-2 bg-white/10 hover:bg-white/20 text-white text-sm sm:text-base backdrop-blur-md border border-white/20 rounded-full font-medium transition-colors shadow-lg cursor-pointer"
            >
              De face
            </button>
            <button
              onClick={handleFlipCard}
              className="px-4 sm:px-6 py-2 bg-white/10 hover:bg-white/20 text-white text-sm sm:text-base backdrop-blur-md border border-white/20 rounded-full font-medium transition-colors shadow-lg, cursor-pointer"
            >
              Retourner
            </button>
          </div>

          <Canvas
            camera={{ position: [0, 0, 50], fov: 40 }}
            onPointerMissed={handlePointerMissed}
            style={{ pointerEvents: isZoomed ? 'auto' : 'none' }}
          >
            <MovingRectangle
              domRect={domRect}
              data={data}
              isZoomed={isZoomed}
              rotationX={rotationX}
              rotationY={rotationY}
              onAnimationComplete={() => {
                setIsOpen(false);
                setIsClosing(false);
              }} // Démonte le WebGL
            />
            <ambientLight intensity={currentTheme === 'dark' ? 0 : 10} />
            <directionalLight position={[5, 5, 5]} intensity={0.7} />
          </Canvas>
        </div>
      )}
    </>
  );
}