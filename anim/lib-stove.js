// ---------- Tempo animation library: STOVE (stovetop) ----------
// Pans, pots, saucepans and woks seen a little from above, so you can SEE
// what is cooking inside (apple pie filling looks like apple pie filling,
// not sauteed vegetables). Local helpers are prefixed "stove".

// ---------- New foods ----------
LIB.food("cherries",      { type: "grains", fill: "#8A1F2E", inner: "#A3243A", berry: true });
LIB.food("blackberries",  { type: "grains", fill: "#3B1F3A", inner: "#4A2A4A", berry: true });
LIB.food("groundchicken", { type: "ground", fill: "#F6D2C2", inner: "#F8DED2", mark: "#FFFFFF", cooked: "#D9B07A" });
LIB.food("groundlamb",    { type: "ground", fill: "#A8433A", inner: "#C0574C", mark: "#F7E3DD", cooked: "#6B3A22" });
LIB.food("chorizo",       { type: "ground", fill: "#C8452E", inner: "#D9603E", mark: "#F2C2A0", cooked: "#8A2E1A" });
LIB.food("pancetta",      { type: "strip", fill: "#E88A80", inner: "#F6D2C8", cooked: "#B5562A" });
LIB.food("bratwurst",     { type: "long", fill: "#E8C8A8", inner: "#F1DCC4", cooked: "#B5733A" });
LIB.food("macaroni",      { type: "grains", fill: "#F2D27A", inner: "#F7DC8A" });
LIB.food("lasagnasheets", { type: "pastry", fill: "#F2DA8A", inner: "#F7E2A0" });
LIB.food("ravioli",       { type: "grains", fill: "#F2D27A", inner: "#F7E2A0", round: true });
LIB.food("tortellini",    { type: "grains", fill: "#F2D27A", inner: "#F7E2A0", round: true });
LIB.food("gnocchi",       { type: "grains", fill: "#F4E3B0", inner: "#F7EDC9", round: true });
LIB.food("dumplings",     { type: "balls", fill: "#F7F1E3", inner: "#FBF8EE", cooked: "#E8C48A" });
LIB.food("whitechocolate",{ type: "block", fill: "#FBF1D9", inner: "#FFF8E8", squares: true });
LIB.food("mustardseeds",  { type: "pantry", shape: "shaker", fill: "#7A4A2A", inner: "#3B2A1E", mark: "#E8C23C" });
LIB.food("curryleaves",   { type: "leafy", fill: "#2F6E3A", inner: "#3E8E41" });
LIB.food("sesame",        { type: "pantry", shape: "shaker", fill: "#F6EBD3", inner: "#F1E3B0", mark: "#C9874A" });
LIB.food("pinenuts",      { type: "grains", fill: "#F1E3B0", inner: "#F4E3B0" });
LIB.food("donut",         { type: "balls", fill: "#E8B46A", inner: "#F4DFB0", cooked: "#C98340" });
LIB.food("onionrings",    { type: "balls", fill: "#E8C27A", inner: "#F3E0B5", cooked: "#C98340" });
LIB.food("polenta",       { type: "grains", fill: "#F2C84B", inner: "#F7D86A", round: true });
LIB.liquid("bolognese", "#9C3A22");
LIB.liquid("cheesesauce", "#F7C94B");
LIB.liquid("chili", "#A33A22");

// ---------- Stove kit (local) ----------
// Vessel geometry: rim ellipse (cx, cy, rx, ry), bottom y, wall + inside colors.
const STOVE_PAN = { cx: 180, cy: 140, rx: 124, ry: 40, bot: 192, taper: 8, wall: C.pan, inside: C.panIn, handle: "long" };
const STOVE_STEEL = { ...STOVE_PAN, wall: "#9AA4AC", inside: "#D5DADF" };
const STOVE_POT = { cx: 180, cy: 98, rx: 120, ry: 30, bot: 208, taper: 12, wall: "#fff", inside: "#E4E0D6", handle: "loops" };
const STOVE_SAUCE = { cx: 166, cy: 112, rx: 100, ry: 30, bot: 206, taper: 8, wall: "#fff", inside: "#E4E0D6", handle: "long" };
const STOVE_WOK = { cx: 180, cy: 126, rx: 128, ry: 34, bot: 204, wall: C.pan, inside: C.panIn, handle: "wok" };

