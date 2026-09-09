"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useI18n } from "./i18n-provider";
import type { IPInfo } from "./types";

/** Standalone Leaflet map (no react-leaflet needed for full control). */
export default function MapView({
  info,
  distanceKm,
}: {
  info: IPInfo;
  distanceKm?: number | null;
}) {
  const { t, countryName } = useI18n();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const lat = info.latitude ?? 35.7;
    const lon = info.longitude ?? 51.4;
    const hasCoords = info.latitude !== undefined && info.longitude !== undefined;

    // Monochrome blueprint marker — black square, white core, hard ring
    const icon = L.divIcon({
      className: "",
      html: `<div style="position:relative;width:22px;height:22px">
        <div style="position:absolute;inset:0;background:var(--fg,#111);border:2px solid var(--bg,#fff);box-shadow:4px 4px 0 rgba(0,0,0,.35)"></div>
        <div style="position:absolute;top:6px;left:6px;width:6px;height:6px;background:var(--bg,#fff)"></div>
      </div>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });

    const map = L.map(containerRef.current, {
      center: [lat, lon],
      zoom: hasCoords ? 11 : 4,
      scrollWheelZoom: false,
      attributionControl: true,
      zoomControl: true,
    });

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const popupContent = `<div style="direction:ltr;text-align:left;font-family:inherit">
      <strong>${info.ip}</strong><br/>
      ${hasCoords ? `${lat.toFixed(4)}, ${lon.toFixed(4)}` : ""}
    </div>`;

    const marker = L.marker([lat, lon], { icon })
      .addTo(map)
      .bindPopup(popupContent)
      .openPopup();

    mapRef.current = map;
    markerRef.current = marker;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, [info]);

  // Pan to new location when info changes
  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;
    if (info.latitude === undefined || info.longitude === undefined) return;
    const ll: L.LatLngExpression = [info.latitude, info.longitude];
    mapRef.current.setView(ll, 11, { animate: true });
    markerRef.current.setLatLng(ll);
    markerRef.current
      .getPopup()
      ?.setContent(
        `<div style="direction:ltr;text-align:left"><strong>${info.ip}</strong><br/>${info.latitude.toFixed(4)}, ${info.longitude.toFixed(4)}</div>`
      )
      .openOn(mapRef.current);
  }, [info]);

  const osmUrl = `https://www.openstreetmap.org/?mlat=${info.latitude ?? ""}&mlon=${info.longitude ?? ""}#map=11/${info.latitude ?? ""}/${info.longitude ?? ""}`;

  return (
    <div className="space-y-2">
      {/* Enforce the monochrome map rules from the design system.
          Inlined here so they always beat leaflet.css regardless of
          stylesheet chunk ordering. */}
      <style>{`
        .leaflet-pane .leaflet-tile { filter: grayscale(1) contrast(1.08); }
        .leaflet-container.leaflet-container { background: var(--bg2); border-radius: 0; font: inherit !important; }
        .leaflet-control-attribution a { color: var(--mut) !important; }
        .leaflet-attribution-flag { display: none !important; }
      `}</style>
      <div
        ref={containerRef}
        className="h-72 sm:h-96 w-full overflow-hidden border border-border z-0"
        role="img"
        aria-label={`${t("yourLocation")} — ${countryName(info.country, info.countryCode)}`}
      />
      <div className="flex items-center justify-between gap-3 flex-wrap text-xs text-muted-foreground">
        <span>{t("mapHint")}</span>
        {distanceKm !== null && distanceKm !== undefined && (
          <span className="ip-mono num font-bold text-foreground">
            ~{distanceKm.toLocaleString("en-US")} km
          </span>
        )}
        <a
          href={osmUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-foreground transition-colors no-print"
        >
          {t("openOsm")}
        </a>
      </div>
    </div>
  );
}
