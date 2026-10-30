import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { quad, fmt, svgEl, ballAt, flash } from "./geometry.js";

// Escala de la placa: 180 unidades = 1 metro, suelo en y = 900
const M = 180;
const FLOOR = 900;
const N = 13;          // exposiciones
const FLIGHT = 1.12;   // segundos de vuelo
const P0 = [220, 486], C = [800, -100], P2 = [1398, 338];
const SHOWN_AT_START = 3;
const LATENT = .05;    // imagen latente: las exposiciones futuras ya se intuyen en la placa

export function initShot({ reduce }) {
  const plate = document.getElementById("shotPlate");
  const ruler = document.getElementById("ruler");
  const expG = document.getElementById("exposures");
  const notes = [...plate.querySelectorAll(".annot [data-at]")];
  const out = {
    exp: document.getElementById("rExp"),
    h: document.getElementById("rH"),
    d: document.getElementById("rD"),
    t: document.getElementById("rT"),
  };

  for (let m = 0; m <= 5; m++) {
    const y = FLOOR - m * M;
    svgEl("line", { x1: 0, y1: y, x2: 28, y2: y }, ruler);
    svgEl("text", { x: 36, y: y + 4 }, ruler).textContent = `${m} m`;
  }

  // Cada exposición gira hacia atrás: es la rotación que mide el sensor
  const frames = Array.from({ length: N }, (_, i) => {
    const [x, y] = quad(P0, C, P2, i / (N - 1));
    const g = ballAt(expG, x, y, 30, -i * 34);
    g.style.opacity = 0;
    return g;
  });

  // Ápice real de la parábola: donde la derivada vertical de la curva es cero.
  // La anotación se clava a la exposición más cercana a ese punto.
  const tApex = (P0[1] - C[1]) / (P0[1] - 2 * C[1] + P2[1]);
  const apexY = quad(P0, C, P2, tApex)[1];
  const apexIdx = Math.round(tApex * (N - 1));
  const [nx, ny] = quad(P0, C, P2, apexIdx / (N - 1));
  const apex = document.getElementById("apexNote");
  apex.dataset.at = apexIdx;
  const set = (sel, attrs) => Object.entries(attrs).forEach(([k, v]) => apex.querySelector(sel).setAttribute(k, v));
  set(".apex-drop", { x1: nx, y1: ny + 40, x2: nx, y2: FLOOR });
  set(".apex-lead", { x1: nx + 24, y1: ny - 24, x2: nx + 90, y2: ny - 80 });
  set(".apex-k", { x: nx + 98, y: ny - 92 });
  set(".apex-v", { x: nx + 98, y: ny - 72 });
  apex.querySelector(".apex-v").textContent = `${fmt((FLOOR - apexY) / M)} m`;

  // En vertical la placa se recorta a la trayectoria y los balones crecen para leerse
  const portrait = matchMedia("(max-aspect-ratio: 1/1)");
  const stage = plate.parentElement;
  function layout() {
    const p = portrait.matches;
    const s = p ? 1.6 : 1;
    plate.classList.toggle("portrait", p);
    plate.setAttribute("preserveAspectRatio", p ? "xMidYMid meet" : "xMidYMid slice");
    plate.setAttribute("viewBox", p ? "150 70 1400 500" : "0 0 1600 1000");
    ruler.setAttribute("transform", p ? "translate(150 0)" : "");
    frames.forEach((g, i) => {
      const [x, y] = quad(P0, C, P2, i / (N - 1));
      g.setAttribute("transform", `translate(${x} ${y}) rotate(${-i * 34}) scale(${s})`);
      g.dataset.r = 30 * s;   // el halo del flash crece con el balón
    });
    // en horizontal, texto y lectura se apoyan sobre la línea del suelo de la placa
    if (!p) {
      const w = stage.clientWidth, h = stage.clientHeight;
      const scale = Math.max(w / 1600, h / 1000);
      const floorY = (h - 1000 * scale) / 2 + FLOOR * scale;
      stage.style.setProperty("--above-floor", `${Math.max(16, h - floorY) + 28}px`);
    }
  }
  layout();
  portrait.addEventListener("change", layout);
  addEventListener("resize", layout);

  // Las cifras no saltan: ruedan hasta su nuevo valor, como un contador mecánico
  const shown = { exp: 1, h: (FLOOR - P0[1]) / M, d: 0, t: 0 };
  const print = () => {
    out.exp.textContent = String(Math.round(shown.exp)).padStart(2, "0");
    out.h.textContent = `${fmt(shown.h)} m`;
    out.d.textContent = `${fmt(shown.d)} m`;
    out.t.textContent = `${fmt(shown.t)} s`;
  };
  function readout(i, instant = reduce) {
    const [x, y] = quad(P0, C, P2, i / (N - 1));
    const target = { exp: i + 1, h: (FLOOR - y) / M, d: (x - P0[0]) / M, t: FLIGHT * i / (N - 1) };
    if (instant) { Object.assign(shown, target); print(); return; }
    gsap.to(shown, { ...target, duration: .45, ease: "power2.out", overwrite: true, onUpdate: print });
  }

  if (reduce) {
    frames.forEach((f, i) => { f.style.opacity = i === N - 1 ? 1 : .55; });
    notes.forEach(n => { n.style.opacity = 1; });
    readout(N - 1);
    return { intro: () => gsap.timeline() };
  }

  // Pinta la placa con `idx` como exposición actual: plena luz para ella,
  // las anteriores se apagan y las futuras quedan como imagen latente
  function paint(idx) {
    frames.forEach((f, i) => {
      const age = idx - i;
      f.style.opacity = age < 0 ? LATENT : age === 0 ? 1 : Math.max(.28, .8 - age * .07);
    });
    notes.forEach(n => {
      gsap.to(n, { opacity: idx >= +n.dataset.at ? 1 : 0, duration: .4, ease: "expo.out" });
    });
    readout(idx);
  }

  let current = -1;
  function expose(progress) {
    const idx = Math.min(N - 1, Math.floor(SHOWN_AT_START - 1 + progress * (N - SHOWN_AT_START + .999)));
    if (idx === current) return;
    const forward = idx > current;
    current = idx;
    paint(idx);
    if (forward) flash(frames[idx]);
  }
  notes.forEach(n => { n.style.opacity = 0; });
  expose(0);

  ScrollTrigger.create({
    trigger: ".shot", start: "top top", end: "bottom bottom",
    onUpdate: self => expose(self.progress),
  });

  gsap.to(".hero-copy", {
    opacity: 0, y: -40, ease: "none",
    scrollTrigger: { trigger: ".shot", start: "12% top", end: "32% top", scrub: true },
  });

  // Para la intro: las primeras exposiciones se disparan una a una
  function intro() {
    const tl = gsap.timeline();
    tl.call(() => {
      frames.forEach(f => { f.style.opacity = LATENT; });
      notes.forEach(n => { gsap.set(n, { opacity: 0 }); });
    });
    for (let i = 0; i < SHOWN_AT_START; i++) {
      tl.call(() => { paint(i); flash(frames[i]); }, null, .1 + i * .18);
    }
    return tl;
  }

  return { intro };
}
