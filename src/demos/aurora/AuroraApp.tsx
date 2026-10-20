import { useEffect, useState, type FormEvent } from 'react'
import { Link, Navigate, Route, Routes } from 'react-router-dom'
import { DemoChrome } from '../../components/demos/DemoChrome'
import { AiPanel } from '../../components/ui/AiPanel'
import { auroraHours, auroraSpecialties } from '../../data/aurora'
import { auroraTriage } from '../../lib/ai'

type Appointment = {
  name: string
  specialty: string
  date: string
  time: string
}

const KEY = 'vb-aurora-turnos'

export function AuroraApp() {
  return (
    <DemoChrome name="Aurora Salud" casePath="/trabajo/aurora" tone="light">
      <div className="min-h-[calc(100vh-42px)] bg-[#f3f7f6] text-[#16302e]">
        <header className="border-b border-[#16302e]/10 bg-white/70 px-6 py-4 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <Link to="/demo/aurora" className="text-sm tracking-[0.16em] uppercase">
              Aurora Salud
            </Link>
            <nav className="flex gap-4 text-xs tracking-[0.12em] uppercase text-[#16302e]/60">
              <Link to="/demo/aurora/especialidades">Especialidades</Link>
              <Link to="/demo/aurora/turnos">Turnos</Link>
              <Link to="/demo/aurora/preadmision">Pre-admisión</Link>
              <Link to="/demo/aurora/admin">Admin</Link>
            </nav>
          </div>
        </header>
        <Routes>
          <Route index element={<Home />} />
          <Route path="especialidades" element={<Especialidades />} />
          <Route path="turnos" element={<Turnos />} />
          <Route path="preadmision" element={<Preadmision />} />
          <Route path="admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/demo/aurora" replace />} />
        </Routes>
        <footer className="mx-auto max-w-5xl px-6 py-10 text-xs text-[#16302e]/50">
          Origen: proyecto grupal Rolling Code School. Upgrade de producto: Vanina Balbastro.
          Equipo original: Celeste Lara, Juan Manuel Maturana, Franco Tatulli, Nicolás Ferreyra y
          compañerxs.
        </footer>
      </div>
    </DemoChrome>
  )
}

function Home() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <p className="text-[12px] tracking-[0.2em] uppercase text-[#4f8f8a]">Clínica</p>
      <h1 className="display mt-3 text-6xl md:text-7xl">Cuidado claro, turno simple</h1>
      <p className="mt-6 max-w-xl text-[#16302e]/70">
        Aurora ordena especialidades, agenda y una pre-admisión que prepara la visita. No diagnostica:
        acompaña.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          to="/demo/aurora/turnos"
          className="rounded-full bg-[#4f8f8a] px-6 py-3 text-xs tracking-[0.14em] uppercase text-white"
        >
          Pedir turno
        </Link>
        <Link
          to="/demo/aurora/preadmision"
          className="rounded-full border border-[#16302e]/15 px-6 py-3 text-xs tracking-[0.14em] uppercase"
        >
          Pre-admisión IA
        </Link>
      </div>
    </section>
  )
}

function Especialidades() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="display text-5xl">Especialidades</h1>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {auroraSpecialties.map((s) => (
          <article key={s.slug} className="rounded-2xl border border-[#16302e]/10 bg-white p-6">
            <h2 className="text-xl">{s.name}</h2>
            <p className="mt-2 text-sm text-[#16302e]/70">{s.prep}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function Turnos() {
  const [ok, setOk] = useState(false)

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const next: Appointment = {
      name: String(data.get('name')),
      specialty: String(data.get('specialty')),
      date: String(data.get('date')),
      time: String(data.get('time')),
    }
    const raw = localStorage.getItem(KEY)
    const list = raw ? (JSON.parse(raw) as Appointment[]) : []
    localStorage.setItem(KEY, JSON.stringify([...list, next]))
    setOk(true)
    e.currentTarget.reset()
  }

  return (
    <section className="mx-auto max-w-xl px-6 py-16">
      <h1 className="display text-5xl">Turno</h1>
      {ok && (
        <p className="mt-4 rounded-xl bg-[#4f8f8a]/15 p-3 text-sm">
          Turno guardado en este navegador. El admin lo va a listar.
        </p>
      )}
      <form onSubmit={onSubmit} className="mt-8 space-y-3">
        <input name="name" required placeholder="Nombre y apellido" className="w-full rounded-xl border border-[#16302e]/15 bg-white px-3 py-2 text-sm" />
        <select name="specialty" required className="w-full rounded-xl border border-[#16302e]/15 bg-white px-3 py-2 text-sm">
          {auroraSpecialties.map((s) => (
            <option key={s.slug} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
        <input name="date" required type="date" className="w-full rounded-xl border border-[#16302e]/15 bg-white px-3 py-2 text-sm" />
        <select name="time" required className="w-full rounded-xl border border-[#16302e]/15 bg-white px-3 py-2 text-sm">
          {auroraHours.map((h) => (
            <option key={h}>{h}</option>
          ))}
        </select>
        <button className="rounded-full bg-[#4f8f8a] px-6 py-2 text-xs tracking-[0.14em] uppercase text-white">
          Confirmar
        </button>
      </form>
    </section>
  )
}

function Preadmision() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="display text-5xl">Pre-admisión</h1>
      <p className="mt-3 mb-8 text-sm text-[#16302e]/70">
        Describí el motivo. Recibís especialidad sugerida y qué llevar. No es un diagnóstico. Si hay
        urgencia, es guardia.
      </p>
      <div className="rounded-2xl bg-[#16302e] p-1 text-[#f3f7f6]">
        <AiPanel
          title="Motivo de consulta"
          placeholder="Me duele la rodilla desde un partido, puedo caminar"
          example="Me duele la rodilla desde un partido, puedo caminar"
          onAsk={auroraTriage}
        />
      </div>
    </section>
  )
}

function Admin() {
  const [list, setList] = useState<Appointment[]>([])

  useEffect(() => {
    const raw = localStorage.getItem(KEY)
    if (raw) setList(JSON.parse(raw) as Appointment[])
  }, [])

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="display text-5xl">Panel</h1>
      <p className="mt-2 text-sm text-[#16302e]/60">Turnos de este navegador · rol administración</p>
      <ul className="mt-8 divide-y divide-[#16302e]/10 rounded-2xl border border-[#16302e]/10 bg-white">
        {list.length === 0 && <li className="p-5 text-sm text-[#16302e]/40">No hay turnos todavía.</li>}
        {list.map((a, i) => (
          <li key={`${a.name}-${i}`} className="flex flex-wrap justify-between gap-2 p-5 text-sm">
            <span>{a.name}</span>
            <span>{a.specialty}</span>
            <span className="text-[#16302e]/50">
              {a.date} {a.time}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
