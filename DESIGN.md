---
name: VORTEX
description: Landing conceptual de un balón de baloncesto con sensores, construida como una placa de estudio de movimiento.
colors:
  albumen: "#1c1611"
  albumen-2: "#261e17"
  silver: "#d8cfc0"
  silver-dim: "#a39886"
  grid: "rgba(216, 207, 192, .12)"
  grid-strong: "rgba(216, 207, 192, .26)"
  leather: "#e2591f"
  leather-hover: "#f06a2c"
  ball-hi: "#f27a3c"
  ball-mid: "#e2591f"
  ball-lo: "#7d2a0a"
  ball-seam: "#140f0b"
typography:
  display:
    fontFamily: "Archivo Variable, Archivo, sans-serif"
    fontSize: "clamp(3rem, 7vw, 5.25rem)"
    fontWeight: 850
    lineHeight: 0.9
    letterSpacing: "-0.03em"
    fontVariation: "'wdth' 72"
  headline:
    fontFamily: "Archivo Variable, Archivo, sans-serif"
    fontSize: "clamp(2.6rem, 6vw, 5rem)"
    fontWeight: 850
    lineHeight: 0.92
    letterSpacing: "-0.03em"
    fontVariation: "'wdth' 72"
  manifesto:
    fontFamily: "Archivo Variable, Archivo, sans-serif"
    fontSize: "clamp(2.4rem, 6.4vw, 5.6rem)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.025em"
    fontVariation: "'wdth' 78"
  title:
    fontFamily: "Archivo Variable, Archivo, sans-serif"
    fontSize: "clamp(1.6rem, 2.4vw, 2.2rem)"
    fontWeight: 850
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 72"
  body:
    fontFamily: "Archivo Variable, Archivo, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.5
  lede:
    fontFamily: "Archivo Variable, Archivo, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.5
  label-button:
    fontFamily: "Archivo Variable, Archivo, sans-serif"
    fontSize: "15px"
    fontWeight: 700
    lineHeight: 1
    fontVariation: "'wdth' 110"
  wordmark:
    fontFamily: "Archivo Variable, Archivo, sans-serif"
    fontSize: "18px"
    fontWeight: 800
    letterSpacing: "0.02em"
    fontVariation: "'wdth' 125"
  measure-value:
    fontFamily: "Martian Mono Variable, Martian Mono, monospace"
    fontSize: "15px"
    fontWeight: 400
    fontFeature: "tnum"
  measure-key:
    fontFamily: "Martian Mono Variable, Martian Mono, monospace"
    fontSize: "12px"
    fontWeight: 400
    letterSpacing: "0.04em"
  measure-small:
    fontFamily: "Martian Mono Variable, Martian Mono, monospace"
    fontSize: "11px"
    fontWeight: 400
    letterSpacing: "0.02em"
rounded:
  pill: "999px"
  focus: "2px"
  square: "0"
spacing:
  gutter: "clamp(16px, 4vw, 48px)"
  section-y: "clamp(96px, 16vh, 180px)"
  grid-minor: "45px"
  grid-major: "180px"
  content-max: "1400px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "36px"
  xxl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.leather}"
    textColor: "{colors.albumen}"
    typography: "{typography.label-button}"
    rounded: "{rounded.pill}"
    padding: "15px 24px"
  button-primary-hover:
    backgroundColor: "{colors.leather-hover}"
    textColor: "{colors.albumen}"
  button-small:
    backgroundColor: "{colors.leather}"
    textColor: "{colors.albumen}"
    rounded: "{rounded.pill}"
    padding: "10px 16px"
  input-waitlist:
    backgroundColor: "{colors.albumen-2}"
    textColor: "{colors.silver}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "14px 20px"
  swatch-option:
    backgroundColor: "{colors.albumen}"
    textColor: "{colors.silver}"
    rounded: "{rounded.pill}"
    padding: "12px 16px"
  swatch-option-selected:
    backgroundColor: "{colors.albumen-2}"
    textColor: "{colors.silver}"
  readout-panel:
    backgroundColor: "{colors.albumen}"
    textColor: "{colors.silver}"
    typography: "{typography.measure-key}"
    rounded: "{rounded.square}"
    padding: "14px 16px"
  nav-link:
    textColor: "{colors.silver-dim}"
