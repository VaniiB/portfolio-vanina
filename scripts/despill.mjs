import sharp from 'sharp'
import { readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const dir = 'C:/Users/Vanii/Desktop/portfolio-vanina/public/character'

function despill(data) {
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 12) continue
    const r = data[i]
    let g = data[i + 1]
    const b = data[i + 2]
    const rb = (r + b) * 0.5
    const excess = g - rb
    if (excess <= 5) continue
    const t = Math.min(1, excess / 26)
    g = Math.round(rb + excess * (0.18 - 0.1 * t))
    const maxRB = Math.max(r, b)
    if (g > maxRB + 2) g = maxRB + 2
    data[i + 1] = Math.max(0, Math.min(255, g))
  }
  return data
}

const files = (await readdir(dir)).filter((f) => f.endsWith('.png'))
for (const name of files) {
  const src = path.join(dir, name)
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const out = despill(Buffer.from(data))
  const png = await sharp(out, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer()
  await writeFile(src, png)
  console.log('despilled', name)
}
