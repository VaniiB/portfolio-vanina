import { Link } from 'react-router-dom'
import { characterFrames } from '../data/character'
import { education, experience, heroQuestions, profile } from '../data/site'
import { Eyebrow, Glass, PageGlow, Reveal, SeriesTitle, btnGhost, btnPrimary } from '../components/ui/Series'

export function About() {
  return (
    <div className="relative isolate">
      <PageGlow />
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-10 pt-16 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <Reveal>
            <Eyebrow>Sobre mí</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <SeriesTitle className="mt-4">
              Vanina
              <span className="block">Balbastro</span>
            </SeriesTitle>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-3 text-sm font-bold uppercase tracking-[0.5em] text-[#ff3d5a]">Vani</p>
            <p className="mt-2 text-[12px] uppercase tracking-[0.2em] text-[#d8d6d2]">{profile.title}</p>
          </Reveal>
          <Reveal delay={0.24}>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-[#f4f1ec]/90">{heroQuestions.about}</p>
            <p className="mt-4 max-w-xl leading-relaxed text-mute">
              Hoy trabajo en <strong className="font-semibold text-[#f4f1ec]">Grupo Penna</strong>: el sitio
              institucional y el sistema Comcam, de la interfaz al Back-End. Me interesa el software que se usa
              todos los días, con un poco de IA cuando realmente ahorra tiempo.
            </p>
          </Reveal>
          <Reveal delay={0.32} className="mt-8 flex flex-wrap gap-3">
            <Link to="/trabajo" className={btnPrimary}>
              Ver proyectos
            </Link>
            <Link to="/contacto" className={btnGhost}>
              Hablemos
            </Link>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="relative mx-auto w-full max-w-md">
          <div
            aria-hidden
            className="absolute inset-[12%] rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(255,61,90,0.35), transparent 70%)' }}
          />
          <img src={characterFrames.greet[0]} alt="Vani saludando" className="relative w-full select-none" draggable={false} />
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <Reveal>
          <Eyebrow>Trayectoria</Eyebrow>
          <SeriesTitle as="h2" size="clamp(2.6rem, 6vw, 5rem)" className="mt-3">
            Experiencia
          </SeriesTitle>
        </Reveal>
        <ol className="relative mt-10 space-y-6 border-l border-white/10 pl-8">
          {experience.map((job, i) => (
            <li key={job.company} className="relative">
              <span className="saludar-pulse absolute -left-[37px] top-6 size-3 rounded-full bg-[#ff3d5a]" />
              <Reveal delay={i * 0.05}>
                <Glass className="p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#ff3d5a]">{job.period}</p>
                  <h3 className="font-series mt-2 text-3xl tracking-[0.02em] md:text-4xl">
                    {job.title} · {job.company}
                  </h3>
                  <p className="text-sm text-mute">{job.place}</p>
                  <ul className="mt-4 space-y-2 text-sm text-[#f4f1ec]/85">
                    {job.points.map((pt) => (
                      <li key={pt} className="flex gap-3">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#ff3d5a]" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </Glass>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <Reveal>
          <Eyebrow>Formación</Eyebrow>
          <SeriesTitle as="h2" size="clamp(2.6rem, 6vw, 5rem)" className="mt-3">
            Estudios
          </SeriesTitle>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {education.map((ed, i) => (
            <Reveal key={ed.title} delay={i * 0.05}>
              <Glass className="h-full p-5 transition hover:border-[#ff3d5a]/50">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#ff3d5a]">{ed.period}</p>
                <p className="mt-3 text-[15px] font-semibold">{ed.title}</p>
                <p className="mt-1 text-sm text-mute">{ed.place}</p>
              </Glass>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  )
}