---

# Design System: VORTEX

## Overview

**Creative North Star: "La placa de cronofotografía"**

Toda la página es una sola placa fotográfica de estudio de movimiento: un fondo albúmina casi negro y cálido, una cuadrícula plateada que hace de regla, y el balón impreso exposición a exposición. El scroll actúa de obturador; cada exposición nueva entra con un destello y las anteriores se apagan sin desaparecer. La información no vive en tarjetas: vive en anotaciones con línea guía clavadas a puntos del dibujo, en mono, como las cotas de un instrumento.

La densidad es de lámina, no de catálogo: una imagen domina cada sección a sangre y el texto se apoya en ella (sobre la línea del suelo, junto al nodo que anota). El único color es el naranja del cuero del balón; todo lo demás es tinta plata sobre albúmina. La tipografía separa dos voces sin mezclarlas: Archivo condensada y pesada para afirmar, Martian Mono para medir.

Lo que el sistema rechaza, por evidencia del build: el producto flotando sobre negro con resplandor, y la rejilla de tarjetas de características. Los ejercicios se muestran como una tira de negativo continua; las especificaciones, como una ficha tabulada con filetes.

**Key Characteristics:**
- Fondo de placa único con cuadrícula doble (45px / 180px) que recorre toda la página.
- Un solo color de acento: el cuero del balón, usado para acción, énfasis y la medida activa.
- Titulares en Archivo al 72% de anchura y peso 850; medidas siempre en Martian Mono con cifras tabulares.
- Anotaciones con línea guía y punto de anclaje en lugar de tarjetas o etiquetas sueltas.
- Movimiento por exposiciones: destello (brillo 2,4 → 1) y estela que se apaga.
- Versión estática completa con `prefers-reduced-motion`: todas las exposiciones impresas, ninguna oculta.

## Colors

Monocromo cálido de plata sobre albúmina con un único pigmento: el cuero.

### Primary
- **Cuero de balón** (leather): el único color de la página. CTA, palabra de énfasis en titulares (`em`), número de exposición activa en la lectura, impactos del bote, conos, borde del módulo de sensores, opción de acabado seleccionada, anillo de foco, selección de texto y cursor del campo.
- **Cuero encendido** (leather-hover): solo el estado hover del botón primario.

### Neutral
- **Albúmina** (albumen): el fondo de la placa en toda la página, el fondo opaco de los paneles que se superponen a la ilustración (lectura del sensor, opciones de acabado) y el texto sobre botones de cuero. También `theme-color`.
- **Albúmina velada** (albumen-2): la superficie un tono por encima; campo de correo, opción de acabado seleccionada y relleno del módulo de sensores.
- **Tinta plata** (silver): texto principal, titulares, valores medidos, líneas de anotación, aro y suelo.
- **Plata apagada** (silver-dim): texto secundario (entradillas, leyendas, claves de medida, enlaces de navegación en reposo, pie, etiquetas de demostración). Contraste suficiente sobre albúmina para texto pequeño.
- **Cuadrícula fina** (grid): la retícula menor de 45px y filetes internos discretos.
- **Cuadrícula mayor** (grid-strong): la retícula de 180px y todos los filetes estructurales: borde de la lectura, bordes de la tira de negativo, filas de la ficha, borde del campo y de las opciones, línea superior del cierre y del pie.

### Tertiary: el acabado del balón
- **Luz, medio, sombra y costura del balón** (ball-hi, ball-mid, ball-lo, ball-seam): los cuatro colores del degradado radial y las costuras del balón. Están registrados con `@property` para animarse (0,7s) al cambiar de acabado; el acabado se cambia solo con el atributo `data-finish` en `<html>`. Valores por defecto: cuero. Variantes noche y asfalto en el sidecar.

