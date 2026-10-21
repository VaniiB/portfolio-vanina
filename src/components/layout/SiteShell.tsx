import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { MatrixRain } from '../fx'
import { MusicPlayer } from '../MusicPlayer'
import { SiteFooter } from './SiteFooter'
import { SiteNav } from './SiteNav'

export function SiteShell() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])

  return (
    <div className="relative min-h-screen overflow-x-clip text-ink">
      <MatrixRain />
      <div className="grain" />
      <SiteNav />
      <main className="relative z-10">
        <Outlet />
      </main>
      <SiteFooter />
      <MusicPlayer />
    </div>
  )
}
