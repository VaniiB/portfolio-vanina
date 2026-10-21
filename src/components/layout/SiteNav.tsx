import { NavLink, useLocation } from 'react-router-dom'
import { profile } from '../../data/site'

const links = [
  { to: '/trabajo', label: 'Trabajo' },
  { to: '/sobre', label: 'Sobre mí' },
  { to: '/contacto', label: 'Contacto' },
]

export function SiteNav() {
  const { pathname } = useLocation()
  const overlay = pathname === '/' || pathname.startsWith('/trabajo/')

  return (
    <header
      className={
        overlay
          ? 'absolute inset-x-0 top-0 z-40'
          : 'sticky top-0 z-40 border-b border-white/5 bg-[#07070a]/70 backdrop-blur-md'
      }
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <NavLink to="/" className="whitespace-nowrap text-[13px] font-semibold uppercase tracking-[0.22em] text-white">
          <span className="font-series text-2xl tracking-[0.06em] sm:hidden">VB</span>
          <span className="hidden sm:inline">{profile.name}</span>
        </NavLink>
        <nav className="flex items-center gap-4 whitespace-nowrap text-[11px] uppercase tracking-[0.12em] text-white/70 sm:gap-6 sm:text-[13px] sm:tracking-[0.16em]">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                isActive ? 'text-[#ff3d5a]' : 'transition-colors hover:text-white'
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