### Named Rules
**The One Pigment Rule.** El cuero es el único color con croma de la página. Cualquier otro elemento es plata, plata apagada o albúmina. Si algo nuevo necesita destacar, usa cuero o no destaca.

**The Opaque Plate Rule.** Todo panel que se monta sobre la ilustración lleva fondo albúmina opaco y filete grid-strong, para que ninguna línea del dibujo lo atraviese. Nunca transparencias ni desenfoque.

## Typography

**Display Font:** Archivo Variable (eje wdth, autoalojada) con Archivo, sans-serif
**Body Font:** Archivo Variable con Archivo, sans-serif
**Label/Mono Font:** Martian Mono Variable con Martian Mono, monospace

**Character:** Una sola familia con eje de anchura hace de voz: estrecha y muy pesada para afirmar, ancha para la marca, normal para leer. Martian Mono es el instrumento: solo aparece cuando hay una cifra, una clave de medida o una advertencia de datos sintéticos.

### Hierarchy
- **Display** (850, `clamp(3rem, 7vw, 5.25rem)`, 0.9, anchura 72%): el titular de la primera lámina.
- **Headline** (850, `clamp(2.6rem, 6vw, 5rem)`, 0.92, anchura 72%): titulares de sección; el cierre sube a `clamp(3rem, 8vw, 6rem)`.
- **Manifesto** (800, `clamp(2.4rem, 6.4vw, 5.6rem)`, 1.02, anchura 78%, máx. 22ch): el párrafo-idea que se revela palabra a palabra.
- **Title** (850, `clamp(1.6rem, 2.4vw, 2.2rem)`, 1, anchura 72%): títulos de cada fotograma de la tira.
- **Body** (400, 17px, 1.5): texto corrido; entradillas en plata apagada a 18px (máx. 34rem) y párrafos de fotograma a 42ch.
- **Label botón** (700, 15px, 1, anchura 110%): botones; 13px en la variante pequeña.
- **Wordmark** (800, 18px, anchura 125%, +0.02em): solo la marca VORTEX.
- **Medida** (Martian Mono 400, 15px valor / 12px clave, clave en mayúsculas +0.04em, cifras tabulares): anotaciones, lectura del sensor, regla en metros, bordes de fotograma, ritmo.
- **Advertencia** (Martian Mono 400, 11px, +0.02em, plata apagada): "Concepto · datos de demostración" junto a cada dato inventado.

### Named Rules
**The Two Voices Rule.** Archivo afirma, Martian Mono mide. Ninguna frase en mono, ninguna cifra medida en Archivo (la ficha técnica, en Archivo con cifras tabulares, es la única excepción porque es texto de ficha, no lectura del sensor).

**The Pinned Key Rule.** Las claves en mayúsculas mono (SALIDA, ÁPICE, CUBIERTA) solo existen pegadas a un valor y a una línea guía que apunta a un punto del dibujo. Una clave sin valor ni ancla es un antetítulo y no pertenece al sistema.

**The Comma Decimal Rule.** Toda cifra se escribe con coma decimal y unidad separada por espacio ("2,7 rps", "0,6 bar").

## Layout

Una placa continua: la cuadrícula del `body` (45px menor, 180px mayor) corre bajo toda la página y las secciones con escenario SVG la redibujan dentro de su viewBox (`1600 × 1000`, 180 unidades = 1 metro, suelo en y = 900). Las secciones de texto usan fondo albúmina sólido sobre la placa para respirar.

