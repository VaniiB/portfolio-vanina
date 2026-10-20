import { useEffect, useRef, type ReactNode, type PointerEvent as RPointerEvent } from 'react'
import { motion, useSpring } from 'framer-motion'
import { useFinePointer, useReducedMotionPref } from '../hooks/useMedia'

export const EASE = [0.22, 1, 0.36, 1] as const

export function Magnetic({
  children,
  strength = 0.35,
  className = '',
}: {
  children: ReactNode
  strength?: number
  className?: string
}) {
  const fine = useFinePointer()
  const reduced = useReducedMotionPref()
  const x = useSpring(0, { stiffness: 220, damping: 18 })
  const y = useSpring(0, { stiffness: 220, damping: 18 })
  const active = fine && !reduced

  const onMove = (e: RPointerEvent<HTMLSpanElement>) => {
    if (!active) return
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }

  return (
    <motion.span
      className={`inline-flex ${className}`}
      style={{ x, y }}
      onPointerMove={onMove}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.span>
  )
}

export function Particles({
  count = 46,
  color = '255,90,110',
  className = '',
  size = 1,
  speed = 1,
}: {
  count?: number
  color?: string
  className?: string
  size?: number
  speed?: number
}) {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotionPref()

  useEffect(() => {
    const canvas = ref.current
    if (!canvas || reduced) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const layer: HTMLCanvasElement = canvas
    const draw: CanvasRenderingContext2D = ctx
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0
    let h = 0
    const resize = () => {
      w = layer.clientWidth
      h = layer.clientHeight
      layer.width = w * dpr
      layer.height = h * dpr
      draw.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(layer)

    const dots = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: (Math.random() * 1.8 + 0.35) * size,
      vx: (Math.random() - 0.5) * 0.00012 * speed,
      vy: (-Math.random() * 0.00028 - 0.00006) * speed,
      a: Math.random() * 0.6 + 0.15,
      tw: Math.random() * Math.PI * 2,
    }))

    let raf = 0
    let running = false
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(50, now - last)
      last = now
      draw.clearRect(0, 0, w, h)
      for (const d of dots) {
        d.x += d.vx * dt
        d.y += d.vy * dt
        d.tw += dt * 0.002 * speed
        if (d.y < -0.02) {
          d.y = 1.02
          d.x = Math.random()
        }
        if (d.x < -0.02) d.x = 1.02
        if (d.x > 1.02) d.x = -0.02
        const alpha = d.a * (0.6 + 0.4 * Math.sin(d.tw))
        draw.beginPath()
        draw.fillStyle = `rgba(${color},${alpha})`
        draw.arc(d.x * w, d.y * h, d.r, 0, Math.PI * 2)
        draw.fill()
      }
      raf = requestAnimationFrame(tick)
    }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true
        last = performance.now()
        raf = requestAnimationFrame(tick)
      } else if (!entry.isIntersecting && running) {
        running = false
        cancelAnimationFrame(raf)
      }
    })
    io.observe(layer)
    return () => {
      io.disconnect()
      ro.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [count, color, reduced, size, speed])

  return <canvas ref={ref} className={`pointer-events-none absolute inset-0 ${className}`} />
}

const REACT_CODE = [
  'const [open, setOpen] = useState(false)',
  'useEffect(() => {}, [])',
  'const ref = useRef(null)',
  'return <div className="hero">',
  'export function SeriesHero()',
  'onClick={() => setOpen(true)}',
  '{items.map((item) => (',
  '<Link to="/trabajo">',
  'const px = useSpring(mx)',
  'className="relative z-[2]"',
  'if (!over) return null',
  'await fetch("/api")',
  'import { motion } from "framer-motion"',
  'type Props = { open: boolean }',
  'children ? children : null',
  'key={item.id}',
  '() => setCount((n) => n + 1)',
  'filter: blur(0px)',
  '<AnimatePresence>',
  'tsx',
]

