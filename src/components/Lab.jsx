import { useEffect, useRef } from 'react'
import useLive from '../hooks/useLive.js'
import { useT } from '../i18n.js'
const FACES = ['gn.open', 'gn.fist', 'gn.swipe', 'gn.point', 'gn.pinch', 'gn.two']
const T = ['rotateY(0)', 'rotateY(90deg)', 'rotateY(180deg)', 'rotateY(270deg)', 'rotateX(90deg)', 'rotateX(-90deg)']
export default function Lab({ hand, cam }) {
  const cube = useRef(null), live = useLive(cam), t = useT()
  useEffect(() => {
    let raf, rx = 20, ry = 30, tx = 0, ty = 0
    const tick = () => {
      const h = hand.current, e = cube.current
      if (h.detected && h.active && h.mode === 'object') {
        ry += ((h.palm.x - .5) * 540 - ry) * .15; rx += ((.5 - h.palm.y) * 360 - rx) * .15
        tx += ((h.palm.x - .5) * 320 - tx) * .15; ty += ((h.palm.y - .5) * 200 - ty) * .15
      } else { ry += .4; tx *= .95; ty *= .95 }
      if (e) e.style.transform = `translate(${tx}px,${ty}px) rotateX(${rx}deg) rotateY(${ry}deg)`
      raf = requestAnimationFrame(tick)
    }
    tick(); return () => cancelAnimationFrame(raf)
  }, [hand])
  return (
    <section className="lab">
      <h2>{t('l.title')}</h2>
      <p className="hint">{t(live.mode === 'object' ? 'l.obj' : 'l.cur')}</p>
      <div className="scene"><div ref={cube} className="cube">{FACES.map((f, i) => <div key={f} className="face glass" style={{ transform: `${T[i]} translateZ(100px)` }}>{t(f)}</div>)}</div></div>
      <button data-g className="btn primary" onClick={cam.toggleMode}>{t('l.switch', { m: t(live.mode === 'cursor' ? 'm.object' : 'm.cursor') })}</button>
    </section>
  )
}