- **Márgenes:** gutter lateral `clamp(16px, 4vw, 48px)`; ritmo vertical de sección `clamp(96px, 16vh, 180px)`; cierre más alto, `clamp(120px, 20vh, 220px)`. Ancho máximo de contenido 1400px.
- **Láminas a sangre:** tiro y vista explosionada son escenarios fijos (sticky) de 100svh dentro de secciones de 340vh y 300vh; la ilustración se recorta con `slice` para llenar el viewport.
- **Apoyo en el suelo:** en horizontal, el texto del héroe y la lectura se apoyan sobre la línea del suelo de la placa (`--above-floor`, calculado en JS) y el texto deja libre la regla en metros (mín. 88px a la izquierda).
- **Cabecera de sección:** dos columnas iguales alineadas abajo (titular | entradilla), separadas 48px; una columna bajo 860px.
- **Tira de negativo:** fila horizontal de fotogramas de `min(72vw, 820px)` (86vw en móvil), desplazada por scroll; en movimiento reducido se envuelve y centra.
- **Acabados:** dos columnas (balón | elección y ficha), una bajo 860px.
- **Pantallas verticales** (`max-aspect-ratio: 1/1`): la placa del tiro cambia a `meet` recortada a la trayectoria, los balones escalan 1,6x y solo sobreviven la regla y la primera anotación, ampliadas para seguir legibles; las partes de la vista explosionada pasan de anotaciones a una lista de dos columnas.
- **Ritmo interno:** 8 / 12 / 16 / 24 / 36 / 48px; la nav reduce sus enlaces al CTA bajo 860px.

## Elevation & Depth

La placa es plana. La profundidad viene de la tinta: exposiciones antiguas a menor opacidad (de 0,8 bajando 0,07 por exposición, mínimo 0,28), la cuadrícula en dos intensidades y la superficie albumen-2 un tono por encima del fondo. El volumen del balón lo da su degradado radial, el granulado (`feTurbulence`) y una elipse de contacto negra al 55% en el suelo; no hay sombras proyectadas sobre la placa.

### Shadow Vocabulary
- **Calor del cuero** (`box-shadow: 0 8px 24px -10px rgba(226, 89, 31, .6)`; hover `0 12px 28px -10px rgba(226, 89, 31, .7)`): solo bajo el botón primario grande. La variante pequeña no la lleva.
- **Volumen de muestra** (`box-shadow: inset -4px -6px 10px rgba(0, 0, 0, .45)`): solo en los círculos de muestra de acabado, para que lean como esferas.

### Named Rules
**The Flat Plate Rule.** Ningún panel ni superficie de contenido se eleva sobre la placa; se distinguen con fondo opaco y filete, nunca con sombra o desenfoque. El botón primario es la única pieza con calor propio.

## Shapes

Dos geometrías y nada más. Lo que se toca es una píldora (999px): botones, campo de correo, opciones de acabado, enlace de salto. Lo que mide es un rectángulo de esquina viva con filete de 1px grid-strong: lectura del sensor, tira de negativo, filas de la ficha, bordes de sección. El círculo pertenece al balón y a sus muestras. Las líneas de anotación son de 1,2px con punto de anclaje de radio 5; las trayectorias son discontinuas (3 7) a baja opacidad.

## Components

### Buttons
Una pastilla de cuero que se enciende; el único objeto cálido y con relieve de la página.
- **Shape:** píldora (999px).
- **Primary:** fondo cuero, texto albúmina, Archivo 700 a 15px y anchura 110%, relleno 15px 24px, sombra de calor del cuero.
- **Hover / Focus:** cuero encendido, sube 1px y la sombra crece; transición 0,25s con `--ease-out`. Foco: contorno de 2px cuero a 3px de distancia. Activo vuelve a 0. Deshabilitado al 50%.
- **Small:** 10px 16px, 13px, sin sombra; el CTA de la navegación.

### Chips (opciones de acabado)
- **Style:** píldora con fondo albúmina, filete grid-strong, muestra circular de 34px, nombre en 700 y descripción en plata apagada a 14px. El radio real queda oculto pero accesible.
- **State:** hover aclara el filete a plata apagada; seleccionada lleva filete cuero y fondo albumen-2; foco con el contorno cuero estándar. Al cambiar, el balón entra rodando con tres exposiciones fantasma que se apagan.

