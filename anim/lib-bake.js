// ---------- cat-bake: baking prep and pastry, mostly on the counter ----------
// Every scene is wordless and shows exactly one baking move.
// Local helpers are prefixed bk.

// Added only if no other category made them first.
const bkLiquid = (n, c) => { if (!LIQUIDS[n] && !FOODS[n]) LIB.liquid(n, c); };
bkLiquid("eggwhites", "#F4F0E2");
bkLiquid("pumpkinfilling", "#E0892E");
bkLiquid("bananabatter", "#E6BE7E");
if (!FOODS.pepperoni) LIB.food("pepperoni", { type: "round", fill: "#C8302A", inner: "#E0574A" });

// ---------- bake helpers ----------
const bkRand = (i, k = 1) => { const v = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return v - Math.floor(v); };
const bkF = (n) => n.toFixed(1);
const bkPath = (pts, close = true) => "M" + pts.map(([x, y]) => `${bkF(x)} ${bkF(y)}`).join(" L") + (close ? " Z" : "");
const bkEll = (cx, cy, rx, ry, n = 40) => [...Array(n)].map((_, i) => { const a = i / n * Math.PI * 2; return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)]; });
// Part of an ellipse left of x = X (for "brushed so far" gloss).
const bkEllLeft = (cx, cy, rx, ry, X) => bkPath(bkEll(cx, cy, rx, ry, 48).map(([x, y]) => [Math.min(x, X), y]));
const bkHeartPts = (cx, cy, s, n = 48) => [...Array(n)].map((_, i) => { const a = i / n * Math.PI * 2; return [cx + s * Math.pow(Math.sin(a), 3), cy - s * (13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) / 16 + s * 0.12]; });
const bkHeart = (cx, cy, s, fill, w = 3.5, extra = "") => `<path d="${bkPath(bkHeartPts(cx, cy, s))}" fill="${fill}" ${st(w)} ${extra}/>`;
// White specks (flour, powdered sugar) scattered in a box.
const bkDust = (n, x0, x1, y0, y1, seed = 1, col = "#FFFFFF", op = 1) => [...Array(n)].map((_, i) => `<circle cx="${bkF(lerp(x0, x1, bkRand(i, seed)))}" cy="${bkF(lerp(y0, y1, bkRand(i, seed + 7)))}" r="${bkF(1.8 + bkRand(i, seed + 3) * 1.6)}" fill="${col}" stroke="${INK}" stroke-width="1" opacity="${op}"/>`).join("");
// Specks inside an ellipse.
const bkDustIn = (n, cx, cy, rx, ry, seed = 1, col = "#FFFFFF", r = 2.2, w = 1) => [...Array(n)].map((_, i) => { const a = bkRand(i, seed) * Math.PI * 2, d = Math.sqrt(bkRand(i, seed + 5)); return `<circle cx="${bkF(cx + Math.cos(a) * d * rx)}" cy="${bkF(cy + Math.sin(a) * d * ry)}" r="${r}" fill="${col}" stroke="${INK}" stroke-width="${w}"/>`; }).join("");
// Offset spatula, left end of the blade at (x,y).
const bkOffset = (x, y, r = 0) => g(`<rect x="-4" y="-5" width="76" height="10" rx="5" fill="${C.steel}" ${st(3)}/><path d="M70 0 L84 -16 L102 -16" fill="none" ${st(5)}/><rect x="98" y="-23" width="58" height="14" rx="6" fill="${C.handle}" ${st(3)}/>${g(fist(), 126, -18, 0.9)}`, x, y, 1, r);
// Bench scraper standing on its edge, bottom of the blade at (x,y).
const bkBench = (x, y) => g(`<rect x="-30" y="-44" width="60" height="44" rx="3" fill="${C.steel}" ${st(3.5)}/><rect x="-32" y="-60" width="64" height="18" rx="7" fill="${C.wood}" ${st(3.5)}/>${g(fist(), 0, -66, 0.9)}`, x, y);
// Pans seen from above.
const bkSquareTop = (inner = "", col = "#B9C0C6") => `<rect x="78" y="30" width="204" height="192" rx="12" fill="${C.steelDark}" ${st()}/><rect x="90" y="42" width="180" height="168" rx="6" fill="${col}"/>${inner}`;
const BK_CUPS = [84, 148, 212, 276].flatMap(x => [78, 130, 182].map(y => [x, y]));
const bkMuffinTop = () => `<rect x="36" y="44" width="288" height="172" rx="14" fill="${C.steelDark}" ${st()}/>` + BK_CUPS.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="22" fill="#7C858C" ${st(3)}/>`).join("");
// Pie plate in a 3/4 view: rim, crust, inner floor.
const BKP = { cx: 180, cy: 150, rx: 132, ry: 64 };
const bkPlate = () => `<ellipse cx="${BKP.cx}" cy="${BKP.cy + 6}" rx="${BKP.rx}" ry="${BKP.ry}" fill="#E8D2AE" ${st()}/><ellipse cx="${BKP.cx}" cy="${BKP.cy}" rx="${BKP.rx}" ry="${BKP.ry}" fill="#F4E3C8" ${st()}/>`;
const bkCrustIn = (col = "#F1D49A") => `<ellipse cx="${BKP.cx}" cy="${BKP.cy}" rx="${BKP.rx - 12}" ry="${BKP.ry - 7}" fill="${col}" ${st(3.5)}/><ellipse cx="${BKP.cx}" cy="${BKP.cy + 6}" rx="${BKP.rx - 36}" ry="${BKP.ry - 22}" fill="${shade(col)}" opacity=".45"/>`;
// Rim points on the crust edge.
const bkRim = (a, k = 0) => [BKP.cx + (BKP.rx - 18 - k) * Math.cos(a), BKP.cy + (BKP.ry - 10 - k * 0.5) * Math.sin(a)];
// A crimped (scalloped) rim for the angles 0..upTo.
const bkScallops = (col, upTo = 7, n = 30) => [...Array(n)].map((_, i) => { const a = i / n * Math.PI * 2 - Math.PI / 2; if (i / n * Math.PI * 2 > upTo) return ""; const [x, y] = bkRim(a); return `<circle cx="${bkF(x)}" cy="${bkF(y)}" r="9" fill="${col}" ${st(2.6)}/>`; }).join("");
// A domed top crust (from above) with crimped rim.
const bkTopCrust = (col = "#F1D49A") => bkPlate() + `<ellipse cx="${BKP.cx}" cy="${BKP.cy}" rx="${BKP.rx - 12}" ry="${BKP.ry - 7}" fill="${col}" ${st(3.5)}/>` + bkScallops(col) +
  `<path d="M120 128 C150 112 210 112 240 128" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".45"/>`;
const bkSlits = (n = 4, col = "#B5813A") => [[-38, -10, 20], [38, -10, -20], [-30, 22, -20], [30, 22, 20]].slice(0, n).map(([dx, dy, r]) => `<path d="M${180 + dx - 12} ${150 + dy} l24 0" ${st(5)} transform="rotate(${r} ${180 + dx} ${150 + dy})"/><path d="M${180 + dx - 10} ${150 + dy} l20 0" stroke="${col}" stroke-width="2" transform="rotate(${r} ${180 + dx} ${150 + dy})"/>`).join("");
// Fruit or filling bits, by food.
function bkBit(F, key, x, y, r = 0, s = 1) {
  const tf = `transform="translate(${bkF(x)} ${bkF(y)}) rotate(${bkF(r)}) scale(${s})"`;
  if (key === "blueberries" || key === "raspberries") return `<circle ${tf} r="7" fill="${F.inner}" ${st(2)}/>`;
  if (key === "apple") return `<path ${tf} d="M-14 4 C-10 -8 10 -8 14 4 C8 0 -8 0 -14 4 Z" fill="#F6E7B0" ${st(2.2)}/>`;
  if (key === "peach") return `<path ${tf} d="M-14 4 C-10 -8 10 -8 14 4 C8 0 -8 0 -14 4 Z" fill="${F.inner}" ${st(2.2)}/>`;
  if (key === "chicken") return [ // creamy savory filling: chicken cubes, peas, carrots
    `<rect ${tf} x="-7" y="-6" width="14" height="12" rx="3" fill="#F2DDC0" ${st(2)}/>`,
    `<circle ${tf} r="5" fill="#6DB04A" ${st(1.8)}/>`,
    `<rect ${tf} x="-5" y="-5" width="10" height="10" rx="2" fill="#F08A3C" ${st(1.8)}/>`][Math.abs(Math.round(x * 3 + y)) % 3];
  return piece(F, "chunk", x, y, r, s);
}
const BK_CREAM = "#F6EBCF"; // creamy pot pie sauce
// The filling surface color by food.
const bkFillColor = (key, F) => key === "chicken" ? BK_CREAM : key === "apple" ? "#E8C26A" : key === "peach" ? "#F2A85A" : key === "blueberries" ? "#4A3A7A" : (F.liquid || F.inner);

// Bowl contents up to level y that exactly follow the side-view bowl wall.
const bkBowlFill = (color, y = 150, w = 2.5) => {
  const L = clamp(y, 121, 188), d = (L - 120) / 282, t0 = (1 - Math.sqrt(Math.max(0, 1 - 4 * d))) / 2;
  const pts = [...Array(25)].map((_, i) => { const u = lerp(t0, 1 - t0, i / 24), v = 1 - u; return [60 * v * v * v + 192 * v * v * u + 888 * v * u * u + 300 * u * u * u, 120 * v * v * v + 642 * v * v * u + 642 * v * u * u + 120 * u * u * u]; });
  return `<path d="${bkPath(pts)}" fill="${color}" ${st(w)}/>`;
};

// ======================= PAN PREP =======================
LIB.add({ cat: "bake", name: "linesheet", foods: null, dur: 2.6,
  steps: ["Line three baking sheets with parchment paper and set aside.", "Line a baking sheet with parchment paper", "Line a metal tray with parchment"],
  draw(t) {
    const p = t / 2.6, drop = ease(seg(p, 0.05, 0.42)), sweep = ease(seg(p, 0.48, 0.92));
    let s = V.sheetTop();
    s += g(`<rect x="-134" y="-78" width="268" height="156" rx="4" fill="${C.parchment}" ${st(3)}/><path d="M-110 -50 L-40 -56 M30 44 L110 38" stroke="#E2CFA6" stroke-width="3" stroke-linecap="round"/>`, 180, 130 + lerp(-70, 0, drop), lerp(0.8, 1, drop), lerp(-10, 0, drop));
    if (p > 0.44 && p < 0.96) s += T.palm(lerp(90, 270, sweep), 140, 1.1, 90);
    return s;
  } });

LIB.add({ cat: "bake", name: "lineround", foods: null, dur: 2.6,
  steps: ["Line the bottom of the cake pans with parchment rounds", "Grease and line a 9-inch round cake pan with parchment"],
  draw(t) {
    const p = t / 2.6, drop = ease(seg(p, 0.05, 0.45)), press = Math.sin(seg(p, 0.55, 0.9) * Math.PI);
    let s = `<circle cx="180" cy="128" r="98" fill="${C.steelDark}" ${st()}/><circle cx="180" cy="128" r="84" fill="#B9C0C6"/>`;
    s += g(`<circle r="80" fill="${C.parchment}" ${st(3)}/><path d="M-50 -30 C-20 -44 20 -44 46 -32" stroke="#E2CFA6" stroke-width="3" fill="none" stroke-linecap="round"/>`, 180, lerp(70, 128, drop), lerp(1.2, 1, drop), lerp(30, 0, drop));
    if (p > 0.5 && p < 0.95) s += T.palm(180, 150 + press * 8, 1.15 - press * 0.08);
    return s;
  } });

LIB.add({ cat: "bake", name: "lineloaf", foods: null, dur: 2.6,
  steps: ["Line a 9x5-inch loaf pan with parchment, leaving an overhang on the long sides", "Line the loaf pan with a parchment sling"],
  draw(t) {
    const p = t / 2.6, drop = ease(seg(p, 0.05, 0.5)), push = Math.sin(seg(p, 0.55, 0.9) * Math.PI);
    const dy = lerp(-90, 0, drop);
    const sling = `M58 ${92 + dy} L92 ${124 + dy} L${104} ${200 + dy * 0.3} L256 ${200 + dy * 0.3} L268 ${124 + dy} L302 ${92 + dy}`;
    let s = counter() + V.loafTin(`<path d="${sling}" fill="none" stroke="${INK}" stroke-width="14" stroke-linejoin="round" stroke-linecap="round"/><path d="${sling}" fill="none" stroke="${C.parchment}" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"/>`);
    if (p > 0.5 && p < 0.95) s += g(fist(), 180, 170 - (1 - push) * 40, 1.4);
    return s;
  } });

for (const [name, foil] of [["linedish", false], ["linefoil", true]]) LIB.add({ cat: "bake", name, foods: null, dur: 2.8,
  steps: ["Line a 9x13 baking dish with parchment or foil.", foil ? "Line the pan with foil, leaving an overhang" : "Line the pan with parchment, leaving an overhang on two sides"],
  draw(t) {
    const p = t / 2.8, drop = ease(seg(p, 0.05, 0.42));
    let s = V.dishTop();
    const col = foil ? C.foil : C.parchment;
    let sheet = `<rect x="-114" y="-98" width="228" height="196" rx="4" fill="${col}" ${st(3)}/><path d="M-114 -66 L114 -66 M-114 66 L114 66" stroke="${foil ? "#BFC6CC" : "#E2CFA6"}" stroke-width="3"/>`;
    if (foil) sheet += [[-70, -30], [10, 10], [60, -40], [-30, 40], [80, 30]].map(([x, y]) => `<path d="M${x} ${y} l16 10 l10 -8" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`).join("");
    s += g(sheet, 180, 132 + lerp(-60, 0, drop), 1, lerp(-8, 0, drop));
    const corners = [[96, 66], [264, 66], [264, 198], [96, 198]];
    const q = seg(p, 0.48, 0.96) * 4, i = Math.min(3, Math.floor(q)), f = Math.sin((q - i) * Math.PI);
    if (p > 0.46 && p < 0.97) s += T.palm(corners[i][0], corners[i][1] + 10 - f * 6, 0.9);
    return s;
  } });

LIB.add({ cat: "bake", name: "flourpan", foods: null, dur: 3.2,
  steps: ["Grease and flour an 8-inch square baking pan.", "Grease and flour the pan, tapping out the extra flour"],
  draw(t) {
    const p = t / 3.2;
    const sprinkle = seg(p, 0.02, 0.3), spread = ease(seg(p, 0.32, 0.62)), tip = ease(seg(p, 0.66, 0.78)) * (1 - ease(seg(p, 0.92, 1)));
    const wob = p > 0.32 && p < 0.62 ? Math.sin(p * 60) * 7 : 0;
    let inner = `<path d="M100 60 L250 70 M110 120 L240 112 M104 180 L256 176" stroke="#F0DE9A" stroke-width="10" stroke-linecap="round" opacity=".8"/>`;
    inner += `<circle cx="180" cy="126" r="${bkF(lerp(2, 30, sprinkle) * (1 - spread))}" fill="#fff" ${st(2)}/>`;
    inner += bkDust(Math.round(spread * 70), 96, 264, 48, 204, 3);
    let s = counter() + `<g transform="translate(180 126) rotate(${bkF(wob + tip * 18)}) translate(0 ${bkF(-tip * 20)}) translate(-180 -126)">${bkSquareTop(inner)}</g>`;
    if (p < 0.3) s += FX.fall(t, 0.5, 8, 180, 30, 20, 120, (x, y) => `<circle cx="${bkF(x)}" cy="${bkF(y)}" r="2.6" fill="#fff" ${st(1)}/>`) + T.pinch(180, 14, 1, 0);
    if (tip > 0.3) s += FX.fall(t, 0.6, 7, 70, 24, 140, 214, (x, y) => `<circle cx="${bkF(x)}" cy="${bkF(y)}" r="2.6" fill="#fff" ${st(1)}/>`) + bkDust(Math.round(tip * 10), 50, 96, 208, 214, 9);
    return s;
  } });

LIB.add({ cat: "bake", name: "flourcounter", foods: ["flour"], dur: 2.6,
  steps: ["Lightly flour a clean work surface", "Add flour to surface as necessary to keep dough from sticking", "Dust the counter with flour"],
  draw(t, F) {
    const p = t / 2.6, fly = seg(p, 0.12, 0.55);
    let s = board() + g(whole(F), 300, 82, 0.55);
    s += [...Array(46)].map((_, i) => {
      const tx = lerp(50, 300, bkRand(i, 2)), ty = lerp(110, 215, bkRand(i, 4));
      const q = ease(clamp(fly * 1.4 - bkRand(i, 6) * 0.4));
      if (q <= 0) return "";
      const x = lerp(96, tx, q), y = lerp(70, ty, q) - Math.sin(q * Math.PI) * 30;
      return `<circle cx="${bkF(x)}" cy="${bkF(y)}" r="${bkF(1.8 + bkRand(i, 8) * 1.6)}" fill="#fff" stroke="${INK}" stroke-width="1"/>`;
    }).join("");
    const throwA = Math.sin(seg(p, 0, 0.3) * Math.PI);
    if (p < 0.45) s += T.palm(lerp(80, 120, throwA), 74 - throwA * 10, 1, lerp(-40, 30, seg(p, 0, 0.3)));
    return s;
  } });

LIB.add({ cat: "bake", name: "papercups", foods: null, dur: 3,
  steps: ["Line a 12-cup muffin tin with paper liners", "Line cupcake pans with paper liners"],
  draw(t) {
    const p = t / 3, n = p * 13;
    const cols = [C.pink, "#BFE0F7", "#F7E7A8"];
    let s = bkMuffinTop();
    BK_CUPS.forEach(([x, y], i) => {
      if (i > n) return;
      const d = ease(clamp(n - i)), cy = lerp(y - 60, y, d);
      s += g(`<circle r="21" fill="${cols[i % 3]}" ${st(3)}/>${[...Array(10)].map((_, k) => { const a = k / 10 * Math.PI * 2; return `<path d="M${bkF(Math.cos(a) * 11)} ${bkF(Math.sin(a) * 11)} L${bkF(Math.cos(a) * 20)} ${bkF(Math.sin(a) * 20)}" stroke="${INK}" stroke-width="1.4" opacity=".5"/>`; }).join("")}<circle r="11" fill="#fff" ${st(2)}/>`, x, cy, lerp(1.25, 1, d)) ;
    });
    return s;
  } });

LIB.add({ cat: "bake", name: "spraytin", foods: null, dur: 2.6,
  steps: ["Spray a muffin tin with avocado oil", "Spray the pan with nonstick cooking spray"],
  draw(t) {
    const p = t / 2.6, x = lerp(60, 300, ease(seg(p, 0.05, 0.85)));
    let s = bkMuffinTop();
    BK_CUPS.forEach(([cx, cy]) => { if (cx < x - 10) s += `<path d="M${cx - 12} ${cy - 8} C${cx - 6} ${cy - 16} ${cx + 6} ${cy - 16} ${cx + 12} ${cy - 8}" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".85"/>`; });
    if (p < 0.88) {
      s += `<path d="M${x} 52 L${x - 40} 200 L${x + 40} 200 Z" fill="#fff" opacity=".35"/>` + [...Array(14)].map((_, i) => { const q = (t * 2 + i / 14) % 1; return `<circle cx="${bkF(x + (bkRand(i, 3) - 0.5) * 70 * q)}" cy="${bkF(52 + q * 140)}" r="2" fill="#fff" ${st(0.8)}/>`; }).join("");
      s += g(`<rect x="-16" y="-50" width="32" height="64" rx="8" fill="${C.blue}" ${st(3.5)}/><rect x="-10" y="-62" width="20" height="14" rx="3" fill="#fff" ${st(3)}/><path d="M-6 -2 L6 -2" stroke="#fff" stroke-width="5"/>${g(fist(), 0, -14)}`, x, 30, 0.8);
    }
    return s;
  } });

