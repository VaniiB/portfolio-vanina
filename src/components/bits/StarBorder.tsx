import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

type Point = { x: number; y: number; nx: number; ny: number }
type Segment = { length: number; x: number; y: number; dx: number; dy: number; angle: number | null }
type Shape = { r: number; segments: Segment[]; total: number }
type Rgb = [number, number, number]
type Pulse = { origin: number; age: number }
type Mote = { x: number; y: number; vx: number; vy: number; age: number; life: number; size: number; seed: number }

const BLEED = 48
const TAU = Math.PI * 2
const WHITE: Rgb = [255, 255, 255]

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))
const wrap = (v: number, total: number) => ((v % total) + total) % total
const mix = (a: Rgb, b: Rgb, t: number): Rgb => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
const rgba = (rgb: Rgb, a: number) =>
  `rgba(${Math.round(rgb[0])}, ${Math.round(rgb[1])}, ${Math.round(rgb[2])}, ${clamp(a, 0, 1).toFixed(3)})`

let colorCtx: CanvasRenderingContext2D | null = null
function toRgb(color: string): Rgb {
  colorCtx = colorCtx ?? document.createElement('canvas').getContext('2d')
  if (!colorCtx) return WHITE
  colorCtx.fillStyle = '#000'
  colorCtx.fillStyle = color
  const value = String(colorCtx.fillStyle)
  if (value.startsWith('#')) {
    const hex = parseInt(value.slice(1, 7), 16)
    return [(hex >> 16) & 255, (hex >> 8) & 255, hex & 255]
  }
  const parts = value.match(/[\d.]+/g)?.map(Number) ?? WHITE
  return [parts[0], parts[1], parts[2]]
}

function outline(width: number, height: number, radius: number): Shape {
  const r = Math.max(0, Math.min(radius, width / 2, height / 2))
  const arc = (Math.PI * r) / 2
  const across = Math.max(0, width - 2 * r)
  const down = Math.max(0, height - 2 * r)
  const segments: Segment[] = [
    { length: across, x: r, y: 0, dx: 1, dy: 0, angle: null },
    { length: arc, x: width - r, y: r, dx: 0, dy: 0, angle: -Math.PI / 2 },
    { length: down, x: width, y: r, dx: 0, dy: 1, angle: null },
    { length: arc, x: width - r, y: height - r, dx: 0, dy: 0, angle: 0 },
    { length: across, x: width - r, y: height, dx: -1, dy: 0, angle: null },
    { length: arc, x: r, y: height - r, dx: 0, dy: 0, angle: Math.PI / 2 },
    { length: down, x: 0, y: height - r, dx: 0, dy: -1, angle: null },
    { length: arc, x: r, y: r, dx: 0, dy: 0, angle: Math.PI },
  ]
  return { r, segments, total: Math.max(1, segments.reduce((s, seg) => s + seg.length, 0)) }
}

function pointAt(shape: Shape, distance: number, point: Point) {
  let s = wrap(distance, shape.total)
  for (const segment of shape.segments) {
    if (segment.length > 0 && s <= segment.length) {
      if (segment.angle === null) {
        point.x = segment.x + segment.dx * s
        point.y = segment.y + segment.dy * s
        point.nx = segment.dy
        point.ny = -segment.dx
      } else {
        const angle = segment.angle + s / shape.r
        point.nx = Math.cos(angle)
        point.ny = Math.sin(angle)
        point.x = segment.x + point.nx * shape.r
        point.y = segment.y + point.ny * shape.r
      }
      return point
    }
    s -= segment.length
  }
  return point
}

