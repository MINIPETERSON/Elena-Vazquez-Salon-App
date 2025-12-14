import { HairOption } from './types';

export const COLOR_OPTIONS: HairOption[] = [
  {
    id: 'blonde-platinum',
    name: 'Rubio Platinado',
    description: 'Rubio frío y brillante.',
    promptModifier: 'Change the hair color to icy platinum blonde.',
    icon: '👱‍♀️'
  },
  {
    id: 'honey-blonde',
    name: 'Rubio Miel',
    description: 'Cálido y dorado.',
    promptModifier: 'Change the hair color to warm honey blonde.',
    icon: '🍯'
  },
  {
    id: 'brunette-chocolate',
    name: 'Castaño Chocolate',
    description: 'Marrón profundo y rico.',
    promptModifier: 'Change the hair color to deep chocolate brown.',
    icon: '🍫'
  },
  {
    id: 'chestnut',
    name: 'Castaño Claro',
    description: 'Marrón suave con reflejos dorados.',
    promptModifier: 'Change the hair color to light chestnut brown.',
    icon: '🌰'
  },
  {
    id: 'jet-black',
    name: 'Negro Azabache',
    description: 'Oscuro, brillante e intenso.',
    promptModifier: 'Change the hair color to jet black.',
    icon: '🖤'
  },
  {
    id: 'red-intense',
    name: 'Rojo Intenso',
    description: 'Vibrante y audaz.',
    promptModifier: 'Change the hair color to vibrant cherry red.',
    icon: '🍒'
  },
  {
    id: 'copper',
    name: 'Cobrizo / Ginger',
    description: 'Naranja natural y cálido.',
    promptModifier: 'Change the hair color to natural copper ginger.',
    icon: '🦊'
  },
  {
    id: 'balayage',
    name: 'Balayage',
    description: 'Degradado natural de raíz oscura a puntas claras.',
    promptModifier: 'Apply a balayage technique with dark roots transitioning to lighter ends.',
    icon: '🖌️'
  },
  {
    id: 'highlights',
    name: 'Mechas / Luces',
    description: 'Iluminación sutil.',
    promptModifier: 'Add sun-kissed highlights throughout the hair.',
    icon: '✨'
  },
  {
    id: 'fantasy-pink',
    name: 'Rosa Pastel',
    description: 'Suave y fantasía.',
    promptModifier: 'Change the hair color to soft pastel pink.',
    icon: '🌸'
  },
  {
    id: 'electric-blue',
    name: 'Azul Eléctrico',
    description: 'Llamativo y moderno.',
    promptModifier: 'Change the hair color to vivid electric blue.',
    icon: '⚡'
  },
  {
    id: 'silver-grey',
    name: 'Gris Plata',
    description: 'Sofisticado y trendy.',
    promptModifier: 'Change the hair color to metallic silver grey.',
    icon: '👵'
  }
];

export const WOMEN_CUT_OPTIONS: HairOption[] = [
  {
    id: 'bob',
    name: 'Classic Bob',
    description: 'A la altura de la mandíbula.',
    promptModifier: 'Change the hairstyle to a classic chin-length Bob cut.',
    icon: '💇‍♀️'
  },
  {
    id: 'long-bob',
    name: 'Lob (Long Bob)',
    description: 'Por encima de los hombros.',
    promptModifier: 'Change the hairstyle to a Long Bob (Lob) hitting just above the shoulders.',
    icon: '📏'
  },
  {
    id: 'pixie',
    name: 'Pixie Cut',
    description: 'Muy corto y texturizado.',
    promptModifier: 'Change the hairstyle to a short, textured Pixie cut.',
    icon: '🧚'
  },
  {
    id: 'layers-long',
    name: 'Largo a Capas',
    description: 'Volumen y movimiento.',
    promptModifier: 'Change the hairstyle to long hair with many face-framing layers.',
    icon: '🌬️'
  },
  {
    id: 'shag',
    name: 'Shag Cut',
    description: 'Desenfadado y roquero años 70.',
    promptModifier: 'Change the hairstyle to a modern Shag cut with choppy layers and bangs.',
    icon: '🎸'
  },
  {
    id: 'bangs-straight',
    name: 'Flequillo Recto',
    description: 'Añade flequillo tupido.',
    promptModifier: 'Add straight, full bangs to the forehead.',
    icon: '⛩️'
  },
  {
    id: 'curtain-bangs',
    name: 'Flequillo Cortina',
    description: 'Abierto y suave.',
    promptModifier: 'Add soft curtain bangs that frame the face.',
    icon: '🎭'
  },
  {
    id: 'wavy-beach',
    name: 'Ondas Playeras',
    description: 'Textura relajada.',
    promptModifier: 'Change the hair texture to loose, messy beach waves.',
    icon: '🌊'
  },
  {
    id: 'sleek-straight',
    name: 'Liso Tabla',
    description: 'Perfectamente liso y pulido.',
    promptModifier: 'Straighten the hair completely for a sleek, polished look.',
    icon: '🥢'
  }
];

export const MEN_CUT_OPTIONS: HairOption[] = [
  {
    id: 'low-fade',
    name: 'Low Fade',
    description: 'Degradado bajo clásico.',
    promptModifier: 'Change the hairstyle to a classic Low Fade with textured top.',
    icon: '💈'
  },
  {
    id: 'mid-fade-quiff',
    name: 'Mid Fade & Quiff',
    description: 'Degradado medio con tupé.',
    promptModifier: 'Change the hairstyle to a Mid Fade with a voluminous Quiff on top.',
    icon: '😎'
  },
  {
    id: 'buzz-cut',
    name: 'Buzz Cut',
    description: 'Rapado militar.',
    promptModifier: 'Change the hairstyle to a Buzz cut (very short uniform length).',
    icon: '🪒'
  },
  {
    id: 'pompadour',
    name: 'Pompadour',
    description: 'Volumen alto hacia atrás.',
    promptModifier: 'Change the hairstyle to a classic Pompadour slicked back.',
    icon: '🕺'
  },
  {
    id: 'textured-crop',
    name: 'Textured Crop',
    description: 'Corto y texturizado (French Crop).',
    promptModifier: 'Change the hairstyle to a French Crop with textured fringe.',
    icon: '🧢'
  },
  {
    id: 'slick-back',
    name: 'Slick Back',
    description: 'Peinado hacia atrás elegante.',
    promptModifier: 'Change the hairstyle to a classic Slick Back look.',
    icon: '💼'
  },
  {
    id: 'mullet-modern',
    name: 'Modern Mullet',
    description: 'Corto lados, largo detrás.',
    promptModifier: 'Change the hairstyle to a trendy Modern Mullet.',
    icon: '🤘'
  },
  {
    id: 'surfer-flow',
    name: 'Surfer Flow',
    description: 'Medio largo y ondulado.',
    promptModifier: 'Change the hairstyle to a medium-length flowy surfer style.',
    icon: '🏄'
  },
  {
    id: 'side-part-men',
    name: 'Classic Side Part',
    description: 'Raya al lado formal.',
    promptModifier: 'Change the hairstyle to a gentleman\'s classic Side Part.',
    icon: '🤵'
  }
];
