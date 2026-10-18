// Catalogue ANSD, calqué sur la vraie arborescence du site
// (Économie / Démographie / Société -> sous-thèmes -> jeux de données),
// consommé via l'API publique de la plateforme Open Data du Sénégal
// (senegal.opendataforafrica.org, propulsée par Knoema).
//
// Base de l'API : https://senegal.opendataforafrica.org/api/2.0/data
// Exemple d'appel réel :
//   /api/2.0/data?datasetId=rnumqzf&régions=SN-DK,SN-KL&sexe=M,F&groupe-d-âge=_T
//
// Pour ajouter un nouveau dataset : trouve son datasetId (visible dans l'URL
// ou le code d'intégration sur senegal.opendataforafrica.org), ajoute un
// objet AnsdDataset dans le tableau `datasets` du bon sous-thème ci-dessous.

export const ANSD_API_BASE = "https://senegal.opendataforafrica.org"

export type AnsdThemeKey = "economie" | "demographie" | "societe"

export type AnsdFilterOption = {
  value: string
  label: string
}

export type AnsdFilterDimension = {
  /** Nom exact du paramètre attendu par l'API (peut contenir des accents). */
  paramKey: string
  label: string
  options: AnsdFilterOption[]
  /** Autorise plusieurs valeurs cochées à la fois (jointes par une virgule). */
  multi: boolean
}

export type AnsdDataset = {
  /** Identifiant court utilisé dans l'appli (pas l'identifiant Knoema). */
  slug: string
  datasetId: string
  label: string
  description: string
  filters: AnsdFilterDimension[]
  regionParamKey?: string
  note?: string
}

export type AnsdSubtheme = {
  slug: string
  label: string
  datasets: AnsdDataset[]
}

export type AnsdTheme = {
  key: AnsdThemeKey
  label: string
  subthemes: AnsdSubtheme[]
}

// Correspondance entre l'id interne de chaque région (lib/senegal-data.ts)
// et le code régional utilisé par les jeux de données ANSD (ISO 3166-2:SN).
export const REGION_ANSD_CODE: Record<string, string> = {
  Dakar: "SN-DK",
  Thies: "SN-TH",
  Diourbel: "SN-DB",
  Fatick: "SN-FK",
  Kaolack: "SN-KL",
  Kaffrine: "SN-KA",
  Louga: "SN-LG",
  "Saint Louis": "SN-SL",
  Matam: "SN-MT",
  Tambacounda: "SN-TC",
  Kedougou: "SN-KE",
  Kolda: "SN-KD",
  Sedhiou: "SN-SE",
  Ziguinchor: "SN-ZG",
}

const REGIONS_4_PILOTES: AnsdFilterOption[] = [
  { value: "SN-DK", label: "Dakar" },
  { value: "SN-KL", label: "Kaolack" },
  { value: "SN-SL", label: "Saint-Louis" },
  { value: "SN-ZG", label: "Ziguinchor" },
]

const REGIONS_TOUTES: AnsdFilterOption[] = [
  { value: "SN", label: "Sénégal (national)" },
  { value: "SN-DK", label: "Dakar" },
  { value: "SN-DB", label: "Diourbel" },
  { value: "SN-FK", label: "Fatick" },
  { value: "SN-KA", label: "Kaffrine" },
  { value: "SN-KL", label: "Kaolack" },
  { value: "SN-KD", label: "Kolda" },
  { value: "SN-KE", label: "Kédougou" },
  { value: "SN-LG", label: "Louga" },
  { value: "SN-MT", label: "Matam" },
  { value: "SN-SL", label: "Saint-Louis" },
  { value: "SN-SE", label: "Sédhiou" },
  { value: "SN-TC", label: "Tambacounda" },
  { value: "SN-TH", label: "Thiès" },
  { value: "SN-ZG", label: "Ziguinchor" },
]

// --- Les 3 jeux de données réels fournis, rangés dans la bonne branche ---

const DATASET_POPULATION: AnsdDataset = {
  slug: "population-region-sexe-age",
  datasetId: "rnumqzf",
  label: "Population par région, sexe et groupe d'âge",
  description:
    "Répartition de la population par région, sexe et groupe d'âge (RGPH-5). Couvre pour l'instant 4 régions pilotes.",
  regionParamKey: "régions",
  note: "Ce jeu ANSD ne couvre pour l'instant que 4 régions pilotes (Dakar, Kaolack, Saint-Louis, Ziguinchor).",
  filters: [
    { paramKey: "régions", label: "Régions", multi: true, options: REGIONS_4_PILOTES },
    {
      paramKey: "sexe",
      label: "Sexe",
      multi: true,
      options: [
        { value: "M", label: "Homme" },
        { value: "F", label: "Femme" },
        { value: "_T", label: "Ensemble" },
      ],
    },
    {
      paramKey: "groupe-d-âge",
      label: "Groupe d'âge",
      multi: true,
      options: [{ value: "_T", label: "Tous âges (total)" }],
    },
  ],
}

