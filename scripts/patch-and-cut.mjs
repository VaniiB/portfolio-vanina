import sharp from 'sharp'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'

const assets = 'C:/Users/Vanii/.cursor/projects/C-Users-Vanii-AppData-Local-Temp-76d48cbb-e651-45c0-b0d1-3ceba6de0b7a/assets'
const dstDir = 'C:/Users/Vanii/Desktop/portfolio-vanina/public/character'

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
    const greenSpill = Math.max(0, g - Math.max(r, b))
    if (greenSpill > 8) {
      data[p + 1] = Math.max(r, b)
      const t = Math.min(1, greenSpill / 70)
      data[p + 3] = Math.round(255 * (1 - t * 0.85))
    }
  }
  for (let pass = 0; pass < 2; pass++) {
    const extra = []
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const i = y * w + x
        const p = i * 4
        if (data[p + 3] === 0) continue
        let holes = 0
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (data[((y + dy) * w + (x + dx)) * 4 + 3] === 0) holes++
          }
        }
        if (holes >= 4) extra.push(i)
      }
    }
    for (const i of extra) data[i * 4 + 3] = 0
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

function sample(data, w, ch, x, y) {
  const p = (y * w + x) * ch
  return [data[p], data[p + 1], data[p + 2]]
}

function stampSkin(data, w, ch, cx, cy, radius, skin) {
  for (let y = cy - radius; y <= cy + radius; y++) {
    for (let x = cx - radius; x <= cx + radius; x++) {
      const d = Math.hypot(x - cx, y - cy)
      if (d > radius) continue
      const t = 1 - d / radius
      const p = (y * w + x) * ch
      data[p] = Math.round(data[p] * (1 - t) + skin[0] * t)
      data[p + 1] = Math.round(data[p + 1] * (1 - t) + skin[1] * t)
      data[p + 2] = Math.round(data[p + 2] * (1 - t) + skin[2] * t)
    }
  }
}

function stampMole(data, w, ch, cx, cy, radius) {
  const dark = [62, 32, 24]
  for (let y = cy - radius; y <= cy + radius; y++) {
    for (let x = cx - radius; x <= cx + radius; x++) {
      const d = Math.hypot(x - cx, (y - cy) * 1.15)
      if (d > radius) continue
      const t = Math.max(0, 1 - d / radius)
      const p = (y * w + x) * ch
      data[p] = Math.round(data[p] * (1 - t) + dark[0] * t)
      data[p + 1] = Math.round(data[p + 1] * (1 - t) + dark[1] * t)
      data[p + 2] = Math.round(data[p + 2] * (1 - t) + dark[2] * t)
    }
  }
}

async function loadRaw(file) {
  return sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
}

async function savePng(data, w, h, name) {
  const cut = knockout(data, w, h)
  const png = await sharp(cut, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer()
  const dest = path.join(dstDir, name)
  await writeFile(dest, png)
  console.log('wrote', name)
}

const jobs = [
  ['vanina-sheet-idle.jpg', 'idle-03.png'],
  ['vanina-sheet-left.jpg', 'look-left-03.png'],
  ['vanina-sheet-greet-b.jpg', 'greet-05.png'],
  ['vanina-sheet-wave.jpg', 'greet-06.png'],
]

for (const [src, name] of jobs) {
  const { data, info } = await loadRaw(path.join(assets, src))
  await savePng(data, info.width, info.height, name)
}

{
  const { data, info } = await loadRaw(path.join(assets, 'vanina-sheet-right-b.jpg'))
  const w = info.width
  const ch = 4
  // Cover the mole that jumped to the visible (left) cheek
  const wrong = { x: 505, y: 338 }
  const skin = sample(data, w, ch, wrong.x + 26, wrong.y - 10)
  stampSkin(data, w, ch, wrong.x, wrong.y, 11, skin)
  stampSkin(data, w, ch, wrong.x, wrong.y, 8, skin)
  // Place it on HER right cheek, just outside the right corner of the mouth
  stampMole(data, w, ch, 628, 352, 4)
  await savePng(data, info.width, info.height, 'look-right-03.png')
}
