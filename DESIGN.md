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
  print-paper: "#e7dfd0"
  print-ink: "#2a211a"
  flash-core: "#fff1dc"
  flash-warm: "#ffb27a"
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
  measure-label:
    fontFamily: "Martian Mono Variable, Martian Mono, monospace"
    fontSize: "14px"
    fontWeight: 400
  measure-key:
    fontFamily: "Martian Mono Variable, Martian Mono, monospace"
    fontSize: "12px"
    fontWeight: 400
    letterSpacing: "0.04em"
  measure-key-small:
    fontFamily: "Martian Mono Variable, Martian Mono, monospace"
    fontSize: "11px"
    fontWeight: 400
    letterSpacing: "0.04em"
    fontFeature: "tnum"
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
  frame-counter:
    textColor: "{colors.silver-dim}"
    typography: "{typography.measure-key-small}"
  sound-toggle:
    textColor: "{colors.silver-dim}"
    rounded: "{rounded.pill}"
  sound-toggle-on:
    textColor: "{colors.silver}"
  session-timeline:
    textColor: "{colors.silver-dim}"
    typography: "{typography.measure-key-small}"
    rounded: "{rounded.square}"
    height: "34px"
    width: "min(560px, 44vw)"
  session-log:
    backgroundColor: "{colors.albumen}"
    textColor: "{colors.silver}"
    typography: "{typography.measure-key}"
    rounded: "{rounded.square}"
    padding: "16px 18px 12px"
    width: "min(360px, 28vw)"
  session-log-live:
    textColor: "{colors.leather}"
  print-revealed:
    backgroundColor: "{colors.print-paper}"
    textColor: "{colors.print-ink}"
    rounded: "{rounded.square}"
    padding: "18px 18px 14px"
    width: "min(100%, 560px)"
---

# Design System: VORTEX

## Overview

**Creative North Star: "La placa de cronofotografía"**

Toda la página es una sola placa fotográfica de estudio de movimiento: un fondo albúmina casi negro y cálido, una cuadrícula plateada que hace de regla, y el balón impreso exposición a exposición. El scroll actúa de obturador; cada exposición nueva entra con un destello de luz cálida y las anteriores se apagan sin desaparecer, mientras las futuras ya se intuyen como imagen latente. La información no vive en tarjetas: vive en anotaciones con línea guía clavadas a puntos del dibujo, en mono, como las cotas de un instrumento.

La placa es material, no pantalla: un grano de emulsión animado cubre toda la página, las láminas a sangre caen hacia las esquinas con viñeteado, la primera lámina se revela desde el negro como una copia en la cubeta, y donde el relato enseña un resultado aparece una copia en positivo, papel claro con tinta oscura. El balón es un objeto real en 3D (cuero granulado, costuras hundidas, luz de estudio) montado sobre la misma geometría SVG que lo coloca; sin WebGL, la placa SVG sigue contando todo.

La densidad es de lámina, no de catálogo: una imagen domina cada sección a sangre y el texto se apoya en ella (sobre la línea del suelo, junto al nodo que anota). El único pigmento es el naranja del cuero; todo lo demás es tinta plata sobre albúmina, o tinta oscura sobre papel en las copias. La tipografía separa dos voces sin mezclarlas: Archivo condensada y pesada para afirmar, Martian Mono para medir.

Lo que el sistema rechaza, por evidencia del build: el producto flotando en el vacío sobre negro con un resplandor permanente, y la rejilla de tarjetas de características. Los ejercicios se muestran como una sola sesión cronometrada que el balón recorre en vista lateral, con su cuaderno al lado; las especificaciones, como una ficha tabulada con filetes.

**Key Characteristics:**
- Fondo de placa único con cuadrícula doble (45px / 180px) que recorre toda la página, bajo un grano de emulsión animado.
- Un solo pigmento: el cuero del balón, usado para acción, énfasis y la medida activa; la luz del destello es cuero hecho luz.
- Titulares en Archivo al 72% de anchura y peso 850, revelados línea a línea tras una máscara; medidas siempre en Martian Mono con cifras tabulares.
- Anotaciones con línea guía y punto de anclaje en lugar de tarjetas o etiquetas sueltas, también proyectadas sobre las escenas 3D.
- Movimiento por exposiciones: imagen latente, destello con halo cálido y estela que se apaga; las cifras ruedan, no saltan.
- Balón 3D real sobre la geometría SVG, con la placa SVG como respaldo completo.
- Una copia en positivo (papel claro, tinta oscura) dentro del mundo en negativo: la copia revelada del cierre.
- Versión estática completa con `prefers-reduced-motion`: todas las exposiciones impresas, grano quieto, sin intro.

