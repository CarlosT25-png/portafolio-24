"use client";

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Float, Environment } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { gsap } from "gsap/gsap-core";

const Shapes = () => {
  return (
    <div className="row-span-1 row-start-1 -mt-9 aspect-square md:col-span-1 md:col-start-2 md:mt-0">
      <Canvas
        className="z-0"
        gl={{ antialias: false }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 25], fov: 30, near: 1, far: 40 }}
      >
        <Suspense fallback={null}>
          <Geometries />
          <ContactShadows
            position={[0, -3.5, 0]}
            opacity={0.65}
            scale={40}
            blur={1}
            far={9}
          />
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Shapes;


const Geometries = () => {
  const geometries = [
    {
      position: [0, 0, 0],
      r: 0.3,
      geometry: new THREE.IcosahedronGeometry(3)  // GEM
    },
    {
      position: [1, -0.75, 4],
      r: 0.4,
      geometry: new THREE.CapsuleGeometry(0.5, 1.6, 2, 16)  // PILL
    },
    {
      position: [-1.3, 2, -4],
      r: 0.6,
      geometry: new THREE.DodecahedronGeometry(1.5)  // SOCCER BALL
    },
    {
      position: [-0.8, -0/75, 6],
      r: 0.5,
      geometry: new THREE.TorusGeometry(0.6, 0.25, 16, 32)  // DONUT
    },
    {
      position: [1.6, 1.6, -4],
      r: 0.7,
      geometry: new THREE.OctahedronGeometry(1.5)  // DIAMOND
    }
  ]

  const materials = [
    new THREE.MeshStandardMaterial({ color: 0xED4C67, roughness: 0, metalness: 0.3}),
    new THREE.MeshStandardMaterial({ color: 0xC4E538, roughness: 0, metalness: 0.3}),
    new THREE.MeshStandardMaterial({ color: 0xF79F1F, roughness: 0.3, metalness: 0.5}),
    new THREE.MeshStandardMaterial({ color: 0x009432, roughness: 0.1, metalness: 0.3}),
    new THREE.MeshStandardMaterial({ color: 0x0652DD, roughness: 0.1, metalness: 0.3}),
  ]

  const soundsEffects = [
    new Audio('/sounds/knock1.ogg'),
    new Audio('/sounds/knock2.ogg')
  ]

  // PASS TO GEOMETRY
  return geometries.map(({position, r, geometry}) => (
    <Geometry 
      key={JSON.stringify(position)}
      position={position.map(p => p*2)}
      soundsEffects={soundsEffects}
      geometry={geometry}
      materials={materials}
      r={r}
    />
  ))

}

const Geometry = ({r, position, geometry, materials, soundsEffects}) => {
  const meshRef = useRef()
  const [visible, setVisible] = useState(false)

  const getRandomMaterial = () => {
    return gsap.utils.random(materials)
  }

  const startingMaterial = getRandomMaterial()


  const handleClick = (e) => {
    const mesh = e.object

    gsap.utils.random(soundsEffects).play()

    gsap.to(mesh.rotation, {
      x:  `+=${gsap.utils.random(0, 2)}`,
      y:  `+=${gsap.utils.random(0, 2)}`,
      z:  `+=${gsap.utils.random(0, 2)}`,
      duration: 1.3,
      ease: "elastic.out(1,0.3)",
      yoyo: true
    })

    mesh.material = getRandomMaterial()
  }

  const handlePointerOver = () => {
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = () => {
    document.body.style.cursor = 'default'
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      setVisible(true)
      gsap.from(meshRef.current.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1,
        ease: 'elastic.out(1,0.3)',
        delay: .3
      })
    })

    return () => ctx.revert()
  }, [])

  return <group position={position} ref={meshRef}>
    <Float speed={5 * r}  rotationIntensity={6 * r} floatIntensity={5 * r}>
      <mesh
      geometry={geometry}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      visible={visible}
      material={startingMaterial}
      />
    </Float>
  </group>
}