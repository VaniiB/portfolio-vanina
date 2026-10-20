import sharp from 'sharp'
import { writeFile } from 'node:fs/promises'

const src =
  'C:/Users/Vanii/.cursor/projects/C-Users-Vanii-AppData-Local-Temp-76d48cbb-e651-45c0-b0d1-3ceba6de0b7a/assets/vanina-sheet-right-b.jpg'
const dest = 'C:/Users/Vanii/Desktop/portfolio-vanina/public/character/look-right-03.png'

function isGreen(r, g, b) {
  return g > 70 && g > r + 28 && g > b + 28
}

function knockout(data, w, h) {
  for (let i = 0; i < w * h; i++) {
    const p = i * 4
    const r = data[p]
    const g = data[p + 1]
    const b = data[p + 2]
    if (isGreen(r, g, b)) {
      data[p + 3] = 0
      continue
    }
    const spill = Math.max(0, g - Math.max(r, b))
    if (spill > 8) {
      data[p + 1] = Math.max(r, b)
      data[p + 3] = Math.round(255 * (1 - Math.min(1, spill / 70) * 0.85))
    }
  }
  const out = Buffer.from(data)
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x
      if (data[i * 4 + 3] === 0) continue
      let empty = 0
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (data[((y + dy) * w + (x + dx)) * 4 + 3] === 0) empty++
        }
      }
      if (empty > 0) out[i * 4 + 3] = Math.max(0, 255 - empty * 22)
    }
  }
  return out
}

function inpaint(data, w, ch, cx, cy, radius) {
  const copy = Buffer.from(data)
  for (let y = cy - radius; y <= cy + radius; y++) {
    for (let x = cx - radius; x <= cx + radius; x++) {
      const d = Math.hypot(x - cx, y - cy)
      if (d > radius) continue
      let r = 0
      let g = 0
      let b = 0
      let n = 0
      for (let a = 0; a < 16; a++) {
        const ang = (a / 16) * Math.PI * 2
        for (const dist of [radius + 4, radius + 8, radius + 12]) {
          const sx = Math.round(cx + Math.cos(ang) * dist)
          const sy = Math.round(cy + Math.sin(ang) * dist)
          const p = (sy * w + sx) * ch
          r += copy[p]
          g += copy[p + 1]
          b += copy[p + 2]
          n++
        }
      }
      const t = 1 - d / radius
      const p = (y * w + x) * ch
      data[p] = Math.round(data[p] * (1 - t) + (r / n) * t)
      data[p + 1] = Math.round(data[p + 1] * (1 - t) + (g / n) * t)
      data[p + 2] = Math.round(data[p + 2] * (1 - t) + (b / n) * t)
    }
  }
}

function stampMole(data, w, ch, cx, cy, radius) {
  const dark = [72, 40, 30]
  for (let y = cy - radius; y <= cy + radius; y++) {
    for (let x = cx - radius; x <= cx + radius; x++) {
      const d = Math.hypot(x - cx, (y - cy) * 1.08)
      if (d > radius) continue
      const t = Math.max(0, 1 - d / radius)
      const p = (y * w + x) * ch
      data[p] = Math.round(data[p] * (1 - t) + dark[0] * t)
      data[p + 1] = Math.round(data[p + 1] * (1 - t) + dark[1] * t)
      data[p + 2] = Math.round(data[p + 2] * (1 - t) + dark[2] * t)
    }
  }
}

const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const cut = knockout(data, info.width, info.height)
inpaint(cut, info.width, 4, 516, 309, 18)
inpaint(cut, info.width, 4, 516, 309, 12)
stampMole(cut, info.width, 4, 624, 308, 3)
const png = await sharp(cut, {
  raw: { width: info.width, height: info.height, channels: 4 },
}).png().toBuffer()
await writeFile(dest, png)
await sharp(dest)
  .extract({ left: 420, top: 160, width: 340, height: 420 })
  .flatten({ background: '#07070a' })
  .jpeg({ quality: 90 })
  .toFile('C:/Users/Vanii/Desktop/portfolio-vanina/public/character/_face-right-final.jpg')
await sharp(dest)
  .flatten({ background: '#07070a' })
  .jpeg({ quality: 86 })
  .toFile('C:/Users/Vanii/Desktop/portfolio-vanina/public/character/_p-right.jpg')
console.log('done')