## Colors

Monocromo cálido de plata sobre albúmina con un único pigmento, el cuero, y su papel de copia como negativo invertido.

### Primary
- **Cuero de balón** (leather): el único color de la página. CTA, palabra de énfasis en titulares (`em`), número de exposición activa en la lectura, impactos del bote, número de bote y línea de la gráfica de fuerza, conos del zigzag, avance de la línea de tiempo de la sesión (relleno al 16% y borde derecho de 2px), el "midiendo…" del ejercicio en curso en el cuaderno, aristas del módulo de sensores, opción de acabado seleccionada, ondas del sonido activo, anillo de foco, selección de texto y cursor del campo.
- **Cuero encendido** (leather-hover): solo el estado hover del botón primario.

### Secondary: el papel de copia
- **Papel de copia** (print-paper): fondo de la copia revelada del cierre. Solo existe como copia en positivo, nunca como superficie de interfaz.
- **Tinta de copia** (print-ink): suelo, aro, trayectoria y pie mono dibujados sobre el papel.

### Tertiary: el acabado del balón y la luz
- **Luz, medio, sombra y costura del balón** (ball-hi, ball-mid, ball-lo, ball-seam): los cuatro colores del degradado radial y las costuras del balón SVG. Están registrados con `@property` para animarse (0,7s) al cambiar de acabado; el acabado se cambia solo con el atributo `data-finish` en `<html>`, y el balón 3D escucha el evento `finishchange`. Valores por defecto: cuero. Variantes noche y asfalto, con sus parámetros de material 3D, en el sidecar.
- **Núcleo y calor del destello** (flash-core, flash-warm): las dos primeras paradas del halo radial del flash, que termina en cuero transparente. Solo existen como luz transitoria detrás de un balón que se expone.

### Neutral
- **Albúmina** (albumen): el fondo de la placa en toda la página, el fondo opaco de los paneles que se superponen a la ilustración (lectura del sensor, opciones de acabado) y el texto sobre botones de cuero. También `theme-color` y el suelo de la luz hemisférica del 3D.
- **Albúmina velada** (albumen-2): la superficie un tono por encima; campo de correo, opción de acabado seleccionada y relleno del módulo de sensores en la vista SVG.
- **Tinta plata** (silver): texto principal, titulares, valores medidos, líneas de anotación, aro, suelo, regla de escala de la macro, número actual del contador, aro y suelo de la pista de la sesión, reloj de la sesión y resultados del cuaderno.
- **Plata apagada** (silver-dim): texto secundario (entradillas, leyendas, claves de medida, enlaces de navegación en reposo, contador de fotogramas, interruptor de sonido en reposo, pie, etiquetas de demostración, nombres de los segmentos de la sesión, marcas de distancia en su suelo). Contraste suficiente sobre albúmina para texto pequeño.
- **Cuadrícula fina** (grid): la retícula menor de 45px y filetes internos discretos (divisiones de la línea de tiempo, filas del cuaderno).
- **Cuadrícula mayor** (grid-strong): la retícula de 180px y todos los filetes estructurales: borde de la lectura, borde de la línea de tiempo de la sesión, borde del cuaderno y su línea de cierre, borde del panel del bote y base de su gráfica, filas de la ficha, borde del campo y de las opciones, línea superior del cierre y del pie.

### Named Rules
**The One Pigment Rule.** El cuero es el único color con croma de la página. Cualquier otro elemento es plata, plata apagada, albúmina o la tinta del papel de copia. La luz no cuenta como pigmento: el halo del destello (blanco cálido → ámbar → cuero), el foco del cierre y el brillo del balón 3D son cuero hecho luz, y solo existen como destello que se apaga o como luz que cae sobre el suelo. Si algo nuevo necesita destacar, usa cuero o no destaca.

