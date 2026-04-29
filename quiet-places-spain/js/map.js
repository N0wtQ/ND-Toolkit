/* =========================================================
   Mapa Lugares Tranquilos España
   ========================================================= */

const TIPO_CONFIG = {
  supermercado_hora_silenciosa:     { icon: '🛒', label: 'Supermercado',      clase: 'supermarket', chip: 'supermercado' },
  centro_comercial_hora_silenciosa: { icon: '🏬', label: 'Centro comercial',  clase: 'shopping',    chip: 'centro_comercial' },
  espacio_natural_certificado:      { icon: '🌲', label: 'Espacio natural',   clase: 'nature',      chip: 'espacio_natural' },
  biblioteca_sala_sensorial:        { icon: '📚', label: 'Biblioteca',        clase: 'library',     chip: 'biblioteca' },
  centro_civico_zona_silencio:      { icon: '🏛️', label: 'Centro cívico',    clase: 'civic',       chip: 'centro_civico' },
  hotel_politica_silencio:          { icon: '🏨', label: 'Hotel',            clase: 'hotel',       chip: 'hotel' },
  sala_estudio_accesible:           { icon: '📖', label: 'Sala de estudio',  clase: 'library',     chip: 'biblioteca' },
};

const DEFAULT_CONFIG = { icon: '📍', label: 'Lugar', clase: 'supermarket', chip: 'supermercado' };

function getTipoConfig(tipo) {
  return TIPO_CONFIG[tipo] || DEFAULT_CONFIG;
}

function verificacionClass(v) {
  if (!v) return 'verif-pending';
  const vl = v.toUpperCase();
  if (vl.startsWith('DEMO')) return 'verif-demo';
  if (vl.startsWith('VERIFICADO')) return 'verif-ok';
  return 'verif-pending';
}

function formatSchedule(p) {
  if (!p.hora_silenciosa_inicio) return null;
  return `${p.hora_silenciosa_inicio}–${p.hora_silenciosa_fin}`;
}

function buildPopup(props) {
  const cfg = getTipoConfig(props.tipo);
  const sched = formatSchedule(props);
  const verClass = verificacionClass(props.verificacion);
  const isDemo = props.verificacion && props.verificacion.toUpperCase().startsWith('DEMO');

  const scheduleHtml = sched ? `
    <div class="popup-schedule-box">
      <span class="popup-schedule-icon">🔇</span>
      <div class="popup-schedule-text">
        <div class="popup-schedule-time">${sched}</div>
        <div class="popup-schedule-days">${props.dias_semana || ''}</div>
      </div>
    </div>` : `
    <div class="popup-row">
      <span class="popup-label">Acceso</span>
      <span class="popup-value">${props.dias_semana || 'Consultar'}</span>
    </div>`;

  const medidasHtml = props.medidas && props.medidas.length ? `
    <div class="popup-medidas">
      <span style="font-size:11px;font-weight:600;color:#6b6b6b;">Medidas:</span>
      <ul>${props.medidas.map(m => `<li>${m}</li>`).join('')}</ul>
    </div>` : '';

  const colectivosHtml = props.colectivos && props.colectivos.length
    ? `<div class="popup-row"><span class="popup-label">Para</span><span class="popup-value">${props.colectivos.join(', ')}</span></div>`
    : '';

  const fuenteHtml = props.fuente_url
    ? `<a class="popup-link" href="${props.fuente_url}" target="_blank" rel="noopener">Ver fuente →</a>`
    : '';

  const notasHtml = props.notas
    ? `<div class="popup-notas">ℹ️ ${props.notas}</div>`
    : '';

  const demoBanner = isDemo
    ? `<div style="background:#fff3cd;border:1px solid #ffc107;border-radius:4px;padding:5px 8px;font-size:10px;color:#856404;margin-bottom:8px;"><strong>⚠️ DATO DE DEMOSTRACIÓN</strong> Este lugar es ficticio.</div>`
    : '';

  return `<div class="popup-body">
    ${demoBanner}
    <div class="popup-header">
      <span class="popup-icon">${cfg.icon}</span>
      <div class="popup-title-block">
        <div class="popup-name">${props.nombre}</div>
        <div class="popup-tipo">${cfg.label}</div>
      </div>
    </div>
    <hr class="popup-divider">
    <div class="popup-row">
      <span class="popup-label">Dirección</span>
      <span class="popup-value">${props.direccion || '—'}</span>
    </div>
    ${props.cadena ? `<div class="popup-row"><span class="popup-label">Cadena</span><span class="popup-value">${props.cadena}</span></div>` : ''}
    ${colectivosHtml}
    ${scheduleHtml}
    ${medidasHtml}
    <div class="popup-footer">
      <span class="popup-verification ${verClass}">${props.verificacion || 'Sin verificar'}</span>
      ${fuenteHtml}
    </div>
    ${notasHtml}
  </div>`;
}

