import { useMemo, useState } from 'react'
import { Link, Navigate, Route, Routes, useParams } from 'react-router-dom'
import { DemoChrome } from '../../components/demos/DemoChrome'
import { AiPanel } from '../../components/ui/AiPanel'
import { eternalImpact, eternalProducts } from '../../data/eternal'
import { ceremonyAssistant } from '../../lib/ai'

export function EternalApp() {
  const [cart, setCart] = useState<string[]>([])

  return (
    <DemoChrome name="Eternal" casePath="/trabajo/eternal">
      <div className="min-h-[calc(100vh-42px)] bg-[#0c0d0b] text-[#e8e4d8]">
        <header className="flex items-center justify-between px-6 py-6 md:px-12">
          <Link to="/demo/eternal" className="display text-2xl italic">
            Eternal
          </Link>
          <nav className="flex gap-6 text-xs tracking-[0.18em] uppercase text-[#e8e4d8]/70">
            <Link to="/demo/eternal/tienda">Tienda</Link>
            <Link to="/demo/eternal/impacto">Impacto</Link>
            <Link to="/demo/eternal/asistente">Asistente</Link>
            <Link to="/demo/eternal/checkout">Cesta ({cart.length})</Link>
          </nav>
        </header>
        <Routes>
          <Route index element={<Home />} />
          <Route path="tienda" element={<Shop />} />
          <Route
            path="tienda/:slug"
            element={<Product onAdd={(slug) => setCart((c) => [...c, slug])} />}
          />
          <Route path="impacto" element={<Impact />} />
          <Route path="asistente" element={<Asistente />} />
          <Route path="checkout" element={<Checkout cart={cart} />} />
          <Route path="*" element={<Navigate to="/demo/eternal" replace />} />
        </Routes>
      </div>
    </DemoChrome>
  )
}

