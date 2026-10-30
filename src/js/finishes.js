import { gsap } from "gsap";
import { svgEl, flash } from "./geometry.js";

// Cambiar de acabado solo cambia un atributo; los colores viven en tokens.css.
// El cambio se cuenta con la gramática de la placa: el balón entra rodando
// por el suelo y deja tres exposiciones que se apagan.
export function initFinishes({ reduce }) {
  const root = document.documentElement;
  const ghostsG = document.getElementById("finishGhosts");
  const ball = document.getElementById("finishBall");

  function rollIn() {
    ghostsG.replaceChildren();
    const ghosts = [-42, -28, -14].map((x, i) => {
      const g = svgEl("g", { transform: `translate(${x} 0) rotate(${(x / 30) * 57})` }, ghostsG);
      svgEl("use", { href: "#ball", x: -32, y: -32, width: 64, height: 64 }, g);
      g.style.opacity = .15 + i * .12;
      return g;
    });
    gsap.fromTo(ball, { rotation: -90, svgOrigin: "0 0" }, { rotation: 0, svgOrigin: "0 0", duration: .7, ease: "expo.out" });
    flash(ball);
    gsap.to(ghosts, { opacity: 0, duration: 1.1, stagger: .08, ease: "expo.out", delay: .2 });
  }

  document.querySelectorAll('input[name="finish"]').forEach(input => {
    input.addEventListener("change", () => {
      root.dataset.finish = input.value;
      document.dispatchEvent(new CustomEvent("finishchange", { detail: input.value }));
      if (!reduce) rollIn();
    });
  });
}
