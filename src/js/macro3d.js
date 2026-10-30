import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { makeBallMaterial, createRenderer, studioScene, renderWhileVisible, warmUp, BASE_ROTATION } from "./ball3d.js";

// ---------------------------------------------------------------------------
// Macro del detalle. La cámara se acerca desde el balón entero hasta el cruce
// de las dos costuras rectas, y la luz principal baja hasta quedar rasante
// para que cada grano del cuero proyecte su sombra.
// ---------------------------------------------------------------------------

const RADIUS_MM = 119;            // radio de un balón talla 7
const FOV = 28;
const FAR_Z = 4.6, NEAR_Z = 1.7;  // distancia de la cámara al centro del balón

export function initMacro3D({ reduce }) {
  const section = document.querySelector(".macro");
  const stage = section.querySelector(".stage");
  let renderer;
  try { renderer = createRenderer(); } catch { return null; }
  const canvas = renderer.domElement;
  canvas.className = "scene3d";
  stage.prepend(canvas);
  section.classList.add("has-3d");

  const { scene, key } = studioScene(renderer);
  const camera = new THREE.PerspectiveCamera(FOV, 1, .05, 50);

  // el único balón que usa la textura grande: es el que se ve de cerca
  const ball = new THREE.Mesh(new THREE.SphereGeometry(1, 192, 128), makeBallMaterial({}, "hi"));
  scene.add(ball);

  // de la orientación de siempre a una que pone de frente el cruce de costuras (0, 0, 1)
  const from = new THREE.Quaternion().setFromEuler(BASE_ROTATION);
  const to = new THREE.Quaternion().setFromEuler(new THREE.Euler(.12, -.2, .5));
  const keyFrom = key.position.clone();
  const keyTo = new THREE.Vector3(-1.2, .35, .35);   // casi paralela a la superficie

  const bar = section.querySelector(".macro-bar");
  const state = { p: reduce ? 1 : 0 };

  function frame() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (w !== canvas._w || h !== canvas._h) {
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      canvas._w = w; canvas._h = h;
    }
    const p = state.p;
    const t = p * p * (3 - 2 * p);
    const z = FAR_Z + (NEAR_Z - FAR_Z) * t;
    camera.position.set(.04 * t, -.02 * t, z);
    camera.lookAt(0, 0, 0);
    ball.quaternion.slerpQuaternions(from, to, t);
    key.position.lerpVectors(keyFrom, keyTo, t);
    renderer.render(scene, camera);

    // barra de escala: cuántos píxeles son 10 mm sobre la superficie que se ve
    const visibleH = 2 * (z - 1) * Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    bar.style.width = `${(10 / RADIUS_MM) / visibleH * h}px`;
    section.style.setProperty("--macro", t);
  }

  warmUp(renderer, scene, camera, "hi");
  if (!reduce) {
    ScrollTrigger.create({
      trigger: section, start: "top top", end: "bottom bottom",
      onUpdate: self => gsap.to(state, { p: self.progress, duration: .6, ease: "power2.out", overwrite: true }),
    });
  }
  renderWhileVisible(stage, frame);
  return canvas;
}
