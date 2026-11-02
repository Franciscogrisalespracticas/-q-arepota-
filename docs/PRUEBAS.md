# Informe de pruebas - Q Arepota Cine Real V2

Fecha: 2026-11-02.

## Aprobado en el entorno

- El catalogo mantiene siete productos con IDs independientes.
- `butifarras` sustituye a `empanadas` en el catalogo y activos publicados.
- Chuzo, portada y textos comerciales usan plancha y no representan brasas ni carbon.
- Existen siete imagenes WebP para el producto final y siete URLs independientes de archivo Pexels.
- El reproductor React genera un elemento `<video>` por producto, pausa los elementos fuera de pantalla e intenta reproducir maximo dos simultaneamente.
- Los estados de video cuentan con fallback a fotografia y una advertencia si el recurso falla.
- `node scripts/build-preview.cjs` compilo una vista independiente para Live Server.
- `node scripts/test-offline.cjs` paso pruebas de sintaxis de archivos TS/TSX, integridad de fotos y recursos, catalogo, IDs, videoteca y carrito.
- Pruebas de navegador Chromium con HTML y recursos incrustados en `about:blank` (la navegacion hacia localhost esta bloqueada por el administrador de este entorno): se visualizaron hero, 7 tarjetas, 10 reproductores vinculados, flechas a derecha, seleccion del ultimo plato (Butifarras), apertura de carrito y de ficha, menu movil y anchura de 390px sin desplazamiento horizontal. No se observaron excepciones JS en esta prueba.
- Capturas: `qa-v2-desktop-hero.png`, `qa-v2-desktop-menu.png`, `qa-v2-mobile-hero.png`, `qa-v2-mobile-menu.png`.

## Limitaciones reales, no probadas

- Se intentaron conexiones externas a Pexels desde el contenedor: DNS / HTTPS bloqueado. Ningun MP4 real pudo descargarse ni incluirse.
- No se pudo probar el redireccionamiento y reproduccion del MP4 remoto de Pexels en un navegador conectado.
- Las pruebas de navegador utilizaron un video corto de patron audiovisual **solo como fixture temporal de laboratorio**, NO lo incluyen en el producto y NO demuestran que los videos de Pexels carguen.
- No se pudo ejecutar `npm install` ni `npm run build` de la version profesional Vite, por bloqueo al registro de npm. El codigo React/TypeScript se valido sintacticamente y se compilo la vista previa sin npm.
- No se midieron FPS, Core Web Vitals ni calidad visual de los videos originales.
- El video stock elegido para butifarras solo muestra salchichas, sin confirmacion de identidad culinaria exacta.

## Estado de aceptacion

**Parcial**. Correccion de textos, catalogo, fotos, interfaz y logica de video verificada. La aceptacion completa de los siete videos reales queda condicionada a descargar los MP4 en Windows y reproducir cada uno, o sustituir clips contextuales por filmaciones del negocio.
