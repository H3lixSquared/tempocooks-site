// ---------- Serve: topping, plating, assembling, storing ----------
// Every scene shows the finished food getting its last touch or going to
// the table / the fridge. Local helpers start with "srv".

LIB.liquid("balsamic", "#4A2328");
LIB.liquid("lemonade", "#FBEFA0");
LIB.liquid("smoothie", "#E87A9A");
LIB.liquid("icedtea", "#B5682E");
LIB.liquid("verde", "#8FB04A");

// ---------- Local helpers ----------
const srvFrac = (i) => (i * 0.618034 + 0.13) % 1;
const srvFade = (p, a = 0.9) => (p > a ? 1 - (p - a) / (1 - a) : 1);
// One topping bit for a food key, drawn at x,y (small, for scattering).
const SRV_BITS = {
  cheese: ["shred", "#F7C94B"], mozzarella: ["shred", "#FFFFFF"], parmesan: ["crumb", "#F7EDC9"], feta: ["cube", "#FFFFFF", 0.75],
  herbs: ["leaf", "#4E9A3A"], parsley: ["leaf", "#3E8E41"], cilantro: ["leaf", "#5EA040"], basil: ["leaf", "#3E8E41", 1.5],
  scallion: ["ring", "#6DB04A", 1, "#E9F2C7"], chile: ["ring", "#3E8E41", 1, "#BFE08A"], olives: ["ring", "#3B3B2A", 1, "#15150E"],
  seeds: ["seed", "#F7EDC9"], nuts: ["chunk", "#C9965A"], bacon: ["chunk", "#8A3A22", 0.8], croutons: ["cube", "#D9A55B"],
  panko: ["crumb", "#F1D98A", 0.8], breadcrumbs: ["crumb", "#D9A55B", 0.8], paprika: ["dust", "#D9443A"], pepperground: ["dust", "#2A2A2A"],
  cinnamon: ["dust", "#8A4A2A"], cocoa: ["dust", "#5A3220"], sugar: ["dust", "#FFFFFF"], tomato: ["cube", "#E8503C", 0.8],
  redonion: ["crumb", "#B97BA0"], onion: ["crumb", "#F4E6F1"], avocado: ["cube", "#C8E08A", 0.8], lettuce: ["shred", "#9BCB6A"],
  cabbage: ["shred", "#C8E39A"], redcabbage: ["shred", "#9A4A9A"], blackbeans: ["bean", "#2A2A2A"], blueberries: ["berry", "#4A5A9C"],
  raspberries: ["berry", "#D93A52"], strawberry: ["slice", "#E8413C", 1, "#F7A0A0"], banana: ["coin", "#F7E7A8", 1, "#FBF6DC"],
  oats: ["crumb", "#D9B06A", 1.3], mushroom: ["mush", "#C9A27A", 1, "#F1E3C9"], pepper: ["strip", "#E8503C"], greenpepper: ["strip", "#4E9A3A"],
  sausage: ["coin", "#7A2A1E", 1.35, "#B5473A"], chips: ["chip", "#4A2A1A"], cherrytomato: ["coin", "#E8503C", 1, "#F07A62"],
  cucumber: ["coin", "#3E8E41", 1, "#CDE8B0"], corn: ["bean", "#F7C94B"], chickpeas: ["berry", "#E8C47A", 0.8],
};
function srvBit(key, x, y, i, k = 1) {
  const [shape, c, size = 1, c2] = SRV_BITS[key] || ["chunk", "#C98340"];
  const r = (i * 47) % 360, tf = `transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${r}) scale(${(k * size).toFixed(2)})"`;
  switch (shape) {
    case "shred": return `<path ${tf} d="M-9 -1 C-4 -5 4 2 9 -2 L9 2 C4 6 -4 -1 -9 3 Z" fill="${c}" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>`;
    case "crumb": return `<rect ${tf} x="-3.5" y="-3" width="7" height="6" rx="1.5" fill="${c}" stroke="${INK}" stroke-width="1.5"/>`;
    case "cube": return `<rect ${tf} x="-6" y="-5" width="12" height="10" rx="2.5" fill="${c}" ${st(2)}/>`;
    case "chunk": return `<path ${tf} d="M-6 -4 L4 -6 L7 2 L1 6 L-6 4 Z" fill="${c}" ${st(1.8)}/>`;
    case "leaf": return `<path ${tf} d="M-7 0 C-5 -6 5 -6 7 0 C5 6 -5 6 -7 0 Z" fill="${c}" ${st(1.8)}/>`;
    case "ring": return `<g ${tf}><circle r="5.5" fill="${c}" ${st(1.8)}/><circle r="2.3" fill="${c2}"/></g>`;
    case "seed": return `<ellipse ${tf} rx="3" ry="1.8" fill="${c}" stroke="${INK}" stroke-width="1.2"/>`;
    case "bean": return `<ellipse ${tf} rx="4.5" ry="3" fill="${c}" stroke="${INK}" stroke-width="1.4"/>`;
    case "dust": return `<circle ${tf} r="2.6" fill="${c}" ${c === "#FFFFFF" ? `stroke="${INK}" stroke-width=".8"` : ""}/>`;
    case "berry": return `<g ${tf}><circle r="6" fill="${c}" ${st(1.8)}/><circle cx="-2" cy="-2" r="1.4" fill="#fff" opacity=".7"/></g>`;
    case "slice": return `<g ${tf}><path d="M-7 -6 C-2 -10 2 -10 7 -6 L0 9 Z" fill="${c}" ${st(1.8)}/><path d="M-4 -5 C-1 -7 1 -7 4 -5 L0 4 Z" fill="${c2}"/></g>`;
    case "coin": return `<g ${tf}><ellipse rx="8" ry="6" fill="${c}" ${st(1.8)}/><ellipse rx="5" ry="3.6" fill="${c2}"/></g>`;
    case "mush": return `<path ${tf} d="M-8 0 C-8 -9 8 -9 8 0 L3 0 L3 6 L-3 6 L-3 0 Z" fill="${c2}" ${st(1.8)}/>`;
    case "strip": return `<rect ${tf} x="-9" y="-2.5" width="18" height="5" rx="2.5" fill="${c}" ${st(1.6)}/>`;
    case "chip": return `<path ${tf} d="M-4 3 L0 -4 L4 3 Z" fill="${c}" ${st(1.2)}/>`;
  }
  return "";
}
// Random spot on an elliptical surface (bowl soup, pizza, plate top).
const srvEll = (cx, cy, rx, ry) => (x, i) => {
  const xx = clamp(x, cx - rx * 0.85, cx + rx * 0.85), w = Math.sqrt(Math.max(0, 1 - ((xx - cx) / rx) ** 2));
  return [xx, cy + (srvFrac(i * 7 + 3) - 0.5) * 2 * ry * 0.75 * w];
};
// Bits raining from a moving pinch (or shaker) onto a surface, piling up, then fading for the loop.
// opt: x0,x1 (hand sweep), yHand, land(x,i)->[x,y], n, k
function srvRain(t, dur, key, opt) {
  const p = t / dur, n = opt.n || 18, fall = 0.12;
  const hx = (q) => lerp(opt.x0, opt.x1, (1 - Math.cos(q * Math.PI * 2)) / 2);
  let s = "";
  for (let i = 0; i < n; i++) {
    const q0 = lerp(0.04, 0.76, i / n);
    if (p < q0) continue;
    const [lx, ly] = opt.land(hx(q0) + (srvFrac(i) - 0.5) * 22, i);
    const y = p < q0 + fall ? lerp(opt.yHand, ly, (p - q0) / fall) : ly;
    const x = p < q0 + fall ? lerp(hx(q0), lx, (p - q0) / fall) : lx;
    s += srvBit(key, x, y, i, opt.k || 1);
  }
  return { bits: `<g opacity="${srvFade(p)}">${s}</g>`, x: hx(p) };
}
// A pinching glove over the food; small jiggle while it lets go.
const srvPinch = (x, y, t) => T.pinch(x + Math.sin(t * 22) * 2, y, 1.1);

// ---------- Dishes the toppings land on (3/4 view, counter y = 216) ----------
const srvShadow = (cx = 180, w = 150) => `<ellipse cx="${cx}" cy="212" rx="${w}" ry="7" fill="${INK}" opacity=".08"/>`;
// Wide bowl, rim at y. surf = what's inside (soup color). mound = extra svg drawn inside the rim.
function srvBowl(cx = 180, cy = 132, rx = 100, surf = "#E8A23C", mound = "") {
  return `<path d="M${cx - rx} ${cy} C${cx - rx + 6} ${cy + 92} ${cx + rx - 6} ${cy + 92} ${cx + rx} ${cy} Z" fill="#fff" ${st()}/>
    <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${rx * 0.22}" fill="#fff" ${st()}/><ellipse cx="${cx}" cy="${cy + 1}" rx="${rx - 11}" ry="${rx * 0.22 - 6}" fill="${surf}" ${st(2.5)}/>${mound}`;
}
// Big plate, 3/4 view.
const srvPlate = (cx = 180, cy = 188, rx = 132, ry = 32) => `<ellipse cx="${cx}" cy="${cy + 4}" rx="${rx}" ry="${ry}" fill="#E4E0D6" ${st()}/><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff" ${st()}/><ellipse cx="${cx}" cy="${cy}" rx="${rx * 0.72}" ry="${ry * 0.68}" fill="none" stroke="#E4E0D6" stroke-width="3"/>`;
// 9x13 baking dish, 3/4 view; the food surface spans x 76..284, y 112..146.
const srvDish = (surf, extra = "") => `<path d="M64 128 L70 198 C72 210 288 210 290 198 L296 128 Z" fill="#fff" ${st()}/>
  <rect x="46" y="120" width="22" height="18" rx="6" fill="#fff" ${st(3)}/><rect x="292" y="120" width="22" height="18" rx="6" fill="#fff" ${st(3)}/>
  <rect x="62" y="102" width="236" height="54" rx="20" fill="#fff" ${st()}/><rect x="76" y="112" width="208" height="34" rx="12" fill="${surf}" ${st(3)}/>${extra}`;
