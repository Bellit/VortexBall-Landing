// Grano de emulsión: una tesela de ruido generada una vez en canvas y
// desplazada a saltos por CSS, como el grano de una película proyectada.
export function initGrain({ reduce }) {
  const size = 220;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  const img = ctx.createImageData(size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.random() * 255;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);

  const grain = document.createElement("div");
  grain.className = reduce ? "grain still" : "grain";
  grain.setAttribute("aria-hidden", "true");
  grain.style.backgroundImage = `url(${canvas.toDataURL()})`;
  document.body.append(grain);
}
