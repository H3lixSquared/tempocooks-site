// ---------- Category: cut (knife and board prep) ----------
// Specific board situations the app's generic dice/chop/slice/mince lack.
// Local helpers are all prefixed "cut".

// ---------- New foods (only where nothing in the kit fits) ----------
LIB.food("jalapeno",   { type: "long", fill: "#3E7A2E", inner: "#C8E39A", taper: true, small: true, top: "cap" });
LIB.food("redchile",   { type: "long", fill: "#D9302A", inner: "#F07A62", taper: true, small: true, top: "cap" });
LIB.food("poblano",    { type: "pepper", fill: "#2F5E2A", inner: "#7BAA4A" });
LIB.food("plum",       { type: "round", fill: "#7A2E5A", inner: "#F2C24A", top: "stem" });
LIB.food("pumpkin",    { type: "round", fill: "#E8822C", inner: "#F5A84A", top: "stem", oval: true });
LIB.food("shallot",    { type: "round", fill: "#C98A6B", inner: "#F1DCE6", rings: "#D8B9D2", top: "tip", oval: true });
LIB.food("baguette",   { type: "long", fill: "#D9A55B", inner: "#F6E3B8" });
LIB.food("bananabread",{ type: "loaf", fill: "#9C5A2A", inner: "#E8C27A" });
LIB.food("cornbread",  { type: "block", fill: "#E8B23C", inner: "#F7D27A" });
LIB.food("quiche",     { type: "pie", fill: "#E8B46A", inner: "#F7D27A" });
LIB.food("cheesecake", { type: "pie", fill: "#D9A55B", inner: "#FBF1D4" });
LIB.food("frittata",   { type: "flat", fill: "#F2C84B", inner: "#F7D27A", spots: true });
LIB.food("sandwich",   { type: "loaf", fill: "#E8C27A", inner: "#F6E3B8" });
LIB.food("goatcheese", { type: "long", fill: "#FBF8EE", inner: "#FFFFFF" });
LIB.food("bluecheese", { type: "block", fill: "#F4F0E2", inner: "#FBF8EE" });

// ---------- cut helpers ----------
let _cutN = 0;
// Clip `inner` to `shape` (an svg shape string, in the same coordinates as inner).
function cutClip(shape, inner) { const id = "cutc" + (++_cutN); return `<clipPath id="${id}">${shape}</clipPath><g clip-path="url(#${id})">${inner}</g>`; }
const cutRect = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}"/>`;
const cutPoly = (pts) => `<path d="M${pts.map(p => p.join(" ")).join(" L")} Z"/>`;
// Knife stroke: 0 -> 1 (down) -> 0, with the down part taking the first `a` of p.
const cutDown = (p, a = 0.45) => p < a ? ease(p / a) : 1 - ease((p - a) / (1 - a));
// Fade in at loop start, out at loop end, so the jump back to t=0 is soft.
const cutFade = (t, dur, a = 0.18, b = 0.28) => clamp(Math.min(t / a, (dur - t) / b));
const cutOp = (op, inner) => op >= 0.999 ? inner : `<g opacity="${op.toFixed(3)}">${inner}</g>`;
// Chef's knife chopping straight down; tip lands at y = yb.
const cutChop = (x, down, yb = 150, len = 110) => knife(x, lerp(40, yb, down), 90, len);
// Small paring knife (short blade), tip at x,y pointing along deg.
const cutParing = (x, y, deg) => knife(x, y, deg, 62);
// Serrated bread knife pointing straight down.
function cutBreadKnife(x, y) {
  let teeth = ""; for (let i = 0; i < 9; i++) teeth += `L${-10 - i * 12} ${i % 2 ? 4 : 9} `;
  return `<g transform="translate(${x} ${y}) rotate(90)"><path d="M0 0 L-120 -10 L-120 9 ${teeth}Z" fill="#E3E7EA" ${st(3)}/>
    <rect x="-172" y="-8" width="54" height="16" rx="6" fill="#3B2A1E" ${st(3.5)}/><g transform="translate(-148 0)">${fist()}</g></g>`;
}
// Metal spoon with a glove on the handle; bowl of the spoon at x,y.
const cutSpoon = (x, y, r = 0, fill = null) => g(`${T.metalSpoon(0, 0, 0, fill)}${g(fist(), 66, -60, 0.9, -40)}`, x, y, 1, r);
// Kitchen shears, tips at x,y, opening 0..1, pointing down.
function cutShears(x, y, open = 0, r = 0) {
  const a = 6 + open * 16;
  return g(`<path d="M0 -44 L-3 0 L4 -40 Z" fill="${C.steel}" ${st(3)} transform="rotate(${-a} 0 -44)"/><path d="M0 -44 L3 0 L-4 -40 Z" fill="${C.steel}" ${st(3)} transform="rotate(${a} 0 -44)"/>
    <circle cx="0" cy="-44" r="4" fill="${INK}"/>
    <g transform="rotate(${-a} 0 -44)"><path d="M-2 -46 L-12 -78" ${st(6)}/><ellipse cx="-16" cy="-90" rx="10" ry="13" fill="none" stroke="${C.hot}" stroke-width="6"/><ellipse cx="-16" cy="-90" rx="10" ry="13" fill="none" ${st(2)}/></g>
    <g transform="rotate(${a} 0 -44)"><path d="M2 -46 L12 -78" ${st(6)}/><ellipse cx="16" cy="-90" rx="10" ry="13" fill="none" stroke="${C.hot}" stroke-width="6"/><ellipse cx="16" cy="-90" rx="10" ry="13" fill="none" ${st(2)}/></g>
    ${g(fist(), 0, -96, 1.1)}`, x, y, 1, r);
}
// Pizza wheel, wheel centre at x,y, handle up-right.
const cutWheel = (x, y, spin = 0) => g(`<path d="M0 0 L40 -52" ${st(8)}/><path d="M0 0 L40 -52" stroke="${C.handle}" stroke-width="4" stroke-linecap="round"/>
  <circle r="20" fill="${C.steel}" ${st(3.5)}/><path d="M-12 0 L12 0 M0 -12 L0 12" ${st(2)} transform="rotate(${spin})"/><circle r="4" fill="${INK}"/>${g(fist(), 48, -64, 1, -40)}`, x, y);
// Lay out n pieces in a loose pile: fn(x, y, i).
function cutPile(n, x0, y0, fn, cols = 4, dx = 22, dy = 15) {
  let s = ""; for (let i = 0; i < n; i++) { const r = Math.floor(i / cols); s += fn(x0 + (i % cols) * dx + (r % 2) * dx / 2, y0 - r * dy, i); } return s;
}
// Irregular little crumb.
const cutCrumb = (x, y, c, k = 1, r = 0) => `<path transform="translate(${x} ${y}) rotate(${r}) scale(${k})" d="M-6 -3 L-1 -7 L6 -4 L7 3 L1 7 L-6 4 Z" fill="${c}" ${st(2)}/>`;

// The cut face of a round food, seen face up, centred on 0,0.
function cutFaceKind(F, key) {
  const k = { egg: "egg", avocado: "avocado", kiwi: "kiwi", peach: "stone", plum: "stone",
    pepper: "pepper", greenpepper: "pepper", yellowpepper: "pepper", poblano: "pepper",
    cabbage: "cabbage", redcabbage: "cabbage", squash: "cavity", pumpkin: "cavity", cantaloupe: "cavity",
    watermelon: "watermelon", tomato: "tomato", cherrytomato: "tomato", apple: "apple", pear: "apple", strawberry: "strawberry", beet: "beet" }[key];
  if (k) return k;
  if (F.citrus) return "citrus";
  if (F.rings) return "onion";
  return "plain";
}
function cutFace(F, key, rx, ry = rx * 0.86, opt = {}) {
  const kind = cutFaceKind(F, key), inn = F.inner, out = F.fill;
  const ell = (a, b, fill, extra = "", cx = 0, cy = 0) => `<ellipse cx="${cx}" cy="${cy}" rx="${a}" ry="${b}" fill="${fill}" ${extra}/>`;
  const rim = (c, w, inset = 0) => `<ellipse rx="${Math.max(1, rx - inset - w / 2)}" ry="${Math.max(1, ry - inset - w / 2)}" fill="none" stroke="${c}" stroke-width="${w}"/>`;
  let s = ell(rx, ry, inn);
  switch (kind) {
    case "citrus":
      s += rim(out, rx * 0.12) + rim("#FFFBEA", 2.5, rx * 0.12);
      for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; s += `<path d="M0 0 L${Math.cos(a) * rx * 0.8} ${Math.sin(a) * ry * 0.8}" stroke="#FFFBEA" stroke-width="2.4" stroke-linecap="round"/>`; }
      s += ell(rx * 0.09, rx * 0.09, "#FFFBEA");
      break;
    case "onion":
      s += rim(out, 4);
      for (const k of [0.72, 0.48, 0.24]) s += ell(rx * k, ry * k, "none", `stroke="${F.rings}" stroke-width="2.6"`);
      break;
    case "tomato":
      s += rim(out, rx * 0.14);
      for (const a of [-90, 30, 150]) {
        const r = a * Math.PI / 180, x = Math.cos(r) * rx * 0.42, y = Math.sin(r) * ry * 0.42;
        s += opt.seeded === false ? ell(rx * 0.22, ry * 0.18, mixColor(inn, "#FFFFFF", 0.2), "", x, y) :
          ell(rx * 0.24, ry * 0.2, "#F9B8A0", `stroke="${shade(inn)}" stroke-width="1.5"`, x, y) +
          [[-0.08, 0], [0.06, -0.05], [0.05, 0.06]].map(([dx, dy]) => ell(rx * 0.04, rx * 0.03, F.seeds || "#F7D27A", "", x + dx * rx, y + dy * rx)).join("");
      }
      break;
    case "apple":
      s += rim(out, rx * 0.07) + ell(rx * 0.3, ry * 0.4, "none", `stroke="#E2CC90" stroke-width="2.4"`);
      for (const a of [0, 72, 144, 216, 288]) { const r = a * Math.PI / 180; s += ell(rx * 0.05, rx * 0.08, "#5A3220", `transform="rotate(${a + 90} ${Math.cos(r) * rx * 0.16} ${Math.sin(r) * ry * 0.18})"`, Math.cos(r) * rx * 0.16, Math.sin(r) * ry * 0.18); }
      break;
    case "stone":
      s += rim(out, rx * 0.08) + ell(rx * 0.44, ry * 0.5, mixColor(inn, "#E8603C", 0.25));
      s += opt.pit === false ? ell(rx * 0.32, ry * 0.4, shade(inn), st(2.4))
        : ell(rx * 0.32, ry * 0.4, "#8A4A2A", st(2.6)) + `<path d="M${-rx * 0.15} ${-ry * 0.2} q${rx * 0.08} ${ry * 0.1} 0 ${ry * 0.2} M${rx * 0.1} ${-ry * 0.24} q${-rx * 0.08} ${ry * 0.14} 0 ${ry * 0.3}" stroke="#5A2E1A" stroke-width="2" fill="none"/>`;
      break;
    case "avocado":
      s += rim("#2F5A22", rx * 0.07) + rim("#A8CC5E", rx * 0.08, rx * 0.07) + ell(rx * 0.55, ry * 0.58, "#E2EDA0");
      s += opt.pit === false ? ell(rx * 0.32, ry * 0.36, "#C2DA80", st(2.4))
        : ell(rx * 0.34, ry * 0.38, F.pit || "#8A5A2B", st(2.8)) + `<path d="M${-rx * 0.14} ${-ry * 0.18} q${rx * 0.06} ${-ry * 0.08} ${rx * 0.14} ${-ry * 0.06}" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" opacity=".7"/>`;
      break;
    case "kiwi":
      s += rim(out, rx * 0.07);
      for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2; s += `<path d="M${Math.cos(a) * rx * 0.25} ${Math.sin(a) * ry * 0.3} L${Math.cos(a) * rx * 0.75} ${Math.sin(a) * ry * 0.75}" stroke="#B5DC7A" stroke-width="2"/>` + ell(rx * 0.035, rx * 0.05, "#2A2A1A", `transform="rotate(${a * 57.3 + 90} ${Math.cos(a) * rx * 0.38} ${Math.sin(a) * ry * 0.42})"`, Math.cos(a) * rx * 0.38, Math.sin(a) * ry * 0.42); }
      s += ell(rx * 0.22, ry * 0.3, "#F4F7DA");
      break;
    case "pepper":
      s = ell(rx, ry, out) + ell(rx * 0.8, ry * 0.76, "#FFF6EA", `stroke="${inn}" stroke-width="3"`);
      if (opt.seeded !== false) s += ell(rx * 0.24, ry * 0.15, "#F4ECCB", st(2), 0, -ry * 0.5) + [[-0.12, -0.36], [0.1, -0.34], [0, -0.3], [-0.05, -0.42]].map(([a, b]) => ell(rx * 0.04, rx * 0.03, "#E8D27A", st(1.2), a * rx, b * ry)).join("");
      s += `<path d="M0 ${-ry + 2} L0 ${-ry - 12}" stroke="#3E8E41" stroke-width="8" stroke-linecap="round"/>`;
      break;
    case "cabbage":
      s += rim(out, rx * 0.08);
      for (let i = 0; i < 4; i++) { const y = -ry * 0.6 + i * ry * 0.34, w = rx * Math.sqrt(1 - (y / ry) ** 2) * 0.8; s += `<path d="M${-w} ${y} q${w / 3} -8 ${w * 2 / 3} 0 t${w * 2 / 3} 0 t${w * 2 / 3} 0" fill="none" stroke="${F.rings || shade(inn)}" stroke-width="2.6"/>`; }
      if (opt.core !== false) s += `<path d="M${-rx * 0.2} ${ry * 0.92} L0 ${ry * 0.15} L${rx * 0.2} ${ry * 0.92} Z" fill="#F6F9E4" stroke="${F.rings || shade(inn)}" stroke-width="2"/>`;
      break;
    case "cavity": {
      s += rim(out, rx * 0.07);
      const n = opt.seeds === undefined ? 9 : opt.seeds;
      s += ell(rx * 0.46, ry * 0.42, mixColor(inn, "#C96A1E", n > 0 ? 0.25 : 0.1), st(2));
      for (let i = 0; i < n; i++) { const a = i * 2.4, r = 0.12 + (i % 3) * 0.1; s += ell(rx * 0.07, rx * 0.045, "#FBF1D4", `${st(1.4)} transform="rotate(${i * 50} ${Math.cos(a) * rx * r} ${Math.sin(a) * ry * r})"`, Math.cos(a) * rx * r, Math.sin(a) * ry * r); }
      break;
    }
    case "watermelon":
      s += rim(out, rx * 0.08) + rim("#F4F7DA", rx * 0.05, rx * 0.08);
      for (let i = 0; i < 8; i++) { const a = i * 0.785 + 0.3; s += ell(rx * 0.035, rx * 0.06, "#2A2A2A", "", Math.cos(a) * rx * 0.5, Math.sin(a) * ry * 0.5); }
      break;
    case "egg":
      s = ell(rx, ry, "#FFFFFF") + ell(rx * 0.46, ry * 0.5, F.inner, `stroke="${shade(F.inner)}" stroke-width="2"`, 0, ry * 0.06);
      break;
    case "strawberry":
      s += rim(out, rx * 0.1) + ell(rx * 0.3, ry * 0.5, "#FBE4E4");
      break;
    case "beet":
      for (const k of [0.7, 0.45, 0.2]) s += ell(rx * k, ry * k, "none", `stroke="${shade(inn)}" stroke-width="2.4"`);
      s += rim(out, rx * 0.07);
      break;
    default:
      s += rim(out, Math.max(3, rx * 0.06));
  }
  return s + ell(rx, ry, "none", st(3.5));
}
// The whole food for cutting scenes (a peeled egg for hard-boiled egg steps).
function cutWhole(F, key) {
  if (key === "egg") return `<path d="M0 -44 C26 -44 38 0 34 18 C30 40 -30 40 -34 18 C-38 0 -26 -44 0 -44 Z" fill="#FFFFFF" ${st()}/><path d="M-16 -26 q6 -8 14 -8" stroke="#E8E4DA" stroke-width="4" stroke-linecap="round" fill="none"/>`;
  return whole(F);
}
// Half-width of the whole food drawing (for placing cuts).
function cutHalfW(F) {
  if (F.type === "round") return F.oval ? 56 : 46;
  if (F.type === "long") return F.small ? 56 : 76;
  if (F.type === "pepper") return 52;
  if (F.type === "avocado" || F.type === "egg") return 36;
  return 58;
}
// Long cut face (lengthwise half, face up), centred 0,0.
function cutLongFace(F, key, L, w) {
  const taper = F.taper;
  const path = taper ? `M-${L} -${w} C0 -${w + 2} ${L - 20} -${w * 0.4} ${L} 0 C${L - 20} ${w * 0.4} 0 ${w + 2} -${L} ${w} C-${L + 10} ${w} -${L + 10} -${w} -${L} -${w} Z`
    : `M-${L} -${w} L${L} -${w} C${L + w * 0.8} -${w} ${L + w * 0.8} ${w} ${L} ${w} L-${L} ${w} C-${L + w * 0.8} ${w} -${L + w * 0.8} -${w} -${L} -${w} Z`;
  let s = `<path d="${path}" fill="${F.fill}" ${st()}/><g transform="scale(0.93 0.72)"><path d="${path}" fill="${F.inner}"/></g>`;
  if (F.seedsLong || key === "zucchini") s += `<ellipse rx="${L * 0.78}" ry="${w * 0.3}" fill="${mixColor(F.inner, "#FFFFFF", 0.35)}"/>` + [...Array(9)].map((_, i) => `<ellipse cx="${-L * 0.65 + i * L * 0.16}" cy="${(i % 2 ? 1 : -1) * w * 0.12}" rx="3.2" ry="2" fill="${shade(F.inner)}"/>`).join("");
  else if (key === "eggplant") s += [...Array(12)].map((_, i) => `<circle cx="${-L * 0.6 + (i % 6) * L * 0.24}" cy="${(i < 6 ? -1 : 1) * w * 0.25}" r="2.4" fill="#B5A06A"/>`).join("");
  else if (key === "chile" || key === "jalapeno" || key === "redchile") s += `<path d="M-${L * 0.7} 0 L${L * 0.6} 0" stroke="#F4F0C8" stroke-width="${w * 0.5}" stroke-linecap="round"/>` + [...Array(7)].map((_, i) => `<ellipse cx="${-L * 0.6 + i * L * 0.18}" cy="${(i % 2 ? 1 : -1) * w * 0.12}" rx="3" ry="2.2" fill="#F2DC8A" ${st(1)}/>`).join("");
  else if (key === "leek" || key === "scallion") s += [0.5, 0.2].map(k => `<path d="M-${L * 0.9} ${w * k} L${L * 0.9} ${w * k} M-${L * 0.9} ${-w * k} L${L * 0.9} ${-w * k}" stroke="#CFE3A0" stroke-width="2"/>`).join("");
  else s += `<ellipse rx="${L * 0.7}" ry="${w * 0.22}" fill="${mixColor(F.inner, "#FFFFFF", 0.3)}"/>`;
  return s + `<path d="${path}" fill="none" ${st()}/>`;
}

