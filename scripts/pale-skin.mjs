import sharp from 'sharp'
import { readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const dir = 'C:/Users/Vanii/Desktop/portfolio-vanina/public/character'
const keep = /^(look-|idle-07|greet-1[78]|react-)/

function isSkin(r, g, b, a) {
  if (a < 40) return false
  if (r < 90 || g < 55 || b < 40) return false
  if (r <= g + 6) return false
  if (r <= b + 12) return false
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  if (max - min < 18) return false
  if (g > r * 0.92) return false
  return true
}

const files = (await readdir(dir)).filter((f) => keep.test(f) && f.endsWith('.png'))

for (const name of files) {
  const file = path.join(dir, name)
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  let n = 0
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const a = data[i + 3]
    if (!isSkin(r, g, b, a)) continue
    data[i] = Math.min(255, Math.round(r * 0.78 + 255 * 0.22 + 10))
    data[i + 1] = Math.min(255, Math.round(g * 0.78 + 248 * 0.22 + 14))
    data[i + 2] = Math.min(255, Math.round(b * 0.78 + 242 * 0.22 + 16))
    n++
  }
  const png = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer()
  await writeFile(file, png)
  console.log(name, 'skin px', n)
}