// ======================= MIXING =======================
// Bowl contents: a fluffy mound sitting on a fill.
const bkMound = (col, h, fluff = 1, L = 150) => bkBowlFill(col, L) + `<path d="M78 ${L + 2} C92 ${L + 2 - h} 136 ${L - 6 - h} 180 ${L - h} C224 ${L - 6 - h} 268 ${L + 2 - h} 282 ${L + 2} Z" fill="${col}" ${st(3)}/>` +
  (fluff ? [[120, 6], [170, 0], [222, 6]].map(([x, d]) => `<path d="M${x - 16} ${L + 6 - h * 0.7 + d} q16 -12 32 0" fill="none" stroke="${shade(col.startsWith("#") ? col : "#FFF4D6")}" stroke-width="3" stroke-linecap="round" opacity="${0.6 * fluff}"/>`).join("") : "");
const bkMixer = (x, y, r = 0, spin = 0) => g(T.handMixer(0, 0, r, spin), x, y, 1.35);

for (const [name, stand] of [["creamsugar", false], ["standcream", true]]) LIB.add({ cat: "bake", name, foods: ["sugar", "brownsugar"], dur: 3,
  steps: stand ? ["In a large mixing bowl with a hand mixer or a stand mixer fitted with the paddle attachment, beat the butter, granulated sugar, and brown sugar on high for 3 to 4 minutes or until light and fluffy", "Cream the butter and sugar in a stand mixer until pale and fluffy"]
    : ["Beat butter, white sugar, and brown sugar together in a large bowl with an electric mixer until light and creamy, about 4 minutes.", "Cream together butter and sugars until combined.", "Beat brown sugar and butter with an electric mixer in a separate large bowl until smooth"],
  draw(t, F, key) {
    const p = t / 3, k = ease(seg(p, 0.08, 0.85));
    const end = key === "brownsugar" ? "#EBCB9E" : "#FFF6DE";
    const col = mixColor("#FFE08A", end, k);
    const grain = key === "brownsugar" ? "#B5813A" : "#FFFFFF";
    if (stand) {
      const sx = Math.cos(t * 18);
      let inner = `<path d="M108 150 C110 196 214 196 216 150 Z" fill="${col}"/><path d="M106 150 C120 ${142 - k * 14} 204 ${142 - k * 14} 218 150" fill="${col}" ${st(3)}/>`;
      inner += [...Array(10)].map((_, i) => `<circle cx="${bkF(120 + bkRand(i, 2) * 84)}" cy="${bkF(150 + bkRand(i, 5) * 14)}" r="2.6" fill="${grain}" ${st(1)} opacity="${1 - k}"/>`).join("");
      inner += [[130, 152], [176, 156]].map(([x, y]) => `<rect x="${x}" y="${y}" width="18" height="14" rx="3" fill="#FFE08A" ${st(2)} opacity="${1 - k}"/>`).join("");
      inner += `<path d="M150 66 L150 112" ${st(6)}/><g transform="translate(150 112) scale(${bkF(sx)} 1)"><path d="M-16 0 C-18 30 -6 42 0 42 C6 42 18 30 16 0 Z" fill="none" ${st(4.5)}/><path d="M-16 0 L16 0" ${st(4.5)}/></g>`;
      return V.standMixer(0, inner);
    }
    let s = V.bowl(bkMound(col, lerp(6, 34, k), k));
    s += [...Array(14)].map((_, i) => `<circle cx="${bkF(110 + bkRand(i, 2) * 140)}" cy="${bkF(134 + bkRand(i, 5) * 14)}" r="3" fill="${grain}" ${st(1.2)} opacity="${1 - k}"/>`).join("");
    s += [[120, 132], [170, 128], [218, 134]].map(([x, y]) => `<rect x="${x}" y="${y}" width="24" height="18" rx="4" fill="#FFE08A" ${st(2.4)} opacity="${1 - k}"/>`).join("");
    s += bkMixer(180 + wave(t, 3, 2) * 40, 146 - k * 20, wave(t, 3, 2) * 6, Math.sin(t * 30));
    return s;
  } });

LIB.add({ cat: "bake", name: "eggsoneatatime", foods: ["egg"], dur: 3.2,
  steps: ["Beat in eggs, one at a time, then stir in vanilla.", "Add the eggs one at a time, beating well after each", "Add the vanilla and the egg; beat on low speed until just incorporated"],
  draw(t, F) {
    const p = t / 3.2, crack = ease(seg(p, 0.08, 0.22)), fall = ease(seg(p, 0.22, 0.36)), mix = ease(seg(p, 0.42, 0.9));
    let s = counter() + g(whole(F), 40, 196, 0.36) + g(whole(F), 74, 200, 0.36);
    s += V.bowl(bkMound("#FFF1CC", 26, 1) + (fall > 0 ? `<g opacity="${1 - mix}"><ellipse cx="180" cy="${bkF(lerp(70, 126, fall))}" rx="${bkF(lerp(12, 24, fall))}" ry="${bkF(lerp(12, 9, fall))}" fill="#fff" ${st(2)}/><circle cx="180" cy="${bkF(lerp(70, 123, fall))}" r="9" fill="${F.inner}" ${st(2)}/></g>` : ""));
    if (p < 0.4) {
      const o = crack * 18;
      s += `<g transform="translate(${180 - o} 60) rotate(${-crack * 30})"><path d="M-22 4 C-22 -30 -6 -40 0 -40 L0 4 L-8 -2 L-14 6 Z" fill="${F.fill}" ${st(3)}/></g>`;
      s += `<g transform="translate(${180 + o} 60) rotate(${crack * 30})"><path d="M22 4 C22 -30 6 -40 0 -40 L0 4 L8 -2 L14 6 Z" fill="${F.fill}" ${st(3)}/></g>`;
      if (crack < 0.2) s += `<path d="M158 64 C158 96 202 96 202 64" fill="${F.fill}" ${st(3)}/>`;
    }
    if (p > 0.4 && p < 0.94) s += bkMixer(180 + wave(t, 1.6) * 34, 134, 0, Math.sin(t * 30));
    return s;
  } });

LIB.add({ cat: "bake", name: "alternate", foods: null, dur: 3.6,
  steps: ["Add the dry ingredients alternately with the milk, beginning and ending with the dry", "Add flour mixture alternately with the buttermilk"],
  draw(t) {
    const p = t / 3.6, turn = Math.floor(p * 4) % 4, q = (p * 4) % 1;
    const tipA = turn % 2 === 0 ? Math.sin(Math.min(1, q * 1.2) * Math.PI) : 0, tipB = turn % 2 === 1 ? Math.sin(Math.min(1, q * 1.2) * Math.PI) : 0;
    let s = V.bowl(bkBowlFill("#F6E3B0", lerp(168, 150, p)));
    s += g(T.measuringCup(0, 0, 0, "#FBF8EE", 0.7) + bkDustIn(5, 0, 6, 14, 6, 2), 92, 70, 1, tipA * 110);
    s += g(T.measuringCup(0, 0, 0, "#FFFFFF", 0.7), 268, 70, 1, -tipB * 110 - 0);
    if (tipA > 0.7) s += FX.fall(t, 0.4, 8, 140, 22, 90, 150, (x, y) => `<circle cx="${bkF(x)}" cy="${bkF(y)}" r="2.6" fill="#fff" ${st(1)}/>`);
    if (tipB > 0.7) s += FX.stream(228, 84, 200, 152, "#FFFFFF", 6);
    return s;
  } });

for (const [name, tilt] of [["whippeaks", false], ["tiltbowl", true]]) LIB.add({ cat: "bake", name, foods: tilt ? ["eggwhites"] : ["eggwhites", "cream"], dur: 3,
  steps: tilt ? ["Beat until stiff peaks form and the whites don't slide when the bowl is tipped", "Whip the egg whites until stiff; the bowl can be tipped over"]
    : ["Beat the egg whites to stiff peaks", "Whip the cream to stiff peaks", "Whip the heavy cream until stiff peaks form"],
  draw(t, F) {
    const p = t / 3;
    const peakTip = (top) => `<path d="M162 ${top + 6} C172 ${top - 8} 176 ${top - 22} 180 ${top - 36} C184 ${top - 22} 188 ${top - 8} 198 ${top + 6} Z" fill="#fff" ${st(3)}/>`;
    if (tilt) {
      const a = ease(seg(p, 0.1, 0.42)) * (1 - ease(seg(p, 0.76, 0.96)));
      const inner = bkMound("#FFFFFF", 30, 1);
      let s = counter() + `<g transform="translate(0 ${bkF(-a * 20)}) rotate(${bkF(-a * 180)} 180 150)">${V.bowl(inner)}${g(fist(), 46, 132)}${g(fist(), 314, 132)}</g>`;
      if (p > 0.44 && p < 0.76) s += T.check(310, 50, ease(seg(p, 0.44, 0.52)));
      return s;
    }
    const k = ease(seg(p, 0.05, 0.68)), lift = ease(seg(p, 0.72, 0.86));
    const col = mixColor(F.liquid || "#FFFFFF", "#FFFFFF", k);
    let inner = bkBowlFill(col, lerp(178, 168, k));
    if (k > 0.05) inner += bkMound("#FFFFFF", lerp(0, 34, k), k, lerp(178, 150, k));
    inner += [...Array(8)].map((_, i) => `<circle cx="${bkF(100 + bkRand(i, 4) * 160)}" cy="${bkF(lerp(176, 124, k) + bkRand(i, 7) * 10)}" r="${bkF(2 + k * 3)}" fill="#fff" ${st(1.4)} opacity="${0.8 - k * 0.4}"/>`).join("");
    if (lift > 0) inner += peakTip(116);
    let s = V.bowl(inner);
    const mx = 180 + (lift > 0 ? 0 : wave(t, 1.5) * 40);
    if (p < 0.97) s += bkMixer(mx, lerp(160 - k * 40, 84, lift), 0, lift > 0 ? 0 : Math.sin(t * 30));
    return s;
  } });

LIB.add({ cat: "bake", name: "meltchoc", foods: ["chocolate"], dur: 3,
  steps: ["Melt the butter and chocolate together in a heatproof bowl set over simmering water, stirring until smooth", "Melt chocolate and butter over a double boiler"],
  draw(t, F) {
    const p = t / 3, k = ease(seg(p, 0.08, 0.8));
    let s = FX.flames(t, 0.6) + V.saucepan(V.saucepanFill(C.water, 170) + FX.bubbles(t, 110, 230, 198, 172, 5, 0.7));
    const lvl = lerp(138, 126, k);
    let inner = `<path d="M84 ${lvl} L260 ${lvl} C252 170 92 170 84 ${lvl} Z" fill="${mixColor("#7A4A2E", "#4A2A1A", k)}"/>`;
    inner += `<path d="M84 ${lvl} L260 ${lvl}" ${st(2.5)}/>`;
    inner += [[110, 120, 0], [140, 116, 1], [196, 118, 0], [226, 122, 1], [166, 122, 2]].map(([x, y, b], i) => b === 2 ? `<rect x="${x - 10}" y="${y - 8}" width="${bkF(22 * (1 - k))}" height="${bkF(16 * (1 - k))}" rx="3" fill="#FFE08A" ${st(2)} opacity="${1 - k}"/>`
      : `<rect x="${x - 12}" y="${y - 10 + k * 10}" width="24" height="${bkF(20 * (1 - k))}" rx="3" fill="${F.fill}" ${st(2)} opacity="${1 - k}"/>`).join("");
    if (k > 0.5) inner += `<path d="M110 ${lvl + 8} q20 -5 40 0" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity="${(k - 0.5) * 1.4}"/>`;
    s += `<path d="M74 104 C80 178 264 178 270 104 Z" fill="${C.steel}" ${st()}/>${inner}<path d="M66 104 L278 104" ${st(5)}/>`;
    s += FX.steam(t, [70, 280], 104, 0.6);
    s += T.scraper(172 + wave(t, 1.5) * 50, 132, wave(t, 1.5) * 18);
    return s;
  } });

LIB.add({ cat: "bake", name: "stirchoc", foods: ["meltedchocolate", "meltedbutter"], dur: 3,
  steps: ["Stir in the melted chocolate", "Stir in the melted butter", "Add milk, melted butter, and egg"],
  draw(t, F) {
    const p = t / 3, pour = seg(p, 0.05, 0.42), mix = ease(seg(p, 0.48, 0.92));
    const base = "#F7E3A8", liq = F.liquid;
    const col = mixColor(base, liq, mix * (liq === "#5A3220" ? 0.85 : 0.35));
    let inner = bkBowlFill(col, 158);
    const pool = Math.min(1, pour * 1.3) * (1 - mix);
    if (pool > 0) inner += `<ellipse cx="180" cy="160" rx="${bkF(70 * pool)}" ry="${bkF(8 * pool)}" fill="${liq}" ${st(2)}/>`;
    if (mix > 0 && mix < 1) inner += `<path d="M120 172 C150 162 200 180 240 168" fill="none" stroke="${liq}" stroke-width="5" stroke-linecap="round" opacity="${1 - mix}"/>`;
    let s = V.bowl(inner);
    const tip = Math.sin(clamp(pour * 1.15) * Math.PI);
    s += `<g transform="rotate(${bkF(-tip * 80)} 270 60)">${V.smallBowl(270, 60, 0.42, `<path d="M-60 6 C-50 50 50 50 60 6 Z" fill="${liq}"/>`)}</g>`;
    if (tip > 0.6) s += FX.stream(240, 62, 186, 156, liq, 6);
    if (p > 0.46) s += T.scraper(180 + wave(t, 1.5) * 50, 168, wave(t, 1.5) * 20);
    return s;
  } });

LIB.add({ cat: "bake", name: "siftdry", foods: ["flour", "cocoa"], dur: 2.4,
  steps: ["Sift flour, baking powder, sugar, and salt together in a large bowl.", "Sift in the cocoa powder", "Sift the dry ingredients together"],
  draw(t, F) {
    const p = t / 2.4, col = F.inner;
    const sx = Math.sin(t * 22) * 6;
    let s = V.bowl(bkBowlFill(col, lerp(186, 160, p)) + `<path d="M126 ${lerp(186, 160, p)} C150 ${lerp(180, 140, p)} 210 ${lerp(180, 140, p)} 234 ${lerp(186, 160, p)}" fill="${col}" ${st(2.5)}/>`);
    s += FX.fall(t, 0.5, 14, 180, 70, 96, 160, (x, y) => `<circle cx="${bkF(x)}" cy="${bkF(y)}" r="2" fill="${col}" ${st(0.8)}/>`);
    s += `<g transform="translate(${bkF(sx)} 0)">${V.sieve(180, 60, 1)}<path d="M150 60 C162 ${bkF(lerp(42, 54, p))} 198 ${bkF(lerp(42, 54, p))} 210 60 Z" fill="${col}" ${st(2.5)}/>${g(fist(), 292, 54)}</g>`;
    return s;
  } });

LIB.add({ cat: "bake", name: "foldchips", foods: ["chips", "nuts", "blueberries"], dur: 3,
  steps: ["Fold in the chocolate chips by hand with your spatula, reserving a handful to sprinkle on top later", "Fold in chocolate chips and walnuts, if using, until evenly distributed.", "Gently fold in the blueberries"],
  draw(t, F, key) {
    const p = t / 3, drop = seg(p, 0.04, 0.32), fold = ease(seg(p, 0.38, 0.9));
    const base = key === "blueberries" ? "#F6D9A3" : "#E3B470";
    let inner = bkBowlFill(base, 150);
    const N = 12;
    for (let i = 0; i < N; i++) {
      const land = clamp(drop * 1.6 - i / N * 0.6);
      if (land <= 0) continue;
      const hx = 230 + (bkRand(i, 1) - 0.5) * 40, hy = 152 + bkRand(i, 2) * 6;
      const ex = 100 + bkRand(i, 3) * 160, ey = 158 + bkRand(i, 4) * 30;
      const x = lerp(hx, ex, fold), y = lerp(lerp(70, hy, ease(land)), ey, fold);
      inner += bkBit(F, key, x, y, i * 50, key === "blueberries" ? 0.9 : 0.8);
    }
    let s = V.bowl(inner);
    const tip = Math.sin(clamp(drop * 1.2) * Math.PI);
    if (p < 0.36) s += `<g transform="rotate(${bkF(-tip * 70)} 280 56)">${V.smallBowl(280, 56, 0.36)}</g>`;
    if (p > 0.36 && p < 0.94) { const a = (p - 0.36) * 10; s += T.scraper(180 + Math.cos(a) * 60, 160 + Math.sin(a) * 10, Math.cos(a) * 25); }
    return s;
  } });

