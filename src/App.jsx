import React, { Suspense } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { useState, useRef } from 'react'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { useControls } from 'leva'

import './styles.css'

const name = (type) => `earth_1k_${type}.jpg`

function Globe({ lat, long }) {
  const [colorMap, displacementMap, normalMap, roughnessMap, aoMap] = useLoader(TextureLoader, [
    name('Color'),
    name('Displacement'),
    // name('Normal'),
    // name('Roughness'),
    // name('AmbientOcclusion'),
  ])
  return (
    <>
      <ambientLight intensity={2} />
      <directionalLight />
      <mesh>
        {/* Width and height segments for displacementMap */}
        <sphereGeometry args={[1, 100, 100]} />
        <meshStandardMaterial
          displacementScale={0.02}
          map={colorMap}
          displacementMap={displacementMap}
          // normalMap={normalMap}
          // roughnessMap={roughnessMap}
          // aoMap={aoMap}
        />
      </mesh>

      <group rotation-y={1.61}>
        <group rotation-x={0.71}>
          <group
            position={[0, 1.2, 0]}
            rotation={[0, Math.PI / 2, 0]}>
            <Marker rotation={[0, Math.PI, 0]}>
              <div style={{ position: 'absolute', fontSize: 10, letterSpacing: -0.5, left: 17.5 }}>Belgium</div>
              <FaMapMarkerAlt style={{ color: 'indianred' }} />
            </Marker>
          </group>
        </group>
      </group>
    </>
  )
}

// Let's make the marker into a component so that we can abstract some shared logic
function Marker({ children, ...props }) {
  const ref = useRef()
  // This holds the local occluded state
  const [isOccluded, setOccluded] = useState()
  const [isInRange, setInRange] = useState()
  const isVisible = isInRange && !isOccluded
  // Test distance
  const vec = new THREE.Vector3()
  useFrame((state) => {
    const range = state.camera.position.distanceTo(ref.current.getWorldPosition(vec)) <= 10
    if (range !== isInRange) setInRange(range)
  })
  return (
    <group ref={ref}>
      <Html
        // 3D-transform contents
        transform
        // Hide contents "behind" other meshes
        occlude
        // Tells us when contents are occluded (or not)
        onOcclude={setOccluded}
        // We just interpolate the visible state into css opacity and transforms
        style={{ transition: 'all 0.2s', opacity: isVisible ? 1 : 0, transform: `scale(${isVisible ? 1 : 0.25})` }}
        {...props}>
        {children}
      </Html>
    </group>
  )
}

export default function App() {
  // const { lat, long } = useControls({
  //   lat: {
  //     label: 'Latitude',
  //     value: 0,
  //     min: -Math.PI / 2,
  //     max: Math.PI / 2,
  //     step: 0.01,
  //   },
  //   long: {
  //     label: 'Longitude',
  //     value: 0,
  //     min: -Math.PI,
  //     max: Math.PI,
  //     step: 0.01,
  //   },
  // })
  return (
    <div className='App'>
      <Canvas>
        <Suspense fallback={null}>
          {/* <Globe {...{ lat, long }} />` */}
          <Globe />`
          <OrbitControls />
        </Suspense>
      </Canvas>
    </div>
  )
}