export function MatrixRain({ className = '' }: { className?: string }) {
  const codeRef = useRef<HTMLCanvasElement>(null)
  const wallRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const code = codeRef.current
    const wall = wallRef.current
    if (!code || !wall) return
    const codeCtx = code.getContext('2d')
    const wallCtx = wall.getContext('2d')
    if (!codeCtx || !wallCtx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0
    let h = 0
    let last = { x: -999, y: -999 }
    const pos = { x: 0.5, y: 0.4, active: false }

    const paintCode = () => {
      codeCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
      codeCtx.clearRect(0, 0, w, h)
      codeCtx.fillStyle = '#07070a'
      codeCtx.fillRect(0, 0, w, h)
      codeCtx.font = '12px ui-monospace, Consolas, monospace'
      codeCtx.textBaseline = 'top'
      const stepX = 140
      const stepY = 44
      for (let y = 18, row = 0; y < h; y += stepY, row++) {
        for (let x = 16 + (row % 2) * 36; x < w; x += stepX) {
          const t = REACT_CODE[(row * 7 + ((x / stepX) | 0)) % REACT_CODE.length]
          codeCtx.fillStyle = Math.random() > 0.82 ? 'rgba(255, 150, 162, 0.7)' : 'rgba(229, 19, 43, 0.5)'
          codeCtx.fillText(t, x, y)
        }
      }
    }

    const fillWall = () => {
      wallCtx.setTransform(1, 0, 0, 1, 0, 0)
      wallCtx.globalCompositeOperation = 'source-over'
      wallCtx.fillStyle = '#07070a'
      wallCtx.fillRect(0, 0, wall.width, wall.height)
      wallCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      if (w < 2 || h < 2) return
      for (const c of [code, wall]) {
        c.width = Math.floor(w * dpr)
        c.height = Math.floor(h * dpr)
      }
      paintCode()
      fillWall()
    }
    resize()
    window.addEventListener('resize', resize)

    const punch = (x: number, y: number) => {
      const r = 78
      const g = wallCtx.createRadialGradient(x, y, r * 0.15, x, y, r)
      g.addColorStop(0, 'rgba(0,0,0,1)')
      g.addColorStop(0.55, 'rgba(0,0,0,0.55)')
      g.addColorStop(1, 'rgba(0,0,0,0)')
      wallCtx.globalCompositeOperation = 'destination-out'
      wallCtx.fillStyle = g
      wallCtx.beginPath()
      wallCtx.arc(x, y, r, 0, Math.PI * 2)
      wallCtx.fill()
    }

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX / Math.max(1, window.innerWidth)
      pos.y = e.clientY / Math.max(1, window.innerHeight)
      pos.active = true
    }
    const onLeave = () => {
      pos.active = false
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('blur', onLeave)

    let raf = 0
    const tick = () => {
      if (pos.active) {
        const px = pos.x * w
        const py = pos.y * h
        if (last.x < 0) last = { x: px, y: py }
        const dx = px - last.x
        const dy = py - last.y
        const dist = Math.hypot(dx, dy)
        if (dist > 2) {
          const steps = Math.max(1, Math.ceil(dist / 14))
          for (let i = 1; i <= steps; i++) {
            punch(last.x + (dx * i) / steps, last.y + (dy * i) / steps)
          }
          last = { x: px, y: py }
        }
      } else {
        last = { x: -999, y: -999 }
      }
      wallCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
      wallCtx.globalCompositeOperation = 'source-over'
      wallCtx.fillStyle = 'rgba(7, 7, 10, 0.05)'
      wallCtx.fillRect(0, 0, w, h)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('blur', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div aria-hidden className={`pointer-events-none fixed inset-0 z-0 bg-[#07070a] ${className}`}>
      <canvas ref={codeRef} className="absolute inset-0 h-full w-full" />
      <canvas ref={wallRef} className="absolute inset-0 h-full w-full" />
    </div>
  )
}
