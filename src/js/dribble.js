import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fmt, svgEl, ballAt, flash } from "./geometry.js";

// ---------------------------------------------------------------------------
// El bote. Un solo balón con física real: la mano lo empuja hacia abajo, cae
// acelerando por la gravedad, se aplasta un instante contra el suelo y sube
// frenando hasta la mano. El scroll avanza el tiempo; el panel lee al sensor.
// ---------------------------------------------------------------------------

const G = 9.81;                 // gravedad, m/s²
const HAND = .9, FLOOR_C = .12; // altura del centro del balón en la mano y en el suelo (radio 12 cm)
const V_PUSH = 3.75;            // velocidad que da el empujón de la mano, m/s
const T_DOWN = .17;             // tiempo de caída hasta el suelo, s
const E = .82;                  // coeficiente de restitución del balón
const V_HIT = V_PUSH + G * T_DOWN;            // velocidad al llegar al suelo (5,42 m/s)
const V_OUT = E * V_HIT;                      // velocidad de salida tras el bote
const T_UP = (V_OUT - Math.sqrt(V_OUT ** 2 - 2 * G * (HAND - FLOOR_C))) / G;   // subida hasta la mano
const T = T_DOWN + T_UP;        // un bote completo (≈ 0,41 s)
const FORCES = [482, 497, 511, 489, 518, 503, 486];   // pico de fuerza de cada impacto (sintético), N
const N = FORCES.length;
const TOTAL = N * T;
const IMPACTS = FORCES.map((_, i) => i * T + T_DOWN);
const SQUASH_T = .022;          // ventana de tiempo en la que el balón se ve aplastado

// El mismo bote, para otras escenas (la sesión de ejercicios): altura del centro,
// velocidad y cuánto se aplasta (k de 0 a 1) en el instante t de un dribling
export const DRIBBLE_PERIOD = T;
export const DRIBBLE_HIT = T_DOWN;
export function dribbleAt(t) {
  const { h, v } = kinematics(t);
  const tau = ((t % T) + T) % T;
  const near = Math.abs(tau - T_DOWN);
  const k = near < SQUASH_T ? 1 - near / SQUASH_T : 0;
  return { h: k ? Math.min(h, FLOOR_C * (1 - .2 * k)) : h, v, k };
}

// Placa: 1 m = 500 unidades, suelo en y = 600
const PX = 500, FLOOR_Y = 600, CX = 300, R = .12 * PX;

// Altura y velocidad del centro del balón en el instante t
function kinematics(t) {
  const tau = ((t % T) + T) % T;
  if (tau < T_DOWN) return { h: HAND - (V_PUSH * tau + G * tau * tau / 2), v: -(V_PUSH + G * tau) };
  const s = tau - T_DOWN;
  return { h: FLOOR_C + V_OUT * s - G * s * s / 2, v: V_OUT - G * s };
}

// Lo que leería el acelerómetro: un pico estrecho en cada impacto y un empujón suave de la mano
function force(t) {
  let f = 2.5 * Math.sin(t * 157) + 1.5 * Math.sin(t * 411);
  IMPACTS.forEach((ti, i) => { f += FORCES[i] * Math.exp(-(((t - ti) / .011) ** 2)); });
  for (let i = 0; i <= N; i++) f += 38 * Math.exp(-(((t - i * T - .03) / .035) ** 2));
  return Math.max(0, f);
}

