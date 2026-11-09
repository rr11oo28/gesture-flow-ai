import { createContext, useContext } from 'react'
export const D = {
  en: {
    boot: 'Starting Gesture Flow AI',
    'nav.home': 'Home', 'nav.dash': 'Dashboard', 'nav.lab': 'Lab', 'nav.practice': 'Practice', 'nav.settings': 'Settings',
    'hero.title': 'CONTROL THE FUTURE', 'hero.sub': 'Your hands. Your world. No mouse required.', 'hero.start': 'START EXPERIENCE', 'hero.enable': 'ENABLE HAND CONTROL',
    'g.open': 'Open palm', 'g.opend': 'Activate the interface',
    'g.fist': 'Close fist (hold)', 'g.fistd': 'Pause interaction',
    'g.swipe': 'Move hand left / right', 'g.swiped': 'Previous / next section',
    'g.point': 'Index finger up', 'g.pointd': 'Move the cursor',
    'g.pinch': 'Pinch thumb + index', 'g.pinchd': 'Click the element',
    'g.two': 'Two fingers, hand up / down', 'g.twod': 'Scroll down / up',
    'g.mode': 'Open, close, open quickly', 'g.moded': 'Switch cursor / object mode',
    'gn.open': 'palm', 'gn.fist': 'fist', 'gn.swipe': 'swipe', 'gn.point': 'point', 'gn.pinch': 'pinch', 'gn.two': 'scroll', 'gn.none': 'none', 'gn.unknown': '…',
    'd.panel': 'Control panel', 'd.theme': 'Theme', 'd.particles': 'Particles', 'd.guide': 'Gesture guide', 'd.hint': 'Scroll with two raised fingers to the end of this page, then swipe right to open the Lab.',
    c1: 'Section swipe', c1d: 'Move your open hand left or right to switch sections.',
    c2: 'Point and pinch', c2d: 'Raise your index finger to aim, then pinch to click.',
    c3: 'Two-finger scroll', c3d: 'Raise two fingers and move your hand up or down.',
    c4: 'Object mode', c4d: 'Open, close and open your hand to grab the 3D cube in the Lab.',
    c5: 'Themes', c5d: 'Pick a color below. Every glow on the page follows it.',
    c6: 'Keyboard fallback', c6d: 'Arrows navigate and scroll. Space switches mode. M mutes.',
    'l.title': 'Object lab', 'l.obj': 'Object mode: move your palm and the cube follows.', 'l.cur': 'Cursor mode: open, close and open your hand quickly (or press Space) to grab the cube.', 'l.switch': 'Switch to {m} mode', 'm.cursor': 'cursor', 'm.object': 'object',
    'cam.loading': 'Loading model', 'cam.tracking': 'Tracking', 'cam.trackoff': 'Tracking off', 'cam.trackon': 'Tracking on', 'cam.off': 'Camera off', 'cam.hand': 'Hand detected', 'cam.nohand': 'No hand', 'cam.gesture': 'Gesture', 'cam.active': 'Active', 'cam.paused': 'Paused', 'cam.mode': 'Mode', 'cam.webcam': 'Webcam', 'cam.ph': 'Enable hand control to see yourself here', 'cam.starting': 'Starting camera…', 'cam.tip': 'Show an open palm to activate',
    'e.denied': 'Camera permission denied. Allow camera access in the address bar, then try again.', 'e.nocam': 'No camera found.', 'e.busy': 'The camera is in use by another app. Close it and try again.', 'e.unsupported': 'Camera access needs HTTPS or localhost.', 'e.lib': 'Hand tracking library failed to load. Check your connection and reload.', 'e.generic': 'Could not start the camera.',
    't.next': 'Next section', 't.prev': 'Previous section', 't.active': 'Interface active', 't.paused': 'Paused', 't.object': 'Object mode', 't.cursor': 'Cursor mode',
    'p.title': 'Practice gestures', 'p.sub': 'Perform each gesture. It gets ticked when detected.', 'p.nocam': 'Enable hand control first (Home page or camera panel).', 'p.done': '{n}/{m} done', 'p.reset': 'Start over',
    's.title': 'Settings', 's.lang': 'Language', 's.sound': 'Sound', 's.pinch': 'Pinch sensitivity', 's.swipe': 'Swipe distance (smaller = easier)', 's.quality': 'Camera quality', 'q.low': 'Low (phones)', 'q.mid': 'Medium', 'q.high': 'High', 's.apply': 'Restart camera to apply',
  },
  uz: {
    boot: 'Gesture Flow AI ishga tushmoqda',
    'nav.home': 'Bosh sahifa', 'nav.dash': 'Panel', 'nav.lab': 'Laboratoriya', 'nav.practice': 'Mashq', 'nav.settings': 'Sozlamalar',
    'hero.title': 'KELAJAKNI BOSHQARING', 'hero.sub': 'Sizning qoʻllaringiz. Sizning dunyongiz. Sichqonchasiz.', 'hero.start': 'BOSHLASH', 'hero.enable': 'QOʻL BOSHQARUVINI YOQISH',
    'g.open': 'Ochiq kaft', 'g.opend': 'Interfeysni faollashtiradi',
    'g.fist': 'Musht (ushlab turing)', 'g.fistd': 'Toʻxtatadi',
    'g.swipe': 'Qoʻlni chapga/oʻngga surish', 'g.swiped': 'Oldingi/keyingi boʻlim',
    'g.point': 'Koʻrsatkich barmoq', 'g.pointd': 'Kursorni harakatlantiradi',
    'g.pinch': 'Bosh va koʻrsatkich barmoqni chimdish', 'g.pinchd': 'Bosish',
    'g.two': 'Ikki barmoq, qoʻl tepaga/pastga', 'g.twod': 'Pastga/tepaga skroll',
    'g.mode': 'Ochish, yopish, ochish (tez)', 'g.moded': 'Kursor/obyekt rejimi',
    'gn.open': 'kaft', 'gn.fist': 'musht', 'gn.swipe': 'surish', 'gn.point': 'barmoq', 'gn.pinch': 'chimdish', 'gn.two': 'skroll', 'gn.none': 'yoʻq', 'gn.unknown': '…',
    'd.panel': 'Boshqaruv paneli', 'd.theme': 'Mavzu', 'd.particles': 'Zarrachalar', 'd.guide': 'Gesturlar qoʻllanmasi', 'd.hint': 'Ikki barmoq bilan sahifa oxirigacha skroll qiling, soʻng oʻngga surib Laboratoriyani oching.',
    c1: 'Boʻlimlarni surish', c1d: 'Ochiq qoʻlni chapga yoki oʻngga surib boʻlimlarni almashtiring.',
    c2: 'Koʻrsatish va chimdish', c2d: 'Koʻrsatkich barmoq bilan moʻljallang, chimdib bosing.',
    c3: 'Ikki barmoqli skroll', c3d: 'Ikki barmoqni koʻtarib, qoʻlni tepaga yoki pastga siljiting.',
    c4: 'Obyekt rejimi', c4d: 'Qoʻlni ochib-yopib-ochsangiz, Laboratoriyadagi 3D kubni ushlaysiz.',
    c5: 'Mavzular', c5d: 'Quyidan rangni tanlang. Barcha yorugʻliklar oʻzgaradi.',
    c6: 'Klaviatura', c6d: 'Strelkalar — boʻlim va skroll. Probel — rejim. M — ovoz.',
    'l.title': 'Obyekt laboratoriyasi', 'l.obj': 'Obyekt rejimi: kaftingizni siljiting, kub ergashadi.', 'l.cur': 'Kursor rejimi: qoʻlni tez ochib-yopib-oching (yoki Probel bosing) va kubni ushlang.', 'l.switch': '{m} rejimiga oʻtish', 'm.cursor': 'kursor', 'm.object': 'obyekt',
    'cam.loading': 'Model yuklanmoqda', 'cam.tracking': 'Kuzatilmoqda', 'cam.trackoff': 'Kuzatuv oʻchiq', 'cam.trackon': 'Kuzatuv yoniq', 'cam.off': 'Kamera oʻchiq', 'cam.hand': 'Qoʻl topildi', 'cam.nohand': 'Qoʻl yoʻq', 'cam.gesture': 'Gestur', 'cam.active': 'Faol', 'cam.paused': 'Pauza', 'cam.mode': 'Rejim', 'cam.webcam': 'Kamera', 'cam.ph': 'Oʻzingizni koʻrish uchun qoʻl boshqaruvini yoqing', 'cam.starting': 'Kamera ishga tushmoqda…', 'cam.tip': 'Faollashtirish uchun ochiq kaft koʻrsating',
    'e.denied': 'Kamera ruxsati berilmadi. Brauzer manzil satridan kameraga ruxsat bering va qayta urining.', 'e.nocam': 'Kamera topilmadi.', 'e.busy': 'Kamerani boshqa ilova ishlatmoqda. Uni yoping va qayta urining.', 'e.unsupported': 'Kamera faqat HTTPS yoki localhost orqali ishlaydi.', 'e.lib': 'Qoʻl kuzatuv kutubxonasi yuklanmadi. Internetni tekshirib, sahifani yangilang.', 'e.generic': 'Kamerani ishga tushirib boʻlmadi.',
    't.next': 'Keyingi boʻlim', 't.prev': 'Oldingi boʻlim', 't.active': 'Interfeys faol', 't.paused': 'Pauza', 't.object': 'Obyekt rejimi', 't.cursor': 'Kursor rejimi',
    'p.title': 'Gesturlarni mashq qiling', 'p.sub': 'Har bir gesturni bajaring — aniqlanganda belgi qoʻyiladi.', 'p.nocam': 'Avval qoʻl boshqaruvini yoqing (Bosh sahifa yoki kamera paneli).', 'p.done': '{n}/{m} bajarildi', 'p.reset': 'Qayta boshlash',
    's.title': 'Sozlamalar', 's.lang': 'Til', 's.sound': 'Ovoz', 's.pinch': 'Chimdish sezgirligi', 's.swipe': 'Surish masofasi (kichik = oson)', 's.quality': 'Kamera sifati', 'q.low': 'Past (telefon)', 'q.mid': 'Oʻrta', 'q.high': 'Yuqori', 's.apply': 'Qoʻllash uchun kamerani qayta ishga tushiring',
  },
}
export const makeT = (lang) => (k, v) => {
  let s = D[lang]?.[k] ?? D.en[k] ?? k
  if (v) for (const x in v) s = s.replace(`{${x}}`, v[x])
  return s
}
export const LangCtx = createContext({ lang: 'en', t: makeT('en') })
export const useT = () => useContext(LangCtx).t
