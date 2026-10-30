import { gsap } from "gsap";
import { quad, svgEl, ballAt } from "./geometry.js";
import { shutter } from "./sound.js";

// Dibuja en la copia un tiro completo, con la misma gramática que la placa del inicio
function drawPrint(svg) {
  if (svg.childElementCount) return;
  const P0 = [70, 190], C = [300, -40], P2 = [520, 118];
  svgEl("line", { x1: 20, y1: 236, x2: 580, y2: 236, class: "print-floor" }, svg);
  const hoop = svgEl("g", { class: "print-hoop" }, svg);
  svgEl("line", { x1: 556, y1: 80, x2: 556, y2: 150 }, hoop);
  svgEl("line", { x1: 556, y1: 122, x2: 546, y2: 122 }, hoop);
  svgEl("ellipse", { cx: 522, cy: 122, rx: 20, ry: 4 }, hoop);
  svgEl("path", { d: `M${P0[0]} ${P0[1]} Q ${C[0]} ${C[1]} ${P2[0]} ${P2[1]}`, class: "print-path" }, svg);
  for (let i = 0; i < 9; i++) {
    const [x, y] = quad(P0, C, P2, i / 8);
    ballAt(svg, x, y, 14, -i * 40).style.opacity = i === 8 ? 1 : .35 + i * .06;
  }
}

// Formulario de demostración: valida en el navegador y no envía nada.
// Si el correo es válido, se revela una copia "a tu nombre", solo en esta página.
export function initWaitlist({ reduce }) {
  const form = document.querySelector(".waitlist");
  const input = form.querySelector("input");
  const msg = document.querySelector(".waitlist-msg");
  const print = document.querySelector(".print");

  form.addEventListener("submit", e => {
    e.preventDefault();
    const ok = input.value.trim() !== "" && input.checkValidity();
    input.setAttribute("aria-invalid", String(!ok));
    msg.textContent = ok
      ? "Gracias. VORTEX es un concepto, así que no se ha enviado nada."
      : "Ese correo no parece válido. Prueba con algo como tu@correo.com.";
    if (!ok) return;

    const name = input.value.trim().split("@")[0].replace(/[._-]+/g, " ")
      .replace(/(^|\s)\p{L}/gu, c => c.toUpperCase());
    form.reset();
    drawPrint(print.querySelector("svg"));
    print.querySelector(".print-name").textContent = `Primer tiro de ${name}`;
    print.querySelector(".print-date").textContent =
      new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
    print.hidden = false;
    shutter();
    if (reduce) return;
    // revelado: del negro de la cubeta a la copia en positivo
    gsap.fromTo(print,
      { filter: "brightness(0) sepia(1)", y: 24, opacity: 0 },
      { filter: "brightness(1) sepia(0)", y: 0, opacity: 1, duration: 2.2, ease: "power2.out", clearProps: "filter" });
  });

  input.addEventListener("input", () => input.removeAttribute("aria-invalid"));
}
