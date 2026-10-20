import { Briefcase, Mail } from 'lucide-react'
import { profile } from '../../data/site'

const btn =
  'inline-flex items-center gap-2 rounded-md border border-white/15 px-4 py-2 text-[13px] font-semibold text-[#f4f1ec] transition hover:border-[#ff3d5a] hover:bg-[#ff3d5a] hover:text-white'

export function SiteFooter() {
  return (
    <footer className="relative z-10 mt-24 border-t border-white/5">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] text-mute">© 2026 {profile.fullName}</p>
        <div className="flex gap-3">
          <a href={profile.linkedin} target="_blank" rel="noreferrer" className={btn}>
            <Briefcase size={15} /> LinkedIn
          </a>
          <a href={`mailto:${profile.email}`} className={btn}>
            <Mail size={15} /> Enviar email
          </a>
        </div>
      </div>
    </footer>
  )
}