function Home() {
  return (
    <section className="px-6 pb-24 md:px-12">
      <p className="text-[12px] tracking-[0.28em] uppercase text-[#7d9a72]">Urnas biodegradables</p>
      <h1 className="display mt-6 max-w-4xl text-6xl leading-[0.9] md:text-8xl">
        Volver a la tierra
        <span className="italic text-[#7d9a72]"> con dignidad</span>
      </h1>
      <p className="mt-8 max-w-xl text-lg text-[#e8e4d8]/70">
        Eternal acompaña una despedida serena. Urnas que se convierten en raíz, sombra y un árbol que
        recuerda.
      </p>
      <div className="mt-10 flex gap-4">
        <Link
          to="/demo/eternal/tienda"
          className="rounded-full bg-[#7d9a72] px-6 py-3 text-xs tracking-[0.16em] uppercase text-[#0c0d0b]"
        >
          Ver urnas
        </Link>
        <Link
          to="/demo/eternal/asistente"
          className="rounded-full border border-white/20 px-6 py-3 text-xs tracking-[0.16em] uppercase"
        >
          Asistente de ceremonia
        </Link>
      </div>
      <div className="mt-20 grid gap-6 md:grid-cols-3">
        {eternalProducts.slice(0, 3).map((p) => (
          <Link key={p.slug} to={`/demo/eternal/tienda/${p.slug}`} className="group">
            <div className="aspect-[3/4] rounded-2xl bg-gradient-to-b from-[#1a2218] to-[#0c0d0b] border border-white/10" />
            <p className="mt-3 display text-2xl group-hover:text-[#7d9a72]">{p.name}</p>
            <p className="text-sm text-[#e8e4d8]/50">{p.price}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

function Shop() {
  return (
    <section className="px-6 pb-24 md:px-12">
      <h1 className="display text-5xl">Tienda</h1>
      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {eternalProducts.map((p) => (
          <Link key={p.slug} to={`/demo/eternal/tienda/${p.slug}`}>
            <div className="aspect-[4/5] rounded-2xl border border-white/10 bg-[#141610]" />
            <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-[#7d9a72]">{p.category}</p>
            <h2 className="display text-3xl">{p.name}</h2>
            <p className="text-sm text-[#e8e4d8]/60">{p.price}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

function Product({ onAdd }: { onAdd: (slug: string) => void }) {
  const { slug } = useParams()
  const product = eternalProducts.find((p) => p.slug === slug)
  const [added, setAdded] = useState(false)

  if (!product) return <Navigate to="/demo/eternal/tienda" replace />

  return (
    <section className="grid gap-10 px-6 pb-24 md:grid-cols-2 md:px-12">
      <div className="aspect-[3/4] rounded-3xl border border-white/10 bg-gradient-to-br from-[#243022] to-[#0c0d0b]" />
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-[#7d9a72]">{product.category}</p>
        <h1 className="display mt-3 text-6xl">{product.name}</h1>
        <p className="mt-4 text-xl">{product.price}</p>
        <p className="mt-6 max-w-md leading-relaxed text-[#e8e4d8]/75">{product.blurb}</p>
        <p className="mt-4 text-sm text-[#e8e4d8]/50">
          {product.material} · semilla: {product.seed}
        </p>
        <button
          type="button"
          onClick={() => {
            onAdd(product.slug)
            setAdded(true)
          }}
          className="mt-8 rounded-full bg-[#7d9a72] px-6 py-3 text-xs tracking-[0.16em] uppercase text-[#0c0d0b]"
        >
          {added ? 'En la cesta' : 'Agregar'}
        </button>
      </div>
    </section>
  )
}

function Impact() {
  return (
    <section className="px-6 pb-24 md:px-12">
      <h1 className="display text-5xl">Impacto</h1>
      <p className="mt-4 max-w-xl text-[#e8e4d8]/70">
        Números de demostración para el case study: árboles, donaciones y predios aliados.
      </p>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {eternalImpact.map((i) => (
          <div key={i.label} className="border-t border-[#7d9a72]/40 pt-6">
            <p className="display text-5xl text-[#7d9a72]">{i.value}</p>
            <p className="mt-2 text-sm">{i.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Asistente() {
  return (
    <section className="mx-auto max-w-2xl px-6 pb-24">
      <h1 className="display text-5xl">Asistente de ceremonia</h1>
      <p className="mt-3 mb-8 text-[#e8e4d8]/70">
        Contá el vínculo, el lugar y el tono. Recibís una urna, un texto y un checklist. Tono
        respetuoso, sin apuro de venta.
      </p>
      <AiPanel
        title="Contame"
        placeholder="Ej: una despedida íntima en el jardín de la familia, pocos, con un árbol"
        example="Una ceremonia íntima en el jardín, para la familia, con un árbol nativo"
        onAsk={ceremonyAssistant}
      />
    </section>
  )
}

function Checkout({ cart }: { cart: string[] }) {
  const items = useMemo(
    () => cart.map((slug) => eternalProducts.find((p) => p.slug === slug)).filter(Boolean),
    [cart],
  )
  const [done, setDone] = useState(false)

  if (done) {
    return (
      <section className="px-6 pb-24 md:px-12">
        <h1 className="display text-5xl">Pedido registrado</h1>
        <p className="mt-4 max-w-lg text-[#e8e4d8]/70">
          Checkout simulado de portafolio. En un sitio real, acá seguiría el pago y la coordinación de
          siembra.
        </p>
      </section>
    )
  }

  return (
    <section className="px-6 pb-24 md:px-12">
      <h1 className="display text-5xl">Cesta</h1>
      {items.length === 0 ? (
        <p className="mt-6 text-[#e8e4d8]/60">Todavía no hay urnas. Visitá la tienda.</p>
      ) : (
        <ul className="mt-8 space-y-4">
          {items.map((p, i) => (
            <li key={`${p?.slug}-${i}`} className="flex justify-between border-b border-white/10 py-3">
              <span>{p?.name}</span>
              <span>{p?.price}</span>
            </li>
          ))}
        </ul>
      )}
      <button
        type="button"
        disabled={items.length === 0}
        onClick={() => setDone(true)}
        className="mt-8 rounded-full bg-[#7d9a72] px-6 py-3 text-xs tracking-[0.16em] uppercase text-[#0c0d0b] disabled:opacity-40"
      >
        Confirmar (demo)
      </button>
    </section>
  )
}