function createMarkerIcon(tipo, isDemo) {
  const cfg = getTipoConfig(tipo);
  return L.divIcon({
    className: '',
    html: `<div class="custom-marker marker-${cfg.clase}${isDemo ? ' marker-demo' : ''}">
             <span class="marker-inner">${cfg.icon}</span>
           </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -38],
  });
}

/* =========================================================
   App State
   ========================================================= */
const state = {
  activeLayer: 'all',
  activeTypes: new Set(['supermercado', 'espacio_natural', 'biblioteca', 'centro_civico', 'hotel', 'centro_comercial']),
  searchQuery: '',
  demoData: null,
  realData: null,
  markers: [],
  selectedId: null,
};

/* =========================================================
   Map Init
   ========================================================= */
const map = L.map('map', {
  center: [40.4168, -3.7038],
  zoom: 6,
  zoomControl: false,
});

L.control.zoom({ position: 'bottomright' }).addTo(map);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
  maxZoom: 18,
}).addTo(map);

/* =========================================================
   Data Loading
   ========================================================= */
async function loadData() {
  const [demoRes, realRes] = await Promise.all([
    fetch('./data/demo.geojson'),
    fetch('./data/real.geojson'),
  ]);
  state.demoData = await demoRes.json();
  state.realData = await realRes.json();
  renderAll();
}

/* =========================================================
   Render
   ========================================================= */
function getAllFeatures() {
  const features = [];
  if (state.activeLayer !== 'real' && state.demoData) {
    features.push(...state.demoData.features.map(f => ({ ...f, _source: 'demo' })));
  }
  if (state.activeLayer !== 'demo' && state.realData) {
    features.push(...state.realData.features.map(f => ({ ...f, _source: 'real' })));
  }
  return features;
}

function filterFeatures(features) {
  return features.filter(f => {
    const p = f.properties;
    const cfg = getTipoConfig(p.tipo);
    if (!state.activeTypes.has(cfg.chip)) return false;
    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      const searchable = [p.nombre, p.ciudad, p.provincia, p.cadena, p.direccion].filter(Boolean).join(' ').toLowerCase();
      if (!searchable.includes(q)) return false;
    }
    return true;
  });
}

function renderAll() {
  const features = getAllFeatures();
  const filtered = filterFeatures(features);
  renderMarkers(filtered);
  renderList(filtered);
  updateDemoBanner(features);
}

function renderMarkers(features) {
  state.markers.forEach(m => map.removeLayer(m.marker));
  state.markers = [];

  features.forEach(f => {
    const [lng, lat] = f.geometry.coordinates;
    const isDemo = f._source === 'demo';
    const icon = createMarkerIcon(f.properties.tipo, isDemo);
    const marker = L.marker([lat, lng], { icon })
      .bindPopup(buildPopup(f.properties), { maxWidth: 320, minWidth: 260 })
      .addTo(map);

    marker.on('click', () => selectPlace(f.properties.id));
    state.markers.push({ id: f.properties.id, marker, feature: f });
  });
}

function renderList(features) {
  const list = document.getElementById('place-list');
  const count = document.getElementById('places-count');
  count.textContent = `${features.length} lugar${features.length !== 1 ? 'es' : ''}`;

  list.innerHTML = features.length === 0
    ? `<div style="text-align:center;padding:24px;color:#9ca3af;font-size:13px;">Sin resultados</div>`
    : features.map(f => buildPlaceCard(f)).join('');

  list.querySelectorAll('.place-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      selectPlace(id);
    });
  });
}

function buildPlaceCard(f) {
  const p = f.properties;
  const cfg = getTipoConfig(p.tipo);
  const isDemo = f._source === 'demo';
  const sched = formatSchedule(p);
  const badgeClass = isDemo ? 'badge-demo' : (p.verificacion && p.verificacion.includes('pendiente') ? 'badge-pendiente' : 'badge-real');
  const badgeText = isDemo ? 'DEMO' : (p.verificacion && p.verificacion.includes('pendiente') ? '⚠ PENDIENTE' : '✓');

  return `<div class="place-card ${isDemo ? 'demo' : 'real'}${state.selectedId === p.id ? ' active' : ''}" data-id="${p.id}">
    <div class="place-card-header">
      <span class="place-icon">${cfg.icon}</span>
      <span class="place-name">${p.nombre}</span>
      <span class="place-badge ${badgeClass}">${badgeText}</span>
    </div>
    <div class="place-meta">${p.ciudad || ''}${p.provincia && p.ciudad !== p.provincia ? ', ' + p.provincia : ''}</div>
    ${sched ? `<div class="place-schedule">🔇 ${sched} · ${p.dias_semana || ''}</div>` : ''}
  </div>`;
}

function selectPlace(id) {
  state.selectedId = id;
  const entry = state.markers.find(m => m.id === id);
  if (entry) {
    map.setView(entry.marker.getLatLng(), Math.max(map.getZoom(), 13), { animate: true });
    entry.marker.openPopup();
  }
  document.querySelectorAll('.place-card').forEach(c => {
    c.classList.toggle('active', c.dataset.id === id);
  });
  const card = document.querySelector(`.place-card[data-id="${id}"]`);
  if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function updateDemoBanner(features) {
  const banner = document.getElementById('demo-banner');
  const hasDemoFeatures = features.some(f => f._source === 'demo');
  banner.style.display = (state.activeLayer !== 'real' && hasDemoFeatures) ? 'block' : 'none';
}

/* =========================================================
   UI Events
   ========================================================= */

// Layer buttons
document.querySelectorAll('.layer-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.layer-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.activeLayer = btn.dataset.layer;
    renderAll();
  });
});

// Filter chips
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    const tipo = chip.dataset.tipo;
    if (state.activeTypes.has(tipo)) {
      if (state.activeTypes.size === 1) return; // keep at least one
      state.activeTypes.delete(tipo);
      chip.classList.remove('active');
    } else {
      state.activeTypes.add(tipo);
      chip.classList.add('active');
    }
    renderAll();
  });
});

// Search
document.getElementById('search-input').addEventListener('input', e => {
  state.searchQuery = e.target.value.trim();
  renderAll();
});

// Suggest button → open modal
document.getElementById('suggest-btn').addEventListener('click', () => {
  document.getElementById('suggest-modal').classList.add('open');
});

// Close modal
document.getElementById('modal-close').addEventListener('click', () => {
  document.getElementById('suggest-modal').classList.remove('open');
});

document.getElementById('suggest-modal').addEventListener('click', e => {
  if (e.target === e.currentTarget) e.currentTarget.classList.remove('open');
});

// Suggest form submit
document.getElementById('suggest-form').addEventListener('submit', e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  console.log('Sugerencia enviada:', data);
  alert('¡Gracias por tu sugerencia! La revisaremos y, si se verifica, la añadiremos al mapa.');
  e.target.reset();
  document.getElementById('suggest-modal').classList.remove('open');
});

/* =========================================================
   Boot
   ========================================================= */
loadData().catch(err => {
  console.error('Error cargando datos:', err);
  document.getElementById('place-list').innerHTML =
    `<div style="padding:16px;color:#dc2626;font-size:12px;">Error cargando datos. Recarga la página.</div>`;
});
