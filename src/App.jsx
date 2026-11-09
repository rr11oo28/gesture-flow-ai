import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'
import useHandTracking from './hooks/useHandTracking.js'
import Particles from './components/Particles.jsx'
import Cursor from './components/Cursor.jsx'
import HandCam from './components/HandCam.jsx'
import Hero from './components/Hero.jsx'
import Dashboard from './components/Dashboard.jsx'
import Lab from './components/Lab.jsx'
import Practice from './components/Practice.jsx'
import Settings from './components/Settings.jsx'
import { LangCtx, makeT } from './i18n.js'
import { beep, setMuted } from './audio.js'

const SECTIONS = [['nav.home', Hero], ['nav.dash', Dashboard], ['nav.lab', Lab], ['nav.practice', Practice], ['nav.settings', Settings]]
const store = { get: (k) => { try { return localStorage.getItem(k) } catch { return null } }, set: (k, v) => { try { localStorage.setItem(k, v) } catch {} } }

export default function App() {
  const [i, setI] = useState(0), [dir, setDir] = useState(1)
  const [theme, setTheme] = useState(store.get('gf-theme') || 'plasma'), [anim, setAnim] = useState(true)
  const [lang, setLang] = useState(store.get('gf-lang') || 'uz'), [done, setDone] = useState({})
  const [muted, setMute] = useState(false), [msg, setMsg] = useState(''), [boot, setBoot] = useState(true)
  const scroller = useRef(null), tm = useRef(), touch = useRef(null)
  const t = makeT(lang)
  const toast = useCallback((m) => { setMsg(m); clearTimeout(tm.current); tm.current = setTimeout(() => setMsg(''), 1400) }, [])
  const mark = (id) => setDone((d) => (d[id] ? d : { ...d, [id]: 1 }))
  const goTo = (n) => { n = Math.max(0, Math.min(SECTIONS.length - 1, n)); if (n === i) return; setDir(n > i ? 1 : -1); setI(n); beep(520); scroller.current?.scrollTo(0, 0) }
  const changeLang = (l) => { setLang(l); store.set('gf-lang', l) }

  const cam = useHandTracking({
    onSwipe: (d) => { mark('swipe'); goTo(i + d); toast(t(d > 0 ? 't.next' : 't.prev')) },
    onScroll: (dy) => scroller.current?.scrollBy(0, dy),
    onClick: (x, y) => { const el = document.elementFromPoint(x, y)?.closest('button,[data-g]'); if (el) { el.click(); beep(880) } },
    onActive: (a) => { toast(t(a ? 't.active' : 't.paused')); beep(a ? 740 : 330) },
    onMode: (m) => { mark('mode'); toast(t('t.' + m)); beep(620) },
    onSeen: (g) => { if (['open', 'fist', 'point', 'pinch', 'two'].includes(g)) mark(g) },
  })

  useEffect(() => { document.documentElement.dataset.theme = theme; store.set('gf-theme', theme) }, [theme])
  useEffect(() => { document.documentElement.lang = lang }, [lang])
  useEffect(() => { setMuted(muted) }, [muted])
  useEffect(() => { const x = setTimeout(() => setBoot(false), 1400); return () => clearTimeout(x) }, [])
  useEffect(() => {
    const k = (e) => {
      if (e.target.tagName === 'INPUT') return
      if (e.key === 'ArrowRight') goTo(i + 1)
      else if (e.key === 'ArrowLeft') goTo(i - 1)
      else if (e.key === 'ArrowDown') { e.preventDefault(); scroller.current?.scrollBy({ top: 120, behavior: 'smooth' }) }
      else if (e.key === 'ArrowUp') { e.preventDefault(); scroller.current?.scrollBy({ top: -120, behavior: 'smooth' }) }
      else if (e.key === ' ' && e.target.tagName !== 'BUTTON') { e.preventDefault(); cam.toggleMode() }
      else if (e.key === 'm') setMute((m) => !m)
      else if (e.key === 'c') cam.ui.cam ? cam.stop() : cam.start()
      else if (e.key === 't') cam.toggleTrack()
    }
    addEventListener('keydown', k); return () => removeEventListener('keydown', k)
  })
  // touch swipe between sections (phones)
  const onTS = (e) => { const p = e.touches[0]; touch.current = [p.clientX, p.clientY, e.target.tagName] }
  const onTE = (e) => {
    const s = touch.current; touch.current = null; if (!s || s[2] === 'INPUT') return
    const p = e.changedTouches[0], dx = p.clientX - s[0], dy = p.clientY - s[1]
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.8) goTo(i + (dx < 0 ? 1 : -1))
  }

  const props = { go: goTo, cam, hand: cam.hand, theme, setTheme, anim, setAnim, toast, done, setDone, lang, setLang: changeLang, muted, setMute }
  const Section = SECTIONS[i][1]
  return (
    <LangCtx.Provider value={{ lang, t }}>
      <div className="aurora" /><div className="floor" /><Particles run={anim} lite={cam.ui.cam} />
      <header className="top">
        <strong className="logo">GESTURE FLOW AI</strong>
        <nav>{SECTIONS.map(([k], n) => <button data-g key={k} className={n === i ? 'on' : ''} onClick={() => goTo(n)}>{t(k)}</button>)}</nav>
        <div className="row">
          <button data-g className="ib" onClick={() => changeLang(lang === 'uz' ? 'en' : 'uz')} aria-label="Language">{lang === 'uz' ? 'EN' : 'UZ'}</button>
          <button data-g className="ib" onClick={() => setMute(!muted)} aria-label="Sound">{muted ? <VolumeX size={18} /> : <Volume2 size={18} />}</button>
        </div>
      </header>
      <main ref={scroller} className="scroller" onTouchStart={onTS} onTouchEnd={onTE}>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div key={i} custom={dir} initial={{ x: dir * 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -dir * 60, opacity: 0 }} transition={{ duration: .25 }}>
            <Section {...props} />
          </motion.div>
        </AnimatePresence>
      </main>
      <HandCam cam={cam} />
      <Cursor hand={cam.hand} />
      <AnimatePresence>{msg && <motion.div className="toast glass" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{msg}</motion.div>}</AnimatePresence>
      <AnimatePresence>{boot && <motion.div className="boot" exit={{ opacity: 0 }}><div className="orb" /><span>{t('boot')}</span></motion.div>}</AnimatePresence>
    </LangCtx.Provider>
  )
}
