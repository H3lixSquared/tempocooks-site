// ---------- Category "bowl": sink, measuring, hands-in bowl work. No heat. ----------
// Loads after _base.js + core.js. Helpers here are prefixed "bowl".

// New foods (guarded so another builder adding the same name doesn't break the page).
function bowlFood(name, def) { if (!FOODS[name]) LIB.food(name, def); }
bowlFood("powderedsugar", { type: "pantry", shape: "bag", fill: "#FFFFFF", inner: "#FFFFFF", mark: "#F49AC1" });
bowlFood("raisins", { type: "grains", fill: "#6A3A4A", inner: "#5A2E3E" });
bowlFood("cranberries", { type: "grains", fill: "#B5304A", inner: "#A8283F", berry: true });
bowlFood("crackers", { type: "grains", fill: "#E8B46A", inner: "#D99A5B", round: true });
bowlFood("cornflakes", { type: "grains", fill: "#F2C46A", inner: "#E8A84A" });

// ---------- bowl helpers ----------
const bph = (t, a, b) => ease(seg(t, a, b));
// mixColor that returns hex, so the result can be mixed again.
const bowlMix = (a, b, q) => { const x = hexToRgb(a), y = hexToRgb(b); return "#" + x.map((v, i) => Math.round(lerp(v, y[i], clamp(q))).toString(16).padStart(2, "0")).join(""); };
// Zoom a whole scene around (cx, cy) so small tools read at phone size.
const bowlZoom = (svg, k, cx = 180, cy = 216) => counter() + `<g transform="translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})">${svg.split(counter()).join("")}</g>`;
function bowlRot(x, y, deg) { const a = deg * Math.PI / 180; return [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)]; }
// Draw `svg` (around its own 0,0) rotated by deg and scaled by s so its local point (lx,ly) lands on (X,Y).
function bowlPin(svg, lx, ly, X, Y, deg = 0, s = 1) { const [rx, ry] = bowlRot(lx * s, ly * s, deg); return `<g transform="translate(${X - rx} ${Y - ry}) rotate(${deg}) scale(${s})">${svg}</g>`; }
const bowlDrop = (x, y, k = 1, color = C.blue, op = 1) => `<path transform="translate(${x} ${y}) scale(${k})" d="M0 -7 C4 -1 5 3 0 5 C-5 3 -4 -1 0 -7 Z" fill="${color}" ${st(1.6)} opacity="${op}"/>`;
// Water running from the sink tap (V.sink spout at x 230) down to y1.
function bowlTap(y1, on = 1) {
  if (on <= 0.01) return "";
  return `<path d="M230 78 L230 ${y1}" stroke="${INK}" stroke-width="14" stroke-linecap="round" opacity="${on * 0.8}"/><path d="M230 78 L230 ${y1}" stroke="${C.water}" stroke-width="9" stroke-linecap="round" opacity="${on}"/><path d="M228 86 L228 ${y1 - 6}" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity="${on * 0.8}"/>`;
}
// Little splash drops jumping where water lands.
const bowlSplash = (t, x, y, on = 1, color = C.blue) => on <= 0.01 ? "" : [0, 1, 2, 3].map(i => { const q = (t * 2.6 + i / 4) % 1, dx = (i % 2 ? 1 : -1) * (8 + q * 18); return bowlDrop(x + dx, y - Math.sin(q * Math.PI) * 14, 0.7, color, on * (1 - q * 0.6)); }).join("");
// A small version of a food, about 24-34 px, for piles in colanders, bags and bowls.
function bowlSmall(F, i, x, y, r = 0, k = 1) {
  switch (F.type) {
    case "grains": return piece(F, "bit", x, y, r, 1.5 * k);
    case "pantry": return piece(F, "bit", x, y, r, k);
    case "tree": return piece(F, "chunk", x, y, r, 1.5 * k);
    case "leafy": return g(whole(F), x, y, 0.34 * k, r);
    case "ground": return `<circle cx="${x}" cy="${y}" r="${9 * k}" fill="${F.fill}" ${st(2.4)}/>`;
    case "balls": return `<circle cx="${x}" cy="${y}" r="${11 * k}" fill="${F.fill}" ${st(2.4)}/>`;
    case "shrimp": return g(whole(F), x, y, 0.3 * k, r);
    case "slab": case "block": return g(whole(F), x, y, 0.36 * k, r);
    default: return g(whole(F), x, y, 0.28 * k, r);
  }
}
// A glass of liquid, carton, bottle, dry cup: all drawn around 0,0.
const bowlCarton = (color) => `<rect x="-22" y="-30" width="44" height="74" rx="3" fill="#fff" ${st(3.5)}/><rect x="-22" y="2" width="44" height="22" fill="${color === "#FFFFFF" || color === "#FFFDF4" ? C.blue : color}" ${st(2.5)}/>
  <path d="M-22 -30 L-12 -48 L12 -48 L22 -30 Z" fill="#fff" ${st(3)}/><rect x="-12" y="-56" width="12" height="9" rx="2" fill="#fff" ${st(2.6)}/>`;