export function StarBorder({
  children,
  className = '',
  style,
  color = '#ff3d5a',
  duration = 5,
  thickness = 1.4,
  radius = 16,
  trailLength = 0.32,
  stars = 1,
  glow = 0.75,
  sparkle = true,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
  color?: string
  duration?: number
  thickness?: number
  radius?: number
  trailLength?: number
  stars?: number
  glow?: number
  sparkle?: boolean
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!root || !canvas || !ctx) return undefined

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    const point: Point = { x: 0, y: 0, nx: 0, ny: -1 }
    const head = toRgb(color)
    const tail = toRgb(color)
    const state = {
      width: 0,
      height: 0,
      dpr: 1,
      phase: 0,
      velocity: 0,
      time: 0,
      visible: true,
    }
    const dust: Mote[] = []
    const pulses: Pulse[] = []
    let raf = 0
    let last = performance.now()
    let alive = true
    let emit = 0

    const measure = () => {
      state.width = root.offsetWidth
      state.height = root.offsetHeight
      state.dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.round((state.width + BLEED * 2) * state.dpr))
      canvas.height = Math.max(1, Math.round((state.height + BLEED * 2) * state.dpr))
    }

    const shapeFor = () =>
      outline(Math.max(1, state.width - thickness), Math.max(1, state.height - thickness), radius - thickness / 2)

    const stroke = (x1: number, y1: number, x2: number, y2: number, width: number, style: string | CanvasGradient) => {
      ctx.lineWidth = width
      ctx.strokeStyle = style
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }

    const drawTrail = (shape: Shape, at: number, length: number, sign: number, intensity: number) => {
      if (length < 0.5 || intensity <= 0) return
      const steps = clamp(Math.ceil(length / 2), 2, 90)
      pointAt(shape, at, point)
      let px = point.x
      let py = point.y
      for (let i = 1; i <= steps; i++) {
        pointAt(shape, at - sign * length * (i / steps), point)
        const u = 1 - (i - 0.5) / steps
        const fade = u * u * intensity
        const tone = mix(tail, mix(head, WHITE, u ** 6 * 0.65), u)
        ctx.lineCap = i === 1 ? 'round' : 'butt'
        stroke(px, py, point.x, point.y, 2 + 6 * glow, rgba(tone, fade * 0.2 * glow))
        stroke(px, py, point.x, point.y, thickness, rgba(tone, fade))
        px = point.x
        py = point.y
      }
    }

    const drawHead = (x: number, y: number, intensity: number, twinkle: number) => {
      if (intensity <= 0) return
      const reach = (12 + 40 * glow) 
      const bloom = ctx.createRadialGradient(x, y, 0, x, y, reach)
      const strength = 0.4 * glow * intensity
      bloom.addColorStop(0, rgba(head, strength))
      bloom.addColorStop(0.2, rgba(head, strength * 0.4))
      bloom.addColorStop(1, rgba(head, 0))
      ctx.fillStyle = bloom
      ctx.fillRect(x - reach, y - reach, reach * 2, reach * 2)
      if (!sparkle) return
      const size = 1 + thickness * 0.6
      ctx.fillStyle = rgba(WHITE, intensity)
      ctx.beginPath()
      ctx.arc(x, y, size, 0, TAU)
      ctx.fill()
      const spike = (3 + 4 * glow + thickness * 1.5) * twinkle
      const h = ctx.createLinearGradient(x - spike, y, x + spike, y)
      h.addColorStop(0, rgba(head, 0))
      h.addColorStop(0.5, rgba(WHITE, intensity * 0.95))
      h.addColorStop(1, rgba(head, 0))
      stroke(x - spike, y, x + spike, y, 1, h)
      const v = ctx.createLinearGradient(x, y - spike, x, y + spike)
      v.addColorStop(0, rgba(head, 0))
      v.addColorStop(0.5, rgba(WHITE, intensity * 0.95))
      v.addColorStop(1, rgba(head, 0))
      stroke(x, y - spike, x, y + spike, 1, v)
    }

    const frame = (now: number) => {
      raf = 0
      if (!alive) return
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000))
      last = now
      state.time += dt
      const shape = shapeFor()
      const total = shape.total
      const cruise = reduce ? 0 : total / Math.max(0.3, duration)
      state.velocity += (cruise - state.velocity) * (1 - Math.exp(-dt / 0.45))
      state.phase = wrap(state.phase + state.velocity * dt, total)

      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const offset = (BLEED + thickness / 2) * state.dpr
      ctx.setTransform(state.dpr, 0, 0, state.dpr, offset, offset)
      ctx.globalCompositeOperation = 'lighter'

      const spacing = total / clamp(Math.round(stars), 1, 6)
      const span = trailLength * duration
      const length = Math.min(Math.abs(state.velocity) * span, spacing * 0.92, total * 0.6)

      for (let i = 0; i < stars; i++) {
        const at = state.phase + i * spacing
        drawTrail(shape, at, length, 1, 1)
        pointAt(shape, at, point)
        const twinkle = 0.82 + 0.18 * Math.sin(state.time * 6.1 + i * 2.3)
        drawHead(point.x, point.y, 1, twinkle)
        if (sparkle && !reduce) {
          emit += dt * 4
          if (emit > 1 && dust.length < 40) {
            emit -= 1
            dust.push({
              x: point.x,
              y: point.y,
              vx: (Math.random() - 0.5) * 10,
              vy: (Math.random() - 0.5) * 10,
              age: 0,
              life: 0.35 + Math.random() * 0.4,
              size: 0.45 + Math.random() * 0.7,
              seed: Math.random() * TAU,
            })
          }
        }
      }
      for (let i = dust.length - 1; i >= 0; i--) {
        const mote = dust[i]
        mote.age += dt
        mote.x += mote.vx * dt
        mote.y += mote.vy * dt
        mote.vx *= Math.exp(-dt * 2.2)
        mote.vy *= Math.exp(-dt * 2.2)
        const left = 1 - mote.age / mote.life
        if (left > 0) {
          ctx.fillStyle = rgba(mix(head, WHITE, 0.6), left * 0.7)
          ctx.beginPath()
          ctx.arc(mote.x, mote.y, mote.size * (0.6 + 0.4 * left), 0, TAU)
          ctx.fill()
        }
        if (mote.age >= mote.life) dust.splice(i, 1)
      }
      void pulses
      if (state.visible) raf = requestAnimationFrame(frame)
    }

    const wake = () => {
      if (raf || !alive || !state.visible) return
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }

    const ro = new ResizeObserver(() => {
      measure()
      wake()
    })
    ro.observe(root)
    const io = new IntersectionObserver((entries) => {
      state.visible = entries.some((e) => e.isIntersecting)
      if (state.visible) wake()
    })
    io.observe(root)
    measure()
    wake()
    return () => {
      alive = false
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
    }
  }, [color, duration, thickness, radius, trailLength, stars, glow, sparkle])

  return (
    <div ref={rootRef} className={`relative ${className}`} style={style}>
      {children}
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute top-[-48px] left-[-48px] z-10 h-[calc(100%+96px)] w-[calc(100%+96px)]"
      />
    </div>
  )
}