// ================= Halving, quartering, wedges =================
const CUT_HALVE_FOODS = ["onion", "redonion", "tomato", "potato", "sweetpotato", "apple", "lemon", "lime", "orange", "grapefruit", "avocado", "peach", "kiwi", "pepper", "cabbage", "egg", "beet"];
// Shared: a round food halved at cx; returns the food svg (no knife).
function cutHalves(t, F, key, cx, cy, part, open, faceR, quarter = 0, sc = 1.3) {
  let s = "";
  const h0 = 26 * sc, fo = 74;
  for (const side of [-1, 1]) {
    const hx = cx + side * (h0 + part * (fo - h0));
    if (open < 1) {
      const half = cutClip(cutRect(side < 0 ? 0 : cx, 0, 180, 250), g(cutWhole(F, key), cx, cy, sc));
      s += `<g transform="translate(${hx} 0) scale(${Math.max(0.001, 1 - open)} 1) translate(${-(cx + side * h0)} 0)">${half}</g>`;
    }
    if (open > 0) {
      const face = cutFace(F, key, faceR, faceR * 0.86, { pit: side < 0 });
      const fx = cx + side * fo;
      if (quarter > 0) {
        for (const q of [-1, 1]) s += g(cutClip(cutRect(q < 0 ? -100 : 0, -100, 100, 200), face), fx + q * quarter * 12, cy + 4 + q * quarter * 4, 1, q * quarter * 8);
      } else s += g(`<g transform="scale(${open} 1)">${face}</g>`, fx, cy + 4);
    }
  }
  return s;
}
LIB.add({
  cat: "cut", name: "halve", foods: CUT_HALVE_FOODS,
  steps: ["Cut the avocados in half", "Halve the yellow onion", "Cut the white boiling potatoes in half", "Halve the hard-boiled eggs"],
  dur: 2.8,
  draw(t, F, key) {
    const D = 2.8, cx = 180, cy = 132;
    const down = t < 0.75 ? phase(t, D, 0.3, 0.75) : 1 - phase(t, D, 0.75, 1.05);
    const part = phase(t, D, 0.85, 1.2), open = phase(t, D, 1.2, 1.55);
    const big = ["cabbage", "grapefruit"].includes(key);
    let s = board() + cutOp(cutFade(t, D), cutHalves(t, F, key, cx, cy, part, open, big ? 62 : 56));
    if (t < 1.1) s += cutChop(cx, down, cy + 34);
    return s;
  },
});
LIB.add({
  cat: "cut", name: "quarter", foods: ["tomato", "onion", "redonion", "potato", "apple", "lemon", "lime", "orange", "cabbage", "beet"],
  steps: ["Cut the tomatoes into quarters", "Quarter the potatoes", "Halve and quarter the onion", "Cut the cabbage into quarters"],
  dur: 3.2,
  draw(t, F, key) {
    const D = 3.2, cx = 180, cy = 132;
    const d1 = t < 0.6 ? phase(t, D, 0.25, 0.6) : 1 - phase(t, D, 0.6, 0.85);
    const part = phase(t, D, 0.7, 0.95), open = phase(t, D, 0.95, 1.2);
    const q1 = phase(t, D, 1.55, 1.75), q2 = phase(t, D, 2.05, 2.25);
    let food = "";
    if (open < 1) food = cutHalves(t, F, key, cx, cy, part, open, 54);
    else {
      // two faces; each one gets chopped down the middle
      food = "";
      for (const [side, q] of [[-1, q1], [1, q2]]) {
        const face = cutFace(F, key, 54, 46, { pit: side < 0 });
        const fx = cx + side * 74;
        if (q <= 0) food += g(face, fx, cy + 4);
        else for (const k of [-1, 1]) food += g(cutClip(cutRect(k < 0 ? -100 : 0, -100, 100, 200), face), fx + k * q * 12, cy + 4 + k * q * 4, 1, k * q * 8);
      }
    }
    let s = board() + cutOp(cutFade(t, D), food);
    if (t < 0.9) s += cutChop(cx, d1, cy + 34);
    else if (t > 1.3 && t < 1.95) s += cutChop(cx - 74, cutDown(seg(t, 1.35, 1.95)), cy + 30);
    else if (t > 1.85 && t < 2.45) s += cutChop(cx + 74, cutDown(seg(t, 1.85, 2.45)), cy + 30);
    return s;
  },
});
// A wedge (boat) piece: peel on the curved side, flesh on the flat side.
function cutWedgePiece(F, key, x, y, r = 0, k = 1) {
  const kind = cutFaceKind(F, key);
  let det = "";
  if (kind === "citrus") det = [-0.6, -0.2, 0.2, 0.6].map(f => `<path d="M${f * 8} 1 L${f * 26} 13" stroke="#FFFBEA" stroke-width="2"/>`).join("");
  else if (kind === "tomato") det = `<ellipse cx="-8" cy="7" rx="6" ry="4" fill="#F9B8A0"/><ellipse cx="9" cy="7" rx="6" ry="4" fill="#F9B8A0"/><circle cx="-8" cy="7" r="1.6" fill="#F7D27A"/><circle cx="9" cy="7" r="1.6" fill="#F7D27A"/>`;
  else if (kind === "onion" || kind === "cabbage") det = `<path d="M-20 4 C-12 12 12 12 20 4 M-12 3 C-6 7 6 7 12 3" fill="none" stroke="${F.rings || shade(F.inner)}" stroke-width="2"/>`;
  else if (kind === "apple") det = `<ellipse cx="0" cy="4" rx="3" ry="2" fill="#5A3220"/>`;
  return g(`<path d="M-30 0 C-26 26 26 26 30 0 Z" fill="${F.inner}" ${st(3)}/>${det}<path d="M-26 6 C-20 22 20 22 26 6" fill="none" stroke="${F.fill}" stroke-width="5" stroke-linecap="round"/><path d="M-30 0 C-26 26 26 26 30 0 Z" fill="none" ${st(3)}/>`, x, y, k, r);
}
LIB.add({
  cat: "cut", name: "wedges", foods: ["lemon", "lime", "orange", "potato", "sweetpotato", "apple", "tomato", "onion", "redonion", "cabbage", "peach"],
  steps: ["Cut the lime into wedges", "Red onion - Cut in half, then cut each half into 4 wedges", "Cut the potatoes into wedges", "Serve with lemon wedges"],
  dur: 2.8,
  draw(t, F, key) {
    const D = 2.8, per = 0.36, start = 0.2;
    const n = clamp(Math.floor((t - start + per * 0.55) / per), 0, 6);
    let s = board();
    let food = g(whole(F), 104, 132, Math.max(0.7, 1.25 - n * 0.08));
    const spots = [[236, 92, -12], [300, 98, 10], [232, 146, 8], [298, 150, -8], [236, 198, -6], [300, 200, 12]];
    for (let i = 0; i < n; i++) {
      const q = ease(clamp((t - (start + i * per + per * 0.45)) / 0.22));
      const [x, y, r] = spots[i];
      food += cutWedgePiece(F, key, lerp(150, x, q), lerp(132, y, q), r * q, 1.05);
    }
    s += cutOp(cutFade(t, D), food);
    if (t > start && t < start + 6 * per) s += cutChop(108, cutDown(((t - start) % per) / per), 150);
    return s;
  },
});

// ================= Bias, rings, strips, sticks =================
// Knife walks from right to left over a food, each cut flinging a piece to a pile.
// o: { n, start, per, x0, step, src(clipX) -> svg, piece(i, q) -> svg, knifeAt(i, down) -> svg }
function cutRun(t, o) {
  const tc = (i) => o.start + i * o.per + o.per * 0.45;
  let done = 0; for (let i = 0; i < o.n; i++) if (t >= tc(i)) done++;
  const clipX = o.x0 - done * o.step;
  let food = o.src(clipX), knf = "";
  for (let i = 0; i < done; i++) food += o.piece(i, ease(clamp((t - tc(i)) / 0.25)));
  if (t > o.start && t < o.start + o.n * o.per) {
    const i = Math.floor((t - o.start) / o.per);
    knf = o.knifeAt(i, cutDown(((t - o.start) % o.per) / o.per));
  }
  return { food, knf, done };
}
const CUT_PILE_R = [[262, 96], [298, 104], [324, 120], [258, 130], [292, 138], [322, 156], [262, 166], [296, 176], [324, 194], [270, 202]];
// Bias-cut piece: a long oval with the inside showing.
const cutBiasPiece = (F, x, y, r, k = 1) => g(`<ellipse rx="22" ry="10" fill="${F.fill}" ${st(2.6)}/><ellipse rx="16" ry="6" fill="${F.inner}"/>`, x, y, k, r);
LIB.add({
  cat: "cut", name: "bias", foods: ["carrot", "celery", "scallion", "asparagus", "zucchini", "cucumber", "sausage", "parsnip", "greenbeans", "leek", "baguette"],
  steps: ["Peel and cut the carrots into 1-inch chunks on a diagonal", "Slice the celery on the bias", "Thinly slice the green onions on an angle", "Slice the baguette on the diagonal"],
  dur: 2.8,
  draw(t, F, key) {
    const D = 2.8, cy = 132, sc = F.small ? 1.25 : 1.05, half = cutHalfW(F) * sc;
    const cx = 168, x0 = cx + half - 14, slope = 0.55;
    const r = cutRun(t, {
      n: 7, start: 0.15, per: 0.32, x0, step: (half * 2 - 40) / 8,
      src: (cx2) => cutClip(cutPoly([[0, 0], [cx2 + 136 * slope, 0], [cx2 - 114 * slope, 250], [0, 250]]), g(whole(F), cx, cy, sc)),
      piece: (i, q) => { const [x, y] = CUT_PILE_R[i]; return cutBiasPiece(F, lerp(x0 - i * 10, x, q), lerp(cy, y, q), -30 + (i % 3) * 14, F.small ? 0.8 : 1); },
      knifeAt: (i, down) => { const xk = x0 - i * (half * 2 - 40) / 8, y = lerp(40, cy + 22, down); return knife(xk - (y - cy) * slope, y, 119, 110); },
    });
    return board() + cutOp(cutFade(t, D), r.food) + r.knf;
  },
});
// A ring slice seen face up.
function cutRingPiece(F, key, x, y, k = 1, r = 0, outer = true) {
  let s;
  if (key === "onion" || key === "redonion") s = (outer ? `<circle r="24" fill="none" stroke="${INK}" stroke-width="8"/><circle r="24" fill="none" stroke="${F.inner}" stroke-width="4"/>` : "") +
    `<circle r="14" fill="none" stroke="${INK}" stroke-width="8"/><circle r="14" fill="none" stroke="${F.inner}" stroke-width="4"/><circle r="14" fill="none" stroke="${F.rings}" stroke-width="1.2"/>`;
  else if (F.type === "pepper") { const d = `M0 -22 C14 -24 24 -12 22 0 C24 14 12 24 0 22 C-12 24 -24 14 -22 0 C-24 -12 -14 -24 0 -22 Z`; s = `<path d="${d}" fill="none" stroke="${INK}" stroke-width="10"/><path d="${d}" fill="none" stroke="${F.fill}" stroke-width="5.5"/>`; }
  else if (key === "leek") s = `<circle r="18" fill="${F.inner}" ${st(3)}/><circle r="12" fill="none" stroke="#CFE3A0" stroke-width="2"/><circle r="6" fill="none" stroke="#CFE3A0" stroke-width="2"/>`;
  else if (key === "scallion") s = `<circle r="9" fill="#F2F8E0" stroke="${INK}" stroke-width="2.4"/><circle r="9" fill="none" stroke="${F.fill}" stroke-width="2.4" opacity=".9"/><circle r="4" fill="none" stroke="#CFE3A0" stroke-width="1.5"/>`;
  else s = `<circle r="12" fill="${F.fill}" ${st(2.6)}/><circle r="8" fill="#F6F2D8"/><circle cx="-3" cy="-2" r="1.8" fill="#E8D27A"/><circle cx="3" cy="2" r="1.8" fill="#E8D27A"/><circle cx="2" cy="-3" r="1.6" fill="#E8D27A"/>`;
  return g(s, x, y, k, r);
}
LIB.add({
  cat: "cut", name: "rings", foods: ["onion", "redonion", "pepper", "greenpepper", "yellowpepper", "chile", "jalapeno", "scallion", "leek"],
  steps: ["Slice the onion into rings", "Slice the jalapeno into thin rings", "Cut the bell pepper into rings", "Slice the leeks into rounds"],
  dur: 2.8,
  draw(t, F, key) {
    const D = 2.8, cy = 132, sc = F.small ? 1.3 : 1.1, half = cutHalfW(F) * sc, cx = 140;
    const x0 = cx + half - 10, step = (half * 2 - 30) / 8;
    const small = F.small;
    const spots = small ? CUT_PILE_R : [[262, 92], [312, 102], [262, 148], [314, 156], [266, 204], [316, 206]];
    const r = cutRun(t, {
      n: small ? 8 : 6, start: 0.15, per: small ? 0.28 : 0.36, x0, step,
      src: (cx2) => cutClip(cutRect(0, 0, cx2, 250), g(whole(F), cx, cy, sc)),
      piece: (i, q) => { const [x, y] = spots[i]; return cutRingPiece(F, key, lerp(x0 - i * step + step / 2, x, q), lerp(cy, y, q), small ? 1.1 : 1, i * 30, !(i % 3 === 2 && (key === "onion" || key === "redonion"))); },
      knifeAt: (i, down) => cutChop(x0 - i * step, down, cy + 22),
    });
    let s = board() + cutOp(cutFade(t, D), r.food);
    // onion: an outer ring popping loose from one slice
    if ((key === "onion" || key === "redonion") && r.done > 2) s += cutOp(cutFade(t, D), cutRingPiece(F, key, 236, 214, 0.9, 0, true).replace(/<circle r="14"[^>]*\/>/g, ""));
    return s + r.knf;
  },
});

