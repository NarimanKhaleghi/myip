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

    // Custom gradient marker icon
    const icon = L.divIcon({
      className: "",
      html: `<div style="position:relative;width:22px;height:22px">
        <div class="marker-pulse" style="position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle, #6366F1, #8B5CF6);box-shadow:0 0 0 4px rgba(99,102,241,.25), 0 0 18px rgba(99,102,241,.5)"></div>
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
      <div
        ref={containerRef}
        className="h-72 sm:h-96 w-full rounded-2xl overflow-hidden border border-border/50 z-0"
        role="img"
        aria-label={`${t("yourLocation")} — ${countryName(info.country, info.countryCode)}`}
      />
      <div className="flex items-center justify-between gap-3 flex-wrap text-xs text-muted-foreground">
        <span>{t("mapHint")}</span>
        {distanceKm !== null && distanceKm !== undefined && (
          <span className="ip-mono num text-primary font-semibold">
            ~{distanceKm.toLocaleString("en-US")} km
          </span>
        )}
        <a
          href={osmUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-primary transition-colors no-print"
        >
          {t("openOsm")}
        </a>
      </div>
    </div>
  );
}
