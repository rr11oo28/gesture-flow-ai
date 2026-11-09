import { memo, useEffect, useRef } from 'react'
const sprite = (h) => {
  const c = document.createElement('canvas'); c.width = c.height = 32
  const x = c.getContext('2d'), g = x.createRadialGradient(16, 16, 0, 16, 16, 16)
  g.addColorStop(0, `hsl(${h} 100% 75%)`); g.addColorStop(.3, `hsl(${h} 100% 60% / .45)`); g.addColorStop(1, `hsl(${h} 100% 60% / 0)`)
  x.fillStyle = g; x.fillRect(0, 0, 32, 32); return c
}
function Particles({ run, lite }) {
  const c = useRef(null), live = useRef({ run, lite }); live.current = { run, lite }
  useEffect(() => {
    const cv = c.current, x = cv.getContext('2d'), S = [sprite(190), sprite(265), sprite(225)]; let w, h, raf, f = 0
    const P = Array.from({ length: matchMedia('(pointer:coarse)').matches ? 24 : 48 }, (_, i) => ({ x: Math.random(), y: Math.random(), vx: (Math.random() - .5) * 3e-4, vy: (Math.random() - .5) * 3e-4, s: S[i % 3], r: 8 + Math.random() * 10 }))
    const fit = () => { w = cv.width = innerWidth; h = cv.height = innerHeight }; fit(); addEventListener('resize', fit)
    const tick = () => {
      raf = requestAnimationFrame(tick)
      const { run: on, lite: l } = live.current
      if (!on || document.hidden || (l && ++f % 2)) return
      x.clearRect(0, 0, w, h)
      for (const p of P) { p.x = (p.x + p.vx + 1) % 1; p.y = (p.y + p.vy + 1) % 1; x.drawImage(p.s, p.x * w - p.r, p.y * h - p.r, p.r * 2, p.r * 2) }
      x.strokeStyle = 'rgba(140,200,255,.1)'; x.beginPath()
      for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) {
        const dx = (P[i].x - P[j].x) * w, dy = (P[i].y - P[j].y) * h
        if (dx * dx + dy * dy < 14000) { x.moveTo(P[i].x * w, P[i].y * h); x.lineTo(P[j].x * w, P[j].y * h) }
      }
      x.stroke()
    }
    tick(); return () => { cancelAnimationFrame(raf); removeEventListener('resize', fit) }
  }, [])
  return <canvas ref={c} className="particles" />
}
export default memo(Particles)
