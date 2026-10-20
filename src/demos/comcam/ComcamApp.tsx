import type { ReactNode } from 'react'
import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { DemoChrome } from '../../components/demos/DemoChrome'
import { AiPanel } from '../../components/ui/AiPanel'
import {
  comcamKpis,
  comcamOts,
  comcamTires,
  comcamUnits,
  durationByType,
  placed0km,
} from '../../data/comcam'
import { fleetCopilot } from '../../lib/ai'
import { formatKm } from '../../lib/format'

const nav = [
  { to: '/demo/comcam', label: 'Resumen', end: true },
  { to: '/demo/comcam/gomeria', label: 'Gomería' },
  { to: '/demo/comcam/flota', label: 'Flota' },
  { to: '/demo/comcam/ot', label: 'Historial OT' },
  { to: '/demo/comcam/copiloto', label: 'Copiloto IA' },
]

export function ComcamApp() {
  return (
    <DemoChrome name="Comcam" casePath="/trabajo/comcam">
      <div className="flex min-h-[calc(100vh-42px)]">
        <aside className="hidden w-56 shrink-0 border-r border-white/10 bg-black/40 p-4 md:block">
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#c9a66b]">Comcam</p>
          <p className="mt-1 text-xs text-white/50">Grupo Penna · demo</p>
          <nav className="mt-8 flex flex-col gap-1 text-sm">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 ${isActive ? 'bg-white/10 text-[#c9a66b]' : 'text-white/70 hover:bg-white/5'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <div className="flex-1 overflow-auto">
          <div className="flex gap-2 overflow-x-auto border-b border-white/10 px-3 py-2 md:hidden">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-full px-3 py-1 text-xs ${isActive ? 'bg-[#c9a66b] text-black' : 'bg-white/10'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
          <div className="p-5 md:p-8">
            <Routes>
              <Route index element={<Resumen />} />
              <Route path="gomeria" element={<Gomeria />} />
              <Route path="flota" element={<Flota />} />
              <Route path="ot" element={<Ot />} />
              <Route path="copiloto" element={<Copiloto />} />
              <Route path="*" element={<Navigate to="/demo/comcam" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </DemoChrome>
  )
}

function Resumen() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="display text-4xl">Torre de control</h1>
        <p className="mt-1 text-sm text-white/50">Datos ficticios · no es el entorno de producción</p>
      </header>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {comcamKpis.map((k) => (
          <div key={k.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-[11px] tracking-[0.16em] uppercase text-white/50">{k.label}</p>
            <p className="display mt-2 text-4xl text-[#c9a66b]">{k.value}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Duración media por tipo de ruta">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={durationByType}>
              <CartesianGrid stroke="rgba(255,255,255,.08)" vertical={false} />
              <XAxis dataKey="tipo" tick={{ fill: '#9a9488', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9a9488', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#111', border: '1px solid #333' }} />
              <Bar dataKey="km" fill="#c9a66b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Colocados 0 km por mes">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={placed0km}>
              <CartesianGrid stroke="rgba(255,255,255,.08)" vertical={false} />
              <XAxis dataKey="mes" tick={{ fill: '#9a9488', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9a9488', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#111', border: '1px solid #333' }} />
              <Bar dataKey="n" fill="#7d9a72" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  )
}

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="mb-4 text-[11px] tracking-[0.16em] uppercase text-white/50">{title}</p>
      {children}
    </div>
  )
}

function Gomeria() {
  return (
    <div>
      <h1 className="display text-4xl">Gomería</h1>
      <p className="mt-1 text-sm text-white/50">Stock rodando, recapas y umbral de mm</p>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-white/5 text-[11px] uppercase tracking-[0.12em] text-white/50">
            <tr>
              {['ID', 'Unidad', 'Pos', 'Marca', 'Km', 'Recapas', 'mm', 'Alerta'].map((h) => (
                <th key={h} className="px-4 py-3 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comcamTires.map((t) => {
              const alert = t.km > 140000 || t.recaps >= 2 || t.mm < 4
              return (
                <tr key={t.id} className="border-t border-white/10">
                  <td className="px-4 py-3">{t.id}</td>
                  <td className="px-4 py-3">{t.unit}</td>
                  <td className="px-4 py-3">{t.position}</td>
                  <td className="px-4 py-3">
                    {t.brand} {t.model}
                  </td>
                  <td className="px-4 py-3">{formatKm(t.km)}</td>
                  <td className="px-4 py-3">{t.recaps}</td>
                  <td className="px-4 py-3">{t.mm}</td>
                  <td className="px-4 py-3">
                    {alert ? <span className="text-[#d9784a]">Recapar</span> : <span className="text-white/40">Ok</span>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Flota() {
  return (
    <div>
      <h1 className="display text-4xl">Estado de flota</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {comcamUnits.map((u) => (
          <article key={u.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-start justify-between">
              <h2 className="text-lg">{u.id}</h2>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px]">{u.status}</span>
            </div>
            <p className="mt-1 text-sm text-white/60">
              {u.driver} · {u.route}
            </p>
            <p className="mt-3 text-sm">{u.note}</p>
            <p className="mt-4 text-xs text-white/40">
              {formatKm(u.km)} · combustible {u.fuel}%
            </p>
          </article>
        ))}
      </div>
    </div>
  )
}

function Ot() {
  return (
    <div>
      <h1 className="display text-4xl">Historial OT</h1>
      <div className="mt-6 space-y-4">
        {comcamOts.map((ot) => (
          <article key={ot.id} className="rounded-2xl border border-white/10 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg">
                {ot.id} · {ot.unit}
              </h2>
              <p className="text-xs text-white/50">
                {ot.type} · {ot.priority} · {ot.status}
              </p>
            </div>
            <p className="mt-2 text-sm text-white/80">{ot.summary}</p>
            <ul className="mt-3 list-disc pl-5 text-sm text-white/50">
              {ot.tasks.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  )
}

function Copiloto() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="display text-4xl">Copiloto de flota</h1>
      <p className="mt-2 mb-6 text-sm text-white/50">
        Motor de reglas + contexto operativo. Preguntá por OT-8841, CAM-204 o pedí leer el tablero.
      </p>
      <AiPanel
        title="Consultar"
        placeholder="Ej: resumí la OT-8841 / por qué CAM-204 está detenida / qué cubiertas recapar"
        hint="No usa API externa: corre con el dataset de la demo."
        example="Resumí la OT-8841 y decime si hay que recapar"
        onAsk={fleetCopilot}
      />
    </div>
  )
}
