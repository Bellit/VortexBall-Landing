import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Parte un titular en sus líneas tal como las ha compuesto el navegador.
// Cada línea queda dentro de una máscara (.line) para que el texto suba
// desde detrás de ella. `revert` devuelve el HTML original al terminar,
// así el titular vuelve a reajustarse solo si cambia el ancho.
export function splitLines(el) {
  const original = el.innerHTML;

  const wrapWords = node => {
    if (node.nodeType === Node.TEXT_NODE) {
      const frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) return frag.append(part);
        const s = document.createElement("span");
        s.textContent = part;
        frag.append(s);
      });
      node.replaceWith(frag);
    } else {
      [...node.childNodes].forEach(wrapWords);
    }
  };
  [...el.childNodes].forEach(wrapWords);

  // agrupar los nodos de primer nivel por la altura a la que caen
  const lines = [];
  let top = null;
  [...el.childNodes].forEach(node => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const y = node.getBoundingClientRect().top;
      if (top === null || Math.abs(y - top) > 4) { lines.push([]); top = y; }
    }
    lines.at(-1)?.push(node);
  });

  el.textContent = "";
  const inners = lines.map(nodes => {
    const line = document.createElement("span");
    line.className = "line";
    const inner = document.createElement("span");
    inner.className = "line-in";
    inner.append(...nodes);
    line.append(inner);
    el.append(line);
    return inner;
  });

  return { inners, revert: () => { el.innerHTML = original; } };
}

// Los h2 de cada sección suben línea a línea al entrar en pantalla
export function initHeadingReveals({ reduce }) {
  if (reduce) return;
  document.querySelectorAll("main h2").forEach(h => {
    const { inners, revert } = splitLines(h);
    gsap.set(inners, { yPercent: 110 });
    ScrollTrigger.create({
      trigger: h, start: "top 88%", once: true,
      onEnter: () => gsap.to(inners, {
        yPercent: 0, duration: 1.1, stagger: .1, ease: "expo.out", onComplete: revert,
      }),
    });
  });
}
