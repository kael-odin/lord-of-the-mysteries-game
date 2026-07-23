// Original pathway heraldic emblems — inline SVG strings, fog-codex palette.
// Each emblem encodes a pathway's symbolic motif from LOTM lore.
// These are NOT copyrighted art: geometric/typographic compositions of
// public-domain symbols (eye, crescent, headstone, book, crosshair, keyhole).
//
// Palette (shared with sceneArt):
//   ink      #0a0a10   soot-black ground
//   copper   #2a3a36   oxidized-copper mist
//   amber    #e0a44a   gaslight amber (primary accent)
//   palegold #e7d9b8   pale gold (highlight)
//   silver   #9aa0b0   church silver
//   crimson  #b05a4a   crimson moon (warn/lost)
//
// Stroke uses currentColor so callers can recolor via CSS color.

export type PathwayKey =
  | "seer" | "sleepless" | "collector" | "pryer" | "hunter" | "reader";

const DEFS = `
  <defs>
    <radialGradient id="emb-glow" cx="0.5" cy="0.42" r="0.5">
      <stop offset="0" stop-color="#e7d9b8" stop-opacity="0.18"/>
      <stop offset="0.6" stop-color="#e0a44a" stop-opacity="0.05"/>
      <stop offset="1" stop-color="#0a0a10" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="emb-disk" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#15161e"/>
      <stop offset="1" stop-color="#0a0a10"/>
    </radialGradient>
  </defs>
`;

// base viewBox 100x100, emblem centered in a faint sigil disk
function wrap(inner: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${DEFS}
    <circle cx="50" cy="50" r="48" fill="url(#emb-disk)" stroke="#c9a86a" stroke-opacity="0.25" stroke-width="0.75"/>
    <circle cx="50" cy="50" r="44" fill="none" stroke="#2a3a36" stroke-width="0.5"/>
    ${inner}
    <circle cx="50" cy="50" r="48" fill="url(#emb-glow)"/>
  </svg>`;
}

const SEER = wrap(`
  <g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
    <path d="M22 50 Q50 30 78 50 Q50 70 22 50 Z"/>
    <circle cx="50" cy="50" r="10"/>
    <circle cx="50" cy="50" r="4.2" fill="currentColor" stroke="none"/>
    <g stroke-width="1">
      <path d="M50 18 L50 24"/><path d="M50 76 L50 82"/>
      <path d="M18 50 L24 50"/><path d="M76 50 L82 50"/>
      <path d="M27 27 L31 31"/><path d="M69 69 L73 73"/>
      <path d="M73 27 L69 31"/><path d="M31 69 L27 73"/>
    </g>
  </g>
`);

const SLEEPLESS = wrap(`
  <g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
    <path d="M30 22 A34 34 0 1 0 30 78 A26 26 0 1 1 30 22 Z"/>
    <circle cx="62" cy="50" r="3.4" fill="currentColor" stroke="none"/>
    <path d="M44 50 L52 50" stroke-width="1.1"/>
    <path d="M30 30 L33 34" stroke-width="0.9"/>
    <path d="M30 70 L33 66" stroke-width="0.9"/>
  </g>
`);

const COLLECTOR = wrap(`
  <g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M38 26 L62 26 L62 40 L58 40 L58 70 Q58 78 50 78 Q42 78 42 70 L42 40 L38 40 Z"/>
    <path d="M34 26 L66 26" stroke-width="1.4"/>
    <path d="M50 40 L50 70" stroke-width="0.8" stroke-opacity="0.6"/>
    <path d="M44 84 Q50 90 56 84" stroke-width="1"/>
    <circle cx="50" cy="33" r="1.6" fill="currentColor" stroke="none"/>
  </g>
`);

const PRYER = wrap(`
  <g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M26 26 L50 26 L50 78 Q40 78 26 78 Z"/>
    <path d="M50 26 L74 26 L74 78 Q60 78 50 78 Z"/>
    <path d="M50 26 L50 78" stroke-opacity="0.5" stroke-width="1"/>
    <g stroke-width="1.1">
      <path d="M33 40 L44 40"/><path d="M33 48 L44 48"/>
      <path d="M56 40 L67 40"/><path d="M56 48 L67 48"/>
    </g>
    <circle cx="50" cy="20" r="3" fill="currentColor" stroke="none"/>
    <path d="M50 23 L50 26"/>
  </g>
`);

const HUNTER = wrap(`
  <g fill="none" stroke="currentColor" stroke-width="1.6">
    <circle cx="50" cy="50" r="28"/>
    <circle cx="50" cy="50" r="18"/>
    <circle cx="50" cy="50" r="2.4" fill="currentColor" stroke="none"/>
    <g stroke-width="1.2">
      <path d="M50 14 L50 22"/><path d="M50 78 L50 86"/>
      <path d="M14 50 L22 50"/><path d="M78 50 L86 50"/>
      <path d="M24.5 24.5 L30 30"/><path d="M70 70 L75.5 75.5"/>
      <path d="M75.5 24.5 L70 30"/><path d="M30 70 L24.5 75.5"/>
    </g>
  </g>
`);

const READER = wrap(`
  <g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="50" cy="42" r="20"/>
    <path d="M50 62 L50 80" stroke-width="1.8"/>
    <path d="M40 50 Q50 56 60 50" stroke-width="1.1"/>
    <path d="M50 62 L42 76" stroke-width="1"/>
    <path d="M50 62 L58 76" stroke-width="1"/>
    <circle cx="50" cy="40" r="5" fill="currentColor" stroke="none"/>
    <g stroke-width="1">
      <path d="M30 30 L35 35"/><path d="M70 30 L65 35"/>
    </g>
  </g>
`);

export const PATHWAY_EMBLEMS: Record<PathwayKey, string> = {
  seer: SEER,
  sleepless: SLEEPLESS,
  collector: COLLECTOR,
  pryer: PRYER,
  hunter: HUNTER,
  reader: READER,
};

export function emblemSVG(key: PathwayKey): string {
  return PATHWAY_EMBLEMS[key] || PATHWAY_EMBLEMS.seer;
}

export function emblemDataURL(key: PathwayKey): string {
  const svg = emblemSVG(key);
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