**The Opaque Plate Rule.** Todo panel que se monta sobre la ilustración lleva fondo albúmina opaco y filete grid-strong, para que ninguna línea del dibujo lo atraviese. Nunca transparencias ni desenfoque de interfaz; el único desenfoque del sistema es óptico, la profundidad de campo de la macro.

**The Positive Print Rule.** Dentro del mundo en negativo, una copia es papel claro con tinta oscura (print-paper, print-ink). Sobre el papel el balón conserva su cuero, pero el halo del destello no existe: una copia ya está revelada, no se expone.

## Typography

**Display Font:** Archivo Variable (eje wdth, autoalojada) con Archivo, sans-serif
**Body Font:** Archivo Variable con Archivo, sans-serif
**Label/Mono Font:** Martian Mono Variable con Martian Mono, monospace

**Character:** Una sola familia con eje de anchura hace de voz: estrecha y muy pesada para afirmar, ancha para la marca, normal para leer. Martian Mono es el instrumento: solo aparece cuando hay una cifra, una clave de medida, un reloj o una advertencia de datos sintéticos.

### Hierarchy
- **Display** (850, `clamp(3rem, 7vw, 5.25rem)`, 0.9, anchura 72%): el titular de la primera lámina.
- **Headline** (850, `clamp(2.6rem, 6vw, 5rem)`, 0.92, anchura 72%): titulares de sección; el cierre sube a `clamp(3rem, 8vw, 6rem)`.
- **Manifesto** (800, `clamp(2.4rem, 6.4vw, 5.6rem)`, 1.02, anchura 78%, máx. 22ch): el párrafo-idea que se revela palabra a palabra.
- **Body** (400, 17px, 1.5): texto corrido; entradillas en plata apagada a 18px (máx. 34rem); la de la sesión, a 17px en una columna de 26rem bajo el titular. Sobre la macro, la entradilla va en plata plena a 18px. Los nombres de ejercicio del cuaderno van en Archivo 700 a 15px (13px en vertical): son nombres, no medidas.
- **Label botón** (700, 15px, 1, anchura 110%): botones; 13px en la variante pequeña.
- **Wordmark** (800, 18px, anchura 125%, +0.02em): solo la marca VORTEX.
- **Medida** (Martian Mono 400, 15px valor / 12px clave, clave en mayúsculas +0.04em, cifras tabulares): anotaciones en el viewBox de la placa, lectura del sensor, regla en metros, ritmo, cuaderno de sesión (12px) y reloj de la sesión (20px, 15px en vertical).
- **Medida en píxeles** (Martian Mono 400, 14px valor / 11px clave +0.04em): etiquetas dibujadas a tamaño de pantalla (líneas guía sobre el 3D, regla del bote), cabecera de la lectura y contador de fotogramas (11px, tabulares).
- **Advertencia** (Martian Mono 400, 11px, +0.02em, plata apagada): "Concepto · datos de demostración" junto a cada dato inventado; los nombres de segmento de la línea de tiempo usan el mismo cuerpo, sin espaciado.

### Named Rules
**The Two Voices Rule.** Archivo afirma, Martian Mono mide. Ninguna frase en mono, ninguna cifra medida en Archivo (la ficha técnica, en Archivo con cifras tabulares, es la única excepción porque es texto de ficha, no lectura del sensor).

**The Pinned Key Rule.** Las claves en mayúsculas mono (SALIDA, ÁPICE, CUBIERTA) solo existen pegadas a un valor y a una línea guía que apunta a un punto del dibujo. Una clave sin valor ni ancla es un antetítulo y no pertenece al sistema.

**The Comma Decimal Rule.** Toda cifra se escribe con coma decimal y unidad separada por espacio ("2,7 rps", "0,6 bar", "10 mm").

## Layout

Una placa continua: la cuadrícula del `body` (45px menor, 180px mayor) corre bajo toda la página y las secciones con escenario SVG la redibujan dentro de su viewBox (`1600 × 1000`, 180 unidades = 1 metro, suelo en y = 900). Las secciones de texto usan fondo albúmina sólido sobre la placa para respirar. El grano de emulsión es una capa fija por encima de todo, incluida la navegación.

