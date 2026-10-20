import { useState, type FormEvent } from 'react'
import { ArrowUpRight, Briefcase, Code2, Mail, Phone } from 'lucide-react'
import { characterFrames } from '../data/character'
import { profile } from '../data/site'
import { Eyebrow, Glass, PageGlow, Reveal, SeriesTitle, btnRed } from '../components/ui/Series'

const field =
  'w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none transition placeholder:text-mute focus:border-[#ff3d5a] focus:bg-white/[0.05]'

export function Contact() {
  const [sent, setSent] = useState(false)

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSent(true)
  }

  const links = [
    { icon: Mail, label: profile.email, href: `mailto:${profile.email}` },
    { icon: Briefcase, label: 'LinkedIn', href: profile.linkedin },
    { icon: Code2, label: 'GitHub · VaniiB', href: profile.github },
    { icon: Phone, label: profile.phone, href: `tel:${profile.phone.replace(/\s/g, '')}` },
  ]

  return (
    <div className="relative isolate">
      <PageGlow />
      <section className="mx-auto grid max-w-6xl gap-12 px-5 pt-16 md:grid-cols-[1fr_1fr]">
        <div>
          <Reveal>
            <Eyebrow>Contacto</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <SeriesTitle className="mt-4">Hablemos</SeriesTitle>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[#d8d6d2]">
              {profile.location}. Trabajo en Grupo Penna y tomo conversaciones sobre producto, interfaz y desarrollo.
              ¡Escribime cuando quieras!
            </p>
          </Reveal>
          <ul className="mt-8 space-y-3">
            {links.map((l, i) => (
              <li key={l.label}>
                <Reveal delay={0.2 + i * 0.05}>
                  <a
                    href={l.href}
                    target={l.href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    className="glass group flex items-center gap-4 rounded-xl px-4 py-3 text-sm transition hover:border-[#ff3d5a]/50"
                  >
                    <span className="flex size-9 items-center justify-center rounded-full bg-[#ff3d5a]/15 text-[#ff3d5a]">
                      <l.icon size={16} />
                    </span>
                    {l.label}
                    <ArrowUpRight size={16} className="ml-auto text-mute transition group-hover:text-[#ff3d5a]" />
                  </a>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>

        <Reveal delay={0.12} className="relative">
          <div aria-hidden className="relative h-40 overflow-hidden">
            <img
              src={characterFrames.greet[1]}
              alt=""
              className="pointer-events-none absolute right-4 top-0 w-60 select-none"
              draggable={false}
            />
          </div>
          <Glass className="relative p-6 md:p-8">
            {sent ? (
              <div className="py-6 text-center">
                <SeriesTitle as="h2" size="2.8rem">
                  ¡Gracias!
                </SeriesTitle>
                <p className="mt-3 text-sm text-[#d8d6d2]">
                  Este formulario es de demostración: escribime directo a{' '}
                  <a href={`mailto:${profile.email}`} className="text-[#ff3d5a]">
                    {profile.email}
                  </a>
                  .
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <input required name="name" placeholder="Nombre" className={field} />
                <input required type="email" name="email" placeholder="Email" className={field} />
                <textarea required name="message" rows={5} placeholder="Mensaje" className={field} />
                <button type="submit" className={`${btnRed} w-full justify-center`}>
                  Enviar mensaje
                </button>
              </form>
            )}
          </Glass>
        </Reveal>
      </section>
    </div>
  )
}
