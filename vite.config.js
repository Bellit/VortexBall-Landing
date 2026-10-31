import { readFileSync } from "node:fs";
import { defineConfig } from "vite";

// Dirección pública de la web. En Vercel la da la propia plataforma al
// compilar (VERCEL_PROJECT_PRODUCTION_URL); en local se usa la de vite preview.
const site = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:4173";

// Las cabeceras de seguridad viven en vercel.json; vite preview las copia
// para poder comprobar en local que nada las rompe antes de publicar.
const vercel = JSON.parse(readFileSync(new URL("./vercel.json", import.meta.url), "utf8"));
const headers = Object.fromEntries(vercel.headers[0].headers.map(h => [h.key, h.value]));

export default defineConfig({
  plugins: [{
    name: "site-url",
    transformIndexHtml: html => html.replaceAll("%SITE_URL%", site),
  }],
  // Vite mete los archivos de menos de 4 kB dentro del CSS como data:, y la CSP
  // solo deja cargar fuentes del propio dominio: las fuentes van siempre aparte
  build: { assetsInlineLimit: file => (file.endsWith(".woff2") ? false : undefined) },
  preview: { headers },
});