LIB.add({ cat: "bake", name: "justcombined", foods: ["cakebatter", "brownbatter", "pancakebatter", "bananabatter"], dur: 3,
  steps: ["Stir in flour just until no dry streaks remain.", "Stir banana mixture into flour mixture until just combined.", "Add the flour and mix together with a spatula until a few streaks remain", "Stir until just combined; a few lumps are fine"],
  draw(t, F) {
    const p = t / 3, k = ease(seg(p, 0.05, 0.75));
    let inner = bkBowlFill(F.liquid, 152);
    inner += [[110, 162, 22], [160, 176, 28], [214, 160, 20], [244, 178, 16], [136, 186, 14]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${bkF(r * (1 - k))}" ry="${bkF(r * 0.5 * (1 - k))}" fill="#FBF8EE" ${st(2)} opacity="${k < 0.98 ? 1 : 0}"/>`).join("");
    let s = V.bowl(inner);
    const lift = ease(seg(p, 0.78, 0.9));
    if (p < 0.97) s += T.scraper(180 + (lift ? 0 : wave(t, 1.5) * 50), lerp(166, 80, lift), lift ? 0 : wave(t, 1.5) * 20);
    if (p > 0.84) s += T.check(310, 52, ease(seg(p, 0.84, 0.9)));
    return s;
  } });

LIB.add({ cat: "bake", name: "bloomyeast", foods: ["yeast"], dur: 3.2,
  steps: ["Dissolve the yeast in the warm water and let it sit until foamy", "Let the yeast and water sit at room temperature for 15 minutes, until the mixture has bubbled and expanded"],
  draw(t, F) {
    const p = t / 3.2, sprinkle = seg(p, 0.02, 0.25), foam = ease(seg(p, 0.3, 0.9));
    const lvl = 0.6;
    let cup = T.measuringCup(0, 0, 0, "#F3E7C9", lvl);
    const top = 30 - 60 * lvl;
    cup += `<path d="M-23 ${top} L23 ${top} L23 ${bkF(top - foam * 16)} C10 ${bkF(top - foam * 22)} -10 ${bkF(top - foam * 22)} -23 ${bkF(top - foam * 16)} Z" fill="#F1DDB0" ${st(1.6)} opacity="${foam}"/>`;
    cup += [...Array(8)].map((_, i) => `<circle cx="${bkF(-18 + bkRand(i, 2) * 36)}" cy="${bkF(top - 2 - bkRand(i, 3) * 8 * foam)}" r="${bkF(1.2 + foam * 2)}" fill="#fff" stroke="${INK}" stroke-width="0.8" opacity="${Math.min(1, sprinkle * 2)}"/>`).join("");
    let s = counter() + g(cup, 160, 150, 2.1) + g(whole(F), 302, 176, 0.55);
    if (foam > 0.1) s += FX.bubbles(t, 130, 190, 200, 150, 5, 0.5, 0.6);
    if (p < 0.28) s += T.pinch(160, 44, 0.9, 0) + FX.fall(t, 0.5, 6, 160, 20, 60, 112, (x, y) => `<circle cx="${bkF(x)}" cy="${bkF(y)}" r="2.2" fill="#C9A26B" ${st(0.8)}/>`);
    return s;
  } });

// ======================= CUT IN, CRUMBS, STREUSEL =======================
const BK_FLOUR = "#FBF8EE", BK_CRUMB = "#E8C88A";
// Butter cubes that break down into pea-size bits as k goes 0..1.
const bkButterBits = (k) => { const n = Math.round(lerp(6, 18, k)), sz = lerp(24, 9, k); return [...Array(n)].map((_, i) => `<rect x="${bkF(96 + bkRand(i, 11) * 150)}" y="${bkF(122 + bkRand(i, 12) * 40)}" width="${bkF(sz)}" height="${bkF(sz * 0.8)}" rx="${bkF(sz * 0.25)}" fill="#FFE08A" ${st(2)}/>`).join(""); };
const bkCrumbFlour = (k) => bkMound(BK_FLOUR, 18, 0, 140) + bkDustIn(Math.round(k * 26), 180, 150, 90, 22, 21, "#F6E3B0", 3.4, 1.2);

LIB.add({ cat: "bake", name: "cutinbutter", foods: ["butter"], dur: 3,
  steps: ["Add the cold butter and smoosh with your fingers (or cut in with a pastry cutter) until the mixture resembles coarse crumbs with pea-sized clumps of butter within", "Cut in the butter with a pastry cutter until the mixture resembles coarse crumbs"],
  draw(t) {
    const p = t / 3, k = ease(seg(p, 0.05, 0.9)), push = Math.abs(Math.sin(t / 3 * Math.PI * 6));
    let s = V.bowl(bkCrumbFlour(k) + bkButterBits(k));
    const x = 180 + wave(t, 3, 1) * 60;
    s += g(T.pastryCutter(0, 0) + g(fist(), 0, -58), x, lerp(108, 132, push));
    return s;
  } });

LIB.add({ cat: "bake", name: "fingerrub", foods: ["butter"], dur: 3,
  steps: ["Rub the butter into the flour with your fingertips until it looks like coarse crumbs", "Add the cold butter and smoosh with your fingers until pea-sized clumps remain"],
  draw(t) {
    const p = t / 3, k = ease(seg(p, 0.05, 0.9)), rub = Math.sin(t * 14) * 5;
    let s = V.bowl(bkCrumbFlour(k) + bkButterBits(k));
    s += FX.fall(t, 0.6, 8, 180, 50, 108, 136, (x, y) => `<rect x="${bkF(x)}" y="${bkF(y)}" width="5" height="4" rx="1" fill="#F6E3B0" ${st(1)}/>`);
    s += T.pinch(160 + rub, 92, 1, -20) + T.pinch(200 - rub, 92, 1, 20);
    return s;
  } });

LIB.add({ cat: "bake", name: "streusel", foods: ["brownsugar", "oats"], dur: 3,
  steps: ["Mix the streusel ingredients in a small bowl until it resembles small pebbles - I start with a fork", "Mix until crumbles form.", "Mix the oats, flour, brown sugar, and butter until crumbly"],
  draw(t, F, key) {
    const p = t / 3, k = ease(seg(p, 0.08, 0.85));
    let inner = bkBowlFill(BK_FLOUR, 152);
    // Separate piles fade, crumbs grow.
    inner += `<g opacity="${1 - k}"><path d="M90 152 C100 128 140 128 150 152 Z" fill="${BK_FLOUR}" ${st(2.5)}/><path d="M210 152 C220 128 262 128 270 152 Z" fill="${key === "oats" ? "#E8C49A" : F.fill}" ${st(2.5)}/><rect x="160" y="132" width="30" height="22" rx="4" fill="#FFE08A" ${st(2.5)}/></g>`;
    inner += [...Array(22)].map((_, i) => { const x = 92 + bkRand(i, 31) * 176, y = 136 + bkRand(i, 32) * 30, r = 5 + bkRand(i, 33) * 4; return `<circle cx="${bkF(x)}" cy="${bkF(y)}" r="${bkF(r * k)}" fill="${i % 3 ? "#D9A866" : "#E8C49A"}" ${st(1.8)}/>`; }).join("");
    if (key === "oats") inner += [...Array(8)].map((_, i) => `<ellipse cx="${bkF(100 + bkRand(i, 41) * 160)}" cy="${bkF(140 + bkRand(i, 42) * 24)}" rx="6" ry="3.5" fill="#F1E3B0" ${st(1.4)} opacity="${k}" transform="rotate(${i * 40} ${bkF(100 + bkRand(i, 41) * 160)} ${bkF(140 + bkRand(i, 42) * 24)})"/>`).join("");
    let s = V.bowl(inner);
    s += T.fork(180 + wave(t, 1, 1) * 40, 146 - Math.abs(wave(t, 0.5)) * 10, wave(t, 1) * 20);
    return s;
  } });

LIB.add({ cat: "bake", name: "topcrumble", foods: ["apple", "blueberries", "peach"], dur: 3,
  steps: ["Sprinkle the crumble topping evenly over the fruit", "Scatter the streusel over the apples", "Sprinkle the topping over the berries"],
  draw(t, F, key) {
    const p = t / 3;
    let inner = `<rect x="62" y="62" width="236" height="140" rx="8" fill="${bkFillColor(key, F)}"/>`;
    inner += [...Array(26)].map((_, i) => bkBit(F, key, 74 + bkRand(i, 51) * 212, 72 + bkRand(i, 52) * 120, i * 37, 1.1)).join("");
    const hx = lerp(80, 280, ease(seg(p, 0.05, 0.9)));
    inner += [...Array(60)].map((_, i) => { const x = 70 + bkRand(i, 61) * 220, y = 70 + bkRand(i, 62) * 124; if (x > hx) return ""; return `<path transform="translate(${bkF(x)} ${bkF(y)}) rotate(${i * 29})" d="M-8 -4 L6 -7 L9 4 L-2 8 L-9 3 Z" fill="${i % 4 ? BK_CRUMB : "#D9A866"}" ${st(1.8)}/>`; }).join("");
    let s = V.dishTop(inner);
    if (p < 0.92) s += FX.fall(t, 0.5, 5, hx, 26, 30, 110, (x, y) => `<rect x="${bkF(x)}" y="${bkF(y)}" width="8" height="7" rx="2" fill="${BK_CRUMB}" ${st(1.4)}/>`) + T.pinch(hx, 14, 1, 0);
    return s;
  } });

// Paper-lined cups in a muffin tin, side view, cut away so you see the batter.
const BK_SIDECUPS = [70, 140, 210, 280];
const bkSideCups = (fillFn) => `<rect x="34" y="168" width="292" height="40" rx="8" fill="${C.steelDark}" ${st()}/>` + BK_SIDECUPS.map((x, i) => `<path d="M${x - 28} 134 L${x + 28} 134 L${x + 20} 200 L${x - 20} 200 Z" fill="#F7F2E6" ${st(3)}/>${fillFn(x, i)}<path d="M${x - 14} 140 L${x - 10} 196 M${x} 140 L${x} 196 M${x + 14} 140 L${x + 10} 196" stroke="${INK}" stroke-width="1.4" opacity=".35"/><path d="M${x - 32} 134 L${x + 32} 134" ${st(3.5)}/>`).join("");
const bkCupLevel = (x, lv, col) => { const y = lerp(200, 134, lv); const hw = lerp(20, 28, lv); return `<path d="M${bkF(x - hw)} ${bkF(y)} L${bkF(x + hw)} ${bkF(y)} L${x + 20} 200 L${x - 20} 200 Z" fill="${col}" ${st(2)}/>`; };

LIB.add({ cat: "bake", name: "streuselmuffin", foods: null, dur: 3.2,
  steps: ["Add a spoonful of streusel on each one", "Sprinkle the streusel over the muffin batter"],
  draw(t) {
    const p = t / 3.2, n = p * 4.6;
    let s = bkSideCups((x, i) => bkCupLevel(x, 0.8, "#F6D9A3") + `<path d="M${x - 26} 148 C${x - 20} 124 ${x + 20} 124 ${x + 26} 148 Z" fill="#F6D9A3" ${st(2.5)}/>` +
      (n > i + 0.5 ? [...Array(7)].map((_, k) => `<circle cx="${bkF(x - 16 + bkRand(k + i * 7, 3) * 32)}" cy="${bkF(132 + bkRand(k + i * 7, 4) * 10)}" r="4.5" fill="${k % 2 ? BK_CRUMB : "#D9A866"}" ${st(1.6)}/>`).join("") : ""));
    const i = Math.min(3, Math.floor(n)), q = n - i;
    if (n < 4) { const x = BK_SIDECUPS[i]; s += T.metalSpoon(x, lerp(70, 112, Math.sin(q * Math.PI)), -10, BK_CRUMB); if (q > 0.4 && q < 0.6) s += FX.fall(t, 0.3, 4, x, 24, 112, 130, (a, b) => `<circle cx="${bkF(a)}" cy="${bkF(b)}" r="4" fill="${BK_CRUMB}" ${st(1.4)}/>`); }
    return s;
  } });

// ======================= ROLL AND CUT =======================
LIB.add({ cat: "bake", name: "rollout", foods: ["piecrust", "pizzadough", "cookiedough", "pastry", "dough"], dur: 3,
  steps: ["On a lightly floured surface, roll uncovered dough into a long rectangle about ¼” thick", "Roll out the dough into a 12-inch circle", "Roll the dough to 1/4-inch thickness", "Roll out the pie crust on a floured counter"],
  draw(t, F, key) {
    const p = t / 3, k = ease(seg(p, 0.02, 0.9));
    const round = key === "piecrust" || key === "pizzadough";
    const col = key === "cookiedough" ? "#E8C48A" : F.fill;
    let s = board() + bkDust(22, 40, 320, 50, 225, 4);
    const th = lerp(18, key === "dough" ? 10 : 4, k);
    if (round) {
      const rx = lerp(56, 128, k), ry = lerp(42, 74, k), cy = 132 - th / 2;
      s += `<ellipse cx="180" cy="${bkF(cy + th)}" rx="${bkF(rx)}" ry="${bkF(ry)}" fill="${shade(col)}" ${st()}/><ellipse cx="180" cy="${bkF(cy)}" rx="${bkF(rx)}" ry="${bkF(ry)}" fill="${col}" ${st()}/>`;
    } else {
      const w = lerp(104, 264, k), h = lerp(76, 146, k), y = 132 - h / 2 - th / 2;
      s += `<rect x="${bkF(180 - w / 2)}" y="${bkF(y + th)}" width="${bkF(w)}" height="${bkF(h)}" rx="10" fill="${shade(col)}" ${st()}/><rect x="${bkF(180 - w / 2)}" y="${bkF(y)}" width="${bkF(w)}" height="${bkF(h)}" rx="10" fill="${col}" ${st()}/>`;
    }
    s += bkDust(8, 120, 240, 100, 160, 9, "#fff", 0.8);
    s += T.rollingPin(180, 132 + Math.sin(p * Math.PI * 6) * lerp(18, 56, k));
    return s;
  } });

// A rolled sheet on the board, with a little thickness.
const bkRolled = (col, x = 46, y = 50, w = 268, h = 166) => `<rect x="${x}" y="${y + 6}" width="${w}" height="${h}" rx="10" fill="${shade(col)}" ${st()}/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${col}" ${st()}/>`;
const BK_SPOTS6 = [[102, 96], [180, 96], [258, 96], [102, 166], [180, 166], [258, 166]];

for (const [name, heart] of [["cutrounds", false], ["cuthearts", true]]) LIB.add({ cat: "bake", name, foods: heart ? ["cookiedough", "pastry"] : ["cookiedough", "dough"], dur: 3.4,
  steps: heart ? ["Cut out heart shapes with a cookie cutter", "Cut the dough into shapes with cookie cutters"] : ["Cut out biscuits with a 2-inch round cutter, pressing straight down without twisting", "Cut out cookies with a round cookie cutter"],
  draw(t, F, key) {
    const p = t / 3.4, n = p * 6.6, col = key === "cookiedough" ? "#E8C48A" : F.fill;
    const shape = (x, y, fill, w) => heart ? bkHeart(x, y, 28, fill, w) : `<circle cx="${x}" cy="${y}" r="29" fill="${fill}" ${st(w)}/>`;
    let s = board() + bkRolled(col);
    BK_SPOTS6.forEach(([x, y], i) => { if (n > i + 0.55) s += shape(x, y, shade(col), 3.5) + g(shape(0, 0, col, 2.5), x, y - 3, 0.97); });
    const i = Math.min(5, Math.floor(n)), q = n - i;
    if (n < 6) {
      const [x, y] = BK_SPOTS6[i], lift = 1 - Math.sin(clamp(q * 1.1) * Math.PI);
      const cutter = heart ? `<path d="${bkPath(bkHeartPts(0, 0, 30))}" fill="none" ${st(6)}/><path d="${bkPath(bkHeartPts(0, 0, 30))}" fill="none" stroke="${C.steel}" stroke-width="2.4"/>` : T.cutter(0, 0, 1);
      s += g(cutter, x, y - lift * 30, 1 + lift * 0.1) + g(fist(), x, y - 46 - lift * 30, 0.9);
    }
    return s;
  } });

// ======================= HAND PIES =======================
const BK_HP = [[118, 94], [242, 94], [118, 166], [242, 166]];
const bkPastrySheet = (col) => `<rect x="34" y="34" width="292" height="190" rx="4" fill="${C.parchment}" ${st(3)}/>` + bkRolled(col, 56, 48, 248, 160);
const bkOutlines = (col, n = 4) => BK_HP.slice(0, n).map(([x, y]) => `<path d="${bkPath(bkHeartPts(x, y, 28))}" fill="none" stroke="${shade(col)}" stroke-width="2.6" stroke-dasharray="1 0"/>`).join("");
// A heap of filling, by food.
function bkHeap(F, key, x, y, s = 1) {
  if (key === "jam") return g(`<path d="M-18 4 C-20 -12 -6 -16 0 -14 C10 -16 22 -10 18 4 C14 12 -14 12 -18 4 Z" fill="${F.fill}" ${st(2.5)}/><path d="M-8 -6 q6 -4 12 -2" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".6"/>`, x, y, s);
  if (key === "chocolate") return g([[-8, 2], [6, 4], [0, -6], [-2, 8], [10, -4]].map(([a, b], i) => `<rect x="${a - 6}" y="${b - 5}" width="12" height="10" rx="2" fill="${i % 2 ? F.fill : F.inner}" ${st(1.8)} transform="rotate(${i * 25} ${a} ${b})"/>`).join(""), x, y, s);
  return g(`<ellipse rx="19" ry="13" fill="${bkFillColor(key, F)}" ${st(2.5)}/>` + [[-9, -3], [6, -5], [0, 4], [10, 4], [-8, 6]].map(([a, b], i) => bkBit(F, key, a, b, i * 40, 0.62)).join(""), x, y, s);
}

LIB.add({ cat: "bake", name: "stampoutline", foods: ["pastry"], dur: 3,
  steps: ["Lightly press a 3-inch heart cutter onto the pastry to make 4 outlines (do not cut through the dough, these are just guides).", "Lay one sheet of puff pastry on parchment paper."],
  draw(t, F) {
    const p = t / 3, n = p * 4.6;
    let s = bkPastrySheet(F.fill) + bkOutlines(F.fill, Math.min(4, Math.floor(n + 0.45)));
    const i = Math.min(3, Math.floor(n)), q = n - i;
    if (n < 4) { const [x, y] = BK_HP[i], lift = 1 - Math.sin(q * Math.PI); s += `<g transform="translate(0 ${bkF(-lift * 26)})"><path d="${bkPath(bkHeartPts(x, y, 30))}" fill="none" ${st(6)}/><path d="${bkPath(bkHeartPts(x, y, 30))}" fill="none" stroke="${C.steel}" stroke-width="2.4"/>${g(fist(), x, y - 40, 0.85)}</g>`; }
    return s;
  } });

LIB.add({ cat: "bake", name: "moundfilling", foods: ["apple", "jam", "chocolate", "chicken"], dur: 3.2,
  steps: ["Place a heaping tablespoon of filling in the center of each outline", "Spoon the apple pie filling into the center of each heart", "Spoon a mound of the chicken filling onto the center of each pastry"],
  draw(t, F, key) {
    const p = t / 3.2, n = p * 4.6;
    let s = bkPastrySheet(FOODS.pastry.fill) + bkOutlines(FOODS.pastry.fill);
    BK_HP.forEach(([x, y], i) => { if (n > i + 0.5) s += bkHeap(F, key, x, y, 1.3); });
    const i = Math.min(3, Math.floor(n)), q = n - i;
    if (n < 4) { const [x, y] = BK_HP[i]; s += T.metalSpoon(x + 4, y - 4 - Math.sin(q * Math.PI) * 26, -10, q < 0.5 ? bkFillColor(key, F) : null); }
    return s;
  } });

// Pastry with filling heaps under a second sheet: bumps + pressed seams.
const bkCovered = (col, pressed = 4) => bkPastrySheet(col) + BK_HP.map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="20" ry="15" fill="${mixColor(col, "#FFFFFF", 0.35)}" ${st(2)}/><path d="M${x - 10} ${y - 6} q8 -5 16 -2" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>` +
  (i < pressed ? `<path d="${bkPath(bkHeartPts(x, y, 28))}" fill="none" stroke="${shade(col)}" stroke-width="3"/>` : "")).join("");

LIB.add({ cat: "bake", name: "topsheet", foods: ["pastry", "piecrust"], dur: 3.4,
  steps: ["Place the second pastry sheet on top.", "Gently lay a second piece of dough over top and press between filling to seal, making sure there is as little air in pockets as possible"],
  draw(t, F) {
    const p = t / 3.4, slide = ease(seg(p, 0.05, 0.4)), n = seg(p, 0.45, 0.95) * 4.4;
    const col = F.fill;
    let s;
    if (slide < 1) {
      s = bkPastrySheet(col) + bkOutlines(col) + BK_HP.map(([x, y]) => bkHeap(FOODS.apple, "apple", x, y)).join("");
      s += `<g opacity="${bkF(Math.min(1, slide * 3))}" transform="translate(0 ${bkF(lerp(-90, 0, slide))})">${bkRolled(mixColor(col, "#FFFFFF", 0.12), 56, 48, 248, 160)}</g>`;
    } else s = bkCovered(col, Math.floor(n));
    if (slide >= 1 && n < 4) { const i = Math.floor(n), q = n - i, [x, y] = BK_HP[i], a = q * Math.PI * 2; s += T.palm(x + Math.cos(a) * 22, y + 24 + Math.sin(a) * 14, 0.7); }
    return s;
  } });