function stoveRGB(c) { if (/^#[0-9a-f]{3}$/i.test(c)) c = "#" + c.slice(1).split("").map(h => h + h).join(""); return c.startsWith("#") ? hexToRgb(c) : c.match(/\d+/g).slice(0, 3).map(Number); }
function stoveMix(a, b, q) { const x = stoveRGB(a), y = stoveRGB(b); return `rgb(${x.map((v, i) => Math.round(lerp(v, y[i], clamp(q)))).join(",")})`; }
const stoveDark = (c, k = 0.78) => `rgb(${stoveRGB(c).map(v => Math.round(v * k)).join(",")})`;
const stoveRot = (lx, ly, deg) => { const a = deg * Math.PI / 180; return [lx * Math.cos(a) - ly * Math.sin(a), lx * Math.sin(a) + ly * Math.cos(a)]; };
// Evenly spread spots inside an ellipse (sorted back to front).
function stoveSpots(n, cx = 180, cy = 148, rx = 86, ry = 20) {
  return [...Array(n)].map((_, i) => { const r = Math.sqrt((i + 0.5) / n), a = i * 2.39996; return [cx + Math.cos(a) * r * rx, cy + Math.sin(a) * r * ry, (i * 47) % 360, i]; }).sort((a, b) => a[1] - b[1]);
}
// The vessel: flames, back rim, what's inside, then the front wall over it.
function stoveVessel(G, t, inner = "", o = {}) {
  const k = o.flame === undefined ? 0.8 : o.flame;
  const { cx, cy, rx, ry, bot } = G, taper = G.taper || 8, L = cx - rx, R = cx + rx;
  let s = k ? burner(t, k) : "", b = "";
  if (G.handle === "long" || G.handle === "wok") {
    const x0 = R - 8, y0 = cy + 12, x1 = Math.min(350, R + 50), y1 = cy - 8;
    b += `<path d="M${x0} ${y0} L${x1} ${y1}" ${st(13)}/><path d="M${x0} ${y0} L${x1} ${y1}" stroke="${C.handle}" stroke-width="7" stroke-linecap="round"/>`;
  }
  b += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${G.wall === "#fff" ? G.inside : G.wall}" ${st()}/>`;
  if (G.wall !== "#fff") b += `<ellipse cx="${cx}" cy="${cy + 5}" rx="${rx - 14}" ry="${ry - 9}" fill="${G.inside}"/>`;
  b += inner;
  const front = G.handle === "wok"
    ? `M${L} ${cy} A${rx} ${ry} 0 0 0 ${R} ${cy} C${R - 30} ${bot} ${L + 30} ${bot} ${L} ${cy} Z`
    : `M${L} ${cy} A${rx} ${ry} 0 0 0 ${R} ${cy} L${R - taper} ${bot - 12} Q${R - taper} ${bot} ${R - taper - 24} ${bot} L${L + taper + 24} ${bot} Q${L + taper} ${bot} ${L + taper} ${bot - 12} Z`;
  b += `<path d="${front}" fill="${G.wall}" ${st()}/>`;
  if (G.wall === "#fff") b += `<path d="M${L + 22} ${cy + ry + 20} L${L + 22} ${bot - 24}" stroke="#E4E0D6" stroke-width="6" stroke-linecap="round"/>`;
  if (G.handle === "loops") b += `<path d="M${L + 2} ${cy + 18} C${L - 24} ${cy + 16} ${L - 24} ${cy + 44} ${L + 4} ${cy + 40}" fill="none" ${st(5)}/><path d="M${R - 2} ${cy + 18} C${R + 24} ${cy + 16} ${R + 24} ${cy + 44} ${R - 4} ${cy + 40}" fill="none" ${st(5)}/>`;
  return s + (o.tilt ? `<g transform="rotate(${o.tilt} ${cx} ${bot})">${b}</g>` : b);
}
// Liquid surface inside a pot/saucepan, d below the rim.
const stoveSurf = (G, color, d = 12, op = 1) => `<ellipse cx="${G.cx}" cy="${G.cy + d}" rx="${G.rx - 7 - d * 0.12}" ry="${G.ry - 4}" fill="${color}" opacity="${op}" stroke="${stoveRGB(color).reduce((a, b) => a + b) > 690 ? "#A8A296" : stoveDark(color, 0.72)}" stroke-width="2.5"/>`;
// A pool (sauce, oil, syrup) on the floor of the skillet.
function stovePool(color, rx = 100, ry = 26, cy = 148, op = 1, cx = 180) {
  if (rx < 1) return "";
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${color}" opacity="${op}" stroke="${stoveDark(color, 0.7)}" stroke-width="2.5"/>` +
    `<path d="M${cx - rx * 0.55} ${cy - ry * 0.45} Q${cx - rx * 0.1} ${cy - ry * 0.8} ${cx + rx * 0.3} ${cy - ry * 0.55}" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity="${0.45 * op}"/>`;
}
// Bubbles that rise and pop on a surface.
const stovePops = (t, n, cx, cy, rx, ry, op = 1, big = 1, speed = 0.9) => [...Array(n)].map((_, i) => {
  const q = (t * speed + i / n) % 1, a = i * 2.39996, r = Math.sqrt((i + 0.5) / n);
  return `<circle cx="${cx + Math.cos(a) * r * rx}" cy="${cy + Math.sin(a) * r * ry}" r="${(1.5 + q * 4) * big}" fill="none" stroke="#fff" stroke-width="2" opacity="${(1 - q) * op}"/>`;
}).join("");
// Wavy aroma lines (fragrant, toasty).
const stoveAroma = (t, xs, y0, color = "#C9874A", op = 1) => xs.map((x, i) => { const q = (t * 0.6 + i / xs.length) % 1; return `<path d="M${x} ${y0 - q * 50} c-8 -6 8 -12 0 -18 c-8 -6 8 -12 0 -18" fill="none" stroke="${color}" stroke-width="3.5" stroke-linecap="round" opacity="${(1 - q) * op}"/>`; }).join("");
// Turner (flat spatula) with a gloved hand at the end of the handle. Blade at x,y.
const stoveTurner = (x, y, r = -20) => g(`<path d="M-26 0 L26 0 L28 -7 L-24 -7 Z" fill="${C.steel}" ${st(3)}/><path d="M26 -4 L74 -42" ${st(6)}/>${g(fist(), 78, -46, 0.9, -38)}`, x, y, 1, r);
// Metal spoon with a hand, bowl at x,y.
const stoveSpoonM = (x, y, r = 0, fill = null) => T.metalSpoon(x, y, r, fill) + g(g(fist(), 0, 0, 0.85, -42), x + stoveRot(70, -60, r)[0], y + stoveRot(70, -60, r)[1]);
// Measuring cup pouring: cup at (x,y), tip 0..1. Returns [svg, lipX, lipY].
function stoveCup(x, y, tip, color, level = 0.7) {
  const r = -105 * tip, [lx, ly] = stoveRot(-26, -30, r);
  return [T.measuringCup(x, y, r, color, level * (1 - tip * 0.5)), x + lx, y + ly];
}
// A food bite in a pan, k = how cooked.
function stoveBit(F, x, y, rot = 0, k = 1, s = 1) {
  const ty = F.type, cook = F.cooked ? stoveMix(F.inner || F.fill, F.cooked, k) : F.inner;
  if (ty === "slab" || (ty === "block" && !F.squares)) return g(bit(F, "cube", 0, 0, rot, k), x, y, s);
  if (ty === "shrimp") return g(whole(F, k), x, y, 0.22 * s, rot);
  if (ty === "drumstick") return g(whole(F, k), x, y, 0.2 * s, rot);
  if (ty === "balls") return `<circle cx="${x}" cy="${y}" r="${11 * s}" fill="${F.cooked ? stoveMix(F.fill, F.cooked, k) : F.fill}" ${st(2.6)}/><path d="M${x - 5 * s} ${y - 5 * s} q3 -3 7 -2" stroke="#fff" stroke-width="2.5" fill="none" opacity=".5"/>`;
  if (ty === "ground") return `<circle cx="${x}" cy="${y}" r="${6.5 * s}" fill="${stoveMix(F.fill, F.cooked || F.fill, k)}" ${st(2.2)}/>`;
  if (ty === "tree") return piece(F, "chunk", x, y, rot * 0.1, 1.1 * s);
  if (ty === "mushroom") return g(`<path d="M-12 3 C-12 -11 12 -11 12 3 L4 3 L4 10 L-4 10 L-4 3 Z" fill="${stoveMix(F.inner, "#B5814A", k * 0.6)}" ${st(2.4)}/><path d="M-12 3 C-12 -11 12 -11 12 3" fill="none" stroke="${F.fill}" stroke-width="3"/>`, x, y, s, rot * 0.15);
  if (ty === "long" && (F.taper || F.top === "cap" || F.small)) return g(`<rect x="-15" y="-4.5" width="30" height="9" rx="4.5" fill="${F.fill}" ${st(2.4)}/>`, x, y, s, rot);
  if (ty === "long") return piece(F, "coin", x, y, rot, s);
  if (ty === "grains") return piece(F, "bit", x, y, rot, 1.2 * s);
  if (ty === "leafy") return piece(F, "bit", x, y, rot, 1.9 * s);
  if (ty === "pepper") return piece(F, "strip", x, y, rot, 0.7 * s);
  if (ty === "strip") return g(`<rect x="-10" y="-6" width="20" height="12" rx="3" fill="${stoveMix(F.fill, F.cooked || F.fill, k)}" ${st(2.4)}/><path d="M-7 -1 L7 -1" stroke="${F.inner}" stroke-width="3" opacity="${1 - k * 0.6}"/>`, x, y, s, rot);
  if (ty === "noodles") return piece(F, "chunk", x, y, rot, s);
  return piece(F, "chunk", x, y, rot, s);
}
// Fruit in a pan: slices, chunks, or whole berries. k = how cooked down.
function stoveFruit(F, key, x, y, r, k, s = 1.15) {
  if (F.type === "grains") return `<circle cx="${x}" cy="${y}" r="${7.5 * (1 - 0.18 * k) * s}" fill="${stoveMix(F.inner, stoveDark(F.inner, 0.62), k)}" ${st(2.2)}/><circle cx="${x - 2.5}" cy="${y - 2.5}" r="1.8" fill="#fff" opacity="${0.8 - 0.5 * k}"/>`;
  if (key === "banana") return g(`<ellipse rx="11" ry="8" fill="${stoveMix(F.inner, "#D9A05B", k)}" ${st(2.4)}/><circle r="1.6" fill="${stoveDark(F.inner, 0.6)}"/><circle cx="4" cy="2" r="1.4" fill="${stoveDark(F.inner, 0.6)}"/>`, x, y, s, r * 0.2);
  if (key === "strawberry") return g(`<path d="M0 10 C-15 0 -13 -12 0 -9 C13 -12 15 0 0 10 Z" fill="${stoveMix(F.fill, "#9C1F2A", k * 0.6)}" ${st(2.4)}/><path d="M0 6 C-8 0 -7 -7 0 -5 C7 -7 8 0 0 6 Z" fill="${stoveMix(F.inner, "#C8303A", k)}"/>`, x, y, s, r * 0.15);
  if (key === "pineapple" || key === "mango") return g(`<path d="M-11 -7 L9 -9 L12 6 L-10 8 Z" fill="${stoveMix(F.inner, "#E0A040", k)}" ${st(2.4)}/>`, x, y, s, r * 0.3);
  const peel = key === "apple" || key === "pear" || key === "peach";
  return g(`<path d="M-15 5 C-12 -9 12 -9 15 5 C8 1 -8 1 -15 5 Z" fill="${stoveMix(F.inner, "#E2A55A", k)}" ${st(2.4)}/>${peel ? `<path d="M-13 2 C-10 -7 10 -7 13 2" fill="none" stroke="${F.fill}" stroke-width="2.6" opacity="${1 - 0.3 * k}"/>` : ""}`, x, y, s, (r % 60) - 30);
}
// A wooden spoon stirring round a pan (bowl in the pan).
function stoveStir(t, dur, cx = 180, cy = 150, rx = 60, ry = 12, turns = 1) {
  const a = t / dur * Math.PI * 2 * turns, x = cx + Math.cos(a) * rx, y = cy + Math.sin(a) * ry;
  return T.spoon(x, y, Math.cos(a) * 14);
}
// Something in the pan gets lifted and turned over. drawThing(side) draws it at 0,0
// (side 0 = top before, 1 = top after).
function stoveFlip(t, dur, drawThing, o = {}) {
  const p = t / dur, cx = o.cx || 180, cy = o.cy || 150, tool = o.tool || "turner";
  const a = ease(seg(p, 0.28, 0.42)), f = seg(p, 0.42, 0.6), d = ease(seg(p, 0.6, 0.7));
  const y = cy - 60 * a + 60 * d, sy = Math.cos(Math.PI * f), side = f > 0.5 ? 1 : 0;
  let s = `<g transform="translate(${cx} ${y}) scale(1 ${Math.max(0.06, Math.abs(sy))})">${drawThing(side)}</g>`;
  const w = o.w || 50;
  if (tool === "turner") {
    const show = p > 0.12 && p < 0.84, slide = ease(seg(p, 0.12, 0.26)), out = ease(seg(p, 0.72, 0.84));
    if (show) s += stoveTurner(lerp(cx + w + 80, cx + 10, slide) + out * 90, y + (o.h || 10) + 2 - (f > 0 && f < 1 ? 0 : 0), -14 - a * 6 + d * 6);
  } else {
    const show = p > 0.14 && p < 0.86, come = ease(seg(p, 0.14, 0.28)), out = ease(seg(p, 0.72, 0.86));
    if (show) s += T.tongs(lerp(cx + w + 70, cx + w - 8, come) + out * 80, y - 4 * Math.abs(sy) - (o.h || 8) * 0.2, -20, come > 0.95 && out < 0.05 ? 0.05 : 0.5);
  }
  return s;
}
const stoveShell = (x, y, open) => g(`<path d="M-22 -2 C-22 -30 -6 -40 0 -40 C6 -40 22 -30 22 -2 Z" fill="#F2E6D2" ${st(3)} transform="translate(${-open * 22} ${-open * 4}) rotate(${-open * 30})"/><path d="M-22 2 C-22 24 22 24 22 2 Z" fill="#F2E6D2" ${st(3)} transform="translate(${open * 22} ${-open * 2}) rotate(${open * 40})"/>`, x, y);

const STOVE_GROUND = (F) => F.type === "ground" ? F : { type: "ground", fill: F.inner || F.fill, cooked: F.cooked || "#7A3A1C" };

// =====================================================================
// 1. Sweet fillings and sugar
// =====================================================================
LIB.add({
  cat: "stove", name: "fruitcookdown", dur: 4.4,
  foods: ["apple", "peach", "pear", "strawberry", "blueberries", "raspberries", "cherries", "banana", "pineapple"],
  steps: ["Add the apple pie filling to the skillet", "Cook the apples, sugar, and cinnamon until softened", "Cook the berries and sugar until syrupy", "Cook the peaches in butter and brown sugar until tender"],
  draw(t, F, key) {
    const p = t / 4.4, k = ease(clamp(p / 0.85));
    const berry = F.type === "grains", syrup = berry ? stoveMix(F.inner, "#E8D0E0", 0.1) : "#D08A3A";
    let inner = stovePool(stoveMix("#F3E3C3", syrup, k), lerp(70, 100, k), lerp(18, 25, k), 150, lerp(0.6, 1, k));
    inner += stovePops(t, 7, 180, 150, 90, 18, k, 1.1, 0.7);
    stoveSpots(berry ? 16 : 13, 180, 147, 82, 18).forEach(([x, y, r, i]) => { inner += stoveFruit(F, key, x + Math.sin(t * 3 + i) * 1.2, y, r, k, 1.35); });
    if (p < 0.4) for (let i = 0; i < 16; i++) inner += `<rect x="${110 + (i * 37) % 140}" y="${136 + (i * 13) % 22}" width="4" height="4" fill="${key === "peach" || key === "banana" ? "#B5813A" : "#fff"}" stroke="${INK}" stroke-width="1" opacity="${1 - p / 0.4}"/>`;
    let s = stoveVessel(STOVE_PAN, t, inner, { flame: 0.6 }) + steam(t, [150, 210], 112, 0.5);
    if (k > 0.75) s += FX.sparkle(t, 214, 136, 0.8) + FX.sparkle(t + 0.4, 136, 150, 0.6);
    return s + stoveStir(t, 4.4, 180, 148, 56, 10, 2);
  },
});

LIB.add({
  cat: "stove", name: "slurrygloss", dur: 4,
  foods: ["apple", "peach", "cherries", "blueberries", "broth", "soy"],
  steps: ["Stir in the cornstarch slurry and cook until thickened", "Add the cornstarch mixture and stir until glossy", "Pour in the slurry and simmer until the sauce thickens"],
  draw(t, F, key) {
    const p = t / 4, k = ease(seg(p, 0.32, 0.8));
    const liq = !!F.liquid, base = key === "soy" ? "#8A4A22" : liq ? F.liquid : (F.type === "grains" ? stoveMix(F.inner, "#E8D0E0", 0.12) : "#D08A3A");
    const thin = stoveMix(base, "#fff", 0.35), thick = liq ? stoveDark(base, 0.85) : base;
    let inner = stovePool(stoveMix(thin, thick, k), 100, 25, 150, lerp(0.6, 1, k));
    if (k < 0.9) for (let i = 0; i < 4; i++) inner += `<path d="M${110 + i * 40 + Math.sin(t * 3 + i) * 8} ${142 + (i % 2) * 10} q8 -4 16 0" fill="none" stroke="#fff" stroke-width="2.4" opacity="${0.6 * (1 - k)}"/>`;
    const swirl = seg(p, 0.1, 0.36);
    if (swirl > 0 && k < 0.95) inner += `<path d="M150 150 C160 140 200 140 210 150 C200 158 170 158 165 150" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="${(1 - k) * 0.9}"/>`;
    if (!liq) stoveSpots(F.type === "grains" ? 14 : 11, 180, 147, 80, 17).forEach(([x, y, r, i]) => { inner += stoveFruit(F, key, x, y, r, 0.75); });
    inner += stovePops(t, 6, 180, 150, 86, 18, 0.8, k > 0.5 ? 1.5 : 1, k > 0.5 ? 0.5 : 0.9);
    let s = stoveVessel(STOVE_PAN, t, inner, { flame: 0.6 });
    const tip = p < 0.12 ? ease(p / 0.12) : p < 0.3 ? 1 : 1 - ease(seg(p, 0.3, 0.38));
    const [cup, lx, ly] = stoveCup(250, 64, tip, "#FFFFFF", 0.5);
    if (tip > 0.85 && p < 0.32) s += FX.stream(lx, ly, 182, 148, "#FFFFFF", 6);
    if (p < 0.4) s += cup;
    if (k > 0.8) s += FX.sparkle(t, 220, 136, 0.9) + FX.sparkle(t + 0.5, 140, 146, 0.7);
    return s + (p > 0.34 ? stoveStir(t, 4, 180, 148, 54, 10, 2) : "");
  },
});

LIB.add({
  cat: "stove", name: "cookcaramel", dur: 5, foods: ["sugar"],
  steps: ["Cook the sugar until it melts and turns amber", "Heat sugar and water until it turns a deep golden caramel", "Swirl the pan until the caramel is amber"],
  draw(t) {
    const p = t / 5, melt = ease(seg(p, 0.05, 0.35)), col = ease(seg(p, 0.3, 0.9));
    const G = STOVE_SAUCE, d = 16;
    const color = col < 0.5 ? stoveMix("#F6EBD3", "#E8B04A", col * 2) : stoveMix("#E8B04A", "#A8561E", (col - 0.5) * 2);
    let inner = stoveSurf(G, color, d, lerp(0.5, 1, melt));
    if (melt < 1) inner += [...Array(14)].map((_, i) => `<circle cx="${110 + (i * 29) % 110}" cy="${130 + (i * 7) % 10 - (1 - melt) * 6}" r="${6 * (1 - melt) + 0.5}" fill="#fff" ${st(1.6)}/>`).join("");
    inner += stovePops(t, 8, G.cx, G.cy + d + 2, 72, 10, melt, 1.1, 1);
    const tilt = Math.sin(t / 5 * Math.PI * 6) * 3 * seg(p, 0.35, 0.45);
    let s = stoveVessel(G, t, inner, { flame: 0.6, tilt });
    if (col > 0.7) s += FX.sparkle(t, 200, 128, 0.8);
    return s + steam(t, [140, 190], 96, 0.5);
  },
});

LIB.add({
  cat: "stove", name: "buttersugarmelt", dur: 3.8,
  foods: ["brownsugar", "sugar", "honey", "maple"],
  steps: ["Melt the butter and brown sugar together in a skillet", "Melt butter and sugar over medium heat, stirring until bubbly", "Melt the butter with the honey"],
  draw(t, F, key) {
    const p = t / 3.8, m = ease(seg(p, 0.05, 0.6));
    const liquidAdd = key === "honey" || key === "maple";
    const final = { brownsugar: "#B5733A", sugar: "#E2B25A", honey: "#E8A23C", maple: "#B5703A" }[key];
    let inner = stovePool(stoveMix("#FFE08A", final, m), lerp(40, 100, m), lerp(12, 25, m), 150, 0.95);
    if (liquidAdd && m < 1) inner += stovePool(LIQUIDS[key], lerp(36, 10, m), lerp(10, 4, m), 152, 1, 225);
    inner += g(whole(FOODS.butter), lerp(140, 165, m), 146 - 8 * (1 - m), 0.42 * (1 - m) + 0.01);
    if (!liquidAdd && m < 1) inner += g(`<path d="M-40 10 C-30 -18 30 -18 40 10 Z" fill="${F.inner}" ${st(2.6)}/>` + [...Array(8)].map((_, i) => `<circle cx="${-24 + i * 7}" cy="${2 - (i % 3) * 3}" r="2" fill="#fff" opacity=".7"/>`).join(""), 222, 144, 1 - m * 0.95);
    inner += stovePops(t, 9, 180, 150, 88, 18, m, 1.2, 1);
    let s = stoveVessel(STOVE_PAN, t, inner, { flame: 0.6 });
    if (m > 0.8) s += FX.sparkle(t, 220, 134, 0.8);
    return s + (p > 0.35 ? stoveStir(t, 3.8, 180, 148, 50, 10, 1) : "");
  },
});

LIB.add({
  cat: "stove", name: "jamcookdown", dur: 3.6,
  foods: ["strawberry", "raspberries", "blueberries", "cherries", "blackberries"],
  steps: ["Cook the berries with the sugar, mashing as they soften", "Simmer the fruit until thick and jammy", "Bring the fruit and sugar to a boil, then simmer until thickened"],
  draw(t, F, key) {
    const p = t / 3.6, k = ease(clamp(p / 0.9)), G = STOVE_SAUCE, d = 14;
    const jam = key === "strawberry" ? "#B5223A" : stoveDark(F.inner, 0.7);
    let inner = stoveSurf(G, stoveMix(stoveMix(F.inner, "#fff", 0.2), jam, k), d);
    const spots = stoveSpots(14, G.cx, G.cy + d + 1, 70, 9);
    spots.forEach(([x, y, r, i]) => { if (i < 14 * (1 - k * 0.65)) inner += stoveFruit(F, key, x, y, r, k * 0.5, 1); });
    for (let i = 0; i < 4; i++) { const q = (t * 0.5 + i / 4) % 1; inner += `<circle cx="${G.cx - 50 + i * 32}" cy="${G.cy + d + 2}" r="${3 + q * 7}" fill="${jam}" stroke="${stoveDark(jam, 0.6)}" stroke-width="2" opacity="${(1 - q) * k}"/>`; }
    const press = Math.abs(Math.sin(t / 3.6 * Math.PI * 3));
    inner += T.masher(G.cx + Math.sin(t / 3.6 * Math.PI * 3) * 6 - 10, lerp(G.cy + d - 6, G.cy + d + 6, press));
    return stoveVessel(G, t, inner, { flame: 0.6 }) + steam(t, [130, 190], 100, 0.5);
  },
});

// =====================================================================
// 2. Sauces and liquids into the pan
// =====================================================================
// Cooked pieces in a pan; a sauce pours in and the pieces get coated.
function stoveSauceIn(t, dur, F, key, sauce, pourer, o = {}) {
  const p = t / dur, pool = ease(seg(p, 0.1, 0.45)), coat = ease(seg(p, 0.35, 0.85));
  let inner = stovePool(sauce, lerp(16, o.full ? 104 : 96, pool), lerp(5, o.full ? 28 : 24, pool), 150, pool > 0.01 ? 1 : 0, lerp(176, 180, pool));
  const toss = p > 0.5 ? Math.sin((p - 0.5) * Math.PI * 4) : 0;
  const n = F.type === "ground" ? 26 : F.type === "shrimp" || F.type === "drumstick" ? 7 : F.type === "leafy" ? 14 : 10;
  stoveSpots(n, 180, 147, 78, 17).forEach(([x, y, r, i]) => {
    const hop = toss > 0 && i % 3 === 0 ? toss * 10 : 0;
    inner += stoveBit(F, x, y - hop, r, 1, F.type === "ground" ? 1 : 1);
    if (coat > 0) inner += `<ellipse cx="${x + 1}" cy="${y - hop + 1}" rx="${F.type === "ground" ? 4 : 8}" ry="${F.type === "ground" ? 3 : 4}" fill="${sauce}" opacity="${coat * 0.75}"/>${i % 2 ? "" : `<path d="M${x - 4} ${y - hop - 4} q3 -2 6 -1" stroke="#fff" stroke-width="2.2" fill="none" opacity="${coat * 0.8}"/>`}`;
  });
  inner += stovePops(t, 6, 180, 152, 92, 20, pool * 0.8, 1, 0.8);
  let s = stoveVessel(STOVE_PAN, t, inner, { flame: 0.7 });
  const tip = p < 0.1 ? ease(p / 0.1) : p < 0.42 ? 1 : 1 - ease(seg(p, 0.42, 0.5));
  if (p < 0.52) {
    if (pourer === "can") {
      const r = -115 * tip, [lx, ly] = stoveRot(-24, -36, r);
      if (tip > 0.85 && p < 0.44) s += FX.stream(250 + lx, 70 + ly, 178, 146, sauce, 9);
      s += g(V.can(0, 0, 1, "#E8503C"), 250, 70, 1, r);
    } else {
      const [cup, lx, ly] = stoveCup(252, 66, tip, sauce, 0.75);
      if (tip > 0.85 && p < 0.44) s += FX.stream(lx, ly, 178, 146, sauce, 7);
      s += cup;
    }
  }
  if (coat > 0.8) s += FX.sparkle(t, 214, 132, 0.8);
  return s + (p > 0.5 ? stoveTurner(200 + toss * 50, 150, -18 + toss * 6) : "");
}
LIB.add({
  cat: "stove", name: "panglaze", dur: 3.6,
  foods: ["chicken", "tofu", "shrimp", "beef", "pork", "meatballs", "wings", "broccoli", "mushroom"],
  steps: ["Add the teriyaki sauce to the pan and toss to coat", "Pour the sauce over and stir-fry until coated and caramelized", "Add the honey garlic sauce and cook until glossy"],
  draw(t, F, key) { return stoveSauceIn(t, 3.6, F, key, "#7A3A1C", "cup"); },
});
LIB.add({
  cat: "stove", name: "tomatointopan", dur: 3.6,
  foods: ["groundbeef", "groundturkey", "meatballs", "chicken", "sausage", "shrimp"],
  steps: ["Stir in the crushed tomatoes", "Add the marinara sauce to the meatballs", "Pour in the tomato sauce and bring to a simmer"],
  draw(t, F, key) { return stoveSauceIn(t, 3.6, key === "sausage" ? STOVE_GROUND(F) : F, key, "#D9402E", "can", { full: true }); },
});
LIB.add({
  cat: "stove", name: "creamintopan", dur: 3.6,
  foods: ["chicken", "mushroom", "shrimp", "sausage", "spinach", "garlic"],
  steps: ["Pour in the heavy cream and bring to a simmer", "Stir in the cream and parmesan", "Add the cream and cook until slightly thickened"],
  draw(t, F, key) {
    const G = key === "sausage" ? { ...FOODS.sausage, type: "long", small: false } : key === "garlic" ? { type: "grains", fill: "#FFF3C8", inner: "#FFF3C8" } : F;
    return stoveSauceIn(t, 3.6, G, key, "#FFF3DA", "cup", { full: true });
  },
});

LIB.add({
  cat: "stove", name: "deglazepan", dur: 3.8,
  foods: ["wine", "broth", "stock", "water", "vinegar", "beer"],
  steps: ["Add the wine, scraping up the browned bits from the bottom of the pan", "Deglaze the pan with broth", "Stir with a wooden spoon to loosen any brown bits from the bottom of the pan"],
  draw(t, F, key) {
    const p = t / 3.8, pool = ease(seg(p, 0.12, 0.32)), scrape = seg(p, 0.36, 0.95);
    const liq = F.liquid;
    let inner = stovePool(stoveMix(liq, "#8A5A2B", 0.35 * scrape), lerp(10, 100, pool), lerp(4, 25, pool), 150, pool > 0.01 ? 0.92 : 0);
    const sx = 180 + Math.sin(scrape * Math.PI * 4) * 70 * (scrape > 0 ? 1 : 0);
    stoveSpots(22, 180, 148, 90, 20).forEach(([x, y, r, i]) => {
      const gone = scrape > 0 && (scrape > 0.8 || Math.abs(x - sx) < 26) ? 1 : 0;
      const fade = clamp(1 - scrape * 1.2 - gone * 0.3);
      inner += `<path transform="translate(${x} ${y}) rotate(${r})" d="M-5 -3 L4 -4 L6 2 L-2 5 L-6 1 Z" fill="#6B3A1C" opacity="${0.15 + 0.85 * fade}"/>`;
    });
    inner += stovePops(t, 6, 180, 150, 90, 20, pool * 0.8, 1, 1.2);
    let s = stoveVessel(STOVE_PAN, t, inner, { flame: 0.8 });
    const burst = seg(p, 0.15, 0.5);
    if (burst > 0 && burst < 1) s += steam(t * 2, [130, 160, 190, 220, 250], 128 - burst * 20, 1.4);
    const tip = p < 0.12 ? ease(p / 0.12) : p < 0.3 ? 1 : 1 - ease(seg(p, 0.3, 0.38));
    const [cup, lx, ly] = stoveCup(252, 64, tip, liq, 0.75);
    if (tip > 0.85 && p < 0.32) s += FX.stream(lx, ly, 176, 146, liq, 7);
    if (p < 0.4) s += cup;
    if (scrape > 0) s += T.spoon(sx, 150 + Math.cos(scrape * Math.PI * 4) * 4, Math.cos(scrape * Math.PI * 4) * 22);
    return s;
  },
});

LIB.add({
  cat: "stove", name: "reducesauce", dur: 4.6,
  foods: ["wine", "broth", "cream", "tomatosauce", "sauce"],
  steps: ["Let it simmer rapidly until it reduces by half", "Simmer until the sauce is reduced and thickened", "If you'd like it thicker, reduce the sauce for 2-3 minutes longer"],
  draw(t, F) {
    const p = t / 4.6, k = ease(clamp(p / 0.9)), G = STOVE_SAUCE, d = lerp(2, 22, k);
    const c = stoveMix(F.liquid, stoveDark(F.liquid, 0.72), k * 0.8);
    const y0 = G.cy + 2, rx0 = G.rx - 8;
    let inner = `<path d="M${G.cx - rx0} ${y0} A${rx0} ${G.ry - 4} 0 0 1 ${G.cx + rx0} ${y0}" fill="none" stroke="${stoveDark(F.liquid, 0.6)}" stroke-width="4" stroke-dasharray="9 7" opacity="${k * 0.7}"/>`;
    inner += stoveSurf(G, c, d);
    inner += stovePops(t, 8, G.cx, G.cy + d + 1, 70, 8, 1, 1.2, 1.3);
    return stoveVessel(G, t, inner, { flame: 0.9 }) + steam(t, [110, 150, 190, 220], 100, 0.9) + steam(t + 0.7, [130, 200], 90, 0.9);
  },
});

LIB.add({
  cat: "stove", name: "skimfoam", dur: 3.6,
  foods: ["broth", "lentils", "chickpeas", "kidneybeans"],
  steps: ["Skim off any foam that rises to the surface", "Bring to a boil and skim the scum from the top", "Use a spoon to skim off the foam"],
  draw(t, F, key) {
    const p = t / 3.6, G = STOVE_POT, d = 14, liq = key === "broth" ? "#E8B46A" : "#D9BF94";
    let inner = "";
    if (key !== "broth") stoveSpots(16, G.cx, G.cy + d + 2, 92, 12).forEach(([x, y, r]) => { inner += piece(F, "bit", x, y, r, 1.3); });
    inner += stoveSurf(G, liq, d, key === "broth" ? 1 : 0.7);
    const sweep = seg(p, 0.08, 0.5), sx = lerp(268, 100, ease(sweep));
    const foam = [[96, 108], [124, 104], [150, 110], [176, 105], [204, 109], [232, 104], [258, 108]];
    foam.forEach(([x, y], i) => { if (!(sweep > 0 && x > sx - 6)) inner += [[-8, 0, 8], [4, -3, 9], [12, 2, 6], [-2, 4, 6]].map(([a, b, r]) => `<circle cx="${x + a}" cy="${y + b}" r="${r}" fill="#F6F1E4" ${st(1.8)}/>`).join(""); });
    const lift = seg(p, 0.5, 0.75), back = seg(p, 0.8, 0.98);
    let s = stoveVessel(G, t, inner, { flame: 0.6 }) + V.smallBowl(316, 200, 0.42, `<ellipse cx="0" cy="8" rx="44" ry="10" fill="#F6F1E4" opacity="${lift > 0.9 || back > 0 ? 1 : 0}"/>`);
    const full = sweep > 0.2 && back === 0;
    let x = sx, y = 110;
    if (lift > 0) { x = lerp(100, 300, ease(lift)); y = 110 - Math.sin(lift * Math.PI) * 60 + lift * 70; }
    if (back > 0) { x = lerp(300, 268, ease(back)); y = lerp(180, 110, ease(back)); }
    if (p < 0.08) { x = 268; y = lerp(80, 110, ease(p / 0.08)); }
    return s + steam(t, [150, 220], 90, 0.5) + stoveSpoonM(x, y, lift > 0.8 && back === 0 ? -40 : 0, full ? "#F6F1E4" : null);
  },
});

// =====================================================================
// 3. Ground meat, bacon, sausage
// =====================================================================
LIB.add({
  cat: "stove", name: "breakupmeat", dur: 4.4,
  foods: ["groundbeef", "groundturkey", "groundpork", "groundchicken", "groundlamb", "chorizo", "sausage"],
  steps: ["Add the ground beef and cook, breaking it up as you go", "Cook, breaking it up with a spoon, until no longer pink", "Brown the ground turkey, crumbling it with a wooden spoon", "Add the sausage and cook until browned, breaking it into crumbles"],
  draw(t, F, key) {
    const G = STOVE_GROUND(F), p = t / 4.4, spread = ease(seg(p, 0.08, 0.6)), k = ease(seg(p, 0.2, 0.92));
    const raw = G.fill, done = G.cooked;
    let inner = "";
    stoveSpots(30, 180, 148, 88, 19).forEach(([x, y, r, i]) => {
      const sx = lerp(180 + (x - 180) * 0.32, x, spread), sy = lerp(146 + (y - 148) * 0.4, y, spread);
      const rr = lerp(13, 6.5, spread) * (0.85 + (i % 3) * 0.12);
      inner += `<circle cx="${sx}" cy="${sy}" r="${rr}" fill="${stoveMix(raw, done, k * (0.85 + (i % 4) * 0.05))}" ${st(2.3)}/>`;
      if (k < 0.6 && i % 4 === 0) inner += `<path d="M${sx - 3} ${sy} q2 -2 4 0" stroke="${G.mark || "#F2D5CF"}" stroke-width="2" fill="none" opacity="${1 - k / 0.6}"/>`;
    });
    let s = stoveVessel(STOVE_PAN, t, inner, { flame: 0.9 }) + sizzle(t, 180, 132, 170) + steam(t, [140, 200, 240], 112, 0.6);
    const chop = Math.abs(Math.sin(t / 4.4 * Math.PI * 10)), cx = 180 + Math.sin(t / 4.4 * Math.PI * 3) * 50 * lerp(0.4, 1, spread);
    return s + T.spoon(cx, lerp(124, 146, chop), -10);
  },
});

LIB.add({
  cat: "stove", name: "spoonfat", dur: 3.6,
  foods: ["groundbeef", "groundturkey", "groundpork", "chorizo", "sausage", "bacon"],
  steps: ["Remove from the heat and carefully spoon off and discard the excess fat", "Drain off the excess grease", "Pour out and discard excess fat in skillet"],
  draw(t, F, key) {
    const p = t / 3.6, fat = key === "chorizo" ? "#E0702E" : "#F2C84B", left = lerp(52, 30, ease(p));
    let inner = stovePool(fat, left, left * 0.34, 156, 0.85, 118);
    if (key === "bacon") [[214, 136, -8], [236, 152, 6], [210, 162, 2]].forEach(([x, y, r]) => { inner += g(`<path d="M-34 -5 C-22 -12 -10 2 0 -5 C10 -12 22 2 34 -5 L34 4 C22 11 10 -3 0 4 C-10 11 -22 -3 -34 4 Z" fill="${F.cooked}" ${st(2.4)}/>`, x, y, 1, r); });
    else { const G = STOVE_GROUND(F); stoveSpots(22, 226, 148, 50, 18).forEach(([x, y, r, i]) => { inner += `<circle cx="${x}" cy="${y}" r="${6 + (i % 3)}" fill="${stoveMix(G.cooked, "#4A2A1A", (i % 4) * 0.08)}" ${st(2.2)}/>`; }); }
    let s = stoveVessel(STOVE_PAN, t, inner, { flame: 0, tilt: -5 });
    const cyc = (p * 2) % 1, go = ease(seg(cyc, 0.3, 0.6)), back = ease(seg(cyc, 0.75, 0.98));
    const x = lerp(lerp(124, 54, go), 124, back), y = lerp(lerp(154, 178, go), 154, back) - Math.sin(go * Math.PI) * 40;
    s += V.smallBowl(48, 206, 0.42, `<ellipse cx="0" cy="10" rx="40" ry="9" fill="${fat}" opacity=".85"/>`);
    return s + stoveSpoonM(x, y, go > 0.9 && back < 0.1 ? -50 : 0, go < 0.9 || back > 0.1 ? fat : null);
  },
});

LIB.add({
  cat: "stove", name: "baconcrisp", dur: 4.4, foods: ["bacon"],
  steps: ["Cook the bacon until crisp", "Fry the bacon strips, turning once, until browned and crispy", "Cook bacon over medium heat until the fat renders and it curls"],
  draw(t, F) {
    const p = t / 4.4, k = ease(clamp(p / 0.9));
    let inner = stovePool("#F2D27A", lerp(30, 96, k), lerp(8, 22, k), 150, 0.7);
    [[128, -6], [148, 2], [168, -4]].forEach(([y, r], i) => {
      const L = lerp(92, 74, k), a = lerp(4, 9, k), flip = i === 1 ? seg(p, 0.5, 0.62) : 0;
      let top = `M${-L} 0`, bot = "";
      for (let j = 0; j <= 8; j++) top += ` L${-L + j * L / 4} ${Math.sin(j * 1.4 + i) * a - 6}`;
      for (let j = 8; j >= 0; j--) bot += ` L${-L + j * L / 4} ${Math.sin(j * 1.4 + i) * a + 6}`;
      let mid = `M${-L} 0`; for (let j = 0; j <= 8; j++) mid += ` L${-L + j * L / 4} ${Math.sin(j * 1.4 + i) * a}`;
      const col = stoveMix(F.fill, F.cooked, k * (i === 1 && flip === 1 ? 1.05 : 0.95));
      inner += `<g transform="translate(180 ${y - Math.sin(flip * Math.PI) * 26}) rotate(${r}) scale(1 ${Math.max(0.1, Math.abs(Math.cos(flip * Math.PI)))})"><path d="${top}${bot} Z" fill="${col}" ${st(2.8)}/><path d="${mid}" fill="none" stroke="${stoveMix(F.inner, "#E8B07A", k)}" stroke-width="3.5"/></g>`;
    });
    let s = stoveVessel(STOVE_PAN, t, inner, { flame: 0.7 }) + sizzle(t, 180, 124, 180) + steam(t, [140, 210], 110, 0.5);
    const tg = seg(p, 0.42, 0.7);
    if (tg > 0 && tg < 1) s += T.tongs(250 - Math.sin(tg * Math.PI) * 10, 146 - Math.sin(seg(p, 0.5, 0.62) * Math.PI) * 26, -20, 0.1);
    return s;
  },
});

LIB.add({
  cat: "stove", name: "renderfat", dur: 3.8,
  foods: ["bacon", "pancetta", "chorizo"],
  steps: ["Cook the pancetta, stirring, until the fat has rendered and it is crisp", "Cook the diced bacon until crisp, then remove with a slotted spoon", "Cook the chorizo until it releases its oil"],
  draw(t, F, key) {
    const p = t / 3.8, k = ease(clamp(p / 0.9)), oil = key === "chorizo" ? "#E0602E" : "#F2D27A";
    let inner = stovePool(oil, lerp(20, 98, k), lerp(6, 24, k), 150, 0.75);
    stoveSpots(20, 180, 147, 80, 17).forEach(([x, y, r, i]) => {
      const jig = Math.sin(t * 7 + i) * 1;
      if (key === "chorizo") inner += `<g transform="translate(${x + jig} ${y})"><ellipse rx="11" ry="8" fill="${stoveMix(F.fill, F.cooked, k)}" ${st(2.4)}/><circle cx="-3" cy="-1" r="1.8" fill="#F2C2A0" opacity="${1 - k * 0.5}"/><circle cx="4" cy="2" r="1.6" fill="#F2C2A0" opacity="${1 - k * 0.5}"/></g>`;
      else inner += stoveBit({ ...F, type: "strip" }, x + jig, y, r * 0.1, k, 0.8);
    });
    let s = stoveVessel(STOVE_PAN, t, inner, { flame: 0.6 }) + sizzle(t, 180, 130, 160);
    return s + stoveStir(t, 3.8, 180, 148, 50, 10, 1);
  },
});

LIB.add({
  cat: "stove", name: "brownlinks", dur: 4,
  foods: ["sausage", "bratwurst"],
  steps: ["Brown the sausages on all sides, turning with tongs", "Cook the sausages, turning occasionally, until browned all over", "Brown the bratwurst in a skillet"],
  draw(t, F) {
    const p = t / 4, k = ease(clamp(p / 0.9)), links = [[132, 130], [228, 130], [132, 160], [228, 160]];
    let inner = stovePool("#F2D27A", 90, 20, 150, 0.4);
    const active = Math.floor(p * 4) % 4, w = (p * 4) % 1, roll = ease(seg(w, 0.3, 0.7));
    links.forEach(([x, y], i) => {
      const off = (i < active ? 1 : 0) * 6 + (i === active ? roll * 6 : 0);
      const col = stoveMix(F.fill, F.cooked, k * 0.6);
      inner += g(`<rect x="-44" y="-12" width="88" height="24" rx="12" fill="${col}" ${st(3)}/>` + [-24, 0, 24].map(dx => `<path d="M${dx - 6} ${-6 + off} L${dx + 6} ${-6 + off}" stroke="${stoveDark(F.cooked, 0.8)}" stroke-width="5" stroke-linecap="round" opacity="${0.3 + k * 0.7}"/>`).join(""), x, y - (i === active ? Math.sin(roll * Math.PI) * 4 : 0), 1, i % 2 ? 4 : -4);
    });
    let s = stoveVessel(STOVE_PAN, t, inner, { flame: 0.7 }) + sizzle(t, 180, 118, 170);
    const [tx, ty] = links[active];
    return s + T.tongs(tx + 30 + (1 - Math.sin(w * Math.PI)) * 16, ty - 4, -24, roll > 0 && roll < 1 ? 0.05 : 0.35);
  },
});

// =====================================================================
// 4. Creamy savory fillings (chicken pot pie, stew gravy, sausage gravy)
// =====================================================================
// Diced onion, carrot, celery; k = how soft (opaque to glossy).
function stoveMirepoix(n, k, cx = 180, cy = 147, rx = 82, ry = 18, jig = 0) {
  const cols = [["#F4E6F1", "#F2E2C0"], ["#F6B27A", "#F39448"], ["#C9E6A2", "#A9D57A"]];
  return stoveSpots(n, cx, cy, rx, ry).map(([x, y, r, i]) => {
    const [a, b] = cols[i % 3], c = stoveMix(a, b, k);
    return `<g transform="translate(${x + Math.sin(jig + i) * 1.2} ${y}) rotate(${(r % 50) - 25})"><rect x="-7" y="-6" width="14" height="12" rx="3" fill="${c}" ${st(2.2)}/>${k > 0.4 && i % 2 ? `<path d="M-4 -3 l4 -1" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity="${k}"/>` : ""}</g>`;
  }).join("");
}
const stoveChickenCube = (x, y, r) => g(`<rect x="-10" y="-8" width="20" height="16" rx="4" fill="#F4E2C6" ${st(2.4)}/><path d="M-7 -5 L6 -5" stroke="#D9A86A" stroke-width="2.5" stroke-linecap="round"/>`, x, y, 1, r);
const stovePea = (x, y) => `<circle cx="${x}" cy="${y}" r="5" fill="#6DB04A" ${st(2)}/>`;

LIB.add({
  cat: "stove", name: "mirepoixbutter", dur: 4, foods: null,
  steps: ["Melt the butter, then add the onion, carrot, and celery and cook until softened", "Add onion, carrots, celery, thyme, salt, and pepper and cook, stirring often, until softened, 5 to 7 minutes", "Cook the vegetables in butter until tender"],
  draw(t) {
    const p = t / 4, m = ease(seg(p, 0, 0.25)), k = ease(seg(p, 0.25, 0.95));
    let inner = stovePool("#FFE08A", lerp(30, 96, m), lerp(8, 22, m), 150, 0.8);
    if (m < 1) inner += g(whole(FOODS.butter), 180, 140, 0.4 * (1 - m) + 0.01);
    inner += stoveMirepoix(24, k, 180, 147, 80, 17, t * 2);
    return stoveVessel(STOVE_PAN, t, inner, { flame: 0.6 }) + sizzle(t, 180, 132, 150) + stoveStir(t, 4, 180, 148, 56, 10, 1);
  },
});

LIB.add({
  cat: "stove", name: "flouroverpan", dur: 3.8,
  foods: ["veggies", "mushroom", "sausage", "beef", "chicken"],
  steps: ["Sprinkle the flour over the vegetables and stir until no dry flour remains", "Add flour and stir to coat vegetables", "Add flour and cook, stirring, for 1 minute", "Sprinkle the flour over the sausage and stir"],
  draw(t, F, key) {
    const p = t / 3.8, fall = seg(p, 0.05, 0.4), gone = ease(seg(p, 0.45, 0.9));
    let inner = "";
    if (key === "veggies") inner += stoveMirepoix(24, 0.8);
    else if (key === "sausage") stoveSpots(28, 180, 148, 86, 19).forEach(([x, y, r, i]) => { inner += `<circle cx="${x}" cy="${y}" r="${6 + (i % 3)}" fill="${stoveMix("#9C5030", "#6B3A1C", (i % 4) * 0.2)}" ${st(2.2)}/>`; });
    else stoveSpots(key === "mushroom" ? 14 : 11, 180, 147, 78, 17).forEach(([x, y, r]) => { inner += stoveBit(F, x, y, r, 1); });
    stoveSpots(30, 180, 146, 84, 18).forEach(([x, y, r, i]) => { if (i / 30 < fall) inner += `<circle cx="${x}" cy="${y - 4}" r="${2.6 + (i % 3)}" fill="#FFFFFF" stroke="#D8D2C4" stroke-width="1" opacity="${1 - gone}"/>`; });
    let s = stoveVessel(STOVE_PAN, t, inner, { flame: 0.6 });
    if (p < 0.42) {
      const tip = ease(seg(p, 0, 0.08)) * (1 - ease(seg(p, 0.36, 0.42)));
      const [cup, lx, ly] = stoveCup(256, 60, tip, "#FFFFFF", 0.6);
      s += cup;
      if (tip > 0.8) s += FX.fall(t, 0.6, 10, 190, 90, ly + 4, 140, (x, y) => `<rect x="${x}" y="${y}" width="4" height="4" fill="#fff" stroke="${INK}" stroke-width="1"/>`);
    }
    return s + (p > 0.42 ? stoveStir(t, 3.8, 180, 148, 56, 10, 1) : "");
  },
});

// Liquid poured over floured filling; it thickens into a creamy sauce that coats everything.
function stoveCreamy(t, dur, liq, sauce, drawPieces, G = STOVE_PAN) {
  const p = t / dur, pour = ease(seg(p, 0.08, 0.42)), thick = ease(seg(p, 0.4, 0.85));
  const pot = G === STOVE_POT;
  let inner = "";
  if (pot) { inner += stoveSurf(G, stoveMix(stoveMix(liq, "#fff", 0.2), sauce, thick), lerp(40, 16, pour), lerp(0.6, 1, thick)); }
  else inner += stovePool(stoveMix(stoveMix(liq, "#fff", 0.2), sauce, thick), lerp(20, 104, pour), lerp(6, 28, pour), 150, pour > 0.01 ? lerp(0.6, 1, thick) : 0);
  inner += drawPieces(thick);
  inner += stovePops(t, 6, G.cx, pot ? G.cy + 18 : 150, 80, pot ? 10 : 18, thick, 1.4, 0.5);
  let s = stoveVessel(G, t, inner, { flame: 0.6 });
  const tip = p < 0.08 ? ease(p / 0.08) : p < 0.4 ? 1 : 1 - ease(seg(p, 0.4, 0.48));
  const [cup, lx, ly] = stoveCup(258, pot ? 40 : 60, tip, liq, 0.8);
  if (tip > 0.85 && p < 0.42) s += FX.stream(lx, ly, 182, pot ? 112 : 146, liq, 7);
  if (p < 0.5) s += cup;
  if (thick > 0.8) s += FX.sparkle(t, 218, pot ? 104 : 134, 0.8);
  return s + (p > 0.45 ? stoveStir(t, dur, G.cx, pot ? 118 : 148, 52, 9, 1) : "");
}
LIB.add({
  cat: "stove", name: "creamyfilling", dur: 4,
  foods: ["broth", "milk", "cream"],
  steps: ["Gradually stir in the chicken broth and milk and cook until thickened", "Pour in the broth and cream, stirring until the sauce is thick and creamy", "Slowly whisk in the milk and simmer until it coats the vegetables"],
  draw(t, F, key) {
    const sauce = key === "broth" ? "#EBCB8E" : "#F6EBCF";
    return stoveCreamy(t, 4, F.liquid, sauce, (k) => stoveMirepoix(22, 0.85) + (k > 0.3 ? stoveSpots(22, 180, 147, 80, 17).map(([x, y], i) => i % 2 ? `<ellipse cx="${x}" cy="${y + 2}" rx="6" ry="3" fill="${sauce}" opacity="${k * 0.8}"/>` : "").join("") : ""));
  },
});
LIB.add({
  cat: "stove", name: "potpiefilling", dur: 3.8,
  foods: ["chicken", "turkey", "peas"],
  steps: ["Stir in the cooked chicken and peas", "Add the shredded chicken and frozen peas to the sauce", "Stir the turkey and peas into the creamy filling"],
  draw(t) {
    const p = t / 3.8, drop = seg(p, 0.05, 0.45);
    let inner = stovePool("#F3E2BC", 104, 28, 150) + stoveMirepoix(14, 0.85);
    const spots = stoveSpots(18, 180, 147, 80, 17);
    spots.forEach(([x, y, r, i]) => {
      const q = clamp(drop * 1.6 - (i / 18) * 0.6), yy = lerp(60, y, ease(q));
      if (q <= 0) return;
      inner += i % 2 ? stoveChickenCube(x, yy, r % 40) : stovePea(x, yy) + stovePea(x + 9, yy + 3);
    });
    stoveSpots(12, 180, 148, 84, 18).forEach(([x, y]) => { inner += `<ellipse cx="${x}" cy="${y + 3}" rx="7" ry="3" fill="#F3E2BC" opacity="${ease(seg(p, 0.5, 0.8)) * 0.9}"/>`; });
    let s = stoveVessel(STOVE_PAN, t, inner, { flame: 0.5 });
    if (p > 0.75) s += FX.sparkle(t, 220, 134, 0.8);
    return s + (p > 0.45 ? stoveStir(t, 3.8, 180, 148, 54, 10, 1) : "");
  },
});
LIB.add({
  cat: "stove", name: "fillingintodish", dur: 3.6,
  foods: ["chicken", "apple", "cherries", "peach", "beef"],
  steps: ["Pour the filling into the pie crust", "Spoon the chicken mixture into the prepared pie dish", "Transfer the filling to the baking dish"],
  draw(t, F, key) {
    const p = t / 3.6, fill = ease(clamp(p / 0.9));
    const sweet = ["apple", "cherries", "peach"].includes(key);
    const sauce = key === "chicken" ? "#F3E2BC" : key === "beef" ? "#7A4020" : F.type === "grains" ? F.inner : "#D08A3A";
    const content = (cx, cy, rx, ry, n) => {
      let c = stovePool(sauce, rx, ry, cy, 1, cx);
      stoveSpots(n, cx, cy - 2, rx * 0.8, ry * 0.65).forEach(([x, y, r, i]) => {
        if (sweet) c += stoveFruit(F, key, x, y, r, 0.8, 0.9);
        else if (key === "chicken") c += i % 3 === 0 ? stoveChickenCube(x, y, r % 40) : i % 3 === 1 ? stovePea(x, y) : g(`<rect x="-6" y="-5" width="12" height="10" rx="3" fill="#F39448" ${st(2)}/>`, x, y);
        else c += i % 3 === 2 ? g(`<rect x="-6" y="-5" width="12" height="10" rx="3" fill="#F39448" ${st(2)}/>`, x, y) : g(`<rect x="-10" y="-8" width="20" height="16" rx="4" fill="#6B3A22" ${st(2.4)}/>`, x, y, 0.85, r % 30);
      });
      return c;
    };
    // Pie dish on the right, skillet small on the left.
    let s = V.piePlate(fill > 0.02 ? `<path d="M70 150 L290 150 L${lerp(290, 278, 1)} ${lerp(150, 150, 1)} Z" fill="none"/>` : "");
    s = g(s, 113, 72, 0.75);
    if (fill > 0.02) s += g(content(180, 150, 104 * Math.sqrt(fill), 12 * Math.sqrt(fill), 10), 113, 72, 0.75);
    s = g(stoveVessel(STOVE_PAN, t, content(180, 150, 100, 26, 14), { flame: 0 }), -34, -2, 0.66) + s;
    const cyc = (p * 2) % 1, go = ease(seg(cyc, 0.15, 0.5)), back = ease(seg(cyc, 0.7, 0.95));
    const x = lerp(lerp(88, 248, go), 88, back), y = lerp(lerp(96, 168, go), 96, back) - Math.sin(go * Math.PI) * 40;
    return s + stoveSpoonM(x, y, go > 0.9 && back < 0.1 ? -50 : 0, go < 0.9 || back > 0.1 ? sauce : null);
  },
});
LIB.add({
  cat: "stove", name: "sausagegravy", dur: 4,
  foods: ["sausage", "groundpork"],
  steps: ["Slowly whisk in the milk and cook until the gravy thickens", "Pour the milk over the sausage and flour, stirring until thick", "Season the sausage gravy with plenty of black pepper"],
  draw(t) {
    return stoveCreamy(t, 4, "#FFFFFF", "#EDE3CF", (k) => stoveSpots(26, 180, 148, 84, 18).map(([x, y, r, i]) => `<circle cx="${x}" cy="${y}" r="${5.5 + (i % 3)}" fill="${stoveMix("#9C5030", "#B98A6A", k * 0.5)}" ${st(2.2)}/>${i % 3 ? "" : `<circle cx="${x + 7}" cy="${y - 3}" r="1.6" fill="${INK}" opacity="${k}"/>`}`).join(""));
  },
});
LIB.add({
  cat: "stove", name: "stewgravy", dur: 4,
  foods: ["beef", "lamb"],
  steps: ["Add the beef broth and stir, scraping up any browned bits, until the gravy thickens", "Return the beef to the pot, sprinkle with flour, and stir in the broth", "Simmer until the stew is thick and glossy"],
  draw(t, F) {
    return stoveCreamy(t, 4, "#E8B46A", "#7A4020", (k) => stoveSpots(12, 180, 116, 88, 9).map(([x, y, r, i]) => i % 3 === 1
      ? g(`<rect x="-8" y="-7" width="16" height="14" rx="3" fill="#F39448" ${st(2.2)}/>`, x, y)
      : i % 3 === 2 ? g(`<rect x="-9" y="-8" width="18" height="16" rx="4" fill="#F4E3B0" ${st(2.2)}/>`, x, y)
      : g(`<rect x="-11" y="-9" width="22" height="18" rx="4" fill="${F.cooked}" ${st(2.4)}/>`, x, y, 1, r % 30)).join(""), STOVE_POT);
  },
});

// =====================================================================
// 5. Eggs
// =====================================================================
// A fried egg seen from above at an angle; set 0 (clear) .. 1 (white).
const stoveEgg = (x, y, set, s = 1, edge = 0) => g(`<path d="M-40 2 C-44 -14 -20 -20 -4 -18 C14 -22 42 -14 40 2 C42 16 16 20 0 18 C-18 22 -40 16 -40 2 Z" fill="${stoveMix("#C9C9C2", "#FFFFFF", set)}" opacity="${lerp(0.75, 1, set)}" stroke="${stoveMix("#9A9A92", edge ? "#C98340" : "#B8B2A6", edge)}" stroke-width="${2.5 + edge * 1.5}"/>
  <ellipse cx="2" cy="-2" rx="13" ry="10" fill="#F5B92E" ${st(2.6)}/><path d="M-3 -6 q4 -3 8 -1" stroke="#fff" stroke-width="2.4" fill="none" opacity=".8"/>`, x, y, s);

LIB.add({
  cat: "stove", name: "eggfry", dur: 4.4, foods: ["egg"],
  steps: ["Crack the egg into the hot buttered pan", "Fry the eggs until the whites are set and the yolks are still runny", "Cook sunny side up until the edges are golden"],
  draw(t) {
    const p = t / 4.4, m = ease(seg(p, 0, 0.18)), drop = seg(p, 0.2, 0.32), set = ease(seg(p, 0.32, 0.85));
    let inner = stovePool("#FFE08A", lerp(20, 80, m), lerp(6, 18, m), 150, 0.75);
    if (m < 1) inner += g(whole(FOODS.butter), 180, 142, 0.35 * (1 - m) + 0.01);
    if (drop >= 1) inner += stoveEgg(180, 150, set, lerp(0.8, 1.1, ease(seg(p, 0.32, 0.45))), ease(seg(p, 0.6, 0.95)));
    let s = stoveVessel(STOVE_PAN, t, inner, { flame: 0.6 }) + (drop >= 1 ? sizzle(t, 180, 132, 100) : "");
    if (p > 0.1 && p < 0.42) {
      const open = ease(seg(p, 0.16, 0.24));
      s += stoveShell(180, 64, open) + g(fist(), 180 - 40 - open * 22, 56, 0.9) + g(fist(), 180 + 40 + open * 22, 56, 0.9);
      if (open > 0.5 && drop < 1) s += `<ellipse cx="180" cy="${lerp(76, 140, drop)}" rx="10" ry="12" fill="#F5B92E" ${st(2.4)}/>`;
    }
    return s;
  },
});
LIB.add({
  cat: "stove", name: "eggscramble", dur: 4.4, foods: ["egg"],
  steps: ["Use a spatula to scramble the eggs, breaking them up into small bits", "Pour in the eggs and gently push them around until softly set", "Cook, stirring, until the eggs are just set"],
  draw(t) {
    const p = t / 4.4, pour = ease(seg(p, 0, 0.2)), k = ease(seg(p, 0.25, 0.9));
    let inner = stovePool("#F7D14B", lerp(10, 96, pour) * (1 - k * 0.9), lerp(4, 24, pour) * (1 - k * 0.9), 150, pour > 0.02 ? 1 : 0);
    stoveSpots(16, 180, 146, 62, 14).forEach(([x, y, r, i]) => {
      const q = clamp(k * 1.5 - (i / 16) * 0.5);
      if (q > 0) inner += g(`<path d="M-12 4 C-14 -8 -2 -12 4 -8 C12 -12 16 0 10 6 C4 10 -8 10 -12 4 Z" fill="${stoveMix("#F7D14B", "#FBE7A0", q)}" ${st(2.3)}/>`, x, y, lerp(0.4, 1, q), r % 40);
    });
    let s = stoveVessel(STOVE_PAN, t, inner, { flame: 0.5 });
    if (p < 0.22) s += g(V.smallBowl(0, 0, 0.5, `<ellipse cx="0" cy="8" rx="56" ry="10" fill="#F7D14B"/>`), 256, 70, 1, -60 * ease(seg(p, 0, 0.05))) + (p > 0.04 && p < 0.2 ? FX.stream(232, 84, 184, 146, "#F7D14B", 8) : "");
    const sw = Math.sin(seg(p, 0.25, 1) * Math.PI * 6);
    return s + (p > 0.24 ? stoveTurner(180 + sw * 60, 150, -18 + sw * 4) : "");
  },
});
LIB.add({
  cat: "stove", name: "eggfriedrice", dur: 4.2, foods: ["whiterice"],
  steps: ["Shove the rice to the side of the wok and scramble the egg", "Push rice to the side, pour in the egg, and scramble, then toss together", "Toss egg and rice together"],
  draw(t) {
    const p = t / 4.2, pour = ease(seg(p, 0.05, 0.22)), scr = ease(seg(p, 0.25, 0.55)), mix = ease(seg(p, 0.6, 0.92));
    const G = STOVE_WOK;
    let inner = "";
    for (let i = 0; i < 70; i++) { const a = i * 2.39996, r = Math.sqrt((i + 0.5) / 70); let x = 180 + Math.cos(a) * r * 100, y = 132 + Math.sin(a) * r * 24; if (Math.hypot((x - 180) / 46, (y - 132) / 12) < 1 && mix < 0.5) { x += Math.sign(x - 180 || 1) * 44 * (1 - mix * 2); } inner += `<ellipse cx="${x}" cy="${y}" rx="5" ry="2.8" fill="#FFFFFF" stroke="${INK}" stroke-width="1.3" transform="rotate(${i * 40} ${x} ${y})"/>`; }
    if (scr < 1) inner += stovePool("#F7D14B", 40 * pour, 10 * pour, 132, pour > 0.02 ? 1 : 0);
    stoveSpots(12, 180, 132, lerp(36, 96, mix), lerp(9, 22, mix)).forEach(([x, y, r]) => { if (scr > 0) inner += g(`<path d="M-8 3 C-9 -6 0 -8 3 -5 C8 -8 11 0 7 4 C3 7 -5 7 -8 3 Z" fill="#FBE07A" ${st(2)}/>`, x, y, scr, r % 40); });
    let s = stoveVessel(G, t, inner, { flame: 1 });
    if (p > 0.04 && p < 0.24) s += g(V.smallBowl(0, 0, 0.45, `<ellipse cx="0" cy="8" rx="56" ry="10" fill="#F7D14B"/>`), 250, 56, 1, -60) + FX.stream(228, 70, 182, 128, "#F7D14B", 7);
    const sw = Math.sin(t / 4.2 * Math.PI * 8);
    return s + (p > 0.25 ? stoveTurner(180 + sw * 50, 132, -16) : "");
  },
});
LIB.add({
  cat: "stove", name: "eggflip", dur: 3.4, foods: ["egg"],
  steps: ["Flip the egg and cook 30 seconds more for over easy", "Carefully flip the eggs", "Gently turn the egg over without breaking the yolk"],
  draw(t) {
    const egg = (side) => side ? `<path d="M-40 2 C-44 -14 -20 -20 -4 -18 C14 -22 42 -14 40 2 C42 16 16 20 0 18 C-18 22 -40 16 -40 2 Z" fill="#FFFFFF" stroke="#C98340" stroke-width="3.5"/><ellipse cx="2" cy="-2" rx="14" ry="10" fill="#FFF8E8" ${st(2)}/><circle cx="-20" cy="6" r="3" fill="#E2B66A"/><circle cx="24" cy="-4" r="2.6" fill="#E2B66A"/>` : stoveEgg(0, 0, 1, 1, 0.5);
    return stoveVessel(STOVE_PAN, t, stovePool("#FFE08A", 80, 18, 150, 0.6), { flame: 0.5 }) + stoveFlip(t, 3.4, egg, { cy: 148, w: 44, h: 18 });
  },
});
LIB.add({
  cat: "stove", name: "omeletfold", dur: 4.6,
  foods: ["egg", "cheese", "mushroom", "spinach", "pepper", "tomato", "herbs"],
  steps: ["Add the filling to one half of the omelet", "Sprinkle the cheese over the eggs and fold the omelet in half", "Fold the omelet over and slide it onto a plate"],
  draw(t, F, key) {
    const p = t / 4.6, drop = seg(p, 0.08, 0.45), fold = ease(seg(p, 0.55, 0.82)), egg = "#F7D86A";
    let inner = "";
    const bits = key === "egg" ? [] : stoveSpots(12, 140, 148, 32, 15);
    const disc = (half) => half === "L" ? `<path d="M180 124 A92 26 0 0 0 180 176 Z" fill="${egg}" ${st(3)}/>` : `<path d="M180 124 A92 26 0 0 1 180 176 Z" fill="${egg}" ${st(3)}/>`;
    inner += disc("L").replace("A92 26 0 0 0", "A92 26 0 0 0");
    inner += `<path d="M180 124 A92 26 0 0 0 180 176" fill="none"/>`;
    bits.forEach(([x, y, r, i]) => {
      const q = clamp(drop * 1.5 - (i / 12) * 0.5); if (q <= 0) return;
      const yy = lerp(70, y, ease(q));
      inner += key === "cheese" ? piece(F, "shred", x, yy, r, 1.2) : key === "mushroom" ? stoveBit(F, x, yy, r, 0.4, 0.8) : key === "spinach" || key === "herbs" ? piece(F, "bit", x, yy, r, 2.2) : piece(F, "cube", x, yy, r, 0.65);
    });
    const c = Math.cos(fold * Math.PI);
    inner += `<g transform="translate(180 0) scale(${c} 1) translate(-180 0)">${disc("R").replace(egg, c < 0 ? "#F2C24B" : egg)}</g>`;
    if (fold > 0.95 && key === "cheese") inner += `<path d="M110 168 q6 8 12 0 M140 172 q5 7 10 0" fill="#F7C94B" ${st(2)}/>`;
    let s = stoveVessel(STOVE_PAN, t, inner, { flame: 0.4 });
    if (fold > 0 && fold < 1) s += stoveTurner(180 + 90 * c, 150 - Math.sin(fold * Math.PI) * 30, -20);
    else if (p > 0.45 && p < 0.55) s += stoveTurner(lerp(320, 272, seg(p, 0.45, 0.55)), 150, -20);
    return s;
  },
});
LIB.add({
  cat: "stove", name: "eggpoach", dur: 4.4, foods: ["egg"],
  steps: ["Swirl the simmering water and gently slide in the egg", "Poach the eggs for 3 minutes until the whites are set", "Bring a pan of water to a gentle simmer and add a splash of vinegar"],
  draw(t) {
    const p = t / 4.4, G = STOVE_SAUCE, d = 10, swirl = t * 2.5;
    let inner = stoveSurf(G, C.water, d);
    for (let i = 0; i < 3; i++) inner += `<path d="M${G.cx - 50 + i * 10} ${G.cy + d} A${50 - i * 14} ${10 - i * 2.5} 0 0 1 ${G.cx + 50 - i * 18} ${G.cy + d}" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" transform="rotate(${(swirl * 30 + i * 60) % 360 * 0.05} ${G.cx} ${G.cy + d})" opacity=".8"/>`;
    const inn = seg(p, 0.38, 0.5), set = ease(seg(p, 0.5, 0.9));
    if (inn >= 1) inner += g(`<path d="M-26 0 C-30 -12 -8 -16 4 -14 C${20 + (1 - set) * 14} -14 ${30 + (1 - set) * 10} -4 26 4 C20 14 -20 14 -26 0 Z" fill="${stoveMix("#DCE7EE", "#FFFFFF", set)}" stroke="#AFC3CF" stroke-width="2.4"/><ellipse cx="0" cy="-2" rx="9" ry="7" fill="#F5B92E" ${st(2)} opacity="${1 - set * 0.4}"/>`, G.cx, G.cy + d, lerp(0.8, 1.1, set));
    if (p < 0.36) inner += T.spoon(G.cx + Math.cos(swirl) * 46, G.cy + d + Math.sin(swirl) * 8, Math.cos(swirl) * 10);
    let s = stoveVessel(G, t, inner, { flame: 0.4 });
    if (p > 0.3 && p < 0.52) s += g(V.smallBowl(0, 0, 0.42, `<ellipse cx="0" cy="6" rx="44" ry="10" fill="#fff"/><ellipse cx="0" cy="4" rx="12" ry="8" fill="#F5B92E"/>`), 220, 70, 1, -50 * ease(seg(p, 0.3, 0.38)));
    return s + steam(t, [130, 190], 100, 0.4);
  },
});
LIB.add({
  cat: "stove", name: "eggslower", dur: 3.4, foods: ["egg"],
  steps: ["Gently lower the eggs into the boiling water", "Boil the eggs for 7 to 9 minutes", "Carefully add the eggs to the boiling water with a slotted spoon"],
  draw(t, F) {
    const p = t / 3.4, G = STOVE_POT, d = 12, down = ease(seg(p, 0.05, 0.45)), up = ease(seg(p, 0.55, 0.85));
    let inner = [[130, 116], [226, 114]].map(([x, y]) => g(whole(F), x, y, 0.3, 70) + `<path d="M${x - 16} ${y + 10} q8 -4 16 0 q8 4 16 0" fill="none" stroke="#fff" stroke-width="2.4"/>`).join("");
    if (down >= 1) inner += g(whole(F), 180, 120, 0.3, -70);
    inner = stoveSurf(G, C.water, d, 1) + inner + stovePops(t, 10, G.cx, G.cy + d + 1, 96, 14, 1, 1.2, 1.2);
    let s = stoveVessel(G, t, inner, { flame: 0.9 }) + steam(t, [140, 200, 240], 90, 0.7);
    const y = down < 1 ? lerp(40, 112, down) : lerp(112, 40, up);
    return s + (down < 1 ? g(whole(F), 180, y - 6, 0.3, 80) : "") + stoveSpoonM(180, y, 0) ;
  },
});

// =====================================================================
// 6. Pancakes, crepes, French toast, tortillas, quesadillas, grilled cheese
// =====================================================================
LIB.add({
  cat: "stove", name: "pancakepour", dur: 4.6,
  foods: ["pancake", "blueberries", "chips", "banana"],
  steps: ["Pour or scoop the batter onto the griddle, using about 1/4 cup for each pancake", "Cook until bubbles form and the edges are dry", "Drop blueberries onto the pancakes as they cook"],
  draw(t, F, key) {
    const p = t / 4.6, spots = [[132, 104], [210, 104], [172, 166]];
    let s = V.panTop(170, 128, 96);
    spots.forEach(([x, y], i) => {
      const grow = ease(seg(p, i * 0.14, i * 0.14 + 0.12));
      if (grow <= 0) return;
      const set = ease(seg(p, 0.5 + i * 0.05, 0.95));
      s += `<circle cx="${x}" cy="${y}" r="${30 * grow}" fill="#F6D9A3" stroke="${stoveMix("#B5813A", "#8A5A2B", set)}" stroke-width="${2.5 + set * 2}"/>`;
      if (key !== "pancake" && grow >= 1) [[-10, -8], [8, -10], [12, 8], [-8, 10], [0, 0]].forEach(([a, b], j) => {
        const q = ease(seg(p, 0.42 + i * 0.03 + j * 0.01, 0.48 + i * 0.03 + j * 0.01)); if (q <= 0) return;
        const yy = lerp(y - 50, y + b, q);
        s += key === "blueberries" ? `<circle cx="${x + a}" cy="${yy}" r="5" fill="#4A5A9C" ${st(1.8)}/>` : key === "chips" ? `<path transform="translate(${x + a} ${yy})" d="M-5 4 L0 -5 L5 4 Z" fill="#4A2A1A" ${st(1.6)}/>` : `<ellipse cx="${x + a}" cy="${yy}" rx="6" ry="5" fill="#FBF1C7" ${st(1.8)}/>`;
      });
      for (let j = 0; j < 6; j++) { const q = ease(seg(p, 0.55 + j * 0.05 + i * 0.03, 0.62 + j * 0.05 + i * 0.03)); if (q > 0) s += `<circle cx="${x + Math.cos(j * 2.4) * 16}" cy="${y + Math.sin(j * 2.4) * 16}" r="${2.4 * q}" fill="#E8C07A" ${st(1.4)}/>`; }
    });
    const i = Math.min(2, Math.floor(p / 0.14));
    if (p < 0.42) { const [x, y] = spots[i]; s += FX.stream(x + 10, y - 50, x, y, "#F6D9A3", 8) + T.ladle(x + 22, y - 54, -60, "#F6D9A3"); }
    return s + steam(t, [120, 200], 70, 0.4);
  },
});
LIB.add({
  cat: "stove", name: "pancakeflip", dur: 3.4, foods: ["pancake"],
  steps: ["Flip and cook until browned on the other side", "Flip the pancakes when bubbles form on top", "Turn the pancakes and cook until golden"],
  draw(t) {
    const cake = (side) => `<ellipse cx="0" cy="4" rx="64" ry="20" fill="#E8B46A" ${st()}/><ellipse rx="64" ry="18" fill="${side ? "#C98340" : "#F6D9A3"}" ${st()}/>` + (side ? `<ellipse rx="46" ry="11" fill="#B5733A" opacity=".5"/>` : [[-30, -4], [-8, 6], [14, -6], [34, 4], [0, -8]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="3" fill="#E8C07A" ${st(1.4)}/>`).join(""));
    return stoveVessel(STOVE_PAN, t, "", { flame: 0.6 }) + stoveFlip(t, 3.4, cake, { cy: 146, w: 60, h: 18 });
  },
});
LIB.add({
  cat: "stove", name: "crepeswirl", dur: 4.4, foods: ["crepe"],
  steps: ["Pour in the batter and swirl the pan to coat the bottom", "Tilt the pan so the batter spreads into a thin layer", "Cook the crepe until the edges turn golden and lift"],
  draw(t) {
    const p = t / 4.4, pour = ease(seg(p, 0.02, 0.2)), spread = ease(seg(p, 0.15, 0.6)), brown = ease(seg(p, 0.6, 0.95));
    const tilt = Math.sin(seg(p, 0.15, 0.6) * Math.PI * 4) * 7;
    let inner = stovePool("#F7DCA0", lerp(30 * pour, 102, spread), lerp(9 * pour, 27, spread), 148, pour > 0.02 ? 1 : 0, 180 + tilt * 3 * (1 - spread));
    if (brown > 0) inner += `<ellipse cx="180" cy="148" rx="100" ry="26" fill="none" stroke="#C98340" stroke-width="${3 + brown * 4}" stroke-dasharray="10 6" opacity="${brown}"/>` + [[150, 140], [200, 152], [220, 138], [160, 158]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.5" fill="#E2B060" opacity="${brown}"/>`).join("");
    let s = stoveVessel(STOVE_PAN, t, inner, { flame: 0.5, tilt });
    if (p < 0.22) s += T.ladle(212, 70, -70, "#F7DCA0") + FX.stream(194, 78, 182, 146, "#F7DCA0", 7);
    return s;
  },
});
LIB.add({
  cat: "stove", name: "frenchtoastflip", dur: 3.4, foods: ["frenchtoast"],
  steps: ["Cook the soaked bread until golden brown, then flip", "Fry the French toast in butter for 2 to 3 minutes per side", "Flip and cook the other side until golden"],
  draw(t) {
    const slice = (side) => `<path d="M-40 18 L-42 -8 C-48 -20 -30 -26 -20 -18 C-10 -28 10 -28 20 -18 C30 -26 48 -20 42 -8 L40 18 Z" fill="${side ? "#C98340" : "#F2D27A"}" stroke="#B5733A" stroke-width="5" stroke-linejoin="round"/><path d="M-40 18 L-42 -8 C-48 -20 -30 -26 -20 -18 C-10 -28 10 -28 20 -18 C30 -26 48 -20 42 -8 L40 18 Z" fill="none" ${st(2.6)}/>` + (side ? `<circle cx="-14" cy="0" r="4" fill="#A8622A"/><circle cx="12" cy="6" r="3.5" fill="#A8622A"/>` : "");
    const inner = stovePool("#FFE08A", 96, 22, 150, 0.6) + `<g transform="translate(122 148) scale(1 .5)">${slice(0)}</g>`;
    return stoveVessel(STOVE_PAN, t, inner, { flame: 0.6 }) + `<g>${stoveFlip(t, 3.4, (side) => `<g transform="scale(1 .5)">${slice(side)}</g>`, { cx: 232, cy: 146, w: 42, h: 10 })}</g>`;
  },
});
LIB.add({
  cat: "stove", name: "tortillawarm", dur: 3.4, foods: ["tortilla", "cornTortilla", "naan", "pita"],
  steps: ["Warm the tortillas in a dry skillet, about 30 seconds per side", "Warm tortillas using chosen method", "Heat the naan in a hot pan until puffed and spotty"],
  draw(t, F, key) {
    const flat = (side) => `<ellipse rx="${key === "naan" ? 80 : 74}" ry="${key === "naan" ? 20 : 22}" fill="${F.fill}" ${st()}/>` + (side ? [[-40, -4], [-14, 8], [10, -8], [36, 4], [52, -4], [-24, -10]].map(([a, b]) => `<ellipse cx="${a}" cy="${b}" rx="6" ry="3.5" fill="#8A5A2B" opacity=".75"/>`).join("") : [[-30, -4], [10, 6], [34, -6]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="3" fill="${shade(F.fill)}" opacity=".6"/>`).join(""));
    return stoveVessel(STOVE_PAN, t, "", { flame: 0.6 }) + stoveFlip(t, 3.4, flat, { cy: 146, w: 70, h: 10, tool: "tongs" }) + steam(t, [150, 210], 112, 0.4);
  },
});
LIB.add({
  cat: "stove", name: "quesadillafold", dur: 4.6,
  foods: ["cheese", "chicken", "blackbeans", "beef", "mushroom", "pepper"],
  steps: ["Sprinkle cheese and fillings over half the tortilla, fold, and cook until golden", "Cook the quesadilla until the cheese melts, flipping once", "Fold the tortilla in half over the filling"],
  draw(t, F, key) {
    const p = t / 4.6, drop = seg(p, 0.05, 0.42), fold = ease(seg(p, 0.5, 0.72)), gold = ease(seg(p, 0.72, 1));
    let s = V.panTop(170, 128, 96);
    s += `<path d="M170 46 A82 82 0 0 0 170 210 Z" fill="#F1D9A0" ${st(3.5)}/>`;
    const sp = stoveSpots(16, 140, 128, 26, 62);
    sp.forEach(([x, y, r, i]) => {
      const q = clamp(drop * 1.6 - (i / 16) * 0.6); if (q <= 0) return;
      const yy = lerp(y - 40, y, ease(q));
      const cheese = i % 2 === 0 || key === "cheese";
      s += cheese ? piece(FOODS.cheese, "shred", x, yy, r, 1.3) : key === "chicken" ? stoveChickenCube(x, yy, r % 40) : key === "beef" ? g(`<rect x="-12" y="-4" width="24" height="8" rx="3" fill="#6B3A22" ${st(2)}/>`, x, yy, 1, r) : key === "blackbeans" ? piece(F, "bit", x, yy, r, 1.6) : key === "mushroom" ? stoveBit(F, x, yy, r, 0.6, 0.8) : piece(F, "strip", x, yy, r, 0.6);
    });
    const c = Math.cos(fold * Math.PI);
    s += `<g transform="translate(170 0) scale(${c} 1) translate(-170 0)"><path d="M170 46 A82 82 0 0 1 170 210 Z" fill="${c < 0 ? stoveMix("#F1D9A0", "#D9A050", gold) : "#F1D9A0"}" ${st(3.5)}/>${c < 0 && gold > 0 ? `<circle cx="190" cy="100" r="5" fill="#B5733A" opacity="${gold}"/><circle cx="214" cy="140" r="4" fill="#B5733A" opacity="${gold}"/>` : ""}</g>`;
    if (fold >= 1) s += `<path d="M88 150 q6 10 12 0 M84 110 q6 10 12 0" fill="#F7C94B" ${st(2)} opacity="${gold}"/>`;
    if (fold > 0 && fold < 1) s += stoveTurner(170 + 70 * c, 128, 0);
    return s + steam(t, [120, 190], 60, 0.4);
  },
});
LIB.add({
  cat: "stove", name: "grilledcheeseflip", dur: 3.6, foods: ["grilledcheese"],
  steps: ["Cook the sandwich until golden, then flip", "Butter the bread and grill until the cheese melts", "Flip the grilled cheese and cook until the other side is golden"],
  draw(t) {
    const p = t / 3.6, ooze = ease(seg(p, 0.2, 1));
    const sand = (side) => `<path d="M-52 4 L52 4 L52 16 L-52 16 Z" fill="${side ? "#F1DDB0" : "#C98340"}" ${st(3)}/><path d="M-50 2 L50 2 L50 6 L-50 6 Z" fill="#F7C94B" ${st(2)}/>` +
      `<path d="M-48 -26 C-54 -34 -36 -40 -26 -32 L26 -32 C36 -40 54 -34 48 -26 L52 2 L-52 2 Z" fill="${side ? "#C98340" : "#F1DDB0"}" ${st(3)}/>` +
      `<path d="M-30 6 q4 ${6 + ooze * 8} 8 0 M18 6 q4 ${5 + ooze * 6} 8 0" fill="#F7C94B" ${st(2)}/>` + (side ? `<circle cx="-16" cy="-16" r="4" fill="#A8622A"/><circle cx="14" cy="-10" r="3.5" fill="#A8622A"/>` : "");
    return stoveVessel(STOVE_PAN, t, stovePool("#FFE08A", 80, 18, 152, 0.6), { flame: 0.6 }) + stoveFlip(t, 3.6, sand, { cy: 146, w: 50, h: 14 });
  },
});

// =====================================================================
// 7. Burgers
// =====================================================================
LIB.add({
  cat: "stove", name: "pattiesin", dur: 3.4, foods: ["patty", "turkeypatty", "veggiepatty"],
  steps: ["Place the patties in the hot skillet", "Add the burgers to the pan and cook without moving them", "Lay the patties in the pan, leaving space between them"],
  draw(t, F) {
    const p = t / 3.4;
    let inner = "", s = "";
    [[128, 0.05], [232, 0.5]].forEach(([x, t0]) => {
      const q = ease(seg(p, t0, t0 + 0.3));
      if (q >= 1) inner += g(whole(F, 0.12), x, 150, 0.68);
      else if (q > 0) s += g(whole(F), lerp(300, x, q), lerp(40, 146, q) - Math.sin(q * Math.PI) * 30, 0.68) + stoveTurner(lerp(300, x, q) + 8, lerp(40, 146, q) - Math.sin(q * Math.PI) * 30 + 14, -16);
    });
    const land = [0.35, 0.8].some(a => p > a && p < a + 0.15);
    return stoveVessel(STOVE_PAN, t, inner, { flame: 0.9 }) + s + (land ? sizzle(t, 180, 128, 200) + sizzle(t + 0.3, 180, 120, 160) : sizzle(t, 180, 130, 120));
  },
});
LIB.add({
  cat: "stove", name: "smashpatty", dur: 3, foods: ["patty"],
  steps: ["Place balls of beef in pan and smash down with a stiff metal spatula", "Smash each ball flat with a spatula", "Press the burger thin and let it get a crispy edge"],
  draw(t, F) {
    const p = t / 3, press = ease(seg(p, 0.2, 0.42)), lift = ease(seg(p, 0.65, 0.85)), brown = ease(seg(p, 0.42, 1));
    const sx = lerp(1, 1.9, press), sy = lerp(1, 0.32, press);
    const c = stoveMix(F.fill, F.cooked, brown * 0.5);
    let inner = `<g transform="translate(180 ${lerp(142, 154, press)}) scale(${sx} ${sy})"><circle r="26" fill="${c}" ${st(3.5 / sx)}/>${[[-10, -8], [6, 4], [12, -10]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="3" fill="${F.mark}" opacity=".7"/>`).join("")}</g>`;
    if (press > 0.9) inner += `<ellipse cx="180" cy="155" rx="${54}" ry="${10}" fill="none" stroke="#8A4A2A" stroke-width="3" stroke-dasharray="4 5" opacity="${brown}"/>`;
    let s = stoveVessel(STOVE_PAN, t, inner, { flame: 0.9 });
    const y = lerp(lerp(80, 142 - 26 * sy - 2, press), 80, lift);
    if (p > 0.08 && p < 0.9) s += g(`<rect x="-60" y="-6" width="120" height="8" rx="3" fill="${C.steel}" ${st(3)}/><path d="M60 -4 L110 -40" ${st(7)}/>`, 180, y) + (press > 0 && lift < 1 ? g(fist(), 168, y - 20, 1.2) : g(fist(), 292, y - 46, 0.9));
    if (press > 0.9 && lift < 0.5) s += sizzle(t, 180, 130, 180) + sizzle(t + 0.25, 180, 124, 120);
    return s;
  },
});
LIB.add({
  cat: "stove", name: "burgerflip", dur: 3.2, foods: ["patty", "turkeypatty", "veggiepatty"],
  steps: ["Flip burgers over and cook an additional 3 to 5 minutes", "Flip the patties once they are well browned", "Turn the burgers with a spatula"],
  draw(t, F) {
    return stoveVessel(STOVE_PAN, t, "", { flame: 0.8 }) + stoveFlip(t, 3.2, (side) => g(whole(F, side ? 0.95 : 0.15), 0, 0, 0.8), { cy: 146, w: 46, h: 16 }) + sizzle(t, 180, 124, 120);
  },
});
LIB.add({
  cat: "stove", name: "cheeseonburger", dur: 4.4, foods: ["patty", "turkeypatty", "veggiepatty"],
  steps: ["Place a slice of cheese on each patty, cover, and cook until melted", "Top the burgers with cheese and cover the pan for 1 minute", "Add the cheese and let it melt"],
  draw(t, F) {
    const p = t / 4.4, drop = ease(seg(p, 0.03, 0.2)), lidIn = ease(seg(p, 0.25, 0.4)), lidOut = ease(seg(p, 0.75, 0.9)), melt = ease(seg(p, 0.35, 0.75));
    let inner = g(whole(F, 0.95), 180, 148, 0.85);
    const y = lerp(60, 128, drop), dr = melt * 16;
    inner += `<path d="M138 ${y} L180 ${y - 14} L222 ${y} L180 ${y + 14} Z" fill="#F7C94B" ${st(3)}/>`;
    if (melt > 0) inner += `<path d="M140 ${y + 1} C140 ${y + 6 + dr} 150 ${y + 6 + dr} 152 ${y + 6} M206 ${y + 6} C208 ${y + 8 + dr * 0.8} 218 ${y + 8 + dr * 0.8} 220 ${y + 1} M176 ${y + 13} C176 ${y + 13 + dr} 186 ${y + 13 + dr} 186 ${y + 10}" fill="#F7C94B" ${st(2.6)}/>`;
    let s = stoveVessel(STOVE_PAN, t, inner, { flame: 0.6 });
    const ly = lerp(lerp(20, 148, lidIn), 20, lidOut);
    if (lidIn > 0 && lidOut < 1) s += `<path d="M66 ${ly} C80 ${ly - 70} 280 ${ly - 70} 294 ${ly} Z" fill="#DDEFFC" opacity=".55" ${st()}/><rect x="166" y="${ly - 62}" width="28" height="14" rx="6" fill="${C.handle}" ${st(3)}/>` + (lidIn >= 1 && lidOut <= 0 ? steam(t, [80, 280], ly - 6, 0.9) : "");
    return s;
  },
});

// =====================================================================
// 8. Turning, basting, skin side down
// =====================================================================
LIB.add({
  cat: "stove", name: "tongsflip", dur: 3.4,
  foods: ["steak", "chicken", "porkchop", "lamb", "salmon", "fish", "tofu"],
  steps: ["Flip the chicken over and cook for an additional 6-9 minutes", "Turn the steak with tongs once a brown crust forms", "Flip the salmon and cook 2 more minutes", "Flip the tofu and cook the other side"],
  draw(t, F, key) {
    const crust = { salmon: "#D98A4A", fish: "#E0B070", tofu: "#D9A04A" }[key] || F.cooked;
    const G = { ...F, cooked: crust };
    const tofu = key === "tofu";
    const thing = (side) => tofu ? [-34, 34].map(x => `<rect x="${x - 28}" y="-16" width="56" height="32" rx="5" fill="${side ? crust : F.fill}" ${st(3.2)}/>${side ? `<path d="M${x - 18} -6 L${x + 18} -6" stroke="#B5733A" stroke-width="3" opacity=".6"/>` : ""}`).join("") : g(whole(G, side ? 1 : 0.15), 0, 0, 0.8);
    const tool = ["salmon", "fish", "tofu"].includes(key) ? "turner" : "tongs";
    return stoveVessel(STOVE_PAN, t, stovePool("#F2C84B", 90, 18, 152, 0.4), { flame: 0.8 }) + stoveFlip(t, 3.4, thing, { cy: 146, w: 52, h: 18, tool }) + sizzle(t, 180, 126, 130);
  },
});
LIB.add({
  cat: "stove", name: "bastebutter", dur: 2.8,
  foods: ["steak", "porkchop", "lamb", "chicken", "salmon"],
  steps: ["Tilt the pan and spoon the foaming butter over the steak", "Use a spoon to pick up butter and pour it over steak, aiming at light spots", "Baste with the melted butter, garlic, and thyme"],
  draw(t, F) {
    const p = t / 2.8;
    let inner = stovePool("#F7D27A", 34, 14, 162, 0.95, 252);
    for (let i = 0; i < 7; i++) inner += `<circle cx="${236 + (i * 13) % 34}" cy="${156 + (i * 7) % 12}" r="${3 + (i % 3)}" fill="#FFF8DC" ${st(1.4)}/>`;
    inner += g(whole(F, 1), 150, 146, 0.72);
    let s = stoveVessel(STOVE_PAN, t, inner, { flame: 0.7, tilt: 5 });
    const scoop = ease(seg(p, 0.05, 0.3)), over = ease(seg(p, 0.3, 0.55)), pourP = seg(p, 0.55, 0.8), back = ease(seg(p, 0.85, 1));
    let x = lerp(lerp(lerp(280, 252, scoop), 160, over), 280, back), y = lerp(lerp(lerp(120, 160, scoop), 112, over), 120, back);
    const r = pourP > 0 && back < 1 ? -40 * Math.sin(Math.min(1, pourP * 2) * Math.PI / 2) : 0;
    if (pourP > 0.2 && pourP < 1) s += FX.stream(x - 12, y + 2, x - 14, 138, "#F7D27A", 5);
    return s + stoveSpoonM(x, y, r, scoop > 0.8 && pourP < 0.8 ? "#F7D27A" : null);
  },
});
LIB.add({
  cat: "stove", name: "skinsidedown", dur: 4,
  foods: ["salmon", "fish", "chicken"],
  steps: ["Place the salmon skin side down and press gently with a spatula", "Place the thighs skin side down in a hot frying pan", "Cook skin side down until the skin is crisp and the flesh turns opaque most of the way up"],
  draw(t, F, key) {
    const p = t / 4, k = ease(seg(p, 0.2, 0.95)), press = p < 0.28 ? 1 - ease(seg(p, 0.2, 0.28)) : 0;
    const raw = key === "salmon" ? "#F07A50" : key === "fish" ? "#E8D8D0" : "#F4C9C0", done = key === "salmon" ? "#F6B896" : key === "fish" ? "#FFFFFF" : "#F8E8D8";
    const skin = key === "salmon" ? ["#9AA0A0", "#5A4A3A"] : key === "fish" ? ["#B8B8B0", "#8A6A3A"] : ["#F4D3B8", "#C98340"];
    const top = 112, bot = 150, h = (bot - top) * k * 0.7;
    let inner = stovePool("#F2C84B", 96, 20, 152, 0.5);
    inner += `<rect x="104" y="${top}" width="152" height="${bot - top}" rx="14" fill="${raw}" ${st(3.5)}/>`;
    inner += `<rect x="106" y="${bot - h - 2}" width="148" height="${h + 2}" fill="${done}"/>`;
    inner += `<path d="M118 ${top + 12} C150 ${top + 4} 200 ${top + 20} 240 ${top + 10}" fill="none" stroke="#fff" stroke-width="3" opacity=".6"/>`;
    inner += `<rect x="100" y="${bot - 2}" width="160" height="10" rx="5" fill="${stoveMix(skin[0], skin[1], k)}" ${st(3)}/>`;
    inner += `<rect x="104" y="${top}" width="152" height="${bot - top}" rx="14" fill="none" ${st(3.5)}/>`;
    let s = stoveVessel(STOVE_PAN, t, inner, { flame: 0.8 }) + sizzle(t, 180, 150, 180);
    if (press > 0) s += stoveTurner(176, top - 2, 0) + g(fist(), 170, top - 22, 1.1);
    return s;
  },
});
LIB.add({
  cat: "stove", name: "shrimpturnpink", dur: 3.6, foods: ["shrimp"],
  steps: ["Add the shrimp to the skillet and cook for 2 to 3 minutes until the shrimp turns pink", "Cook the shrimp until pink, flipping once", "Turn the shrimp and cook until opaque"],
  draw(t, F) {
    const p = t / 3.6, spots = stoveSpots(8, 180, 146, 78, 16), w = 1 / 8;
    let inner = stovePool("#F2C84B", 92, 20, 150, 0.4);
    let tongs = "";
    spots.forEach(([x, y, r], i) => {
      const f = seg(p, 0.1 + i * w * 0.8, 0.1 + i * w * 0.8 + 0.08), c = f >= 0.5 ? 1 : 0.15 + p * 0.2;
      inner += `<g transform="translate(${x} ${y - Math.sin(f * Math.PI) * 14}) scale(1 ${Math.max(0.1, Math.abs(Math.cos(f * Math.PI)))})">${g(whole({ ...F, fill: "#CFC4BC" }, c), 0, 0, 0.3, r % 60)}</g>`;
      if (f > 0 && f < 1) tongs = T.tongs(x + 10, y - 12 - Math.sin(f * Math.PI) * 14, -20, 0.05);
    });
    return stoveVessel(STOVE_PAN, t, inner, { flame: 0.8 }) + sizzle(t, 180, 128, 160) + tongs;
  },
});

// =====================================================================
// 9. Pasta pot
// =====================================================================
// Little pasta shapes for a pot or pan.
function stovePastaBit(key, x, y, r, s = 1, color = "#F2D27A") {
  const o = st(2.2);
  switch (key) {
    case "macaroni": return g(`<path d="M-8 6 C-10 -6 2 -10 8 -6" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M-8 6 C-10 -6 2 -10 8 -6" fill="none" stroke="${color}" stroke-width="4.5" stroke-linecap="round"/>`, x, y, s, r);
    case "ravioli": return g(`<rect x="-11" y="-11" width="22" height="22" rx="3" fill="${color}" stroke="${INK}" stroke-width="2.2" stroke-dasharray="3 2"/><rect x="-6" y="-6" width="12" height="12" rx="4" fill="${shade(color.startsWith("#") ? color : "#F2D27A")}" opacity=".5"/>`, x, y, s, r);
    case "tortellini": return g(`<path d="M-11 2 C-11 -12 11 -12 11 2 C6 0 4 6 0 6 C-4 6 -6 0 -11 2 Z" fill="${color}" ${o}/><circle cx="0" cy="-3" r="3" fill="none" stroke="${INK}" stroke-width="1.6"/>`, x, y, s, r);
    case "gnocchi": return g(`<ellipse rx="10" ry="7" fill="#F4E3B0" ${o}/><path d="M-5 -4 L-5 4 M0 -5 L0 5 M5 -4 L5 4" stroke="#D9C48A" stroke-width="1.6"/>`, x, y, s, r);
    case "noodles": case "ramen": case "ricenoodles": return g(`<path d="M-14 0 C-8 -8 0 8 6 -2 C10 -8 14 2 16 0" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M-14 0 C-8 -8 0 8 6 -2 C10 -8 14 2 16 0" fill="none" stroke="${color}" stroke-width="3.6" stroke-linecap="round"/>`, x, y, s, r);
    default: return g(`<path d="M-12 -5 L10 -7 L12 5 L-10 7 Z" fill="${color}" ${o}/><ellipse cx="11" cy="-1" rx="2" ry="5" fill="${shade("#F2D27A")}" ${st(1.4)}/><path d="M-6 -4 L-5 6 M0 -5 L1 6" stroke="#D9B04A" stroke-width="1.4"/>`, x, y, s, r);
  }
}
// Strands of spaghetti in a pan as a tangle.
function stoveTangle(cx, cy, rx, ry, color, n = 9, t = 0) {
  let s = "";
  for (let i = 0; i < n; i++) {
    const y = cy - ry + (i + 0.5) * (2 * ry / n), w = rx * Math.sqrt(1 - Math.pow((y - cy) / ry, 2)) * 0.95;
    const d = `M${cx - w} ${y} C${cx - w / 3} ${y - 10 + (i % 3) * 6} ${cx + w / 3} ${y + 10 - (i % 2) * 8} ${cx + w} ${y + Math.sin(i + t) * 3}`;
    s += `<path d="${d}" fill="none" stroke="${INK}" stroke-width="7.5" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round"/>`;
  }
  return s;
}
LIB.add({
  cat: "stove", name: "waterboil", dur: 3.8, foods: null,
  steps: ["Bring a large pot of water to a boil", "Turn the heat to high and bring the water to a boil", "Bring a large pot of salted water to a boil"],
  draw(t) {
    const p = t / 3.8, k = ease(clamp(p / 0.85)), G = STOVE_POT, d = 14;
    let inner = stoveSurf(G, C.water, d);
    const n = Math.round(lerp(2, 16, k));
    for (let i = 0; i < n; i++) { const q = (t * lerp(0.4, 1.4, k) + i / n) % 1, a = i * 2.39996, r = Math.sqrt((i + 0.5) / 16); inner += `<circle cx="${G.cx + Math.cos(a) * r * 96}" cy="${G.cy + d + Math.sin(a) * r * 18}" r="${(2 + q * 5) * lerp(0.6, 1.3, k)}" fill="#fff" ${st(1.8)} opacity="${1 - q * 0.5}"/>`; }
    return stoveVessel(G, t, inner, { flame: 1 }) + steam(t, [130, 180, 230], 90, 0.7).replace(/opacity="([\d.]+)"/g, (m, o) => `opacity="${o * k}"`);
  },
});
LIB.add({
  cat: "stove", name: "saltpotwater", dur: 2.4, foods: ["salt"],
  steps: ["Bring a large pot of water to a boil and add 1 tablespoon salt", "Salt the boiling water generously", "Bring a pot of salted water to a boil"],
  draw(t) {
    const G = STOVE_POT, d = 14;
    let inner = stoveSurf(G, C.water, d) + stovePops(t, 12, G.cx, G.cy + d, 96, 18, 1, 1.3, 1.3);
    let s = stoveVessel(G, t, inner, { flame: 1 }) + steam(t, [130, 230], 90, 0.7);
    s += FX.fall(t, 0.8, 12, 180, 26, 54, 108, (x, y) => `<rect x="${x}" y="${y}" width="4" height="4" fill="#fff" stroke="${INK}" stroke-width="1"/>`);
    return s + T.pinch(180 + Math.sin(t * 10) * 3, 34, 1, 180);
  },
});
LIB.add({
  cat: "stove", name: "pastaintopot", dur: 4,
  foods: ["spaghetti", "pasta", "macaroni", "noodles", "lasagnasheets", "ravioli", "tortellini", "gnocchi"],
  steps: ["Once your pasta water is boiling, add your pasta and cook following package instructions", "Add the spaghetti to the boiling water", "Cook lasagna noodles in boiling water for 8 to 10 minutes", "In a large pot of boiling salted water, add ravioli and cook until tender"],
  draw(t, F, key) {
    const p = t / 4, G = STOVE_POT, d = 14, sy = G.cy + d;
    let inner = "", over = "";
    if (key === "spaghetti") {
      const fan = ease(seg(p, 0.12, 0.35)), sink = ease(seg(p, 0.35, 0.95));
      for (let i = 0; i < 11; i++) {
        const a = (i - 5) * lerp(1.5, 7, fan) * (1 - sink * 0.3), L = lerp(110, 40, sink), bx = 180 + (i - 5) * 3;
        const tx = bx + Math.sin(a * Math.PI / 180) * L, ty = sy + 10 - Math.cos(a * Math.PI / 180) * L, bend = sink * (i % 2 ? 14 : -14);
        const dd = `M${bx} ${sy + 12} Q${(bx + tx) / 2 + bend} ${(sy + ty) / 2} ${tx} ${ty}`;
        inner += `<path d="${dd}" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="${dd}" fill="none" stroke="#F2D27A" stroke-width="2.8" stroke-linecap="round"/>`;
      }
      if (fan < 0.2) over += g(fist(), 180, sy + 10 - 100, 1.1);
      inner = stoveSurf(G, C.water, d) + inner;
    } else if (key === "lasagnasheets") {
      inner += stoveSurf(G, C.water, d);
      [0, 1, 2].forEach(i => { const q = ease(seg(p, 0.05 + i * 0.25, 0.3 + i * 0.25)); if (q <= 0) return; const x = 130 + i * 50, top = lerp(20, sy - 18, q); inner += `<path d="M${x - 18} ${top} L${x + 18} ${top} L${x + 18} ${top + 90} L${x - 18} ${top + 90} Z" fill="#F2DA8A" ${st(3)}/><path d="M${x - 18} ${top} q5 -5 9 0 q5 5 9 0 q5 -5 9 0 q5 5 9 0" fill="none" ${st(2.4)}/>`; if (q < 1) over += g(fist(), x, top - 8, 0.8); });
    } else {
      const sub = [];
      for (let i = 0; i < 14; i++) {
        const q = clamp(seg(p, 0.08, 0.6) * 1.6 - (i / 14) * 0.6);
        const [x, y] = stoveSpots(14, G.cx, sy + 2, 90, 14)[i];
        if (key === "noodles") continue;
        if (q >= 1) sub.push(stovePastaBit(key, x + Math.sin(t * 3 + i) * 2, y + 2, i * 40, 1.1));
        else if (q > 0) over += stovePastaBit(key, lerp(262, x, q), lerp(48, y, q * q), i * 40 + q * 200, 1.1);
      }
      if (key === "noodles") [150, 210].forEach((x, i) => { const q = ease(seg(p, 0.1 + i * 0.25, 0.35 + i * 0.25)); if (q > 0) sub.push(g(whole(F), x, lerp(40, sy + 6, q), lerp(0.4, 0.45, q))); });
      inner += sub.join("") + stoveSurf(G, C.water, d, 0.4);
      if (p < 0.62 && key !== "noodles") over += g(V.smallBowl(0, 0, 0.45, ""), 282, 50, 1, -55);
    }
    inner += stovePops(t, 10, G.cx, sy, 96, 18, 1, 1.2, 1.3);
    return stoveVessel(G, t, inner, { flame: 1 }) + over + steam(t, [120, 240], 90, 0.7);
  },
});
LIB.add({
  cat: "stove", name: "pastastir", dur: 2.6,
  foods: ["spaghetti", "pasta", "macaroni", "noodles"],
  steps: ["Stir the pasta so it doesn't stick", "Add pasta and cook, stirring, until al dente", "Stir occasionally so the noodles don't stick together"],
  draw(t, F, key) {
    const G = STOVE_POT, d = 14, sy = G.cy + d, a = t / 2.6 * Math.PI * 2;
    let inner = "";
    if (key === "spaghetti" || key === "noodles") for (let i = 0; i < 9; i++) { const b = a + i * 0.7, r = 30 + (i % 3) * 22; const dd = `M${180 + Math.cos(b) * r} ${sy + 2 + Math.sin(b) * r * 0.16} A${r} ${r * 0.16} 0 0 1 ${180 + Math.cos(b + 1.6) * r} ${sy + 2 + Math.sin(b + 1.6) * r * 0.16}`; inner += `<path d="${dd}" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="${dd}" fill="none" stroke="#F2D27A" stroke-width="3.4" stroke-linecap="round"/>`; }
    else for (let i = 0; i < 14; i++) { const b = a + i * 0.45, r = 20 + (i % 4) * 22; inner += stovePastaBit(key, 180 + Math.cos(b) * r, sy + 3 + Math.sin(b) * r * 0.16, b * 60, 1.05); }
    inner += stoveSurf(G, C.water, d, 0.38) + stovePops(t, 8, G.cx, sy, 96, 18, 1, 1.1, 1.2);
    inner += key === "spaghetti" ? T.tongs(180 + Math.cos(a) * 50, sy + 4 + Math.sin(a) * 8, Math.cos(a) * 10, 0.2) : T.spoon(180 + Math.cos(a) * 50, sy + 6 + Math.sin(a) * 8, Math.cos(a) * 12);
    return stoveVessel(G, t, inner, { flame: 0.9 }) + steam(t, [120, 240], 90, 0.7);
  },
});
LIB.add({
  cat: "stove", name: "pastacolander", dur: 3.4,
  foods: ["spaghetti", "pasta", "macaroni", "gnocchi", "potato"],
  steps: ["Drain the pasta in a colander", "Drain the potatoes and let them steam dry", "Drain the pasta, reserving 1 cup of the cooking water"],
  draw(t, F, key) {
    const p = t / 3.4, tip = ease(seg(p, 0.05, 0.3)) * (1 - ease(seg(p, 0.82, 0.98))), fill = ease(seg(p, 0.25, 0.8));
    let s = V.sink(0);
    let col = "";
    const bits = stoveSpots(12, 0, -14, 52, 9);
    bits.forEach(([x, y, r, i]) => { if (i / 12 < fill) col += key === "spaghetti" ? `<path d="M${x - 16} ${y} q8 -8 16 0 q8 8 16 0" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M${x - 16} ${y} q8 -8 16 0 q8 8 16 0" fill="none" stroke="#F2D27A" stroke-width="3.5" stroke-linecap="round"/>` : key === "potato" ? piece(F, "chunk", x, y, r, 1.2) : stovePastaBit(key, x, y, r, 1.1); });
    s += V.colander(170, 150, 1, col) + FX.drips(t, [140, 160, 180, 200], 176, 210, C.blue, 1.4);
    // The pot tipping over the colander, held by both handles.
    const r = lerp(0, 70, tip);
    s += g(`<path d="M-60 -40 L60 -40 L52 40 L-52 40 Z" fill="#fff" ${st()}/><path d="M-66 -40 L66 -40" ${st(5)}/><path d="M-60 -30 C-80 -30 -80 -10 -60 -12" fill="none" ${st(4)}/>${g(fist(), -76, -24, 0.8)}${g(fist(), 76, -24, 0.8)}<path d="M60 -30 C80 -30 80 -10 60 -12" fill="none" ${st(4)}/>`, 110, 76, 1, r);
    if (tip > 0.6 && p < 0.8) {
      s += FX.stream(150, 70, 172, 132, C.water, 12);
      for (let i = 0; i < 4; i++) { const q = (t * 1.6 + i / 4) % 1; s += key === "spaghetti" ? `<path d="M${156 + i * 4} ${lerp(70, 130, q)} q5 6 0 12" fill="none" stroke="#F2D27A" stroke-width="4" ${""}/>` : key === "potato" ? piece(F, "chunk", 158 + i * 6, lerp(70, 130, q), q * 300, 1) : stovePastaBit(key, 158 + i * 6, lerp(70, 130, q), q * 300, 1); }
    }
    return s + steam(t, [140, 180, 210], 120, 0.9) + steam(t + 0.5, [160, 200], 100, 0.9);
  },
});
const STOVE_SAUCES = { tomatosauce: "#D9402E", alfredo: "#FFF3DA", pestosauce: "#5E9A3A", bolognese: "#9C3A22", oil: "#F2D27A", cheesesauce: "#F7C94B" };
function stovePastaPan(t, dur, key, extra = 0) {
  const p = t / dur, sauce = STOVE_SAUCES[key] || "#D9402E";
  const pasta = stoveMix("#F2D27A", sauce, key === "oil" ? 0 : 0.35);
  let inner = stovePool(sauce, 100 + extra * 4, 26 + extra, 150, 1);
  if (key === "cheesesauce") stoveSpots(26, 180, 146, 84, 18).forEach(([x, y, r]) => { inner += stovePastaBit("macaroni", x, y, r, 1.2, "#F7D86A"); });
  else inner += stoveTangle(180, 146, 86, 20, pasta, 8, t * 2);
  if (key === "bolognese") stoveSpots(10, 180, 146, 76, 16).forEach(([x, y]) => { inner += `<circle cx="${x}" cy="${y}" r="5" fill="#6B2A16" ${st(1.8)}/>`; });
  if (key === "oil") stoveSpots(8, 180, 146, 76, 16).forEach(([x, y, r]) => { inner += `<ellipse cx="${x}" cy="${y}" rx="5" ry="3.5" fill="#F7E8B8" ${st(1.6)} transform="rotate(${r} ${x} ${y})"/>`; });
  if (key === "pestosauce") stoveSpots(8, 180, 146, 76, 16).forEach(([x, y]) => { inner += `<circle cx="${x}" cy="${y}" r="3" fill="#2F6E3A"/>`; });
  return [inner, pasta, sauce];
}
LIB.add({
  cat: "stove", name: "pastatoss", dur: 3,
  foods: ["tomatosauce", "alfredo", "pestosauce", "bolognese", "oil", "cheesesauce"],
  steps: ["Toss the pasta in the sauce with tongs until coated", "Add the drained pasta to the sauce and toss to combine", "Stir to coat the pasta in the sauce"],
  draw(t, F, key) {
    const p = t / 3, [inner, pasta] = stovePastaPan(t, 3, key), lift = Math.sin(p * Math.PI * 2);
    let s = stoveVessel(STOVE_PAN, t, inner, { flame: 0.5 });
    const ty = 140 - Math.max(0, lift) * 70, tx = 190 + Math.sin(p * Math.PI * 4) * 20;
    if (key === "cheesesauce") s += T.spoon(tx, ty + 6, 0) + (lift > 0.2 ? [-8, 0, 8].map(dx => stovePastaBit("macaroni", tx + dx, ty + 4 - Math.abs(dx) * 0.4, dx * 20, 1.1, "#F7D86A")).join("") : "");
    else {
      if (lift > 0.1) for (let i = 0; i < 4; i++) { const dd = `M${tx - 4 + i * 3} ${ty} C${tx - 16 + i * 10} ${ty + 30} ${tx + 10 - i * 8} ${ty + 50} ${tx - 20 + i * 14} 150`; s += `<path d="${dd}" fill="none" stroke="${INK}" stroke-width="7.5" stroke-linecap="round"/><path d="${dd}" fill="none" stroke="${pasta}" stroke-width="4" stroke-linecap="round"/>`; }
      s += T.tongs(tx, ty, -10, lift > 0.1 ? 0.05 : 0.5);
    }
    return s;
  },
});
LIB.add({
  cat: "stove", name: "pastawatersplash", dur: 3,
  foods: ["tomatosauce", "alfredo", "pestosauce", "bolognese"],
  steps: ["Add a splash of the reserved pasta water to loosen the sauce", "Add pasta into the sauce with about 1/2 cup of reserved pasta water", "Toss, adding pasta water as needed until glossy"],
  draw(t, F, key) {
    const p = t / 3, loose = ease(seg(p, 0.2, 0.6)), [inner] = stovePastaPan(t, 3, key, loose * 2);
    let s = stoveVessel(STOVE_PAN, t, inner, { flame: 0.5 });
    const tip = p < 0.1 ? ease(p / 0.1) : p < 0.4 ? 1 : 1 - ease(seg(p, 0.4, 0.48));
    const [cup, lx, ly] = stoveCup(254, 62, tip, "#E3ECEF", 0.7);
    if (tip > 0.85 && p < 0.42) s += FX.stream(lx, ly, 182, 146, "#E3ECEF", 7);
    if (p < 0.5) s += cup;
    if (loose > 0.6) s += FX.sparkle(t, 214, 134, 0.9) + FX.sparkle(t + 0.5, 140, 150, 0.7);
    if (p > 0.5) s += T.tongs(190 + Math.sin(p * Math.PI * 6) * 30, 142, -10, 0.3);
    return s + steam(t, [150, 210], 112, 0.5);
  },
});

// =====================================================================
// 10. Rice and grains
// =====================================================================
const stoveGrainBed = (F, cx, cy, rx, ry, n = 40, cooked = 0) => [...Array(n)].map((_, i) => { const a = i * 2.39996, r = Math.sqrt((i + 0.5) / n), x = cx + Math.cos(a) * r * rx, y = cy + Math.sin(a) * r * ry; return `<ellipse cx="${x}" cy="${y}" rx="${(F.round ? 3.6 : 5) * (1 + cooked * 0.2)}" ry="${(F.round ? 3.6 : 2.8) * (1 + cooked * 0.2)}" fill="${F.inner}" stroke="${INK}" stroke-width="1.3" transform="rotate(${i * 40} ${x} ${y})"/>`; }).join("");
LIB.add({
  cat: "stove", name: "riceintopot", dur: 3.2,
  foods: ["whiterice", "brownrice", "quinoa", "lentils"],
  steps: ["Add the rice to the boiling water", "Stir in the quinoa and bring back to a boil", "Add the lentils to the pot"],
  draw(t, F) {
    const p = t / 3.2, G = STOVE_POT, d = 14, sy = G.cy + d, pile = ease(seg(p, 0.2, 0.8));
    let inner = stoveGrainBed(F, 180, sy + 4, 30 + pile * 60, 4 + pile * 10, Math.round(10 + pile * 34)) + stoveSurf(G, C.water, d, 0.55) + stovePops(t, 8, G.cx, sy, 96, 18, 1, 1, 1);
    let s = stoveVessel(G, t, inner, { flame: 0.9 });
    const tip = ease(seg(p, 0, 0.12)) * (1 - ease(seg(p, 0.78, 0.9)));
    const [cup, lx, ly] = stoveCup(250, 46, tip, F.inner, 0.7);
    if (tip > 0.8) s += FX.fall(t, 0.5, 14, lx - 4, 20, ly, sy, (x, y) => `<ellipse cx="${x}" cy="${y}" rx="${F.round ? 3.5 : 4.5}" ry="${F.round ? 3.5 : 2.6}" fill="${F.inner}" stroke="${INK}" stroke-width="1.2"/>`);
    return s + (p < 0.92 ? cup : "") + steam(t, [130, 230], 88, 0.6);
  },
});
LIB.add({
  cat: "stove", name: "ricecoversimmer", dur: 4,
  foods: ["whiterice", "brownrice", "quinoa"],
  steps: ["Reduce heat to low, cover, and simmer for 18 minutes", "Cover the pot and cook until the water is absorbed", "Cover with a lid and simmer on low"],
  draw(t, F) {
    const p = t / 4, G = STOVE_POT, d = 16, lid = ease(seg(p, 0.05, 0.3)), low = ease(seg(p, 0.3, 0.5));
    let inner = stoveGrainBed(F, 180, G.cy + d + 4, 90, 14, 44) + stoveSurf(G, C.water, d, 0.5);
    let s = stoveVessel(G, t, inner, { flame: lerp(1, 0.35, low) });
    const jig = lid >= 1 ? Math.sin(t * 9) * 1.2 : 0;
    s += T.lid(180, lerp(50, 100, lid) + jig, 0, 128);
    if (lid >= 1) s += steam(t, [62, 298], 96, 0.8);
    return s;
  },
});
LIB.add({
  cat: "stove", name: "fluffgrains", dur: 2.8,
  foods: ["whiterice", "brownrice", "quinoa", "couscous"],
  steps: ["Fluff the rice with a fork", "Remove from heat, let stand 5 minutes, then fluff with a fork", "Fluff the couscous with a fork before serving"],
  draw(t, F) {
    const p = t / 2.8, G = STOVE_POT, d = 10, fx = 180 + Math.sin(p * Math.PI * 2) * 70;
    let inner = stoveSurf(G, F.fill, d) + stoveGrainBed(F, 180, G.cy + d, 100, 18, 70, 1);
    for (let i = 0; i < 6; i++) { const q = (t * 2 + i / 6) % 1; inner += `<ellipse cx="${fx - 20 + i * 8}" cy="${G.cy + d - 4 - Math.sin(q * Math.PI) * 18}" rx="4.6" ry="2.8" fill="${F.inner}" stroke="${INK}" stroke-width="1.3" transform="rotate(${i * 50 + q * 200} ${fx - 20 + i * 8} ${G.cy + d - 4})"/>`; }
    return stoveVessel(G, t, inner, { flame: 0 }) + steam(t, [150, 210], 90, 0.4) + T.fork(fx, G.cy + d + 6, 160 + Math.cos(p * Math.PI * 2) * 10) + g(fist(), fx + Math.sin((160) * Math.PI / 180) * -100 * 0, G.cy + d - 100, 0);
  },
});
LIB.add({
  cat: "stove", name: "risottoladle", dur: 4.4, foods: ["whiterice"],
  steps: ["Add a ladle of hot broth and stir until it is absorbed", "Add about 1.5 cups stock, stir every now and then until mostly absorbed", "Keep adding broth one ladle at a time, stirring often"],
  draw(t, F) {
    const p = t / 4.4, pour = seg(p, 0.08, 0.3), soak = ease(seg(p, 0.3, 0.92));
    let inner = stovePool("#F4EBD0", 100, 26, 150);
    inner += stovePool("#E8B46A", lerp(0, 90, ease(pour)) * (1 - soak), lerp(0, 22, ease(pour)) * (1 - soak), 150, 0.7);
    inner += stoveGrainBed({ inner: "#FFFDF4" }, 180, 148, 92, 22, 60, 0.6);
    let s = stoveVessel(STOVE_PAN, t, inner, { flame: 0.5 });
    if (p < 0.34) { const tilt = ease(seg(p, 0.06, 0.12)); s += T.ladle(232, 92, -tilt * 70, "#E8B46A") + (tilt > 0.9 && pour < 1 ? FX.stream(214, 100, 196, 146, "#E8B46A", 6) : ""); }
    return s + (p > 0.32 ? stoveStir(t, 4.4, 180, 148, 54, 10, 2) : "") + steam(t, [150, 210], 112, 0.4);
  },
});
LIB.add({
  cat: "stove", name: "toastrice", dur: 3.2, foods: ["whiterice"],
  steps: ["Add rice and stir for 1 minute until semi translucent", "Toast the rice in the oil, stirring, until the edges turn translucent", "Cook, stirring and tossing, until rice is pale golden and toasted"],
  draw(t, F) {
    const p = t / 3.2, k = ease(clamp(p / 0.85));
    let inner = stovePool("#F2C84B", 98, 24, 150, 0.35);
    inner += stoveGrainBed({ inner: stoveMix("#FFFFFF", "#F1E2B0", k) }, 180 + Math.sin(t * 3) * 3, 148, 90, 21, 64);
    return stoveVessel(STOVE_PAN, t, inner, { flame: 0.6 }) + sizzle(t, 180, 130, 150) + stoveStir(t, 3.2, 180, 148, 56, 10, 1);
  },
});
LIB.add({
  cat: "stove", name: "porridgestir", dur: 3.2, foods: ["oats", "polenta"],
  steps: ["Cook the oats, stirring often, until thick and creamy", "Whisk the polenta into the boiling water and stir until thick", "Simmer, stirring, until the porridge thickens"],
  draw(t, F, key) {
    const G = STOVE_SAUCE, d = 10, c = key === "oats" ? "#E8D4A8" : "#F2C84B";
    let inner = stoveSurf(G, c, d);
    if (key === "oats") stoveSpots(16, G.cx, G.cy + d, 76, 12).forEach(([x, y, r]) => { inner += `<ellipse cx="${x}" cy="${y}" rx="4.5" ry="3" fill="#F6E8C4" ${st(1.3)} transform="rotate(${r} ${x} ${y})"/>`; });
    for (let i = 0; i < 3; i++) { const q = (t * 0.5 + i / 3) % 1, x = G.cx - 40 + i * 40, y = G.cy + d + (i % 2) * 6; inner += q < 0.75 ? `<circle cx="${x}" cy="${y - q * 6}" r="${4 + q * 10}" fill="${c}" stroke="${stoveDark(c, 0.7)}" stroke-width="2.4"/>` : `<ellipse cx="${x}" cy="${y}" rx="${10 + (q - 0.75) * 30}" ry="${4}" fill="none" stroke="${stoveDark(c, 0.7)}" stroke-width="2.4" opacity="${(1 - q) * 4}"/>`; }
    inner += stoveStir(t, 3.2, G.cx, G.cy + d + 4, 50, 8, 1);
    return stoveVessel(G, t, inner, { flame: 0.5 }) + steam(t, [130, 190], 96, 0.4);
  },
});

// =====================================================================
// 11. Green vegetables: blanch, ice bath, steam, wilt
// =====================================================================
const stoveBright = (F, k) => ({ ...F, fill: stoveMix(stoveMix(F.fill, "#8A9A70", 0.3), stoveMix(F.fill, "#3DCB3A", 0.35), k), inner: stoveMix(stoveMix(F.inner, "#9AA880", 0.3), stoveMix(F.inner, "#7FE060", 0.3), k) });
LIB.add({
  cat: "stove", name: "blanchveg", dur: 3.4,
  foods: ["greenbeans", "broccoli", "asparagus", "peas", "brusselsprouts", "carrot", "cauliflower"],
  steps: ["Blanch the green beans in boiling salted water for 2 minutes", "Drop the broccoli into boiling water until bright green", "Boil the peas for 1 minute"],
  draw(t, F, key) {
    const p = t / 3.4, G = STOVE_POT, d = 14, sy = G.cy + d, down = ease(seg(p, 0.05, 0.35)), k = ease(seg(p, 0.35, 0.8));
    // Only green vegetables turn bright green; carrots and cauliflower stay as they are.
    const pale = key === "carrot" || key === "cauliflower", FF = pale ? F : stoveBright(F, k);
    let inner = stoveSurf(G, C.water, d, 0.9);
    if (down >= 1) stoveSpots(10, 180, sy + 2, 86, 12).forEach(([x, y, r, i]) => { inner += stoveBit(FF, x + Math.sin(t * 3 + i) * 3, y, r, 1, 1.1) + `<path d="M${x - 12} ${y + 7} q6 -3 12 0 q6 3 12 0" fill="none" stroke="#fff" stroke-width="2.4" opacity=".8"/>`; });
    inner += stovePops(t, 10, G.cx, sy, 96, 18, 1, 1.1, 1.3);
    let s = stoveVessel(G, t, inner, { flame: 1 });
    if (down < 1) { const y = lerp(40, sy, down); s += [-14, 0, 14].map((dx, i) => stoveBit(pale ? F : stoveBright(F, 0), 180 + dx, y - 10 - (i % 2) * 6, i * 50, 1, 1)).join("") + T.spider(180, y, -20); }
    return s + steam(t, [130, 230], 90, 0.7);
  },
});
LIB.add({
  cat: "stove", name: "icebath", dur: 3.4,
  foods: ["greenbeans", "broccoli", "asparagus", "peas", "egg", "carrot", "cauliflower"],
  steps: ["Transfer to a bowl of ice water to stop the cooking", "Plunge the green beans into an ice bath", "Move the eggs to an ice bath to cool"],
  draw(t, F, key) {
    const p = t / 3.4, mv = ease(seg(p, 0.1, 0.6)), egg = key === "egg";
    const FF = egg || key === "carrot" || key === "cauliflower" ? F : stoveBright(F, 1);
    const pot = g(stoveVessel(STOVE_POT, t, stoveSurf(STOVE_POT, C.water, 14) + stovePops(t, 8, 180, 112, 90, 16, 1, 1, 1.3), { flame: 1 }), -10, 70, 0.55);
    let bowlIn = V.bowlFill(C.water, 140) + `<g transform="translate(180 132) scale(0.9)">${whole(FOODS.ice)}</g>`;
    if (mv >= 1) bowlIn += [-30, 0, 30].map((dx, i) => egg ? g(whole(F), 180 + dx, 150, 0.3) : stoveBit(FF, 180 + dx * 1.4, 148 + (i % 2) * 6, i * 50, 1, 1.3)).join("");
    let s = pot + g(V.bowl(bowlIn), 170, 92, 0.55) + steam(t, [70, 110], 96, 0.7);
    const x = lerp(92, 268, mv), y = lerp(118, 158, mv) - Math.sin(mv * Math.PI) * 70;
    if (p < 0.75) s += (mv < 1 ? [-12, 4, 18].map((dx, i) => egg ? g(whole(F), x + dx * 0.7, y - 10, 0.22) : stoveBit(FF, x + dx, y - 8 - (i % 2) * 5, i * 50, 1, 0.9)).join("") : "") + T.spider(x, y, -20);
    return s + FX.cold(300, 70, 0.8);
  },
});
LIB.add({
  cat: "stove", name: "steamerbasket", dur: 3.8,
  foods: ["broccoli", "carrot", "cauliflower", "greenbeans", "dumplings"],
  steps: ["Steam the broccoli in a covered steamer basket for 5 minutes", "Place the dumplings in a steamer and steam until cooked through", "Set a steamer basket over simmering water, add the carrots, and cover"],
  draw(t, F, key) {
    const p = t / 3.8, G = STOVE_POT, lidOn = ease(seg(p, 0.05, 0.22)), lidOff = ease(seg(p, 0.75, 0.9)), k = ease(seg(p, 0.25, 0.75));
    let inner = `<ellipse cx="180" cy="${G.cy + 10}" rx="104" ry="22" fill="#C9CED2" ${st(3)}/>` + [...Array(10)].map((_, i) => `<circle cx="${100 + i * 18}" cy="${G.cy + 10 + Math.sin(i) * 8}" r="2.6" fill="#8A949C"/>`).join("");
    stoveSpots(key === "dumplings" ? 6 : 11, 180, G.cy + 8, 80, 14).forEach(([x, y, r, i]) => {
      if (key === "dumplings") inner += g(`<path d="M-18 6 C-18 -14 18 -14 18 6 Z" fill="${stoveMix("#F7F1E3", "#FFFFFF", k)}" ${st(2.6)}/><path d="M-10 -6 l3 6 M-2 -9 l1 7 M6 -8 l-1 7" ${st(1.8)}/>`, x, y, 1);
      else inner += stoveBit(key === "carrot" || key === "cauliflower" ? F : stoveBright(F, k), x, y, r, 1, 1.15);
    });
    let s = stoveVessel(G, t, inner, { flame: 0.7 });
    const ly = lerp(lerp(50, 100, lidOn), 50, lidOff);
    if (lidOn > 0 && lidOff < 1) s += T.lid(180, ly, 0, 128) + (lidOn >= 1 && lidOff <= 0 ? steam(t, [62, 298], 96, 0.9) : "");
    return s + (lidOff > 0 ? steam(t, [140, 190, 230], 94, 0.9) : "");
  },
});
LIB.add({
  cat: "stove", name: "wiltgreens", dur: 3.8,
  foods: ["spinach", "kale", "greens", "cabbage"],
  steps: ["Add the spinach and cook, tossing, until just wilted", "Stir in the kale and cook until it wilts", "Add the greens a handful at a time and let them wilt down"],
  draw(t, F, key) {
    const p = t / 3.8, k = ease(clamp(p / 0.85)), h = lerp(80, 10, k);
    let inner = "";
    for (let i = 0; i < 34; i++) {
      const a = i * 2.39996, r = Math.sqrt((i + 0.5) / 34), x = 180 + Math.cos(a) * r * 88, base = 148 + Math.sin(a) * r * 18;
      const y = base - h * (1 - r * r) * ((i % 5) / 5 + 0.6) + Math.sin(t * 4 + i) * 1.5 * (1 - k);
      const c = stoveMix(F.fill, stoveDark(F.fill, 0.7), k), s = lerp(1, 0.75, k);
      if (key === "cabbage") inner += `<path transform="translate(${x} ${y}) rotate(${i * 37}) scale(${s})" d="M-14 -2 C-6 -6 6 2 14 -2 L14 2 C6 6 -6 -2 -14 3 Z" fill="${stoveMix("#C8E39A", "#A9C86A", k)}" ${st(1.6)}/>`;
      else if (key === "kale") inner += `<path transform="translate(${x} ${y}) rotate(${i * 37}) scale(${s})" d="M-14 0 L-10 -6 L-6 -2 L-2 -8 L2 -2 L6 -8 L10 -2 L14 -4 L12 4 C4 8 -6 8 -14 0 Z" fill="${c}" ${st(1.8)}/>`;
      else inner += `<path transform="translate(${x} ${y}) rotate(${i * 37}) scale(${s})" d="M-14 0 C-8 -10 8 -10 14 0 C8 9 -8 9 -14 0 Z" fill="${c}" ${st(1.8)}/><path transform="translate(${x} ${y}) rotate(${i * 37}) scale(${s})" d="M-10 0 L10 0" stroke="${stoveDark(c, 0.8)}" stroke-width="1.4"/>`;
    }
    let s = stoveVessel(STOVE_PAN, t, inner, { flame: 0.6 }) + steam(t, [140, 200, 240], 110 - h * 0.5, 0.6);
    const sw = Math.sin(t / 3.8 * Math.PI * 4);
    return s + T.tongs(200 + sw * 40, 146 - h * 0.6, -14 + sw * 6, 0.25);
  },
});

// =====================================================================
// 12. Onions, garlic, spices, dry toasting
// =====================================================================
LIB.add({
  cat: "stove", name: "onionscaramelize", dur: 5, foods: ["onion", "redonion"],
  steps: ["Cook the onions low and slow, stirring occasionally, until deep golden brown, 30 to 40 minutes", "Caramelize the onions", "Cook until deep golden brown, stirring occasionally"],
  draw(t, F, key) {
    const p = t / 5, k = ease(clamp(p / 0.92));
    const stops = key === "redonion" ? ["#E9CFE0", "#C98A9A", "#9A5A50", "#6B3A30"] : ["#F4E6F1", "#F2D9A0", "#C98340", "#7A4520"];
    const c = k < 0.33 ? stoveMix(stops[0], stops[1], k * 3) : k < 0.66 ? stoveMix(stops[1], stops[2], (k - 0.33) * 3) : stoveMix(stops[2], stops[3], (k - 0.66) * 3);
    let inner = stovePool("#F2C84B", 92, 22, 150, 0.25);
    stoveSpots(26, 180, 147, lerp(84, 70, k), lerp(19, 15, k)).forEach(([x, y, r]) => { inner += g(`<path d="M-14 4 C-12 -8 12 -8 14 4" fill="none" stroke="${INK}" stroke-width="${lerp(8, 7, k)}" stroke-linecap="round"/><path d="M-14 4 C-12 -8 12 -8 14 4" fill="none" stroke="${c}" stroke-width="${lerp(4.5, 3.6, k)}" stroke-linecap="round"/>`, x, y, lerp(1.1, 0.9, k), r); });
    let s = stoveVessel(STOVE_PAN, t, inner, { flame: 0.45 }) + T.timer(310, 52, p, 0.9);
    const stirring = (p % 0.5) > 0.3;
    return s + (stirring ? stoveStir((p % 0.5 - 0.3) / 0.2 * 2, 2, 180, 148, 50, 10, 1) : T.spoon(70, 210, -70, false).replace(/<g transform="translate\(70 210\)/, '<g transform="translate(-200 -200)"')) + stoveAroma(t, [150, 220], 112, "#C9874A", k);
  },
});
LIB.add({
  cat: "stove", name: "sweatveg", dur: 3.4, foods: ["onion", "leek", "celery", "carrot"],
  steps: ["Cook for 10 minutes until softened and sweet; they should not brown", "Saute the onion until soft and translucent", "Sweat the leeks over low heat until soft"],
  draw(t, F, key) {
    const p = t / 3.4, k = ease(clamp(p / 0.85));
    const pairs = { onion: ["#F4E6F1", "#F2E8C4"], leek: ["#E9F2C7", "#D4E8A0"], celery: ["#C9E6A2", "#A9D57A"], carrot: ["#F6B27A", "#F39448"] }[key];
    let inner = stovePool("#FFE08A", 96, 22, 150, 0.45);
    stoveSpots(24, 180, 147, 82, 18).forEach(([x, y, r, i]) => {
      const c = stoveMix(pairs[0], pairs[1], k);
      inner += key === "leek" ? g(`<ellipse rx="10" ry="7" fill="${c}" ${st(2.2)}/><ellipse rx="5" ry="3.5" fill="none" stroke="#B5C47A" stroke-width="1.6"/>`, x, y, 1, r % 40)
        : g(`<rect x="-7" y="-6" width="14" height="12" rx="${3 + k * 2}" fill="${c}" ${st(2.2)}/>${i % 2 ? `<path d="M-4 -3 l4 -1" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity="${k}"/>` : ""}`, x, y, 1, (r % 50) - 25);
    });
    return stoveVessel(STOVE_PAN, t, inner, { flame: 0.35 }) + stoveStir(t, 3.4, 180, 148, 50, 10, 1) + steam(t, [150, 210], 112, 0.4);
  },
});
LIB.add({
  cat: "stove", name: "garlicsizzle", dur: 2.6, foods: ["garlic", "ginger", "chile", "scallion"],
  steps: ["Add garlic and saute for 30 seconds until fragrant", "When they sizzle, add ginger garlic and saute for 30 seconds", "Add the chile and cook until aromatic"],
  draw(t, F, key) {
    const p = t / 2.6, drop = seg(p, 0, 0.3), k = ease(seg(p, 0.3, 0.9));
    let inner = stovePool("#F2C84B", 92, 22, 150, 0.6);
    stoveSpots(26, 180, 147, 70, 15).forEach(([x, y, r, i]) => {
      const q = clamp(drop * 1.6 - (i / 26) * 0.6); if (q <= 0) return;
      const yy = lerp(60, y, ease(q));
      if (key === "chile") inner += `<g transform="translate(${x} ${yy})"><circle r="6" fill="#E8503C" ${st(2)}/><circle r="2.4" fill="#F7D27A"/></g>`;
      else if (key === "scallion") inner += `<g transform="translate(${x} ${yy})"><circle r="5.5" fill="#6DB04A" ${st(2)}/><circle r="2.4" fill="#E9F2C7"/></g>`;
      else inner += `<rect x="${x - 3.5}" y="${yy - 3}" width="7" height="6" rx="1.5" fill="${stoveMix(key === "ginger" ? "#F4E0A8" : "#FFF3C8", "#E8B45A", k)}" stroke="${INK}" stroke-width="1.6"/>`;
      if (q >= 1 && i % 3 === 0) inner += `<circle cx="${x + 5}" cy="${y - 3}" r="${2 + ((t * 3 + i) % 1) * 3}" fill="none" stroke="#fff" stroke-width="1.6" opacity="${1 - ((t * 3 + i) % 1)}"/>`;
    });
    let s = stoveVessel(STOVE_PAN, t, inner, { flame: 0.6 }) + (drop > 0.5 ? sizzle(t, 180, 132, 150) : "");
    return s + stoveAroma(t, [140, 200, 240], 118, "#C9874A", k) + (p > 0.35 ? stoveTurner(200 + Math.sin(t * 4) * 40, 150, -18) : T.pinch(180, 50, 1, 180));
  },
});
LIB.add({
  cat: "stove", name: "spicebloom", dur: 2.8, foods: ["cumin", "paprika", "spices", "mustardseeds", "curryleaves"],
  steps: ["Add cumin, fry for a minute", "Add the spices and stir for 30 seconds until fragrant", "Add mustard seeds and let them splutter", "Add curry leaves; the leaves will turn crisp"],
  draw(t, F, key) {
    const p = t / 2.8, drop = seg(p, 0.05, 0.3), k = ease(seg(p, 0.25, 0.8));
    const powder = key === "paprika" || key === "spices";
    const oil = powder ? stoveMix("#F2C84B", F.inner, k * 0.75) : "#F2C84B";
    let inner = stovePool(oil, 70, 18, 150, 0.8);
    if (powder && drop > 0) inner += `<ellipse cx="180" cy="148" rx="${30 * drop}" ry="${8 * drop}" fill="${F.inner}" opacity="${1 - k * 0.8}"/>`;
    if (!powder) stoveSpots(key === "curryleaves" ? 9 : 26, 180, 148, 60, 14).forEach(([x, y, r, i]) => {
      const q = clamp(drop * 1.6 - (i / 26) * 0.6); if (q <= 0) return;
      const hop = q >= 1 && key !== "curryleaves" ? Math.max(0, Math.sin(t * 9 + i * 1.7)) * 10 * k : 0;
      const yy = lerp(60, y, ease(q)) - hop;
      if (key === "curryleaves") inner += `<path transform="translate(${x} ${yy}) rotate(${r})" d="M-12 0 C-6 -8 6 -8 12 0 C6 8 -6 8 -12 0 Z" fill="${stoveMix(F.fill, "#1E4A26", k)}" ${st(2)}/>`;
      else if (key === "mustardseeds") inner += `<circle cx="${x}" cy="${yy}" r="3" fill="#3B2A1E" ${st(1.2)}/>`;
      else inner += `<ellipse cx="${x}" cy="${yy}" rx="4" ry="2" fill="${stoveMix("#B58A4A", "#7A5530", k)}" stroke="${INK}" stroke-width="1.2" transform="rotate(${r} ${x} ${yy})"/>`;
    });
    inner += stovePops(t, 6, 180, 150, 60, 14, k, 1, 1.4);
    let s = stoveVessel(STOVE_PAN, t, inner, { flame: 0.6 }) + sizzle(t, 180, 132, 120);
    const tip = ease(seg(p, 0, 0.08)) * (1 - ease(seg(p, 0.3, 0.38)));
    if (p < 0.4) s += T.measuringSpoon(214, 70, 120 * tip, F.inner);
    if (powder && drop > 0 && drop < 1) s += FX.fall(t, 0.4, 8, 186, 20, 76, 146, (x, y) => `<circle cx="${x}" cy="${y}" r="2.6" fill="${F.inner}"/>`);
    return s + stoveAroma(t, [140, 210], 118, F.inner || "#C9874A", k);
  },
});
LIB.add({
  cat: "stove", name: "drypantoast", dur: 2.6, foods: ["nuts", "sesame", "pinenuts", "cumin", "panko"],
  steps: ["Toast the nuts in a dry skillet, shaking the pan, until golden and fragrant", "Toast spices lightly in a dry skillet over medium high heat", "Toast the sesame seeds until golden", "Toast the panko in a dry pan until golden"],
  draw(t, F, key) {
    const p = t / 2.6, k = ease(clamp(p / 0.85)), shakeX = Math.sin(t * 9) * 6;
    const raw = { nuts: "#E8C48A", sesame: "#F6EBD3", pinenuts: "#F4E8C4", cumin: "#C9A26B", panko: "#FBF1D4" }[key];
    const done = { nuts: "#B5733A", sesame: "#D9A55B", pinenuts: "#D9A55B", cumin: "#8A6A3A", panko: "#D99A4A" }[key];
    const c = stoveMix(raw, done, k);
    let inner = "";
    stoveSpots(key === "nuts" ? 12 : 30, 180, 147, 80, 17).forEach(([x, y, r, i]) => {
      const hop = Math.max(0, Math.sin(t * 9 + i * 1.3)) * 8;
      const yy = y - hop;
      if (key === "nuts") inner += `<g transform="translate(${x} ${yy}) rotate(${r})"><ellipse rx="12" ry="8" fill="${c}" ${st(2.4)}/><path d="M-6 -2 C-2 2 2 2 6 -2" fill="none" stroke="${stoveDark(c, 0.75)}" stroke-width="1.8"/></g>`;
      else if (key === "panko") inner += `<path transform="translate(${x} ${yy}) rotate(${r})" d="M-6 -3 L4 -5 L6 2 L-3 5 Z" fill="${c}" ${st(1.4)}/>`;
      else if (key === "pinenuts") inner += `<path transform="translate(${x} ${yy}) rotate(${r})" d="M0 -6 C5 -2 4 6 0 6 C-4 6 -5 -2 0 -6 Z" fill="${c}" ${st(1.6)}/>`;
      else inner += `<ellipse cx="${x}" cy="${yy}" rx="${key === "sesame" ? 3.4 : 4.4}" ry="${key === "sesame" ? 2.2 : 2}" fill="${c}" stroke="${INK}" stroke-width="1.2" transform="rotate(${r} ${x} ${yy})"/>`;
    });
    return `<g transform="translate(${shakeX} 0)">${stoveVessel(STOVE_PAN, t, inner, { flame: 0.6 })}</g>`.replace(/<g transform="translate\([^)]*\)">(<path d="M\d+ 222)/, "$1") + FX.shake(180 + shakeX, 120, 4) + stoveAroma(t, [150, 220], 112, "#C9874A", k);
  },
});

// =====================================================================
// 13. Roux, white sauce, cheese sauce, brown butter, warm milk, chocolate
// =====================================================================
LIB.add({
  cat: "stove", name: "makeroux", dur: 4.4, foods: null,
  steps: ["Melt the butter, then whisk in the flour to make a paste", "Add in 3 tablespoons flour and stir to make a paste", "Cook the roux, whisking, for 1 to 2 minutes"],
  draw(t) {
    const p = t / 4.4, G = STOVE_SAUCE, d = 14, m = ease(seg(p, 0, 0.25)), fl = seg(p, 0.25, 0.45), mix = ease(seg(p, 0.45, 0.95));
    const c = mix > 0 ? stoveMix("#F4E7C0", "#E2C27A", mix) : "#FFE08A";
    let inner = stoveSurf(G, c, d, lerp(0.4, 1, m));
    if (m < 1) inner += g(whole(FOODS.butter), G.cx, G.cy + d - 8, 0.4 * (1 - m) + 0.01);
    if (fl > 0 && mix < 1) inner += `<path d="M${G.cx - 40 * fl} ${G.cy + d + 4} C${G.cx - 30} ${G.cy + d - 14 * fl} ${G.cx + 30} ${G.cy + d - 14 * fl} ${G.cx + 40 * fl} ${G.cy + d + 4} Z" fill="#FFFFFF" stroke="#D8D2C4" stroke-width="2" opacity="${1 - mix}"/>`;
    if (mix > 0) inner += stovePops(t, 10, G.cx, G.cy + d, 70, 12, mix, 0.8, 1.2);
    if (mix > 0) inner += T.whisk(G.cx + Math.sin(t * 6) * 40, G.cy + d + 6, Math.sin(t * 6) * 14);
    let s = stoveVessel(G, t, inner, { flame: 0.5 });
    if (p > 0.2 && p < 0.47) { const tip = ease(seg(p, 0.2, 0.26)); const [cup, lx, ly] = stoveCup(250, 40, tip, "#FFFFFF", 0.6); s += cup + (tip > 0.8 ? FX.fall(t, 0.5, 10, lx, 20, ly, G.cy + d, (x, y) => `<rect x="${x}" y="${y}" width="4" height="4" fill="#fff" stroke="${INK}" stroke-width="1"/>`) : ""); }
    return s;
  },
});
LIB.add({
  cat: "stove", name: "milkintoroux", dur: 4, foods: ["milk", "broth", "cream"],
  steps: ["Gradually whisk in the milk until smooth and thickened", "Slowly pour the mixture into the pot, whisking constantly until fully incorporated", "Gradually add 400ml water to the pan, stirring constantly", "Whisk in the broth and cook until the gravy thickens"],
  draw(t, F, key) {
    const p = t / 4, G = STOVE_SAUCE, pour = ease(seg(p, 0.05, 0.5)), smooth = ease(seg(p, 0.3, 0.9));
    const final = key === "broth" ? "#D9A762" : key === "cream" ? "#FFF6E3" : "#FBF3DE";
    const d = lerp(24, 10, pour);
    let inner = stoveSurf(G, stoveMix("#E8CC88", final, smooth), d);
    stoveSpots(12, G.cx, G.cy + d, 66, 10).forEach(([x, y, r, i]) => { inner += `<circle cx="${x}" cy="${y}" r="${5 - (i % 3)}" fill="#E2C27A" ${st(1.8)} opacity="${1 - smooth}"/>`; });
    inner += T.whisk(G.cx + Math.sin(t * 7) * 44, G.cy + d + 6, Math.sin(t * 7) * 14);
    let s = stoveVessel(G, t, inner, { flame: 0.5 });
    const tip = p < 0.05 ? ease(p / 0.05) : p < 0.5 ? 1 : 1 - ease(seg(p, 0.5, 0.58));
    const [cup, lx, ly] = stoveCup(266, 36, tip, F.liquid, 0.8);
    if (tip > 0.85 && p < 0.5) s += FX.stream(lx, ly, G.cx + 20, G.cy + d, F.liquid, 6);
    if (p < 0.6) s += cup;
    return s + (smooth > 0.8 ? FX.sparkle(t, 210, 104, 0.8) : "");
  },
});
LIB.add({
  cat: "stove", name: "cheeseintosauce", dur: 3.6, foods: ["cheese", "parmesan", "creamcheese", "mozzarella"],
  steps: ["Add the cheese a handful at a time, stirring until smooth before adding more", "Remove from heat, stir in cheeses until well mixed", "Stir until the cheese has melted and the sauce is smooth"],
  draw(t, F, key) {
    const p = t / 3.6, G = STOVE_SAUCE, d = 10, drop = seg(p, 0.05, 0.4), melt = ease(seg(p, 0.35, 0.85));
    const final = { cheese: "#F7C94B", parmesan: "#F6E7B8", creamcheese: "#FFFBF0", mozzarella: "#FFF8E6" }[key];
    let inner = stoveSurf(G, stoveMix("#FBF3DE", final, melt), d);
    stoveSpots(16, G.cx, G.cy + d - 2, 64, 9).forEach(([x, y, r, i]) => {
      const q = clamp(drop * 1.6 - (i / 16) * 0.6); if (q <= 0) return;
      const yy = lerp(30, y, ease(q));
      inner += `<g opacity="${q >= 1 ? 1 - melt : 1}">${key === "creamcheese" ? `<rect x="${x - 7}" y="${yy - 6}" width="14" height="12" rx="3" fill="#FFFFFF" ${st(2)}/>` : piece(key === "cheese" ? F : { ...F, inner: final, fill: final }, "shred", x, yy, r, 1.2)}</g>`;
    });
    if (p > 0.4) inner += stoveStir(t, 3.6, G.cx, G.cy + d + 4, 50, 8, 1);
    let s = stoveVessel(G, t, inner, { flame: 0.3 });
    if (p < 0.38) s += g(fist(), G.cx + Math.sin(t * 6) * 4, 26, 1.1, 180);
    return s + (melt > 0.85 ? FX.sparkle(t, 200, 100, 0.8) : "");
  },
});
LIB.add({
  cat: "stove", name: "butterbrown", dur: 4.6, foods: ["butter"],
  steps: ["Melt the butter and cook until it foams, then turns nutty brown", "Continue to cook until butter starts to smell nutty, turns a deep golden, and the bubbling slows", "Brown the butter, swirling the pan"],
  draw(t, F) {
    const p = t / 4.6, m = ease(seg(p, 0, 0.22)), foam = Math.sin(seg(p, 0.2, 0.75) * Math.PI), br = ease(seg(p, 0.45, 0.95));
    let inner = stovePool(stoveMix("#FFE08A", "#B5733A", br), lerp(30, 100, m), lerp(8, 26, m), 150, 0.95);
    if (m < 1) inner += g(whole(F), 180, 142, 0.4 * (1 - m) + 0.01);
    stoveSpots(30, 180, 148, 88, 20).forEach(([x, y, r, i]) => { inner += `<circle cx="${x}" cy="${y}" r="${3 + (i % 3) * 1.6}" fill="#FFF8DC" ${st(1.2)} opacity="${foam}"/>`; if (i % 2) inner += `<circle cx="${x + 3}" cy="${y + 2}" r="2" fill="#5A3220" opacity="${br}"/>`; });
    return stoveVessel(STOVE_STEEL, t, inner, { flame: 0.55 }) + stoveAroma(t, [150, 220], 112, "#B5733A", br);
  },
});
LIB.add({
  cat: "stove", name: "milkwarm", dur: 3.6, foods: ["milk", "cream", "coconut"],
  steps: ["Warm the milk in a saucepan until steaming; do not let it boil", "Warm milk up in a saucepan", "Heat the cream until small bubbles form around the edge"],
  draw(t, F) {
    const p = t / 3.6, k = ease(clamp(p / 0.8)), G = STOVE_SAUCE, d = 12;
    let inner = stoveSurf(G, F.liquid === "#FFFFFF" ? "#FFFDF6" : F.liquid, d);
    for (let i = 0; i < 14; i++) { const a = Math.PI * (i / 13), x = G.cx - Math.cos(a) * 84, y = G.cy + d + Math.sin(a) * 18 - 2; inner += `<circle cx="${x}" cy="${y}" r="${2 + (i % 2)}" fill="#fff" ${st(1.3)} opacity="${k}"/>`; }
    return stoveVessel(G, t, inner, { flame: 0.3 }) + steam(t, [120, 166, 210], 100, 0.5).replace(/opacity="([\d.]+)"/g, (mm, o) => `opacity="${o * k}"`);
  },
});
LIB.add({
  cat: "stove", name: "doubleboilermelt", dur: 4.4, foods: ["chocolate", "chips", "whitechocolate"],
  steps: ["Melt the chocolate in a heatproof bowl set over a pot of simmering water", "Stir the chocolate over barely simmering water until smooth", "Set the bowl over the pot, making sure the bottom does not touch the water"],
  draw(t, F, key) {
    const p = t / 4.4, m = ease(seg(p, 0.1, 0.8)), G = STOVE_POT;
    const choc = key === "whitechocolate" ? "#FBF1D9" : "#5A3220";
    let bowl = `<path d="M50 72 C56 150 304 150 310 72 Z" fill="${C.steel}" ${st()}/><ellipse cx="180" cy="72" rx="130" ry="22" fill="#E3E7EA" ${st()}/>`;
    bowl += stovePool(choc, lerp(30, 104, m), lerp(8, 17, m), 76, 1);
    stoveSpots(10, 180, 74, 80, 12).forEach(([x, y, r, i]) => { const sz = 1 - m; if (sz > 0.05) bowl += key === "chips" ? `<path transform="translate(${x} ${y}) rotate(${r % 30}) scale(${sz + 0.2})" d="M-7 6 L0 -9 L7 6 Z" fill="${choc}" ${st(2)}/>` : `<rect transform="translate(${x} ${y}) rotate(${r % 30}) scale(${sz + 0.2})" x="-10" y="-7" width="20" height="14" rx="2" fill="${choc}" ${st(2)}/>`; });
    let s = stoveVessel(G, t, stoveSurf(G, C.water, 30) + bowl, { flame: 0.4 });
    s += steam(t, [52, 308], 96, 0.7);
    if (m > 0.8) s += FX.sparkle(t, 220, 66, 0.8);
    return s + T.scraper(180 + Math.sin(t * 3) * 50, 82, Math.sin(t * 3) * 12);
  },
});

// =====================================================================
// 14. Soups and stews
// =====================================================================
LIB.add({
  cat: "stove", name: "brothintopot", dur: 3.6, foods: ["broth", "stock", "water", "coconut"],
  steps: ["Add the chicken stock and bring to a simmer", "Pour in the broth and stir, scraping up the browned bits", "Return the pot to medium-high heat and add the chicken broth"],
  draw(t, F) {
    const p = t / 3.6, G = STOVE_POT, rise = ease(seg(p, 0.1, 0.75)), d = lerp(44, 14, rise);
    const liq = F.liquid === "#FFFFFF" ? "#FFFDF6" : F.liquid;
    let inner = stoveSurf(G, liq, d, rise > 0.02 ? 0.95 : 0);
    stoveSpots(16, 180, G.cy + d + 2, lerp(70, 92, rise), lerp(8, 14, rise)).forEach(([x, y, r]) => { inner += piece(FOODS.veggies, "cube", x, y, r, 0.8); });
    let s = stoveVessel(G, t, inner, { flame: 0.8 });
    const tip = p < 0.1 ? ease(p / 0.1) : p < 0.72 ? 1 : 1 - ease(seg(p, 0.72, 0.8));
    const [cup, lx, ly] = stoveCup(262, 36, tip, liq, 0.85);
    if (tip > 0.85 && p < 0.74) s += FX.stream(lx, ly, 190, G.cy + d, liq, 9);
    return s + (p < 0.82 ? cup : "") + steam(t, [140, 220], 88, 0.4);
  },
});
const STOVE_SOUP = "#E8B46A";
LIB.add({
  cat: "stove", name: "dropintosoup", dur: 3.2,
  foods: ["carrot", "potato", "celery", "corn", "peas", "blackbeans", "chickpeas", "lentils", "pasta", "noodles", "kale", "spinach", "chicken"],
  steps: ["Add the vegetables to the simmering soup", "Add the drained beans and stir", "Once the stock has come to a simmer, add the pasta and cook until tender", "Stir in the kale and cook until wilted"],
  draw(t, F, key) {
    const p = t / 3.2, G = STOVE_POT, d = 14, sy = G.cy + d;
    const bitOf = (x, y, r, s = 1) => key === "corn" ? `<rect x="${x - 4}" y="${y - 4}" width="8" height="8" rx="2" fill="#F7C94B" ${st(1.6)}/>` : key === "chicken" ? stoveChickenCube(x, y, r) : key === "pasta" ? stovePastaBit("pasta", x, y, r, s) : key === "noodles" ? stovePastaBit("noodles", x, y, r, s) : stoveBit(F, x, y, r, F.type === "slab" ? 1 : 0, s);
    let inner = stoveSurf(G, STOVE_SOUP, d) + stovePops(t, 6, G.cx, sy, 90, 16, 0.8, 1, 0.7);
    const spots = stoveSpots(12, 180, sy + 1, 88, 14);
    let over = "";
    spots.forEach(([x, y, r, i]) => {
      const q = clamp(seg(p, 0.08, 0.7) * 1.5 - (i / 12) * 0.5);
      if (q >= 1) inner += bitOf(x + Math.sin(t * 2 + i) * 2, y + Math.cos(t * 2 + i) * 1.5, r, 1);
      else if (q > 0) over += bitOf(lerp(262, x, q), lerp(48, y, q * q), r + q * 200, 1);
      if (q >= 1 && q < 1.05) inner += `<ellipse cx="${x}" cy="${y}" rx="16" ry="4" fill="none" stroke="#fff" stroke-width="2"/>`;
    });
    let s = stoveVessel(G, t, inner, { flame: 0.5 }) + over;
    if (p < 0.72) s += g(V.smallBowl(0, 0, 0.45, ""), 284, 46, 1, -55);
    return s + steam(t, [140, 220], 88, 0.4);
  },
});
LIB.add({
  cat: "stove", name: "potlidon", dur: 3.8, foods: ["soup", "stew", "curry", "chili", "tomatosauce"],
  steps: ["Cover the pot, reduce heat and simmer for 20 minutes", "Cover with lid, simmer 3 hours", "Reduce heat to a simmer, cover and cook 20 minutes, stirring occasionally"],
  draw(t, F, key) {
    const p = t / 3.8, G = STOVE_POT, d = 14, lid = ease(seg(p, 0.08, 0.3)), low = ease(seg(p, 0.3, 0.5));
    let inner = stoveSurf(G, F.liquid, d);
    if (key !== "tomatosauce") stoveSpots(12, 180, G.cy + d, 88, 13).forEach(([x, y, r, i]) => { inner += key === "chili" ? (i % 2 ? piece(FOODS.kidneybeans, "bit", x, y, r, 1.5) : `<circle cx="${x}" cy="${y}" r="5" fill="#6B2A16" ${st(1.8)}/>`) : key === "soup" ? piece(FOODS.veggies, "cube", x, y, r, 0.8) : g(`<rect x="-9" y="-7" width="18" height="14" rx="4" fill="${i % 3 === 1 ? "#F39448" : stoveDark(F.liquid, 0.65)}" ${st(2.2)}/>`, x, y, 1, r % 30); });
    inner += stovePops(t, 8, G.cx, G.cy + d, 90, 16, 1, 1.1, lerp(1.1, 0.5, low));
    let s = stoveVessel(G, t, inner, { flame: lerp(1, 0.35, low) });
    s += T.lid(180, lerp(50, 100, lid) + (lid >= 1 ? Math.sin(t * 8) * 1 : 0), 0, 128);
    return s + (lid >= 1 ? steam(t, [62, 298], 96, 0.7) : steam(t, [140, 220], 88, 0.7));
  },
});
LIB.add({
  cat: "stove", name: "souptopdumplings", dur: 3.8, foods: ["dough", "dumplings"],
  steps: ["Drop spoonfuls of dumpling dough over the simmering soup", "Use a small spoon to drop teaspoon-sized amounts of dough all over the top of the simmering soup", "Cover and cook until the dumplings are puffed and cooked through"],
  draw(t) {
    const p = t / 3.8, G = STOVE_POT, d = 14, sy = G.cy + d;
    let inner = stoveSurf(G, "#F1DDB0", d) + stovePops(t, 6, G.cx, sy, 90, 16, 0.8, 1, 0.6);
    stoveSpots(6, 180, sy, 78, 12).forEach(([x, y, r, i]) => { inner += i % 2 ? stoveChickenCube(x + 20, y + 4, r % 30) : g(`<rect x="-6" y="-5" width="12" height="10" rx="3" fill="#F39448" ${st(2)}/>`, x - 20, y + 3); });
    const spots = [[120, sy - 4], [168, sy + 4], [214, sy - 6], [250, sy + 4], [146, sy + 12], [200, sy + 12]];
    let spoon = "";
    spots.forEach(([x, y], i) => {
      const t0 = 0.05 + i * 0.13, q = seg(p, t0, t0 + 0.1);
      if (q >= 1) { const puff = ease(seg(p, t0 + 0.1, t0 + 0.4)); inner += g(`<path d="M-16 4 C-18 -12 -4 -16 2 -12 C12 -16 20 -6 16 4 C10 10 -10 10 -16 4 Z" fill="#FBF6EA" ${st(2.6)}/>`, x, y, lerp(0.6, 1, puff)); }
      else if (q > 0) spoon = stoveSpoonM(x + 6, lerp(60, y - 4, ease(q)), 0, "#FBF6EA");
    });
    return stoveVessel(G, t, inner, { flame: 0.5 }) + spoon + steam(t, [140, 220], 88, 0.5);
  },
});

// =====================================================================
// 15. Stir-fry and deep frying
// =====================================================================
LIB.add({
  cat: "stove", name: "wokstirfry", dur: 2,
  foods: ["chicken", "beef", "shrimp", "tofu", "broccoli", "pepper", "greenbeans", "noodles", "carrot", "mushroom", "onion", "zucchini", "cauliflower", "veggies"],
  steps: ["Stir fry for 2 to 3 mins", "Add beef and stir-fry until browned, 3 to 4 minutes", "Toss the vegetables in the hot wok for 2 minutes"],
  draw(t, F, key) {
    const p = t / 2, jerk = Math.sin(p * Math.PI * 2) * 8;
    let inner = "";
    if (key === "noodles") inner += stoveTangle(180, 132, 90, 18, "#E8C26A", 8, t * 3);
    stoveSpots(key === "noodles" ? 0 : 12, 180, 134, 92, 20).forEach(([x, y, r, i]) => {
      const hop = i % 3 === 0 ? Math.max(0, Math.sin(p * Math.PI * 2 + i)) * 50 : Math.max(0, Math.sin(p * Math.PI * 2 + i)) * 8;
      // Mixed vegetables: a bit of each.
      const FB = key === "veggies" ? [FOODS.broccoli, FOODS.carrot, FOODS.pepper, FOODS.mushroom][i % 4] : F;
      inner += stoveBit(FB, x, y - hop, r + hop * 4, 0.85, 1.05);
    });
    if (key === "noodles") for (let i = 0; i < 3; i++) { const hop = Math.max(0, Math.sin(p * Math.PI * 2 + i)) * 40; inner += stovePastaBit("noodles", 150 + i * 30, 126 - hop, i * 30, 1.3, "#E8C26A"); }
    return `<g transform="translate(${jerk} 0)">${stoveVessel(STOVE_WOK, t, inner, { flame: 0 })}</g>` + burner(t, 1.3) + stoveTurner(200 + jerk + Math.sin(t * 6) * 30, 132, -18);
  },
});
// Fried pieces: pale batter (k 0) to golden (k 1).
function stoveFried(key, k, x, y, rot = 0, s = 1) {
  const raw = key === "fries" ? "#F7E7A8" : key === "donut" ? "#F4DFB0" : "#F3E0B5", c = stoveMix(raw, key === "fries" ? "#E0A040" : "#D08A2E", k);
  const o = st(2.4);
  switch (key) {
    case "fries": return g([-8, 0, 8].map((dx, i) => `<rect x="${dx - 3.5}" y="-16" width="7" height="32" rx="2" fill="${c}" ${o} transform="rotate(${(i - 1) * 14})"/>`).join(""), x, y, s, rot);
    case "donut": return g(`<path d="M-18 0 a18 13 0 1 0 36 0 a18 13 0 1 0 -36 0 M-6 0 a6 4.5 0 1 0 12 0 a6 4.5 0 1 0 -12 0" fill="${c}" fill-rule="evenodd" ${o}/>`, x, y, s);
    case "onionrings": return g(`<path d="M-17 0 a17 12 0 1 0 34 0 a17 12 0 1 0 -34 0 M-11 0 a11 7 0 1 0 22 0 a11 7 0 1 0 -22 0" fill="${c}" fill-rule="evenodd" ${o}/>`, x, y, s);
    case "shrimp": return g(whole({ ...FOODS.shrimp, fill: c, cooked: null }), x, y, 0.26 * s, rot);
    case "fish": return g(`<path d="M-26 0 C-28 -10 -10 -12 0 -11 C14 -12 28 -8 26 0 C28 8 12 12 0 11 C-12 12 -28 8 -26 0 Z" fill="${c}" ${o}/><circle cx="-10" cy="-2" r="2" fill="${stoveDark(c, 0.8)}"/><circle cx="8" cy="3" r="2" fill="${stoveDark(c, 0.8)}"/>`, x, y, s, rot * 0.2);
    case "wings": return g(`<path d="M-18 -6 C-26 4 -18 16 -4 12 L12 6 C18 4 18 -6 12 -8 Z" fill="${c}" ${o}/><circle cx="-8" cy="2" r="2" fill="${stoveDark(c, 0.8)}"/>`, x, y, s, rot * 0.3);
    case "nuggets": return g(`<path d="M-12 -2 C-14 -10 -2 -12 4 -10 C12 -10 14 0 10 6 C4 12 -10 10 -12 -2 Z" fill="${c}" ${o}/>`, x, y, s, rot);
    default: return g(`<path d="M-20 -2 C-24 -12 -12 -16 -6 -14 C0 -20 12 -16 14 -10 C22 -8 22 6 14 10 C8 16 -6 14 -10 10 C-20 10 -22 4 -20 -2 Z" fill="${c}" ${o}/><circle cx="-6" cy="-4" r="2" fill="${stoveDark(c, 0.8)}"/><circle cx="8" cy="2" r="2" fill="${stoveDark(c, 0.8)}"/>`, x, y, s, rot * 0.2);
  }
}
const STOVE_FRY_FOODS = ["chicken", "fries", "donut", "shrimp", "fish", "onionrings", "nuggets", "wings"];
LIB.add({
  cat: "stove", name: "deepfrylower", dur: 3.6, foods: STOVE_FRY_FOODS,
  steps: ["Carefully lower the chicken into the hot oil", "Fry in batches until golden brown, 3 to 4 minutes", "Deep fry on low flame until the puri turns golden, crisp, and flaky"],
  draw(t, F, key) {
    const p = t / 3.6, G = STOVE_POT, d = 16, sy = G.cy + d, down = ease(seg(p, 0.05, 0.35)), k = ease(seg(p, 0.35, 0.95));
    let inner = stoveSurf(G, "#F2C84B", d, 0.95);
    const spots = [[136, sy + 2], [180, sy - 4], [224, sy + 4]];
    if (down >= 1) spots.forEach(([x, y], i) => { inner += stoveFried(key, k, x + Math.sin(t * 3 + i) * 2, y, i * 30, 1.2); for (let j = 0; j < 6; j++) { const q = (t * 2.5 + j / 6 + i * 0.3) % 1, a = j * 1.05; inner += `<circle cx="${x + Math.cos(a) * (22 + q * 8)}" cy="${y + Math.sin(a) * (8 + q * 3)}" r="${1.5 + q * 3}" fill="#fff" ${st(1.3)} opacity="${(1 - q) * lerp(1, 0.5, k)}"/>`; } });
    let s = stoveVessel(G, t, inner, { flame: 0.7 });
    if (down < 1) { const y = lerp(30, sy, down); s += [-16, 0, 16].map((dx, i) => stoveFried(key, 0, 180 + dx, y - 12 - (i % 2) * 6, i * 30, 0.8)).join("") + T.spider(180, y, -20); }
    return s + steam(t, [130, 230], 90, 0.5);
  },
});
LIB.add({
  cat: "stove", name: "deepfrylift", dur: 3.4, foods: STOVE_FRY_FOODS,
  steps: ["Lift out with a slotted spoon and drain on paper towels", "Transfer the fried chicken to a paper towel-lined plate", "Remove the fries with a spider and drain"],
  draw(t, F, key) {
    const p = t / 3.4, mv = ease(seg(p, 0.1, 0.6)), G = STOVE_POT;
    let s = g(stoveVessel(G, t, stoveSurf(G, "#F2C84B", 16, 0.95) + (mv < 0.05 ? [130, 180, 226].map((x, i) => stoveFried(key, 1, x, 116, i * 30, 1.3)).join("") : stoveFried(key, 1, 220, 118, 20, 1.3)) + stovePops(t, 8, 180, 116, 80, 14, 1, 1, 1.5), { flame: 0.6 }), -10, 60, 0.68);
    s += plate(282, 196, 1) + T.paperTowel(282, 184, 96);
    if (mv >= 1) s += [-24, 0, 24].map((dx, i) => stoveFried(key, 1, 282 + dx, 180 - (i % 2) * 6, i * 30, 0.9)).join("") + `<circle cx="262" cy="191" r="4" fill="#F2C84B" opacity=".6"/><circle cx="300" cy="190" r="3" fill="#F2C84B" opacity=".6"/>`;
    const x = lerp(110, 282, mv), y = lerp(132, 176, mv) - Math.sin(mv * Math.PI) * 90;
    if (p < 0.72) {
      if (mv < 1) s += [-14, 0, 14].map((dx, i) => stoveFried(key, 1, x + dx, y - 10 - (i % 2) * 6, i * 30, 0.8)).join("") + FX.drips(t, [x - 8, x + 8], y + 18, y + 50, "#F2C84B", 2);
      s += T.spider(x, y, -20);
    }
    return s;
  },
});

// =====================================================================
// 16. More everyday stove moments
// =====================================================================
LIB.add({
  cat: "stove", name: "forktestpot", dur: 2.8, foods: ["potato", "sweetpotato", "carrot"],
  steps: ["Cook for 15 to 20 minutes, or until you can easily poke through the potatoes with a fork", "Boil until fork-tender", "Cook until the carrots are tender when pierced with a fork"],
  draw(t, F) {
    const p = t / 2.8, G = STOVE_POT, d = 14, sy = G.cy + d, down = ease(seg(p, 0.12, 0.4)), up = ease(seg(p, 0.75, 0.95));
    let inner = stoveSurf(G, C.water, d, 0.9);
    stoveSpots(9, 180, sy + 2, 86, 12).forEach(([x, y, r]) => { inner += piece(F, F.type === "long" ? "coin" : "chunk", x, y, r, 1.5); });
    inner += stovePops(t, 8, G.cx, sy, 96, 18, 1, 1, 1);
    inner += T.fork(186, lerp(lerp(40, sy + 8, down), 40, up), 0) + g(fist(), 186, lerp(lerp(40, sy + 8, down), 40, up) - 100, 1);
    let s = stoveVessel(G, t, inner, { flame: 0.8 }) + steam(t, [130, 240], 88, 0.6);
    return s + (p > 0.45 && p < 0.95 ? T.check(300, 54, ease(seg(p, 0.45, 0.55))) : "");
  },
});
LIB.add({
  cat: "stove", name: "nestinsauce", dur: 3.4, foods: ["chicken", "meatballs", "fish", "shrimp", "sausage"],
  steps: ["Tilt the pan and frequently spoon the sauce over the chicken", "Nestle the meatballs into the sauce and simmer", "Add the fish to the hot sauce in the pan and cook until opaque"],
  draw(t, F, key) {
    const p = t / 3.4, sauce = "#C8642E";
    let inner = stovePool(sauce, 104, 28, 150) + stovePops(t, 6, 180, 150, 90, 20, 0.8, 1, 0.6);
    const spots = key === "shrimp" ? stoveSpots(7, 180, 146, 70, 14) : key === "meatballs" ? stoveSpots(6, 180, 146, 66, 14) : [[130, 144, 0], [190, 150, 0], [244, 142, 0]];
    spots.forEach(([x, y, r]) => {
      if (key === "meatballs") inner += `<circle cx="${x}" cy="${y}" r="16" fill="${FOODS.meatballs.cooked}" ${st(2.8)}/><path d="M${x - 8} ${y - 6} q4 -4 9 -2" stroke="#fff" stroke-width="2.5" fill="none" opacity=".5"/>`;
      else if (key === "shrimp") inner += g(whole(F, 1), x, y, 0.28, r % 60);
      else if (key === "sausage") inner += g(`<rect x="-30" y="-10" width="60" height="20" rx="10" fill="${F.cooked}" ${st(2.6)}/>`, x, y);
      else inner += g(whole(F, 1), x, y, key === "fish" ? 0.42 : 0.42);
      inner += `<path d="M${x - 10} ${y - 2} q10 6 20 0" fill="none" stroke="${sauce}" stroke-width="5" stroke-linecap="round" opacity=".8"/>`;
    });
    let s = stoveVessel(STOVE_PAN, t, inner, { flame: 0.5 });
    const go = ease(seg(p, 0.1, 0.35)), pourP = seg(p, 0.4, 0.7), back = ease(seg(p, 0.75, 0.95));
    const x = lerp(lerp(270, 200, go), 270, back), y = lerp(lerp(160, 118, go), 160, back);
    if (pourP > 0.1 && pourP < 1) s += FX.stream(x - 12, y + 2, x - 14, 142, sauce, 5);
    return s + stoveSpoonM(x, y, pourP > 0 && back < 1 ? -40 * Math.min(1, pourP * 2) : 0, pourP < 0.8 ? sauce : null);
  },
});
LIB.add({
  cat: "stove", name: "eggsinsauce", dur: 4.4, foods: ["egg"],
  steps: ["Make wells in the sauce and crack an egg into each", "Crack the eggs into the simmering tomato sauce and cover until set", "Cook until the egg whites are set but the yolks are runny"],
  draw(t) {
    const p = t / 4.4, wells = [[136, 146], [204, 140], [226, 160]];
    let inner = stovePool("#D9402E", 104, 28, 150) + stoveSpots(14, 180, 148, 84, 18).map(([x, y, r, i]) => `<rect x="${x - 4}" y="${y - 4}" width="8" height="8" rx="2" fill="${i % 2 ? "#4E9A3A" : "#F07A62"}" ${st(1.4)}/>`).join("");
    let hands = "";
    wells.forEach(([x, y], i) => {
      const t0 = 0.05 + i * 0.22, land = seg(p, t0 + 0.08, t0 + 0.14), set = ease(seg(p, t0 + 0.14, 0.95));
      if (land >= 1) inner += stoveEgg(x, y, set, 0.62);
      else if (p > t0 && p < t0 + 0.16) { const open = ease(seg(p, t0, t0 + 0.08)); hands = stoveShell(x, 70, open) + g(fist(), x - 40 - open * 22, 62, 0.85) + g(fist(), x + 40 + open * 22, 62, 0.85) + (open > 0.5 ? `<ellipse cx="${x}" cy="${lerp(84, y, land)}" rx="9" ry="10" fill="#F5B92E" ${st(2.2)}/>` : ""); }
    });
    return stoveVessel(STOVE_PAN, t, inner, { flame: 0.5 }) + stovePops(t, 5, 180, 150, 90, 20, 0.7) + hands;
  },
});
LIB.add({
  cat: "stove", name: "toastbunspan", dur: 3.4, foods: ["bun", "bread", "bagel"],
  steps: ["Toast the buns cut side down in the skillet until golden", "Place the bread in the buttered pan and toast until golden", "Toast the cut sides of the bagel in the pan"],
  draw(t, F, key) {
    const top = (side) => {
      if (key === "bread") return side ? `<rect x="-38" y="-14" width="76" height="28" rx="8" fill="#D99A4A" stroke="#B5733A" stroke-width="5"/><rect x="-38" y="-14" width="76" height="28" rx="8" fill="none" ${st(2.6)}/>` : `<rect x="-38" y="-14" width="76" height="28" rx="8" fill="#F6E3B8" stroke="#C98A4B" stroke-width="5"/><rect x="-38" y="-14" width="76" height="28" rx="8" fill="none" ${st(2.6)}/>`;
      if (key === "bagel") return `<path d="M-40 0 a40 16 0 1 0 80 0 a40 16 0 1 0 -80 0 M-12 0 a12 5 0 1 0 24 0 a12 5 0 1 0 -24 0" fill="${side ? "#D99A4A" : "#C98A4B"}" fill-rule="evenodd" ${st(3)}/>`;
      return side ? `<ellipse rx="44" ry="16" fill="#D99A4A" ${st(3)}/><ellipse rx="30" ry="9" fill="#C98340" opacity=".5"/>` : `<path d="M-44 6 C-44 -26 44 -26 44 6 Z" fill="#D9A55B" ${st(3)}/>${[[-16, -10], [6, -14], [22, -6]].map(([a, b]) => `<ellipse cx="${a}" cy="${b}" rx="3" ry="1.8" fill="#FBF4DC" ${st(1.2)}/>`).join("")}`;
    };
    const inner = stovePool("#FFE08A", 96, 20, 152, 0.5) + g(top(0), 128, 148);
    return stoveVessel(STOVE_PAN, t, inner, { flame: 0.5 }) + stoveFlip(t, 3.4, top, { cx: 232, cy: 146, w: 44, h: 10 }) + sizzle(t, 180, 126, 140);
  },
});
LIB.add({
  cat: "stove", name: "tomatoesburst", dur: 4, foods: ["cherrytomato"],
  steps: ["Cook until the cherry tomatoes begin to burst", "Cover the pan and cook until the skins on the cherry tomatoes begin to burst", "Saute the tomatoes until blistered and jammy"],
  draw(t) {
    const p = t / 4, k = ease(clamp(p / 0.9));
    let inner = stovePool("#F2C84B", 96, 22, 150, 0.3) + stovePool("#D9402E", 90 * k, 20 * k, 150, k > 0.02 ? 0.9 : 0);
    stoveSpots(11, 180, 146, 80, 17).forEach(([x, y, r, i]) => {
      const burst = k > 0.5 && i % 2 === 0 ? ease((k - 0.5) * 2) : 0;
      inner += `<g transform="translate(${x} ${y}) scale(${1 + burst * 0.15} ${1 - burst * 0.3})"><circle r="13" fill="${stoveMix("#E8503C", "#C8302A", k)}" ${st(2.6)}/>${k > 0.2 ? `<circle cx="5" cy="-4" r="3" fill="#7A2A1A" opacity="${k}"/>` : `<path d="M-6 -6 q3 -3 7 -2" stroke="#fff" stroke-width="2.5" fill="none"/>`}${burst > 0 ? `<path d="M-8 -2 L-2 2 L3 -3 L8 1" fill="none" stroke="#F7D27A" stroke-width="3"/>` : ""}</g>`;
    });
    return stoveVessel(STOVE_PAN, t, inner, { flame: 0.6 }) + sizzle(t, 180, 126, 150) + stoveStir(t, 4, 180, 148, 50, 10, 1);
  },
});
