import { OrbitControls, Sky } from "@react-three/drei"
import { Debug, Physics } from "@react-three/rapier"
import { Level } from "./Level.jsx"
import Lights from "./Lights.jsx"
import Player from "./Player.jsx"
import useGame from "./stores/useGame.jsx"

export default function Experience() {
  const blockCount = useGame((state) => state.blockCount)
  const blockSeed = useGame((state) => state.blockSeed)

  return (
    <>
      <color args={["#bdedfc"]} attach="background" />
      <OrbitControls makeDefault />
      <Physics>
        <Lights />
        <Level blockCount={blockCount} seed={blockSeed} />
        <Player />
      </Physics>
    </>
  )
}