export function initDribble({ reduce }) {
  const plate = document.getElementById("bouncePlate");
  const layer = document.getElementById("bounceBallLayer");
  const shadow = document.getElementById("bounceShadow");
  const impact = document.getElementById("bounceImpact");
  const out = {
    n: document.getElementById("bN"), f: document.getElementById("bF"),
    v: document.getElementById("bV"), dir: document.getElementById("bDir"), r: document.getElementById("bR"),
  };
  out.r.textContent = `${fmt(1 / T)} botes/s`;

  // regla en metros
  const ruler = document.getElementById("bounceRuler");
  [0, .5, 1].forEach(m => {
    const y = FLOOR_Y - m * PX;
    svgEl("line", { x1: 24, y1: y, x2: 48, y2: y }, ruler);
    svgEl("text", { x: 54, y: y + 4 }, ruler).textContent = `${fmt(m, 1)} m`;
  });

  const ball = ballAt(layer, CX, FLOOR_Y - HAND * PX, R);
  ball.id = "dribbleBall";

  // --- gráfica de fuerza en el tiempo ---
  const X0 = 40, X1 = 352, Y0 = 126, FMAX = 600;
  const cx = t => X0 + t / TOTAL * (X1 - X0);
  const cy = f => Y0 - f / FMAX * 112;
  const axis = document.getElementById("chartAxis");
  [0, 250, 500].forEach(f => {
    svgEl("line", { x1: X0, y1: cy(f), x2: X1, y2: cy(f), class: f ? "grid" : "base" }, axis);
    svgEl("text", { x: X0 - 6, y: cy(f) + 3, "text-anchor": "end" }, axis).textContent = f;
  });
  svgEl("text", { x: X0 - 6, y: 10, "text-anchor": "end" }, axis).textContent = "N";
  const pts = [];
  for (let t = 0; t <= TOTAL; t += .002) pts.push(`${cx(t).toFixed(1)},${cy(force(t)).toFixed(1)}`);
  document.getElementById("chartTrace").setAttribute("d", `M${pts.join("L")}`);
  const reveal = document.getElementById("chartReveal");
  const cursor = document.getElementById("chartCursor");
  const rhythm = document.getElementById("chartRhythm");

  // cifras que ruedan, como en la lectura del tiro
  const shown = { f: 0, v: 0 };
  const printF = () => { out.f.textContent = shown.f ? Math.round(shown.f) : "—"; };

  function lastImpact(t) {
    let k = -1;
    IMPACTS.forEach((ti, i) => { if (ti <= t) k = i; });
    return k;
  }

  function render(t) {
    const { h, v } = kinematics(t);
    // aplastamiento: el balón se achata contra el suelo y se ensancha un poco
    const near = IMPACTS.reduce((m, ti) => Math.min(m, Math.abs(t - ti)), Infinity);
    const k = near < SQUASH_T ? 1 - near / SQUASH_T : 0;
    const sy = 1 - .2 * k, sx = 1 + .1 * k;
    const y = FLOOR_Y - (k ? Math.min(h, FLOOR_C * sy) : h) * PX;
    const rot = t * 140;   // el empujón de la mano le da un giro lento
    ball.squash = { x: sx, y: sy };
    // con 3D, el aplastamiento lo aplica la capa WebGL; sin 3D, el propio SVG
    const flat = plate.classList.contains("has-3d") ? "" : ` scale(${sx} ${sy})`;
    ball.setAttribute("transform", `translate(${CX} ${y})${flat} rotate(${rot})`);
    Object.assign(ball.dataset, { cx: CX, cy: y });

    const hn = (h - FLOOR_C) / (HAND - FLOOR_C);
    shadow.setAttribute("rx", R * (1.15 - .5 * hn));
    shadow.style.opacity = .7 - .5 * hn;

    const i = Math.min(N - 1, Math.floor(t / T));
    out.n.textContent = i + 1;
    out.v.textContent = `${fmt(Math.abs(v))} m/s`;
    out.dir.textContent = v < 0 ? "bajando" : "subiendo";

    const x = cx(Math.min(t, TOTAL));
    reveal.setAttribute("width", x);
    cursor.setAttribute("x1", x);
    cursor.setAttribute("x2", x);

    // corchete del ritmo entre los dos últimos impactos
    const last = lastImpact(t);
    if (last >= 1) {
      const a = cx(IMPACTS[last - 1]), b = cx(IMPACTS[last]);
      rhythm.querySelector("path").setAttribute("d", `M${a} 132V138H${b}V132`);
      const label = rhythm.querySelector("text");
      label.setAttribute("x", (a + b) / 2);
      label.setAttribute("y", 149);
      label.textContent = `${fmt(T)} s`;
      rhythm.style.opacity = 1;
    } else {
      rhythm.style.opacity = 0;
    }
    return last;
  }

  function onImpact(i) {
    flash(ball);
    gsap.to(shown, { f: FORCES[i], duration: .45, ease: "power2.out", overwrite: true, onUpdate: printF });
    const w = 70 * FORCES[i] / 500;
    gsap.fromTo(impact,
      { attr: { x1: CX - 12, x2: CX + 12 }, opacity: 1 },
      { attr: { x1: CX - w, x2: CX + w }, opacity: 0, duration: .7, ease: "expo.out" });
  }

  if (reduce) {
    const t = 2 * T + T_DOWN + .05;
    render(t);
    shown.f = FORCES[2];
    printF();
    reveal.setAttribute("width", X1);
    return;
  }

  const state = { t: 0 };
  let prev = 0;
  render(0);
  const tick = () => {
    const t = state.t;
    const last = render(t);
    if (t > prev) {
      IMPACTS.forEach((ti, i) => { if (ti > prev && ti <= t) onImpact(i); });
    } else if (t < prev) {
      // hacia atrás: sin destellos, la fuerza vuelve a la del último impacto que queda
      gsap.to(shown, { f: last >= 0 ? FORCES[last] : 0, duration: .3, overwrite: true, onUpdate: printF });
    }
    prev = t;
  };

  ScrollTrigger.create({
    trigger: ".dribble", start: "top top", end: "bottom bottom",
    onUpdate: self => gsap.to(state, {
      t: self.progress * TOTAL * .999, duration: .5, ease: "power2.out", overwrite: true, onUpdate: tick,
    }),
  });
}