const bowlBottle = (color) => `<path d="M-16 -18 L16 -18 L18 40 C18 46 -18 46 -18 40 Z" fill="${color}" ${st(3.5)}/><path d="M-16 -18 C-16 -30 -6 -34 -6 -44 L6 -44 C6 -34 16 -30 16 -18" fill="${color}" ${st(3.5)}/><rect x="-14" y="6" width="28" height="18" rx="3" fill="#fff" ${st(2.4)}/>`;
// Dry measuring cup with a handle. level 0..1 fills it, dome > 0 heaps it over the rim.
function bowlDryCup(color, level = 0, dome = 0, packed = false) {
  let s = `<rect x="34" y="-28" width="74" height="12" rx="5" fill="${C.steel}" ${st(3)}/>`;
  s += `<path d="M-40 -26 L40 -26 L33 26 C33 32 -33 32 -33 26 Z" fill="${C.steel}" ${st()}/>`;
  if (level > 0.01) {
    const y0 = 26 - 52 * clamp(level), w = lerp(33, 40, (26 - y0) / 52);
    s += `<path d="M${-w + 2} ${y0} L${w - 2} ${y0} L31 26 C31 29 -31 29 -31 26 Z" fill="${color}"/>`;
    if (packed && level > 0.95) s += `<path d="M-30 -18 L30 -18 M-26 -6 L26 -6" stroke="${shade(color)}" stroke-width="2.4" stroke-linecap="round" opacity=".7"/>`;
  }
  if (dome > 0.01) s += `<path d="M-39 -26 Q0 ${-26 - dome * 34} 39 -26 Z" fill="${color}" ${st(2.6)}/>`;
  return s + `<path d="M-40 -26 L40 -26 L33 26 C33 32 -33 32 -33 26 Z" fill="none" ${st()}/><path d="M-44 -26 L44 -26" ${st(4.5)}/>`;
}
// Shallow dish for dredging: flour, beaten egg, or crumbs.
function bowlDish(x, y, content, s = 1) {
  const c = content === "flour" ? "#FBF8EE" : content === "egg" ? "#F7C94B" : content === "crumbs" ? "#E3B672" : content;
  let sp = "";
  if (content === "crumbs") sp = [...Array(12)].map((_, i) => `<circle cx="${-42 + (i * 29) % 84}" cy="${-2 + (i * 7) % 6}" r="2" fill="#B9803A"/>`).join("");
  if (content === "flour") sp = `<path d="M-30 0 q6 -4 12 0 M8 2 q6 -4 12 0" stroke="#E2D6BC" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  if (content === "egg") sp = `<path d="M-30 -1 q10 -4 20 -2" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  return g(`<path d="M-58 0 L58 0 L48 24 C48 30 -48 30 -48 24 Z" fill="#fff" ${st()}/><ellipse cx="0" cy="1" rx="54" ry="7" fill="${c}" ${st(2.5)}/>${sp}`, x, y, s);
}
// Breading looks: what the outside of a cutlet turns into.
const BOWL_COAT = {
  flour: { fill: "#F6F1E4", speck: "#E2D6BC" },
  egg: { fill: "#F3D36B", gloss: true },
  crumbs: { fill: "#E3B672", speck: "#A8702E" },
};
// A cutlet-sized piece of food (about 70 px) for dredging and dipping. look = null (raw) or a BOWL_COAT.
function bowlCutlet(F, key, look = null) {
  let s;
  const fill = look ? look.fill : F.fill;
  if (key === "bread") {
    const crumb = look ? bowlMix(F.inner, look.fill, 0.7) : F.inner;
    s = `<path d="M-30 24 L-30 -6 C-42 -10 -40 -34 -20 -32 C-12 -42 12 -42 20 -32 C40 -34 42 -10 30 -6 L30 24 Z" fill="${F.fill}" ${st()}/>
      <path d="M-23 18 L-23 -9 C-32 -12 -30 -26 -17 -25 C-10 -33 10 -33 17 -25 C30 -26 32 -12 23 -9 L23 18 Z" fill="${crumb}"/>`;
  } else if (F.type === "long") {
    s = `<ellipse rx="36" ry="17" fill="${fill}" ${st()}/><ellipse rx="29" ry="12" fill="${look ? bowlMix(F.inner, look.fill, 0.75) : F.inner}"/>` +
      (look ? "" : `${[[-12, -3], [6, 4], [14, -4], [-4, 5]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="2" fill="${shade(F.inner)}"/>`).join("")}`);
  } else if (F.type === "shrimp") {
    s = g([-16, 16].map(dx => g(whole({ ...F, fill }), dx, 0, 0.42)).join(""));
  } else {
    s = g(whole({ ...F, fill, inner: look ? look.fill : F.inner, mark: look ? (look.speck || "#FFF6D6") : F.mark }), 0, 0, F.type === "block" ? 0.55 : 0.56);
  }
  if (look && look.speck) s += [[-20, -6], [-6, -12], [10, -8], [22, -2], [-14, 6], [4, 4], [18, 10], [-26, 2], [-2, -2]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="2.2" fill="${look.speck}"/>`).join("");
  if (look && look.gloss) s += `<path d="M-18 -10 q10 -6 22 -3" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
  return s;
}
// Blender jar (lid optional, lid lifted by `lift` px). Same spot as V.blender.
function bowlBlender(inner = "", lid = true, lift = 0) {
  return `<path d="M120 30 L240 30 L222 160 L138 160 Z" fill="#EAF3FB" ${st()}/>${inner}<path d="M120 30 L240 30 L222 160 L138 160 Z" fill="none" ${st()}/>
    ${lid ? `<rect x="112" y="${18 - lift}" width="136" height="16" rx="6" fill="#3B3B3B" ${st(3)}/>` : ""}
    <rect x="120" y="160" width="120" height="56" rx="10" fill="${C.steelDark}" ${st()}/><circle cx="180" cy="188" r="10" fill="#fff" ${st(3)}/>`;
}
const bowlJarFill = (color, y) => { const q = (y - 30) / 130; return `<path d="M${lerp(122, 139, q)} ${y} L${lerp(238, 221, q)} ${y} L221 158 L139 158 Z" fill="${color}"/><path d="M${lerp(122, 139, q)} ${y} L${lerp(238, 221, q)} ${y}" ${st(2.5)}/>`; };
// Food processor bowl contents + spinning blade.
const bowlProcFill = (color, y) => { const q = (y - 70) / 100; return `<path d="M${lerp(112, 115, q)} ${y} L${lerp(248, 245, q)} ${y} L245 168 L115 168 Z" fill="${color}"/><path d="M${lerp(112, 115, q)} ${y} L${lerp(248, 245, q)} ${y}" ${st(2.5)}/>`; };
const bowlBlade = (t, y = 152, speed = 1) => `<rect x="176" y="96" width="8" height="70" rx="3" fill="${C.steelDark}" ${st(2.4)}/><g transform="translate(180 ${y}) scale(1 0.35) rotate(${(t * 900 * speed) % 360})"><path d="M-46 0 C-20 -12 20 12 46 0" fill="none" ${st(5)}/><path d="M-46 0 C-20 -12 20 12 46 0" fill="none" stroke="${C.steel}" stroke-width="2"/></g>`;
// Hand mixer with a fist on the handle.
const bowlMixer = (x, y, r = 0, spin = 0) => g(T.handMixer(0, 0, 0, spin) + g(fist(), 0, -102), x, y, 1, r);
// Ice-cold water in a side-view bowl, translucent.
const bowlWater = (y, op = 0.65, color = C.water) => `<g opacity="${op}">${V.bowlFill(color, y)}</g>`;
// A paper-towel pad (folded) about 110 x 18.
const bowlPad = (x, y, wet = 0) => `<rect x="${x - 56}" y="${y - 9}" width="112" height="18" rx="5" fill="#fff" ${st(3)}/>` +
  [...Array(6)].map((_, i) => `<circle cx="${x - 44 + i * 17.6}" cy="${y}" r="1.8" fill="#DDE7F3"/>`).join("") +
  [...Array(Math.round(wet * 4))].map((_, i) => `<ellipse cx="${x - 36 + i * 24}" cy="${y + 2}" rx="9" ry="4" fill="#BFD3E6" opacity=".8"/>`).join("");
// Pinch of salt falling: white and black specks from (x, y0) to y1.
const bowlSalt = (t, x, y0, y1, n = 8, colors = ["#fff", INK]) => [...Array(n)].map((_, i) => { const q = (t * 1.6 + i / n) % 1; return `<rect x="${x - 10 + (i * 7) % 20 + Math.sin(q * 6 + i) * 3}" y="${lerp(y0, y1, q)}" width="4" height="4" fill="${colors[i % colors.length]}" stroke="${INK}" stroke-width="1"/>`; }).join("");

// ================= Sink: rinse, scrub, soak, drain, spin =================

LIB.add({
  cat: "bowl", name: "rinsesieve", dur: 2,
  foods: ["whiterice", "brownrice", "quinoa", "lentils"],
  steps: ["Rinse the rice until the water runs clear", "Rinse the quinoa in a fine-mesh sieve", "Wash toor dal a few times until the water runs clear", "Rinse and drain the lentils"],
  draw(t, F, key) {
    const jig = wave(t, 2, 4) * 4;
    const cloudy = key === "lentils" ? C.blue : "#E4ECF0";
    let s = V.sink(0) + bowlTap(112);
    s += g(`<g transform="scale(-1 1)">${V.sieve(0, 0, 1)}${g(fist(), 104, -6)}</g>` + g(whole(F), 0, -2, 0.7), 206 + jig, 116, 1.35);
    s += bowlSplash(t, 228 + jig, 104);
    return s + FX.drips(t, [176, 192, 208, 224, 238], 168, 226, cloudy, 1.4);
  },
});

LIB.add({
  cat: "bowl", name: "rinsecolander", dur: 2,
  foods: ["blackbeans", "chickpeas", "kidneybeans", "blueberries", "raspberries", "grapes", "strawberry", "cherrytomato", "spinach", "lettuce", "herbs", "broccoli", "shrimp"],
  steps: ["Drain and rinse the black beans", "Rinse the berries in a colander", "Rinse all the veggies", "Rinse the shrimp under cold water"],
  draw(t, F) {
    const big = ["leafy", "round", "shrimp", "tree"].includes(F.type);
    const n = big ? 7 : 14;
    let inner = "";
    for (let i = 0; i < n; i++) {
      const row = big ? (i < 4 ? 0 : 1) : (i < 8 ? 0 : 1), cols = big ? (row ? 3 : 4) : (row ? 6 : 8), j = big ? (row ? i - 4 : i) : (row ? i - 8 : i);
      const x = -60 + (j + 0.5) * (120 / cols) + (row ? 0 : 0), y = (row ? -32 : -20) + Math.sin(t * 9 + i * 1.7) * 1.6;
      inner += bowlSmall(F, i, x, y, (i * 47) % 60 - 30, big ? 1.1 : 1.2);
    }
    let s = V.sink(0) + bowlTap(124);
    s += V.colander(204, 150, 1.15, inner);
    s += bowlSplash(t, 230, 118);
    return s + FX.drips(t, [150, 175, 200, 225, 250], 190, 230, C.blue, 1.4);
  },
});

const bowlBrush = (x, y, r = 0) => g(`<rect x="-30" y="-14" width="60" height="20" rx="8" fill="${C.wood}" ${st(3)}/><path d="M-24 7 L-24 16 M-14 7 L-14 16 M-4 7 L-4 16 M6 7 L6 16 M16 7 L16 16 M25 7 L25 16" ${st(2.6)}/>` + g(fist(), 0, -26), x, y, 1, r);
LIB.add({
  cat: "bowl", name: "scrub", dur: 1.6,
  foods: ["potato", "sweetpotato", "carrot", "beet"],
  steps: ["Scrub the potatoes well", "Scrub and slice the carrots", "Scrub the beets under running water", "Wash and scrub the potatoes"],
  draw(t, F) {
    const vy = 132, isL = F.type === "long", top = isL ? vy - 18 : vy - 34;
    let s = V.sink(0) + bowlTap(top + 2);
    s += g(fist(), isL ? 128 : 150, vy + 8) + g(whole(F), 215, vy, isL ? 0.9 : 0.92, -6);
    for (let i = 0; i < 4; i++) s += `<circle cx="${188 + i * 18}" cy="${vy + (i % 2 ? 4 : -6)}" r="2.6" fill="#7A5A3A" opacity="${0.4 + 0.15 * wave(t, 1.6, 1 + i)}"/>`;
    s += bowlBrush(215 + wave(t, 1.6, 2) * 26, top - 14, wave(t, 1.6, 2) * 8);
    s += bowlSplash(t, 232, top + 4, 1, "#A8C8DE");
    return s + FX.drips(t, [196, 214, 232], vy + 30, 224, "#B7A88C", 1.5);
  },
});

LIB.add({
  cat: "bowl", name: "washveg", dur: 2.4,
  foods: ["apple", "tomato", "cucumber", "zucchini", "pepper", "eggplant", "lemon", "carrot", "potato", "celery", "broccoli", "cauliflower"],
  steps: ["Rinse all the veggies", "Rinse eggplants well under running water", "Wash the apples", "Rinse and pat dry"],
  draw(t, F) {
    const rot = wave(t, 2.4, 1) * 18, vy = 128, isLong = F.type === "long";
    const top = isLong ? vy - 18 : vy - 40;
    let s = V.sink(0) + bowlTap(top + 4);
    s += g(g(whole(F), 0, 0, isLong ? 0.75 : 0.85) + g(fist(), isLong ? -66 : -46, isLong ? 8 : 26), 222, vy, 1, rot * (isLong ? 0.5 : 1));
    s += [0, 1, 2].map(i => bowlDrop(205 + i * 16, vy - 6 + (i % 2) * 14, 0.8, C.blue, 0.9)).join("");
    s += bowlSplash(t, 230, top + 6);
    return s + FX.drips(t, [204, 222, 240], vy + 34, 224, C.blue, 1.5);
  },
});

LIB.add({
  cat: "bowl", name: "soak", dur: 3.2,
  foods: ["blackbeans", "chickpeas", "nuts", "whiterice"],
  steps: ["Cover the beans with water and soak overnight", "Soak the almonds in hot water for 10 minutes", "Set aside to soak", "Soak the rice for 30 minutes"],
  draw(t, F, key) {
    const tilt = bph(t, 0, 0.3) - bph(t, 1.3, 1.6), level = lerp(196, 134, bph(t, 0.25, 1.35));
    const plump = ["blackbeans", "chickpeas", "nuts"].includes(key) ? 1 + 0.18 * bph(t, 1.4, 3.0) : 1;
    let grains = "";
    for (let i = 0; i < 13; i++) grains += bowlSmall(F, i, 128 + (i * 41) % 104, 184 - (i % 3) * 8, i * 37, (F.type === "nut" ? 0.9 : 1.1) * plump);
    let s = bowlSide("#fff", grains + (level < 186 ? bowlWater(level) : ""));
    const deg = -75 * tilt;
    const cup = T.measuringCup(0, 0, 0, C.water, lerp(0.75, 0.15, bph(t, 0.25, 1.35)));
    if (tilt > 0.85 && t > 0.25 && t < 1.35) s += FX.stream(206, 86, 196, level, C.water, 7);
    s += bowlPin(cup, -24, -30, lerp(268, 210, tilt), lerp(60, 84, tilt), deg, 1.2);
    if (t > 1.5) s += T.timer(310, 52, (t - 1.5) / 1.7, 1);
    return s;
  },
});

const bowlOpenCan = (label) => `<rect x="-28" y="-36" width="56" height="72" rx="6" fill="${C.steel}" ${st(3.5)}/><rect x="-28" y="-18" width="56" height="36" fill="${label}" ${st(2.5)}/><ellipse cx="0" cy="-36" rx="28" ry="7" fill="#7C858C" ${st(3)}/><ellipse cx="0" cy="-35" rx="21" ry="4" fill="#5C6670"/>`;
LIB.add({
  cat: "bowl", name: "canrinse", dur: 3,
  foods: ["blackbeans", "chickpeas", "kidneybeans"],
  steps: ["Drain and rinse the black beans", "Drain and rinse the white beans", "Add the drained and rinsed chickpeas"],
  draw(t, F) {
    const tilt = bph(t, 0.1, 0.55), gone = bph(t, 1.45, 1.85), tap = bph(t, 1.7, 1.9);
    const fill = bph(t, 0.5, 1.4);
    let inner = "";
    const n = Math.round(fill * 16);
    for (let i = 0; i < n; i++) inner += piece(F, "bit", -54 + (i * 37) % 108, (i < 8 ? -20 : -30) + Math.sin(t * 9 + i) * (tap ? 1.6 : 0), i * 40, 1.7);
    let s = V.sink(0) + bowlTap(118, tap);
    s += V.colander(200, 142, 0.85, inner);
    const a = 118 * tilt, cx = lerp(112, -90, gone), cy = lerp(80, 10, gone);
    const mx = cx + 36 * Math.sin(a * Math.PI / 180), my = cy - 36 * Math.cos(a * Math.PI / 180);
    if (t > 0.5 && t < 1.4) {
      s += FX.stream(mx, my, 192, 128, "#E9DDB8", 6);
      for (let i = 0; i < 5; i++) { const q = (t * 1.8 + i / 5) % 1; s += piece(F, "bit", lerp(mx, 180 + i * 8, q), lerp(my, 128, q), q * 300, 1.7); }
    }
    s += g(bowlOpenCan(F.fill === "#2A2A2A" ? "#F7C94B" : "#E8613C"), cx, cy, 1, a);
    s += bowlSplash(t, 230, 114, tap);
    return s + (t > 0.6 ? FX.drips(t, [176, 196, 216, 236], 190, 228, t < 1.6 ? "#D9CBA0" : C.blue, 1.4) : "");
  },
});

LIB.add({
  cat: "bowl", name: "spindry", dur: 2,
  foods: ["lettuce", "spinach", "kale", "herbs"],
  steps: ["Spin the greens dry", "Wash and dry the lettuce in a salad spinner", "Rinse the spinach and spin dry", "Wash and dry the herbs"],
  draw(t, F) {
    const push = Math.abs(Math.sin(t / 2 * Math.PI * 4));
    let s = `<path d="M66 116 C70 214 290 214 294 116 Z" fill="#DDEFFC" ${st()}/>`;
    s += `<ellipse cx="180" cy="196" rx="62" ry="7" fill="${C.water}" ${st(2)}/>`;
    s += `<path d="M86 120 C90 196 270 196 274 120" fill="#F7FBFF" stroke="${C.blue}" stroke-width="3"/>` + [110, 140, 180, 220, 250].map(x => `<path d="M${x} 124 L${x + (x - 180) * -0.12} ${186 - Math.abs(x - 180) * 0.2}" stroke="${C.blue}" stroke-width="2.4"/>`).join("");
    const a0 = t / 2 * Math.PI * 2 * 2;
    const leaves = [...Array(7)].map((_, i) => { const a = a0 + i * Math.PI * 2 / 7; return { x: 180 + Math.cos(a) * 64, y: 160 + (i % 2) * 14 - Math.sin(a) * 6, d: Math.sin(a), i }; }).sort((p, q) => p.d - q.d);
    for (const L of leaves) s += bowlSmall(F, L.i, L.x, L.y, L.i * 40, 1.15 + L.d * 0.12);
    for (let i = 0; i < 6; i++) { const q = (t * 1.6 + i / 6) % 1, side = i % 2 ? 1 : -1; s += bowlDrop(180 + side * lerp(60, 104, q), 150 + i * 4 + q * 30, 0.8, C.blue, 1 - q * 0.5); }
    s += `<path d="M58 116 L302 116" ${st(5)}/><path d="M70 112 C80 100 280 100 290 112 Z" fill="#fff" ${st(3.5)}/>`;
    const ky = 62 + push * 18;
    s += `<rect x="174" y="${ky}" width="12" height="${104 - ky}" fill="${C.steelDark}" ${st(2.6)}/><rect x="156" y="${ky - 12}" width="48" height="16" rx="8" fill="#E8613C" ${st(3)}/>`;
    return s + g(fist(), 180, ky - 26, 1.1);
  },
});

// ================= Pat dry, press, wipe =================

LIB.add({
  cat: "bowl", name: "patdry", dur: 2.4,
  foods: ["chicken", "steak", "porkchop", "salmon", "fish", "shrimp", "tofu", "wholechicken"],
  steps: ["Pat the chicken dry with paper towels", "Carefully pat steak dry with paper towels", "Pat the beef dry and season with the salt and pepper", "Pat the shrimp dry"],
  draw(t, F, key) {
    const pats = Math.min(3, Math.floor(t / 0.6)), p = (t % 0.6) / 0.6;
    const down = t < 1.8 ? (p < 0.35 ? ease(p / 0.35) : p < 0.55 ? 1 : 1 - ease((p - 0.55) / 0.45)) : 0;
    const dry = clamp((t < 1.8 ? pats + (p > 0.35 ? 1 : 0) : 3) / 3);
    let s = board() + `<path d="M64 148 L296 140 L300 196 L60 202 Z" fill="#fff" ${st(3)}/>` + [...Array(10)].map((_, i) => `<circle cx="${80 + i * 22}" cy="${170 + (i % 2) * 10}" r="2" fill="#DDE7F3"/>`).join("");
    let food = "", topY = 128;
    if (key === "shrimp") { food = [130, 180, 230].map((x, i) => g(whole(F), x, 160 + (i % 2) * 4, 0.42)).join(""); topY = 140; }
    else if (key === "wholechicken") { food = g(whole(F), 176, 158, 0.86); topY = 116; }
    else { food = g(whole(F), 180, 160, 0.95); topY = 126; }
    s += food;
    s += [[150, 150], [196, 144], [222, 160], [168, 166], [204, 172]].map(([x, y], i) => bowlDrop(x, y + (key === "wholechicken" ? -10 : 0), 0.9, C.blue, 1 - dry)).join("");
    const hx = 150 + Math.min(pats, 2) * 30, hy = lerp(66, topY - 8, down);
    s += bowlPad(hx, hy, dry);
    return s + flatHand(hx, hy - 9);
  },
});

LIB.add({
  cat: "bowl", name: "presstofu", dur: 3,
  foods: ["tofu"],
  steps: ["Press the tofu for 20 minutes", "Wrap the tofu in a towel and set something heavy on top", "Drain and press the tofu"],
  draw(t, F) {
    const down = bph(t, 0.2, 0.7), sq = 1 - 0.1 * bph(t, 0.6, 1.4);
    let s = `<ellipse cx="180" cy="202" rx="140" ry="18" fill="#fff" ${st()}/><ellipse cx="180" cy="200" rx="${lerp(30, 112, bph(t, 0.8, 2.8))}" ry="${lerp(3, 9, bph(t, 0.8, 2.8))}" fill="${C.water}" ${st(2)}/>`;
    s += `<g transform="translate(180 196) scale(1 ${sq}) translate(-180 -196)">`;
    s += `<rect x="92" y="184" width="176" height="12" rx="4" fill="${C.towel}" ${st(3)}/>`;
    s += g(whole(F), 172, 160, 1.15) + `<path d="M108 134 L236 134 L258 116" fill="none" stroke="${C.towel}" stroke-width="9" stroke-linecap="round"/><path d="M108 140 L236 140 L258 120" fill="none" stroke="${C.blue}" stroke-width="2" opacity=".5"/>`;
    s += `</g>`;
    const wy = lerp(-60, 0, down) + (1 - sq) * 140;
    s += g(`<rect x="-100" y="-16" width="200" height="16" rx="6" fill="${C.wood}" ${st(3.5)}/>` + V.can(-40, -52, 0.95, "#E8613C") + V.can(34, -52, 0.95, "#8CC152"), 180, 120 + wy);
    if (t > 0.8) for (let i = 0; i < 4; i++) { const q = (t * 1.1 + i / 4) % 1; s += bowlDrop(i < 2 ? 98 - i * 8 : 262 + (i - 2) * 8, lerp(172, 196, q), 0.8, C.blue, 1 - q); }
    return s;
  },
});

LIB.add({
  cat: "bowl", name: "wipemushroom", dur: 1.6,
  foods: ["mushroom"],
  steps: ["Wipe the mushrooms clean with a damp paper towel", "Clean the mushrooms", "Brush any dirt off the mushrooms"],
  draw(t, F) {
    let s = board() + g(whole(F), 176, 150, 1.25);
    for (let i = 0; i < 5; i++) s += `<circle cx="${144 + i * 16}" cy="${128 + (i % 2) * 8}" r="3" fill="#6B4A2A" opacity="${0.35 + 0.3 * Math.abs(wave(t, 1.6, 1 + i * 0.5))}"/>`;
    for (let i = 0; i < 3; i++) { const q = (t * 1.2 + i / 3) % 1; s += `<circle cx="${220 + i * 18}" cy="${lerp(130, 206, q)}" r="2.6" fill="#6B4A2A" opacity="${1 - q}"/>`; }
    const x = 176 + wave(t, 1.6, 2) * 40;
    return s + g(`<path d="M-30 -10 C-20 -18 20 -18 30 -10 L30 8 C20 14 -20 14 -30 8 Z" fill="#fff" ${st(3)}/><ellipse cx="0" cy="4" rx="16" ry="5" fill="#BFD3E6"/>` + g(fist(), 0, -24), x, 106, 1, wave(t, 1.6, 2) * 8);
  },
});

// ================= Measuring =================

LIB.add({
  cat: "bowl", name: "spoonlevel", dur: 3,
  foods: ["flour", "sugar", "cocoa", "powderedsugar"],
  steps: ["Measure the flour by spooning it into a cup, then sweeping off any excess", "Spoon the flour into the cup and level it off", "Measure the sugar", "Measure the cocoa powder"],
  draw(t, F) {
    const color = F.inner === "#FFFFFF" ? "#FBF8EE" : F.inner;
    let s = counter() + g(whole(F), 76, 158, 0.85) + `<ellipse cx="76" cy="122" rx="24" ry="5" fill="${color}" ${st(2)}/>`;
    const trip = Math.floor(t / 0.6), u = (t % 0.6) / 0.6;
    const tipsDone = t < 1.8 ? trip + (u > 0.7 ? 1 : 0) : 3;
    const level = clamp(tipsDone / 2), dome = clamp(tipsDone - 2);
    const sweep = bph(t, 1.95, 2.55);
    s += g(bowlDryCup(color, level, dome * (1 - sweep)), 205, 176);
    if (t < 1.8) {
      let x, y, r = 0, full = u < 0.7;
      if (u < 0.2) { x = 82; y = lerp(96, 118, Math.sin(u / 0.2 * Math.PI)); }
      else if (u < 0.55) { const q = ease((u - 0.2) / 0.35); x = lerp(82, 197, q); y = lerp(96, 104, q) - Math.sin(q * Math.PI) * 24; }
      else if (u < 0.8) { x = 197; y = 104; r = -60 * Math.sin(seg(u, 0.55, 0.8) * Math.PI); }
      else { const q = ease((u - 0.8) / 0.2); x = lerp(197, 82, q); y = 96; }
      s += g(T.metalSpoon(0, 0, 0, full ? color : null) + g(fist(), 64, -60, 0.9), x, y + 14, 1, r);
    }
    if (t >= 1.9 && t < 2.7) {
      s += knife(lerp(172, 300, sweep), 147, 0, 80);
      for (let i = 0; i < 4; i++) { const q = seg(t, 2.2 + i * 0.05, 2.7); if (q > 0 && q < 1) s += `<circle cx="${262 + i * 6}" cy="${lerp(146, 212, q)}" r="3" fill="${color}" ${st(1.4)}/>`; }
    }
    s = bowlZoom(s, 1.2);
    if (t > 2.6) s += T.check(306, 52, 0.8);
    return s;
  },
});

LIB.add({
  cat: "bowl", name: "packsugar", dur: 3.4,
  foods: ["brownsugar"],
  steps: ["Measure the packed brown sugar", "Pack the brown sugar into the cup", "1 cup packed brown sugar"],
  draw(t, F) {
    const color = F.inner;
    let s = counter() + g(whole(F), 70, 160, 0.8);
    const trip = Math.floor(t / 0.6), u = (t % 0.6) / 0.6;
    const tips = t < 1.2 ? trip + (u > 0.7 ? 1 : 0) : 2;
    const press = t > 1.2 && t < 1.9 ? Math.abs(Math.sin((t - 1.2) / 0.7 * Math.PI * 2)) : 0;
    const packed = t > 1.5;
    const level = packed ? 1 : clamp(tips / 2) * 0.8, dome = packed ? 0 : tips >= 2 ? 0.5 : 0;
    const flip = bph(t, 2.0, 2.45), lift = bph(t, 2.65, 3.05);
    const cupY = 176 - Math.sin(flip * Math.PI) * 40 - lift * 90 + (flip > 0.5 ? 0 : 0);
    if (flip >= 0.99) s += `<path d="M174 210 L254 210 L247 158 L181 158 Z" fill="${color}" ${st()}/><path d="M188 176 L240 176 M186 194 L244 194" stroke="${shade(color)}" stroke-width="2.4" opacity=".7"/>`;
    s += g(bowlDryCup(color, level, dome, packed), 214, flip >= 0.99 ? 184 - lift * 110 : cupY, 1, flip * 180);
    if (t < 1.2) {
      let x, y, r = 0;
      if (u < 0.2) { x = 76; y = lerp(98, 120, Math.sin(u / 0.2 * Math.PI)); }
      else if (u < 0.55) { const q = ease((u - 0.2) / 0.35); x = lerp(76, 206, q); y = lerp(98, 104, q) - Math.sin(q * Math.PI) * 24; }
      else if (u < 0.8) { x = 206; y = 104; r = -60 * Math.sin(seg(u, 0.55, 0.8) * Math.PI); }
      else { const q = ease((u - 0.8) / 0.2); x = lerp(206, 76, q); y = 98; }
      s += g(T.metalSpoon(0, 0, 0, u < 0.7 ? color : null) + g(fist(), 64, -60, 0.9), x, y + 14, 1, r);
    }
    if (t > 1.2 && t < 1.95) s += g(fist(), 214, lerp(100, 136, press), 1.4, 180);
    s = bowlZoom(s, 1.18);
    if (t > 3.05) s += T.check(306, 52, 0.8);
    return s;
  },
});

LIB.add({
  cat: "bowl", name: "measureliquid", dur: 3,
  foods: ["milk", "buttermilk", "water", "oil", "broth", "vinegar"],
  steps: ["Measure 1/2 cup pasta-cooking water", "Measure the milk", "Pour the buttermilk into a measuring cup", "Measure the oil"],
  draw(t, F, key) {
    const color = F.liquid || F.inner;
    const level = lerp(0.04, 0.733, bph(t, 0.45, 1.9));
    const tip = bph(t, 0.1, 0.45) - bph(t, 1.95, 2.3);
    let s = counter();
    s += g(T.measuringCup(0, 0, 0, color, level) + `<path d="M${-25 + 4 * (1 - level)} ${30 - 60 * level} L${25 - 4 * (1 - level)} ${30 - 60 * level}" stroke="${shade(color === "#FFFFFF" || color === "#FFFDF4" ? "#C9C2B0" : color)}" stroke-width="2.4"/><path d="M-22 -14 L14 -14" stroke="${C.hot}" stroke-width="3" stroke-dasharray="5 4"/>`, 150, 160, 1.85);
    const carton = ["milk", "buttermilk", "broth", "cream", "juice"].includes(key);
    const box = carton ? bowlCarton(color) : key === "water" ? T.measuringCup(0, 0, 0, color, 0.7) : bowlBottle(color);
    const ly = carton ? -52 : key === "water" ? -30 : -44, lx = carton ? -6 : key === "water" ? -24 : 0;
    if (tip > 0.9 && t > 0.4 && t < 1.95) s += FX.stream(212, 72, 158, 160 - 60 * 1.85 * level + 54, color, 6);
    s += bowlPin(box, lx, ly, 214, 70, lerp(0, -112, tip), 1);
    if (t > 2.1) s += T.check(300, 64, 0.8);
    return s;
  },
});

