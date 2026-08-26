// @ts-nocheck
'use client';

import { useEffect } from 'react';
import { geoNaturalEarth1, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import landTopology from 'world-atlas/land-50m.json';

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const STEP = 0.35;
const LABEL_ZOOM = 1.55;
const MAP_WIDTH = 1200;
const MAP_HEIGHT = 560;
const MAP_PAD = 18;

const projection = geoNaturalEarth1().fitExtent(
  [[MAP_PAD, MAP_PAD], [MAP_WIDTH - MAP_PAD, MAP_HEIGHT - MAP_PAD]],
  { type: 'Sphere' }
);
const land = feature(landTopology as any, (landTopology as any).objects.land);
const landPath = geoPath(projection)(land) || '';

function normalizePlace(value: string) {
  return (value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export default function MapZoom() {
  useEffect(() => {
    const map = document.querySelector<HTMLElement>('.map');
    const world = map?.querySelector<HTMLElement>('.world');
    if (!map || !world) return;

    world.style.background = 'none';
    world.innerHTML = `
      <svg viewBox="0 0 ${MAP_WIDTH} ${MAP_HEIGHT}" width="100%" height="100%" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet">
        <path d="${landPath}" fill="#d1dcd8" stroke="#eaf4f5" stroke-width="1.2" stroke-linejoin="round"></path>
      </svg>
    `;

    let zoom = 1;
    let panX = 0;
    let panY = 0;
    let dragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let panStartX = 0;
    let panStartY = 0;
    let worldBox = { left: 0, top: 0, width: 1, height: 1 };

    const controls = document.createElement('div');
    controls.className = 'mapZoomControls';
    controls.setAttribute('aria-label', 'Kartan zoomaus');
    controls.innerHTML = `
      <button type="button" class="mapZoomButton" data-action="out" aria-label="Loitonna karttaa">−</button>
      <button type="button" class="mapZoomLevel" data-action="reset" aria-label="Palauta kartan koko">100%</button>
      <button type="button" class="mapZoomButton" data-action="in" aria-label="Lähennä karttaa">+</button>
    `;
    map.appendChild(controls);
    const level = controls.querySelector<HTMLElement>('.mapZoomLevel');

    function layoutWorld() {
      const width = map!.clientWidth || 1;
      const height = map!.clientHeight || 1;
      const pad = width <= 760 ? 10 : 22;
      const availableWidth = Math.max(1, width - pad * 2);
      const availableHeight = Math.max(1, height - pad * 2);
      const aspect = MAP_WIDTH / MAP_HEIGHT;

      let sceneWidth = availableWidth;
      let sceneHeight = sceneWidth / aspect;
      if (sceneHeight > availableHeight) {
        sceneHeight = availableHeight;
        sceneWidth = sceneHeight * aspect;
      }

      const left = (width - sceneWidth) / 2;
      const top = (height - sceneHeight) / 2;
      worldBox = { left, top, width: sceneWidth, height: sceneHeight };

      world!.style.inset = 'auto';
      world!.style.left = `${left}px`;
      world!.style.top = `${top}px`;
      world!.style.width = `${sceneWidth}px`;
      world!.style.height = `${sceneHeight}px`;
      world!.style.right = 'auto';
      world!.style.bottom = 'auto';
    }

    function destinationLookup() {
      const lookup = new Map<string, { lat: number; lon: number }>();
      map!.querySelectorAll<HTMLElement>('.destinationDot').forEach((dot) => {
        const lat = Number(dot.dataset.lat);
        const lon = Number(dot.dataset.lon);
        const place = normalizePlace(dot.dataset.place || '');
        if (place && Number.isFinite(lat) && Number.isFinite(lon)) lookup.set(place, { lat, lon });
      });
      return lookup;
    }

    function markerGeo(marker: HTMLElement, lookup: Map<string, { lat: number; lon: number }>) {
      if (marker.classList.contains('destinationDot')) {
        return { lat: Number(marker.dataset.lat), lon: Number(marker.dataset.lon) };
      }

      const place = normalizePlace(marker.querySelector('small')?.textContent || '');
      const exact = lookup.get(place);
      if (exact) {
        marker.dataset.geoLat = String(exact.lat);
        marker.dataset.geoLon = String(exact.lon);
        marker.dataset.geoSource = 'destination';
        return exact;
      }

      if (!marker.dataset.geoLat || marker.dataset.geoSource !== 'destination') {
        if (!marker.dataset.legacyLeft) marker.dataset.legacyLeft = marker.style.left || '50%';
        if (!marker.dataset.legacyTop) marker.dataset.legacyTop = marker.style.top || '50%';
        const oldLeft = parseFloat(marker.dataset.legacyLeft || '50');
        const oldTop = parseFloat(marker.dataset.legacyTop || '50');
        const lon = (oldLeft / 100) * 360 - 180;
        const lat = (56.7 - oldTop) / 0.637;
        marker.dataset.geoLat = String(lat);
        marker.dataset.geoLon = String(lon);
        marker.dataset.geoSource = 'legacy';
      }

      return { lat: Number(marker.dataset.geoLat), lon: Number(marker.dataset.geoLon) };
    }

    function projectToMap(lat: number, lon: number) {
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
      const projected = projection([lon, lat]);
      if (!projected) return null;
      return {
        x: worldBox.left + (projected[0] / MAP_WIDTH) * worldBox.width,
        y: worldBox.top + (projected[1] / MAP_HEIGHT) * worldBox.height,
      };
    }

    function clampPan() {
      const maxX = worldBox.width * Math.max(0, zoom - 1) * 0.5;
      const maxY = worldBox.height * Math.max(0, zoom - 1) * 0.5;
      panX = Math.max(-maxX, Math.min(maxX, panX));
      panY = Math.max(-maxY, Math.min(maxY, panY));
    }

    function apply() {
      layoutWorld();
      clampPan();

      world!.style.transformOrigin = '50% 50%';
      world!.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;

      const lookup = destinationLookup();
      const groupCounts = new Map<string, number>();
      const offsets = [[0,0],[34,-28],[-34,28],[36,28],[-36,-28],[0,42],[0,-42]];
      const centerX = worldBox.left + worldBox.width / 2;
      const centerY = worldBox.top + worldBox.height / 2;

      map!.querySelectorAll<HTMLElement>('.destinationDot,.marker').forEach((marker) => {
        const geo = markerGeo(marker, lookup);
        const base = projectToMap(geo.lat, geo.lon);
        if (!base) return;

        let dx = 0;
        let dy = 0;
        if (marker.classList.contains('marker')) {
          const key = `${geo.lat.toFixed(3)}|${geo.lon.toFixed(3)}`;
          const count = groupCounts.get(key) || 0;
          groupCounts.set(key, count + 1);
          [dx, dy] = offsets[count % offsets.length];
        }

        const x = centerX + (base.x - centerX) * zoom + panX + dx;
        const y = centerY + (base.y - centerY) * zoom + panY + dy;
        marker.style.left = `${x}px`;
        marker.style.top = `${y}px`;
        marker.style.visibility = 'visible';
      });

      if (level) level.textContent = `${Math.round(zoom * 100)}%`;
      map!.classList.toggle('isZoomed', zoom > 1.01);
      map!.dataset.zoomDetail = zoom >= LABEL_ZOOM ? 'true' : 'false';
      map!.dataset.zoom = zoom.toFixed(2);
    }

    function setZoom(next: number, focalX?: number, focalY?: number) {
      const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, next));
      if (Math.abs(newZoom - zoom) < 0.001) return;

      const cx = worldBox.left + worldBox.width / 2;
      const cy = worldBox.top + worldBox.height / 2;
      const fx = focalX ?? cx;
      const fy = focalY ?? cy;
      const ratio = newZoom / zoom;

      panX = fx - cx - (fx - cx - panX) * ratio;
      panY = fy - cy - (fy - cy - panY) * ratio;
      zoom = newZoom;
      if (zoom === 1) {
        panX = 0;
        panY = 0;
      }
      apply();
    }

    function reset() {
      zoom = 1;
      panX = 0;
      panY = 0;
      apply();
    }

    function onControlsClick(event: Event) {
      const target = (event.target as HTMLElement).closest<HTMLButtonElement>('button');
      const action = target?.dataset.action;
      if (action === 'in') setZoom(zoom + STEP);
      if (action === 'out') setZoom(zoom - STEP);
      if (action === 'reset') reset();
    }

    function onWheel(event: WheelEvent) {
      if ((event.target as HTMLElement).closest('.detail')) return;
      event.preventDefault();
      const rect = map!.getBoundingClientRect();
      setZoom(zoom + (event.deltaY < 0 ? 0.22 : -0.22), event.clientX - rect.left, event.clientY - rect.top);
    }

    function onPointerDown(event: PointerEvent) {
      if (zoom <= 1.01) return;
      if ((event.target as HTMLElement).closest('.marker,.destinationDot,.detail,.live,.mapZoomControls')) return;
      dragging = true;
      dragStartX = event.clientX;
      dragStartY = event.clientY;
      panStartX = panX;
      panStartY = panY;
      map!.classList.add('isPanning');
      map!.setPointerCapture(event.pointerId);
    }

    function onPointerMove(event: PointerEvent) {
      if (!dragging) return;
      panX = panStartX + event.clientX - dragStartX;
      panY = panStartY + event.clientY - dragStartY;
      apply();
    }

    function stopDragging(event?: PointerEvent) {
      if (!dragging) return;
      dragging = false;
      map!.classList.remove('isPanning');
      if (event && map!.hasPointerCapture(event.pointerId)) map!.releasePointerCapture(event.pointerId);
    }

    function onDoubleClick(event: MouseEvent) {
      if ((event.target as HTMLElement).closest('.marker,.destinationDot,.detail,.live,.mapZoomControls')) return;
      const rect = map!.getBoundingClientRect();
      setZoom(zoom + 0.55, event.clientX - rect.left, event.clientY - rect.top);
    }

    const observer = new MutationObserver(() => window.requestAnimationFrame(apply));
    observer.observe(map, { childList: true, subtree: true });

    controls.addEventListener('click', onControlsClick);
    map.addEventListener('wheel', onWheel, { passive: false });
    map.addEventListener('pointerdown', onPointerDown);
    map.addEventListener('pointermove', onPointerMove);
    map.addEventListener('pointerup', stopDragging);
    map.addEventListener('pointercancel', stopDragging);
    map.addEventListener('dblclick', onDoubleClick);
    window.addEventListener('resize', apply);

    apply();

    return () => {
      observer.disconnect();
      controls.removeEventListener('click', onControlsClick);
      map.removeEventListener('wheel', onWheel);
      map.removeEventListener('pointerdown', onPointerDown);
      map.removeEventListener('pointermove', onPointerMove);
      map.removeEventListener('pointerup', stopDragging);
      map.removeEventListener('pointercancel', stopDragging);
      map.removeEventListener('dblclick', onDoubleClick);
      window.removeEventListener('resize', apply);
      controls.remove();
      world.innerHTML = '';
    };
  }, []);

  return null;
}
