import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { characterFrames, lookGrid, lookTrack, portraitLayout, workLoop, type Zone } from '../../data/character'
import { heroQuestions, nowPlaying, profile } from '../../data/site'
import { useFinePointer } from '../../hooks/useMedia'
import { musicSource, setMusic, useMusic } from '../MusicPlayer'
import { EASE, Magnetic, Particles } from '../fx'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.25 } },
}
const item = {
  hidden: { opacity: 0, y: 28, filter: 'blur(10px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: EASE } },
}

const speech: Record<Exclude<Zone, 'idle'>, string[]> = {
  left: ['¿Hay alguien a la izquierda?'],
  right: ['¿Hay alguien a la derecha?'],
  center: ['¡Hola!', '¡Holaaa!'],
}

type Talk = { kind: 'what' | 'mad' | 'chat'; text: string }

const chat = ['¿Qué hacés?', '¿Me ves?', 'Ey', '¿Todo bien?']

function talkForLook(lx: number, ly: number): Talk | null {
  const c = Math.round(Math.min(1, Math.max(0, lx)) * 2)
  const r = Math.round(Math.min(1, Math.max(0, ly)) * 4)
  if (r <= 1 || (r === 2 && c !== 1)) return null
  return { kind: 'chat', text: chat[(r * 3 + c) % chat.length] }
}

type QuestionId = 'music' | 'about' | 'career' | 'projects' | 'mate' | 'ai' | 'contact'

const chips: { id: QuestionId; text: string; pos: string }[] = [
  { id: 'music', text: '¿Qué estás escuchando?', pos: 'right-[2%] top-[12%]' },
  { id: 'about', text: 'Contame de vos', pos: 'right-[18%] top-[28%]' },
  { id: 'career', text: '¿Me contás de tu trayectoria?', pos: 'right-[2%] top-[44%]' },
  { id: 'projects', text: '¿Cuáles son tus proyectos?', pos: 'left-[2%] bottom-[34%]' },
  { id: 'ai', text: '¿Usás IA?', pos: 'left-[8%] bottom-[22%]' },
  { id: 'mate', text: '¿Me convidás un mate?', pos: 'right-[6%] bottom-[30%]' },
  { id: 'contact', text: '¿Cómo te contacto?', pos: 'left-[4%] bottom-[10%]' },
]

function axisFrom(n: number, face: number) {
  const x = Math.min(1, Math.max(0, n))
  if (x < face) return 0.5 * (x / face)
  return 0.5 + (0.5 * (x - face)) / Math.max(0.001, 1 - face)
}

function lookFromBox(clientX: number, clientY: number, box: DOMRect) {
  const x = (clientX - box.left) / box.width
  const y = (clientY - box.top) / box.height
  return {
    x: axisFrom(Math.min(1, Math.max(0, x)), 0.52),
    y: axisFrom(Math.min(1, Math.max(0, y)), 0.3),
  }
}

export function SeriesHero({ onPlay }: { onPlay: () => void }) {
  const ref = useRef<HTMLElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const fine = useFinePointer()
  const [zone, setZone] = useState<Zone>('idle')
  const [greetStep, setGreetStep] = useState(0)
  const portraitHit = useRef<HTMLDivElement>(null)
  const poseRefs = useRef<Record<string, HTMLImageElement | null>>({})
  const shownPose = useRef('')
  const cell = useRef({ c: 1, r: 2 })
  const greetLock = useRef(false)
  const stillTimer = useRef(0)
  const waveTimer = useRef(0)
  const lastPtr = useRef({ x: 0, y: 0, t: 0 })
  const targetLook = useRef({ x: 0.5, y: 0.5 })
  const currentLook = useRef({ x: 0.5, y: 0.5 })
  const hovering = useRef(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const sipLock = useRef(false)
  const sipTimer = useRef(0)
  const [talk, setTalk] = useState<Talk | null>(null)
  const [over, setOver] = useState(false)
  const faceHold = useRef<string | null>(null)
  const playEnergy = useRef(0)
  const wasOver = useRef(false)
  const whatUntil = useRef(0)
  const madUntil = useRef(0)
  const whatGrid = [
    ['/character/what-left.png?v=1', '/character/react-what.png?v=2', '/character/what-right.png?v=1'],
    ['/character/what-down-left.png?v=1', '/character/what-down.png?v=1', '/character/what-down-right.png?v=1'],
  ]
  const whatFor = (lx: number, ly: number) =>
    whatGrid[ly < 0.6 ? 0 : 1][Math.round(Math.min(1, Math.max(0, lx)) * 2)]
  const madFace = '/character/react-mad.png?v=2'
  const grabSrc = '/character/work-mate-6.png?v=5'
  const drinkSrc = '/character/work-mate-2.png?v=5'
  const pointSrc = '/character/point-down.png?v=1'
  const offerSrc = '/character/offer-mate.png?v=1'
  const sadSrc = '/character/react-sad.png?v=1'
  const answerLock = useRef(false)
  const answerTimer = useRef(0)
  const [answer, setAnswer] = useState<{ id: QuestionId; text: string } | null>(null)
  const music = useMusic()
  const hasSong = !!musicSource(nowPlaying.url)

  const answerPose: Record<QuestionId, string> = {
    music: characterFrames.greet[0],
    about: characterFrames.greet[0],
    career: characterFrames.idle[0],
    projects: pointSrc,
    mate: offerSrc,
    ai: characterFrames.idle[0],
    contact: characterFrames.greet[0],
  }

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '14%'])
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-24%'])
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0])
  const blackout = useTransform(scrollYProgress, [0.35, 1], [0, 1])

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const px = useSpring(mx, { stiffness: 90, damping: 18 })
  const py = useSpring(my, { stiffness: 90, damping: 18 })
  const glowX = useTransform(px, [-1, 1], ['-8%', '8%'])

  function hideWorkVideo() {
    const v = videoRef.current
    if (!v) return
    v.pause()
    v.style.opacity = '0'
    v.style.visibility = 'hidden'
  }

  function showWorkVideo() {
    const v = videoRef.current
    const prev = poseRefs.current[shownPose.current]
    if (prev) {
      prev.style.opacity = '0'
      prev.style.visibility = 'hidden'
    }
    shownPose.current = ''
    if (!v) return
    v.style.visibility = 'visible'
    v.style.opacity = '1'
    void v.play()
  }

  function showPose(src: string) {
    if (shownPose.current === src) return
    hideWorkVideo()
    const prev = poseRefs.current[shownPose.current]
    const next = poseRefs.current[src]
    if (prev) {
      prev.style.transition = 'none'
      prev.style.opacity = '0'
      prev.style.visibility = 'hidden'
    }
    if (next) {
      next.style.transition = 'none'
      next.style.visibility = 'visible'
      next.style.opacity = '1'
    }
    shownPose.current = src
  }

  function poseFromLook(lx: number, ly: number) {
    const cols = lookGrid[0].length
    const rows = lookGrid.length
    const fx = Math.min(1, Math.max(0, lx)) * (cols - 1)
    const fy = Math.min(1, Math.max(0, ly)) * (rows - 1)
    let c = Math.min(cols - 1, Math.max(0, Math.round(fx)))
    let r = Math.min(rows - 1, Math.max(0, Math.round(fy)))
    const cur = cell.current
    const stay = Math.hypot(fx - cur.c, fy - cur.r)
    const go = Math.hypot(fx - c, fy - r)
    if ((c !== cur.c || r !== cur.r) && stay < go + 0.32) {
      c = cur.c
      r = cur.r
    } else {
      cell.current = { c, r }
    }
    return lookGrid[r][c]
  }

  useEffect(() => {
    let id = 0
    const tick = () => {
      if (greetLock.current || sipLock.current || answerLock.current) {
        id = requestAnimationFrame(tick)
        return
      }
      if (hovering.current && faceHold.current) {
        showPose(faceHold.current)
        id = requestAnimationFrame(tick)
        return
      }
      if (hovering.current) {
        const dx = targetLook.current.x - currentLook.current.x
        const dy = targetLook.current.y - currentLook.current.y
        const dist = Math.hypot(dx, dy)
        const k = dist > 0.4 ? 0.28 : 0.14
        currentLook.current.x += dx * k
        currentLook.current.y += dy * k
        showPose(poseFromLook(currentLook.current.x, currentLook.current.y))
      } else if (shownPose.current) {
        showWorkVideo()
      }
      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [])

  function showGreet(step: number) {
    showPose(characterFrames.greet[step] ?? characterFrames.greet[0])
  }

  function endSip() {
    if (!sipLock.current) return
    sipLock.current = false
    window.clearTimeout(sipTimer.current)
    if (!hovering.current && !greetLock.current) showWorkVideo()
  }

  function closeAnswer() {
    window.clearTimeout(answerTimer.current)
    answerLock.current = false
    setAnswer(null)
    if (music === 'playing') setMusic('off')
    if (!hovering.current) showWorkVideo()
  }

  function keepMusic(keep: boolean) {
    if (!keep) {
      setMusic('off')
      closeAnswer()
      return
    }
    setMusic('docked')
    setAnswer({ id: 'music', text: heroQuestions.musicYes })
  }

  function ask(id: QuestionId) {
    if (answer?.id === id) {
      closeAnswer()
      return
    }
    endSip()
    if (greetLock.current) stopGreet()
    window.clearTimeout(answerTimer.current)
    faceHold.current = null
    setTalk(null)
    answerLock.current = true
    showPose(answerPose[id])
    if (id === 'mate') {
      setAnswer({ id, text: heroQuestions.mate[0] })
      answerTimer.current = window.setTimeout(() => {
        setAnswer({ id, text: heroQuestions.mate[1] })
        showPose(characterFrames.greet[0])
      }, 2200)
      return
    }
    setAnswer({ id, text: heroQuestions[id] })
  }

  function rateMate(liked: boolean) {
    window.clearTimeout(answerTimer.current)
    if (liked) {
      setAnswer({ id: 'mate', text: heroQuestions.mateYes })
      showPose(characterFrames.greet[0])
      return
    }
    setAnswer({ id: 'mate', text: heroQuestions.mateNo[0] })
    showPose(sadSrc)
    answerTimer.current = window.setTimeout(() => {
      setAnswer({ id: 'mate', text: heroQuestions.mateNo[1] })
      showPose(characterFrames.greet[0])
    }, 2400)
  }

  function beginSip() {
    if (sipLock.current || greetLock.current || hovering.current || answerLock.current) return
    sipLock.current = true
    showPose(grabSrc)
    sipTimer.current = window.setTimeout(() => {
      if (!sipLock.current) return
      showPose(drinkSrc)
      sipTimer.current = window.setTimeout(() => {
        if (!sipLock.current) return
        showPose(grabSrc)
        sipTimer.current = window.setTimeout(endSip, 700)
      }, 1600)
    }, 900)
  }

  useEffect(() => {
    const first = window.setTimeout(beginSip, 9000)
    const id = window.setInterval(beginSip, 20000)
    return () => {
      window.clearTimeout(first)
      window.clearInterval(id)
      window.clearTimeout(sipTimer.current)
    }
  }, [])

  function startGreet() {
    if (greetLock.current) return
    endSip()
    faceHold.current = null
    setTalk(null)
    greetLock.current = true
    showGreet(0)
    setGreetStep(0)
    setZone('center')
    waveTimer.current = window.setTimeout(() => {
      showGreet(1)
      setGreetStep(1)
    }, 750)
  }

  function stopGreet(look = { x: 0.5, y: 0.5 }) {
    greetLock.current = false
    window.clearTimeout(waveTimer.current)
    setZone('idle')
    setGreetStep(0)
    targetLook.current = look
  }

  return (
    <section
      ref={ref}
      className={`relative min-h-[100svh] overflow-hidden ${fine ? 'md:cursor-none' : ''}`}
      onPointerMove={(e) => {
        const rect = ref.current?.getBoundingClientRect()
        if (!rect) return
        const nx = (e.clientX - rect.left) / rect.width
        const ny = (e.clientY - rect.top) / rect.height
        const now = performance.now()
        const first = lastPtr.current.t === 0
        const dt = Math.max(1, now - lastPtr.current.t)
        const speed = first ? 1 : Math.hypot(e.clientX - lastPtr.current.x, e.clientY - lastPtr.current.y) / dt
        lastPtr.current = { x: e.clientX, y: e.clientY, t: now }
        if (fine) {
          mx.set(nx * 2 - 1)
          my.set(ny * 2 - 1)
        }
        if (cursorRef.current && fine) {
          cursorRef.current.style.opacity = '1'
          cursorRef.current.style.transform = `translate(${e.clientX - rect.left}px, ${e.clientY - rect.top}px) translate(-50%, -50%)`
        }

        const box = portraitHit.current?.getBoundingClientRect()
        const over = !!box && e.clientX >= box.left && e.clientX <= box.right && e.clientY >= box.top && e.clientY <= box.bottom
        hovering.current = over
        if (over !== wasOver.current) setOver(over)
        if (over && !wasOver.current) {
          whatUntil.current = now + 1800
          playEnergy.current = 0
        }
        if (!over && wasOver.current) {
          whatUntil.current = 0
          madUntil.current = 0
          faceHold.current = null
          setTalk(null)
        }
        wasOver.current = over
        if (over && sipLock.current) endSip()
        const look = over && box ? lookFromBox(e.clientX, e.clientY, box) : { x: 0.5, y: 0.5 }
        targetLook.current = look

        if (over && !greetLock.current && !answerLock.current) {
          if (speed > 0.45 && now > whatUntil.current) playEnergy.current += speed
          else playEnergy.current *= 0.97
          if (playEnergy.current > 9 && now > madUntil.current) {
            playEnergy.current = 0
            madUntil.current = now + 2400
          }
          const next: Talk | null =
            now < whatUntil.current
              ? { kind: 'what', text: '¿Qué es eso?' }
              : now < madUntil.current
                ? { kind: 'mad', text: '¡Qué molesto! Estoy trabajando.' }
                : talkForLook(look.x, look.y)
          faceHold.current = next?.kind === 'what' ? whatFor(look.x, look.y) : next?.kind === 'mad' ? madFace : null
          setTalk((prev) => (prev?.kind === next?.kind && prev?.text === next?.text ? prev : next))
        }

        if (greetLock.current && (speed > 0.55 || !over)) stopGreet(look)
      }}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('a, button')) return
        const box = portraitHit.current?.getBoundingClientRect()
        const over = !!box && e.clientX >= box.left && e.clientX <= box.right && e.clientY >= box.top && e.clientY <= box.bottom
        if (!over && fine) return
        if (answerLock.current) closeAnswer()
        if (greetLock.current) {
          stopGreet({ x: 0.5, y: 0.5 })
          return
        }
        startGreet()
      }}
      onPointerLeave={() => {
        mx.set(0)
        my.set(0)
        hovering.current = false
        wasOver.current = false
        setOver(false)
        faceHold.current = null
        setTalk(null)
        window.clearTimeout(stillTimer.current)
        stillTimer.current = 0
        stopGreet({ x: 0.5, y: 0.5 })
        if (cursorRef.current) cursorRef.current.style.opacity = '0'
      }}
    >
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 z-[1]" style={{ x: glowX }}>
        <div className="light-streak left-[10%] top-[22%] w-[70%]" />
        <div className="light-streak left-[20%] top-[58%] w-[50%]" style={{ animationDelay: '2.4s' }} />
      </motion.div>
      <Particles className="z-[1] right-0 top-0 h-full w-[62%] left-auto" count={220} size={1.25} speed={0.35} />

      <motion.div
        className="absolute inset-x-0 top-10 z-[2] flex h-[68svh] items-end justify-center sm:h-[74svh] lg:inset-x-auto lg:bottom-0 lg:left-auto lg:h-auto lg:top-[var(--p-top)] lg:right-[var(--p-right)] lg:w-[var(--p-width)]"
        style={{
          y: imgY,
          scale: imgScale,
          opacity: fade,
          ['--p-width' as string]: portraitLayout.width,
          ['--p-right' as string]: portraitLayout.right,
          ['--p-top' as string]: portraitLayout.top,
          ['--p-height' as string]: portraitLayout.height,
        }}
      >
        <div
          className="relative h-full w-full lg:h-[var(--p-height)]"
          style={{
            transform: `translate(${portraitLayout.x}px, ${portraitLayout.y}px) scale(${portraitLayout.scale})`,
            transformOrigin: 'bottom center',
          }}
        >
          <div
            ref={portraitHit}
            className="absolute bottom-0 left-1/2 z-[2] h-full w-auto -translate-x-1/2 aspect-[3/4]"
          >
            <video
              ref={videoRef}
              src={workLoop}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="absolute inset-0 h-full w-full object-contain object-bottom"
            />
            {[...lookTrack, ...characterFrames.greet, grabSrc, drinkSrc, pointSrc, offerSrc, sadSrc, ...whatGrid.flat(), madFace].map((src) => (
              <img
                key={src}
                ref={(el) => {
                  poseRefs.current[src] = el
                }}
                src={src}
                alt=""
                draggable={false}
                className="absolute inset-0 h-full w-full object-contain object-bottom"
                style={{ opacity: 0, visibility: 'hidden' }}
              />
            ))}
            <AnimatePresence>
              {zone === 'center' && (
                <motion.div
                  key="greet"
                  data-from="side"
                  className="speech-bubble pointer-events-none absolute z-[6] w-max px-5 py-3 text-sm font-medium text-[#07070a] md:text-base"
                  style={{ left: '82%', top: '34%' }}
                  initial={{ opacity: 0, y: 8, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <motion.p key={greetStep} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                    {speech.center[greetStep] ?? speech.center[0]}
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {answer && (
                <motion.div
                  key={answer.id}
                  data-from="side-right"
                  className="speech-bubble pointer-events-auto absolute z-[7] w-[19rem] px-5 py-4 text-sm leading-relaxed text-[#07070a]"
                  style={{ right: '60%', top: '24%' }}
                  initial={{ opacity: 0, y: 8, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <button
                    type="button"
                    aria-label="Cerrar"
                    onClick={closeAnswer}
                    className="absolute right-2.5 top-2 text-base leading-none text-[#07070a]/50 hover:text-[#07070a]"
                  >
                    ×
                  </button>
                  <motion.p key={answer.text} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pr-3">
                    {answer.text}
                  </motion.p>
                  {answer.id === 'music' && !hasSong && (
                    <p className="mt-2 text-xs text-[#07070a]/55">Pronto va a sonar acá.</p>
                  )}
                  {answer.id === 'music' && hasSong && music === 'off' && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setMusic('playing')
                      }}
                      className="saludar-pulse mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#ff3d5a] px-3 py-2 text-xs font-medium text-white transition hover:brightness-110"
                    >
                      ▶ Reproducir
                    </button>
                  )}
                  {answer.id === 'music' && hasSong && music === 'playing' && (
                    <>
                      <p className="mt-2 text-xs text-[#07070a]/70">{heroQuestions.musicKeep}</p>
                      <div className="mt-3 flex gap-2">
                        {[
                          { label: 'Sí, dale', keep: true },
                          { label: 'No, gracias', keep: false },
                        ].map((o) => (
                          <button
                            key={o.label}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              keepMusic(o.keep)
                            }}
                            className="flex-1 rounded-xl bg-[#ff3d5a] px-3 py-2 text-xs font-medium text-white transition hover:brightness-110"
                          >
                            {o.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                  {answer.id === 'projects' && (
                    <a
                      href="#grupo-penna"
                      onClick={closeAnswer}
                      aria-label="Ir a mis proyectos"
                      className="saludar-pulse mt-3 flex size-10 items-center justify-center rounded-full bg-[#ff3d5a] text-lg text-white"
                    >
                      ↓
                    </a>
                  )}
                  {answer.id === 'mate' && answer.text === heroQuestions.mate[1] && (
                    <div className="mt-3 flex gap-2">
                      {[
                        { label: 'Sí', liked: true },
                        { label: 'No', liked: false },
                      ].map((o) => (
                        <button
                          key={o.label}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            rateMate(o.liked)
                          }}
                          className="flex-1 rounded-xl bg-[#ff3d5a] px-3 py-2 text-xs font-medium text-white transition hover:brightness-110"
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  )}
                  {answer.id === 'contact' && (
                    <div className="mt-3 flex flex-col gap-2">
                      <a
                        href={`mailto:${profile.email}`}
                        className="rounded-xl bg-[#ff3d5a] px-3 py-2 text-center text-xs font-medium text-white transition hover:brightness-110"
                      >
                        {profile.email}
                      </a>
                      <a
                        href={profile.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-xl border border-[#07070a]/15 px-3 py-2 text-center text-xs font-medium transition hover:border-[#ff3d5a] hover:text-[#ff3d5a]"
                      >
                        LinkedIn
                      </a>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <ChipField mx={px} my={py}>
            {chips.map((c, i) => (
              <FloatChip key={c.id} text={c.text} pos={c.pos} index={i} active={answer?.id === c.id} onAsk={() => ask(c.id)} />
            ))}
          </ChipField>
        </div>
      </motion.div>

      <div className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-t from-[#07070a] via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 left-0 z-[3] w-[36%] bg-gradient-to-r from-[#07070a]/55 via-transparent to-transparent" />

      <motion.div
        className="relative z-[4] flex min-h-[100svh] flex-col justify-end px-6 pb-16 pt-[54svh] sm:px-12 lg:max-w-[52vw] lg:justify-center lg:pb-0 lg:pt-24"
        style={{ y: textY, opacity: fade }}
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.p variants={item} className="mb-3 text-[11px] font-semibold tracking-[0.4em] text-[#ff3d5a]">
          ORIGINAL DESDE 1992
        </motion.p>
        <motion.h1
          variants={item}
          className="font-series leading-[0.82] tracking-[0.02em] text-[#f4f1ec]"
          style={{ fontSize: 'clamp(3.4rem, 9vw, 8.5rem)' }}
        >
          VANINA
          <span className="block">BALBASTRO</span>
        </motion.h1>
        <motion.p variants={item} className="mt-2 text-sm font-bold tracking-[0.5em] text-[#ff3d5a] sm:text-base">
          MI PORTAFOLIO
        </motion.p>
        <motion.p variants={item} className="mt-3 text-[13px] tracking-[0.16em] text-[#a7a6ad]">
          DESARROLLADORA FULL STACK CON ENFOQUE EN DISEÑO UX/UI
        </motion.p>
        <motion.p variants={item} className="mt-5 max-w-xl text-[15px] leading-relaxed text-[#f4f1ec]/80">
          Diseño la experiencia y la construyo de punta a punta: Figma, Front-End en React y TypeScript, y Back-End con Node.js. Paneles operativos, dashboards, permisos e IA aplicada a flujos reales.
        </motion.p>
        <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-3">
          <Magnetic>
            <button
              type="button"
              onClick={onPlay}
              className="flex min-h-12 items-center gap-2 rounded-md bg-[#f4f1ec] px-7 py-3 text-[15px] font-semibold text-black"
            >
              ▶ Play intro
            </button>
          </Magnetic>
          <a
            href="#grupo-penna"
            className="flex min-h-12 items-center rounded-md border border-white/20 px-6 py-3 text-[15px] font-semibold text-[#f4f1ec] hover:bg-white/10"
          >
            Ver proyecto
          </a>
        </motion.div>
      </motion.div>

      <motion.div aria-hidden className="pointer-events-none absolute inset-0 z-[5] bg-[#07070a]" style={{ opacity: blackout }} />

      <div
        ref={cursorRef}
        className="pointer-events-none absolute left-0 top-0 z-30 hidden md:block"
        style={{ opacity: 0 }}
      >
        {talk && zone !== 'center' && (
          <div
            data-from="center"
            className="speech-bubble absolute bottom-[calc(100%+0.6rem)] left-1/2 w-max max-w-[16rem] -translate-x-1/2 px-4 py-2.5 text-sm font-medium text-[#07070a]"
          >
            {talk.text}
          </div>
        )}
        <div className="flex size-16 items-center justify-center rounded-full border border-white/80 mix-blend-difference">
          <span className="size-1.5 rounded-full bg-white" />
        </div>
        {over && zone !== 'center' && !answer && (
          <span className="saludar-pulse absolute left-1/2 top-[calc(100%+0.4rem)] -translate-x-1/2 whitespace-nowrap rounded-full bg-[#ff3d5a] px-3 py-1 text-xs font-semibold text-white">
            Saludar
          </span>
        )}
      </div>
    </section>
  )
}

function ChipField({
  mx,
  my,
  children,
}: {
  mx: ReturnType<typeof useSpring>
  my: ReturnType<typeof useSpring>
  children: ReactNode
}) {
  const parallaxX = useTransform(mx, (n: number) => n * 12)
  const parallaxY = useTransform(my, (n: number) => n * 10)
  return (
    <motion.div className="pointer-events-none absolute inset-0 z-[5] hidden md:block" style={{ x: parallaxX, y: parallaxY }}>
      <motion.div
        className="absolute inset-0"
        animate={{ x: [0, 10, -6, 8, 0], y: [0, -14, -4, -18, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

function FloatChip({
  text,
  pos,
  index,
  active,
  onAsk,
}: {
  text: string
  pos: string
  index: number
  active: boolean
  onAsk: () => void
}) {
  return (
    <motion.button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onAsk()
      }}
      className={`glass pointer-events-auto absolute flex items-center justify-center rounded-xl px-4 py-2.5 text-center text-sm font-semibold leading-tight text-[#f4f1ec] transition-colors hover:border-[#ff3d5a]/70 hover:bg-[#ff3d5a]/15 ${active ? 'border-[#ff3d5a]/80 bg-[#ff3d5a]/20' : ''} ${pos}`}
      initial={{ opacity: 0, filter: 'blur(6px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.9, delay: 1.2 + index * 0.18, ease: EASE }}
    >
      {text}
    </motion.button>
  )
}