const bowlSpiceJar = (F) => `<rect x="-48" y="-30" width="96" height="62" rx="10" fill="${F.fill === "#FFFFFF" ? "#EAF3FB" : F.fill}" ${st()}/><rect x="-48" y="-6" width="96" height="18" fill="${F.mark}" ${st(2.5)}/><ellipse cx="0" cy="-30" rx="48" ry="10" fill="${F.inner}" ${st(3)}/>`;
LIB.add({
  cat: "bowl", name: "levelspoon", dur: 2.4,
  foods: ["salt", "leavening", "cinnamon", "spices"],
  steps: ["Add 1 teaspoon baking soda", "Level off a teaspoon of salt", "Measure 1 teaspoon cinnamon", "Add 1/2 teaspoon of each spice"],
  draw(t, F) {
    const color = F.inner;
    let s = counter() + g(bowlSpiceJar(F), 140, 182);
    const dip = Math.sin(seg(t, 0, 0.7) * Math.PI), rise = bph(t, 0.6, 0.95), sweep = bph(t, 1.05, 1.55);
    const sx = 142, sy = t < 0.65 ? lerp(124, 150, dip) : lerp(150, 104, rise);
    const heap = t > 0.35 ? 1 - sweep : 0;
    let spoon = T.measuringSpoon(0, 0, 0, t > 0.35 ? color : null);
    if (heap > 0.02) spoon += `<path d="M-16 -2 Q0 ${-2 - 20 * heap} 16 -2 Z" fill="${color}" ${st(2)}/>`;
    s += g(spoon + g(fist(), 72, -26, 0.75), sx, sy, 1.5);
    if (t > 1.0 && t < 1.65) s += knife(lerp(100, 220, sweep), sy - 6, 0, 70);
    for (let i = 0; i < 4; i++) { const q = seg(t, 1.25 + i * 0.04, 1.75); if (q > 0 && q < 1) s += `<circle cx="${172 + i * 5}" cy="${lerp(sy, 172, q)}" r="2.6" fill="${color}" ${st(1.2)}/>`; }
    s = bowlZoom(s, 1.25, 160);
    if (t > 1.7) s += T.check(300, 52, 0.8);
    return s;
  },
});

LIB.add({
  cat: "bowl", name: "measurespoonful", dur: 2.4,
  foods: ["vanilla", "soy", "lemonjuice", "honey"],
  steps: ["Stir in 1 teaspoon vanilla", "Add 2 tablespoons soy sauce", "Add 1 tablespoon lemon juice", "Measure the honey"],
  draw(t, F, key) {
    const color = key === "vanilla" ? "#6B3A22" : F.liquid || F.inner;
    const fill = bph(t, 0.3, 0.9), tipS = bph(t, 1.15, 1.45) - bph(t, 1.9, 2.2), pool = bph(t, 1.3, 1.7);
    let s = counter() + V.smallBowl(176, 176, 0.8, pool > 0 ? `<ellipse cx="0" cy="22" rx="${20 + pool * 26}" ry="${6 + pool * 4}" fill="${color}" ${st(2)}/>` : "");
    const tipB = bph(t, 0.05, 0.3) - bph(t, 0.9, 1.15);
    if (tipB > 0.9 && t > 0.25 && t < 0.92) s += FX.stream(140, 70, 162, 110, color, 4);
    const bottle = key === "vanilla" ? whole(F) : bowlBottle(color);
    s += bowlPin(bottle, 0, key === "vanilla" ? -50 : -44, 138, 66, lerp(0, 120, tipB), 0.85);
    let spoon = T.measuringSpoon(0, 0, 0, fill > 0.1 && tipS < 0.5 ? color : null);
    s += g(spoon + g(fist(), 72, -26, 0.75), 162, 116, 1.4, -40 * tipS);
    if (tipS > 0.6 && t > 1.3 && t < 1.95) s += FX.stream(150, 118, 160, 180, color, 4);
    return bowlZoom(s, 1.25, 170);
  },
});