LIB.add({ cat: "bake", name: "cutpocket", foods: ["pastry"], dur: 3.2,
  steps: ["Using a larger 4-inch heart cutter, center it over a mound and cut firmly through both sheets to create your sealed heart pocket.", "Cut out the hand pies with a large cutter"],
  draw(t, F) {
    const p = t / 3.2, n = p * 4.6, col = F.fill;
    let s = bkCovered(col);
    BK_HP.forEach(([x, y], i) => { if (n > i + 0.55) s += `<path d="${bkPath(bkHeartPts(x, y, 36))}" fill="none" ${st(4)}/>`; });
    const i = Math.min(3, Math.floor(n)), q = n - i;
    if (n < 4) { const [x, y] = BK_HP[i], lift = 1 - Math.sin(clamp(q * 1.1) * Math.PI); s += `<g transform="translate(0 ${bkF(-lift * 28)})"><path d="${bkPath(bkHeartPts(x, y, 37))}" fill="none" ${st(6)}/><path d="${bkPath(bkHeartPts(x, y, 37))}" fill="none" stroke="${C.steel}" stroke-width="2.4"/>${g(fist(), x, y - 48, 0.85)}</g>`; }
    return s;
  } });

// One big hand pie from above: heart (puff pastry) or half-moon (pie crust).
const bkPieOutline = (key) => key === "pastry" ? bkHeartPts(180, 124, 76, 60)
  : [...Array(40)].map((_, i) => { const a = Math.PI + i / 39 * Math.PI; return [180 + 112 * Math.cos(a), 168 + 112 * Math.sin(a)]; }).concat([[270, 168], [180, 168], [90, 168]]);
const bkBigPie = (F, key, marks = 1) => {
  const col = F.fill, pts = bkPieOutline(key), cx = 180, cy = key === "pastry" ? 124 : 130;
  let s = `<rect x="24" y="30" width="312" height="196" rx="6" fill="${C.parchment}" ${st(3)}/>`;
  s += `<path d="${bkPath(pts.map(([x, y]) => [x, y + 6]))}" fill="${shade(col)}" ${st()}/><path d="${bkPath(pts)}" fill="${col}" ${st()}/>`;
  s += key === "pastry" ? `<path d="${bkPath(bkHeartPts(180, 120, 46))}" fill="${mixColor(col, "#FFFFFF", 0.35)}" ${st(2)}/>` : `<path d="M110 160 C120 96 240 96 250 160 Z" fill="${mixColor(col, "#FFFFFF", 0.35)}" ${st(2)}/>`;
  const N = pts.length, upto = Math.floor(marks * N);
  for (let i = 0; i < upto; i += 2) {
    const [x, y] = pts[i], dx = x - cx, dy = y - cy, d = Math.hypot(dx, dy) || 1, ux = dx / d, uy = dy / d;
    const ix = x - ux * 4, iy = y - uy * 4, ox = x - ux * 16, oy = y - uy * 16;
    s += `<path d="M${bkF(ix)} ${bkF(iy)} L${bkF(ox)} ${bkF(oy)}" stroke="${shade(col)}" stroke-width="3" stroke-linecap="round"/>`;
  }
  return s;
};
const bkForkTop = (x, y, r = 0, s = 0.8) => g(`<path d="M-9 0 L-9 -26 M-3 0 L-3 -26 M3 0 L3 -26 M9 0 L9 -26" ${st(3)}/><path d="M-12 -26 C-12 -38 12 -38 12 -26 Z" fill="${C.steel}" ${st(3)}/><path d="M0 -34 L0 -96" ${st(8)}/><path d="M0 -34 L0 -96" stroke="${C.steel}" stroke-width="3.5" stroke-linecap="round"/>${g(fist(), 0, -92)}`, x, y, s, r);

LIB.add({ cat: "bake", name: "forkseal", foods: ["pastry", "piecrust"], dur: 3.2,
  steps: ["Crimp the edges with a fork to seal", "Press the edges together with a fork to seal", "Seal the edges of the hand pies with a fork"],
  draw(t, F, key) {
    const p = t / 3.2, m = ease(seg(p, 0.04, 0.92));
    let s = bkBigPie(F, key, m);
    const pts = bkPieOutline(key), [x, y] = pts[Math.min(pts.length - 1, Math.floor(m * pts.length))];
    const press = Math.abs(Math.sin(t * 9));
    if (p < 0.94) s += bkForkTop(x, y - 6 - press * 10, 0, 0.75);
    return s;
  } });

LIB.add({ cat: "bake", name: "steamvent", foods: ["pastry", "piecrust"], dur: 2.4,
  steps: ["Prick a small steam vent in the center with a toothpick", "Poke a small hole in the top of each pie to let steam escape"],
  draw(t, F, key) {
    const p = t / 2.4, down = Math.sin(seg(p, 0.1, 0.5) * Math.PI), hole = p > 0.3;
    const cy = key === "pastry" ? 120 : 132;
    let s = bkBigPie(F, key, 1);
    if (hole) s += `<ellipse cx="180" cy="${cy}" rx="4" ry="3" fill="#8A5A2B" ${st(1.6)}/>`;
    s += T.toothpick(180, cy - (1 - down) * 50 + 4 * down, 0);
    if (p > 0.6) s += T.check(306, 54, ease(seg(p, 0.6, 0.7)) * 0.8);
    return s;
  } });

LIB.add({ cat: "bake", name: "foldover", foods: ["apple", "chicken"], dur: 3,
  steps: ["Fold the dough over the filling to make a half-moon", "Fold in half and press the edges to seal"],
  draw(t, F, key) {
    const p = t / 3, f = ease(seg(p, 0.15, 0.6)), sy = lerp(1, -1, f), press = seg(p, 0.65, 0.95);
    const col = FOODS.piecrust.fill, cy = 136, R = 92;
    let s = `<rect x="24" y="30" width="312" height="196" rx="6" fill="${C.parchment}" ${st(3)}/>`;
    s += `<path d="M${180 - R} ${cy} A${R} ${R * 0.9} 0 0 0 ${180 + R} ${cy} Z" fill="${col}" ${st()}/>`;
    if (sy > -0.2) s += bkHeap(F, key, 180, cy + 34, 1.5);
    const top = `<path d="M${180 - R} 0 A${R} ${R * 0.9} 0 0 1 ${180 + R} 0 Z" fill="${sy < 0 ? mixColor(col, "#FFFFFF", 0.2) : col}" ${st()}/>`;
    s += `<g transform="translate(0 ${cy}) scale(1 ${bkF(Math.abs(sy) < 0.02 ? 0.02 : sy)})">${top}</g>`;
    if (press > 0) s += [...Array(Math.floor(press * 14))].map((_, i) => { const a = Math.PI * (i + 0.5) / 14; return `<circle cx="${bkF(180 - Math.cos(a) * (R - 8))}" cy="${bkF(cy + Math.sin(a) * (R * 0.9 - 8))}" r="3" fill="${shade(col)}"/>`; }).join("");
    if (press > 0 && press < 1) { const a = Math.PI * press; s += T.pinch(180 - Math.cos(a) * (R - 8), cy + Math.sin(a) * (R * 0.9 - 8) - 30, 0.8); }
    return s;
  } });

// ======================= PIE (3/4 view of the plate) =======================
const BK_CRUST = "#F1D49A";
// A crust lying in the plate with an overhang; trim: angle (0..2PI) already trimmed.
function bkPieShell(col, overhang = 1, trim = 0, eased = 1) {
  const n = 64;
  const pts = [...Array(n)].map((_, i) => {
    const a = i / n * Math.PI * 2 - Math.PI / 2, done = i / n * Math.PI * 2 < trim;
    const ex = done ? 0 : overhang * (16 + 5 * Math.sin(i * 1.9));
    return [BKP.cx + (BKP.rx - 4 + ex) * Math.cos(a), BKP.cy + (BKP.ry - 2 + ex * 0.6) * Math.sin(a) + (done ? 0 : ex * 0.4)];
  });
  let s = `<path d="${bkPath(pts)}" fill="${col}" ${st(3.5)}/>`;
  s += `<ellipse cx="${BKP.cx}" cy="${BKP.cy + 6}" rx="${BKP.rx - 30}" ry="${BKP.ry - 20}" fill="${shade(col)}" opacity="${0.5 * eased}"/>`;
  s += `<ellipse cx="${BKP.cx}" cy="${BKP.cy}" rx="${BKP.rx - 16}" ry="${BKP.ry - 9}" fill="none" stroke="${shade(col)}" stroke-width="2.5" opacity="${eased}"/>`;
  return s;
}
const bkParing = (x, y, deg = 62) => g(knife(0, 0, deg, 54), x, y, 0.88);

LIB.add({ cat: "bake", name: "linepiedish", foods: ["piecrust"], dur: 4,
  steps: ["Fit the crust into a 9-inch pie plate and trim the overhang", "Transfer the dough to a pie dish, gently ease it into the corners, and trim the edges", "Line a pie dish with the rolled-out dough"],
  draw(t, F) {
    const p = t / 4, drop = ease(seg(p, 0.03, 0.28)), ease2 = ease(seg(p, 0.3, 0.58)), trim = ease(seg(p, 0.62, 0.95)) * Math.PI * 2;
    const col = F.fill;
    let s = counter() + bkPlate();
    if (drop < 1) {
      s += `<ellipse cx="180" cy="${bkF(lerp(60, 150, drop))}" rx="${bkF(lerp(150, 150, drop))}" ry="${bkF(lerp(56, 78, drop))}" fill="${col}" ${st()}/>`;
    } else {
      s += bkPieShell(col, 1, trim, ease2);
      // trimmed scraps drop away near the knife
      if (trim > 0 && trim < Math.PI * 2) { const a = trim - Math.PI / 2; s += [0, 1].map(k => `<path transform="translate(${bkF(BKP.cx + (BKP.rx + 18) * Math.cos(a - 0.3 * k))} ${bkF(BKP.cy + (BKP.ry + 14) * Math.sin(a - 0.3 * k) + 10 + k * 10)})" d="M-8 -3 L8 -5 L6 4 L-6 5 Z" fill="${col}" ${st(2)}/>`).join(""); }
    }
    if (ease2 > 0 && ease2 < 1) { const a = ease2 * Math.PI * 2 + Math.PI / 2; s += T.palm(BKP.cx + 92 * Math.cos(a), BKP.cy + 38 * Math.sin(a) + 10, 0.8); }
    if (trim > 0 && trim < Math.PI * 2 - 0.01) { const a = trim - Math.PI / 2; s += bkParing(BKP.cx + (BKP.rx + 2) * Math.cos(a), BKP.cy + (BKP.ry + 2) * Math.sin(a)); }
    return s;
  } });

LIB.add({ cat: "bake", name: "trimcrust", foods: ["piecrust"], dur: 3,
  steps: ["Trim the overhang to 1 inch", "Trim the excess dough from the edges of the pie plate"],
  draw(t, F) {
    const p = t / 3, trim = ease(seg(p, 0.05, 0.9)) * Math.PI * 2;
    let s = counter() + bkPlate() + bkPieShell(F.fill, 1, trim, 1);
    if (trim < Math.PI * 2 - 0.01) { const a = trim - Math.PI / 2; s += bkParing(BKP.cx + (BKP.rx + 2) * Math.cos(a), BKP.cy + (BKP.ry + 2) * Math.sin(a)); }
    return s;
  } });

for (const [name, fork] of [["crimp", false], ["forkcrimp", true]]) LIB.add({ cat: "bake", name, foods: ["piecrust"], dur: 3.4,
  steps: fork ? ["Press the edge of the crust with the tines of a fork", "Seal the edges with a fork"] : ["Fold the overhang under and crimp the edges", "Crimp the edge of the pie crust with your fingers"],
  draw(t, F) {
    const p = t / 3.4, m = ease(seg(p, 0.04, 0.92)) * Math.PI * 2, col = F.fill;
    let s = counter() + bkPlate() + bkCrustIn(col);
    if (!fork) s += bkScallops(col, m);
    else s += [...Array(36)].map((_, i) => { const a = i / 36 * Math.PI * 2 - Math.PI / 2; if (i / 36 * Math.PI * 2 > m) return ""; const [x1, y1] = bkRim(a, -4), [x2, y2] = bkRim(a, 8); return `<path d="M${bkF(x1)} ${bkF(y1)} L${bkF(x2)} ${bkF(y2)}" stroke="${shade(col)}" stroke-width="3" stroke-linecap="round"/>`; }).join("");
    if (m < Math.PI * 2 - 0.01) { const a = m - Math.PI / 2, [x, y] = bkRim(a), bob = Math.abs(Math.sin(t * 9)) * 8; s += fork ? bkForkTop(x, y - bob, 0, 0.7) : T.pinch(x, y - 22 - bob, 0.85); }
    return s;
  } });

LIB.add({ cat: "bake", name: "dockcrust", foods: ["piecrust"], dur: 3,
  steps: ["Prick the bottom of the crust all over with a fork", "Dock the crust with a fork before blind baking"],
  draw(t, F) {
    const p = t / 3, col = F.fill;
    const spots = [[-60, -12], [-20, -16], [20, -16], [60, -12], [-80, 10], [-40, 8], [0, 6], [40, 8], [80, 10], [-50, 30], [-10, 30], [30, 30], [66, 28]];
    const n = seg(p, 0.03, 0.95) * spots.length;
    let s = counter() + bkPlate() + bkCrustIn(col) + bkScallops(col);
    spots.forEach(([dx, dy], i) => { if (n > i + 0.5) s += [-6, -2, 2, 6].map(o => `<circle cx="${180 + dx + o}" cy="${150 + dy}" r="1.6" fill="${INK}"/>`).join(""); });
    if (n < spots.length) { const i = Math.floor(n), q = n - i, [dx, dy] = spots[i]; s += bkForkTop(180 + dx, 150 + dy - (1 - Math.sin(q * Math.PI)) * 20, 0, 0.7); }
    return s;
  } });

LIB.add({ cat: "bake", name: "pieweights", foods: ["piecrust"], dur: 3,
  steps: ["Line the crust with parchment and fill with pie weights or dried beans", "Line the pie shell with parchment and add pie weights"],
  draw(t, F) {
    const p = t / 3, paper = ease(seg(p, 0.04, 0.3)), pour = seg(p, 0.36, 0.86), col = F.fill;
    let s = counter() + bkPlate() + bkCrustIn(col) + bkScallops(col);
    if (paper > 0) s += `<g transform="translate(0 ${bkF((1 - paper) * -60)})"><path d="M66 140 L294 140 L284 172 C230 196 130 196 76 172 Z" fill="${C.parchment}" ${st(3)} opacity="${paper}"/></g>`;
    const nb = Math.floor(pour * 46);
    s += [...Array(nb)].map((_, i) => { const a = bkRand(i, 71) * Math.PI * 2, d = Math.sqrt(bkRand(i, 72)); return `<ellipse cx="${bkF(180 + Math.cos(a) * d * 92)}" cy="${bkF(160 + Math.sin(a) * d * 26)}" rx="6.5" ry="4.5" fill="${i % 3 ? "#C9803A" : "#E8C47A"}" ${st(1.6)}/>`; }).join("");
    if (pour > 0 && pour < 1) s += `<g transform="rotate(-60 270 60)">${T.measuringCup(270, 60, 0, "#C9803A", 0.6)}</g>` + FX.fall(t, 0.4, 6, 214, 20, 70, 150, (x, y) => `<ellipse cx="${bkF(x)}" cy="${bkF(y)}" rx="6" ry="4" fill="#C9803A" ${st(1.4)}/>`);
    return s;
  } });

// Filling inside the crust, k = how full.
const bkPieFilling = (F, key, k) => {
  if (k <= 0) return "";
  const rx = (BKP.rx - 26) * Math.sqrt(k), ry = (BKP.ry - 16) * Math.sqrt(k);
  let s = `<ellipse cx="180" cy="${BKP.cy + 2}" rx="${bkF(rx)}" ry="${bkF(ry)}" fill="${bkFillColor(key, F)}" ${st(2.5)}/>`;
  if (!F.liquid) s += [...Array(Math.floor(k * 30))].map((_, i) => { const a = bkRand(i, 81) * Math.PI * 2, d = Math.sqrt(bkRand(i, 82)) * 0.85; return bkBit(F, key, 180 + Math.cos(a) * d * rx, BKP.cy + 2 + Math.sin(a) * d * ry, i * 40, 1); }).join("");
  else s += `<path d="M150 ${BKP.cy - 6} q20 -6 40 0" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".5"/>`;
  return s;
};

LIB.add({ cat: "bake", name: "fillpie", foods: ["apple", "blueberries", "peach", "pumpkinfilling", "chicken"], dur: 3,
  steps: ["Pour the filling into the crust", "Spoon the apple filling into the pie crust", "Pour the pumpkin filling into the unbaked pie shell", "Spoon the chicken filling into the bottom crust"],
  draw(t, F, key) {
    const p = t / 3, k = ease(seg(p, 0.08, 0.85)), col = BK_CRUST;
    let s = counter() + bkPlate() + bkCrustIn(col) + (key === "pumpkinfilling" ? bkScallops(col) : "") + bkPieFilling(F, key, k);
    const tip = Math.sin(seg(p, 0.02, 0.92) * Math.PI);
    s += `<g transform="rotate(${bkF(-tip * 70)} 288 52)">${V.smallBowl(288, 52, 0.45, `<path d="M-60 6 C-50 50 50 50 60 6 Z" fill="${bkFillColor(key, F)}"/>`)}</g>`;
    if (tip > 0.6) s += F.liquid ? FX.stream(254, 58, 200, 146, F.liquid, 8) : FX.fall(t, 0.45, 5, 222, 22, 70, 146, (x, y, i) => bkBit(F, key, x, y, i * 50, 1));
    return s;
  } });

LIB.add({ cat: "bake", name: "topcrust", foods: ["apple", "chicken", "blueberries"], dur: 3.4,
  steps: ["Place the top crust over the filling", "Lay the second crust over the filling and pinch the edges together", "Cover with the top crust, trim, and crimp the edges"],
  draw(t, F, key) {
    const p = t / 3.4, drop = ease(seg(p, 0.08, 0.45)), crimpA = ease(seg(p, 0.55, 0.94)) * Math.PI * 2, col = BK_CRUST;
    let s = counter() + bkPlate() + bkCrustIn(col) + bkPieFilling(F, key, 1);
    if (drop > 0) {
      const cy = lerp(40, BKP.cy, drop);
      s += `<g opacity="${Math.min(1, drop * 3)}"><ellipse cx="180" cy="${bkF(cy)}" rx="${BKP.rx - 6}" ry="${BKP.ry - 3}" fill="${mixColor(col, "#FFFFFF", 0.1)}" ${st()}/>
        <path d="M118 ${bkF(cy - 18)} C150 ${bkF(cy - 34)} 210 ${bkF(cy - 34)} 242 ${bkF(cy - 18)}" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity="${0.5 * drop}"/></g>`;
    }
    if (crimpA > 0) s += bkScallops(mixColor(col, "#FFFFFF", 0.1), crimpA);
    if (crimpA > 0 && crimpA < Math.PI * 2 - 0.01) { const [x, y] = bkRim(crimpA - Math.PI / 2); s += T.pinch(x, y - 22 - Math.abs(Math.sin(t * 9)) * 6, 0.85); }
    return s;
  } });

