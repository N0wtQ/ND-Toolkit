# Hoja de Ruta — Mapa de Lugares Tranquilos en España

> Última actualización: 2026-04-16
> Estado actual: Fase 1 completada (prototipo funcional)

---

## Resumen ejecutivo

Un mapa interactivo de código abierto que localiza lugares tranquilos y sensorialmente accesibles en España: supermercados con hora silenciosa, espacios naturales certificados, bibliotecas con salas sensoriales y alojamientos adaptados. Dirigido a personas con TEA, hipersensibilidad sensorial, TDAH, ansiedad y sus familias.

---

## Fases del proyecto

### FASE 1 — Prototipo funcional ✅ COMPLETADA

**Duración:** 2 semanas | **Coste estimado:** 0 € (trabajo voluntario)

**Entregables completados:**
- [x] Mapa HTML/CSS/JS con Leaflet (capa demo + capa real, filtros, búsqueda)
- [x] GeoJSON de demostración (10 puntos ficticios [DEMO])
- [x] GeoJSON real verificado (10 lugares con fuentes citadas)
- [x] Script Python `csv_to_geojson.py` para importación masiva
- [x] Plantilla CSV para añadir lugares fácilmente
- [x] Borradores de emails para asociaciones y empresas
- [x] Formulario de sugerencia de nuevos lugares (frontend)
- [x] Documentación de limitaciones y fuentes

**Limitaciones documentadas de esta fase:**
- No existe base de datos centralizada oficial en España
- Mercadona, Lidl, Día y Alcampo NO tienen hora silenciosa confirmada (sin evidencia pública a abril 2026)
- El formulario de sugerencias es solo frontend (no persiste datos sin backend)
- Los datos de algunos centros comerciales son de fuentes secundarias (prensa), no verificación directa

---

### FASE 2 — Ampliación de datos y validación colaborativa

**Duración estimada:** 1-3 meses | **Coste estimado:** 0-200 €/mes

**Objetivos:**
- Alcanzar 50+ lugares verificados en el mapa real
- Establecer al menos 3 colaboraciones con asociaciones (TEA, salud mental, turismo accesible)
- Implementar backend para recibir y gestionar sugerencias

**Tareas clave:**
- [ ] Contactar y obtener respuesta de Autismo España, Federación Asperger España
- [ ] Contactar departamentos RSC de Carrefour, Alcampo, El Corte Inglés, IKEA
- [ ] Buscar y verificar centros comerciales con hora silenciosa en todas las comunidades autónomas
- [ ] Añadir espacios naturales: reservas de la biosfera, parques nacionales con baja contaminación acústica
- [ ] Integrar hoteles y casas rurales con política de silencio (vía plataformas de turismo accesible)
- [ ] Backend ligero para el formulario de sugerencias (Google Forms → hoja de cálculo → revisión manual → CSV → GeoJSON)
- [ ] Internacionalización básica (catalán, euskera, gallego)

**Costes estimados Fase 2:**
| Concepto | Coste mensual |
|---|---|
| Dominio (.es o .org) | 1-2 €/mes |
| Alojamiento (GitHub Pages) | 0 € |
| Alojamiento alternativo (Netlify/Vercel) | 0 € (plan gratuito) |
| Formulario backend (Formspree/Netlify Forms) | 0-19 €/mes |
| **Total** | **1-21 €/mes** |

---

### FASE 3 — Plataforma comunitaria y API

**Duración estimada:** 3-6 meses tras Fase 2 | **Coste estimado:** 20-100 €/mes

**Objetivos:**
- Mapa con 200+ lugares verificados
- Proceso de verificación comunitaria con moderación
- API pública (JSON/GeoJSON) para que otras apps consuman los datos
- Panel de administración para gestionar sugerencias

**Arquitectura técnica propuesta:**
```
Frontend: HTML/CSS/JS con Leaflet (ya construido)
Backend: FastAPI (Python) o Express (Node.js)
Base de datos: PostgreSQL + PostGIS (para consultas geoespaciales)
Alojamiento: Railway / Render (plan gratuito o ~5 €/mes)
CDN de imágenes: Cloudflare R2 (gratuito hasta 10 GB)
```

**Funcionalidades nuevas:**
- [ ] Cuenta de usuario para moderadores de asociaciones
- [ ] Sistema de votos "He estado aquí y confirmo" (crowdsourcing verificación)
- [ ] Alertas por email cuando un lugar cercano se añade al mapa
- [ ] Exportación de datos en múltiples formatos (CSV, GeoJSON, KML)
- [ ] Widget embebible para que asociaciones pongan el mapa en su web

