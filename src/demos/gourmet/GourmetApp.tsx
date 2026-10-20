import { useEffect, useState, type FormEvent } from 'react'
import { Link, Navigate, Route, Routes } from 'react-router-dom'
import { DemoChrome } from '../../components/demos/DemoChrome'
import { AiPanel } from '../../components/ui/AiPanel'
import { gourmetDishes } from '../../data/gourmet'
import { sommelier } from '../../lib/ai'

type Reservation = {
  name: string
  date: string
  time: string
  people: string
  notes: string
}

const KEY = 'vb-gourmet-reservas'

export function GourmetApp() {
  return (
    <DemoChrome name="Rincón Gourmet" casePath="/trabajo/rincon-gourmet">
      <div className="min-h-[calc(100vh-42px)] bg-[#140c0a] text-[#f3e6dc]">
        <header className="flex items-center justify-between px-6 py-6">
          <Link to="/demo/gourmet" className="display text-2xl italic">
            Rincón Gourmet
          </Link>
          <nav className="flex gap-5 text-xs tracking-[0.16em] uppercase text-[#f3e6dc]/70">
            <Link to="/demo/gourmet/carta">Carta</Link>
            <Link to="/demo/gourmet/reservas">Reservas</Link>
            <Link to="/demo/gourmet/sommelier">Sommelier</Link>
          </nav>
        </header>
        <Routes>
          <Route index element={<Home />} />
          <Route path="carta" element={<Menu />} />
          <Route path="reservas" element={<Reservas />} />
          <Route path="sommelier" element={<Sommelier />} />
          <Route path="*" element={<Navigate to="/demo/gourmet" replace />} />
        </Routes>
      </div>
    </DemoChrome>
  )
}

function Home() {
  return (
    <section className="px-6 pb-24">
      <p className="text-[12px] tracking-[0.24em] uppercase text-[#b85c38]">Buenos Aires</p>
      <h1 className="display mt-4 max-w-3xl text-6xl leading-[0.92] md:text-8xl">
        Fuego lento,
        <span className="italic text-[#b85c38]"> mesa larga</span>
      </h1>
      <p className="mt-6 max-w-lg text-[#f3e6dc]/70">
        Cocina de estación, vinos de altura y una reserva que no depende de un mensaje a las 23.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          to="/demo/gourmet/reservas"
          className="rounded-full bg-[#b85c38] px-6 py-3 text-xs tracking-[0.16em] uppercase text-[#140c0a]"
        >
          Reservar
        </Link>
        <Link to="/demo/gourmet/carta" className="rounded-full border border-white/20 px-6 py-3 text-xs tracking-[0.16em] uppercase">
          Ver carta
        </Link>
      </div>
      <div className="mt-16 grid gap-3 md:grid-cols-3">
        {['Horno de barro', 'Carta de estación', 'Sommelier en el teléfono'].map((t) => (
          <div key={t} className="rounded-2xl border border-white/10 p-6 text-sm">
            {t}
          </div>
        ))}
      </div>
    </section>
  )
}

function Menu() {
  const courses = ['Para compartir', 'Principal', 'Cierre']
  return (
    <section className="mx-auto max-w-2xl px-6 pb-24">
      <h1 className="display text-5xl">Carta</h1>
      {courses.map((course) => (
        <div key={course} className="mt-10">
          <h2 className="text-[11px] tracking-[0.2em] uppercase text-[#b85c38]">{course}</h2>
          <ul className="mt-4 divide-y divide-white/10">
            {gourmetDishes
              .filter((d) => d.course === course)
              .map((d) => (
                <li key={d.name} className="py-4">
                  <div className="flex justify-between gap-4">
                    <h3>{d.name}</h3>
                    <span className="text-[#f3e6dc]/60">{d.price}</span>
                  </div>
                  <p className="mt-1 text-sm text-[#f3e6dc]/50">{d.desc}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-wider text-[#f3e6dc]/35">
                    {d.vegan ? 'Vegano · ' : ''}
                    {d.allergens.length ? d.allergens.join(', ') : 'sin alérgenos mayores'}
                  </p>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </section>
  )
}

function Reservas() {
  const [list, setList] = useState<Reservation[]>([])
  const [ok, setOk] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem(KEY)
    if (raw) setList(JSON.parse(raw) as Reservation[])
  }, [])

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const next: Reservation = {
      name: String(data.get('name')),
      date: String(data.get('date')),
      time: String(data.get('time')),
      people: String(data.get('people')),
      notes: String(data.get('notes')),
    }
    const updated = [...list, next]
    setList(updated)
    localStorage.setItem(KEY, JSON.stringify(updated))
    setOk(true)
    e.currentTarget.reset()
  }

  return (
    <section className="mx-auto grid max-w-4xl gap-10 px-6 pb-24 md:grid-cols-2">
      <div>
        <h1 className="display text-5xl">Reserva</h1>
        <p className="mt-3 text-sm text-[#f3e6dc]/60">Se guarda en este navegador. No hay backend.</p>
        {ok && <p className="mt-4 text-sm text-[#b85c38]">Mesa anotada. Te esperamos.</p>}
        <form onSubmit={onSubmit} className="mt-8 space-y-3">
          <input name="name" required placeholder="Nombre" className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2 text-sm" />
          <input name="date" required type="date" className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2 text-sm" />
          <input name="time" required type="time" className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2 text-sm" />
          <input name="people" required type="number" min={1} max={12} placeholder="Personas" className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2 text-sm" />
          <textarea name="notes" placeholder="Ocasión, alergias" rows={3} className="w-full rounded-xl border border-white/15 bg-transparent px-3 py-2 text-sm" />
          <button className="rounded-full bg-[#b85c38] px-6 py-2 text-xs tracking-[0.16em] uppercase text-[#140c0a]">
            Confirmar
          </button>
        </form>
      </div>
      <div>
        <h2 className="text-[11px] tracking-[0.2em] uppercase text-[#b85c38]">Agenda local</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {list.length === 0 && <li className="text-[#f3e6dc]/40">Todavía no hay reservas.</li>}
          {list.map((r, i) => (
            <li key={`${r.name}-${i}`} className="rounded-xl border border-white/10 p-4">
              <p>
                {r.name} · {r.people} pers.
              </p>
              <p className="text-[#f3e6dc]/50">
                {r.date} {r.time}
              </p>
              {r.notes && <p className="mt-1 text-[#f3e6dc]/60">{r.notes}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Sommelier() {
  return (
    <section className="mx-auto max-w-2xl px-6 pb-24">
      <h1 className="display text-5xl">Sommelier</h1>
      <p className="mt-3 mb-8 text-[#f3e6dc]/70">
        Decime cuántos son, si hay TACC o vegano, y si quieren tinto. Arma mesa y maridaje.
      </p>
      <AiPanel
        title="La mesa"
        placeholder="Somos 4, sin TACC, algo tinto"
        example="Somos 4, sin TACC, queremos tinto"
        onAsk={sommelier}
      />
    </section>
  )
}
