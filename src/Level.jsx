import { Float, Text, useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { CuboidCollider, RigidBody } from "@react-three/rapier"
import { useRef, useState, useMemo } from "react"
import * as THREE from "three"

THREE.ColorManagement.legacyMode = false

// Geometries
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)

// Materials
const floor1Material = new THREE.MeshStandardMaterial({ color: "limegreen" })
const floor2Material = new THREE.MeshStandardMaterial({ color: "greenyellow" })
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: "orangered" })
const wallMaterial = new THREE.MeshStandardMaterial({ color: "slategrey" })

// Create Starting Block
export function BlockStart({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      <Text
        font="./bebas-neue-v9-latin-regular.woff"
        maxWidth={0.5}
        lineHeight={0.75}
        textAlign="right"
        position={[0.75, 1, 0]}
        scale={0.5}
      >
        Marble Game
        <meshBasicMaterial toneMapped={false} />
      </Text>
      <RigidBody type="fixed">
        <mesh
          geometry={boxGeometry}
          material={floor1Material}
          position={[0, -0.1, 0]}
          scale={[4, 0.2, 4]}
          receiveShadow
        />
      </RigidBody>
    </group>
  )
}

// Create Spinning Block
export function BlockSpinner({ position = [0, 0, 0] }) {
  const obstacle = useRef()
  const [speed] = useState(
    () => (Math.random() + 0.5) * (Math.random() < 0.5 ? 1 : -1)
  )

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime

    const rotation = new THREE.Quaternion()
    rotation.setFromEuler(new THREE.Euler(0, time * speed, 0))
    obstacle.current.setNextKinematicRotation(rotation)
  })

  return (
    <group position={position}>
      <RigidBody type="fixed">
        <mesh
          geometry={boxGeometry}
          material={floor2Material}
          position={[0, -0.1, 0]}
          scale={[4, 0.2, 4]}
          receiveShadow
        />
      </RigidBody>
      <RigidBody
        ref={obstacle}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[3.5, 0.3, 0.3]}
          castShadow
          receiveShadow
        />
      </RigidBody>
      <CuboidCollider
        args={[2, 0.1, 2]}
        position={[0, -0.1, 0]}
        restitution={0.2}
        friction={1}
      />
    </group>
  )
}

// Create Limbo Block
export function BlockLimbo({ position = [0, 0, 0] }) {
  const obstacle = useRef()
  const [offset] = useState(() => Math.random() * Math.PI * 2)

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime

    const y = Math.sin(time + offset) + 1.15
    obstacle.current.setNextKinematicTranslation({
      x: position[0],
      y: position[1] + y,
      z: position[2],
    })
  })

  return (
    <group position={position}>
      <RigidBody type="fixed">
        <mesh
          geometry={boxGeometry}
          material={floor2Material}
          position={[0, -0.1, 0]}
          scale={[4, 0.2, 4]}
          receiveShadow
        />
      </RigidBody>
      <RigidBody
        ref={obstacle}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[3.5, 0.3, 0.3]}
          castShadow
          receiveShadow
        />
      </RigidBody>
      <CuboidCollider
        args={[2, 0.1, 2]}
        position={[0, -0.1, 0]}
        restitution={0.2}
        friction={1}
      />
    </group>
  )
}

// Create Axe Block
export function BlockAxe({ position = [0, 0, 0] }) {
  const obstacle = useRef()
  const [offset] = useState(() => Math.random() * Math.PI * 2)

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime

    const x = Math.sin(time + offset) * 1.25
    obstacle.current.setNextKinematicTranslation({
      x: position[0] + x,
      y: position[1] + 0.75,
      z: position[2],
    })
  })

  return (
    <group position={position}>
      <RigidBody type="fixed">
        <mesh
          geometry={boxGeometry}
          material={floor2Material}
          position={[0, -0.1, 0]}
          scale={[4, 0.2, 4]}
          receiveShadow
        />
      </RigidBody>
      <RigidBody
        ref={obstacle}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[1.5, 1.5, 0.3]}
          castShadow
          receiveShadow
        />
      </RigidBody>
    </group>
  )
}