LIB.add({ cat: "bake", name: "slitcrust", foods: ["piecrust"], dur: 3.2,
  steps: ["Cut a few slits in the top crust to let steam escape", "Cut 4 or 5 small slits in the top crust with a sharp knife"],
  draw(t, F) {
    const p = t / 3.2, n = seg(p, 0.05, 0.9) * 4.4;
    let s = counter() + bkTopCrust(F.fill) + bkSlits(Math.min(4, Math.floor(n + 0.4)));
    const pos = [[-38, -10, 20], [38, -10, -20], [-30, 22, -20], [30, 22, 20]];
    if (n < 4) { const i = Math.floor(n), q = n - i, [dx, dy, r] = pos[i], a = r * Math.PI / 180; const x = 180 + dx + Math.cos(a) * lerp(-12, 12, q), y = 150 + dy + Math.sin(a) * lerp(-12, 12, q); s += bkParing(x, y - 2, 80); }
    return s;
  } });

LIB.add({ cat: "bake", name: "lattice", foods: ["blueberries", "apple", "peach"], dur: 3.6,
  steps: ["Weave the strips into a lattice over the filling", "Arrange the dough strips in a lattice pattern on top of the pie"],
  draw(t, F, key) {
    const p = t / 3.6, col = BK_CRUST, n = seg(p, 0.04, 0.92) * 10.6;
    const rx = BKP.rx - 14, ry = BKP.ry - 8, cy = BKP.cy;
    let s = counter() + bkPlate() + bkCrustIn(col) + bkPieFilling(F, key, 1);
    const xs = [-80, -40, 0, 40, 80], ys = [-36, -18, 0, 18, 36];
    const vstrip = (dx) => { const h = ry * Math.sqrt(1 - (dx / rx) ** 2); return `<rect x="${180 + dx - 8}" y="${bkF(cy - h)}" width="16" height="${bkF(2 * h)}" rx="5" fill="${col}" ${st(2.5)}/>`; };
    const hstrip = (dy) => { const w = rx * Math.sqrt(1 - (dy / ry) ** 2); return `<rect x="${bkF(180 - w)}" y="${cy + dy - 6}" width="${bkF(2 * w)}" height="12" rx="4" fill="${col}" ${st(2.5)}/>`; };
    xs.forEach((dx, i) => { if (n > i + 0.6) s += vstrip(dx); });
    ys.forEach((dy, j) => {
      if (n > 5 + j + 0.6) { s += hstrip(dy); xs.forEach((dx, i) => { if ((i + j) % 2 === 0) s += `<rect x="${180 + dx - 8}" y="${cy + dy - 8}" width="16" height="16" fill="${col}"/><path d="M${180 + dx - 8} ${cy + dy - 8} L${180 + dx - 8} ${cy + dy + 8} M${180 + dx + 8} ${cy + dy - 8} L${180 + dx + 8} ${cy + dy + 8}" ${st(2.5)}/>`; }); }
    });
    if (n < 10.5) { const i = Math.floor(n); s += i < 5 ? g(fist(), 180 + xs[i], cy - 70 + (n - i) * 30, 0.9) : g(fist(), 300 - (n - i) * 30, cy + ys[Math.min(4, i - 5)], 0.9); }
    return s;
  } });

// Gloss of egg wash, brushed left to right.
const BK_GLOSS = "#F2C45A";
const bkGlossMarks = (x0, x1, y0, y1, k = 1) => [[0.2, 0.3], [0.5, 0.2], [0.75, 0.55], [0.35, 0.7]].map(([a, b]) => { const x = lerp(x0, x1, a), y = lerp(y0, y1, b); return `<path d="M${bkF(x)} ${bkF(y)} q8 -5 16 0" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round" opacity="${0.8 * k}"/>`; }).join("");

LIB.add({ cat: "bake", name: "eggwashtop", foods: ["piecrust", "pastry", "breaddough"], dur: 3,
  steps: ["Brush the top crust with egg wash", "Brush with egg wash", "Brush the loaf with beaten egg", "Prick a small steam vent in the center with a toothpick and brush with egg wash."],
  draw(t, F, key) {
    const p = t / 3, X = lerp(40, 330, ease(seg(p, 0.05, 0.88)));
    let s = counter(), gloss = "";
    if (key === "piecrust") {
      s += bkTopCrust(F.fill) + bkSlits(4);
      gloss = `<path d="${bkEllLeft(BKP.cx, BKP.cy, BKP.rx - 2, BKP.ry + 2, X)}" fill="${BK_GLOSS}" opacity=".45"/>` + (X > 300 ? bkGlossMarks(100, 260, 110, 180) : "");
    } else if (key === "pastry") {
      s += `<rect x="24" y="44" width="312" height="170" rx="6" fill="${C.parchment}" ${st(3)}/>`;
      [[110, 128], [250, 128]].forEach(([x, y]) => {
        s += bkHeart(x, y + 6, 54, shade(F.fill)) + bkHeart(x, y, 54, F.fill) + bkHeart(x, y - 4, 30, mixColor(F.fill, "#FFFFFF", 0.3), 2);
        if (X > x) s += bkHeart(x, y, 54, BK_GLOSS, 0, `opacity=".45"`) + bkGlossMarks(x - 30, x + 20, y - 20, y + 10);
      });
    } else {
      s += `<path d="M60 206 C50 120 120 90 180 90 C240 90 310 120 300 206 Z" fill="${F.fill}" ${st()}/><path d="M130 130 L230 120 M120 160 L240 150" stroke="${shade(F.fill)}" stroke-width="4" stroke-linecap="round"/>`;
      gloss = `<path d="${bkPath([[60, 206], ...[...Array(20)].map((_, i) => { const u = i / 19, x = lerp(60, 300, u); return [Math.min(x, X), 206 - Math.sin(u * Math.PI) * 114]; }), [Math.min(300, X), 206]])}" fill="${BK_GLOSS}" opacity=".45"/>` + (X > 290 ? bkGlossMarks(110, 240, 110, 160) : "");
    }
    s += gloss;
    if (p < 0.92) s += T.brush(X, (key === "breaddough" ? 120 : 140) + Math.sin(t * 10) * 14, -30, BK_GLOSS) + g(fist(), X - 34, (key === "breaddough" ? 120 : 140) - 60 + Math.sin(t * 10) * 14, 0.9);
    return s;
  } });

LIB.add({ cat: "bake", name: "sugartop", foods: ["piecrust", "cakebatter"], dur: 2.6,
  steps: ["Sprinkle the top with coarse sugar", "Sprinkle the remaining tablespoon of sugar over the batter"],
  draw(t, F, key) {
    const p = t / 2.6, k = seg(p, 0.05, 0.9), hx = lerp(100, 260, k);
    let s = counter();
    let crystals;
    if (key === "piecrust") { s += bkTopCrust(F.fill) + bkSlits(4) + `<ellipse cx="${BKP.cx}" cy="${BKP.cy}" rx="${BKP.rx - 2}" ry="${BKP.ry + 2}" fill="${BK_GLOSS}" opacity=".35"/>`; crystals = (i) => [180 + (bkRand(i, 91) - 0.5) * 200, 150 + (bkRand(i, 92) - 0.5) * 90]; }
    else { s += bkSquareTop(`<rect x="90" y="42" width="180" height="168" rx="6" fill="${F.liquid}"/>`); crystals = (i) => [96 + bkRand(i, 91) * 168, 48 + bkRand(i, 92) * 156]; }
    s += [...Array(50)].map((_, i) => { const [x, y] = crystals(i); if (x > hx + 20) return ""; return `<rect x="${bkF(x)}" y="${bkF(y)}" width="4" height="4" fill="#fff" ${st(1)} transform="rotate(45 ${bkF(x)} ${bkF(y)})"/>`; }).join("");
    if (p < 0.92) s += FX.fall(t, 0.4, 5, hx, 24, 40, 110, (x, y) => `<rect x="${bkF(x)}" y="${bkF(y)}" width="4" height="4" fill="#fff" ${st(1)}/>`) + T.pinch(hx, 20, 1, 0);
    return s;
  } });

// ======================= POT PIE (skillet or baking dish, creamy filling) =======================
const BKS = { cx: 170, cy: 146, rx: 124, ry: 62 };
const bkSkillet = () => `<path d="M${BKS.cx + BKS.rx - 6} ${BKS.cy - 8} L346 ${BKS.cy - 18}" ${st(16)}/><path d="M${BKS.cx + BKS.rx - 6} ${BKS.cy - 8} L346 ${BKS.cy - 18}" stroke="${C.pan}" stroke-width="9" stroke-linecap="round"/>
  <ellipse cx="${BKS.cx}" cy="${BKS.cy + 12}" rx="${BKS.rx}" ry="${BKS.ry}" fill="${C.pan}" ${st()}/><ellipse cx="${BKS.cx}" cy="${BKS.cy}" rx="${BKS.rx}" ry="${BKS.ry}" fill="${C.pan}" ${st()}/>`;
const bkPotFilling = () => `<ellipse cx="${BKS.cx}" cy="${BKS.cy}" rx="${BKS.rx - 12}" ry="${BKS.ry - 7}" fill="${BK_CREAM}" ${st(3)}/>` +
  [...Array(26)].map((_, i) => { const a = bkRand(i, 101) * Math.PI * 2, d = Math.sqrt(bkRand(i, 102)) * 0.82; return bkBit(FOODS.chicken, "chicken", BKS.cx + Math.cos(a) * d * (BKS.rx - 14), BKS.cy + Math.sin(a) * d * (BKS.ry - 9), i * 30, 1.1); }).join("");
// Top crust on the skillet: overhang (by angle), trimmed angle, crimped angle.
function bkPotLid(F, key, { over = 1, trim = 0, crimp = 0, y = 0 } = {}) {
  const col = F.fill, n = 64, sq = key === "pastry";
  const pts = [...Array(n)].map((_, i) => {
    const a = i / n * Math.PI * 2 - Math.PI / 2, done = i / n * Math.PI * 2 < trim, c = Math.cos(a), sn = Math.sin(a);
    if (sq) { const m = Math.pow(c ** 4 + sn ** 4, 0.25), f = done ? 1 : lerp(1, 1.04 / m, over), add = done ? 0 : over * 8;
      return [BKS.cx + (BKS.rx - 4 + add) * f * c, BKS.cy + y + (BKS.ry - 2 + add * 0.5) * f * sn + (done ? 0 : over * 6)]; }
    const ex = done ? 4 : over * (18 + 5 * Math.sin(i * 1.7));
    return [BKS.cx + (BKS.rx - 8 + ex) * c, BKS.cy + y + (BKS.ry - 4 + ex * 0.55) * sn + (done ? 0 : ex * 0.3)];
  });
  let s = `<path d="${bkPath(pts)}" fill="${col}" ${st()}/>`;
  s += `<path d="M${BKS.cx - 70} ${BKS.cy + y - 22} C${BKS.cx - 30} ${BKS.cy + y - 40} ${BKS.cx + 30} ${BKS.cy + y - 40} ${BKS.cx + 70} ${BKS.cy + y - 22}" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".45"/>`;
  if (sq) s += `<path d="M${BKS.cx - 60} ${BKS.cy + y + 10} l20 -4 M${BKS.cx + 20} ${BKS.cy + y + 24} l24 -4" stroke="${shade(col)}" stroke-width="2.5" stroke-linecap="round"/>`;
  if (crimp > 0) s += [...Array(30)].map((_, i) => { const a = i / 30 * Math.PI * 2 - Math.PI / 2; if (i / 30 * Math.PI * 2 > crimp) return ""; const x = BKS.cx + (BKS.rx - 6) * Math.cos(a), yy = BKS.cy + y + (BKS.ry - 2) * Math.sin(a);
    return sq ? `<path d="M${bkF(x)} ${bkF(yy)} L${bkF(x - Math.cos(a) * 12)} ${bkF(yy - Math.sin(a) * 7)}" stroke="${shade(col)}" stroke-width="3" stroke-linecap="round"/>` : `<circle cx="${bkF(x)}" cy="${bkF(yy)}" r="8.5" fill="${col}" ${st(2.4)}/>`; }).join("");
  return s;
}
const BK_POTSLITS = [[-40, -10, 20], [40, -10, -20], [-28, 22, -20], [28, 22, 20]];
const bkPotSlits = (n, col) => BK_POTSLITS.slice(0, n).map(([dx, dy, r]) => { const x = BKS.cx + dx, y = BKS.cy + dy; return `<g transform="rotate(${r} ${x} ${y})"><path d="M${x - 12} ${y} l24 0" ${st(5.5)}/><path d="M${x - 10} ${y} l20 0" stroke="${BK_CREAM}" stroke-width="2.5"/></g>`; }).join("");
const POT_STEPS = { pastry: "puff pastry", piecrust: "pie crust" };

LIB.add({ cat: "bake", name: "potpietop", foods: ["piecrust", "pastry"], dur: 3.2,
  steps: ["Lay the pie crust over the filling in the skillet", "Top the chicken filling with the puff pastry sheet", "Cover the filling with the crust, letting the edges hang over"],
  draw(t, F, key) {
    const p = t / 3.2, drop = ease(seg(p, 0.25, 0.65)), press = seg(p, 0.7, 0.95);
    let s = counter() + bkSkillet() + bkPotFilling() + `<g opacity="${bkF(1 - drop)}">${FX.steam(t, [130, 210], 120, 0.5)}</g>`;
    if (drop > 0) s += `<g opacity="${Math.min(1, drop * 2.5)}">${bkPotLid(F, key, { y: lerp(-80, 0, drop) })}</g>`;
    if (press > 0 && press < 1) { const a = press * Math.PI * 2 - Math.PI / 2; s += T.palm(BKS.cx + (BKS.rx - 10) * Math.cos(a), BKS.cy + (BKS.ry - 4) * Math.sin(a) + 18, 0.75); }
    return s;
  } });

LIB.add({ cat: "bake", name: "potpietrim", foods: ["piecrust", "pastry"], dur: 3,
  steps: ["Trim the overhanging pastry around the edge of the skillet", "Trim the excess crust, leaving a little overhang"],
  draw(t, F, key) {
    const p = t / 3, trim = ease(seg(p, 0.05, 0.9)) * Math.PI * 2;
    let s = counter() + bkSkillet() + bkPotLid(F, key, { trim });
    if (trim < Math.PI * 2 - 0.01) { const a = trim - Math.PI / 2; s += bkParing(BKS.cx + (BKS.rx + 4) * Math.cos(a), BKS.cy + (BKS.ry + 4) * Math.sin(a)); }
    return s;
  } });

LIB.add({ cat: "bake", name: "potpiecrimp", foods: ["piecrust", "pastry"], dur: 3.2,
  steps: ["Crimp the edges of the crust to seal", "Press the pastry edges to the rim of the skillet to seal"],
  draw(t, F, key) {
    const p = t / 3.2, c = ease(seg(p, 0.05, 0.9)) * Math.PI * 2;
    let s = counter() + bkSkillet() + bkPotLid(F, key, { trim: 7, crimp: c });
    if (c < Math.PI * 2 - 0.01) { const a = c - Math.PI / 2, x = BKS.cx + (BKS.rx - 6) * Math.cos(a), y = BKS.cy + (BKS.ry - 2) * Math.sin(a), bob = Math.abs(Math.sin(t * 9)) * 6; s += key === "pastry" ? bkForkTop(x, y - bob, 0, 0.7) : T.pinch(x, y - 22 - bob, 0.85); }
    return s;
  } });

LIB.add({ cat: "bake", name: "potpieslits", foods: ["piecrust", "pastry"], dur: 3.2,
  steps: ["Cut a few slits in the top crust so steam can escape", "Cut 3 or 4 small slits in the center of the pastry"],
  draw(t, F, key) {
    const p = t / 3.2, n = seg(p, 0.05, 0.85) * 4.4, done = Math.min(4, Math.floor(n + 0.4));
    let s = counter() + bkSkillet() + bkPotLid(F, key, { trim: 7, crimp: 7 }) + bkPotSlits(done, F.fill);
    if (done > 0) s += FX.steam(t, BK_POTSLITS.slice(0, done).map(([dx]) => BKS.cx + dx), BKS.cy - 6, 0.5);
    if (n < 4) { const i = Math.floor(n), q = n - i, [dx, dy, r] = BK_POTSLITS[i], a = r * Math.PI / 180; s += bkParing(BKS.cx + dx + Math.cos(a) * lerp(-12, 12, q), BKS.cy + dy + Math.sin(a) * lerp(-12, 12, q) - 2, 80); }
    return s;
  } });

LIB.add({ cat: "bake", name: "potpiewash", foods: ["piecrust", "pastry"], dur: 3,
  steps: ["Brush the crust with egg wash", "Brush the puff pastry with beaten egg"],
  draw(t, F, key) {
    const p = t / 3, X = lerp(30, 320, ease(seg(p, 0.05, 0.88)));
    let s = counter() + bkSkillet() + bkPotLid(F, key, { trim: 7, crimp: 7 }) + bkPotSlits(4, F.fill);
    s += `<path d="${bkEllLeft(BKS.cx, BKS.cy, BKS.rx + 2, BKS.ry + 6, X)}" fill="${BK_GLOSS}" opacity=".45"/>` + (X > 290 ? bkGlossMarks(90, 240, 106, 180) : "");
    if (p < 0.92) s += T.brush(X, 136 + Math.sin(t * 10) * 14, -30, BK_GLOSS) + g(fist(), X - 34, 76 + Math.sin(t * 10) * 14, 0.9);
    return s;
  } });

// ======================= PIZZA (from above) =======================
const BKZ = { cx: 180, cy: 130, r: 96 };
const bkPizzaBase = (col = "#F6E6C2") => `<circle cx="${BKZ.cx}" cy="${BKZ.cy + 5}" r="${BKZ.r}" fill="${shade(col)}" ${st()}/><circle cx="${BKZ.cx}" cy="${BKZ.cy}" r="${BKZ.r}" fill="${col}" ${st()}/><circle cx="${BKZ.cx}" cy="${BKZ.cy}" r="${BKZ.r - 14}" fill="none" stroke="${shade(col)}" stroke-width="2.5"/>`;
const bkSauceDisc = (col) => `<circle cx="${BKZ.cx}" cy="${BKZ.cy}" r="${BKZ.r - 16}" fill="${col}" ${st(2.5)}/>`;
const bkShred = (x, y, r, col, w = 1.5) => `<path transform="translate(${bkF(x)} ${bkF(y)}) rotate(${bkF(r)}) scale(1.6)" d="M-9 -1 C-4 -5 4 3 9 -1 L9 2 C4 6 -4 -2 -9 3 Z" fill="${col}" stroke="${INK}" stroke-width="${w / 1.6}" stroke-linejoin="round"/>`;
const bkInPizza = (i, seed, R = BKZ.r - 22) => { const a = bkRand(i, seed) * Math.PI * 2, d = Math.sqrt(bkRand(i, seed + 1)) * R; return [BKZ.cx + Math.cos(a) * d, BKZ.cy + Math.sin(a) * d]; };

