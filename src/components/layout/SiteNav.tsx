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
        <NavLink to="/" className="text-[13px] font-semibold uppercase tracking-[0.22em] text-white">
          {profile.name}
        </NavLink>
        <nav className="flex items-center gap-6 text-[13px] uppercase tracking-[0.16em] text-white/70">
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
