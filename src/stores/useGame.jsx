import { create } from "zustand"
import { subscribeWithSelector } from "zustand/middleware"

export default create(
  subscribeWithSelector((set) => {
    return {
      /**
       * Level
       */
      blockCount: 10,
      blockSeed: 0,

      /**
       * Time
       */
      startTime: 0,
      endTime: 0,

      /**
       * Phases
       */
      phase: "ready",

      // Method: Changes States
      start: () => {
        set((state) => {
          if (state.phase === "ready") {
            return {
              phase: "playing",
              startTime: Date.now(),
            }
          }

          return {}
        })
      },

      restart: () => {
        set((state) => {
          if (state.phase === "ended" || state.phase === "playing") {
            return {
              phase: "ready",
            }
          }

          return {}
        })
      },

      renew: () => {
        set((state) => {
          return {
            phase: "ready",
            blockSeed: Math.random(),
          }

          return {}
        })
      },

      end: () => {
        set((state) => {
          if (state.phase === "playing") {
            return {
              phase: "ended",
              endTime: Date.now(),
            }
          }

          return {}
        })
      },
    }
  })
)
