"use client";

import { useRef, useEffect } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial, Sparkles, OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";

/**
 * 3D Component: A "Neural Core" (Torus Knot)
 * It represents intertwined paths of memory, wrapped in liquid glass.
 * Now optimized to live inside the side-window.
 */
function MemoryCore({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
  const knotRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const scrollY = scrollRef.current;
    // Map a scroll range of 0 to 400px for window interaction
    const progress = Math.min(Math.max(scrollY / 400, 0), 1);
    
    const time = state.clock.getElapsedTime();
    
    if (knotRef.current) {
      // Base complex abstract rotation
      knotRef.current.rotation.x = time * 0.15;
      knotRef.current.rotation.y = time * 0.2;
      
      // PARALLAX INTERACTION (Side Window Mode):
      // As the user scrolls down, the knot spins rapidly,
      // scales down slightly to look further away, and the pulse increases.
      knotRef.current.rotation.z = time * 0.1 + progress * Math.PI; // Full half-spin on scroll
      
      const scaleBase = 1.1 - (progress * 0.3); // Scales down from 1.1 to 0.8
      const pulse = Math.sin(time * 3) * (0.02 + progress * 0.05); // Pulses harder with scroll
      knotRef.current.scale.setScalar(scaleBase + pulse);
    }

    if (glowRef.current) {
      // The inner light intensifies drastically with scroll down
      glowRef.current.intensity = 1.5 + progress * 7;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={2} color="#ffffff" />
      <directionalLight position={[-5, -10, -5]} intensity={1} color="#0ea5e9" />

      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1.5}>
        <group>
          {/* Inner Light Core */}
          <pointLight ref={glowRef} position={[0, 0, 0]} color="#38bdf8" intensity={1.5} distance={10} />
          
          <mesh ref={knotRef}>
            {/* The infinite intertwined network of memory */}
            <torusKnotGeometry args={[1.2, 0.45, 256, 64, 3, 5]} />
            
            {/* Liquid Glass Material */}
            <MeshTransmissionMaterial 
              backside
              backsideThickness={1}
              thickness={1.5}
              roughness={0}
              transmission={1}
              ior={1.5}
              resolution={256}
              chromaticAberration={0.05}
              anisotropy={0.2}
              distortion={0.3}
              distortionScale={0.4}
              temporalDistortion={0.1}
              color="#f0f9ff"
            />
          </mesh>
        </group>
      </Float>

      {/* Floating data particles */}
      <Sparkles 
        count={80} 
        scale={8} 
        size={3} 
        speed={0.4} 
        opacity={0.8} 
        color="#bae6fd"
        noise={10}
      />

      {/* Provide HDR lighting WITHOUT background — keeps canvas transparent */}
      <Environment preset="city" background={false} />
    </>
  );
}

export function NeuralBrain() {
  const { scrollY } = useScroll();
  const scrollRef = useRef<number>(0);

  // Sync scroll without constant re-renders
  useEffect(() => {
    return scrollY.on("change", (latest) => {
      scrollRef.current = latest;
    });
  }, [scrollY]);

  // Glow halo scales and brightens slightly inside the window bounds
  const bgOpacity = useTransform(scrollY, [0, 400], [0.15, 0.5]);
  const bgScale = useTransform(scrollY, [0, 400], [0.8, 1.2]);

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-visible bg-transparent">
      
      {/* 2D Background Bloom Light tied to scroll */}
      <motion.div
        style={{ opacity: bgOpacity, scale: bgScale }}
        className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500 blur-[100px] will-change-transform pointer-events-none"
      />

      {/* R3F Interactive Canvas - transparent background so model floats on LP */}
      <div className="absolute inset-0 z-10">
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 0, 8.5], fov: 45 }}
          gl={{ alpha: true, antialias: true }}
          style={{ background: "transparent" }}
        >
          <MemoryCore scrollRef={scrollRef} />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            autoRotate 
            autoRotateSpeed={0.5} 
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 3}
          />
        </Canvas>
      </div>
    </div>
  );
}
