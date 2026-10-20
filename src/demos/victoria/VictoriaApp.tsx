import { useState, type FormEvent } from 'react'
import { Link, Navigate, Route, Routes } from 'react-router-dom'
import { DemoChrome } from '../../components/demos/DemoChrome'
import { AiPanel } from '../../components/ui/AiPanel'
import { victoriaAxes, victoriaPress } from '../../data/victoria'
import { victoriaGuide } from '../../lib/ai'

export function VictoriaApp() {
  return (
    <DemoChrome name="Victoria Villarruel" casePath="/trabajo/victoria" tone="light">
      <div className="min-h-[calc(100vh-42px)] bg-[#f4f1ea] text-[#1b1a16]">
        <header className="border-b border-black/10 px-6 py-5">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <Link to="/demo/victoria" className="display text-xl">
              Victoria Villarruel
            </Link>
            <nav className="flex gap-5 text-xs tracking-[0.14em] uppercase text-black/60">
              <Link to="/demo/victoria/bio">Biografía</Link>
              <Link to="/demo/victoria/ejes">Ejes</Link>
              <Link to="/demo/victoria/prensa">Prensa</Link>
              <Link to="/demo/victoria/guia">Guía</Link>
              <Link to="/demo/victoria/contacto">Contacto</Link>
            </nav>
          </div>
        </header>
        <Routes>
          <Route index element={<Home />} />
          <Route path="bio" element={<Bio />} />
          <Route path="ejes" element={<Ejes />} />
          <Route path="prensa" element={<Prensa />} />
          <Route path="guia" element={<Guia />} />
          <Route path="contacto" element={<Contacto />} />
          <Route path="*" element={<Navigate to="/demo/victoria" replace />} />
        </Routes>
      </div>
    </DemoChrome>
  )
}

function Home() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <p className="text-[12px] tracking-[0.22em] uppercase text-[#8a7044]">
        Rediseño institucional · demo de portafolio
      </p>
      <h1 className="display mt-4 text-6xl md:text-8xl">Victoria Villarruel</h1>
      <p className="mt-2 text-xl text-black/55">Abogada · presencia web</p>
      <p className="mt-8 max-w-xl leading-relaxed text-black/75">
        Sitio sobrio para leer quién es, qué ejes comunica y cómo contactar. Esta pieza es un
        ejercicio de UX/UI y desarrollo de Vanina Balbastro, no un canal oficial ni una afiliación
        política.
      </p>
      <Link
        to="/demo/victoria/bio"
        className="mt-10 inline-block rounded-full bg-[#1b1a16] px-6 py-3 text-xs tracking-[0.16em] uppercase text-[#f4f1ea]"
      >
        Leer biografía
      </Link>
    </section>
  )
}

function Bio() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="display text-5xl">Biografía</h1>
      <p className="mt-6 leading-relaxed text-black/80">
        Texto de demostración para el case study. El rediseño organiza la figura pública en bloques
        claros: origen profesional, archivo y un tono institucional. El contenido largo se lee en
        una columna estrecha, con tipografía serif y aire.
      </p>
      <p className="mt-4 leading-relaxed text-black/70">
        En un sitio en producción, este espacio se alimentaría con biografía revisada, fotos de
        archivo y referencias. Acá el objetivo es mostrar jerarquía, ritmo y respeto por la lectura.
      </p>
    </section>
  )
}

function Ejes() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="display text-5xl">Ejes</h1>
      <div className="mt-10 grid gap-8 md:grid-cols-3">
        {victoriaAxes.map((a) => (
          <article key={a.title} className="border-t border-black/15 pt-6">
            <h2 className="display text-3xl">{a.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-black/70">{a.body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function Prensa() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="display text-5xl">Prensa</h1>
      <ul className="mt-10 divide-y divide-black/10 border-y border-black/10">
        {victoriaPress.map((p) => (
          <li key={p.title} className="py-5">
            <p className="text-xs uppercase tracking-[0.14em] text-[#8a7044]">{p.date}</p>
            <h2 className="mt-1 text-lg">{p.title}</h2>
            <p className="text-sm text-black/50">{p.source}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Guia() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="display text-5xl">Guía de consultas</h1>
      <p className="mt-3 mb-8 text-black/65">
        Responde solo con lo publicado en este sitio. Probá: quién es, ejes, prensa, contacto.
      </p>
      <div className="rounded-2xl bg-[#1b1a16] p-1 text-[#f4f1ea]">
        <AiPanel
          title="Preguntar"
          placeholder="¿Cómo contactarla?"
          example="¿Cuáles son los ejes del sitio?"
          onAsk={victoriaGuide}
        />
      </div>
    </section>
  )
}

function Contacto() {
  const [sent, setSent] = useState(false)

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section className="mx-auto max-w-xl px-6 py-16">
      <h1 className="display text-5xl">Contacto</h1>
      {sent ? (
        <p className="mt-8 text-sm">
          Mensaje de demostración. Este formulario no envía correo: es parte del case study de
          portafolio.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 space-y-3">
          <input required placeholder="Nombre" className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm" />
          <input required type="email" placeholder="Email" className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm" />
          <textarea required rows={4} placeholder="Mensaje" className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm" />
          <button className="rounded-full bg-[#1b1a16] px-6 py-2 text-xs tracking-[0.16em] uppercase text-[#f4f1ea]">
            Enviar
          </button>
        </form>
      )}
    </section>
  )
}
