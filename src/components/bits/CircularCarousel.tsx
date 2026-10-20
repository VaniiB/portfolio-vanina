import { useEffect, useRef, useState } from 'react'

export type CircularCarouselItem = {
  src: string
  title: string
  subtitle?: string
  href: string
}

type Props = {
  items: CircularCarouselItem[]
  onItemClick?: (item: CircularCarouselItem, index: number) => void
}

export function CircularCarousel({ items, onItemClick }: Props) {
  const n = Math.max(items.length, 1)
  const rootRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const moved = useRef(false)
  const lastX = useRef(0)
  const acc = useRef(0)
  const [active, setActive] = useState(0)
  const [hover, setHover] = useState(false)

  useEffect(() => {
    if (hover || n < 2) return undefined
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % n)
    }, 2800)
    return () => window.clearInterval(id)
  }, [hover, n])

  function shift(dir: number) {
    setActive((i) => (i + dir + n) % n)
  }

  function offsetOf(i: number) {
    let d = i - active
    if (d > n / 2) d -= n
    if (d < -n / 2) d += n
    return d
  }

  return (
    <div
      ref={rootRef}
      className="relative h-[420px] w-full select-none overflow-hidden outline-none sm:h-[480px] md:h-[560px]"
      style={{ perspective: '1600px' }}
      onPointerDown={(e) => {
        if (e.button !== 0) return
        dragging.current = true
        moved.current = false
        lastX.current = e.clientX
        acc.current = 0
        e.currentTarget.setPointerCapture(e.pointerId)
      }}
      onPointerMove={(e) => {
        if (!dragging.current) return
        const dx = e.clientX - lastX.current
        lastX.current = e.clientX
        acc.current += dx
        if (Math.abs(acc.current) > 6) moved.current = true
        if (acc.current > 90) {
          shift(-1)
          acc.current = 0
        } else if (acc.current < -90) {
          shift(1)
          acc.current = 0
        }
      }}
      onPointerUp={() => {
        dragging.current = false
      }}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => {
        setHover(false)
        dragging.current = false
      }}
    >
      <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
        {items.map((item, i) => {
          const d = offsetOf(i)
          const abs = Math.abs(d)
          const hidden = abs > 3
          return (
            <button
              key={`${item.href}-${i}`}
              type="button"
              className="absolute left-1/2 top-1/2 h-[300px] w-[210px] overflow-hidden rounded-2xl border border-white/15 bg-[#111] text-left shadow-[0_24px_70px_rgba(0,0,0,0.55)] transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:h-[360px] sm:w-[250px] md:h-[420px] md:w-[300px] [transform-style:preserve-3d]"
              style={{
                opacity: hidden ? 0 : 1,
                pointerEvents: hidden ? 'none' : 'auto',
                zIndex: 20 - abs,
                transform: `translate(-50%, -52%) translateX(${d * 210}px) translateZ(${-Math.abs(d) * 90}px) rotateY(${-d * 22}deg) scale(${d === 0 ? 1 : 0.86})`,
              }}
              onClick={() => {
                if (moved.current) return
                if (d !== 0) {
                  setActive(i)
                  return
                }
                onItemClick?.(item, i)
              }}
            >
              <img src={item.src} alt="" className="h-full w-full object-cover" draggable={false} />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent px-4 pb-4 pt-16">
                <span className="font-series block text-3xl leading-none text-[#f4f1ec] md:text-4xl">{item.title}</span>
                {item.subtitle ? (
                  <span className="mt-1 block text-[11px] tracking-[0.16em] text-[#ff3d5a] uppercase">{item.subtitle}</span>
                ) : null}
              </span>
            </button>
          )
        })}
      </div>
      <p className="pointer-events-none absolute bottom-3 left-0 right-0 text-center text-[11px] tracking-[0.2em] uppercase text-mute">
        {String(active + 1).padStart(2, '0')} / {String(n).padStart(2, '0')} · arrastrá
      </p>
    </div>
  )
}
