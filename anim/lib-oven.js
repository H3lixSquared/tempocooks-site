// ---------- Tempo animation library: category "oven" ----------
// Oven, grill, and machines: in/out of the oven with mitts, racks, broil,
// sheet-pan roasting, roasts and thermometers, foil, air fryer, slow cooker,
// pressure cooker, grill, toaster, waffle iron, fridge/freezer, rising dough,
// resting meat. Everything lives in an IIFE so local helpers can't clash.
// Local helpers are prefixed "oven" (ovenFront, ovenSide, ovenItem, ovenBit...).
(() => {
const OVD = 3.6; // default loop for oven in/out scenes
// Fades the changing part out just before the loop restarts (first frame stays full).
const fadeIn = (t, dur, a = 0.22, b = 0.22) => clamp((dur - t) / b);
const op = (o, s) => `<g opacity="${o.toFixed(3)}">${s}</g>`;
const NS = (w) => st(w, 'vector-effect="non-scaling-stroke"');
const BROWN = "#9C5A22", CHAR = "#5A3014";
const cookC = (raw, done, c) => mixColor(raw, done, clamp(c));

// ---------- Oven, front view ----------
// door 0 closed .. 1 open (flap down). Window shows the inside. Racks at y list.
// Inside spans x 46..314, y 60..218. Broil element at y 92.
function ovenFront({ door = 0, glow = 0.55, inner = "", broil = 0, racks = [178], light = 0, dark = 0 } = {}) {
  let s = `<rect x="30" y="10" width="300" height="226" rx="18" fill="#fff" ${st()}/>
    <path d="M30 50 L30 28 Q30 10 48 10 L312 10 Q330 10 330 28 L330 50 Z" fill="#E0DCD1" ${st()}/>
    <circle cx="66" cy="30" r="11" fill="#fff" ${st(3)}/><path d="M66 30 l0 -8" ${st(3)}/>
    <circle cx="294" cy="30" r="11" fill="#fff" ${st(3)}/><path d="M294 30 l6 -6" ${st(3)}/>
    <rect x="148" y="21" width="64" height="18" rx="5" fill="#2A2A2A" ${st(2.5)}/>
    <rect x="46" y="60" width="268" height="158" rx="8" fill="${mixColor("#4A423C", "#F2A04B", glow * 0.75)}" ${st(3.5)}/>`;
  if (light) s += `<rect x="48" y="62" width="264" height="154" rx="7" fill="#FFF3C4" opacity="${(light * 0.45).toFixed(2)}"/>`;
  const zz = [...Array(13)].map((_, i) => `${i ? "L" : "M"}${60 + i * 20} ${i % 2 ? 98 : 88}`).join(" ");
  if (broil > 0) s += `<path d="${zz}" fill="none" stroke="#F7C94B" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" opacity="${(broil * 0.55).toFixed(2)}"/>`;
  s += `<path d="${zz}" fill="none" ${st(7)}/><path d="${zz}" fill="none" stroke="${mixColor("#8A8A8A", "#F0502A", broil)}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`;
  for (const y of racks) s += `<path d="M50 ${y} L310 ${y}" ${st(5)}/><path d="M50 ${y} L310 ${y}" stroke="#C9CED3" stroke-width="2"/>`;
  s += inner;
  const k = Math.cos(clamp(door) * Math.PI / 2);
  if (k > 0.08) {
    const top = 222 - 166 * k, wt = top + 26 * k, wb = 222 - 16 * k;
    s += `<rect x="62" y="${wt}" width="236" height="${wb - wt}" rx="8" fill="#2A2420" opacity="${(0.16 + dark * 0.6).toFixed(2)}"/>
      <path d="M40 ${top} L320 ${top} L320 222 L40 222 Z M62 ${wt} L62 ${wb} L298 ${wb} L298 ${wt} Z" fill="#fff" fill-rule="evenodd" ${st()}/>
      <path d="M62 ${wt} L298 ${wt} L298 ${wb} L62 ${wb} Z" fill="none" ${st(3)}/>
      <path d="M86 ${wt + 10 * k} l26 ${30 * k} M100 ${wt + 8 * k} l14 ${16 * k}" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".6"/>
      <path d="M78 ${top + 13 * k} L282 ${top + 13 * k}" ${st(8)}/><path d="M78 ${top + 13 * k} L282 ${top + 13 * k}" stroke="${C.steel}" stroke-width="3.5" stroke-linecap="round"/>`;
  }
  if (door > 0.85) s += `<path d="M40 222 L320 222 L336 236 L24 236 Z" fill="#fff" ${st()}/><path d="M70 231 L290 231" ${st(5)}/>`;
  return s;
}
// Heat shimmer lines rising inside the oven.
const ovenHeat = (t, xs, y0, o = 1) => xs.map((x, i) => { const q = (t * 0.6 + i / xs.length) % 1; return `<path d="M${x} ${y0 - q * 40} c-6 -7 6 -11 0 -18" fill="none" stroke="#F0643C" stroke-width="3.5" stroke-linecap="round" opacity="${((1 - q) * 0.8 * o).toFixed(2)}"/>`; }).join("");

// ---------- Oven, side cutaway (for sliding things in and out) ----------
// Door hinges at the bottom right and folds down to the right. Rack at y.
function ovenSide({ open = 0, glow = 0.55, inner = "", racks = [150], slots = false, hi = null } = {}) {
  let s = `<rect x="16" y="20" width="192" height="196" rx="14" fill="#fff" ${st()}/>
    <path d="M16 58 L16 34 Q16 20 30 20 L194 20 Q208 20 208 34 L208 58 Z" fill="#E0DCD1" ${st()}/>
    <rect x="206" y="31" width="10" height="16" rx="3" fill="#fff" ${st(3)}/>
    <rect x="30" y="70" width="166" height="136" rx="6" fill="${mixColor("#4A423C", "#F2A04B", glow * 0.75)}" ${st(3.5)}/>`;
  if (slots) for (const y of [100, 120, 140, 160, 180]) s += `<rect x="30" y="${y - 4}" width="12" height="8" rx="2" fill="#2A2420"/><rect x="184" y="${y - 4}" width="12" height="8" rx="2" fill="#2A2420"/>`;
  if (hi) s += `<rect x="31" y="${hi - 10}" width="164" height="20" rx="5" fill="${C.green}" opacity=".45"/>`;
  for (const y of racks) s += `<path d="M34 ${y} L194 ${y}" ${st(5)}/><path d="M34 ${y} L194 ${y}" stroke="#C9CED3" stroke-width="2"/>`;
  s += inner;
  s += `<g transform="rotate(${clamp(open) * 90} 204 214)"><rect x="196" y="80" width="14" height="134" rx="5" fill="#fff" ${st()}/><path d="M210 96 L222 96 L222 130 L210 130" fill="none" ${st(5)}/></g>`;
  return s;
}
// Oven mitts gripping a pan's two ends (side view), mitt pair centered on x,y.
const ovenMitts = (x, y, half = 62) => `<g transform="translate(${x + half} ${y}) rotate(-90) scale(.72)">${T.mitt(0, 0)}</g>` +
  `<g transform="translate(${x - half} ${y}) scale(-1 1) rotate(-90) scale(.72)">${T.mitt(0, 0)}</g>`;

// ---------- Little vegetable / fries bits that brown (top view) ----------
const OV_VEG = {
  potato: ["chunk", "#F4E3B0", "#C9A26B"], sweetpotato: ["chunk", "#F59E3A", "#B5633E"], squash: ["cube", "#F59E3A", "#E8A23C"],
  beet: ["cube", "#B5306B", "#7A1F4A"], eggplant: ["cube", "#F1E8C8", "#5B2C6F"], carrot: ["coin", "#F08A3C", "#F6B27A"],
  parsnip: ["stick", "#F1E3B0", "#E8D4A8"], fries: ["stick", "#F7DC7A", "#F2C84B"], broccoli: ["floret", "#4E9A3A", "#7BBF5A"],
  cauliflower: ["floret", "#F4EFDF", "#FBF8EE"], brusselsprouts: ["half", "#6DB04A", "#E9F2C7"], zucchini: ["half", "#4E9A3A", "#E9F2C7"],
  chickpeas: ["pea", "#E8C47A", "#E8C47A"], cherrytomato: ["pea", "#E8503C", "#E8503C"], mushroom: ["mush", "#C9A27A", "#F1E3C9"],
  pepper: ["strip", "#E8503C", "#F07A62"], onion: ["wedge", "#F4E6F1", "#E7B46A"], redonion: ["wedge", "#E9CFE0", "#8E3F6B"],
  greenbeans: ["bean", "#4E9A3A", "#8CC152"], asparagus: ["bean", "#6DA040", "#A6CF7A"], veggies: ["mixed", "", ""],
};
const OV_MIX = ["#F08A3C", "#8CC152", "#E8503C", "#F7C94B", "#4E9A3A"];
function ovenBit(key, x, y, rot = 0, b = 0, s = 1, i = 0) {
  let [shape, c1, c2] = OV_VEG[key] || OV_VEG.veggies;
  if (shape === "mixed") { shape = "chunk"; c1 = c2 = OV_MIX[i % OV_MIX.length]; }
  const dark = ["broccoli", "zucchini", "brusselsprouts", "greenbeans", "asparagus", "beet", "eggplant"].includes(key);
  const col = (c) => mixColor(c, dark ? "#4A4020" : BROWN, b * 0.5);
  const ch = `stroke="${CHAR}" stroke-width="3.2" stroke-linecap="round" fill="none" opacity="${(b * 0.9).toFixed(2)}"`;
  let d = "";
  switch (shape) {
    case "chunk": d = `<path d="M-12 -8 L8 -11 L13 4 L2 11 L-11 7 Z" fill="${col(c1)}" ${st(2.6)}/><path d="M-11 -8 L7 -10" stroke="${c2}" stroke-width="3.5" stroke-linecap="round"/><path d="M10 -4 L12 4 L2 10" ${ch}/>`; break;
    case "cube": d = `<rect x="-10" y="-9" width="20" height="18" rx="3" fill="${col(c1)}" ${st(2.6)}/><path d="M-7 -6 L7 -6" stroke="${c2}" stroke-width="3" stroke-linecap="round"/><path d="M8 -4 L8 6 L-6 6" ${ch}/>`; break;
    case "coin": d = `<ellipse rx="12" ry="10" fill="${col(c1)}" ${st(2.6)}/><ellipse rx="7" ry="6" fill="${col(c2)}"/><path d="M-9 5 C-4 9 4 9 9 5" ${ch}/>`; break;
    case "stick": d = `<rect x="-18" y="-5" width="36" height="10" rx="3.5" fill="${col(c1)}" ${st(2.4)}/><path d="M-14 3 L14 3" ${ch}/>`; break;
    case "floret": d = `<path d="M-4 2 L-4 13 L4 13 L4 2" fill="${col(c2)}" ${st(2.2)}/>` + [[-7, -2], [0, -7], [7, -2]].map(([a, bb]) => `<circle cx="${a}" cy="${bb}" r="7" fill="${col(c1)}" ${st(2.2)}/>`).join("") + `<path d="M-10 -6 L-6 -9 M4 -11 L8 -8" ${ch}/>`; break;
    case "half": d = `<circle r="11" fill="${col(c1)}" ${st(2.4)}/><ellipse rx="7" ry="6.5" fill="${col(c2)}"/><path d="M-5 1 C-2 4 2 4 5 1" ${ch}/>`; break;
    case "pea": d = `<circle r="7.5" fill="${col(c1)}" ${st(2.2)}/><path d="M-3 -3 q2 -2 4 -1" stroke="#fff" stroke-width="2" fill="none" opacity=".6"/><path d="M-4 4 q4 2 7 -1" ${ch}/>`; break;
    case "mush": d = `<rect x="-4" y="0" width="8" height="10" rx="2" fill="${col(c2)}" ${st(2.2)}/><path d="M-13 2 C-13 -14 13 -14 13 2 Z" fill="${col(c1)}" ${st(2.4)}/><path d="M-9 -2 C-4 -8 4 -8 9 -2" ${ch}/>`; break;
    case "strip": d = `<rect x="-16" y="-5.5" width="32" height="11" rx="5" fill="${col(c1)}" ${st(2.4)}/><path d="M-12 2 L12 2" ${ch}/>`; break;
    case "wedge": d = `<path d="M-12 6 C-12 -10 12 -10 12 6 Z" fill="${col(c1)}" ${st(2.4)}/><path d="M-7 6 C-7 -3 7 -3 7 6" fill="none" stroke="${c2}" stroke-width="2.4"/><path d="M-10 -2 C-5 -8 5 -8 10 -2" ${ch}/>`; break;
    case "bean": d = `<rect x="-20" y="-3.5" width="40" height="7" rx="3.5" fill="${col(c1)}" ${st(2.2)}/><path d="M-12 0 L-6 0 M4 0 L10 0" ${ch}/>`; break;
  }
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">${d}</g>`;
}
const VEG_KEYS = Object.keys(OV_VEG);

// ---------- Things that go in the oven, side view (centered x=0, bottom y=0) ----------
const sheetS = (w = 140) => `<rect x="${-w / 2}" y="-9" width="${w}" height="9" rx="3" fill="${C.steelDark}" ${st(3)}/>`;
const slabS = (color, x = 0, y = -9, w = 52, h = 22) => `<path d="M${x - w} ${y} C${x - w + 2} ${y - h} ${x + w - 8} ${y - h - 2} ${x + w} ${y} Z" fill="${color}" ${st(3.5)}/>`;
const roastingPan = (inner = "") => `${inner}<path d="M-72 -28 L72 -28 L64 0 L-64 0 Z" fill="#6B747C" ${st()}/><path d="M-72 -22 L-84 -24 M72 -22 L84 -24" ${st(6)}/>`;
const dishS = (top, spots = 0, bub = 0, t = 0) => {
  let s = `<path d="M-62 -38 C-50 -66 50 -66 62 -38 Z" fill="${top}" ${st(3.5)}/>`;
  if (spots > 0) s += [[-36, -48], [-8, -56], [20, -54], [42, -46], [-20, -44], [6, -46]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="6" ry="3" fill="${CHAR}" opacity="${(spots * 0.55).toFixed(2)}"/>`).join("");
  const b = bub > 0 ? [-52, -40, 40, 52].map((x, i) => { const q = (t * 1.6 + i * 0.37) % 1; return `<circle cx="${x}" cy="${-46 - q * 8}" r="${2.5 + q * 3}" fill="#FFF3C4" ${st(1.8)} opacity="${(bub * (1 - q)).toFixed(2)}"/>`; }).join("") : "";
  return s + `<rect x="-66" y="-42" width="132" height="42" rx="10" fill="#fff" ${st()}/><rect x="-80" y="-34" width="16" height="14" rx="5" fill="#fff" ${st(3)}/><rect x="64" y="-34" width="16" height="14" rx="5" fill="#fff" ${st(3)}/>` + b;
};
const loafTinS = (inner) => `${inner}<path d="M-52 -36 L52 -36 L44 0 L-44 0 Z" fill="${C.steelDark}" ${st()}/>`;
const skilletS = (inner) => `${inner}<path d="M-62 -22 L62 -22 L54 0 L-54 0 Z" fill="${C.pan}" ${st()}/><path d="M60 -16 L80 -24" ${st(10)}/><path d="M60 -16 L80 -24" stroke="${C.handle}" stroke-width="5" stroke-linecap="round"/>`;
const SHEET_PROTEIN = ["nuggets", "wings", "drumsticks", "salmon", "chicken", "sausage", "meatballs", "porkchop", "tofu", "shrimp", "bacon", "fish", "steak"];
// c = how cooked 0..1; t for bubbles.
function ovenItem(key, c = 0, t = 0) {
  const F = foodFor(key);
  if (VEG_KEYS.includes(key)) {
    let s = "";
    for (let i = 0; i < 7; i++) s += ovenBit(key, -54 + i * 18, -15 - (i % 2) * 3, (i * 47) % 50 - 25, c, 0.85, i);
    return s + sheetS();
  }
  switch (key) {
    case "casserole": return dishS(cookC("#FBE9A0", "#E2A24A", c), c, c, t);
    case "lasagna": return dishS(cookC("#F7E7A8", "#E8A23C", c), c, c, t) + `<path d="M-50 -38 L-30 -38 M20 -38 L44 -38" stroke="#C8302A" stroke-width="5" stroke-linecap="round"/>`;
    case "pie": return `<path d="M-58 -22 C-50 -54 50 -54 58 -22 Z" fill="${cookC("#F4DFB0", "#C98A4B", c)}" ${st(3.5)}/><path d="M-30 -40 l6 -6 M-4 -46 l6 -6 M22 -42 l6 -6" ${st(3)}/>
      ${c > 0.5 ? [-40, 40].map((x, i) => { const q = (t * 1.4 + i * 0.5) % 1; return `<circle cx="${x}" cy="${-26 - q * 6}" r="${2.5 + q * 2}" fill="#9C2F4A" ${st(1.4)} opacity="${(1 - q).toFixed(2)}"/>`; }).join("") : ""}
      <path d="M-70 -24 L70 -24 L54 0 L-54 0 Z" fill="#F4E3C8" ${st()}/>`;
    case "pizza": return `<ellipse cx="0" cy="-15" rx="64" ry="9" fill="${cookC("#F4DFB0", "#D99A5B", c)}" ${st(3.5)}/><ellipse cx="0" cy="-17" rx="52" ry="6" fill="${cookC("#FBF1D4", "#F7C94B", c)}"/>
      ${[-30, 0, 30].map(x => `<ellipse cx="${x}" cy="-17" rx="8" ry="3.5" fill="#C8302A" ${st(1.6)}/>`).join("")}${c > 0.4 ? [-16, 16, 42].map(x => `<ellipse cx="${x}" cy="-18" rx="4" ry="2" fill="${CHAR}" opacity="${((c - 0.4) * 1.2).toFixed(2)}"/>`).join("") : ""}${sheetS(150)}`;
    case "wholechicken": case "turkey": return roastingPan(g(whole(F, c), 0, -40, 0.72));
    case "beef": case "pork": case "lamb": return roastingPan(`<ellipse cx="0" cy="-34" rx="52" ry="24" fill="${cookC(F.fill, F.cooked || BROWN, c)}" ${st()}/><path d="M-26 -56 L-26 -12 M0 -58 L0 -10 M26 -56 L26 -12" stroke="#fff" stroke-width="3" opacity=".9"/>`);
    case "meatloaf": return loafTinS(`<path d="M-48 -34 C-44 -64 44 -64 48 -34 Z" fill="${cookC("#C9605A", "#7A3A1C", c)}" ${st(3.5)}/><path d="M-36 -50 C-14 -60 14 -60 36 -50" fill="none" stroke="#C8302A" stroke-width="8" stroke-linecap="round"/>`);
    case "bread": case "breaddough": case "dough": return loafTinS(`<path d="M-48 -34 C-44 ${-62 - c * 12} 44 ${-62 - c * 12} 48 -34 Z" fill="${cookC("#F4DFB0", "#C98A4B", c)}" ${st(3.5)}/>${c > 0.3 ? `<path d="M-22 ${-52 - c * 8} l12 -6 M0 ${-56 - c * 8} l12 -6 M22 ${-52 - c * 8} l12 -6" stroke="${CHAR}" stroke-width="3" stroke-linecap="round" opacity="${c.toFixed(2)}"/>` : ""}`);
    case "cookies": return [-48, -16, 16, 48].map(x => `<ellipse cx="${x}" cy="-9" rx="${lerp(12, 15, c)}" ry="${lerp(13, 6, c)}" fill="${cookC("#E8C49A", "#D99A5B", c)}" ${st(3)}/><circle cx="${x - 4}" cy="${-12 + c * 3}" r="2.6" fill="#4A2A1A"/><circle cx="${x + 5}" cy="${-14 + c * 5}" r="2.6" fill="#4A2A1A"/>`).join("") + sheetS();
    case "muffins": return [-44, 0, 44].map(x => `<path d="M${x - 18} -16 C${x - 18} ${-18 - c * 18} ${x + 18} ${-18 - c * 18} ${x + 18} -16 Z" fill="${cookC("#F6D9A3", "#D9A55B", c)}" ${st(3)}/>`).join("") + `<rect x="-68" y="-18" width="136" height="18" rx="5" fill="${C.steelDark}" ${st()}/>`;
    case "cake": return `<path d="M-52 -32 C-40 ${-34 - c * 16} 40 ${-34 - c * 16} 52 -32 Z" fill="${cookC("#F6D9A3", "#D9A55B", c)}" ${st(3)}/><rect x="-56" y="-34" width="112" height="34" rx="4" fill="${C.steelDark}" ${st()}/>`;
    case "brownies": return `<path d="M-52 -30 L52 -30 L52 -36 L-52 -36 Z" fill="${cookC("#6B3A22", "#4A2A1A", c)}" ${st(3)}/><rect x="-56" y="-32" width="112" height="32" rx="3" fill="${C.steelDark}" ${st()}/>`;
    case "fries": return [...Array(9)].map((_, i) => ovenBit("fries", -56 + i * 14, -14, 20 + (i % 3) * 30, c, 0.75)).join("") + sheetS();
    case "nuggets": return [-48, -24, 0, 24, 48].map(x => `<path d="M${x - 11} -9 C${x - 12} -24 ${x + 12} -24 ${x + 11} -9 Z" fill="${cookC("#F6D9A3", "#C98340", c)}" ${st(3)}/>`).join("") + sheetS();
    case "wings": case "drumsticks": return g(whole(F, c), 0, -22, 0.72) + sheetS();
    case "sausage": return [-44, 0, 44].map(x => `<rect x="${x - 20}" y="-23" width="40" height="14" rx="7" fill="${cookC(F.fill, F.cooked, c)}" ${st(3)}/>`).join("") + sheetS();
    case "meatballs": return [-48, -24, 0, 24, 48].map(x => `<circle cx="${x}" cy="-19" r="10" fill="${cookC(F.fill, F.cooked, c)}" ${st(3)}/>`).join("") + sheetS();
    case "tofu": return [-48, -24, 0, 24, 48].map(x => `<rect x="${x - 9}" y="-27" width="18" height="18" rx="3" fill="${cookC(F.fill, F.cooked, c)}" ${st(3)}/>`).join("") + sheetS();
    case "shrimp": return [-42, 0, 42].map(x => g(whole(F, c), x, -22, 0.32)).join("") + sheetS();
    case "bacon": return [-30, 30].map(x => `<path d="M${x - 26} -12 C${x - 16} -18 ${x - 8} -8 ${x} -13 C${x + 8} -18 ${x + 16} -8 ${x + 26} -13" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M${x - 26} -12 C${x - 16} -18 ${x - 8} -8 ${x} -13 C${x + 8} -18 ${x + 16} -8 ${x + 26} -13" fill="none" stroke="${cookC(F.fill, F.cooked, c)}" stroke-width="5" stroke-linecap="round"/>`).join("") + sheetS();
    case "salmon": case "chicken": case "fish": case "porkchop": case "steak":
      return slabS(cookC(F.fill, F.cooked || BROWN, c), -30, -9, 32, 18) + slabS(cookC(F.fill, F.cooked || BROWN, c), 34, -9, 32, 18) + sheetS();
    case "egg": return skilletS(`<path d="M-56 -20 C-50 ${-30 - c * 8} 50 ${-30 - c * 8} 56 -20 Z" fill="${cookC("#F7D27A", "#E8B23C", c)}" ${st(3)}/>`);
  }
  return sheetS();
}
// Skillet versions of meats (for "into the oven in the skillet").
const skilletItem = (key, c) => { const F = foodFor(key); return key === "egg" ? ovenItem("egg", c) : skilletS(slabS(cookC(F.fill, F.cooked || BROWN, c), 0, -18, 46, 20)); };

// ---------- Generic: slide a pan into / out of the oven with mitts ----------
function ovenSlide(t, dur, item, mode, cooked) {
  let door, x, mitt, mittO = 1;
  if (mode === "in") {
    door = phase(t, dur, 0.2, 0.7) - phase(t, dur, 2.3, 2.8);
    x = lerp(256, 113, phase(t, dur, 0.8, 1.8));
    mitt = phase(t, dur, 1.9, 2.3); mittO = 1 - mitt;
  } else {
    door = phase(t, dur, 0.2, 0.7) * (1 - phase(t, dur, 3.3, 3.55));
    mitt = 1 - phase(t, dur, 0.7, 1.1); mittO = 1 - mitt;
    x = lerp(113, 256, phase(t, dur, 1.2, 2.2));
  }
  const y = lerp(147, 138, clamp((x - 150) / 60));
  const f = fadeIn(t, dur);
  const pan = op(f, g(item, x, y, 1.05) + op(mittO, ovenMitts(x + mitt * 50, y - 18, 74)));
  let s = ovenSide({ open: door, inner: pan + (mode === "in" ? ovenHeat(t, [70, 112, 154], 118, phase(t, dur, 2.8, 3.2)) : "") });
  if (mode === "out" && x > 200) s += steam(t, [x - 30, x, x + 30], y - 50, 0.7);
  return s;
}

// ======================= Oven: in, out, racks, broil, window =======================
const INOUT = ["casserole", "lasagna", "wholechicken", "veggies", "pizza", "cookies", "pie", "salmon"];
LIB.add({ cat: "oven", name: "intooven", foods: INOUT, dur: OVD,
  steps: ["Place the dish in the preheated oven", "Transfer to the oven", "Return to the oven", "Put the baking sheet in the oven"],
  draw(t, F, key) { return ovenSlide(t, OVD, ovenItem(key === "bread" ? "breaddough" : key, 0, t), "in"); } });
LIB.add({ cat: "oven", name: "outofoven", foods: INOUT, dur: OVD,
  steps: ["Remove from the oven", "Remove the pizza from the oven", "Remove the pot from the oven", "Carefully take the pan out of the oven"],
  draw(t, F, key) { return ovenSlide(t, OVD, ovenItem(key, 1, t), "out"); } });
LIB.add({ cat: "oven", name: "skilletoven", foods: ["chicken", "steak", "porkchop", "egg"], dur: OVD,
  steps: ["Transfer the skillet to the oven", "Place the oven-safe skillet in the oven to finish cooking", "Set the skillet on a sheet pan and bake"],
  draw(t, F, key) { return ovenSlide(t, OVD, skilletItem(key, 0.55), "in"); } });
LIB.add({ cat: "oven", name: "braiseoven", foods: null, dur: OVD,
  steps: ["Cover the pot with a lid, transfer to the preheated oven, and braise for 2 hours", "Cover and place back in oven for about an hour more"],
  draw(t) {
    const pot = `<path d="M-60 -54 L60 -54 L56 0 L-56 0 Z" fill="#C8402A" ${st()}/><path d="M-60 -40 L-74 -40 M60 -40 L74 -40" ${st(7)}/><path d="M-64 -54 C-50 -74 50 -74 64 -54 Z" fill="#C8402A" ${st()}/><rect x="-10" y="-80" width="20" height="10" rx="4" fill="${C.handle}" ${st(3)}/>`;
    return ovenSlide(t, OVD, pot, "in");
  } });

// Rack position: a rack slides into the chosen slot.
const RACK = { rackupper: [100, "Preheat the oven to 350°F with a rack in the upper third", "Place the tray in the top 2nd rack"],
  rackmiddle: [140, "Set an oven rack in the middle position", "Arrange a rack in center of oven"],
  racklower: [180, "Set a rack in the lower middle position", "Bake the pizza on the lower oven rack"] };
for (const [name, [y, ...steps]] of Object.entries(RACK)) LIB.add({ cat: "oven", name, foods: null, dur: 2.8, steps,
  draw(t) {
    const p = phase(t, 2.8, 0.3, 1.4), f = fadeIn(t, 2.8, 0.2, 0.3);
    const rx = lerp(150, 0, p);
    const rack = op(f, `<g transform="translate(${rx} 0)"><path d="M34 ${y} L194 ${y}" ${st(5)}/><path d="M34 ${y} L194 ${y}" stroke="#C9CED3" stroke-width="2"/>${[50, 80, 110, 140, 170].map(x => `<path d="M${x} ${y - 4} L${x} ${y + 4}" ${st(2.4)}/>`).join("")}</g>` +
      g(fist(), 214 + rx, y, 0.9));
    let s = ovenSide({ open: 1, glow: 0.1, racks: [], slots: true, hi: p > 0.98 ? y : null, inner: rack });
    if (p > 0.98) s += T.check(300, 60, 0.9 * f);
    return s;
  } });

// Rotate the pan halfway: door open, the back row is browner; turn it around.
const ROT = ["cookies", "pizza", "veggies"];
LIB.add({ cat: "oven", name: "rotatepan", foods: ROT, dur: 3.2,
  steps: ["Rotate the pan halfway through baking", "Rotate the baking sheet front to back halfway through", "Turn the pan around halfway through"],
  draw(t, F, key) {
    const r = 180 * phase(t, 3.2, 0.9, 2.1), f = fadeIn(t, 3.2);
    let items = `<rect x="-124" y="-80" width="248" height="160" rx="12" fill="${C.steelDark}" ${NS(4)}/>`;
    const brownAt = (y) => y < 0 ? 0.9 : 0.25;
    if (key === "cookies") for (const [x, y] of [[-80, -42], [0, -42], [80, -42], [-80, 40], [0, 40], [80, 40]]) items += `<circle cx="${x}" cy="${y}" r="26" fill="${cookC("#F0C88A", "#B5763A", brownAt(y))}" ${NS(3)}/>`;
    else if (key === "pizza") items += `<circle r="74" fill="${C.golden}" ${NS(4)}/><circle r="60" fill="#F7E7A8" ${NS(2)}/><path d="M-60 -10 A60 60 0 0 1 60 -10 L60 -60 L-60 -60 Z" fill="#C98340" opacity=".55"/><path d="M-74 -8 A74 74 0 0 1 74 -8" fill="none" stroke="${CHAR}" stroke-width="10" opacity=".55"/>` + [[-26, 20], [24, 30], [0, -30], [30, -24]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="10" fill="#C8302A" ${NS(2)}/>`).join("");
    else for (let i = 0; i < 12; i++) { const x = -96 + (i % 6) * 38, y = i < 6 ? -40 : 40; items += ovenBit(key, x, y, i * 31, brownAt(y), 1.6, i); }
    const tray = `<g transform="translate(180 168) scale(1 .42) rotate(${r})">${items}</g>`;
    const mp = (dx) => { const a = r * Math.PI / 180; return [180 + dx * Math.cos(a), 168 + dx * Math.sin(a) * 0.42]; };
    const [ax, ay] = mp(138), [bx, by] = mp(-138);
    const mittsOn = phase(t, 3.2, 0.5, 0.9) * (1 - phase(t, 3.2, 2.3, 2.7));
    const mitts = op(mittsOn, `<g transform="translate(${ax} ${ay - 10}) rotate(-90) scale(.7)">${T.mitt(0, 0)}</g><g transform="translate(${bx} ${by - 10}) scale(-1 1) rotate(-90) scale(.7)">${T.mitt(0, 0)}</g>`);
    return ovenFront({ door: 1, glow: 0.5, racks: [196], inner: op(f, tray + mitts) });
  } });

// Broil: top element glows, the top browns and bubbles.
LIB.add({ cat: "oven", name: "broil", foods: ["casserole", "lasagna", "pizza", "salmon", "steak", "bread"], dur: 3,
  steps: ["Broil 2 to 3 minutes, watching closely, until the top is deep golden and spotty", "Transfer to the oven to broil for another 2-3 minutes, until the cheese is darkened in spots", "Broil until the cheese is bubbly and browned"],
  draw(t, F, key) {
    const c = phase(t, 3, 0.2, 2.4), f = fadeIn(t, 3, 0.15, 0.3);
    const it = key === "bread" ? `<path d="M-60 -12 L-60 -30 C-60 -38 -10 -38 -10 -30 L-10 -12 Z M10 -12 L10 -30 C10 -38 60 -38 60 -30 L60 -12 Z" fill="${cookC("#F6E3B8", "#C98340", c)}" ${st(3.5)}/>` + sheetS() : ovenItem(key, c, t);
    return ovenFront({ broil: 0.8 + 0.2 * wave(t, 3, 3), glow: 0.25, racks: [198], inner: op(f, g(it, 180, 198, 1.35)) + ovenHeat(t, [130, 180, 230], 120, 0.7) });
  } });

// Check through the oven window: light on, food visible.
LIB.add({ cat: "oven", name: "ovenwindow", foods: ["cookies", "casserole", "pie", "bread", "pizza", "wholechicken"], dur: 3,
  steps: ["Check through the oven window", "Keep an eye on it during the last 10 minutes", "Check it midway through"],
  draw(t, F, key) {
    const on = phase(t, 3, 0.5, 0.8) * (1 - phase(t, 3, 2.6, 2.9));
    const press = phase(t, 3, 0.2, 0.5) - phase(t, 3, 0.6, 0.9);
    let s = ovenFront({ glow: 0.4, light: on, dark: 1 - on, racks: [196], inner: g(ovenItem(key, 0.6, t), 180, 196, 1.6) });
    s += `<circle cx="244" cy="30" r="7" fill="${on > 0.5 ? C.yellow : "#fff"}" ${st(2.6)}/>`;
    s += g(T.pinch(0, 0, 1, 90), 266 - 8 * press, 30);
    return s;
  } });

// ======================= Sheet pans =======================
const ROASTVEG = ["potato", "carrot", "broccoli", "brusselsprouts", "sweetpotato", "cauliflower", "squash", "chickpeas", "fries", "veggies",
  "zucchini", "mushroom", "pepper", "onion", "redonion", "greenbeans", "cherrytomato", "asparagus"];
const sheetTop = () => `<rect x="34" y="34" width="292" height="182" rx="12" fill="${C.steelDark}" ${st()}/><rect x="46" y="46" width="268" height="158" rx="8" fill="#B9C0C6"/>`;
const GRID = [...Array(15)].map((_, i) => [80 + (i % 5) * 50, 80 + Math.floor(i / 5) * 46]);
LIB.add({ cat: "oven", name: "spreadveg", foods: ROASTVEG, dur: 3.2,
  steps: ["Spread the vegetables in a single layer on the baking sheet", "Arrange in one layer, not crowded", "Spread out on the sheet pan so they roast, not steam"],
  draw(t, F, key) {
    const p = phase(t, 3.2, 1.0, 2.1), f = fadeIn(t, 3.2);
    let s = sheetTop(), bits = "";
    GRID.forEach(([gx, gy], i) => {
      const px = 180 + ((i * 37) % 60) - 30, py = 124 + ((i * 23) % 40) - 20;
      bits += ovenBit(key, lerp(px, gx, p), lerp(py, gy, p), i * 41, 0, 1.5, i);
    });
    s += op(f, bits);
    const sp = 1 - Math.abs(p * 2 - 1);
    if (p > 0.02 && p < 0.98) s += g(T.spatula(0, 0, -20), 180 + lerp(-40, 90, p), 130 + 40 * sp);
    if (t < 1.0 && t > 0.3) s += T.cross(300, 230 - 196, 0.8);
    if (p > 0.98) s += T.check(300, 34, 0.8 * f);
    return s;
  } });
// Roast in the oven until browned at the edges.
LIB.add({ cat: "oven", name: "roastveg", foods: ROASTVEG, dur: 3.2,
  steps: ["Roast until golden brown at the edges", "Roast for 25 to 30 minutes, until tender and browned", "Bake until crispy and golden"],
  draw(t, F, key) {
    const c = phase(t, 3.2, 0.2, 2.6), f = fadeIn(t, 3.2, 0.15, 0.3);
    return ovenFront({ glow: 0.6, racks: [200], inner: op(f, g(ovenItem(key, c), 180, 200, 1.6)) + ovenHeat(t, [120, 180, 240], 140) });
  } });
// Toss / flip halfway with a spatula: the browned side comes up.
LIB.add({ cat: "oven", name: "flipsheet", foods: ["potato", "carrot", "broccoli", "brusselsprouts", "sweetpotato", "chickpeas", "fries", "veggies", "cauliflower", "zucchini", "greenbeans", "pepper", "onion", "mushroom"], dur: 3,
  steps: ["Toss halfway through roasting", "Flip the fries halfway through", "Roast for a further 1 hour, tossing halfway, until golden"],
  draw(t, F, key) {
    const sx = lerp(20, 360, phase(t, 3, 0.4, 2.2)), f = fadeIn(t, 3);
    let s = sheetTop(), bits = "";
    GRID.forEach(([gx, gy], i) => {
      const d = sx - gx, flip = clamp(d / 50);
      const sy = Math.abs(Math.cos(flip * Math.PI));
      const b = flip < 0.5 ? 0.25 : 0.95;
      bits += `<g transform="translate(${gx} ${gy - Math.sin(flip * Math.PI) * 18}) scale(1 ${Math.max(0.08, sy).toFixed(3)})">${ovenBit(key, 0, 0, i * 41, b, 1.5, i)}</g>`;
    });
    s += op(f, bits);
    if (sx > 40 && sx < 340) s += `<g transform="translate(${sx} 0)"><rect x="-10" y="56" width="20" height="150" rx="6" fill="${C.steel}" ${st(3.5)}/><path d="M0 130 L46 120" ${st(8)}/>${g(fist(), 54, 118)}</g>`;
    return s;
  } });
// Proteins and snacks roasting on a sheet in the oven.
LIB.add({ cat: "oven", name: "sheetbake", foods: ["nuggets", "wings", "drumsticks", "salmon", "chicken", "sausage", "meatballs", "bacon"], dur: 3.2,
  steps: ["Bake on the sheet pan until golden and cooked through", "Bake at 400°F for 18-22 minutes", "Bake for 20 mins in the oven until browned and cooked through"],
  draw(t, F, key) {
    const c = phase(t, 3.2, 0.2, 2.6), f = fadeIn(t, 3.2, 0.15, 0.3);
    return ovenFront({ glow: 0.6, racks: [200], inner: op(f, g(ovenItem(key, c), 180, 200, 1.6)) + ovenHeat(t, [120, 180, 240], 140) });
  } });

// ======================= Roasts, basting, foil, thermometer =======================
LIB.add({ cat: "oven", name: "roastpan", foods: ["wholechicken", "turkey", "beef", "pork", "lamb"], dur: 3.4,
  steps: ["Roast the chicken until the skin is golden", "Roast the turkey until golden brown", "Roast the beef in the preheated oven"],
  draw(t, F, key) {
    const c = phase(t, 3.4, 0.2, 2.8), f = fadeIn(t, 3.4, 0.15, 0.3);
    return ovenFront({ glow: 0.6, racks: [204], inner: op(f, g(ovenItem(key, c), 180, 204, 1.3)) + ovenHeat(t, [100, 260], 130) });
  } });
LIB.add({ cat: "oven", name: "baste", foods: ["wholechicken", "turkey", "pork"], dur: 2.6,
  steps: ["Baste with the pan juices", "Spoon the pan juices over the top", "Continue basting every 30 minutes"],
  draw(t, F, key) {
    const p = (t % 2.6) / 2.6;
    let s = counter() + `<g transform="translate(180 214) scale(1.3)">${roastingPan(`<path d="M-60 -10 L60 -10 L60 -22 L-60 -22 Z" fill="${C.golden}"/>` + (key === "pork" ? `<ellipse cx="0" cy="-34" rx="52" ry="24" fill="${F.cooked}" ${st()}/>` : g(whole(F, 0.8), 0, -40, 0.72)))}</g>`;
    // spoon dips at the pan edge, lifts, pours over the top
    const dip = phase(t, 2.6, 0, 0.5), up = phase(t, 2.6, 0.6, 1.2), back = phase(t, 2.6, 2.0, 2.5);
    const x = lerp(lerp(280, 200, up), 280, back), y = lerp(lerp(lerp(150, 186, dip), 96, up), 150, back);
    const tilt = phase(t, 2.6, 1.3, 1.6) * (1 - back);
    if (p > 0.5 && p < 0.78) s += FX.stream(x - 8, y + 4, x - 14, y + 44, "#B5703A", 5);
    s += T.metalSpoon(x, y, -tilt * 40, tilt < 0.5 ? C.golden : null);
    return s;
  } });
LIB.add({ cat: "oven", name: "tent", foods: ["wholechicken", "turkey", "steak", "beef", "pork"], dur: 2.8,
  steps: ["Tent loosely with foil and let rest", "Remove onto a plate, cover loosely with foil", "Cover loosely with foil and rest 10 minutes"],
  draw(t, F, key) {
    const p = phase(t, 2.8, 0.3, 1.3), f = fadeIn(t, 2.8, 0.15, 0.3);
    let s = counter() + `<ellipse cx="180" cy="206" rx="130" ry="14" fill="#fff" ${st()}/>`;
    s += ["wholechicken", "turkey"].includes(key) ? g(whole(F, 1), 180, 168, 1.0) : key === "beef" || key === "pork" ? `<ellipse cx="180" cy="178" rx="70" ry="28" fill="${F.cooked}" ${st()}/>` : g(whole(F, 1), 180, 184, 0.9);
    const y = lerp(-90, 0, p);
    s += op(f, `<g transform="translate(0 ${y})"><path d="M44 202 L180 96 L316 202" fill="${C.foil}" opacity=".95" ${st(4)}/><path d="M180 96 L180 206" stroke="#C9CED3" stroke-width="3"/><path d="M110 150 l24 14 M226 140 l18 20" stroke="#fff" stroke-width="4" stroke-linecap="round"/></g>`);
    if (p > 0.98) s += steam(t, [180], 90, 0.4) + T.timer(310, 54, phase(t, 2.8, 1.3, 2.8), 0.7);
    return s;
  } });
// Instant-read thermometer in the thickest part: reading climbs to green.
const THERMO = ["wholechicken", "turkey", "chicken", "steak", "porkchop", "pork", "salmon", "meatloaf", "patty"];
LIB.add({ cat: "oven", name: "thermometer", foods: THERMO, dur: 3,
  steps: ["Check with a thermometer in the thickest part", "Cook until an instant-read thermometer reads 165°F", "An instant-read thermometer inserted into the middle reads at least 160°F"],
  draw(t, F, key) {
    const inP = phase(t, 3, 0.2, 0.7), read = phase(t, 3, 0.8, 2.0), out = phase(t, 3, 2.6, 2.95);
    let s = counter(), tipX = 180, tipY = 168;
    if (key === "wholechicken" || key === "turkey") { s += `<g transform="translate(180 214) scale(1.3)">${roastingPan(g(whole(F, 1), 0, -40, 0.72))}</g>`; tipX = 186; tipY = 148; }
    else if (key === "meatloaf") { s += `<g transform="translate(180 214) scale(1.4)">${ovenItem("meatloaf", 1)}</g>`; tipY = 160; }
    else if (key === "pork") { s += `<rect x="60" y="196" width="240" height="18" rx="6" fill="#E8C49A" ${st(3.5)}/><ellipse cx="180" cy="168" rx="80" ry="32" fill="${F.cooked}" ${st()}/>`; }
    else { s += `<rect x="60" y="196" width="240" height="18" rx="6" fill="#E8C49A" ${st(3.5)}/>` + g(whole(F, 1), 180, 176, 1.1); tipY = 180; }
    const y = lerp(tipY - 30, tipY, inP) - out * 30;
    s += op(clamp(Math.min(t / 0.2, (3 - t) / 0.2)), g(T.thermometer(0, 0, 0, inP > 0.98 && out < 0.02 ? lerp(0.15, 1, read) : 0.15), tipX, y, 1.2));
    if (read > 0.98 && out < 0.5) s += T.check(290, 60, 0.9);
    return s;
  } });
// Remove the foil: peel it back, steam escapes.
LIB.add({ cat: "oven", name: "removefoil", foods: ["lasagna", "casserole", "chicken", "fish"], dur: 2.8,
  steps: ["Carefully remove the foil", "Remove the foil and bake for an additional 25 minutes", "Uncover and bake until golden"],
  draw(t, F, key) {
    const p = phase(t, 2.8, 0.4, 1.6), f = fadeIn(t, 2.8, 0.15, 0.3);
    let s = counter() + g(key === "chicken" || key === "fish" ? dishS("#F1EDE4") + slabS(F.cooked, -26, -42, 30, 14) + slabS(F.cooked, 30, -42, 30, 14) : ovenItem(key, 0.5), 180, 214, 1.5);
    const gone = phase(t, 2.8, 2.0, 2.4);
    s += op(f * (1 - gone), `<g transform="translate(${p * 30} ${-p * 10}) rotate(${p * 38} 290 150)"><path d="M72 158 L72 138 C120 116 240 116 288 138 L288 158 Z" fill="${C.foil}" ${st(3.5)}/>
      <path d="M110 134 l24 10 M200 128 l20 12" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/><g transform="translate(70 136) rotate(70) scale(.75)">${T.mitt(0, 0)}</g></g>`);
    if (p > 0.2) s += steam(t, [120, 170, 220], 124, 0.8);
    return s;
  } });
// Bubbling at the edges, golden on top.
LIB.add({ cat: "oven", name: "bubbling", foods: ["lasagna", "casserole", "pie"], dur: 3,
  steps: ["Bake until bubbling at the edges", "Bake until the filling is bubbling and the top is golden", "Bake until the fruit is bubbling and the top is golden, about 45 minutes"],
  draw(t, F, key) {
    const c = 0.5 + 0.5 * phase(t, 3, 0.2, 2.2), f = fadeIn(t, 3, 0.15, 0.3);
    return ovenFront({ glow: 0.6, racks: [204], inner: op(f, g(ovenItem(key, c, t), 180, 204, 1.45)) });
  } });
// Let it stand before cutting (casserole/lasagna on the counter, steam fading).
LIB.add({ cat: "oven", name: "standdish", foods: ["lasagna", "casserole"], dur: 3,
  steps: ["Let the lasagna rest at room temperature for about 15 minutes before cutting", "Let stand 10 minutes before serving"],
  draw(t, F, key) {
    const p = t / 3;
    return counter() + g(ovenItem(key, 1, t), 170, 214, 1.5) + steam(t, [120, 170, 220], 120, 0.6) + T.timer(318, 54, p, 0.8);
  } });

// ======================= Air fryer =======================
// Side view. Drawer slides left by `out` px. Food pile peeks above the basket rim.
function airFryer(out = 0, pile = "", shake = 0) {
  const dx = -out;
  let s = `<g transform="translate(${dx} 0) rotate(${shake} ${230 + dx} 160)">${pile}<rect x="162" y="128" width="140" height="80" rx="10" fill="#555" ${st()}/>` +
    [180, 200, 220, 240, 260, 280].map(x => `<path d="M${x} 140 L${x} 196" stroke="#3B3B3B" stroke-width="3"/>`).join("") + `</g>`;
  s += `<path d="M150 216 L150 58 C150 30 170 22 200 22 L290 22 C318 22 324 40 324 58 L324 216 Z" fill="#3B3B3B" ${st()}/>
    <rect x="182" y="40" width="110" height="34" rx="8" fill="#1E1E1E" ${st(2.5)}/><circle cx="210" cy="57" r="6" fill="${C.hot}"/><path d="M234 57 L270 57" stroke="#555" stroke-width="5" stroke-linecap="round"/>`;
  s += `<g transform="translate(${dx} 0) rotate(${shake} ${230 + dx} 160)"><rect x="140" y="112" width="22" height="100" rx="6" fill="#4A4A4A" ${st()}/><path d="M140 146 L118 146 L118 168 L140 168" fill="#2A2A2A" ${st(4)}/></g>`;
  return counter() + s;
}
const fryPile = (key, c, jump = 0, t = 0) => {
  const F = foodFor(key);
  return [...Array(7)].map((_, i) => {
    const x = 172 + i * 14, y = 128 - (i % 2) * 6 - (jump ? Math.abs(Math.sin(t * 12 + i)) * jump : 0);
    if (VEG_KEYS.includes(key)) return ovenBit(key, x, y, i * 50 + jump * Math.sin(t * 9 + i) * 40, c, 1, i);
    if (key === "nuggets") return `<path d="M${x - 11} ${y + 6} C${x - 12} ${y - 12} ${x + 12} ${y - 12} ${x + 11} ${y + 6} Z" fill="${cookC("#F6D9A3", "#C98340", c)}" ${st(2.6)}/>`;
    if (key === "tofu") return `<rect x="${x - 8}" y="${y - 8}" width="16" height="16" rx="3" fill="${cookC(F.fill, F.cooked, c)}" ${st(2.6)}/>`;
    if (key === "shrimp") return i % 2 ? "" : g(whole(F, c), x, y, 0.22);
    if (key === "wings" || key === "drumsticks") return i % 3 ? "" : g(whole(F, c), x + 10, y - 2, 0.4);
    return i % 3 ? "" : slabS(cookC(F.fill, F.cooked || BROWN, c), x + 12, y + 2, 24, 20);
  }).join("");
};
// Load the basket in one layer (top view of the basket).
const AIRLOAD = ["fries", "wings", "chicken", "nuggets", "broccoli", "potato", "salmon", "tofu"];
LIB.add({ cat: "oven", name: "airfryload", foods: AIRLOAD, dur: 3.2,
  steps: ["Place in the air fryer basket in a single layer", "Place the chicken breasts in the air fryer, ensuring that they don't overlap", "Arrange in the basket without crowding"],
  draw(t, F, key) {
    let s = `<rect x="70" y="24" width="220" height="200" rx="34" fill="#3B3B3B" ${st()}/><rect x="86" y="40" width="188" height="168" rx="24" fill="#555"/>` +
      [...Array(6)].map((_, j) => [...Array(7)].map((_, i) => `<circle cx="${108 + i * 24}" cy="${62 + j * 26}" r="3" fill="#2A2A2A"/>`).join("")).join("");
    const big = ["chicken", "salmon", "wings"].includes(key);
    const spots = big ? [[132, 88], [228, 88], [132, 164], [228, 164]] : [[118, 76], [180, 76], [242, 76], [118, 124], [180, 124], [242, 124], [118, 172], [180, 172], [242, 172]];
    const n = Math.floor(phase(t, 3.2, 0.1, 2.4) * spots.length + 0.001), f = fadeIn(t, 3.2, 0.15, 0.3);
    const draw1 = (x, y, i) => {
      if (VEG_KEYS.includes(key)) return ovenBit(key, x, y, i * 40, 0, 1.5, i);
      if (key === "nuggets") return `<ellipse cx="${x}" cy="${y}" rx="18" ry="14" fill="#F6D9A3" ${st(3)}/>`;
      if (key === "tofu") return `<rect x="${x - 14}" y="${y - 14}" width="28" height="28" rx="4" fill="${F.fill}" ${st(3)}/>`;
      if (key === "wings") return g(whole({ ...F, type: "drumstick" }, 0), x, y, 0.62);
      return g(whole(F, 0), x, y, 0.55);
    };
    let pcs = "";
    spots.forEach(([x, y], i) => { if (i < n) pcs += draw1(x, y, i); });
    s += op(f, pcs);
    if (n < spots.length) { const [x, y] = spots[n]; const q = (phase(t, 3.2, 0.1, 2.4) * spots.length) % 1; s += op(f, g(draw1(0, 0, n) + g(T.pinch(0, 0, 0.9), 0, -24), lerp(330, x, ease(q)), lerp(20, y, ease(q)))); }
    if (n >= spots.length) s += T.check(316, 40, 0.8 * f);
    return s;
  } });
const AIRSHAKE = ["fries", "wings", "nuggets", "potato", "broccoli", "brusselsprouts", "tofu"];
LIB.add({ cat: "oven", name: "airfryshake", foods: AIRSHAKE, dur: 3,
  steps: ["Shake the basket halfway through", "Pull out the basket and shake it, then cook 5 more minutes", "Shake the air fryer basket halfway"],
  draw(t, F, key) {
    const out = 120 * (phase(t, 3, 0.2, 0.7) - phase(t, 3, 2.1, 2.6));
    const sh = phase(t, 3, 0.8, 0.9) * (1 - phase(t, 3, 1.8, 1.95));
    return airFryer(out, fryPile(key, 0.5, sh * 14, t), sh * 7 * Math.sin(t * 28)) + (sh > 0.3 ? FX.shake(232 - out, 150, 2.4) : "");
  } });
LIB.add({ cat: "oven", name: "airfryout", foods: ["fries", "wings", "chicken", "nuggets", "salmon", "tofu", "potato"], dur: 3,
  steps: ["Once the chicken is fully cooked, remove it from the air fryer", "Air fry until golden and crispy, then remove", "Air fry for another 5 minutes at 375, or until crispy and golden"],
  draw(t, F, key) {
    const out = 120 * phase(t, 3, 0.4, 1.2), f = fadeIn(t, 3, 0.15, 0.3);
    return airFryer(out, op(f, fryPile(key, 1))) + (out > 110 ? steam(t, [70, 100, 130], 104, 0.7) : "");
  } });
LIB.add({ cat: "oven", name: "airfrypreheat", foods: null, dur: 2.4,
  steps: ["Preheat the air fryer to 370°F", "Air fry at 400 F or 200 C", "Heat the air-fryer to 180C for 4 mins"],
  draw(t) {
    const on = phase(t, 2.4, 0.2, 0.5), f = fadeIn(t, 2.4, 0.1, 0.3);
    let s = airFryer(0) + `<rect x="184" y="42" width="106" height="30" rx="7" fill="${C.hot}" opacity="${(on * 0.45).toFixed(2)}"/>`;
    s += g(T.pinch(0, 0, 0.8, -10), 250 + 8 * (1 - on), 26 + 14 * on);
    s += op(f * on, [0, 1, 2].map(i => { const q = (t * 0.8 + i / 3) % 1; return `<path d="M${200 + i * 40} ${20 - q * 0} c-6 -6 6 -10 0 -16" transform="translate(0 ${-q * 16})" fill="none" stroke="${C.hot}" stroke-width="3.5" stroke-linecap="round" opacity="${(1 - q).toFixed(2)}"/>`; }).join(""));
    return s;
  } });

// ======================= Slow cooker / pressure cooker =======================
const crockMound = (key, c = 0) => {
  if (LIQUIDS[key] || key === "stew" || key === "soup") return `<path d="M90 126 C120 116 240 116 270 126 Z" fill="${LIQUIDS[key] || "#9C5A2A"}" ${st(3)}/>`;
  const F = foodFor(key);
  if (key === "chicken" && c === "whole") return g(whole(F), 140, 116, 0.5, -8) + g(whole(F), 220, 116, 0.5, 10);
  return [...Array(7)].map((_, i) => piece(F, "chunk", 112 + i * 22, 120 - (i % 2) * 6, i * 40, 1.3)).join("");
};
LIB.add({ cat: "oven", name: "slowcookeradd", foods: ["chicken", "beef", "pork", "potato", "broth"], dur: 2.8,
  steps: ["To a 5-quart or larger slow cooker, add the chicken breasts", "Add remaining ingredients to the slow cooker", "Place everything in the slow cooker"],
  draw(t, F, key) {
    const f = fadeIn(t, 2.8, 0.15, 0.3), tip = phase(t, 2.8, 0.2, 0.6) * (1 - phase(t, 2.8, 2.0, 2.4));
    const liquid = !!LIQUIDS[key];
    let s = counter();
    const fill = phase(t, 2.8, 0.7, 2.0);
    if (liquid) s += tip > 0.9 ? FX.stream(250, 46, 200, 120, LIQUIDS[key], 8) : "";
    else s += FX.fall(t, 0.9, key === "chicken" ? 2 : 6, 200, 60, 50, 130, (x, y, i) => key === "chicken" ? g(whole(F), x, y, 0.4, i * 30) : piece(F, "chunk", x, y, i * 50, 1.2));
    s = tip > 0.9 || liquid ? s : counter();
    s += V.slowCooker(0, op(f * clamp(fill * 1.2 + 0.1), crockMound(key, "whole")));
    s += liquid ? g(T.measuringCup(0, 0, -100 * tip, LIQUIDS[key], 0.8 - fill * 0.5), 266, 40) : `<g transform="translate(250 50) rotate(${-80 * tip})">${V.smallBowl(0, 0, 0.45)}</g>`;
    return s;
  } });
LIB.add({ cat: "oven", name: "slowcook", foods: ["chicken", "beef", "pork", "stew"], dur: 3,
  steps: ["Cover and cook on LOW for 4 to 6 hours or HIGH for 2 to 3 hours", "Slow cook for 1.5 to 2 hours, covered, on low heat", "Cook on low for 8 hours"],
  draw(t, F, key) {
    const c = phase(t, 3, 0.2, 2.6) * 0.9, G = foodFor(key);
    const mound = key === "stew" ? crockMound("stew") : [...Array(7)].map((_, i) => piece({ ...G, inner: cookC(G.inner, G.cooked || BROWN, c), fill: cookC(G.fill, G.cooked || BROWN, c) }, "chunk", 112 + i * 22, 120 - (i % 2) * 6, i * 40, 1.3)).join("");
    let s = counter() + V.slowCooker(1, key === "stew" ? mound : op(fadeIn(t, 3), mound));
    s += steam(t, [180], 62, 0.4) + T.timer(310, 60, t / 3 * 2, 0.8);
    s += `<path d="M168 179 L162 172" ${st(2.6)}/>`;
    return s;
  } });
LIB.add({ cat: "oven", name: "shredpot", foods: ["chicken", "pork", "beef"], dur: 2.6,
  steps: ["Shred the chicken and return to the slow cooker", "Shred the meat with two forks right in the pot", "Shred the pork in the slow cooker"],
  draw(t, F, key) {
    const p = phase(t, 2.6, 0.2, 2.0), f = fadeIn(t, 2.6, 0.15, 0.3);
    const meat = F.cooked;
    let s = `<circle cx="180" cy="126" r="108" fill="#6B6B6B" ${st()}/><circle cx="180" cy="126" r="88" fill="#fff" ${st(3)}/><circle cx="180" cy="126" r="80" fill="${LIQUIDS.broth}"/>`;
    let m = "";
    const pull = 30 * p;
    m += `<path d="M${130 - pull} 96 C${140 - pull} 76 ${176} 80 180 92 L180 160 C160 170 ${130 - pull} 160 ${126 - pull} 140 Z" fill="${meat}" ${st(3.5)}/>`;
    m += `<path d="M${230 + pull} 96 C${220 + pull} 76 184 80 180 92 L180 160 C200 170 ${230 + pull} 160 ${234 + pull} 140 Z" fill="${meat}" ${st(3.5)}/>`;
    m += [-1, 1].map(d => [0, 1, 2].map(j => `<path d="M${180 + d * (14 + j * 14 + pull * 0.6)} 96 L${180 + d * (14 + j * 14 + pull * 0.6)} 156" stroke="${shade(meat)}" stroke-width="3" stroke-linecap="round"/>`).join("")).join("");
    for (let i = 0; i < Math.floor(p * 10); i++) m += piece({ ...F, inner: meat, fill: meat }, "shred", 120 + (i * 37) % 120, 90 + (i * 29) % 80, i * 33, 1.2);
    s += op(f, m);
    s += T.fork(150 - pull, 150, -150) + T.fork(210 + pull, 150, 150);
    return s;
  } });
// Pressure cooker (side view). lock 0..1 turns the lid handle in line.
function pCooker(lock = 1, valve = 0) {
  return `<path d="M60 136 L86 136 M274 136 L300 136" ${st(9)}/><path d="M86 118 L274 118 L268 206 L92 206 Z" fill="${C.steel}" ${st()}/>
    <path d="M80 118 C92 80 268 80 280 118 Z" fill="#B9C0C6" ${st()}/>
    <rect x="${lerp(70, 112, lock)}" y="76" width="140" height="14" rx="7" fill="#3B3B3B" ${st(3)}/>
    <rect x="200" y="${66 - valve * 4}" width="16" height="14" rx="3" fill="#3B3B3B" ${st(3)} transform="rotate(${valve * -35} 208 80)"/>`;
}
const lockIcon = (x, y, shut) => g(`<path d="M-10 0 L-10 ${shut ? -12 : -18} C-10 ${shut ? -26 : -32} 10 ${shut ? -26 : -32} 10 ${shut ? -12 : -18}${shut ? " L10 0" : ""}" fill="none" ${st(4)}/><rect x="-16" y="-2" width="32" height="24" rx="5" fill="${shut ? C.green : C.yellow}" ${st(3.5)}/>`, x, y);
LIB.add({ cat: "oven", name: "pressurelock", foods: null, dur: 2.4,
  steps: ["Lock the lid on the Instant Pot", "Close the lid and set the valve to sealing", "Secure the pressure cooker lid"],
  draw(t) { const l = phase(t, 2.4, 0.3, 1.2) * (1 - phase(t, 2.4, 2.1, 2.35)); return counter() + pCooker(l) + g(fist(), lerp(66, 108, l), 70) + lockIcon(316, 50, l > 0.98); } });
LIB.add({ cat: "oven", name: "pressurerelease", foods: null, dur: 2.6,
  steps: ["Carefully release the steam with the valve", "When the pressure releases, open the lid", "Do a quick release, then open"],
  draw(t) {
    const v = phase(t, 2.6, 0.3, 0.6) * (1 - phase(t, 2.6, 2.2, 2.5));
    let s = counter() + pCooker(1, v) + T.spoon(232, 70, 60, true).replace(/<ellipse[^>]*>/, "");
    if (v > 0.9) s += [0, 1, 2, 3].map(i => { const q = (t * 1.5 + i / 4) % 1; return `<path d="M${208 + q * 10} ${56 - q * 50} c-8 -8 8 -12 0 -22" fill="none" stroke="#9AA4AC" stroke-width="${7 - q * 3}" stroke-linecap="round" opacity="${(1 - q).toFixed(2)}"/>`; }).join("");
    return s;
  } });
LIB.add({ cat: "oven", name: "pressurecook", foods: null, dur: 2.4,
  steps: ["Pressure cook for 2 to 4 whistles", "Press the pressure cook button & set the timer for 9 mins", "Pressure cook on high"],
  draw(t) {
    const puff = Math.max(0, Math.sin(t / 2.4 * Math.PI * 2 * 2));
    let s = counter() + flames(t, 0.6, 226) + pCooker(1, puff * 0.4);
    s += [0, 1].map(i => { const q = (t * 1.2 + i / 2) % 1; return `<path d="M${208 + i * 6} ${56 - q * 40} c-6 -6 6 -10 0 -18" fill="none" stroke="#9AA4AC" stroke-width="5" stroke-linecap="round" opacity="${(puff * (1 - q)).toFixed(2)}"/>`; }).join("");
    return s + T.timer(316, 56, t / 2.4, 0.7);
  } });

// ======================= Grill =======================
const GRILL_BARS = [...Array(12)].map((_, i) => 46 + i * 24);
const grillTop = () => `<rect x="24" y="28" width="312" height="194" rx="16" fill="#2E2E2E" ${st()}/><rect x="38" y="42" width="284" height="166" rx="10" fill="#7A2E1C" opacity=".55"/>` +
  GRILL_BARS.map(x => `<path d="M${x} 44 L${x} 206" stroke="#151515" stroke-width="8" stroke-linecap="round"/><path d="M${x - 1} 46 L${x - 1} 204" stroke="#5A5A5A" stroke-width="2"/>`).join("");
// Each food: parts with an ellipse or rect area that takes the grill marks.
function grillFood(key, c, marks, cx = 180, cy = 126) {
  const F = foodFor(key), col = (k = key) => { const G = foodFor(k); return cookC(G.fill, G.cooked || BROWN, c); };
  let s = "", parts = [];
  if (["patty", "turkeypatty", "veggiepatty"].includes(key)) { s = `<circle cx="${cx}" cy="${cy}" r="62" fill="${col()}" ${st()}/>`; parts = [[cx, cy, 58, 58]]; }
  else if (key === "zucchini" || key === "eggplant") { const fc = key === "zucchini" ? "#E9F2C7" : "#F1E8C8", sk = F.fill; [-44, 0, 44].forEach(dy => { s += `<rect x="${cx - 90}" y="${cy + dy - 16}" width="180" height="32" rx="14" fill="${cookC(fc, "#C9A24A", c * 0.7)}" stroke="${sk}" stroke-width="5"/><rect x="${cx - 90}" y="${cy + dy - 16}" width="180" height="32" rx="14" fill="none" ${st(3)}/>`; parts.push([cx, cy + dy, 86, 12, 1]); }); }
  else if (key === "pepper") { [-50, 50].forEach(dx => { s += `<path d="M${cx + dx - 38} ${cy - 30} C${cx + dx - 50} ${cy + 20} ${cx + dx - 20} ${cy + 46} ${cx + dx} ${cy + 46} C${cx + dx + 20} ${cy + 46} ${cx + dx + 50} ${cy + 20} ${cx + dx + 38} ${cy - 30} C${cx + dx + 20} ${cy - 44} ${cx + dx - 20} ${cy - 44} ${cx + dx - 38} ${cy - 30} Z" fill="${cookC(F.fill, "#A8301E", c * 0.6)}" ${st()}/>`; parts.push([cx + dx, cy, 36, 36]); }); }
  else if (key === "shrimp") { [[-60, -36], [40, -36], [-60, 40], [40, 40]].forEach(([dx, dy]) => { s += g(whole(F, c), cx + dx + 10, cy + dy, 0.55); }); }
  else if (key === "salmon") { s = g(whole(F, c), cx, cy, 1.25); parts = [[cx, cy - 4, 66, 34]]; }
  else { s = g(whole(F, c), cx, cy, 1.25); parts = [[cx, cy - 4, 70, 34]]; }
  if (marks > 0) for (const [px, py, rx, ry, rect] of parts) for (const x of GRILL_BARS) {
    const u = (x - px) / rx; if (Math.abs(u) > 0.86) continue;
    const h = rect ? ry : ry * Math.sqrt(1 - u * u) * 0.85;
    s += `<path d="M${x} ${py - h} L${x} ${py + h}" stroke="#1E0E06" stroke-width="8" stroke-linecap="round" opacity="${(marks * 0.9).toFixed(2)}"/>`;
  }
  return s;
}
const GRILLFLIP = ["steak", "chicken", "patty", "porkchop", "salmon", "zucchini", "eggplant", "pepper", "shrimp"];
LIB.add({ cat: "oven", name: "grillflip", foods: GRILLFLIP, dur: 3.2,
  steps: ["Grill until grill marks form, then flip", "Flip with tongs and grill the other side", "Grill 4 to 5 minutes per side"],
  draw(t, F, key) {
    const fl = phase(t, 3.2, 1.2, 1.9), f = fadeIn(t, 3.2, 0.15, 0.3);
    const sy = Math.abs(Math.cos(fl * Math.PI)), lift = Math.sin(fl * Math.PI) * 30;
    const after = fl > 0.5;
    let food = grillFood(key, after ? 0.55 : 0.1, after ? 1 : 0);
    let s = grillTop() + op(f, `<g transform="translate(0 ${126 - lift}) scale(1 ${Math.max(0.06, sy).toFixed(3)}) translate(0 -126)">${food}</g>`);
    s += FX.smoke(t, [120, 240], 70);
    const tg = phase(t, 3.2, 0.8, 1.2) * (1 - phase(t, 3.2, 2.1, 2.5));
    if (tg > 0.01) s += T.tongs(lerp(330, 262, tg), 126 - lift + 10, -70, 0.15);
    return s;
  } });
LIB.add({ cat: "oven", name: "grillturn", foods: ["corn", "sausage", "kebabs"], dur: 3,
  steps: ["Keep turning it to all the other sides and grill until charred", "Turn every few minutes until charred all over", "Grill, turning occasionally"],
  draw(t, F, key) {
    const roll = (t / 3) * 4; // four quarter-turns per loop
    const q = roll % 1, k = Math.floor(roll);
    let s = grillTop();
    const off = (Math.sin(q * Math.PI) * 8);
    const cooked = 0.7;
    const ks = key === "kebabs" ? 1.5 : 1.25;
    let food = g(whole(F, cooked), 180, 126 - off, ks);
    // char stripes across the food, moving with the roll
    const hw = key === "kebabs" ? 90 : 80, hh = key === "kebabs" ? 26 : 20;
    for (let i = 0; i < 2; i++) { const y = 126 - off - hh + 6 + ((i * 0.5 + q * 0.5) % 1) * (hh * 2 - 12); food += `<path d="M${180 - hw} ${y} L${180 + hw} ${y}" stroke="#1E0E06" stroke-width="5" stroke-linecap="round" stroke-dasharray="12 10" opacity=".8"/>`; }
    s += food + T.tongs(268, 134 - off, -70, 0.15) + FX.smoke(t, [120, 240], 70);
    return s;
  } });
// Side view grill with a lid.
function grillSide(lidUp, inner, t) {
  return `<path d="M70 196 L60 236 M290 196 L300 236" ${st(6)}/>` + `<path d="M40 140 L320 140 L300 198 L60 198 Z" fill="#3B3B3B" ${st()}/>` + flames(t, 0.5, 158) + inner +
    `<path d="M36 140 L324 140" stroke="#151515" stroke-width="7" stroke-linecap="round"/>` +
    `<g transform="translate(0 ${-lidUp * 56}) rotate(${-lidUp * 10} 40 140)"><path d="M40 140 C40 64 320 64 320 140 Z" fill="#3B3B3B" ${st()}/><path d="M150 100 L210 100" stroke="#7A7A7A" stroke-width="4"/><rect x="164" y="76" width="32" height="8" rx="4" fill="#7A7A7A" ${st(2.5)}/><path d="M300 130 L334 124" ${st(7)}/></g>`;
}
LIB.add({ cat: "oven", name: "grilllid", foods: ["steak", "chicken", "patty", "salmon"], dur: 3,
  steps: ["Close the lid and grill for 5 minutes", "Cover the grill and cook until done", "Close the grill lid"],
  draw(t, F, key) {
    const down = phase(t, 3, 0.5, 1.2) * (1 - phase(t, 3, 2.5, 2.9));
    const food = [100, 180, 260].map(x => `<g transform="translate(${x} 128) scale(.55 .4)">${whole(F, 0.5)}</g>`).join("");
    let s = grillSide(1 - down, food, t);
    if (down > 0.95) s += FX.smoke(t, [180], 58);
    return s;
  } });
LIB.add({ cat: "oven", name: "grilloil", foods: null, dur: 2.4,
  steps: ["Preheat the grill and oil the grates", "Brush the grill grates with oil", "Clean and oil the grill grates"],
  draw(t) {
    const x = lerp(80, 280, swing(t, 2.4)), done = phase(t, 2.4, 0, 2.4);
    let s = grillTop();
    s += GRILL_BARS.filter(b => b < 300).map(b => `<path d="M${b - 1} 60 L${b - 1} 190" stroke="${C.oil}" stroke-width="3" opacity="${(0.4 + 0.4 * Math.sin(t * 4 + b)).toFixed(2)}"/>`).join("");
    s += `<g transform="translate(${x} 130)"><path d="M-22 -12 C-28 6 -14 20 0 18 C18 20 28 4 20 -12 C10 -22 -14 -22 -22 -12 Z" fill="#fff" ${st(3)}/><ellipse cx="0" cy="2" rx="12" ry="8" fill="${C.oil}" opacity=".7"/></g>` + T.tongs(x, 126, 35, 0.1);
    return s;
  } });
LIB.add({ cat: "oven", name: "grillpreheat", foods: null, dur: 2.6,
  steps: ["Preheat the grill to medium-high heat", "Heat the grill for 10 to 15 minutes", "Light the grill and let it get hot"],
  draw(t) {
    const p = phase(t, 2.6, 0.2, 2.0);
    let s = grillSide(0, "", t);
    s += `<circle cx="180" cy="98" r="18" fill="#fff" ${st(3)}/><path d="M168 106 A14 14 0 0 1 166 92" fill="none" stroke="${C.blue}" stroke-width="4"/><path d="M194 92 A14 14 0 0 1 192 106" fill="none" stroke="${C.hot}" stroke-width="4"/>`;
    s += `<path d="M180 98 L${180 + Math.cos(Math.PI * (1 - p * 0.9) + Math.PI / 6) * 13} ${98 - Math.sin(Math.PI * (1 - p * 0.9) + Math.PI / 6) * 13}" ${st(3)}/>`;
    s += ovenHeat(t, [120, 240], 70, p);
    return s;
  } });

// ======================= Toaster, toaster oven, waffle iron =======================
const breadSlice = (c, bagel = false) => bagel
  ? `<path d="M-34 40 L-34 -14 C-34 -40 34 -40 34 -14 L34 40 Z" fill="${cookC("#F6E3B8", "#C98340", c)}" ${st(3.5)}/><path d="M-26 -16 C-26 -34 26 -34 26 -16" fill="none" stroke="#C98A4B" stroke-width="6"/>`
  : `<path d="M-32 40 L-32 -20 C-44 -24 -42 -42 -24 -42 L24 -42 C42 -42 44 -24 32 -20 L32 40 Z" fill="${cookC("#F6E3B8", "#C98340", c)}" stroke="#C98A4B" stroke-width="6"/><path d="M-32 40 L-32 -20 C-44 -24 -42 -42 -24 -42 L24 -42 C42 -42 44 -24 32 -20 L32 40 Z" fill="none" ${st(3.5)}/>`;
LIB.add({ cat: "oven", name: "toaster", foods: ["bread", "bagel"], dur: 3,
  steps: ["Toast the bread", "Toast the bagel until golden", "Toast the slices in the toaster"],
  draw(t, F, key) {
    const down = phase(t, 3, 0.2, 0.5) * (1 - phase(t, 3, 2.1, 2.2)), c = phase(t, 3, 0.5, 2.1);
    const pop = phase(t, 3, 2.1, 2.3) - phase(t, 3, 2.3, 2.6) * 0.3;
    const y = 96 + down * 56 - pop * 12;
    let s = counter();
    s += [140, 220].map(x => g(breadSlice(c, key === "bagel"), x, y)).join("");
    s += `<rect x="90" y="110" width="180" height="104" rx="30" fill="#E8613C" ${st()}/><path d="M112 116 L168 116 M192 116 L248 116" stroke="${down > 0.9 ? C.hot : INK}" stroke-width="7" stroke-linecap="round"/>
      <rect x="270" y="${126 + down * 50}" width="24" height="12" rx="4" fill="#3B3B3B" ${st(3)}/><path d="M282 124 L282 196" stroke="#3B3B3B" stroke-width="3" opacity=".4"/>`;
    if (down > 0.9) s += ovenHeat(t, [140, 220], 110, 0.6);
    return s;
  } });
LIB.add({ cat: "oven", name: "toasteroven", foods: ["bread", "bagel"], dur: 3,
  steps: ["Toast in the toaster oven until golden", "Toast the bread in the toaster oven"],
  draw(t, F, key) {
    const c = phase(t, 3, 0.2, 2.4), f = fadeIn(t, 3, 0.15, 0.3);
    const top = (x) => key === "bagel" ? `<ellipse cx="${x}" cy="158" rx="38" ry="12" fill="${cookC("#F6E3B8", "#C98340", c)}" ${st(3)}/><ellipse cx="${x}" cy="159" rx="9" ry="3" fill="#3A3530"/>` : `<rect x="${x - 38}" y="146" width="76" height="20" rx="6" fill="${cookC("#F6E3B8", "#C98340", c)}" stroke="#C98A4B" stroke-width="4"/><rect x="${x - 38}" y="146" width="76" height="20" rx="6" fill="none" ${st(3)}/>`;
    return counter() + `<rect x="50" y="70" width="260" height="146" rx="16" fill="#D9DEE2" ${st()}/><rect x="70" y="88" width="180" height="110" rx="8" fill="${mixColor("#4A423C", "#F2A04B", 0.7)}" ${st(3.5)}/>
      <path d="M78 98 L242 98" stroke="${C.hot}" stroke-width="4"/><path d="M78 168 L242 168" ${st(4)}/>${op(f, top(122) + top(198))}
      <path d="M70 88 L250 88 L250 198 L70 198 Z" fill="#fff" opacity=".12"/><circle cx="282" cy="114" r="11" fill="#fff" ${st(3)}/><circle cx="282" cy="156" r="11" fill="#fff" ${st(3)}/>` + T.timer(282, 156, c, 0.42);
  } });
LIB.add({ cat: "oven", name: "waffleiron", foods: null, dur: 3.4,
  steps: ["Pour batter onto the hot waffle iron and close", "Cook until the waffle is golden and stops steaming", "Make the waffles in a waffle iron"],
  draw(t) {
    const pour = phase(t, 3.4, 0.2, 0.9), close = phase(t, 3.4, 1.0, 1.3) * (1 - phase(t, 3.4, 2.5, 2.8));
    const cooked = phase(t, 3.4, 2.5, 2.6), f = fadeIn(t, 3.4, 0.15, 0.25);
    let s = counter() + `<rect x="70" y="170" width="220" height="44" rx="14" fill="#3B3B3B" ${st()}/><rect x="90" y="160" width="180" height="16" rx="6" fill="#555" ${st(3)}/>`;
    // batter / waffle on the bottom plate
    const wf = `<rect x="${180 - 80 * pour}" y="154" width="${160 * pour}" height="12" rx="5" fill="${cookC("#F6D9A3", "#D99A5B", cooked)}" ${st(2.6)}/>` + (cooked ? [110, 140, 170, 200, 230].map(x => `<path d="M${x} 156 L${x} 164" stroke="#B5763A" stroke-width="3"/>`).join("") : "");
    s += op(f, wf);
    s += `<g transform="rotate(${-40 * (1 - close)} 80 160)"><rect x="70" y="122" width="220" height="40" rx="14" fill="#3B3B3B" ${st()}/><path d="M290 142 L330 142" ${st(8)}/></g>`;
    if (pour > 0 && pour < 1) s += g(T.measuringCup(0, 0, -100, LIQUIDS.batter, 0.6), 200, 90);
    if (close > 0.95) s += steam(t, [140, 220], 120, 0.8);
    return s;
  } });

// ======================= Fridge, freezer, counter =======================
function fridgeBig(open = 0, inner = "") {
  const xr = lerp(260, 34, clamp(open)), d = 10 * open;
  let s = `<rect x="100" y="8" width="160" height="226" rx="14" fill="#EAF3FB" ${st()}/><path d="M100 78 L260 78" ${st(3)}/><path d="M244 24 L244 62" ${st(5)}/>`;
  if (open > 0.02) s += `<rect x="110" y="86" width="140" height="140" rx="6" fill="#DDEFFC" ${st(3)}/><path d="M112 156 L248 156" stroke="#9FC7E8" stroke-width="4"/>${inner}
    <path d="M100 82 L${xr} ${82 - d} L${xr} ${232 + d} L100 232 Z" fill="#EAF3FB" ${st()}/>${open > 0.3 ? `<path d="M${xr + 12} 100 L${xr + 12} 150" ${st(5)}/>` : ""}`;
  else s += `<rect x="100" y="82" width="160" height="150" rx="10" fill="#EAF3FB" ${st()}/><path d="M244 96 L244 150" ${st(5)}/>`;
  return s;
}
// Something wrapped / covered, sized for a fridge shelf (centered, bottom 0).
function coveredThing(key) {
  const F = foodFor(key);
  if (key === "soup" || key === "stew") return `<rect x="-36" y="-40" width="72" height="40" rx="6" fill="#fff" opacity=".9" ${st(3)}/><rect x="-32" y="-28" width="64" height="24" fill="${LIQUIDS[key]}"/><rect x="-40" y="-46" width="80" height="10" rx="4" fill="${C.blue}" ${st(3)}/>`;
  if (["chicken", "beef", "steak", "salmon", "porkchop"].includes(key)) return `<rect x="-46" y="-30" width="92" height="30" rx="8" fill="#fff" ${st(3)}/>` + g(whole(F), 0, -22, 0.5) + T.wrap(0, -36, 96, 12);
  if (key === "pizzadough") return `<path d="M-44 -34 C-40 0 40 0 44 -34 Z" fill="${C.bowl}" ${st(3)}/>` + T.wrap(0, -38, 92, 10);
  // dough, cookiedough, pastry: a wrapped disc / log
  const fill = F.fill || "#F4DFB0";
  return `<path d="M-40 0 C-44 -30 40 -30 40 0 Z" fill="${fill}" ${st(3)}/><path d="M-44 0 C-48 -36 44 -36 44 0" fill="#EAF6FF" opacity=".55" ${st(2.5)}/><path d="M-20 -20 l14 -4" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`;
}
LIB.add({ cat: "oven", name: "chill", foods: ["dough", "cookiedough", "pizzadough", "chicken", "soup"], dur: 3,
  steps: ["Wrap dough tightly in plastic wrap and refrigerate for at least 1 hour", "Cover and refrigerate overnight", "Refrigerate until ready to cook"],
  draw(t, F, key) {
    const p = phase(t, 3, 0.2, 1.2), shut = phase(t, 3, 1.5, 2.0), f = fadeIn(t, 3, 0.15, 0.3);
    const x = lerp(318, 180, p);
    let s = counter() + fridgeBig(1 - shut, op(f, g(coveredThing(key), x, 154, 1.25)));
    if (shut < 0.5 && p < 0.98) s += op(f, g(coveredThing(key), x, 154, 1.25));
    if (shut > 0.98) s += FX.cold(300, 70, 0.9) + FX.cold(60, 110, 0.7);
    return s;
  } });
LIB.add({ cat: "oven", name: "freeze", foods: ["meatballs", "cookiedough", "soup", "bread", "banana"], dur: 3,
  steps: ["Freeze for up to 3 months", "Freeze until solid", "Transfer to a freezer bag and freeze"],
  draw(t, F, key) {
    const fr = phase(t, 3, 0.3, 2.4), f = fadeIn(t, 3, 0.15, 0.3);
    let s = `<rect x="40" y="24" width="280" height="196" rx="14" fill="#EAF3FB" ${st()}/><rect x="56" y="40" width="248" height="164" rx="8" fill="#CFE6F8" ${st(3)}/>`;
    s += `<path d="M56 60 l20 -20 M56 80 l40 -40 M284 204 l20 -20 M264 204 l40 -40" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`;
    const thing = (LIQUIDS[key] || key === "soup") ? coveredThing("soup") : V.bag(g(whole(F), 0, 10, 0.8), 0, 0, 0.75);
    s += op(f, g(thing, 180, LIQUIDS[key] || key === "soup" ? 196 : 152, LIQUIDS[key] || key === "soup" ? 1.6 : 1.2));
    s += op(fr * f, `<rect x="104" y="80" width="152" height="120" rx="20" fill="#fff" opacity=".35"/>`) + op(fr, FX.cold(110, 70, 0.8) + FX.cold(250, 76, 0.7) + FX.cold(180, 60, 0.6));
    return s;
  } });
const moon = (x, y) => `<path d="M${x} ${y - 18} A18 18 0 0 0 ${x} ${y + 18} A11 18 0 0 1 ${x} ${y - 18} Z" fill="${C.yellow}" ${st(3)}/>`;
const sun = (x, y) => `<circle cx="${x}" cy="${y}" r="14" fill="${C.yellow}" ${st(3)}/>` + [...Array(8)].map((_, i) => { const a = i * Math.PI / 4; return `<path d="M${x + Math.cos(a) * 20} ${y + Math.sin(a) * 20} L${x + Math.cos(a) * 27} ${y + Math.sin(a) * 27}" ${st(3)}/>`; }).join("");
LIB.add({ cat: "oven", name: "thaw", foods: ["chicken", "steak", "turkey", "salmon", "shrimp"], dur: 3.2,
  steps: ["Thaw overnight in the fridge", "Defrost in the refrigerator overnight", "Freeze, then defrost overnight"],
  draw(t, F, key) {
    const p = phase(t, 3.2, 0.4, 2.4), f = fadeIn(t, 3.2, 0.15, 0.3);
    const food = `<ellipse cx="180" cy="152" rx="64" ry="8" fill="#fff" ${st(3)}/>` + g(whole(F), 180, 128, key === "turkey" ? 0.6 : 0.75);
    const frost = op(1 - p, `<ellipse cx="180" cy="130" rx="44" ry="22" fill="#fff" opacity=".55"/>` + FX.cold(160, 124, 0.45) + FX.cold(202, 132, 0.4));
    let s = counter() + fridgeBig(1, op(f, food + frost + (p > 0.9 ? `<ellipse cx="180" cy="154" rx="30" ry="3" fill="${C.water}"/>` : "")));
    s += op(1 - p, moon(306, 50)) + op(p, sun(306, 50));
    return s;
  } });
LIB.add({ cat: "oven", name: "soften", foods: ["butter", "creamcheese"], dur: 3,
  steps: ["Let the butter soften on the counter", "Making sure your butter is softened", "Let the cream cheese come to room temperature"],
  draw(t, F, key) {
    const p = phase(t, 3, 0.2, 1.8), poke = phase(t, 3, 1.9, 2.2) * (1 - phase(t, 3, 2.4, 2.7)), f = fadeIn(t, 3, 0.15, 0.3);
    let s = counter() + `<ellipse cx="170" cy="206" rx="100" ry="12" fill="#fff" ${st()}/>`;
    const slump = p * 8;
    s += op(f, `<path d="M${110 - slump} 200 L${116} ${150 + slump} L${224} ${150 + slump} L${230 + slump} 200 Z" fill="${F.fill}" ${st()}/>${p > 0.9 ? `<ellipse cx="170" cy="${156 + slump}" rx="10" ry="4" fill="${shade(F.fill)}" opacity="${poke > 0.5 || t > 2.2 ? 0.8 : 0}"/>` : ""}`) + op(1 - p, FX.cold(260, 140, 0.6));
    s += g(T.pinch(0, 0, 0.9, 0), 170, 110 + poke * 36 + slump);
    return s + T.timer(310, 56, p, 0.75);
  } });
LIB.add({ cat: "oven", name: "roomtemp", foods: ["steak", "chicken", "porkchop", "egg"], dur: 3,
  steps: ["Let the steak rest at room temperature for 45 minutes", "Bring the meat to room temperature before cooking", "Make sure your eggs are room temperature"],
  draw(t, F, key) {
    const p = phase(t, 3, 0.2, 2.4), f = fadeIn(t, 3, 0.15, 0.3);
    let s = counter() + `<ellipse cx="170" cy="204" rx="110" ry="14" fill="#fff" ${st()}/>`;
    s += key === "egg" ? [130, 170, 210].map(x => g(whole(F), x, 172, 0.55)).join("") : g(whole(F), 170, 184, 0.95);
    s += op(1 - p, FX.cold(100, 120, 0.7) + FX.cold(240, 112, 0.8) + FX.cold(170, 96, 0.6));
    return s + T.timer(310, 56, p, 0.75);
  } });

// ======================= Dough rising =======================
LIB.add({ cat: "oven", name: "rise", foods: ["dough", "breaddough", "pizzadough"], dur: 3.4,
  steps: ["Cover the bowl and let the dough rise until doubled", "Allow the dough to rise, covered, till it's noticeably puffy, about 90 minutes", "Place the dough in a lightly greased bowl, cover, and let rise"],
  draw(t, F, key) {
    const p = phase(t, 3.4, 0.2, 2.6), f = fadeIn(t, 3.4, 0.15, 0.3);
    const top = lerp(112, 50, p);
    const dough = `<path d="M70 120 C90 ${top} 270 ${top} 290 120 Z" fill="${F.fill}" ${st()}/>`;
    const wrapY = Math.min(120, top + 4);
    let s = counter() + bowlSide("#fff") + op(f, dough) + `<path d="M50 120 L310 120" ${st(5)}/>`;
    s += op(f, `<path d="M46 120 C120 ${wrapY - (120 - wrapY) * 0.2} 240 ${wrapY - (120 - wrapY) * 0.2} 314 120" fill="#EAF6FF" fill-opacity=".2" ${st(2.5)}/><path d="M120 ${wrapY + 2} l20 -2" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`);
    return s + T.timer(318, 50, p, 0.7) + (p > 0.98 ? T.check(42, 50, 0.8 * f) : "");
  } });
LIB.add({ cat: "oven", name: "riseloaf", foods: ["breaddough", "dough"], dur: 3.4,
  steps: ["Let the dough rise in the loaf pan until it crowns above the rim", "Cover and let rise in the pan until puffy"],
  draw(t, F, key) {
    const p = phase(t, 3.4, 0.2, 2.6), f = fadeIn(t, 3.4, 0.15, 0.3);
    let s = counter() + `<g transform="translate(180 214) scale(1.7)">${loafTinS(op(f, `<path d="M-48 -34 C-44 ${-40 - p * 30} 44 ${-40 - p * 30} 48 -34 Z" fill="${F.fill}" ${st(3)}/>`))}</g>`;
    return s + T.timer(318, 50, p, 0.7);
  } });
LIB.add({ cat: "oven", name: "punchdown", foods: ["dough", "breaddough", "pizzadough"], dur: 2.4,
  steps: ["Punch down the dough", "Gently deflate the risen dough", "Punch the dough down and shape"],
  draw(t, F) {
    const hit = phase(t, 2.4, 0.6, 0.9), up = phase(t, 2.4, 1.3, 1.8);
    const top = lerp(64, 108, hit) + 0 * up;
    const f = fadeIn(t, 2.4, 0.15, 0.25);
    let s = counter() + bowlSide("#fff") + op(f, `<path d="M70 120 C90 ${top} 270 ${top} 290 120 Z" fill="${F.fill}" ${st()}/>`) + `<path d="M50 120 L310 120" ${st(5)}/>`;
    const fy = lerp(lerp(44, top - 6, hit), 44, up);
    s += g(fist(), 180, fy, 1.6);
    if (hit > 0.9 && up < 0.5) s += FX.shake(180, top, 1.6);
    return s;
  } });

// ======================= Rest meat =======================
const INSIDE = { steak: "#E58A8A", beef: "#E58A8A", lamb: "#E58A8A", chicken: "#F6E8D8", pork: "#F6E3CF", porkchop: "#F6E3CF" };
LIB.add({ cat: "oven", name: "restmeat", foods: ["steak", "chicken", "beef", "pork", "porkchop"], dur: 3.6,
  steps: ["Let it rest for 5 minutes before slicing", "Rest for 5 to 10 minutes before slicing", "Rest for 3 minutes then slice"],
  draw(t, F, key) {
    const rest = phase(t, 3.6, 0.2, 2.0), cut = phase(t, 3.6, 2.1, 2.7), f = fadeIn(t, 3.6, 0.15, 0.3);
    const col = F.cooked;
    let s = board();
    s += g(whole(F, 1), 160, 136, 1.4);
    if (cut > 0) s += op(f * cut, `<g transform="translate(${258 + cut * 10} 140) rotate(10)"><rect x="-14" y="-46" width="28" height="92" rx="9" fill="${col}" ${st(3.5)}/><rect x="-9" y="-38" width="18" height="76" rx="6" fill="${INSIDE[key]}"/></g>`);
    if (cut > 0 && cut < 1) s += knife(262, lerp(110, 190, cut), 90, 70);
    s += steam(t, [130, 170, 210], 100, 0.5 * (1 - rest));
    if (rest < 1) s += T.timer(300, 70, rest, 0.75);
    if (cut > 0.98) s += T.check(60, 80, 0.8 * f);
    return s;
  } });
})();
