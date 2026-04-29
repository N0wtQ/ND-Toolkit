# 🔇 Mapa de Lugares Tranquilos en España

Mapa interactivo para encontrar lugares con baja estimulación sensorial en España: supermercados con **hora silenciosa**, espacios naturales certificados, bibliotecas con sala sensorial y centros comerciales adaptados.

Dirigido a personas con TEA, hipersensibilidad sensorial, TDAH y ansiedad — y a cualquiera que prefiera comprar o descansar sin ruido, música ambiental ni megafonía.

---

## Demo

Abre [`index.html`](./index.html) en tu navegador. No necesita servidor ni instalación.

```bash
# O sirve la carpeta localmente:
python3 -m http.server 8080
```

---

## Qué incluye el mapa

| Tipo | Icono | Ejemplo |
|---|---|---|
| Supermercado con hora silenciosa | 🛒 | Carrefour (15:00–16:00, todos los días) |
| Centro comercial con hora silenciosa | 🏬 | C.C. Los Ángeles Madrid (14:30–16:30) |
| Espacio natural certificado | 🌲 | Parc del Montnegre i el Corredor |
| Biblioteca con sala sensorial | 📚 | Biblioteca Bon Pastor, Barcelona |
| Centro cívico / sala de silencio | 🏛️ | — |
| Hotel con política de silencio | 🏨 | — |

Dos capas de datos seleccionables:
- **Demo** — 10 puntos ficticios `[DEMO]` para ver el mapa funcionando
- **Verificados** — lugares reales con fuentes citadas

---

## Datos verificados (v0.1)

| Lugar | Hora silenciosa | Fuente |
|---|---|---|
| Carrefour Hipermercados y Market (red nacional) | 15:00–16:00 · L–D | [Autismo España](https://autismo.org.es/actualidad/noticias/carrefour-espana-extiende-la-hora-silenciosa-favor-de-las-personas-con-autismo-e/) |
| Supermercados Altoaragón (14 tiendas, Huesca) | 15:00–16:00 · L–D | [iGastro Aragón](https://www.igastroaragon.com/2024/04/supermercados-altoaragon-activa-la-hora-silenciosa-en-apoyo-a-las-personas-con-autismo-e-hipersensibilidad-sensorial.html) |
| C.C. Los Ángeles (Villaverde, Madrid) | 14:30–16:30 · L–D | [Web oficial](https://centrocomerciallosangeles.es/hora-silenciosa-en-los-angeles/) |
| C.C. Diagonal Mar (Barcelona) | 15:00–16:00 · L–D | [Distribución Actualidad](https://www.distribucionactualidad.com/hora-silenciosa-llega-mas-supermercados-y-centros-comerciales/) |
| C.C. La Sierra (Córdoba) | 15:00–16:00 · Sábados | [Web oficial](https://centrocomerciallasierra.com/eventos/hora-silenciosa/) |
| Parc del Montnegre i el Corredor (Barcelona) | Acceso libre | [Quiet Parks International](https://www.quietparks.org/parc-del-montnegre-i-el-corredor-spains-first-urban-quiet-park) |
| Biblioteca Bon Pastor (Barcelona) | Previa reserva | [Ajuntament BCN](https://ajuntament.barcelona.cat/biblioteques/bibbonpastor/es/canal/espai-sensorial) |
| Biblioteca García Márquez (Barcelona) | Previa reserva | [Ajuntament BCN](https://ajuntament.barcelona.cat/biblioteques/es/bibgarciamarquez/colecciones/espacio-sensorial-1409755) |

> ⚠️ Los horarios pueden cambiar. Verifica siempre en la web oficial antes de tu visita.

### Cadenas sin hora silenciosa confirmada (a abril 2026)

**Mercadona, Lidl, Alcampo y Día** no tienen hora silenciosa documentada en fuentes públicas. No se incluyen hasta encontrar evidencia verificable.

---

## Añadir un lugar

**Opción A — CSV + script Python:**

```bash
# Rellena scripts/plantilla_lugares.csv y ejecuta:
python3 scripts/csv_to_geojson.py \
  --input scripts/plantilla_lugares.csv \
  --output data/real.geojson \
  --merge
```

**Opción B — editar el GeoJSON directamente** (`data/real.geojson`). El campo `fuente_url` es obligatorio.

**Opción C — botón "Sugerir un lugar"** en el mapa (requiere backend para persistir).

---

## Tecnología

- [Leaflet](https://leafletjs.com/) 1.9.4 — sin dependencias de build
- Tiles: CartoDB Positron (gratuito, atribución incluida)
- Datos en GeoJSON estático — funciona desde GitHub Pages sin servidor

---

## Colaborar

- **Sugerir un lugar**: abre un Issue con el nombre, dirección y URL de la fuente oficial
- **Verificar datos**: si visitas un lugar del mapa, confirma o corrija en un Issue
- **Asociaciones**: si representas a una organización de TEA o salud mental, escríbenos para establecer colaboración formal (ver [`docs/emails_colaboracion.md`](./docs/emails_colaboracion.md))

---

## Licencia

Código: MIT · Datos: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)

Agradecimientos: [Autismo España](https://autismo.org.es) · [Quiet Parks International](https://quietparks.org) · [Biblioteques de Barcelona](https://ajuntament.barcelona.cat/biblioteques)