LIB.add({ cat: "bake", name: "stretchpizza", foods: ["pizzadough"], dur: 3,
  steps: ["For a round pizza, shape it into a rough circle", "Stretch the dough into a 12-inch round", "Gently stretch the dough with your hands, keeping the edge a little thicker"],
  draw(t, F) {
    const p = t / 3, k = ease(seg(p, 0.03, 0.9)), r = lerp(48, 90, k), rot = p * 180;
    let s = board() + bkDust(16, 40, 320, 50, 225, 5);
    s += `<circle cx="180" cy="${136 + 5}" r="${bkF(r)}" fill="${shade(F.fill)}" ${st()}/><circle cx="180" cy="136" r="${bkF(r)}" fill="${F.fill}" ${st()}/><circle cx="180" cy="136" r="${bkF(r - lerp(6, 14, k))}" fill="none" stroke="${shade(F.fill)}" stroke-width="2.5"/>`;
    const push = Math.sin(t * 8) * 4;
    [0, 180].forEach(o => { const a = (rot + o) * Math.PI / 180, d = r * 0.55 + push; s += T.palm(180 + Math.cos(a) * d, 136 + Math.sin(a) * d * 0.9 + 20, 0.85, rot + o + 90); });
    return s;
  } });

LIB.add({ cat: "bake", name: "pressinpan", foods: ["pizzadough"], dur: 3,
  steps: ["Press it over the bottom of the pan, stretching it towards the edges.", "Place the dough in the prepared pan(s)", "Press the dough into the oiled pan with your fingertips"],
  draw(t, F) {
    const p = t / 3, k = ease(seg(p, 0.03, 0.9));
    let s = V.sheetTop() + `<path d="M70 70 L150 64 M200 190 L290 184 M60 150 L110 146" stroke="#F2C84B" stroke-width="8" stroke-linecap="round" opacity=".7"/>`;
    const w = lerp(110, 262, k), h = lerp(80, 148, k);
    s += `<rect x="${bkF(180 - w / 2)}" y="${bkF(130 - h / 2 + 5)}" width="${bkF(w)}" height="${bkF(h)}" rx="${bkF(lerp(36, 14, k))}" fill="${shade(F.fill)}" ${st()}/><rect x="${bkF(180 - w / 2)}" y="${bkF(130 - h / 2)}" width="${bkF(w)}" height="${bkF(h)}" rx="${bkF(lerp(36, 14, k))}" fill="${F.fill}" ${st()}/>`;
    s += [...Array(Math.floor(k * 18))].map((_, i) => `<circle cx="${bkF(180 + (bkRand(i, 3) - 0.5) * (w - 30))}" cy="${bkF(130 + (bkRand(i, 4) - 0.5) * (h - 26))}" r="4" fill="${shade(F.fill)}"/>`).join("");
    const i = Math.floor(t * 3), push = Math.abs(Math.sin(t * Math.PI * 3));
    s += T.palm(180 + (bkRand(i, 7) - 0.5) * w * 0.7, 140 + (bkRand(i, 8) - 0.5) * h * 0.5 - push * 6, 0.9);
    return s;
  } });

LIB.add({ cat: "bake", name: "saucespiral", foods: ["tomatosauce", "pestosauce", "bbq"], dur: 3,
  steps: ["Spread the sauce over the dough, leaving a border", "Spread pizza sauce evenly over the crust", "Spoon the sauce onto the center and spread it out in a spiral"],
  draw(t, F) {
    const p = t / 3, k = ease(seg(p, 0.04, 0.88)), T6 = Math.PI * 5;
    let s = board() + bkPizzaBase();
    const pts = [...Array(Math.max(2, Math.floor(k * 90)))].map((_, i, a) => { const th = (i / 89) * T6; const r = 6 + th / T6 * 64; return [BKZ.cx + Math.cos(th) * r, BKZ.cy + Math.sin(th) * r]; });
    s += `<circle cx="${BKZ.cx}" cy="${BKZ.cy}" r="16" fill="${F.liquid}"/><path d="${bkPath(pts, false)}" fill="none" stroke="${F.liquid}" stroke-width="26" stroke-linecap="round" stroke-linejoin="round"/>`;
    if (k > 0.98) s += `<circle cx="${BKZ.cx}" cy="${BKZ.cy}" r="${BKZ.r - 16}" fill="none" ${st(2.5)}/>`;
    const [x, y] = pts[pts.length - 1];
    if (p < 0.94) s += T.metalSpoon(x, y, -30, F.liquid);
    return s;
  } });

LIB.add({ cat: "bake", name: "scattercheese", foods: ["mozzarella", "cheese", "parmesan"], dur: 2.8,
  steps: ["Sprinkle with mozzarella", "Top with shredded cheese", "Sprinkle the cheese evenly over the sauce"],
  draw(t, F, key) {
    const p = t / 2.8, k = seg(p, 0.03, 0.9), col = key === "mozzarella" ? "#FFFFFF" : key === "cheese" ? "#F7C94B" : "#F1E3B0";
    let s = board() + bkPizzaBase() + bkSauceDisc(LIQUIDS.tomatosauce);
    s += [...Array(Math.floor(k * 60))].map((_, i) => { const [x, y] = bkInPizza(i, 11); return key === "parmesan" ? `<circle cx="${bkF(x)}" cy="${bkF(y)}" r="3.6" fill="${col}" ${st(1.2)}/>` : bkShred(x, y, i * 47, col); }).join("");
    const hx = 180 + Math.cos(p * Math.PI * 4) * 60, hy = 110 + Math.sin(p * Math.PI * 4) * 30;
    if (p < 0.92) s += FX.fall(t, 0.4, 4, hx, 24, hy - 50, hy + 30, (x, y, i) => bkShred(x, y, i * 60, col)) + T.pinch(hx, hy - 70, 1);
    return s;
  } });

const bkTopping = (key, x, y, i) => {
  if (key === "pepperoni") return `<circle cx="${bkF(x)}" cy="${bkF(y)}" r="17" fill="#C8302A" ${st(2.5)}/><circle cx="${bkF(x - 4)}" cy="${bkF(y - 3)}" r="2" fill="#F2B4A6"/><circle cx="${bkF(x + 5)}" cy="${bkF(y + 3)}" r="2" fill="#F2B4A6"/>`;
  if (key === "mushroom") return g(`<path d="M-12 2 C-12 -12 12 -12 12 2 Z" fill="#E8D4B0" ${st(2.2)}/><rect x="-4" y="2" width="8" height="9" rx="2" fill="#F1E3C9" ${st(2.2)}/>`, x, y, 1.5, i * 40);
  if (key === "olives") return `<circle cx="${bkF(x)}" cy="${bkF(y)}" r="10" fill="#3B3B2A" ${st(2)}/><circle cx="${bkF(x)}" cy="${bkF(y)}" r="4" fill="#F7E7A8"/>`;
  return g(`<path d="M-14 -4 C-6 -10 6 -10 14 -4 L12 2 C4 -3 -4 -3 -12 2 Z" fill="${FOODS[key].fill}" ${st(2.2)}/>`, x, y, 1.5, i * 50);
};
LIB.add({ cat: "bake", name: "pizzatop", foods: ["pepperoni", "mushroom", "greenpepper", "olives"], dur: 3.2,
  steps: ["Top with pepperoni", "Arrange your toppings of choice on top", "Scatter the sliced mushrooms and peppers over the cheese"],
  draw(t, F, key) {
    const p = t / 3.2, spots = [[140, 96], [212, 92], [240, 140], [196, 172], [132, 168], [180, 132], [108, 128], [160, 60 + 46]];
    const n = seg(p, 0.03, 0.92) * 8.5;
    let s = board() + bkPizzaBase() + bkSauceDisc(LIQUIDS.tomatosauce) + [...Array(40)].map((_, i) => { const [x, y] = bkInPizza(i, 11); return bkShred(x, y, i * 47, "#FFFFFF"); }).join("");
    spots.forEach(([x, y], i) => { if (n > i + 0.6) s += bkTopping(key, x, y, i); });
    if (n < 8) { const i = Math.floor(n), q = n - i, [x, y] = spots[i]; s += T.pinch(x, y - 30 - (1 - Math.sin(q * Math.PI)) * 30, 0.9); if (q < 0.6) s += bkTopping(key, x, y - 6 - (1 - Math.sin(q * Math.PI)) * 30, i); }
    return s;
  } });

// ======================= BREAD AND ROLLS =======================
const bkDome = (col, h, base = 140) => bkBowlFill(col, base) + `<path d="M76 ${base + 2} C76 ${bkF(base - h * 1.33)} 284 ${bkF(base - h * 1.33)} 284 ${base + 2} Z" fill="${col}" ${st(3)}/>`;

LIB.add({ cat: "bake", name: "deflatedough", foods: ["breaddough", "pizzadough"], dur: 3,
  steps: ["Punch down the dough", "Gently deflate the risen dough", "Turn the risen dough out and press out the air"],
  draw(t, F) {
    const p = t / 3, push = ease(seg(p, 0.12, 0.4)), lift = ease(seg(p, 0.48, 0.7));
    const h = lerp(60, 14, push);
    let s = V.bowl(bkDome(F.fill, h));
    const top = 140 - h;
    if (push > 0.6 && lift < 0.6) s += `<path d="M80 ${top + 6} l-18 -8 M280 ${top + 6} l18 -8 M100 ${top - 10} l-12 -14 M260 ${top - 10} l12 -14" ${st(3)}/>`;
    s += g(fist(), 180, lerp(top - 34, 20, lift) + (lift ? 0 : 0), 1.9);
    return s;
  } });

LIB.add({ cat: "bake", name: "doughrise", foods: ["breaddough", "pizzadough"], dur: 3.2,
  steps: ["Place the dough in a lightly greased bowl, cover the bowl, and allow it to rise till it's very puffy", "Cover and let rise until doubled, about 1 hour"],
  draw(t, F) {
    const p = t / 3.2, k = ease(seg(p, 0.05, 0.85)), h = lerp(8, 60, k);
    let s = V.bowl(bkDome(F.fill, h));
    const bulge = Math.max(0, 140 - h * 1.0 - 126) * -1;
    const top = Math.min(116, 140 - h - 4);
    s += `<path d="M44 118 Q180 ${bkF(top - (116 - top) * 0.6)} 316 118" fill="#EAF6FF" fill-opacity=".25" stroke="${INK}" stroke-width="2.5"/><path d="M120 ${bkF(top + 4)} l26 -3" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`;
    s += T.timer(318, 46, p, 0.9);
    return s;
  } });

LIB.add({ cat: "bake", name: "divide", foods: ["breaddough", "pizzadough"], dur: 3,
  steps: ["Divide the dough into 12 equal pieces", "Divide the dough in half, for two pizzas", "Cut the dough into equal pieces with a bench scraper"],
  draw(t, F, key) {
    const p = t / 3, half = key === "pizzadough", cuts = half ? [180] : [92, 136, 180, 224, 268];
    const n = seg(p, 0.05, 0.85) * (cuts.length + 0.4), made = Math.min(cuts.length, Math.floor(n));
    let s = board() + bkDust(14, 40, 320, 50, 225, 6);
    const edges = [48, ...cuts.slice(0, made), 312], gap = 8;
    for (let i = 0; i < edges.length - 1; i++) {
      const off = (i - (edges.length - 2) / 2) * gap, x0 = edges[i] + off + (i ? 3 : 0), x1 = edges[i + 1] + off - (i < edges.length - 2 ? 3 : 0);
      if (half) { const gp = made ? 5 : 0; s += made ? `<path d="M${180 - gp} 76 A110 58 0 0 0 ${180 - gp} 192 Z" fill="${F.fill}" ${st()}/><path d="M${180 + gp} 76 A110 58 0 0 1 ${180 + gp} 192 Z" fill="${F.fill}" ${st()}/>` : `<ellipse cx="180" cy="134" rx="110" ry="58" fill="${F.fill}" ${st()}/>`; break; }
      else s += `<rect x="${bkF(x0)}" y="104" width="${bkF(x1 - x0)}" height="56" rx="${i === 0 || i === edges.length - 2 ? 24 : 8}" fill="${F.fill}" ${st()}/>`;
    }
    if (made < cuts.length) { const q = n - made, x = cuts[made] + (made - (edges.length - 2) / 2) * 0; s += bkBench(x, lerp(90, half ? 196 : 162, Math.sin(clamp(q * 1.2) * Math.PI / 2) * (q < 0.85 ? 1 : 0))); }
    return s;
  } });

LIB.add({ cat: "bake", name: "shapeballs", foods: ["breaddough", "cookiedough"], dur: 2.6,
  steps: ["Shape each piece into a smooth ball", "Roll 2-3 Tablespoons (depending on how large you like your cookies) of dough at a time into balls", "Roll the dough into 12 large balls"],
  draw(t, F, key) {
    const p = t / 2.6, k = ease(seg(p, 0.05, 0.8)), col = key === "cookiedough" ? F.fill : F.fill;
    let s = board();
    const rough = (x, y, s2) => `<path d="M${x - 22} ${y + 6} L${x - 16} ${y - 18} L${x + 10} ${y - 22} L${x + 24} ${y - 2} L${x + 14} ${y + 18} L${x - 12} ${y + 20} Z" fill="${col}" ${st(3)} transform="scale(1)"/>`;
    const ball = (x, y, r = 22) => `<circle cx="${x}" cy="${y + 4}" r="${r}" fill="${shade(col)}" ${st(3)}/><circle cx="${x}" cy="${y}" r="${r}" fill="${col}" ${st(3)}/><path d="M${x - 10} ${y - 8} q6 -6 14 -4" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".6"/>`;
    s += rough(70, 80) + rough(70, 136) + rough(70, 192);
    s += ball(290, 80) + ball(290, 136) + ball(290, 192);
    // the one being rolled: rough corners round off
    const pts = [[-22, 6], [-16, -18], [10, -22], [24, -2], [14, 18], [-12, 20]].map(([a, b]) => { const ang = Math.atan2(b, a); return [180 + lerp(a, Math.cos(ang) * 24, k), 136 + lerp(b, Math.sin(ang) * 24, k)]; });
    s += k < 0.95 ? `<path d="${bkPath(pts)}" fill="${col}" ${st(3)}/>` : ball(180, 136, 24);
    const a = t * 9;
    if (p < 0.85) s += T.palm(180 + Math.cos(a) * 12, 96 + Math.sin(a) * 8, 0.8);
    return s;
  } });

// Rolling a flat rectangle up into a log (from the bottom edge toward the top).
const bkRollUp = (col, roll, top = 56, bot = 206, x0 = 54, x1 = 306, surface = "") => {
  const front = lerp(bot, top + 22, roll), h = lerp(10, 44, roll);
  let s = "";
  if (front - top > 4) s += `<rect x="${x0}" y="${top}" width="${x1 - x0}" height="${bkF(front - top)}" rx="6" fill="${col}" ${st()}/>${surface ? `<g>${surface(top, front)}</g>` : ""}`;
  s += `<rect x="${x0 - 2}" y="${bkF(front - h / 2)}" width="${x1 - x0 + 4}" height="${bkF(h)}" rx="${bkF(h / 2)}" fill="${col}" ${st()}/>`;
  s += `<path d="M${x0 + 4} ${bkF(front)} m${bkF(h * 0.3)} 0 a${bkF(h * 0.18)} ${bkF(h * 0.18)} 0 1 1 ${bkF(h * 0.18)} ${bkF(h * 0.12)} a${bkF(h * 0.3)} ${bkF(h * 0.3)} 0 1 1 ${bkF(-h * 0.36)} ${bkF(-h * 0.16)}" fill="none" stroke="${shade(col)}" stroke-width="2.4"/>`;
  return s;
};
const BK_CINN = "#A8622E";
const bkCinnSurface = (amt = 1) => (y0, y1) => `<rect x="62" y="${bkF(y0 + 6)}" width="236" height="${bkF(Math.max(0, y1 - y0 - 10))}" rx="4" fill="#FFE89A" opacity=".85"/>` +
  [...Array(Math.floor(60 * amt))].map((_, i) => { const x = 66 + bkRand(i, 5) * 228, y = 64 + bkRand(i, 6) * 136; return y > y0 + 6 && y < y1 - 4 ? `<circle cx="${bkF(x)}" cy="${bkF(y)}" r="2.6" fill="${BK_CINN}"/>` : ""; }).join("");

LIB.add({ cat: "bake", name: "shapeloaf", foods: ["breaddough"], dur: 3.4,
  steps: ["Shape the dough into a loaf and place it in the greased pan", "Roll the dough up into a log, pinch the seam, and place seam-side down in the loaf pan"],
  draw(t, F) {
    const p = t / 3.4, roll = ease(seg(p, 0.05, 0.5)), move = ease(seg(p, 0.58, 0.85));
    let s = `<rect x="66" y="150" width="228" height="76" rx="8" fill="${C.steelDark}" ${st()}/><rect x="76" y="160" width="208" height="56" rx="5" fill="#B9C0C6"/>`;
    s += `<g transform="translate(0 ${bkF(move * 60)})">${bkRollUp(F.fill, roll, 40, 140, 82, 278)}</g>`;
    if (roll < 1) s += T.palm(lerp(110, 250, (Math.sin(t * 6) + 1) / 2), lerp(150, 70, roll), 0.8);
    return s;
  } });

LIB.add({ cat: "bake", name: "scoreloaf", foods: ["breaddough"], dur: 2.6,
  steps: ["Slash the top of the loaf with a sharp knife", "Score the dough with a razor or sharp knife just before baking"],
  draw(t, F) {
    const p = t / 2.6, k = ease(seg(p, 0.15, 0.7));
    let s = counter() + `<path d="M40 210 L320 210" stroke="${C.parchment}" stroke-width="12"/><path d="M60 208 C50 120 120 84 180 84 C240 84 310 120 300 208 Z" fill="${F.fill}" ${st()}/>`;
    const arc = (u) => { const x = lerp(110, 250, u); return [x, 112 - Math.sin(u * Math.PI) * 18 + (x - 180) * 0.12]; };
    if (k > 0) { const pts = [...Array(20)].map((_, i) => arc(i / 19 * k)); s += `<path d="${bkPath(pts, false)}" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="${bkPath(pts, false)}" fill="none" stroke="#FBF1D9" stroke-width="3" stroke-linecap="round"/>`; }
    const [x, y] = arc(k);
    if (p > 0.08 && p < 0.8) s += knife(x, y, 145, 70);
    return s;
  } });

LIB.add({ cat: "bake", name: "cinnaspread", foods: ["butter"], dur: 3,
  steps: ["Spread the softened butter over the dough", "Spread the butter evenly over the rolled-out dough, all the way to the edges"],
  draw(t) {
    const p = t / 3, X = lerp(60, 300, ease(seg(p, 0.05, 0.88)));
    let s = board() + bkRolled(FOODS.breaddough.fill, 54, 56, 252, 150);
    s += `<rect x="62" y="64" width="${bkF(Math.max(0, X - 62))}" height="134" rx="4" fill="#FFE89A" opacity=".9"/>` + [...Array(5)].map((_, i) => { const x = 70 + i * 50; return x < X - 20 ? `<path d="M${x} ${80 + (i % 2) * 60} q16 -10 32 0" stroke="#F2C84B" stroke-width="3" fill="none" stroke-linecap="round"/>` : ""; }).join("");
    s += `<ellipse cx="${bkF(Math.max(X + 26, 270))}" cy="130" rx="${bkF(lerp(26, 6, ease(seg(p, 0, 0.9))))}" ry="${bkF(lerp(16, 4, ease(seg(p, 0, 0.9))))}" fill="#FFE08A" ${st(2.5)}/>`;
    if (p < 0.92) s += bkOffset(X - 40, 140 + Math.sin(t * 7) * 44, -28);
    return s;
  } });

