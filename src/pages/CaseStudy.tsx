import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { projects, type ProjectSlug } from '../data/site'
import { Eyebrow, Glass, Reveal, SeriesTitle, btnGhost, btnPrimary } from '../components/ui/Series'

export function CaseStudy() {
  const { slug } = useParams()
  const project = projects.find((p) => p.slug === slug)

  if (!project) {
    return <Navigate to="/trabajo" replace />
  }

  return (
    <article key={project.slug} className="relative isolate">
      <header className="relative flex min-h-[78vh] items-end overflow-hidden">
        {project.cover ? (
          <img src={project.cover} alt="" className="absolute inset-0 -z-10 size-full object-cover" />
        ) : null}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#07070a] via-[#07070a]/75 to-[#07070a]/30" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#07070a]/90 via-[#07070a]/30 to-transparent" />
        <div className="mx-auto w-full max-w-6xl px-5 pb-14 pt-32">
          <Reveal>
            <Eyebrow>
              {project.number} · {project.year}
            </Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <SeriesTitle className="mt-4 max-w-4xl">{project.title}</SeriesTitle>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-3 text-sm font-bold uppercase tracking-[0.4em] text-[#ff3d5a]">{project.kicker}</p>
            {project.badge && (
              <span className="mt-5 inline-block rounded-full border border-[#ff3d5a]/40 bg-[#07070a]/40 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-[#ff3d5a] backdrop-blur">
                {project.badge}
              </span>
            )}
          </Reveal>
          <Reveal delay={0.24}>
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-[#f4f1ec]/90">{project.summary}</p>
          </Reveal>
          {project.website ? (
            <Reveal delay={0.32} className="mt-8 flex flex-wrap gap-3">
              <a href={project.website} target="_blank" rel="noreferrer" className={btnPrimary}>
                Sitio web <ArrowUpRight size={16} />
              </a>
            </Reveal>
          ) : null}
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <dl className="grid gap-4 sm:grid-cols-3">
            {[
              { label: 'Rol', value: project.role },
              { label: 'Stack', value: project.stack.join(' · ') },
              { label: 'Origen', value: project.origin },
            ].map((d) => (
              <Glass key={d.label} className="p-5">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#ff3d5a]">{d.label}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-[#f4f1ec]/90">{d.value}</dd>
              </Glass>
            ))}
          </dl>
        </Reveal>

        <section className="mt-20 grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <Eyebrow>Capítulo 1</Eyebrow>
            <SeriesTitle as="h2" size="clamp(2.6rem, 5vw, 4.5rem)" className="mt-3">
              El problema
            </SeriesTitle>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-lg leading-relaxed text-[#f4f1ec]/90">{project.problem}</p>
          </Reveal>
        </section>

        <section className="mt-20">
          <Reveal>
            <Eyebrow>Capítulo 2</Eyebrow>
            <SeriesTitle as="h2" size="clamp(2.6rem, 5vw, 4.5rem)" className="mt-3">
              Proceso
            </SeriesTitle>
          </Reveal>
          <ol className="mt-8 grid gap-4 md:grid-cols-2">
            {project.process.map((step, i) => (
              <li key={step}>
                <Reveal delay={i * 0.05}>
                  <Glass className="flex h-full gap-5 p-6">
                    <span className="font-series text-5xl leading-none text-[#ff3d5a]">0{i + 1}</span>
                    <p className="leading-relaxed text-[#f4f1ec]/90">{step}</p>
                  </Glass>
                </Reveal>
              </li>
            ))}
          </ol>
        </section>

        <Reveal className="mt-20">
          <section className="relative overflow-hidden rounded-2xl border border-[#ff3d5a]/40 bg-[#ff3d5a]/[0.06] p-8 md:p-10">
            <div
              aria-hidden
              className="absolute -right-20 -top-20 size-72 rounded-full blur-3xl"
              style={{ background: 'radial-gradient(circle, rgba(255,61,90,0.3), transparent 70%)' }}
            />
            <p className="relative flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.4em] text-[#ff3d5a]">
              <Sparkles size={14} /> Módulo de IA
            </p>
            <SeriesTitle as="h2" size="clamp(2.2rem, 4.5vw, 4rem)" className="relative mt-3">
              {project.ai.title}
            </SeriesTitle>
            <p className="relative mt-4 max-w-3xl leading-relaxed text-[#f4f1ec]/90">{project.ai.body}</p>
          </section>
        </Reveal>

        {project.backend && project.backend.length > 0 ? (
          <section id="backend" className="mt-20 scroll-mt-24">
            <Reveal>
              <Eyebrow>Detrás de escena</Eyebrow>
              <SeriesTitle as="h2" size="clamp(2.6rem, 5vw, 4.5rem)" className="mt-3">
                Back-End
              </SeriesTitle>
            </Reveal>
            <ul className="mt-8 grid gap-3 md:grid-cols-2">
              {project.backend.map((item, i) => (
                <li key={item}>
                  <Reveal delay={i * 0.04}>
                    <Glass className="flex h-full gap-3 p-5 text-sm leading-relaxed text-[#f4f1ec]/90">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#ff3d5a]" />
                      {item}
                    </Glass>
                  </Reveal>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="mt-20 grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <Eyebrow>Final de temporada</Eyebrow>
            <SeriesTitle as="h2" size="clamp(2.6rem, 5vw, 4.5rem)" className="mt-3">
              Resultado
            </SeriesTitle>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-lg leading-relaxed text-[#f4f1ec]/90">{project.outcome}</p>
            <Link to="/trabajo" className={`${btnGhost} mt-8`}>
              Todos los proyectos
            </Link>
          </Reveal>
        </section>

        <NextProject current={project.slug} />
      </div>
    </article>
  )
}

function NextProject({ current }: { current: ProjectSlug }) {
  const idx = projects.findIndex((p) => p.slug === current)
  const next = projects[(idx + 1) % projects.length]
  return (
    <Reveal className="mt-24">
      <Link
        to={`/trabajo/${next.slug}`}
        className="group relative block overflow-hidden rounded-2xl border border-white/10"
      >
        {next.cover ? (
          <img
            src={next.cover}
            alt=""
            className="absolute inset-0 size-full object-cover opacity-40 transition duration-700 group-hover:scale-105 group-hover:opacity-60"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-r from-[#07070a] via-[#07070a]/70 to-transparent" />
        <div className="relative flex items-end justify-between gap-6 p-8 md:p-12">
          <div>
            <Eyebrow>Próximo episodio</Eyebrow>
            <SeriesTitle as="h2" size="clamp(2.6rem, 6vw, 5.5rem)" className="mt-3">
              {next.title}
            </SeriesTitle>
            <p className="mt-1 text-mute">{next.kicker}</p>
          </div>
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#ff3d5a] text-white transition group-hover:scale-110">
            <ArrowUpRight size={22} />
          </span>
        </div>
      </Link>
    </Reveal>
  )
}
