import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const SRC = '/portraits/hero.jpg'

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uRes;
uniform vec2 uTexSize;
uniform vec2 uFocus;
uniform vec2 uTrail[6];
uniform vec2 uVel;
uniform float uTime;
uniform float uActive;

vec2 coverUV(vec2 uv) {
  float texA = uTexSize.x / max(uTexSize.y, 1.0);
  float resA = uRes.x / max(uRes.y, 1.0);
  vec2 s = vec2(1.0);
  if (texA > resA) s.x = resA / texA;
  else s.y = texA / resA;
  vec2 origin = (1.0 - s) * uFocus;
  return origin + uv * s;
}

void main() {
  vec2 uv = vUv;
  float aspect = uRes.x / max(uRes.y, 1.0);
  vec2 disp = vec2(0.0);
  float heat = 0.0;

  for (int i = 0; i < 6; i++) {
    vec2 m = uTrail[i];
    vec2 d = uv - m;
    d.x *= aspect;
    float dist = length(d);
    float radius = 0.22 - float(i) * 0.018;
    float influence = smoothstep(radius, 0.0, dist);
    influence *= uActive;
    vec2 dir = dist > 0.0001 ? normalize(d) : vec2(0.0);
    float wave = sin(dist * 48.0 - uTime * 4.2 + float(i)) * 0.5 + 0.5;
    disp -= dir * influence * (0.055 + 0.03 * wave);
    disp += vec2(-dir.y, dir.x) * influence * 0.045;
    heat += influence;
  }

  disp += uVel * heat * 0.25;
  uv += disp;
  uv = clamp(uv, 0.0, 1.0);

  vec2 texUv = coverUV(uv);
  vec2 dir = normalize(disp + vec2(0.0001, 0.0));
  float aberr = clamp(heat, 0.0, 1.0) * 0.01;
  vec2 tR = coverUV(uv + dir * aberr);
  vec2 tB = coverUV(uv - dir * aberr);

  float r = texture2D(uTex, tR).r;
  float g = texture2D(uTex, texUv).g;
  float b = texture2D(uTex, tB).b;
  vec3 color = vec3(r, g, b);
  color += heat * 0.04;
  gl_FragColor = vec4(color, 1.0);
}
`

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)
  if (!sh) return null
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(sh))
    gl.deleteShader(sh)
    return null
  }
  return sh
}

export function CursorHero() {
  const wrapRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const root = wrapRef.current
    if (!canvas || !root) return
    const layer: HTMLCanvasElement = canvas
    const host: HTMLElement = root
    const gl = layer.getContext('webgl', { antialias: true, alpha: false })
    if (!gl) return
    const gfx: WebGLRenderingContext = gl

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const vs = compile(gfx, gfx.VERTEX_SHADER, VERT)
    const fs = compile(gfx, gfx.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) return
    const prog = gfx.createProgram()
    if (!prog) return
    gfx.attachShader(prog, vs)
    gfx.attachShader(prog, fs)
    gfx.bindAttribLocation(prog, 0, 'aPos')
    gfx.linkProgram(prog)
    if (!gfx.getProgramParameter(prog, gfx.LINK_STATUS)) return
    gfx.useProgram(prog)

    const buf = gfx.createBuffer()
    gfx.bindBuffer(gfx.ARRAY_BUFFER, buf)
    gfx.bufferData(gfx.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gfx.STATIC_DRAW)
    gfx.enableVertexAttribArray(0)
    gfx.vertexAttribPointer(0, 2, gfx.FLOAT, false, 0, 0)

    const locRes = gfx.getUniformLocation(prog, 'uRes')
    const locTexSize = gfx.getUniformLocation(prog, 'uTexSize')
    const locFocus = gfx.getUniformLocation(prog, 'uFocus')
    const locVel = gfx.getUniformLocation(prog, 'uVel')
    const locTime = gfx.getUniformLocation(prog, 'uTime')
    const locActive = gfx.getUniformLocation(prog, 'uActive')
    const locTrail = [0, 1, 2, 3, 4, 5].map((i) => gfx.getUniformLocation(prog, `uTrail[${i}]`))

    const tex = gfx.createTexture()
    gfx.bindTexture(gfx.TEXTURE_2D, tex)
    gfx.texParameteri(gfx.TEXTURE_2D, gfx.TEXTURE_WRAP_S, gfx.CLAMP_TO_EDGE)
    gfx.texParameteri(gfx.TEXTURE_2D, gfx.TEXTURE_WRAP_T, gfx.CLAMP_TO_EDGE)
    gfx.texParameteri(gfx.TEXTURE_2D, gfx.TEXTURE_MIN_FILTER, gfx.LINEAR)
    gfx.texParameteri(gfx.TEXTURE_2D, gfx.TEXTURE_MAG_FILTER, gfx.LINEAR)

    const img = new Image()
    img.src = SRC
    let ready = false
    img.onload = () => {
      gfx.pixelStorei(gfx.UNPACK_FLIP_Y_WEBGL, 1)
      gfx.bindTexture(gfx.TEXTURE_2D, tex)
      gfx.texImage2D(gfx.TEXTURE_2D, 0, gfx.RGBA, gfx.RGBA, gfx.UNSIGNED_BYTE, img)
      gfx.uniform2f(locTexSize, img.naturalWidth, img.naturalHeight)
      ready = true
    }

    const mouse = { x: 0.5, y: 0.55, tx: 0.5, ty: 0.55, vx: 0, vy: 0, active: 0 }
    const trail = Array.from({ length: 6 }, () => ({ x: 0.5, y: 0.55 }))
    let raf = 0
    const t0 = performance.now()

    function size() {
      const rect = host.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      layer.width = Math.floor(rect.width * dpr)
      layer.height = Math.floor(rect.height * dpr)
      layer.style.width = `${rect.width}px`
      layer.style.height = `${rect.height}px`
      gfx.viewport(0, 0, layer.width, layer.height)
      gfx.uniform2f(locRes, rect.width, rect.height)
    }

    function onMove(e: PointerEvent) {
      const rect = host.getBoundingClientRect()
      mouse.tx = (e.clientX - rect.left) / rect.width
      mouse.ty = 1 - (e.clientY - rect.top) / rect.height
      mouse.active = 1
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX - rect.left}px, ${e.clientY - rect.top}px) translate(-50%, -50%)`
        cursorRef.current.style.opacity = '1'
      }
    }

    function onLeave() {
      mouse.active = 0
      if (cursorRef.current) cursorRef.current.style.opacity = '0'
    }

    function tick(now: number) {
      const rect = host.getBoundingClientRect()
      if (!reduced) {
        mouse.tx += Math.sin(now * 0.0007) * 0.0008
        mouse.ty += Math.cos(now * 0.0005) * 0.0006
      }
      const ox = mouse.x
      const oy = mouse.y
      mouse.x += (mouse.tx - mouse.x) * 0.12
      mouse.y += (mouse.ty - mouse.y) * 0.12
      mouse.vx = (mouse.x - ox) * 8
      mouse.vy = (mouse.y - oy) * 8
      mouse.active += ((mouse.active > 0.5 ? 1 : 0.22) - mouse.active) * 0.05

      let px = mouse.x
      let py = mouse.y
      for (let i = 0; i < trail.length; i++) {
        const ease = 0.18 - i * 0.02
        trail[i].x += (px - trail[i].x) * ease
        trail[i].y += (py - trail[i].y) * ease
        px = trail[i].x
        py = trail[i].y
      }

      if (ready) {
        gfx.uniform2f(locFocus, 0.52, 0.18)
        gfx.uniform2f(locVel, mouse.vx, mouse.vy)
        gfx.uniform1f(locTime, (now - t0) / 1000)
        gfx.uniform1f(locActive, reduced ? 0 : mouse.active)
        trail.forEach((p, i) => gfx.uniform2f(locTrail[i], p.x, p.y))
        gfx.drawArrays(gfx.TRIANGLE_STRIP, 0, 4)
      }

      if (cursorRef.current && mouse.active > 0.4) {
        const cx = mouse.x * rect.width
        const cy = (1 - mouse.y) * rect.height
        cursorRef.current.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`
      }

      raf = requestAnimationFrame(tick)
    }

    size()
    gfx.clearColor(0, 0, 0, 1)
    gfx.uniform2f(locFocus, 0.52, 0.18)
    gfx.uniform1i(gfx.getUniformLocation(prog, 'uTex'), 0)
    raf = requestAnimationFrame(tick)
    host.addEventListener('pointermove', onMove)
    host.addEventListener('pointerdown', onMove)
    host.addEventListener('pointerleave', onLeave)
    window.addEventListener('resize', size)

    return () => {
      cancelAnimationFrame(raf)
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerdown', onMove)
      host.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', size)
    }
  }, [])

  return (
    <section
      ref={wrapRef}
      className="relative h-[100svh] min-h-[640px] overflow-hidden bg-black max-md:cursor-auto md:cursor-none"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full touch-none" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/15" />

      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-10 pt-24 md:px-12 md:pb-14">
        <p className="text-[11px] tracking-[0.32em] uppercase text-white/70">
          Buenos Aires · UX/UI · Fullstack · Comcam
        </p>
        <h1 className="display mt-3 text-[18vw] leading-[0.78] text-white mix-blend-difference md:text-[9.5rem]">
          Vanina
          <span className="block italic text-white/90">Balbastro</span>
        </h1>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <p className="max-w-sm text-sm leading-relaxed text-white/75">
            Mové el cursor: la foto se comporta como líquido.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/demo/comcam"
              className="rounded-full bg-white px-5 py-2.5 text-[11px] tracking-[0.16em] uppercase text-black"
            >
              Ver Comcam
            </Link>
            <Link
              to="/trabajo"
              className="rounded-full border border-white/40 px-5 py-2.5 text-[11px] tracking-[0.16em] uppercase text-white"
            >
              Proyectos
            </Link>
          </div>
        </div>
      </div>

      <div
        ref={cursorRef}
        className="pointer-events-none absolute left-0 top-0 z-20 hidden size-28 rounded-full border border-white/70 mix-blend-difference md:block"
        style={{ opacity: 0 }}
      />
    </section>
  )
}
