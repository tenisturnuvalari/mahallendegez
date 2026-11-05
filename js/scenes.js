// Demo anılar: eski fotoğraf estetiğinde üretilen SVG sahneler.
// Supabase bağlanana kadar galeriyi doldurur.

const DISTRICTS = [
  "Çankaya",
  "Yenimahalle",
  "Keçiören",
  "Mamak",
  "Altındağ",
  "Etimesgut",
  "Sincan",
  "Gölbaşı",
  "Pursaklar",
  "Diğer",
];

const YEARS = [
  "1960'lar",
  "1970'ler",
  "1980'ler",
  "1990'lar",
  "2000'ler",
  "2010'lar",
  "Belirtmek istemiyorum",
];

function svgToDataURI(svg) {
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

// Tek katmanlı bina çizimi
function buildingSVG(b) {
  const { x, w, h, color, top = 0 } = b;
  const y = 600 - top - h;
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}"/>`;
  // pencereler
  if (b.windows !== false) {
    for (let wy = y + 18; wy < y + h - 16; wy += 34) {
      for (let wx = x + 10; wx < x + w - 14; wx += 30) {
        const lit = (wx + wy) % 3 === 0;
        s += `<rect x="${wx}" y="${wy}" width="14" height="18" fill="${lit ? "#e8c98a" : "#2e2820"}" opacity="${lit ? 0.75 : 0.55}"/>`;
      }
    }
  }
  return s;
}

function treeSVG(x, y, s, leaf = "#5c5a3a", trunk = "#40382a") {
  s = s || 1;
  return (
    `<rect x="${x - 4 * s}" y="${y - 34 * s}" width="${8 * s}" height="${34 * s}" fill="${trunk}"/>` +
    `<circle cx="${x}" cy="${y - 52 * s}" r="${26 * s}" fill="${leaf}"/>` +
    `<circle cx="${x - 18 * s}" cy="${y - 40 * s}" r="${18 * s}" fill="${leaf}"/>` +
    `<circle cx="${x + 18 * s}" cy="${y - 42 * s}" r="${17 * s}" fill="${leaf}"/>`
  );
}

const EXTRAS = {
  // Cami: kubbe + minare
  mosque(x, scale = 1) {
    const s = scale;
    return (
      `<rect x="${x}" y="${440}" width="${150 * s}" height="${120 * s}" fill="#6d6152"/>` +
      `<ellipse cx="${x + 75 * s}" cy="${440}" rx="${62 * s}" ry="${44 * s}" fill="#7d7060"/>` +
      `<rect x="${x + 128 * s}" y="${300}" width="${20 * s}" height="260" fill="#6d6152"/>` +
      `<polygon points="${x + 118 * s},300 ${x + 158 * s},300 ${x + 138 * s},252" fill="#554c40"/>` +
      `<circle cx="${x + 138 * s}" cy="244" r="7" fill="#c9a24a"/>`
    );
  },
  // Anıtkabir sütun dizisi
  colonnade(x = 80) {
    let s = `<rect x="${x}" y="240" width="640" height="34" fill="#9a8f7a"/>`;
    for (let i = 0; i < 10; i++) {
      const cx = x + 24 + i * 62;
      s += `<rect x="${cx}" y="274" width="30" height="230" fill="#a89d87"/>`;
      s += `<rect x="${cx - 4}" y="274" width="38" height="12" fill="#8d8370"/>`;
    }
    s += `<rect x="${x}" y="504" width="640" height="56" fill="#8d8370"/>`;
    return s;
  },
  // Bakkal dükkanı cephesi
  shop(x = 180, w = 440) {
    let s = `<rect x="${x}" y="300" width="${w}" height="260" fill="#7a6a52"/>`;
    // tente
    s += `<rect x="${x - 14}" y="356" width="${w + 28}" height="34" fill="#a4552f"/>`;
    for (let i = 0; i < 9; i++) {
      s += `<rect x="${x - 14 + i * ((w + 28) / 9)}" y="356" width="${(w + 28) / 18}" height="34" fill="#e6dcc4"/>`;
    }
    // vitrin + kapı
    s += `<rect x="${x + 24}" y="400" width="${w * 0.55}" height="140" fill="#3d372c"/>`;
    s += `<rect x="${x + 24}" y="400" width="${w * 0.55}" height="140" fill="#c9a86a" opacity="0.25"/>`;
    s += `<rect x="${x + w - 110}" y="410" width="80" height="150" fill="#4a4235"/>`;
    // tabelası
    s += `<rect x="${x + 40}" y="312" width="${w - 80}" height="36" fill="#3d372c"/>`;
    return s;
  },
  laundryLine(x1 = 60, x2 = 740, y = 250) {
    let s = `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y + 30}" stroke="#3d372c" stroke-width="3"/>`;
    const colors = ["#c9b08a", "#8fa3a8", "#b4552d", "#e0d3b4", "#6f7f5c"];
    for (let i = 0; i < 6; i++) {
      const px = x1 + 70 + i * 105;
      const py = y + (i * 30) / 6 + 10;
      s += `<rect x="${px}" y="${py}" width="46" height="60" fill="${colors[i % colors.length]}" opacity="0.9"/>`;
    }
    return s;
  },
  snow() {
    let s = "";
    for (let i = 0; i < 70; i++) {
      const x = (i * 137) % 800;
      const y = (i * 89) % 600;
      s += `<circle cx="${x}" cy="${y}" r="${(i % 3) + 1.5}" fill="#f4f1e8" opacity="0.85"/>`;
    }
    return s;
  },
};

