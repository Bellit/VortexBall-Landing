import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { quad, svgEl, ballAt, flash } from "./geometry.js";

// Placa de 800 × 420; suelo en y = 380
const FLOOR = 380;
const HOOP = [690, 170];

function hoop(svg) {
  const g = svgEl("g", { class: "hoop-mini" }, svg);
  svgEl("line", { x1: 742, y1: 110, x2: 742, y2: 230 }, g);
  svgEl("line", { x1: 742, y1: 170, x2: 722, y2: 170 }, g);
  svgEl("ellipse", { cx: HOOP[0], cy: HOOP[1], rx: 30, ry: 6 }, g);
}

function floor(svg) {
  svgEl("line", { x1: 0, y1: FLOOR, x2: 800, y2: FLOOR, class: "floor" }, svg);
}

// Un tiro: trayectoria punteada y n exposiciones a lo largo de ella
function shot(svg, from, ctrl, n, balls) {
  svgEl("path", { class: "path", d: `M${from[0]} ${from[1]} Q ${ctrl[0]} ${ctrl[1]} ${HOOP[0]} ${HOOP[1] - 8}` }, svg);
  for (let i = 0; i < n; i++) {
    const [x, y] = quad(from, ctrl, [HOOP[0], HOOP[1] - 8], i / (n - 1));
    balls.push(ballAt(svg, x, y, 16, -i * 40));
  }
}

const DIAGRAMS = {
  libre(svg, balls) {
    floor(svg); hoop(svg);
    shot(svg, [130, 230], [400, -70], 9, balls);
    svgEl("path", { class: "path", d: `M130 400 H690` }, svg);
    svgEl("text", { class: "lbl", x: 410, y: 412, "text-anchor": "middle" }, svg).textContent = "4,6 m";
  },
  bote(svg, balls) {
    floor(svg); hoop(svg);
    svgEl("path", { class: "path", d: "M80 190 L160 364 L240 230" }, svg);
    [[80, 190], [120, 277], [160, 364]].forEach(([x, y], i) => balls.push(ballAt(svg, x, y, 16, i * 30)));
    shot(svg, [240, 230], [470, -30], 7, balls);
    svgEl("text", { class: "lbl", x: 200, y: 412, "text-anchor": "middle" }, svg).textContent = "armado 0,38 s";
  },
  zigzag(svg, balls) {
    // vista cenital: conos y cambios de mano
    const cones = [140, 280, 420, 560, 700];
    cones.forEach(x => svgEl("path", { class: "cone", d: `M${x} 196 l12 22 h-24 z` }, svg));
    const pts = [[70, 210], [210, 110], [350, 310], [490, 110], [630, 310], [750, 210]];
    svgEl("polyline", { class: "path", points: pts.map(p => p.join(",")).join(" ") }, svg);
    pts.forEach(([x, y], i) => {
      balls.push(ballAt(svg, x, y, 16, i * 50));
      if (i > 0 && i < pts.length - 1) {
        svgEl("text", { class: "lbl-dim", x, y: y < 210 ? y - 26 : y + 38, "text-anchor": "middle" }, svg)
          .textContent = `${[61, 64, 59, 66][i - 1]} N`;
      }
    });
  },
  rango(svg, balls) {
    floor(svg); hoop(svg);
    [[480, 250, "3 m", -10], [300, 245, "4,6 m", -70], [110, 240, "6,75 m", -130]].forEach(([x, y, label, cy]) => {
      shot(svg, [x, y], [(x + HOOP[0]) / 2 - 20, cy], 5, balls);
      svgEl("line", { x1: x, y1: FLOOR - 8, x2: x, y2: FLOOR + 8, stroke: "currentColor", class: "floor" }, svg);
      svgEl("text", { class: "lbl", x, y: 412, "text-anchor": "middle" }, svg).textContent = label;
    });
  },
};

// Duración de cada toma de la hoja de contactos (datos de demostración)
const DURATION = { libre: "1,1 s", bote: "1,6 s", zigzag: "2,5 s", rango: "3 tiros" };

export function initSessions({ reduce }) {
  const frames = [...document.querySelectorAll(".frame")];
  const ballsPerFrame = frames.map(frame => {
    const svg = frame.querySelector("svg");
    const balls = [];
    DIAGRAMS[frame.dataset.diagram](svg, balls);
    // el borde del fotograma lleva información: exposiciones y duración de la toma
    const edge = document.createElement("p");
    edge.className = "frame-edge";
    edge.innerHTML = `<span>${balls.length} exposiciones</span><span>${DURATION[frame.dataset.diagram]}</span>`;
    frame.prepend(edge);
    return balls;
  });

  if (reduce) return;

  const track = document.getElementById("track");
  const distance = () => Math.max(0, track.scrollWidth - document.documentElement.clientWidth);

  // el scroll vertical mueve la hoja de contactos en horizontal
  const slide = gsap.to(track, {
    x: () => -distance(),
    ease: "none",
    scrollTrigger: {
      trigger: ".sessions", pin: ".sessions-pin", start: "top top",
      end: () => `+=${distance()}`, scrub: .6, invalidateOnRefresh: true,
    },
  });

  // cada fotograma se expone cuando entra en el centro de la pantalla
  frames.forEach((frame, i) => {
    const balls = ballsPerFrame[i];
    gsap.set(balls, { opacity: 0 });
    ScrollTrigger.create({
      trigger: frame, containerAnimation: slide, start: "left 75%",
      onEnter: () => {
        gsap.to(balls, { opacity: 1, duration: .3, stagger: .06, ease: "expo.out" });
        balls.forEach((b, k) => gsap.delayedCall(k * .06, () => flash(b)));
      },
    });
  });
}
