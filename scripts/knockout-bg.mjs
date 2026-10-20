import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const srcDir = 'C:/Users/Vanii/.cursor/projects/C-Users-Vanii-AppData-Local-Temp-76d48cbb-e651-45c0-b0d1-3ceba6de0b7a/assets'
const dstDir = 'C:/Users/Vanii/Desktop/portfolio-vanina/public/character'

const jobs = [
  ['pixar3-idle.jpg', 'idle-07.png'],
  ['look-00.jpg', 'look-00.png'],
  ['look-01.jpg', 'look-01.png'],
  ['look-05.jpg', 'look-05.png'],
  ['look-06.jpg', 'look-06.png'],
  ['look-up.jpg', 'look-up.png'],
  ['look-down.jpg', 'look-down.png'],
  ['look-up-left.jpg', 'look-up-left.png'],
  ['look-up-right.jpg', 'look-up-right.png'],
  ['look-down-left.jpg', 'look-down-left.png'],
  ['look-down-right.jpg', 'look-down-right.png'],
  ['look-up-s.jpg', 'look-up-s.png'],
  ['look-down-s.jpg', 'look-down-s.png'],
  ['look-up-left-s.jpg', 'look-up-left-s.png'],
  ['look-up-right-s.jpg', 'look-up-right-s.png'],
  ['look-down-left-s.jpg', 'look-down-left-s.png'],
  ['look-down-right-s.jpg', 'look-down-right-s.png'],
  ['pixar3-greet.jpg', 'greet-15.png'],
  ['pixar3-wave.jpg', 'greet-16.png'],
]

const workJobs = [
  ['work-01.jpg', 'work-01.png'],
  ['work-02.jpg', 'work-02.png'],
  ['work-03.jpg', 'work-03.png'],
  ['work-04.jpg', 'work-04.png'],
  ['work-05.jpg', 'work-05.png'],
  ['work-06.jpg', 'work-06.png'],
  ['work-07.jpg', 'work-07.png'],
  ['work-08.jpg', 'work-08.png'],
  ['work-09.jpg', 'work-09.png'],
  ['work-10.jpg', 'work-10.png'],
  ['work-11.jpg', 'work-11.png'],
  ['work-12.jpg', 'work-12.png'],
  ['work-13.jpg', 'work-13.png'],
  ['work-14.jpg', 'work-14.png'],
  ['work-15.jpg', 'work-15.png'],
  ['work-16.jpg', 'work-16.png'],
  ['work-17.jpg', 'work-17.png'],
  ['work-hair-1.jpg', 'work-hair-1.png'],
  ['work-hair-2.jpg', 'work-hair-2.png'],
  ['work-hair-3.jpg', 'work-hair-3.png'],
  ['work-hair-4.jpg', 'work-hair-4.png'],
  ['work-hair-5.jpg', 'work-hair-5.png'],
  ['work-yawn-1.jpg', 'work-yawn-1.png'],
  ['work-yawn-2.jpg', 'work-yawn-2.png'],
  ['work-yawn-3.jpg', 'work-yawn-3.png'],
  ['work-yawn-4.jpg', 'work-yawn-4.png'],
  ['work-yawn-5.jpg', 'work-yawn-5.png'],
  ['work-mate-1.jpg', 'work-mate-1.png'],
  ['work-mate-2.jpg', 'work-mate-2.png'],
  ['work-mate-3.jpg', 'work-mate-3.png'],
  ['work-mate-4.jpg', 'work-mate-4.png'],
  ['work-mate-5.jpg', 'work-mate-5.png'],
  ['work-mate-6.jpg', 'work-mate-6.png'],
  ['work-play-1.jpg', 'work-play-1.png'],
  ['work-play-2.jpg', 'work-play-2.png'],
  ['work-play-3.jpg', 'work-play-3.png'],
  ['work-play-4.jpg', 'work-play-4.png'],
  ['work-play-5.jpg', 'work-play-5.png'],
  ['work-bun-1.jpg', 'work-bun-1.png'],
  ['work-bun-2.jpg', 'work-bun-2.png'],
  ['work-bun-3.jpg', 'work-bun-3.png'],
  ['work-bun-4.jpg', 'work-bun-4.png'],
  ['work-think-1.jpg', 'work-think-1.png'],
  ['work-think-2.jpg', 'work-think-2.png'],
  ['work-think-3.jpg', 'work-think-3.png'],
  ['work-think-4.jpg', 'work-think-4.png'],
]

const extraJobs = [
  ['work-18.jpg', 'work-18.png'],
  ['work-19.jpg', 'work-19.png'],
  ['work-20.jpg', 'work-20.png'],
  ['work-21.jpg', 'work-21.png'],
  ['work-play-6.jpg', 'work-play-6.png'],
  ['work-think-5.jpg', 'work-think-5.png'],
  ['work-bun-5.jpg', 'work-bun-5.png'],
  ['work-mate-7.jpg', 'work-mate-7.png'],
  ['work-yawn-6.jpg', 'work-yawn-6.png'],
  ['work-hair-6.jpg', 'work-hair-6.png'],
  ['work-micro-1.jpg', 'work-micro-1.png'],
  ['work-micro-3.jpg', 'work-micro-3.png'],
  ['work-micro-4.jpg', 'work-micro-4.png'],
]

