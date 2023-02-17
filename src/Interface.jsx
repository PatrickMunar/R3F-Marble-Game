import { addEffect } from "@react-three/fiber"
import { useEffect, useRef, useState } from "react"
import useGame from "./stores/useGame"
import gsap from "gsap"

export default function Interface() {
  const time = useRef()
  const restart = useGame((state) => state.restart)
  const renew = useGame((state) => state.renew)
  const phase = useGame((state) => state.phase)

  const newLevel = () => {
    renew()
    setBest(999999999)
    localStorage.setItem("best", best)
  }

  //   Best Record
  const [best, setBest] = useState(
    parseFloat(localStorage.getItem("best") ?? 999999999)
  )

  useEffect(() => {
    return setBest(999999999)
  }, [])

  useEffect(() => {
    if (phase != "ended") {
      gsap.to(".time", { duration: 0.5, backgroundColor: "#00000033" })
    }
  }, [phase])

  useEffect(() => {
    if (phase === "ended") {
      gsap.to(".time", { duration: 0.5, backgroundColor: "#9370dbff" })
    }

    localStorage.setItem("best", best)

    const unsubscribeEffect = addEffect(() => {
      const state = useGame.getState()
      let elapsedTime = 0

      if (state.phase === "playing") {
        elapsedTime = Date.now() - state.startTime
      } else if (state.phase === "ended") {
        elapsedTime = state.endTime - state.startTime
        if (elapsedTime.toFixed(2) * 0.001 < best) {
          setBest((elapsedTime * 0.001).toFixed(2))
        }
      }

      //   Convert elapsedTime units fromo ms to s
      elapsedTime *= 0.001
      elapsedTime = elapsedTime.toFixed(2)

      //   Update Time Text
      if (time.current) {
        time.current.textContent = elapsedTime
      }
    })

    return () => {
      unsubscribeEffect()
    }
  }, [best])

  return (
    <section className="interface">
      <div className="timeContainer">
        <div className="bestTime">
          {`BEST: ${best === 999999999 ? `--` : best}`}
        </div>
        <div ref={time} className="time">
          0.00
        </div>
      </div>
      {phase === "ended" && (
        <div className="endMenu">
          <div className="restart" onClick={restart}>
            RESTART
          </div>
          <div className="new" onClick={newLevel}>
            NEW
          </div>
        </div>
      )}
      {phase === "playing" && (
        <div className="quickRestart" onClick={restart}>
          RESTART
        </div>
      )}
    </section>
  )
}
