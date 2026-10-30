import { ScrollTrigger } from "gsap/ScrollTrigger";

// Contador de película de la navegación: 144 fotogramas a lo largo de la página
const FRAMES = 144;

export function initFrameCounter() {
  const el = document.getElementById("frameCount");
  ScrollTrigger.create({
    start: 0, end: "max",
    onUpdate: self => { el.textContent = String(Math.round(self.progress * FRAMES)).padStart(3, "0"); },
  });
}