LIB.add({
  cat: "bowl", name: "sift", dur: 1.6,
  foods: ["powderedsugar"],
  steps: ["Sift the powdered sugar into the bowl", "Sift in the confectioners' sugar", "Sift the powdered sugar to remove lumps"],
  draw(t, F) {
    const color = F.inner === "#FFFFFF" ? "#FFFFFF" : F.inner;
    let s = bowlSide("#fff", `<path d="M108 170 C130 ${150 - 4 * wave(t, 1.6)} 230 ${150 - 4 * wave(t, 1.6)} 252 170 C230 196 130 196 108 170 Z" fill="${color}" ${st(2.5)}/>`);
    const tap = Math.abs(Math.sin(t * Math.PI * 5)) * 4;
    s += FX.fall(t, 0.8, 18, 170, 70, 112, 160, (x, y, i, q) => `<circle cx="${x}" cy="${y}" r="2.2" fill="${color}" stroke="${INK}" stroke-width="0.9" opacity="${1 - q * 0.3}"/>`);
    s += g(V.sieve(0, 0, 1) + `<path d="M-40 2 Q0 -14 40 2" fill="${color}" ${st(2)}/>` + g(fist(), 104, -6), 168 + tap, 74);
    return s;
  },
});

// ================= Season, rub, brine =================

const bowlSpecks = (n, cx, cy, rx, ry, colors) => [...Array(n)].map((_, i) => { const a = i * 2.39996, r = Math.sqrt((i + 0.5) / 14); return `<rect x="${cx + Math.cos(a) * r * rx - 2}" y="${cy + Math.sin(a) * r * ry - 2}" width="4" height="4" fill="${colors[i % colors.length]}" stroke="${INK}" stroke-width="0.9"/>`; }).join("");
LIB.add({
  cat: "bowl", name: "seasonboth", dur: 3.2,
  foods: ["steak", "porkchop", "chicken", "salmon", "patty"],
  steps: ["Season both sides with salt and pepper", "Season the steak generously on both sides", "Season the chicken on both sides", "Season the patties with salt and pepper"],
  draw(t, F) {
    const p = bph(t, 1.3, 1.9), flipS = Math.cos(p * Math.PI), lift = Math.sin(p * Math.PI) * 44;
    let s = board() + g(`<g transform="scale(1 ${Math.abs(flipS) < 0.06 ? 0.06 : flipS})">${whole(F)}</g>`, 180, 156 - lift, 1);
    const colors = ["#fff", INK];
    if (p < 0.02) s += bowlSpecks(Math.floor(seg(t, 0.15, 1.2) * 14), 180, 146, 46, 14, colors);
    if (p > 0.98) s += bowlSpecks(Math.floor(seg(t, 2.0, 3.0) * 14), 180, 146, 46, 14, colors);
    const active = (t > 0.1 && t < 1.2) || (t > 1.95 && t < 3.0);
    const px = 180 + Math.sin(t * 5) * 40;
    if (active) s += bowlSalt(t, px, 72, 134, 8, colors);
    return s + T.pinch(active ? px : 300, active ? 56 : 48, 1.1);
  },
});

LIB.add({
  cat: "bowl", name: "rubspice", dur: 2.4,
  foods: ["chicken", "wholechicken", "porkchop", "drumsticks", "pork"],
  steps: ["Rub the spice mix all over the chicken", "Season with the seasoning mix or your own preferred blend", "Rub the spices into the pork", "Coat the chicken with the rub"],
  draw(t, F, key) {
    const k = bph(t, 0.1, 2.0);
    const F2 = { ...F, fill: bowlMix(F.fill, "#C0502A", 0.12 + 0.42 * k) };
    let s = board() + g(whole(F2), 180, 152, key === "wholechicken" ? 0.95 : 1.05);
    s += [...Array(12)].map((_, i) => `<circle cx="${140 + (i * 29) % 84}" cy="${136 + (i * 13) % 26}" r="3.2" fill="#9C3A1E" opacity="${1 - k}"/>`).join("");
    const a = t / 2.4 * Math.PI * 4;
    return s + T.palm(180 + Math.cos(a) * 36, 128 + Math.sin(a) * 12, 1.25, Math.cos(a) * 10);
  },
});

LIB.add({
  cat: "bowl", name: "ruboil", dur: 2.4,
  foods: ["wholechicken", "chicken", "potato", "turkey"],
  steps: ["Pat the chicken dry with paper towels and then rub it with olive oil", "Rub it with olive oil", "Rub the potatoes with oil", "Rub the turkey all over with butter or oil"],
  draw(t, F, key) {
    const shine = bph(t, 0.5, 1.8), big = ["wholechicken", "turkey"].includes(key);
    const F2 = { ...F, fill: bowlMix(F.fill, "#F2C84B", 0.18 * shine) };
    let s = board() + g(whole(F2), 180, 154, big ? 0.95 : 1.05);
    for (let i = 0; i < 4; i++) if (shine > 0.2) s += FX.sparkle(t + i, 140 + i * 28, 130 + (i % 2) * 18, 0.7 * shine);
    const tip = bph(t, 0, 0.2) - bph(t, 0.6, 0.8);
    if (tip > 0.9 && t < 0.62) s += FX.stream(214, 70, 190, 132, C.oil, 4);
    s += bowlPin(bowlBottle(C.oil), 0, -44, lerp(300, 216, tip), lerp(100, 66, tip), lerp(0, -125, tip), 0.9);
    if (t > 0.7) { const a = (t - 0.7) / 1.7 * Math.PI * 4; s += T.palm(176 + Math.cos(a) * 38, 130 + Math.sin(a) * 12, 1.25, Math.cos(a) * 10); }
    return s;
  },
});

LIB.add({
  cat: "bowl", name: "brine", dur: 3.2,
  foods: ["chicken", "porkchop", "shrimp", "wholechicken"],
  steps: ["Brine the chicken in salted water", "Dissolve the salt in the water, then add the pork chops", "Soak the shrimp in salted water for 15 minutes", "Submerge the chicken in the brine"],
  draw(t, F, key) {
    const down = bph(t, 1.0, 1.8);
    const fy = lerp(40, key === "wholechicken" ? 160 : 168, down);
    const food = key === "shrimp" ? [-30, 30].map(dx => g(whole(F), dx, 0, 0.45)).join("") : g(whole(F), 0, 0, key === "wholechicken" ? 0.62 : 0.7);
    let s = bowlSide("#fff", g(food, 180, fy) + bowlWater(132, 0.6));
    if (t < 1.0) {
      const tip = bph(t, 0.05, 0.3);
      s += g(T.metalSpoon(0, 0, 0, "#fff") + g(fist(), 64, -60, 0.9), 200, 78, 1, -60 * tip);
      for (let i = 0; i < 8; i++) { const q = (t * 1.6 + i / 8) % 1; if (tip > 0.8) s += `<rect x="${186 + (i * 7) % 18}" y="${lerp(90, 170, q)}" width="4" height="4" fill="#fff" stroke="${INK}" stroke-width="1" opacity="${q < 0.5 ? 1 : 2 - q * 2}"/>`; }
    }
    if (down > 0.3 && down < 1) s += bowlSplash(t, 180, 128, 1);
    if (t > 1.9) s += T.timer(304, 54, (t - 1.9) / 1.3);
    return s;
  },
});

// ================= Breading: dredge, dip, press =================

LIB.add({
  cat: "bowl", name: "dredge", dur: 3.6,
  foods: ["chicken", "porkchop", "fish", "eggplant", "zucchini", "tofu"],
  steps: ["Dredge the chicken in flour, then egg, then breadcrumbs", "Dip each piece in flour, then egg, then panko", "Set up a breading station", "Coat the slices in flour, egg and breadcrumbs"],
  draw(t, F, key) {
    const xs = [70, 180, 290], looks = [BOWL_COAT.flour, BOWL_COAT.egg, BOWL_COAT.crumbs];
    let s = counter() + bowlDish(70, 186, "flour") + bowlDish(180, 186, "egg") + bowlDish(290, 186, "crumbs");
    let x = xs[0], y = 100, coat = -1;
    for (let i = 0; i < 3; i++) {
      const t0 = 0.15 + i * 1.15;
      if (t >= t0) {
        const dn = bph(t, t0, t0 + 0.35), up = bph(t, t0 + 0.5, t0 + 0.8), mv = i < 2 ? bph(t, t0 + 0.8, t0 + 1.15) : 0;
        y = lerp(100, 176, dn) - 76 * up;
        x = lerp(xs[i], xs[Math.min(2, i + 1)], mv);
        if (dn > 0.95) coat = i;
      }
    }
    const look = coat < 0 ? null : looks[coat];
    s += g(bowlCutlet(F, key, look), x, y - 8, 1.25);
    return s + g(fist(), x + 4, y - 58, 1.15);
  },
});

LIB.add({
  cat: "bowl", name: "dipegg", dur: 2.4,
  foods: ["chicken", "fish", "bread", "eggplant"],
  steps: ["Dip each piece in the beaten egg", "Dip the bread slices in the egg mixture", "Dip in egg, letting the excess drip off", "Dip the slices in the egg"],
  draw(t, F, key) {
    const dn = bph(t, 0.15, 0.6), up = bph(t, 0.85, 1.35);
    const y = lerp(96, 176, dn) - 80 * up;
    let s = counter() + bowlDish(180, 190, "egg", 1.9);
    const look = t > 0.6 ? (key === "bread" ? { fill: "#F3D36B" } : BOWL_COAT.egg) : null;
    s += g(bowlCutlet(F, key, look), 180, y, 1.15);
    if (t > 1.2) for (let i = 0; i < 4; i++) { const q = (t * 1.3 + i / 4) % 1; s += bowlDrop(160 + i * 14, lerp(y + 24, 186, q), 0.9, "#F7C94B", 1 - q * 0.6); }
    return s + g(fist(), 186, y - 46, 1.1);
  },
});

LIB.add({
  cat: "bowl", name: "presscrumbs", dur: 2.4,
  foods: ["chicken", "porkchop", "fish", "eggplant"],
  steps: ["Press into the breadcrumbs to coat", "Press both sides into the panko", "Coat well with breadcrumbs, pressing so they stick", "Press the cutlets firmly into the crumbs"],
  draw(t, F, key) {
    const k = bph(t, 0.2, 1.6);
    const press = t < 1.7 ? Math.abs(Math.sin(t / 1.7 * Math.PI * 2)) : 0;
    let s = counter() + `<path d="M48 168 L312 168 L298 210 L62 210 Z" fill="#fff" ${st()}/><ellipse cx="180" cy="170" rx="128" ry="12" fill="#E3B672" ${st(2.5)}/>` +
      [...Array(16)].map((_, i) => `<circle cx="${64 + (i * 53) % 232}" cy="${166 + (i * 5) % 9}" r="2.2" fill="#A8702E"/>`).join("");
    const look = { fill: bowlMix(key === "eggplant" ? F.inner : F.fill, "#E3B672", k), speck: k > 0.2 ? "#A8702E" : null };
    s += g(bowlCutlet(F, key, look), 180, 156 + press * 4, 1.5);
    for (let i = 0; i < 4; i++) { const q = (t * 2 + i / 4) % 1; if (press > 0.6) s += `<circle cx="${180 + (i % 2 ? 1 : -1) * (60 + q * 30)}" cy="${150 - Math.sin(q * Math.PI) * 16}" r="2.6" fill="#E3B672" ${st(1.2)}/>`; }
    return s + flatHand(180, lerp(96, 134, press));
  },
});

// ================= Marinate: zip bag, fridge =================

LIB.add({
  cat: "bowl", name: "zipbag", dur: 2,
  foods: ["chicken", "steak", "drumsticks", "shrimp", "tofu"],
  steps: ["Place the chicken in a zip-top bag with the marinade and massage to coat", "Seal the bag and massage the marinade into the meat", "Marinate in a zip-top bag", "Add the shrimp to the bag and toss in the marinade"],
  draw(t, F, key) {
    const w = Math.sin(t / 2 * Math.PI * 2), sqL = Math.max(0, w), sqR = Math.max(0, -w);
    const mar = LIQUIDS.marinade;
    let inner = `<path d="M-72 34 C-40 ${28 + w * 8} 40 ${28 - w * 8} 72 34 L74 70 C74 78 -74 78 -74 70 Z" fill="${mar}" opacity=".6"/>`;
    const items = key === "shrimp" ? [[-34, 10], [6, 30], [36, 0], [-10, -16]] : key === "tofu" ? [[-36, 14], [0, 30], [34, 10], [-4, -10]] : [[-24, 20], [24, 4]];
    items.forEach(([x, y], i) => { inner += g(key === "shrimp" ? whole(F) : key === "tofu" ? whole(F) : whole(F), x + w * (i % 2 ? 4 : -4), y + Math.sin(t * 6 + i) * 3, key === "shrimp" ? 0.42 : key === "tofu" ? 0.36 : 0.55, w * 10 + i * 20); });
    inner += `<g opacity=".35">${items.map(([x, y]) => `<ellipse cx="${x}" cy="${y + 6}" rx="22" ry="10" fill="${mar}"/>`).join("")}</g>`;
    let s = counter() + `<g transform="translate(180 132) scale(${1 - 0.05 * (sqL + sqR)} 1) translate(-180 -132)">${V.bag(inner, 180, 132, 1.05)}</g>`;
    s += `<path d="M106 58 L254 58" stroke="${C.blue}" stroke-width="7" stroke-linecap="round"/>`;
    return s + g(fist(), 92 + sqL * 16, 140, 1.4, 90) + g(fist(), 268 - sqR * 16, 140, 1.4, -90);
  },
});