**Costes estimados Fase 3:**
| Concepto | Coste mensual |
|---|---|
| Servidor backend (Railway/Render) | 5-20 € |
| Base de datos (Railway PostgreSQL) | 5-20 € |
| Dominio | 1-2 € |
| Emails transaccionales (Resend/Postmark) | 0-10 € |
| **Total** | **11-52 €/mes** |

---

### FASE 4 — Expansión internacional

**Duración estimada:** 6-12 meses tras Fase 3 | **Coste estimado:** +20-50 €/mes

**Prioridades de expansión:**
1. Portugal (idioma próximo, contexto similar)
2. Francia, Italia (países europeos con movimientos similares)
3. Latinoamérica (México, Argentina, Colombia — alta demanda TEA)

**Modelo de gobernanza:**
- Grupos de trabajo locales por país
- Cada país tiene su propio conjunto de datos GeoJSON
- Frontend multiidioma (i18n)

---

## Hitos y métricas de éxito

| Hito | Indicador | Plazo estimado |
|---|---|---|
| Prototipo en línea | URL pública accesible | Fin Fase 1 ✅ |
| Primera colaboración confirmada | Email o acuerdo firmado | 4 semanas |
| 50 lugares verificados | Contar features en real.geojson | 8 semanas |
| 1.000 visitas únicas/mes | Google Analytics / Plausible | 3 meses |
| API pública documentada | Swagger/OpenAPI disponible | 6 meses |
| 500 lugares verificados | Contar features en BD | 12 meses |

---

## Riesgos y mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Las empresas cambian el horario sin avisar | Alta | Medio | Campo `fecha_verificacion` + recordatorio anual + crowdsourcing |
| Datos incorrectos publicados sin verificar | Media | Alto | Proceso editorial estricto + etiqueta "pendiente de verificación" |
| Falta de voluntarios para moderar | Media | Alto | Automatizar con Google Forms + alertas; umbral mínimo de 2 fuentes |
| Dependencia de una sola persona | Media | Alto | Documentación completa + repositorio abierto |
| GDPR: datos personales en sugerencias | Baja | Alto | Solo recoger email de forma opcional; política de privacidad desde Fase 2 |

---

## Estrategia de validación de colaboraciones

### Criterios mínimos para incluir un lugar verificado:
1. **Fuente primaria**: web oficial de la empresa, institución o cadena que confirma la medida
2. **O fuente secundaria de calidad**: artículo de prensa seria (El País, El Mundo, La Vanguardia, 20minutos) o publicación de asociación reconocida (Autismo España, Asperger España, FEAPS)
3. **Fecha de verificación** registrada (los datos caducan si superan 18 meses sin reconfirmación)
4. **Coordenadas** precisas (no ciudad genérica para lugares puntuales)

### Criterios para marcar como "pendiente de verificación":
- Mención en redes sociales sin confirmación oficial
- Fuente de más de 18 meses de antigüedad
- Fuente secundaria sin URL oficial que la respalde

### Criterios para excluir definitivamente:
- Sin ninguna fuente verificable
- Información contradictoria entre fuentes
- El establecimiento ha cerrado o cancelado la medida

---

## Plan de comunicación inicial

### Semana 1-2 (tras lanzar el mapa):
- Publicar en redes sociales con etiquetas: #TEA #HoraSilenciosa #AutismoEspaña #NeurodiversidadEspaña
- Compartir en grupos de Facebook/Telegram de familias con TEA
- Enviar email a Autismo España y Federación Asperger España

### Semana 3-4:
- Contactar con medios especializados: Revista Haz, El Mundo de los Autistas, Cadena SER (programa sobre diversidad funcional)
- Enviar a departamentos RSC de Carrefour España, Alcampo, IKEA España

### Mes 2:
- Charla/webinar con alguna asociación de TEA
- Publicación en foros especializados (Foro Abierto de Política de Discapacidad, etc.)
- Solicitar aparición en el boletín de Autismo España

---

## Recursos adicionales recomendados

- **Quiet Parks International**: quietparks.org — para certificación de espacios naturales
- **Autismo España**: autismo.org.es — confederación principal, tiene programa de empresas colaboradoras
- **Confederación FEAPS** (ahora Plena Inclusión): plenainclusión.org
- **Asociación Española de Turismo Accesible**: turismoaccesible.es
- **Red Eusolum** (turismo slow): redeurosolum.com
- **Biblioteca de Barcelona** (modelo de sala sensorial): ajuntament.barcelona.cat/biblioteques
