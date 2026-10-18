// Guided-intent chatbot engine: keyword + region-name matching, fully local,
// no external API / LLM dependency, per the project proposal (OS2/4.2).
import { REGIONS, REGION_BY_ID, THEME_LABELS, type Region, type ThemeKey } from "./senegal-data"

export type ChatAnswer = {
  reply: string
  regionId: string | null
  theme: ThemeKey | null
  isPilot: boolean
}

function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

// Build a lookup of normalized aliases -> region id (id, English/French name, capital).
const REGION_ALIASES: { alias: string; id: string }[] = REGIONS.flatMap((r) => {
  const aliases = new Set([r.id, r.name, r.capital])
  return Array.from(aliases).map((alias) => ({ alias: normalize(alias), id: r.id }))
}).sort((a, b) => b.alias.length - a.alias.length) // longest match first

const THEME_KEYWORDS: Record<ThemeKey, string[]> = {
  demography: ["demographie", "population", "habitant", "habitants", "densite", "peuplement"],
  health: ["sante", "hopital", "hopitaux", "medecin", "vaccination", "vaccin", "esperance de vie", "eau potable"],
  economy: [
    "economie",
    "emploi",
    "chomage",
    "activite economique",
    "activite",
    "marche",
    "secteur",
    "commerce",
    "revenu",
  ],
  education: ["education", "ecole", "ecoles", "alphabetisation", "scolarisation", "enseignant", "scolaire"],
}

function findRegion(normalizedQuery: string): string | null {
  for (const { alias, id } of REGION_ALIASES) {
    if (alias.length >= 3 && normalizedQuery.includes(alias)) return id
  }
  return null
}

function findTheme(normalizedQuery: string): ThemeKey | null {
  let best: ThemeKey | null = null
  let bestLen = 0
  for (const [theme, keywords] of Object.entries(THEME_KEYWORDS) as [ThemeKey, string[]][]) {
    for (const kw of keywords) {
      if (normalizedQuery.includes(kw) && kw.length > bestLen) {
        best = theme
        bestLen = kw.length
      }
    }
  }
  return best
}

function isCapitalQuestion(normalizedQuery: string): boolean {
  return /\bcapitale\b|\bchef-?lieu\b/.test(normalizedQuery)
}

function isAreaQuestion(normalizedQuery: string): boolean {
  return /\bsuperficie\b|\bkm2\b|\baire\b|\betendue\b/.test(normalizedQuery)
}

function regionSummary(region: Region): string {
  const density = Math.round(region.population / region.area)
  return `${region.name} (${region.zone === "West" ? "Ouest" : region.zone === "Center" ? "Centre" : region.zone === "North" ? "Nord" : region.zone === "East" ? "Est" : "Sud"}) — capitale ${region.capital}, ≈ ${region.population.toLocaleString("fr-FR")} habitants, ${region.area.toLocaleString("fr-FR")} km² (densité ≈ ${density}/km²).`
}

export function answerQuery(raw: string): ChatAnswer {
  const q = normalize(raw)

  if (q.length === 0) {
    return {
      reply: "Pose-moi une question, par exemple : « Quelle est la population de Ziguinchor ? »",
      regionId: null,
      theme: null,
      isPilot: false,
    }
  }

  const regionId = findRegion(q)
  const theme = findTheme(q)

  if (!regionId) {
    return {
      reply:
        "Je n'ai pas reconnu de région. Essaie avec un nom de région ou de capitale, par exemple « Dakar », « Ziguinchor » ou « Saint-Louis ».",
      regionId: null,
      theme: null,
      isPilot: false,
    }
  }

  const region = REGION_BY_ID[regionId]
  const isPilot = Boolean(region.themes && region.themes.length > 0)

  if (isCapitalQuestion(q)) {
    return {
      reply: `La capitale de la région ${region.name} est ${region.capital}.`,
      regionId,
      theme: null,
      isPilot,
    }
  }

  if (isAreaQuestion(q)) {
    return {
      reply: `La région ${region.name} couvre ≈ ${region.area.toLocaleString("fr-FR")} km².`,
      regionId,
      theme: null,
      isPilot,
    }
  }

  if (theme) {
    if (!isPilot) {
      return {
        reply: `Les données détaillées de ${THEME_LABELS[theme].toLowerCase()} pour ${region.name} ne sont pas encore chargées dans cette démo (périmètre limité à Dakar, Saint-Louis, Ziguinchor et Kaolack). Voici ce que j'ai : ${regionSummary(region)}`,
        regionId,
        theme: null,
        isPilot,
      }
    }
    const themeData = region.themes!.find((t) => t.key === theme)!
    const top = themeData.indicators[0]
    return {
      reply: `${THEME_LABELS[theme]} — ${region.name} : ${top.label} ${top.value}. Détail ci-dessous.`,
      regionId,
      theme,
      isPilot,
    }
  }

  // Region matched, no specific theme/question detected -> general overview.
  const extra = isPilot
    ? " Demande-moi la démographie, la santé, l'économie ou l'éducation pour un détail par thème."
    : ""
  return {
    reply: regionSummary(region) + extra,
    regionId,
    theme: null,
    isPilot,
  }
}

export const SUGGESTED_QUERIES = [
  "Population de Dakar",
  "Santé à Ziguinchor",
  "Économie de Kaolack",
  "Éducation à Saint-Louis",
]
