// ---------- Tempo animation library: shared kit ----------
// Loads AFTER _base.js (the app's own kit: whole, piece, knife, fist, board,
// pot, panSide, bowlSide, flames, steam, sizzle, FOODS, LIQUIDS...).
// Every scene here is wordless: it shows the step, it never explains it.
// Canvas: 360 x 250. The counter line sits at y = 216.

// ---------- Registry ----------
// LIB.add({ cat, name, foods, steps, dur, draw(t, F, key) })
//   foods: list of food keys this scene is honest for, or null for a scene
//          with no food. Each food makes one animation, named "name:food".
//   steps: real recipe wordings this picture is for (from Tempo's corpus or
//          common recipes). Used later to write the Cues rules.
const LIB = {
  scenes: [],
  entries: [],
  add(def) {
    if (!def.cat || !def.name || !def.draw) throw new Error("LIB.add needs cat, name, draw: " + def.name);
    if (this.scenes.some(s => s.name === def.name)) throw new Error("duplicate scene name: " + def.name);
    if (typeof ACTIONS !== "undefined" && ACTIONS[def.name]) throw new Error("name already used by anim.html ACTIONS: " + def.name);
    def.dur = def.dur || 2.4;
    def.steps = def.steps || [];
    this.scenes.push(def);
    const foods = def.foods && def.foods.length ? def.foods : [null];
    for (const key of foods) {
      if (key && !foodFor(key)) throw new Error(`unknown food "${key}" in ${def.name}`);
      this.entries.push({ id: key ? `${def.name}:${key}` : def.name, scene: def, key });
    }
  },
  food(name, def) {
    if (FOODS[name]) throw new Error("food already exists: " + name);
    FOODS[name] = def;
  },
  liquid(name, color) {
    if (LIQUIDS[name]) throw new Error("liquid already exists: " + name);
    LIQUIDS[name] = color;
  },
  get(id) { return this.entries.find(e => e.id === id); },
};
// A food key -> the F object scenes draw with. Liquids become a pourable F.
function foodFor(key) {
  if (!key) return FOODS.food;
  if (FOODS[key]) return FOODS[key];
  if (LIQUIDS[key]) return { ...FOODS.food, type: "round", fill: LIQUIDS[key], inner: LIQUIDS[key], liquid: LIQUIDS[key] };
  return null;
}

// ---------- Timing helpers ----------
const wave = (t, dur, k = 1) => Math.sin(t / dur * Math.PI * 2 * k);          // -1..1, loops cleanly
const swing = (t, dur) => (Math.sin(t / dur * Math.PI * 2 - Math.PI / 2) + 1) / 2; // 0..1..0 once per loop
const phase = (t, dur, a, b) => ease(seg(t % dur, a, b));                          // eased 0..1 between a..b seconds
const pick = (arr, i) => arr[((i % arr.length) + arr.length) % arr.length];
const g = (inner, x = 0, y = 0, s = 1, r = 0) => `<g ${at(x, y, s, r)}>${inner}</g>`;
const COUNTER = 216;
const counter = () => `<path d="M10 ${COUNTER} L350 ${COUNTER}" ${st(3)} opacity=".35"/>`;

// ---------- Colors ----------
const C = {
  steel: "#D9DEE2", steelDark: "#9AA4AC", pan: "#4A4A4A", panIn: "#5C5C5C", wood: "#C9874A", woodDark: "#8B5A2B",
  handle: "#3B2A1E", water: "#BFE0F7", ice: "#EAF6FF", foil: "#E3E7EA", parchment: "#F6EBD3", towel: "#F7F2E6",
  glove: "#fff", flame: "#7FB4F0", hot: "#F0643C", green: "#8FD18A", yellow: "#F7C94B", pink: "#F49AC1", blue: "#7FB4F0",
  bowl: "#E4E0D6", plate: "#fff", oil: "#F2C84B", golden: "#D99A5B", brown: "#8A5A2B",
};

