// Original scene backgrounds as inline SVG (no external/copyrighted assets).
// Each scene renders a moody, LOTM-appropriate backdrop:
//   city   — gaslit Tingen street, soot, chimney silhouettes, crimson moon
//   fog    — the Gray-Fog palace above the sea of fog, twenty-two chairs
//   ritual — candlelit ritual chamber, blood array, sealed glow
//   none   — pure ink (for endings that want total darkness)
//
// These are designed to read as one visual system: soot-black base,
// oxidized-copper-green mist, gaslight-amber highlights, church-silver accents.

function svg(body: string): string {
  const s = `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">${body}</svg>`;
  // Encode as data URL (utf8 inline). Keep it small.
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(s)}")`;
}

const CITY = svg(`
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0a0a10"/>
      <stop offset="0.5" stop-color="#12101a"/>
      <stop offset="0.7" stop-color="#1a1318"/>
      <stop offset="1" stop-color="#08070b"/>
    </linearGradient>
    <radialGradient id="moon" cx="0.78" cy="0.18" r="0.18">
      <stop offset="0" stop-color="#e8a08a"/>
      <stop offset="0.5" stop-color="#b05a4a"/>
      <stop offset="1" stop-color="#b05a4a" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="fog" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stop-color="#1a1d26" stop-opacity="0.9"/>
      <stop offset="0.6" stop-color="#15161e" stop-opacity="0.6"/>
      <stop offset="1" stop-color="#0a0a10" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#sky)"/>
  <circle cx="1248" cy="162" r="150" fill="url(#moon)"/>
  <circle cx="1248" cy="162" r="62" fill="#d9806a" opacity="0.85"/>
  <circle cx="1248" cy="162" r="62" fill="#0a0a10" opacity="0.35" transform="rotate(-15 1248 162)"/>
  <!-- chimneys -->
  <g fill="#0c0a12">
    <rect x="0" y="560" width="120" height="340"/>
    <rect x="110" y="600" width="90" height="300"/>
    <rect x="200" y="520" width="140" height="380"/>
    <rect x="340" y="640" width="70" height="260"/>
    <rect x="410" y="540" width="110" height="360"/>
    <rect x="520" y="620" width="80" height="280"/>
    <rect x="600" y="560" width="130" height="340"/>
    <rect x="730" y="600" width="90" height="300"/>
    <rect x="820" y="540" width="120" height="360"/>
    <rect x="940" y="620" width="70" height="280"/>
    <rect x="1010" y="560" width="140" height="340"/>
    <rect x="1150" y="600" width="90" height="300"/>
    <rect x="1240" y="540" width="120" height="360"/>
    <rect x="1360" y="620" width="80" height="280"/>
    <rect x="1440" y="560" width="160" height="340"/>
  </g>
  <!-- distant spires -->
  <g fill="#0a0810" opacity="0.9">
    <polygon points="220,560 280,440 340,560"/>
    <polygon points="560,560 640,420 720,560"/>
    <polygon points="1020,560 1090,450 1160,560"/>
  </g>
  <!-- gaslights -->
  <g>
    <circle cx="150" cy="540" r="14" fill="#e0a44a" opacity="0.85"/>
    <circle cx="150" cy="540" r="42" fill="#e0a44a" opacity="0.18"/>
    <circle cx="640" cy="560" r="12" fill="#e0a44a" opacity="0.8"/>
    <circle cx="640" cy="560" r="36" fill="#e0a44a" opacity="0.16"/>
    <circle cx="1120" cy="560" r="13" fill="#e0a44a" opacity="0.85"/>
    <circle cx="1120" cy="560" r="40" fill="#e0a44a" opacity="0.18"/>
    <circle cx="1460" cy="540" r="12" fill="#e0a44a" opacity="0.8"/>
    <circle cx="1460" cy="540" r="36" fill="#e0a44a" opacity="0.16"/>
  </g>
  <rect y="780" width="1600" height="120" fill="url(#fog)"/>
  <rect width="1600" height="900" fill="#08070b" opacity="0.15"/>
`);