const srvDishLand = (x, i) => [clamp(x, 90, 270), 117 + srvFrac(i * 7 + 1) * 24];
// Heap of cooked food bits (for a casserole top, a chili, a bowl).
const srvSpecks = (pts, color, r = 4) => pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>`).join("");
// Pasta on a plate: a noodle mound.
function srvPastaMound(cx = 180, cy = 160, color = "#F2D27A", sauce = "#D9402E") {
  let s = `<path d="M${cx - 90} ${cy + 26} C${cx - 78} ${cy - 30} ${cx + 78} ${cy - 30} ${cx + 90} ${cy + 26} Z" fill="${color}" ${st()}/>`;
  for (let i = 0; i < 7; i++) { const d = `M${cx - 80 + i * 8} ${cy + 20 - (i % 3) * 4} C${cx - 50 + i * 4} ${cy - 30 + i * 4} ${cx + 10 + i * 6} ${cy + 26 - i * 3} ${cx + 78 - i * 6} ${cy + 4 - i * 3}`;
    s += `<path d="${d}" fill="none" stroke="${INK}" stroke-width="7.5" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round"/>`; }
  if (sauce) s += `<path d="M${cx - 40} ${cy - 4} C${cx - 36} ${cy - 22} ${cx + 36} ${cy - 24} ${cx + 42} ${cy - 4} C${cx + 26} ${cy + 6} ${cx - 26} ${cy + 6} ${cx - 40} ${cy - 4} Z" fill="${sauce}" ${st(2.5)}/>`;
  return s;
}
const srvPastaLand = (x, i) => { const xx = clamp(x, 120, 240); return [xx, 150 - 14 * (1 - ((xx - 180) / 70) ** 2) + srvFrac(i * 5) * 18]; };
// Three soft tacos standing on a plate, filled with cooked meat.
const SRV_TACO_X = [104, 180, 256];
function srvTacos(fill = "#7A4A2A", cy = 160, open = 34) {
  let s = srvPlate(180, 196, 150, 26);
  for (const x of SRV_TACO_X) {
    s += `<ellipse cx="${x}" cy="${cy - 20}" rx="${open - 2}" ry="9" fill="${fill}" ${st(2.5)}/>
      ${[-18, -6, 6, 18].map((dx, j) => `<circle cx="${x + dx}" cy="${cy - 23 - (j % 2) * 3}" r="6" fill="${j % 2 ? shade(fill) : fill}" ${st(1.8)}/>`).join("")}
      <path d="M${x - open} ${cy - 22} C${x - open - 4} ${cy + 36} ${x + open + 4} ${cy + 36} ${x + open} ${cy - 22} C${x + 20} ${cy - 6} ${x - 20} ${cy - 6} ${x - open} ${cy - 22} Z" fill="#F1D9A0" ${st()}/>
      <circle cx="${x - 12}" cy="${cy + 8}" r="3" fill="#D9B06A"/><circle cx="${x + 14}" cy="${cy + 14}" r="3" fill="#D9B06A"/>`;
  }
  return s;
}
const srvTacoLand = (cy = 160) => (x, i) => { const tx = SRV_TACO_X.reduce((a, b) => Math.abs(b - x) < Math.abs(a - x) ? b : a); return [tx + (srvFrac(i * 3) - 0.5) * 44, cy - 24 + (srvFrac(i * 7) - 0.5) * 8]; };
// Plate of tortilla chips in a heap.
function srvNachos() {
  let s = srvPlate(180, 192, 140, 30);
  const pts = [[100, 176], [140, 182], [182, 184], [222, 180], [262, 176], [120, 160], [160, 164], [204, 162], [244, 160], [138, 144], [180, 146], [222, 144], [160, 130], [200, 130]];
  pts.forEach(([x, y], i) => { s += `<path transform="translate(${x} ${y}) rotate(${(i * 67) % 360})" d="M-22 12 L0 -22 L22 12 Z" fill="${i % 3 ? "#F2C86A" : "#E8B44A"}" ${st(2.6)}/>`; });
  return s;
}
const srvNachoLand = (x, i) => { const xx = clamp(x, 100, 260); return [xx, 136 + ((xx - 180) / 80) ** 2 * 34 + srvFrac(i * 5) * 16]; };
// Salad bowl heaped with leaves.
function srvSaladBowl(extra = "") {
  const leaves = [[110, 126, "#6DB04A"], [140, 112, "#9BCB6A"], [176, 104, "#4E9A3A"], [212, 110, "#9BCB6A"], [246, 124, "#6DB04A"], [128, 130, "#4E9A3A"], [168, 122, "#6DB04A"], [206, 126, "#4E9A3A"], [234, 132, "#9BCB6A"]];
  const mound = leaves.map(([x, y, c], i) => `<path transform="translate(${x} ${y}) rotate(${i * 40 - 60})" d="M-24 0 C-18 -18 18 -18 24 0 C18 14 -18 14 -24 0 Z" fill="${c}" ${st(2.6)}/>`).join("");
  return srvBowl(180, 134, 104, "#6DB04A", mound + extra);
}
const srvSaladLand = (x, i) => { const xx = clamp(x, 110, 250); return [xx, 108 + ((xx - 180) / 70) ** 2 * 18 + srvFrac(i * 5) * 20]; };
// Pizza on a peel/counter, 3/4 view.
function srvPizza(cheese = false) {
  let s = `<ellipse cx="180" cy="176" rx="140" ry="42" fill="#E8C88A" ${st()}/><ellipse cx="180" cy="174" rx="120" ry="33" fill="#D9402E" ${st(2.5)}/>`;
  if (cheese) s += [[130, 168], [170, 160], [214, 166], [250, 176], [150, 186], [196, 184], [230, 186], [110, 178]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="20" ry="9" fill="#FBF1C7" ${st(2)}/>`).join("");
  return s;
}
const srvPizzaLand = srvEll(180, 174, 114, 30);
// Stack of pancakes on a plate.
const srvPancakes = () => srvPlate(180, 194, 130, 28) + [178, 160, 142].map((y, i) => `<path d="M100 ${y - 8} L100 ${y} C100 ${y + 18} 260 ${y + 18} 260 ${y} L260 ${y - 8}" fill="#D99A5B" ${st(3.5)}/><ellipse cx="180" cy="${y - 8}" rx="80" ry="17" fill="${i === 2 ? "#E8B46A" : "#D99A5B"}" ${st(3.5)}/>`).join("");
const srvPancakeLand = srvEll(180, 134, 76, 15);
// Bowl of stir-fry over rice.
const srvRiceBowl = () => srvBowl(180, 134, 100, "#FBF8EE", `<path d="M96 136 C110 98 250 98 264 136 Z" fill="#FBF8EE" ${st(3)}/>` +
  [[130, 118, "#8A4A2A"], [160, 108, "#4E9A3A"], [196, 106, "#8A4A2A"], [226, 116, "#E8503C"], [148, 126, "#8A4A2A"], [210, 126, "#4E9A3A"], [180, 120, "#8A4A2A"]].map(([x, y, c], i) => `<path transform="translate(${x} ${y}) rotate(${i * 50})" d="M-11 -7 L8 -10 L12 4 L2 10 L-10 6 Z" fill="${c}" ${st(2.2)}/>`).join(""));
const srvRiceLand = (x, i) => { const xx = clamp(x, 116, 244); return [xx, 104 + ((xx - 180) / 64) ** 2 * 20 + srvFrac(i * 5) * 16]; };

// ---------- Topping scenes (pinch of something falls onto a dish) ----------
function srvTopScene(name, foods, steps, base, land, opt = {}) {
  LIB.add({ cat: "serve", name, foods, steps, dur: opt.dur || 3,
    draw(t, F, key) {
      const r = srvRain(t, this.dur, key, { x0: opt.x0 || 120, x1: opt.x1 || 240, yHand: opt.yHand || 74, land, n: opt.n || 18, k: opt.k || 1.4 });
      return counter() + base(key) + r.bits + srvPinch(r.x, opt.yHand ? opt.yHand - 22 : 52, t);
    } });
}
srvTopScene("topcasserole", ["cheese", "mozzarella", "parmesan", "panko", "breadcrumbs", "parsley", "bacon"],
  ["Sprinkle with mozzarella, then bake", "Scatter the remaining cheddar over the top", "Sprinkle the panko crumb mixture over top", "Top with remaining mozzarella and Parmesan cheese"],
  () => srvDish("#D9703A", srvSpecks([[100, 124], [140, 136], [190, 120], [236, 134], [262, 120], [168, 140]], "#F2A35A", 6)), srvDishLand, { x0: 100, x1: 260, n: 24 });
srvTopScene("toppasta", ["parmesan", "basil", "parsley"],
  ["Garnish with chopped fresh basil leaves and additional parmesan cheese", "Serve with more parmesan", "Garnish with parmesan and parsley if desired"],
  () => srvPlate() + srvPastaMound(), srvPastaLand);
srvTopScene("toptacos", ["cheese", "cilantro", "redonion", "onion", "lettuce", "tomato", "avocado", "feta", "cabbage"],
  ["Top the tacos with cheese, lettuce and tomato", "Sprinkle with cilantro and onion", "Top with crumbled cotija"],
  () => srvTacos(), srvTacoLand(), { x0: 96, x1: 264, n: 21 });
srvTopScene("topnachos", ["cheese", "scallion", "chile", "tomato", "olives", "blackbeans"],
  ["Sprinkle the cheese over the chips", "Top nachos with jalapenos and green onions", "Scatter the beans over the chips"],
  () => srvNachos(), srvNachoLand, { x0: 110, x1: 250, n: 22 });
srvTopScene("topchili", ["cheese", "scallion", "redonion", "cilantro"],
  ["Top each bowl with shredded cheese and green onions", "Serve hot with cheese crumbles and sliced green onions"],
  () => srvBowl(180, 132, 100, "#8A3A22", srvSpecks([[130, 130], [170, 124], [210, 136], [236, 128], [156, 140], [196, 128]], "#5A2418", 5)), srvEll(180, 133, 88, 15));
srvTopScene("topsoup", ["parsley", "croutons", "parmesan", "scallion", "cheese", "bacon", "basil"],
  ["Ladle the soup into bowls and sprinkle with parsley and additional Parmesan", "Top with croutons", "Garnish with bacon and green onions"],
  () => srvBowl(180, 132, 100, "#E8A23C"), srvEll(180, 133, 88, 15));
srvTopScene("topsalad", ["croutons", "nuts", "feta", "parmesan", "seeds", "bacon"],
  ["Top the salad with croutons and parmesan", "Sprinkle with toasted nuts and feta", "Scatter the seeds over the salad"],
  () => srvSaladBowl(), srvSaladLand, { yHand: 64 });
srvTopScene("toppizza", ["mozzarella", "basil", "olives", "mushroom", "pepper", "sausage", "onion"],
  ["Arrange your toppings of choice on top", "Top with mozzarella", "Scatter the basil leaves over the pizza"],
  (key) => srvPizza(key === "basil"), srvPizzaLand, { x0: 100, x1: 260, n: 20, k: 1.3 });
srvTopScene("toprice", ["scallion", "seeds", "cilantro", "nuts"],
  ["Serve stir fry over rice and garnish with sliced green onion tops and sesame seeds", "Top with sesame seeds or green onions!"],
  () => srvRiceBowl(), srvRiceLand, { yHand: 64 });
srvTopScene("topcurry", ["cilantro", "herbs"],
  ["Finally garnish aloo gobi with coriander leaves", "Garnish with coriander/cilantro leaves if using"],
  () => srvBowl(180, 134, 100, "#E8A23C", `<path d="M96 136 C110 104 250 104 264 136 Z" fill="#E8A23C" ${st(3)}/>` + [[136, 120, "#F4E3B0"], [172, 112, "#FBF8EE"], [206, 116, "#F4E3B0"], [234, 126, "#FBF8EE"], [156, 128, "#FBF8EE"], [196, 128, "#F4E3B0"]].map(([x, y, c], i) => `<path transform="translate(${x} ${y}) rotate(${i * 50})" d="M-11 -8 L8 -11 L13 4 L2 11 L-11 7 Z" fill="${c}" ${st(2.2)}/>`).join("")),
  srvRiceLand, { yHand: 64 });
srvTopScene("topyogurt", ["blueberries", "raspberries", "strawberry", "banana", "nuts", "oats", "seeds"],
  ["Top the yogurt with berries and granola", "Top with sliced banana and a drizzle of honey", "Sprinkle with nuts and seeds"],
  () => srvBowl(180, 132, 100, "#FFFDF4"), srvEll(180, 133, 88, 15), { n: 14 });
srvTopScene("toppancakes", ["blueberries", "strawberry", "banana", "raspberries"],
  ["Top the pancakes with fresh berries", "Serve topped with sliced bananas"],
  () => srvPancakes(), srvPancakeLand, { n: 12, yHand: 70 });

// Powdered sugar / cocoa tapped through a small sieve over a dessert.
LIB.add({ cat: "serve", name: "dustsugar", foods: ["sugar", "cocoa", "cinnamon"], dur: 2.4,
  steps: ["Dust with powdered sugar before serving", "Dust the top with cocoa powder", "Sprinkle with cinnamon"],
  draw(t, F, key) {
    const p = t / 2.4, hx = lerp(120, 240, (1 - Math.cos(p * Math.PI * 2)) / 2), tap = Math.abs(Math.sin(t * 14)) * 4;
    let s = counter() + srvPlate(180, 194, 130, 28) + `<path d="M84 150 L84 176 C84 196 276 196 276 176 L276 150" fill="#6B3A22" ${st()}/><ellipse cx="180" cy="150" rx="96" ry="22" fill="#7A4428" ${st()}/>`;
    let d = "";
    for (let i = 0; i < 70; i++) { const q0 = lerp(0.02, 0.8, i / 70); if (p < q0) continue; const [x, y] = srvEll(180, 150, 92, 20)(lerp(120, 240, (1 - Math.cos(q0 * Math.PI * 2)) / 2) + (srvFrac(i) - 0.5) * 60, i); d += srvBit(key, x, p < q0 + 0.08 ? lerp(96, y, (p - q0) / 0.08) : y, i, 1.1); }
    s += `<g opacity="${srvFade(p)}">${d}</g>`;
    return s + g(`<path d="M-34 0 C-32 30 32 30 34 0 Z" fill="#E3E7EA" ${st(3)}/><path d="M-24 8 L24 8 M-16 18 L16 18 M-12 0 L-8 24 M0 0 L0 26 M12 0 L8 24" stroke="${C.steelDark}" stroke-width="1.6"/><path d="M-38 0 L38 0" ${st(4)}/><path d="M38 0 L80 -10" ${st(7)}/>${g(fist(), 84, -12)}`, hx, 64 + tap);
  } });

// ---------- Tools held in a glove ----------
// Metal spoon with a glove on the handle; bowl of the spoon at x,y.
const srvSpoon = (x, y, fill = null, tilt = 0, s = 1.15) => g(T.metalSpoon(0, 0, 0, fill) + g(fist(), 62, -54, 0.85), x, y, s, tilt);
// Squeeze bottle / bottle pouring; spout lands at sx,sy. r = tilt degrees (180 = straight down).
function srvBottle(sx, sy, r, fill) {
  const rad = r * Math.PI / 180, cx = sx - 56 * Math.sin(rad), cy = sy + 56 * Math.cos(rad);
  return T.bottle(cx, cy, r, fill) + g(fist(), cx, cy, 1, r);
}
// Ladle with glove; cup at x,y.
const srvLadle = (x, y, r = 0, fill = null) => T.ladle(x, y, r, fill) + g(g(fist(), 30, -92, 0.9), x, y, 1, r);
// A pepper mill; grinding end at bottom (x, y+30).
const srvGrinder = (x, y, t) => T.grinder(x, y, 0, Math.sin(t * 10)) + g(fist(), x, y - 46, 0.9, Math.sin(t * 10) * 14);
// Squeezing a citrus half over food: juice drips from x, y+16.
function srvCitrus(x, y, t, F, speed = 3) {
  const sq = Math.abs(Math.sin(t * speed)), k = 1 - sq * 0.22;
  return g(`<g transform="scale(${1 / k} ${k})"><path d="M-40 0 C-40 -34 40 -34 40 0 Z" fill="${F.fill}" ${st(3.5)}/><path d="M-36 -1 L36 -1" stroke="${F.inner}" stroke-width="8"/><path d="M-40 0 L40 0" ${st(3)}/></g>
    ${g(fist(), 0, -30 * k - 4, 1.15)}`, x, y);
}
// A drop of liquid.
const srvDrop = (x, y, c, k = 1) => `<path transform="translate(${x} ${y}) scale(${k})" d="M0 -7 C4 -1 5 2 5 4 C5 8 -5 8 -5 4 C-5 2 -4 -1 0 -7 Z" fill="${c}" ${st(1.6)}/>`;

// ---------- More dishes ----------
// A cooked main on the plate, cooked look of each food.
function srvMain(key, cx = 180, cy = 172, k = 1) {
  const F = foodFor(key);
  if (key === "tofu") return [[-34, 4], [-8, -6], [18, 4], [42, -6], [4, 12]].map(([x, y]) => `<rect x="${cx + x - 14}" y="${cy + y - 12}" width="28" height="22" rx="4" fill="#E2B66A" ${st(2.6)}/>`).join("");
  if (key === "shrimp") return [[-40, 2], [0, -6], [40, 2]].map(([x, y]) => g(whole(F, 1), cx + x, cy + y, 0.42 * k, x / 3)).join("");
  if (key === "spaghetti" || key === "noodles" || key === "pasta") return srvPastaMound(cx, cy - 6, "#F2D27A", null);
  if (key === "whiterice") return `<path d="M${cx - 80} ${cy + 16} C${cx - 70} ${cy - 34} ${cx + 70} ${cy - 34} ${cx + 80} ${cy + 16} Z" fill="#FBF8EE" ${st()}/>`;
  if (key === "meatballs") return g(whole(F, 1), cx, cy - 6, 0.95 * k);
  return g(whole(F, 1), cx, cy - 4, 0.95 * k);
}
const srvFish = () => srvPlate() + srvMain("fish");
// A slice of pie on a plate.
const srvPieSlice = () => srvPlate(180, 194, 120, 26) + `<path d="M110 186 L110 160 L250 140 L250 168 Z" fill="#F1D49A" ${st()}/><path d="M110 160 L250 140 L238 120 C200 116 150 128 110 160 Z" fill="#B5304A" ${st(3.5)}/>
  <path d="M238 120 C250 124 254 132 250 140 L250 168" fill="#E8B46A" ${st(3.5)}/><path d="M150 140 L200 128" stroke="#E8B46A" stroke-width="6" stroke-linecap="round"/>`;
// A baked potato split open.
const srvPotato = () => srvPlate(180, 194, 120, 26) + `<ellipse cx="180" cy="166" rx="84" ry="34" fill="#A8794A" ${st()}/><path d="M118 156 C140 126 220 126 242 156 C220 168 140 168 118 156 Z" fill="#F7E7A8" ${st(3)}/>`;

// ---------- Dollops ----------
function srvDollopShape(key) {
  if (key === "butter") return `<path d="M-14 -4 L10 -8 L16 0 L-8 4 Z" fill="#FFE08A" ${st(2.5)}/><path d="M-14 -4 L-14 4 L-8 12 L16 8 L16 0" fill="#FFD25A" ${st(2.5)}/>`;
  const c = { sourcream: "#FFFFFF", yogurt: "#FFFFFF", whippedcream: "#FFFFFF", salsa: "#E8503C", avocado: "#B5D46A", pesto: "#5E9A3A" }[key] || "#fff";
  let s = `<path d="M-20 0 C-22 -10 -10 -14 -6 -12 C-4 -22 8 -22 8 -12 C16 -14 22 -6 20 0 C10 4 -10 4 -20 0 Z" fill="${c}" ${st(2.5)}/><path d="M0 -20 C4 -26 8 -26 6 -30" fill="none" ${st(2.5)}/>`;
  if (key === "salsa") s += `<circle cx="-8" cy="-6" r="2.4" fill="#8CC152"/><circle cx="8" cy="-4" r="2.4" fill="#F4E6F1"/>`;
  if (key === "avocado") s += `<circle cx="-6" cy="-6" r="2.4" fill="#E8503C"/>`;
  return s;
}
function srvDollopScene(name, foods, steps, base, spots, dur = 2.6) {
  LIB.add({ cat: "serve", name, foods, steps, dur,
    draw(t, F, key) {
      const p = t / dur, n = spots.length, span = 0.84 / n;
      let s = counter() + base(), spoonAt = null;
      spots.forEach(([x, y], i) => {
        const q = (p - 0.04 - i * span) / span;
        if (q >= 0.45) s += `<g opacity="${srvFade(p)}">${g(srvDollopShape(key), x, y, 1.2)}</g>`;
        if (q >= 0 && q < 1) spoonAt = [x, y, q];
      });
      if (!spoonAt) { const [x, y] = spots[p < 0.5 ? 0 : n - 1]; spoonAt = [x, y, p < 0.5 ? 0 : 1]; }
      const [x, y, q] = spoonAt, down = q < 0.45 ? Math.sin(q / 0.45 * Math.PI / 2) : Math.cos((q - 0.45) / 0.55 * Math.PI / 2);
      const sy = lerp(92, y - 14, down), tip = q > 0.35 && q < 0.6 ? -25 : 0;
      s += srvSpoon(x - 4, sy, null, tip);
      return q < 0.45 ? s + g(srvDollopShape(key), x - 4, sy - 4, 0.75) : s;
    } });
}
srvDollopScene("dollopchili", ["sourcream", "yogurt"], ["Top each bowl with a dollop of sour cream", "Serve warm with sour cream", "Add a dollop of yogurt"],
  () => srvBowl(180, 132, 100, "#8A3A22", srvSpecks([[130, 130], [170, 124], [210, 136], [236, 128], [156, 140], [196, 128]], "#5A2418", 5)), [[180, 134]]);
srvDollopScene("dolloptacos", ["sourcream", "salsa", "avocado"], ["Top the tacos with a spoonful of salsa", "Add a dollop of sour cream to each taco", "Top with guacamole"],
  () => srvTacos(), SRV_TACO_X.map(x => [x, 140]), 3.6);
srvDollopScene("dollopdessert", ["whippedcream"], ["Serve with a dollop of whipped cream", "Top each slice with whipped cream"], srvPieSlice, [[184, 128]]);
srvDollopScene("dolloppotato", ["sourcream", "butter"], ["Top the potatoes with butter and sour cream", "Split the potatoes and add a pat of butter"], srvPotato, [[180, 150]]);

// ---------- Drizzle in a zigzag ----------
function srvDrizzleScene(name, foods, steps, base, area, opt = {}) {
  const dur = opt.dur || 2.8;
  LIB.add({ cat: "serve", name, foods, steps, dur,
    draw(t, F, key) {
      const p = t / dur, c = F.liquid || F.inner, [x0, x1, yc, amp] = area, w = opt.w || 5;
      const at = (q) => [lerp(x0, x1, q), yc + Math.sin(q * Math.PI * 9) * amp * Math.sqrt(Math.max(0, 1 - ((q - 0.5) * 2) ** 2 * 0.6))];
      const pour = clamp((p - 0.06) / 0.72), pts = [];
      for (let i = 0; i <= 60; i++) { const q = i / 60 * pour; pts.push(at(q)); }
      const d = "M" + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L");
      let s = counter() + base(key);
      if (pour > 0) s += `<g opacity="${srvFade(p)}"><path d="${d}" fill="none" stroke="${INK}" stroke-width="${w + 4}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/></g>`;
      const [hx, hy] = at(pour), sx = hx, sy = 96, pouring = p > 0.06 && p < 0.78;
      if (pouring) s += `<path d="M${sx} ${sy} L${hx} ${hy}" stroke="${INK}" stroke-width="${w + 1}" stroke-linecap="round"/><path d="M${sx} ${sy} L${hx} ${hy}" stroke="${c}" stroke-width="${w - 2}" stroke-linecap="round"/>`;
      return s + srvBottle(sx, sy - 2, opt.tilt || 180, c);
    } });
}
srvDrizzleScene("drizzlemain", ["sauce", "bbq", "hotsauce", "pestosauce", "gravy"],
  ["Serve on a plate and drizzle the sauce on top", "For more heat, drizzle with a little extra buffalo sauce", "Drizzle with the pesto"],
  () => srvPlate() + `<path d="M96 178 C96 140 260 136 266 170 C268 192 100 200 96 178 Z" fill="#D99A5B" ${st()}/><path d="M120 164 L150 156 M170 160 L210 150 M220 166 L248 158" stroke="#B5703A" stroke-width="5" stroke-linecap="round"/>`,
  [104, 256, 166, 9]);
srvDrizzleScene("drizzlesweet", ["syrup", "maple", "honey", "caramel", "meltedchocolate"],
  ["Drizzle with maple syrup and serve", "Serve warm drizzled with honey", "Drizzle the caramel over the top"],
  () => srvPancakes(), [116, 244, 134, 9], { tilt: 150 });
srvDrizzleScene("drizzlesalad", ["dressing", "oil", "balsamic"],
  ["Drizzle the dressing over the salad", "Drizzle with olive oil and balsamic"],
  () => srvSaladBowl(), [118, 242, 118, 8], { tilt: 150, w: 4 });
srvDrizzleScene("drizzlesoup", ["cream", "oil", "pestosauce"],
  ["Ladle the soup into bowls, drizzle with more cream if desired, and serve", "Finish with a drizzle of olive oil"],
  () => srvBowl(180, 132, 100, "#E8A23C"), [112, 248, 133, 8], { tilt: 150, w: 4 });
srvDrizzleScene("drizzlepizza", ["oil", "honey", "hotsauce"],
  ["Drizzle the pizza with olive oil", "Drizzle with hot honey before serving"],
  () => srvPizza(true), [74, 286, 174, 18], { tilt: 150, w: 4 });

// ---------- Black pepper from a mill ----------
const SRV_PEPPER_BASES = {
  spaghetti: [() => srvPlate() + srvPastaMound(), srvPastaLand],
  steak: [() => srvPlate() + srvMain("steak"), srvEll(180, 160, 54, 16)],
  egg: [() => srvPlate() + [[-48, 4], [46, -2]].map(([x, y]) => `<path transform="translate(${180 + x} ${172 + y})" d="M-40 0 C-44 -18 -14 -24 0 -20 C20 -26 44 -14 40 2 C36 18 -36 18 -40 0 Z" fill="#fff" ${st(3.5)}/><circle cx="${180 + x}" cy="${168 + y}" r="12" fill="#F7C94B" ${st(3)}/>`).join(""), (x, i) => { const cx = x < 180 ? 132 : 226; return [cx + (srvFrac(i * 3) - 0.5) * 60, 170 + (srvFrac(i * 7) - 0.5) * 18]; }],
  greens: [() => srvSaladBowl(), srvSaladLand],
  soup: [() => srvBowl(180, 132, 100, "#E8A23C"), srvEll(180, 133, 88, 15)],
};
LIB.add({ cat: "serve", name: "crackpepper", foods: Object.keys(SRV_PEPPER_BASES), dur: 2.6,
  steps: ["Serve right away, topping with freshly ground pepper", "Finish with a few cracks of black pepper", "Season with freshly ground black pepper to serve"],
  draw(t, F, key) {
    const [base, land] = SRV_PEPPER_BASES[key];
    const r = srvRain(t, 2.6, "pepperground", { x0: 140, x1: 220, yHand: 112, land, n: 30, k: 1.1 });
    return counter() + base() + r.bits + srvGrinder(r.x, 80, t);
  } });

// ---------- Fine grater (microplane) over a dish ----------
LIB.add({ cat: "serve", name: "microplane", foods: ["parmesan", "chocolate"], dur: 2.4,
  steps: ["Grate parmesan over the pasta", "Finish with finely grated Parmesan", "Grate chocolate over the top"],
  draw(t, F, key) {
    const p = t / 2.4, rub = Math.sin(t / 2.4 * Math.PI * 8), bx = 180 + rub * 40;
    let s = counter() + (key === "chocolate" ? srvPieSlice() + g(srvDollopShape("whippedcream"), 184, 128, 1.3) : srvPlate() + srvPastaMound());
    let d = "";
    const yl = key === "chocolate" ? 118 : 150;
    for (let i = 0; i < 26; i++) { const q0 = lerp(0.02, 0.8, i / 26); if (p < q0) continue; const x = 150 + srvFrac(i) * 70, y = p < q0 + 0.1 ? lerp(96, yl + srvFrac(i * 7) * 12, (p - q0) / 0.1) : yl + srvFrac(i * 7) * 12;
      d += `<path transform="translate(${x} ${y}) rotate(${i * 50})" d="M-5 0 C-2 -3 2 2 5 -1" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><path transform="translate(${x} ${y}) rotate(${i * 50})" d="M-5 0 C-2 -3 2 2 5 -1" fill="none" stroke="${F.inner}" stroke-width="2" stroke-linecap="round"/>`; }
    s += `<g opacity="${srvFade(p)}">${d}</g>`;
    s += g(`<rect x="-90" y="-8" width="150" height="16" rx="4" fill="${C.steel}" ${st(3)}/>${[...Array(10)].map((_, i) => `<path d="M${-80 + i * 13} -3 l5 0 M${-76 + i * 13} 3 l5 0" stroke="${C.steelDark}" stroke-width="2" stroke-linecap="round"/>`).join("")}<rect x="58" y="-7" width="54" height="14" rx="6" fill="#3B3B3B" ${st(3)}/>${g(fist(), 90, 0)}`, 170, 86, 1, -8);
    return s + g(`<g transform="scale(.55)">${whole(F)}</g>`, bx, 60) + g(fist(), bx + 6, 36, 0.9);
  } });

// ---------- Squeeze citrus over food ----------
function srvSqueezeScene(name, foods, steps, base, land) {
  LIB.add({ cat: "serve", name, foods, steps, dur: 2.4,
    draw(t, F) {
      const p = t / 2.4, hx = lerp(140, 220, (1 - Math.cos(p * Math.PI * 2)) / 2);
      let s = counter() + base();
      for (let i = 0; i < 6; i++) { const q = (p * 2 + i / 6) % 1, [lx, ly] = land(hx + (srvFrac(i) - 0.5) * 20, i); s += srvDrop(lerp(hx + (i - 2.5) * 6, lx, q), lerp(90, ly, q), F.inner, 1.2); }
      return s + srvCitrus(hx, 84, t, F, 2.6);
    } });
}
srvSqueezeScene("squeezetacos", ["lime", "lemon"], ["Squeeze lime over the tacos", "Top with chicken, drizzle with sour cream, squeeze over lime juice"], () => srvTacos(), srvTacoLand());
srvSqueezeScene("squeezefish", ["lemon", "lime"], ["Squeeze lemon juice over the fish", "Serve with a squeeze of lemon"], srvFish, srvEll(180, 166, 54, 14));
srvSqueezeScene("squeezebowl", ["lime", "lemon"], ["Garnish with coriander leaves and squeeze some lemon juice", "Squeeze lime over each bowl"], () => srvBowl(180, 132, 100, "#E8A23C"), srvEll(180, 133, 88, 15));

// ---------- Spoon sauce over the main ----------
const SRV_SAUCE = { meatballs: "#D9402E", spaghetti: "#D9402E", salmon: "#F2D27A", fish: "#F2D27A", shrimp: "#F2D27A" };
LIB.add({ cat: "serve", name: "spoonsauce", foods: ["chicken", "salmon", "fish", "steak", "porkchop", "tofu", "meatballs", "shrimp", "spaghetti"], dur: 2.8,
  steps: ["Spoon the sauce over the chicken", "Divide the sliced chicken between two plates, pour over the sauce", "Immediately transfer steak to a plate and pour pan juices on top", "Spoon the sauce over the fish and serve"],
  draw(t, F, key) {
    const p = t / 2.8, c = SRV_SAUCE[key] || "#9C5A2A";
    const pour = clamp((p - 0.3) / 0.4), spread = ease(pour) * 0.78;
    let s = counter() + srvPlate() + srvMain(key);
    if (spread > 0) s += `<g opacity="${srvFade(p)}"><path d="M${180 - 50 * spread} 160 C${180 - 46 * spread} ${150 - 14 * spread} ${180 + 46 * spread} ${150 - 14 * spread} ${180 + 50 * spread} 160 C${180 + 56 * spread} ${172 + 6 * spread} ${180 - 56 * spread} ${172 + 6 * spread} ${180 - 50 * spread} 160 Z" fill="${c}" ${st(2.5)} opacity=".95"/><path d="M${170 - 20 * spread} 154 l${18 * spread} -3" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/></g>`;
    const come = p < 0.3 ? ease(p / 0.3) : p < 0.72 ? 1 : 1 - ease((p - 0.72) / 0.28), tilt = p > 0.28 && p < 0.72 ? -40 : 0;
    const x = lerp(300, 200, come), y = lerp(70, 112, come);
    if (p > 0.3 && p < 0.7) s += FX.stream(x - 14, y + 4, 180, 154, c, 5);
    return s + srvSpoon(x, y, p < 0.7 ? c : null, tilt);
  } });

// ---------- Serve over rice / noodles ----------
function srvOverScene(name, foods, steps, base, top) {
  LIB.add({ cat: "serve", name, foods, steps, dur: 2.8,
    draw(t, F, key) {
      const p = t / 2.8, liquid = !!F.liquid;
      let s = counter() + base();
      const come = p < 0.25 ? ease(p / 0.25) : p < 0.7 ? 1 : 1 - ease((p - 0.7) / 0.3);
      const amt = ease(clamp((p - 0.25) / 0.4)), fx = lerp(290, 196, come), fy = lerp(60, top - 34, come);
      if (amt > 0) {
        if (liquid) s += `<g opacity="${srvFade(p)}"><path d="M${180 - 70 * amt} ${top + 12 * amt} C${180 - 60 * amt} ${top - 22 * amt} ${180 + 60 * amt} ${top - 22 * amt} ${180 + 70 * amt} ${top + 12 * amt} C${180 + 40 * amt} ${top + 20 * amt} ${180 - 40 * amt} ${top + 20 * amt} ${180 - 70 * amt} ${top + 12 * amt} Z" fill="${F.liquid}" ${st(2.5)}/>
          ${key === "curry" || key === "stew" ? [[-30, 0], [6, -8], [34, 2], [-6, 8]].map(([dx, dy], i) => `<path transform="translate(${180 + dx * amt} ${top + dy * amt})" d="M-7 -5 L5 -7 L8 3 L1 7 L-7 4 Z" fill="${i % 2 ? "#F4E3B0" : shade(F.liquid)}" ${st(1.8)}/>`).join("") : ""}</g>`;
        else { let b = ""; const n = Math.floor(amt * 9); for (let i = 0; i < n; i++) b += key === "meatballs" ? (i < 5 ? `<circle cx="${[140, 180, 220, 160, 200][i]}" cy="${[top + 2, top - 2, top + 2, top - 18, top - 18][i]}" r="15" fill="${F.cooked}" ${st(2.6)}/>` : "") : morsel(F, i, 140 + (i * 31) % 84, top - 2 - (i * 17) % 22, i * 40, 1); s += `<g opacity="${srvFade(p)}">${b}</g>`; }
      }
      if (liquid) { if (p > 0.27 && p < 0.66) s += FX.stream(fx - 22, fy + 6, 176, top - 10, F.liquid, 6); return s + srvLadle(fx, fy, p > 0.25 && p < 0.68 ? -60 : 0, p < 0.66 ? F.liquid : null); }
      return s + srvSpoon(fx, fy + 6, p < 0.3 ? shade(F.cooked || F.inner) : null, p > 0.25 && p < 0.68 ? -40 : 0);
    } });
}
const srvRiceMound = () => srvBowl(180, 140, 110, "#FBF8EE", `<path d="M90 142 C104 96 256 96 270 142 Z" fill="#FBF8EE" ${st(3)}/>` + [[130, 128], [160, 114], [200, 112], [226, 126], [180, 130], [146, 134]].map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="4" ry="2.4" fill="#fff" ${st(1.2)} transform="rotate(${i * 50} ${x} ${y})"/>`).join(""));
srvOverScene("overrice", ["curry", "stew", "chicken", "beef", "shrimp", "tofu", "veggies"],
  ["Serve over rice", "Plate over rice, and drizzle the remaining sauce over the tofu", "You can also serve it over steamed rice with the sauce drizzled on top", "Serve the curry over basmati rice"],
  srvRiceMound, 114);
srvOverScene("overnoodles", ["tomatosauce", "alfredo", "stew", "gravy", "meatballs"],
  ["Serve over pasta or egg noodles", "Serve over spaghetti", "Spoon the sauce over the noodles"],
  () => srvPlate() + srvPastaMound(180, 160, "#F2D27A", null), 140);

// ---------- Serve with wedges on the side ----------
const srvWedge = (F, x, y, r = 0, k = 1) => g(`<path d="M-24 0 C-24 -24 24 -24 24 0 Z" fill="${F.fill}" ${st(3)}/><path d="M-18 -2 C-18 -17 18 -17 18 -2 Z" fill="${F.inner}"/><path d="M0 -2 L0 -16 M-10 -3 L-14 -12 M10 -3 L14 -12" stroke="${F.fill}" stroke-width="2"/><path d="M-24 0 L24 0" ${st(3)}/>`, x, y, k, r);
LIB.add({ cat: "serve", name: "withwedges", foods: ["lemon", "lime"], dur: 2.6,
  steps: ["Serve with lemon wedges", "Serve with the rice, salad and lime wedges for squeezing over", "Serve with lime wedges on the side"],
  draw(t, F) {
    const p = t / 2.6;
    let s = counter() + srvPlate() + srvMain("fish", 150, 172, 0.85);
    [[256, 186, -10], [270, 168, 14]].forEach(([x, y, r], i) => {
      const q = clamp((p - 0.06 - i * 0.34) / 0.3), y0 = lerp(70, y, ease(q));
      if (q > 0) s += `<g opacity="${srvFade(p)}">${srvWedge(F, x, y0, r)}</g>`;
      if (q > 0 && q < 1) s += T.pinch(x, y0 - 30, 1);
    });
    if (p > 0.7) s += T.pinch(270, lerp(138, 60, ease(clamp((p - 0.7) / 0.2))), 1);
    return s;
  } });

// ---------- Divide among bowls ----------
const SRV_DIV_X = [72, 180, 288];
function srvSmallBowl(x, amt, key, F) {
  const cy = 166;
  let s = `<path d="M${x - 50} ${cy} C${x - 46} ${cy + 52} ${x + 46} ${cy + 52} ${x + 50} ${cy} Z" fill="#fff" ${st()}/><ellipse cx="${x}" cy="${cy}" rx="50" ry="11" fill="#fff" ${st(3.5)}/>`;
  if (amt <= 0) return s;
  if (F.liquid) return s + `<ellipse cx="${x}" cy="${cy + 1}" rx="${42 * Math.sqrt(amt)}" ry="${7 * Math.sqrt(amt)}" fill="${F.liquid}" ${st(2)}/>`;
  const h = 26 * amt;
  if (F.type === "noodles" || key === "spaghetti") return s + `<path d="M${x - 40} ${cy + 2} C${x - 34} ${cy - h} ${x + 34} ${cy - h} ${x + 40} ${cy + 2} Z" fill="${F.fill}" ${st(2.5)}/>` + [0, 1, 2].map(j => `<path d="M${x - 30 + j * 6} ${cy - 2} C${x - 10} ${cy - h * 0.8} ${x + 10} ${cy} ${x + 28 - j * 4} ${cy - h * 0.5 + j * 4}" fill="none" stroke="${shade(F.fill)}" stroke-width="2.6"/>`).join("");
  if (F.type === "leafy") return s + [-24, 0, 24, -12, 12].map((dx, j) => `<path transform="translate(${x + dx} ${cy - 4 - (j > 2 ? h * 0.5 : 0)}) rotate(${j * 50 - 50})" d="M-14 0 C-10 -11 10 -11 14 0 C10 8 -10 8 -14 0 Z" fill="${j % 2 ? F.inner : F.fill}" ${st(2)} opacity="${clamp(amt * 3 - j * 0.4)}"/>`).join("");
  return s + `<path d="M${x - 40} ${cy + 2} C${x - 34} ${cy - h} ${x + 34} ${cy - h} ${x + 40} ${cy + 2} Z" fill="${F.fill === "#FBF8EE" ? "#FBF8EE" : F.fill}" ${st(2.5)}/>`;
}
LIB.add({ cat: "serve", name: "dividebowls", foods: ["soup", "stew", "curry", "broth", "noodles", "ramen", "spaghetti", "whiterice", "greens"], dur: 3.6,
  steps: ["Divide between bowls.", "Remove from heat, season with salt if needed, and divide into bowls.", "Ladle the soup into bowls", "Divide the noodles among bowls"],
  draw(t, F, key) {
    const p = t / 3.6, liquid = !!F.liquid;
    let s = counter(), tx = SRV_DIV_X[0], pour = 0;
    SRV_DIV_X.forEach((x, i) => {
      const q = clamp((p - 0.04 - i * 0.28) / 0.26);
      s += `<g opacity="${q > 0 ? srvFade(p) : 1}">${srvSmallBowl(x, ease(clamp((q - 0.3) / 0.6)), key, F)}</g>`;
      if (p >= 0.04 + i * 0.28) { tx = x; pour = q; }
    });
    // tool slides from bowl to bowl, dips when pouring
    const prev = SRV_DIV_X[Math.max(0, SRV_DIV_X.indexOf(tx) - 1)], slide = ease(clamp(pour / 0.25));
    let x = lerp(prev, tx, slide); if (p > 0.88) x = lerp(SRV_DIV_X[2], SRV_DIV_X[0], ease((p - 0.88) / 0.12));
    const working = pour > 0.25 && pour < 0.95;
    if (liquid) return s + (working ? FX.stream(x - 20, 118, x, 160, F.liquid, 6) : "") + srvLadle(x + 4, 108, working ? -55 : 0, working ? F.liquid : null);
    if (key === "whiterice") return s + srvSpoon(x + 4, working ? 136 : 110, working ? null : "#FBF8EE", working ? -30 : 0);
    const T0 = T.tongs(x, working ? 120 : 104, 0, working ? 0.2 : 0.6);
    return s + (working ? "" : "") + T0 + (pour < 0.6 && pour > 0 ? `<path d="M${x - 14} ${104} C${x - 10} 128 ${x + 10} 128 ${x + 14} 104" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M${x - 14} 104 C${x - 10} 128 ${x + 10} 128 ${x + 14} 104" fill="none" stroke="${F.fill}" stroke-width="4" stroke-linecap="round"/>` : "");
  } });

// ---------- Fan of slices on a platter ----------
const SRV_SLICE = {
  steak: ["#5A2E1A", "#D9706A"], chicken: ["#D99A5B", "#FBF1E4"], pork: ["#C98B5E", "#F6E6D6"], turkey: ["#B5733A", "#FBF1E4"], lamb: ["#5A2E1A", "#C9605A"],
  tomato: ["#E8503C", "#F07A62"], orange: ["#F59E3A", "#F8C27A"], cucumber: ["#3E8E41", "#CDE8B0"], mozzarella: ["#FFFFFF", "#FBF8EE"], apple: ["#D9443A", "#FBF1D4"],
};
function srvSlice(key, x, y, r = 0, k = 1) {
  const [o, i] = SRV_SLICE[key];
  const meat = ["steak", "lamb", "chicken", "pork", "turkey"].includes(key);
  let s = meat ? `<rect x="-15" y="-27" width="30" height="54" rx="11" fill="${o}" ${st(2.8)}/><rect x="-9" y="-21" width="18" height="42" rx="7" fill="${i}"/>`
    : `<ellipse rx="26" ry="15" fill="${o}" ${st(2.8)}/><ellipse rx="22" ry="12" fill="${i}"/>`;
  if (key === "tomato") s += [[-8, -2], [6, 3], [0, -5]].map(([a, b]) => `<ellipse cx="${a}" cy="${b}" rx="3" ry="2" fill="#F7D27A"/>`).join("");
  if (key === "orange") s += [0, 60, 120].map(a => `<path d="M0 0 L${Math.cos(a * Math.PI / 180) * 20} ${Math.sin(a * Math.PI / 180) * 10} M0 0 L${-Math.cos(a * Math.PI / 180) * 20} ${-Math.sin(a * Math.PI / 180) * 10}" stroke="#F59E3A" stroke-width="1.6"/>`).join("");
  if (key === "cucumber") s += `<ellipse rx="9" ry="5" fill="none" stroke="#9BCB6A" stroke-width="2"/>`;
  return g(s, x, y, k, r);
}
LIB.add({ cat: "serve", name: "fanslices", foods: Object.keys(SRV_SLICE), dur: 3.2,
  steps: ["Arrange the slices on a platter", "Slice and fan out on a serving plate", "Arrange tomato and mozzarella slices, overlapping, on a platter", "Carve and serve."],
  draw(t, F, key) {
    const p = t / 3.2, n = 7;
    let s = counter() + `<ellipse cx="180" cy="190" rx="150" ry="30" fill="#E4E0D6" ${st()}/><ellipse cx="180" cy="186" rx="150" ry="30" fill="#fff" ${st()}/>`;
    let hand = null;
    for (let i = 0; i < n; i++) {
      const meat = ["steak", "lamb", "chicken", "pork", "turkey"].includes(key), q = clamp((p - 0.04 - i * 0.1) / 0.1), x = (meat ? 100 : 84) + i * (meat ? 26 : 32), y = (meat ? 178 : 184) - Math.sin(i / (n - 1) * Math.PI) * 14;
      if (q <= 0) continue;
      const yy = lerp(126, y, ease(q));
      s += `<g opacity="${srvFade(p)}">${srvSlice(key, x, yy, meat ? 50 - i * 4 : -20 + i * 6, meat ? 0.9 : 1.05)}</g>`;
      if (q < 1) hand = [x, yy];
    }
    if (hand) s += T.tongs(hand[0] + 4, hand[1] - 6, 0, 0.15);
    else s += T.tongs(p > 0.5 ? lerp(276, 100, ease(clamp((p - 0.8) / 0.18))) : 100, 120, 0, 0.5);
    return s;
  } });

// ---------- Twirl pasta with tongs onto the plate ----------
function srvNest(x, y, color, spin, k = 1) {
  let s = "";
  for (let i = 0; i < 4; i++) { const yy = -i * 9, rx = 34 - i * 5, a = (spin * 360 + i * 70) % 360;
    s += `<ellipse cx="0" cy="${yy}" rx="${rx}" ry="10" fill="${i === 0 ? color : "none"}" stroke="${INK}" stroke-width="7"/><ellipse cx="0" cy="${yy}" rx="${rx}" ry="10" fill="none" stroke="${color}" stroke-width="3.6"/>
      <path d="M${Math.cos(a * Math.PI / 180) * rx} ${yy + Math.sin(a * Math.PI / 180) * 10} l0 0" stroke="${shade(color)}" stroke-width="5" stroke-linecap="round"/>`; }
  return g(s, x, y, k);
}
LIB.add({ cat: "serve", name: "twirlpasta", foods: ["spaghetti", "noodles", "ricenoodles"], dur: 3,
  steps: ["Using tongs, twirl the pasta into a nest on each plate", "Twirl the noodles and plate"],
  draw(t, F, key) {
    const p = t / 3, c = key === "ricenoodles" ? "#FBF8EE" : "#F2D27A";
    const lower = ease(clamp((p - 0.45) / 0.3)), y = lerp(136, 176, lower);
    let s = counter() + srvPlate(180, 192, 130, 30);
    const op = srvFade(p);
    s += `<g opacity="${p > 0.75 ? op : 1}">${srvNest(180, y, c, p * 3, 1.2)}</g>`;
    // a few loose strands hang from the tongs while twisting
    if (p < 0.45) s += `<path d="M168 ${y - 30} C162 ${y - 10} 172 ${y + 6} 166 ${y + 18} M192 ${y - 30} C198 ${y - 6} 188 ${y + 8} 194 ${y + 16}" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M168 ${y - 30} C162 ${y - 10} 172 ${y + 6} 166 ${y + 18} M192 ${y - 30} C198 ${y - 6} 188 ${y + 8} 194 ${y + 16}" fill="none" stroke="${c}" stroke-width="3.6" stroke-linecap="round"/>`;
    return s + (p < 0.8 ? g(T.tongs(0, 0, 0, 0.1), 176, y - 30, 1, Math.sin(p * Math.PI * 6) * 20) : T.tongs(200, lerp(146, 120, ease((p - 0.8) / 0.2)), 0, 0.6));
  } });

// ---------- Building things ----------
// One morsel of a cooked filling (tacos, wraps, lettuce cups).
function srvFill(key, x, y, i, k = 1) {
  const F = foodFor(key), c = F.cooked || F.fill, r = (i * 53) % 360;
  if (key === "groundbeef" || key === "groundturkey" || key === "groundpork") return `<circle cx="${x}" cy="${y}" r="${7 * k}" fill="${c}" ${st(2)}/>`;
  if (key === "blackbeans" || key === "chickpeas") return `<ellipse cx="${x}" cy="${y}" rx="${6 * k}" ry="${4 * k}" fill="${F.inner}" ${st(1.8)} transform="rotate(${r} ${x} ${y})"/>`;
  if (key === "shrimp") return g(whole(F, 1), x, y, 0.2 * k, r);
  if (key === "steak" || key === "pork" || key === "lamb") return bit(F, "strip", x, y, r, 1);
  if (key === "fish") return `<path transform="translate(${x} ${y}) rotate(${r}) scale(${k})" d="M-9 -5 L7 -7 L10 3 L0 7 L-9 4 Z" fill="#F4E3C8" ${st(2)}/>`;
  if (key === "tofu") return `<rect x="${x - 7 * k}" y="${y - 6 * k}" width="${14 * k}" height="${12 * k}" rx="2" fill="#E2B66A" ${st(2)}/>`;
  if (key === "egg") return `<path transform="translate(${x} ${y}) rotate(${r}) scale(${k})" d="M-9 -4 C-6 -9 6 -9 9 -3 C8 5 -6 7 -9 -4 Z" fill="#F7D84B" ${st(2)}/>`;
  if (key === "whiterice") return `<ellipse cx="${x}" cy="${y}" rx="${5 * k}" ry="${3 * k}" fill="#FBF8EE" ${st(1.4)}/>`;
  if (F.type === "leafy") return piece(F, "bit", x, y, r, 2 * k);
  if (key === "cheese") return srvBit("cheese", x, y, i, 1.4 * k);
  if (key === "mushroom") return srvBit("mushroom", x, y, i, 1.3 * k);
  if (key === "turkey") return bit({ ...F, inner: "#F4E3C8", cooked: "#F1DEC4" }, "strip", x, y, r, 1);
  return bit(F, "cube", x, y, r, 1);
}

// Burger stack.
LIB.add({ cat: "serve", name: "burger", foods: ["patty", "turkeypatty", "veggiepatty"], dur: 3.4,
  steps: ["Build the burgers: bun, patty, cheese, lettuce, tomato, top bun", "Serve on buns", "Place the patties on the buns and add toppings"],
  draw(t, F) {
    const p = t / 3.4, pc = mixColor(F.fill, F.cooked, 1);
    let s = counter() + srvPlate(180, 200, 120, 18) + `<path d="M108 182 L252 182 L250 196 C230 204 130 204 110 196 Z" fill="#D9A55B" ${st()}/><path d="M108 182 L252 182" stroke="#F6E3B8" stroke-width="5"/>`;
    const layers = [
      [20, (y) => `<path d="M104 ${y} C104 ${y - 22} 256 ${y - 22} 256 ${y} C256 ${y + 4} 104 ${y + 4} 104 ${y} Z" fill="${pc}" ${st()}/><path d="M124 ${y - 8} l10 -2 M170 ${y - 12} l12 0 M220 ${y - 8} l10 2" stroke="${shade(pc)}" stroke-width="3" stroke-linecap="round"/>`],
      [6, (y) => `<path d="M110 ${y - 4} L250 ${y - 4} L244 ${y + 2} L230 ${y + 14} L222 ${y + 2} L140 ${y + 2} L130 ${y + 14} L118 ${y + 2} Z" fill="#F7C94B" ${st(3)}/>`],
      [10, (y) => `<path d="M100 ${y} C110 ${y - 12} 120 ${y + 6} 132 ${y - 6} C144 ${y - 14} 152 ${y + 4} 166 ${y - 6} C178 ${y - 14} 188 ${y + 4} 200 ${y - 6} C212 ${y - 14} 222 ${y + 4} 234 ${y - 6} C246 ${y - 14} 254 ${y + 4} 260 ${y} L256 ${y + 4} L104 ${y + 4} Z" fill="#8CC152" ${st(3)}/>`],
      [10, (y) => [140, 220].map(x => `<rect x="${x - 38}" y="${y - 10}" width="76" height="12" rx="5" fill="#E8503C" ${st(3)}/>`).join("")],
      [34, (y) => `<path d="M106 ${y} C106 ${y - 52} 254 ${y - 52} 254 ${y} Z" fill="#D9A55B" ${st()}/>${[[150, y - 22], [180, y - 30], [212, y - 22], [196, y - 14], [164, y - 14]].map(([a, b]) => `<ellipse cx="${a}" cy="${b}" rx="3.5" ry="2" fill="#FBF4DC" ${st(1.2)}/>`).join("")}`],
    ];
    let y = 182;
    layers.forEach(([h, draw], i) => {
      const q = clamp((p - 0.04 - i * 0.15) / 0.13);
      if (q > 0) { const yy = lerp(30 + h, y, ease(q)); s += `<g opacity="${srvFade(p)}">${draw(yy)}</g>`; if (q < 1) s += T.pinch(180, yy - h - 22, 1); }
      y -= h;
    });
    return s;
  } });

// Filling on a bun, then the top bun.
LIB.add({ cat: "serve", name: "onbun", foods: ["groundbeef", "pork", "chicken"], dur: 3,
  steps: ["Serve on buns", "Pile the pulled pork onto buns", "Spoon the sloppy joe mixture onto the buns"],
  draw(t, F, key) {
    const p = t / 3;
    let s = counter() + srvPlate(180, 200, 120, 18) + `<path d="M112 184 L248 184 L246 196 C228 204 132 204 114 196 Z" fill="#D9A55B" ${st()}/>`;
    let pile = "";
    for (let i = 0; i < 16; i++) { const q = clamp((p - 0.08 - Math.floor(i / 8) * 0.22) / 0.1); if (q <= 0) continue; pile += key === "groundbeef" ? srvFill(key, 124 + (i * 23) % 112, 176 - (i % 3) * 8 - Math.floor(i / 8) * 8, i, 1.2) : bit({ ...F, inner: "#E8C4A0" }, "strip", 124 + (i * 23) % 112, 176 - (i % 3) * 8 - Math.floor(i / 8) * 8, (i * 47) % 180, 1); }
    s += `<g opacity="${srvFade(p)}">${pile}</g>`;
    const spoonQ = p < 0.52 ? (p % 0.22) / 0.22 : 1;
    if (p < 0.5) s += srvSpoon(lerp(250, 186, Math.sin(spoonQ * Math.PI)), lerp(90, 150, Math.sin(spoonQ * Math.PI)), spoonQ < 0.5 ? (F.cooked || F.fill) : null, spoonQ > 0.4 && spoonQ < 0.7 ? -30 : 0);
    const tq = clamp((p - 0.55) / 0.15);
    if (tq > 0) { const yy = lerp(60, 164, ease(tq)); s += `<g opacity="${srvFade(p)}"><path d="M110 ${yy} C110 ${yy - 50} 250 ${yy - 50} 250 ${yy} Z" fill="#D9A55B" ${st()}/></g>`; if (tq < 1) s += T.pinch(180, yy - 58, 1); }
    return s;
  } });

// Spoon filling into one big taco.
LIB.add({ cat: "serve", name: "buildtacos", foods: ["groundbeef", "chicken", "fish", "shrimp", "pork", "steak", "blackbeans"], dur: 3,
  steps: ["Spoon the filling into the tortillas", "Assemble tacos: fill each tortilla with the meat", "Serve the salmon in large flakes with the tortillas"],
  draw(t, F, key) {
    const p = t / 3;
    let s = counter() + srvPlate(180, 200, 130, 20);
    let pile = "";
    for (let i = 0; i < 18; i++) { const q = clamp((p - 0.1 - Math.floor(i / 6) * 0.2) / 0.08); if (q <= 0) continue; pile += srvFill(key, 130 + (i * 29) % 100, 132 - (i % 3) * 6 - Math.floor(i / 6) * 4, i, 1.3); }
    s += `<g opacity="${srvFade(p)}">${pile}</g>`;
    s += `<path d="M110 128 C104 230 256 230 250 128 C228 150 132 150 110 128 Z" fill="#F1D9A0" ${st()}/>${[[150, 176], [206, 186], [176, 200]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="4" fill="#D9B06A"/>`).join("")}`;
    const q = (p % 0.2) / 0.2, on = p > 0.06 && p < 0.7, dip = on ? Math.sin(q * Math.PI) : 0;
    return s + srvSpoon(lerp(250, 196, dip), lerp(80, 118, dip), q < 0.5 && on ? (F.cooked || F.inner) : null, dip > 0.6 ? -35 : 0);
  } });

// Top-view rolling: burrito, wrap, spring roll. Tortilla circle at 180,124.
function srvRollScene(name, foods, steps, opt) {
  LIB.add({ cat: "serve", name, foods, steps, dur: opt.dur || 3.6,
    draw(t, F, key) {
      const p = t / this.dur, cx = 180, cy = 124, R = 92, wrap = opt.wrap || "#F1D9A0";
      let s = counter() + board();
      const fillIn = clamp((p - 0.04) / 0.2), fold = opt.folds ? ease(clamp((p - 0.28) / 0.16)) : 0, roll = ease(clamp((p - (opt.folds ? 0.48 : 0.32)) / 0.32));
      const yEdge = lerp(cy + R - 0.01, cy - R + 26, roll), op = srvFade(p);
      const fx0 = 124, fx1 = 236, fy0 = 108, fy1 = 142, base = s;
      s = "";
      // flat part above the rolled edge
      if (roll < 0.99) {
        const w = Math.sqrt(Math.max(0, R * R - (yEdge - cy) ** 2)), big = yEdge > cy ? 1 : 0;
        s += `<g opacity="${op}">` + (roll <= 0 ? `<circle cx="${cx}" cy="${cy}" r="${R}" fill="${wrap}" ${st()} ${opt.see ? `fill-opacity=".75"` : ""}/>` : `<path d="M${cx - w} ${yEdge} A${R} ${R} 0 ${big} 1 ${cx + w} ${yEdge} Z" fill="${wrap}" ${st()} ${opt.see ? `fill-opacity=".75"` : ""}/>`);
        if (fillIn > 0) { const n = Math.floor(fillIn * 16); let f = opt.under ? opt.under(fx0, fx1, fy0, Math.min(fy1, yEdge - 4)) : ""; for (let i = 0; i < n; i++) { const y = fy0 + 6 + (i * 13) % (fy1 - fy0 - 10); if (y < yEdge - 6) f += srvFill(key, fx0 + 8 + (i * 37) % (fx1 - fx0 - 16), y, i, 1.2); } s += f; }
        // side flaps fold over the filling
        if (fold > 0 && roll < 0.5) [-1, 1].forEach(d => { const x = cx + d * lerp(R, 54, fold), y1 = Math.min(cy + 46, yEdge); s += `<path d="M${cx + d * (R - 6)} ${cy - 46} C${x + d * 10} ${cy - 40} ${x} ${y1 - 6} ${cx + d * (R - 6)} ${y1} Z" fill="${shade(wrap)}" ${st(3)} opacity="${1 - roll * 2}"/>`; });
        s += `</g>`;
      }
      if (roll > 0) { const w = lerp(opt.folds ? 118 : 168, opt.folds ? 170 : 200, roll); s += `<g opacity="${op}"><rect x="${cx - w / 2}" y="${yEdge - 26}" width="${w}" height="${lerp(46, 60, roll)}" rx="26" fill="${wrap}" ${st()} ${opt.see ? `fill-opacity=".9"` : ""}/><path d="M${cx - w / 2 + 14} ${yEdge + 8} L${cx + w / 2 - 14} ${yEdge + 8}" stroke="${shade(wrap)}" stroke-width="3" stroke-linecap="round"/></g>`;
        if (roll < 1) s += T.palm(cx - 40, yEdge + 30, 0.9) + T.palm(cx + 40, yEdge + 30, 0.9); }
      if (fillIn > 0 && fillIn < 1) s += srvSpoon(lerp(150, 220, fillIn), 122, null, -20);
      return base + g(s, 0, roll * (R - 26));
    } });
}
srvRollScene("burrito", ["groundbeef", "chicken", "blackbeans", "pork", "egg"],
  ["Fill the tortillas, fold in the sides and roll up", "Roll into burritos", "Spoon the filling down the center of each tortilla, fold the sides, and roll"],
  { folds: true, under: (x0, x1, y0, y1) => y1 > y0 ? `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" rx="12" fill="#FBF8EE" ${st(2)}/>` : "" });
srvRollScene("rollwrap", ["chicken", "turkey", "tofu"],
  ["Roll up the wraps tightly", "Lay the filling on the tortilla and roll it up", "Roll up and cut in half"],
  { under: (x0, x1, y0, y1) => y1 > y0 ? `<rect x="${x0 - 20}" y="${y0 - 4}" width="${x1 - x0 + 40}" height="${y1 - y0 + 4}" rx="10" fill="#8CC152" ${st(2)}/>` : "" });
srvRollScene("springroll", ["shrimp", "tofu"],
  ["Lay the fillings on the rice paper, fold in the sides and roll", "Roll up the spring rolls"],
  { folds: true, wrap: "#F6F1E6", see: true, under: (x0, x1, y0, y1) => y1 > y0 ? `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" rx="10" fill="#9BCB6A" ${st(2)}/>` + [0, 1, 2].map(j => `<path d="M${x0 + 10} ${y0 + 8 + j * 8} L${x1 - 10} ${y0 + 6 + j * 8}" stroke="#F08A3C" stroke-width="3" opacity="${y0 + 8 + j * 8 < y1 ? 1 : 0}"/>`).join("") : "" });

// Quesadilla: filling on half, fold the other half over.
LIB.add({ cat: "serve", name: "foldquesadilla", foods: ["cheese", "chicken", "blackbeans", "mushroom", "spinach"], dur: 3,
  steps: ["Fill half of each tortilla, then fold the other half over", "Sprinkle cheese over half the tortilla and fold"],
  draw(t, F, key) {
    const p = t / 3, cx = 180, cy = 128, R = 88, op = srvFade(p);
    let s = counter() + board();
    const k = Math.cos(ease(clamp((p - 0.42) / 0.3)) * Math.PI);
    s += `<g opacity="${op}"><path d="M${cx - R} ${cy} A${R} ${R} 0 0 0 ${cx + R} ${cy} Z" fill="#F1D9A0" ${st()}/>`;
    const n = Math.floor(clamp((p - 0.04) / 0.3) * 18);
    for (let i = 0; i < n; i++) { const a = srvFrac(i) * Math.PI, rr = 20 + srvFrac(i * 5) * 52; const x = cx + Math.cos(a) * rr, y = cy + 8 + Math.sin(a) * rr * 0.9; s += key === "cheese" || i % 2 ? srvBit("cheese", x, y, i, 1.5) : srvFill(key, x, y, i, 1.1); }
    s += `<path transform="translate(${cx} ${cy}) scale(1 ${k})" d="M${-R} 0 A${R} ${R} 0 0 1 ${R} 0 Z" fill="${k < 0 ? "#E8C88A" : "#F1D9A0"}" ${st()}/>`;
    s += `</g>`;
    if (p < 0.36) s += T.pinch(lerp(130, 230, srvFrac(n)), 108 + (p * 300) % 30, 1);
    else if (p < 0.76) s += T.palm(cx, cy - R * k * 0.8, 0.9);
    return s;
  } });

// Sandwich stack.
const SRV_SANDWICH = {
  turkey: ["lettuce", "#F1DEC4", "cheese"], chicken: ["lettuce", "#E8C49A", "tomato"], pork: ["#F2B8B0", "cheese"],
  cheese: ["cheese", "tomato", "lettuce"], bacon: ["lettuce", "tomato", "#8A3A22"],
};
function srvLayer(kind, y) {
  if (kind === "lettuce") return `<path d="M100 ${y} C112 ${y - 12} 122 ${y + 6} 136 ${y - 6} C150 ${y - 14} 160 ${y + 4} 176 ${y - 6} C190 ${y - 14} 200 ${y + 4} 214 ${y - 6} C228 ${y - 14} 240 ${y + 4} 260 ${y} L256 ${y + 4} L104 ${y + 4} Z" fill="#8CC152" ${st(3)}/>`;
  if (kind === "cheese") return `<path d="M108 ${y - 4} L252 ${y - 4} L246 ${y + 2} L232 ${y + 12} L224 ${y + 2} L140 ${y + 2} L128 ${y + 12} L116 ${y + 2} Z" fill="#F7C94B" ${st(3)}/>`;
  if (kind === "tomato") return [138, 222].map(x => `<rect x="${x - 40}" y="${y - 9}" width="80" height="11" rx="5" fill="#E8503C" ${st(3)}/>`).join("");
  return `<path d="M104 ${y} C120 ${y - 16} 140 ${y - 4} 160 ${y - 12} C180 ${y - 18} 200 ${y - 4} 222 ${y - 12} C238 ${y - 16} 252 ${y - 6} 258 ${y} C250 ${y + 6} 110 ${y + 6} 104 ${y} Z" fill="${kind}" ${st(3)}/>`;
}
LIB.add({ cat: "serve", name: "sandwich", foods: Object.keys(SRV_SANDWICH), dur: 3.2,
  steps: ["Build the sandwiches", "Layer the turkey, cheese and lettuce on the bread and top with the second slice", "Assemble the BLTs"],
  draw(t, F, key) {
    const p = t / 3.2;
    let s = counter() + `<rect x="100" y="184" width="160" height="22" rx="7" fill="#F6E3B8" ${st()}/><path d="M104 186 L256 186" stroke="#D9A55B" stroke-width="5"/>`;
    const list = [...SRV_SANDWICH[key], "top"];
    let y = 184;
    list.forEach((kind, i) => {
      const h = kind === "top" ? 0 : 12, q = clamp((p - 0.04 - i * 0.18) / 0.14);
      if (q > 0) { const yy = lerp(40, y, ease(q)); s += `<g opacity="${srvFade(p)}">${kind === "top" ? `<rect x="100" y="${yy - 22}" width="160" height="22" rx="7" fill="#F6E3B8" ${st()}/><path d="M104 ${yy - 20} L256 ${yy - 20}" stroke="#D9A55B" stroke-width="5"/>` : srvLayer(kind, yy)}</g>`; if (q < 1) s += T.pinch(180, yy - 36, 1); }
      y -= h;
    });
    return s;
  } });

// Cut the sandwich corner to corner.
LIB.add({ cat: "serve", name: "cutsandwich", foods: ["bread", "grilledcheese"], dur: 2.6,
  steps: ["Cut the sandwich diagonally", "Slice in half corner to corner and serve"],
  draw(t, F, key) {
    const p = t / 2.6, cut = ease(clamp((p - 0.08) / 0.4)), apart = ease(clamp((p - 0.55) / 0.2)) * (1 - ease(clamp((p - 0.9) / 0.1)));
    const crust = key === "grilledcheese" ? "#B5733A" : "#D9A55B", face = key === "grilledcheese" ? "#E8B46A" : "#F6E3B8";
    const tri = (pts, dx, dy) => `<path transform="translate(${dx} ${dy})" d="M${pts.map(q => q.join(" ")).join(" L")} Z" fill="${face}" stroke="${crust}" stroke-width="9" stroke-linejoin="round"/><path transform="translate(${dx} ${dy})" d="M${pts.map(q => q.join(" ")).join(" L")} Z" fill="none" ${st(3)}/>`;
    let s = counter() + board();
    const A = [110, 58], B = [250, 58], Cc = [250, 198], D = [110, 198];
    s += apart > 0 ? tri([A, B, Cc], apart * 12, -apart * 12) + tri([A, Cc, D], -apart * 12, apart * 12) : tri([A, B, Cc, D], 0, 0);
    if (key === "grilledcheese") s += `<path d="M${150 - apart * 12} ${158 + apart * 12} l20 0 M${200 + apart * 12} ${100 - apart * 12} l20 0" stroke="#B5733A" stroke-width="4" stroke-linecap="round"/>`;
    if (cut > 0 && apart === 0) s += `<path d="M${A[0]} ${A[1]} L${lerp(A[0], Cc[0], cut)} ${lerp(A[1], Cc[1], cut)}" ${st(3)}/>`;
    const kx = lerp(A[0] - 10, Cc[0] + 10, cut), ky = lerp(A[1] - 10, Cc[1] + 10, cut);
    return s + (p < 0.55 ? knife(kx, ky, 45, 80) : knife(310, 80, 45, 80));
  } });

// Lettuce cups filled one by one.
LIB.add({ cat: "serve", name: "lettucewraps", foods: ["groundpork", "groundturkey", "groundbeef", "chicken", "tofu"], dur: 3.4,
  steps: ["Spoon the filling into lettuce cups", "Serve in lettuce leaves", "Fill each lettuce leaf with the chicken mixture"],
  draw(t, F, key) {
    const p = t / 3.4;
    let s = counter() + srvPlate(180, 196, 150, 24);
    let tool = null;
    [96, 180, 264].forEach((x, i) => {
      s += `<path d="M${x - 46} 160 C${x - 50} 200 ${x + 50} 200 ${x + 46} 160 C${x + 30} 150 ${x + 24} 166 ${x + 10} 156 C${x} 148 ${x - 6} 162 ${x - 18} 154 C${x - 30} 148 ${x - 36} 162 ${x - 46} 160 Z" fill="#9BCB6A" ${st(3)}/><path d="M${x} 186 L${x} 164" stroke="#E9F2C7" stroke-width="4" stroke-linecap="round"/>`;
      const q = clamp((p - 0.04 - i * 0.28) / 0.26);
      if (q > 0.45) { let f = ""; for (let j = 0; j < 7; j++) f += srvFill(key, x - 26 + (j * 19) % 52, 160 - (j % 3) * 5, j + i * 7, 1.1); s += `<g opacity="${srvFade(p)}">${f}</g>`; }
      if (q > 0 && q < 1) tool = [x, q];
    });
    if (tool) { const dip = Math.sin(tool[1] * Math.PI); s += srvSpoon(tool[0] + 4, lerp(96, 142, dip), tool[1] < 0.45 ? (F.cooked || "#E2B66A") : null, dip > 0.7 ? -30 : 0); }
    return s;
  } });

// Stuffed pepper halves filled in a baking dish.
LIB.add({ cat: "serve", name: "stuffpeppers", foods: ["pepper", "greenpepper", "yellowpepper"], dur: 3.4,
  steps: ["Stuff the peppers with the filling", "Spoon the mixture into the pepper halves", "Fill each pepper and place in the baking dish"],
  draw(t, F) {
    const p = t / 3.4;
    let s = counter() + srvDish("#F1EDE4");
    let tool = null;
    [116, 180, 244].forEach((x, i) => {
      s += `<path d="M${x - 30} 128 C${x - 34} 158 ${x + 34} 158 ${x + 30} 128 Z" fill="${F.fill}" ${st(3)}/><ellipse cx="${x}" cy="128" rx="30" ry="10" fill="${F.inner}" ${st(3)}/>`;
      const q = clamp((p - 0.04 - i * 0.28) / 0.26);
      if (q > 0.45) s += `<g opacity="${srvFade(p)}"><path d="M${x - 28} 128 C${x - 24} 104 ${x + 24} 104 ${x + 28} 128 Z" fill="#8A4A2A" ${st(2.6)}/>${[[-12, 120], [4, 114], [14, 122]].map(([a, b]) => `<ellipse cx="${x + a}" cy="${b}" rx="3.5" ry="2" fill="#FBF8EE"/>`).join("")}</g>`;
      if (q > 0 && q < 1) tool = [x, q];
    });
    if (tool) { const dip = Math.sin(tool[1] * Math.PI); s += srvSpoon(tool[0] + 4, lerp(70, 100, dip), tool[1] < 0.45 ? "#8A4A2A" : null, dip > 0.7 ? -30 : 0); }
    return s;
  } });

// ---------- Enchiladas in a dish (top view) ----------
const SRV_ENCH_FILL = { chicken: "#E8C49A", cheese: "#F7C94B", groundbeef: "#6B3A22", blackbeans: "#2A2A2A" };
const srvEnchRoll = (x, fill) => `<rect x="${x - 21}" y="70" width="42" height="124" rx="18" fill="#F1D9A0" ${st(3.5)}/><ellipse cx="${x}" cy="76" rx="15" ry="6" fill="${fill}" ${st(2)}/><ellipse cx="${x}" cy="188" rx="15" ry="6" fill="${fill}" ${st(2)}/><path d="M${x + 8} 90 L${x + 8} 176" stroke="#D9B06A" stroke-width="3" stroke-linecap="round"/>`;
const SRV_ENCH_X = [86, 133, 180, 227, 274];
LIB.add({ cat: "serve", name: "lineenchiladas", foods: Object.keys(SRV_ENCH_FILL), dur: 3.2,
  steps: ["Roll up the filled tortillas and place seam side down in the baking dish", "Line the enchiladas up in the dish"],
  draw(t, F, key) {
    const p = t / 3.2;
    let s = counter() + V.dishTop();
    SRV_ENCH_X.forEach((x, i) => {
      const q = clamp((p - 0.04 - i * 0.15) / 0.13);
      if (q <= 0) return;
      const dy = lerp(-90, 0, ease(q));
      s += `<g opacity="${srvFade(p)}">${g(srvEnchRoll(x, SRV_ENCH_FILL[key]), 0, dy)}</g>`;
      if (q < 1) s += T.palm(x, 120 + dy, 0.9);
    });
    return s;
  } });
LIB.add({ cat: "serve", name: "saucenchiladas", foods: ["sauce", "tomatosauce", "verde"], dur: 2.8,
  steps: ["Pour the enchilada sauce over the top", "Pour the remaining sauce over the enchiladas"],
  draw(t, F) {
    const p = t / 2.8, f = ease(clamp((p - 0.1) / 0.62)), c = F.liquid;
    let s = counter() + V.dishTop() + SRV_ENCH_X.map(x => srvEnchRoll(x, "#E8C49A")).join("");
    const x1 = lerp(66, 296, f);
    if (f > 0) s += `<g opacity="${srvFade(p)}"><path d="M66 86 C80 74 ${x1 - 20} 70 ${x1} 84 C${x1 + 8} 120 ${x1 - 8} 150 ${x1} 182 C${x1 - 20} 196 80 194 66 180 Z" fill="${c}" ${st(3)} opacity=".92"/>${SRV_ENCH_X.filter(x => x < x1 - 20).map(x => `<path d="M${x - 10} 100 L${x - 10} 150" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".35"/>`).join("")}</g>`;
    const pouring = p > 0.08 && p < 0.74, sx = Math.min(x1, 290);
    const px = Math.min(sx + 40, 270);
    if (pouring) s += FX.stream(px - 34, 62, sx, 120, c, 7);
    return s + g(`<path d="M-44 -18 L36 -18 L32 26 L-40 26 Z" fill="#fff" ${st()}/>${pouring ? `<path d="M-44 -14 L36 -14" stroke="${c}" stroke-width="6"/>` : ""}<path d="M36 -10 L84 -26" ${st(9)}/><path d="M36 -10 L84 -26" stroke="${C.handle}" stroke-width="5" stroke-linecap="round"/>`, px, 50, 0.8, pouring ? -40 : -10);
  } });

// ---------- Parfait in a glass ----------
const srvGlassBody = (x0, x1, y0, y1) => `<path d="M${x0} ${y0} L${x1} ${y0} L${x1 - 6} ${y1} L${x0 + 6} ${y1} Z" fill="#EAF6FF" opacity=".5"/>`;
const srvGlassEdge = (x0, x1, y0, y1) => `<path d="M${x0} ${y0} L${x0 + 6} ${y1} L${x1 - 6} ${y1} L${x1} ${y0}" fill="none" ${st()}/><path d="M${x0 + 8} ${y0 + 14} L${x0 + 12} ${y1 - 16}" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".8"/>`;
LIB.add({ cat: "serve", name: "parfait", foods: ["blueberries", "raspberries", "strawberry"], dur: 3.6,
  steps: ["Layer yogurt, granola and berries in glasses", "Repeat the layers and top with berries"],
  draw(t, F, key) {
    const p = t / 3.6, kinds = ["yogurt", "oats", key, "yogurt", "oats", key], h = 26;
    let s = counter() + srvGlassBody(126, 234, 50, 206), spoon = null;
    kinds.forEach((k, i) => {
      const q = clamp((p - 0.04 - i * 0.13) / 0.11), y = 202 - i * h;
      if (q <= 0) return;
      const yy = lerp(y - 40, y, ease(q)), w = lerp(48, 50, i / 6);
      let L = "";
      if (k === "yogurt") L = `<path d="M${180 - w} ${yy} L${180 + w} ${yy} L${180 + w} ${yy - h} C${180 + w * 0.5} ${yy - h - 6} ${180 - w * 0.5} ${yy - h + 4} ${180 - w} ${yy - h} Z" fill="#FFFDF4" ${st(2)}/>`;
      else if (k === "oats") L = `<rect x="${180 - w}" y="${yy - h}" width="${w * 2}" height="${h}" fill="#E8C47A" ${st(2)}/>` + [...Array(8)].map((_, j) => `<circle cx="${180 - w + 8 + j * 12}" cy="${yy - h / 2 + (j % 2 ? 4 : -4)}" r="4" fill="#C9965A" ${st(1.2)}/>`).join("");
      else L = [...Array(8)].map((_, j) => srvBit(k, 180 - w + 8 + (j % 4) * 26 + (j > 3 ? 13 : 0), yy - 6 - (j > 3 ? 12 : 0), j, 1.4)).join("");
      s += `<g opacity="${srvFade(p)}">${L}</g>`;
      if (q < 1) spoon = yy - h;
    });
    s += srvGlassEdge(126, 234, 50, 206);
    if (spoon !== null) s += srvSpoon(186, Math.max(40, spoon - 10), null, -20);
    return s;
  } });

// ---------- Toss together a salad ----------
LIB.add({ cat: "serve", name: "buildsalad", foods: ["lettuce", "spinach", "kale", "greens"], dur: 3.2,
  steps: ["Arrange the greens in a large bowl and top with the vegetables", "Assemble the salad", "Place the lettuce in a bowl and add tomatoes, cucumber and onion"],
  draw(t, F) {
    const p = t / 3.2;
    let s = counter() + `<path d="M76 134 C82 222 278 222 284 134 Z" fill="#fff" ${st()}/>`;
    const nL = 10, leaves = [[110, 132], [140, 120], [176, 112], [212, 118], [246, 130], [128, 138], [166, 128], [204, 132], [236, 140], [180, 140]];
    let inner = "";
    leaves.forEach(([x, y], i) => { const q = clamp((p - 0.04 - i * 0.035) / 0.1); if (q > 0) inner += `<path transform="translate(${x} ${lerp(40, y, ease(q))}) rotate(${i * 40 - 60})" d="M-24 0 C-18 -18 18 -18 24 0 C18 14 -18 14 -24 0 Z" fill="${i % 2 ? F.inner : F.fill}" ${st(2.6)}/>`; });
    const tops = ["cherrytomato", "cucumber", "redonion", "cherrytomato", "cucumber", "redonion", "cherrytomato", "cucumber"];
    tops.forEach((k, i) => { const q = clamp((p - 0.46 - i * 0.04) / 0.1); if (q > 0) { const x = 124 + (i * 41) % 116, y = 112 + (i * 7) % 18; inner += srvBit(k, x, lerp(40, y, ease(q)), i, k === "redonion" ? 2.2 : 1.6); } });
    s += `<g opacity="${srvFade(p)}">${inner}</g>`;
    return s + `<path d="M66 134 L294 134" ${st(5)}/>` + T.pinch(lerp(150, 220, srvFrac(Math.floor(p * 12))), 46, 1);
  } });

// ---------- Charcuterie board ----------
LIB.add({ cat: "serve", name: "charcuterie", foods: null, dur: 3.6,
  steps: ["Arrange the meats, cheeses, fruit and crackers on a board", "Arrange everything on a large platter"],
  draw(t) {
    const p = t / 3.6;
    const items = [
      [110, 90, () => [0, 1, 2].map(j => `<path transform="translate(${j * 16} ${j * 4})" d="M-20 12 L20 12 L0 -20 Z" fill="#F7C94B" ${st(2.6)}/>`).join("")],
      [240, 92, () => [0, 1, 2, 3].map(j => `<g transform="translate(${j * 16 - 24} ${j % 2 * 4})"><circle r="15" fill="#B5473A" ${st(2.4)}/><circle cx="-5" cy="-3" r="2.5" fill="#F2D5CF"/><circle cx="5" cy="4" r="2" fill="#F2D5CF"/></g>`).join("")],
      [176, 160, () => [[-14, -8], [0, -12], [14, -8], [-7, 4], [7, 4], [0, 15]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="9" fill="#8CC152" ${st(2)}/>`).join("") + `<path d="M0 -20 L2 -30" ${st(3)}/>`],
      [96, 168, () => [0, 1, 2].map(j => `<rect x="${-18 + j * 8}" y="${-14 - j * 4}" width="34" height="30" rx="4" fill="#E8C47A" ${st(2.4)}/>`).join("")],
      [262, 168, () => `<ellipse rx="30" ry="18" fill="#fff" ${st(3)}/>` + [[-12, -2], [0, -6], [12, -2], [-4, 6], [8, 6]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="6" fill="#3B3B2A" ${st(1.6)}/>`).join("")],
      [176, 82, () => whole(FOODS.nuts).replace(/^/, "") ],
    ];
    let s = counter() + board(), hand = null;
    items.forEach(([x, y, d], i) => {
      const q = clamp((p - 0.04 - i * 0.13) / 0.11);
      if (q <= 0) return;
      const yy = lerp(y - 50, y, ease(q));
      s += `<g opacity="${srvFade(p)}">${g(d(), x, yy, i === 5 ? 0.45 : 1)}</g>`;
      if (q < 1) hand = [x, yy];
    });
    if (hand) s += T.pinch(hand[0], hand[1] - 34, 1);
    return s;
  } });

// ---------- Thread food onto skewers ----------
function srvSkewerPiece(key, x, y) {
  const F = foodFor(key);
  if (key === "shrimp") return g(whole(F), x, y, 0.32, 90);
  if (key === "mushroom") return g(whole(F), x, y + 4, 0.38, 90);
  if (key === "cherrytomato") return `<circle cx="${x}" cy="${y}" r="15" fill="#E8503C" ${st(3)}/><path d="M${x - 4} ${y - 15} l4 -4 l4 4" ${st(2)} stroke="#3E8E41"/>`;
  if (key === "strawberry") return g(whole(F), x, y, 0.34, 0);
  if (key === "pineapple") return `<path d="M${x - 15} ${y - 13} L${x + 15} ${y - 13} L${x + 13} ${y + 14} L${x - 13} ${y + 14} Z" fill="#F7E07A" ${st(2.6)}/><path d="M${x - 15} ${y - 13} L${x + 15} ${y - 13}" stroke="#E8B23C" stroke-width="4"/>`;
  if (key === "veggies") { const c = pick(["#E8503C", "#F4E6F1", "#4E9A3A", "#F7C94B"], Math.round(x / 40)); return `<rect x="${x - 14}" y="${y - 14}" width="28" height="28" rx="5" fill="${c}" ${st(2.6)}/>`; }
  return `<rect x="${x - 15}" y="${y - 14}" width="30" height="28" rx="6" fill="${F.inner}" ${st(2.6)}/><path d="M${x - 10} ${y - 9} L${x + 8} ${y - 9}" stroke="${F.mark || F.fill}" stroke-width="3" stroke-linecap="round"/>`;
}
LIB.add({ cat: "serve", name: "thread", foods: ["chicken", "beef", "pork", "lamb", "shrimp", "veggies", "mushroom", "cherrytomato", "pineapple", "strawberry"], dur: 3.4,
  steps: ["Thread the chicken onto skewers", "Thread the shrimp onto the skewers", "Thread the vegetables onto skewers, alternating colors", "Thread the fruit onto skewers"],
  draw(t, F, key) {
    const p = t / 3.4, y = 130, n = 6;
    let s = counter() + board() + T.skewer(50, y, 318, y);
    let hand = null;
    for (let i = 0; i < n; i++) {
      const q = clamp((p - 0.04 - i * 0.13) / 0.12), xf = 92 + i * 42;
      if (q <= 0) continue;
      const x = lerp(340, xf, ease(q));
      s += `<g opacity="${srvFade(p)}">${g(srvSkewerPiece(key, 0, 0), x, y, 1.35)}</g>`;
      if (q < 1) hand = x;
    }
    s += g(fist(), 46, y, 1);
    if (hand !== null) s += T.pinch(hand + 30, y - 6, 1, 90);
    return s;
  } });

// ---------- Bowls with sections (top view) ----------
const SRV_GRAIN = { whiterice: ["#FBF8EE", "#FFFFFF"], brownrice: ["#E8D4A8", "#D9BE8A"], quinoa: ["#F1E3B0", "#E8D08A"], couscous: ["#F1D98A", "#E8C86A"] };
function srvBowlTop(base, dots) {
  let s = `<circle cx="180" cy="128" r="100" fill="#fff" ${st()}/><circle cx="180" cy="128" r="84" fill="${base}" ${st(3)}/>`;
  for (let i = 0; i < 26; i++) { const a = i * 2.4, r = 10 + (i * 29) % 70; s += `<ellipse cx="${180 + Math.cos(a) * r}" cy="${128 + Math.sin(a) * r}" rx="4" ry="2.4" fill="${dots}" ${st(1)} transform="rotate(${i * 50} ${180 + Math.cos(a) * r} ${128 + Math.sin(a) * r})"/>`; }
  return s;
}
function srvSection(kind, x, y) {
  let s = "";
  for (let j = 0; j < 7; j++) { const a = j * 2.1, r = j ? 14 + (j % 2) * 6 : 0, bx = x + Math.cos(a) * r, by = y + Math.sin(a) * r;
    if (kind === "avocado") { if (j < 4) s += `<path transform="translate(${x - 18 + j * 12} ${y}) rotate(-20)" d="M-5 -18 C10 -14 10 14 -5 18 C2 6 2 -6 -5 -18 Z" fill="#C8E08A" stroke="#3E6B2A" stroke-width="3"/>`; }
    else if (kind === "greens") s += `<path transform="translate(${bx} ${by}) rotate(${j * 50})" d="M-12 0 C-9 -9 9 -9 12 0 C9 7 -9 7 -12 0 Z" fill="${j % 2 ? "#6DB04A" : "#9BCB6A"}" ${st(2)}/>`;
    else if (kind === "salsa") s += srvBit(j % 2 ? "tomato" : "onion", bx, by, j, 1.5);
    else if (SRV_BITS[kind]) s += srvBit(kind, bx, by, j, kind === "corn" ? 1.6 : 1.5) + (kind === "corn" ? srvBit(kind, bx + 6, by + 4, j + 3, 1.6) : "");
    else s += srvFill(kind, bx, by, j, 1.2);
  }
  return s;
}
function srvSectionScene(name, foods, steps, baseOf, sectionsOf) {
  LIB.add({ cat: "serve", name, foods, steps, dur: 3.4,
    draw(t, F, key) {
      const p = t / 3.4, secs = sectionsOf(key);
      let s = counter() + baseOf(key), hand = null;
      secs.forEach((k, i) => {
        const a = -Math.PI / 2 + i * Math.PI * 2 / secs.length, x = 180 + Math.cos(a) * 50, y = 128 + Math.sin(a) * 50, q = clamp((p - 0.06 - i * 0.14) / 0.12);
        if (q <= 0) return;
        s += `<g opacity="${srvFade(p) * clamp(q * 2)}">${srvSection(k, x, lerp(y - 30, y, ease(q)))}</g>`;
        if (q < 1) hand = [x, lerp(y - 30, y, ease(q))];
      });
      if (hand) s += T.pinch(hand[0], hand[1] - 34, 1);
      return s;
    } });
}
srvSectionScene("grainbowl", Object.keys(SRV_GRAIN), ["Divide the grains among bowls and arrange the toppings in sections", "Assemble the bowls"],
  (key) => srvBowlTop(...SRV_GRAIN[key]), () => ["greens", "cherrytomato", "cucumber", "avocado", "chickpeas"]);
srvSectionScene("burritobowl", ["chicken", "steak", "groundbeef"], ["Assemble the burrito bowls: rice, beans, corn, salsa and meat", "Top the rice with the chicken, beans, corn and salsa"],
  () => srvBowlTop("#FBF8EE", "#FFFFFF"), (key) => [key, "blackbeans", "corn", "salsa", "lettuce"]);

// ---------- Ramen / pho: broth ladled over noodles ----------
LIB.add({ cat: "serve", name: "ramenbowl", foods: ["ramen", "ricenoodles", "noodles"], dur: 3,
  steps: ["Place the noodles in bowls and ladle the hot broth over", "Ladle over the hot broth", "Divide the noodles between bowls and pour over the broth"],
  draw(t, F, key) {
    const p = t / 3, c = key === "ricenoodles" ? "#EDD9A8" : "#E8B46A", lvl = ease(clamp((p - 0.18) / 0.5));
    let s = counter() + `<path d="M70 120 C74 230 286 230 290 120 Z" fill="#fff" ${st()}/>`;
    const nc = key === "ricenoodles" ? "#F1E6C8" : F.fill;
    s += `<path d="M118 182 C124 138 236 138 242 182 C210 198 150 198 118 182 Z" fill="${nc}" ${st(3)}/>`;
    for (let i = 0; i < 4; i++) { const y = 154 + i * 10, d = `M${122 - i * 4} ${y} C${140} ${y - 10} ${160} ${y + 10} ${180} ${y} C${200} ${y - 10} ${220} ${y + 10} ${238 + i * 4} ${y}`; s += `<path d="${d}" fill="none" stroke="${shade(nc)}" stroke-width="3" stroke-linecap="round"/>`; }
    if (lvl > 0) { const y = lerp(204, 132, lvl), w = Math.sqrt(1 - ((y - 120) / 100) ** 2) * 108; s += `<g opacity="${srvFade(p)}"><path d="M${180 - w} ${y} L${180 + w} ${y} C${180 + w * 0.9} 214 ${180 - w * 0.9} 214 ${180 - w} ${y} Z" fill="${c}" opacity=".78"/><path d="M${180 - w} ${y} L${180 + w} ${y}" ${st(2.5)}/>${[0, 1, 2].map(j => `<circle cx="${180 - w * 0.5 + j * w * 0.5}" cy="${y + 4}" r="3" fill="#FBEFA0" ${st(1)}/>`).join("")}</g>`; }
    s += `<path d="M62 120 L298 120" ${st(5)}/>`;
    const pouring = p > 0.14 && p < 0.7;
    if (pouring) s += FX.stream(214, 90, 200, lerp(200, 134, lvl), c, 7);
    return s + srvLadle(238, 86, pouring ? -60 : -10, pouring ? c : null);
  } });

// ---------- Drinks ----------
// Glass kinds: tumbler, wine, pint. Bottom at y 206; returns {back, front, top, x0, x1, yTop}.
function srvGlass(kind, x, level, color) {
  if (kind === "wine") {
    const yTop = 70, yB = 150, lv = lerp(124, yTop + 22, level);
    const w = (y) => 41 * Math.sqrt(Math.max(0, 1 - ((y - 70) / 58) ** 2));
    let s = `<path d="M${x - 40} ${yTop} C${x - 46} ${yB - 4} ${x + 46} ${yB - 4} ${x + 40} ${yTop}" fill="#EAF6FF" opacity=".5"/>`;
    if (level > 0) s += `<path d="M${x - w(lv)} ${lv} L${x + w(lv)} ${lv} C${x + w(lv) * 0.8} 130 ${x - w(lv) * 0.8} 130 ${x - w(lv)} ${lv} Z" fill="${color}" ${st(2)}/>`;
    s += `<path d="M${x - 40} ${yTop} C${x - 46} ${yB - 4} ${x + 46} ${yB - 4} ${x + 40} ${yTop}" fill="none" ${st()}/><path d="M${x} ${yB - 6} L${x} 200" ${st(5)}/><ellipse cx="${x}" cy="203" rx="30" ry="6" fill="#EAF6FF" ${st(3.5)}/>`;
    return { s, yTop, surf: lv };
  }
  const yTop = kind === "pint" ? 56 : 92, x0 = x - (kind === "pint" ? 42 : 38), x1 = x + (kind === "pint" ? 42 : 38), yB = 206, lv = lerp(yB - 4, yTop + 14, level);
  let s = srvGlassBody(x0, x1, yTop, yB);
  if (level > 0) { const k = (lv - yTop) / (yB - yTop); s += `<path d="M${x0 + 6 * k + 3} ${lv} L${x1 - 6 * k - 3} ${lv} L${x1 - 9} ${yB - 3} L${x0 + 9} ${yB - 3} Z" fill="${color}" ${st(2)}/>`; if (kind === "pint") s += `<path d="M${x0 + 6 * k + 3} ${lv} L${x1 - 6 * k - 3} ${lv} L${x1 - 6 * k - 3} ${lv - 12} C${x + 20} ${lv - 20} ${x - 20} ${lv - 8} ${x0 + 6 * k + 3} ${lv - 12} Z" fill="#FFF6E3" ${st(2)} opacity="${clamp(level * 2)}"/>`; }
  s += srvGlassEdge(x0, x1, yTop, yB);
  return { s, yTop, surf: lv };
}
// A pitcher whose spout sits at sx,sy, tilted r degrees (negative = toward the left).
function srvPitcher(sx, sy, r, color) {
  const rad = r * Math.PI / 180, lx = -40, ly = -52, cx = sx - (lx * Math.cos(rad) - ly * Math.sin(rad)), cy = sy - (lx * Math.sin(rad) + ly * Math.cos(rad));
  return g(`<path d="M-34 -50 L34 -50 L38 50 C38 58 -38 58 -38 50 Z" fill="#EAF6FF" opacity=".6"/><path d="M-30 -20 L34 -20 L37 50 C37 56 -37 56 -37 50 Z" fill="${color}" opacity=".9"/>
    <path d="M-34 -50 L-40 -52 L-38 -40 M-34 -50 L34 -50 L38 50 C38 58 -38 58 -38 50 L-36 -42" fill="none" ${st()}/><path d="M36 -34 C66 -34 66 30 37 30" fill="none" ${st(7)}/>${g(fist(), 58, 0, 1)}`, cx, cy, 1, r);
}
const SRV_DRINK = { juice: "tumbler", milk: "tumbler", water: "tumbler", lemonade: "tumbler", icedtea: "tumbler", smoothie: "tumbler", wine: "wine", beer: "pint" };
LIB.add({ cat: "serve", name: "pourglass", foods: Object.keys(SRV_DRINK), dur: 2.8,
  steps: ["Pour into glasses and serve", "Pour the lemonade into glasses", "Pour the smoothie into glasses and serve right away", "Pour the wine"],
  draw(t, F, key) {
    const p = t / 2.8, c = F.liquid, kind = SRV_DRINK[key];
    const lvl = ease(clamp((p - 0.18) / 0.55)), G = srvGlass(kind, 130, lvl * (kind === "wine" ? 0.55 : 0.85), c);
    let s = counter() + G.s;
    const tilt = p < 0.15 ? lerp(0, -1, ease(p / 0.15)) : p < 0.75 ? -1 : lerp(-1, 0, ease((p - 0.75) / 0.2));
    const sx = 166, sy = G.yTop - 22;
    if (p > 0.16 && p < 0.76) s += FX.stream(sx, sy, 136, G.surf, c, 6);
    if (kind === "tumbler") return s + srvPitcher(sx + lerp(40, 0, -tilt), sy + lerp(40, 0, -tilt), tilt * 70, c);
    // bottle for wine and beer
    const bc = kind === "wine" ? "#3E6B3A" : "#8A5A2B";
    return s + srvBottle(sx + lerp(30, 0, -tilt), sy + lerp(20, 0, -tilt), lerp(-15, -125, -tilt), bc);
  } });
LIB.add({ cat: "serve", name: "addice", foods: ["ice"], dur: 2.6,
  steps: ["Fill glasses with ice", "Add ice to each glass", "Pour over ice"],
  draw(t) {
    const p = t / 2.6;
    let s = counter() + srvGlassBody(142, 218, 92, 206);
    const spots = [[164, 188], [196, 186], [180, 166], [160, 146], [198, 150], [178, 126]];
    spots.forEach(([x, y], i) => { const q = clamp((p - 0.06 - i * 0.12) / 0.1); if (q > 0) s += `<g opacity="${srvFade(p)}"><rect x="${x - 15}" y="${lerp(30, y, q * q) - 15}" width="30" height="30" rx="6" fill="${C.ice}" ${st(3)} transform="rotate(${i * 23} ${x} ${lerp(30, y, q * q)})"/><path d="M${x - 7} ${lerp(30, y, q * q) - 7} l7 0" stroke="#fff" stroke-width="3" stroke-linecap="round"/></g>`; });
    s += srvGlassEdge(142, 218, 92, 206);
    const k = Math.floor(clamp(p, 0, 0.79) / 0.12) % spots.length, hx = spots[Math.min(k, 5)][0];
    return s + T.pinch(hx, 26, 1);
  } });
LIB.add({ cat: "serve", name: "garnishglass", foods: ["lemon", "lime", "orange", "strawberry"], dur: 2.4,
  steps: ["Garnish each glass with a lemon wheel", "Garnish with a lime wedge", "Serve garnished with a slice of orange"],
  draw(t, F, key) {
    const p = t / 2.4, q = ease(clamp((p - 0.08) / 0.4)), x = lerp(290, 216, q), y = lerp(40, 94, q);
    let s = counter() + srvGlass("tumbler", 180, 0.75, key === "strawberry" ? "#F7C0C8" : "#FBEFA0").s;
    const wheel = key === "strawberry" ? g(whole(F), 0, 0, 0.62) : `<circle r="24" fill="${F.fill}" ${st(3)}/><circle r="18" fill="${F.inner}"/>${[0, 60, 120].map(a => `<path d="M${Math.cos(a * Math.PI / 180) * -16} ${Math.sin(a * Math.PI / 180) * -16} L${Math.cos(a * Math.PI / 180) * 16} ${Math.sin(a * Math.PI / 180) * 16}" stroke="${F.fill}" stroke-width="2"/>`).join("")}<path d="M0 0 L0 24" stroke="#FFF6E3" stroke-width="4"/>`;
    s += `<g opacity="${srvFade(p)}">${g(wheel, x, y, 1, -20)}</g>`;
    if (q < 1) s += T.pinch(x + 4, y - 40, 1);
    return s;
  } });

// ---------- Storing leftovers ----------
const SRV_PACK = { soup: "#E8A23C", stew: "#9C5A2A", curry: "#E8A23C", whiterice: "#FBF8EE", veggies: null, meatballs: null, cookies: null };
LIB.add({ cat: "serve", name: "packcontainer", foods: Object.keys(SRV_PACK), dur: 3.2,
  steps: ["Store leftovers in an airtight container in the refrigerator for up to 3 days", "Serve or store cooled cookies in an airtight container", "Keep the leftovers in an airtight container"],
  draw(t, F, key) {
    const p = t / 3.2, amt = ease(clamp((p - 0.06) / 0.45)), lid = ease(clamp((p - 0.6) / 0.18));
    let s = counter() + `<rect x="94" y="116" width="172" height="92" rx="14" fill="#EAF6FF" opacity=".55"/>`;
    let food = "";
    if (SRV_PACK[key]) { const top = lerp(204, 140, amt); food = `<rect x="100" y="${top}" width="160" height="${204 - top}" rx="8" fill="${SRV_PACK[key]}" ${st(2)}/>` + (key === "whiterice" ? amt < 0.2 ? "" : [...Array(10)].map((_, i) => `<ellipse cx="${112 + (i * 31) % 136}" cy="${Math.max(top + 8, 150 + (i * 13) % 50)}" rx="4" ry="2.4" fill="#fff" ${st(1)}/>`).join("") : key === "soup" || amt < 0.25 ? "" : [...Array(5)].map((_, i) => `<path transform="translate(${116 + i * 30} ${Math.min(196, Math.max(top + 10, 170 - (i % 2) * 14))})" d="M-8 -5 L6 -7 L9 3 L1 7 L-8 4 Z" fill="${i % 2 ? "#F4E3B0" : shade(SRV_PACK[key])}" ${st(1.8)}/>`).join("")); }
    else { const n = Math.floor(amt * 8); for (let i = 0; i < n; i++) { const x = 118 + (i % 4) * 42, y = 188 - Math.floor(i / 4) * 30; food += key === "cookies" ? `<ellipse cx="${x}" cy="${y}" rx="20" ry="13" fill="#D9A55B" ${st(2.4)}/><circle cx="${x - 6}" cy="${y - 2}" r="2.6" fill="#4A2A1A"/><circle cx="${x + 6}" cy="${y + 3}" r="2.6" fill="#4A2A1A"/>` : key === "meatballs" ? `<circle cx="${x}" cy="${y}" r="15" fill="#6B3A22" ${st(2.4)}/>` : morsel(FOODS.veggies, i, x, y, i * 50); } }
    s += `<g opacity="${srvFade(p, 0.92)}">${food}</g><rect x="94" y="116" width="172" height="92" rx="14" fill="none" ${st()}/><path d="M104 128 L104 196" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/>`;
    const ly = lerp(40, 104, lid);
    if (lid > 0) s += `<g opacity="${srvFade(p, 0.92) * clamp(lid * 4)}"><rect x="86" y="${ly}" width="188" height="18" rx="8" fill="${C.blue}" ${st()}/></g>`;
    if (p < 0.55 && amt < 1 && amt > 0 && SRV_PACK[key] && key !== "whiterice") s += FX.stream(196, 96, 190, lerp(200, 144, amt), SRV_PACK[key], 6);
    if (p < 0.55 && amt < 1) s += SRV_PACK[key] && key !== "whiterice" ? srvLadle(214, 84, -50, SRV_PACK[key]) : key === "cookies" || key === "meatballs" ? T.pinch(lerp(118, 244, srvFrac(Math.floor(amt * 8))), 90, 1) : srvSpoon(214, 104, null, -30);
    if (lid > 0 && lid < 1) s += T.palm(180, ly - 10, 1);
    if (lid >= 1 && p < 0.86) s += `<path d="M74 104 l-12 -6 M74 116 l-14 0 M286 104 l12 -6 M286 116 l14 0" ${st(3)}/>`;
    return s;
  } });
const SRV_WRAPPED = {
  greens: () => srvSaladBowl(),
  dough: () => srvBowl(180, 132, 100, "#F4DFB0", `<path d="M104 136 C110 96 250 96 256 136 Z" fill="#F4DFB0" ${st(3)}/>`),
  avocado: () => srvBowl(180, 132, 100, "#B5D46A", `<circle cx="150" cy="132" r="3" fill="#E8503C"/><circle cx="200" cy="128" r="3" fill="#F4E6F1"/>`),
};
LIB.add({ cat: "serve", name: "wrapbowl", foods: Object.keys(SRV_WRAPPED), dur: 2.8,
  steps: ["Cover the bowl with plastic wrap", "Place plastic wrap on the surface of the guacamole and press down to cover it", "Cover and refrigerate"],
  draw(t, F, key) {
    const p = t / 2.8, pull = ease(clamp((p - 0.08) / 0.45)), tuck = ease(clamp((p - 0.6) / 0.18));
    let s = counter() + SRV_WRAPPED[key]();
    const x1 = lerp(80, 290, pull), top = key === "avocado" ? lerp(112, 128, tuck) : key === "dough" ? 98 : 96;
    s += `<g opacity="${srvFade(p, 0.92)}"><path d="M70 ${top + 30} C74 ${top} ${x1 - 20} ${top - 6} ${x1} ${top + 10} L${x1 + 4} ${top + 30 + tuck * 30} L70 ${top + 30 + tuck * 30} Z" fill="#EAF6FF" opacity=".6" ${st(2.5)}/><path d="M100 ${top + 10} l30 -4 M${x1 - 70} ${top + 6} l26 2" stroke="#fff" stroke-width="3" stroke-linecap="round"/></g>`;
    if (pull > 0 && pull < 1) s += T.palm(x1 + 6, top + 20, 0.9, 90);
    if (tuck > 0 && tuck < 1) s += T.palm(180, top - 6, 0.9);
    return s;
  } });
const SRV_DOUGH_SHAPE = { dough: (c) => `<ellipse cx="180" cy="126" rx="52" ry="44" fill="${c}" ${st()}/>`, pizzadough: (c) => `<ellipse cx="180" cy="126" rx="52" ry="44" fill="${c}" ${st()}/>`, piecrust: (c) => `<circle cx="180" cy="126" r="58" fill="${c}" ${st()}/><path d="M140 110 l10 0 M200 140 l12 0" stroke="${shade(c)}" stroke-width="3" stroke-linecap="round"/>`, cookiedough: (c) => `<rect x="104" y="104" width="152" height="44" rx="22" fill="${c}" ${st()}/><circle cx="140" cy="120" r="3" fill="#4A2A1A"/><circle cx="200" cy="130" r="3" fill="#4A2A1A"/>` };
LIB.add({ cat: "serve", name: "wrapdough", foods: Object.keys(SRV_DOUGH_SHAPE), dur: 3,
  steps: ["Wrap dough tightly in plastic wrap and refrigerate for at least 1 hour", "Wrap all but 1 back in plastic wrap and place back in refrigerator", "Shape into a disk, wrap and chill"],
  draw(t, F, key) {
    const p = t / 3, a = ease(clamp((p - 0.08) / 0.24)), b = ease(clamp((p - 0.36) / 0.24)), pat = p > 0.64 && p < 0.88 ? Math.abs(Math.sin((p - 0.64) * 26)) : 0;
    let s = counter() + `<rect x="60" y="30" width="240" height="190" rx="6" fill="#EAF6FF" opacity=".55" ${st(2.5)}/>` + SRV_DOUGH_SHAPE[key](F.fill);
    const op = srvFade(p, 0.92);
    if (a > 0) s += `<g opacity="${op}"><rect x="${lerp(60, 120, a)}" y="30" width="${lerp(10, 120, a)}" height="190" rx="6" fill="#EAF6FF" opacity=".6" ${st(2.5)}/></g>`;
    if (b > 0) s += `<g opacity="${op}"><rect x="${lerp(290, 120, b)}" y="30" width="${lerp(10, 120, b)}" height="190" rx="6" fill="#EAF6FF" opacity=".6" ${st(2.5)}/><path d="M${lerp(290, 140, b)} 60 l30 10 M${lerp(290, 150, b)} 170 l24 -8" stroke="#fff" stroke-width="3" stroke-linecap="round"/></g>`;
    if (a > 0 && a < 1) s += T.palm(lerp(60, 230, a), 126, 0.9, -90);
    else if (b > 0 && b < 1) s += T.palm(lerp(300, 130, b), 126, 0.9, 90);
    else if (pat) s += T.palm(180, 100 + pat * 12, 1);
    return s;
  } });
LIB.add({ cat: "serve", name: "intofridge", foods: null, dur: 3,
  steps: ["Cover and refrigerate", "Refrigerate until ready to serve", "Let it cool and refrigerate until ready to serve"],
  draw(t) {
    const p = t / 3, slide = ease(clamp((p - 0.04) / 0.4)), close = ease(clamp((p - 0.55) / 0.2)), open = p < 0.55 ? 1 : 1 - close;
    let s = counter() + V.fridge(Math.max(0.001, open));
    if (open > 0.3 || close < 1) {
      const x = lerp(330, 180, slide), dish = `<rect x="-44" y="-14" width="88" height="28" rx="6" fill="#fff" ${st(3)}/><path d="M-46 -14 C-30 -24 30 -24 46 -14" fill="${C.foil}" ${st(3)}/>`;
      if (open > 0.05) s += g(dish, x, 146, 1);
      if (slide < 1) s += T.palm(x + 52, 142, 0.9, 90);
    }
    if (close >= 1) s += FX.cold(300, 70, 0.9);
    return s;
  } });
const SRV_FREEZE = { soup: "#E8A23C", stew: "#9C5A2A", tomatosauce: "#D9402E", meatballs: null, blueberries: null, chicken: null };
LIB.add({ cat: "serve", name: "freezebag", foods: Object.keys(SRV_FREEZE), dur: 3.4,
  steps: ["Freeze in a zip-top bag, laid flat", "Press out the air, seal and freeze for up to 3 months", "Store leftovers in the freezer"],
  draw(t, F, key) {
    const p = t / 3.4, press = ease(clamp((p - 0.06) / 0.36)), zip = ease(clamp((p - 0.48) / 0.22)), cold = p > 0.72 && p < 0.94;
    let s = counter() + `<rect x="80" y="40" width="200" height="168" rx="16" fill="#EAF6FF" opacity=".75" ${st()}/>`;
    const top = lerp(110, 62, press);
    let f = "";
    if (SRV_FREEZE[key]) f = `<path d="M92 ${top + 10} C120 ${top - 6 + press * 6} 240 ${top - 6 + press * 6} 268 ${top + 10} L268 194 C268 200 92 200 92 194 Z" fill="${SRV_FREEZE[key]}" ${st(2.5)} opacity=".95"/>`;
    else for (let i = 0; i < 12; i++) { const x = 108 + (i % 4) * 48, y = lerp(186 - Math.floor(i / 4) * 28, 186 - Math.floor(i / 4) * 44, press); f += key === "meatballs" ? `<circle cx="${x}" cy="${y}" r="16" fill="#6B3A22" ${st(2.4)}/>` : key === "blueberries" ? `<circle cx="${x}" cy="${y}" r="13" fill="#4A5A9C" ${st(2.2)}/><circle cx="${x - 4}" cy="${y - 4}" r="3" fill="#fff" opacity=".6"/>` : piece(FOODS.chicken, "cube", x, y, i * 20, 1.5); }
    s += f;
    if (press < 1) s += `<ellipse cx="180" cy="${lerp(80, 50, press)}" rx="${lerp(60, 6, press)}" ry="${lerp(18, 2, press)}" fill="#fff" opacity=".7"/>`;
    s += `<path d="M84 52 L276 52" stroke="${C.blue}" stroke-width="6" stroke-linecap="round"/>`;
    if (zip > 0) s += `<path d="M84 52 L${lerp(84, 276, zip)} 52" stroke="#3E6BA0" stroke-width="8" stroke-linecap="round"/>` + `<rect x="${lerp(84, 276, zip) - 8}" y="42" width="16" height="20" rx="4" fill="#fff" ${st(3)}/>`;
    if (press > 0 && press < 1) s += T.palm(180, top + 30, 1.1);
    if (zip > 0 && zip < 1) s += T.pinch(lerp(84, 276, zip), 30, 0.9);
    if (cold) s += FX.cold(310, 80, 0.9) + FX.cold(52, 150, 0.7);
    return s;
  } });

// ---------- Serve with a side ----------
const SRV_SIDE = {
  whiterice: () => srvBowl(0, 0, 54, "#FBF8EE", `<path d="M-44 2 C-36 -30 36 -30 44 2 Z" fill="#FBF8EE" ${st(2.5)}/>`),
  naan: () => `<ellipse cx="0" cy="10" rx="56" ry="14" fill="#fff" ${st(3)}/>` + [0, 1].map(j => `<path transform="translate(${j * 10 - 6} ${-j * 12})" d="M-46 4 C-46 -14 40 -20 48 -2 C50 12 -44 18 -46 4 Z" fill="#F1D49A" ${st(3)}/><circle cx="${-14 + j * 10}" cy="${-6 - j * 12}" r="4" fill="#C98A4B"/>`).join(""),
  bread: () => `<ellipse cx="0" cy="10" rx="56" ry="14" fill="#fff" ${st(3)}/>` + [-24, 0, 24].map((x, j) => `<path transform="translate(${x} ${-4 - j * 2})" d="M-14 14 L-14 -16 C-14 -28 14 -28 14 -16 L14 14 Z" fill="#F6E3B8" stroke="#C98A4B" stroke-width="6"/><path transform="translate(${x} ${-4 - j * 2})" d="M-14 14 L-14 -16 C-14 -28 14 -28 14 -16 L14 14 Z" fill="none" ${st(2.5)}/>`).join(""),
  tortilla: () => `<ellipse cx="0" cy="10" rx="56" ry="14" fill="#fff" ${st(3)}/>` + [0, 1, 2].map(j => `<ellipse cx="0" cy="${4 - j * 7}" rx="46" ry="12" fill="#F1D9A0" ${st(2.6)}/>`).join(""),
  noodles: () => srvBowl(0, 0, 54, "#F2D27A", `<path d="M-44 2 C-36 -26 36 -26 44 2 Z" fill="#F2D27A" ${st(2.5)}/><path d="M-30 -6 C-16 -16 0 0 14 -10 C22 -16 30 -8 34 -4" fill="none" stroke="#C9A040" stroke-width="2.5"/>`),
  greens: () => srvBowl(0, 0, 54, "#6DB04A", [-26, -8, 10, 28].map((x, j) => `<path transform="translate(${x} ${-8 - (j % 2) * 6}) rotate(${j * 40})" d="M-14 0 C-10 -10 10 -10 14 0 C10 8 -10 8 -14 0 Z" fill="${j % 2 ? "#9BCB6A" : "#4E9A3A"}" ${st(2)}/>`).join("")),
};
LIB.add({ cat: "serve", name: "servewith", foods: Object.keys(SRV_SIDE), dur: 2.8,
  steps: ["Serve with rice, roti or any bread", "Serve with basmati rice.", "Serve with warm tortillas on the side", "Serve with buttered egg noodles", "Serve with crusty bread"],
  draw(t, F, key) {
    const p = t / 2.8, q = ease(clamp((p - 0.1) / 0.4)), x = lerp(380, 262, q);
    let s = counter() + g(srvBowl(0, 0, 70, "#9C5A2A", [[-30, 2], [0, -4], [26, 4]].map(([a, b], i) => `<path transform="translate(${a} ${b})" d="M-8 -5 L6 -7 L9 3 L1 7 L-8 4 Z" fill="${i % 2 ? "#F4E3B0" : "#E8A23C"}" ${st(1.8)}/>`).join("")), 112, 140) + FX.steam(t, [92, 112, 132], 112, 0.5);
    s += `<g opacity="${srvFade(p, 0.92)}">${g(SRV_SIDE[key](), x, 150)}</g>`;
    if (q < 1) s += T.palm(x + 60, 150, 1, 90);
    return s;
  } });
