"use client";

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Float, Environment, useGLTF, Center, PresentationControls } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState, useMemo } from "react";
import { gsap } from "gsap";

const Shapes = () => {
  const hardwareList = [
    {
      url: "/3d/esp32-v1.glb",
      position: [0, 0, 0], // Center stage
      scale: 150,
      rotation: [Math.PI / 4, 4.5, 0]
    },
    {
      url: "/3d/breadboard.glb",
      position: [5.5, -1.5, -4], // Pushed slightly left to ensure it doesn't clip off-screen on mobile
      scale: 0.085, 
      rotation: [Math.PI / 6, -Math.PI / 4, 0]
    },
    {
      url: "/3d/led.glb",
      position: [-4.5, 2.8, 2], // Top left, pulled slightly forward
      scale: 0.1,
      rotation: [0, Math.PI / 2, 0]
    },
    {
      url: "/3d/resistor.glb",
      position: [-4.5, -2.5, 3], // Bottom left, pushed further down to clear the center space
      scale: 0.2,
      rotation: [Math.PI / 2, 0, Math.PI / 4]
    },
    {
      url: "/3d/ldr.glb",
      position: [3.5, 3.5, -1], // Top right, perfectly balancing the LED on the opposite corner
      scale: 150,
      rotation: [0.2, 0.5, 0]
    },
    {
      url: "/3d/jumper_wire.glb",
      position: [1.5, -4.5, 4], // Moved from the left to the bottom right-center to balance the resistor
      scale: 100,
      rotation: [0, 0, 0.5]
    }
  ];
  return (
    <div className="row-span-1 row-start-1 -mt-9 aspect-square md:col-span-1 md:col-start-2 md:mt-0">
      <Canvas
        className="z-0"
        gl={{ antialias: true }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 35], fov: 30, near: 1, far: 50 }} // Pulled camera back to fit everything
      >
        <Suspense fallback={null}>
          {/* Map through your array and render each component */}
          {hardwareList.map((item, index) => (
            <ElectronicPart
              key={index}
              url={item.url}
              position={item.position}
              scale={item.scale}
              initialRotation={item.rotation}
            />
          ))}

          <ContactShadows
            position={[0, -5, -2]} // Lowered slightly to account for the whole group
            opacity={0.65}
            scale={50} // Widened shadow area
            blur={1.5}
            far={15}
          />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Shapes;


const ElectronicPart = ({ url, position, scale, initialRotation }) => {
  const meshRef = useRef();
  const [visible, setVisible] = useState(false);

  // dynamically load the model
  const { scene } = useGLTF(url);

  // Setup the model shadows once
  const model = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  // Entrance Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      setVisible(true);
      const randomDelay = gsap.utils.random(0.2, 0.6); 
      
      gsap.from(meshRef.current.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1,
        ease: 'elastic.out(1,0.3)',
        delay: randomDelay
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <group position={position} ref={meshRef} visible={visible}>
      <Float 
        speed={gsap.utils.random(2, 4)} 
        rotationIntensity={gsap.utils.random(0.5, 1.5)} 
        floatIntensity={gsap.utils.random(0.5, 1.5)}
      >
        <PresentationControls
          global={false}
          cursor={true} 
          snap={{ mass: 2, tension: 250 }}
          speed={1.5}
          polar={[-Math.PI / 3, Math.PI / 3]} 
          azimuth={[-Math.PI / 1.5, Math.PI / 1.5]}
        >
          <Center>
            <group rotation={initialRotation}> 
              <primitive object={model} scale={scale} />
            </group>
          </Center>
        </PresentationControls>
      </Float>
    </group>
  );
};

// Preload all models to prevent stuttering on load
useGLTF.preload("/3d/esp32-v1.glb");
useGLTF.preload("/3d/breadboard.glb");
useGLTF.preload("/3d/led.glb");
useGLTF.preload("/3d/resistor.glb");
useGLTF.preload("/3d/ldr.glb");
useGLTF.preload("/3d/jumper_wire.glb");