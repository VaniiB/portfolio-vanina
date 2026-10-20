export type ProjectSlug =
  | 'comcam'
  | 'eternal'
  | 'victoria'
  | 'rincon-gourmet'
  | 'aurora'

export type Project = {
  slug: ProjectSlug
  number: string
  title: string
  kicker: string
  year: string
  role: string
  stack: string[]
  summary: string
  problem: string
  process: string[]
  outcome: string
  ai: { title: string; body: string }
  demoPath: string
  website?: string
  cover?: string
  featured?: boolean
  badge?: string
  accent: string
  origin: string
  backend?: string[]
}

export const pennaModules = [
  {
    title: 'Sitio institucional',
    sub: 'grupopenna.com.ar',
    body: 'La web pública de Grupo Penna: logística y energía. La diseñé y desarrollé yo.',
    image: '/covers/penna-ruta.png',
    href: 'https://www.grupopenna.com.ar/',
    external: true,
  },
  {
    title: 'Panel Comcam',
    sub: 'Operaciones',
    body: 'Torre de control: flota, gomería, OT, ruteo, stock y reportes. Lo que usa la empresa todos los días.',
    image: '/covers/penna-planta.jpg',
    href: '/trabajo/comcam',
    external: false,
  },
  {
    title: 'Back-End',
    sub: 'APIs y datos',
    body: 'Node.js, Express y SQL Server: auth, permisos, reglas de negocio, reportes y cargas.',
    image: '/covers/penna-mina.jpg',
    href: '/trabajo/comcam#backend',
    external: false,
  },
]

