import { useEffect, useRef, useSyncExternalStore } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { nowPlaying } from '../data/site'

type MusicState = 'off' | 'playing' | 'docked'

let state: MusicState = 'off'
const listeners = new Set<() => void>()

export function setMusic(next: MusicState) {
  state = next
  listeners.forEach((l) => l())
}

export function useMusic() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => state,
  )
}

type Source = { kind: 'youtube'; src: string } | { kind: 'spotify'; uri: string }

export function musicSource(url: string): Source | null {
  const list = url.match(/[?&]list=([\w-]+)/)
  if (list) {
    return { kind: 'youtube', src: `https://www.youtube.com/embed/videoseries?list=${list[1]}&autoplay=1` }
  }
  const video = url.match(/(?:youtu\.be\/|[?&]v=|\/embed\/)([\w-]{11})/)
  if (video) {
    return { kind: 'youtube', src: `https://www.youtube.com/embed/${video[1]}?autoplay=1&loop=1&playlist=${video[1]}` }
  }
  const sp = url.match(/open\.spotify\.com\/(?:intl-\w+\/)?(track|playlist|album)\/([A-Za-z0-9]+)/)
  if (sp) return { kind: 'spotify', uri: `spotify:${sp[1]}:${sp[2]}` }
  return null
}

type PlaybackUpdate = { data: { isPaused: boolean; position: number; duration: number } }
type SpotifyController = {
  play: () => void
  loadUri: (uri: string) => void
  destroy: () => void
  addListener: (event: 'playback_update', cb: (e: PlaybackUpdate) => void) => void
}
type SpotifyApi = {
  createController: (
    el: HTMLElement,
    opts: { uri: string; width: string; height: number; theme?: string },
    cb: (c: SpotifyController) => void,
  ) => void
}

let spotifyApi: Promise<SpotifyApi> | null = null

function loadSpotifyApi() {
  spotifyApi ??= new Promise((resolve) => {
    const w = window as unknown as { onSpotifyIframeApiReady?: (api: SpotifyApi) => void }
    w.onSpotifyIframeApiReady = resolve
    const s = document.createElement('script')
    s.src = 'https://open.spotify.com/embed/iframe-api/v1'
    s.async = true
    document.body.appendChild(s)
  })
  return spotifyApi
}

function SpotifyEmbed({ queue }: { queue: string }) {
  const host = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const uris = queue.split('|')
    let controller: SpotifyController | null = null
    let alive = true
    let step = 0
    let started = false
    loadSpotifyApi().then((api) => {
      if (!alive || !host.current) return
      const el = document.createElement('div')
      host.current.appendChild(el)
      api.createController(el, { uri: uris[0], width: '100%', height: 152, theme: 'dark' }, (c) => {
        controller = c
        if (!alive) return c.destroy()
        c.addListener('playback_update', ({ data }) => {
          if (!data.isPaused && data.position > 1000) started = true
          const ended = started && data.duration > 0 && data.position >= data.duration - 400
          if (ended && step < uris.length - 1) {
            step += 1
            started = false
            c.loadUri(uris[step])
            c.play()
          }
        })
        c.play()
      })
    })
    return () => {
      alive = false
      controller?.destroy()
    }
  }, [queue])

  return <div ref={host} className="overflow-hidden rounded-xl" />
}

export function MusicPlayer() {
  const music = useMusic()
  const source = musicSource(nowPlaying.url)
  const open = music !== 'off' && !!source

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          className="fixed bottom-5 right-5 z-[60] w-[20rem] overflow-hidden rounded-2xl border border-white/10 bg-[#07070a]/90 p-2 shadow-2xl backdrop-blur"
        >
          <div className="mb-1 flex items-center justify-between px-2 text-[11px] uppercase tracking-[0.2em] text-white/60">
            <span>{music === 'docked' ? 'Sonando ahora' : 'Lo que escucho'}</span>
            <button
              type="button"
              aria-label="Cerrar música"
              onClick={() => setMusic('off')}
              className="text-base leading-none text-white/60 transition hover:text-[#ff3d5a]"
            >
              ×
            </button>
          </div>
          {source.kind === 'youtube' ? (
            <iframe
              title="Lo que estoy escuchando"
              src={source.src}
              className="aspect-video w-full rounded-xl"
              allow="autoplay; encrypted-media; picture-in-picture"
            />
          ) : (
            <SpotifyEmbed
              queue={[
                ...nowPlaying.firstTracks.flatMap((u) => {
                  const s = musicSource(u)
                  return s?.kind === 'spotify' ? [s.uri] : []
                }),
                source.uri,
              ].join('|')}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
