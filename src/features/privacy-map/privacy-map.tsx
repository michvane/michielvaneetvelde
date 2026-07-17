"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  MAP_FOCUS,
  REGIONAL_MAP_PATHS,
} from "@/features/privacy-map/map-geometry";
import {
  initialPrivacyMapState,
  precisionLevel,
  refusalMessage,
  zoomIn,
  zoomOut,
} from "@/features/privacy-map/zoom";

export function PrivacyMap() {
  const [state, setState] = useState(initialPrivacyMapState);
  const mapViewportRef = useRef<HTMLDivElement>(null);
  const wheelDeltaRef = useRef(0);
  const wheelGestureActiveRef = useRef(false);
  const wheelGestureTimeoutRef = useRef<number | null>(null);

  const level = precisionLevel(state);
  const refusal = refusalMessage(state);
  const cameraTransform = `translate(${MAP_FOCUS.x}px, ${MAP_FOCUS.y}px) scale(${level.scale}) translate(${-MAP_FOCUS.x}px, ${-MAP_FOCUS.y}px)`;

  useEffect(() => {
    const mapViewport = mapViewportRef.current;

    if (mapViewport === null) {
      return;
    }

    function handleWheel(event: WheelEvent) {
      event.preventDefault();

      window.clearTimeout(wheelGestureTimeoutRef.current ?? undefined);
      wheelGestureTimeoutRef.current = window.setTimeout(() => {
        wheelDeltaRef.current = 0;
        wheelGestureActiveRef.current = false;
      }, 160);

      if (wheelGestureActiveRef.current) {
        return;
      }

      const deltaMultiplier =
        event.deltaMode === WheelEvent.DOM_DELTA_LINE
          ? 16
          : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
            ? (mapViewportRef.current?.clientHeight ?? 1)
            : 1;

      wheelDeltaRef.current += event.deltaY * deltaMultiplier;

      if (Math.abs(wheelDeltaRef.current) < 40) {
        return;
      }

      const zoom = wheelDeltaRef.current < 0 ? zoomIn : zoomOut;
      setState(zoom);
      wheelDeltaRef.current = 0;
      wheelGestureActiveRef.current = true;
    }

    mapViewport.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      mapViewport.removeEventListener("wheel", handleWheel);
      window.clearTimeout(wheelGestureTimeoutRef.current ?? undefined);
    };
  }, []);

  return (
    <figure className="border-2 border-border-strong bg-canvas-raised">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b-2 border-border-strong px-5 py-4">
        <p className="meta-label text-accent-ink">Approximate position</p>
        <p className="meta-label text-text-muted" aria-hidden="true">
          {level.coordinates}
        </p>
        <span className="sr-only">Coordinates intentionally imprecise.</span>
      </div>

      <div ref={mapViewportRef} className="relative overscroll-contain">
        <svg
          viewBox="0 0 480 300"
          className="block w-full"
          role="img"
          aria-label="A deliberately simplified map of Belgium and its surrounding countries. A dashed circle marks a broad area around Ghent without showing a precise location."
        >
          <rect width="480" height="300" fill="var(--surface)" />

          <g
            key={state.refusals}
            className={refusal !== null ? "privacy-map-refuse" : undefined}
            style={{ transformOrigin: "240px 150px" }}
          >
            <g
              className="privacy-map-camera"
              style={{ transform: cameraTransform }}
            >
              <g
                fill="none"
                stroke="var(--border)"
                strokeOpacity="0.42"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              >
                <path d="M0 72H480" />
                <path d="M0 150H480" />
                <path d="M0 228H480" />
                <path d="M96 0V300" />
                <path d="M240 0V300" />
                <path d="M384 0V300" />
              </g>

              <g
                fill="var(--surface-strong)"
                stroke="var(--border)"
                strokeLinejoin="round"
                strokeWidth="1.25"
              >
                <path
                  d={REGIONAL_MAP_PATHS.unitedKingdom}
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  d={REGIONAL_MAP_PATHS.france}
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  d={REGIONAL_MAP_PATHS.germany}
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  d={REGIONAL_MAP_PATHS.netherlands}
                  vectorEffect="non-scaling-stroke"
                />
              </g>

              <path
                d={REGIONAL_MAP_PATHS.belgium}
                fill="var(--canvas-raised)"
                stroke="var(--border-strong)"
                strokeLinejoin="round"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />

              <circle
                cx={MAP_FOCUS.x}
                cy={MAP_FOCUS.y}
                r={28 / level.scale}
                fill="var(--accent-soft)"
                fillOpacity="0.68"
                stroke="var(--accent-ink)"
                strokeWidth="2"
                strokeDasharray="6 5"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d={`M${MAP_FOCUS.x} ${MAP_FOCUS.y - 4 / level.scale} L${MAP_FOCUS.x + 4 / level.scale} ${MAP_FOCUS.y} L${MAP_FOCUS.x} ${MAP_FOCUS.y + 4 / level.scale} L${MAP_FOCUS.x - 4 / level.scale} ${MAP_FOCUS.y} Z`}
                fill="var(--accent-ink)"
              />

              <g
                fill="none"
                stroke="var(--border-strong)"
                strokeOpacity="0.55"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              >
                <path d="M22 22H54 M22 22V38" />
                <path d="M426 262H458 M458 246V262" />
              </g>
            </g>
          </g>
        </svg>

        {refusal !== null ? (
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            aria-hidden="true"
          >
            <span
              className="meta-label -rotate-3 border-2 border-accent-ink bg-canvas-raised px-4 py-2.5 text-accent-ink shadow-soft"
              data-reveal
            >
              Privacy layer enabled
            </span>
          </div>
        ) : null}
      </div>

      <figcaption className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t-2 border-border-strong px-5 py-4">
        <p className="text-lg font-semibold tracking-[-0.025em]">
          {level.name}
        </p>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="compact"
            aria-label="Zoom out"
            disabled={state.precision === 0}
            className="disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => setState(zoomOut)}
          >
            <span aria-hidden="true">−</span>
          </Button>
          <Button
            variant="secondary"
            size="compact"
            aria-label="Zoom in"
            onClick={() => setState(zoomIn)}
          >
            <span aria-hidden="true">+</span>
          </Button>
        </div>
        <p
          aria-live="polite"
          className="min-h-10 w-full text-sm leading-5 text-text-muted"
        >
          Precision: {level.name}.{refusal ? ` ${refusal}` : ""}
        </p>
      </figcaption>
    </figure>
  );
}
