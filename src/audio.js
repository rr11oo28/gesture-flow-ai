let ctx, muted = false
export const setMuted = (m) => { muted = m }
export function beep(freq = 660, dur = 0.09) {
  if (muted) return
  try {
    ctx ||= new (window.AudioContext || window.webkitAudioContext)()
    const o = ctx.createOscillator(), g = ctx.createGain()
    o.frequency.value = freq; o.type = 'sine'
    g.gain.setValueAtTime(0.08, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur)
    o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + dur)
  } catch {}
}
