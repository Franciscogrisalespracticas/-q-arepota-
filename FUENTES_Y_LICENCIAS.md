# Q AREPOTA - Fuentes, derechos y medios

## Imagenes originales

Las imagenes de los siete platos que se incluyen en `assets/images` y `public/assets/images` se generaron para la maqueta. La fotografia actualizada de chuzo y butifarras fue generada especialmente para esta version, sin asado ni brasas. **No corresponden a recetas o platos fotografiados en el local real.**

## Videos reales de cocina: 7 fuentes distintas, 0 MP4 incluidos

Estas URL remiten a paginas verificadas de Pexels que describen videos REALES, no animaciones CSS. Cada video aparece asociado a un producto distinto, y el sitio lo intenta reproducir con `https://www.pexels.com/download/video/ID/?w=960&h=540` cuando no haya MP4 local.

**Ninguno de estos MP4 esta incluido ahora en el ZIP.** La red del entorno de creacion bloquea las descargas HTTPS externas. `descargar_videos.bat` intentara obtenerlos desde Windows. La reproduccion remota en el navegador no pudo verificarse y no debe dependerse de ella en produccion.

Los videos son ilustrativos de preparaciones de cocina, no grabaciones verificadas del restaurante. El video de butifarras corresponde a salchichas que se cocinan en una sarten; **no se ha podido confirmar que muestre butifarra colombiana**. Para representar de manera exacta las butifarras de Q Arepota es preferible incorporar una filmacion propia.

| Producto | Autor | Video de Pexels | Archivo local | Alcance del material |
|---|---|---|---|---|
| Burger La Monumental | Pilan Filmes | https://www.pexels.com/video/hands-preparing-hamburger-12282853/ | `hamburguesa.mp4` | Cocina real: manos preparando una hamburguesa gourmet. Video ilustrativo. |
| Chuzo de Carne con Arepa | Anna Tarazevich | https://www.pexels.com/video/a-person-flipping-meat-in-skewers-on-a-flat-top-griddle-7008584/ | `chuzo.mp4` | Cocina real: pinchos volteados sobre plancha plana. No muestra el acompanamiento final. |
| Arepota de Pollo | Cristina Cespedes | https://www.pexels.com/video/freshly-grilled-arepas-on-hot-griddle-37232230/ | `arepa-pollo.mp4` | Cocina real: arepas colombianas en plancha; la foto final muestra el relleno. |
| Pollo Desmechado | sadiq Padela | https://www.pexels.com/video/person-taking-shredded-meat-from-a-pan-5528176/ | `pollo-desmechado.mp4` | Cocina real: manipulacion de pollo desmechado caliente con pinzas. |
| Perro Callejero XL | Andrei Diachenko | https://www.pexels.com/video/artisan-hot-dog-with-gourmet-sauces-40426481/ | `perro.mp4` | Cocina real: preparacion de perro caliente con salsas gourmet. |
| Salchipapa Especial | Arshan Ali | https://www.pexels.com/video/fries-on-plates-13253647/ | `salchipapa.mp4` | Cocina real: papas servidas en plato. Es un video relacionado, no la receta exacta. |
| Butifarras de la Casa | IslandHopper X | https://www.pexels.com/video/sizzling-sausages-cooking-in-a-pan-36003039/ | `butifarras.mp4` | Cocina real: salchichas pequenas en sarten. Video contextual; no son butifarras colombianas identificadas. |

## Licencia

Pexels permite el uso y modificacion gratuita de sus fotos y videos, incluso para fines comerciales, con restricciones sobre marcas, imagen personal y redistribucion de contenido sin modificar. Fuente: https://www.pexels.com/license/ y https://help.pexels.com/hc/es/articles/360042295214--Puedo-usar-las-fotos-y-los-videos-para-un-proyecto-comercial .

La licencia de contenido no implica permiso ilimitado para consumir el CDN ajeno como infraestructura. Para uso comercial estable, almacenar y servir localmente los archivos autorizados. No se han incorporado videos de YouTube, Instagram ni TikTok ajenos sin licencia demostrable.

## Guardar los siete MP4

1. Ejecuta `descargar_videos.bat` con Python 3 e internet.
2. Abre manualmente las URL de esta tabla si no permiten descarga automatica.
3. Guarda cada `.mp4` en `public/assets/video/` con el nombre exacto indicado.
4. Ejecuta `python scripts/descargar_videos.py --rebuild-only` para generar el manifiesto y copiar los MP4 a `assets/video` (Live Server).
5. Inicia Live Server en `preview/index.html` o ejecuta `npm run dev`.
6. Comprueba la reproduccion de los siete videos en tu navegador. No confundas la foto de respaldo con un video real.

Todos los enlaces y autores tambien estan en `VIDEO_SOURCES.json`.
