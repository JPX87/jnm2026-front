'use client'; // Indispensable pour Three.js dans Next.js

import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html, OrbitControls } from '@react-three/drei';
import { FrontCard } from './Front';
import { BackCard } from './Back';
import { PartnerData } from './types';
import { Card } from './Card';


function MovingRectangle({ pointerX, pointerY, data }: { pointerX: number; pointerY: number; data: PartnerData }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  //bouger la card pour la faire load
  useFrame((state, delta) => {
    // On fait tourner le rectangle sur l'axe X et Y
    if (!meshRef.current) return;

    // Charge initiale de la rotation
    if (meshRef.current.rotation.y < 0.01) {
      meshRef.current.rotation.y += delta * 0.2;
    }

    // Rotation au survol de la souris - transition lisse
    meshRef.current.rotation.x += (pointerY * 0.1 - meshRef.current.rotation.x) * 0.1;
    meshRef.current.rotation.y += (pointerX * 0.1 - meshRef.current.rotation.y) * 0.1;
  });

  return (
    <mesh ref={meshRef}>
      <Html
        transform
        occlude
        position={[0, 0, 0.05]}
        scale={0.25}
      >
        <div className='scale-[4] select-none'><FrontCard data={data} /></div>
      </Html>

      <Html
        transform
        occlude
        position={[0, 0, 0]}
        rotation={[0, Math.PI, 0]}
        scale={0.252}
      >
        <div className='scale-[4] select-none'><Card /></div>
      </Html>

      <Html
        transform
        occlude
        position={[0, 0, -0.05]}
        rotation={[0, Math.PI, 0]}
        scale={0.25}
      >
        <div className='scale-[4] select-none'><BackCard data={data} /></div>
      </Html>
    </mesh>
  );
}

// 2. La Page principale
export function PartenaitCard({ data }: { data: PartnerData }) {
  const [pointerX, setPointerX] = useState(0);
  const [pointerY, setPointerY] = useState(0);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
    const clientWidth = rect.width;
    const clientHeight = rect.height;
    const x = (offsetX / clientWidth) * 2 - 1;
    const y = (offsetY / clientHeight) * 2 - 1;

    setPointerX(x);
    setPointerY(y);
  };

  return (
    <div
      className='relative z-10 w-full max-w-screen h-96 bg-transparent'
      onPointerMove={handlePointerMove}
    >
      <Canvas>
        <MovingRectangle pointerX={pointerX} pointerY={pointerY} data={data} />
        <OrbitControls
          enableZoom={false}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
          // Empêche de bouger la caméra
          enablePan={false}
        //enableRotate={false}
        />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.7} />
      </Canvas>
    </div>
  );
}