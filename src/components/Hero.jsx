import { useEffect, useRef, useState } from 'react'
import { Hand, Play } from 'lucide-react'
import { useT } from '../i18n.js'
const FING = [[-30, -72, -.12, [48, 30, 26]], [-10, -78, -.02, [54, 34, 28]], [10, -74, .08, [50, 31, 26]], [28, -62, .2, [38, 25, 22]]]
const LINES = [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9], [9, 10], [10, 11], [11, 12], [9, 13], [13, 14], [14, 15], [15, 16], [13, 17], [17, 18], [18, 19], [19, 20], [0, 17]]
const POSES = [
  ['open', { t: 0, f: [0, 0, 0, 0] }],
  ['point', { t: .8, f: [0, 1, 1, 1] }],
  ['pinch', { t: .62, f: [.5, 0, 0, 0] }],
  ['two', { t: .9, f: [0, 0, 1, 1] }],
  ['fist', { t: .85, f: [1, 1, 1, 1] }],
]
// 21 landmarks in MediaPipe order, built from per-finger curl values
function build(p) {
  const pts = [[0, 0], [-26, -18], [-44, -38]]; let x = -44, y = -38, a = -.75
  for (const l of [32, 26]) { a += p.t * .7; x += Math.sin(a) * l; y -= Math.cos(a) * l; pts.push([x, y]) }
  FING.forEach(([bx, by, sp, L], i) => {
    let px = bx, py = by, acc = 0; pts.push([px, py])
    L.forEach((l) => { acc += p.f[i] * 1.15; const e = l * Math.cos(acc); px += Math.sin(sp) * e; py -= Math.cos(sp) * e; pts.push([px, py]) })
  })
  return pts
}
function SkeletonHand() {
  const t = useT()
  const [k, setK] = useState(0)
  const ln = useRef([]), dt = useRef([]), cur = useRef(build(POSES[0][1])), tgt = useRef(cur.current)
  useEffect(() => { tgt.current = build(POSES[k][1]) }, [k])
  useEffect(() => { const t = setInterval(() => setK((n) => (n + 1) % POSES.length), 2600); return () => clearInterval(t) }, [])
  useEffect(() => {
    let raf
    const tick = () => {
      raf = requestAnimationFrame(tick)
      const c = cur.current, t = tgt.current; let m = 0
      for (let i = 0; i < 21; i++) {
        const dx = t[i][0] - c[i][0], dy = t[i][1] - c[i][1]; c[i][0] += dx * .1; c[i][1] += dy * .1; m = Math.max(m, Math.abs(dx), Math.abs(dy))
      }
      if (m < .05) return
      c.forEach((p, i) => { const d = dt.current[i]; d.setAttribute('cx', p[0]); d.setAttribute('cy', p[1]) })
      LINES.forEach(([a, b], i) => { const l = ln.current[i]; l.setAttribute('x1', cur.current[a][0]); l.setAttribute('y1', cur.current[a][1]); l.setAttribute('x2', cur.current[b][0]); l.setAttribute('y2', cur.current[b][1]) })
    }
    tick(); return () => cancelAnimationFrame(raf)
  }, [])
  const c0 = cur.current
  return (
    <figure className="scope glass">
      <i className="cn tl" /><i className="cn tr" /><i className="cn bl" /><i className="cn br" />
      <svg viewBox="-120 -180 240 260" aria-hidden="true">
        {LINES.map(([a, b], i) => <line key={i} ref={(e) => (ln.current[i] = e)} x1={c0[a][0]} y1={c0[a][1]} x2={c0[b][0]} y2={c0[b][1]} />)}
        {c0.map((p, i) => <circle key={i} ref={(e) => (dt.current[i] = e)} cx={p[0]} cy={p[1]} r={i % 4 === 0 && i ? 4 : 3} />)}
      </svg>
      <figcaption key={k}><b>{t('g.' + POSES[k][0])}</b><span>{t('g.' + POSES[k][0] + 'd')}</span></figcaption>
    </figure>
  )
}
export default function Hero({ go, cam }) {
  const t = useT()
  return (
    <section className="hero">
      <div className="copy">
        <h1>{t('hero.title')}</h1>
        <p className="sub">{t('hero.sub')}</p>
        <div className="row">
          <button data-g className="btn primary" onClick={() => go(1)}><Play size={18} />{t('hero.start')}</button>
          <button data-g className="btn" onClick={cam.start}><Hand size={18} />{t('hero.enable')}</button>
        </div>
      </div>
      <SkeletonHand />
    </section>
  )
}
