import { gsap } from "gsap";
import { svgEl } from "./geometry.js";

const CX = 800, CY = 540;

export function initInside({ reduce }) {
  const plate = document.getElementById("explodePlate");
  const spokesG = document.getElementById("spokes");

  // seis tirantes del módulo a la cámara
  const spokes = [];
  for (let k = 0; k < 6; k++) {
    const a = (30 + k * 60) * Math.PI / 180;
    const line = svgEl("line", {
      x1: CX + Math.cos(a) * 58, y1: CY + Math.sin(a) * 58,
      x2: CX + Math.cos(a) * 228, y2: CY + Math.sin(a) * 228,
    }, spokesG);
    svgEl("circle", { cx: CX + Math.cos(a) * 228, cy: CY + Math.sin(a) * 228, r: 5 }, spokesG);
    spokes.push(line);
  }

  const portrait = matchMedia("(max-aspect-ratio: 1/1)");
  function layout() {
    const p = portrait.matches;
    plate.classList.toggle("portrait", p);
    plate.setAttribute("preserveAspectRatio", p ? "xMidYMid meet" : "xMidYMid slice");
    plate.setAttribute("viewBox", p ? "230 270 1140 540" : "0 0 1600 1000");
  }
  layout();
  portrait.addEventListener("change", layout);

  const notes = sel => plate.querySelector(`[data-part="${sel}"]`);
  const halfL = "#halfL", halfR = "#halfR";

  if (reduce) {
    gsap.set(halfL, { x: -300, rotation: -6, svgOrigin: `${CX} ${CY}` });
    gsap.set(halfR, { x: 300, rotation: 6, svgOrigin: `${CX} ${CY}` });
    return;
  }

  spokes.forEach(l => {
    const len = l.getTotalLength();
    gsap.set(l, { strokeDasharray: len, strokeDashoffset: len });
  });
  gsap.set(plate.querySelectorAll(".annot [data-part]"), { opacity: 0 });

  // la cubierta se abre y las capas se exponen una a una
  gsap.timeline({
    defaults: { ease: "power2.inOut" },
    scrollTrigger: { trigger: ".inside", start: "top top", end: "bottom bottom", scrub: .6 },
  })
    .to(halfL, { x: -300, rotation: -6, svgOrigin: `${CX} ${CY}`, duration: 1 }, 0)
    .to(halfR, { x: 300, rotation: 6, svgOrigin: `${CX} ${CY}`, duration: 1 }, 0)
    .to(".inside-copy", { opacity: .35, duration: .6 }, .2)
    .fromTo("#layerBladder", { opacity: 0, scale: .92, svgOrigin: `${CX} ${CY}` }, { opacity: 1, scale: 1, duration: .4, ease: "expo.out" }, .35)
    .to(notes("cubierta"), { opacity: 1, duration: .2 }, .55)
    .to(notes("camara"), { opacity: 1, duration: .2 }, .7)
    .to(spokes, { strokeDashoffset: 0, duration: .4, stagger: .05 }, .85)
    .to(notes("suspension"), { opacity: 1, duration: .2 }, 1.2)
    .fromTo("#layerModule .module, #layerModule .chip", { opacity: 0 }, { opacity: 1, duration: .25 }, 1.2)
    .to(notes("modulo"), { opacity: 1, duration: .2 }, 1.4)
    .to({}, { duration: .4 });
}