LIB.add({
  cat: "bowl", name: "marinatefridge", dur: 3.2,
  foods: ["chicken", "beef", "shrimp", "tofu"],
  steps: ["Cover and refrigerate for at least 30 minutes", "Marinate in the fridge for 2 hours or overnight", "Cover the bowl and chill", "Refrigerate, covered, until ready to cook"],
  draw(t, F, key) {
    const open = bph(t, 0.2, 0.6) - bph(t, 2.2, 2.6), mv = bph(t, 0.8, 1.8);
    const x = lerp(300, 180, mv), y = lerp(176, 168, mv) - Math.sin(mv * Math.PI) * 50;
    let s = counter() + V.fridge(open);
    const inner = [-30, 0, 30].map((dx, i) => bowlSmall(F, i, dx, 10 + (i % 2) * 4, i * 30, key === "beef" ? 1.4 : 1.6)).join("") + `<ellipse cx="0" cy="18" rx="48" ry="8" fill="${LIQUIDS.marinade}" opacity=".45"/>`;
    const bowlS = V.smallBowl(0, 0, 0.62, inner) + T.wrap(0, -6, 108, 10);
    const inFridge = mv > 0.99;
    if (!inFridge || open > 0.05) s += g(bowlS, x, y);
    if (inFridge && open < 0.05) s += FX.cold(300, 70, 0.9);
    return s;
  },
});

// ================= Mixing by hand: eggs, wet + dry, add-ins, dissolve =================

LIB.add({
  cat: "bowl", name: "beateggs", dur: 2.4,
  foods: ["egg"],
  steps: ["Beat the eggs", "Beat the eggs with a fork", "Lightly beat the egg in a small bowl", "Whisk the eggs until smooth"],
  draw(t) {
    const k = bph(t, 0.2, 1.8);
    let inner = V.bowlFill(bowlMix("#FFF6DA", "#F7C94B", k), 150);
    [[150, 160], [212, 164]].forEach(([x, y], i) => { if (k < 0.95) inner += `<circle cx="${x + Math.sin(t * 8 + i) * 4 * k}" cy="${y}" r="${18 - 8 * k}" fill="#F7B92B" ${st(2.4)} opacity="${1 - k}"/>`; });
    if (k > 0.05 && k < 0.98) inner += [0, 1, 2].map(i => `<path d="M${110 + i * 40} ${158 + (i % 2) * 8} q20 ${-8 + Math.sin(t * 10 + i) * 6} 40 0" stroke="#F7B92B" stroke-width="5" fill="none" stroke-linecap="round" opacity="${Math.sin(k * Math.PI)}"/>`).join("");
    let s = bowlSide("#fff", inner);
    const a = t * 14;
    return s + g(T.fork(0, 0, 0) + g(fist(), 0, -100), 180 + Math.cos(a) * 46, 156 + Math.sin(a) * 4, 1, 28 + Math.sin(a) * 10);
  },
});

LIB.add({
  cat: "bowl", name: "wetintodry", dur: 3,
  foods: ["milk", "buttermilk", "eggs", "meltedbutter"],
  steps: ["Make a well in the center and add milk, melted butter, and egg; mix until smooth", "Stir the wet ingredients into the dry until just combined", "Add the buttermilk and stir until just combined", "Pour the wet ingredients into the dry ingredients"],
  draw(t, F) {
    const wet = F.liquid || F.inner, flour = "#FBF8EE";
    const pool = bph(t, 0.3, 1.2), k = bph(t, 1.4, 2.7);
    const mix = bowlMix(flour, wet === "#FFFFFF" || wet === "#FFFDF4" ? "#F3E6C4" : wet, 0.45 * k + 0.1 * k);
    let inner = `<path d="M70 150 C100 112 260 112 290 150 C280 198 80 198 70 150 Z" fill="${bowlMix(flour, mix, k)}" ${st(2.5)}/>`;
    if (k < 0.6) inner += `<ellipse cx="180" cy="128" rx="44" ry="10" fill="#EFE9DA" ${st(2)} opacity="${1 - k / 0.6}"/>`;
    if (pool > 0.02 && k < 0.7) inner += `<ellipse cx="180" cy="129" rx="${40 * pool}" ry="${8 * pool}" fill="${wet}" ${st(2)} opacity="${1 - k / 0.7}"/>`;
    for (let i = 0; i < 7; i++) if (k > 0.1) inner += `<circle cx="${110 + (i * 37) % 140}" cy="${132 + (i * 11) % 24}" r="${5 - i % 3}" fill="${flour}" ${st(1.6)} opacity="${1 - k * 0.6}"/>`;
    let s = bowlSide("#fff", inner);
    const tip = bph(t, 0.1, 0.35) - bph(t, 1.15, 1.4);
    if (tip > 0.9 && t > 0.3 && t < 1.2) s += FX.stream(214, 66, 186, 126, wet, 7);
    s += bowlPin(T.measuringCup(0, 0, 0, wet, lerp(0.7, 0.1, pool)), -24, -30, lerp(282, 216, tip), lerp(70, 64, tip), -80 * tip, 1.1);
    if (t > 1.35) { const a = (t - 1.35) * 6; s += T.spoon(180 + Math.cos(a) * 50, 140 + Math.sin(a) * 8, Math.cos(a) * 14); }
    return s;
  },
});

function bowlAddIn(key, F, x, y, r) {
  if (key === "chips") return piece(F, "bit", x, y, r);
  if (key === "nuts") return `<g transform="translate(${x} ${y}) rotate(${r})"><ellipse rx="8" ry="6" fill="${F.fill}" ${st(2)}/><path d="M0 -5 L0 5" stroke="${shade(F.fill)}" stroke-width="1.6"/></g>`;
  return `<circle cx="${x}" cy="${y}" r="${key === "raisins" ? 5.5 : 7}" fill="${F.inner}" ${st(2)}/>`;
}
LIB.add({
  cat: "bowl", name: "stirin", dur: 2.6,
  foods: ["raisins", "cranberries", "raspberries"],
  steps: ["Stir in the raisins", "Fold in the dried cranberries", "Gently fold in the raspberries", "Stir in the raisins until evenly distributed"],
  draw(t, F, key) {
    const batter = key === "raspberries" ? "#F6D9A3" : "#E2B97A";
    const tip = bph(t, 0.05, 0.3) - bph(t, 0.75, 0.95), k = bph(t, 1.0, 2.3);
    let inner = V.bowlFill(batter, 140) + `<path d="M110 160 q30 -10 60 0 M190 170 q30 -10 60 0" stroke="${shade(batter)}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    const landed = Math.floor(bph(t, 0.25, 0.8) * 12);
    for (let i = 0; i < landed; i++) {
      const px = 168 + (i * 7) % 26, py = 140 - (i % 3) * 5;
      const sx = 104 + (i * 47) % 150, sy = 148 + (i * 19) % 34;
      inner += bowlAddIn(key, F, lerp(px, sx, k), lerp(py, sy, k), i * 40);
    }
    let s = bowlSide("#fff", inner);
    if (tip > 0.5 && t < 0.85) for (let i = 0; i < 5; i++) { const q = (t * 2.2 + i / 5) % 1; s += bowlAddIn(key, F, lerp(210, 176 + i * 4, q), lerp(78, 136, q), q * 200); }
    s += bowlPin(V.smallBowl(0, 0, 0.45, `<ellipse cx="0" cy="6" rx="50" ry="10" fill="${key === "chips" ? F.fill : key === "nuts" ? F.fill : F.inner}"/>`), 30, 0, lerp(276, 214, tip), lerp(92, 74, tip), lerp(0, -60, tip), 1);
    if (t > 0.95) { const a = (t - 0.95) * 5; s += T.scraper(180 + Math.cos(a) * 54, 150 + Math.sin(a) * 6, Math.cos(a) * 20); }
    return s;
  },
});

LIB.add({
  cat: "bowl", name: "dissolve", dur: 2.4,
  foods: ["sugar", "salt", "leavening", "brownsugar"],
  steps: ["Dissolve baking soda in hot water", "Mix well to dissolve the sugar and set aside", "Stir until the salt dissolves", "Stir until the sugar is dissolved"],
  draw(t, F, key) {
    const grain = F.inner === "#FFFFFF" ? "#fff" : F.inner;
    const k = bph(t, 0.9, 2.0);
    const water = key === "brownsugar" ? bowlMix("#D2EAF8", "#E8B460", 0.75 * k) : C.water;
    let s = counter() + `<path d="M118 70 L242 70 L230 214 L130 214 Z" fill="#F4FAFF" ${st()}/>`;
    s += `<path d="M120 96 L240 96 L230 212 L130 212 Z" fill="${water}" opacity=".75"/><path d="M120 96 L240 96" ${st(2.5)}/>`;
    for (let i = 0; i < 12; i++) { const fall = bph(t, 0.35 + (i % 4) * 0.05, 0.9); const x = 150 + (i * 23) % 60 + Math.sin(t * 3 + i) * 6 * k; if (t > 0.35) s += `<rect x="${x}" y="${lerp(100, 196 - (i % 3) * 4, fall)}" width="5" height="5" fill="${grain}" stroke="${INK}" stroke-width="1" opacity="${1 - k}"/>`; }
    if (k > 0.05 && k < 0.98) s += `<path d="M140 150 q40 -14 80 0 M146 176 q34 12 68 0" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity="${Math.sin(k * Math.PI)}"/>`;
    s += `<path d="M118 70 L242 70 L230 214 L130 214 Z" fill="none" ${st()}/>`;
    if (t < 0.9) { const tip = bph(t, 0.1, 0.35); s += g(T.metalSpoon(0, 0, 0, tip < 0.8 ? grain : null) + g(fist(), 64, -60, 0.9), 176, 64, 1, -55 * tip); }
    else { const a = (t - 0.9) * 9; s += `<g opacity="${1 - bph(t, 2.0, 2.2)}">${g(`<ellipse rx="13" ry="9" fill="${C.steel}" ${st(3)}/><path d="M0 -6 L0 -150" ${st(6)}/><path d="M0 -6 L0 -150" stroke="${C.steel}" stroke-width="2.5" stroke-linecap="round"/>` + g(fist(), 0, -144), 180 + Math.cos(a) * 26, 180, 1, Math.cos(a) * 8)}</g>`; }
    if (t > 2.05) s += T.check(296, 60, 0.8);
    return s;
  },
});

// ================= Dressings and salads =================

LIB.add({
  cat: "bowl", name: "shakejar", dur: 1.8,
  foods: ["dressing", "marinade"],
  steps: ["Shake the dressing in a jar until combined", "Shake or stir", "Add everything to a jar and shake well", "Shake the marinade until well mixed"],
  draw(t, F, key) {
    const shaking = t > 0.15 && t < 1.35 ? 1 : 0, k = bph(t, 0.2, 1.1);
    const dy = shaking * Math.sin(t * 28) * 12;
    const bottom = key === "marinade" ? "#4A2A1A" : "#F4E1A8", top = C.oil, mixed = F.liquid;
    let jar = `<rect x="-46" y="-56" width="92" height="120" rx="14" fill="#F4FAFF" ${st()}/>`;
    jar += `<path d="M-42 -14 L42 -14 L42 54 C42 60 -42 60 -42 54 Z" fill="${bottom}"/><path d="M-42 -14 L42 -14 L42 14 L-42 14 Z" fill="${top}"/>`;
    jar += `<path d="M-42 -14 L42 -14 L42 54 C42 60 -42 60 -42 54 Z" fill="${mixed}" opacity="${k}"/><path d="M-42 -14 L42 -14" ${st(2.5)}/>`;
    jar += [[-24, 20], [10, 34], [24, 4], [-8, 44], [-30, 0]].map(([x, y]) => `<circle cx="${x}" cy="${y + (shaking ? Math.sin(t * 20 + x) * 6 : 0)}" r="2.6" fill="#3E8E41"/>`).join("");
    jar += `<rect x="-46" y="-56" width="92" height="120" rx="14" fill="none" ${st()}/><rect x="-50" y="-76" width="100" height="24" rx="6" fill="${C.steel}" ${st()}/>`;
    jar += g(fist(), 0, -86, 1.2) + g(fist(), 0, 72, 1.2, 180);
    let s = counter() + g(jar, 180, 124 + dy);
    if (shaking) s += FX.shake(180, 124, 2.0);
    return s;
  },
});

LIB.add({
  cat: "bowl", name: "emulsify", dur: 2.4,
  foods: ["oil"],
  steps: ["Gradually pour in the oil, whisking constantly, until emulsified", "Slowly whisk in the olive oil", "Whisk the vinegar and mustard, then drizzle in the oil", "Stream in the oil while whisking"],
  draw(t) {
    const k = bph(t, 0.1, 2.2);
    let s = bowlSide("#fff", V.bowlFill(bowlMix("#F4E1A8", "#F2D27A", k), 150) + `<path d="M120 166 q30 -8 60 0" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity="${k}"/>`);
    s += FX.stream(104, 76, 126, 150, C.oil, 3);
    s += bowlPin(bowlBottle(C.oil), 0, -44, 102, 72, 135, 0.85);
    const sway = Math.sin(t / 2.4 * Math.PI * 6);
    return s + T.whisk(196 + sway * 40, 160, sway * 12);
  },
});

const bowlSaladBit = (F, i, x, y, r) => ["cabbage", "redcabbage"].includes(F.k) ? piece(F, "shred", x, y, r, 1.8) : F.type === "leafy" ? g(whole(F), x, y, 0.4, r) : piece(F, F.type === "long" ? "coin" : "chunk", x, y, r, 1.3);
LIB.add({
  cat: "bowl", name: "dresssalad", dur: 2.6,
  foods: ["lettuce", "spinach", "greens", "kale", "cabbage"],
  steps: ["Toss the salad with the dressing", "Pour the dressing over the greens and toss", "Drizzle with dressing and toss to coat", "Toss the slaw with the dressing"],
  draw(t, F, key) {
    const FF = { ...F, k: key };
    const tip = bph(t, 0.05, 0.3) - bph(t, 0.8, 1.0), toss = t > 1.0;
    let s = bowlSide("#fff");
    const n = key.includes("cabbage") ? 16 : 9;
    for (let i = 0; i < n; i++) {
      const ph = toss ? ((t - 1.0) / 0.8 + i / n) % 1 : 0, h = toss ? Math.sin(ph * Math.PI) * (36 + (i % 3) * 12) : 0;
      s += bowlSaladBit(FF, i, 96 + (i * 59) % 170, 120 - (i % 3) * 8 - h, (i * 53) % 90 + ph * 120);
    }
    if (t > 0.5) for (let i = 0; i < 6; i++) s += `<circle cx="${120 + i * 24}" cy="${112 + (i % 2) * 10 - (toss ? Math.sin(t * 6 + i) * 10 : 0)}" r="3.4" fill="#F2D27A" ${st(1.4)}/>`;
    if (tip > 0.9 && t < 0.82) s += FX.stream(222, 62, 196, 110, "#F2D27A", 5);
    s += bowlPin(T.measuringCup(0, 0, 0, "#F2D27A", lerp(0.6, 0.15, bph(t, 0.3, 0.8))), -24, -30, lerp(290, 224, tip), lerp(76, 60, tip), -80 * tip, 0.9);
    if (toss) { const lift = Math.abs(Math.sin((t - 1.0) / 0.8 * Math.PI)); s += T.tongs(150 + lift * 10, 150 - lift * 30, -20, 0.5 - lift * 0.3); }
    return s;
  },
});

LIB.add({
  cat: "bowl", name: "massagekale", dur: 2,
  foods: ["kale", "cabbage", "redcabbage"],
  steps: ["Massage the kale with the dressing until it softens", "Massage the kale with your hands for 2 minutes", "Massage the cabbage with the salt until it wilts", "Rub the kale between your fingers until dark and tender"],
  draw(t, F, key) {
    const k = bph(t, 0, 1.8), w = Math.sin(t / 2 * Math.PI * 4), sqL = Math.max(0, w), sqR = Math.max(0, -w);
    const FF = { ...F, fill: bowlMix(F.fill, "#1E4A26", key === "kale" ? 0.35 * k : 0.15 * k) };
    let inner = "";
    const n = key === "kale" ? 9 : 18;
    for (let i = 0; i < n; i++) {
      const x = 104 + (i * 61) % 152, y = 136 + (i * 17) % 34;
      inner += key === "kale" ? g(whole(FF), x, y, lerp(0.42, 0.32, k), i * 40) : piece(F, "shred", x, y, i * 30, lerp(1.9, 1.5, k));
    }
    let s = bowlSide("#fff", inner);
    return s + g(fist(), 140, 112 + sqL * 22, 1.35) + g(fist(), 220, 112 + sqR * 22, 1.35);
  },
});

// ================= Hands in: meat, patties, balls, stuffing =================

LIB.add({
  cat: "bowl", name: "mixmeat", dur: 1.8,
  foods: ["groundbeef", "groundturkey", "groundpork"],
  steps: ["Using your hands, mix until evenly combined", "Combine ground beef, onion, milk, bread crumbs, and egg in a large bowl", "Mix the meatball ingredients with your hands; don't overmix", "Gently mix the meat with the seasonings"],
  draw(t, F) {
    const w = Math.sin(t / 1.8 * Math.PI * 4), sqL = Math.max(0, w), sqR = Math.max(0, -w);
    let inner = `<path d="M92 160 C96 ${126 + w * 4} 140 ${118 - sqL * 6} 180 ${122} C220 ${118 - sqR * 6} 264 ${126 - w * 4} 268 160 C250 194 110 194 92 160 Z" fill="${F.fill}" ${st()}/>` +
      [...Array(9)].map((_, i) => `<path d="M${112 + (i * 37) % 140} ${142 + (i * 13) % 34} q4 -4 8 0" stroke="${F.mark}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`).join("");
    const specks = ["#E8C88A", "#3E8E41", "#F7C94B", "#FBF4E4"];
    for (let i = 0; i < 12; i++) { const a = i * 2.4 + t * 1.5; inner += `<circle cx="${180 + Math.cos(a) * (20 + (i % 4) * 14)}" cy="${150 + Math.sin(a) * 12}" r="3.4" fill="${specks[i % 4]}" ${st(1.4)}/>`; }
    let s = bowlSide("#fff", inner);
    for (const [x, sq] of [[140, sqL], [220, sqR]]) {
      if (sq > 0.5) s += [-14, 0, 14].map(d => `<circle cx="${x + d}" cy="${152 - sq * 6}" r="6" fill="${F.fill}" ${st(2)}/>`).join("");
      s += g(fist(), x, 106 + sq * 30, 1.4, 180);
    }
    return s;
  },
});

