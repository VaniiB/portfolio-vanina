import sharp from 'sharp'
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'covers')
mkdirSync(dir, { recursive: true })

const cards = [
  { file: 'eternal.png', title: 'ETERNAL', kicker: 'Urnas biodegradables', bg: '#12140f', accent: '#7d9a72' },
  { file: 'victoria.png', title: 'VICTORIA', kicker: 'Presencia institucional', bg: '#120e0a', accent: '#c9a66b' },
  { file: 'gourmet.png', title: 'RINCÓN', kicker: 'Gourmet · reservas', bg: '#160c08', accent: '#b85c38' },
  { file: 'aurora.png', title: 'AURORA', kicker: 'Salud · turnos', bg: '#0a1414', accent: '#4f8f8a' },
]

for (const c of cards) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200">
    <rect width="900" height="1200" fill="${c.bg}"/>
    <rect x="48" y="48" width="804" height="1104" fill="none" stroke="${c.accent}" stroke-opacity="0.35" stroke-width="2"/>
    <text x="80" y="980" fill="${c.accent}" font-family="Arial Black, Impact, sans-serif" font-size="28" letter-spacing="8">${c.kicker.toUpperCase()}</text>
    <text x="76" y="1080" fill="#f4f1ec" font-family="Arial Black, Impact, sans-serif" font-size="92">${c.title}</text>
  </svg>`
  await sharp(Buffer.from(svg)).png().toFile(join(dir, c.file))
}

console.log('covers ok')
