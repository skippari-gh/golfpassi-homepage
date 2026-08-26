'use client';

import { useEffect } from 'react';

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const STEP = 0.35;

export default function MapZoom() {
  useEffect(() => {
    const map = document.querySelector<HTMLElement>('.map');
    if (!map) return;

    let zoom = 1;
    let panX = 0;
    let panY = 0;
    let dragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let panStartX = 0;
    let panStartY = 0;

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

    function clampPan() {
      const rect = map!.getBoundingClientRect();
      const maxX = rect.width * Math.max(0, zoom - 1) * 0.48;
      const maxY = rect.height * Math.max(0, zoom - 1) * 0.48;
      panX = Math.max(-maxX, Math.min(maxX, panX));
      panY = Math.max(-maxY, Math.min(maxY, panY));
    }

    function prepareMarkers() {
      map!.querySelectorAll<HTMLElement>('.marker').forEach((marker) => {
        if (!marker.dataset.baseLeft) marker.dataset.baseLeft = marker.style.left || '50%';
        if (!marker.dataset.baseTop) marker.dataset.baseTop = marker.style.top || '50%';
      });
    }

    function apply() {
      prepareMarkers();
      clampPan();
      const rect = map!.getBoundingClientRect();
      const width = rect.width || 1;
      const height = rect.height || 1;

      const world = map!.querySelector<HTMLElement>('.world');
      if (world) {
        world.style.transformOrigin = '50% 50%';
        world.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
      }

      map!.querySelectorAll<HTMLElement>('.marker').forEach((marker) => {
        const baseLeft = parseFloat(marker.dataset.baseLeft || '50');
        const baseTop = parseFloat(marker.dataset.baseTop || '50');
        const baseX = (baseLeft / 100) * width;
        const baseY = (baseTop / 100) * height;
        const x = width / 2 + (baseX - width / 2) * zoom + panX;
        const y = height / 2 + (baseY - height / 2) * zoom + panY;
        marker.style.left = `${(x / width) * 100}%`;
        marker.style.top = `${(y / height) * 100}%`;
      });

      if (level) level.textContent = `${Math.round(zoom * 100)}%`;
      map!.classList.toggle('isZoomed', zoom > 1.01);
    }

    function setZoom(next: number, focalX?: number, focalY?: number) {
      const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, next));
      if (Math.abs(newZoom - zoom) < 0.001) return;

      const rect = map!.getBoundingClientRect();
      const fx = focalX ?? rect.width / 2;
      const fy = focalY ?? rect.height / 2;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
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
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      setZoom(zoom + (event.deltaY < 0 ? 0.22 : -0.22), x, y);
    }

    function onPointerDown(event: PointerEvent) {
      if (zoom <= 1.01) return;
      if ((event.target as HTMLElement).closest('.marker,.detail,.live,.mapZoomControls')) return;
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
      if ((event.target as HTMLElement).closest('.marker,.detail,.live,.mapZoomControls')) return;
      const rect = map!.getBoundingClientRect();
      setZoom(zoom + 0.55, event.clientX - rect.left, event.clientY - rect.top);
    }

    const observer = new MutationObserver(() => {
      window.requestAnimationFrame(apply);
    });
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
    };
  }, []);

  return null;
}