const DATASET_SANTE: AnsdDataset = {
  slug: "indicateurs-sante-region",
  datasetId: "hfhored",
  label: "Indicateurs de santé par région",
  description: "Indicateurs de santé par région et par catégorie.",
  regionParamKey: "regions",
  filters: [
    {
      paramKey: "indicateurs",
      label: "Indicateurs",
      multi: true,
      options: [
        { value: "A1", label: "Indicateur A1" },
        { value: "A2", label: "Indicateur A2" },
        { value: "A3", label: "Indicateur A3" },
        { value: "A4", label: "Indicateur A4" },
        { value: "A5", label: "Indicateur A5" },
        { value: "A6", label: "Indicateur A6" },
        { value: "A7", label: "Indicateur A7" },
        { value: "A8", label: "Indicateur A8" },
      ],
    },
    { paramKey: "regions", label: "Régions", multi: true, options: REGIONS_TOUTES },
    {
      paramKey: "catégories",
      label: "Catégories",
      multi: true,
      options: [
        { value: "A", label: "Catégorie A" },
        { value: "B", label: "Catégorie B" },
        { value: "C", label: "Catégorie C" },
        { value: "D", label: "Catégorie D" },
      ],
    },
  ],
}

const DATASET_ECONOMIE: AnsdDataset = {
  slug: "indicateurs-economiques-nationaux",
  datasetId: "taboofg",
  label: "Indicateurs économiques nationaux",
  description: "Synthèse d'indicateurs économiques publiés au niveau national.",
  note: "Ce jeu ANSD est publié au niveau national uniquement (pas de répartition par région).",
  filters: [
    {
      paramKey: "indicateurs",
      label: "Indicateurs",
      multi: true,
      options: [
        { value: "23", label: "Indicateur 23" },
        { value: "2", label: "Indicateur 2" },
      ],
    },
    {
      paramKey: "unités",
      label: "Unités",
      multi: true,
      options: [{ value: "A", label: "Unité A" }],
    },
  ],
}

// --- Arborescence complète, calquée sur le menu du site ANSD ---
// Les sous-thèmes sans dataset affichent "aucun jeu de données configuré ici
// pour l'instant" dans l'appli : ajoute un AnsdDataset ci-dessus puis
// référence-le dans `datasets: [...]` pour le faire apparaître.

export const ANSD_THEMES: Record<AnsdThemeKey, AnsdTheme> = {
  economie: {
    key: "economie",
    label: "Économie",
    subthemes: [
      { slug: "croissance-economique", label: "Croissance économique", datasets: [] },
      { slug: "prix", label: "Prix", datasets: [] },
      { slug: "statistiques-entreprise", label: "Statistiques d'entreprise", datasets: [] },
      { slug: "echanges-exterieurs", label: "Echanges extérieurs", datasets: [] },
      { slug: "syntheses-economiques", label: "Synthèses économiques", datasets: [DATASET_ECONOMIE] },
    ],
  },
  demographie: {
    key: "demographie",
    label: "Démographie",
    subthemes: [
      { slug: "population", label: "Population", datasets: [DATASET_POPULATION] },
      { slug: "natalite", label: "Natalité", datasets: [] },
      { slug: "mortalite", label: "Mortalité", datasets: [] },
      { slug: "fecondite", label: "Fécondité", datasets: [] },
      { slug: "migration", label: "Migration", datasets: [] },
    ],
  },
  societe: {
    key: "societe",
    label: "Société",
    subthemes: [
      { slug: "sante", label: "Santé", datasets: [DATASET_SANTE] },
      { slug: "pauvrete-conditions-de-vie", label: "Pauvreté et conditions de vie", datasets: [] },
      { slug: "justice", label: "Justice", datasets: [] },
      { slug: "habitat-cadre-de-vie", label: "Habitat et cadre de vie", datasets: [] },
      { slug: "emploi-travail", label: "Emploi et travail", datasets: [] },
      { slug: "education", label: "Education", datasets: [] },
      { slug: "genre-equite", label: "Genre et équité", datasets: [] },
    ],
  },
}

export function defaultFilterValues(dataset: AnsdDataset): Record<string, string[]> {
  const values: Record<string, string[]> = {}
  for (const dim of dataset.filters) {
    values[dim.paramKey] = dim.options.map((o) => o.value)
  }
  return values
}

/** Construit l'URL réelle appelée sur l'API ANSD, à partir des filtres cochés. */
export function buildAnsdUrl(dataset: AnsdDataset, values: Record<string, string[]>): string {
  const params = new URLSearchParams()
  params.set("datasetId", dataset.datasetId)
  for (const dim of dataset.filters) {
    const selected = values[dim.paramKey] ?? []
    if (selected.length > 0) {
      params.set(dim.paramKey, selected.join(","))
    }
  }
  return `${ANSD_API_BASE}/api/2.0/data?${params.toString()}`
}

export async function fetchAnsdData(dataset: AnsdDataset, values: Record<string, string[]>) {
  const url = buildAnsdUrl(dataset, values)
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`L'API ANSD a répondu avec le statut ${res.status}`)
  }
  return res.json()
}
