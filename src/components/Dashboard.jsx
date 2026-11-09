import { useState } from 'react'
import { motion } from 'framer-motion'
import { Palette, Layers, Mouse, MoveHorizontal, Pointer, ScrollText } from 'lucide-react'
import { GESTURES } from '../gestures.js'
import { useT } from '../i18n.js'
const CARDS = [
  [MoveHorizontal, 'c1'],
  [Pointer, 'c2'],
  [ScrollText, 'c3'],
  [Layers, 'c4'],
  [Palette, 'c5'],
  [Mouse, 'c6'],
]
const THEMES = [['plasma', '#22e4ff', '#8b5cff'], ['nebula', '#c06bff', '#ff4fd8'], ['ion', '#2f6bff', '#22e4ff']]
export default function Dashboard({ theme, setTheme, anim, setAnim, toast }) {
  const t = useT()
  const [sel, setSel] = useState(0)
  const [Icon, ck] = CARDS[sel]
  return (
    <section className="dash">
      <h2>{t('d.panel')}</h2>
      <div className="bento">
        <motion.div key={sel} className="tile big glass" initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }}>
          <Icon size={44} strokeWidth={1.4} /><h3>{t(ck)}</h3><p>{t(ck + 'd')}</p>
        </motion.div>
        {CARDS.map(([I, k], i) => (
          <button data-g key={k} className={'tile sm glass' + (sel === i ? ' sel' : '')} onClick={() => { setSel(i); toast(t(k)) }}><I size={20} />{t(k)}</button>
        ))}
        <div className="tile wide glass">
          <span>{t('d.theme')}</span>
          <div className="row">{THEMES.map(([n, a, b]) => <button data-g key={n} aria-label={n} title={n} className={'swatch' + (theme === n ? ' on' : '')} style={{ background: `linear-gradient(135deg,${a},${b})` }} onClick={() => { setTheme(n); toast(n) }} />)}</div>
          <span>{t('d.particles')}</span>
          <button data-g role="switch" aria-checked={anim} className={'switch' + (anim ? ' on' : '')} onClick={() => setAnim(!anim)}><i /></button>
        </div>
      </div>
      <h2>{t('d.guide')}</h2>
      <ul className="guide">{GESTURES.map((g) => <li key={g} className="glass"><b>{t('g.' + g)}</b><span>{t('g.' + g + 'd')}</span></li>)}</ul>
      <p className="hint">{t('d.hint')}</p>
    </section>
  )
}
