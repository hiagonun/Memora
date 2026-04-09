"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, RoundedBox, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

function CalendarScene() {
  const groupRef = useRef<THREE.Group>(null);
  const squaresRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Gentle base rocking/balancing
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.15;
      groupRef.current.rotation.x = Math.cos(time * 0.6) * 0.05;
    }

    // Animate the grid of days "filling in" sequentially
    if (squaresRef.current) {
      squaresRef.current.children.forEach((square, idx) => {
        const mat = (square as THREE.Mesh).material as THREE.MeshStandardMaterial;
        
        // Offset each square's timing based on its index so they cascade
        const pulse = Math.sin(time * 2 - idx * 0.4);
        
        // If pulse > 0.8, it lights up
        if (pulse > 0.5) {
           mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, 2, 0.1);
           square.position.z = THREE.MathUtils.lerp(square.position.z, 0.15, 0.1);
           square.scale.setScalar(THREE.MathUtils.lerp(square.scale.x, 1.2, 0.1));
        } else {
           mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, 0, 0.1);
           square.position.z = THREE.MathUtils.lerp(square.position.z, 0.08, 0.1);
           square.scale.setScalar(THREE.MathUtils.lerp(square.scale.x, 1.0, 0.1));
        }
      });
    }
  });

  // Calendar physical dimensions
  const colSpacing = 0.7;
  const rowSpacing = 0.7;
  const cols = 4;
  const rows = 4;

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 10, 5]} intensity={2} color="#ffffff" />
      <directionalLight position={[-5, -10, -5]} intensity={1} color="#0ea5e9" />

      <Float speed={2} rotationIntensity={0.2} floatIntensity={1}>
        <group ref={groupRef} rotation={[0.1, -0.4, 0]}>
          
          {/* Main Glass Backplate of the Calendar */}
          <RoundedBox args={[3.2, 4, 0.2]} radius={0.2} smoothness={4} position={[0, -0.2, 0]}>
            <MeshTransmissionMaterial 
               backside
               backsideThickness={1}
               roughness={0.1}
               transmission={1}
               thickness={0.5}
               ior={1.4}
               resolution={256}
               chromaticAberration={0.06}
               color="#082f49" // Very deep rich blue
            />
          </RoundedBox>

          {/* Calendar Top Banner (Metal/Sky Blue piece) */}
          <RoundedBox args={[3.2, 0.8, 0.3]} radius={0.15} smoothness={4} position={[0, 1.6, 0.05]}>
            <meshStandardMaterial color="#0ea5e9" roughness={0.2} metalness={0.4} />
          </RoundedBox>
          
          {/* Calendar Bindings (Rings on top) */}
          {[-1, 0, 1].map((x) => (
             <mesh key={x} position={[x, 2, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.15, 0.04, 16, 32]} />
                <meshStandardMaterial color="#e4e4e7" metalness={0.8} roughness={0.1} />
             </mesh>
          ))}

          {/* The Days (Grid of Squares) */}
          <group ref={squaresRef}>
            {Array.from({ length: rows * cols }).map((_, i) => {
               // Calculate x, y positions starting from top-left
               const col = i % cols;
               const row = Math.floor(i / cols);
               
               const x = (col - (cols - 1) / 2) * colSpacing;
               const y = ((rows - 1) / 2 - row) * rowSpacing - 0.3; // shifted down to fit below the banner

               return (
                 <RoundedBox 
                   key={i} 
                   args={[0.45, 0.45, 0.1]} 
                   radius={0.08} 
                   smoothness={2} 
                   position={[x, y, 0.08]}
                 >
                   <meshStandardMaterial 
                     color="#1e293b" 
                     emissive="#38bdf8" 
                     emissiveIntensity={0} // Will be animated
                     roughness={0.2}
                   />
                 </RoundedBox>
               );
            })}
          </group>

        </group>
      </Float>

      <Environment preset="city" />
    </>
  );
}

export function Calendar3D() {
  return (
    <div className="absolute inset-0 z-0 h-full w-full opacity-60 mix-blend-screen transition-opacity duration-700 hover:opacity-100">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 8.5], fov: 45 }}>
        <CalendarScene />
      </Canvas>
    </div>
  );
}
