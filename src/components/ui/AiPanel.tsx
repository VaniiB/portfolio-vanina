import { useState, type FormEvent } from 'react'
import { Sparkles } from 'lucide-react'
import { wait } from '../../lib/format'
import type { AiBlock } from '../../lib/ai'

type Props = {
  title: string
  placeholder: string
  hint?: string
  onAsk: (q: string) => Promise<AiBlock[]>
  example?: string
}

export function AiPanel({ title, placeholder, hint, onAsk, example }: Props) {
  const [query, setQuery] = useState(example ?? '')
  const [loading, setLoading] = useState(false)
  const [blocks, setBlocks] = useState<AiBlock[]>([])

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setBlocks([])
    await wait(500)
    const result = await onAsk(query)
    setBlocks(result)
    setLoading(false)
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-black/30 p-5">
      <div className="mb-4 flex items-center gap-2 text-gold">
        <Sparkles size={16} />
        <h3 className="text-sm tracking-[0.16em] uppercase">{title}</h3>
      </div>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-gold/60"
        />
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-mute">{hint}</p>
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-gold px-4 py-1.5 text-xs font-medium tracking-[0.12em] uppercase text-void disabled:opacity-60"
          >
            {loading ? 'Pensando…' : 'Consultar'}
          </button>
        </div>
      </form>
      <div className="mt-5 space-y-4">
        {blocks.map((b) => (
          <article key={b.title} className="border-t border-white/10 pt-4">
            <h4 className="text-sm text-gold">{b.title}</h4>
            <p className="mt-1 text-sm leading-relaxed text-ink/90">{b.body}</p>
            {b.bullets && (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-mute">
                {b.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}
