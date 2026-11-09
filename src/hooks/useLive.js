import { useEffect, useState } from 'react'
// Fast-changing hand stats live here so only the components that show them re-render.
export default function useLive(cam) {
  const [s, set] = useState({ g: 'none', detected: false, fps: 0, active: false, mode: 'cursor' })
  useEffect(() => {
    const t = setInterval(() => {
      const h = cam.hand.current, fps = cam.R.current.fps
      set((p) => (p.g === h.g && p.detected === h.detected && p.fps === fps && p.active === h.active && p.mode === h.mode ? p : { g: h.g, detected: h.detected, fps, active: h.active, mode: h.mode }))
    }, 200)
    return () => clearInterval(t)
  }, [cam.hand, cam.R])
  return s
}