export const projects: Project[] = [
  {
    slug: 'comcam',
    number: '01',
    title: 'Grupo Penna',
    kicker: 'Logística & energía · Comcam',
    year: '2025 — actualidad',
    role: 'Desarrolladora Full Stack · UX/UI',
    stack: ['React', 'TypeScript', 'Node.js', 'Express', 'SQL Server', 'Dashboards'],
    summary:
      'Acá está mi experiencia laboral formal, y donde más aprendí. Diseño y desarrollo el sitio institucional de Grupo Penna y el sistema Comcam: el panel con el que se opera flota, gomería, órdenes de trabajo, ruteo, stock, choferes, RRHH y reportes. En Front-End armo interfaces densas — tablas, mapas, calendarios, filtros y permisos por rol. En Back-End, APIs en Node.js y Express sobre SQL Server: autenticación, reglas de negocio, costos de OT, extraurbano, conciliaciones, distancias, hermanamiento de unidades, cargas y mails. No es un CRUD de demo: es software que usa la operación todos los días.',
    problem:
      'Transporte de combustibles y cargas no se gobierna con planillas sueltas. Hace falta un sistema que una taller, cubiertas, disponibilidad de unidades, viajes, gente y números — y un sitio público que explique quiénes son.',
    process: [
      'Sitio institucional grupopenna.com.ar: identidad, servicios (combustibles, cargas, lubricantes, estación) y presencia web.',
      'Front-End del panel Comcam: gomería y recapados, stock de cubiertas, historial de OT, estado de flota, ruteo, checklist, extraurbano, choferes, clientes, contratos y RRHH (presentismo, eventos, jornada).',
      'Back-End: APIs REST, JWT, usuarios y permisos por rol, dashboards, reportes, costos de OT, conciliaciones, distancias, hermanamiento de unidades, exportaciones y correo.',
      'Copiloto / chatbot de flota para resumir OT, alertar recambio de cubiertas y leer indicadores.',
    ],
    outcome:
      'Producto real en producción. En esta página cuento lo que construí. El sitio público es grupopenna.com.ar.',
    ai: {
      title: 'Copiloto de flota',
      body: 'Resume una OT, explica un tablero y sugiere qué cubiertas recapar según km, recapas y desgaste. No reemplaza al taller: acelera la lectura operativa.',
    },
    demoPath: '/demo/comcam',
    website: 'https://www.grupopenna.com.ar/',
    cover: '/covers/penna-ruta.png',
    featured: true,
    badge: 'Grupo Penna · 2025 — actualidad',
    accent: '#c9a66b',
    origin: 'Trabajo real en producción. El panel interno no se publica; el sitio sí.',
    backend: [
      'APIs en Node.js + Express + TypeScript, datos en SQL Server.',
      'Autenticación JWT, usuarios y permisos por rol para cada módulo del menú.',
      'Dominios: gomería, unidades y su estado, choferes, clientes, terminales, contratos, costos de OT, extraurbano, distancias, hermanamiento, conciliaciones, tarifas, RRHH y reportes.',
      'Cargas de archivos, exportaciones, mail y un chatbot operativo anclado a datos reales de la empresa.',
    ],
  },
  {
    slug: 'eternal',
    number: '02',
    title: 'Eternal',
    kicker: 'Urnas biodegradables',
    year: '2023 — 2026',
    role: 'Producto, marca, UX/UI y desarrollo',
    stack: ['React', 'TypeScript', 'Figma', 'E-commerce', 'IA'],
    summary:
      'Marca y experiencia de e-commerce para despedir con respeto y volver a la tierra. Investigación, identidad y ahora un producto web completo: catálogo, ficha, impacto y asistente de ceremonia.',
    problem:
      'Hablar de despedida exige calma, claridad y dignidad. Un e-commerce genérico rompe el tono. Había que diseñar un ritual digital, no una góndola.',
    process: [
      'Investigación UX y prototipo en Figma (proyecto original de marca).',
      'Arquitectura de contenido: misión, categorías, combo, sucursales, impacto ambiental.',
      'Asistente de ceremonia que sugiere urna, texto memorial y checklist del servicio.',
    ],
    outcome:
      'Una tienda editorial, oscura y pausada, con checkout simulado y un módulo de IA pensado para acompañar, no para vender agresivo.',
    ai: {
      title: 'Asistente de ceremonia',
      body: 'A partir de un contexto breve (vínculo, lugar, tono) propone una urna, un texto memorial y los pasos del servicio.',
    },
    demoPath: '/demo/eternal',
    cover: '/covers/eternal.jpg',
    accent: '#7d9a72',
    origin: 'Proyecto de marca y producto propio.',
  },
  {
    slug: 'victoria',
    number: '03',
    title: 'Victoria Villarruel',
    kicker: 'Presencia web institucional',
    year: '2024 — 2026',
    role: 'UX/UI y desarrollo web',
    stack: ['React', 'TypeScript', 'Contenido', 'IA'],
    summary:
      'Rediseño de sitio institucional: biografía, ejes, prensa y contacto. Se muestra como pieza de diseño y desarrollo, no como afiliación política.',
    problem:
      'Una figura pública necesita una web clara: quién es, qué sostiene, cómo contactarla. El ruido de redes no alcanza cuando alguien busca información de fondo.',
    process: [
      'Jerarquía editorial: tipografía, ritmo y navegación sobria.',
      'Secciones de bio, ejes, prensa y formulario.',
      'Guía de consultas que responde solo con contenido publicado en el sitio.',
    ],
    outcome:
      'Una presencia web premium, responsive, con búsqueda y un asistente de preguntas frecuentes anclado al contenido.',
    ai: {
      title: 'Guía de consultas',
      body: 'Responde preguntas del visitante usando únicamente el contenido del sitio. No inventa declaraciones.',
    },
    demoPath: '/demo/victoria',
    cover: '/covers/victoria.jpg',
    accent: '#c9a66b',
    origin: 'Proyecto de UX/UI y desarrollo web del portafolio.',
  },
  {
    slug: 'rincon-gourmet',
    number: '04',
    title: 'Rincón Gourmet',
    kicker: 'Restaurante y reservas',
    year: '2024 — 2026',
    role: 'UX/UI y desarrollo',
    stack: ['React', 'TypeScript', 'PWA', 'IA'],
    summary:
      'Sitio de restaurante completo: carta, galería, reservas y un sommelier que arma maridajes según comensales y restricciones.',
    problem:
      'La carta en PDF y el WhatsApp improvisado pierden reservas. El comensal necesita ver, elegir y reservar sin fricción, también desde el teléfono.',
    process: [
      'Carta digital con categorías, alérgenos y platos de autor.',
      'Flujo de reserva con confirmación en el dispositivo.',
      'Sommelier: de una frase (“somos 4, sin TACC, algo tinto”) a una propuesta de mesa.',
    ],
    outcome:
      'Una experiencia de hospitalidad digital, lista para usarse como PWA, con la reserva como acción principal.',
    ai: {
      title: 'Sommelier',
      body: 'Sugiere platos y vinos según cantidad de personas, restricciones y ocasión.',
    },
    demoPath: '/demo/gourmet',
    cover: '/covers/gourmet.jpg',
    accent: '#b85c38',
    origin: 'Proyecto de portafolio, evolucionado a producto completo.',
  },
  {
    slug: 'aurora',
    number: '05',
    title: 'Aurora Salud',
    kicker: 'Clínica y turnos',
    year: '2024 — 2026',
    role: 'UX/UI y fullstack',
    stack: ['React', 'TypeScript', 'Flujos clínicos', 'IA'],
    summary:
      'Clínica digital: especialidades, turnos, panel y pre-admisión. Parte del proyecto final de Rolling Code; esta versión acredita al equipo original y suma una capa de producto e IA.',
    problem:
      'Pedir un turno no debería ser un laberinto. El paciente necesita entender la especialidad, preparar la visita y confirmar horario sin llamados eternos.',
    process: [
      'Flujos de paciente y administración.',
      'Agenda por especialidad y confirmación de turno.',
      'Pre-admisión: el motivo de consulta se convierte en una preparación de visita (no es diagnóstico).',
    ],
    outcome:
      'Un producto clínico claro, con roles, turnos persistidos en el navegador y un copiloto de preparación de consulta.',
    ai: {
      title: 'Pre-admisión',
      body: 'El paciente describe el motivo y recibe especialidad sugerida, qué llevar y cómo prepararse. No diagnostica.',
    },
    demoPath: '/demo/aurora',
    cover: '/covers/aurora.jpg',
    accent: '#4f8f8a',
    origin:
      'Origen: proyecto grupal de Rolling Code School (Celeste Lara, Juan Manuel Maturana, Franco Tatulli, Nicolás Ferreyra y equipo). Esta versión es un upgrade de producto.',
  },
]

