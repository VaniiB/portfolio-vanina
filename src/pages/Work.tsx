import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { moreProjects, projects } from '../data/site'
import { StarBorder } from '../components/bits/StarBorder'
import { Eyebrow, PageGlow, Reveal, SeriesTitle } from '../components/ui/Series'

export function Work() {
  return (
    <div className="relative isolate">
      <PageGlow />
      <section className="mx-auto max-w-6xl px-5 pb-6 pt-16">
        <Reveal>
          <Eyebrow>Seleccionado</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <SeriesTitle className="mt-4">Proyectos</SeriesTitle>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-[#d8d6d2]">
            Grupo Penna es el trabajo real. El resto son proyectos de portafolio llevados a producto: marca, flujos
            e IA visible.
          </p>
        </Reveal>
      </section>

      <ol className="mx-auto mt-8 max-w-6xl space-y-6 px-5">
        {projects.map((p, i) => (
          <li key={p.slug}>
            <Reveal delay={i * 0.04}>
              <Link
                to={`/trabajo/${p.slug}`}
                className="glass group grid overflow-hidden rounded-2xl transition hover:border-[#ff3d5a]/50 md:grid-cols-[minmax(0,0.9fr)_1.1fr]"
              >
                <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto">
                  <img
                    src={p.cover ?? '/covers/eternal.jpg'}
                    alt={p.title}
                    className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#07070a]/60" />
                  <span className="font-series absolute left-5 top-3 text-6xl text-white/90 drop-shadow-lg">
                    {p.number}
                  </span>
                </div>
                <div className="flex flex-col p-6 md:p-8">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#ff3d5a]">{p.year}</p>
                  <h2 className="font-series mt-2 text-4xl tracking-[0.02em] md:text-5xl">{p.title}</h2>
                  <p className="text-mute">{p.kicker}</p>
                  <p className="mt-4 leading-relaxed text-[#f4f1ec]/85">{p.summary}</p>
                  {p.badge && (
                    <span className="mt-5 w-fit rounded-full border border-[#ff3d5a]/40 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-[#ff3d5a]">
                      {p.badge}
                    </span>
                  )}
                  <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-[#ff3d5a]">
                    Ver el trabajo
                    <ArrowUpRight size={16} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          </li>
        ))}
      </ol>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <Reveal>
          <Eyebrow>Archivo</Eyebrow>
          <SeriesTitle as="h2" size="clamp(2.6rem, 6vw, 5rem)" className="mt-3">
            Más proyectos
          </SeriesTitle>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
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
