# Pindeco · Web

Sitio web de **Pindeco — Aplicación de pinturas y revestimientos**: lacado y restauración de mobiliario y empapelado de paramentos en Asturias.

Es una web estática (HTML + CSS + JavaScript, sin framework ni proceso de compilación), pensada para abrirse tal cual o subirse a cualquier hosting estático como Vercel.

## Estructura

Todos los archivos van en la misma carpeta, al mismo nivel:

```
pindeco/
├── index.html          # Marcado de la página
├── styles.css          # Todos los estilos
├── script.js           # Menú, comparador antes/después, subida de archivos y envío
├── pindeco-dark.png    # Logo para fondos claros (cabecera)
└── pindeco-trans.png   # Logo blanco para fondos oscuros (pie de página)
```

> Importante: para que funcione, los cinco archivos deben estar juntos en la misma carpeta. Si se separan, la página se ve sin estilos ni logos.

## Ver en local

Opción sencilla: abre `index.html` con doble clic en el navegador.

Opción recomendada (con recarga automática) en VS Code:

1. Instala la extensión **Live Server** (Ritwick Dey).
2. **Archivo → Abrir carpeta** sobre la carpeta `pindeco`.
3. Clic derecho en `index.html` → **Open with Live Server** (o el botón **Go Live** de la barra inferior).

Las tipografías (Fredoka y Hanken Grotesk) se cargan desde Google Fonts, así que la primera vez necesita conexión a internet.

## Publicar en Vercel (desde GitHub)

1. Sube el proyecto a un repositorio de GitHub (en VS Code: panel **Control de código fuente → Publicar en GitHub**). Asegúrate de que `index.html` queda en la **raíz** del repositorio.
2. En [vercel.com](https://vercel.com): **Add New… → Project → Import Git Repository** y elige el repo.
3. Configuración:
   - **Framework Preset:** Other
   - **Build Command:** *(vacío)*
   - **Output Directory:** raíz del proyecto
4. **Deploy**.

A partir de ahí, cada `commit` + `push` redespliega la web automáticamente.

> Nota: GitHub y Vercel distinguen mayúsculas de minúsculas en los nombres de archivo. Aquí están todos en minúscula y las referencias coinciden; tenlo en cuenta si renombras algo.

## Personalizar

- **Logos:** sustituye `pindeco-dark.png` (fondos claros) y `pindeco-trans.png` (fondos oscuros) manteniendo los mismos nombres. Si tienes el logo vectorial (SVG/AI), se puede generar una versión más nítida.
- **Colores de marca:** están centralizados al principio de `styles.css`, en `:root` (`--amarillo`, `--rojo`, `--verde`, `--azul`, etc.).
- **Tipografías:** se cargan en el `<head>` de `index.html` desde Google Fonts.
- **Textos:** todo el contenido está en `index.html`.
- **Fotos:** la galería y el comparador *antes/después* usan paneles de muestra; se sustituyen por imágenes reales en `index.html`.

## Formulario de contacto

El formulario incluye subida de archivos (fotos y PDF) con validación. Por ahora es **solo front-end**: muestra el mensaje de confirmación, pero todavía **no envía** los datos a ningún sitio.

Para recibir las solicitudes por correo (con los archivos adjuntos) hay que conectarlo a un backend: una función serverless en Vercel o un servicio externo tipo Formspree.

## Secciones de la web

Cabecera · Portada · Servicios (lacado, restauración, empapelado) · Comparador antes/después · Cómo trabajamos · El taller · Opiniones · Contacto · Pie de página.

---

© Pindeco · Aplicación de pinturas y revestimientos

## Cambiar las imágenes (sin tocar el código)

Las imágenes de cada sección se controlan desde el archivo **`images.json`** y la carpeta **`img/`**.

Cada zona tiene una etiqueta:

| Etiqueta          | Dónde aparece                         |
|-------------------|----------------------------------------|
| `compare-before`  | Comparador · foto "antes"              |
| `compare-after`   | Comparador · foto "después"            |
| `gallery-1/2/3`   | Galería de trabajos (tres fotos)       |
| `taller`          | Foto del taller                        |
| `hero-1` / `hero-2` | Imágenes de la portada               |

Para cambiar una foto tienes dos formas:

1. **La más fácil (mismo nombre):** sube tu foto a la carpeta `img/` con el mismo nombre que la actual (por ejemplo `despues.jpg`). En GitHub: entra en la carpeta `img/` → **Add file → Upload files** → arrástrala → **Commit**. Vercel republica solo.
2. **Con otro nombre:** sube la foto a `img/` con el nombre que quieras y edita `images.json` para apuntar a ella, p. ej. `"src": "img/mi-foto.jpg"`. Commit y listo.

Recomendaciones: usa `.jpg` para fotos (pesan menos), con el lado largo sobre 1200–1600 px, y nombres en minúscula y sin espacios ni tildes.

> Si una imagen no existe o se abre el sitio en local sin servidor, esa zona muestra un degradado de muestra en lugar de la foto.
