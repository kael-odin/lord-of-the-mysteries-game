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

// 北陆·霜砚镇：极北边镇的霜夜。墨蓝雪原、针叶林剪影、镇上几点煤气灯与
// 一座歪斜的木钟楼——读作「煤气灯时代最北的驿道尽头」。
const NONE = svg(`<rect width="1600" height="900" fill="#05060a"/>`);
const NORTH = svg(`
  <defs>
    <linearGradient id="nsky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#080b14"/>
      <stop offset="0.45" stop-color="#0c1220"/>
      <stop offset="0.6" stop-color="#0a0f1a"/>
      <stop offset="1" stop-color="#06080f"/>
    </linearGradient>
    <radialGradient id="aurora" cx="0.5" cy="0.16" r="0.5">
      <stop offset="0" stop-color="#3a6a5a" stop-opacity="0.28"/>
      <stop offset="0.5" stop-color="#1f4040" stop-opacity="0.1"/>
      <stop offset="1" stop-color="#0a0a10" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="snow" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#10141e"/>
      <stop offset="0.6" stop-color="#0a0d14"/>
      <stop offset="1" stop-color="#05070c"/>
    </linearGradient>
    <radialGradient id="town" cx="0.4" cy="0.62" r="0.28">
      <stop offset="0" stop-color="#e0a44a" stop-opacity="0.22"/>
      <stop offset="0.7" stop-color="#7a4a1a" stop-opacity="0.06"/>
      <stop offset="1" stop-color="#0a0a10" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#nsky)"/>
  <rect width="1600" height="900" fill="url(#aurora)"/>
  <!-- distant pine ridge -->
  <g fill="#070a12" opacity="0.95">
    ${Array.from({ length: 22 }).map((_, i) => {
      const x = i * 76;
      const h = 80 + (i % 5) * 26;
      return `<polygon points="${x},${560} ${x+38},${560-h} ${x+76},${560}"/>`;
    }).join("")}
  </g>
  <!-- snow ground -->
  <rect y="560" width="1600" height="340" fill="url(#snow)"/>
  <!-- town: a few dim wooden houses + a leaning clock tower -->
  <g opacity="0.92">
    <rect x="440" y="500" width="120" height="80" fill="#0a0d14"/>
    <polygon points="440,500 500,460 560,500" fill="#0a0d14"/>
    <rect x="600" y="520" width="90" height="60" fill="#0a0d14"/>
    <polygon points="600,520 645,488 690,520" fill="#0a0d14"/>
    <rect x="740" y="470" width="34" height="160" fill="#0b0e16"/>
    <polygon points="734,470 757,440 780,470" fill="#0b0e16"/>
    <rect x="820" y="510" width="110" height="70" fill="#0a0d14"/>
    <polygon points="820,510 875,472 930,510" fill="#0a0d14"/>
  </g>
  <g>
    <circle cx="490" cy="535" r="2.5" fill="#e0a44a" opacity="0.85"/>
    <circle cx="640" cy="548" r="2.5" fill="#e0a44a" opacity="0.8"/>
    <circle cx="865" cy="540" r="2.5" fill="#e0a44a" opacity="0.8"/>
    <circle cx="757" cy="510" r="3" fill="#e0a44a" opacity="0.85"/>
    <circle cx="757" cy="510" r="14" fill="#e0a44a" opacity="0.14"/>
  </g>
  <rect width="1600" height="900" fill="url(#town)"/>
  <!-- snow flecks -->
  <g fill="#cfd6e0" opacity="0.5">
    ${Array.from({ length: 60 }).map(() => {
      const x = Math.floor(Math.random() * 1600);
      const y = Math.floor(Math.random() * 560);
      const r = (Math.random() * 1.2 + 0.4).toFixed(1);
      return `<circle cx="${x}" cy="${y}" r="${r}"/>`;
    }).join("")}
  </g>
  <rect y="760" width="1600" height="140" fill="#05070c" opacity="0.6"/>
`);

