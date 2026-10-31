// La intro de revelado oculta el primer pantallazo hasta que arranca.
// Si algo falla, a los 4 s se muestra todo igualmente.
// Va en un archivo aparte (y no dentro del HTML) para que la política de
// seguridad (CSP de vercel.json) pueda prohibir cualquier script en línea.
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.documentElement.classList.add("intro");
  window.introFailsafe = setTimeout(() => document.documentElement.classList.remove("intro"), 4000);
}