// Sahne → eski fotoğraf SVG'si
function buildScene(cfg) {
  const {
    skyTop = "#c2ad8c",
    skyBottom = "#efe2c6",
    ground = "#8a7a5f",
    groundLine = "#6f6049",
    sun = null,
    buildings = [],
    extras = [],
    tint = "#7a5a2e",
    tintOpacity = 0.16,
    vignette = 0.55,
    grain = 0.16,
  } = cfg;

  let content = "";
  content += `<rect x="0" y="0" width="800" height="600" fill="url(#sky)"/>`;
  if (sun) {
    content += `<circle cx="${sun.x}" cy="${sun.y}" r="${sun.r}" fill="${sun.color}" opacity="0.85"/>`;
  }
  buildings.forEach((b) => (content += buildingSVG(b)));
  content += `<rect x="0" y="${600 - (cfg.groundY || 90)}" width="800" height="${cfg.groundY || 90}" fill="${ground}"/>`;
  content += `<rect x="0" y="${600 - (cfg.groundY || 90)}" width="800" height="5" fill="${groundLine}"/>`;
  extras.forEach((e) => (content += e));

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${skyTop}"/>
      <stop offset="1" stop-color="${skyBottom}"/>
    </linearGradient>
    <radialGradient id="vig" cx="0.5" cy="0.5" r="0.78">
      <stop offset="0.55" stop-color="#000000" stop-opacity="0"/>
      <stop offset="1" stop-color="#2b1d0d" stop-opacity="${vignette}"/>
    </radialGradient>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
    <clipPath id="frame"><rect x="0" y="0" width="800" height="600"/></clipPath>
  </defs>
  <g clip-path="url(#frame)">
    ${content}
    <rect x="0" y="0" width="800" height="600" fill="${tint}" opacity="${tintOpacity}" style="mix-blend-mode:multiply"/>
    <rect x="0" y="0" width="800" height="600" fill="url(#vig)"/>
    <rect x="0" y="0" width="800" height="600" filter="url(#grain)" opacity="${grain}" style="mix-blend-mode:overlay"/>
  </g>
</svg>`;
}

const DEMO_MEMORIES = [
  {
    id: "demo-1",
    title: "Soba közünde kestane",
    district: "Keçiören",
    neighborhood: "Yeşiltepe",
    year: "1980'ler",
    story:
      "Kış akşamları apartmanın bodrumunda sobanın başında kestane koyardık. Duman kokusu, ıslak eldivenler ve lamba altında ödev bitirmek…",
    scene: {
      skyTop: "#8f7a5e",
      skyBottom: "#d8c19a",
      ground: "#6b5c46",
      sun: { x: 640, y: 140, r: 46, color: "#e8b04b" },
      buildings: [
        { x: 40, w: 180, h: 330, color: "#7a6a55" },
        { x: 250, w: 150, h: 270, color: "#685a48" },
        { x: 430, w: 200, h: 360, color: "#746555" },
        { x: 660, w: 130, h: 250, color: "#5f5343" },
      ],
      extras: [EXTRAS.laundryLine(30, 780, 210)],
      tint: "#6b4a22",
    },
  },
  {
    id: "demo-2",
    title: "Apartman boşluğunda top oyunu",
    district: "Çankaya",
    neighborhood: "Bahçelievler",
    year: "1990'lar",
    story:
      "İki apartman arasındaki dar boşluk bizim stadyumumuzdu. Top pencereye kaçmasın diye korkarak şut çeker, sonra kimin kaleci olacağına günlerce tartışırdık.",
    scene: {
      skyTop: "#b8a887",
      skyBottom: "#eadcc0",
      ground: "#7f8a64",
      groundY: 130,
      buildings: [
        { x: -20, w: 260, h: 420, color: "#8a7a62" },
        { x: 560, w: 280, h: 440, color: "#7d6e58" },
      ],
      extras: [treeSVG(400, 580, 1.4), treeSVG(120, 580, 1)],
      tint: "#7a5a2e",
    },
  },
  {
    id: "demo-3",
    title: "Bayram sabahı cami avlusu",
    district: "Altındağ",
    neighborhood: "Hacıbayram",
    year: "1970'ler",
    story:
      "Bayram sabahı çocuklardan önce camiye koşardık. Avluda büyükler el öpüşür, bayram şekerleri ceplere doldururdu.",
    scene: {
      skyTop: "#a89a7e",
      skyBottom: "#f0e3c4",
      ground: "#9a8d74",
      groundY: 150,
      sun: { x: 150, y: 120, r: 55, color: "#f2d28a" },
      buildings: [{ x: 620, w: 200, h: 260, color: "#7a6e5c" }],
      extras: [EXTRAS.mosque(180, 1.1), treeSVG(700, 570, 0.9)],
      tint: "#7a5a2e",
    },
  },
  {
    id: "demo-4",
    title: "Anıtkabir'e okul gezisi",
    district: "Çankaya",
    neighborhood: "Teşvikiye",
    year: "1995",
    story:
      "Sınıfça otobüse dizilip yola çıkardık. Sütunların arasında fısıltıyla yürümek zorundaydık; dönüşte herkesin çantasında bir fotoğraf ve bir rozet olurdu.",
    scene: {
      skyTop: "#9db3c4",
      skyBottom: "#e9e2cd",
      ground: "#b3a68c",
      groundY: 110,
      buildings: [],
      extras: [EXTRAS.colonnade(60), treeSVG(40, 570, 0.8, "#6f7a52"), treeSVG(770, 570, 0.8, "#6f7a52")],
      tint: "#6b5a3e",
      tintOpacity: 0.12,
    },
  },
  {
    id: "demo-5",
    title: "Mahalle bakkalının önündeki kalemler",
    district: "Yenimahalle",
    neighborhood: "Demetevler",
    year: "1990'lar",
    story:
      "Okuldan dönerken veresiye defterine adımızı yazdırır, dondurma ya da kalem alırdık. Bakkal amca herkesin borcunu aklında tutardı.",
    scene: {
      skyTop: "#b3a184",
      skyBottom: "#e8d9ba",
      ground: "#8a7a60",
      groundY: 120,
      buildings: [
        { x: -10, w: 200, h: 320, color: "#756654" },
        { x: 620, w: 200, h: 300, color: "#6d5f4d" },
      ],
      extras: [EXTRAS.shop(190, 420), treeSVG(90, 585, 0.7)],
      tint: "#7a5a2e",
    },
  },
  {
    id: "demo-6",
    title: "Mamak'ta kar yağışı",
    district: "Mamak",
    neighborhood: "Köstencel",
    year: "1985",
    story:
      "Sabah kalkınca sokak kaybolmuştu; herkes aynı hizada kar küremeye çıkmıştı. Okul tatil, çay demli, pencerede buğulu camlar.",
    scene: {
      skyTop: "#9aa3ab",
      skyBottom: "#dfe2e0",
      ground: "#e9e7de",
      groundY: 140,
      buildings: [
        { x: 30, w: 210, h: 300, color: "#6e6a62" },
        { x: 280, w: 170, h: 250, color: "#7b766c" },
        { x: 480, w: 190, h: 330, color: "#65615a" },
        { x: 700, w: 110, h: 240, color: "#76716a" },
      ],
      extras: [EXTRAS.snow(), treeSVG(250, 585, 1, "#4c5347"), treeSVG(470, 585, 0.9, "#4c5347")],
      tint: "#5a6470",
      tintOpacity: 0.12,
      vignette: 0.45,
    },
  },
].map((m) => ({
  id: m.id,
  title: m.title,
  district: m.district,
  neighborhood: m.neighborhood,
  year: m.year,
  story: m.story,
  image: svgToDataURI(buildScene(m.scene)),
  createdAt: "2026-01-01T00:00:00Z",
  demo: true,
}));