LIB.add({
  cat: "bowl", name: "formpatty", dur: 3,
  foods: ["groundbeef", "groundturkey", "groundpork", "veggiepatty"],
  steps: ["Form into 4 patties, about 1/2 inch thick", "Make a small indent in the middle of the patty with your thumb", "Shape the meat into patties", "Divide the mixture and form into burgers"],
  draw(t, F) {
    const flat = bph(t, 0.1, 0.8), drop = bph(t, 0.9, 1.4), thumb = Math.sin(seg(t, 1.6, 2.4) * Math.PI), dent = bph(t, 1.8, 2.0);
    let s = counter() + `<rect x="50" y="196" width="260" height="16" rx="6" fill="${C.steelDark}" ${st()}/><path d="M64 196 L296 196" stroke="${C.parchment}" stroke-width="5"/>`;
    const PF = F.type === "patty" ? F : { type: "patty", fill: F.fill, mark: F.mark };
    if (t < 0.9) {
      const rx = lerp(30, 56, flat), ry = lerp(30, 14, flat);
      s += `<ellipse cx="180" cy="${126}" rx="${rx}" ry="${ry}" fill="${F.fill}" ${st()}/>` + [[-12, -6], [8, 4], [14, -10]].map(([a, b]) => `<circle cx="${180 + a * rx / 30}" cy="${126 + b * ry / 30}" r="3" fill="${F.mark || shade(F.fill)}" opacity=".7"/>`).join("");
      s += flatHand(180, 126 - ry) + `<g transform="translate(180 ${126 + ry}) scale(1 -1)">${flatHand(0, 0)}</g>`;
    } else {
      const y = lerp(126, 180, drop);
      s += g(whole(PF), 180, y, 0.95);
      if (dent > 0) s += `<ellipse cx="180" cy="${y - 2}" rx="${14 * dent}" ry="${5 * dent}" fill="${shade(F.fill)}" ${st(1.6)}/>`;
      if (t > 1.5 && t < 2.5) s += g(fist(), 180, lerp(110, 156, thumb), 1.2, 180);
    }
    if (t > 2.5) s += T.check(296, 60, 0.8);
    return s;
  },
});

LIB.add({
  cat: "bowl", name: "rollballs", dur: 1.6,
  foods: ["groundbeef", "groundturkey", "cookiedough", "dough"],
  steps: ["Roll into 1-inch meatballs", "Roll the dough into balls", "Shape the mixture into 12 meatballs", "Roll the cookie dough into balls and place on the sheet"],
  draw(t, F, key) {
    const a = t / 1.6 * Math.PI * 2 * 2;
    const ball = (x, y, r, rot = 0) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${F.fill}" ${st(3)}/>` + (F.type === "ground" ? [[-6, -4], [5, 3], [2, -8]].map(([p, q]) => `<circle cx="${x + p * r / 16}" cy="${y + q * r / 16}" r="2" fill="${F.mark}"/>`).join("") : key === "cookiedough" ? [[-5, -4], [6, 2], [-1, 7]].map(([p, q]) => `<circle cx="${x + p * r / 16}" cy="${y + q * r / 16}" r="2.6" fill="#4A2A1A"/>`).join("") : "") +
      `<path d="M${x - r * 0.5} ${y - r * 0.3} q${r * 0.3} ${-r * 0.4} ${r * 0.6} ${-r * 0.3}" stroke="#fff" stroke-width="3" fill="none" opacity=".6" transform="rotate(${rot} ${x} ${y})"/>`;
    let s = counter() + `<rect x="40" y="196" width="280" height="16" rx="6" fill="${C.steelDark}" ${st()}/>`;
    for (let i = 0; i < 6; i++) s += ball(70 + i * 44, 182, 14);
    s += g(fist(), 180 + Math.cos(a) * 10, 70 + Math.sin(a) * 3, 1.15, 180) + g(fist(), 180 - Math.cos(a) * 10, 150, 1.15);
    s += ball(180 + Math.cos(a) * 3, 112, 22, a * 60);
    return s;
  },
});

const bowlFilling = (key) => key === "chicken" ? ["#E9F0D8", "#3E8E41"] : key === "mushroom" ? ["#E8C88A", "#3E8E41"] : ["#B5734A", "#FBF4E4"];
function bowlStuffVessel(F, key, fill, k) {
  const [fc, sc] = fill, mound = (w, y) => k > 0.02 ? `<path d="M${-w} ${y} Q0 ${y - 30 * k} ${w} ${y} Z" fill="${fc}" ${st(2.5)}/>` + [[-w * 0.4, y - 8 * k], [w * 0.3, y - 12 * k], [0, y - 4]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="3" fill="${sc}"/>`).join("") : "";
  if (F.type === "pepper") return `<path d="M-64 -8 C-66 30 64 30 64 -8 Z" fill="${F.fill}" ${st()}/><ellipse cx="0" cy="-8" rx="62" ry="12" fill="${F.inner}" ${st(3)}/>${mound(56, -8)}<path d="M64 -6 C76 -10 80 -18 82 -26" ${st(7)} fill="none" stroke="#3E8E41"/>`;
  if (key === "zucchini") return `<path d="M-90 -6 C-80 22 80 22 90 -6 Z" fill="${F.fill}" ${st()}/><ellipse cx="0" cy="-6" rx="88" ry="9" fill="${F.inner}" ${st(3)}/>${mound(80, -6)}`;
  if (key === "mushroom") return `<path d="M-56 -6 C-52 34 52 34 56 -6 Z" fill="${F.fill}" ${st()}/><ellipse cx="0" cy="-6" rx="54" ry="11" fill="${F.inner}" ${st(3)}/>${[-40, -24, -8, 8, 24, 40].map(x => `<path d="M${x * 0.4} -6 L${x} ${-6 + (Math.abs(x) > 30 ? 3 : 8)}" stroke="#C9A27A" stroke-width="2"/>`).join("")}${mound(46, -6)}`;
  if (key === "tomato") return `<path d="M-50 -10 C-56 40 56 40 50 -10 Z" fill="${F.fill}" ${st()}/><ellipse cx="0" cy="-10" rx="48" ry="11" fill="${F.inner}" ${st(3)}/>${mound(42, -10)}<g transform="translate(-92 14) rotate(-12)"><path d="M-22 6 C-22 -16 22 -16 22 6 Z" fill="${F.fill}" ${st(3)}/><path d="M-10 -12 L0 -22 L10 -12" fill="#3E8E41" ${st(2.4)}/></g>`;
  // chicken breast with a pocket cut in the side
  return g(whole(F), 0, 4, 1.1) + `<path d="M-40 4 C-10 -6 20 -6 46 2" fill="none" ${st(4)}/>` + (k > 0.02 ? `<path d="M-34 4 C-10 ${-4 - 10 * k} 20 ${-4 - 10 * k} 40 2 C20 6 -10 6 -34 4 Z" fill="${fc}" ${st(2)}/><circle cx="-6" cy="${-2 - 4 * k}" r="2.6" fill="${sc}"/><circle cx="16" cy="${-3 - 4 * k}" r="2.6" fill="${sc}"/>` : "");
}
LIB.add({
  cat: "bowl", name: "stuff", dur: 2.4,
  foods: ["mushroom", "zucchini", "tomato", "chicken"],
  steps: ["Stuff the mushroom caps with the filling", "Spoon the filling into the mushroom caps", "Fill each zucchini boat with the mixture", "Cut a pocket in each chicken breast and stuff with the filling"],
  draw(t, F, key) {
    const fill = bowlFilling(key);
    const trip = Math.floor(t / 1.0), u = (t % 1.0) / 1.0;
    const k = t < 2.0 ? clamp((trip + (u > 0.7 ? 1 : 0)) / 2) : 1;
    let s = counter() + V.smallBowl(78, 180, 0.5, `<ellipse cx="0" cy="8" rx="56" ry="10" fill="${fill[0]}"/>`);
    s += g(bowlStuffVessel(F, key, fill, k), 220, 182);
    if (t < 2.0) {
      let x, y, r = 0;
      if (u < 0.2) { x = 78; y = lerp(156, 170, Math.sin(u / 0.2 * Math.PI)); }
      else if (u < 0.55) { const q = ease((u - 0.2) / 0.35); x = lerp(78, 214, q); y = 150 - Math.sin(q * Math.PI) * 40; }
      else if (u < 0.8) { x = 214; y = 150; r = -50 * Math.sin(seg(u, 0.55, 0.8) * Math.PI); }
      else { const q = ease((u - 0.8) / 0.2); x = lerp(214, 78, q); y = 153 - Math.sin(q * Math.PI) * 30; }
      s += g(T.metalSpoon(0, 0, 0, u < 0.7 ? fill[0] : null) + g(fist(), 64, -60, 0.9), x, y, 1, r);
    }
    return bowlZoom(s, 1.2, 170);
  },
});

// ================= Crush, mash =================

function bowlCrumb(key, F, x, y, r, whole_) {
  if (whole_) {
    if (key === "crackers") return `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-14" y="-14" width="28" height="28" rx="4" fill="${F.fill}" ${st(2.4)}/>${[[-6, -6], [6, -6], [-6, 6], [6, 6]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="1.6" fill="${shade(F.fill)}"/>`).join("")}</g>`;
    if (key === "cookies") return `<g transform="translate(${x} ${y})"><circle r="14" fill="${F.fill}" ${st(2.4)}/><circle cx="-5" cy="-4" r="2.4" fill="${F.chips}"/><circle cx="5" cy="3" r="2.4" fill="${F.chips}"/></g>`;
    if (key === "nuts") return `<g transform="translate(${x} ${y}) rotate(${r})"><ellipse rx="12" ry="9" fill="${F.fill}" ${st(2.4)}/><path d="M0 -8 L0 8" stroke="${shade(F.fill)}" stroke-width="2"/></g>`;
    if (key === "bread") return piece(F, "cube", x, y, r, 1.3);
    if (key === "oats") return `<ellipse cx="${x}" cy="${y}" rx="7" ry="4.5" fill="#E8D08A" ${st(1.6)} transform="rotate(${r} ${x} ${y})"/>`;
    return `<path transform="translate(${x} ${y}) rotate(${r})" d="M-12 -6 L8 -10 L13 4 L-4 9 L-12 4 Z" fill="${F.fill}" ${st(2.2)}/>`;
  }
  const c = key === "cookies" ? F.fill : key === "bread" ? "#E8C88A" : key === "oats" ? "#E8D08A" : F.fill;
  return `<circle cx="${x}" cy="${y}" r="2.6" fill="${c}" ${st(1.2)}/>`;
}
LIB.add({
  cat: "bowl", name: "crushbag", dur: 2.4,
  foods: ["crackers", "cookies", "nuts", "cornflakes"],
  steps: ["Crush the graham crackers in a zip-top bag with a rolling pin", "Place the cookies in a bag and crush into fine crumbs", "Crush the cornflakes", "Lightly crush the nuts"],
  draw(t, F, key) {
    const k = bph(t, 0.1, 2.0);
    let s = board() + `<rect x="74" y="80" width="212" height="132" rx="12" fill="#EAF6FF" opacity=".9" ${st()}/><path d="M80 94 L280 94" stroke="${C.blue}" stroke-width="5"/>`;
    const n = 10, left = Math.round((1 - k) * n);
    for (let i = 0; i < n; i++) if (i < left) s += bowlCrumb(key, F, 104 + (i % 5) * 38, 128 + Math.floor(i / 5) * 44 + (i % 2) * 6, i * 37, true);
    for (let i = 0; i < Math.round(k * 60); i++) s += bowlCrumb(key, F, 92 + (i * 37) % 178, 110 + (i * 23) % 92, 0, false);
    const y = 110 + (Math.sin(t / 2.4 * Math.PI * 6 - Math.PI / 2) + 1) / 2 * 76;
    return s + T.rollingPin(180, y);
  },
});

