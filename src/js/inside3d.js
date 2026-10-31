import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { makeBallMaterial, createRenderer, studioScene, renderWhileVisible, warmUp } from "./ball3d.js";

// ---------------------------------------------------------------------------
// "Por dentro" en 3D. El balón se abre por su costura central (el plano x = 0)
// y deja ver la cámara, la suspensión de 6 tirantes y el módulo de sensores.
// El scroll mueve una sola variable, p (0 → 1), y todo se deriva de ella.
// ---------------------------------------------------------------------------

const ease = (a, b, p) => {
  const t = Math.min(1, Math.max(0, (p - a) / (b - a)));
  return t * t * (3 - 2 * t);   // smoothstep
};

// Media esfera con la textura del balón entero: SphereGeometry reparte la
// textura en el trozo que dibuja, así que se corrige la u para que cada
// mitad muestre su mitad del cuero (y la costura caiga en su sitio)
function halfSphere(r, phiStart, segments = 96) {
  const geo = new THREE.SphereGeometry(r, segments, segments * 2 / 3, phiStart, Math.PI);
  const uv = geo.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setX(i, (phiStart + uv.getX(i) * Math.PI) / (2 * Math.PI));
  return geo;
}

const LABELS = [
  { key: "cubierta",   k: "CUBIERTA",           v: "Composite granulado, 8 gajos", at: .32, pos: [.05, .72] },
  { key: "camara",     k: "CÁMARA",             v: "Butilo, 0,6 bar",              at: .48, pos: [.64, .17] },
  { key: "suspension", k: "SUSPENSIÓN",         v: "6 tirantes centran el módulo", at: .66, pos: [.06, .9] },
  { key: "modulo",     k: "MÓDULO DE SENSORES", v: "Acelerómetro y giroscopio",    at: .82, pos: [.64, .88] },
];

