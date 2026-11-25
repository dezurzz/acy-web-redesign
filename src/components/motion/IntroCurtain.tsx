import { Paren } from '@/components/site/Atmosphere'
import { MOTION_STORAGE_KEY } from '@/lib/motion'

/** sessionStorage key: the curtain has played in this browser session. */
const CURTAIN_SEEN_KEY = 'bki-tirai-dilihat'

/*
 * Runs before the first paint (first element in <body>), so nothing flashes:
 *  - a later page load in the same session gets <html data-curtain-seen> and skips the curtain;
 *  - a saved "Kurangi animasi" choice goes on <html data-motion> right away, before React loads,
 *    so neither the curtain nor the hero intro starts for that visitor.
 * Storage can throw (private mode, blocked site data); then the curtain simply plays.
 */
const EARLY_SCRIPT = `(function(){var d=document.documentElement;try{if(localStorage.getItem(${JSON.stringify(
  MOTION_STORAGE_KEY,
)})==='1')d.dataset.motion='reduced'}catch(e){}try{if(sessionStorage.getItem(${JSON.stringify(
  CURTAIN_SEEN_KEY,
)}))d.dataset.curtainSeen='';else sessionStorage.setItem(${JSON.stringify(
  CURTAIN_SEEN_KEY,
)},'1')}catch(e){}})()`

/*
 * First-visit curtain (animations.md §5.12, v1.4): a deep navy panel with the name and a hairline
 * that draws across, which then lifts away to reveal the page; the hero intro continues from it.
 * It never waits for anything to load: the page is already in the HTML underneath, and the whole
 * sequence is fixed at about 1.3 s of pure CSS (globals.css "First-visit curtain"), so it also
 * runs and ends without JavaScript. Once per browser session; never with reduced motion.
 * Decorative only: hidden from screen readers, who get the page straight away.
 */
export function IntroCurtain() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: EARLY_SCRIPT }} />
      <div aria-hidden className="intro-curtain">
        <div className="container-page flex h-full flex-col justify-end pb-[12vh]">
          <p className="intro-curtain-step text-ui text-white/80">
            <Paren>Divisi pelatihan PT Biro Klasifikasi Indonesia</Paren>
          </p>
          <p className="intro-curtain-step mt-4 text-display text-white">BKI Academy</p>
          <div className="intro-curtain-line mt-10 h-px bg-white/40" />
        </div>
      </div>
    </>
  )
}
