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
| `comparisons`     | Carrusel antes/después (lista de trabajos) |
| `gallery-1/2/3`   | Galería de trabajos (tres fotos)       |
| `taller`          | Foto del taller                        |
| `hero-1` / `hero-2` | Imágenes de la portada               |

### Carrusel antes/después

Es una **lista** dentro de `images.json`. Cada elemento es un trabajo con su foto "antes", su "después" y un título:

```json
"comparisons": [
  { "title": "Cómoda restaurada", "before": "img/antes.jpg", "after": "img/despues.jpg" },
  { "title": "Cocina lacada",     "before": "img/antes-2.jpg", "after": "img/despues-2.jpg" }
]
```

Para **añadir** un trabajo, copia un bloque `{ ... }`, súbelo a `img/` y apunta a sus archivos. Para **quitarlo**, borra su bloque. Las flechas y los puntos del carrusel se ajustan solos al número de trabajos.

Para cambiar una foto tienes dos formas:

1. **La más fácil (mismo nombre):** sube tu foto a la carpeta `img/` con el mismo nombre que la actual (por ejemplo `despues.jpg`). En GitHub: entra en la carpeta `img/` → **Add file → Upload files** → arrástrala → **Commit**. Vercel republica solo.
2. **Con otro nombre:** sube la foto a `img/` con el nombre que quieras y edita `images.json` para apuntar a ella, p. ej. `"src": "img/mi-foto.jpg"`. Commit y listo.

Recomendaciones: usa `.jpg` para fotos (pesan menos), con el lado largo sobre 1200–1600 px, y nombres en minúscula y sin espacios ni tildes.

> Si una imagen no existe o se abre el sitio en local sin servidor, esa zona muestra un degradado de muestra en lugar de la foto.

## Configurar el envío del formulario (FormSubmit)

El formulario de contacto envía las solicitudes (con fotos adjuntas) por correo usando **FormSubmit**, un servicio gratuito que no necesita servidor. Pasos para activarlo:

1. En `index.html`, busca la línea del formulario y cambia el correo:
   `action="https://formsubmit.co/TU-CORREO@ejemplo.com"` → pon tu email real.
2. Sube el cambio (commit + push). La **primera vez** que alguien envíe el formulario, FormSubmit te mandará un correo de confirmación: ábrelo y pulsa el enlace para **activar** el formulario (solo se hace una vez).
3. Cuando sepas la dirección final de tu web en Vercel, cambia también el `_next` por tu página de gracias, p. ej.:
   `value="https://web-tienda.vercel.app/gracias.html"`
   (Si lo dejas sin cambiar, FormSubmit mostrará su propia página de agradecimiento.)

**Qué hace ya:**
- Te llega un correo con los datos y las **fotos adjuntas**.
- El cliente recibe una **autorrespuesta** automática (texto editable en el campo `_autoresponse`).
- Tras enviar, el cliente ve la página `gracias.html`.

**Límites y notas:**
- FormSubmit admite hasta **10 MB sumando todas las fotos**. El formulario ya avisa si se supera.
- Para que funcione la autorrespuesta, el envío usa el método estándar (no AJAX); por eso el cliente pasa por una breve verificación antispam de FormSubmit antes de llegar a la página de gracias.
- Cuando quieras algo más profesional (correo desde tu propio dominio, sin límite de 10 MB, plantillas a medida), se puede migrar a una función serverless en Vercel + Resend.
