# VORTEX · landing de producto con scroll

Landing de un balón de baloncesto inteligente **ficticio**, hecha como pieza de portafolio. La página funciona como una placa de fotografía de movimiento: cada vez que haces scroll se "dispara" una exposición nueva del balón, con su destello, y los sensores van midiendo en pantalla.

Todo lo visual se genera con código: no hay imágenes ni modelos 3D descargados.

## Arrancar

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # versión de producción en dist/
npm run preview  # sirve dist/ para probarla
```

## Qué hay en la página

| Sección | Qué pasa al hacer scroll |
| --- | --- |
| Intro | La placa sale del negro como una foto revelándose; el titular sube línea a línea |
| El tiro | 13 exposiciones del balón 3D trazan la parábola; las notas y la lectura del sensor se actualizan |
| La idea | Una frase que se ilumina palabra a palabra |
| Por dentro | Vista explosionada en 3D: cámara, 6 tirantes y módulo de sensores, con etiquetas que siguen a cada pieza |
| El tacto no cambia | Primer plano del cuero con luz rasante, desenfoque de bordes y barra de escala de 10 mm |
| El bote | Siete botes con su fuerza y la señal del acelerómetro dibujándose al ritmo |
| Ejercicios | Hoja de contactos horizontal con copias en positivo |
| Acabados | Cuero, Noche y Asfalto: el balón entra rodando y cambian los materiales de todos los balones 3D |
| Cierre | El balón bajo un foco; al apuntarte se revela una copia con tu primer tiro |

Además: grano de película animado, contador de fotogramas en la navegación y sonido de obturador opcional.

## Estructura

```
index.html              marcado de todas las secciones + el balón SVG reutilizable (<symbol id="ball">)
public/favicon.svg
src/main.js             punto de entrada: fuentes, estilos, Lenis, cada sección y la carga del 3D
src/styles/
  tokens.css            colores, fuentes y acabados del balón (variables CSS)
  base.css              reset, tipografía, botón, navegación, grano, máscaras de línea
  sections.css          estilos de cada sección + móvil + movimiento reducido
src/js/
  geometry.js           utilidades: curva de Bézier, crear SVG, colocar balones, el flash
  intro.js              intro de revelado al cargar
  lines.js              parte titulares en líneas para revelarlos con máscara
  grain.js              grano de película (ruido en canvas animado con CSS)
  shot.js               el tiro: el scroll añade exposiciones; lectura con cifras que ruedan
  idea.js               la frase que se ilumina
  inside.js             vista explosionada en SVG (plan B sin WebGL)
  dribble.js            los botes y la señal del acelerómetro
  sessions.js           hoja de contactos en horizontal
  finishes.js           selector de acabado y entrada rodando
  waitlist.js           formulario de demostración y copia revelada
  counter.js            contador de fotogramas de la navegación
  sound.js              obturador sintetizado con Web Audio
  ball3d.js             3D compartido: texturas del cuero, materiales, luz y capa sobre los SVG
  inside3d.js           vista explosionada en 3D con etiquetas proyectadas
  macro3d.js            primer plano del cuero
pruebas-estilo/         las dos pruebas de estilo iniciales (A y B)
PRODUCT.md / DESIGN.md  ficha del producto y sistema de diseño
```

## Cómo funciona el 3D

- **Texturas por código.** `ball3d.js` calcula sobre la esfera dónde caen las costuras de un balón real (dos círculos máximos y dos curvas) y un ruido para el granulado. De ahí salen la textura de color y la de relieve (`bumpMap`).
- **El SVG manda, el 3D dibuja.** En el tiro, en Acabados y en el cierre, los balones siguen siendo SVG invisibles que marcan posición, giro y opacidad. Una capa WebGL encima lee esos datos en cada fotograma (`getCTM`) y pinta un balón 3D en su sitio. Toda la lógica de scroll sigue siendo la misma que sin 3D.
- **Una variable por escena.** En "Por dentro" y en el macro, el scroll mueve un solo número, `p`, de 0 a 1, y la apertura, la cámara y las luces se calculan a partir de él.
- **Plan B.** Three.js se carga en un archivo aparte. Si no hay WebGL, o tarda más de 1,5 s, la página sigue con los balones SVG.

## Rendimiento y accesibilidad

- Cada escena 3D solo se dibuja mientras está en pantalla, compila sus shaders al montarse y limita la resolución a 2x.
- La textura grande (3072 px) se calcula a trozos y solo la usa el primer plano.
- Recorriendo la página entera, el fotograma típico tarda 7 ms y ninguno pasa de 34 ms (medido en escritorio).
- Con `prefers-reduced-motion` se muestra todo el relato sin animaciones: sin intro, grano quieto y cada escena en su estado final.
- Cada SVG tiene texto alternativo y todo se puede usar con teclado.

## Técnicas que se practican

- **ScrollTrigger:** `onUpdate` con el progreso, timelines con `scrub`, `pin` con scroll horizontal y `containerAnimation`.
- **`position: sticky`** para fijar escenarios mientras la sección hace scroll.
- **Three.js:** materiales PBR, texturas generadas en canvas, cámara ortográfica alineada con un SVG, proyección de puntos 3D a la pantalla.
- **Canvas y Web Audio:** grano de película y sonido sintetizados sin archivos.
- **`@property`** para animar variables CSS de color.

Los datos que aparecen son de demostración y VORTEX no existe.
