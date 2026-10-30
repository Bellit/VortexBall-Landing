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
initShot(opts);
initIdea(opts);
initInside(opts);
initDribble(opts);
initSessions(opts);
initFinishes(opts);
initWaitlist();

// las fuentes cambian medidas: recalcular los disparadores cuando estén listas
document.fonts.ready.then(() => ScrollTrigger.refresh());
