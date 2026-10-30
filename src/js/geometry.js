import { gsap } from "gsap";

export const NS = "http://www.w3.org/2000/svg";

// Punto de una curva de Bézier cuadrática (inicio, control, fin) en t ∈ [0, 1]
export function quad(p0, c, p2, t) {
  const u = 1 - t;
  return [
    u * u * p0[0] + 2 * t * u * c[0] + t * t * p2[0],
    u * u * p0[1] + 2 * t * u * c[1] + t * t * p2[1],
  ];
}

// Números con coma decimal, como se escriben en español
export const fmt = (n, digits = 2) => n.toFixed(digits).replace(".", ",");

export function svgEl(tag, attrs = {}, parent) {
  const el = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  if (parent) parent.appendChild(el);
  return el;
}

// Un balón colocado en (x, y) con radio r y girado `rot` grados.
// Guarda su centro y radio para que el flash sepa dónde encender el halo.
export function ballAt(parent, x, y, r = 30, rot = 0) {
  const g = svgEl("g", { transform: `translate(${x} ${y}) rotate(${rot})` }, parent);
  const s = (r / 30) * 64;
  svgEl("use", { href: "#ball", x: -s / 2, y: -s / 2, width: s, height: s }, g);
  Object.assign(g.dataset, { cx: x, cy: y, r });
  return g;
}

// El destello de una exposición: el gesto de movimiento de toda la página.
// Un halo de luz cálida se abre detrás del balón y se apaga, como el flash
// de un estroboscopio sobre la emulsión.
export function flash(target) {
  if (!target) return;
  const { cx, cy, r } = target.dataset;
  if (cx !== undefined && target.parentNode) {
    const halo = svgEl("circle", { cx, cy, r: r * 2.8, fill: "url(#halo)", class: "halo" });
    target.parentNode.insertBefore(halo, target);
    gsap.fromTo(halo,
      { opacity: .95, scale: .45, svgOrigin: `${cx} ${cy}` },
      { opacity: 0, scale: 1.2, svgOrigin: `${cx} ${cy}`, duration: .9, ease: "expo.out", onComplete: () => halo.remove() });
  }
  return gsap.fromTo(target,
    { filter: "brightness(1.8)" },
    { filter: "brightness(1)", duration: .6, ease: "expo.out", overwrite: "auto" });
}