// ---------- Vessels (side views unless named "Top") ----------
const V = {
  board: () => board(),
  // Board seen from above with room for food: same as board().
  bowl: (inner = "") => bowlSide("#fff", inner),
  // What's inside a side-view bowl: a filled surface at level y (130 = full, 190 = low).
  // Clipped to the bowl's own curve, so low levels never poke outside the wall.
  bowlFill: (color, y = 150) => `<clipPath id="libBowlIn"><path d="M60 120 C64 214 296 214 300 120 Z"/></clipPath><g clip-path="url(#libBowlIn)"><rect x="40" y="${y}" width="280" height="110" fill="${color}"/><path d="M40 ${y} L320 ${y}" ${st(2.5)}/></g>`,
  smallBowl: (x, y, s = 0.5, inner = "") => g(`<path d="M-70 0 C-66 70 66 70 70 0 Z" fill="${C.bowl}" ${st(5)}/>${inner}<path d="M-78 0 L78 0" ${st(6)}/>`, x, y, s),
  pot: (inner = "") => pot(inner),
  // Liquid inside the pot from level y down to the bottom.
  potFill: (color, y = 136, op = 0.9) => `<path d="M${lerp(60, 70, (y - 112) / 92)} ${y} L${lerp(300, 290, (y - 112) / 92)} ${y} L288 202 L72 202 Z" fill="${color}" opacity="${op}"/><path d="M${lerp(60, 70, (y - 112) / 92)} ${y} L${lerp(300, 290, (y - 112) / 92)} ${y}" ${st(3)}/>`,
  saucepan: (inner = "") => `<path d="M90 130 L250 130 L244 204 L96 204 Z" fill="#fff" ${st()}/><path d="M82 130 L258 130" ${st(5)}/>${inner}
    <path d="M258 138 L344 120" ${st(10)}/><path d="M258 138 L344 120" stroke="${C.handle}" stroke-width="6" stroke-linecap="round"/>`,
  saucepanFill: (color, y = 150) => `<path d="M${lerp(90, 96, (y - 130) / 74)} ${y} L${lerp(250, 244, (y - 130) / 74)} ${y} L242 202 L98 202 Z" fill="${color}" opacity=".92"/><path d="M${lerp(90, 96, (y - 130) / 74)} ${y} L${lerp(250, 244, (y - 130) / 74)} ${y}" ${st(3)}/>`,
  pan: (inner = "") => panSide(inner),
  // Wok: deep curved bowl with a long handle.
  wok: (inner = "") => `<path d="M60 136 C70 214 290 214 300 136 Z" fill="${C.pan}" ${st()}/>${inner}<path d="M300 144 L354 128" ${st(9)}/><path d="M300 144 L354 128" stroke="${C.handle}" stroke-width="5" stroke-linecap="round"/><path d="M52 136 L308 136" ${st(4)}/>`,
  // Skillet seen from straight above (for arranging, flipping many pieces).
  panTop: (cx = 170, cy = 128, r = 96) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.pan}" ${st()}/><circle cx="${cx}" cy="${cy}" r="${r - 14}" fill="${C.panIn}"/>
    <path d="M${cx + r} ${cy} L${cx + r + 70} ${cy}" ${st(12)}/><path d="M${cx + r} ${cy} L${cx + r + 70} ${cy}" stroke="${C.handle}" stroke-width="7" stroke-linecap="round"/>`,
  sheet: (y = 176) => sheetPan(y),
  // Sheet pan from above: a big rimmed tray.
  sheetTop: () => `<rect x="34" y="40" width="292" height="180" rx="12" fill="${C.steelDark}" ${st()}/><rect x="46" y="52" width="268" height="156" rx="8" fill="#B9C0C6"/>`,
  dish: (inner = "") => dish(inner),
  // Baking dish from above (9x13): for layering, topping, cutting into squares.
  dishTop: (inner = "") => `<rect x="48" y="48" width="264" height="168" rx="16" fill="#fff" ${st()}/><rect x="62" y="62" width="236" height="140" rx="8" fill="#F1EDE4"/>${inner}`,
  loafTin: (inner = "") => `<path d="M90 120 L270 120 L258 206 L102 206 Z" fill="${C.steelDark}" ${st()}/>${inner}<path d="M84 120 L276 120" ${st(5)}/>`,
  muffinTin: () => `<rect x="40" y="170" width="280" height="34" rx="8" fill="${C.steelDark}" ${st()}/>` +
    [70, 125, 180, 235, 290].map(x => `<path d="M${x - 22} 170 L${x + 22} 170 L${x + 16} 196 L${x - 16} 196 Z" fill="#7C858C" ${st(2.5)}/>`).join(""),
  muffinCups: [70, 125, 180, 235, 290],
  roundTin: (inner = "") => `<path d="M80 140 L280 140 L276 200 C276 208 84 208 84 200 Z" fill="${C.steelDark}" ${st()}/>${inner}<ellipse cx="180" cy="140" rx="100" ry="10" fill="none" ${st(4)}/>`,
  piePlate: (inner = "") => `<path d="M60 150 L300 150 L276 200 L84 200 Z" fill="#F4E3C8" ${st()}/>${inner}<path d="M50 150 L310 150" ${st(5)}/>`,
  colander: (x = 180, y = 130, s = 1, inner = "") => g(`<path d="M-80 -20 C-76 50 76 50 80 -20 Z" fill="${C.steelDark}" ${st(3.5)}/>${inner}
    ${[-50, -25, 0, 25, 50].map(dx => `<circle cx="${dx}" cy="${10 + Math.abs(dx) * -0.1}" r="3.5" fill="#5C6670"/>`).join("")}
    ${[-38, -12, 12, 38].map(dx => `<circle cx="${dx}" cy="26" r="3.5" fill="#5C6670"/>`).join("")}
    <path d="M-88 -20 L88 -20" ${st(4)}/><path d="M-88 -20 C-100 -20 -100 -8 -86 -8 M88 -20 C100 -20 100 -8 86 -8" fill="none" ${st(3.5)}/>`, x, y, s),
  sieve: (x = 180, y = 100, s = 1) => g(`<path d="M-50 0 C-48 40 48 40 50 0 Z" fill="#E3E7EA" ${st(3)}/><path d="M-40 6 L40 6 M-36 16 L36 16 M-28 26 L28 26 M-20 0 L-16 34 M0 0 L0 38 M20 0 L16 34" stroke="${C.steelDark}" stroke-width="1.6"/>
    <path d="M-54 0 L54 0" ${st(4)}/><path d="M54 0 L110 -6" ${st(7)}/>`, x, y, s),
  plate: (x = 180, y = 180, s = 1.4) => plate(x, y, s),
  // Shallow serving bowl (soup, rice, salad), side view.
  servingBowl: (x = 180, y = 160, s = 1, fillColor = null) => g(`<path d="M-80 0 C-74 54 74 54 80 0 Z" fill="#fff" ${st()}/>${fillColor ? `<ellipse cx="0" cy="0" rx="76" ry="10" fill="${fillColor}" ${st(2.5)}/>` : ""}<path d="M-86 0 L86 0" ${st(4)}/>`, x, y, s),
  rack: (y = 190) => `<path d="M50 ${y} L310 ${y} M50 ${y} L46 ${y + 24} M310 ${y} L314 ${y + 24}" ${st(4)}/>` + [...Array(13)].map((_, i) => `<path d="M${60 + i * 20} ${y - 4} L${60 + i * 20} ${y + 4}" ${st(2.4)}/>`).join("") + `<path d="M50 ${y - 4} L310 ${y - 4}" ${st(3)}/>`,
  // Oven front. open: 0 closed .. 1 door fully down. Returns svg; the inside spans x 96-264, y 98-202.
  oven: (open = 0, glow = 0.6) => {
    let s = `<rect x="70" y="20" width="220" height="210" rx="16" fill="#fff" ${st()}/><rect x="70" y="20" width="220" height="40" rx="16" fill="#E0DCD1" ${st()}/>
      <circle cx="110" cy="40" r="11" fill="#fff" ${st(3)}/><circle cx="250" cy="40" r="11" fill="#fff" ${st(3)}/>
      <rect x="92" y="76" width="176" height="136" rx="10" fill="${mixColor("#5A5048", "#F7A84B", glow)}" ${st()}/>
      <path d="M104 150 L256 150" stroke="#2A2420" stroke-width="3"/>`;
    if (open < 0.98) {
      const h = 136 * (1 - open);
      s += `<rect x="88" y="${212 - h}" width="184" height="${h}" rx="10" fill="#fff" ${st()}/>${h > 50 ? `<rect x="106" y="${212 - h + 18}" width="148" height="${h - 44}" rx="8" fill="${mixColor("#3A3530", "#F7C94B", glow * 0.7)}" opacity=".8" ${st(3)}/><path d="M118 ${212 - h + 10} L242 ${212 - h + 10}" ${st(5)}/>` : ""}`;
    } else s += `<path d="M88 212 L272 212 L292 236 L68 236 Z" fill="#fff" ${st()}/>`;
    return s;
  },
  fridge: (open = 0) => `<rect x="110" y="10" width="140" height="210" rx="12" fill="#EAF3FB" ${st()}/><path d="M110 80 L250 80" ${st(3)}/>
    <rect x="118" y="88" width="124" height="124" rx="6" fill="#DDEFFC" opacity="${open}"/>${[120, 160].map(y => `<path d="M118 ${y} L242 ${y}" stroke="#9FC7E8" stroke-width="3" opacity="${open}"/>`).join("")}
    <path d="M236 30 L236 64 M236 96 L236 140" ${st(5)} opacity="${1 - open}"/>
    ${open > 0 ? `<path d="M110 80 L${lerp(110, 46, open)} ${lerp(80, 70, open)} L${lerp(110, 46, open)} ${lerp(220, 230, open)} L110 220 Z" fill="#EAF3FB" ${st()}/>` : `<rect x="110" y="80" width="140" height="140" rx="10" fill="#EAF3FB" ${st()}/><path d="M236 96 L236 140" ${st(5)}/>`}`,
  slowCooker: (lid = 1, inner = "") => `<path d="M70 110 C66 210 294 210 290 110 Z" fill="#6B6B6B" ${st()}/><path d="M86 112 L274 112 L270 128 L90 128 Z" fill="#fff" ${st(3)}/>${inner}
    <path d="M60 140 L40 140 M300 140 L320 140" ${st(8)}/><rect x="150" y="168" width="60" height="22" rx="6" fill="#fff" ${st(3)}/><circle cx="196" cy="179" r="4" fill="${C.hot}"/>
    ${lid ? `<g transform="translate(0 ${(1 - lid) * -60})"><path d="M80 112 C90 70 270 70 280 112 Z" fill="#DDEFFC" opacity=".85" ${st()}/><rect x="166" y="64" width="28" height="14" rx="5" fill="#3B3B3B" ${st(3)}/></g>` : ""}`,
  airFryer: (drawer = 0, inner = "") => `<rect x="90" y="30" width="180" height="190" rx="36" fill="#3B3B3B" ${st()}/><rect x="120" y="44" width="120" height="30" rx="8" fill="#1E1E1E" ${st(2.5)}/>
    <g transform="translate(${drawer * -60} 0)"><path d="M100 110 L260 110 L256 206 L104 206 Z" fill="#555" ${st()}/>${inner}<rect x="150" y="138" width="60" height="16" rx="8" fill="#222" ${st(3)}/></g>`,
  grill: (inner = "") => `<rect x="40" y="150" width="280" height="40" rx="10" fill="#3B3B3B" ${st()}/>${inner}` +
    [...Array(11)].map((_, i) => `<path d="M${56 + i * 25} 146 L${56 + i * 25} 156" stroke="#1E1E1E" stroke-width="5"/>`).join("") +
    `<path d="M44 150 L316 150" stroke="#1E1E1E" stroke-width="6" stroke-linecap="round"/><path d="M80 190 L70 230 M280 190 L290 230" ${st(5)}/>`,
  blender: (inner = "") => `<path d="M120 30 L240 30 L222 160 L138 160 Z" fill="#EAF3FB" ${st()}/>${inner}<path d="M120 30 L240 30" ${st(5)}/><rect x="112" y="18" width="136" height="16" rx="6" fill="#3B3B3B" ${st(3)}/>
    <rect x="120" y="160" width="120" height="56" rx="10" fill="${C.steelDark}" ${st()}/><circle cx="180" cy="188" r="10" fill="#fff" ${st(3)}/>`,
  processor: (inner = "") => `<path d="M110 70 L250 70 L246 170 L114 170 Z" fill="#EAF3FB" ${st()}/>${inner}<rect x="104" y="58" width="152" height="16" rx="6" fill="#DDE7F3" ${st(3)}/><rect x="166" y="24" width="28" height="36" rx="5" fill="#DDE7F3" ${st(3)}/>
    <rect x="100" y="170" width="160" height="46" rx="12" fill="#fff" ${st()}/><circle cx="150" cy="193" r="7" fill="#fff" ${st(2.5)}/><circle cx="210" cy="193" r="7" fill="#fff" ${st(2.5)}/>`,
  standMixer: (beat = 0, inner = "") => `<path d="M230 216 L230 60 C230 30 200 24 160 30 L110 34 C96 36 96 64 110 66 L200 66" fill="#F49AC1" ${st()}/>
    <path d="M110 216 L290 216 L290 200 L110 200 Z" fill="#F49AC1" ${st()}/><path d="M150 66 L150 ${100 + beat * 6}" ${st(6)}/>
    <path d="M100 120 C104 206 220 206 224 120 Z" fill="${C.steel}" ${st()}/>${inner}<path d="M94 120 L230 120" ${st(4)}/>`,
  jar: (x, y, s = 1, fill = "#F7C94B", lid = "#E8613C") => g(`<rect x="-26" y="-30" width="52" height="64" rx="10" fill="${fill}" ${st(3.5)}/><rect x="-24" y="-44" width="48" height="16" rx="4" fill="${lid}" ${st(3)}/>`, x, y, s),
  can: (x, y, s = 1, label = "#E8613C") => g(`<rect x="-28" y="-36" width="56" height="72" rx="6" fill="${C.steel}" ${st(3.5)}/><rect x="-28" y="-20" width="56" height="40" fill="${label}" ${st(2.5)}/><ellipse cx="0" cy="-36" rx="28" ry="6" fill="${C.steel}" ${st(3)}/>`, x, y, s),
  // Zip-top bag, open at the top.
  bag: (inner = "", x = 180, y = 130, s = 1) => g(`<path d="M-70 -70 L70 -70 L74 70 C74 78 -74 78 -74 70 Z" fill="#EAF6FF" opacity=".9" ${st()}/>${inner}<path d="M-70 -58 L70 -58" stroke="${C.blue}" stroke-width="5"/>`, x, y, s),
  sink: (water = 0) => `<path d="M30 150 L330 150 L314 230 L46 230 Z" fill="${C.steel}" ${st()}/><path d="M20 150 L340 150" ${st(5)}/>
    <path d="M270 150 L270 60 C270 40 230 40 230 60 L230 72" fill="none" ${st(9)}/><path d="M270 150 L270 60 C270 40 230 40 230 60 L230 72" fill="none" stroke="${C.steel}" stroke-width="4"/>
    ${water ? `<path d="M230 76 L230 150" stroke="${C.water}" stroke-width="10" stroke-linecap="round" opacity="${water}"/><path d="M227 76 L227 150" stroke="#fff" stroke-width="2" opacity="${water * 0.8}"/>` : ""}`,
  tortilla: (x, y, s = 1, color = "#F1D9A0") => g(`<ellipse rx="90" ry="22" fill="${color}" ${st()}/>${[[-40, -4], [10, 6], [44, -6], [-10, -10]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="4" fill="#D9B06A" opacity=".8"/>`).join("")}`, x, y, s),
};