// Create Slider Block
export function BlockSlider({ position = [0, 0, 0] }) {
  const obstacle = useRef()
  const [offset] = useState(() => Math.random() * Math.PI * 2)

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime

    const x = Math.sin(time + offset)
    obstacle.current.setNextKinematicTranslation({
      x: position[0] + x,
      y: position[1],
      z: position[2],
    })
  })

  return (
    <group position={position}>
      <RigidBody
        ref={obstacle}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[1.5, 0.3, 3.5]}
          castShadow
          receiveShadow
        />
      </RigidBody>
    </group>
  )
}

// Create End Block
export function BlockEnd({ position = [0, 0, 0] }) {
  const hamburger = useGLTF("./hamburger.glb")
  const goal = useRef()

  hamburger.scene.children.forEach((mesh) => {
    mesh.castShadow = true
  })

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime

    const y = Math.sin(time) * 0.1 - 0.1
    goal.current.setNextKinematicTranslation({
      x: position[0],
      y: position[1] + 0 + y,
      z: position[2],
    })

    const rotation = new THREE.Quaternion()
    rotation.setFromEuler(new THREE.Euler(0, time * 0.25, 0))
    goal.current.setNextKinematicRotation(rotation)
  })

  return (
    <group position={position}>
      <RigidBody type="fixed">
        <mesh
          geometry={boxGeometry}
          material={floor1Material}
          position={[0, -0.1, 0]}
          scale={[4, 0.2, 4]}
          receiveShadow
        />
      </RigidBody>
      <RigidBody
        ref={goal}
        type="kinematicPosition"
        colliders="hull"
        restitution={0.2}
        friction={0}
      >
        <primitive
          object={hamburger.scene}
          position={[0, 0.15, 0]}
          scale={0.3}
        />
      </RigidBody>
    </group>
  )
}

// Create Boundaries
function Boundaries({ length = 1 }) {
  return (
    <>
      <RigidBody type="fixed" restitution={0.2} friction={0}>
        <mesh
          position={[2.15, 0.65, -(length * 2) + 2]}
          geometry={boxGeometry}
          material={wallMaterial}
          scale={[0.3, 1.7, length * 4]}
          castShadow
        />
        <mesh
          position={[-2.15, 0.65, -(length * 2) + 2]}
          geometry={boxGeometry}
          material={wallMaterial}
          scale={[0.3, 1.7, length * 4]}
          receiveShadow
        />
        <mesh
          position={[0, 0.65, -(length * 4) + 2.15]}
          geometry={boxGeometry}
          material={wallMaterial}
          scale={[4, 1.7, 0.3]}
          receiveShadow
        />
        {/* <CuboidCollider
          args={[2, 0.1, 2 * length]}
          position={[0, -0.1, -(length * 2) + 2]}
          restitution={0.2}
          friction={1}
        /> */}
      </RigidBody>
    </>
  )
}

// Create Level
export function Level({
  blockCount = 10,
  blockTypes = [BlockSpinner, BlockAxe, BlockLimbo, BlockSlider],
  seed = 0,
}) {
  const blocks = useMemo(() => {
    const blocks = []

    for (let i = 0; i < blockCount; i++) {
      const blockType =
        blockTypes[Math.floor(Math.random() * blockTypes.length)]
      blocks.push(blockType)
    }

    return blocks
  }, [blockCount, blockTypes, seed])

  return (
    <>
      <BlockStart position={[0, 0, 0]} />
      {blocks.map((Block, index) => (
        <Block key={index} position={[0, 0, -(index + 1) * 4]} />
      ))}
      <BlockEnd position={[0, 0, -(blockCount + 1) * 4]} />

      <Boundaries length={blockCount + 2} />
    </>
  )
}
