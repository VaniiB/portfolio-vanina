export type Zone = 'idle' | 'left' | 'right' | 'center'

/** 5×3: de arriba a abajo, de izquierda a derecha. */
const v = '?v=2'
export const lookGrid = [
  [`/character/look-up-left.png${v}`, `/character/look-up.png${v}`, `/character/look-up-right.png${v}`],
  [`/character/look-up-left-s.png${v}`, `/character/look-up-s.png${v}`, `/character/look-up-right-s.png${v}`],
  [`/character/look-01.png${v}`, `/character/idle-07.png${v}`, `/character/look-05.png${v}`],
  [`/character/look-down-left-s.png${v}`, `/character/look-down-s.png${v}`, `/character/look-down-right-s.png${v}`],
  [`/character/look-down-left.png${v}`, `/character/look-down.png${v}`, `/character/look-down-right.png${v}`],
]

export const lookTrack = lookGrid.flat()

export const workLoop = '/character/work-loop.webm?v=11'

const wv = '?v=4'
const w = (name: string) => `/character/${name}.png${wv}`

const typeOnce: { src: string; ms: number }[] = [
  { src: w('work-01'), ms: 380 },
  { src: w('work-07'), ms: 340 },
  { src: w('work-14'), ms: 360 },
  { src: w('work-02'), ms: 380 },
  { src: w('work-18'), ms: 340 },
  { src: w('work-15'), ms: 360 },
]

function coding(loops = 4) {
  const out: { src: string; ms: number }[] = []
  for (let i = 0; i < loops; i++) {
    out.push(...typeOnce)
    if (i % 2 === 1) {
      out.push({ src: w('work-05'), ms: 180 })
      out.push({ src: w('work-06'), ms: 480 })
    }
  }
  return out
}

export const workReel: { src: string; ms: number }[] = [
  ...coding(5),
  { src: w('work-play-1'), ms: 520 },
  { src: w('work-play-2'), ms: 900 },
  { src: w('work-play-3'), ms: 1100 },
  { src: w('work-play-5'), ms: 520 },
  ...coding(5),
  { src: w('work-mate-6'), ms: 520 },
  { src: w('work-mate-1'), ms: 780 },
  { src: w('work-mate-2'), ms: 1400 },
  { src: w('work-mate-5'), ms: 720 },
  { src: w('work-mate-6'), ms: 480 },
  ...coding(5),
  { src: w('work-think-1'), ms: 620 },
  { src: w('work-think-2'), ms: 1400 },
  { src: w('work-think-3'), ms: 720 },
  ...coding(4),
  { src: w('work-bun-1'), ms: 620 },
  { src: w('work-bun-2'), ms: 1400 },
  { src: w('work-bun-4'), ms: 720 },
  ...coding(4),
  { src: w('work-hair-3'), ms: 620 },
  { src: w('work-hair-2'), ms: 1100 },
  { src: w('work-hair-5'), ms: 560 },
  ...coding(4),
  { src: w('work-yawn-3'), ms: 620 },
  { src: w('work-yawn-1'), ms: 1000 },
  { src: w('work-yawn-2'), ms: 1200 },
  { src: w('work-yawn-5'), ms: 640 },
]

export const workTrack = [...new Set(workReel.map((f) => f.src))]

export const characterFrames = {
  idle: [`/character/idle-07.png${v}`],
  left: [`/character/look-01.png${v}`],
  right: [`/character/look-05.png${v}`],
  greet: ['/character/greet-15.png?v=3', '/character/greet-16.png?v=3'],
}

export const holdMs = 2600

/**
 * Tamaño y posición del dibujo en el hero.
 * x: negativo = izquierda, positivo = derecha
 * y: negativo = arriba, positivo = abajo
 * scale: 1 = actual, 1.15 = más grande
 */
export const portraitLayout = {
  width: '52vw',
  right: '1vw',
  top: '2rem',
  height: '90vh',
  x: 0,
  y: 0,
  scale: 1,
}