const FOG = svg(`
  <defs>
    <linearGradient id="fsky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0c0d14"/>
      <stop offset="0.5" stop-color="#15161e"/>
      <stop offset="1" stop-color="#0a0a10"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.42" r="0.45">
      <stop offset="0" stop-color="#9aa0b0" stop-opacity="0.22"/>
      <stop offset="0.6" stop-color="#6a6f80" stop-opacity="0.08"/>
      <stop offset="1" stop-color="#0a0a10" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="fog2" cx="0.5" cy="0.9" r="0.7">
      <stop offset="0" stop-color="#3a3f4e" stop-opacity="0.5"/>
      <stop offset="1" stop-color="#0a0a10" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#fsky)"/>
  <rect width="1600" height="900" fill="url(#fog2)"/>
  <!-- floating palace columns -->
  <g opacity="0.85">
    <rect x="430" y="300" width="40" height="360" fill="#13141d"/>
    <rect x="510" y="300" width="40" height="360" fill="#13141d"/>
    <rect x="590" y="300" width="40" height="360" fill="#13141d"/>
    <rect x="670" y="300" width="40" height="360" fill="#13141d"/>
    <rect x="890" y="300" width="40" height="360" fill="#13141d"/>
    <rect x="970" y="300" width="40" height="360" fill="#13141d"/>
    <rect x="1050" y="300" width="40" height="360" fill="#13141d"/>
    <rect x="1130" y="300" width="40" height="360" fill="#13141d"/>
    <rect x="360" y="270" width="880" height="46" fill="#1a1c28"/>
    <rect x="360" y="640" width="880" height="46" fill="#1a1c28"/>
  </g>
  <!-- twenty-two chair silhouettes -->
  <g fill="#0a0a12" opacity="0.7">
    ${Array.from({ length: 11 })
      .map((_, i) => {
        const x = 400 + i * 80;
        return `<rect x="${x}" y="560" width="34" height="70"/><rect x="${x - 4}" y="540" width="42" height="28"/>`;
      })
      .join("")}
  </g>
  <!-- head chair glow -->
  <rect x="780" y="540" width="44" height="96" fill="#c9a86a" opacity="0.06"/>
  <circle cx="802" cy="470" r="120" fill="#c9a86a" opacity="0.04"/>
  <rect width="1600" height="900" fill="url(#glow)"/>
`);

const RITUAL = svg(`
  <defs>
    <radialGradient id="rglow" cx="0.5" cy="0.62" r="0.5">
      <stop offset="0" stop-color="#7a1a1a" stop-opacity="0.5"/>
      <stop offset="0.5" stop-color="#3a0c0c" stop-opacity="0.3"/>
      <stop offset="1" stop-color="#08070b" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="rwall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0a0a10"/>
      <stop offset="1" stop-color="#140c0e"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#rwall)"/>
  <!-- blood array -->
  <g transform="translate(800 600)" fill="none" stroke="#9a2a2a" stroke-width="3" opacity="0.7">
    <circle r="280"/>
    <circle r="210"/>
    <circle r="140"/>
    <polygon points="0,-280 242,140 -242,140" opacity="0.6"/>
    <polygon points="0,280 -242,-140 242,-140" opacity="0.6"/>
    <line x1="-280" y1="0" x2="280" y2="0" opacity="0.4"/>
    <line x1="0" y1="-280" x2="0" y2="280" opacity="0.4"/>
  </g>
  <circle cx="800" cy="600" r="80" fill="#c44" opacity="0.25"/>
  <!-- candles -->
  <g>
    ${Array.from({ length: 16 })
      .map((_, i) => {
        const a = (i / 16) * Math.PI * 2;
        const x = 800 + Math.cos(a) * 300;
        const y = 600 + Math.sin(a) * 300 * 0.55;
        return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="6" fill="#e0a44a" opacity="0.85"/><circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="22" fill="#e0a44a" opacity="0.16"/>`;
      })
      .join("")}
  </g>
  <rect width="1600" height="900" fill="url(#rglow)"/>
`);

const NONE = svg(`<rect width="1600" height="900" fill="#05060a"/>`);

export const SCENE_ART: Record<string, string> = {
  city: CITY,
  fog: FOG,
  ritual: RITUAL,
  none: NONE,
};

export function sceneArt(art: string | undefined): string {
  return SCENE_ART[art || "city"] || CITY;
}
