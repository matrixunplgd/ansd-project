"use client"

import { useMemo, useState } from "react"
import type { FeatureCollection, Geometry } from "geojson"
import { REGIONS } from "@/lib/senegal-data"
import { SenegalMap } from "@/components/senegal-map"
import { RegionList } from "@/components/region-list"
import { RegionChatbot } from "@/components/region-chatbot"

type Props = {
  geojson: FeatureCollection<Geometry, { shapeName: string }>
}

export function SenegalExplorer({ geojson }: Props) {
  const [query, setQuery] = useState("")
  const [zone, setZone] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return REGIONS.filter((r) => {
      const matchesZone = zone === null || r.zone === zone
      const matchesQuery =
        q === "" || r.name.toLowerCase().includes(q) || r.capital.toLowerCase().includes(q)
      return matchesZone && matchesQuery
    })
  }, [query, zone])

  const handleSelect = (id: string) => {
    setSelectedId((current) => (current === id ? null : id))
  }

  // Used by the chatbot when it identifies a region from a typed question:
  // always focus it (no toggle-off), even if it's already selected.
  const handleChatFocus = (id: string) => {
    setSelectedId(id)
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
      {/* Map: shorter on mobile/tablet since the list and chatbot stack
          below it there; taller once they float on top of it at lg+. */}
      <div className="h-[46vh] min-h-[320px] w-full p-2 sm:h-[52vh] sm:p-4 lg:h-[calc(100vh-12rem)] lg:min-h-[440px] lg:pl-[300px] lg:pr-[360px]">
        <SenegalMap
          geojson={geojson}
          selectedId={selectedId}
          hoveredId={hoveredId}
          onSelect={handleSelect}
          onHover={setHoveredId}
        />
      </div>

      {/* Search + list. Stacked, static, full-width below lg; floating
          panel over the map from lg upward. */}
      <aside className="relative mx-2 mt-3 flex max-h-72 min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-sidebar/95 p-3 shadow-lg sm:mx-4 lg:absolute lg:left-4 lg:top-4 lg:z-10 lg:mx-0 lg:mt-0 lg:max-h-[calc(100%-2rem)] lg:w-[260px] lg:backdrop-blur">
        <RegionList
          query={query}
          onQueryChange={setQuery}
          zone={zone}
          onZoneChange={setZone}
          results={results}
          selectedId={selectedId}
          hoveredId={hoveredId}
          onSelect={handleSelect}
          onHover={setHoveredId}
        />
      </aside>

      {/* Chatbot. Stacked, static, fixed height below lg (so its own
          internal scroll works); floating panel over the map from lg up. */}
      <aside className="relative mx-2 mb-3 mt-3 flex h-[520px] min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-popover/95 shadow-lg sm:mx-4 lg:absolute lg:right-4 lg:top-4 lg:z-10 lg:mx-0 lg:mb-0 lg:mt-0 lg:h-[calc(100%-2rem)] lg:w-[320px] lg:backdrop-blur">
        <RegionChatbot focusRegionId={selectedId} onFocusRegion={handleChatFocus} />
      </aside>
    </div>
  )
}