### Cards / Containers (lectura del sensor)
- **Corner Style:** esquina viva.
- **Background:** albúmina opaca sobre la ilustración.
- **Shadow Strategy:** ninguna (The Flat Plate Rule).
- **Border:** 1px grid-strong; cabecera separada por el mismo filete.
- **Internal Padding:** 14px 16px. Contenido en Martian Mono 12px, claves en plata apagada, valores alineados a la derecha, número de exposición en cuero, advertencia de datos sintéticos al pie.

### Inputs / Fields
- **Style:** píldora, fondo albumen-2, filete grid-strong, Archivo 16px, relleno 14px 20px, placeholder en plata apagada, cursor cuero.
- **Focus:** contorno cuero de 2px estándar; hover aclara el filete.
- **Error:** filete cuero (`aria-invalid`) y mensaje en la línea de estado bajo el formulario.

### Navigation
Fija arriba sobre un degradado de albúmina a transparente. Marca a la izquierda (balón de 22px + wordmark ancho); enlaces en Archivo 14px plata apagada que pasan a plata en hover; CTA pequeño de cuero al final. Bajo 860px solo queda el CTA.

### Anotación con línea guía
La firma del sistema. Un punto de anclaje en el nodo exacto del dibujo, una línea (o polilínea acodada) de 1,2px plata, y a su final una clave mono en mayúsculas de 12px plata apagada sobre un valor mono de 15px plata. Las anotaciones aparecen cuando su exposición o su pieza se revela (0,4s, `expo.out`).

### Tira de negativo (fotogramas)
Fotogramas contiguos entre filetes superior e inferior grid-strong, separados por filete vertical; cada uno con borde de película en mono 11px (número y metadatos), diagrama SVG, título, párrafo y línea de medidas en mono 12px.

### Ficha
Tabla sin cajas: filas separadas por filete superior grid-strong, clave en plata apagada (500, 40% de ancho), valor en plata con cifras tabulares, leyenda arriba en plata apagada.

### Exposición y destello
Cada aparición de un balón en el relato (tiro, bote, acabado) entra con `brightness(2.4)` que baja a 1 en 0,55s con `expo.out`; las exposiciones anteriores permanecen atenuadas. Es el único gesto de entrada del sistema.

## Do's and Don'ts

### Do:
- **Do** dibujar cada nueva sección sobre la misma placa: albúmina, cuadrícula 45/180px y suelo plata cuando haya un objeto apoyado.
- **Do** enseñar los datos midiendo en el dibujo: anotación con ancla, clave y valor en Martian Mono, coma decimal y unidad.
- **Do** etiquetar cada cifra inventada con la advertencia mono de 11px ("Concepto · datos de demostración").
- **Do** usar el destello (brillo 2,4 → 1, 0,55s, `expo.out`) y la estela atenuada como único lenguaje de entrada.
- **Do** dar a todo lo interactivo forma de píldora y a todo lo que mide esquina viva con filete grid-strong.
- **Do** ofrecer con `prefers-reduced-motion` el relato completo impreso: todas las exposiciones visibles, sin pin ni scroll horizontal.

### Don't:
- **Don't** añadir un segundo color con croma; el cuero es el único pigmento.
- **Don't** poner el balón flotando sobre negro con resplandor, ni agrupar características en una rejilla de tarjetas.
- **Don't** elevar paneles con sombras, desenfoque o transparencias sobre la ilustración; usa albúmina opaca y filete.
- **Don't** escribir prosa en Martian Mono ni cifras de sensor en Archivo.
- **Don't** usar claves mono en mayúsculas como antetítulos sueltos sobre los titulares; solo existen pegadas a una medida.
- **Don't** escribir colores del balón directamente; cambia el acabado con `data-finish` y deja que los tokens `--ball-*` interpolen.
