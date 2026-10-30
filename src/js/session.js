import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { svgEl, ballAt, flash } from "./geometry.js";
import { dribbleAt, DRIBBLE_PERIOD, DRIBBLE_HIT } from "./dribble.js";

// ---------------------------------------------------------------------------
// La sesión: cuatro ejercicios seguidos con un solo balón, en vista lateral.
// Cada ejercicio es una lista de "tomas" (un tiro, unos botes, el armado del
// tiro...). Cada toma sabe dónde está el balón en su instante u; el scroll
// avanza un reloj único que recorre todas las tomas en orden.
// ---------------------------------------------------------------------------

const G = 9.81;
const PX = 100, FLOOR_Y = 450;      // 1 m = 100 unidades; suelo en y = 450
const DRAW_R = 22;                  // el balón se dibuja casi el doble de grande para leerse
const RIM = { x: 7.85, h: 3.05 };
const RELEASE_H = 2.3, HAND = .9, FLOOR_C = .12;
const DROP = Math.sqrt(2 * (RIM.h - FLOOR_C) / G);   // caída desde el aro al suelo
const FADE = .25;                                    // la exposición se apaga antes del siguiente tiro
const SPIN = 970;                                    // backspin: 2,7 vueltas por segundo, en grados/s
const rad = d => d * Math.PI / 180;

// Un tiro que entra: la velocidad de salida se calcula para que, con ese ángulo,
// la parábola pase justo por el centro del aro
function shot(x0, deg) {
  const a = rad(deg), dx = RIM.x - x0;
  const v = Math.sqrt(G * dx * dx / (2 * Math.cos(a) ** 2 * (RELEASE_H + dx * Math.tan(a) - RIM.h)));
  const T = dx / (v * Math.cos(a));
  return {
    dur: T + DROP + FADE,
    events: [0],    // el destello: el instante en que sale el tiro
    at(u) {
      if (u < T) return { x: x0 + v * Math.cos(a) * u, h: RELEASE_H + v * Math.sin(a) * u - G * u * u / 2, rot: -u * SPIN, op: 1 };
      const d = Math.min(u - T, DROP);   // atraviesa la red y cae al suelo
      const op = u > T + DROP ? Math.max(0, 1 - (u - T - DROP) / FADE) : 1;
      return { x: RIM.x, h: Math.max(FLOOR_C, RIM.h - G * d * d / 2), rot: -T * SPIN - d * 200, op };
    },
  };
}

// n botes con la física del bote, avanzando de x0 a x1
function dribble(x0, x1, n) {
  const dur = n * DRIBBLE_PERIOD;
  return {
    dur,
    events: [0, ...Array.from({ length: n }, (_, i) => i * DRIBBLE_PERIOD + DRIBBLE_HIT)],
    at(u) {
      const { h, k } = dribbleAt(u);
      return { x: x0 + (x1 - x0) * u / dur, h, rot: u * 140, op: 1, k };
    },
  };
}

// el armado: de la altura del bote a la de lanzamiento
function gather(x, dur = .35) {
  return {
    dur, events: [],
    at(u) {
      const s = u / dur, e = s * s * (3 - 2 * s);
      return { x, h: HAND + (RELEASE_H - HAND) * e, rot: 0, op: 1 };
    },
  };
}

// La sesión. Cada ejercicio con su "cámara" (qué tramo de pista se ve, en metros)
const EXERCISES = [
  { cam: { x: 2.6, w: 7 },    takes: [shot(3.65, 51), shot(3.65, 51), shot(3.65, 51)] },
  { cam: { x: 2.3, w: 7.3 },  takes: [dribble(3.35, 3.35, 2), gather(3.35), shot(3.35, 48)] },
  { cam: { x: 0, w: 7.4 },    takes: [dribble(.8, 6, 6)] },
  { cam: { x: -.3, w: 9.8 },  takes: [shot(4.85, 52), shot(3.25, 47), shot(1.1, 43)] },
];
const CONES = [1.3, 2.35, 3.4, 4.45, 5.5];
const MARKS = [[3, "3 m"], [4.2, "tiro libre"], [6.75, "6,75 m"]];   // distancia al aro

// Aplanar la sesión: cada toma con su inicio absoluto y su ejercicio
const TAKES = [];
const EX_START = [];
let clock = 0;
EXERCISES.forEach((ex, e) => {
  EX_START.push(clock);
  ex.takes.forEach(tk => { TAKES.push({ ...tk, start: clock, ex: e }); clock += tk.dur; });
});
const TOTAL = clock;
EX_START.push(TOTAL);
const EVENTS = TAKES.flatMap(tk => tk.events.map(t => tk.start + t));