LIB.add({
  cat: "bowl", name: "forkmash", dur: 1.6,
  foods: ["blackbeans", "chickpeas", "avocado", "banana", "strawberry"],
  steps: ["Mash the beans with a fork", "Mash the avocado with a fork, leaving it a little chunky", "Mash the bananas with a fork", "Mash the berries with a fork"],
  draw(t, F) {
    const paste = F.type === "grains" ? F.inner : F.inner;
    const press = Math.abs(Math.sin(t / 1.6 * Math.PI * 2)), side = Math.sin(t / 1.6 * Math.PI * 2) > 0 ? -1 : 1;
    let inner = V.bowlFill(paste, 160) + `<path d="M110 172 q20 -6 40 0 M200 176 q20 -6 40 0" stroke="${shade(paste)}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    for (let i = 0; i < 8; i++) { const x = 112 + i * 19, near = Math.abs(x - (180 + side * 30)) < 30 ? press : 0; inner += F.type === "grains" ? `<ellipse cx="${x}" cy="${156 - (i % 2) * 6}" rx="${8 + near * 4}" ry="${5 - near * 2.5}" fill="${F.inner}" ${st(1.8)}/>` : piece(F, "chunk", x, 154 - (i % 2) * 6, i * 40, lerp(1.2, 0.8, near)); }
    let s = bowlSide("#fff", inner);
    return s + g(T.fork(0, 0, 0) + g(fist(), 0, -100), 180 + side * 30, lerp(100, 152, press), 1, side * 8);
  },
});

// ================= Blender and food processor =================

const bowlBlendBit = (F, i, x, y, r) => F.type === "grains" ? piece(F, "bit", x, y, r, 1.9) : F.type === "leafy" ? g(whole(F), x, y, 0.36, r) : piece(F, F.type === "long" ? "coin" : "chunk", x, y, r, 1.5);
LIB.add({
  cat: "bowl", name: "smoothie", dur: 3.2,
  foods: ["banana", "strawberry", "blueberries", "mango", "pineapple", "spinach"],
  steps: ["Add the fruit and milk to the blender and blend until smooth", "Blend on high until smooth and creamy", "Add ingredients to the blender in order", "Blend the smoothie until thick"],
  draw(t, F) {
    const base = F.type === "leafy" ? F.fill : F.type === "grains" ? F.inner : F.inner;
    const smooth = bowlMix(base, "#FFFFFF", F.type === "leafy" ? 0.25 : 0.3);
    const drop = bph(t, 0.05, 0.8), milk = bph(t, 0.85, 1.4), lid = bph(t, 1.45, 1.65), k = bph(t, 1.8, 2.8);
    const level = lerp(158, 92, milk);
    let inner = "";
    if (milk > 0.02) inner += bowlJarFill(k > 0 ? bowlMix("#FFFFFF", smooth, k) : "#FFFFFF", level + (k > 0 ? Math.sin(t * 30) * 2 : 0));
    const spin = k > 0 ? t * 14 : 0;
    for (let i = 0; i < 7; i++) {
      const y0 = 140 - (i % 3) * 14, x0 = 150 + (i * 23) % 60;
      const y = lerp(16 - (i % 3) * 8, y0, clamp(drop * 1.6 - i * 0.1));
      if (k < 0.95 && drop * 1.6 - i * 0.1 > 0) inner += `<g opacity="${1 - k}">${bowlBlendBit(F, i, k > 0 ? 180 + Math.cos(spin + i) * 26 : x0, k > 0 ? 130 + Math.sin(spin * 0.8 + i) * 22 : y, i * 50 + spin * 40)}</g>`;
    }
    let s = counter() + bowlBlender(inner, lid > 0.01, (1 - lid) * 26);
    if (milk > 0.02 && milk < 0.98) s += FX.stream(206, 40, 190, level, "#FFFFFF", 7);
    if (t > 0.8 && t < 1.5) s += bowlPin(bowlCarton("#FFFFFF"), -6, -52, 210, 36, -110 * (bph(t, 0.8, 0.9) - bph(t, 1.4, 1.5)), 0.9);
    if (k > 0) s += `<path d="M108 80 l-12 -4 M108 110 l-14 0 M252 80 l12 -4 M252 110 l14 0" ${st(3)}/>`;
    return s;
  },
});

function bowlProcScene(t, inner, pulse = 0) {
  return counter() + V.processor(inner) + (pulse ? g(fist(), 150, 190 + pulse * 3, 0.9, 180) : "");
}
LIB.add({
  cat: "bowl", name: "pulsecrumbs", dur: 2.4,
  foods: ["bread", "crackers", "cookies", "nuts"],
  steps: ["Pulse the bread into coarse crumbs", "Pulse the crackers until fine crumbs form", "Blitz the cookies in a food processor until finely ground", "Pulse the nuts until finely chopped"],
  draw(t, F, key) {
    const k = bph(t, 0.1, 2.0), pulse = Math.max(0, Math.sin(t / 2.4 * Math.PI * 8)), on = pulse > 0.3;
    const crumb = key === "bread" ? "#E8C88A" : key === "cookies" ? F.fill : F.fill;
    let inner = k > 0.05 ? bowlProcFill(crumb, lerp(166, 140, k)) : "";
    if (k > 0.05) inner += [...Array(12)].map((_, i) => `<circle cx="${124 + (i * 31) % 112}" cy="${lerp(164, 144, k) + (i * 7) % 18}" r="2.2" fill="${shade(crumb)}"/>`).join("");
    const n = Math.round((1 - k) * 8);
    for (let i = 0; i < n; i++) inner += bowlCrumb(key, F, 130 + (i * 29) % 100, 150 - (i % 3) * 18 - (on ? Math.abs(Math.sin(t * 20 + i)) * 20 : 0), i * 40 + (on ? t * 300 : 0), true);
    inner += bowlBlade(on ? t : 0);
    return bowlProcScene(t, inner, pulse);
  },
});

LIB.add({
  cat: "bowl", name: "puree", dur: 2.4,
  foods: ["soup", "tomatosauce", "squash", "carrot", "broccoli"],
  steps: ["Place about 4 cups of soup in a blender and blend until smooth", "Puree the sauce until silky", "Blend the soup in batches until smooth", "Puree until completely smooth"],
  draw(t, F, key) {
    const liquidColor = F.liquid ? F.liquid : bowlMix(F.type === "tree" ? F.fill : F.inner, "#FFF6E3", 0.2);
    const k = bph(t, 0.2, 1.8);
    let inner = bowlJarFill(liquidColor, 84 + Math.sin(t * 30) * 2);
    const chunkF = F.liquid ? { ...FOODS.food, type: "round", fill: key === "tomatosauce" ? "#E8503C" : "#F08A3C", inner: key === "tomatosauce" ? "#F07A62" : "#F6B27A" } : F;
    for (let i = 0; i < 7; i++) inner += `<g opacity="${1 - k}">${piece(chunkF, "chunk", 180 + Math.cos(t * 12 + i) * 28, 124 + Math.sin(t * 10 + i * 2) * 26, t * 400 + i * 50, lerp(1.4, 0.6, k))}</g>`;
    if (k > 0.2) inner += `<path d="M150 112 q30 -12 60 0" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity="${k}"/>`;
    let s = counter() + bowlBlender(inner, true, 0);
    return s + `<path d="M108 80 l-12 -4 M108 110 l-14 0 M252 80 l12 -4 M252 110 l14 0" ${st(3)}/>`;
  },
});

LIB.add({
  cat: "bowl", name: "pesto", dur: 2.6,
  foods: ["basil", "parsley", "cilantro", "kale"],
  steps: ["Blend the basil, pine nuts, garlic and parmesan, then stream in the oil", "Pulse the herbs with the garlic and nuts", "With the processor running, slowly add the olive oil", "Process until a smooth pesto forms"],
  draw(t, F) {
    const k = bph(t, 0.3, 2.2);
    let inner = k > 0.05 ? bowlProcFill(bowlMix(F.fill, "#7DB04A", 0.3), lerp(168, 134, k)) : "";
    for (let i = 0; i < 6; i++) inner += `<g opacity="${1 - k}">${g(whole(F), 132 + (i * 37) % 100, 140 - (i % 2) * 22 + Math.sin(t * 16 + i) * 8, 0.36, t * 300 + i * 60)}</g>`;
    for (let i = 0; i < 4; i++) inner += `<ellipse cx="${140 + i * 26}" cy="${160 - (i % 2) * 10}" rx="6" ry="4" fill="#F7EDC9" ${st(1.6)} opacity="${1 - k}"/>`;
    inner += bowlBlade(t);
    let s = bowlProcScene(t, inner);
    if (t > 0.3 && t < 2.0) s += FX.stream(180, 0, 180, 60, C.oil, 3);
    return s;
  },
});

LIB.add({
  cat: "bowl", name: "hummus", dur: 2.4,
  foods: ["chickpeas", "blackbeans", "edamame"],
  steps: ["Blend the chickpeas, tahini, lemon juice and garlic until smooth", "Process the beans until creamy", "Blend until very smooth, adding water as needed", "Puree the dip until smooth"],
  draw(t, F, key) {
    const paste = key === "chickpeas" ? "#E8D2A0" : key === "blackbeans" ? "#4A4038" : "#A6CF7A";
    const k = bph(t, 0.2, 1.9);
    let inner = bowlProcFill(bowlMix(F.inner, paste, k), lerp(150, 132, k)) + `<path d="M130 ${lerp(150, 132, k) + 8} q24 -8 48 0 q24 8 48 0" stroke="${shade(paste)}" stroke-width="3" fill="none" opacity="${k}"/>`;
    for (let i = 0; i < 12; i++) inner += `<g opacity="${1 - k}">${piece(F, "bit", 124 + (i * 31) % 112, 136 + (i * 13) % 24 + Math.sin(t * 18 + i) * 6, i * 30, 1.8)}</g>`;
    inner += `<path transform="translate(${170 + Math.sin(t * 9) * 20} ${140}) rotate(${t * 200})" d="M-14 6 C-14 -10 14 -10 14 6 Z" fill="#F7D84B" ${st(2.2)} opacity="${1 - k}"/>`;
    inner += bowlBlade(t);
    return bowlProcScene(t, inner);
  },
});

// ================= Eggs and cream =================

LIB.add({
  cat: "bowl", name: "separate", dur: 2.4,
  foods: ["egg"],
  steps: ["Separate the eggs", "Separate the yolks from the whites", "In a small bowl combine the egg yolk and parmesan", "Keep the yolks and let the whites drop into the bowl"],
  draw(t) {
    const pass = (Math.sin(t / 2.4 * Math.PI * 2 - Math.PI / 2) + 1) / 2;
    const yx = lerp(132, 228, pass), yy = 96 - Math.sin(pass * Math.PI) * 30 * (Math.abs(Math.cos(pass * Math.PI)) < 0.9 ? 1 : 0);
    let s = bowlSide("#fff", `<ellipse cx="180" cy="168" rx="80" ry="16" fill="#FFFDF5" ${st(2.4)}/><ellipse cx="180" cy="168" rx="56" ry="9" fill="none" stroke="#EAF2F8" stroke-width="3"/>`);
    const shell = (x, r) => g(`<path d="M-30 0 C-30 34 30 34 30 0 L22 -6 L14 2 L6 -6 L-2 2 L-10 -6 L-18 2 L-26 -6 Z" fill="${FOODS.egg.fill}" ${st(3)}/>` + g(fist(), 0, 40, 0.9, 180), x, 104, 1, r);
    s += shell(132, 14 * pass) + shell(228, -14 * (1 - pass));
    s += `<path d="M${yx - 22} ${yy + 4} C${yx - 18} ${yy + 22} ${yx + 18} ${yy + 22} ${yx + 22} ${yy + 4}" fill="#FFFDF5" stroke="#C9D6E0" stroke-width="2"/><circle cx="${yx}" cy="${yy}" r="15" fill="#F7B92B" ${st(2.6)}/>`;
    for (let i = 0; i < 3; i++) { const q = (t * 1.2 + i / 3) % 1; s += `<ellipse cx="${(i % 2 ? 132 : 228) + 4}" cy="${lerp(128, 166, q)}" rx="5" ry="8" fill="#FFFDF5" stroke="#C9D6E0" stroke-width="2" opacity="${1 - q}"/>`; }
    return s;
  },
});

LIB.add({
  cat: "bowl", name: "creambutter", dur: 2,
  foods: ["butter", "creamcheese"],
  steps: ["Beat the butter and sugar until light and fluffy", "Cream together butter and sugars until combined", "Beat the cream cheese until smooth", "Beat butter with an electric mixer until creamy"],
  draw(t, F, key) {
    const k = bph(t, 0, 1.7);
    const color = key === "butter" ? bowlMix("#F7D86A", "#FFF3C8", k) : bowlMix("#F4EFDF", "#FFFFFF", k);
    let inner = V.bowlFill(color, lerp(152, 136, k));
    for (let i = 0; i < 6; i++) inner += `<path d="M${96 + i * 30} ${lerp(152, 136, k)} q12 ${-10 - 6 * k} 24 0" fill="${color}" ${st(2.2)}/>`;
    if (key === "butter" && k < 0.9) for (let i = 0; i < 10; i++) inner += `<rect x="${110 + (i * 29) % 140}" y="${lerp(152, 136, k) + 6 + (i * 7) % 18}" width="4" height="4" fill="#fff" stroke="${INK}" stroke-width="1" opacity="${1 - k}"/>`;
    const sway = Math.sin(t / 2 * Math.PI * 4);
    return bowlSide("#fff", inner) + bowlMixer(180 + sway * 40, lerp(156, 142, k), sway * 8, Math.sin(t * 30));
  },
});

LIB.add({
  cat: "bowl", name: "whipcream", dur: 2.8,
  foods: ["cream", "egg"],
  steps: ["Whip the cream to stiff peaks", "Beat the egg whites until stiff peaks form", "Whip the heavy cream until soft peaks form", "Beat until the whites hold their shape"],
  draw(t, F, key) {
    const k = bph(t, 0.1, 2.0), lift = bph(t, 2.1, 2.5);
    const base = key === "egg" ? bowlMix("#F4F0DC", "#FFFFFF", k) : "#FFFFFF";
    const y = lerp(160, 122, k);
    let inner = V.bowlFill(base, y);
    for (let i = 0; i < 7; i++) inner += `<path d="M${88 + i * 27} ${y} q13 ${-4 - 16 * k} 27 0" fill="${base}" ${st(2.2)}/>`;
    if (lift > 0) inner += `<path d="M164 ${y} C172 ${y - 10} 176 ${y - 36 * lift} 180 ${y - 46 * lift} C184 ${y - 36 * lift} 188 ${y - 10} 196 ${y} Z" fill="${base}" ${st(2.4)}/>`;
    const sway = t < 2.05 ? Math.sin(t / 2 * Math.PI * 4) : 0;
    let s = bowlSide("#fff", inner);
    if (lift > 0.9) s += T.check(300, 60, 0.8);
    return s + bowlMixer(180 + sway * 44, lerp(y + 18, y - 60, lift), sway * 8, lift > 0 ? 0 : Math.sin(t * 30));
  },
});

LIB.add({
  cat: "bowl", name: "spicemix", dur: 2,
  foods: null,
  steps: ["In a small bowl, combine paprika, garlic powder, salt, pepper, and oregano", "Mix the spices together", "Stir together the seasoning blend", "Combine the salt, garlic powder, paprika, and ground black pepper"],
  draw(t) {
    const k = bph(t, 0.2, 1.6);
    const piles = [["#D9443A", 120], ["#F7EDC9", 158], ["#C9A26B", 200], ["#3B3B3B", 240]];
    let inner = `<path d="M100 170 C130 ${150 - 8 * k} 230 ${150 - 8 * k} 260 170 C240 192 120 192 100 170 Z" fill="#C0703A" ${st(2.4)} opacity="${k}"/>`;
    for (const [c, x] of piles) inner += `<path d="M${x - 22} 172 Q${x} 140 ${x + 22} 172 Z" fill="${c}" ${st(2.2)} opacity="${1 - k}"/>`;
    for (let i = 0; i < 16; i++) inner += `<rect x="${112 + (i * 37) % 136}" y="${160 + (i * 11) % 18}" width="4" height="4" fill="${piles[i % 4][0]}" opacity="${k}"/>`;
    const a = t * 7;
    return bowlSide("#fff", inner) + g(T.metalSpoon(0, 0, 0) + g(fist(), 64, -60, 0.9), 180 + Math.cos(a) * 46, 166 + Math.sin(a) * 6, 1, Math.cos(a) * 10);
  },
});

// ================= Squeeze, salt, ice bath, toss with oil, scrape =================

LIB.add({
  cat: "bowl", name: "squeezedry", dur: 2,
  foods: ["spinach", "zucchini", "potato"],
  steps: ["Drain the frozen spinach and squeeze out the water", "Squeeze the grated zucchini dry in a towel", "Wring the grated potatoes dry in a kitchen towel", "Squeeze out as much liquid as possible"],
  draw(t, F, key) {
    const tw = Math.sin(t / 2 * Math.PI * 2), sq = Math.abs(tw);
    const tint = key === "spinach" ? "#7FAE6A" : key === "zucchini" ? "#BFD98A" : "#E8DDB8";
    let s = V.sink(0);
    s += `<path d="M150 40 C140 58 160 62 150 76" ${st(11)} fill="none"/><path d="M150 40 C140 58 160 62 150 76" stroke="${C.towel}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
    s += g(`<circle r="50" fill="${C.towel}" ${st()}/><path d="M-30 -10 C-10 -20 10 0 30 -10 M-34 12 C-10 4 10 22 34 12" stroke="${C.blue}" stroke-width="3" fill="none" opacity=".5"/>` +
      [[-16, 6], [10, 16], [18, -14], [-6, -20]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="8" ry="5" fill="${tint}" opacity=".7"/>`).join(""), 150, 122, 1 - sq * 0.08, tw * 10);
    s += g(fist(), 150, 40, 1.2, tw * 25) + g(fist(), 92 + sq * 6, 126, 1.2, 90);
    return s + FX.drips(t, [134, 146, 158, 170], 172, 224, key === "spinach" ? "#6A9A5A" : C.blue, 2);
  },
});

LIB.add({
  cat: "bowl", name: "saltdrain", dur: 3,
  foods: ["eggplant", "zucchini", "cucumber"],
  steps: ["Salt the eggplant slices and let them drain in a colander for 30 minutes", "Toss the zucchini with salt and set aside to drain", "Salt the cucumber and let it sit in a colander", "Sprinkle with salt and let the liquid drain"],
  draw(t, F) {
    const beads = bph(t, 1.0, 2.2);
    let inner = "";
    for (let i = 0; i < 9; i++) {
      const x = -60 + (i % 5) * 30 + (i > 4 ? 15 : 0), y = i > 4 ? -34 : -22;
      inner += piece(F, "coin", x, y, i * 30, 1.6);
      if (beads > 0.1) inner += bowlDrop(x + 4, y - 4, 0.6 * beads, C.blue);
    }
    if (t > 0.2) inner += [...Array(14)].map((_, i) => `<rect x="${-58 + (i * 29) % 116}" y="${-40 + (i * 7) % 18}" width="3" height="3" fill="#fff" stroke="${INK}" stroke-width=".8"/>`).join("");
    let s = V.sink(0) + V.colander(190, 148, 1.15, inner);
    if (t < 0.95) s += bowlSalt(t, 190, 70, 108, 8, ["#fff"]) + T.pinch(190 + Math.sin(t * 6) * 30, 52, 1.1);
    if (t > 1.2) s += FX.drips(t, [150, 175, 200, 225], 190, 228, C.blue, 0.8) + T.timer(304, 56, (t - 1.2) / 1.8);
    return s;
  },
});

LIB.add({
  cat: "bowl", name: "oiltoss", dur: 2.6,
  foods: ["potato", "sweetpotato", "broccoli", "cauliflower", "carrot", "brusselsprouts", "squash", "chickpeas"],
  steps: ["Toss the potatoes with oil, salt and pepper", "Toss onion in one bowl with 1 tablespoon oil, and a pinch of the salt and pepper", "Toss with remaining oil, salt and pepper", "In a large bowl, toss the vegetables with the olive oil and seasonings"],
  draw(t, F) {
    const kind = F.type === "long" ? "coin" : F.type === "grains" ? "bit" : F.type === "tree" ? "chunk" : "cube";
    const size = F.type === "grains" ? 1.8 : F.type === "tree" ? 1.5 : 1.4;
    const shine = bph(t, 0.4, 1.0), toss = t > 1.1;
    let s = bowlSide("#fff");
    for (let i = 0; i < 11; i++) {
      const ph = toss ? ((t - 1.1) / 0.75 + i / 11) % 1 : 0, h = toss ? Math.sin(ph * Math.PI) * (34 + (i % 3) * 12) : 0;
      const x = 100 + (i * 53) % 160, y = 128 - (i % 3) * 7 - h;
      s += piece(F, kind, x, y, (i * 47) % 90 + ph * 200, size);
      if (shine > 0.3 && i % 3 === 0) s += FX.sparkle(t + i, x + 8, y - 8, 0.45 * shine);
    }
    const tip = bph(t, 0, 0.15) - bph(t, 0.55, 0.7);
    if (tip > 0.9 && t < 0.57) s += FX.stream(150, 72, 166, 120, C.oil, 4);
    s += bowlPin(bowlBottle(C.oil), 0, -44, lerp(28, 152, tip), lerp(140, 68, tip), lerp(0, 125, tip), 0.85);
    if (t > 0.6 && t < 1.1) s += bowlSalt(t, 214, 72, 116) + T.pinch(214, 54, 1);
    if (toss) { const lift = Math.abs(Math.sin((t - 1.1) / 0.75 * Math.PI)); s += T.spoon(150 + lift * 30, 140 - lift * 30, -20 + lift * 30); }
    return s;
  },
});

LIB.add({
  cat: "bowl", name: "scrapebowl", dur: 2,
  foods: null,
  steps: ["Scrape down the sides of the bowl", "Stop and scrape the bowl down as needed", "Scrape the bowl down and mix in any errant flour", "Use a spatula to scrape down the bowl"],
  draw(t) {
    const batter = "#F6D9A3", left = t < 1, p = left ? bph(t, 0.05, 0.85) : bph(t, 1.05, 1.85);
    let inner = V.bowlFill(batter, 160);
    const blobs = (side, gone) => [0, 1, 2].map(i => { const x = side < 0 ? 84 + i * 10 : 276 - i * 10, y = 130 + i * 12; return `<ellipse cx="${x}" cy="${y}" rx="13" ry="9" fill="${batter}" ${st(2)} opacity="${gone > (i + 0.5) / 3 ? 0 : 1}"/>`; }).join("");
    inner += blobs(-1, left ? p : 1) + blobs(1, left ? 0 : p);
    const x = left ? lerp(84, 140, p) : lerp(276, 220, p), y = lerp(128, 176, p);
    return bowlSide("#fff", inner) + T.scraper(x, y, left ? lerp(-40, -10, p) : lerp(40, 10, p));
  },
});
