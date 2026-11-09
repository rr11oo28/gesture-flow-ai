import { Camera, CameraOff, Loader2, ScanLine } from 'lucide-react'
import useLive from '../hooks/useLive.js'
import { useT } from '../i18n.js'
export default function HandCam({ cam }) {
  const { video, canvas, ui, start, stop, toggleTrack } = cam, s = useLive(cam), t = useT()
  const status = ui.status === 'loading' ? t('cam.loading') : ui.cam ? (ui.track ? t('cam.tracking') : t('cam.trackoff')) : t('cam.off')
  return (
    <aside className="cam glass">
      <div className="view">
        <video ref={video} playsInline muted />
        <canvas ref={canvas} width="640" height="480" />
        {!ui.cam && <div className="ph">{ui.status === 'loading' ? <Loader2 className="spin" /> : <CameraOff />}<span>{ui.error ? t(ui.error) : ui.status === 'loading' ? t('cam.starting') : t('cam.ph')}</span></div>}
        {ui.cam && <div className="fps">{s.fps} FPS</div>}
      </div>
      <div className="stats">
        <span><i className={'dot' + (s.detected ? ' ok' : '')} />{s.detected ? t('cam.hand') : t('cam.nohand')}</span>
        <span>{status}</span><span>{t('cam.gesture')}: {t('gn.' + s.g)}</span><span>{s.active ? t('cam.active') : t('cam.paused')}</span><span>{t('cam.mode')}: {t('m.' + s.mode)}</span>
      </div>
      {ui.cam && !s.active && <p className="tip">{t('cam.tip')}</p>}
      <div className="row">
        <button data-g className="ib" onClick={ui.cam ? stop : start} title="Webcam">{ui.cam ? <CameraOff size={16} /> : <Camera size={16} />}{t('cam.webcam')}</button>
        <button data-g className="ib" onClick={toggleTrack} disabled={!ui.cam}><ScanLine size={16} />{ui.track ? t('cam.trackon') : t('cam.trackoff')}</button>
      </div>
    </aside>
  )
}
