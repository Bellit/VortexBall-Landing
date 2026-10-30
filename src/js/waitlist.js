// Formulario de demostración: valida en el navegador y no envía nada
export function initWaitlist() {
  const form = document.querySelector(".waitlist");
  const input = form.querySelector("input");
  const msg = document.querySelector(".waitlist-msg");

  form.addEventListener("submit", e => {
    e.preventDefault();
    const ok = input.value.trim() !== "" && input.checkValidity();
    input.setAttribute("aria-invalid", String(!ok));
    msg.textContent = ok
      ? "Gracias. VORTEX es un concepto, así que no se ha enviado nada."
      : "Ese correo no parece válido. Prueba con algo como tu@correo.com.";
    if (ok) form.reset();
  });

  input.addEventListener("input", () => input.removeAttribute("aria-invalid"));
}
