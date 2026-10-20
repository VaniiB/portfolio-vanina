import sharp from 'sharp'
import { mkdir, rm, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { spawn } from 'node:child_process'
import ffmpegPath from 'ffmpeg-static'

const srcDir = 'C:/Users/Vanii/Desktop/portfolio-vanina/public/character'
const keysDir = 'C:/Users/Vanii/Desktop/portfolio-vanina/tmp-loop-keys'
const rifeDir = 'C:/Users/Vanii/Desktop/portfolio-vanina/tmp-loop-rife'
const alphaDir = 'C:/Users/Vanii/Desktop/portfolio-vanina/tmp-loop-alpha'
const out = 'C:/Users/Vanii/Desktop/portfolio-vanina/public/character/work-loop.webm'
const rifeCwd = 'C:/Users/Vanii/Desktop/portfolio-vanina/tools/rife/rife-ncnn-vulkan-20221029-windows'
const rifeBin = path.join(rifeCwd, 'rife-ncnn-vulkan.exe')

const W = 864
const H = 1152
const GREEN = { r: 0, g: 255, b: 0 }

await rm(keysDir, { recursive: true, force: true })
await rm(rifeDir, { recursive: true, force: true })
await rm(alphaDir, { recursive: true, force: true })
await mkdir(keysDir, { recursive: true })
await mkdir(rifeDir, { recursive: true })
await mkdir(alphaDir, { recursive: true })

let n = 1
async function add(name) {
  await sharp(path.join(srcDir, `${name}.png`))
    .resize(W, H, { fit: 'contain', background: { r: 0, g: 255, b: 0, alpha: 1 } })
    .flatten({ background: GREEN })
    .png()
    .toFile(path.join(keysDir, `${String(n).padStart(4, '0')}.png`))
  n++
}

async function codeBlock() {
  await add('work-01')
  await add('seq-type-a')
  await add('work-micro-1')
  await add('work-02')
  await add('work-07')
  await add('work-18')
  await add('seq-type-a')
  await add('work-01')
}

async function blink() {
  await add('work-01')
  await add('seq-blink')
  await add('work-01')
}

await codeBlock()
await codeBlock()
await blink()
await codeBlock()
await codeBlock()
await blink()
await codeBlock()
await codeBlock()
await blink()
await codeBlock()

const keyCount = n - 1
const target = keyCount * 12
console.log('keyframes', keyCount, 'rife target', target)

function run(cmd, args, cwd) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit', cwd })
    p.on('exit', (code) => (code === 0 ? resolve() : reject(new Error((cmd.split(/[/\\]/).pop() || cmd) + ' ' + code))))
  })
}

await run(
  rifeBin,
  ['-i', keysDir, '-o', rifeDir, '-m', 'rife-v4.6', '-n', String(target), '-f', '%08d.png', '-v'],
  rifeCwd,
)

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
function knockout(data, w, h) {
  const nPix = w * h
  const seen = new Uint8Array(nPix)
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
  for (let i = 0; i < nPix; i++) {
    const p = i * 4
    if (data[p + 3] === 0) continue
    if (isKeyGreen(data[p], data[p + 1], data[p + 2])) data[p + 3] = 0
  }
  for (let pass = 0; pass < 4; pass++) {
    const extra = []
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const i = y * w + x
        const p = i * 4
        if (data[p + 3] === 0) continue
        if (!isScreenGreen(data[p], data[p + 1], data[p + 2]) && !isKeyGreen(data[p], data[p + 1], data[p + 2])) continue
        if (nearEmpty(data, w, h, x, y)) extra.push(i)
      }
    }
    for (const i of extra) data[i * 4 + 3] = 0
  }
  const outBuf = Buffer.from(data)
  for (let i = 0; i < nPix; i++) {
    const p = i * 4
    if (outBuf[p + 3] === 0) {
      outBuf[p] = 0
      outBuf[p + 1] = 0
      outBuf[p + 2] = 0
      continue
    }
    const r = outBuf[p]
    let g = outBuf[p + 1]
    const b = outBuf[p + 2]
    const rb = (r + b) * 0.5
    const excess = g - rb
    if (excess > 5) {
      const t = Math.min(1, excess / 26)
      g = Math.round(rb + excess * (0.18 - 0.1 * t))
      const m = Math.max(r, b)
      if (g > m + 2) g = m + 2
      outBuf[p + 1] = Math.max(0, Math.min(255, g))
    }
  }
  return outBuf
}

const rifeFrames = (await readdir(rifeDir)).filter((f) => f.endsWith('.png')).sort()
console.log('rife frames', rifeFrames.length)
let i = 0
for (const file of rifeFrames) {
  const { data, info } = await sharp(path.join(rifeDir, file)).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const cut = knockout(data, info.width, info.height)
  const png = await sharp(cut, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toBuffer()
  await writeFile(path.join(alphaDir, file), png)
  i++
  if (i % 50 === 0) console.log('knockout', i, '/', rifeFrames.length)
}

await run(ffmpegPath, [
  '-y',
  '-framerate',
  '24',
  '-i',
  path.join(alphaDir, '%08d.png'),
  '-c:v',
  'libvpx-vp9',
  '-pix_fmt',
  'yuva420p',
  '-auto-alt-ref',
  '0',
  '-b:v',
  '0',
  '-crf',
  '28',
  '-an',
  out,
])

console.log('wrote', out)
