import { useEffect, useRef } from 'react'
export default function Cursor({ hand }) {
  const el = useRef(null)
  useEffect(() => {
    let raf, f = 0, x = innerWidth / 2, y = innerHeight / 2, last = null
    const tick = () => {
      raf = requestAnimationFrame(tick)
      const h = hand.current, e = el.current; if (!e) return
      const show = h.detected && h.active && h.mode === 'cursor' && (h.g === 'point' || h.g === 'pinch')
      e.style.opacity = show ? 1 : 0; if (!show) return
      x += (h.cursor.x * innerWidth - x) * .35; y += (h.cursor.y * innerHeight - y) * .35
      e.style.transform = `translate3d(${x}px,${y}px,0)`; e.classList.toggle('down', h.g === 'pinch')
      if (++f % 3 === 0) { const t = document.elementFromPoint(x, y)?.closest('button,[data-g]'); if (t !== last) { last?.classList.remove('gh'); t?.classList.add('gh'); last = t } }
    }
    tick(); return () => cancelAnimationFrame(raf)
  }, [hand])
  return <div ref={el} className="cursor" />
}
