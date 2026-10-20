import { comcamOts, comcamTires, comcamUnits } from '../data/comcam'
import { eternalProducts } from '../data/eternal'
import { gourmetDishes, gourmetWines } from '../data/gourmet'
import { victoriaCorpus } from '../data/victoria'
import { auroraSpecialties } from '../data/aurora'

export type AiBlock = {
  title: string
  body: string
  bullets?: string[]
}

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}

export async function fleetCopilot(query: string): Promise<AiBlock[]> {
  const q = normalize(query)
  const otMatch = comcamOts.find((ot) => q.includes(ot.id.toLowerCase()) || q.includes(ot.unit.toLowerCase()))
  const unitMatch = comcamUnits.find((u) => q.includes(u.id.toLowerCase()))
  const alertTires = comcamTires.filter((t) => t.km > 140000 || t.recaps >= 2 || t.mm < 4)

  if (q.includes('grafico') || q.includes('indicador') || q.includes('explic')) {
    return [
      {
        title: 'Lectura del tablero',
        body: 'El pico de colocados 0 km en marzo coincide con el recambio de la flota extraurbana. La durabilidad media de recapado bajó 8% en unidades de larga distancia: conviene priorizar inspección en CAM-204 y CAM-118.',
        bullets: [
          'Cubiertas en alerta: ' + alertTires.length,
          'Unidades detenidas: ' + comcamUnits.filter((u) => u.status === 'Detenida').length,
          'OT abiertas: ' + comcamOts.filter((o) => o.status !== 'Cerrada').length,
        ],
      },
    ]
  }

  if (otMatch || q.includes('ot') || q.includes('orden')) {
    const ot = otMatch ?? comcamOts[0]
    return [
      {
        title: `Resumen ${ot.id}`,
        body: `${ot.unit} · ${ot.type}. ${ot.summary} Prioridad ${ot.priority}. Estado: ${ot.status}.`,
        bullets: ot.tasks,
      },
    ]
  }

  if (unitMatch || q.includes('alerta') || q.includes('cubierta') || q.includes('recap')) {
    const unit = unitMatch ?? comcamUnits.find((u) => u.id === 'CAM-204') ?? comcamUnits[0]
    const tires = comcamTires.filter((t) => t.unit === unit.id)
    return [
      {
        title: `Unidad ${unit.id}`,
        body: `${unit.route}. ${unit.note}`,
        bullets: tires.map(
          (t) =>
            `${t.position} · ${t.brand} ${t.model} · ${t.km.toLocaleString('es-AR')} km · recapas ${t.recaps} · ${t.mm} mm`,
        ),
      },
      {
        title: 'Sugerencia de taller',
        body: alertTires.length
          ? `Recapar o recambiar esta semana: ${alertTires.map((t) => t.unit + ' ' + t.position).join(', ')}.`
          : 'No hay cubiertas en umbral crítico esta semana.',
      },
    ]
  }

  return [
    {
      title: 'Copiloto de flota',
      body: 'Puedo resumir una OT (ej. OT-8841), explicar el tablero o listar cubiertas a recapar. Preguntá con el ID de unidad o de orden.',
      bullets: ['Unidades en flota: ' + comcamUnits.length, 'OT cargadas: ' + comcamOts.length],
    },
  ]
}

export async function ceremonyAssistant(input: string): Promise<AiBlock[]> {
  const q = normalize(input)
  const outdoor = q.includes('jardin') || q.includes('arbol') || q.includes('naturaleza') || q.includes('rio')
  const intimate = q.includes('intima') || q.includes('familia') || q.includes('pocos')
  const product =
    eternalProducts.find((p) => (outdoor ? p.slug === 'raíz' : intimate ? p.slug === 'linterna' : p.slug === 'bruma')) ??
    eternalProducts[0]

  return [
    {
      title: `Urna sugerida: ${product.name}`,
      body: product.blurb,
    },
    {
      title: 'Texto memorial',
      body: intimate
        ? 'Volviste a la tierra como volviste siempre a casa: sin prisa, con las manos llenas de lo que importaba. Que este lugar florezca con tu nombre.'
        : 'Que este adiós sea semilla. Donde hubo un cuerpo, que haya raíz, sombra y un árbol que recuerde por nosotros.',
    },
    {
      title: 'Checklist del servicio',
      body: 'Pasos para una ceremonia serena, sin olvidos operativos.',
      bullets: [
        'Definir lugar de siembra y permiso del predio',
        'Elegir texto breve (1 minuto) y quién lo lee',
        'Preparar combo: urna, semilla y carta de despedida',
        'Confirmar traslado y horario de luz natural',
        'Cerrar con un gesto simple: agua, tierra, silencio',
      ],
    },
  ]
}

export async function sommelier(query: string): Promise<AiBlock[]> {
  const q = normalize(query)
  const gluten = q.includes('tacc') || q.includes('gluten') || q.includes('celiac')
  const vegan = q.includes('vegan') || q.includes('vegano')
  const tinto = q.includes('tinto') || q.includes('malbec') || q.includes('cabernet')
  const n = Number((query.match(/\d+/) ?? ['2'])[0])

  const mains = gourmetDishes.filter((d) => {
    if (d.course !== 'Principal') return false
    if (gluten && d.allergens.includes('gluten')) return false
    if (vegan && !d.vegan) return false
    return true
  })
  const wine =
    gourmetWines.find((w) => (tinto ? w.color === 'Tinto' : w.color === 'Blanco')) ?? gourmetWines[0]

  return [
    {
      title: `Mesa para ${Number.isFinite(n) ? n : 2}`,
      body: gluten
        ? 'Armé la propuesta sin TACC. El ritmo es entrada liviana, principal de fuego lento y un tinto o blanco según el plato.'
        : 'La mesa se arma en tres tiempos: algo para compartir, un principal con carácter y un cierre dulce corto.',
      bullets: mains.slice(0, 3).map((d) => `${d.name} — ${d.price}`),
    },
    {
      title: `Maridaje: ${wine.name}`,
      body: wine.note,
    },
  ]
}

export async function victoriaGuide(question: string): Promise<AiBlock[]> {
  const q = normalize(question)
  const hit = victoriaCorpus.find((item) => item.keywords.some((k) => q.includes(k)))

  if (!hit) {
    return [
      {
        title: 'No está en este sitio',
        body: 'Solo respondo con información publicada acá: biografía, ejes de trabajo, prensa y contacto. Reformulá la pregunta o recorré esas secciones.',
      },
    ]
  }

  return [{ title: hit.title, body: hit.answer }]
}

export async function auroraTriage(symptom: string): Promise<AiBlock[]> {
  const q = normalize(symptom)
  const spec =
    auroraSpecialties.find((s) => s.keywords.some((k) => q.includes(k))) ??
    auroraSpecialties.find((s) => s.slug === 'clinica-medica') ??
    auroraSpecialties[0]

  return [
    {
      title: `Especialidad sugerida: ${spec.name}`,
      body: spec.prep,
      bullets: spec.bring,
    },
    {
      title: 'Importante',
      body: 'Esto no es un diagnóstico ni una indicación médica. Si hay dolor intenso, falta de aire, sangrado o fiebre alta, acudí a una guardia.',
    },
  ]
}