- **Márgenes:** gutter lateral `clamp(16px, 4vw, 48px)`; ritmo vertical de sección `clamp(96px, 16vh, 180px)`; cierre más alto, `clamp(120px, 20vh, 220px)`. Ancho máximo de contenido 1400px.
- **Láminas a sangre:** tiro, vista explosionada y macro son escenarios fijos (sticky) de 100svh dentro de secciones de 340vh, 300vh y 260vh; la ilustración se recorta con `slice` (o la escena 3D llena el escenario) y el viñeteado cae sobre todas.
- **Apoyo en el suelo:** en horizontal, el texto del héroe y la lectura se apoyan sobre la línea del suelo de la placa (`--above-floor`, calculado en JS) y el texto deja libre la regla en metros (mín. 88px a la izquierda). En la macro, texto abajo a la izquierda y barra de escala abajo a la derecha, a `clamp(48px, 10vh, 110px)` del borde.
- **Cabecera de sección:** dos columnas iguales alineadas abajo (titular | entradilla), separadas 48px; una columna bajo 860px.
- **Bote:** escena fija de 320vh. Título arriba a la izquierda, un solo balón botando sobre su placa con regla en metros en el centro, y el panel del sensor a la derecha (abajo y compacto en vertical).
- **Sesión:** escena fija de 480vh con viñeteado. Título arriba a la izquierda, línea de tiempo arriba a la derecha (`min(560px, 44vw)`), la pista en vista lateral abajo a la izquierda (`min(64vw, 980px)` × 66svh, a 7vh del borde) y el cuaderno abajo a la derecha (`min(360px, 28vw)`). La pista tiene su propia escala (1 m = 100 unidades, suelo en y = 450, balón dibujado casi al doble para leerse) y la cámara es el viewBox: cada ejercicio fija el tramo de pista visible (7; 7,3; 7,4 y 9,8 m de ancho) y el cambio se abre o se cierra en 0,7s.
- **Acabados:** dos columnas (balón | elección y ficha), una bajo 860px.
- **Cierre:** balón en reposo centrado (`min(56vw, 420px)`), titular, formulario y, al apuntarse, la copia revelada debajo.
- **Pantallas verticales** (`max-aspect-ratio: 1/1`): la placa del tiro cambia a `meet` recortada a la trayectoria, los balones escalan 1,6x y solo sobreviven la regla y la primera anotación, ampliadas para seguir legibles; en la vista explosionada desaparecen las líneas guía y las partes pasan a una lista de dos columnas bajo la escena 3D; la barra de escala de la macro sube arriba; en la sesión desaparecen la entradilla y los nombres de segmento, la línea de tiempo baja a 10px de alto bajo el título, la pista ocupa todo el ancho y el cuaderno se compacta abajo en filas de dos columnas (nombre | valor).
- **Ritmo interno:** 8 / 12 / 14 / 16 / 24 / 36 / 48px; la nav reduce sus enlaces al interruptor de sonido (sin texto) y al CTA bajo 860px, y oculta el contador.

## Elevation & Depth

La placa es plana; la profundidad es fotográfica. Viene de la tinta (exposiciones antiguas de 0,8 bajando 0,07 por exposición hasta 0,28, futuras latentes a 0,05), de la cuadrícula en dos intensidades, de la superficie albumen-2 un tono por encima del fondo, del grano de emulsión (opacidad 0,09 en `overlay`) y del viñeteado que oscurece las esquinas de cada lámina a sangre. El volumen del balón lo da su render 3D con luz de estudio (o, sin WebGL, su degradado radial y su granulado `feTurbulence`) y una elipse de contacto negra al 55-60% en el suelo. En la macro, la profundidad de campo desenfoca el borde del encuadre. Las únicas piezas que proyectan sombra son objetos: el botón de cuero y la copia en papel.

### Shadow Vocabulary
- **Calor del cuero** (`box-shadow: 0 8px 24px -10px rgba(226, 89, 31, .6)`; hover `0 12px 28px -10px rgba(226, 89, 31, .7)`): solo bajo el botón primario grande. La variante pequeña no la lleva.
- **Volumen de muestra** (`box-shadow: inset -4px -6px 10px rgba(0, 0, 0, .45)`): solo en los círculos de muestra de acabado, para que lean como esferas.
- **Copia suelta** (`box-shadow: 0 30px 60px -30px rgba(0, 0, 0, .9)`): la copia revelada del cierre, que además cae girada −1,5°.

