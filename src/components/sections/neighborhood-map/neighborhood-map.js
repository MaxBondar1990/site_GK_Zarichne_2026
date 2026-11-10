import './neighborhood-map.scss';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import homeSymbolUrl from '../../../assets/img/brand/zarichcha-symbol.svg?url';
import { home, places, categories, distanceFromHome, formatDistance, mapsUrl } from './_places.js';

const root = document.querySelector('[data-fls-neighborhood-map]');
const canvas = root.querySelector('.neighborhood-map__canvas');
const list = root.querySelector('.neighborhood-map__places');
const count = root.querySelector('.neighborhood-map__count');
const status = root.querySelector('.neighborhood-map__status');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const popupOptions = { maxWidth: 270, autoPanPaddingTopLeft: [16, 76], autoPanPaddingBottomRight: [16, 24] };
const sorted = places.map(place => ({ ...place, distance: distanceFromHome(place) }))
  .sort((a, b) => a.distance - b.distance);
const markers = new Map();
let category = 'all';
let selected = null;
let map, leaflet, clusters, initialization;
let selectedBeforeLoad = false;
let initializationFailed = false;

function visiblePlaces() {
  return sorted.filter(place => category === 'all' || place.category === category);
}

function renderList() {
  const visible = visiblePlaces();
  count.textContent = `${visible.length} ${visible.length === 1 ? 'місце' : visible.length < 5 ? 'місця' : 'місць'} · найближчі спочатку`;
  list.replaceChildren(...visible.map(place => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'neighborhood-map__place';
    button.dataset.mapPlace = place.id;
    button.setAttribute('aria-pressed', String(selected === place.id));
    const dot = document.createElement('span');
    dot.className = 'neighborhood-map__place-dot';
    dot.style.background = categories[place.category].color;
    dot.textContent = String(sorted.indexOf(place) + 1);
    dot.setAttribute('aria-hidden', 'true');
    const text = document.createElement('span');
    const name = document.createElement('strong');
    name.textContent = place.name;
    const label = document.createElement('small');
    label.textContent = categories[place.category].label;
    text.append(name, label);
    const distance = document.createElement('span');
    distance.className = 'neighborhood-map__distance';
    distance.textContent = formatDistance(place.distance);
    button.append(dot, text, distance);
    button.addEventListener('click', () => selectPlace(place));
    return button;
  }));
}

function updateSelection() {
  list.querySelectorAll('[data-map-place]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.mapPlace === selected));
  });
}

function popupContent(place) {
  const panel = document.createElement('div');
  panel.className = 'neighborhood-map__popup';
  const label = document.createElement('span');
  label.textContent = place === home ? 'ВАШ БУДИНОК' : categories[place.category].label;
  const title = document.createElement('strong');
  title.textContent = place.name;
  const address = document.createElement('p');
  address.textContent = place.address;
  const links = document.createElement('div');
  const google = document.createElement('a');
  google.href = mapsUrl(place);
  google.textContent = 'Google Карти';
  google.target = '_blank'; google.rel = 'noopener noreferrer';
  links.append(google);
  if (place !== home) {
    const distance = document.createElement('p');
    distance.textContent = `${formatDistance(place.distance)} по прямій від дому`;
    panel.append(label, title, address, distance);
    const route = document.createElement('a');
    route.href = mapsUrl(place, true);
    route.textContent = 'Маршрут';
    route.target = '_blank'; route.rel = 'noopener noreferrer';
    links.append(route);
  } else panel.append(label, title, address);
  panel.append(links);
  return panel;
}

function selectPlace(place) {
  selected = place.id;
  updateSelection();
  if (initializationFailed) {
    window.open(mapsUrl(place), '_blank', 'noopener,noreferrer');
    return;
  }
  if (!map) {
    selectedBeforeLoad = true;
    initialize();
    return;
  }
  const marker = markers.get(place.id);
  clusters.zoomToShowLayer(marker, () => {
    map.panTo(marker.getLatLng(), { animate: !reducedMotion });
    marker.openPopup();
    if (matchMedia('(max-width: 900px)').matches) {
      root.querySelector('.neighborhood-map__stage').scrollIntoView({
        behavior: reducedMotion ? 'instant' : 'smooth', block: 'start',
      });
    }
  });
}

function fitPlaces() {
  if (!map) return;
  const bounds = leaflet.latLngBounds([[home.lat, home.lng], ...visiblePlaces().map(p => [p.lat, p.lng])]);
  map.fitBounds(bounds, { padding: [45, 75], maxZoom: 15, animate: !reducedMotion });
}

