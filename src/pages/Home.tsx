import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { OpeningSequence } from '../components/home/OpeningSequence'
import { SeriesHero } from '../components/home/SeriesHero'
import { CircularCarousel } from '../components/bits/CircularCarousel'
import { StarBorder } from '../components/bits/StarBorder'
import { moreProjects, projects } from '../data/site'

export function Home() {
  const featured = projects.find((p) => p.featured) ?? projects[0]
  const [intro, setIntro] = useState(() => sessionStorage.getItem('vb-intro') !== '1')
  const navigate = useNavigate()

  useEffect(() => {
    document.body.style.overflow = intro ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [intro])

  function closeIntro() {
    sessionStorage.setItem('vb-intro', '1')
    setIntro(false)
  }

  return (
    <div>
      {createPortal(
        <AnimatePresence>{intro && <OpeningSequence key="intro" onDone={closeIntro} />}</AnimatePresence>,
        document.body,
      )}
      <SeriesHero onPlay={() => setIntro(true)} />

      <section id="grupo-penna" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-[12px] tracking-[0.24em] uppercase text-[#ff3d5a]">
              {featured.number} · Destacado
            </p>
            <h2 className="font-series mt-3 text-5xl md:text-7xl">{featured.title}</h2>
            <p className="mt-2 text-mute">{featured.kicker}</p>
          </div>
          <span className="hidden rounded-full border border-[#ff3d5a]/40 px-3 py-1 text-[11px] tracking-[0.14em] uppercase text-[#ff3d5a] md:inline">
            {featured.badge}
          </span>
        </div>
        {featured.cover ? (
          <img
            src={featured.cover}
            alt={featured.title}
            className="mt-8 aspect-[16/8] w-full rounded-2xl object-cover object-center"
          />
        ) : null}
        <p className="mt-8 text-lg leading-relaxed text-ink/85">{featured.summary}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to={`/trabajo/${featured.slug}`} className="inline-flex items-center gap-2 text-sm text-[#ff3d5a]">
            Ver el trabajo <ArrowUpRight size={16} />
          </Link>
          {featured.website ? (
            <a
              href={featured.website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm"
            >
              Sitio web <ArrowUpRight size={16} />
            </a>
          ) : null}
        </div>
      </section>

      <section className="relative pb-8">
        <div className="mx-auto mb-2 flex max-w-6xl items-baseline justify-between px-5">
          <h2 className="font-series text-4xl md:text-6xl">Proyectos</h2>
          <Link to="/trabajo" className="text-[11px] tracking-[0.16em] uppercase text-mute">
            Ver todos
          </Link>
        </div>
        <CircularCarousel
          items={projects.map((p) => ({
            src: p.cover ?? '/covers/eternal.jpg',
            title: p.slug === 'comcam' ? 'Grupo Penna' : p.title,
            subtitle: p.slug === 'comcam' ? 'Comcam' : p.kicker,
            href: `/trabajo/${p.slug}`,
          }))}
          onItemClick={(item) => navigate(item.href)}
        />
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <p className="text-[12px] tracking-[0.2em] uppercase text-mute">Más proyectos</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {moreProjects.map((p) => (
            <StarBorder key={p.name} className="w-full" radius={12} color="#ff3d5a" duration={14} glow={0.35} trailLength={0.18} sparkle>
              <div className="rounded-xl border border-white/10 bg-[#0c0c0f] px-4 py-4">
                <p className="text-sm">{p.name}</p>
                <p className="text-xs text-mute">{p.kind}</p>
              </div>
            </StarBorder>
          ))}
        </div>
      </section>
    </div>
  )
}