// ---------- Tools ----------
const T = {
  knife: (x, y, deg = 180, len = 120) => knife(x, y, deg, len),
  hand: () => fist(),
  // Open flat glove from above (pressing, patting, holding food still).
  palm: (x, y, s = 1, r = 0) => g(`<path d="M-26 20 L-26 -14 C-26 -22 -18 -22 -18 -14 L-18 -30 C-18 -38 -9 -38 -9 -30 L-9 -36 C-9 -44 0 -44 0 -36 L0 -32 C0 -40 9 -40 9 -32 L9 -8 L16 -18 C21 -25 30 -20 26 -12 L12 18 C8 28 -22 30 -26 20 Z" fill="${C.glove}" ${st(3.5)}/>`, x, y, s, r),
  // Pinching fingers (season, sprinkle).
  pinch: (x, y, s = 1, r = 0) => g(`<path d="M-14 -40 C-20 -18 -18 4 -6 14 L8 14 C16 4 18 -18 12 -40 Z" fill="${C.glove}" ${st(3.5)}/><path d="M-6 14 C-6 22 6 22 8 14" fill="#fff" ${st(3)}/><path d="M0 -30 L0 6" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>`, x, y, s, r),
  // Wooden spoon, bowl of the spoon at (x,y), handle up along angle r.
  spoon: (x, y, r = 0, hand = true) => g(`<ellipse rx="11" ry="15" fill="${C.wood}" ${st(3)}/><path d="M0 -13 L0 -110" stroke="${C.woodDark}" stroke-width="8" stroke-linecap="round"/>${hand ? g(fist(), 0, -96) : ""}`, x, y, 1, r),
  metalSpoon: (x, y, r = 0, fill = null) => g(`<ellipse rx="13" ry="9" fill="${C.steel}" ${st(3)}/>${fill ? `<ellipse cx="0" cy="-2" rx="9" ry="5" fill="${fill}"/>` : ""}<path d="M10 -6 L64 -56" ${st(6)}/><path d="M10 -6 L64 -56" stroke="${C.steel}" stroke-width="2.5" stroke-linecap="round"/>`, x, y, 1, r),
  whisk: (x, y, r = 0) => g(`<path d="M0 0 C-22 -30 -12 -60 0 -70 C12 -60 22 -30 0 0 M0 0 C-10 -30 -6 -60 0 -70 C6 -60 10 -30 0 0" fill="none" stroke="${INK}" stroke-width="2.6"/><rect x="-5" y="-120" width="10" height="52" rx="5" fill="${C.handle}" ${st(3)}/>${g(fist(), 0, -104)}`, x, y, 1, r),
  fork: (x, y, r = 0) => g(`<path d="M-9 0 L-9 -24 M-3 0 L-3 -24 M3 0 L3 -24 M9 0 L9 -24" ${st(3)}/><path d="M-11 -24 C-11 -34 11 -34 11 -24 Z" fill="${C.steel}" ${st(3)}/><path d="M0 -32 L0 -100" ${st(7)}/><path d="M0 -32 L0 -100" stroke="${C.steel}" stroke-width="3" stroke-linecap="round"/>`, x, y, 1, r),
  // Tongs: tip at (x,y); open 0 closed .. 1 wide.
  tongs: (x, y, r = 0, open = 0.3) => g(`<path d="M0 0 L${-6 - open * 10} -60 L-4 -120" fill="none" ${st(6)}/><path d="M0 0 L${-6 - open * 10} -60 L-4 -120" fill="none" stroke="${C.steel}" stroke-width="2.5"/>
    <path d="M${8 + open * 14} 0 L${10 + open * 8} -60 L4 -120" fill="none" ${st(6)}/><path d="M${8 + open * 14} 0 L${10 + open * 8} -60 L4 -120" fill="none" stroke="${C.steel}" stroke-width="2.5"/>${g(fist(), 0, -110)}`, x, y, 1, r),
  spatula: (x, y, r = -24) => spatula(x, y, r),
  // Flexible rubber scraper.
  scraper: (x, y, r = 0) => g(`<path d="M-16 0 C-18 -26 18 -26 16 0 C10 6 -10 6 -16 0 Z" fill="${C.pink}" ${st(3)}/><path d="M0 -20 L0 -100" ${st(6)}/>${g(fist(), 0, -90)}`, x, y, 1, r),
  ladle: (x, y, r = 0, fill = null) => g(`<path d="M-22 0 C-22 26 22 26 22 0 Z" fill="${C.steelDark}" ${st(3)}/>${fill ? `<path d="M-18 4 L18 4" stroke="${fill}" stroke-width="7"/>` : ""}<path d="M20 -2 C40 -40 40 -70 30 -92" fill="none" ${st(6)}/>`, x, y, 1, r),
  peeler: (x, y, r = 0) => g(`<path d="M-12 -20 L12 -20 L12 -40 L-12 -40 Z" fill="none" ${st(3.5)}/><path d="M-10 -26 L10 -26" stroke="${C.steelDark}" stroke-width="3"/><rect x="-7" y="-100" width="14" height="60" rx="6" fill="#3E8E41" ${st(3)}/>${g(fist(), 0, -78)}`, x, y, 1, r),
  // Box grater standing on the board.
  grater: (x = 180, y = 120, s = 1) => g(`<path d="M-34 -60 L34 -60 L44 70 L-44 70 Z" fill="${C.steel}" ${st()}/>${[...Array(6)].map((_, i) => [...Array(4)].map((_, j) => `<path d="M${-24 + j * 16} ${-40 + i * 18} l6 -4" ${st(2.2)}/>`).join("")).join("")}
    <path d="M-16 -60 C-16 -84 16 -84 16 -60" fill="none" ${st(5)}/>`, x, y, s),
  masher: (x, y, r = 0) => g(`<path d="M-30 0 L30 0 M-30 0 L-20 -10 L-10 0 L0 -10 L10 0 L20 -10 L30 0" fill="none" ${st(4)}/><path d="M-26 0 L-6 -50 M26 0 L6 -50" ${st(4)}/><rect x="-7" y="-110" width="14" height="62" rx="6" fill="${C.wood}" ${st(3)}/>${g(fist(), 0, -96)}`, x, y, 1, r),
  rollingPin: (x, y, r = 0) => g(`<rect x="-80" y="-14" width="160" height="28" rx="12" fill="#E8C49A" ${st(3.5)}/><rect x="-116" y="-7" width="38" height="14" rx="6" fill="#C9874A" ${st(3)}/><rect x="78" y="-7" width="38" height="14" rx="6" fill="#C9874A" ${st(3)}/>
    ${g(fist(), -98, -18, 0.8)}${g(fist(), 98, -18, 0.8)}`, x, y, 1, r),
  brush: (x, y, r = -30, tipColor = "#F7E7A8") => g(`<rect x="-12" y="-14" width="24" height="22" rx="3" fill="${tipColor}" ${st(3)}/><rect x="-6" y="-80" width="12" height="68" rx="5" fill="#C98A4B" ${st(3)}/>`, x, y, 1, r),
  thermometer: (x, y, r = 0, reading = 1) => g(`<path d="M0 0 L0 -70" ${st(4)}/><path d="M0 0 L0 -70" stroke="${C.steel}" stroke-width="1.5"/><rect x="-24" y="-110" width="48" height="40" rx="8" fill="#fff" ${st(3.5)}/>
    <rect x="-16" y="-102" width="32" height="18" rx="3" fill="#DDF2DA" ${st(2)}/><rect x="-12" y="-97" width="${24 * clamp(reading)}" height="8" rx="2" fill="${reading >= 1 ? "#3E8E41" : C.hot}"/>`, x, y, 1, r),
  timer: (x, y, p = 0, s = 1) => g(`<circle r="26" fill="#fff" ${st(3.5)}/><path d="M-6 -34 L6 -34 M0 -34 L0 -27" ${st(4)}/><path d="M0 0 L0 -18" ${st(4)} transform="rotate(${p * 360})"/><circle r="3" fill="${INK}"/>`, x, y, s),
  lid: (x, y, r = 0, w = 120) => g(`<path d="M${-w} 0 C${-w + 20} -44 ${w - 20} -44 ${w} 0 Z" fill="${C.steel}" ${st()}/><rect x="-16" y="-48" width="32" height="14" rx="6" fill="${C.handle}" ${st(3)}/>`, x, y, 1, r),
  mitt: (x, y, r = 0, s = 1) => g(`<path d="M-20 30 L-24 -16 C-24 -40 18 -40 20 -16 L22 0 L34 -10 C42 -16 50 -6 42 2 L22 24 L20 30 Z" fill="${C.hot}" ${st(3.5)}/><path d="M-22 18 L20 18" stroke="#fff" stroke-width="4"/>`, x, y, s, r),
  toothpick: (x, y, r = 0, crumbs = null) => g(`<path d="M0 0 L0 -70" stroke="#E8C49A" stroke-width="5" stroke-linecap="round"/><path d="M0 0 L0 -70" ${st(1.4)} fill="none" opacity=".6"/>${crumbs ? `<path d="M-3 -8 L-3 -26 M3 -12 L3 -22" stroke="${crumbs}" stroke-width="5" stroke-linecap="round"/>` : ""}`, x, y, 1, r),
  scoop: (x, y, fill = "#D9A55B", r = 0) => g(`<path d="M-16 0 C-16 18 16 18 16 0 Z" fill="${C.steel}" ${st(3)}/><circle cx="0" cy="4" r="11" fill="${fill}"/><path d="M0 0 L0 -50" ${st(6)}/>${g(fist(), 0, -46)}`, x, y, 1, r),
  pipingBag: (x, y, r = 0, fill = "#fff") => g(`<path d="M-30 -70 L30 -70 L6 -6 L-6 -6 Z" fill="${fill}" ${st(3.5)}/><path d="M-6 -6 L6 -6 L3 6 L-3 6 Z" fill="${C.steel}" ${st(2.5)}/>${g(fist(), 0, -66)}`, x, y, 1, r),
  handMixer: (x, y, r = 0, spin = 0) => g(`${[-10, 10].map(dx => `<path d="M${dx} 0 C${dx - 10} -20 ${dx + 10} -20 ${dx} -40" fill="none" ${st(2.6)} transform="rotate(${spin * 40} ${dx} -20)"/><path d="M${dx} -40 L${dx} -56" ${st(3)}/>`).join("")}
    <path d="M-40 -56 L40 -56 C50 -56 50 -90 30 -90 L-30 -90 C-50 -90 -50 -56 -40 -56 Z" fill="#fff" ${st(3.5)}/><path d="M-20 -90 C-20 -110 20 -110 20 -90" fill="none" ${st(5)}/>`, x, y, 1, r),
  measuringCup: (x, y, r = 0, fill = null, level = 0.7) => g(`<path d="M-26 -30 L26 -30 L22 30 L-22 30 Z" fill="#fff" ${st(3.5)}/>${fill ? `<path d="M${-26 + 4 * (1 - level)} ${30 - 60 * level} L${26 - 4 * (1 - level)} ${30 - 60 * level} L22 30 L-22 30 Z" fill="${fill}"/>` : ""}
    <path d="M-26 -30 L26 -30 L22 30 L-22 30 Z" fill="none" ${st(3.5)}/><path d="M16 -14 L22 -14 M16 0 L22 0 M16 14 L22 14" ${st(2)}/><path d="M26 -20 C42 -20 42 12 24 12" fill="none" ${st(3.5)}/>`, x, y, 1, r),
  measuringSpoon: (x, y, r = 0, fill = null) => g(`<ellipse rx="16" ry="9" fill="${fill || C.steel}" ${st(3)}/><path d="M14 -4 L70 -20" ${st(6)}/><path d="M14 -4 L70 -20" stroke="${C.steel}" stroke-width="2.5" stroke-linecap="round"/>`, x, y, 1, r),
  bottle: (x, y, r = 0, fill = C.oil) => g(`<path d="M-14 -40 L14 -40 L16 30 C16 38 -16 38 -16 30 Z" fill="${fill}" ${st(3)}/><rect x="-6" y="-56" width="12" height="16" rx="3" fill="#3E8E41" ${st(2.6)}/>`, x, y, 1, r),
  shaker: (x, y, r = 0, fill = "#fff") => g(`<path d="M-18 -26 L18 -26 L21 34 L-21 34 Z" fill="${fill}" ${st(3.5)}/><path d="M-18 -26 C-18 -44 18 -44 18 -26" fill="${C.steel}" ${st(3)}/>
    <circle cx="-6" cy="-34" r="2.2" fill="${INK}"/><circle cx="6" cy="-34" r="2.2" fill="${INK}"/><circle cx="0" cy="-29" r="2.2" fill="${INK}"/>`, x, y, 1, r),
  grinder: (x, y, r = 0, twist = 0) => g(`<rect x="-14" y="-30" width="28" height="60" rx="8" fill="#3B2A1E" ${st(3.5)}/><path d="M-16 -30 C-16 -50 16 -50 16 -30 Z" fill="#5A3A26" ${st(3)} transform="rotate(${twist * 20} 0 -36)"/><circle cx="0" cy="-48" r="5" fill="#5A3A26" ${st(2.5)}/>`, x, y, 1, r),
  skewer: (x1, y1, x2, y2) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="#E8C49A" stroke-width="5" stroke-linecap="round"/><path d="M${x1} ${y1} L${x2} ${y2}" ${st(1.4)} opacity=".6"/>`,
  cutter: (x, y, s = 1) => g(`<circle r="30" fill="none" ${st(5)}/><circle r="30" fill="none" stroke="${C.steel}" stroke-width="2"/>`, x, y, s),
  pastryCutter: (x, y, r = 0) => g(`${[-16, -8, 0, 8, 16].map(dx => `<path d="M${dx} 0 C${dx * 1.6} -24 ${dx * 1.2} -40 ${dx * 0.4} -50" fill="none" ${st(2.6)}/>`).join("")}<rect x="-30" y="-64" width="60" height="16" rx="7" fill="#E8613C" ${st(3)}/>`, x, y, 1, r),
  towel: (x, y, s = 1, r = 0) => g(`<path d="M-60 -24 C-30 -32 30 -16 60 -24 L64 24 C30 32 -30 16 -64 24 Z" fill="${C.towel}" ${st(3.5)}/><path d="M-50 -10 C-20 -16 20 -4 50 -10 M-52 8 C-22 2 18 14 52 8" stroke="${C.blue}" stroke-width="3" fill="none" opacity=".6"/>`, x, y, s, r),
  foil: (x, y, w = 220, h = 40) => `<path d="M${x - w / 2} ${y} L${x + w / 2} ${y - 4} L${x + w / 2 + 6} ${y + h} L${x - w / 2 - 6} ${y + h + 4} Z" fill="${C.foil}" ${st(3)} opacity=".96"/>` +
    [0.2, 0.45, 0.7].map(f => `<path d="M${x - w / 2 + w * f} ${y + 6} l18 ${h * 0.5}" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".9"/>`).join(""),
  wrap: (x, y, w = 220, h = 30) => `<path d="M${x - w / 2} ${y} C${x - w / 4} ${y - 8} ${x + w / 4} ${y + 6} ${x + w / 2} ${y} L${x + w / 2} ${y + h} L${x - w / 2} ${y + h} Z" fill="#EAF6FF" opacity=".55" ${st(2.5)}/>` +
    `<path d="M${x - w / 3} ${y + 8} l24 4 M${x + w / 6} ${y + 6} l20 6" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`,
  paperTowel: (x, y, w = 140) => `<path d="M${x - w / 2} ${y} L${x + w / 2} ${y} L${x + w / 2 + 4} ${y + 14} L${x - w / 2 - 4} ${y + 14} Z" fill="#fff" ${st(3)}/>` + [...Array(5)].map((_, i) => `<circle cx="${x - w / 2 + 14 + i * (w - 28) / 4}" cy="${y + 7}" r="2" fill="#DDE7F3"/>`).join(""),
  spider: (x, y, r = 0) => g(`<circle r="26" fill="none" ${st(3)}/><path d="M-26 0 L26 0 M0 -26 L0 26 M-18 -18 L18 18 M-18 18 L18 -18" stroke="${INK}" stroke-width="1.6"/><path d="M20 -18 L90 -80" ${st(6)}/>`, x, y, 1, r),
  // A little "done" check and "not yet" cross stickers, no words.
  check: (x, y, k = 1) => g(`<circle r="22" fill="${C.green}" ${st(3.5)}/><path d="M-9 0 L-3 7 L10 -7" fill="none" ${st(4.5)}/>`, x, y, k),
  cross: (x, y, k = 1) => g(`<circle r="22" fill="${C.hot}" ${st(3.5)}/><path d="M-8 -8 L8 8 M8 -8 L-8 8" ${st(4.5)} stroke="#fff"/>`, x, y, k),
};

// ---------- Motion bits ----------
const FX = {
  steam, sizzle, flames, burner,
  // Bubbles rising between x0..x1 from yBot to yTop.
  bubbles: (t, x0, x1, yBot, yTop, n = 8, big = 1, speed = 0.8) => [...Array(n)].map((_, i) => {
    const q = (t * speed + i / n) % 1, x = x0 + ((i * 53) % Math.max(1, x1 - x0));
    return `<circle cx="${x}" cy="${lerp(yBot, yTop, q)}" r="${(2 + q * 4) * big}" fill="#fff" ${st(1.8)} opacity="${1 - q * 0.4}"/>`;
  }).join(""),
  // A falling stream of liquid from (x1,y1) to (x2,y2).
  stream: (x1, y1, x2, y2, color, w = 7) => `<path d="M${x1} ${y1} C${x1} ${(y1 + y2) / 2} ${x2} ${(y1 + y2) / 2} ${x2} ${y2}" fill="none" stroke="${INK}" stroke-width="${w + 5}" stroke-linecap="round"/><path d="M${x1} ${y1} C${x1} ${(y1 + y2) / 2} ${x2} ${(y1 + y2) / 2} ${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`,
  // Water drops falling.
  drips: (t, xs, y0, y1, color = C.blue, speed = 1) => xs.map((x, i) => { const q = (t * speed + i / xs.length) % 1; return `<path d="M${x} ${lerp(y0, y1, q)} l0 8" stroke="${color}" stroke-width="5" stroke-linecap="round" opacity="${1 - q}"/>`; }).join(""),
  // Bits falling (salt, cheese, herbs) from around x,y0 to y1.
  fall: (t, dur, n, x, spread, y0, y1, drawBit) => [...Array(n)].map((_, i) => { const q = (t / dur + i / n) % 1; return drawBit(x - spread / 2 + ((i * 37) % 100) / 100 * spread + Math.sin(q * 6 + i) * 4, lerp(y0, y1, q), i, q); }).join(""),
  // Cold lines (fridge/freezer).
  cold: (x, y, k = 1) => g(`<path d="M0 -18 L0 18 M-15 -9 L15 9 M-15 9 L15 -9" stroke="${C.blue}" stroke-width="4" stroke-linecap="round"/>`, x, y, k),
  // Small motion marks around a point (shake, toss).
  shake: (x, y, k = 1) => `<path d="M${x - 30 * k} ${y - 6} l-10 0 M${x - 30 * k} ${y + 6} l-14 0 M${x + 30 * k} ${y - 6} l10 0 M${x + 30 * k} ${y + 6} l14 0" ${st(3)}/>`,
  // Shine sparkles (shiny, glossy, done).
  sparkle: (t, x, y, k = 1) => g(`<path d="M0 -12 L3 -3 L12 0 L3 3 L0 12 L-3 3 L-12 0 L-3 -3 Z" fill="#fff" ${st(2.4)}/>`, x, y, k * (0.7 + 0.3 * Math.abs(Math.sin(t * 4)))),
  // Smoke (too hot, charring).
  smoke: (t, xs, y0) => xs.map((x, i) => { const p = (t * 0.7 + i / xs.length) % 1; return `<path d="M${x} ${y0 - p * 80} c-10 -10 10 -16 0 -28" fill="none" stroke="#8A8A8A" stroke-width="${6 - p * 3}" stroke-linecap="round" opacity="${0.8 - p * 0.7}"/>`; }).join(""),
};

