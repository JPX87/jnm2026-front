'use client'; // Indispensable pour Three.js dans Next.js

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html, OrbitControls, RoundedBoxGeometry } from '@react-three/drei';
import { FrontCard } from './Front';
import { BackCard } from './Back';

const CodeBlock = ({ title, code }: { title: string, code: string }) => (
  <div style={{
    background: '#ffd5df', // Fond style VS Code
    color: '#ef6a9f',
    padding: '20px',
    borderRadius: '20px',
    width: '250px',
    height: '150px',
    fontFamily: 'monospace',
    fontSize: '12px',
    //border: '2px solid #ef6a9f', // Bordure bleue
    userSelect: 'none', // Empêche de sélectionner le texte en tournant
  }}>
    <h3 style={{ margin: '0 0 10px 0', color: '#ef6a9f' }}>{title}</h3>
    <pre style={{ margin: 0 }}>
      <code>{code}</code>
    </pre>
  </div>
);


function MovingRectangle() {
  const meshRef = useRef<THREE.Mesh>(null!);

  // useFrame est l'équivalent de la boucle "animate" dans Three.js pur
  // Cela s'exécute 60 fois par seconde
  useFrame((state, delta) => {
    // On fait tourner le rectangle sur l'axe X et Y
    //meshRef.current.rotation.y += delta * 0.2;
  });

  return (
    <mesh ref={meshRef}>
      <RoundedBoxGeometry args={[7.82, 4.94, 0.1]} radius={0.2} smoothness={1} />
      <meshStandardMaterial
        color="#ffd5df"
        side={THREE.DoubleSide}
        roughness={0.03} // Un peu de brillance pour voir les reflets sur les bords
        metalness={0.1} // Optionnel : donne un aspect plus solide
      />
      //ffd5df

      <Html
        transform // Rend le HTML "3D" (il suit la perspective)
        occlude   // Le HTML se cache s'il est derrière un objet
        position={[0, 0, 0.2]}
        scale={0.25}

      >
        <div className='scale-[4] select-none'><FrontCard /></div>
      </Html>

      {/*<mesh position={[0, 0, 0.9]}> // Légèrement devant le HTML
        <planeGeometry args={[7.84, 4.96]} />
        <meshPhysicalMaterial
          transparent={true}
          opacity={0.8}         // Très léger pour voir le texte derrière
          roughness={0.1}       // Surface lisse = reflets nets
          metalness={0.0}
          transmission={0.5}    // Effet vitre
          thickness={0.1}       // Épaisseur optique
          clearcoat={1}         // Le secret du look "plastique brillant"
          clearcoatRoughness={0}
        />
      </mesh>*/}

      <Html
        transform
        occlude
        position={[0, 0, -0.21]}
        rotation={[0, Math.PI, 0]}
        scale={0.25}
      >
        <div className='scale-[4] select-none'><BackCard /></div>
      </Html>
    </mesh >
  );
}

// 2. La Page principale
export function PartenaitCard() {
  return (
    <div className='relative z-10 w-full max-w-screen h-96 bg-transparent'>
      {/*<FrontCard />
      <BackCard />*/}
      <Canvas>
        <MovingRectangle />
        <OrbitControls
        /*enableZoom={false}       // Optionnel : empêche le zoom
        minPolarAngle={Math.PI / 2} // Bloque la vue vers le haut
        maxPolarAngle={Math.PI / 2} // Bloque la vue vers le bas */
        />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.7} />
      </Canvas>
    </div>
  );
}