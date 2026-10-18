"use client"

import { Search, X } from "lucide-react"
import { REGIONS, ZONES, numberFmt, type Region } from "@/lib/senegal-data"

const ZONE_LABELS: Record<(typeof ZONES)[number], string> = {
  West: "Ouest",
  Center: "Centre",
  North: "Nord",
  East: "Est",
  South: "Sud",
}

type Props = {
  query: string
  onQueryChange: (value: string) => void
  zone: string | null
  onZoneChange: (zone: string | null) => void
  results: Region[]
  selectedId: string | null
  hoveredId: string | null
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
}

export function RegionList({
  query,
  onQueryChange,
  zone,
  onZoneChange,
  results,
  selectedId,
  hoveredId,
  onSelect,
  onHover,
}: Props) {
  return (
    <div className="flex h-full flex-col gap-4">
      <div>
        <label htmlFor="region-search" className="sr-only">
          Rechercher une région
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            id="region-search"
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Rechercher une région ou une capitale…"
            className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-9 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
          />
          {query && (
            <button
              type="button"
              onClick={() => onQueryChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Effacer la recherche"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* Zone filters */}
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrer par zone">
        <FilterChip label="Toutes" active={zone === null} onClick={() => onZoneChange(null)} />
        {ZONES.map((z) => (
          <FilterChip key={z} label={ZONE_LABELS[z]} active={zone === z} onClick={() => onZoneChange(z)} />
        ))}
      </div>

      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {results.length} région{results.length > 1 ? "s" : ""} sur {REGIONS.length}
      </p>

      <ul className="-mr-1 flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto pr-1" aria-label="Résultats des régions">
        {results.map((region) => {
          const isSelected = region.id === selectedId
          const isHovered = region.id === hoveredId
          return (
            <li key={region.id}>
              <button
                type="button"
                onClick={() => onSelect(region.id)}
                onMouseEnter={() => onHover(region.id)}
                onMouseLeave={() => onHover(null)}
                onFocus={() => onHover(region.id)}
                onBlur={() => onHover(null)}
                aria-pressed={isSelected}
                className={[
                  "flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-left transition-colors",
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : isHovered
                      ? "border-border bg-muted text-foreground"
                      : "border-transparent bg-card text-foreground hover:bg-muted",
                ].join(" ")}
              >
                <span className="flex flex-col">
                  <span className="font-serif text-sm font-semibold leading-tight">{region.name}</span>
                  <span
                    className={[
                      "text-xs",
                      isSelected ? "text-primary-foreground/80" : "text-muted-foreground",
                    ].join(" ")}
                  >
                    {region.capital} · {ZONE_LABELS[region.zone]}
                  </span>
                </span>
                <span
                  className={[
                    "shrink-0 text-xs tabular-nums",
                    isSelected ? "text-primary-foreground/90" : "text-muted-foreground",
                  ].join(" ")}
                >
                  {numberFmt.format(region.population)}
                </span>
              </button>
            </li>
          )
        })}

        {results.length === 0 && (
          <li className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-sm text-muted-foreground">
            Aucune région ne correspond à ta recherche.
          </li>
        )}
      </ul>
    </div>
  )
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        active
          ? "border-accent bg-accent text-accent-foreground"
          : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
      ].join(" ")}
    >
      {label}
    </button>
  )
}