LIB.add({ cat: "bake", name: "cinnasugar", foods: ["cinnamon"], dur: 2.8,
  steps: ["Sprinkle the cinnamon sugar evenly over the butter", "Sprinkle the filling over the dough, leaving a small border"],
  draw(t) {
    const p = t / 2.8, hx = lerp(70, 300, ease(seg(p, 0.03, 0.88)));
    let s = board() + bkRolled(FOODS.breaddough.fill, 54, 56, 252, 150) + `<rect x="62" y="64" width="236" height="134" rx="4" fill="#FFE89A" opacity=".9"/>`;
    s += [...Array(70)].map((_, i) => { const x = 66 + bkRand(i, 5) * 228, y = 68 + bkRand(i, 6) * 126; return x < hx ? `<circle cx="${bkF(x)}" cy="${bkF(y)}" r="2.6" fill="${BK_CINN}"/>` : ""; }).join("");
    if (p < 0.92) s += FX.fall(t, 0.4, 5, hx, 26, 30, 110, (x, y) => `<circle cx="${bkF(x)}" cy="${bkF(y)}" r="2.6" fill="${BK_CINN}"/>`) + T.pinch(hx, 14, 1);
    return s;
  } });

LIB.add({ cat: "bake", name: "rollupspiral", foods: ["breaddough"], dur: 3,
  steps: ["Roll up the dough tightly starting from the long side", "Roll up into a log and pinch the seam closed"],
  draw(t, F) {
    const p = t / 3, roll = ease(seg(p, 0.05, 0.85));
    let s = board() + bkRollUp(F.fill, roll, 56, 206, 54, 306, bkCinnSurface());
    if (roll < 1) s += T.palm(lerp(110, 250, (Math.sin(t * 6) + 1) / 2), lerp(226, 98, roll), 0.8);
    return s;
  } });

const bkSpiral = (x, y, r, col) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${col}" ${st(3)}/><path d="M${x} ${y} m-2 0 a3 3 0 1 1 5 2 a7 7 0 1 1 -12 -4 a11 11 0 1 1 18 10" fill="none" stroke="${BK_CINN}" stroke-width="3" stroke-linecap="round" transform="translate(${x} ${y}) scale(${r / 22}) translate(${-x} ${-y})"/>`;
LIB.add({ cat: "bake", name: "slicerounds", foods: ["breaddough"], dur: 3.2,
  steps: ["Cut the log into 12 rolls", "Slice into 1-inch rounds and place them in the pan"],
  draw(t, F) {
    const p = t / 3.2, n = seg(p, 0.05, 0.9) * 4.5, made = Math.min(4, Math.floor(n));
    let s = board();
    const right = 300 - made * 44;
    s += `<rect x="56" y="70" width="${right - 56}" height="46" rx="22" fill="${F.fill}" ${st()}/>` + bkSpiral(64, 93, 18, F.fill).replace(/r="18"/, 'r="18"');
    for (let i = 0; i < made; i++) s += bkSpiral(260 - i * 56, 178, 24, F.fill);
    if (made < 4) { const q = n - made, cutX = right - 44; s += knife(cutX, lerp(60, 118, Math.sin(clamp(q * 1.2) * Math.PI / 2)), 90, 70); }
    return s;
  } });

LIB.add({ cat: "bake", name: "dollopbatter", foods: ["apple", "peach", "blueberries"], dur: 3.2,
  steps: ["Using a large spoon, dollop 8 to 10 spoonfuls of the biscuit batter over the apples, allowing the filling to show through in spots", "Drop spoonfuls of the topping over the fruit"],
  draw(t, F, key) {
    const p = t / 3.2, spots = [[100, 90], [170, 84], [244, 92], [126, 146], [200, 140], [266, 160], [90, 182], [164, 186], [236, 196]];
    const n = seg(p, 0.03, 0.92) * 9.4;
    let inner = `<rect x="62" y="62" width="236" height="140" rx="8" fill="${bkFillColor(key, F)}"/>` + [...Array(24)].map((_, i) => bkBit(F, key, 74 + bkRand(i, 51) * 212, 72 + bkRand(i, 52) * 120, i * 37, 1.1)).join("");
    spots.forEach(([x, y], i) => { if (n > i + 0.6) inner += `<path transform="translate(${x} ${y})" d="M-22 4 C-26 -14 -8 -20 2 -16 C16 -20 26 -6 20 8 C14 18 -16 20 -22 4 Z" fill="#F3DDA8" ${st(2.8)}/>`; });
    let s = V.dishTop(inner);
    if (n < 9) { const i = Math.floor(n), q = n - i, [x, y] = spots[i]; s += T.metalSpoon(x + 4, y - 6 - (1 - Math.sin(q * Math.PI)) * 30, -20, q < 0.55 ? "#F3DDA8" : null); }
    return s;
  } });

// ======================= BATTERS =======================
LIB.add({ cat: "bake", name: "batterinpan", foods: ["cakebatter", "brownbatter"], dur: 3.4,
  steps: ["Spread batter into prepared pan.", "Transfer the brownie batter to your prepared pan and spread into a thin layer", "Pour the batter into the pan and smooth the top"],
  draw(t, F) {
    const p = t / 3.4, pour = ease(seg(p, 0.04, 0.42)), smooth = ease(seg(p, 0.5, 0.9));
    const w = lerp(lerp(30, 140, pour), 180, smooth), h = lerp(lerp(26, 120, pour), 168, smooth), rx = lerp(lerp(14, 56, pour), 6, smooth);
    let s = bkSquareTop(`<rect x="${bkF(180 - w / 2)}" y="${bkF(126 - h / 2)}" width="${bkF(w)}" height="${bkF(h)}" rx="${bkF(rx)}" fill="${F.liquid}" ${st(smooth > 0.98 ? 0 : 2.5)}/>` +
      (smooth < 0.9 ? `<path d="M150 110 q16 -10 32 0 M170 140 q16 -10 32 0" stroke="${shade(F.liquid)}" stroke-width="3" fill="none" stroke-linecap="round" opacity="${1 - smooth}"/>` : `<path d="M110 70 q14 -6 28 0" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".6"/>`));
    const tip = Math.sin(seg(p, 0, 0.46) * Math.PI);
    if (p < 0.46) s += `<g transform="rotate(${bkF(-tip * 90)} 300 44)">${V.smallBowl(300, 44, 0.45, `<path d="M-60 6 C-50 50 50 50 60 6 Z" fill="${F.liquid}"/>`)}</g>` + (tip > 0.6 ? FX.stream(266, 50, 190, 120, F.liquid, 8) : "");
    if (p > 0.48 && p < 0.92) s += bkOffset(lerp(100, 200, (Math.sin(t * 5) + 1) / 2), lerp(60, 196, smooth), -4);
    return s;
  } });

LIB.add({ cat: "bake", name: "batterloaf", foods: ["bananabatter", "cakebatter"], dur: 3,
  steps: ["Pour batter into the prepared loaf pan.", "Scrape the batter into the loaf pan and smooth the top"],
  draw(t, F) {
    const p = t / 3, k = ease(seg(p, 0.08, 0.85)), y = lerp(204, 140, k);
    const xl = lerp(102, 90, (204 - y) / 84), xr = lerp(258, 270, (204 - y) / 84);
    let s = counter() + V.loafTin(k > 0.02 ? `<path d="M${bkF(xl)} ${bkF(y)} L${bkF(xr)} ${bkF(y)} L258 204 L102 204 Z" fill="${F.liquid}" ${st(2.5)}/>` : "");
    const tip = Math.sin(seg(p, 0, 0.92) * Math.PI);
    s += `<g transform="rotate(${bkF(-tip * 80)} 290 52)">${V.smallBowl(290, 52, 0.5, `<path d="M-60 6 C-50 50 50 50 60 6 Z" fill="${F.liquid}"/>`)}</g>`;
    if (tip > 0.6) s += FX.stream(256, 58, 190, y, F.liquid, 9);
    return s;
  } });

LIB.add({ cat: "bake", name: "tappan", foods: ["cakebatter", "brownbatter"], dur: 2.4,
  steps: ["Tap the pan on the counter to release air bubbles", "Tap the pan a few times to pop any big bubbles"],
  draw(t, F) {
    const p = t / 2.4, cyc = (p * 3) % 1, dy = -Math.sin(cyc * Math.PI) * 24, hits = Math.floor(p * 3);
    const nb = Math.max(0, 7 - hits * 3);
    const inner = `<ellipse cx="180" cy="146" rx="94" ry="9" fill="${F.liquid}" ${st(2)}/>` + [...Array(nb)].map((_, i) => `<circle cx="${110 + i * 22}" cy="${145 + (i % 2) * 2}" r="4.5" fill="#fff" ${st(1.8)}/>`).join("");
    let s = counter() + `<g transform="translate(0 ${bkF(dy + 8)})">${V.roundTin(inner)}${g(fist(), 64, 172)}${g(fist(), 296, 172)}</g>`;
    if (cyc < 0.12 || cyc > 0.94) s += `<path d="M70 214 l-16 -6 M290 214 l16 -6 M80 222 l-20 2 M280 222 l20 2" ${st(3)}/>`;
    return s;
  } });

LIB.add({ cat: "bake", name: "fillcups", foods: ["cakebatter", "blueberries"], dur: 3.2,
  steps: ["Pour batter in the muffin tin - filling each cup 2/3 of the way full, but not all the way to the top", "Fill the cupcake liners two-thirds full"],
  draw(t, F, key) {
    const p = t / 3.2, n = seg(p, 0.03, 0.92) * 4.4, col = key === "blueberries" ? "#F6D9A3" : F.liquid;
    let s = bkSideCups((x, i) => { const lv = clamp(n - i) * 0.66; if (lv <= 0) return ""; return bkCupLevel(x, lv, col) + (key === "blueberries" ? [[-8, 0], [6, 6], [0, 12]].map(([a, b]) => `<circle cx="${x + a}" cy="${bkF(lerp(200, 134, lv) + 8 + b)}" r="4" fill="${F.inner}" ${st(1.4)}/>`).join("") : ""); });
    if (n < 4) { const i = Math.floor(n), x = BK_SIDECUPS[i]; s += FX.stream(x + 6, 100, x, lerp(196, 156, n - i), col, 6) + g(T.measuringCup(0, 0, 0, col, 0.5), x + 34, 86, 1, -75); }
    return s;
  } });

LIB.add({ cat: "bake", name: "marble", foods: ["chocolate", "creamcheese"], dur: 3.4,
  steps: ["Drop spoonfuls of the chocolate batter over the vanilla and swirl with a knife", "Dollop the cream cheese mixture over the brownie batter and swirl with a knife"],
  draw(t, F, key) {
    const p = t / 3.4, drop = seg(p, 0.03, 0.4), sw = ease(seg(p, 0.45, 0.9));
    const base = key === "chocolate" ? LIQUIDS.cakebatter : LIQUIDS.brownbatter, top = key === "chocolate" ? "#6B3A22" : "#FBF8EE";
    const spots = [[120, 80], [220, 76], [170, 126], [110, 170], [236, 170], [180, 196]];
    let inner = `<rect x="90" y="42" width="180" height="168" rx="6" fill="${base}"/>`;
    spots.forEach(([x, y], i) => {
      if (drop * 6.4 < i + 0.5) return;
      const r = lerp(16, 6, sw), len = sw * 36;
      inner += `<path d="M${x - len} ${y + len * 0.3} C${x - len / 2} ${y - 12 * sw} ${x + len / 2} ${y + 12 * sw} ${x + len} ${y - len * 0.3}" fill="none" stroke="${top}" stroke-width="${bkF(r * 2)}" stroke-linecap="round"/>`;
    });
    let s = bkSquareTop(inner);
    if (sw > 0 && sw < 1) { const a = sw * Math.PI * 4; s += knife(180 + Math.sin(a) * 70, 126 + Math.sin(a * 2) * 50, 100, 60); }
    else if (drop < 1) { const i = Math.min(5, Math.floor(drop * 6.4)), [x, y] = spots[i]; s += T.metalSpoon(x + 4, y - 10, -20, top); }
    return s;
  } });

LIB.add({ cat: "bake", name: "chipstop", foods: ["chips", "nuts"], dur: 2.6,
  steps: ["Sprinkle the reserved chocolate chips on top", "Sprinkle with the chopped nuts before baking"],
  draw(t, F, key) {
    const p = t / 2.6, hx = lerp(100, 260, ease(seg(p, 0.04, 0.9)));
    let s = bkSquareTop(`<rect x="90" y="42" width="180" height="168" rx="6" fill="${LIQUIDS.cakebatter}"/>`);
    s += [...Array(30)].map((_, i) => { const x = 98 + bkRand(i, 21) * 164, y = 50 + bkRand(i, 22) * 152; return x < hx + 10 ? bkBit(F, key, x, y, i * 40, 0.9) : ""; }).join("");
    if (p < 0.92) s += FX.fall(t, 0.4, 4, hx, 24, 30, 110, (x, y, i) => bkBit(F, key, x, y, i * 50, 0.9)) + T.pinch(hx, 14, 1);
    return s;
  } });

LIB.add({ cat: "bake", name: "dropcookie", foods: ["cookiedough"], dur: 3,
  steps: ["Drop spoonfuls of the cookie dough onto the brownie batter.", "Drop spoonfuls of the cookie dough over the batter; it doesn't need full coverage"],
  draw(t, F) {
    const p = t / 3, spots = [[118, 76], [182, 70], [244, 82], [134, 128], [214, 126], [110, 182], [176, 176], [246, 186]];
    const n = seg(p, 0.03, 0.92) * 8.4;
    let inner = `<rect x="90" y="42" width="180" height="168" rx="6" fill="${LIQUIDS.brownbatter}"/><path d="M110 60 q14 -6 28 0" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".4"/>`;
    const lump = (x, y) => `<path transform="translate(${x} ${y})" d="M-18 4 C-20 -12 -4 -16 2 -13 C14 -16 20 -4 16 6 C12 16 -14 16 -18 4 Z" fill="${F.fill}" ${st(2.6)}/><circle cx="${x - 6}" cy="${y - 2}" r="2.6" fill="#4A2A1A"/><circle cx="${x + 6}" cy="${y + 4}" r="2.6" fill="#4A2A1A"/>`;
    spots.forEach(([x, y], i) => { if (n > i + 0.6) inner += lump(x, y); });
    let s = bkSquareTop(inner);
    if (n < 8) { const i = Math.floor(n), q = n - i, [x, y] = spots[i]; s += T.metalSpoon(x + 4, y - 8 - (1 - Math.sin(q * Math.PI)) * 26, -20, q < 0.55 ? F.fill : null); }
    return s;
  } });

LIB.add({ cat: "bake", name: "forkcross", foods: ["cookiedough"], dur: 3,
  steps: ["Flatten each ball with a fork in a crisscross pattern", "Press each cookie twice with a fork to make a crosshatch"],
  draw(t, F) {
    const p = t / 3, a = ease(seg(p, 0.08, 0.3)), b = ease(seg(p, 0.5, 0.72));
    const press1 = Math.sin(seg(p, 0.08, 0.4) * Math.PI), press2 = Math.sin(seg(p, 0.5, 0.82) * Math.PI);
    let s = V.sheetTop() + `<rect x="46" y="52" width="268" height="156" rx="6" fill="${C.parchment}"/>`;
    const r = lerp(28, 38, Math.max(a, b * 1));
    const ball = (x, rr, done) => `<circle cx="${x}" cy="134" r="${rr}" fill="${shade(F.fill)}" ${st(3)}/><circle cx="${x}" cy="130" r="${rr}" fill="${F.fill}" ${st(3)}/>` + (done ? [-12, -4, 4, 12].map(o => `<path d="M${x + o} ${130 - rr + 8} L${x + o} ${130 + rr - 8} M${x - rr + 8} ${130 + o} L${x + rr - 8} ${130 + o}" stroke="${shade(F.fill)}" stroke-width="3" stroke-linecap="round"/>`).join("") : "");
    s += ball(84, 38, true) + ball(276, 28, false);
    s += `<circle cx="180" cy="134" r="${bkF(r)}" fill="${shade(F.fill)}" ${st(3)}/><circle cx="180" cy="130" r="${bkF(r)}" fill="${F.fill}" ${st(3)}/>`;
    if (a > 0.5) s += [-12, -4, 4, 12].map(o => `<path d="M${180 + o} ${bkF(130 - r + 8)} L${180 + o} ${bkF(130 + r - 8)}" stroke="${shade(F.fill)}" stroke-width="3" stroke-linecap="round"/>`).join("");
    if (b > 0.5) s += [-12, -4, 4, 12].map(o => `<path d="M${bkF(180 - r + 8)} ${130 + o} L${bkF(180 + r - 8)} ${130 + o}" stroke="${shade(F.fill)}" stroke-width="3" stroke-linecap="round"/>`).join("");
    if (p < 0.42) s += bkForkTop(180, 112 - (1 - press1) * 26, 0, 0.8);
    else if (p > 0.46 && p < 0.86) s += bkForkTop(196, 130 - (1 - press2) * 26, 90, 0.8);
    return s;
  } });

// ======================= FINISHING =======================
// Baked goods in their pans, side view; returns svg. top: y of the surface.
function bkBaked(key, doneK = 1) {
  const gold = mixColor("#E8B46A", "#C98340", doneK);
  if (key === "cake") return { top: 120, svg: V.roundTin(`<path d="M84 142 C100 104 260 104 276 142 Z" fill="${gold}" ${st(3)}/>`) };
  if (key === "brownies") return { top: 146, svg: `<rect x="72" y="146" width="216" height="22" fill="${mixColor("#6B3A22", "#4A2A1A", doneK)}" ${st(3)}/><path d="M96 152 l20 4 M150 150 l26 3 M220 152 l20 4" stroke="#8A5230" stroke-width="3" stroke-linecap="round"/><rect x="62" y="156" width="236" height="50" rx="6" fill="${C.steelDark}" ${st()}/>` };
  if (key === "muffins") return { top: 118, svg: bkSideCups((x) => `<path d="M${x - 30} 140 C${x - 26} 110 ${x + 26} 110 ${x + 30} 140 Z" fill="${gold}" ${st(3)}/>`) };
  return { top: 104, svg: V.loafTin(`<path d="M86 124 C96 86 264 86 274 124 Z" fill="${gold}" ${st(3)}/><path d="M130 104 C160 96 200 96 230 104" fill="none" stroke="${shade(gold)}" stroke-width="3"/>`) };
}

LIB.add({ cat: "bake", name: "toothpicktest", foods: ["cake", "brownies", "muffins", "bread"], dur: 4.4,
  steps: ["Bake in the preheated oven until a toothpick inserted into the center comes out clean, about 60 minutes.", "Bake until a toothpick inserted in the center comes out clean", "Check with a toothpick; if wet batter clings, bake a few minutes more"],
  draw(t, F, key) {
    const p = t / 4.4, second = p >= 0.5, q = second ? (p - 0.5) * 2 : p * 2;
    const B = bkBaked(key, second ? 1 : 0.55);
    const x = key === "muffins" ? 140 : 180, depth = B.top + 36;
    const into = ease(seg(q, 0.08, 0.3)), out = ease(seg(q, 0.4, 0.6));
    const tipY = lerp(lerp(B.top - 50, depth, into), B.top - 26, out);
    const wet = key === "brownies" ? "#3A1E10" : "#F6D9A3";
    let s = counter();
    const pick = g(T.toothpick(0, 0, 0, out > 0.5 && !second ? wet : null), x, tipY, 1.5);
    s += out > 0 ? B.svg + pick : pick + B.svg;
    if (q > 0.62) s += second ? T.check(306, 54, 1.4 * ease(seg(q, 0.62, 0.72))) : T.cross(306, 54, 1.4 * ease(seg(q, 0.62, 0.72)));
    if (!second && q > 0.75) s += T.timer(54, 54, (q - 0.75) * 4, 1.2);
    return s;
  } });

