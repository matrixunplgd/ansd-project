"use client"

import { useMemo } from "react"
import { geoMercator, geoPath } from "d3-geo"
import type { FeatureCollection, Geometry } from "geojson"

const WIDTH = 800
const HEIGHT = 560

type Props = {
  geojson: FeatureCollection<Geometry, { shapeName: string }>
  selectedId: string | null
  hoveredId: string | null
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
}

export function SenegalMap({ geojson, selectedId, hoveredId, onSelect, onHover }: Props) {
  const { shapes } = useMemo(() => {
    const projection = geoMercator().fitExtent(
      [
        [24, 24],
        [WIDTH - 24, HEIGHT - 24],
      ],
      geojson,
    )
    const pathGen = geoPath(projection)

    // Round centroid coords so the server- and client-rendered SVG attributes
    // match exactly and don't trigger a React hydration mismatch.
    const round = (n: number) => Math.round(n * 100) / 100
    const shapes = geojson.features.map((feature) => {
      const id = feature.properties.shapeName
      const [cx, cy] = pathGen.centroid(feature)
      return {
        id,
        d: pathGen(feature) ?? "",
        cx: round(cx),
        cy: round(cy),
      }
    })

    return { shapes }
  }, [geojson])

  const activeId = hoveredId ?? selectedId

  const fillFor = (id: string) => {
    if (id === selectedId) return "var(--primary)"
    if (id === hoveredId) return "var(--map-region-hover)"
    return "var(--map-region)"
  }

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="xMidYMid meet"
      className="h-full w-full"
      role="group"
      aria-label="Carte des régions du Sénégal"
    >
      <g>
        {shapes.map((shape) => {
          const isActive = shape.id === selectedId
          return (
            <path
              key={shape.id}
              d={shape.d}
              fill={fillFor(shape.id)}
              stroke="var(--map-stroke)"
              strokeWidth={isActive ? 2 : 1}
              strokeLinejoin="round"
              className="cursor-pointer outline-none transition-[fill,stroke-width] duration-200 focus-visible:stroke-[var(--accent)] focus-visible:stroke-2"
              tabIndex={0}
              role="button"
              aria-pressed={isActive}
              aria-label={shape.id}
              onClick={() => onSelect(shape.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  onSelect(shape.id)
                }
              }}
              onMouseEnter={() => onHover(shape.id)}
              onMouseLeave={() => onHover(null)}
              onFocus={() => onHover(shape.id)}
              onBlur={() => onHover(null)}
            />
          )
        })}

        {/* Capital markers */}
        {shapes.map((shape) => (
          <circle
            key={`dot-${shape.id}`}
            cx={shape.cx}
            cy={shape.cy}
            r={shape.id === selectedId ? 3.5 : 2.5}
            className="pointer-events-none transition-all duration-200"
            fill={shape.id === selectedId ? "var(--primary-foreground)" : "var(--foreground)"}
            opacity={shape.id === selectedId ? 1 : 0.45}
          />
        ))}

        {/* Labels for all 14 regions, always visible; the active region's
            label is emphasized (bigger, bolder, thicker halo). */}
        {shapes.map((shape) => {
          const isActive = shape.id === activeId
          return (
            <text
              key={`label-${shape.id}`}
              x={shape.cx}
              y={shape.cy - (isActive ? 10 : 6)}
              textAnchor="middle"
              className={
                isActive
                  ? "pointer-events-none font-serif text-[15px] font-semibold transition-all duration-200"
                  : "pointer-events-none font-sans text-[8px] font-medium uppercase tracking-wide transition-all duration-200"
              }
              fill="var(--foreground)"
              opacity={isActive ? 1 : 0.7}
              paintOrder="stroke"
              stroke="var(--background)"
              strokeWidth={isActive ? 4 : 2.5}
              strokeLinejoin="round"
            >
              {shape.id}
            </text>
          )
        })}
      </g>
    </svg>
  )
}
