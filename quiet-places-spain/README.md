# Mapa de Lugares Tranquilos en España

> Mapa interactivo de supermercados con hora silenciosa, espacios naturales certificados,
> bibliotecas con salas sensoriales y otros lugares accesibles para personas con TEA,
> hipersensibilidad sensorial, TDAH y ansiedad.

**Estado:** Prototipo v0.1 · Código abierto · Sin ánimo de lucro

---

## Capturas / Demo

Abre `index.html` en tu navegador directamente o sirve la carpeta con cualquier servidor HTTP:

```bash
# Opción 1: Python
python3 -m http.server 8080

# Opción 2: Node
npx serve .
```

Luego visita `http://localhost:8080`.

---

## Estructura del proyecto

```
quiet-places-spain/
├── index.html              # Mapa principal (HTML/CSS/JS con Leaflet)
├── css/style.css           # Estilos
├── js/map.js               # Lógica del mapa
├── data/
│   ├── demo.geojson        # 10 lugares FICTICIOS de demostración
│   └── real.geojson        # Lugares reales verificados con fuentes
├── scripts/
│   ├── csv_to_geojson.py   # Script de importación CSV → GeoJSON
│   └── plantilla_lugares.csv  # Plantilla CSV para añadir lugares
└── docs/
    ├── emails_colaboracion.md   # 3 borradores de email para asociaciones
    ├── roadmap.md               # Hoja de ruta, fases y costes
    └── limitaciones_y_fuentes.md  # Transparencia: qué se encontró y qué no
```

---

## Añadir nuevos lugares

### Opción A — CSV + script Python

1. Copia `scripts/plantilla_lugares.csv` y rellena tus lugares.
2. Ejecuta el script:

```bash
python3 scripts/csv_to_geojson.py \
  --input tu_archivo.csv \
  --output data/real.geojson \
  --merge   # para fusionar con datos existentes sin perderlos
```

El script valida cada fila, avisa de errores y genera el GeoJSON listo para usar.

**Columnas obligatorias:**
`nombre, tipo, direccion, ciudad, provincia, comunidad, latitud, longitud, fuente_url, verificacion`

### Opción B — Editar el GeoJSON directamente

Abre `data/real.geojson` y añade un nuevo Feature siguiendo la estructura existente.
El campo `fuente_url` es obligatorio para datos reales.

### Opción C — Formulario en el mapa

Usa el botón "Sugerir un lugar" en el mapa. Las sugerencias son revisadas
manualmente antes de ser añadidas (actualmente requiere backend).

---

## Tipos de lugar reconocidos

| Valor en GeoJSON | Descripción | Icono |
|---|---|---|
| `supermercado_hora_silenciosa` | Supermercado con hora silenciosa | 🛒 |
| `centro_comercial_hora_silenciosa` | Centro comercial con hora silenciosa | 🏬 |
| `espacio_natural_certificado` | Espacio natural con certificación de silencio | 🌲 |
| `biblioteca_sala_sensorial` | Biblioteca con sala o espacio sensorial | 📚 |
| `centro_civico_zona_silencio` | Centro cívico con zona de silencio | 🏛️ |
| `hotel_politica_silencio` | Hotel con política de silencio o adaptaciones sensoriales | 🏨 |
| `sala_estudio_accesible` | Sala de estudio accesible sensorialmente | 📖 |

---

## Datos verificados incluidos (v0.1)

| # | Lugar | Tipo | Horario silencioso | Fuente |
|---|---|---|---|---|
| 1 | Carrefour Hipermercado (toda España) | Supermercado | 15:00-16:00 L-D | Autismo España |
| 2 | Carrefour Market (147 tiendas, toda España) | Supermercado | 15:00-16:00 L-D | Autismo España |
| 3 | Supermercados Altoaragón (14 tiendas, Huesca) | Supermercado | 15:00-16:00 L-D | iGastro Aragón |
| 4 | Centro Comercial Los Ángeles (Madrid, Villaverde) | Centro comercial | 14:30-16:30 L-D | CC Los Ángeles |
| 5 | Centro Comercial Diagonal Mar (Barcelona) | Centro comercial | 15:00-16:00 L-D | Distribución Actualidad |
| 6 | Centro Comercial La Sierra (Córdoba) | Centro comercial | 15:00-16:00 Sábados | CC La Sierra |
| 7 | Parc del Montnegre i el Corredor (Barcelona) | Espacio natural | Acceso libre | Quiet Parks Int. |
| 8 | Biblioteca Bon Pastor (Barcelona) | Biblioteca | Previa reserva | Ajuntament BCN |
| 9 | Biblioteca García Márquez (Barcelona) | Biblioteca | Previa reserva | Ajuntament BCN |

---

## Limitaciones conocidas

- **Mercadona, Lidl, Alcampo y Día**: sin hora silenciosa confirmada a abril 2026.
- **No hay base de datos centralizada** en España. Cada dato requiere verificación individual.
- **Los horarios pueden cambiar**: verifica siempre en la web oficial antes de visitar.
- Algunos datos de centros comerciales son de fuentes secundarias (prensa), no verificación directa con el centro.

Ver detalles en `docs/limitaciones_y_fuentes.md`.

---

## Tecnología

- **Mapa**: [Leaflet](https://leafletjs.com/) 1.9.4
- **Tiles**: CartoDB Positron (sin coste, atribución incluida)
- **Datos**: GeoJSON estático (no requiere base de datos ni servidor)
- **Script de importación**: Python 3.9+ (sin dependencias externas)
- **Alojamiento sugerido**: GitHub Pages (gratuito) o Netlify/Vercel

---

## Colaborar

1. **Sugerir lugares**: usa el formulario del mapa o abre un Issue en GitHub con la URL de la fuente.
2. **Verificar datos existentes**: visita el lugar y confirma (o desmiente) los datos del mapa.
3. **Código**: Pull Requests bienvenidos para mejorar el mapa, el script o la documentación.
4. **Asociaciones**: si representas a una asociación de TEA, salud mental o turismo accesible, contacta para establecer una colaboración formal. Ver `docs/emails_colaboracion.md`.

---

## Licencia

Código: MIT License.
Datos GeoJSON: CC BY-SA 4.0 — puedes usar, compartir y adaptar los datos con atribución.

---

## Créditos y agradecimientos

- [Autismo España](https://autismo.org.es) — programa La Hora Silenciosa con Carrefour
- [Quiet Parks International](https://quietparks.org) — certificación de espacios naturales
- [Ajuntament de Barcelona - Biblioteques](https://ajuntament.barcelona.cat/biblioteques) — salas sensoriales
- Todas las organizaciones y asociaciones citadas en `docs/limitaciones_y_fuentes.md`