LIB.add({ cat: "bake", name: "turnout", foods: ["cake", "bread"], dur: 3.6,
  steps: ["Let bread cool in pan for 10 minutes, then turn out onto a wire rack to cool completely.", "Invert the cake onto a wire rack and lift off the pan", "Turn out onto a wire rack to cool completely"],
  draw(t, F, key) {
    const p = t / 3.6, rackOn = ease(seg(p, 0.03, 0.2)), flip = ease(seg(p, 0.26, 0.52)), lift = ease(seg(p, 0.6, 0.82));
    const gold = "#C98340", cake = key === "cake";
    const body = cake ? `<path d="M86 142 C100 104 260 104 274 142 L276 204 L84 204 Z" fill="${gold}" ${st(3)}/>` : `<path d="M88 124 C98 86 262 86 272 124 L258 204 L102 204 Z" fill="${gold}" ${st(3)}/>`;
    const tin = cake ? `<path d="M80 140 L280 140 L276 200 C276 208 84 208 84 200 Z" fill="${C.steelDark}" ${st()}/><ellipse cx="180" cy="140" rx="100" ry="10" fill="none" ${st(4)}/>` : `<path d="M90 120 L270 120 L258 206 L102 206 Z" fill="${C.steelDark}" ${st()}/><path d="M84 120 L276 120" ${st(5)}/>`;
    const rackY = cake ? 102 : 84;
    let inner = body + `<g transform="translate(0 ${bkF(lift * 110)})">${tin}</g>` + `<g transform="translate(0 ${bkF((1 - rackOn) * -50)}) rotate(180 180 ${rackY})">${V.rack(rackY)}</g>`;
    if (flip > 0 && flip < 1) inner += T.mitt(52, 160, 90) + T.mitt(308, 160, -90);
    let s = counter() + `<g transform="translate(0 ${bkF(flip * (cake ? 6 : -14))}) rotate(${bkF(flip * 180)} 180 ${cake ? 154 : 146})">${inner}</g>`;
    return s;
  } });

LIB.add({ cat: "bake", name: "cookiestorack", foods: ["cookies"], dur: 3,
  steps: ["Let the cookies cool briefly on the baking sheets, then transfer them to a wire rack to cool completely.", "Move the cookies to a wire rack with a spatula"],
  draw(t, F) {
    const p = t / 3, mv = ease(seg(p, 0.2, 0.7));
    const cookie = (x, y) => `<ellipse cx="${bkF(x)}" cy="${bkF(y)}" rx="24" ry="8" fill="${F.fill}" ${st(3)}/><circle cx="${bkF(x - 8)}" cy="${bkF(y - 2)}" r="2.6" fill="${F.chips}"/><circle cx="${bkF(x + 8)}" cy="${bkF(y)}" r="2.6" fill="${F.chips}"/>`;
    let s = counter() + `<rect x="22" y="190" width="170" height="14" rx="5" fill="${C.steelDark}" ${st()}/>`;
    s += `<path d="M206 186 L346 186 M206 186 L202 214 M346 186 L350 214" ${st(4)}/>` + [...Array(7)].map((_, i) => `<path d="M${216 + i * 20} 182 L${216 + i * 20} 190" ${st(2.4)}/>`).join("") + `<path d="M206 182 L346 182" ${st(3)}/>`;
    s += cookie(52, 182) + cookie(108, 182) + cookie(240, 174);
    const x = lerp(160, 300, mv), y = 182 - Math.sin(mv * Math.PI) * 50 - (mv > 0.5 ? (mv - 0.5) * 16 : 0);
    const cy = p < 0.2 ? 182 : y;
    s += cookie(p < 0.2 ? 160 : x, cy);
    if (p > 0.08 && p < 0.8) s += spatula(p < 0.2 ? lerp(120, 158, seg(p, 0.08, 0.2)) : x, cy + 10, -20) + g(fist(), (p < 0.2 ? lerp(120, 158, seg(p, 0.08, 0.2)) : x) + 60, cy - 30, 0.9);
    return s;
  } });

// A cake on a stand, side view.
const bkStand = () => `<path d="M150 216 L210 216 L196 196 L164 196 Z" fill="#fff" ${st()}/><ellipse cx="180" cy="194" rx="110" ry="10" fill="#fff" ${st()}/>`;
const bkLayer = (y, h, col = "#E8B46A") => `<rect x="96" y="${y}" width="168" height="${h}" rx="6" fill="${col}" ${st()}/><path d="M104 ${y + 8} L256 ${y + 8}" stroke="${shade(col)}" stroke-width="2" opacity=".5"/>`;

LIB.add({ cat: "bake", name: "frostcake", foods: ["frosting", "chocolatefrosting", "whippedcream"], dur: 3.6,
  steps: ["Frost the top and sides of the cake", "Spread the frosting over the cooled cake with an offset spatula", "Let cool briefly before frosting."],
  draw(t, F) {
    const p = t / 3.6, topK = ease(seg(p, 0.05, 0.5)), sideK = ease(seg(p, 0.55, 0.92)), col = F.liquid;
    let s = bkStand() + bkLayer(150, 40) + `<rect x="96" y="144" width="168" height="8" fill="${col}" ${st(2)}/>` + bkLayer(104, 40);
    const w = lerp(28, 90, topK);
    s += `<path d="M${bkF(180 - w)} 106 C${bkF(180 - w)} 80 ${bkF(180 + w)} 80 ${bkF(180 + w)} 106 Z" fill="${col}" ${st(3)}/>`;
    if (sideK > 0) s += `<path d="M90 100 L270 100 L270 ${bkF(100 + sideK * 92)} L90 ${bkF(100 + sideK * 92)} Z" fill="${col}" ${st(3)}/><path d="M92 98 C140 90 220 90 268 98" fill="none" stroke="${INK}" stroke-width="3"/>` + [130, 180, 230].map(x => `<path d="M${x - 14} ${bkF(110 + sideK * 30)} q14 -8 28 0" stroke="${shade(col)}" stroke-width="3" fill="none" stroke-linecap="round"/>`).join("");
    if (p < 0.52) s += bkOffset(lerp(110, 210, (Math.sin(t * 6) + 1) / 2), 92, -4);
    else if (p < 0.94) s += g(`<rect x="-5" y="-4" width="10" height="70" rx="5" fill="${C.steel}" ${st(3)}/><path d="M0 -4 L-12 -20 L-12 -40" fill="none" ${st(5)}/><rect x="-19" y="-80" width="14" height="44" rx="6" fill="${C.handle}" ${st(3)}/>${g(fist(), -12, -64, 0.9)}`, 276, lerp(104, 124, (Math.sin(t * 6) + 1) / 2));
    return s;
  } });

LIB.add({ cat: "bake", name: "frostpan", foods: ["chocolatefrosting", "frosting"], dur: 3.2,
  steps: ["Frost brownies while they are still slightly warm.", "Spread the frosting over the cooled cake in the pan"],
  draw(t, F, key) {
    const p = t / 3.2, k = ease(seg(p, 0.06, 0.88)), base = key === "chocolatefrosting" ? "#3E2214" : "#E8B46A";
    const w = lerp(50, 180, k), h = lerp(40, 168, k);
    let s = bkSquareTop(`<rect x="90" y="42" width="180" height="168" rx="6" fill="${base}"/><rect x="${bkF(180 - w / 2)}" y="${bkF(126 - h / 2)}" width="${bkF(w)}" height="${bkF(h)}" rx="${bkF(lerp(24, 6, k))}" fill="${F.liquid}" ${st(k > 0.98 ? 0 : 2.5)}/>` +
      [[130, 80], [200, 110], [140, 160], [220, 180]].map(([x, y]) => Math.abs(x - 180) < w / 2 - 10 && Math.abs(y - 126) < h / 2 - 6 ? `<path d="M${x - 16} ${y} q16 -10 32 0" stroke="${shade(F.liquid)}" stroke-width="3" fill="none" stroke-linecap="round"/>` : "").join(""));
    if (p < 0.92) s += bkOffset(lerp(110, 200, (Math.sin(t * 6) + 1) / 2), lerp(110, 200, k), -4);
    return s;
  } });

LIB.add({ cat: "bake", name: "pipecupcakes", foods: ["frosting", "chocolatefrosting"], dur: 3.6,
  steps: ["Pipe frosting onto the cooled cupcakes", "Pipe a swirl of frosting on top of each cupcake"],
  draw(t, F) {
    const p = t / 3.6, n = seg(p, 0.03, 0.94) * 3.2, col = F.liquid;
    let s = counter();
    [90, 180, 270].forEach((x, i) => {
      s += `<path d="M${x - 26} 168 L${x + 26} 168 L${x + 20} 214 L${x - 20} 214 Z" fill="#F7F2E6" ${st(3)}/><path d="M${x - 10} 172 L${x - 8} 210 M${x} 172 L${x} 210 M${x + 10} 172 L${x + 8} 210" stroke="${INK}" stroke-width="1.4" opacity=".35"/>`;
      s += `<path d="M${x - 30} 170 C${x - 26} 144 ${x + 26} 144 ${x + 30} 170 Z" fill="#D9A55B" ${st(3)}/>`;
      const q = clamp(n - i);
      [[32, 152, 12], [24, 136, 10], [16, 122, 9]].forEach(([rx, y, ry], j) => { if (q > j / 3 + 0.05) s += `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${col}" ${st(3)}/>`; });
      if (q > 0.95) s += `<path d="M${x - 7} 116 C${x - 3} 100 ${x + 3} 100 ${x + 7} 116 Z" fill="${col}" ${st(3)}/>`;
    });
    if (n < 3) { const i = Math.floor(n), q = n - i, x = [90, 180, 270][i] + Math.sin(q * Math.PI * 6) * 12; s += T.pipingBag(x, lerp(130, 100, q), 0, col); }
    return s;
  } });

LIB.add({ cat: "bake", name: "drizzleicing", foods: ["icing", "meltedchocolate"], dur: 3,
  steps: ["Drizzle the glaze over the cooled cake", "Drizzle with melted chocolate", "Drizzle the icing over the top and let it drip down the sides"],
  draw(t, F) {
    const p = t / 3, k = seg(p, 0.05, 0.85), col = F.liquid;
    let s = counter() + V.rack(196) + `<path d="M84 190 L84 140 C84 104 276 104 276 140 L276 190 Z" fill="#D99A5B" ${st()}/>`;
    const zig = (u) => { const x = lerp(96, 264, u); const top = 140 - Math.sqrt(Math.max(0, 1 - ((x - 180) / 96) ** 2)) * 30; return [x, top + 6 + (Math.floor(u * 12) % 2 ? 10 : -2) * Math.abs(Math.sin(u * 12 * Math.PI))]; };
    const pts = [...Array(Math.max(2, Math.floor(k * 60)))].map((_, i, a) => zig(i / 59));
    s += `<path d="${bkPath(pts, false)}" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><path d="${bkPath(pts, false)}" fill="none" stroke="${col}" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>`;
    [[92, 0.05], [268, 0.95], [86, 0.02]].forEach(([x, at]) => { if (k > at + 0.05) s += `<path d="M${x} 142 L${x} ${bkF(142 + Math.min(30, (k - at) * 80))}" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M${x} 142 L${x} ${bkF(142 + Math.min(30, (k - at) * 80))}" stroke="${col}" stroke-width="4.5" stroke-linecap="round"/>`; });
    const [x, y] = pts[pts.length - 1];
    if (p < 0.88) s += FX.stream(x, 50, x, y, col, 4) + T.metalSpoon(x - 4, 44, -30, col);
    return s;
  } });

LIB.add({ cat: "bake", name: "icerolls", foods: ["icing"], dur: 3,
  steps: ["Spread the icing over the warm rolls", "Frost the cinnamon rolls while they're still warm"],
  draw(t, F) {
    const p = t / 3, k = seg(p, 0.05, 0.9) * 9.4;
    let inner = "";
    const rolls = [0, 1, 2].flatMap(j => [0, 1, 2].map(i => [120 + i * 60, 66 + j * 60]));
    rolls.forEach(([x, y], i) => {
      inner += bkSpiral(x, y, 28, "#D99A5B");
      if (k > i + 0.5) inner += `<path d="M${x - 22} ${y - 4} C${x - 20} ${y - 26} ${x + 20} ${y - 26} ${x + 22} ${y - 4} C${x + 24} ${y + 14} ${x + 8} ${y + 22} ${x} ${y + 16} C${x - 10} ${y + 24} ${x - 26} ${y + 12} ${x - 22} ${y - 4} Z" fill="#FFFFFF" ${st(2.4)} opacity=".95"/>`;
    });
    let s = bkSquareTop(inner);
    if (k < 9) { const [x, y] = rolls[Math.floor(k)]; s += bkOffset(x - 30 + Math.sin(t * 9) * 10, y + 4, -8); }
    return s;
  } });

LIB.add({ cat: "bake", name: "sievesugar", foods: ["brownies", "cake", "pastry"], dur: 2.8,
  steps: ["Dust with powdered sugar before serving", "Dust the top with confectioners' sugar through a fine sieve"],
  draw(t, F, key) {
    const p = t / 2.8, k = seg(p, 0.05, 0.9);
    let s = counter(), topY, x0, x1;
    if (key === "brownies") { s += `<rect x="40" y="190" width="280" height="18" rx="6" fill="#E8C49A" ${st()}/>` + [70, 150, 230].map(x => `<rect x="${x}" y="150" width="62" height="40" rx="4" fill="#6B3A22" ${st()}/>`).join(""); topY = 150; x0 = 74; x1 = 288; }
    else if (key === "cake") { s += bkStand() + `<path d="M96 190 L96 120 C96 104 264 104 264 120 L264 190 Z" fill="#D99A5B" ${st()}/>`; topY = 108; x0 = 104; x1 = 256; }
    else { s += `<rect x="30" y="196" width="300" height="14" rx="5" fill="${C.steelDark}" ${st()}/>` + [110, 250].map(x => `<path d="M${x - 58} 196 C${x - 54} 150 ${x + 54} 150 ${x + 58} 196 Z" fill="#E0A458" ${st()}/>`).join(""); topY = 162; x0 = 64; x1 = 296; }
    s += [...Array(Math.floor(k * 46))].map((_, i) => { const x = lerp(x0, x1, bkRand(i, 77)); if (key === "pastry" && Math.abs(((x - 110) % 140 + 140) % 140) > 116 && x > 160 && x < 200) return ""; return `<circle cx="${bkF(x)}" cy="${bkF(topY + 2 + bkRand(i, 78) * 8)}" r="2.4" fill="#fff" ${st(0.9)}/>`; }).join("");
    s += FX.fall(t, 0.5, 14, 180, 110, 100, topY, (x, y) => `<circle cx="${bkF(x)}" cy="${bkF(y)}" r="2" fill="#fff" ${st(0.8)}/>`);
    const sx = Math.sin(t * 22) * 6;
    s += `<g transform="translate(${bkF(sx)} 0)">${V.sieve(170, 60, 1)}<path d="M140 60 C152 46 188 46 200 60 Z" fill="#fff" ${st(2.5)}/>${g(fist(), 282, 54)}</g>`;
    return s;
  } });

LIB.add({ cat: "bake", name: "splitlayers", foods: ["cake"], dur: 3.2,
  steps: ["Cut each cake in half horizontally to make 4 layers", "Slice the cake horizontally into two even layers with a long serrated knife"],
  draw(t) {
    const p = t / 3.2, k = ease(seg(p, 0.05, 0.7)), lift = ease(seg(p, 0.76, 0.92));
    const tip = lerp(300, 82, k) + Math.sin(t * 20) * 6 * (k < 1 ? 1 : 0);
    let s = counter() + `<ellipse cx="180" cy="206" rx="130" ry="10" fill="#E8C49A" ${st()}/>`;
    if (lift === 0) s += `<rect x="86" y="116" width="188" height="86" rx="6" fill="#E8B46A" ${st()}/><path d="M86 122 C120 112 240 112 274 122" fill="none" stroke="#C98340" stroke-width="4"/>` + (k > 0 ? `<path d="M${bkF(Math.max(86, tip))} 158 L274 158" ${st(3)}/>` : "");
    else s += `<rect x="86" y="158" width="188" height="44" rx="6" fill="#E8B46A" ${st()}/><g transform="translate(0 ${bkF(-lift * 30)})"><rect x="86" y="116" width="188" height="42" rx="6" fill="#E8B46A" ${st()}/><path d="M86 122 C120 112 240 112 274 122" fill="none" stroke="#C98340" stroke-width="4"/></g>`;
    if (p < 0.74) s += knife(tip, 158, 180, 150);
    return s;
  } });

LIB.add({ cat: "bake", name: "stacklayers", foods: ["frosting", "jam"], dur: 3.4,
  steps: ["Spread frosting on the first layer and top with the second", "Spread jam over the bottom layer and place the top layer on"],
  draw(t, F, key) {
    const p = t / 3.4, spread = ease(seg(p, 0.05, 0.45)), drop = ease(seg(p, 0.55, 0.85)), col = key === "jam" ? F.fill : F.liquid;
    let s = bkStand() + bkLayer(150, 40);
    const w = lerp(24, 84, spread);
    s += `<rect x="${bkF(180 - w)}" y="142" width="${bkF(w * 2)}" height="10" rx="5" fill="${col}" ${st(2.5)}/>`;
    s += `<g transform="translate(0 ${bkF(lerp(-90, 0, drop))})" opacity="${bkF(Math.min(1, drop * 3))}">${bkLayer(102, 40)}</g>`;
    if (p < 0.48) s += bkOffset(lerp(110, 200, (Math.sin(t * 6) + 1) / 2), 138, -4);
    return s;
  } });

LIB.add({ cat: "bake", name: "brushbutter", foods: ["meltedbutter"], dur: 3,
  steps: ["Brush the hot rolls with melted butter", "Brush the tops with melted butter as soon as they come out of the oven"],
  draw(t, F) {
    const p = t / 3, X = lerp(80, 300, ease(seg(p, 0.05, 0.88)));
    const rolls = [0, 1, 2].flatMap(j => [0, 1, 2].map(i => [120 + i * 60, 66 + j * 60]));
    let inner = rolls.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="28" fill="#D99A5B" ${st(3)}/><path d="M${x - 14} ${y - 10} q10 -8 22 -4" stroke="#F1D49A" stroke-width="4" fill="none" stroke-linecap="round"/>`).join("");
    inner += rolls.map(([x, y]) => x < X - 10 ? `<circle cx="${x}" cy="${y}" r="27" fill="${F.liquid}" opacity=".45"/><path d="M${x + 4} ${y + 6} q8 -4 14 2" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>` : "").join("");
    let s = bkSquareTop(inner) + FX.steam(t, [140, 220], 60, 0.5);
    if (p < 0.92) s += T.brush(X, 126 + Math.sin(t * 8) * 60, -30, F.liquid) + g(fist(), X - 34, 66 + Math.sin(t * 8) * 60, 0.9);
    return s;
  } });
