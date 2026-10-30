import { gsap } from "gsap";

// Parte el texto en palabras (respetando el <em>) y las enciende con el scroll
export function initIdea({ reduce }) {
  const p = document.getElementById("manifesto");

  const wrap = node => {
    if (node.nodeType === Node.TEXT_NODE) {
      const frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) return frag.append(part);
        const s = document.createElement("span");
        s.className = "w";
        s.textContent = part;
        frag.append(s);
      });
      node.replaceWith(frag);
    } else {
      [...node.childNodes].forEach(wrap);
    }
  };
  [...p.childNodes].forEach(wrap);

  if (reduce) return;

  gsap.to(p.querySelectorAll(".w"), {
    opacity: 1, stagger: .1, ease: "none",
    scrollTrigger: { trigger: p, start: "top 80%", end: "bottom 45%", scrub: true },
  });
}
