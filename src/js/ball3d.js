import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { gsap } from "gsap";

// ---------------------------------------------------------------------------
// El balón en 3D. Aquí vive lo compartido por todas las escenas: el renderer
// único, las texturas del cuero, el material por acabado y la luz de estudio.
// Además, `initBall3D` monta una capa 3D encima de las placas SVG que lo piden
// (tiro, bote, sesión, acabados y cierre): los balones SVG siguen marcando
// posición, giro y opacidad, y esta capa dibuja un balón real en su sitio.
// ---------------------------------------------------------------------------

// El material de cada acabado. Los colores (cuero y costura) no se escriben aquí:
// se leen de tokens.css (--ball-mid y --ball-seam) para que el balón 3D y las
// muestras del selector salgan siempre del mismo sitio.
const FINISHES = {
  cuero:   { base: [226, 89, 31], seam: [20, 15, 11], roughness: .62, clearcoat: 0 },
  noche:   { base: [51, 40, 31],  seam: [216, 207, 192], roughness: .42, clearcoat: .35 },
  asfalto: { base: [196, 134, 58], seam: [28, 22, 17], roughness: .85, clearcoat: 0 },
};

function readFinishColors() {
  const probe = document.createElement("div");
  probe.hidden = true;
  document.body.append(probe);
  const rgb = v => v.match(/\d+(\.\d+)?/g)?.slice(0, 3).map(Number);
  for (const [name, f] of Object.entries(FINISHES)) {
    probe.dataset.finish = name;
    const cs = getComputedStyle(probe);
    const base = rgb(cs.getPropertyValue("--ball-mid")), seam = rgb(cs.getPropertyValue("--ball-seam"));
    if (base?.length === 3) f.base = base;     // si algo falla, se quedan los de arriba
    if (seam?.length === 3) f.seam = seam;
  }
  probe.remove();
}

const SEAM_HALF = .03;            // media anchura de la costura, en radianes
const CURVE = .92;                // radio angular de las costuras curvas

// Dos niveles de textura: "lo" (1536 px) para los balones que se ven pequeños o
// medianos, y "hi" (3072 px) solo para el primer plano. Cada escena tiene su
// propio contexto WebGL, así que subir la textura grande a todas sería tirar memoria.
// Mientras "hi" no está lista, sus materiales usan la de "lo".
const tiers = {
  lo: { maps: null, cache: {}, current: null, mats: new Set() },
  hi: { maps: null, cache: {}, current: null, mats: new Set() },
};
let finish = document.documentElement.dataset.finish || "cuero";

const yieldFrame = () => new Promise(r => setTimeout(r, 0));

// Ruido de granulado y máscara de costuras sobre la esfera (textura equirectangular).
// Un balón tiene dos círculos máximos (y = 0, x = 0) y dos costuras curvas
// alrededor de los ejes ±x. Con `chunked` el cálculo se reparte en trozos
// para no bloquear el scroll.
async function buildMaps(TW, chunked = false) {
  const TH = TW / 2;
  const small = document.createElement("canvas");
  small.width = TW / 2; small.height = TH / 2;
  const sctx = small.getContext("2d");
  const sd = sctx.createImageData(small.width, small.height);
  for (let i = 0; i < sd.data.length; i += 4) {
    const v = Math.random() * 255;
    sd.data[i] = sd.data[i + 1] = sd.data[i + 2] = v;
    sd.data[i + 3] = 255;
  }
  sctx.putImageData(sd, 0, 0);
  const big = document.createElement("canvas");
  big.width = TW; big.height = TH;
  const bctx = big.getContext("2d");
  bctx.drawImage(small, 0, 0, TW, TH);   // al escalar se suaviza: granos redondeados
  const noise = bctx.getImageData(0, 0, TW, TH).data;

  const seam = new Float32Array(TW * TH);
  for (let py = 0; py < TH; py++) {
    const th = (py + .5) / TH * Math.PI, st = Math.sin(th), y = Math.cos(th);
    for (let px = 0; px < TW; px++) {
      const ph = (px + .5) / TW * 2 * Math.PI;
      const x = -Math.cos(ph) * st;
      const d = Math.min(
        Math.abs(Math.asin(y)),
        Math.abs(Math.asin(x)),
        Math.abs(Math.acos(Math.min(1, x)) - CURVE),
        Math.abs(Math.acos(Math.min(1, -x)) - CURVE),
      );
      seam[py * TW + px] = Math.max(0, 1 - d / SEAM_HALF);
    }
    if (chunked && py % 48 === 47) await yieldFrame();
  }

  // relieve: granos en el cuero y un surco donde va la costura
  const bump = document.createElement("canvas");
  bump.width = TW; bump.height = TH;
  const bc = bump.getContext("2d");
  const bd = bc.createImageData(TW, TH);
  for (let i = 0; i < TW * TH; i++) {
    const n = noise[i * 4] / 255;
    const h = (.5 + .5 * n) * (1 - Math.min(1, seam[i] * 1.5));
    bd.data[i * 4] = bd.data[i * 4 + 1] = bd.data[i * 4 + 2] = h * 255;
    bd.data[i * 4 + 3] = 255;
    if (chunked && i % 300000 === 299999) await yieldFrame();
  }
  bc.putImageData(bd, 0, 0);
  const bumpTex = new THREE.CanvasTexture(bump);
  bumpTex.wrapS = THREE.RepeatWrapping;
  return { TW, TH, noise, seam, bumpTex };
}