// 海上之城：风暴之海上的远航与雾中浮城。墨黑海面、铅灰浪脊、远处浮岛的灯火、
// 天顶一道撕裂的闪电——读作蒸汽煤气灯时代的「远海夜航」。
const SEA = svg(`
  <defs>
    <linearGradient id="seasky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#070a0e"/>
      <stop offset="0.45" stop-color="#0c1118"/>
      <stop offset="0.55" stop-color="#0a0e14"/>
      <stop offset="1" stop-color="#05070a"/>
    </linearGradient>
    <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0a1014"/>
      <stop offset="0.5" stop-color="#070b10"/>
      <stop offset="1" stop-color="#04060a"/>
    </linearGradient>
    <radialGradient id="lightning" cx="0.32" cy="0.12" r="0.28">
      <stop offset="0" stop-color="#9fb4c8" stop-opacity="0.5"/>
      <stop offset="0.5" stop-color="#6a7a90" stop-opacity="0.12"/>
      <stop offset="1" stop-color="#0a0a10" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="isle" cx="0.74" cy="0.5" r="0.22">
      <stop offset="0" stop-color="#e0a44a" stop-opacity="0.3"/>
      <stop offset="0.6" stop-color="#9a6a2a" stop-opacity="0.1"/>
      <stop offset="1" stop-color="#0a0a10" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="mist" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stop-color="#1a2030" stop-opacity="0.7"/>
      <stop offset="0.7" stop-color="#0a0e14" stop-opacity="0.3"/>
      <stop offset="1" stop-color="#05070a" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#seasky)"/>
  <rect width="1600" height="900" fill="url(#lightning)"/>
  <!-- distant floating city: stacked dim spires + a few gaslit windows -->
  <g opacity="0.9">
    <rect x="1110" y="430" width="180" height="120" fill="#0a0d12"/>
    <polygon points="1110,430 1140,360 1170,430" fill="#0a0d12"/>
    <polygon points="1180,420 1220,340 1260,420" fill="#0a0d12"/>
    <polygon points="1240,430 1280,370 1290,430" fill="#0a0d12"/>
    <rect x="1230" y="360" width="14" height="80" fill="#0d1016"/>
  </g>
  <g>
    <circle cx="1150" cy="470" r="3" fill="#e0a44a" opacity="0.85"/>
    <circle cx="1200" cy="450" r="3" fill="#e0a44a" opacity="0.8"/>
    <circle cx="1245" cy="475" r="2.5" fill="#e0a44a" opacity="0.7"/>
    <circle cx="1180" cy="495" r="2" fill="#e0a44a" opacity="0.6"/>
  </g>
  <rect width="1600" height="900" fill="url(#isle)"/>
  <!-- sea -->
  <rect y="560" width="1600" height="340" fill="url(#sea)"/>
  <!-- wave crests -->
  <g fill="#1a2230" opacity="0.5">
    <path d="M0 600 Q 100 590 200 600 T 400 600 T 600 600 T 800 600 T 1000 600 T 1200 600 T 1400 600 T 1600 600 V 620 H 0 Z"/>
  </g>
  <g fill="#0d1218" opacity="0.8">
    <path d="M0 640 Q 120 625 240 640 T 480 640 T 720 640 T 960 640 T 1200 640 T 1440 640 T 1600 640 V 720 H 0 Z"/>
    <path d="M0 720 Q 160 700 320 720 T 640 720 T 960 720 T 1280 720 T 1600 720 V 900 H 0 Z"/>
  </g>
  <!-- a lone ship's mast + lamp, silhouetted on the swell -->
  <g opacity="0.85">
    <rect x="180" y="560" width="6" height="90" fill="#080a0e"/>
    <rect x="150" y="585" width="66" height="6" fill="#080a0e"/>
    <polygon points="150,588 210,588 210,560 150,560" fill="#0d1218" opacity="0.6"/>
    <circle cx="183" cy="655" r="5" fill="#e0a44a" opacity="0.85"/>
    <circle cx="183" cy="655" r="18" fill="#e0a44a" opacity="0.16"/>
  </g>
  <rect y="700" width="1600" height="200" fill="url(#mist)"/>
  <rect width="1600" height="900" fill="#05070a" opacity="0.1"/>
`);

export const SCENE_ART: Record<string, string> = {
  city: CITY,
  fog: FOG,
  ritual: RITUAL,
  sea: SEA,
  north: NORTH,
  none: NONE,
};

export function sceneArt(art: string | undefined): string {
  return SCENE_ART[art || "city"] || CITY;
}
