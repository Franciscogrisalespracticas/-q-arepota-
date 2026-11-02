# Q AREPOTA - CINE REAL V2

Proyecto de demostracion basado en la version Q AREPOTA IMMERSIVE anterior. Ahora incorpora fotos renovadas, un reproductor de videos de archivo para **cada uno de los siete platos**, y sustitucion de empanadas por butifarras.

## Correcciones de esta version

- No hay vocabulario ni escenario publicitario de asado, carbon, fogata o brasas: el negocio usa plancha/parrilla plana.
- Chuzo de carne con arepa: fotografia nueva en plancha, sin carbon.
- Butifarras de la Casa: imagen nueva y producto completo reemplazando a empanadas.
- Cada plato tiene **un identificador de video de archivo distinto**, reproducible con sonido desactivado al entrar en pantalla.
- Ya no se representa un zoom de fotografia como si fuera un video real. Al fallar la reproduccion, se ve la foto del producto.
- Reproductor compartido entre el carrusel grande, las siete tarjetas, la ficha detallada, la portada y la escena de cocina. Se limita a dos videos reproduciendose simultaneamente.
- La tienda, los precios de ejemplo, el carrito y el diseno responsive se conservaron.

## Importante: material audiovisual

Este ZIP incluye **0 archivos MP4 de Pexels**. El entorno de construccion carece de conexion HTTPS para descargar videos. No debe confundirse una URL verificada a su pagina con un archivo descargado y reproducido. 

La pagina intenta reproducir los **videos reales remotos** desde el endpoint oficial de descarga de Pexels cuando existe una conexion a internet. Esto NO esta garantizado: las restricciones de red del visitante o del proveedor pueden impedir la reproduccion. Cuando ocurre, se muestra la fotografia estatica con un estado explicito. Los videos nunca fueron simulados con movimientos sobre fotografias.

Para una copia autocontenida, necesitas instalar los siete MP4 en tu Windows:

1. Ejecuta `descargar_videos.bat` (Python 3 + internet), o inicia `INSTALAR_Y_ABRIR.bat`.
2. Si alguno falla, abre `FUENTES_Y_LICENCIAS.md`, descarga manualmente el video de su pagina original y guardalo con el nombre mostrado en `public/assets/video/`.
3. Ejecuta `python scripts/descargar_videos.py --rebuild-only`. Este paso genera el manifiesto y copia los clips a `assets/video` para Live Server.
4. Abre la pagina y confirma que el distintivo del protagonista diga `VIDEO REAL EN REPRODUCCION`.

**Los clips son de archivo y describen preparaciones relacionadas**. No son filmaciones verificadas de productos del negocio. Especialmente el de butifarras muestra salchichas cocinandose, no un video identificable de butifarra colombiana.

## Abrir con Live Server, sin npm

Abre la carpeta en VS Code y ejecuta **Open with Live Server** especificamente sobre `preview/index.html`.

Tambien puedes ejecutar `start.bat` si Node.js esta instalado: sin `node_modules` inicia un servidor de la vista previa en http://localhost:5173/.

## Ejecutar con Vite + React + TypeScript

Requisitos: Node.js moderno y acceso al registro npm:

```
npm install
npm run dev
```

Para verificar produccion:

```
npm run build
npm run preview
```

Esta instalacion/build de npm no se pudo completar desde el entorno sin acceso al registro de paquetes. La vista previa React sin npm si fue compilada y se comprobo mediante pruebas automatizadas separadas.

## Configurar WhatsApp y ubicacion

Edita `public/config.js` para colocar numero real en formato `57XXXXXXXXXX`, direccion, enlace del mapa y horarios. El catalogo contiene precios demostrativos en `src/catalog.ts`. No se cobran pagos ni se registran pedidos en un backend.

## Componentes clave

- `src/App.tsx`: carrusel principal, catalogo, pedidos y fichas.
- `src/catalog.ts`: siete productos y siete fuentes de video.
- `src/real-video.tsx`: reproductor de video **real** en formato MP4, local primero, remoto despues, con fallbacks y limite de reproduccion.
- `src/motion.ts`: iluminacion ambiental, particulas neutras y revelado de secciones (no simula comida en movimiento).
- `src/styles.css`: diseno responsive.
- `VIDEO_SOURCES.json`, `FUENTES_Y_LICENCIAS.md`: recursos y permisos de uso.
- `docs/PRUEBAS_V2.md`: pruebas efectuadas y pendientes.

Esta version sigue siendo una demostracion; no es apta para publicarse comercialmente sin validar los MP4 reales, precios, direcciones y numero de WhatsApp.
