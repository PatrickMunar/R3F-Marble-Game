import { useKeyboardControls } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { RigidBody, useRapier } from "@react-three/rapier"
import { useRef, useEffect, useState } from "react"
import * as THREE from "three"
import useGame from "./stores/useGame"

export default function Player() {
  const [subscribeKeys, getKeys] = useKeyboardControls()
  const { rapier, world } = useRapier()
  const rapierWorld = world.raw()
  const player = useRef()

  const [smoothedCameraPosition] = useState(() => new THREE.Vector3(0, 10, 10))
  const [smoothedCameraTarget] = useState(() => new THREE.Vector3())

  //   Get Global States from useGame
  let phase = useGame((state) => state.phase)
  const start = useGame((state) => state.start)
  const restart = useGame((state) => state.restart)
  const end = useGame((state) => state.end)
  const blockCount = useGame((state) => state.blockCount)

  //   Reset Game
  const reset = () => {
    player.current.setTranslation({ x: 0, y: 1, z: 0 })
    player.current.setLinvel({ x: 0, y: 0, z: 0 })
    player.current.setAngvel({ x: 0, y: 0, z: 0 })
  }

  // Player Jump
  const jump = () => {
    const origin = player.current.translation()
    origin.y -= 0.31
    const direction = { x: 0, y: -1, z: 0 }
    const ray = new rapier.Ray(origin, direction)
    const hit = rapierWorld.castRay(ray, 10, true)

    if (hit.toi < 0.15) {
      player.current.applyImpulse({ x: 0, y: 0.5, z: 0 })
    }
  }

  useEffect(() => {
    const unsubscribeReset = useGame.subscribe(
      (state) => {
        return state.phase
      },
      (value) => {
        phase = value
        if (value == "ready") {
          reset()
        }
      }
    )

    // Jump
    const unsubscribeJump = subscribeKeys(
      (state) => {
        return state.jump
      },
      (value) => {
        if (value == true) {
          jump()
        }
      }
    )

    // Start Game
    const unsubscribeAny = subscribeKeys(
      (state) => {
        return state
      },
      (value) => {
        if (
          value.forward == true ||
          value.rightward == true ||
          value.backward == true ||
          value.leftward == true
        ) {
          start()
        }
      }
    )

    return () => {
      unsubscribeReset()
      unsubscribeJump()
      unsubscribeAny()
    }
  }, [])

  useFrame((state, delta) => {
    /**
     * Controls
     */

    const { forward, backward, leftward, rightward, restartKey } = getKeys()

    const impulse = { x: 0, y: 0, z: 0 }
    const torque = { x: 0, y: 0, z: 0 }

    const impulseStrength = 0.5 * delta
    const torqueStrength = 0.5 * delta

    if (forward) {
      impulse.z += -impulseStrength
      torque.z += -torqueStrength
    }

    if (rightward) {
      impulse.x += impulseStrength
      torque.x += torqueStrength
    }

    if (backward) {
      impulse.z += impulseStrength
      torque.z += torqueStrength
    }

    if (leftward) {
      impulse.x += -impulseStrength
      torque.x += -torqueStrength
    }

    if (restartKey && phase != "ready") {
      restart()
    }

    player.current.applyImpulse(impulse)
    player.current.applyImpulse(torque)

    /**
     * Camera
     */
    const bodyPosition = player.current.translation()

    const cameraPosition = new THREE.Vector3()
    cameraPosition.copy(bodyPosition)
    cameraPosition.z += 2.25
    cameraPosition.y += 0.65

    const cameraTarget = new THREE.Vector3()
    cameraTarget.copy(bodyPosition)
    cameraTarget.y += 0.65

    smoothedCameraPosition.lerp(cameraPosition, 5 * delta)
    smoothedCameraTarget.lerp(cameraTarget, 5 * delta)

    state.camera.position.copy(smoothedCameraPosition)
    state.camera.lookAt(smoothedCameraTarget)

    /**
     * Phases
     */
    if (bodyPosition.z < -((blockCount + 1) * 4 - 2) && bodyPosition.y >= 0) {
      end()
    }

    if (bodyPosition.y < -4) {
      restart()
    }
  })

  return (
    <RigidBody
      ref={player}
      colliders="ball"
      position={[0, 1, 0]}
      restitution={0.2}
      friction={1}
      linearDamping={0.5}
      angularDamping={0.5}
    >
      <mesh castShadow>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial color="mediumPurple" flatShading />
      </mesh>
    </RigidBody>
  )
}