function showCategory(value) {
  category = value;
  selected = null;
  root.querySelectorAll('[data-map-category]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.mapCategory === category));
  });
  renderList();
  list.scrollTop = 0;
  if (!map) return;
  map.closePopup();
  clusters.clearLayers();
  clusters.addLayers(visiblePlaces().map(place => markers.get(place.id)));
  fitPlaces();
}

async function initialize() {
  if (initialization) return initialization;
  initialization = (async () => {
    try {
      leaflet = (await import('leaflet')).default;
      // The stable markercluster build extends Leaflet's browser namespace.
      window.L = leaflet;
      await import('leaflet.markercluster');
      map = leaflet.map(canvas, { scrollWheelZoom: false, zoomControl: false, minZoom: 11, maxZoom: 19 });
      const tiles = leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
      }).addTo(map);
      let errors = 0;
      tiles.once('load', () => { if (!errors) status.hidden = true; });
      tiles.on('tileerror', () => {
        errors++;
        if (errors >= 3) {
          status.hidden = false;
          status.textContent = 'Не вдалося завантажити тло карти. Локації та посилання Google Карт доступні у списку.';
        }
      });
      leaflet.control.zoom({ position: 'bottomright', zoomInTitle: 'Наблизити', zoomOutTitle: 'Віддалити' }).addTo(map);
      leaflet.control.scale({ imperial: false, position: 'bottomleft' }).addTo(map);
      const homeMarker = leaflet.marker([home.lat, home.lng], {
        icon: leaflet.divIcon({ className: 'neighborhood-map__home-marker', html: `<span><img src="${homeSymbolUrl}" alt="" width="32" height="32" draggable="false"></span>`, iconSize: [46, 46], iconAnchor: [23, 23] }),
        title: 'Будинок Заріччя', alt: 'Будинок Заріччя', zIndexOffset: 1000,
      }).addTo(map).bindPopup(popupContent(home), popupOptions);
      homeMarker.bindTooltip('Заріччя', { permanent: true, direction: 'bottom', offset: [0, 22], className: 'neighborhood-map__home-label' });
      clusters = leaflet.markerClusterGroup({
        maxClusterRadius: 38, showCoverageOnHover: false, animate: !reducedMotion,
        iconCreateFunction: cluster => leaflet.divIcon({
          className: 'neighborhood-map__cluster',
          html: `<span>${cluster.getChildCount()}</span><span class="neighborhood-map__sr-only">локації поруч — наблизити</span>`,
          iconSize: [40, 40],
        }),
      }).addTo(map);
      sorted.forEach((place, index) => {
        const marker = leaflet.marker([place.lat, place.lng], {
          icon: leaflet.divIcon({
            className: 'neighborhood-map__marker',
            html: `<span style="background:${categories[place.category].color}">${index + 1}</span>`,
            iconSize: [32, 32], iconAnchor: [16, 16],
          }),
          title: place.name, alt: place.name,
        }).bindPopup(popupContent(place), popupOptions);
        marker.on('click', () => { selected = place.id; updateSelection(); });
        marker.bindTooltip(place.name, { direction: 'top', offset: [0, -15] });
        markers.set(place.id, marker);
      });
      clusters.addLayers(visiblePlaces().map(place => markers.get(place.id)));
      fitPlaces();
      const resize = new ResizeObserver(() => map.invalidateSize({ pan: false }));
      resize.observe(canvas);
      const selectedPlace = sorted.find(place => place.id === selected);
      if (selectedBeforeLoad && selectedPlace) selectPlace(selectedPlace);
      root.dataset.mapReady = 'true';
    } catch (error) {
      initializationFailed = true;
      status.hidden = false;
      status.textContent = 'Карта поки недоступна. Відкрийте локації у Google Картах.';
      console.error('Neighborhood map:', error);
    }
  })();
  return initialization;
}

root.querySelectorAll('[data-map-category]').forEach(button => {
  button.addEventListener('click', () => showCategory(button.dataset.mapCategory));
});
root.querySelector('[data-map-home]').addEventListener('click', () => {
  if (map) map.setView([home.lat, home.lng], 16, { animate: !reducedMotion });
  else initialize();
});
root.querySelector('[data-map-fit]').addEventListener('click', fitPlaces);
renderList();
const observer = new IntersectionObserver(entries => {
  if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); initialize(); }
}, { rootMargin: '250px' });
observer.observe(root);
