import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fmt, svgEl, ballAt, flash } from "./geometry.js";

// Sesión de demostración: fuerza de impacto de cada bote, en newtons
const BOUNCES = [58, 61, 64, 60, 66, 63, 59];
const HAND_Y = 150, FLOOR_Y = 440, STEP = 190, PERIOD = .42;

export function initDribble({ reduce }) {
  const plate = document.getElementById("dribblePlate");
  const track = document.getElementById("dribbleTrack");

  const groups = BOUNCES.map((f, i) => {
    const x = 120 + i * STEP;
    const g = svgEl("g", {}, track);
    svgEl("path", { class: "path", d: `M${x - STEP / 2} ${HAND_Y} L${x} ${FLOOR_Y} L${x + STEP / 2} ${HAND_Y}` }, g);
    ballAt(g, x - STEP / 4, (HAND_Y + FLOOR_Y) / 2, 30, i * 20).setAttribute("opacity", .4);
    ballAt(g, x, FLOOR_Y, 30, i * 20 + 10);
    const w = 40 + f * .4;
    svgEl("line", { class: "imp", x1: x - w, y1: 472, x2: x + w, y2: 472 }, g);
    svgEl("text", { class: "lbl", x, y: 510, "text-anchor": "middle" }, g).textContent = `${f} N`;
    svgEl("text", { class: "lbl-dim", x, y: 60, "text-anchor": "middle" }, g).textContent = `${fmt(i * PERIOD)} s`;
    return g;
  });

  // en móvil solo caben cuatro botes legibles
  const narrow = matchMedia("(max-width: 700px)");
  const layout = () => plate.setAttribute("viewBox", narrow.matches ? "20 0 760 560" : "0 0 1400 560");
  layout();
  narrow.addEventListener("change", layout);

  if (reduce) return;

  gsap.set(groups, { opacity: .12 });
  let shown = 0;
  ScrollTrigger.create({
    trigger: plate, start: "top 75%", end: "bottom 50%",
    onUpdate: self => {
      const n = Math.round(self.progress * groups.length);
      if (n === shown) return;
      groups.forEach((g, i) => gsap.to(g, { opacity: i < n ? 1 : .12, duration: .35, ease: "expo.out" }));
      if (n > shown) flash(groups[n - 1]);
      shown = n;
    },
  });
}
