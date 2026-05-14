'use client'; // Indispensable pour Three.js dans Next.js

import { useRef, useState, useEffect } from 'react';
import { Canvas, ThreeEvent, useThree, useFrame } from '@react-three/fiber';
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
  rotationX,
  rotationY,
  trackerRef,
}: {
  data: PartnerData
  isZoomed: boolean
  onZoomChange: (zoomed: boolean) => void
  rotationX: number
  rotationY: number
  trackerRef: React.RefObject<HTMLDivElement | null>
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { viewport, size } = useThree();
  const [targetPos, setTargetPos] = useState<[number, number, number]>([0, 0, 0]);

  // Suit la position de la div invisible dans le HTML normal
  useFrame(() => {
    if (!isZoomed && trackerRef.current) {
      const rect = trackerRef.current.getBoundingClientRect();

      const pixelX = (rect.left + rect.width / 2) - size.width / 2;
      const pixelY = size.height / 2 - (rect.top + rect.height / 2); // Inversé sur l'axe Y en 3D

      const x = (pixelX / size.width) * viewport.width;
      const y = (pixelY / size.height) * viewport.height;

      setTargetPos([x, y, 0]);
    }
  });

  // Animation React Spring (Position, Scale & Rotation)
  const { position, scale, rotation } = useSpring({
    position: isZoomed ? [0, 0, 2] : targetPos,
    scale: isZoomed ? [1.5, 1.5, 1.5] : [1, 1, 1],
    rotation: isZoomed ? [rotationX, rotationY, 0] : [0, -0.001, 0],
    config: { mass: 1, tension: 170, friction: 20 },
  });

  // Empêcher l'event de fermer la carte si on clique dessus pendant le zoom
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (e.button === 0 && isZoomed) {
      e.stopPropagation();
    }
  };

  return (
    <a.mesh
      ref={meshRef}
      position={position as any}
      scale={scale as any}
      rotation={rotation as any}
      onClick={handleClick}
      onPointerOver={() => { if (isZoomed) document.body.style.cursor = 'grab'; }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; }}
    >
      {/* ⚠️ CRUCIAL : La hitbox 3D (invisible) */}
      <boxGeometry args={[4, 2.6, 0.2]} />
      <meshBasicMaterial transparent opacity={0} />

      {/* Faces de la carte HTML */}
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
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(3.14); // Commence face à l'utilisateur
  const [isDragging, setIsDragging] = useState(false);
  const previousPositionRef = useRef({ x: 0, y: 0 });
  const trackerRef = useRef<HTMLDivElement | null>(null);

  // Sensibilité de la rotation
  const rotationSensitivity = 0.01;

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

  // Clic en dehors de la carte pour dézoomer
  const handlePointerMissed = () => {
    if (isZoomed) {
      setIsZoomed(false);
      setRotationX(0);
      setRotationY(3.14);
    }
  };

  // Appui sur Échap pour dézoomer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isZoomed) {
        setIsZoomed(false);
        setRotationX(0);
        setRotationY(3.14);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isZoomed]);

  return (
    <>
      {/* Tracker : Div invisible dans le flux normal de la page qui donne la position au Canvas */}
      <div
        ref={trackerRef}
        className={`relative z-10 w-[359px] h-[230px] shrink-0 bg-transparent cursor-pointer ${className}`}
        onClick={() => !isZoomed && setIsZoomed(true)}
        aria-label="Zoomer sur la carte"
      />

      {/* Overlay global fixe contenant le Canvas */}
      <div
        className={`fixed inset-0 w-screen h-[100dvh] transition-all duration-300 ${isZoomed ? 'z-[100] pointer-events-auto' : 'z-10 pointer-events-none'
          }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{ touchAction: isZoomed ? 'none' : 'auto' }}
      >
        {/* Fond sombre activé lors du zoom */}
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-500 pointer-events-none ${isZoomed ? 'opacity-60' : 'opacity-0'
            }`}
        />

        <Canvas
          camera={{ position: [0, 0, 10], fov: 40 }}
          onPointerMissed={handlePointerMissed}
          style={{ pointerEvents: isZoomed ? 'auto' : 'none' }}
        >
          <MovingRectangle
            trackerRef={trackerRef}
            data={data}
            isZoomed={isZoomed}
            onZoomChange={setIsZoomed}
            rotationX={rotationX}
            rotationY={rotationY}
          />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={0.7} />
        </Canvas>
      </div>
    </>
  );
}