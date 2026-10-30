# VORTEX · landing de producto con scroll

Landing de un balón de baloncesto inteligente **ficticio**, hecha como pieza de portafolio. La página funciona como una placa de fotografía de movimiento: cada vez que haces scroll se "dispara" una exposición nueva del balón.

## Arrancar

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # versión de producción en dist/
npm run preview  # sirve dist/ para probarla
```

## Estructura

```
index.html            marcado de todas las secciones + el balón SVG reutilizable (<symbol id="ball">)
src/main.js           punto de entrada: fuentes, estilos, Lenis y arranque de cada sección
src/styles/
  tokens.css          colores, fuentes y acabados del balón (variables CSS)
  base.css            reset, tipografía, botón, navegación
  sections.css        estilos de cada sección + móvil + movimiento reducido
src/js/
  geometry.js         utilidades: curva de Bézier, crear SVG, el destello de exposición
  shot.js             1 · el tiro: el scroll añade exposiciones a la parábola
  idea.js             2 · el texto que se ilumina palabra a palabra
  inside.js           3 · vista explosionada del balón (timeline con scrub)
  dribble.js          4 · los botes con su fuerza
  sessions.js         5 · hoja de contactos en horizontal (pin + containerAnimation)
  finishes.js         6 · selector de acabado
  waitlist.js         7 · formulario de demostración (no envía nada)
pruebas-estilo/       las dos pruebas de estilo iniciales (A y B)
```

## Técnicas que se practican

- **ScrollTrigger con `onUpdate`**: el progreso del scroll (0 → 1) decide qué exposición se ve (`shot.js`).
- **Timeline con `scrub`**: una animación entera atada al scroll (`inside.js`).
- **`pin` + scroll horizontal + `containerAnimation`**: disparadores dentro de una tira que se mueve en horizontal (`sessions.js`).
- **`position: sticky`** para fijar el escenario mientras la sección hace scroll.
- **`@property`** para animar variables CSS de color (acabados en `tokens.css`).
- **SVG generado por código** a partir de una fórmula: las medidas del panel salen de la propia curva.
- **Accesibilidad**: `prefers-reduced-motion` muestra todo sin animación, textos alternativos en cada SVG y navegación con teclado.

Los datos que aparecen son de demostración y VORTEX no existe.
