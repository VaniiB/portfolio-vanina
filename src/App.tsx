import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SiteShell } from './components/layout/SiteShell'
import { About } from './pages/About'
import { CaseStudy } from './pages/CaseStudy'
import { Contact } from './pages/Contact'
import { Home } from './pages/Home'
import { Work } from './pages/Work'

const ComcamApp = lazy(() =>
  import('./demos/comcam/ComcamApp').then((m) => ({ default: m.ComcamApp })),
)
const EternalApp = lazy(() =>
  import('./demos/eternal/EternalApp').then((m) => ({ default: m.EternalApp })),
)
const GourmetApp = lazy(() =>
  import('./demos/gourmet/GourmetApp').then((m) => ({ default: m.GourmetApp })),
)
const VictoriaApp = lazy(() =>
  import('./demos/victoria/VictoriaApp').then((m) => ({ default: m.VictoriaApp })),
)
const AuroraApp = lazy(() =>
  import('./demos/aurora/AuroraApp').then((m) => ({ default: m.AuroraApp })),
)

function Fallback() {
  return (
    <div className="grid min-h-screen place-items-center bg-void text-mute text-sm">
      Cargando…
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Fallback />}>
        <Routes>
          <Route element={<SiteShell />}>
            <Route path="/" element={<Home />} />
            <Route path="/trabajo" element={<Work />} />
            <Route path="/trabajo/:slug" element={<CaseStudy />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/contacto" element={<Contact />} />
          </Route>
          <Route path="/demo/comcam/*" element={<ComcamApp />} />
          <Route path="/demo/eternal/*" element={<EternalApp />} />
          <Route path="/demo/gourmet/*" element={<GourmetApp />} />
          <Route path="/demo/victoria/*" element={<VictoriaApp />} />
          <Route path="/demo/aurora/*" element={<AuroraApp />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
