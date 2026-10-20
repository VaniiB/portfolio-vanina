export function formatKm(value: number) {
  return `${new Intl.NumberFormat('es-AR').format(value)} km`
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso))
}

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