### Named Rules
**The Flat Plate Rule.** Ningún panel ni superficie de interfaz se eleva sobre la placa; se distinguen con fondo opaco y filete, nunca con sombra o desenfoque. Solo proyectan sombra los objetos: el botón primario (calor propio) y la copia en papel (sombra de papel apoyado).

**The Developing Light Rule.** La luz de la placa es de laboratorio: viñeteado fijo en las láminas, grano siempre presente, y luz cálida solo como destello que se apaga o foco que cae sobre el suelo bajo el balón.

## Shapes

Dos geometrías y nada más. Lo que se toca es una píldora (999px): botones, campo de correo, opciones de acabado, enlace de salto. Lo que mide o se imprime es un rectángulo de esquina viva: lectura del sensor, panel del bote, línea de tiempo y cuaderno de la sesión, filas de la ficha, bordes de sección, copia revelada. El círculo pertenece al balón y a sus muestras; el triángulo, a los conos. Las líneas de anotación son de 1,2px con punto de anclaje de radio 5 (4 en las líneas guía sobre el 3D); las trayectorias son discontinuas (3 7) a baja opacidad. La barra de escala es un corchete abierto por arriba: 6px de alto, filete plata de 1px.

## Components

### Buttons
Una pastilla de cuero que se enciende; el único objeto de interfaz cálido y con relieve de la página.
- **Shape:** píldora (999px).
- **Primary:** fondo cuero, texto albúmina, Archivo 700 a 15px y anchura 110%, relleno 15px 24px, sombra de calor del cuero.
- **Hover / Focus:** cuero encendido, sube 1px y la sombra crece; transición 0,25s con `--ease-out`. Foco: contorno de 2px cuero a 3px de distancia. Activo vuelve a 0. Deshabilitado al 50%.
- **Small:** 10px 16px, 13px, sin sombra; el CTA de la navegación.

### Chips (opciones de acabado)
- **Style:** píldora con fondo albúmina, filete grid-strong, muestra circular de 34px, nombre en 700 y descripción en plata apagada a 14px. El radio real queda oculto pero accesible.
- **State:** hover aclara el filete a plata apagada; seleccionada lleva filete cuero y fondo albumen-2; foco con el contorno cuero estándar. Al cambiar, el balón entra rodando (−90° → 0, 0,7s) con un destello y tres exposiciones fantasma que se apagan; el balón 3D cambia textura, rugosidad y barniz.

### Cards / Containers (lectura del sensor)
- **Corner Style:** esquina viva.
- **Background:** albúmina opaca sobre la ilustración.
- **Shadow Strategy:** ninguna (The Flat Plate Rule).
- **Border:** 1px grid-strong; cabecera separada por el mismo filete.
- **Internal Padding:** 14px 16px. Contenido en Martian Mono 12px, claves en plata apagada, valores alineados a la derecha, número de exposición en cuero, advertencia de datos sintéticos al pie. Las cifras ruedan hasta su nuevo valor (0,45s, `power2.out`) como un contador mecánico.

### Inputs / Fields
- **Style:** píldora, fondo albumen-2, filete grid-strong, Archivo 16px, relleno 14px 20px, placeholder en plata apagada, cursor cuero.
- **Focus:** contorno cuero de 2px estándar; hover aclara el filete.
- **Error:** filete cuero (`aria-invalid`) y mensaje en la línea de estado bajo el formulario.

### Navigation
Fija arriba sobre un degradado de albúmina a transparente. A la izquierda, marca (balón de 22px + wordmark ancho) y contador de película en mono 11px plata apagada (`000/144`, el número actual en plata, avanza con el scroll de toda la página). Enlaces en Archivo 14px plata apagada que pasan a plata en hover; interruptor de sonido de obturador (icono SVG de 18px con ondas al 30%, texto "Sonido"; activo pasa a plata con ondas en cuero, apagado por defecto); CTA pequeño de cuero al final. Bajo 860px quedan el icono de sonido y el CTA.