// Color del cuero para un acabado, también en trozos para no frenar el scroll
async function buildColor(m, name, chunked) {
  const { TW, TH } = m;
  const { base, seam: sc } = FINISHES[name];
  const c = document.createElement("canvas");
  c.width = TW; c.height = TH;
  const ctx = c.getContext("2d");
  const img = ctx.createImageData(TW, TH);
  for (let i = 0; i < TW * TH; i++) {
    const n = m.noise[i * 4] / 255;
    const s = Math.min(1, Math.max(0, (m.seam[i] - .3) / .35));   // borde suave
    const k = .84 + .26 * n;                                      // el grano varía el tono
    for (let ch = 0; ch < 3; ch++) {
      img.data[i * 4 + ch] = Math.min(255, base[ch] * k) * (1 - s) + sc[ch] * s;
    }
    img.data[i * 4 + 3] = 255;
    if (chunked && i % 200000 === 199999) await yieldFrame();
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  return tex;
}

// La caché guarda promesas: si dos partes piden el mismo acabado, se calcula una vez
const colorFor = (tier, name, chunked = true) => (tier.cache[name] ??= buildColor(tier.maps, name, chunked));

// Textura de color y relieve que usa ahora un nivel (o la de "lo" si aún no tiene)
const texturesOf = tier => tier.maps && tier.current
  ? { map: tier.current, bump: tier.maps.bumpTex }
  : { map: tiers.lo.current, bump: tiers.lo.maps.bumpTex };

// Material del cuero con el acabado actual. Todos se actualizan juntos.
export function makeBallMaterial(extra = {}, level = "lo") {
  const tier = tiers[level];
  const f = FINISHES[finish];
  const { map, bump } = texturesOf(tier);
  const m = new THREE.MeshPhysicalMaterial({
    map,
    bumpMap: bump,
    bumpScale: 3,
    roughness: f.roughness,
    clearcoat: f.clearcoat,
    clearcoatRoughness: .5,
    envMapIntensity: .35,
    emissive: new THREE.Color("#ff9a5c"),
    emissiveIntensity: 0,
    ...extra,
  });
  tier.mats.add(m);
  return m;
}

function refresh() {
  const f = FINISHES[finish];
  Object.values(tiers).forEach(tier => {
    const { map, bump } = texturesOf(tier);
    tier.mats.forEach(m => {
      m.map = map;
      m.bumpMap = bump;
      m.roughness = f.roughness;
      m.clearcoat = f.clearcoat;
      m.needsUpdate = true;
    });
    // subir ya las texturas nuevas a la GPU, no en el primer fotograma visible
    if (gl && tier.mats.size) { gl.initTexture(map); gl.initTexture(bump); }
  });
}

async function setFinish(name) {
  if (!FINISHES[name] || name === finish) return;
  finish = name;
  for (const tier of Object.values(tiers)) {
    if (!tier.maps) continue;
    const tex = await colorFor(tier, name);
    if (finish !== name) return;   // mientras tanto se eligió otro acabado
    tier.current = tex;
  }
  refresh();
}

// ---------------------------------------------------------------------------
// Un solo contexto WebGL para toda la página. Los navegadores limitan cuántos
// puede haber a la vez (en móviles, a veces 8 o menos) y cierran los antiguos
// sin avisar. Así que hay un único renderer fuera del DOM, y cada escena tiene
// su propio <canvas> 2D en su sitio de la página: el renderer dibuja la escena
// en una esquina de su lienzo y la copia a ese canvas. Las capas de cada
// sección (texto encima, viñeteado...) quedan exactamente como estaban.
// ---------------------------------------------------------------------------

let gl = null;        // el renderer compartido
let glW = 0, glH = 0; // su tamaño actual, en píxeles CSS

function shared() {
  if (gl) return gl;
  gl = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  gl.setPixelRatio(Math.min(devicePixelRatio, 2));
  gl.toneMapping = THREE.ACESFilmicToneMapping;
  gl.toneMappingExposure = 1.05;
  gl.outputColorSpace = THREE.SRGBColorSpace;
  gl.setClearColor(0x000000, 0);
  gl.setScissorTest(true);
  return gl;
}

// el lienzo compartido crece hasta la escena más grande que haya tenido que dibujar
function ensureSize(w, h) {
  if (w <= glW && h <= glH) return;
  glW = Math.max(glW, w);
  glH = Math.max(glH, h);
  gl.setSize(glW, glH, false);
}

// Una "vista": se usa como un renderer normal (setSize, render, domElement),
// pero dibuja con el renderer compartido y copia el resultado a su canvas
export function createRenderer() {
  const r = shared();   // si no hay WebGL, esto lanza un error y la escena se queda en SVG
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  const ctx = canvas.getContext("2d");
  let w = 1, h = 1;
  return {
    domElement: canvas,
    setSize(nw, nh) {
      w = Math.max(1, nw); h = Math.max(1, nh);
      const dpr = r.getPixelRatio();
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    },
    render(scene, camera) {
      ensureSize(w, h);
      r.setViewport(0, 0, w, h);
      r.setScissor(0, 0, w, h);
      r.render(scene, camera);
      // WebGL dibuja desde abajo: la esquina usada es la inferior del lienzo
      const src = r.domElement;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(src, 0, src.height - canvas.height, canvas.width, canvas.height,
        0, 0, canvas.width, canvas.height);
    },
    initTexture: t => r.initTexture(t),
    compileAsync: (scene, camera) => r.compileAsync(scene, camera),
  };
}

// El entorno de luz (reflejos de estudio) se calcula una vez y lo comparten todas las escenas
let environment = null;
function studioEnvironment() {
  if (!environment) environment = new THREE.PMREMGenerator(shared()).fromScene(new RoomEnvironment(), .04).texture;
  return environment;
}

// Luz de estudio: principal cálida arriba a la izquierda, contorno por detrás a
// la derecha para recortar la silueta sobre el fondo oscuro, y un relleno suave
export function studioScene() {
  const scene = new THREE.Scene();
  scene.environment = studioEnvironment();
  const key = new THREE.DirectionalLight("#fff1e0", 2.4);
  key.position.set(-1, 1.3, 1.6);
  const rim = new THREE.DirectionalLight("#ffd9b8", 3.2);
  rim.position.set(1.6, .9, -1.1);
  const fill = new THREE.HemisphereLight("#d8cfc0", "#1c1611", .35);
  scene.add(key, rim, fill);
  return { scene, key, rim, fill };
}

// Precalienta una escena al montarla: compila los shaders y sube las texturas.
// Sin esto, la primera vez que una sección entra en pantalla el scroll da un tirón.
export function warmUp(renderer, scene, camera, level = "lo") {
  const { map, bump } = texturesOf(tiers[level]);
  renderer.initTexture(map);
  renderer.initTexture(bump);
  renderer.compileAsync(scene, camera).catch(() => {});
}

// Dibuja la escena en cada fotograma solo mientras `el` está en pantalla
export function renderWhileVisible(el, frame) {
  let visible = false;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(el);
  gsap.ticker.add(() => { if (visible) frame(); });
}

// Orientación base del balón: enseña una costura curva y las dos rectas
export const BASE_ROTATION = new THREE.Euler(.35, -.85, .1);

// Opacidad efectiva de un elemento SVG: la suya por la de sus padres
function opacityOf(el, root) {
  let o = 1;
  for (let n = el; n && n !== root; n = n.parentNode) {
    const s = n.style?.opacity, a = n.getAttribute?.("opacity");
    if (s !== undefined && s !== "") o *= +s;
    if (a !== null && a !== undefined) o *= +a;
  }
  return o;
}

// Monta una capa 3D encima de `svg`. `selector` elige los grupos SVG que son balones.
function mountOverSvg(svg, selector) {
  let renderer;
  try { renderer = createRenderer(); } catch { return null; }
  const canvas = renderer.domElement;
  canvas.className = "ball3d";
  svg.after(canvas);
  svg.classList.add("has-3d");

  const { scene } = studioScene();
  // cámara ortográfica en píxeles del SVG: (0,0) arriba a la izquierda, y hacia abajo
  const camera = new THREE.OrthographicCamera(0, 1, 0, -1, -2000, 2000);
  camera.position.z = 1000;

  const balls = new Map();   // elemento SVG → grupo 3D
  const geo = new THREE.SphereGeometry(1, 96, 64);

  function sync() {
    const box = svg.getBoundingClientRect();
    const parent = canvas.parentElement.getBoundingClientRect();
    const w = Math.round(box.width), h = Math.round(box.height);
    if (w !== canvas._w || h !== canvas._h) {
      renderer.setSize(w, h);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      camera.right = w; camera.bottom = -h;
      camera.updateProjectionMatrix();
      canvas._w = w; canvas._h = h;
    }
    canvas.style.left = `${box.left - parent.left}px`;
    canvas.style.top = `${box.top - parent.top}px`;

    const seen = new Set();
    svg.querySelectorAll(selector).forEach(el => {
      seen.add(el);
      let ball = balls.get(el);
      if (!ball) {
        el.classList.add("b3d");
        const mesh = new THREE.Mesh(geo, makeBallMaterial({ transparent: true }));
        mesh.rotation.copy(BASE_ROTATION);
        // fuera: posición y escala (también el aplastamiento, siempre en vertical);
        // dentro: el giro del balón, que no debe torcer el aplastamiento
        const spin = new THREE.Group();
        spin.add(mesh);
        ball = new THREE.Group();
        ball.add(spin);
        ball.userData = { spin, mesh };
        scene.add(ball);
        balls.set(el, ball);
      }
      const { spin, mesh } = ball.userData;
      const use = el.querySelector("use");
      const r = (parseFloat(use?.getAttribute("width")) || 64) * 30 / 64;
      const ctm = el.getCTM();
      if (!ctm) return;
      const s = Math.hypot(ctm.a, ctm.b);
      const sq = el.squash ?? { x: 1, y: 1 };
      ball.position.set(ctm.e, -ctm.f, 0);
      ball.scale.set(r * s * sq.x, r * s * sq.y, r * s * sq.x);
      spin.rotation.z = -Math.atan2(ctm.b, ctm.a);
      const mat = mesh.material;
      mat.opacity = opacityOf(el, svg);
      // una exposición translúcida no tapa a las demás: se pinta detrás y sin profundidad,
      // así dos balones que se solapan no se cortan con un borde recto
      const solid = mat.opacity > .98;
      mat.depthWrite = solid;
      mesh.renderOrder = solid ? 1 : 0;
      mat.emissiveIntensity = (el.glow?.v ?? 0) * .6;
      ball.visible = mat.opacity > .005;
    });
    balls.forEach((ball, el) => {
      if (seen.has(el)) return;
      scene.remove(ball);
      tiers.lo.mats.delete(ball.userData.mesh.material);
      ball.userData.mesh.material.dispose();
      balls.delete(el);
    });
  }

  sync();
  warmUp(renderer, scene, camera);
  renderWhileVisible(svg, () => { sync(); renderer.render(scene, camera); });
  return canvas;
}

// Prepara las texturas y monta la capa 3D en las placas indicadas.
// En pantallas grandes, después calcula la textura grande para el primer plano.
export async function initBall3D(targets) {
  readFinishColors();
  const lo = tiers.lo;
  lo.maps = await buildMaps(1536);
  lo.current = await colorFor(lo, finish, false);
  document.addEventListener("finishchange", e => setFinish(e.detail));
  const mounted = targets.map(([svg, selector]) => mountOverSvg(svg, selector)).filter(Boolean);
  if (innerWidth > 800) {
    (async () => {
      const hi = tiers.hi;
      hi.maps = await buildMaps(3072, true);
      hi.current = await colorFor(hi, finish);
      refresh();
    })();
  }
  return mounted;
}