// ---------- More foods (shared by every category) ----------
// Shapes the app kit doesn't have yet.
const _wholeBeforeLib = whole;
whole = function (F, cooked = 0) {
  const fill = cooked && F.cooked ? mixColor(F.fill, F.cooked, cooked) : F.fill;
  switch (F.type) {
    case "ground": // a pile of ground meat
      return [...Array(16)].map((_, i) => { const a = i * 2.4, r = 6 + (i % 5) * 9; return `<circle cx="${Math.cos(a) * r * 1.5}" cy="${Math.sin(a) * r * 0.55}" r="${11 - (i % 3) * 2}" fill="${fill}" ${st(2.6)}/>`; }).join("") +
        [...Array(6)].map((_, i) => `<path d="M${-30 + i * 12} ${-4 + (i % 2) * 8} q3 -3 6 0" stroke="${F.mark || "#F2D5CF"}" stroke-width="2.4" fill="none"/>`).join("");
    case "bird": // whole chicken, legs up
      return `<path d="M-60 10 C-66 -30 -20 -44 20 -40 C56 -36 70 -6 62 18 C54 40 -50 42 -60 10 Z" fill="${fill}" ${st()}/>
        <path d="M30 -30 C48 -54 70 -50 72 -36 C74 -24 56 -20 44 -18" fill="${fill}" ${st(3.5)}/><circle cx="72" cy="-38" r="7" fill="#fff" ${st(3)}/>
        <path d="M10 -36 C24 -58 44 -58 44 -44" fill="${fill}" ${st(3.5)}/><circle cx="46" cy="-48" r="6" fill="#fff" ${st(3)}/>
        <path d="M-40 -6 C-20 -16 10 -14 30 -4" fill="none" stroke="${shade(fill)}" stroke-width="3"/>`;
    case "drumstick":
      return [[-30, 6, -20], [30, -4, 20]].map(([x, y, r]) => `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M-30 -14 C-44 -4 -40 18 -20 18 L14 6 C20 4 20 -6 14 -8 Z" fill="${fill}" ${st(3.5)}/><path d="M14 -2 L34 -2" ${st(7)}/><path d="M14 -2 L34 -2" stroke="#fff" stroke-width="3"/><circle cx="36" cy="-6" r="5" fill="#fff" ${st(2.5)}/><circle cx="36" cy="3" r="5" fill="#fff" ${st(2.5)}/></g>`).join("");
    case "flat": // tortilla, pancake, pita: a flat disc seen at an angle
      return `<ellipse rx="62" ry="22" fill="${fill}" ${st()}/>${F.spots ? [[-30, -4], [10, 6], [34, -6], [-6, -10]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="4" fill="${shade(fill)}" opacity=".7"/>`).join("") : ""}`;
    case "bun":
      return `<path d="M-58 0 C-58 -42 58 -42 58 0 Z" fill="${fill}" ${st()}/><path d="M-58 8 L58 8 L56 24 C40 30 -40 30 -56 24 Z" fill="${fill}" ${st()}/>
        ${[[-20, -22], [6, -28], [28, -18], [-4, -14]].map(([a, b]) => `<ellipse cx="${a}" cy="${b}" rx="3" ry="1.8" fill="#FBF4DC" ${st(1.2)}/>`).join("")}`;
    case "noodles": // a tangle of cooked noodles
      return [...Array(7)].map((_, i) => `<path d="M${-56 + i * 4} ${-14 + i * 5} C-30 ${-34 + i * 8} 10 ${10 - i * 6} 56 ${-12 + i * 4}" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M${-56 + i * 4} ${-14 + i * 5} C-30 ${-34 + i * 8} 10 ${10 - i * 6} 56 ${-12 + i * 4}" fill="none" stroke="${fill}" stroke-width="4.5" stroke-linecap="round"/>`).join("");
    case "pastry": // a sheet of pastry or rolled dough, slight angle
      return `<path d="M-70 -24 L64 -30 L72 26 L-64 32 Z" fill="${fill}" ${st()}/><path d="M-60 -16 L60 -21" stroke="${shade(fill)}" stroke-width="2" opacity=".5"/>`;
    case "tub": // yogurt, sour cream, mayo, ricotta
      return `<path d="M-38 -30 L38 -30 L32 36 L-32 36 Z" fill="${F.fill}" ${st()}/><ellipse cx="0" cy="-30" rx="38" ry="9" fill="${F.inner}" ${st(3.5)}/><rect x="-24" y="-4" width="48" height="20" rx="4" fill="${F.mark || "#7FB4F0"}" ${st(2.5)}/>`;
    case "jarred": // peanut butter, jam, salsa, pesto, tomato paste
      return `<rect x="-30" y="-30" width="60" height="66" rx="12" fill="${F.fill}" ${st()}/><rect x="-28" y="-46" width="56" height="18" rx="5" fill="${F.mark || "#E8613C"}" ${st(3)}/><rect x="-20" y="-6" width="40" height="22" rx="4" fill="#fff" ${st(2.5)}/>`;
    case "can":
      return `<rect x="-30" y="-38" width="60" height="76" rx="6" fill="${C.steel}" ${st()}/><rect x="-30" y="-20" width="60" height="40" fill="${F.mark || "#E8613C"}" ${st(2.5)}/><ellipse cx="0" cy="-38" rx="30" ry="6" fill="${C.steel}" ${st(3)}/>
        ${[[-12, 0], [8, -6], [12, 8]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="5" fill="${F.fill}" ${st(1.8)}/>`).join("")}`;
    case "grains": // a heap of rice, beans, lentils, peas, berries
      return `<path d="M-60 26 C-50 -16 50 -16 60 26 Z" fill="${F.fill}" ${st(3)}/>` + [...Array(18)].map((_, i) => { const x = -44 + (i * 29) % 88, y = 18 - (i * 13) % 30 * (1 - Math.abs(x) / 70); return F.berry ? `<circle cx="${x}" cy="${y}" r="6" fill="${F.inner}" ${st(1.8)}/>` : `<ellipse cx="${x}" cy="${y}" rx="${F.round ? 4 : 5.5}" ry="${F.round ? 4 : 3}" fill="${F.inner}" ${st(1.4)} transform="rotate(${i * 40} ${x} ${y})"/>`; }).join("");
    case "patty":
      return `<ellipse cx="0" cy="6" rx="56" ry="20" fill="${fill}" ${st()}/><ellipse cx="0" cy="0" rx="56" ry="18" fill="${fill}" ${st()}/>${[[-24, -2], [4, 4], [26, -4], [-8, -8]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="3" fill="${F.mark || shade(fill)}" opacity=".7"/>`).join("")}`;
    case "balls": // meatballs, dough balls, cookie dough balls
      return [[-36, 8], [0, -6], [36, 8], [-18, 22], [18, 22]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="17" fill="${fill}" ${st(3)}/><path d="M${x - 8} ${y - 6} q4 -4 8 -2" stroke="#fff" stroke-width="3" fill="none" opacity=".5"/>`).join("");
    case "ice":
      return [[-26, 4], [4, -10], [30, 8], [-6, 18]].map(([x, y], i) => `<rect x="${x - 14}" y="${y - 14}" width="28" height="28" rx="6" fill="${C.ice}" ${st(3)} transform="rotate(${i * 17} ${x} ${y})"/><path d="M${x - 7} ${y - 6} l6 0" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`).join("");
    case "pineapple":
      return `<ellipse cx="0" cy="10" rx="36" ry="44" fill="${fill}" ${st()}/>${[-20, 0, 20].map(x => `<path d="M${x - 20} -14 L${x + 20} 34 M${x + 20} -14 L${x - 20} 34" stroke="${shade(fill)}" stroke-width="2.5"/>`).join("")}
        <path d="M-14 -32 L-22 -62 L-4 -40 L0 -70 L6 -40 L22 -62 L14 -32 Z" fill="#3E8E41" ${st(3)}/>`;
    case "melon":
      return `<ellipse rx="62" ry="46" fill="${fill}" ${st()}/>${[-30, -10, 10, 30].map(x => `<path d="M${x} -44 C${x * 1.6} -10 ${x * 1.6} 10 ${x} 44" fill="none" stroke="${shade(fill)}" stroke-width="3"/>`).join("")}`;
    case "skewers":
      return [-14, 14].map(y => T.skewer(-76, y, 76, y - 6) + [-48, -18, 12, 42].map((x, i) => `<rect x="${x - 12}" y="${y - 14 - i * 1.5}" width="24" height="24" rx="5" fill="${pick([F.fill, "#E8503C", "#8CC152", F.fill], i)}" ${st(2.6)}/>`).join("")).join("");
  }
  return _wholeBeforeLib(F, cooked);
};
const _pieceBeforeLib = piece;
piece = function (F, kind, x, y, rot = 0, size = 1) {
  const tf = `transform="translate(${x} ${y}) rotate(${rot}) scale(${size})"`;
  if (F.type === "ground") return `<circle ${tf} r="6" fill="${F.fill}" ${st(2)}/>`;
  if (F.type === "grains") return F.berry ? `<circle ${tf} r="6" fill="${F.inner}" ${st(1.8)}/>` : `<ellipse ${tf} rx="${F.round ? 4 : 5}" ry="${F.round ? 4 : 3}" fill="${F.inner}" ${st(1.4)}/>`;
  if (F.type === "noodles") return `<path ${tf} d="M-16 0 C-8 -8 8 8 16 0" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path ${tf} d="M-16 0 C-8 -8 8 8 16 0" fill="none" stroke="${F.fill}" stroke-width="3.6" stroke-linecap="round"/>`;
  if (["flat", "pastry", "bun"].includes(F.type)) return `<path ${tf} d="M-14 8 L-10 -10 L14 -6 L12 10 Z" fill="${F.fill}" ${st(2.4)}/>`;
  if (F.type === "balls") return `<circle ${tf} r="12" fill="${F.fill}" ${st(2.6)}/>`;
  if (F.type === "ice") return `<rect ${tf} x="-9" y="-9" width="18" height="18" rx="4" fill="${C.ice}" ${st(2.4)}/>`;
  if (["tub", "jarred", "can"].includes(F.type)) return `<ellipse ${tf} rx="10" ry="6" fill="${F.inner}" ${st(2)}/>`;
  if (F.type === "bird" || F.type === "drumstick") return _pieceBeforeLib({ ...F, type: "slab" }, kind, x, y, rot, size);
  if (F.type === "pineapple" || F.type === "melon") return _pieceBeforeLib({ ...F, type: "round" }, kind, x, y, rot, size);
  return _pieceBeforeLib(F, kind, x, y, rot, size);
};

Object.assign(FOODS, {
  // Meat, fish, eggs
  groundbeef:   { type: "ground", fill: "#B5473A", inner: "#C9605A", mark: "#F2D5CF", cooked: "#6B3A22" },
  groundturkey: { type: "ground", fill: "#F2C2B0", inner: "#F6D6CA", mark: "#FBEDE6", cooked: "#C98B5E" },
  groundpork:   { type: "ground", fill: "#F2B4A6", inner: "#F6CABE", mark: "#FBEDE6", cooked: "#B8774A" },
  wholechicken: { type: "bird", fill: "#F4D3B8", inner: "#F8DCD4", cooked: "#C98340" },
  turkey:       { type: "bird", fill: "#F2CFB4", inner: "#F8DCD4", cooked: "#B5733A" },
  drumsticks:   { type: "drumstick", fill: "#F4C9C0", inner: "#F8DCD4", cooked: "#C98340" },
  wings:        { type: "drumstick", fill: "#F4C9C0", inner: "#F8DCD4", cooked: "#B5562A" },
  steak:        { type: "slab", fill: "#B5473A", inner: "#E07A72", mark: "#F2D5CF", cooked: "#5A2E1A" },
  porkchop:     { type: "slab", fill: "#F2C2B0", inner: "#F6D6CA", mark: "#FFFFFF", cooked: "#B8774A" },
  lamb:         { type: "slab", fill: "#A8433A", inner: "#C9605A", mark: "#F7E3DD", cooked: "#5A2E1A" },
  scallops:     { type: "balls", fill: "#F7EEDD", inner: "#FBF6EC", cooked: "#D9A05B" },
  meatballs:    { type: "balls", fill: "#B5633E", inner: "#C9805A", cooked: "#6B3A22" },
  patty:        { type: "patty", fill: "#B5473A", inner: "#C9605A", mark: "#F2D5CF", cooked: "#5A2E1A" },
  turkeypatty:  { type: "patty", fill: "#F2C2B0", inner: "#F6D6CA", mark: "#FBEDE6", cooked: "#C98B5E" },
  veggiepatty:  { type: "patty", fill: "#8A9A4A", inner: "#B5C47A", mark: "#E8503C", cooked: "#5E6A2E" },
  // Veg and fruit
  greenbeans:   { type: "long", fill: "#4E9A3A", inner: "#8CC152", small: true, taper: true },
  asparagus:    { type: "long", fill: "#6DA040", inner: "#A6CF7A", small: true, top: "cap" },
  leek:         { type: "long", fill: "#E9F2C7", inner: "#F6F9E4", top: "greens" },
  scallion:     { type: "long", fill: "#6DB04A", inner: "#E9F2C7", small: true, top: "greens" },
  okra:         { type: "long", fill: "#5E9A3A", inner: "#C8E39A", small: true, taper: true },
  plantain:     { type: "long", fill: "#C9B23A", inner: "#F7E2A0", curve: true },
  radish:       { type: "round", fill: "#D9443A", inner: "#FFFFFF", top: "leaf" },
  beet:         { type: "round", fill: "#7A1F4A", inner: "#B5306B", top: "leaf" },
  turnip:       { type: "round", fill: "#E9D6F0", inner: "#FBF8EE", top: "leaf" },
  cabbage:      { type: "round", fill: "#9BCB6A", inner: "#E9F2C7", rings: "#C8E39A" },
  redcabbage:   { type: "round", fill: "#7A3A7A", inner: "#E9CFE0", rings: "#B97BA0" },
  cherrytomato: { type: "grains", fill: "#E8503C", inner: "#E8503C", berry: true },
  peach:        { type: "round", fill: "#F59E6B", inner: "#F8C27A", top: "stem" },
  pear:         { type: "round", fill: "#B5C44A", inner: "#FBF1D4", top: "stem", oval: true },
  mango:        { type: "round", fill: "#F5A93A", inner: "#F8C24A", oval: true },
  kiwi:         { type: "round", fill: "#8A6A3A", inner: "#8CC152", oval: true, seedsLong: true },
  pineapple:    { type: "pineapple", fill: "#E8B23C", inner: "#F7E07A" },
  watermelon:   { type: "melon", fill: "#3E8E41", inner: "#F0545A" },
  cantaloupe:   { type: "melon", fill: "#E0C890", inner: "#F59E6B" },
  grapefruit:   { type: "round", fill: "#F59E7A", inner: "#F07A7A", citrus: true },
  blueberries:  { type: "grains", fill: "#5B6FB5", inner: "#4A5A9C", berry: true },
  raspberries:  { type: "grains", fill: "#E0445A", inner: "#D93A52", berry: true },
  grapes:       { type: "grains", fill: "#8CC152", inner: "#9ACB5A", berry: true },
  peas:         { type: "grains", fill: "#6DB04A", inner: "#7BC250", round: true },
  edamame:      { type: "grains", fill: "#7BBF5A", inner: "#8CC152", round: true },
  olives:       { type: "grains", fill: "#3B3B2A", inner: "#4A4A30", berry: true },
  brusselsprouts: { type: "grains", fill: "#7BBF5A", inner: "#7BBF5A", berry: true },
  spinach:      { type: "leafy", fill: "#3E8E41", inner: "#4E9A3A", big: true },
  kale:         { type: "leafy", fill: "#2F6E3A", inner: "#3E8E41", big: true },
  lettuce:      { type: "leafy", fill: "#9BCB6A", inner: "#C8E39A", big: true },
  basil:        { type: "leafy", fill: "#3E8E41", inner: "#5EA040" },
  cilantro:     { type: "leafy", fill: "#4E9A3A", inner: "#6DB04A" },
  parsley:      { type: "leafy", fill: "#3E8E41", inner: "#4E9A3A" },
  // Grains, beans, starch
  whiterice:    { type: "grains", fill: "#FBF8EE", inner: "#FFFFFF" },
  brownrice:    { type: "grains", fill: "#E8D4A8", inner: "#D9BE8A" },
  quinoa:       { type: "grains", fill: "#F1E3B0", inner: "#F7EDC9", round: true },
  lentils:      { type: "grains", fill: "#C9803A", inner: "#B5733A", round: true },
  blackbeans:   { type: "grains", fill: "#2A2A2A", inner: "#3B3B3B" },
  chickpeas:    { type: "grains", fill: "#E8C47A", inner: "#E8C47A", round: true },
  kidneybeans:  { type: "grains", fill: "#8A2A2A", inner: "#9C3A3A" },
  couscous:     { type: "grains", fill: "#F1D98A", inner: "#F7E2A0", round: true },
  spaghetti:    { type: "long", fill: "#F2D27A", inner: "#F7E2A0", small: true },
  noodles:      { type: "noodles", fill: "#F2D27A", inner: "#F7E2A0" },
  ricenoodles:  { type: "noodles", fill: "#FBF8EE", inner: "#FFFFFF" },
  ramen:        { type: "noodles", fill: "#F7D86A", inner: "#FBE89A" },
  tortilla:     { type: "flat", fill: "#F1D9A0", inner: "#F6E6BE", spots: true },
  cornTortilla: { type: "flat", fill: "#F2C86A", inner: "#F7DC94", spots: true },
  pancake:      { type: "flat", fill: "#E8B46A", inner: "#F6D9A3", cooked: "#C98340" },
  crepe:        { type: "flat", fill: "#F7DCA0", inner: "#FBEBC4", spots: true },
  naan:         { type: "flat", fill: "#F1D49A", inner: "#F7E2B8", spots: true },
  pita:         { type: "flat", fill: "#E8C88A", inner: "#F6E3B8" },
  bun:          { type: "bun", fill: "#D9A55B", inner: "#F6E3B8" },
  bagel:        { type: "flat", fill: "#C98A4B", inner: "#F6E3B8" },
  croutons:     { type: "grains", fill: "#D9A55B", inner: "#E8B46A", round: true },
  breadcrumbs:  { type: "pantry", shape: "bag", fill: "#E8C88A", inner: "#D9A55B", mark: "#B5813A" },
  panko:        { type: "pantry", shape: "bag", fill: "#FBF1D4", inner: "#F1D98A", mark: "#E8A23C" },
  cornstarch:   { type: "pantry", shape: "tin", fill: "#FFFFFF", inner: "#FFFFFF", mark: "#F7C94B" },
  yeast:        { type: "pantry", shape: "tin", fill: "#E8613C", inner: "#E8C88A", mark: "#F7E7A8" },
  cinnamon:     { type: "pantry", shape: "shaker", fill: "#B5633E", inner: "#B5633E", mark: "#8A3A22" },
  paprika:      { type: "pantry", shape: "shaker", fill: "#D9443A", inner: "#D9443A", mark: "#8A2A2A" },
  cumin:        { type: "pantry", shape: "shaker", fill: "#C9A26B", inner: "#B58A4A", mark: "#8A6A3A" },
  pepperground: { type: "pantry", shape: "shaker", fill: "#4A4A4A", inner: "#3B3B3B", mark: "#9AA4AC" },
  spices:       { type: "pantry", shape: "shaker", fill: "#E8A23C", inner: "#D9843A", mark: "#B5633E" },
  pastry:       { type: "pastry", fill: "#F4DFB0", inner: "#F8EAC8" },
  piecrust:     { type: "pastry", fill: "#F1D49A", inner: "#F7E2B8" },
  pizzadough:   { type: "blob", fill: "#F6E6C2", inner: "#FBF1D9" },
  breaddough:   { type: "blob", fill: "#F1DDB0", inner: "#F8EAC8" },
  cookiedough:  { type: "balls", fill: "#D9A55B", inner: "#F0C88A" },
  // Dairy and jars
  yogurt:       { type: "tub", fill: "#FFFFFF", inner: "#FFFFFF", mark: "#7FB4F0" },
  sourcream:    { type: "tub", fill: "#FFFFFF", inner: "#FFFFFF", mark: "#8FD18A" },
  ricotta:      { type: "tub", fill: "#FFFFFF", inner: "#FBF8EE", mark: "#F49AC1" },
  mayo:         { type: "jarred", fill: "#FFF6E3", inner: "#FFF6E3", mark: "#7FB4F0" },
  peanutbutter: { type: "jarred", fill: "#C9874A", inner: "#C9874A", mark: "#E8613C" },
  jam:          { type: "jarred", fill: "#B5304A", inner: "#B5304A", mark: "#F7E7A8" },
  salsa:        { type: "jarred", fill: "#E8503C", inner: "#E8503C", mark: "#8CC152" },
  pesto:        { type: "jarred", fill: "#5E9A3A", inner: "#5E9A3A", mark: "#F7E7A8" },
  tomatopaste:  { type: "can", fill: "#C8302A", inner: "#C8302A", mark: "#E8503C" },
  cannedtomatoes: { type: "can", fill: "#E8503C", inner: "#E8503C", mark: "#E8503C" },
  cannedbeans:  { type: "can", fill: "#2A2A2A", inner: "#3B3B3B", mark: "#F7C94B" },
  coconutmilk:  { type: "can", fill: "#FFFFFF", inner: "#FFFFFF", mark: "#5E9A3A" },
  mozzarella:   { type: "balls", fill: "#FFFFFF", inner: "#FBF8EE" },
  feta:         { type: "block", fill: "#FBF8EE", inner: "#FFFFFF" },
  creamcheese:  { type: "block", fill: "#FBF8EE", inner: "#FFFFFF" },
  ice:          { type: "ice", fill: "#EAF6FF", inner: "#EAF6FF" },
  // Cooked things on a plate
  fries:        { type: "long", fill: "#F2C84B", inner: "#F7DC7A", small: true, cooked: "#D99A3E" },
  nuggets:      { type: "balls", fill: "#E8B46A", inner: "#F6D9A3", cooked: "#C98340" },
  kebabs:       { type: "skewers", fill: "#C9805A", inner: "#D99A6B" },
  quesadilla:   { type: "flat", fill: "#E8B46A", inner: "#F7C94B", spots: true },
  grilledcheese:{ type: "loaf", fill: "#D9A55B", inner: "#F7C94B" },
  frenchtoast:  { type: "loaf", fill: "#E8B46A", inner: "#F6E3B8" },
});
Object.assign(LIQUIDS, {
  lemonjuice: "#FBEFA0", limejuice: "#D8EBA0", coconut: "#FFFFFF", tomatosauce: "#D9402E", gravy: "#9C6A3A", caramel: "#C98340",
  syrup: "#C98340", maple: "#B5703A", buttermilk: "#FFFDF4", eggwash: "#F7D27A", glaze: "#FFFFFF", icing: "#FFFFFF",
  dressing: "#F2D27A", marinade: "#8A4A2A", beer: "#E8B23C", meltedbutter: "#FFE08A", meltedchocolate: "#5A3220",
  ketchup: "#C8302A", mustard: "#E8C23C", hotsauce: "#D9402E", bbq: "#7A2E1C", alfredo: "#FFF6E3", pancakebatter: "#F6D9A3",
  cakebatter: "#F6D9A3", brownbatter: "#6B3A22", soup: "#E8A23C", stew: "#9C5A2A", curry: "#E8A23C", pestosauce: "#5E9A3A",
  whippedcream: "#FFFFFF", frosting: "#F49AC1", chocolatefrosting: "#6B3A22",
});