export function initInside3D({ reduce }) {
  const section = document.querySelector(".inside");
  const stage = section.querySelector(".stage");
  let renderer;
  try { renderer = createRenderer(); } catch { return null; }
  const canvas = renderer.domElement;
  canvas.className = "scene3d";
  stage.querySelector("#explodePlate").after(canvas);
  section.classList.add("has-3d");

  const { scene } = studioScene();
  const camera = new THREE.PerspectiveCamera(30, 1, .1, 100);

  // --- el conjunto ---
  const assembly = new THREE.Group();
  assembly.position.y = -.12;
  scene.add(assembly);

  const innerMat = new THREE.MeshStandardMaterial({ color: "#3a2a20", roughness: .9, side: THREE.BackSide });
  const rimMat = new THREE.MeshStandardMaterial({ color: "#2a1d15", roughness: .8, side: THREE.DoubleSide });
  const halves = [-1, 1].map(side => {
    const phi = side < 0 ? Math.PI * 1.5 : Math.PI * .5;
    const half = new THREE.Group();
    half.add(new THREE.Mesh(halfSphere(1, phi), makeBallMaterial()));
    half.add(new THREE.Mesh(halfSphere(.965, phi, 64), innerMat));
    const rim = new THREE.Mesh(new THREE.RingGeometry(.965, 1, 96), rimMat);
    rim.rotation.y = Math.PI / 2;      // la cara del corte mira al otro lado
    half.add(rim);
    half.userData.side = side;
    assembly.add(half);
    return half;
  });

  const bladderMat = new THREE.MeshPhysicalMaterial({
    color: "#d8cfc0", roughness: .22, clearcoat: 1, transparent: true, opacity: 0, depthWrite: false,
  });
  const bladder = new THREE.Mesh(new THREE.SphereGeometry(.9, 64, 48), bladderMat);
  assembly.add(bladder);

  // seis tirantes en las direcciones de un octaedro: del módulo a la cámara
  const carbon = new THREE.MeshStandardMaterial({ color: "#2b2622", roughness: .4, metalness: .3 });
  const silver = new THREE.MeshStandardMaterial({ color: "#d8cfc0", roughness: .3, metalness: .6 });
  const spokeGeo = new THREE.CylinderGeometry(.008, .008, .76, 12).translate(0, .14 + .38, 0);
  const nodeGeo = new THREE.SphereGeometry(.022, 16, 12).translate(0, .9, 0);
  const up = new THREE.Vector3(0, 1, 0);
  const spokes = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]].map(d => {
    const g = new THREE.Group();
    g.quaternion.setFromUnitVectors(up, new THREE.Vector3(...d));
    g.add(new THREE.Mesh(spokeGeo, carbon), new THREE.Mesh(nodeGeo, silver));
    assembly.add(g);
    return g;
  });

  // módulo: carcasa oscura, aristas en el naranja del cuero, contactos dorados y un led
  const module = new THREE.Group();
  const caseMesh = new THREE.Mesh(new THREE.BoxGeometry(.24, .24, .24),
    new THREE.MeshPhysicalMaterial({ color: "#1d1713", roughness: .35, metalness: .2, clearcoat: .6 }));
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(caseMesh.geometry),
    new THREE.LineBasicMaterial({ color: "#e2591f" }));
  const gold = new THREE.MeshStandardMaterial({ color: "#d4a656", metalness: 1, roughness: .25 });
  module.add(caseMesh, edges);
  [[-.05, -.05], [.05, -.05], [-.05, .05], [.05, .05]].forEach(([x, y]) => {
    const pad = new THREE.Mesh(new THREE.BoxGeometry(.034, .034, .008), gold);
    pad.position.set(x, y - .02, .122);
    module.add(pad);
  });
  const led = new THREE.Mesh(new THREE.SphereGeometry(.012, 12, 8),
    new THREE.MeshStandardMaterial({ color: "#ff8a4c", emissive: "#ff6a2c", emissiveIntensity: 2 }));
  led.position.set(.075, .08, .122);
  module.add(led);
  assembly.add(module);

  // --- etiquetas con línea guía, en una capa SVG en píxeles ---
  const NS = "http://www.w3.org/2000/svg";
  const overlay = document.createElementNS(NS, "svg");
  overlay.classList.add("leaders");
  overlay.setAttribute("aria-hidden", "true");
  canvas.after(overlay);
  const labels = LABELS.map(l => {
    const g = document.createElementNS(NS, "g");
    g.innerHTML = `<polyline/><circle r="4"/><text class="k">${l.k}</text><text class="v">${l.v}</text><line class="u"/>`;
    overlay.append(g);
    return { ...l, g };
  });
  // puntos de cada pieza a los que apunta su etiqueta (en coordenadas de la pieza)
  const anchors = {
    cubierta: [halves[0], new THREE.Vector3(-.55, -.4, .73)],
    camara: [assembly, new THREE.Vector3(.2, .82, .32)],
    suspension: [spokes[3], new THREE.Vector3(0, .9, 0)],
    modulo: [module, new THREE.Vector3(.12, -.12, .12)],
  };

  const portrait = matchMedia("(max-aspect-ratio: 1/1)");
  const state = { p: reduce ? 1 : 0 };
  const v = new THREE.Vector3();

  function frame() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (w !== canvas._w || h !== canvas._h) {
      renderer.setSize(w, h);
      camera.aspect = w / h;
      canvas._w = w; canvas._h = h;
      overlay.setAttribute("viewBox", `0 0 ${w} ${h}`);
    }
    const p = state.p, narrow = portrait.matches;
    const sep = narrow ? .75 : 1.3;

    // la cámara se aleja lo justo para que quepa el balón abierto
    const halfW = sep + 1.2, halfH = 1.3, t = Math.tan(THREE.MathUtils.degToRad(15));
    camera.position.set(0, 0, Math.max(halfH / t, halfW / (t * camera.aspect)) * 1.1);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();

    const open = ease(0, .45, p);
    halves.forEach(half => {
      const s = half.userData.side;
      half.position.x = s * open * sep;
      half.rotation.y = s * open * .35;
    });
    assembly.rotation.set(.3 - p * .12, -.6 + p * .5, 0);
    bladderMat.opacity = ease(.22, .5, p) * .24;
    bladder.scale.setScalar(.92 + .08 * ease(.22, .5, p));
    const grow = Math.max(.001, ease(.45, .7, p));
    spokes.forEach(s => s.scale.set(1, grow, 1));
    module.scale.setScalar(Math.max(.001, ease(.62, .8, p)));
    module.rotation.set(p * .6, p * 1.2, 0);
    led.material.emissiveIntensity = 1 + Math.sin(performance.now() / 300) * .8;

    renderer.render(scene, camera);

    // proyectar cada ancla a píxeles y unirla con su etiqueta
    labels.forEach(l => {
      const on = p >= l.at;
      l.g.style.opacity = on ? 1 : 0;
      if (!on || narrow) return;
      const [obj, local] = anchors[l.key];
      v.copy(local);
      obj.localToWorld(v);
      v.project(camera);
      const ax = (v.x + 1) / 2 * w, ay = (1 - v.y) / 2 * h;
      const lx = l.pos[0] * w, ly = l.pos[1] * h, uw = 250;
      const end = Math.abs(ax - lx) < Math.abs(ax - (lx + uw)) ? lx : lx + uw;
      l.g.querySelector("polyline").setAttribute("points", `${ax},${ay} ${end},${ly + 10}`);
      l.g.querySelector("circle").setAttribute("cx", ax);
      l.g.querySelector("circle").setAttribute("cy", ay);
      const [tk, tv] = l.g.querySelectorAll("text");
      tk.setAttribute("x", lx); tk.setAttribute("y", ly - 18);
      tv.setAttribute("x", lx); tv.setAttribute("y", ly + 2);
      const u = l.g.querySelector(".u");
      u.setAttribute("x1", lx); u.setAttribute("y1", ly + 10);
      u.setAttribute("x2", lx + uw); u.setAttribute("y2", ly + 10);
    });
  }

  warmUp(renderer, scene, camera);
  if (!reduce) {
    ScrollTrigger.create({
      trigger: section, start: "top top", end: "bottom bottom",
      onUpdate: self => gsap.to(state, { p: self.progress, duration: .6, ease: "power2.out", overwrite: true }),
    });
  }
  renderWhileVisible(stage, frame);
  return canvas;
}
