import { Environment, OrbitControls, Sky, Trail, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

import React, { useRef, useMemo, useState } from 'react';

function Box() {
  const meshRef = useRef<any>([1,1,1]);

  useFrame(() => {
    if (!meshRef.current) return;
    //meshRef.current.rotation.x += 0.01;
    meshRef.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

interface WindParticlesProps {
  count?: number; // Nombre de particules
  rangeX?: number; // Largeur de la zone
  rangeY?: number; // Hauteur de la zone
  rangeZ?: number; // Profondeur de la zone
  vitesse?: number; // Vitesse
  color?: string;
}

const WindParticles: React.FC<WindParticlesProps> = ({ 
  count = 1000, 
  rangeX = 1000,  // Valeur par défaut : 20 unités de large
  rangeY = 1000, 
  rangeZ = 1000,
  vitesse = 10,
  color = "#EF6A9F"
}) => {
  const pointsRef = useRef<THREE.Points>(null!);

  // 2. Utilisation des props pour la génération initiale
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // (Math.random() - 0.5) * range permet de centrer la zone sur 0
      // Ex: si rangeX = 20, on va de -10 à +10
      positions[i * 3]     = (Math.random() - 0.5) * rangeX; 
      positions[i * 3 + 1] = (Math.random() - 0.5) * rangeY; 
      positions[i * 3 + 2] = (Math.random() - 0.5) * rangeZ; 
    }
    return positions;
  }, [count, rangeX, rangeY, rangeZ]); // On recrée si les props changent

  useFrame(() => {
    if (!pointsRef.current) return;

    const positionAttribute = pointsRef.current.geometry.attributes.position;
    const array = positionAttribute.array as Float32Array; 

    // Limite à droite (la moitié de la largeur totale)
    const rightBound = rangeX / 2;
    const leftBound = -rangeX / 2;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Mouvement vers la droite
      array[i3] += vitesse; 

      // 3. Reset dynamique basé sur la taille de la zone
      if (array[i3] > rightBound) {
        array[i3] = leftBound; // On téléporte tout à gauche
        
        // Optionnel : On randomise à nouveau Y et Z pour varier quand ça réapparaît
        // Cela évite que la particule suive toujours la même ligne
        array[i3 + 1] = (Math.random() - 0.5) * rangeY;
        array[i3 + 2] = (Math.random() - 0.5) * rangeZ;
      }
    }

    positionAttribute.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particlesPosition, 3]} 
        />
      </bufferGeometry>
      <pointsMaterial size={2} color={color} sizeAttenuation={true} />
    </points>
  );
};

function Model() {
    const { scene } = useGLTF("/models/JNM_airplane_v2_L2.glb"); // fichier dans /public/models
    const ref = useRef<any>([1,1,1]);
    const defaultRotate = [-(Math.PI/2), 0.02, Math.PI/2]
    const defaultPosition = [0, -100, 0]


    /*useFrame(() => {
        if (!ref.current) return;

        ref.current.rotation.z += 0.01;
        // ref.current.rotation.x += 0.01;
        // ref.current.position.x += Math.sin(Date.now() * 0.001) * 0.01;

        console.log(ref.current.rotation.z)
    });*/

    /*useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        const rotation = ref.current.rotation
        //ref.current.position.y = Math.sin(t * 2) * 0.4;
        //ref.current.position.z = Math.cos(t * 2) * 0.2;
        rotation.z = Math.sin(t * 2) * 0.1  + defaultRotate[2]; // droite / gauche
        rotation.x = Math.cos(t * 1.5) * 0.2 + defaultRotate[0]; // monte / descend

        console.log(`x: ${rotation.x}`)
    });*/

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();

        // turbulences irrégulières
        ref.current.position.y = Math.sin(t * 3) * 2 + Math.sin(t * 13) * 0.05  + defaultPosition[1];
        ref.current.position.x = Math.cos(t * 2) * 0.15  + defaultPosition[0];

        //ref.current.position.z = Math.cos(t * 0.1) + defaultRotate[2];

        // micro-oscillation sur l'orientation
        ref.current.rotation.z = Math.sin(t * 0.5) * 0.05 + defaultRotate[2];
        ref.current.rotation.x = Math.cos(t * 0.5) * 0.1 + defaultRotate[0];
    });



  scene.traverse((obj) => {
    obj.frustumCulled = false;
  });

  return <primitive
        ref={ref}
        object={scene}
        position={defaultPosition}   // x, y, z
        rotation={defaultRotate}  // rotation en radians
        scale={[0.2, 0.2, 0.2]}      // agrandissement
    />;
}

export default function Scene() {
  return (
    <Canvas camera={{ near: 0.1, far: 5000,  position: [-300, 200, 500] }} style={{height: "100SVH", backgroundColor: "#FFF8F3"}}>
        <Environment preset="sunset" />
        {/*<ambientLight /> */}
        <OrbitControls />
        <Model />
        {/*<Sky sunPosition={[50, 20, 100]} /> */}
        <WindParticles /> 
    </Canvas>
  );
}
