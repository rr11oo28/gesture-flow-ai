import { useCallback, useEffect, useRef, useState } from 'react'
const CDN = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/'
const Q = { low: { width: 320, height: 240 }, mid: { width: 480, height: 360 }, high: { width: 640, height: 480 } }
const d = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)
const clamp = (v) => Math.min(1, Math.max(0, v))

export function classify(l, pk = .28) {
  const s = d(l[0], l[9])
  const ext = (t, p) => d(l[t], l[0]) > d(l[p], l[0]) * 1.08
  const i = ext(8, 6), m = ext(12, 10), r = ext(16, 14), p = ext(20, 18)
  if (d(l[4], l[8]) < s * pk) return 'pinch'
  if (i && m && r && p) return 'open'
  if (!i && !m && !r && !p) return 'fist'
  if (i && m && !r && !p) return 'two'
  if (i && !m && !r && !p) return 'point'
  return 'unknown'
}

const ERR = { NotAllowedError: 'e.denied', PermissionDeniedError: 'e.denied', NotFoundError: 'e.nocam', NotReadableError: 'e.busy', Unsupported: 'e.unsupported', Lib: 'e.lib' }

export default function useHandTracking(cb) {
  const cbRef = useRef(cb); cbRef.current = cb
  const video = useRef(null), canvas = useRef(null)
  const cfg = useRef({ pinch: .28, swipe: .25, quality: matchMedia('(pointer:coarse)').matches ? 'low' : 'mid' })
  const hand = useRef({ detected: false, g: 'none', cursor: { x: .5, y: .5 }, palm: { x: .5, y: .5 }, active: false, mode: 'cursor' })
  const R = useRef({ hands: null, stream: null, raf: 0, track: true, run: false, busy: false, cand: '', n: 0, g: 'none',
    hist: [], cur: [], fistAt: null, swipeAt: 0, clickAt: 0, lastY: null, frames: 0, fps: 0, ft: performance.now() })
  const [ui, setUi] = useState({ cam: false, track: true, status: 'idle', error: '', g: 'none', detected: false, fps: 0, active: false, mode: 'cursor' })

  const onResults = useCallback((res) => {
    const r = R.current, h = hand.current, now = performance.now(), E = cbRef.current
    r.frames++; if (now - r.ft >= 1000) { r.fps = r.frames; r.frames = 0; r.ft = now }
    const c = canvas.current, ctx = c.getContext('2d')
    ctx.clearRect(0, 0, 640, 480)
    const l = res.multiHandLandmarks?.[0]
    if (!l) { h.detected = false; h.g = 'none'; r.g = 'none'; r.fistAt = null; r.hist = []; r.lastY = null; return }
    ctx.lineWidth = 3; ctx.strokeStyle = '#22e4ff'
    for (const [a, b] of window.HAND_CONNECTIONS) { ctx.beginPath(); ctx.moveTo(l[a].x * 640, l[a].y * 480); ctx.lineTo(l[b].x * 640, l[b].y * 480); ctx.stroke() }
    ctx.fillStyle = '#8b5cff'
    l.forEach((p) => { ctx.beginPath(); ctx.arc(p.x * 640, p.y * 480, 4, 0, 7); ctx.fill() })

    const raw = classify(l, cfg.current.pinch)
    if (raw === r.cand) r.n++; else { r.cand = raw; r.n = 1 }
    if (r.n >= 3) r.g = raw
    const g = r.g, prev = h.g
    h.detected = true; h.g = g
    if (g !== prev) E.onSeen?.(g)
    h.palm = { x: 1 - l[9].x, y: l[9].y }
    const cx = clamp((1 - l[8].x - .15) / .7), cy = clamp((l[8].y - .1) / .65)
    r.cur.push({ x: cx, y: cy }); if (r.cur.length > 8) r.cur.shift()
    if (g !== 'pinch') h.cursor = { x: cx, y: cy }

    if (g === 'open' && !h.active) { h.active = true; E.onActive?.(true) }
    if (g === 'fist') {
      if (r.fistAt == null) r.fistAt = now
      else if (now - r.fistAt > 700 && h.active) { h.active = false; E.onActive?.(false) }
    } else if (r.fistAt != null && g !== 'unknown') {
      if (g === 'open' && now - r.fistAt < 700 && h.active) { h.mode = h.mode === 'cursor' ? 'object' : 'cursor'; E.onMode?.(h.mode) }
      r.fistAt = null
    }
    if (h.active && g === 'open') {
      r.hist.push({ t: now, x: h.palm.x })
      while (r.hist.length && now - r.hist[0].t > 400) r.hist.shift()
      const dx = h.palm.x - r.hist[0].x
      if (Math.abs(dx) > cfg.current.swipe && now - r.swipeAt > 900) { r.swipeAt = now; r.hist = []; E.onSwipe?.(dx > 0 ? 1 : -1) }
    } else r.hist = []
    if (h.active && g === 'two') {
      if (r.lastY != null) { const dy = l[8].y - r.lastY; if (Math.abs(dy) > .003) E.onScroll?.(-dy * 2500) }
      r.lastY = l[8].y
    } else r.lastY = null
    if (h.active && h.mode === 'cursor' && g === 'pinch' && prev !== 'pinch' && now - r.clickAt > 600) {
      r.clickAt = now; h.cursor = r.cur[0] || h.cursor
      E.onClick?.(h.cursor.x * innerWidth, h.cursor.y * innerHeight)
    }
  }, [])

  const loop = useCallback(async () => {
    const r = R.current; if (!r.run) return
    const v = video.current
    if (r.track && r.hands && v && v.readyState >= 2 && !r.busy && v.currentTime !== r.vt) {
      r.busy = true; r.vt = v.currentTime; try { await r.hands.send({ image: v }) } catch {} r.busy = false
    }
    r.raf = requestAnimationFrame(loop)
  }, [])

  const stop = useCallback(() => {
    const r = R.current; r.run = false; cancelAnimationFrame(r.raf)
    r.stream?.getTracks().forEach((t) => t.stop()); r.stream = null
    if (video.current) video.current.srcObject = null
    canvas.current?.getContext('2d').clearRect(0, 0, 640, 480)
    Object.assign(hand.current, { detected: false, g: 'none', active: false })
    setUi((u) => ({ ...u, cam: false, status: 'idle' }))
  }, [])

  const start = useCallback(async () => {
    if (R.current.run) return
    setUi((u) => ({ ...u, status: 'loading', error: '' }))
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw Object.assign(new Error(), { name: 'Unsupported' })
      const stream = await navigator.mediaDevices.getUserMedia({ video: { ...Q[cfg.current.quality], frameRate: 30, facingMode: 'user' }, audio: false })
      R.current.stream = stream
      const v = video.current; v.srcObject = stream; await v.play()
      if (!window.Hands) throw Object.assign(new Error(), { name: 'Lib' })
      if (!R.current.hands) {
        const hs = new window.Hands({ locateFile: (f) => CDN + f })
        hs.setOptions({ maxNumHands: 1, modelComplexity: 0, minDetectionConfidence: .7, minTrackingConfidence: .6 })
        hs.onResults(onResults); await hs.initialize(); R.current.hands = hs
      }
      R.current.run = true; setUi((u) => ({ ...u, cam: true, status: 'ready' })); loop()
    } catch (e) {
      stop(); setUi((u) => ({ ...u, status: 'error', error: ERR[e.name] || 'e.generic' }))
    }
  }, [loop, onResults, stop])

  const toggleTrack = useCallback(() => {
    const r = R.current; r.track = !r.track
    if (!r.track) { canvas.current?.getContext('2d').clearRect(0, 0, 640, 480); hand.current.detected = false; hand.current.g = 'none' }
    setUi((u) => ({ ...u, track: r.track }))
  }, [])
  const toggleMode = useCallback(() => { const h = hand.current; h.mode = h.mode === 'cursor' ? 'object' : 'cursor'; cbRef.current.onMode?.(h.mode) }, [])
  const setActive = useCallback((v) => { hand.current.active = v; cbRef.current.onActive?.(v) }, [])

  useEffect(() => () => stop(), [stop])

  return { video, canvas, hand, ui, R, cfg, start, stop, toggleTrack, toggleMode, setActive }
}
