import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { EASE, Magnetic } from '../fx'
import { useReducedMotionPref } from '../../hooks/useMedia'

const TIMELINE = [
  { at: 280, beat: 1 },
  { at: 1600, beat: 2 },
  { at: 2400, beat: 3 },
  { at: 3200, beat: 4 },
  { at: 4100, beat: 5 },
]

export function OpeningSequence({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotionPref()
  const [beat, setBeat] = useState(reduced ? 5 : 0)

  useEffect(() => {
    if (reduced) return
    const timers = TIMELINE.map(({ at, beat: b }) => window.setTimeout(() => setBeat(b), at))
    return () => timers.forEach(clearTimeout)
  }, [reduced])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') onDone()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onDone])

  return (
    <motion.div
      className="fixed inset-0 z-[120] overflow-hidden bg-black"
      exit={{ opacity: 0, scale: 1.04, filter: 'blur(12px)' }}
      transition={{ duration: 0.9, ease: EASE }}
      role="dialog"
      aria-label="Opening titles"
    >
      <motion.div
        aria-hidden
        className="absolute inset-0"
        style={{ background: 'radial-gradient(60% 50% at 50% 50%, rgba(229,19,43,0.22), transparent 70%)' }}
        animate={{ opacity: beat >= 2 ? 1 : 0 }}
        transition={{ duration: 1.4 }}
      />

      {beat === 1 && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.p
            className="text-center text-xs font-semibold tracking-[0.6em] text-[#a7a6ad] sm:text-sm"
            initial={{ letterSpacing: '0.2em', opacity: 0 }}
            animate={{ letterSpacing: '0.6em', opacity: 1 }}
            transition={{ duration: 1.6, ease: EASE }}
          >
            ORIGINAL DESDE 1992
          </motion.p>
        </motion.div>
      )}

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
        <motion.h1
          className="font-series leading-[0.82] text-[#f4f1ec]"
          style={{ fontSize: 'clamp(4.6rem, 18vw, 13rem)' }}
          initial={{ opacity: 0, scale: 1.3, filter: 'blur(20px)', letterSpacing: '0.5em' }}
          animate={
            beat >= 2
              ? { opacity: 1, scale: 1, filter: 'blur(0px)', letterSpacing: '0.04em' }
              : {}
          }
          transition={{ duration: 1.3, ease: EASE }}
        >
          VANINA
        </motion.h1>
        <motion.p
          className="mt-3 font-sans text-sm font-bold tracking-[0.7em] text-[#ff3d5a] sm:text-lg"
          initial={{ opacity: 0, letterSpacing: '1.4em' }}
          animate={beat >= 3 ? { opacity: 1, letterSpacing: '0.55em' } : {}}
          transition={{ duration: 1.1, ease: EASE }}
        >
          MI PORTAFOLIO
        </motion.p>
        <motion.p
          className="mt-6 max-w-xl text-sm tracking-[0.18em] text-[#f4f1ec]/80 sm:text-base"
          initial={{ opacity: 0, y: 12 }}
          animate={beat >= 4 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
        >
          DESARROLLADORA FULL STACK CON ENFOQUE EN DISEÑO UX/UI
        </motion.p>
        <motion.div
          className="mt-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={beat >= 5 ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <Magnetic>
            <button
              type="button"
              onClick={onDone}
              className="flex items-center gap-3 rounded-full bg-[#f4f1ec] px-9 py-4 text-base font-bold tracking-wide text-black shadow-[0_0_60px_rgba(229,19,43,0.45)]"
            >
              ▶ PLAY
            </button>
          </Magnetic>
        </motion.div>
      </div>

      <button
        type="button"
        onClick={onDone}
        className="absolute right-5 top-5 z-40 text-[11px] tracking-[0.24em] uppercase text-white/50 hover:text-white"
      >
        Skip intro
      </button>
    </motion.div>
  )
}
