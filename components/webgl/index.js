import { Float, useGLTF } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useFrame as useRaf } from '@darkroom.engineering/hamo'
import { useScroll } from 'hooks/use-scroll'
import { mapRange } from 'lib/maths'
import { useStore } from 'lib/store'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import {
  Color,
  DoubleSide,
  Euler,
  MathUtils,
  MeshPhysicalMaterial,
  Vector2,
  Vector3,
} from 'three'
import fragmentShader from './particles/fragment.glsl'
import vertexShader from './particles/vertex.glsl'

function Raf({ render = true }) {
  const { advance } = useThree()

  useRaf((time) => {
    if (render) {
      advance(time / 1000)
    }
  })
}

function Particles({
  width = 250,
  height = 250,
  depth = 250,
  count = 1000,
  scale = 100,
  size = 100,
}) {
  const positions = useMemo(() => {
    const array = new Array(count * 3)

    for (let i = 0; i < array.length; i += 3) {
      array[i] = MathUtils.randFloatSpread(width)
      array[i + 1] = MathUtils.randFloatSpread(height)
      array[i + 2] = MathUtils.randFloatSpread(depth)
    }

    return Float32Array.from(array)
  }, [count, scale, width, height, depth])

  const noise = useMemo(
    () =>
      Float32Array.from(
        Array.from({ length: count * 3 }, () => Math.random() * 100)
      ),
    [count]
  )

  const sizes = useMemo(
    () =>
      Float32Array.from(
        Array.from({ length: count }, () => Math.random() * size)
      ),
    [count, size]
  )

  const speeds = useMemo(
    () =>
      Float32Array.from(
        Array.from({ length: count }, () => Math.random() * 0.2)
      ),
    [count]
  )

  const scales = useMemo(
    () =>
      Float32Array.from(
        Array.from({ length: count }, () => Math.random() * 100)
      ),
    [count]
  )

  const particleMaterialRef = useRef() // Renamed to avoid conflict with global material
  const points = useRef()

  const uniforms = useMemo(
    () => ({
      uTime: {
        value: 0,
      },
      uColor: {
        value: new Color('rgb(219, 255, 206)'),
      },
      uScroll: {
        value: 0,
      },
      uResolution: {
        value: new Vector2(width, height),
      },
    }),
    []
  )

  useEffect(() => {
    uniforms.uResolution.value.set(width, height)
  }, [width, height])

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.elapsedTime
  })

  useScroll(({ scroll }) => {
    uniforms.uScroll.value = scroll
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-noise" args={[noise, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-speed" args={[speeds, 1]} />
        <bufferAttribute attach="attributes-scale" args={[scales, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={particleMaterialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        uniforms={uniforms}
      />
    </points>
  )
}

const steps = [
  {
    position: [-0.1, -1.75, 0],
    scale: 0.045,
    rotation: [0, Math.PI * 0.5, 0],
    type: 1,
  },
  {
    position: [0.15, -0.4, 0],
    scale: 0.02,
    rotation: [
      MathUtils.degToRad(-45),
      MathUtils.degToRad(-135),
      MathUtils.degToRad(-45),
    ],
    type: 1,
  },
  {
    position: [0.15, -0.4, 0],
    scale: 0.02,
    rotation: [
      MathUtils.degToRad(45),
      MathUtils.degToRad(-315),
      MathUtils.degToRad(-45),
    ],
    type: 1,
  },
  {
    position: [-0.2, -0.35, 0],
    scale: 0.02,
    rotation: [
      MathUtils.degToRad(-90),
      MathUtils.degToRad(-405),
      MathUtils.degToRad(-45),
    ],
    type: 1,
  },
  {
    position: [-1.2, -0.6, 0],
    scale: 0.05,
    rotation: [
      MathUtils.degToRad(-90),
      MathUtils.degToRad(-405),
      MathUtils.degToRad(-45),
    ],
    type: 1,
  },
  {
    position: [-1.6, -0.6, 0],
    scale: 0.05,
    rotation: [
      MathUtils.degToRad(-90),
      MathUtils.degToRad(-405),
      MathUtils.degToRad(-45),
    ],
    type: 1,
  },
  {
    position: [0.16, -1.38, 0],
    scale: 0.05,
    rotation: [
      MathUtils.degToRad(0),
      MathUtils.degToRad(200),
      MathUtils.degToRad(-16),
    ],
    type: 2,
  },
  {
    position: [0, -0.68, 0],
    scale: 0.04,
    rotation: [
      MathUtils.degToRad(0),
      MathUtils.degToRad(-14),
      MathUtils.degToRad(-16),
    ],
    type: 2,
  },
  {
    position: [-0.22, -0.61, 0],
    scale: 0.03,
    rotation: [
      MathUtils.degToRad(0),
      MathUtils.degToRad(-(157 + 360)),
      MathUtils.degToRad(-16),
    ],
    type: 2,
  },
  {
    position: [0.2, -0.46, 0],
    scale: 0.03,
    rotation: [
      MathUtils.degToRad(0),
      MathUtils.degToRad(-(340 + 360)),
      MathUtils.degToRad(-16),
    ],
    type: 2,
  },
]

// This is the shared material instance for the arm
const armMeshMaterial = new MeshPhysicalMaterial({
  // Initial values, will be updated by state if dynamic behavior is kept
  color: new Color('#b0b0b0'),
  metalness: 1,
  roughness: 0.4,
  wireframe: false, // Default wireframe state
  side: DoubleSide,
})

export function Arm() {
  const { scene: arm1 } = useGLTF('/models/arm.glb')
  const { scene: arm2 } = useGLTF('/models/arm2.glb')
  const [type, setType] = useState(1)

  // --- Static values for material properties (if they don't change with `step`) ---
  // If these were meant to be static and NOT change with `step`, you'd use them directly.
  // However, your useEffect below suggests they DO change with `step`.
  // const staticMaterialProps = {
  //   color: '#b0b0b0',
  //   roughness: 0.4,
  //   metalness: 1,
  //   wireframe: false,
  // };

  // --- State for dynamic material properties ---
  const [currentMaterialProps, setCurrentMaterialProps] = useState({
    color: '#b0b0b0',
    roughness: 0.4,
    metalness: 1,
    // wireframe is not in the dynamic part of your original useEffect,
    // so we assume it's static or handled differently. Let's make it static for now.
  })
  const staticWireframe = false // Default from your original useControls

  // --- State for dynamic light properties ---
  const [currentLightProps, setCurrentLightProps] = useState({
    light1Position: [-200, 150, 50], // Default from useControls
    light2Position: [300, -100, 150], // Default from useControls
    light1Intensity: 0.35, // Initial from your step 0 logic
    light2Intensity: 0.15, // Initial from your step 0 logic
    lightsColor: 'rgb(130, 226, 243)', // Initial from your step 0 logic
    ambientColor: 'rgb(130, 226, 243)', // Initial from your step 0 logic
  })

  // --- Static values for model transformation (if not animated by scroll) ---
  // These were from the 'model' useControls.
  // The `custom` flag determined if these were used or the scroll-based animation.
  const modelStaticProps = {
    custom: false, // Default from useControls
    scale: 0.05,   // Default from useControls
    position: [0, 0, 0], // Default from useControls
    rotation: [0, 0, 0], // Default from useControls (in degrees)
  };

  // Apply dynamic material properties to the shared material instance
  useEffect(() => {
    armMeshMaterial.color.set(currentMaterialProps.color)
    armMeshMaterial.roughness = currentMaterialProps.roughness
    armMeshMaterial.metalness = currentMaterialProps.metalness
    armMeshMaterial.wireframe = staticWireframe // Using the static wireframe value
  }, [currentMaterialProps, staticWireframe])

  useEffect(() => {
    if (arm1) {
      arm1.traverse((node) => {
        if (node.material) node.material = armMeshMaterial
      })
    }
  }, [arm1]) // armMeshMaterial is constant instance, so no need to list as dep

  useEffect(() => {
    if (arm2) {
      arm2.traverse((node) => {
        if (node.material) node.material = armMeshMaterial
      })
    }
  }, [arm2]) // armMeshMaterial is constant instance

  const parent = useRef()
  const { viewport } = useThree()

  const _thresholds = useStore(({ thresholds }) => thresholds)
  const thresholds = useMemo(() => {
    return Object.values(_thresholds).sort((a, b) => a - b)
  }, [_thresholds])

  const [step, setStep] = useState(0)

  // This useEffect now updates our state variables instead of calling Leva's setters
  useEffect(() => {
    if (step === 0) {
      setCurrentLightProps({
        light1Position: [-200, 150, 50], // Or keep previous if they don't change
        light2Position: [300, -100, 150],
        light1Intensity: 0.35,
        light2Intensity: 0.15,
        lightsColor: 'rgb(130, 226, 243)',
        ambientColor: 'rgb(130, 226, 243)',
      })
      setCurrentMaterialProps({
        color: '#b0b0b0',
        roughness: 0.4,
        metalness: 1,
      })
    } else {
      setCurrentLightProps({
        light1Position: [-200, 150, 50], // Or keep previous if they don't change
        light2Position: [300, -100, 150],
        light1Intensity: 1,
        light2Intensity: 1,
        lightsColor: '#efefef',
        ambientColor: '#b0B0B0', // Note: original was '#b0B0B0' - check capitalization
      })
      setCurrentMaterialProps({
        color: '#efefef',
        roughness: 0.4,
        metalness: 0.6,
      })
    }
  }, [step])

  useScroll(
    ({ scroll }) => {
      setStep(scroll < _thresholds['light-start'] ? 0 : 1)
    },
    [_thresholds]
  )

  useScroll(({ scroll }) => {
    if (!parent.current) return

    // Use the static 'custom' value
    if (modelStaticProps.custom) {
      parent.current.scale.setScalar(viewport.height * modelStaticProps.scale)
      parent.current.position.set(
        viewport.width * modelStaticProps.position[0],
        viewport.height * modelStaticProps.position[1],
        0
      )
      parent.current.rotation.fromArray(
        modelStaticProps.rotation.map((v) => MathUtils.degToRad(v))
      )
      return
    }

    // ... rest of your scroll animation logic for non-custom mode ...
    const current = thresholds.findIndex((v) => scroll < v) - 1
    const start = thresholds[current]
    const end = thresholds[current + 1]
    const progress = mapRange(start, end, scroll, 0, 1)
    const from = steps[current]
    const to = steps[current + 1]

    if (parent.current) {
      parent.current.visible = from?.type === to?.type
    }
    if (!to) return

    const _scale = mapRange(0, 1, progress, from.scale, to.scale)
    const _position = new Vector3(
      viewport.width *
        mapRange(0, 1, progress, from.position[0], to.position[0]),
      viewport.height *
        mapRange(0, 1, progress, from.position[1], to.position[1]),
      0
    )
    const _rotation = new Euler().fromArray(
      new Array(3)
        .fill(0)
        .map((_, i) =>
          mapRange(0, 1, progress, from.rotation[i], to.rotation[i])
        )
    )

    parent.current.scale.setScalar(viewport.height * _scale)
    parent.current.position.copy(_position)
    parent.current.rotation.copy(_rotation)
    setType(to.type)
  })


  return (
    <>
      <ambientLight args={[new Color(currentLightProps.ambientColor)]} />
      <group position={currentLightProps.light1Position}>
        <directionalLight args={[new Color(currentLightProps.lightsColor), currentLightProps.light1Intensity]} />
      </group>
      <group position={currentLightProps.light2Position}>
        <directionalLight args={[new Color(currentLightProps.lightsColor), currentLightProps.light2Intensity]} />
      </group>
      <Float floatIntensity={modelStaticProps.custom ? 0 : 1} rotationIntensity={modelStaticProps.custom ? 0 : 1}>
        <group ref={parent}>
          {type === 1 && <primitive object={arm1} scale={[1, 1, 1]} />}
          {type === 2 && <primitive object={arm2} scale={[1, 1, 1]} />}
        </group>
      </Float>
    </>
  )
}

function Content() {
  const { viewport } = useThree()

  return (
    <>
      <Particles
        width={viewport.width}
        height={viewport.height}
        depth={500}
        count={100} // Reduced for potentially better performance during testing
        scale={500}
        size={150}
      />
      <Arm />
    </>
  )
}

export function WebGL({ render = true }) {
  return (
    <Canvas
      gl={{
        powerPreference: 'high-performance',
        antialias: true,
        alpha: true,
      }}
      dpr={[1, 2]}
      frameloop="never"
      orthographic
      camera={{ near: 0.01, far: 10000, position: [0, 0, 1000] }}
    >
      <Raf render={render} />
      <Suspense>
        <Content />
      </Suspense>
    </Canvas>
  )
}