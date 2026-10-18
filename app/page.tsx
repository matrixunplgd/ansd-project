import fs from "node:fs/promises"
import path from "node:path"
import type { FeatureCollection, Geometry } from "geojson"
import { SenegalExplorer } from "@/components/senegal-explorer"
import { REGIONS } from "@/lib/senegal-data"

async function getGeoData(): Promise<FeatureCollection<Geometry, { shapeName: string }>> {
  const file = path.join(process.cwd(), "public", "senegal-regions.geojson")
  const raw = await fs.readFile(file, "utf8")
  return JSON.parse(raw)
}

export default async function Page() {
  const geojson = await getGeoData()

  const totalPopulation = REGIONS.reduce((sum, r) => sum + r.population, 0)
  const totalArea = REGIONS.reduce((sum, r) => sum + r.area, 0)

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-6 w-1.5 rounded-full bg-primary" aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                République du Sénégal
              </span>
            </div>
            <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl">
              SEN MAP DATA — Explorez les régions du Sénégal
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground text-pretty">
              Carte interactive des 14 régions administratives. Cliquez une région ou posez une question à
              l&apos;assistant pour voir sa capitale, sa population et ses indicateurs — démographie, santé, économie
              et éducation pour les 4 régions pilotes (Dakar, Saint-Louis, Ziguinchor, Kaolack).
            </p>
          </div>

          <dl className="flex gap-6">
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Régions</dt>
              <dd className="font-serif text-2xl font-bold text-foreground">{REGIONS.length}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Population</dt>
              <dd className="font-serif text-2xl font-bold text-foreground">
                {(totalPopulation / 1_000_000).toFixed(1)}M
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Superficie</dt>
              <dd className="font-serif text-2xl font-bold text-foreground">
                {Math.round(totalArea / 1000)}k km²
              </dd>
            </div>
          </dl>
        </div>
      </header>

      <SenegalExplorer geojson={geojson} />

      <footer className="mt-8 border-t border-border pt-4 text-xs text-muted-foreground">
        Limites administratives : geoBoundaries (gbOpen, ADM1). Statistiques régionales : valeurs d&apos;illustration
        pour la démo (données réelles RGPH-5/ANSD à intégrer post-hackathon).
      </footer>
    </main>
  )
}