### Anotación con línea guía
La firma del sistema. Un punto de anclaje en el nodo exacto del dibujo, una línea (o polilínea acodada) de 1,2px plata, y a su final una clave mono en mayúsculas plata apagada sobre un valor mono plata. Las anotaciones aparecen cuando su exposición o su pieza se revela (0,4s, `expo.out`). Sobre una escena 3D, el ancla se proyecta cada fotograma desde un punto de la pieza y la línea termina en un subrayado de 250px bajo la etiqueta (14px / 11px), en una capa SVG en píxeles.

### Balón 3D
Un balón real sobre la geometría SVG. Textura procedural equirectangular de granulado con máscara de costuras y relieve (surco en la costura), en dos niveles: 1536px para todos los balones y 3072px solo para el primer plano de la macro, en pantallas de más de 800px. Material físico por acabado (cuero mate, noche con barniz, asfalto muy rugoso). Luz de estudio: principal cálida arriba a la izquierda, contorno cálido por detrás a la derecha, relleno hemisférico plata/albúmina y entorno de estudio tenue; tono ACES. Sobre las placas SVG (tiro, acabados, cierre) cada balón 3D copia posición, giro y opacidad de su balón SVG, que queda invisible como guía; con el destello se enciende con un brillo emisivo cálido. Sin WebGL, o mientras carga, los balones SVG son la página.

### Vista explosionada 3D
El balón se abre por su costura central; aparecen la cámara translúcida, seis tirantes hacia el módulo y el módulo de sensores con aristas cuero y un led que respira. Todo deriva de una sola variable de scroll; las cuatro anotaciones entran en umbrales fijos.

### Macro "El tacto no cambia"
La cámara se acerca del balón entero al cruce de costuras y la luz principal baja hasta rasante para que cada grano proyecte sombra. Un anillo de profundidad de campo (desenfoque de 7px enmascarado en elipse) crece con la cercanía; una barra de escala de 10 mm medida en vivo aparece en la segunda mitad. El texto se apoya sobre un velo de albúmina oscura que sube desde abajo.

### Panel del bote
Un solo instrumento junto al balón: fondo albúmina, filete grid-strong, todo en Martian Mono con cifras tabulares. Cabecera con el número de bote en cuero; la fuerza del último impacto como cifra grande (44px, 32px en móvil) que rueda hasta su valor; velocidad, sentido y ritmo en filas clave/valor; y una gráfica de fuerza en el tiempo (línea cuero de 1,6px, rejilla discontinua, cursor punteado) que se revela hasta el instante actual, con un corchete bajo los dos últimos picos que marca el ritmo. Cada impacto dispara el destello del balón y una línea cuero que se abre en el suelo.

### La sesión
Cuatro ejercicios seguidos con un solo balón, en vista lateral de media pista y con física real: tiros libres, bote con armado y tiro, zigzag entre conos de cuero y tiros de rango desde 3, 4,6 y 6,75 m. Cada tiro calcula su velocidad para que la parábola entre por el centro del aro, atraviesa la red y cae; los botes usan la misma física del panel del bote, con aplastamiento al tocar el suelo. El scroll mueve un reloj único (suavizado 0,5s, `power2.out`) que recorre todas las tomas; cada tiro que sale y cada bote dispara el destello. Detrás del balón, una estela de cinco exposiciones a 0,06s entre sí (opacidad 0,30 → 0,10) que no cruza de una toma a otra. Los conos solo están plenos en el zigzag (12% en el resto); las marcas de distancia del suelo van en mono plata apagada.

### Línea de tiempo de la sesión
Una regla de tiempo, no una barra de progreso decorativa. Pista de 34px con filete grid-strong dividida en cuatro segmentos (filetes grid) con el nombre de cada ejercicio en mono 11px plata apagada; el avance es un relleno de cuero al 16% con borde derecho de cuero de 2px. A su derecha, el reloj en mono 20px plata con cifras tabulares, de 00:00 a 04:00: cada ejercicio vale un minuto, comprimido, y la advertencia del cuaderno lo dice.