// Strips: a flat piece sliced into long strips laid side by side.
const CUT_PEPPERS = ["pepper", "greenpepper", "yellowpepper", "poblano"];
LIB.add({
  cat: "cut", name: "strips", foods: [...CUT_PEPPERS, "chicken", "beef", "steak", "pork", "tortilla", "cornTortilla"],
  steps: ["Seed and slice the capsicums / bell peppers", "Thinly slice the red bell pepper", "Slice into 5mm strips", "Slice the corn tortillas into 1/4-inch x 2-inch strips"],
  dur: 2.8,
  draw(t, F, key) {
    const D = 2.8, cy = 134, pep = CUT_PEPPERS.includes(key), flat = F.type === "flat";
    let src, strip;
    if (pep) {
      src = `<rect x="64" y="96" width="160" height="76" rx="26" fill="${F.fill}" ${st()}/><rect x="74" y="104" width="140" height="60" rx="20" fill="${F.inner}"/>`;
      strip = (c) => `<rect x="-7" y="-36" width="14" height="72" rx="6" fill="${F.inner}" ${st(2.6)}/><path d="M-4 -32 L-4 32" stroke="${F.fill}" stroke-width="4" stroke-linecap="round"/>`;
    } else if (flat) {
      src = `<ellipse cx="146" cy="${cy}" rx="84" ry="66" fill="${F.fill}" ${st()}/><ellipse cx="146" cy="${cy}" rx="70" ry="54" fill="none" stroke="${shade(F.fill)}" stroke-width="2" opacity=".5"/>` + [[120, 110], [170, 120], [130, 160], [176, 158], [100, 140]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="${shade(F.fill)}" opacity=".6"/>`).join("");
      strip = () => `<rect x="-6" y="-34" width="12" height="68" rx="4" fill="${F.fill}" ${st(2.4)}/>`;
    } else {
      src = g(whole(F), 146, cy, 1.3);
      strip = () => `<rect x="-7" y="-34" width="14" height="68" rx="6" fill="${F.fill}" ${st(2.6)}/><path d="M-2 -28 C2 -10 -2 10 2 28" stroke="${F.mark || F.inner}" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>`;
    }
    const x0 = 222, step = 18;
    const r = cutRun(t, {
      n: 7, start: 0.15, per: 0.33, x0, step,
      src: (cx2) => cutClip(cutRect(0, 0, cx2, 250), src),
      piece: (i, q) => g(strip(i), lerp(x0 - i * step + 8, 250 + i * 13, q), lerp(cy, cy + (i % 2) * 6, q), 1, lerp(0, (i % 3 - 1) * 5, q)),
      knifeAt: (i, down) => cutChop(x0 - i * step, down, cy + 30),
    });
    return board() + cutOp(cutFade(t, D), r.food) + r.knf;
  },
});
// The peeled block a stick cut starts from.
function cutBlock(F, key, x, y, w, h) {
  const skin = ["cucumber", "zucchini", "apple", ...CUT_PEPPERS].includes(key);
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${F.inner}" ${st()}/>` + (skin ? `<path d="M${x + 4} ${y + 4} L${x + w - 4} ${y + 4}" stroke="${F.fill}" stroke-width="7" stroke-linecap="round"/>` : "");
}
function cutSticks(t, F, key, thin) {
  const D = 2.8, cy = 134, skin = ["cucumber", "zucchini", "apple", ...CUT_PEPPERS].includes(key);
  const stick = (w) => `<rect x="${-w / 2}" y="-34" width="${w}" height="68" rx="${w / 3}" fill="${F.inner}" stroke="${INK}" stroke-width="${thin ? 1.8 : 2.6}"/>` + (skin ? `<path d="M0 -30 L0 30" stroke="${F.fill}" stroke-width="${thin ? 2 : 3}"/>` : "");
  const x0 = 214, step = thin ? 13 : 20, n = thin ? 8 : 6;
  const r = cutRun(t, {
    n, start: 0.15, per: thin ? 0.28 : 0.36, x0, step,
    src: (cx2) => cutClip(cutRect(0, 0, cx2, 250), cutBlock(F, key, 70, 98, 150, 72)),
    piece: (i, q) => {
      if (thin) return [0, 1].map(j => g(stick(5), lerp(x0 - i * step + 6, 252 + i * 9 + j * 4, q), lerp(cy, cy - 4 + j * 8, q), 1, lerp(0, ((i + j) % 3 - 1) * 6, q))).join("");
      return g(stick(13), lerp(x0 - i * step + 8, 254 + i * 15, q), lerp(cy, cy + (i % 2) * 5, q), 1, lerp(0, (i % 3 - 1) * 4, q));
    },
    knifeAt: (i, down) => cutChop(x0 - i * step, down, cy + 30),
  });
  return board() + cutOp(cutFade(t, D), r.food) + r.knf;
}
LIB.add({
  cat: "cut", name: "julienne", foods: ["carrot", "cucumber", "zucchini", "ginger", "pepper", "beet", "potato", "apple"],
  steps: ["Cut the carrots into matchsticks", "Julienne the ginger", "Cut the cucumber into thin matchsticks", "Julienne the bell pepper"],
  dur: 2.8, draw(t, F, key) { return cutSticks(t, F, key, true); },
});
LIB.add({
  cat: "cut", name: "batons", foods: ["potato", "sweetpotato", "carrot", "parsnip", "zucchini"],
  steps: ["Then cut into batons so they are roughly equal size", "Cut the potatoes into fries", "Cut the sweet potatoes into sticks", "Cut the carrots into batons"],
  dur: 2.8, draw(t, F, key) { return cutSticks(t, F, key, false); },
});
// Half-moons / shreds: a halved food lying flat side down, sliced across.
function cutDome(F, key) {
  if (F.type === "long") return `<path d="M50 160 L250 160 C266 160 266 112 246 108 L54 108 C34 112 34 160 50 160 Z" fill="${F.fill}" ${st()}/><path d="M60 116 L240 116" stroke="#fff" stroke-width="3" opacity=".4" stroke-linecap="round"/>`;
  const c = (key === "onion" || key === "redonion" || key === "shallot") ? F.inner : F.fill;
  let s = `<path d="M70 166 L230 166 C230 70 70 70 70 166 Z" fill="${c}" ${st()}/>`;
  if (F.rings) s += `<path d="M90 166 C92 96 208 96 210 166 M112 166 C114 118 186 118 188 166" fill="none" stroke="${F.rings}" stroke-width="2.4"/>`;
  if (F.citrus) s += [[100, 120], [150, 104], [196, 124]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="${shade(c)}"/>`).join("");
  return s;
}
LIB.add({
  cat: "cut", name: "halfmoons", foods: ["onion", "redonion", "zucchini", "cucumber", "lemon"],
  steps: ["Thinly slice the red onion into half moons", "Halve and slice the onion thickly", "Halve the zucchini and slice into half moons", "Thinly slice the lemon into half-moons"],
  dur: 2.8,
  draw(t, F, key) {
    const D = 2.8, x0 = F.type === "long" ? 244 : 222, step = F.type === "long" ? 22 : 17;
    const moon = (x, y, r) => g(cutClip(cutRect(-40, -40, 80, 40), cutFace(F, key, 22, 20)), x, y, 1, r);
    const r = cutRun(t, {
      n: 7, start: 0.15, per: 0.33, x0, step,
      src: (cx2) => cutClip(cutRect(0, 0, cx2, 250), cutDome(F, key)),
      piece: (i, q) => { const [x, y] = CUT_PILE_R[i]; return moon(lerp(x0 - i * step + 8, x + 4, q), lerp(150, y + 8, q), lerp(0, (i % 3 - 1) * 25, q)); },
      knifeAt: (i, down) => cutChop(x0 - i * step, down, 168),
    });
    return board() + cutOp(cutFade(t, D), r.food) + r.knf;
  },
});
LIB.add({
  cat: "cut", name: "shredcabbage", foods: ["cabbage", "redcabbage"],
  steps: ["Thinly shred the cabbage", "Finely shred the red cabbage", "Slice the cabbage into thin ribbons"],
  dur: 2.8,
  draw(t, F, key) {
    const D = 2.8, x0 = 222, step = 13;
    const r = cutRun(t, {
      n: 9, start: 0.15, per: 0.27, x0, step,
      src: (cx2) => cutClip(cutRect(0, 0, cx2, 250), cutDome(F, key) + `<path d="M84 166 C96 112 204 112 216 166 M110 166 C116 132 184 132 190 166" fill="none" stroke="${F.rings}" stroke-width="2.4"/>`),
      piece: (i, q) => [0, 1, 2].map(j => { const k = i * 3 + j; return piece(F, "shred", lerp(x0 - i * step, 258 + (k * 29) % 70, q), lerp(150, 90 + ((k * 37) % 120), q), (k * 53) % 180, 1.5); }).join(""),
      knifeAt: (i, down) => cutChop(x0 - i * step, down, 168),
    });
    return board() + cutOp(cutFade(t, D), r.food) + r.knf;
  },
});
LIB.add({
  cat: "cut", name: "chiffonade", foods: ["basil", "spinach", "kale", "greens", "lettuce"],
  steps: ["Stack the basil leaves, roll them up, and thinly slice", "Cut the basil into thin ribbons", "Thinly slice the kale into ribbons", "Chiffonade the spinach"],
  dur: 3.2,
  draw(t, F, key) {
    const D = 3.2, roll = phase(t, D, 0.35, 0.85);
    let food = "";
    if (roll < 1) {
      const leaf = (dx, dy, r, c) => g(`<path d="M-80 0 C-50 -44 50 -44 84 0 C50 40 -50 40 -80 0 Z" fill="${c}" ${st()}/><path d="M-76 0 L76 0" stroke="${shade(c)}" stroke-width="3"/>`, 150 + dx, 134 + dy, 1, r);
      food += `<g transform="translate(0 ${134 * roll}) scale(1 ${1 - roll * 0.75}) translate(0 ${-134 * roll})">${leaf(-6, 8, -6, shade(F.fill))}${leaf(4, -2, 4, F.fill)}${leaf(0, -10, -2, F.inner)}</g>`;
    }
    const cig = (cx2) => cutClip(cutRect(0, 0, cx2, 250), `<rect x="72" y="118" width="160" height="32" rx="15" fill="${F.fill}" ${st()}/><path d="M86 124 C78 130 82 144 92 142 C100 140 98 130 92 130" fill="none" stroke="${shade(F.fill)}" stroke-width="3"/><path d="M110 122 L120 146 M150 122 L160 146 M190 122 L200 146" stroke="${shade(F.fill)}" stroke-width="2.5"/>`);
    const ribbon = (x, y, r) => g(`<path d="M-18 0 C-8 -8 4 8 18 -2" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M-18 0 C-8 -8 4 8 18 -2" fill="none" stroke="${F.fill}" stroke-width="4" stroke-linecap="round"/>`, x, y, 1, r);
    if (roll > 0) {
      const r = cutRun(t, {
        n: 7, start: 1.0, per: 0.27, x0: 222, step: 18,
        src: (cx2) => cutOp(roll, cig(cx2)),
        piece: (i, q) => [0, 1].map(j => { const k = i * 2 + j; return ribbon(lerp(214 - i * 18, 262 + (k * 23) % 64, q), lerp(134, 96 + ((k * 41) % 110), q), (k * 67) % 180); }).join(""),
        knifeAt: (i, down) => cutChop(222 - i * 18, down, 150),
      });
      food += r.food;
      return board() + cutOp(cutFade(t, D), food) + r.knf;
    }
    return board() + cutOp(cutFade(t, D), food);
  },
});

// ================= Finely vs roughly chopped =================
LIB.add({
  cat: "cut", name: "finechop", foods: ["onion", "redonion", "shallot", "carrot", "celery", "parsley", "cilantro", "herbs", "chile", "pepper", "nuts", "ginger"],
  steps: ["Finely chop the onion", "Finely chop the celery ribs", "Peel and finely chop the carrots", "Finely chop the thyme"],
  dur: 2.4,
  draw(t, F, key) {
    const D = 2.4, p = t / D;
    let food = "";
    for (let i = 0; i < 46; i++) {
      const a = i * 2.39996, rr = Math.sqrt(i) * (p < 0.3 ? 12 : 9);
      const x = 176 + Math.cos(a) * rr * 1.5, y = 140 + Math.sin(a) * rr * 0.8;
      if (p < 0.3 && i > 18) continue;
      food += p < 0.3 ? piece(F, "chunk", x, y, i * 37, 1.1) : piece(F, "bit", x, y, i * 37, lerp(2, 1.25, ease(seg(p, 0.3, 0.8))));
    }
    const rock = Math.sin(t * 13) * 10, sweep = Math.sin(t * 3) * 30;
    return board() + cutOp(cutFade(t, D), food) + knife(100 + sweep * 0.5, 138, 180 + rock, 180);
  },
});
LIB.add({
  cat: "cut", name: "roughchop", foods: ["onion", "carrot", "celery", "cilantro", "parsley", "pepper", "tomato", "apple", "nuts", "chocolate", "mushroom"],
  steps: ["Roughly chop the cilantro", "Roughly chop the yellow onion", "Roughly chop the honeycrisp apples", "Roughly chop the red bell pepper"],
  dur: 2.4,
  draw(t, F, key) {
    const D = 2.4, per = 0.45, start = 0.15;
    const n = clamp(Math.floor((t - start + per * 0.55) / per), 0, 4);
    const spots = [[236, 100, 20], [300, 96, -30], [262, 150, 60], [320, 146, 10], [236, 198, -40], [296, 200, 80], [330, 196, 30], [270, 122, -70]];
    let food = g(whole(F), 112, 134, Math.max(0.65, 1.15 - n * 0.12));
    for (let i = 0; i < n * 2; i++) { const q = ease(clamp((t - (start + Math.floor(i / 2) * per + per * 0.45)) / 0.22)); const [x, y, r] = spots[i]; food += piece(F, "chunk", lerp(160, x, q), lerp(134, y, q), r, 2); }
    let s = board() + cutOp(cutFade(t, D), food);
    if (t > start && t < start + 4 * per) s += cutChop(150 - n * 4, cutDown(((t - start) % per) / per), 150);
    return s;
  },
});

// ================= Trimming =================
LIB.add({
  cat: "cut", name: "topandtail", foods: ["onion", "redonion", "carrot", "zucchini", "cucumber", "eggplant", "parsnip", "beet", "celery"],
  steps: ["Trim the ends off the zucchini", "Top and tail the carrots", "Cut off the root and stem ends of the onion", "Trim the ends of the eggplant"],
  dur: 2.6,
  draw(t, F, key) {
    const D = 2.6, cx = 180, cy = 134, sc = 1.25, hw = cutHalfW(F) * sc;
    const xl = cx - hw + 18, xr = cx + hw - 18;
    const c1 = phase(t, D, 0.5, 0.8), c2 = phase(t, D, 1.25, 1.55);
    const src = g(whole(F), cx, cy, sc);
    let food = cutClip(cutRect(xl, 0, xr - xl, 250), src);
    food += g(cutClip(cutRect(0, 0, xl, 250), src), -c1 * 26, c1 * 40, 1);
    food += g(cutClip(cutRect(xr, 0, 360 - xr, 250), src), c2 * 26, c2 * 40, 1);
    let s = board() + cutOp(cutFade(t, D), food);
    if (t > 0.2 && t < 0.95) s += cutChop(xl, cutDown(seg(t, 0.2, 0.95)), cy + 40);
    if (t > 0.95 && t < 1.7) s += cutChop(xr, cutDown(seg(t, 0.95, 1.7)), cy + 40);
    return s;
  },
});
LIB.add({
  cat: "cut", name: "trimends", foods: ["greenbeans", "asparagus", "scallion", "okra"],
  steps: ["Trim the green beans", "Line up the beans and trim the ends", "Trim the woody ends of the asparagus", "Trim the root ends off the green onions"],
  dur: 2.6,
  draw(t, F, key) {
    const D = 2.6, sc = 1.15, cx = 170, rows = [84, 110, 136, 162, 188];
    const xr = cx + 54 * sc - 16, xl = cx - 54 * sc + 14, both = key === "greenbeans";
    const c1 = phase(t, D, 0.55, 0.85), c2 = phase(t, D, 1.35, 1.65);
    let food = "";
    for (const y of rows) {
      let sp = g(whole(F), cx, y, sc);
      if (key === "asparagus") sp += cutClip(cutRect(xr - 6, 0, 80, 250), g(`<path d="M-54 -12 L54 -12 C64 -12 64 12 54 12 L-54 12 Z" fill="#D9D2A8" opacity=".85"/>`, cx, y, sc));
      if (key === "scallion") sp += `<path d="M${cx + 62 * sc} ${y} l12 -6 M${cx + 62 * sc} ${y} l14 0 M${cx + 62 * sc} ${y} l12 6" stroke="#E8DCC0" stroke-width="3" stroke-linecap="round"/>`;
      const lo = both ? xl : 0;
      food += cutClip(cutRect(lo, y - 30, xr - lo, 60), sp);
      food += g(cutClip(cutRect(xr, y - 30, 120, 60), sp), c1 * 30, c1 * 8, 1);
      if (both) food += g(cutClip(cutRect(0, y - 30, xl, 60), sp), -c2 * 30, c2 * 8, 1);
    }
    let s = board() + cutOp(cutFade(t, D), food);
    if (t > 0.25 && t < 1.05) s += cutChop(xr, cutDown(seg(t, 0.25, 1.05)), 204);
    if (both && t > 1.05 && t < 1.85) s += cutChop(xl, cutDown(seg(t, 1.05, 1.85)), 204);
    return s;
  },
});
LIB.add({
  cat: "cut", name: "snap", foods: ["asparagus"],
  steps: ["Snap off the woody ends of the asparagus", "Bend each spear until it snaps", "Trim the tough ends"],
  dur: 2.6,
  draw(t, F) {
    const D = 2.6, bend = t < 0.95 ? phase(t, D, 0.25, 0.9) : 0, snapped = t >= 0.95;
    const fall = phase(t, D, 0.95, 1.4), px = 236, py = 128;
    const tipPart = `<path d="M70 ${py - 10} L${px} ${py - 10} L${px} ${py + 10} L70 ${py + 10} C56 ${py + 8} 52 ${py - 8} 70 ${py - 10} Z" fill="${F.fill}" ${st()}/><path d="M58 ${py} L76 ${py - 12} L74 ${py} L76 ${py + 12} Z" fill="${shade(F.fill)}" ${st(2.6)}/><path d="M110 ${py - 10} l8 6 M150 ${py + 10} l8 -6 M190 ${py - 10} l8 6" ${st(2.4)}/>`;
    const woody = `<path d="M${px} ${py - 10} L296 ${py - 10} C304 ${py - 10} 304 ${py + 10} 296 ${py + 10} L${px} ${py + 10} Z" fill="#C9C48A" ${st()}/>`;
    let food = "";
    if (!snapped) food += `<g transform="rotate(${bend * 14} ${px} ${py})">${tipPart}${g(fist(), 92, py - 4, 1.1)}</g><g transform="rotate(${-bend * 14} ${px} ${py})">${woody}${g(fist(), 280, py - 4, 1.1)}</g>`;
    else {
      food += `<g transform="rotate(${(1 - fall) * 14} ${px} ${py})">${tipPart}${g(fist(), 92, py - 4, 1.1)}</g>`;
      food += g(woody, fall * 30, fall * 70, 1, 0) + g(fist(), 280, py - 4 - fall * 30, 1.1);
      if (fall < 0.6) food += `<path d="M${px} ${py - 24} l0 -12 M${px - 12} ${py - 20} l-8 -8 M${px + 12} ${py - 20} l8 -8" ${st(3)}/>`;
    }
    return board() + cutOp(cutFade(t, D), food);
  },
});
LIB.add({
  cat: "cut", name: "trimfat", foods: ["steak", "beef", "pork", "porkchop", "lamb", "chicken"],
  steps: ["Trim the excess fat", "Slice into strips, discarding excess fat", "Trim any fat from the chicken", "Trim the fat cap off the beef"],
  dur: 2.8,
  draw(t, F, key) {
    const D = 2.8, cx = 170, cy = 150, sc = 1.25;
    const fatC = key === "chicken" ? "#FBF0C8" : "#FBF6EC";
    const fatD = "M-56 -12 C-50 -34 20 -40 56 -22";
    const fat = g(`<path d="${fatD}" fill="none" stroke="${INK}" stroke-width="17" stroke-linecap="round"/><path d="${fatD}" fill="none" stroke="${fatC}" stroke-width="11" stroke-linecap="round"/>`, cx, cy, sc);
    const p = phase(t, D, 0.3, 1.5), tipX = lerp(258, 96, p), off = phase(t, D, 1.55, 1.95);
    let food = g(whole(F), cx, cy, sc);
    if (off <= 0) food += cutClip(cutRect(0, 0, tipX, 250), fat) + g(cutClip(cutRect(tipX, 0, 360, 250), fat), 0, -12 * p, 1);
    else food += g(fat, off * 110, -12 - off * 60, 1, off * 10);
    let s = board() + cutOp(cutFade(t, D), food);
    if (t > 0.2 && t < 1.6) s += knife(tipX, 124 + Math.sin(t * 9) * 3, 180, 100);
    return s;
  },
});
// A leaf on a stem (kale, chard) or a herb sprig.
LIB.add({
  cat: "cut", name: "destem", foods: ["kale", "greens"],
  steps: ["Remove the stems from the kale", "Strip the kale leaves from the stems", "Remove the tough stems from the greens"],
  dur: 2.8,
  draw(t, F) {
    const D = 2.8, cy = 132, px = lerp(92, 312, phase(t, D, 0.3, 1.4)), drop = phase(t, D, 1.45, 1.85);
    let top = "M90 132", bot = "M90 132";
    for (let i = 0; i <= 10; i++) { const x = 90 + i * 22, a = Math.sin(i / 10 * Math.PI); top += ` Q${x + 11} ${cy - a * 70 - 14} ${x + 22} ${cy - a * 64}`; bot += ` Q${x + 11} ${cy + a * 70 + 14} ${x + 22} ${cy + a * 64}`; }
    const blade = `<path d="${top} L310 132 Z" fill="${F.fill}" ${st()}/><path d="${bot} L310 132 Z" fill="${shade(F.fill)}" ${st()}/>` + [130, 180, 230, 270].map(x => `<path d="M${x} ${cy} l20 -26 M${x} ${cy} l20 26" stroke="${F.inner}" stroke-width="3"/>`).join("");
    let food = `<path d="M44 ${cy} L312 ${cy}" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M44 ${cy} L312 ${cy}" stroke="#D8EBB0" stroke-width="6" stroke-linecap="round"/>`;
    food += cutClip(cutRect(px, 0, 360, 250), blade);
    // the stripped leaf bunches up ahead of the fingers, then drops in a pile
    const bunch = (x, y, k) => g([[-14, -8], [8, -12], [-6, 8], [14, 6], [0, -2]].map(([a, b], i) => `<path transform="translate(${a} ${b}) rotate(${i * 70})" d="M-14 0 C-8 -12 8 -12 14 0 C8 12 -8 12 -14 0 Z" fill="${i % 2 ? F.fill : shade(F.fill)}" ${st(2.6)}/>`).join(""), x, y, k);
    const bk = Math.min(1, (px - 92) / 120);
    if (drop <= 0) food += bunch(px - 6, cy, 0.4 + bk * 0.8);
    else food += bunch(lerp(px - 6, 280, drop), lerp(cy, 200, drop), 1.2);
    food += g(fist(), 50, cy - 2, 1.1);
    if (drop <= 0) food += T.pinch(px - 2, cy - 4, 1.1, -90);
    return board() + cutOp(cutFade(t, D), food);
  },
});
LIB.add({
  cat: "cut", name: "pickleaves", foods: ["parsley", "cilantro", "basil", "herbs"],
  steps: ["Pick the leaves from the stems", "Strip the thyme leaves from the stems", "Pick the basil leaves", "Remove the cilantro leaves from the stems"],
  dur: 2.8,
  draw(t, F, key) {
    const D = 2.8, cy = 104, px = lerp(296, 84, phase(t, D, 0.3, 1.6));
    const big = key === "basil" ? 1.5 : key === "herbs" ? 0.75 : 1.1;
    const leaf = (x, y, r) => g(`<path d="M-12 0 C-8 -9 8 -9 12 0 C8 9 -8 9 -12 0 Z" fill="${F.fill}" ${st(2.4)}/><path d="M-9 0 L9 0" stroke="${F.inner}" stroke-width="1.8"/>`, x, y, big, r);
    let food = `<path d="M60 ${cy} C140 ${cy - 6} 220 ${cy + 4} 300 ${cy - 6}" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M60 ${cy} C140 ${cy - 6} 220 ${cy + 4} 300 ${cy - 6}" fill="none" stroke="#7BBF5A" stroke-width="3" stroke-linecap="round"/>`;
    for (let i = 0; i < 9; i++) {
      const x = 106 + i * 23, up = i % 2 ? -1 : 1, y0 = cy + up * 12;
      if (x < px) food += leaf(x, y0, up * 35);
      else { const q = clamp((x - px) / 90); food += leaf(lerp(x, 220 + (i * 31) % 100, q), lerp(y0, 196 - (i % 3) * 10, ease(q)), up * 35 + q * 90); }
    }
    food += g(fist(), 64, cy, 1.1) + T.pinch(px, cy - 6, 1.1, -90);
    return board() + cutOp(cutFade(t, D), food);
  },
});

// ================= Lengthwise halves =================
LIB.add({
  cat: "cut", name: "halvelong", foods: ["zucchini", "cucumber", "eggplant", "carrot", "leek", "chile", "parsnip"],
  steps: ["Halve the zucchini lengthwise", "Cut the cucumber in half lengthwise", "Halve the eggplant lengthwise", "Split the leeks lengthwise"],
  dur: 2.8,
  draw(t, F, key) {
    const D = 2.8, cx = 176, cy = 132, sc = F.small ? 1.6 : 1.3;
    const L = (F.small ? 54 : 74) * sc, w = (F.small ? 12 : 20) * sc;
    const tip = lerp(312, 70, phase(t, D, 0.3, 0.95));
    const part = phase(t, D, 1.05, 1.35), open = phase(t, D, 1.35, 1.7);
    let food = "";
    const src = g(whole(F), cx, cy, sc);
    if (open < 1) for (const side of [-1, 1]) {
      const half = cutClip(cutRect(0, side < 0 ? 0 : cy, 360, 125), src);
      const hy = cy + side * (w / 2 + part * 34);
      food += `<g transform="translate(0 ${hy}) scale(1 ${Math.max(0.001, 1 - open)}) translate(0 ${-(cy + side * w / 2)})">${half}</g>`;
    }
    if (open > 0) for (const side of [-1, 1]) food += g(`<g transform="scale(1 ${open})">${cutLongFace(F, key, L * 0.9, w * 0.95)}</g>`, cx, cy + side * (w / 2 + 34));
    let s = board() + cutOp(cutFade(t, D), food);
    if (t > 0.2 && t < 1.05) s += knife(tip, cy + 2, 180, 130);
    return s;
  },
});

// ================= Seeding and coring =================
LIB.add({
  cat: "cut", name: "seedpepper", foods: CUT_PEPPERS,
  steps: ["Seed the bell pepper", "Cut around the stem and pull out the core", "Seed and dice the poblano pepper", "Core and seed the peppers"],
  dur: 2.8,
  draw(t, F) {
    const D = 2.8, cx = 176, cy = 146, sc = 1.5;
    const circ = phase(t, D, 0.25, 1.05), pull = phase(t, D, 1.15, 1.75), away = phase(t, D, 1.75, 2.15);
    let food = g(whole(F), cx, cy, sc);
    const topY = cy - 34 * sc;
    if (circ > 0.98) food += `<ellipse cx="${cx}" cy="${topY + 6}" rx="${20 + pull * 4}" ry="9" fill="${pull > 0 ? "#FFF6EA" : F.inner}" ${st(3)}/>`;
    // the core: stem + white pith + seeds, lifted out
    if (circ > 0.98 && away < 1) {
      const cxx = cx + away * 110, cyy = topY - pull * 70 + away * 40;
      food += g(`<path d="M-14 6 C-20 30 -10 52 0 56 C10 52 20 30 14 6 Z" fill="#F7F0DC" ${st(3)}/>${[[-6, 22], [5, 30], [-3, 40], [7, 44], [-8, 36], [2, 16]].map(([a, b]) => `<ellipse cx="${a}" cy="${b}" rx="3.4" ry="2.4" fill="#F2DC8A" ${st(1.2)}/>`).join("")}
        <path d="M-18 6 L18 6" stroke="${F.fill}" stroke-width="8" stroke-linecap="round"/><path d="M0 4 C0 -8 6 -14 14 -16" ${st(10)} fill="none"/><path d="M0 4 C0 -8 6 -14 14 -16" stroke="#3E8E41" stroke-width="5" fill="none" stroke-linecap="round"/>`, cxx, cyy, 1, away * 20) +
        (pull > 0 && away <= 0 ? T.pinch(cxx + 10, cyy - 16, 1, 10) : "");
    }
    let s = board() + cutOp(cutFade(t, D), food);
    if (circ > 0 && circ < 1) { const a = circ * Math.PI * 2; s += cutParing(cx + Math.cos(a) * 22, topY + 8 + Math.sin(a) * 8, 70 + Math.cos(a) * 10); }
    return s;
  },
});
LIB.add({
  cat: "cut", name: "seedchile", foods: ["chile", "jalapeno", "redchile"],
  steps: ["Seed the red chilli and finely chop", "Halve the jalapenos and scrape out the seeds", "Remove the seeds and ribs", "Seed the chile"],
  dur: 2.6,
  draw(t, F, key) {
    const D = 2.6, cx = 170, cy = 132, L = 110, w = 30;
    const tipX = lerp(78, 262, phase(t, D, 0.3, 1.5)), push = phase(t, D, 1.5, 1.9);
    let food = g(cutLongFace(F, key, L, w), cx, cy);
    // cover the seeds and rib already scraped away
    food += cutClip(cutRect(0, 0, tipX, 250), `<path d="M${cx - L * 0.72} ${cy} L${cx + L * 0.62} ${cy}" stroke="${F.inner}" stroke-width="${w * 0.62}" stroke-linecap="round"/>`);
    const pile = [...Array(8)].map((_, i) => `<ellipse cx="${(i % 4) * 6 - 9}" cy="${Math.floor(i / 4) * 6 - 3}" rx="3.4" ry="2.4" fill="#F2DC8A" ${st(1.2)} transform="rotate(${i * 40} ${(i % 4) * 6 - 9} ${Math.floor(i / 4) * 6 - 3})"/>`).join("") + `<path d="M-14 6 L12 6" stroke="#F4F0C8" stroke-width="6" stroke-linecap="round"/>`;
    const k = phase(t, D, 0.35, 0.9);
    if (k > 0) food += g(pile, push > 0 ? lerp(tipX + 8, 300, push) : tipX + 8, push > 0 ? lerp(cy, 196, push) : cy - 2, 0.5 + 0.7 * k);
    let s = board() + cutOp(cutFade(t, D), food);
    if (t > 0.2 && t < 1.6) s += cutParing(tipX, cy + 2, 160);
    return s;
  },
});
LIB.add({
  cat: "cut", name: "seedtomato", foods: ["tomato"],
  steps: ["Halve the tomatoes and scoop out the seeds", "Seed and dice the tomatoes", "Squeeze out the seeds"],
  dur: 2.8,
  draw(t, F, key) {
    const D = 2.8, cx = 140, cy = 132, R = 74;
    const spots = [-90, 30, 150].map(a => [cx + Math.cos(a * Math.PI / 180) * R * 0.42, cy + Math.sin(a * Math.PI / 180) * R * 0.86 * 0.42]);
    let food = g(cutFace(F, key, R, R * 0.86), cx, cy);
    let spoon = "";
    for (let i = 0; i < 3; i++) {
      const a = 0.3 + i * 0.7, scoop = phase(t, D, a, a + 0.3), carry = phase(t, D, a + 0.3, a + 0.65);
      const [x, y] = spots[i];
      if (scoop >= 1) food += `<ellipse cx="${x}" cy="${y}" rx="${R * 0.22}" ry="${R * 0.18}" fill="${mixColor(F.inner, "#FFFFFF", 0.15)}"/>`;
      if (carry >= 1) food += `<ellipse cx="${280 + i * 14}" cy="${196 - (i % 2) * 6}" rx="10" ry="6" fill="#F9B8A0" ${st(2)}/><circle cx="${278 + i * 14}" cy="${195}" r="2" fill="#F7D27A"/>`;
      if (t > a && t < a + 0.65) spoon = cutSpoon(carry > 0 ? lerp(x, 284 + i * 14, carry) : x + 10 - scoop * 10, carry > 0 ? lerp(y, 186, carry) : y, -10, carry > 0 || scoop > 0.5 ? "#F9B8A0" : null);
    }
    return board() + V.smallBowl(288, 186, 0.55) + cutOp(cutFade(t, D), food) + spoon;
  },
});
LIB.add({
  cat: "cut", name: "seedspoon", foods: ["cucumber", "zucchini"],
  steps: ["Halve the cucumber lengthwise and scoop out the seeds with a spoon", "Scrape out the seeds with a teaspoon", "Seed the cucumber"],
  dur: 2.6,
  draw(t, F, key) {
    const D = 2.6, cx = 170, cy = 136, L = 120, w = 34;
    const sx = lerp(78, 270, phase(t, D, 0.3, 1.6)), drop = phase(t, D, 1.6, 1.95);
    let food = g(cutLongFace(F, key, L, w), cx, cy);
    food += cutClip(cutRect(0, 0, sx, 250), `<ellipse cx="${cx}" cy="${cy}" rx="${L * 0.8}" ry="${w * 0.34}" fill="${mixColor(F.inner, F.fill, 0.18)}" ${st(2)}/>`);
    const pulp = `<ellipse rx="12" ry="7" fill="${mixColor(F.inner, "#FFFFFF", 0.35)}" ${st(2)}/><circle cx="-4" cy="0" r="2" fill="${shade(F.inner)}"/><circle cx="4" cy="-2" r="2" fill="${shade(F.inner)}"/>`;
    let s = board() + V.smallBowl(304, 196, 0.45);
    let spoon = "";
    if (t > 0.2 && drop < 1) spoon = cutSpoon(drop > 0 ? lerp(sx, 300, drop) : sx, drop > 0 ? lerp(cy, 182, drop) : cy, -14, drop < 0.9 && sx > 90 ? mixColor(F.inner, "#FFFFFF", 0.35) : null);
    if (drop >= 1) food += g(pulp, 304, 188, 1);
    return s + cutOp(cutFade(t, D), food) + spoon;
  },
});
LIB.add({
  cat: "cut", name: "scoopseeds", foods: ["squash", "pumpkin", "cantaloupe"],
  steps: ["Halve the squash and scoop out the seeds", "Scoop out the seeds and stringy bits", "Halve the melon and scrape out the seeds"],
  dur: 2.8,
  draw(t, F, key) {
    const D = 2.8, cx = 150, cy = 134, R = 84;
    const s1 = phase(t, D, 0.3, 1.0), s2 = phase(t, D, 1.15, 1.85);
    const left = Math.round(9 * (1 - (s1 > 0.6 ? 0.5 : 0) - (s2 > 0.6 ? 0.5 : 0)));
    let food = g(cutFace(F, key, R, R * 0.86, { seeds: left }), cx, cy);
    const heap = (n) => [...Array(n)].map((_, i) => `<ellipse cx="${(i * 13) % 34 - 16}" cy="${(i * 7) % 14 - 6}" rx="6" ry="3.6" fill="#FBF1D4" ${st(1.4)} transform="rotate(${i * 50} ${(i * 13) % 34 - 16} ${(i * 7) % 14 - 6})"/>`).join("") + `<path d="M-18 6 C-8 -2 6 10 18 2" stroke="${mixColor(F.inner, "#C96A1E", 0.3)}" stroke-width="3" fill="none"/>`;
    let spoon = "";
    for (const [p, i] of [[s1, 0], [s2, 1]]) {
      if (p <= 0) continue;
      if (p >= 1) { food += g(heap(5), 290, 196 - i * 14, 1); continue; }
      const sc = p < 0.6 ? p / 0.6 : 1, carry = p < 0.6 ? 0 : (p - 0.6) / 0.4;
      const a = -2.4 + sc * 2.6, x = cx + Math.cos(a) * 26, y = cy + Math.sin(a) * 20;
      spoon = cutSpoon(lerp(x, 290, ease(carry)), lerp(y, 186 - i * 14, ease(carry)), -10, sc > 0.4 ? "#F2C26A" : null);
    }
    return board() + cutOp(cutFade(t, D), food) + spoon;
  },
});
LIB.add({
  cat: "cut", name: "corehalf", foods: ["apple", "pear", "cabbage", "redcabbage"],
  steps: ["Quarter and core the apples", "Halve the cabbage and cut out the core", "Core the pears", "Cut out the hard core"],
  dur: 2.8,
  draw(t, F, key) {
    const D = 2.8, cx = 176, cy = 132, cab = F.type === "round" && F.rings && key.includes("cabbage");
    const R = cab ? 80 : 74;
    const c1 = phase(t, D, 0.3, 0.75), c2 = phase(t, D, 0.85, 1.3), lift = phase(t, D, 1.4, 1.9);
    let food = g(cutFace(F, key, R, R * 0.86, { core: !cab || lift <= 0 }), cx, cy);
    // the core wedge: for apples a ring of seeds, for cabbage the white triangle
    const coreShape = cab ? `<path d="M${-R * 0.2} ${R * 0.79} L0 ${R * 0.13} L${R * 0.2} ${R * 0.79} Z" fill="#F6F9E4" ${st(3)}/>`
      : `<ellipse rx="${R * 0.3}" ry="${R * 0.4}" fill="#F4E8C4" ${st(3)}/><ellipse cx="0" cy="-8" rx="3.5" ry="5.5" fill="#5A3220"/><ellipse cx="0" cy="9" rx="3.5" ry="5.5" fill="#5A3220"/>`;
    const hole = cab ? `<path d="M${-R * 0.2} ${R * 0.79} L0 ${R * 0.13} L${R * 0.2} ${R * 0.79} Z" fill="${mixColor(F.inner, "#9AA4AC", 0.25)}" ${st(2.4)}/>`
      : `<ellipse rx="${R * 0.3}" ry="${R * 0.4}" fill="${mixColor(F.inner, "#C9A26B", 0.25)}" ${st(2.4)}/>`;
    if (!cab && c1 > 0 && lift <= 0) food += g(`<path d="M${-R * 0.3} 0 C${-R * 0.3} ${-R * 0.56} ${R * 0.3} ${-R * 0.56} ${R * 0.3} 0" fill="none" stroke="${shade(F.inner)}" stroke-width="2.5" opacity="${c1}"/>`, cx, cy);
    if (lift > 0) food += g(hole, cx, cy) + g(coreShape, cx + lift * 120, cy - lift * 40, 1, lift * 30);
    let s = board() + cutOp(cutFade(t, D), food);
    // two cuts around the core
    if (cab) {
      if (c1 > 0 && c1 < 1) s += cutParing(lerp(cx, cx - R * 0.2, c1), lerp(cy + R * 0.13, cy + R * 0.79, c1), 107);
      if (c2 > 0 && c2 < 1) s += cutParing(lerp(cx, cx + R * 0.2, c2), lerp(cy + R * 0.13, cy + R * 0.79, c2), 73);
    } else {
      for (const [c, sd] of [[c1, -1], [c2, 1]]) if (c > 0 && c < 1) { const a = Math.PI * (1.5 + sd * (c - 0.5) * 0.9); s += cutParing(cx + sd * R * 0.3 * Math.abs(Math.cos((c - 0.5) * Math.PI)), cy + (c - 0.5) * R * 0.8, 90); }
    }
    return s;
  },
});
LIB.add({
  cat: "cut", name: "corer", foods: ["apple", "pear"],
  steps: ["Core the apples with an apple corer", "Core the whole apples", "Push the corer through and remove the core"],
  dur: 2.6,
  draw(t, F) {
    const D = 2.6, cx = 180, cy = 150, sc = 1.4;
    const push = phase(t, D, 0.3, 0.9), pull = phase(t, D, 1.15, 1.7);
    const ty = cy - 80 + push * 74 - pull * 120;
    let food = g(whole(F), cx, cy, sc);
    if (pull > 0) food += `<rect x="${cx - 10}" y="${cy - 52}" width="20" height="${Math.min(104, pull * 160)}" rx="6" fill="${shade(F.inner)}" ${st(2.4)}/>`;
    // corer: a ring tube with a T handle; the core rides up inside it
    const tool = `<rect x="-12" y="0" width="24" height="96" rx="5" fill="${C.steel}" opacity=".85" ${st(3)}/>` +
      (pull > 0 ? `<rect x="-9" y="10" width="18" height="76" rx="5" fill="#F4E8C4" ${st(2)}/><ellipse cx="0" cy="46" rx="3" ry="4.5" fill="#5A3220"/>` : "") +
      `<path d="M0 0 L0 -24" ${st(6)}/><rect x="-36" y="-34" width="72" height="14" rx="7" fill="${C.hot}" ${st(3)}/>${g(fist(), -18, -30, 0.9)}${g(fist(), 18, -30, 0.9)}`;
    return board() + cutOp(cutFade(t, D), food + g(tool, cx, ty, 1, push >= 1 && pull <= 0 ? Math.sin(t * 20) * 4 : 0));
  },
});
LIB.add({
  cat: "cut", name: "hull", foods: ["strawberry", "tomato"],
  steps: ["Hull the strawberries", "Core the tomatoes", "Remove the green tops from the strawberries"],
  dur: 2.4,
  draw(t, F, key) {
    const D = 2.4, cx = 180, cy = 146, sc = 1.7;
    const circ = phase(t, D, 0.25, 1.0), lift = phase(t, D, 1.1, 1.6);
    const topY = cy - 44 * sc;
    let food = g(whole(F), cx, cy, sc);
    if (circ >= 1) food += `<ellipse cx="${cx}" cy="${topY + 12}" rx="18" ry="9" fill="${lift > 0 ? shade(F.inner) : F.inner}" ${st(2.6)}/>`;
    if (lift > 0) food += g(`<path d="M-12 0 L0 28 L12 0 Z" fill="${key === "strawberry" ? "#FBE4E4" : "#F9D0C0"}" ${st(2.6)}/><path d="M-22 0 L0 -14 L22 0 L8 -4 L0 -12 L-8 -4 Z" fill="#3E8E41" ${st(2.6)}/>`, cx + lift * 90, topY + 8 - lift * 50, 1, lift * 40);
    let s = board() + cutOp(cutFade(t, D), food);
    if (circ > 0 && circ < 1) { const a = circ * Math.PI * 2; s += cutParing(cx + Math.cos(a) * 16, topY + 16 + Math.sin(a) * 6, 75 + Math.cos(a) * 15); }
    return s;
  },
});
LIB.add({
  cat: "cut", name: "florets", foods: ["broccoli", "cauliflower"],
  steps: ["Cut the broccoli into florets", "Cut the cauliflower into small florets", "Trim the florets from the stalk"],
  dur: 2.8,
  draw(t, F) {
    const D = 2.8, cx = 130, cy = 136, sc = 1.6;
    const offs = [[-30, -6, 20], [0, -20, 24], [30, -6, 20], [-14, 8, 18], [16, 8, 18]];
    const per = 0.42, start = 0.2;
    const n = clamp(Math.floor((t - start + per * 0.55) / per), 0, 5);
    let food = g(`<path d="M-10 6 L-14 44 L14 44 L10 6 Z" fill="${F.inner}" ${st()}/>`, cx, cy, sc);
    offs.forEach(([x, y, r], i) => {
      const q = i < n ? ease(clamp((t - (start + i * per + per * 0.45)) / 0.25)) : 0;
      const [px, py] = [[250, 96], [304, 104], [262, 156], [312, 160], [280, 204]][i];
      const fx = lerp(cx + x * sc, px, q), fy = lerp(cy + y * sc, py, q);
      food += g(`<path d="M-4 0 L-5 22 L5 22 L4 0 Z" fill="${F.inner}" ${st(2.6)}/><circle r="${r}" fill="${F.fill}" ${st(3.5)}/><circle cx="-6" cy="-5" r="4" fill="${F.inner}" opacity=".6"/>`, fx, fy, lerp(sc, 1.1, q));
    });
    let s = board() + cutOp(cutFade(t, D), food);
    if (t > start && t < start + 5 * per) { const i = Math.floor((t - start) / per); s += cutParing(cx + offs[i][0] * sc + 6, cy + offs[i][1] * sc + 26 + cutDown(((t - start) % per) / per) * 14, 110); }
    return s;
  },
});
LIB.add({
  cat: "cut", name: "skinpineapple", foods: ["pineapple"],
  steps: ["Cut the skin off the pineapple", "Slice off the top and bottom, then cut away the skin", "Peel and core the pineapple"],
  dur: 3,
  draw(t, F) {
    const D = 3, cx = 180, top = 64, bot = 206, w = 52;
    let food = `<path d="M${cx - w} ${top} L${cx + w} ${top} C${cx + w + 14} 130 ${cx + w + 14} 150 ${cx + w} ${bot} L${cx - w} ${bot} C${cx - w - 14} 150 ${cx - w - 14} 130 ${cx - w} ${top} Z" fill="${F.inner}" ${st()}/>` +
      [[-24, 100], [8, 92], [30, 120], [-34, 140], [-4, 150], [26, 170], [-18, 186]].map(([a, b]) => `<circle cx="${cx + a}" cy="${b}" r="3" fill="#8A6A2A"/>`).join("") + `<ellipse cx="${cx}" cy="${top}" rx="${w}" ry="10" fill="#FBEA9A" ${st(3)}/>`;
    const bands = [[-w - 8, -w / 2], [-w / 2, 0], [0, w / 2], [w / 2, w + 8]];
    bands.forEach(([a, b], i) => {
      const st0 = 0.3 + i * 0.6, q = phase(t, D, st0 + 0.4, st0 + 0.7);
      if (t < st0 + 0.4 || q < 1) {
        const band = cutClip(cutRect(cx + a, top, b - a, bot - top), `<path d="M${cx - w} ${top} L${cx + w} ${top} C${cx + w + 14} 130 ${cx + w + 14} 150 ${cx + w} ${bot} L${cx - w} ${bot} C${cx - w - 14} 150 ${cx - w - 14} 130 ${cx - w} ${top} Z" fill="${F.fill}" ${st()}/>` + [80, 110, 140, 170, 200].map(y => `<path d="M${cx - w - 10} ${y} L${cx + w + 10} ${y - 30} M${cx - w - 10} ${y - 30} L${cx + w + 10} ${y}" stroke="${shade(F.fill)}" stroke-width="2.5"/>`).join(""));
        food += g(band, (i < 2 ? -1 : 1) * q * 40, q * 20, 1);
      }
    });
    let s = board() + cutOp(cutFade(t, D), food);
    for (let i = 0; i < 4; i++) { const st0 = 0.3 + i * 0.6, p = phase(t, D, st0, st0 + 0.45); if (t > st0 && t < st0 + 0.5) s += knife(cx + (i < 2 ? bands[i][1] : bands[i][0]), lerp(top - 10, bot, p), 90, 110); }
    return s;
  },
});
LIB.add({
  cat: "cut", name: "rind", foods: ["watermelon", "cantaloupe"],
  steps: ["Cut the melon flesh away from the rind", "Remove the rind", "Slice off the rind and cube the melon"],
  dur: 2.8,
  draw(t, F, key) {
    const D = 2.8, cx = 180, cy = 104, R = 130;
    const p = phase(t, D, 0.3, 1.5), lift = phase(t, D, 1.6, 2.0);
    const rindC = key === "watermelon" ? "#3E8E41" : "#D9C48A", pale = key === "watermelon" ? "#F4F7DA" : "#C8E0A0";
    const wedge = (r, fill, extra = "") => `<path d="M${cx - r} ${cy} C${cx - r} ${cy + r * 0.82} ${cx + r} ${cy + r * 0.82} ${cx + r} ${cy} Z" fill="${fill}" ${extra}/>`;
    let rind = wedge(R, rindC, st()) + wedge(R - 12, pale);
    let flesh = wedge(R - 18, F.inner, st(3));
    if (key === "watermelon") flesh += [[-50, 30], [-10, 50], [30, 34], [60, 20], [0, 18]].map(([a, b]) => `<ellipse cx="${cx + a}" cy="${cy + b}" rx="3" ry="5" fill="#2A2A2A"/>`).join("");
    const a = Math.PI * (1 - p), tx = cx + Math.cos(a) * (R - 16), ty = cy + Math.sin(a) * (R - 16) * 0.62;
    const food = rind + g(flesh, lift * 0, -lift * 40, 1);
    let s = board() + cutOp(cutFade(t, D), food);
    if (t > 0.2 && t < 1.6) s += knife(tx, ty, (Math.atan2(Math.cos(a) * 0.62, -Math.sin(a)) * 180 / Math.PI) + 180, 100);
    return s;
  },
});
LIB.add({
  cat: "cut", name: "mangocheeks", foods: ["mango"],
  steps: ["Slice the cheeks off the mango", "Cut down either side of the pit", "Peel and dice the mango"],
  dur: 2.8,
  draw(t, F) {
    const D = 2.8, cx = 180, cy = 134, rx = 50, ry = 72;
    const c1 = phase(t, D, 0.25, 0.7), f1 = phase(t, D, 0.75, 1.1), c2 = phase(t, D, 1.15, 1.6), f2 = phase(t, D, 1.65, 2.0);
    const body = `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${F.fill}" ${st()}/><path d="M${cx - 30} ${cy - 40} C${cx - 10} ${cy - 56} ${cx + 20} ${cy - 50} ${cx + 30} ${cy - 30}" stroke="#E8613C" stroke-width="6" fill="none" opacity=".5" stroke-linecap="round"/>`;
    const xl = cx - 16, xr = cx + 16;
    let food = cutClip(cutRect(xl, 0, xr - xl, 250), body);
    if (f1 >= 1 || c1 >= 1) food += `<rect x="${xl - 1}" y="${cy - ry + 10}" width="4" height="${ry * 2 - 20}" fill="${F.inner}"/>`;
    // left cheek: falls over to show its face
    if (f1 <= 0) food += cutClip(cutRect(0, 0, xl, 250), body);
    else food += g(`<g transform="scale(${1 - f1 * 0.0} 1)"><ellipse rx="${34}" ry="${ry - 6}" fill="${F.inner}" ${st()}/><ellipse rx="26" ry="${ry - 16}" fill="${mixColor(F.inner, "#FFFFFF", 0.2)}"/></g>`, lerp(xl - 18, 72, f1), cy, 1, -f1 * 10);
    if (f2 <= 0) food += cutClip(cutRect(xr, 0, 360, 250), body);
    else food += g(`<ellipse rx="34" ry="${ry - 6}" fill="${F.inner}" ${st()}/><ellipse rx="26" ry="${ry - 16}" fill="${mixColor(F.inner, "#FFFFFF", 0.2)}"/>`, lerp(xr + 18, 290, f2), cy, 1, f2 * 10);
    let s = board() + cutOp(cutFade(t, D), food);
    if (t > 0.2 && t < 0.75) s += knife(xl, lerp(30, cy + ry, c1), 90, 110);
    if (t > 1.1 && t < 1.65) s += knife(xr, lerp(30, cy + ry, c2), 90, 110);
    return s;
  },
});

// ================= Pits, scooping, avocado work =================
LIB.add({
  cat: "cut", name: "pit", foods: ["avocado", "peach", "plum"],
  steps: ["Remove the pit", "Halve and pit the avocados", "Twist the halves apart and remove the pit", "Halve and pit the peaches"],
  dur: 2.8,
  draw(t, F, key) {
    const D = 2.8, cx = 176, cy = 136, R = 74;
    const avo = key === "avocado";
    const tap = phase(t, D, 0.3, 0.55), twist = phase(t, D, 0.75, 1.15), lift = phase(t, D, 1.25, 1.8);
    let food = g(cutFace(F, key, R, R * 0.86, { pit: false }), cx, cy);
    const pit = avo ? `<ellipse rx="${R * 0.34}" ry="${R * 0.33}" fill="${F.pit}" ${st(2.8)}/><path d="M-10 -12 q5 -6 14 -5" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" opacity=".7"/>`
      : `<ellipse rx="${R * 0.32}" ry="${R * 0.34}" fill="#8A4A2A" ${st(2.6)}/><path d="M-8 -12 q8 10 0 24 M8 -14 q-8 12 0 28" stroke="#5A2E1A" stroke-width="2" fill="none"/>`;
    const px = cx + lift * 90, py = cy - lift * 70;
    if (avo) {
      const ky = lerp(cy - 60, cy, tap);
      food += g(pit, px, py, 1, twist * -40);
      food += `<g transform="rotate(${twist * -40} ${px} ${py})">${knife(px - 40, tap < 1 ? ky : py, 180, 110)}</g>`;
    } else {
      food += g(pit, px, py, 1, lift * 20);
      if (twist > 0 && lift < 1) food += T.pinch(px, py - 18, 1.1, 0);
    }
    return board() + cutOp(cutFade(t, D), food);
  },
});
LIB.add({
  cat: "cut", name: "scoopout", foods: ["avocado", "kiwi"],
  steps: ["Scoop out the avocado flesh with a spoon", "Halve the kiwi and scoop out the flesh", "Scoop the avocado into a bowl"],
  dur: 2.8,
  draw(t, F, key) {
    const D = 2.8, cx = 130, cy = 130, R = 70;
    const under = phase(t, D, 0.3, 0.9), carry = phase(t, D, 0.95, 1.5);
    const skin = key === "avocado" ? "#2F5A22" : F.fill;
    let food = `<ellipse cx="${cx}" cy="${cy}" rx="${R}" ry="${R * 0.86}" fill="${skin}" ${st()}/><ellipse cx="${cx}" cy="${cy}" rx="${R - 7}" ry="${R * 0.86 - 7}" fill="${mixColor(F.inner, "#FFFFFF", 0.3)}"/>`;
    const flesh = `<g transform="scale(0.9)">${cutFace(F, key, R, R * 0.86, { pit: false })}</g>`;
    const fx = lerp(cx, 284, carry), fy = lerp(cy, 176, carry) - Math.sin(carry * Math.PI) * 40, fk = lerp(1, 0.5, carry);
    let s = board() + V.smallBowl(284, 196, 0.7);
    if (carry < 1) food += g(flesh, fx + (1 - carry) * under * 6, fy - under * 4, fk, under * -6);
    else food += `<ellipse cx="284" cy="190" rx="34" ry="10" fill="${F.inner}" ${st(2.6)}/>`;
    let spoon = "";
    if (t > 0.2 && carry < 1) spoon = cutSpoon(carry > 0 ? fx + 20 : lerp(cx + R - 6, cx + 20, under), carry > 0 ? fy + 18 : lerp(cy - 20, cy + 30, under), -20);
    return s + cutOp(cutFade(t, D), food) + spoon;
  },
});
LIB.add({
  cat: "cut", name: "scoreflesh", foods: ["avocado", "mango"],
  steps: ["Score the inside of the avocado with a blunt knife and scoop out the flesh", "Score the mango in a crosshatch and push it inside out", "Dice the avocado in the skin"],
  dur: 3,
  draw(t, F, key) {
    const D = 3, cx = 170, cy = 132, avo = key === "avocado";
    const rx = avo ? 70 : 56, ry = avo ? 60 : 78;
    const draw = phase(t, D, 0.25, 1.5), pop = phase(t, D, 1.65, 2.1);
    const lines = [-0.5, 0, 0.5].map(k => ["v", k]).concat([-0.5, 0, 0.5].map(k => ["h", k]));
    const done = draw * lines.length;
    let face = avo ? cutFace(F, key, rx, ry, { pit: false }) : `<ellipse rx="${rx}" ry="${ry}" fill="${F.fill}" ${st()}/><ellipse rx="${rx - 7}" ry="${ry - 7}" fill="${F.inner}"/>`;
    let cuts = "";
    lines.forEach(([d, k], i) => {
      const q = clamp(done - i); if (q <= 0) return;
      if (d === "v") cuts += `<path d="M${k * rx * 0.9} ${-ry * 0.8} L${k * rx * 0.9} ${-ry * 0.8 + q * ry * 1.6}" stroke="${shade(F.inner)}" stroke-width="3" stroke-linecap="round"/>`;
      else cuts += `<path d="M${-rx * 0.8} ${k * ry * 0.9} L${-rx * 0.8 + q * rx * 1.6} ${k * ry * 0.9}" stroke="${shade(F.inner)}" stroke-width="3" stroke-linecap="round"/>`;
    });
    let food;
    if (pop <= 0) food = g(face + cuts, cx, cy);
    else if (avo) {
      // the cubes come loose and drop into the bowl
      food = g(`<ellipse rx="${rx}" ry="${ry}" fill="#2F5A22" ${st()}/><ellipse rx="${rx - 7}" ry="${ry - 7}" fill="#D8E8A0"/>`, cx, cy);
      for (let i = 0; i < 9; i++) { const x = cx + ((i % 3) - 1) * 30, y = cy + (Math.floor(i / 3) - 1) * 26; food += `<rect x="${lerp(x, 270 + (i % 3) * 16, pop) - 11}" y="${lerp(y, 178 - Math.floor(i / 3) * 8, pop) - 10}" width="22" height="20" rx="4" fill="${F.inner}" ${st(2.4)}/>`; }
    } else {
      food = g(`<ellipse rx="${rx}" ry="${ry}" fill="${F.fill}" ${st()}/>`, cx, cy);
      for (let i = 0; i < 16; i++) { const x = cx + ((i % 4) - 1.5) * 26 * (1 + pop * 0.2), y = cy + (Math.floor(i / 4) - 1.5) * 34 * (1 + pop * 0.1) - pop * 10; food += `<rect x="${x - 12}" y="${y - 15}" width="24" height="30" rx="6" fill="${F.inner}" ${st(2.4)}/>`; }
    }
    let s = board() + (avo ? V.smallBowl(290, 196, 0.62) : "") + cutOp(cutFade(t, D), food);
    if (draw > 0 && draw < 1) {
      const i = Math.min(lines.length - 1, Math.floor(done)), [d, k] = lines[i], q = done - i;
      const x = d === "v" ? cx + k * rx * 0.9 : cx - rx * 0.8 + q * rx * 1.6, y = d === "v" ? cy - ry * 0.8 + q * ry * 1.6 : cy + k * ry * 0.9;
      s += cutParing(x, y, d === "v" ? 70 : 160);
    }
    return s;
  },
});
LIB.add({
  cat: "cut", name: "smash", foods: ["garlic", "ginger"],
  steps: ["Peel and smash the garlic", "Smashed garlic - Place side of knife on unpeeled garlic clove", "Smash the ginger with the flat of the knife", "Smash and peel the garlic"],
  dur: 2.6,
  draw(t, F, key) {
    const D = 2.6, cx = 180, cy = 150;
    const press = phase(t, D, 0.5, 0.75) * (1 - phase(t, D, 1.0, 1.25)), squashed = t > 0.7;
    const skinOff = phase(t, D, 1.2, 1.7);
    let food = "";
    if (key === "garlic") {
      const sq = squashed ? 0.6 : 1 - press * 0.3, wide = squashed ? 1.3 : 1 + press * 0.2;
      food += `<g transform="translate(${cx} ${cy + 10}) scale(${wide} ${sq}) translate(0 -10)"><path d="M-40 18 C-44 -10 -20 -34 6 -34 C34 -34 46 -6 40 18 Z" fill="${squashed ? "#FFF3C8" : "#F6EEDB"}" ${st()}/>
        ${squashed ? `<path d="M-20 4 l10 -8 M6 -6 l6 10 M20 2 l8 -6" ${st(2.4)}/>` : `<path d="M-20 -20 C-10 -8 -10 6 -16 16 M14 -24 C20 -10 18 6 12 16" stroke="#D6C9A8" stroke-width="2.5" fill="none"/>`}</g>`;
      if (squashed) food += g(`<path d="M-28 6 C-22 -16 10 -22 28 -8 C14 -2 -6 6 -28 6 Z" fill="#F6EEDB" ${st(3)}/>`, cx + 20 + skinOff * 90, cy - 14 - skinOff * 50, 1, skinOff * 120);
    } else {
      const sq = squashed ? 0.7 : 1 - press * 0.25;
      food += `<g transform="translate(${cx} ${cy + 20}) scale(${squashed ? 1.25 : 1} ${sq}) translate(0 -20)">${whole(F)}${squashed ? `<path d="M-30 -2 l12 6 M0 -10 l4 14 M24 -4 l10 8" ${st(2.4)}/><path d="M-36 8 L36 8" stroke="${F.inner}" stroke-width="6" opacity=".7"/>` : ""}</g>`;
    }
    let s = board() + cutOp(cutFade(t, D), food);
    // the flat of the blade, seen from above, with a glove pushing down
    if (t < 1.3) {
      const y = cy - 34 + press * 12 - (t < 0.5 ? (1 - phase(t, D, 0.1, 0.5)) * 40 : 0) - phase(t, D, 1.0, 1.3) * 50;
      s += `<g transform="translate(${cx} ${y})"><rect x="-130" y="-26" width="210" height="44" rx="10" fill="#E3E7EA" ${st(3.5)}/><rect x="80" y="-16" width="70" height="24" rx="8" fill="#3B2A1E" ${st(3.5)}/>
        <g transform="translate(-20 ${-34 + press * 8}) scale(1.5)">${fist()}</g>${press > 0.7 ? `<path d="M-100 34 L-114 46 M60 34 L74 46 M-20 38 L-20 54" ${st(3.5)} fill="none"/>` : ""}</g>`;
    }
    return s;
  },
});
LIB.add({
  cat: "cut", name: "garlicpress", foods: ["garlic"],
  steps: ["Crush the garlic in a garlic press", "Press the garlic", "Crush 2 cloves of garlic"],
  dur: 2.4,
  draw(t, F) {
    const D = 2.4, sq = phase(t, D, 0.4, 1.0) * (1 - phase(t, D, 1.7, 2.1));
    const hx = 96, hy = 92, ang = lerp(-26, -4, sq);
    let s = counter() + V.smallBowl(156, 200, 0.6);
    // the paste squeezing out under the hopper, landing in the bowl
    const ext = phase(t, D, 0.6, 1.3);
    let paste = "";
    for (let i = 0; i < 4; i++) paste += `<path d="M${136 + i * 8} 124 L${136 + i * 8} ${124 + ext * 24}" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M${136 + i * 8} 124 L${136 + i * 8} ${124 + ext * 24}" stroke="#FFF3C8" stroke-width="3.5" stroke-linecap="round"/>`;
    if (ext > 0.8) paste += cutOp(cutFade(t, D), `<ellipse cx="156" cy="194" rx="${10 + ext * 10}" ry="6" fill="#FFF3C8" ${st(2.4)}/>`);
    s += paste;
    // lower arm with the hopper
    s += `<path d="M${hx} ${hy + 6} L300 ${hy + 16}" ${st(10)}/><path d="M${hx} ${hy + 6} L300 ${hy + 16}" stroke="${C.steel}" stroke-width="5" stroke-linecap="round"/>
      <path d="M124 ${hy} L172 ${hy} L168 124 L128 124 Z" fill="${C.steel}" ${st(3.5)}/>${[134, 142, 150, 158].map(x => `<circle cx="${x}" cy="120" r="1.8" fill="${INK}"/>`).join("")}`;
    if (sq < 0.5) s += `<path d="M132 ${hy + 2} C130 ${hy - 20} 162 ${hy - 26} 164 ${hy + 2} Z" fill="#F6EEDB" ${st(3)}/>`;
    // upper arm with plunger, hinged at the left
    s += `<g transform="rotate(${ang} ${hx} ${hy})"><path d="M${hx} ${hy} L300 ${hy - 4}" ${st(10)}/><path d="M${hx} ${hy} L300 ${hy - 4}" stroke="${C.steel}" stroke-width="5" stroke-linecap="round"/><rect x="132" y="${hy}" width="32" height="16" rx="3" fill="${C.steelDark}" ${st(3)}/></g><circle cx="${hx}" cy="${hy + 2}" r="7" fill="${C.steelDark}" ${st(3)}/>`;
    s += g(fist(), 284, hy + 4 + lerp(-14, 6, sq), 1.3);
    return s;
  },
});

// ================= Meat and fish =================
// Side view of a thick cut (chicken breast, chop) as a lens.
const cutLens = (hw, h, fill, half = 0) => half < 0 ? `<path d="M${-hw} 0 C${-hw * 0.9} ${-h} ${hw * 0.9} ${-h} ${hw} 0 Z" fill="${fill}" ${st()}/>`
  : half > 0 ? `<path d="M${-hw} 0 C${-hw * 0.9} ${h} ${hw * 0.9} ${h} ${hw} 0 Z" fill="${fill}" ${st()}/>`
  : `<path d="M${-hw} 0 C${-hw * 0.9} ${-h} ${hw * 0.9} ${-h} ${hw} 0 C${hw * 0.9} ${h} ${-hw * 0.9} ${h} ${-hw} 0 Z" fill="${fill}" ${st()}/>`;
LIB.add({
  cat: "cut", name: "butterfly", foods: ["chicken", "pork", "porkchop"],
  steps: ["Butterfly the chicken breasts", "Slice horizontally almost all the way through and open like a book", "Butterfly the pork chops", "Butterfly the pork tenderloin"],
  dur: 3,
  draw(t, F) {
    const D = 3, cx = 236, cy = 164, hw = 76, h = 56;
    const cut = phase(t, D, 0.35, 1.35), open = phase(t, D, 1.5, 2.1);
    const hinge = cx - hw;
    let food = g(cutLens(hw, h, F.fill, 1), cx, cy);
    if (cut > 0) food += g(`<path d="M${-hw} 0 L${hw} 0" stroke="${F.inner}" stroke-width="4"/>`, cx, cy);
    const ang = -open * 180;
    const top = g(cutLens(hw, h, open > 0.5 ? F.inner : F.fill, -1), cx, cy);
    food += `<g transform="rotate(${ang} ${hinge} ${cy})">${top}</g>`;
    if (cut > 0 && open <= 0) food += cutClip(cutRect(cx - hw + 2 + (1 - cut) * 2 * hw, cy - 6, 2 * hw, 12), `<path d="M${hinge + 4} ${cy} L${cx + hw} ${cy}" stroke="${INK}" stroke-width="2.5"/>`);
    let s = board() + cutOp(cutFade(t, D), food);
    if (t > 0.25 && t < 1.45) s += knife(lerp(cx + hw + 10, hinge + 14, cut), cy, 180, 110) + (open <= 0 ? T.palm(cx - 20, cy - h * 0.62, 1.2, 90) : "");
    return s;
  },
});
LIB.add({
  cat: "cut", name: "cutlets", foods: ["chicken", "pork"],
  steps: ["Slice the chicken breasts in half horizontally to make thin cutlets", "Cut each breast into 2 thin cutlets", "Slice the pork loin into thin cutlets"],
  dur: 3,
  draw(t, F) {
    const D = 3, cx = 220, cy = 168, hw = 72, h = 56;
    const cut = phase(t, D, 0.35, 1.35), move = phase(t, D, 1.45, 2.05);
    let food = g(cutLens(hw, h, F.fill, 1), cx, cy);
    const tx = lerp(cx, 104, move), ty = cy - Math.sin(move * Math.PI) * 50;
    food += g(`<g transform="scale(1 ${move > 0.5 ? -1 : 1})">${cutLens(hw, h, move > 0.5 ? F.inner : F.fill, -1)}</g>`, tx, ty);
    if (move >= 1) food += g(`<path d="M${-hw + 6} -1 L${hw - 6} -1" stroke="${F.inner}" stroke-width="5"/>`, cx, cy);
    let s = board() + cutOp(cutFade(t, D), food);
    if (t > 0.25 && t < 1.45) s += knife(lerp(cx + hw + 10, cx - hw - 10, cut), cy, 180, 110);
    return s;
  },
});
// A raw shrimp from above, optional shell overlay.
function cutShrimp(F, shell = 1, vein = 0, slit = 0) {
  let s = whole(F);
  if (shell > 0) s += cutClip(cutRect(-60 + (1 - shell) * 110, -60, 120, 120), `<path d="M40 -10 C40 -40 -10 -46 -34 -24 C-50 -8 -44 22 -24 30 C-14 34 -6 26 -12 18 C-26 12 -26 -10 -10 -18 C6 -26 22 -18 24 -6 Z" fill="#E8DCD0" opacity=".85" ${st()}/>` +
    `<path d="M-30 -14 l12 8 M-36 4 l14 2 M-30 20 l12 -6 M-8 -30 l2 14 M12 -30 l-4 14" stroke="#B8A898" stroke-width="2.6" stroke-linecap="round"/>`);
  if (slit > 0) s += `<path d="M30 -24 C10 -44 -40 -36 -44 4" fill="none" stroke="${F.inner}" stroke-width="5" stroke-dasharray="${slit * 140} 200" stroke-linecap="round"/>`;
  if (vein > 0) s += `<path d="M30 -22 C10 -40 -36 -34 -40 2" fill="none" stroke="#4A4A4A" stroke-width="3.5" stroke-linecap="round" opacity="${vein}"/>`;
  return s;
}
LIB.add({
  cat: "cut", name: "peelshrimp", foods: ["shrimp"],
  steps: ["Peel the shrimp, leaving the tails on", "Peel and devein the shrimp", "Remove the shells"],
  dur: 2.6,
  draw(t, F) {
    const D = 2.6, cx = 170, cy = 136, p = phase(t, D, 0.3, 1.4);
    let food = g(cutShrimp(F, 1 - p, 0, 0), cx, cy, 2);
    for (let i = 0; i < 3; i++) { const q = clamp(p * 3 - i); if (q > 0) food += g(`<path d="M-14 -6 C-6 -14 8 -14 14 -6 L10 6 C4 2 -4 2 -10 6 Z" fill="#E8DCD0" ${st(2.6)}/>`, lerp(cx - 40 + i * 30, 290 - i * 12, q), lerp(cy - 30, 196 - i * 6, q), 1, q * 90 + i * 30); }
    if (p > 0 && p < 1) food += T.pinch(cx + 60 - p * 120, cy - 60 + Math.sin(p * Math.PI) * 10, 1.2, 0);
    return board() + cutOp(cutFade(t, D), food);
  },
});
LIB.add({
  cat: "cut", name: "devein", foods: ["shrimp"],
  steps: ["Devein the shrimp", "Run a knife along the back and pull out the vein", "Peel and devein the shrimp"],
  dur: 2.8,
  draw(t, F) {
    const D = 2.8, cx = 166, cy = 140, k = 2;
    const slit = phase(t, D, 0.3, 1.1), pull = phase(t, D, 1.3, 1.9);
    let food = g(cutShrimp(F, 0, pull > 0 ? 0 : slit, slit), cx, cy, k);
    if (pull > 0) food += g(`<path d="M30 -22 C10 -40 -36 -34 -40 2" fill="none" stroke="#4A4A4A" stroke-width="3.5" stroke-linecap="round"/>`, cx + pull * 40, cy - pull * 60, k * (1 - pull * 0.4), pull * 20);
    let s = board() + cutOp(cutFade(t, D), food);
    // knife tip follows the back curve
    if (slit > 0 && slit < 1) { const a = lerp(-0.4, -2.9, slit); s += cutParing(cx + (Math.cos(a) * 42 - 4) * k * 0.9, cy + (Math.sin(a) * 30 - 12) * k * 0.9 + 6, 70); }
    if (pull > 0 && pull < 1) s += T.pinch(cx + pull * 40 + 10, cy - pull * 60 - 40, 1.1, 0);
    return s;
  },
});
LIB.add({
  cat: "cut", name: "butterflyshrimp", foods: ["shrimp"],
  steps: ["Butterfly the shrimp", "Cut down the back of each shrimp and open it flat"],
  dur: 2.6,
  draw(t, F) {
    const D = 2.6, cx = 176, cy = 136, slit = phase(t, D, 0.3, 1.0), open = phase(t, D, 1.15, 1.6);
    let food = "";
    if (open < 1) food += cutOp(1 - open, g(cutShrimp(F, 0, 0, slit), cx, cy, 2));
    if (open > 0) food += cutOp(open, g(`<g transform="scale(${open} 1)">${[-1, 1].map(sd => `<path transform="scale(${sd} 1)" d="M0 -40 C30 -46 56 -24 50 4 C46 26 22 34 0 26 Z" fill="${F.fill}" ${st()}/><path transform="scale(${sd} 1)" d="M4 -30 C24 -32 40 -18 38 2" fill="none" stroke="${F.inner}" stroke-width="5"/>`).join("")}</g><path d="M-10 26 L-22 50 L0 40 L22 50 L10 26 Z" fill="${F.fill}" ${st(3)}/>`, cx, cy, 1.5));
    let s = board() + cutOp(cutFade(t, D), food);
    if (slit > 0 && slit < 1) { const a = lerp(-0.4, -2.9, slit); s += cutParing(cx + (Math.cos(a) * 42 - 4) * 1.8, cy + (Math.sin(a) * 30 - 12) * 1.8 + 6, 70); }
    return s;
  },
});
LIB.add({
  cat: "cut", name: "spatchcock", foods: ["wholechicken", "turkey"],
  steps: ["Spatchcock the chicken", "Cut out the backbone with kitchen shears and press flat", "Remove the backbone and flatten the turkey"],
  dur: 3.2,
  draw(t, F) {
    const D = 3.2, cx = 180, cy = 128;
    const c1 = phase(t, D, 0.3, 0.9), c2 = phase(t, D, 1.0, 1.6), lift = phase(t, D, 1.7, 2.1), press = phase(t, D, 2.2, 2.6);
    const wx = 1 + press * 0.28, wy = 1 - press * 0.1;
    let bird = `<path d="M-50 40 C-70 60 -84 80 -70 86 C-60 90 -48 70 -36 52 Z M50 40 C70 60 84 80 70 86 C60 90 48 70 36 52 Z" fill="${F.fill}" ${st(3.5)}/>
      <ellipse rx="72" ry="66" fill="${F.fill}" ${st()}/><path d="M-70 -20 C-96 -30 -100 4 -74 10 M70 -20 C96 -30 100 4 74 10" fill="${F.fill}" ${st(3.5)}/>`;
    bird += `<path d="M-46 -30 C-30 -40 -20 -20 -40 -6 M46 -30 C30 -40 20 -20 40 -6" fill="none" stroke="${shade(F.fill)}" stroke-width="2.4"/>`;
    // the backbone strip down the middle
    const bone = `<rect x="-14" y="-62" width="28" height="124" rx="12" fill="${mixColor(F.fill, "#C98A6A", 0.25)}" ${st(3)}/>${[-40, -16, 8, 32].map(y => `<path d="M-8 ${y} L8 ${y}" stroke="${shade(F.fill)}" stroke-width="2.4"/>`).join("")}`;
    let food = g(`<g transform="scale(${wx} ${wy})">${bird}${lift > 0 ? `<rect x="-12" y="-60" width="24" height="120" rx="10" fill="${F.inner}"/>` : ""}</g>`, cx, cy);
    if (lift < 1) food += g(bone, cx, cy - lift * 40);
    else food += "";
    for (const [c, sd] of [[c1, -1], [c2, 1]]) if (c > 0) food += `<path d="M${cx + sd * 15} ${cy - 62} L${cx + sd * 15} ${cy - 62 + c * 124}" stroke="${INK}" stroke-width="2.5" opacity="${1 - lift}"/>`;
    if (lift > 0 && lift < 1) food += g(bone, cx + lift * 130, cy - 40 + lift * 60, 0.8, lift * 60);
    let s = board() + cutOp(cutFade(t, D), food);
    for (const [c, sd, a] of [[c1, -1, 0.3], [c2, 1, 1.0]]) if (t > a && t < a + 0.6) s += cutShears(cx + sd * 15, cy - 62 + c * 124, 0.5 + 0.5 * Math.sin(t * 22), 0);
    if (press > 0) s += T.palm(cx, cy - 10 + Math.sin(press * Math.PI) * 6, 1.6) + g(T.palm(0, 0, 1.6), cx + 30, cy - 24 + Math.sin(press * Math.PI) * 6);
    return s;
  },
});
LIB.add({
  cat: "cut", name: "score", foods: ["steak", "chicken", "pork", "lamb", "beef"],
  steps: ["Score the meat in a crosshatch pattern", "First, cut slits across the meat every 1/2 inch without slicing all the way through", "Make deeper slits on the chicken's thick parts", "Score the lamb"],
  dur: 2.8,
  draw(t, F, key) {
    const D = 2.8, cx = 180, cy = 136, sc = 1.55, cross = key !== "chicken";
    const lines = [];
    for (let i = 0; i < 5; i++) lines.push([-36 + i * 18, 1]);
    if (cross) for (let i = 0; i < 5; i++) lines.push([-36 + i * 18, -1]);
    const prog = phase(t, D, 0.2, 2.2) * lines.length;
    let cuts = "";
    lines.forEach(([o, d], i) => {
      const q = clamp(prog - i); if (q <= 0) return;
      const x1 = o - 22, y1 = -26 * d, x2 = o + 22, y2 = 26 * d;
      cuts += `<path d="M${x1} ${y1} L${lerp(x1, x2, q)} ${lerp(y1, y2, q)}" stroke="${shade(F.fill)}" stroke-width="3.5" stroke-linecap="round"/><path d="M${x1} ${y1} L${lerp(x1, x2, q)} ${lerp(y1, y2, q)}" stroke="${F.inner}" stroke-width="1.4" stroke-linecap="round"/>`;
    });
    const slab = `<path d="M-62 -6 C-58 -34 20 -40 58 -22 C72 -8 60 28 20 32 C-24 36 -64 22 -62 -6 Z" fill="${F.fill}" ${st()}/>`;
    let s = board() + cutOp(cutFade(t, D), g(slab + cutClip(`<path d="M-62 -6 C-58 -34 20 -40 58 -22 C72 -8 60 28 20 32 C-24 36 -64 22 -62 -6 Z"/>`, cuts), cx, cy, sc));
    if (prog > 0 && prog < lines.length) {
      const i = Math.floor(prog), q = prog - i, [o, d] = lines[i];
      s += cutParing(cx + (o - 22 + q * 44) * sc, cy + (-26 * d + q * 52 * d) * sc, d > 0 ? 60 : 120);
    }
    return s;
  },
});
LIB.add({
  cat: "cut", name: "scorefish", foods: ["salmon", "fish"],
  steps: ["Score the skin of the fish", "Make 3 shallow cuts through the skin", "Score the salmon skin so it stays flat"],
  dur: 2.6,
  draw(t, F, key) {
    const D = 2.6, cx = 180, cy = 136, sc = 1.55;
    const skin = key === "salmon" ? "#8E9AA4" : "#C2C9CE";
    const body = `<path d="M-62 -6 C-58 -34 20 -40 58 -22 C72 -8 60 28 20 32 C-24 36 -64 22 -62 -6 Z" fill="${skin}" ${st()}/><path d="M-40 -16 C-10 -26 20 -24 44 -14" stroke="#fff" stroke-width="3" opacity=".5" fill="none" stroke-linecap="round"/>`;
    const prog = phase(t, D, 0.25, 1.9) * 4;
    let cuts = "";
    for (let i = 0; i < 4; i++) { const q = clamp(prog - i); if (q <= 0) continue; const o = -36 + i * 24; cuts += `<path d="M${o - 6} -24 L${o - 6 + q * 14} ${-24 + q * 48}" stroke="${F.fill}" stroke-width="${3 + q * 2}" stroke-linecap="round"/><path d="M${o - 6} -24 L${o - 6 + q * 14} ${-24 + q * 48}" stroke="${INK}" stroke-width="1.2" stroke-linecap="round" opacity=".6"/>`; }
    let s = board() + cutOp(cutFade(t, D), g(body + cuts, cx, cy, sc));
    if (prog > 0 && prog < 4) { const i = Math.floor(prog), q = prog - i, o = -36 + i * 24; s += cutParing(cx + (o - 6 + q * 14) * sc, cy + (-24 + q * 48) * sc, 75); }
    return s;
  },
});
LIB.add({
  cat: "cut", name: "scoredough", foods: ["breaddough"],
  steps: ["Score the top of the loaf with a sharp knife", "Slash the dough", "Make a few slashes across the top"],
  dur: 2.4,
  draw(t, F) {
    const D = 2.4, cx = 180, cy = 196;
    const sl = phase(t, D, 0.5, 0.85), opn = phase(t, D, 0.9, 1.5);
    let food = `<path d="M${cx - 110} ${cy} C${cx - 110} ${cy - 110} ${cx + 110} ${cy - 110} ${cx + 110} ${cy} Z" fill="${F.fill}" ${st()}/><path d="M${cx - 80} ${cy - 50} C${cx - 50} ${cy - 76} ${cx - 10} ${cy - 84} ${cx + 20} ${cy - 84}" stroke="#fff" stroke-width="4" opacity=".5" fill="none" stroke-linecap="round"/>`;
    // the slash, a curve over the top that opens up a little
    const a = [cx - 60, cy - 58], b = [cx + 64, cy - 74];
    if (sl > 0) food += `<path d="M${a[0]} ${a[1]} Q${cx} ${cy - 84 - opn * 6} ${lerp(a[0], b[0], sl)} ${lerp(a[1], b[1], sl)}" fill="none" stroke="${INK}" stroke-width="${3 + opn * 7}" stroke-linecap="round"/>` +
      (opn > 0 ? `<path d="M${a[0] + 6} ${a[1]} Q${cx} ${cy - 84 - opn * 6} ${b[0] - 6} ${b[1]}" fill="none" stroke="${F.inner}" stroke-width="${opn * 4}" stroke-linecap="round"/>` : "");
    let s = board() + cutOp(cutFade(t, D), food);
    if (t > 0.2 && t < 1.0) { const p = t < 0.5 ? 0 : sl; s += knife(lerp(a[0], b[0], p), lerp(a[1], b[1], p) - (t < 0.5 ? (1 - phase(t, D, 0.2, 0.5)) * 40 : 0), 160, 110); }
    return s;
  },
});
LIB.add({
  cat: "cut", name: "bitesize", foods: ["chicken", "beef", "pork", "steak", "lamb", "salmon", "fish", "tofu"],
  steps: ["Cut 1 1/2 pounds boneless skinless chicken into 1-inch bite-sized pieces", "Cut the boneless beef chuck into 1 1/2-inch pieces", "Slice the chicken into bite-sized pieces", "Cut the tofu into cubes"],
  dur: 2.8,
  draw(t, F, key) {
    const D = 2.8, cy = 104, x0 = 214, step = 26;
    const raw = F.type === "block" ? F.fill : F.fill;
    const src = (cx2) => cutClip(cutRect(0, 0, cx2, 250), `<rect x="56" y="${cy - 22}" width="170" height="44" rx="18" fill="${raw}" ${st()}/><path d="M76 ${cy - 8} C120 ${cy - 14} 160 ${cy - 4} 206 ${cy - 10}" stroke="${F.mark || F.inner}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/>`);
    const cube = (x, y, r) => F.type === "block" ? `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-11" y="-10" width="22" height="20" rx="4" fill="${F.fill}" ${st(2.6)}/></g>` : bit(F, "cube", x, y, r, 0);
    const r = cutRun(t, {
      n: 6, start: 0.15, per: 0.36, x0, step,
      src,
      piece: (i, q) => [0, 1].map(j => { const k = i * 2 + j; return cube(lerp(x0 - i * step + 12, 98 + (k % 6) * 30 + (Math.floor(k / 6) % 2) * 14, q), lerp(cy + (j ? 10 : -10), 166 + Math.floor(k / 6) * 26, q), (k * 37) % 30 - 15); }).join(""),
      knifeAt: (i, down) => cutChop(x0 - i * step, down, cy + 26),
    });
    return board() + cutOp(cutFade(t, D), r.food) + r.knf;
  },
});
// Cooked meat with grain lines, sliced across them.
const CUT_COOKED_IN = { steak: "#E07A72", beef: "#D9786A", chicken: "#FBF1E6", pork: "#F6E3D6", lamb: "#D98A80", turkey: "#FBF1E6" };
LIB.add({
  cat: "cut", name: "againstgrain", foods: ["steak", "beef", "chicken", "pork", "lamb"],
  steps: ["Slice the steak against the grain", "Let rest, then slice thinly across the grain", "Slice the chicken and serve", "Thinly slice the roast"],
  dur: 3,
  draw(t, F, key) {
    const D = 3, cy = 132, x0 = 216, step = 18;
    const crust = F.cooked || "#8A5A2B", inn = CUT_COOKED_IN[key] || F.inner;
    const slab = `<rect x="60" y="${cy - 40}" width="170" height="80" rx="30" fill="${crust}" ${st()}/>` + [-22, -8, 6, 20].map(y => `<path d="M76 ${cy + y} C120 ${cy + y - 4} 170 ${cy + y + 4} 214 ${cy + y}" stroke="${shade(crust)}" stroke-width="3" fill="none" stroke-linecap="round"/>`).join("");
    const slice = `<rect x="-9" y="-40" width="18" height="80" rx="8" fill="${crust}" ${st(2.8)}/><rect x="-5" y="-34" width="10" height="68" rx="4" fill="${inn}"/>`;
    const r = cutRun(t, {
      n: 7, start: 0.2, per: 0.34, x0, step,
      src: (cx2) => cutClip(cutRect(0, 0, cx2, 250), slab),
      piece: (i, q) => g(slice, lerp(x0 - i * step + 8, 324 - i * 13, q), lerp(cy, cy + 10, q), 1, lerp(0, -28, q)),
      knifeAt: (i, down) => cutChop(x0 - i * step, down, cy + 46),
    });
    return board() + cutOp(cutFade(t, D), r.food) + r.knf;
  },
});
// Roast bird, side view: golden body with a drumstick in front.
function cutRoastBird(F) {
  const c = mixColor(F.fill, F.cooked, 1);
  return `<path d="M-84 28 C-92 -34 50 -62 84 0 C96 26 70 40 40 40 L-60 40 C-76 40 -84 36 -84 28 Z" fill="${c}" ${st()}/>
    <path d="M-40 -24 C-10 -40 30 -38 56 -18" stroke="#F2C27A" stroke-width="5" fill="none" stroke-linecap="round" opacity=".8"/>
    <ellipse cx="-38" cy="16" rx="34" ry="20" fill="${c}" ${st(3.5)} transform="rotate(-24 -38 16)"/>
    <path d="M-62 4 L-84 -12" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M-62 4 L-84 -12" stroke="#FBF6EC" stroke-width="5" stroke-linecap="round"/>
    <circle cx="-88" cy="-18" r="5" fill="#FBF6EC" ${st(2.4)}/><circle cx="-92" cy="-10" r="5" fill="#FBF6EC" ${st(2.4)}/>`;
}
LIB.add({
  cat: "cut", name: "carve", foods: ["wholechicken", "turkey"],
  steps: ["Carve and serve", "Carve the turkey", "Slice the breast meat and cut off the legs"],
  dur: 3,
  draw(t, F, key) {
    const D = 3, cx = 140, cy = 140, sc = 1.45, per = 0.5, start = 0.3;
    const n = clamp(Math.floor((t - start + per * 0.55) / per), 0, 4);
    let food = g(cutRoastBird(F), cx, cy, sc);
    if (n > 0) food += g(`<path d="M${10 - n * 4} -34 C${-4 - n * 4} -20 ${-6 - n * 4} 0 ${4 - n * 4} 14" fill="none" stroke="${CUT_COOKED_IN.chicken}" stroke-width="${8 + n * 2}" stroke-linecap="round"/>`, cx, cy, sc);
    for (let i = 0; i < n; i++) {
      const q = ease(clamp((t - (start + i * per + per * 0.45)) / 0.3));
      food += g(`<path d="M-26 0 C-24 -16 24 -18 28 0 C24 10 -22 10 -26 0 Z" fill="${CUT_COOKED_IN.chicken}" ${st(3)}/><path d="M-24 -4 C-14 -14 14 -16 26 -4" fill="none" stroke="${mixColor(F.fill, F.cooked, 1)}" stroke-width="5"/>`, lerp(cx + 10, 286 - i * 6, q), lerp(cy - 20, 196 - i * 14, q), 1, lerp(-60, -6, q));
    }
    let s = board() + cutOp(cutFade(t, D), food);
    if (t > start && t < start + 4 * per) s += knife(cx + 6 - n * 6, lerp(60, cy + 10, cutDown(((t - start) % per) / per)), 100, 110);
    return s;
  },
});
LIB.add({
  cat: "cut", name: "portion", foods: ["chicken", "salmon", "fish", "pork"],
  steps: ["Cut each breast into 3 pieces", "Cut the salmon into 4 portions", "Cut the fish fillet into serving pieces", "Cut the tenderloin into medallions"],
  dur: 2.6,
  draw(t, F) {
    const D = 2.6, cx = 180, cy = 136, sc = 1.75;
    const c1 = phase(t, D, 0.35, 0.65), c2 = phase(t, D, 0.95, 1.25), sp = phase(t, D, 1.4, 1.8);
    const xa = 146, xb = 210, src = g(whole(F), cx, cy, sc);
    let food = cutClip(cutRect(0, 0, xa, 250), g(src, -sp * 22, 0)) + g(cutClip(cutRect(xa, 0, xb - xa, 250), src), 0, 0) + g(cutClip(cutRect(xb, 0, 360, 250), src), sp * 22, 0);
    food = g(cutClip(cutRect(0, 0, xa, 250), src), -sp * 22, 0) + cutClip(cutRect(xa, 0, xb - xa, 250), src) + g(cutClip(cutRect(xb, 0, 360, 250), src), sp * 22, 0);
    if (c1 >= 1 && sp <= 0) food += `<path d="M${xa} ${cy - 50} L${xa} ${cy + 50}" stroke="${F.inner}" stroke-width="3"/>`;
    if (c2 >= 1 && sp <= 0) food += `<path d="M${xb} ${cy - 50} L${xb} ${cy + 50}" stroke="${F.inner}" stroke-width="3"/>`;
    let s = board() + cutOp(cutFade(t, D), food);
    if (t > 0.2 && t < 0.85) s += cutChop(xa, cutDown(seg(t, 0.2, 0.85)), cy + 40);
    if (t > 0.8 && t < 1.45) s += cutChop(xb, cutDown(seg(t, 0.8, 1.45)), cy + 40);
    return s;
  },
});
LIB.add({
  cat: "cut", name: "skinfish", foods: ["salmon", "fish"],
  steps: ["Remove the skin from the salmon", "Skin the fish fillets", "Slide the knife between the skin and the flesh"],
  dur: 2.8,
  draw(t, F, key) {
    const D = 2.8, cy = 156, x1 = 70, x2 = 290;
    const p = phase(t, D, 0.35, 1.6), lift = phase(t, D, 1.7, 2.1);
    const skin = key === "salmon" ? "#8E9AA4" : "#C2C9CE";
    const tipX = lerp(x1 + 10, x2, p);
    let food = `<path d="M${x1 - 20} ${cy + 2} L${x2 + 4} ${cy + 2} L${x2 + 4} ${cy + 10} L${x1 - 20} ${cy + 10} Z" fill="${skin}" ${st(3)}/>`;
    const flesh = `<path d="M${x1} ${cy} C${x1 + 20} ${cy - 56} ${x2 - 40} ${cy - 60} ${x2} ${cy} Z" fill="${F.fill}" ${st()}/>` + [120, 170, 220].map(x => `<path d="M${x} ${cy - 40} C${x + 10} ${cy - 24} ${x + 6} ${cy - 10} ${x + 14} ${cy}" stroke="${F.mark}" stroke-width="3" fill="none"/>`).join("");
    food += g(flesh, 0, -lift * 30 - Math.min(p, 1) * 4);
    food += g(fist(), x1 - 26, cy + 4, 1.1);
    let s = board() + cutOp(cutFade(t, D), food);
    if (t > 0.25 && t < 1.7) s += knife(tipX, cy - 2, 176, 110);
    return s;
  },
});
LIB.add({
  cat: "cut", name: "jointwings", foods: ["wings"],
  steps: ["Cut the wings at the joints into drumettes and flats", "Separate the wings and discard the tips", "Cut through the joints"],
  dur: 2.8,
  draw(t, F) {
    const D = 2.8, cy = 136;
    const c1 = phase(t, D, 0.35, 0.65), c2 = phase(t, D, 1.0, 1.3), sp = phase(t, D, 1.45, 1.85);
    const drum = `<path d="M70 ${cy - 26} C40 ${cy - 26} 40 ${cy + 26} 70 ${cy + 22} L130 ${cy + 12} L130 ${cy - 14} Z" fill="${F.fill}" ${st()}/>`;
    const flat = `<path d="M130 ${cy - 16} L210 ${cy - 22} L214 ${cy + 16} L130 ${cy + 14} Z" fill="${F.fill}" ${st()}/><path d="M146 ${cy - 4} L200 ${cy - 6}" stroke="${F.inner}" stroke-width="3"/>`;
    const tip = `<path d="M212 ${cy - 20} L282 ${cy - 34} L290 ${cy - 24} L214 ${cy + 16} Z" fill="${F.fill}" ${st()}/>`;
    let food = g(drum, -sp * 26, 0) + flat + g(tip, sp * 26, sp * 20);
    let s = board() + cutOp(cutFade(t, D), food);
    if (t > 0.2 && t < 0.85) s += cutChop(130, cutDown(seg(t, 0.2, 0.85)), cy + 22);
    if (t > 0.85 && t < 1.5) s += cutChop(212, cutDown(seg(t, 0.85, 1.5)), cy + 22);
    return s;
  },
});
LIB.add({
  cat: "cut", name: "lardons", foods: ["bacon"],
  steps: ["Cut the bacon into small pieces", "Slice the bacon crosswise into 1/2-inch strips", "Chop the bacon"],
  dur: 2.8,
  draw(t, F) {
    const D = 2.8, x0 = 226, step = 20;
    const stack = [96, 120, 144].map(y => `<g transform="translate(150 ${y}) scale(1.1 0.9)">${whole(F)}</g>`).join("");
    const r = cutRun(t, {
      n: 6, start: 0.15, per: 0.36, x0, step,
      src: (cx2) => cutClip(cutRect(0, 0, cx2, 250), stack),
      piece: (i, q) => [0, 1, 2].map(j => { const k = i * 3 + j; return g(`<rect x="-8" y="-6" width="16" height="12" rx="3" fill="${F.fill}" ${st(2.4)}/><path d="M-6 0 L6 0" stroke="${F.inner}" stroke-width="3"/>`, lerp(x0 - i * step + 10, 252 + (k % 4) * 22, q), lerp(96 + j * 24, 200 - Math.floor(k / 4) * 18, q), 1, (k * 41) % 40 - 20); }).join(""),
      knifeAt: (i, down) => cutChop(x0 - i * step, down, 170),
    });
    return board() + cutOp(cutFade(t, D), r.food) + r.knf;
  },
});
LIB.add({
  cat: "cut", name: "casing", foods: ["sausage"],
  steps: ["Remove the sausage from its casings", "Slit the casings and squeeze out the meat", "Remove casings from the Italian sausage"],
  dur: 2.8,
  draw(t, F) {
    const D = 2.8, cx = 170, cy = 116, sc = 1.5;
    const slit = phase(t, D, 0.3, 1.0), out = phase(t, D, 1.1, 1.9);
    let food = "";
    if (out < 1) food += g(`<g transform="scale(1 ${1 - out * 0.75})">${whole(F)}</g>`, cx, cy, sc);
    if (out > 0) food += g(`<path d="M-74 0 C-40 -6 40 6 74 0 C40 10 -40 4 -74 0 Z" fill="#F4E8DC" opacity=".9" ${st(2.4)}/>`, cx, cy + 4, sc * (0.3 + 0.7 * out));
    if (slit > 0 && out <= 0) food += `<path d="M${cx - 66 * sc} ${cy - 8} L${cx - 66 * sc + slit * 132 * sc} ${cy - 8}" stroke="${F.inner}" stroke-width="5" stroke-linecap="round"/>`;
    if (out > 0) food += g(whole(FOODS.groundpork), 270, 190 - out * 6, 0.4 + 0.6 * out);
    let s = board() + cutOp(cutFade(t, D), food);
    if (slit > 0 && slit < 1) s += cutParing(cx - 66 * sc + slit * 132 * sc, cy - 6, 160);
    if (out > 0 && out < 1) s += T.pinch(cx + 60 - out * 20, cy - 30, 1.1, 0);
    return s;
  },
});

// ================= Cutting finished food into portions =================
// Top of a 9x13 pan of baked food.
function cutPanTop(F, key) {
  const top = { brownies: "#5A3020", lasagna: "#F7C94B", casserole: "#E8B23C", cake: "#F49AC1", cornbread: "#E8B23C" }[key] || F.fill;
  let s = `<rect x="62" y="62" width="236" height="140" rx="8" fill="${top}"/>`;
  if (key === "brownies") s += [[90, 90], [160, 120], [240, 84], [120, 170], [260, 160], [200, 180]].map(([x, y]) => `<path d="M${x} ${y} l14 4 l8 -6" stroke="#8A5230" stroke-width="3" fill="none"/>`).join("");
  if (key === "lasagna") s += [[90, 90], [170, 110], [250, 84], [120, 168], [230, 160], [280, 190], [180, 180]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#E8613C" opacity=".8"/><circle cx="${x + 18}" cy="${y + 6}" r="5" fill="#C98340" opacity=".6"/>`).join("");
  if (key === "casserole" || key === "cornbread") s += [[90, 90], [170, 110], [250, 84], [120, 168], [230, 160]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="#C98340" opacity=".5"/>`).join("");
  if (key === "cake") s += [[96, 96], [180, 130], [256, 100], [130, 176], [240, 170]].map(([x, y], i) => `<path d="M${x} ${y} l8 0" stroke="${pick(["#7FB4F0", "#F7C94B", "#8FD18A"], i)}" stroke-width="5" stroke-linecap="round"/>`).join("");
  return s;
}
LIB.add({
  cat: "cut", name: "squares", foods: ["brownies", "lasagna", "casserole", "cake", "cornbread"],
  steps: ["Cut the brownies into squares", "Let the lasagna rest, then cut into squares", "Cut into bars and serve", "Cut the cornbread into squares"],
  dur: 3.4,
  draw(t, F, key) {
    const D = 3.4, vx = [121, 180, 239], hy = [109, 155];
    const cuts = [...vx.map(x => ["v", x]), ...hy.map(y => ["h", y])];
    const prog = phase(t, D, 0.2, 2.3) * cuts.length, lift = phase(t, D, 2.4, 2.8);
    const top = cutPanTop(F, key);
    let lines = "";
    cuts.forEach(([d, v], i) => { const q = clamp(prog - i); if (q <= 0) return; lines += d === "v" ? `<path d="M${v} 62 L${v} ${62 + q * 140}" stroke="${INK}" stroke-width="2.6"/>` : `<path d="M62 ${v} L${62 + q * 236} ${v}" stroke="${INK}" stroke-width="2.6"/>`; });
    let food = V.dishTop(top + lines);
    if (lift > 0) {
      const sq = cutClip(cutRect(62, 62, 59, 47), top);
      food += `<rect x="62" y="62" width="59" height="47" fill="#F1EDE4"/>` + g(`<g>${sq}<rect x="62" y="62" width="59" height="47" fill="none" ${st(3)}/></g>`, lift * 30, -lift * 20) + spatula(92 + lift * 30, 100 - lift * 20, -20);
    }
    let s = cutOp(cutFade(t, D), food);
    if (prog > 0 && prog < cuts.length) {
      const i = Math.floor(prog), q = prog - i, [d, v] = cuts[i];
      s += d === "v" ? knife(v, 62 + q * 140, 90, 100) : knife(62 + q * 236, v, 0, 100).replace("", "");
    }
    return s;
  },
});
// A round finished food from above.
function cutRoundTop(F, key, r) {
  if (key === "pizza") return `<circle r="${r}" fill="${F.fill}" ${st()}/><circle r="${r - 12}" fill="${F.inner}"/><circle r="${r - 18}" fill="${F.top}" opacity=".9"/>` + [[-30, -26], [24, -32], [34, 16], [-22, 28], [0, 0], [-44, 4], [8, 44]].map(([x, y]) => `<circle cx="${x * r / 80}" cy="${y * r / 80}" r="${r / 9}" fill="#C8302A" ${st(2)}/>`).join("");
  if (key === "quesadilla") return `<circle r="${r}" fill="${F.fill}" ${st()}/>` + [-40, -10, 20, 50].map(x => `<path d="M${x * r / 80 - 20} ${-r * 0.6} l40 ${r * 1.2}" stroke="#C98340" stroke-width="5" opacity=".5"/>`).join("") + `<path d="M${-r} 6 q6 8 12 0 M${r - 12} -8 q6 8 12 0" stroke="${F.inner}" stroke-width="6" stroke-linecap="round" fill="none"/>`;
  if (F.type === "flat") return [8, 4, 0].map(d => `<circle cx="${d}" cy="${d}" r="${r}" fill="${F.fill}" ${st(3.5)}/>`).join("") + (F.spots ? [[-30, -20], [20, -30], [30, 20], [-20, 30], [0, 0]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="${shade(F.fill)}" opacity=".6"/>`).join("") : "");
  if (key === "cake") return `<circle r="${r}" fill="${F.icing}" ${st()}/><circle r="${r - 10}" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="4 10" stroke-linecap="round"/>`;
  if (key === "cheesecake") return `<circle r="${r}" fill="${F.fill}" ${st()}/><circle r="${r - 9}" fill="${F.inner}"/>`;
  if (key === "quiche") return `<circle r="${r}" fill="${F.fill}" ${st()}/><circle r="${r - 12}" fill="${F.inner}"/>` + [[-30, -20], [20, -34], [34, 16], [-20, 30], [6, 4]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#3E8E41"/><circle cx="${x + 10}" cy="${y + 8}" r="4" fill="#E8613C"/>`).join("");
  if (key === "frittata") return `<circle r="${r}" fill="${F.fill}" ${st()}/>` + [[-30, -20], [20, -34], [34, 16], [-20, 30], [6, 4], [-46, 10]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="6" fill="${i % 2 ? "#3E8E41" : "#E8613C"}" ${st(1.5)}/>`).join("");
  // pie: crust ring and lattice
  return `<circle r="${r}" fill="${F.fill}" ${st()}/><circle r="${r - 12}" fill="${F.inner}"/>` + [-40, -14, 12, 38].map(x => `<path d="M${x} ${-Math.sqrt(Math.max(0, (r - 12) ** 2 - x * x))} L${x} ${Math.sqrt(Math.max(0, (r - 12) ** 2 - x * x))} M${-Math.sqrt(Math.max(0, (r - 12) ** 2 - x * x))} ${x} L${Math.sqrt(Math.max(0, (r - 12) ** 2 - x * x))} ${x}" stroke="${F.fill}" stroke-width="8" stroke-linecap="round"/>`).join("");
}
const cutSector = (r, a1, a2) => `<path d="M0 0 L${Math.cos(a1) * r} ${Math.sin(a1) * r} A${r} ${r} 0 0 1 ${Math.cos(a2) * r} ${Math.sin(a2) * r} Z"/>`;
// mode: "slice" (knife, one wedge slides out), "wheel" (pizza wheel), "spread" (all wedges apart)
function cutRoundPortions(t, F, key, mode) {
  const D = 3.2, cx = 180, cy = 132, r = 88;
  const angles = [-90, -30, 30].map(a => a * Math.PI / 180);
  const prog = phase(t, D, 0.2, 1.9) * 3, out = phase(t, D, 2.0, 2.5);
  const top = cutRoundTop(F, key, r);
  let food = "";
  const lineSvg = (a, q) => `<path d="M${-Math.cos(a) * r} ${-Math.sin(a) * r} L${lerp(-Math.cos(a) * r, Math.cos(a) * r, q)} ${lerp(-Math.sin(a) * r, Math.sin(a) * r, q)}" stroke="${INK}" stroke-width="2.6"/>`;
  let lines = ""; angles.forEach((a, i) => { const q = clamp(prog - i); if (q > 0) lines += lineSvg(a, q); });
  if (out <= 0) food = g(top + lines, cx, cy);
  else if (mode === "spread") {
    for (let i = 0; i < 6; i++) { const a1 = (-90 + i * 60) * Math.PI / 180, a2 = a1 + Math.PI / 3, m = (a1 + a2) / 2; food += g(cutClip(cutSector(r, a1, a2), top) + `<path d="M0 0 L${Math.cos(a1) * r} ${Math.sin(a1) * r} A${r} ${r} 0 0 1 ${Math.cos(a2) * r} ${Math.sin(a2) * r} Z" fill="none" ${st(3)}/>`, cx + Math.cos(m) * out * 22, cy + Math.sin(m) * out * 18); }
  } else {
    const a1 = -30 * Math.PI / 180, a2 = 30 * Math.PI / 180;
    food = g(top + lines, cx, cy) + g(cutSector(r, a1, a2).replace("<path", `<path fill="#E8C49A" ${st(2)}`), cx, cy);
    food += g(cutClip(cutSector(r, a1, a2), top) + `<path d="M0 0 L${Math.cos(a1) * r} ${Math.sin(a1) * r} A${r} ${r} 0 0 1 ${Math.cos(a2) * r} ${Math.sin(a2) * r} Z" fill="none" ${st(3)}/>`, cx + out * 50, cy + out * 20);
  }
  let s = board() + cutOp(cutFade(t, D), food);
  if (prog > 0 && prog < 3) {
    const i = Math.floor(prog), q = prog - i, a = angles[i];
    const x = cx + lerp(-Math.cos(a) * r, Math.cos(a) * r, q), y = cy + lerp(-Math.sin(a) * r, Math.sin(a) * r, q);
    s += mode === "wheel" ? cutWheel(x, y, q * 720) : knife(x, y, a * 180 / Math.PI, 100);
  }
  return s;
}
LIB.add({
  cat: "cut", name: "slicewedge", foods: ["pie", "cake", "quiche", "cheesecake", "frittata"],
  steps: ["Cut the pie into 8 slices", "Slice the quiche into wedges", "Cut the frittata into wedges and serve", "Slice the cake"],
  dur: 3.2, draw(t, F, key) { return cutRoundPortions(t, F, key, "slice"); },
});
LIB.add({
  cat: "cut", name: "pizzawheel", foods: ["pizza", "quesadilla"],
  steps: ["For easiest serving, cut with a pizza wheel", "Cut the pizza into slices", "Cut the quesadilla into wedges"],
  dur: 3.2, draw(t, F, key) { return cutRoundPortions(t, F, key, "wheel"); },
});
LIB.add({
  cat: "cut", name: "triangles", foods: ["cornTortilla", "tortilla", "pita"],
  steps: ["Stack the tortillas and cut into 6 wedges", "Cut the pita into triangles", "Cut the tortillas into triangles for chips"],
  dur: 3.2, draw(t, F, key) { return cutRoundPortions(t, F, key, "spread"); },
});
// Side view of a loaf; slices fall over showing the crumb.
function cutLoafSide(F, key) {
  if (key === "meatloaf") return `<path d="M60 176 L60 128 C60 100 240 100 240 128 L240 176 Z" fill="${F.fill}" ${st()}/><path d="M66 120 C100 104 200 104 234 120" stroke="${F.top}" stroke-width="12" stroke-linecap="round" fill="none"/>`;
  return `<path d="M60 176 L60 130 C60 76 240 76 240 130 L240 176 Z" fill="${F.fill}" ${st()}/><path d="M100 100 l14 14 M140 92 l14 14 M180 94 l14 14" stroke="${shade(F.fill)}" stroke-width="4" stroke-linecap="round"/>`;
}
LIB.add({
  cat: "cut", name: "sliceloaf", foods: ["bread", "meatloaf", "bananabread"],
  steps: ["Slice the bread", "Let the meatloaf rest, then slice", "Cool, then slice the banana bread", "Cut the loaf into thick slices"],
  dur: 3,
  draw(t, F, key) {
    const D = 3, x0 = 222, step = 26;
    const face = key === "meatloaf" ? `<rect x="-11" y="-48" width="22" height="48" rx="5" fill="${F.inner}" ${st(3)}/><path d="M-11 -44 L11 -44" stroke="${F.top}" stroke-width="7"/>`
      : `<path d="M-12 0 L-12 -44 C-12 -60 12 -60 12 -44 L12 0 Z" fill="${F.inner}" stroke="${F.fill}" stroke-width="5"/><path d="M-12 0 L-12 -44 C-12 -60 12 -60 12 -44 L12 0 Z" fill="none" ${st(3)}/>`;
    // a fallen slice lying flat shows its whole face
    const flatSlice = key === "meatloaf" ? `<rect x="-26" y="-12" width="52" height="24" rx="5" fill="${F.inner}" ${st(3)}/><path d="M-26 -9 L26 -9" stroke="${F.top}" stroke-width="6"/>`
      : `<path d="M-30 12 L-30 -2 C-30 -22 30 -22 30 -2 L30 12 Z" fill="${F.inner}" stroke="${F.fill}" stroke-width="6"/><path d="M-30 12 L-30 -2 C-30 -22 30 -22 30 -2 L30 12 Z" fill="none" ${st(3)}/>`;
    const r = cutRun(t, {
      n: 4, start: 0.2, per: 0.5, x0, step,
      src: (cx2) => cutClip(cutRect(0, 0, cx2, 250), cutLoafSide(F, key)),
      piece: (i, q) => q < 0.5 ? g(face, x0 - i * step + 12 + q * 40, 176, 1, q * 2 * 80) : g(flatSlice, lerp(268, 290 - i * 6, (q - 0.5) * 2), 196 - i * 16, 1, 0),
      knifeAt: (i, down) => cutBreadKnife(x0 - i * step + Math.sin(down * 18) * 4, lerp(50, 176, down)),
    });
    return board() + cutOp(cutFade(t, D), r.food) + r.knf;
  },
});
LIB.add({
  cat: "cut", name: "halvesandwich", foods: ["sandwich", "grilledcheese"],
  steps: ["Cut the sandwich in half diagonally", "Slice the grilled cheese corner to corner", "Cut in half and serve"],
  dur: 2.8,
  draw(t, F, key) {
    const D = 2.8, cx = 180, cy = 132, h = 72;
    const cut = phase(t, D, 0.3, 1.1), part = phase(t, D, 1.25, 1.7);
    const toast = key === "grilledcheese" ? "#D99A5B" : F.fill;
    const top = `<rect x="${cx - h}" y="${cy - h}" width="${h * 2}" height="${h * 2}" rx="18" fill="${toast}" ${st()}/><rect x="${cx - h + 12}" y="${cy - h + 12}" width="${h * 2 - 24}" height="${h * 2 - 24}" rx="12" fill="${key === "grilledcheese" ? "#E8B46A" : F.inner}"/>` +
      (key === "grilledcheese" ? `<path d="M${cx - h} ${cy + 20} q8 14 18 2" stroke="#F7C94B" stroke-width="8" stroke-linecap="round" fill="none"/>` : `<path d="M${cx - h - 6} ${cy + 10} q10 10 20 0 q10 10 20 0" stroke="#6DB04A" stroke-width="6" fill="none" stroke-linecap="round"/>`);
    const fill = key === "grilledcheese" ? ["#F7C94B"] : ["#6DB04A", "#E8503C", "#F4C9C0"];
    const edge = (sd) => fill.map((c, i) => `<path d="M${cx - h + 10} ${cy + h - 10} L${cx + h - 10} ${cy - h + 10}" stroke="${c}" stroke-width="5" transform="translate(${sd * (3 + i * 4)} ${sd * (3 + i * 4)})" stroke-linecap="round"/>`).join("");
    const triA = cutPoly([[0, 0], [360, 0], [0, 360]].map(([x, y]) => [x + cx - 180, y + cy - 180])), triB = cutPoly([[360, 0], [360, 360], [0, 360]].map(([x, y]) => [x + cx - 180, y + cy - 180]));
    let food = g(cutClip(triA, top) + (part > 0 ? edge(-1) : ""), -part * 24, -part * 24) + g(cutClip(triB, top) + (part > 0 ? edge(1) : ""), part * 24, part * 24);
    if (cut > 0 && part <= 0) food += `<path d="M${cx + h} ${cy - h} L${lerp(cx + h, cx - h, cut)} ${lerp(cy - h, cy + h, cut)}" stroke="${INK}" stroke-width="2.6"/>`;
    let s = board() + cutOp(cutFade(t, D), food);
    if (t > 0.2 && t < 1.2) s += knife(lerp(cx + h + 6, cx - h, cut), lerp(cy - h - 6, cy + h, cut), 135, 110);
    return s;
  },
});
LIB.add({
  cat: "cut", name: "crumble", foods: ["feta", "goatcheese", "bluecheese", "bacon", "cookies", "tofu"],
  steps: ["Crumble the feta", "Crumble the cooked bacon", "Crumble the goat cheese over the top", "Crumble the cookies"],
  dur: 2.6,
  draw(t, F, key) {
    const D = 2.6, hx = 180, hy = 80;
    const col = { feta: "#FBF8EE", goatcheese: "#FFFFFF", bluecheese: "#F4F0E2", bacon: "#8A3A22", cookies: "#D9A55B", tofu: "#F4EFDF" }[key];
    const rub = Math.sin(t * 16) * 4, left = 1 - phase(t, D, 0.2, 2.1) * 0.6;
    let held;
    if (key === "bacon") held = g(whole(F, 1), 0, 0, 0.45 * left + 0.15);
    else if (key === "cookies") held = `<circle r="${30 * left}" fill="${F.fill}" ${st(3.5)}/><circle cx="-8" cy="-6" r="4" fill="${F.chips}"/><circle cx="8" cy="6" r="4" fill="${F.chips}"/>`;
    else if (key === "goatcheese") held = `<rect x="${-34 * left}" y="-16" width="${68 * left}" height="32" rx="14" fill="#FFFFFF" ${st(3.5)}/>`;
    else held = `<rect x="${-28 * left}" y="${-22 * left}" width="${56 * left}" height="${44 * left}" rx="5" fill="${col}" ${st(3.5)}/>` + (key === "bluecheese" ? `<path d="M-10 -6 l8 4 l6 -6 M4 8 l8 -4" stroke="#7F9AB8" stroke-width="3" fill="none"/>` : "");
    let s = board();
    const crumb = (x, y, i) => cutCrumb(x, y, col, 1.2, i * 50) + (key === "bluecheese" && i % 3 === 0 ? `<circle cx="${x}" cy="${y}" r="2" fill="#7F9AB8"/>` : "") + (key === "cookies" && i % 4 === 0 ? `<circle cx="${x + 2}" cy="${y}" r="2.4" fill="${F.chips}"/>` : "");
    // heap on the board grows; bits fall from the fingers
    const n = Math.floor(4 + phase(t, D, 0.2, 2.1) * 22);
    let food = "";
    for (let i = 0; i < n; i++) { const a = i * 2.4, rr = Math.sqrt(i) * 9; food += crumb(180 + Math.cos(a) * rr * 1.8, 192 + Math.sin(a) * rr * 0.5, i); }
    food += FX.fall(t, 0.8, 5, hx, 40, hy + 24, 186, (x, y, i) => crumb(x, y, i));
    food += g(held, hx + rub, hy, 1, rub * 2) + g(fist(), hx + 30 + rub, hy - 12, 1.1) + T.pinch(hx - 30 - rub, hy - 4, 1, -20);
    return s + cutOp(cutFade(t, D), food);
  },
});
LIB.add({
  cat: "cut", name: "corncob", foods: ["corn"],
  steps: ["Cut the kernels off the cob", "Stand the corn upright and slice down to remove the kernels", "Cut the corn off the cob"],
  dur: 2.8,
  draw(t, F) {
    const D = 2.8, cx = 160, top = 54, bot = 204, w = 26;
    const p = phase(t, D, 0.3, 1.6), ky = lerp(top + 4, bot, p);
    let cob = `<rect x="${cx - w}" y="${top}" width="${w * 2}" height="${bot - top}" rx="${w}" fill="${F.fill}" ${st()}/>`;
    for (let y = top + 14; y < bot - 6; y += 12) for (const x of [-14, 0, 14]) cob += `<rect x="${cx + x - 5}" y="${y - 4}" width="10" height="9" rx="3" fill="${F.inner}" stroke="#E8B23C" stroke-width="1.6"/>`;
    // the right side, above the knife, is bare cob
    cob += cutClip(cutRect(cx + 2, 0, 60, ky), `<rect x="${cx - w}" y="${top}" width="${w * 2}" height="${bot - top}" rx="${w}" fill="#F1E3B0" ${st()}/>` + [...Array(12)].map((_, i) => `<path d="M${cx + 6} ${top + 12 + i * 12} l14 0" stroke="#D9C48A" stroke-width="2"/>`).join(""));
    let food = cob;
    const n = Math.floor(p * 24);
    for (let i = 0; i < n; i++) { const x = 220 + (i * 23) % 100, y = 204 - Math.floor(i / 5) * 8 - (i % 3) * 3; food += `<rect x="${x - 5}" y="${y - 4}" width="10" height="9" rx="3" fill="${F.inner}" ${st(1.6)}/>`; }
    if (p > 0 && p < 1) food += FX.fall(t, 0.5, 3, cx + w + 16, 20, ky - 10, ky + 30, (x, y) => `<rect x="${x - 5}" y="${y - 4}" width="10" height="9" rx="3" fill="${F.inner}" ${st(1.6)}/>`);
    food += g(fist(), cx, top - 8, 1.2);
    let s = board() + cutOp(cutFade(t, D), food);
    if (t > 0.2 && t < 1.7) s += knife(cx + w + 2, ky, 92, 110);
    return s;
  },
});
// Husking corn: the hand pulls the green husk back off the cob; the silk comes with it.
LIB.add({
  cat: "cut", name: "huskcorn", foods: ["corn"],
  steps: ["Husk the corn", "Shuck the corn and pull off the silk", "Peel back the husks and remove the silk", "Remove the husks and silk from the ears of corn"],
  dur: 3,
  draw(t, F) {
    const D = 3, cx = 184, cy = 128, L = 92, w = 25, HUSK = "#7BB04A", VEIN = "#5E9A3A", SILK = "#D9B46A";
    const p = phase(t, D, 0.35, 1.85), drop = phase(t, D, 1.95, 2.35);
    // the bare cob
    let cob = `<rect x="${cx - L}" y="${cy - w}" width="${L * 2}" height="${w * 2}" rx="${w}" fill="${F.fill}" ${st()}/>`;
    for (let x = cx - L + 16; x < cx + L - 8; x += 13) for (const y of [-13, 0, 13]) cob += `<rect x="${x - 5}" y="${cy + y - 4.5}" width="10" height="9" rx="3" fill="${F.inner}" stroke="#E8B23C" stroke-width="1.6"/>`;
    const stem = `<rect x="${cx + L - 4}" y="${cy - 10}" width="30" height="20" rx="6" fill="#C9B27A" ${st(3)}/>`;
    // the husk still on: everything right of the pull line
    const bx = lerp(cx - L - 26, cx + L + 4, p);
    const husk = `<path d="M${cx - L - 24} ${cy} C${cx - L} ${cy - w - 16} ${cx + L - 10} ${cy - w - 12} ${cx + L + 4} ${cy - 12} L${cx + L + 4} ${cy + 12} C${cx + L - 10} ${cy + w + 12} ${cx - L} ${cy + w + 16} ${cx - L - 24} ${cy} Z" fill="${HUSK}" ${st()}/>`
      + `<path d="M${cx - L - 10} ${cy - 4} C${cx - 30} ${cy - 22} ${cx + 30} ${cy - 20} ${cx + L} ${cy - 8} M${cx - L - 10} ${cy + 4} C${cx - 30} ${cy + 22} ${cx + 30} ${cy + 20} ${cx + L} ${cy + 8}" fill="none" stroke="${VEIN}" stroke-width="3" stroke-linecap="round"/>`
      + `<path d="M${cx - L - 24} ${cy} l-16 -8 M${cx - L - 24} ${cy} l-18 2 M${cx - L - 24} ${cy} l-14 10" stroke="${SILK}" stroke-width="2.6" stroke-linecap="round"/>`;
    let food = stem + cob;
    if (p < 1) food += cutClip(cutRect(bx, 0, 360 - bx, 250), husk);
    // the peeled husk and silk, held by the hand, then dropped on the counter
    const hx = Math.max(52, bx - 58), hy = cy + 26 + p * 18;
    const leaves = (x0, y0, x1, y1) => `<path d="M${x0} ${y0 - w} C${x0 - 26} ${y0 - w - 22} ${x1 + 10} ${y1 - 30} ${x1} ${y1} C${x1 + 20} ${y1 - 8} ${x0 - 12} ${y0 - 6} ${x0} ${y0 - w + 12} Z" fill="${HUSK}" ${st(3)}/>`
      + `<path d="M${x0} ${y0 + w} C${x0 - 20} ${y0 + w + 14} ${x1 + 14} ${y1 + 10} ${x1} ${y1} C${x1 + 16} ${y1 - 2} ${x0 - 10} ${y0 + 10} ${x0} ${y0 + w - 12} Z" fill="${VEIN}" ${st(3)}/>`
      + [-6, 0, 6].map((d) => `<path d="M${x0 - 4} ${y0 + d} C${(x0 + x1) / 2} ${y0 + d + 10} ${(x0 + x1) / 2} ${y1 - 6} ${x1 + 4} ${y1 + d * 0.5}" fill="none" stroke="${SILK}" stroke-width="2" stroke-linecap="round"/>`).join("");
    if (p > 0 && drop < 1) {
      const fall = drop * 60;
      food += g(leaves(bx, cy, hx, hy), 0, fall, 1);
      if (drop <= 0) food += g(fist(), hx - 6, hy + 4, 1.05, 20);
    } else if (drop >= 1) food += g(leaves(cx + L + 4, cy, cx + L - 54, cy + 44), 0, 60, 1);
    return board() + cutOp(cutFade(t, D), food);
  },
});
LIB.add({
  cat: "cut", name: "segment", foods: ["orange", "grapefruit"],
  steps: ["Segment the oranges", "Cut between the membranes to release the segments", "Peel and segment the grapefruit"],
  dur: 3,
  draw(t, F, key) {
    const D = 3, cx = 150, cy = 132, r = 80;
    const c1 = phase(t, D, 0.3, 0.8), c2 = phase(t, D, 0.95, 1.45), lift = phase(t, D, 1.55, 2.1);
    const a1 = -90 * Math.PI / 180, a2 = -45 * Math.PI / 180;
    let flesh = `<circle r="${r}" fill="${F.inner}" ${st()}/>`;
    for (let i = 0; i < 8; i++) { const a = -Math.PI / 2 + i * Math.PI / 4; flesh += `<path d="M0 0 L${Math.cos(a) * r} ${Math.sin(a) * r}" stroke="#FFFBEA" stroke-width="3"/>`; }
    flesh += `<circle r="8" fill="#FFFBEA"/>`;
    const seg1 = cutClip(cutSector(r, a1, a2), flesh) + `<path d="M0 0 L${Math.cos(a1) * r} ${Math.sin(a1) * r} A${r} ${r} 0 0 1 ${Math.cos(a2) * r} ${Math.sin(a2) * r} Z" fill="none" ${st(3)}/>`;
    let food = g(flesh, cx, cy);
    if (lift > 0) food += g(`<path d="M0 0 L${Math.cos(a1) * r} ${Math.sin(a1) * r} A${r} ${r} 0 0 1 ${Math.cos(a2) * r} ${Math.sin(a2) * r} Z" fill="#FFF3D0" ${st(2)}/>`, cx, cy) + g(seg1, lerp(cx, 280, lift), lerp(cy, 210, lift) - Math.sin(lift * Math.PI) * 60, lerp(1, 0.6, lift), lift * 30);
    let s = board() + V.smallBowl(290, 200, 0.7) + cutOp(cutFade(t, D), food);
    for (const [c, a] of [[c1, a1], [c2, a2]]) if (c > 0 && c < 1) s += cutParing(cx + Math.cos(a) * r * (1 - c), cy + Math.sin(a) * r * (1 - c), a * 180 / Math.PI + 180);
    return s;
  },
});
// Small round things cut in half one by one.
function cutSmallBall(F, key) {
  switch (key) {
    case "cherrytomato": return `<circle r="15" fill="${F.fill}" ${st(3)}/><path d="M-6 -14 L0 -18 L6 -14" stroke="#3E8E41" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    case "grapes": return `<ellipse rx="13" ry="16" fill="${F.fill}" ${st(3)}/><path d="M-5 -8 q3 -3 6 -2" stroke="#fff" stroke-width="2.5" fill="none" opacity=".6"/>`;
    case "olives": return `<ellipse rx="12" ry="15" fill="#4A3A4A" ${st(3)}/><circle cx="0" cy="-15" r="3" fill="${shade("#4A3A4A")}"/>`;
    case "brusselsprouts": return `<circle r="15" fill="${F.fill}" ${st(3)}/><path d="M-10 -6 C-4 -14 4 -14 10 -6 M-12 4 C-4 -2 4 -2 12 4" stroke="#4E9A3A" stroke-width="2.4" fill="none"/>`;
    case "strawberry": return `<path d="M0 18 C-18 6 -18 -14 -10 -16 L10 -16 C18 -14 18 6 0 18 Z" fill="${F.fill}" ${st(3)}/><path d="M-12 -16 L0 -24 L12 -16 Z" fill="#3E8E41" ${st(2)}/>`;
    case "radish": return `<circle r="15" fill="${F.fill}" ${st(3)}/><path d="M0 15 L0 22" ${st(2.4)}/><path d="M0 -15 L-6 -24 M0 -15 L6 -24" stroke="#3E8E41" stroke-width="4" stroke-linecap="round"/>`;
    case "mushroom": return `<path d="M-6 0 L-5 14 L5 14 L6 0 Z" fill="${F.inner}" ${st(2.6)}/><path d="M-18 2 C-18 -20 18 -20 18 2 Z" fill="${F.fill}" ${st(3)}/>`;
  }
  return `<circle r="15" fill="${F.fill}" ${st(3)}/>`;
}
function cutSmallFace(F, key) {
  switch (key) {
    case "cherrytomato": return `<circle r="15" fill="#F07A62" ${st(3)}/><circle r="13" fill="none" stroke="${F.fill}" stroke-width="3"/><ellipse cx="-5" cy="1" rx="4" ry="5" fill="#F9B8A0"/><ellipse cx="5" cy="1" rx="4" ry="5" fill="#F9B8A0"/><circle cx="-5" cy="1" r="1.5" fill="#F7D27A"/><circle cx="5" cy="1" r="1.5" fill="#F7D27A"/>`;
    case "grapes": return `<ellipse rx="13" ry="16" fill="#DDEFB0" ${st(3)}/><ellipse rx="11" ry="14" fill="none" stroke="${F.fill}" stroke-width="2.5"/>`;
    case "olives": return `<ellipse rx="12" ry="15" fill="#7A6A6A" ${st(3)}/><ellipse rx="10" ry="13" fill="none" stroke="#4A3A4A" stroke-width="3"/><ellipse rx="4" ry="6" fill="#3A2A3A"/>`;
    case "brusselsprouts": return `<circle r="15" fill="#E9F2C7" ${st(3)}/><circle r="13" fill="none" stroke="${F.fill}" stroke-width="3"/><path d="M-8 6 C-8 -4 8 -4 8 6 M-4 8 C-4 2 4 2 4 8" stroke="#9BCB6A" stroke-width="2" fill="none"/><path d="M-3 15 L0 4 L3 15 Z" fill="#F6F9E4"/>`;
    case "strawberry": return `<path d="M0 18 C-18 6 -18 -14 -10 -16 L10 -16 C18 -14 18 6 0 18 Z" fill="${F.inner}" ${st(3)}/><path d="M0 10 C-6 4 -6 -8 0 -10 C6 -8 6 4 0 10 Z" fill="#FBE4E4"/>`;
    case "radish": return `<circle r="15" fill="#FFFFFF" ${st(3)}/><circle r="13" fill="none" stroke="${F.fill}" stroke-width="3"/>`;
    case "mushroom": return `<path d="M-6 0 L-5 14 L5 14 L6 0 Z" fill="${F.inner}" ${st(2.6)}/><path d="M-18 2 C-18 -20 18 -20 18 2 Z" fill="${F.inner}" ${st(3)}/><path d="M-16 1 C-16 -17 16 -17 16 1" fill="none" stroke="${F.fill}" stroke-width="3"/>`;
  }
  return `<circle r="15" fill="${F.inner}" ${st(3)}/>`;
}
LIB.add({
  cat: "cut", name: "halvesmall", foods: ["cherrytomato", "grapes", "olives", "brusselsprouts", "strawberry", "radish", "mushroom"],
  steps: ["Halve the cherry tomatoes", "Cut the grapes in half", "Trim and halve the Brussels sprouts", "Halve the strawberries"],
  dur: 3,
  draw(t, F, key) {
    const D = 3, xs = [64, 122, 180, 238, 296], cy = 132, k = 1.35, per = 0.42, start = 0.2;
    let food = "";
    xs.forEach((x, i) => {
      const tc = start + i * per + per * 0.45, q = ease(clamp((t - tc) / 0.25));
      if (t < tc) food += g(cutSmallBall(F, key), x, cy, k);
      else for (const sd of [-1, 1]) food += g(`<g transform="scale(${0.4 + 0.6 * q} 1)">${cutSmallFace(F, key)}</g>`, x + sd * q * 13, cy + 4 + (sd > 0 ? q * 10 : 0), k * 0.85, sd * q * 8);
    });
    let s = board() + cutOp(cutFade(t, D), food);
    if (t > start && t < start + 5 * per) { const i = Math.floor((t - start) / per); s += cutChop(xs[i], cutDown(((t - start) % per) / per), cy + 26); }
    return s;
  },
});
LIB.add({
  cat: "cut", name: "splitbun", foods: ["bun", "bagel"],
  steps: ["Split the buns in half", "Slice the bagels in half", "Split the rolls and toast"],
  dur: 2.8,
  draw(t, F, key) {
    const D = 2.8, cx = 170, cy = 150, cut = phase(t, D, 0.35, 1.35), lift = phase(t, D, 1.45, 1.95);
    const bagel = key === "bagel";
    const topH = bagel ? `<path d="M-80 0 C-80 -34 80 -34 80 0 Z" fill="${F.fill}" ${st()}/>` : `<path d="M-80 0 C-80 -64 80 -64 80 0 Z" fill="${F.fill}" ${st()}/>${[[-30, -34], [0, -42], [30, -34]].map(([a, b]) => `<ellipse cx="${a}" cy="${b}" rx="4" ry="2.4" fill="#FBF4DC" ${st(1.2)}/>`).join("")}`;
    const botH = `<path d="M-80 0 L80 0 C80 ${bagel ? 30 : 26} -80 ${bagel ? 30 : 26} -80 0 Z" fill="${F.fill}" ${st()}/>`;
    const face = `<ellipse rx="76" ry="${10 + lift * 10}" fill="${F.inner}" ${st(2.6)}/>` + (bagel ? `<ellipse rx="16" ry="${3 + lift * 4}" fill="#E8C49A" ${st(2)}/>` : "");
    let food = g(botH, cx, cy) + (lift > 0 ? g(face, cx, cy) : "") + g(topH + (lift > 0.3 ? `<g transform="scale(1 -1)">${`<ellipse rx="76" ry="8" fill="${F.inner}" ${st(2.4)}/>`}</g>` : ""), cx + lift * 10, cy - 4 - lift * 60, 1, -lift * 12);
    if (cut > 0 && lift <= 0) food += `<path d="M${cx + 80} ${cy - 2} L${cx + 80 - cut * 160} ${cy - 2}" stroke="${F.inner}" stroke-width="4"/>`;
    let s = board() + cutOp(cutFade(t, D), food);
    if (t > 0.25 && t < 1.45) s += knife(lerp(cx + 96, cx - 70, cut) + Math.sin(t * 20) * 6, cy - 2, 180, 110) + (lift <= 0 ? T.palm(cx - 30, cy - (bagel ? 34 : 54), 1.2, 90) : "");
    return s;
  },
});
LIB.add({
  cat: "cut", name: "cubes", foods: ["bread", "butter", "cheese", "tofu"],
  steps: ["Cube the bread for croutons", "Cut the cold butter into small cubes", "Cut the cheese into cubes", "Cut the tofu into 1-inch cubes"],
  dur: 3.2,
  draw(t, F, key) {
    const D = 3.2, x1 = 90, y1 = 76, w = 180, h = key === "butter" ? 70 : 120;
    const cols = key === "butter" ? 5 : 4, rows = key === "butter" ? 2 : 3;
    const cuts = [...[...Array(cols - 1)].map((_, i) => ["v", x1 + (i + 1) * w / cols]), ...[...Array(rows - 1)].map((_, i) => ["h", y1 + (i + 1) * h / rows])];
    const prog = phase(t, D, 0.2, 2.1) * cuts.length, sp = phase(t, D, 2.2, 2.6);
    const face = key === "bread" ? F.inner : F.fill;
    const crust = key === "bread" ? `<rect x="${x1}" y="${y1}" width="${w}" height="${h}" rx="14" fill="${F.fill}"/><rect x="${x1 + 10}" y="${y1 + 10}" width="${w - 20}" height="${h - 20}" rx="8" fill="${F.inner}"/>` : `<rect x="${x1}" y="${y1}" width="${w}" height="${h}" rx="6" fill="${face}"/>` + (F.holes ? `<ellipse cx="${x1 + 40}" cy="${y1 + 40}" rx="8" ry="6" fill="${F.inner}"/><ellipse cx="${x1 + 130}" cy="${y1 + 80}" rx="6" ry="5" fill="${F.inner}"/>` : "");
    let food = "";
    if (sp <= 0) {
      food = crust + `<rect x="${x1}" y="${y1}" width="${w}" height="${h}" rx="${key === "bread" ? 14 : 6}" fill="none" ${st()}/>`;
      cuts.forEach(([d, v], i) => { const q = clamp(prog - i); if (q <= 0) return; food += d === "v" ? `<path d="M${v} ${y1} L${v} ${y1 + q * h}" stroke="${INK}" stroke-width="2.6"/>` : `<path d="M${x1} ${v} L${x1 + q * w} ${v}" stroke="${INK}" stroke-width="2.6"/>`; });
    } else {
      const cw = w / cols, ch = h / rows;
      for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
        const x = x1 + i * cw, y = y1 + j * ch, ox = (i - (cols - 1) / 2) * sp * 8, oy = (j - (rows - 1) / 2) * sp * 8;
        food += g(cutClip(cutRect(x, y, cw, ch), crust) + `<rect x="${x}" y="${y}" width="${cw}" height="${ch}" rx="4" fill="none" ${st(2.8)}/>`, ox, oy);
      }
    }
    let s = board() + cutOp(cutFade(t, D), food);
    if (prog > 0 && prog < cuts.length) { const i = Math.floor(prog), q = prog - i, [d, v] = cuts[i]; s += d === "v" ? cutChop(v, cutDown(q), y1 + h * 0.7) : knife(x1 + q * w, v, 0, 100); }
    return s;
  },
});
LIB.add({
  cat: "cut", name: "shave", foods: ["parmesan", "chocolate"],
  steps: ["Shave the parmesan with a vegetable peeler", "Use a peeler to make chocolate curls", "Top with shaved parmesan"],
  dur: 2.4,
  draw(t, F, key) {
    const D = 2.4, p = (t % 1.2) / 1.2, px = lerp(120, 236, ease(p));
    let food = g(whole(F), 180, 150, 1.5);
    const curl = (x, y, r) => g(`<path d="M-14 0 C-14 -12 10 -14 12 -2 C12 8 -2 8 -2 0" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M-14 0 C-14 -12 10 -14 12 -2 C12 8 -2 8 -2 0" fill="none" stroke="${F.inner}" stroke-width="4" stroke-linecap="round"/>`, x, y, 1, r);
    const n = Math.floor(phase(t, D, 0, 2.2) * 6);
    for (let i = 0; i < n; i++) food += curl(258 + (i % 3) * 26, 206 - Math.floor(i / 3) * 16, i * 50);
    food += curl(px - 14, 92 - p * 6, p * 90);
    return board() + cutOp(cutFade(t, D), food) + T.peeler(px, 128, -15);
  },
});
LIB.add({
  cat: "cut", name: "peelginger", foods: ["ginger"],
  steps: ["Peel the ginger with the edge of a spoon", "Scrape the skin off the ginger", "Peel and grate the ginger"],
  dur: 2.6,
  draw(t, F) {
    const D = 2.6, cx = 170, cy = 140, sc = 1.6;
    const strokes = [[-40, -6], [-10, 0], [20, -2]];
    let food = g(whole(F), cx, cy, sc);
    let spoon = "";
    strokes.forEach(([x, y], i) => {
      const a = 0.25 + i * 0.7, q = phase(t, D, a, a + 0.55);
      if (q > 0) food += `<ellipse cx="${cx + x * sc + q * 18}" cy="${cy + y * sc}" rx="${6 + q * 22}" ry="${10 + q * 4}" fill="${F.inner}" opacity=".95"/>`;
      if (q > 0.3) food += g(`<path d="M-8 0 C-4 -6 4 -6 8 0" fill="none" stroke="#B58A4A" stroke-width="4" stroke-linecap="round"/>`, cx + x * sc + 50 + q * 30, cy + 40 + q * 20, 1, i * 60);
      if (t > a && t < a + 0.6) spoon = g(T.metalSpoon(0, 0, 0) + g(fist(), 66, -60, 0.9, -40), cx + x * sc + q * 36 - 10, cy + y * sc - 22, 1, 20);
    });
    return board() + cutOp(cutFade(t, D), food) + spoon;
  },
});
LIB.add({
  cat: "cut", name: "planks", foods: ["eggplant", "zucchini"],
  steps: ["Slice the eggplant lengthwise into 1/4-inch planks", "Cut the zucchini lengthwise into long slices", "Slice into long planks for grilling"],
  dur: 3,
  draw(t, F, key) {
    const D = 3, cx = 176, cy = 134, sc = 1.35, L = 74 * sc, w = 20 * sc;
    const ys = [cy - w / 2, cy + w / 2], prog = phase(t, D, 0.25, 1.65) * 2, sp = phase(t, D, 1.75, 2.2);
    const src = g(whole(F), cx, cy, sc);
    let food = "";
    const bands = [[cy - 60, ys[0]], [ys[0], ys[1]], [ys[1], cy + 60]];
    bands.forEach(([a, b], i) => {
      const off = (i - 1) * sp * 30;
      if (sp <= 0 || i !== 1) food += g(cutClip(cutRect(0, a, 360, b - a), src), 0, off);
      else food += `<rect x="${cx - L}" y="${a - 2}" width="${L * 2}" height="${b - a + 4}" rx="10" fill="${F.inner}" ${st(3)}/>` + [...Array(6)].map((_, j) => `<circle cx="${cx - L * 0.6 + j * L * 0.24}" cy="${(a + b) / 2}" r="2.4" fill="#B5A06A"/>`).join("");
      if (sp > 0 && i !== 1) food += `<path d="M${cx - L + 8} ${(i === 0 ? b : a) + off} L${cx + L - 8} ${(i === 0 ? b : a) + off}" stroke="${F.inner}" stroke-width="5"/>`;
    });
    ys.forEach((y, i) => { const q = clamp(prog - i); if (q > 0 && sp <= 0) food += `<path d="M${cx + L + 6} ${y} L${cx + L + 6 - q * (L * 2 + 12)} ${y}" stroke="${INK}" stroke-width="2.6"/>`; });
    let s = board() + cutOp(cutFade(t, D), food);
    if (prog > 0 && prog < 2) { const i = Math.floor(prog), q = prog - i; s += knife(cx + L + 10 - q * (L * 2 + 20), ys[i], 180, 110); }
    return s;
  },
});
LIB.add({
  cat: "cut", name: "fan", foods: ["avocado"],
  steps: ["Halve and slice the avocado", "Thinly slice the avocado and fan it out", "Slice the avocado half and press gently to fan"],
  dur: 3,
  draw(t, F) {
    const D = 3, cx = 170, cy = 134;
    const prog = phase(t, D, 0.25, 1.6), fan = phase(t, D, 1.75, 2.3);
    const shape = `M0 -60 C24 -60 26 -20 40 6 C52 34 30 56 0 56 C-30 56 -52 34 -40 6 C-26 -20 -24 -60 0 -60 Z`;
    const n = 7, xs = [...Array(n)].map((_, i) => -44 + (i + 1) * 88 / (n + 1));
    let food = "";
    if (fan <= 0) {
      food = g(`<g transform="rotate(90)"><path d="${shape}" fill="#C8E08A" ${st()}/><path d="${shape}" fill="none" stroke="#2F5A22" stroke-width="6" transform="scale(.97)"/></g>`, cx, cy, 1.3);
      xs.forEach((x, i) => { if (prog * n > i) food += `<path d="M${cx + x * 1.3 * 1.25} ${cy - 46} L${cx + x * 1.3 * 1.25} ${cy + 46}" stroke="#7FA04A" stroke-width="2.4"/>`; });
    } else {
      for (let i = 0; i < n; i++) food += g(`<path d="M-9 -38 C-6 -44 6 -44 9 -38 L9 38 C6 44 -6 44 -9 38 Z" fill="#C8E08A" ${st(2.6)}/><path d="M7 -36 L7 36" stroke="#2F5A22" stroke-width="3"/>`, cx - 60 + i * (16 + fan * 4), cy + i * fan * 4, 1, -30 * fan);
    }
    let s = board() + cutOp(cutFade(t, D), food);
    if (prog > 0 && prog < 1) { const i = Math.floor(prog * n) % n; s += cutChop(cx + xs[i] * 1.3 * 1.25, cutDown((prog * n) % 1), cy + 30); }
    if (fan > 0 && fan < 1) s += T.palm(cx - 10 + fan * 30, cy - 20, 1.3, 90);
    return s;
  },
});