export const moreProjects = [
  { name: 'Petroservi Pastrana', kind: 'UX/UI + desarrollo' },
  { name: 'Meraki Web Solutions', kind: 'UX/UI + fullstack + Scrum' },
  { name: 'SM 2162', kind: 'Diseño y web' },
  { name: 'Breta', kind: 'UI design' },
  { name: 'Electroshop', kind: 'UI responsive' },
  { name: 'TechHub', kind: 'UX/UI + desarrollo' },
]

export const experience = [
  {
    title: 'Desarrolladora Full Stack · UX/UI',
    company: 'Grupo Penna',
    period: 'Dic 2025 — actualidad',
    place: 'Buenos Aires, Argentina',
    points: [
      'Sitio institucional grupopenna.com.ar y sistema Comcam de operaciones logísticas.',
      'Front-End: dashboards, tablas, mapas, calendarios, filtros y permisos por rol (gomería, flota, OT, ruteo, stock, RRHH).',
      'Back-End: APIs Node.js / Express sobre SQL Server — auth, reglas de negocio, reportes, costos de OT, conciliaciones y cargas.',
      'Copiloto de flota para resumir información operativa y adelantar recambios.',
    ],
  },
  {
    title: 'Frontend',
    company: 'Codefend',
    period: 'Abr 2025 — May 2025',
    place: 'Remoto',
    points: ['Desarrollo front-end en producto de ciberseguridad.'],
  },
  {
    title: 'UI Designer',
    company: 'Breta',
    period: '2024',
    place: 'México, remoto',
    points: ['Diseño UX/UI para producto digital. Figma y sistemas de interfaz.'],
  },
  {
    title: 'Internship AI-Powered UX',
    company: 'Nuclea Solutions',
    period: 'Oct 2023 — Ene 2024',
    place: 'Guadalajara, remoto',
    points: [
      'Pasantía de UX impulsada con inteligencia artificial.',
      'Investigación, usabilidad y diseño de experiencias con apoyo de IA.',
    ],
  },
]

export const education = [
  {
    title: 'Fullstack Web Developer',
    place: 'Rolling Code School',
    period: '2024',
  },
  {
    title: 'Diseño gráfico',
    place: 'Universidad de Buenos Aires',
    period: 'Formación',
  },
]

/** Link de YouTube (video o lista) o de Spotify (tema, lista o álbum). */
export const nowPlaying = {
  url: 'https://open.spotify.com/playlist/2F1YxcJd9GLxe31E3Y6p4f',
  /** Temas que suenan antes de la playlist (Sui Generis: Canción para mi muerte, Necesito). */
  firstTracks: [
    'https://open.spotify.com/track/0LWO6hUTJz6KBrSA2iJOpH',
    'https://open.spotify.com/track/7H62s62eUQqYXTA3WsrTK7',
  ],
}

export const heroQuestions = {
  music: '¡Esto! Lo tengo en loop mientras programo.',
  musicKeep: '¿Querés seguir escuchando mi música mientras recorrés la página?',
  musicYes: '¡Genial! Queda sonando abajo a la derecha. Lo podés cerrar cuando quieras.',
  about:
    'Mi nombre es Vanina, pero me gusta que me digan Vani. Tengo 34 años, soy de Argentina y vivo en Buenos Aires. Me gusta programar, tomar mates, pasar tiempo con amigos, entrenar, hacer y escuchar música. Me gusta tocar el piano y la guitarra. Mi pasión es la programación y dar lo mejor de mí para crear lo mejor para el usuario.',
  career:
    'Arranqué en diseño gráfico en la UBA, hice UX con IA en Nuclea, UI en Breta, front en Codefend, y hoy soy full stack en Grupo Penna.',
  projects: 'Podés ver mis proyectos abajo.',
  contact: '¡Escribime cuando quieras! Me encontrás acá:',
  mate: ['¡Tomá, te convido uno!', '¿Está rico?'],
  mateYes: '¡Qué bueno!',
  mateNo: ['¡Oh! Lo intentaré mejor la próxima.', 'Dejame que vuelvo a poner la pava.'],
  ai: 'Sí, todo el tiempo. La uso para investigar y prototipar más rápido, y también la meto adentro de los productos: copilotos que resumen datos, asistentes y guías que responden con información real. Siempre al servicio del usuario, no de adorno.',
}

export const profile = {
  name: 'Vanina Balbastro',
  fullName: 'Vanina Rosario Balbastro',
  title: 'Desarrolladora Full Stack con enfoque en Diseño UX/UI',
  email: 'vaniibalbastro@gmail.com',
  phone: '+54 11 5485 3629',
  location: 'Buenos Aires, Argentina',
  github: 'https://github.com/VaniiB',
  linkedin: 'https://www.linkedin.com/in/vaninabalbastro/',
  tagline:
    'Diseño y desarrollo productos que la gente usa de verdad: paneles de operación, marcas y flujos con IA adentro — no como adorno.',
}