### Cuaderno de sesión
Un panel de lectura (The Opaque Plate Rule): albúmina, filete grid-strong, mono 12px con cifras tabulares, relleno 16px 18px 12px. Cabecera de la lectura ("Cuaderno de sesión" y el contador `n / 4`). Una fila por ejercicio separada por filetes grid: pendiente al 35% con solo el nombre; en curso a opacidad plena con "midiendo…" en cuero; hecha con su resultado en plata ("3 de 3 dentro · salida 51°"). Al terminar aparece una línea de cierre tras un filete grid-strong ("Sesión completa · 04:00"); transiciones de 0,4-0,5s con `--ease-out`. Advertencia de datos sintéticos al pie.

### Copia revelada
Al apuntarse, aparece bajo el formulario una copia en papel con un tiro completo dibujado en la gramática de la placa y un pie mono de 12px (nombre y fecha). Se revela del negro de la cubeta al positivo (brillo 0 y sepia 1 → normal, 2,2s, `power2.out`), cae girada −1,5° y suena el obturador si está activo.

### Exposición y destello
Cada aparición de un balón en el relato (intro, tiro, bote, sesión, acabado) entra con un destello: un halo radial cálido de 2,8 veces el radio se abre detrás (opacidad 0,95 → 0, escala 0,45 → 1,2, 0,9s, `expo.out`, mezcla `screen`), el balón baja de `brightness(1.8)` a 1 en 0,6s y el balón 3D enciende su brillo emisivo durante 0,7s. Antes de su turno, las exposiciones del tiro esperan latentes al 5%; después quedan atenuadas.

### Revelado (intro y titulares)
La primera lámina sale del negro como una copia en la cubeta (brillo 0,06, contraste 1,6 y sepia 0,5 → normal, 1,5s); se disparan las tres primeras exposiciones y después sube el texto. Los titulares de sección suben línea a línea desde detrás de una máscara (110% → 0, 1,1s, escalonado 0,1s, `expo.out`) al entrar en pantalla. Ninguna intro bloquea más de 4s.

## Do's and Don'ts

### Do:
- **Do** dibujar cada nueva sección sobre la misma placa: albúmina, cuadrícula 45/180px, grano encima y suelo plata cuando haya un objeto apoyado.
- **Do** enseñar los datos midiendo en el dibujo: anotación con ancla, clave y valor en Martian Mono, coma decimal y unidad.
- **Do** etiquetar cada cifra inventada con la advertencia mono de 11px ("Concepto · datos de demostración").
- **Do** hacer entrar cada balón con el destello (halo cálido 0,9s, brillo 1,8 → 1 en 0,6s, `expo.out`) y dejar la estela atenuada; los titulares suben tras su máscara de línea y las copias se revelan desde el negro.
- **Do** dar a todo lo interactivo forma de píldora y a todo lo que mide o se imprime esquina viva.
- **Do** montar cualquier balón 3D nuevo sobre un balón SVG que marque su posición, giro y opacidad, para que la página siga completa sin WebGL.
- **Do** presentar los resultados como copias en positivo: papel claro, tinta oscura, sombra de papel, sin halo.
- **Do** ofrecer con `prefers-reduced-motion` el relato completo impreso: todas las exposiciones visibles, grano quieto, sin intro, sin pin; la sesión queda en su estado final (cuaderno completo, reloj en 04:00).

### Don't:
- **Don't** añadir un segundo color con croma; el cuero es el único pigmento, y la luz cálida solo existe como destello o como foco sobre el suelo.
- **Don't** poner el balón flotando en el vacío con un resplandor permanente, ni agrupar características en una rejilla de tarjetas.
- **Don't** elevar paneles con sombras, desenfoque o transparencias sobre la ilustración; usa albúmina opaca y filete. Solo el botón y el papel proyectan sombra.
- **Don't** escribir prosa en Martian Mono ni cifras de sensor en Archivo.
- **Don't** usar claves mono en mayúsculas como antetítulos sueltos sobre los titulares; solo existen pegadas a una medida.
- **Don't** escribir colores del balón directamente; cambia el acabado con `data-finish` y deja que los tokens `--ball-*` interpolen y el balón 3D escuche `finishchange`.
- **Don't** activar sonido por defecto; el obturador solo suena si el visitante lo enciende.
