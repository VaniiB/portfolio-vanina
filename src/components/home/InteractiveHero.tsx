import { useEffect, useRef, useState } from 'react'
import { characterFrames, holdMs, type Zone } from '../../data/character'

const copy: Record<Exclude<Zone, 'idle'>, { lines: string[] }> = {
  left: { lines: ['Anyone here on the left?'] },
  right: { lines: ['Anyone here on the right?'] },
  center: { lines: ["Hey, it's you!", 'Hiiii!', 'Check out the portfolio'] },
}

export function InteractiveHero() {
  const rootRef = useRef<HTMLElement>(null)
  const imgARef = useRef<HTMLImageElement>(null)
  const imgBRef = useRef<HTMLImageElement>(null)
  const useA = useRef(true)
  const zoneRef = useRef<Zone>('idle')
  const holdRef = useRef(0)
  const greetStep = useRef(0)
  const cooldownRef = useRef<Zone | null>(null)
  const [zone, setZone] = useState<Zone>('idle')
  const [isMobile, setIsMobile] = useState(false)

  function show(src: string, flip = false) {
    const incoming = useA.current ? imgBRef.current : imgARef.current
    const outgoing = useA.current ? imgARef.current : imgBRef.current
    if (!incoming || !outgoing) return
    incoming.src = src
    incoming.style.transform = flip ? 'scaleX(-1)' : 'scaleX(1)'
    incoming.style.opacity = '1'
    outgoing.style.opacity = '0'
    useA.current = !useA.current
  }

  function goIdle() {
    zoneRef.current = 'idle'
    greetStep.current = 0
    setZone('idle')
    show(characterFrames.idle[0], false)
  }

  function enter(next: Zone) {
    if (zoneRef.current === next) return
    if (cooldownRef.current === next) return
    window.clearTimeout(holdRef.current)
    zoneRef.current = next
    setZone(next)

    if (next === 'left') {
      show(characterFrames.left[0], true)
      cooldownRef.current = 'left'
      holdRef.current = window.setTimeout(goIdle, holdMs)
      return
    }
    if (next === 'right') {
      show(characterFrames.right[0], false)
      cooldownRef.current = 'right'
      holdRef.current = window.setTimeout(goIdle, holdMs)
      return
    }
    if (next === 'center') {
      greetStep.current = 0
      show(characterFrames.greet[0], false)
      holdRef.current = window.setTimeout(() => {
        greetStep.current = 1
        show(characterFrames.greet[1] ?? characterFrames.greet[0], false)
      }, 700)
    }
  }

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const sync = () => setIsMobile(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root || isMobile) return

    const onMove = (e: PointerEvent) => {
      const rect = root.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const next: Zone = x < 0.33 ? 'left' : x > 0.67 ? 'right' : 'center'
      if (next !== cooldownRef.current) cooldownRef.current = null
      enter(next)
    }
    const onLeave = () => {
      window.clearTimeout(holdRef.current)
      goIdle()
    }

    root.addEventListener('pointermove', onMove)
    root.addEventListener('pointerleave', onLeave)
    return () => {
      root.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerleave', onLeave)
      window.clearTimeout(holdRef.current)
    }
  }, [isMobile])

  return (
    <section
      ref={rootRef}
      className="relative min-h-[100svh] overflow-hidden bg-white"
      style={{
        background:
          'radial-gradient(ellipse 70% 80% at 62% 58%, #ffffff 0%, #fff7f8 42%, #f3d5d8 78%, #c98990 100%)',
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_62%_55%,rgba(255,255,255,0.95)_0%,transparent_55%)]" />

      <div className="relative z-10 flex min-h-[100svh] flex-col justify-between px-6 pb-10 pt-24 md:px-12 md:pb-14">
        <div className="max-w-xs">
          <p className="font-serif text-2xl text-[#4a2c32] md:text-3xl">I'm Vanina Balbastro</p>
          <p className="mt-1 text-sm tracking-[0.04em] text-[#7a545a]">Web Developer</p>
          <p className="mt-6 flex items-center gap-2 text-sm text-[#7a545a]">
            <span className="hero-cursor-dot" aria-hidden />
            Move cursor to call me
          </p>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 top-16 flex items-end justify-center md:left-[28%] md:justify-end md:pr-[4%]">
          <div className="relative h-[min(88svh,920px)] w-full max-w-[920px]">
            <img
              ref={imgARef}
              src={characterFrames.idle[0]}
              alt="Vanina Balbastro"
              className="absolute inset-0 h-full w-full object-contain object-bottom drop-shadow-[0_30px_80px_rgba(120,40,50,0.18)] transition-opacity duration-500"
            />
            <img
              ref={imgBRef}
              src={characterFrames.idle[0]}
              alt=""
              className="absolute inset-0 h-full w-full object-contain object-bottom opacity-0 drop-shadow-[0_30px_80px_rgba(120,40,50,0.18)] transition-opacity duration-500"
            />
          </div>
        </div>

        <div className="relative z-20 min-h-[4.5rem] max-w-sm">
          {zone !== 'idle' && (
            <div className="space-y-1">
              {copy[zone].lines.map((line) => (
                <p key={line} className="text-sm tracking-wide text-[#4a2c32] md:text-base">
                  {line}
                </p>
              ))}
            </div>
          )}
          {isMobile && (
            <button
              type="button"
              onClick={() => enter('center')}
              className="mt-4 rounded-full border border-[#c98990] px-4 py-2 text-xs tracking-[0.14em] uppercase text-[#4a2c32]"
            >
              Call me
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
