import { Check } from 'lucide-react'
import { GESTURES } from '../gestures.js'
import { useT } from '../i18n.js'
export default function Practice({ done, setDone, cam }) {
  const t = useT(), n = GESTURES.filter((g) => done[g]).length
  return (
    <section className="practice">
      <h2>{t('p.title')}</h2>
      <p className="hint">{cam.ui.cam ? t('p.sub') : t('p.nocam')}</p>
      <div className="meter"><i style={{ width: `${(n / GESTURES.length) * 100}%` }} /></div>
      <ul className="guide">{GESTURES.map((g) => (
        <li key={g} className={'glass step' + (done[g] ? ' ok' : '')}><span className="tick">{done[g] && <Check size={14} />}</span><div><b>{t('g.' + g)}</b><span>{t('g.' + g + 'd')}</span></div></li>
      ))}</ul>
      <div className="row" style={{ marginTop: 20 }}><b>{t('p.done', { n, m: GESTURES.length })}</b><button data-g className="btn" onClick={() => setDone({})}>{t('p.reset')}</button></div>
    </section>
  )
}