function stateAt(t) {
  t = Math.min(Math.max(t, 0), TOTAL - 1e-6);
  let i = TAKES.findIndex(tk => t < tk.start + tk.dur);
  if (i < 0) i = TAKES.length - 1;
  const tk = TAKES[i];
  return { ...tk.at(t - tk.start), take: i, ex: tk.ex };
}

export function initSession({ reduce }) {
  const plate = document.getElementById("sessionPlate");
  const layer = document.getElementById("sessionBallLayer");
  const ghostLayer = document.getElementById("sessionGhosts");
  const fill = document.getElementById("tlFill");
  const clockEl = document.getElementById("tlClock");
  const rows = [...document.querySelectorAll(".session-log li")];
  const count = document.getElementById("logCount");
  const done = document.getElementById("sessionDone");

  // marcas de distancia en el suelo y conos del zigzag
  const marks = document.getElementById("floorMarks");
  MARKS.forEach(([d, label]) => {
    const x = (RIM.x - d) * PX;
    svgEl("line", { x1: x, y1: FLOOR_Y, x2: x, y2: FLOOR_Y + 8 }, marks);
    svgEl("text", { x, y: FLOOR_Y + 24, "text-anchor": "middle" }, marks).textContent = label;
  });
  const cones = document.getElementById("cones");
  CONES.forEach(c => svgEl("path", { d: `M${c * PX} ${FLOOR_Y - 22} l9 22 h-18 z`, class: "cone" }, cones));

  const ball = ballAt(layer, 0, 0, DRAW_R);
  ball.id = "sessionBall";
  // estela: las cinco exposiciones anteriores, cada una más tenue
  const ghosts = Array.from({ length: 5 }, () => ballAt(ghostLayer, 0, 0, DRAW_R));

  function place(el, st) {
    const sy = 1 - .2 * (st.k ?? 0), sx = 1 + .1 * (st.k ?? 0);
    const x = st.x * PX, y = FLOOR_Y - st.h * PX;
    el.squash = { x: sx, y: sy };
    const flat = plate.classList.contains("has-3d") ? "" : ` scale(${sx} ${sy})`;
    el.setAttribute("transform", `translate(${x} ${y})${flat} rotate(${st.rot})`);
    Object.assign(el.dataset, { cx: x, cy: y });
  }

  const ease = s => s * s * (3 - 2 * s);
  function camera(t, ex) {
    const local = t - EX_START[ex], to = EXERCISES[ex].cam;
    const from = ex ? EXERCISES[ex - 1].cam : to;
    const s = ex ? ease(Math.min(1, local / .7)) : 1;   // la cámara se abre o se cierra en 0,7 s
    const x = from.x + (to.x - from.x) * s, w = from.w + (to.w - from.w) * s;
    plate.setAttribute("viewBox", `${x * PX} -20 ${w * PX} 480`);
  }

  function render(t) {
    const st = stateAt(t);
    place(ball, st);
    ball.style.opacity = st.op;
    ghosts.forEach((g, k) => {
      const tg = t - (k + 1) * .06;
      const gs = tg >= 0 ? stateAt(tg) : null;
      if (!gs || gs.take !== st.take) { g.style.opacity = 0; return; }
      place(g, gs);
      g.style.opacity = gs.op * (.3 - k * .05);
    });
    camera(t, st.ex);
    cones.style.opacity = st.ex === 2 ? 1 : .12;

    // reloj de la sesión: cada ejercicio ocupa un minuto
    const finished = t >= TOTAL * .999;
    const local = Math.min(1, (t - EX_START[st.ex]) / (EX_START[st.ex + 1] - EX_START[st.ex]));
    const progress = finished ? 4 : st.ex + local;
    fill.style.width = `${progress / 4 * 100}%`;
    const secs = Math.round(progress * 60);
    clockEl.textContent = `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`;

    // cuaderno: los terminados con su resultado, el actual "midiendo"
    rows.forEach((r, i) => {
      r.classList.toggle("is-done", i < st.ex || finished);
      r.classList.toggle("is-live", i === st.ex && !finished);
    });
    count.textContent = `${finished ? 4 : st.ex} / 4`;
    done.classList.toggle("is-on", finished);
  }

  if (reduce) { render(TOTAL); return; }

  const state = { t: 0 };
  let prev = 0;
  render(0);
  ScrollTrigger.create({
    trigger: ".session", start: "top top", end: "bottom bottom",
    onUpdate: self => gsap.to(state, {
      t: self.progress * TOTAL, duration: .5, ease: "power2.out", overwrite: true,
      onUpdate: () => {
        const t = state.t;
        render(t);
        // destellos: cada tiro que sale y cada bote que toca el suelo
        if (t > prev && t - prev < 1.5) EVENTS.forEach(e => { if (e > prev && e <= t) flash(ball); });
        prev = t;
      },
    }),
  });
}
