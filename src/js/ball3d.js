import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { gsap } from "gsap";

// ---------------------------------------------------------------------------
// El balón en 3D. Aquí vive lo compartido por todas las escenas: texturas del
// cuero, material por acabado y luz de estudio. Además, `initBall3D` monta una
// capa WebGL encima de las placas SVG (tiro, acabados y cierre): los balones SVG
// siguen marcando posición, giro y opacidad, y esta capa dibuja un balón real.
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
  lo: { maps: null, cache: {}, current: null, mats: new Set(), renderers: new Set() },
  hi: { maps: null, cache: {}, current: null, mats: new Set(), renderers: new Set() },
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
    tier.renderers.forEach(r => { r.initTexture(map); r.initTexture(bump); });
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

// Renderer con el tono de color de toda la web
export function createRenderer() {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.setAttribute("aria-hidden", "true");
  return renderer;
}

// Luz de estudio: principal cálida arriba a la izquierda, contorno por detrás a
// la derecha para recortar la silueta sobre el fondo oscuro, y un relleno suave
export function studioScene(renderer) {
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), .04).texture;
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
  const tier = tiers[level];
  tier.renderers.add(renderer);
  const { map, bump } = texturesOf(tier);
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

  const { scene } = studioScene(renderer);
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
      renderer.setSize(w, h, false);
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
        ball = new THREE.Group();
        ball.add(mesh);
        scene.add(ball);
        balls.set(el, ball);
      }
      const use = el.querySelector("use");
      const r = (parseFloat(use?.getAttribute("width")) || 64) * 30 / 64;
      const ctm = el.getCTM();
      if (!ctm) return;
      const s = Math.hypot(ctm.a, ctm.b);
      ball.position.set(ctm.e, -ctm.f, 0);
      ball.scale.setScalar(r * s);
      ball.rotation.z = -Math.atan2(ctm.b, ctm.a);
      const mat = ball.children[0].material;
      mat.opacity = opacityOf(el, svg);
      // una exposición translúcida no tapa a las demás: se pinta detrás y sin profundidad,
      // así dos balones que se solapan no se cortan con un borde recto
      const solid = mat.opacity > .98;
      mat.depthWrite = solid;
      ball.children[0].renderOrder = solid ? 1 : 0;
      mat.emissiveIntensity = (el.glow?.v ?? 0) * .6;
      ball.visible = mat.opacity > .005;
    });
    balls.forEach((ball, el) => {
      if (seen.has(el)) return;
      scene.remove(ball);
      tiers.lo.mats.delete(ball.children[0].material);
      ball.children[0].material.dispose();
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
