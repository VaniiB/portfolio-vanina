export type UnitStatus = 'En ruta' | 'En taller' | 'Detenida' | 'Disponible'

export const comcamUnits = [
  {
    id: 'CAM-101',
    driver: 'Luis Pereyra',
    route: 'CABA — Rosario',
    km: 412340,
    status: 'En ruta' as UnitStatus,
    fuel: 72,
    note: 'Viaje cerrado YPF. Próxima inspección en 1.200 km.',
  },
  {
    id: 'CAM-118',
    driver: 'Marta Díaz',
    route: 'La Plata — Bahía Blanca',
    km: 388120,
    status: 'En taller' as UnitStatus,
    fuel: 40,
    note: 'OT abierta por vibración en eje trasero.',
  },
  {
    id: 'CAM-204',
    driver: 'Héctor Molina',
    route: 'Extraurbano norte',
    km: 501880,
    status: 'Detenida' as UnitStatus,
    fuel: 18,
    note: 'Alerta de cubiertas: recapa 2 y mm bajo umbral en duales.',
  },
  {
    id: 'CAM-221',
    driver: 'Sofía Rivas',
    route: 'CABA — Córdoba',
    km: 276440,
    status: 'Disponible' as UnitStatus,
    fuel: 90,
    note: 'Checklist pre-viaje completo.',
  },
  {
    id: 'CAM-308',
    driver: 'Diego Funes',
    route: 'Zona sur',
    km: 198770,
    status: 'En ruta' as UnitStatus,
    fuel: 55,
    note: 'Hermanada con CAM-309 para viaje de retorno.',
  },
  {
    id: 'CAM-309',
    driver: 'Ana López',
    route: 'Zona sur',
    km: 201002,
    status: 'En ruta' as UnitStatus,
    fuel: 61,
    note: 'Unidad hermana de CAM-308.',
  },
]

export const comcamTires = [
  { id: 'CUB-4401', unit: 'CAM-204', position: 'DI', brand: 'Michelin', model: 'X Multi', km: 162400, recaps: 2, mm: 3.2 },
  { id: 'CUB-4402', unit: 'CAM-204', position: 'DD', brand: 'Michelin', model: 'X Multi', km: 158900, recaps: 2, mm: 3.5 },
  { id: 'CUB-4410', unit: 'CAM-204', position: 'TI-ext', brand: 'Bridgestone', model: 'R268', km: 144200, recaps: 1, mm: 5.1 },
  { id: 'CUB-3308', unit: 'CAM-118', position: 'DI', brand: 'Pirelli', model: 'FH:01', km: 98000, recaps: 0, mm: 8.4 },
  { id: 'CUB-2211', unit: 'CAM-101', position: 'DD', brand: 'Goodyear', model: 'KMAX', km: 121000, recaps: 1, mm: 6.0 },
  { id: 'CUB-2212', unit: 'CAM-101', position: 'DI', brand: 'Goodyear', model: 'KMAX', km: 119800, recaps: 1, mm: 6.2 },
  { id: 'CUB-5520', unit: 'CAM-308', position: 'DD', brand: 'Fate', model: 'SR-200', km: 64000, recaps: 0, mm: 10.1 },
  { id: 'CUB-1188', unit: 'CAM-221', position: 'TI-ext', brand: 'Michelin', model: 'X Line', km: 210000, recaps: 3, mm: 2.8 },
]

export const comcamOts = [
  {
    id: 'OT-8841',
    unit: 'CAM-204',
    type: 'Correctiva',
    priority: 'Alta',
    status: 'Abierta',
    opened: '2026-10-14',
    summary: 'Desgaste irregular en duales y recapa al límite. Unidad detenida hasta recambio.',
    tasks: ['Medición de mm en las 10 posiciones', 'Pedido a recapadora Norte', 'Revisión de alineación', 'Liberar unidad con checklist'],
  },
  {
    id: 'OT-8830',
    unit: 'CAM-118',
    type: 'Correctiva',
    priority: 'Media',
    status: 'En curso',
    opened: '2026-10-12',
    summary: 'Vibración en eje trasero reportada por conductora. En taller central.',
    tasks: ['Balanceo', 'Inspección de maza', 'Prueba de ruta 20 km'],
  },
  {
    id: 'OT-8799',
    unit: 'CAM-101',
    type: 'Preventiva',
    priority: 'Baja',
    status: 'Cerrada',
    opened: '2026-10-02',
    summary: 'Service 400 mil km. Cerrada con recambio de filtros y revisión de frenos.',
    tasks: ['Service completo', 'Carga de historial', 'Alta de cubiertas 0 km'],
  },
  {
    id: 'OT-8812',
    unit: 'CAM-221',
    type: 'Gomería',
    priority: 'Media',
    status: 'Cerrada',
    opened: '2026-10-08',
    summary: 'Pinchadura en ruta. Auxilio y rotación.',
    tasks: ['Auxilio km 214', 'Rotación TI-ext', 'Cierre de parte'],
  },
]

export const comcamKpis = [
  { label: 'Unidades activas', value: '4 / 6' },
  { label: 'OT abiertas', value: '2' },
  { label: 'Cubiertas en alerta', value: '4' },
  { label: 'Disponibilidad', value: '83%' },
]

export const durationByType = [
  { tipo: 'Larga dist.', km: 148000 },
  { tipo: 'Extraurbano', km: 121000 },
  { tipo: 'Urbano', km: 86000 },
  { tipo: 'Mixto', km: 102000 },
]

export const placed0km = [
  { mes: 'May', n: 8 },
  { mes: 'Jun', n: 11 },
  { mes: 'Jul', n: 7 },
  { mes: 'Ago', n: 14 },
  { mes: 'Sep', n: 9 },
  { mes: 'Oct', n: 16 },
]
