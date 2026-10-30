// Sonido de obturador, sintetizado con Web Audio (sin archivos).
// Apagado por defecto: solo suena si el visitante lo activa en la navegación.
let ctx = null;
let enabled = false;
let last = 0;

export function initSound() {
  const button = document.querySelector(".sound");
  button.addEventListener("click", () => {
    enabled = !enabled;
    button.setAttribute("aria-pressed", String(enabled));
    // el navegador solo deja crear audio tras un gesto del usuario: este clic
    if (enabled && !ctx) ctx = new AudioContext();
    if (enabled) shutter();
  });
}

// Un clic seco (ráfaga de ruido filtrada) y un golpe grave muy corto, como un obturador
export function shutter() {
  if (!enabled || !ctx) return;
  const now = ctx.currentTime;
  if (now - last < .06) return;   // en un scroll rápido no se amontonan
  last = now;

  const noise = ctx.createBuffer(1, ctx.sampleRate * .05, ctx.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length) ** 3;
  const src = ctx.createBufferSource();
  src.buffer = noise;
  const band = ctx.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = 2600;
  band.Q.value = .8;
  const g = ctx.createGain();
  g.gain.value = .22;
  src.connect(band).connect(g).connect(ctx.destination);
  src.start(now);

  const thump = ctx.createOscillator();
  thump.frequency.setValueAtTime(140, now);
  thump.frequency.exponentialRampToValueAtTime(60, now + .06);
  const tg = ctx.createGain();
  tg.gain.setValueAtTime(.12, now);
  tg.gain.exponentialRampToValueAtTime(.001, now + .07);
  thump.connect(tg).connect(ctx.destination);
  thump.start(now);
  thump.stop(now + .08);
}
