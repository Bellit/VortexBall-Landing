// Punto de entrada: fuentes, estilos, scroll suave y cada sección de la página
import "@fontsource-variable/archivo/wdth.css";
import "@fontsource-variable/martian-mono";
import "lenis/dist/lenis.css";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/sections.css";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import { initShot } from "./js/shot.js";
import { initIdea } from "./js/idea.js";
import { initInside } from "./js/inside.js";
import { initDribble } from "./js/dribble.js";
import { initSessions } from "./js/sessions.js";
import { initFinishes } from "./js/finishes.js";
import { initWaitlist } from "./js/waitlist.js";
import { initGrain } from "./js/grain.js";
import { initHeadingReveals } from "./js/lines.js";
import { playIntro } from "./js/intro.js";
import { initSound } from "./js/sound.js";
import { initFrameCounter } from "./js/counter.js";

gsap.registerPlugin(ScrollTrigger);

// Quien pide menos movimiento recibe el relato completo, sin animaciones
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
document.documentElement.classList.toggle("reduced", reduce);

if (!reduce) {
  const lenis = new Lenis({ lerp: .1, anchors: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

const opts = { reduce };
initGrain(opts);
const shot = initShot(opts);
initIdea(opts);
initInside(opts);
initDribble(opts);
initSessions(opts);
initFinishes(opts);
initWaitlist(opts);
initSound();
initFrameCounter();

// El balón 3D (Three.js) se carga aparte para no frenar el resto de la página.
// Si no llega en 1,5 s o no hay WebGL, la página sigue con los balones SVG.
const ball3d = Promise.all([import("./js/ball3d.js"), import("./js/inside3d.js"), import("./js/macro3d.js")])
  .then(async ([{ initBall3D }, { initInside3D }, { initMacro3D }]) => {
    const mounted = await initBall3D([
      [document.getElementById("shotPlate"), "#exposures > g"],
      [document.querySelector(".finishes-ball svg"), "#finishBall, #finishGhosts > g"],
      [document.querySelector(".close-ball svg"), "#closeBall"],
      [document.getElementById("bouncePlate"), "#dribbleBall"],
    ]);
    if (!mounted.length) return null;   // sin WebGL: todo sigue en SVG
    initInside3D(opts);
    initMacro3D(opts);
    ScrollTrigger.refresh();
    return mounted;
  })
  .catch(() => null);
const atMost = ms => new Promise(r => setTimeout(r, ms));

// Partir titulares en líneas exige medir el texto con su fuente real:
// por eso las máscaras y la intro esperan a que las fuentes estén listas.
Promise.all([document.fonts.ready, Promise.race([ball3d, atMost(1500)])]).then(() => {
  initHeadingReveals(opts);
  playIntro(shot);
  ScrollTrigger.refresh();
});
