import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { EASE } from '../fx'

export const btnPrimary =
  'inline-flex min-h-12 items-center gap-2 rounded-md bg-[#f4f1ec] px-7 py-3 text-[15px] font-semibold text-black transition hover:bg-white'
export const btnGhost =
  'inline-flex min-h-12 items-center gap-2 rounded-md border border-white/20 px-6 py-3 text-[15px] font-semibold text-[#f4f1ec] transition hover:bg-white/10'
export const btnRed =
  'inline-flex min-h-12 items-center gap-2 rounded-md bg-[#ff3d5a] px-7 py-3 text-[15px] font-semibold text-white transition hover:brightness-110'

export function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`text-[11px] font-semibold uppercase tracking-[0.4em] text-[#ff3d5a] ${className}`}>{children}</p>
  )
}

export function SeriesTitle({
  children,
  as: Tag = 'h1',
  size = 'clamp(3.4rem, 9vw, 8rem)',
  className = '',
}: {
  children: ReactNode
  as?: 'h1' | 'h2' | 'h3'
  size?: string
  className?: string
}) {
  return (
    <Tag
      className={`font-series uppercase leading-[0.85] tracking-[0.02em] text-[#f4f1ec] ${className}`}
      style={{ fontSize: size }}
    >
      {children}
    </Tag>
  )
}

export function Glass({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`glass rounded-2xl ${className}`}>{children}</div>
}

export function PageGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[70vh]"
      style={{
        background:
          'radial-gradient(60% 50% at 75% 20%, rgba(255,61,90,0.16), transparent 70%), radial-gradient(40% 40% at 10% 0%, rgba(255,255,255,0.05), transparent 70%)',
      }}
    />
  )
}
