import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { REGION_BY_ID } from "@/lib/senegal-data"
import { ANSD_THEMES, type AnsdThemeKey } from "@/lib/ansd-catalog"
import { AnsdCatalogExplorer } from "@/components/ansd-catalog-explorer"

type PageProps = {
  params: Promise<{ regionId: string; theme: string }>
}

function isAnsdTheme(value: string): value is AnsdThemeKey {
  return value === "economie" || value === "demographie" || value === "societe"
}

export default async function RegionThemePage({ params }: PageProps) {
  const { regionId, theme } = await params
  const region = REGION_BY_ID[regionId]

  if (!region || !isAnsdTheme(theme)) {
    notFound()
  }

  const config = ANSD_THEMES[theme]

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Retour à la carte
      </Link>

      <header className="mt-4 mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {config.label} · ANSD
        </p>
        <h1 className="mt-1 font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {config.label} — {region.name}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Choisis un sous-thème, puis un jeu de données, pour voir sa vue d&apos;ensemble, appliquer des filtres et
          télécharger les données correspondantes.
        </p>
      </header>

      <AnsdCatalogExplorer theme={theme} regionId={region.id} />
    </main>
  )
}
