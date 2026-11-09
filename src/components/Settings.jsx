import { useState } from 'react'
import { useT } from '../i18n.js'
export default function Settings({ cam, lang, setLang, muted, setMute }) {
  const t = useT(), c = cam.cfg.current, [, force] = useState(0)
  const set = (k, v) => { c[k] = v; force((n) => n + 1) }
  const restart = async () => { cam.stop(); await new Promise((r) => setTimeout(r, 250)); cam.start() }
  return (
    <section className="settings">
      <h2>{t('s.title')}</h2>
      <div className="panel glass">
        <div className="field"><span>{t('s.lang')}</span><div className="row">{[['uz', 'Oʻzbekcha'], ['en', 'English']].map(([l, n]) => <button data-g key={l} className={'btn' + (lang === l ? ' primary' : '')} onClick={() => setLang(l)}>{n}</button>)}</div></div>
        <div className="field"><span>{t('s.sound')}</span><button data-g role="switch" aria-checked={!muted} className={'switch' + (!muted ? ' on' : '')} onClick={() => setMute(!muted)}><i /></button></div>
        <div className="field"><span>{t('s.pinch')}: {c.pinch.toFixed(2)}</span><input type="range" min=".18" max=".4" step=".01" value={c.pinch} onChange={(e) => set('pinch', +e.target.value)} /></div>
        <div className="field"><span>{t('s.swipe')}: {c.swipe.toFixed(2)}</span><input type="range" min=".15" max=".4" step=".01" value={c.swipe} onChange={(e) => set('swipe', +e.target.value)} /></div>
        <div className="field"><span>{t('s.quality')}</span><div className="row">{['low', 'mid', 'high'].map((q) => <button data-g key={q} className={'btn' + (c.quality === q ? ' primary' : '')} onClick={() => set('quality', q)}>{t('q.' + q)}</button>)}</div></div>
        {cam.ui.cam && <button data-g className="btn" onClick={restart}>{t('s.apply')}</button>}
      </div>
    </section>
  )
}
