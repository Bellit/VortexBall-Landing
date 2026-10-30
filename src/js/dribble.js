import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fmt, svgEl, ballAt, flash } from "./geometry.js";

// Sesión de demostración: fuerza de impacto de cada bote, en newtons
const BOUNCES = [58, 61, 64, 60, 66, 63, 59];
const HAND_Y = 150, FLOOR_Y = 440, STEP = 190, PERIOD = .42;

export function initDribble({ reduce }) {
  const plate = document.getElementById("dribblePlate");
  const track = document.getElementById("dribbleTrack");

  const impacts = [];   // el balón en el suelo de cada bote: ahí salta el flash
  const groups = BOUNCES.map((f, i) => {
    const x = 120 + i * STEP;
    const g = svgEl("g", {}, track);
    svgEl("path", { class: "path", d: `M${x - STEP / 2} ${HAND_Y} L${x} ${FLOOR_Y} L${x + STEP / 2} ${HAND_Y}` }, g);
    ballAt(g, x - STEP / 4, (HAND_Y + FLOOR_Y) / 2, 30, i * 20).setAttribute("opacity", .4);
    impacts.push(ballAt(g, x, FLOOR_Y, 30, i * 20 + 10));
    const w = 40 + f * .4;
    svgEl("line", { class: "imp", x1: x - w, y1: 472, x2: x + w, y2: 472 }, g);
    svgEl("text", { class: "lbl", x, y: 510, "text-anchor": "middle" }, g).textContent = `${f} N`;
    svgEl("text", { class: "lbl-dim", x, y: 60, "text-anchor": "middle" }, g).textContent = `${fmt(i * PERIOD)} s`;
    return g;
  });

  // Señal del acelerómetro (sintética): ruido de fondo, un pico estrecho en cada
  // impacto cuya altura es la fuerza, y la vibración del balón que se apaga después
  const signal = document.getElementById("signalPlate");
  const path = document.getElementById("signalPath");
  const BASE_Y = 180;
  const pts = [];
  for (let x = 0; x <= 1400; x += 2) {
    let s = 2.2 * Math.sin(x * .37) + 1.3 * Math.sin(x * 1.13);
    BOUNCES.forEach((f, i) => {
      const dx = x - (120 + i * STEP), a = (f - 40) * 5;
      s += a * Math.exp(-((dx / 7) ** 2));
      if (dx > 0) s -= a * .3 * Math.exp(-dx / 28) * Math.sin(dx / 6);
    });
    pts.push(`${x},${(BASE_Y - s).toFixed(1)}`);
  }
  path.setAttribute("d", `M${pts.join("L")}`);

  // dos notas bastan para leerla: qué es la altura y qué es la separación
  const notes = document.getElementById("signalNotes");
  const peakX = 120 + 2 * STEP, peakY = BASE_Y - (BOUNCES[2] - 40) * 5;
  svgEl("line", { x1: peakX + 6, y1: peakY - 4, x2: peakX + 60, y2: peakY - 24 }, notes);
  svgEl("text", { x: peakX + 66, y: peakY - 20 }, notes).textContent = "pico = fuerza";
  const x0 = 120, x1 = 120 + STEP, by = 228;
  svgEl("path", { d: `M${x0} ${by - 8}V${by}H${x1}V${by - 8}` }, notes);
  svgEl("text", { x: (x0 + x1) / 2, y: by - 14, "text-anchor": "middle" }, notes).textContent = `${fmt(PERIOD)} s = ritmo`;

  // en móvil solo caben cuatro botes legibles
  const narrow = matchMedia("(max-width: 700px)");
  const layout = () => {
    plate.setAttribute("viewBox", narrow.matches ? "20 0 760 560" : "0 0 1400 560");
    signal.setAttribute("viewBox", narrow.matches ? "20 0 760 240" : "0 0 1400 240");
  };
  layout();
  narrow.addEventListener("change", layout);

  if (reduce) return;

  // la señal se dibuja al ritmo de los botes
  const len = path.getTotalLength();
  gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
  gsap.set(notes, { opacity: 0 });
  ScrollTrigger.create({
    trigger: plate, start: "top 75%", end: "bottom 50%",
    onUpdate: self => {
      gsap.to(path, { strokeDashoffset: len * (1 - self.progress), duration: .4, ease: "power2.out", overwrite: true });
      gsap.to(notes, { opacity: self.progress > .5 ? 1 : 0, duration: .4, overwrite: true });
    },
  });

  gsap.set(groups, { opacity: .12 });
  let shown = 0;
  ScrollTrigger.create({
    trigger: plate, start: "top 75%", end: "bottom 50%",
    onUpdate: self => {
      const n = Math.round(self.progress * groups.length);
      if (n === shown) return;
      groups.forEach((g, i) => gsap.to(g, { opacity: i < n ? 1 : .12, duration: .35, ease: "expo.out" }));
      if (n > shown) flash(impacts[n - 1]);
      shown = n;
    },
  });
}