const seqJobs = [
  ['seq-bun-01.jpg', 'seq-bun-01.png'],
  ['seq-bun-02.jpg', 'seq-bun-02.png'],
  ['seq-bun-08.jpg', 'seq-bun-08.png'],
  ['seq-bun-09.jpg', 'seq-bun-09.png'],
  ['seq-strand-1.jpg', 'seq-strand-1.png'],
  ['seq-type-a.jpg', 'seq-type-a.png'],
  ['seq-yawn-a.jpg', 'seq-yawn-a.png'],
  ['seq-yawn-c.jpg', 'seq-yawn-c.png'],
  ['seq-blink.jpg', 'seq-blink.png'],
]

const mateJobs = [
  ['termo-black.jpg', 'termo-prop.png'],
  ['mate-side.jpg', 'mate-side.png'],
  ['sip-mate.jpg', 'sip-mate.png'],
]

const whatJobs = [
  ['what-left.jpg', 'what-left.png'],
  ['what-right.jpg', 'what-right.png'],
  ['what-down-left.jpg', 'what-down-left.png'],
  ['what-down.jpg', 'what-down.png'],
  ['what-down-right.jpg', 'what-down-right.png'],
  ['point-down.jpg', 'point-down.png'],
  ['offer-mate.jpg', 'offer-mate.png'],
  ['react-sad.jpg', 'react-sad.png'],
]

function isScreenGreen(r, g, b) {
  return g > 80 && g > r + 18 && g > b + 18
}

function isKeyGreen(r, g, b) {
  const m = Math.max(r, b)
  return g > 88 && g > m + 28 && g > m * 1.35
}

function nearEmpty(data, w, h, x, y) {
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue
      const nx = x + dx
      const ny = y + dy
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue
      if (data[(ny * w + nx) * 4 + 3] === 0) return true
    }
  }
  return false
}

function knockout(data, w, h, edgeOnly = false) {
  const n = w * h
  const seen = new Uint8Array(n)
  const stack = []
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return
    const i = y * w + x
    if (seen[i]) return
    const p = i * 4
    if (!isScreenGreen(data[p], data[p + 1], data[p + 2])) return
    seen[i] = 1
    stack.push(i)
  }
  for (let x = 0; x < w; x++) {
    push(x, 0)
    push(x, h - 1)
  }
  for (let y = 0; y < h; y++) {
    push(0, y)
    push(w - 1, y)
  }
  while (stack.length) {
    const i = stack.pop()
    const x = i % w
    const y = (i / w) | 0
    data[i * 4 + 3] = 0
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx || dy) push(x + dx, y + dy)
      }
    }
  }

  if (!edgeOnly) {
    for (let i = 0; i < n; i++) {
      const p = i * 4
      if (data[p + 3] === 0) continue
      if (isKeyGreen(data[p], data[p + 1], data[p + 2])) data[p + 3] = 0
    }
  }

  for (let pass = 0; pass < 6; pass++) {
    const extra = []
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const i = y * w + x
        const p = i * 4
        if (data[p + 3] === 0) continue
        const r = data[p]
        const g = data[p + 1]
        const b = data[p + 2]
        if (!isScreenGreen(r, g, b) && !isKeyGreen(r, g, b)) continue
        if (nearEmpty(data, w, h, x, y)) extra.push(i)
      }
    }
    for (const i of extra) data[i * 4 + 3] = 0
  }

  const out = Buffer.from(data)
  for (let i = 0; i < n; i++) {
    const p = i * 4
    if (out[p + 3] === 0) {
      out[p] = 0
      out[p + 1] = 0
      out[p + 2] = 0
      continue
    }
    if (edgeOnly) continue
    const r = out[p]
    let g = out[p + 1]
    const b = out[p + 2]
    const rb = (r + b) * 0.5
    const excess = g - rb
    if (excess > 5) {
      const t = Math.min(1, excess / 26)
      g = Math.round(rb + excess * (0.18 - 0.1 * t))
      const m = Math.max(r, b)
      if (g > m + 2) g = m + 2
      out[p + 1] = Math.max(0, Math.min(255, g))
    }
  }

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x
      const p = i * 4
      if (out[p + 3] === 0) continue
      let empty = 0
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (data[((y + dy) * w + (x + dx)) * 4 + 3] === 0) empty++
        }
      }
      if (empty > 0) {
        const g = out[p + 1]
        const m = Math.max(out[p], out[p + 2])
        if (g > m + 6) out[p + 1] = m
        out[p + 3] = Math.max(110, 255 - empty * 16)
      }
    }
  }
  return out
}

await mkdir(dstDir, { recursive: true })

const list =
  process.argv[2] === 'extra'
    ? extraJobs
    : process.argv[2] === 'work'
      ? workJobs
      : process.argv[2] === 'seq'
        ? seqJobs
        : process.argv[2] === 'mate'
          ? mateJobs
          : process.argv[2] === 'what'
            ? whatJobs
            : jobs
for (const [srcName, dstName] of list) {
  const src = path.join(srcDir, srcName)
  const dst = path.join(dstDir, dstName)
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const cut = knockout(data, info.width, info.height, process.argv[2] === 'mate')
  let transparent = 0
  for (let i = 3; i < cut.length; i += 4) if (cut[i] === 0) transparent++
  const png = await sharp(cut, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer()
  await writeFile(dst, png)
  const pct = ((transparent / (info.width * info.height)) * 100).toFixed(1)
  console.log(dstName, `${info.width}x${info.height}`, 'transparent', pct + '%')
}
