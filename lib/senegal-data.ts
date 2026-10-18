// Sample data for Senegal's 14 administrative regions.
// Figures are approximate, illustrative sample values for demonstration.
// The `id` matches the `shapeName` property in public/senegal-regions.geojson.

export type Indicator = {
  label: string
  value: string
}

export type ThemeKey = "demography" | "health" | "economy" | "education"

export type Theme = {
  key: ThemeKey
  label: string
  indicators: Indicator[]
}

export type Region = {
  id: string
  name: string
  capital: string
  population: number
  area: number // km²
  zone: "West" | "Center" | "North" | "East" | "South"
  blurb: string
  highlights: string[]
  // Thematic dashboards (demography / health / economy / education) are only
  // populated for the pilot regions covered in the 72h hackathon scope.
  // Values are illustrative sample figures for the demo, not live ANSD data.
  source?: string
  themes?: Theme[]
}

export const THEME_LABELS: Record<ThemeKey, string> = {
  demography: "Démographie",
  health: "Santé",
  economy: "Économie",
  education: "Éducation",
}

export const REGIONS: Region[] = [
  {
    id: "Dakar",
    name: "Dakar",
    capital: "Dakar",
    population: 3940000,
    area: 547,
    zone: "West",
    blurb:
      "The smallest yet most populous region, home to the national capital and the westernmost point of continental Africa.",
    highlights: ["Cap-Vert peninsula", "Île de Gorée (UNESCO)", "African Renaissance Monument", "Port of Dakar"],
    source: "RGPH-5 (2023) · ANSD — valeurs d'illustration",
    themes: [
      {
        key: "demography",
        label: "Démographie",
        indicators: [
          { label: "Population totale", value: "≈ 3 940 000 hab." },
          { label: "Densité", value: "≈ 7 200 hab./km²" },
          { label: "Taux d'urbanisation", value: "≈ 97 %" },
        ],
      },
      {
        key: "health",
        label: "Santé",
        indicators: [
          { label: "Couverture sanitaire", value: "1 structure / ≈ 12 000 hab." },
          { label: "Taux de vaccination infantile", value: "≈ 85 %" },
          { label: "Accès à l'eau potable", value: "≈ 98 %" },
        ],
      },
      {
        key: "economy",
        label: "Économie",
        indicators: [
          { label: "Secteur dominant", value: "Tertiaire / services portuaires" },
          { label: "Taux d'activité", value: "≈ 52 %" },
          { label: "Taux de chômage", value: "≈ 18 %" },
        ],
      },
      {
        key: "education",
        label: "Éducation",
        indicators: [
          { label: "Taux d'alphabétisation", value: "≈ 65 %" },
          { label: "Taux de scolarisation primaire", value: "≈ 92 %" },
          { label: "Ratio élèves / enseignant", value: "≈ 34" },
        ],
      },
    ],
  },
  {
    id: "Thies",
    name: "Thiès",
    capital: "Thiès",
    population: 2080000,
    area: 6601,
    zone: "West",
    blurb:
      "An industrial and craft hub just east of Dakar, famous for its tapestry factory and phosphate mining.",
    highlights: ["Manufacture de tapisseries", "Petite Côte beaches", "Popenguine reserve", "Phosphate mines"],
  },
  {
    id: "Diourbel",
    name: "Diourbel",
    capital: "Diourbel",
    population: 1800000,
    area: 4824,
    zone: "Center",
    blurb:
      "The spiritual heartland of the Mouride brotherhood, centered on the holy city of Touba and its Grand Mosque.",
    highlights: ["Great Mosque of Touba", "Grand Magal pilgrimage", "Groundnut basin", "Bamba heritage"],
  },
  {
    id: "Fatick",
    name: "Fatick",
    capital: "Fatick",
    population: 920000,
    area: 7935,
    zone: "Center",
    blurb:
      "A coastal region of mangroves and tidal flats along the Sine-Saloum Delta, rich in birdlife and shellfish.",
    highlights: ["Sine-Saloum Delta (UNESCO)", "Mangrove creeks", "Shell mounds", "Serer culture"],
  },
  {
    id: "Kaolack",
    name: "Kaolack",
    capital: "Kaolack",
    population: 1180000,
    area: 5357,
    zone: "Center",
    blurb:
      "A major commercial crossroads and groundnut trading center on the Saloum River, with one of West Africa's largest markets.",
    highlights: ["Marché central", "Saloum River port", "Salt flats", "Niassène mosque"],
    source: "RGPH-5 (2023) · ANSD — valeurs d'illustration",
    themes: [
      {
        key: "demography",
        label: "Démographie",
        indicators: [
          { label: "Population totale", value: "≈ 1 180 000 hab." },
          { label: "Densité", value: "≈ 220 hab./km²" },
          { label: "Taux d'urbanisation", value: "≈ 34 %" },
        ],
      },
      {
        key: "health",
        label: "Santé",
        indicators: [
          { label: "Couverture sanitaire", value: "1 structure / ≈ 18 000 hab." },
          { label: "Taux de vaccination infantile", value: "≈ 76 %" },
          { label: "Accès à l'eau potable", value: "≈ 82 %" },
        ],
      },
      {
        key: "economy",
        label: "Économie",
        indicators: [
          { label: "Secteur dominant", value: "Commerce & négoce arachidier" },
          { label: "Taux d'activité", value: "≈ 44 %" },
          { label: "Taux de chômage", value: "≈ 15 %" },
        ],
      },
      {
        key: "education",
        label: "Éducation",
        indicators: [
          { label: "Taux d'alphabétisation", value: "≈ 41 %" },
          { label: "Taux de scolarisation primaire", value: "≈ 78 %" },
          { label: "Ratio élèves / enseignant", value: "≈ 41" },
        ],
      },
    ],
  },
  {
    id: "Kaffrine",
    name: "Kaffrine",
    capital: "Kaffrine",
    population: 720000,
    area: 11181,
    zone: "Center",
    blurb:
      "A largely agricultural region carved out of Kaolack in 2008, at the heart of Senegal's peanut-growing belt.",
    highlights: ["Groundnut farming", "Cattle markets", "Savanna woodland", "Rural Peul communities"],
  },
  {
    id: "Louga",
    name: "Louga",
    capital: "Louga",
    population: 1020000,
    area: 24889,
    zone: "North",
    blurb:
      "A vast, semi-arid region bridging the coast and the interior, known for pastoralism and the Lompoul dunes.",
    highlights: ["Lompoul Desert", "Pastoral herding", "Léona coast", "Wolof heritage"],
  },
  {
    id: "Saint Louis",
    name: "Saint-Louis",
    capital: "Saint-Louis",
    population: 1090000,
    area: 19241,
    zone: "North",
    blurb:
      "The former colonial capital on an island at the mouth of the Senegal River, celebrated for its architecture and jazz.",
    highlights: ["Old town (UNESCO)", "Djoudj bird sanctuary", "Faidherbe Bridge", "Saint-Louis Jazz Festival"],
    source: "RGPH-5 (2023) · ANSD — valeurs d'illustration",
    themes: [
      {
        key: "demography",
        label: "Démographie",
        indicators: [
          { label: "Population totale", value: "≈ 1 090 000 hab." },
          { label: "Densité", value: "≈ 57 hab./km²" },
          { label: "Taux d'urbanisation", value: "≈ 45 %" },
        ],
      },
      {
        key: "health",
        label: "Santé",
        indicators: [
          { label: "Couverture sanitaire", value: "1 structure / ≈ 15 000 hab." },
          { label: "Taux de vaccination infantile", value: "≈ 79 %" },
          { label: "Accès à l'eau potable", value: "≈ 88 %" },
        ],
      },
      {
        key: "economy",
        label: "Économie",
        indicators: [
          { label: "Secteur dominant", value: "Pêche & agriculture irriguée" },
          { label: "Taux d'activité", value: "≈ 41 %" },
          { label: "Taux de chômage", value: "≈ 16 %" },
        ],
      },
      {
        key: "education",
        label: "Éducation",
        indicators: [
          { label: "Taux d'alphabétisation", value: "≈ 47 %" },
          { label: "Taux de scolarisation primaire", value: "≈ 81 %" },
          { label: "Ratio élèves / enseignant", value: "≈ 38" },
        ],
      },
    ],
  },
  {
    id: "Matam",
    name: "Matam",
    capital: "Matam",
    population: 700000,
    area: 29445,
    zone: "North",
    blurb:
      "A northeastern region strung along the Senegal River valley, historically part of the Fouta Toro and its Toucouleur culture.",
    highlights: ["Senegal River valley", "Fouta Toro heritage", "Flood-recession farming", "Ourossogui hub"],
  },
  {
    id: "Tambacounda",
    name: "Tambacounda",
    capital: "Tambacounda",
    population: 950000,
    area: 42706,
    zone: "East",
    blurb:
      "Senegal's largest region by area, a gateway to the east with railways, savanna and the country's flagship national park.",
    highlights: ["Niokolo-Koba Park (UNESCO)", "Gambia River", "Rail junction", "Wildlife corridors"],
  },
  {
    id: "Kedougou",
    name: "Kédougou",
    capital: "Kédougou",
    population: 200000,
    area: 16800,
    zone: "East",
    blurb:
      "A mountainous southeastern region of waterfalls and gold, home to the Bassari and Bedik peoples of the Fouta Djallon foothills.",
    highlights: ["Bassari Country (UNESCO)", "Dindéfélo waterfall", "Gold mining", "Fouta Djallon foothills"],
  },
  {
    id: "Kolda",
    name: "Kolda",
    capital: "Kolda",
    population: 830000,
    area: 13771,
    zone: "South",
    blurb:
      "A green, well-watered region of the Casamance interior known for cashews, cotton and dense forest galleries.",
    highlights: ["Casamance forests", "Cashew orchards", "Cotton farming", "Fouladou plateau"],
  },
  {
    id: "Sedhiou",
    name: "Sédhiou",
    capital: "Sédhiou",
    population: 550000,
    area: 7341,
    zone: "South",
    blurb:
      "A lush region straddling the Casamance River, historically a trade post and today a center of rice and fruit growing.",
    highlights: ["Casamance River", "Rice paddies", "Mango orchards", "Colonial fort ruins"],
  },
  {
    id: "Ziguinchor",
    name: "Ziguinchor",
    capital: "Ziguinchor",
    population: 660000,
    area: 7339,
    zone: "South",
    blurb:
      "The cultural capital of the Casamance, a verdant southern region of palm groves, beaches and Diola traditions.",
    highlights: ["Cap Skirring beaches", "Diola culture", "Palm & rice country", "Ziguinchor riverfront"],
    source: "RGPH-5 (2023) · ANSD — valeurs d'illustration",
    themes: [
      {
        key: "demography",
        label: "Démographie",
        indicators: [
          { label: "Population totale", value: "≈ 660 000 hab." },
          { label: "Densité", value: "≈ 90 hab./km²" },
          { label: "Taux d'urbanisation", value: "≈ 40 %" },
        ],
      },
      {
        key: "health",
        label: "Santé",
        indicators: [
          { label: "Couverture sanitaire", value: "1 structure / ≈ 14 000 hab." },
          { label: "Taux de vaccination infantile", value: "≈ 81 %" },
          { label: "Accès à l'eau potable", value: "≈ 85 %" },
        ],
      },
      {
        key: "economy",
        label: "Économie",
        indicators: [
          { label: "Secteur dominant", value: "Riziculture & tourisme" },
          { label: "Taux d'activité", value: "≈ 39 %" },
          { label: "Taux de chômage", value: "≈ 17 %" },
        ],
      },
      {
        key: "education",
        label: "Éducation",
        indicators: [
          { label: "Taux d'alphabétisation", value: "≈ 53 %" },
          { label: "Taux de scolarisation primaire", value: "≈ 85 %" },
          { label: "Ratio élèves / enseignant", value: "≈ 36" },
        ],
      },
    ],
  },
]

export const REGION_BY_ID: Record<string, Region> = Object.fromEntries(
  REGIONS.map((r) => [r.id, r]),
)

export const ZONES = ["West", "Center", "North", "East", "South"] as const

// Regions with a full thematic dashboard (demography / health / economy / education)
// in this 72h hackathon scope, per the project proposal.
export const PILOT_REGION_IDS = REGIONS.filter((r) => r.themes).map((r) => r.id)

export const numberFmt = new Intl.NumberFormat("en-US")
