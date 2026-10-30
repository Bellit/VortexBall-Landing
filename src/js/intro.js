import { gsap } from "gsap";
import { splitLines } from "./lines.js";

// Intro de revelado: la placa sale del negro como una copia en la cubeta,
// se disparan las primeras exposiciones y después aparece el texto.
export function playIntro(shot) {
  const root = document.documentElement;
  if (!root.classList.contains("intro")) return;
  clearTimeout(window.introFailsafe);

  const h1 = document.querySelector(".hero-copy h1");
  const { inners, revert } = splitLines(h1);
  const rest = [".hero-copy p", ".hero-copy .btn"];
  const chrome = [".nav", ".readout"];
  gsap.set(inners, { yPercent: 110 });
  gsap.set(h1, { visibility: "visible" });
  gsap.set(rest, { y: 14 });

  gsap.timeline({
    defaults: { ease: "expo.out" },
    onComplete: () => {
      revert();
      root.classList.remove("intro");
      gsap.set([h1, ...rest, ...chrome], { clearProps: "opacity,visibility,transform" });
    },
  })
    .fromTo("#shotPlate, #tiro canvas.ball3d",
      { filter: "brightness(.06) contrast(1.6) sepia(.5)" },
      { filter: "brightness(1) contrast(1) sepia(0)", duration: 1.5, ease: "power2.out", clearProps: "filter" }, 0)
    .add(shot.intro(), .45)
    .to(inners, { yPercent: 0, duration: 1.1, stagger: .12 }, .75)
    .to(rest, { opacity: 1, y: 0, duration: .9, stagger: .08 }, 1.05)
    .to(chrome, { opacity: 1, duration: .8 }, 1.2);
}
