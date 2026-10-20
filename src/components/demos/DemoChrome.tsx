import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

type Props = {
  name: string
  casePath: string
  children: ReactNode
  tone?: 'dark' | 'light'
}

export function DemoChrome({ name, casePath, children, tone = 'dark' }: Props) {
  const dark = tone === 'dark'
  return (
    <div className={dark ? 'min-h-screen bg-[#0b0b0c] text-[#f3efe6]' : 'min-h-screen bg-[#f4f1ea] text-[#1a1a18]'}>
      <div
        className={
          dark
            ? 'sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-black/70 px-4 py-2.5 text-xs backdrop-blur'
            : 'sticky top-0 z-40 flex items-center justify-between border-b border-black/10 bg-white/80 px-4 py-2.5 text-xs backdrop-blur'
        }
      >
        <Link to={casePath} className="inline-flex items-center gap-2 opacity-80 hover:opacity-100">
          <ArrowLeft size={14} />
          Volver al proyecto
        </Link>
        <p className="tracking-[0.18em] uppercase opacity-70">Demo de portafolio · {name}</p>
        <Link to="/" className="opacity-80 hover:opacity-100">
          Vanina Balbastro
        </Link>
      </div>
      {children}
    </div>
  )
}
