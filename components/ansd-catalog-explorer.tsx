"use client"

import { useMemo, useState } from "react"
import {
  ChevronRight,
  Database,
  Download,
  Eye,
  Filter,
  Folder,
  Loader2,
  RefreshCcw,
} from "lucide-react"
import {
  ANSD_THEMES,
  REGION_ANSD_CODE,
  buildAnsdUrl,
  defaultFilterValues,
  fetchAnsdData,
  type AnsdDataset,
  type AnsdSubtheme,
  type AnsdThemeKey,
} from "@/lib/ansd-catalog"

type Props = {
  theme: AnsdThemeKey
  regionId: string
}

type Step = "subtheme" | "dataset" | "explore"

type FetchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: unknown; rows: Record<string, unknown>[] | null }

function extractRows(payload: unknown): Record<string, unknown>[] | null {
  if (Array.isArray(payload)) {
    return payload.every((item) => item && typeof item === "object") ? (payload as Record<string, unknown>[]) : null
  }
  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>
    for (const key of ["data", "Data", "series", "results"]) {
      const value = obj[key]
      if (Array.isArray(value) && value.every((item) => item && typeof item === "object")) {
        return value as Record<string, unknown>[]
      }
    }
  }
  return null
}

function rowsToCsv(rows: Record<string, unknown>[]): string {
  const columns = Array.from(
    rows.reduce((set, row) => {
      Object.keys(row).forEach((k) => set.add(k))
      return set
    }, new Set<string>()),
  )
  const escape = (v: unknown) => {
    const s = v === null || v === undefined ? "" : String(v)
    return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const lines = [columns.join(";"), ...rows.map((r) => columns.map((c) => escape(r[c])).join(";"))]
  return lines.join("\n")
}

function downloadBlob(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function AnsdCatalogExplorer({ theme, regionId }: Props) {
  const themeConfig = ANSD_THEMES[theme]

  const [step, setStep] = useState<Step>("subtheme")
  const [subtheme, setSubtheme] = useState<AnsdSubtheme | null>(null)
  const [dataset, setDataset] = useState<AnsdDataset | null>(null)

  function pickSubtheme(s: AnsdSubtheme) {
    setSubtheme(s)
    setStep("dataset")
  }

  function pickDataset(d: AnsdDataset) {
    setDataset(d)
    setStep("explore")
  }

  return (
    <div className="space-y-4">
      {/* Fil d'Ariane */}
      <nav className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
        <button
          type="button"
          onClick={() => {
            setStep("subtheme")
            setSubtheme(null)
            setDataset(null)
          }}
          className={step === "subtheme" ? "font-semibold text-foreground" : "hover:text-foreground"}
        >
          {themeConfig.label}
        </button>
        {subtheme && (
          <>
            <ChevronRight className="size-3" aria-hidden="true" />
            <button
              type="button"
              onClick={() => {
                setStep("dataset")
                setDataset(null)
              }}
              className={step === "dataset" ? "font-semibold text-foreground" : "hover:text-foreground"}
            >
              {subtheme.label}
            </button>
          </>
        )}
        {dataset && (
          <>
            <ChevronRight className="size-3" aria-hidden="true" />
            <span className="font-semibold text-foreground">{dataset.label}</span>
          </>
        )}
      </nav>

      {step === "subtheme" && (
        <div className="grid gap-2 sm:grid-cols-2">
          {themeConfig.subthemes.map((s) => (
            <button
              key={s.slug}
              type="button"
              onClick={() => pickSubtheme(s)}
              className="flex items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 py-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <span className="flex items-center gap-2">
                <Folder className="size-4 text-primary" aria-hidden="true" />
                {s.label}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                {s.datasets.length} jeu{s.datasets.length > 1 ? "x" : ""} de données
                <ChevronRight className="size-3.5" aria-hidden="true" />
              </span>
            </button>
          ))}
        </div>
      )}

      {step === "dataset" && subtheme && (
        <div className="space-y-2">
          {subtheme.datasets.length === 0 && (
            <p className="rounded-lg border border-dashed border-border px-3 py-4 text-xs text-muted-foreground">
              Aucun jeu de données configuré ici pour l&apos;instant. Ajoute son <code>datasetId</code> ANSD dans{" "}
              <code>lib/ansd-catalog.ts</code> (sous-thème « {subtheme.label} ») pour qu&apos;il apparaisse ici.
            </p>
          )}
          {subtheme.datasets.map((d) => (
            <button
              key={d.slug}
              type="button"
              onClick={() => pickDataset(d)}
              className="flex w-full items-start justify-between gap-2 rounded-lg border border-border bg-card px-3 py-3 text-left transition-colors hover:bg-muted"
            >
              <span className="flex items-start gap-2">
                <Database className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <span>
                  <span className="block text-sm font-medium text-foreground">{d.label}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{d.description}</span>
                </span>
              </span>
              <ChevronRight className="mt-1 size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
            </button>
          ))}
        </div>
      )}

      {step === "explore" && dataset && <DatasetExplorer dataset={dataset} regionId={regionId} />}
    </div>
  )
}

function DatasetExplorer({ dataset, regionId }: { dataset: AnsdDataset; regionId: string }) {
  const initialValues = useMemo(() => {
    const values = defaultFilterValues(dataset)
    if (dataset.regionParamKey) {
      const code = REGION_ANSD_CODE[regionId]
      const options = dataset.filters.find((f) => f.paramKey === dataset.regionParamKey)?.options ?? []
      if (code && options.some((o) => o.value === code)) {
        values[dataset.regionParamKey] = [code]
      }
    }
    return values
  }, [dataset, regionId])

  const [selected, setSelected] = useState<Record<string, string[]>>(initialValues)
  const [state, setState] = useState<FetchState>({ status: "idle" })

  function toggleValue(paramKey: string, value: string) {
    setSelected((prev) => {
      const current = prev[paramKey] ?? []
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
      return { ...prev, [paramKey]: next }
    })
  }

  async function load() {
    setState({ status: "loading" })
    try {
      const data = await fetchAnsdData(dataset, selected)
      setState({ status: "success", data, rows: extractRows(data) })
    } catch (err) {
      setState({
        status: "error",
        message:
          err instanceof Error
            ? err.message
            : "Impossible de contacter l'API ANSD (senegal.opendataforafrica.org).",
      })
    }
  }

  function downloadJson() {
    if (state.status !== "success") return
    downloadBlob(JSON.stringify(state.data, null, 2), `ansd-${dataset.slug}.json`, "application/json")
  }

  function downloadCsv() {
    if (state.status !== "success" || !state.rows || state.rows.length === 0) return
    downloadBlob(rowsToCsv(state.rows), `ansd-${dataset.slug}.csv`, "text/csv;charset=utf-8")
  }

  const requestUrl = buildAnsdUrl(dataset, selected)

  return (
    <div className="space-y-4">
      {/* Vue d'ensemble du dataset, avant tout filtre */}
      <div className="rounded-lg border border-border bg-card p-3">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <Eye className="size-3.5" aria-hidden="true" />
          Vue d&apos;ensemble
        </p>
        <p className="mt-1 font-serif text-base font-semibold text-foreground">{dataset.label}</p>
        <p className="mt-1 text-sm text-muted-foreground">{dataset.description}</p>
        <dl className="mt-3 grid gap-2 sm:grid-cols-2">
          <div className="rounded-md border border-border bg-background px-2.5 py-1.5">
            <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">Source</dt>
            <dd className="text-xs font-medium text-foreground">
              ANSD · senegal.opendataforafrica.org (datasetId {dataset.datasetId})
            </dd>
          </div>
          <div className="rounded-md border border-border bg-background px-2.5 py-1.5">
            <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">Dimensions filtrables</dt>
            <dd className="text-xs font-medium text-foreground">
              {dataset.filters.map((f) => `${f.label} (${f.options.length})`).join(" · ")}
            </dd>
          </div>
        </dl>
        {dataset.note && <p className="mt-2 text-xs text-muted-foreground">{dataset.note}</p>}
      </div>

      {/* Filtres à cocher, un bloc par dimension du dataset */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {dataset.filters.map((dim) => (
          <fieldset key={dim.paramKey} className="rounded-lg border border-border bg-card p-3">
            <legend className="flex items-center gap-1.5 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Filter className="size-3" aria-hidden="true" />
              {dim.label}
            </legend>
            <div className="mt-1.5 flex max-h-40 flex-col gap-1 overflow-y-auto pr-1">
              {dim.options.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 text-xs text-foreground">
                  <input
                    type="checkbox"
                    checked={(selected[dim.paramKey] ?? []).includes(opt.value)}
                    onChange={() => toggleValue(dim.paramKey, opt.value)}
                    className="size-3.5 rounded border-border accent-primary"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={load}
          disabled={state.status === "loading"}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-opacity disabled:opacity-50"
        >
          {state.status === "loading" ? (
            <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <RefreshCcw className="size-3.5" aria-hidden="true" />
          )}
          Charger avec ces filtres
        </button>
        <button
          type="button"
          onClick={downloadJson}
          disabled={state.status !== "success"}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-2 text-xs font-semibold text-secondary-foreground transition-opacity disabled:opacity-40"
        >
          <Download className="size-3.5" aria-hidden="true" />
          Télécharger JSON (filtré)
        </button>
        <button
          type="button"
          onClick={downloadCsv}
          disabled={state.status !== "success" || !state.rows || state.rows.length === 0}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-2 text-xs font-semibold text-secondary-foreground transition-opacity disabled:opacity-40"
        >
          <Download className="size-3.5" aria-hidden="true" />
          Télécharger CSV (filtré)
        </button>
      </div>

      <p className="break-all text-[10px] text-muted-foreground">Requête : {requestUrl}</p>

      {state.status === "error" && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {state.message} Vérifie ta connexion, ou que l&apos;API autorise les appels depuis ton site (CORS).
        </p>
      )}

      {state.status === "success" && (
        <div className="rounded-lg border border-border bg-card">
          {state.rows && state.rows.length > 0 ? (
            <div className="max-h-96 overflow-auto">
              <table className="w-full min-w-max text-left text-xs">
                <thead className="sticky top-0 bg-muted text-muted-foreground">
                  <tr>
                    {Object.keys(state.rows[0]).map((col) => (
                      <th key={col} className="whitespace-nowrap px-3 py-2 font-semibold">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {state.rows.map((row, i) => (
                    <tr key={i} className="border-t border-border">
                      {Object.keys(state.rows![0]).map((col) => (
                        <td key={col} className="whitespace-nowrap px-3 py-1.5 text-foreground">
                          {String(row[col] ?? "")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <pre className="max-h-96 overflow-auto p-3 text-[11px] text-foreground">
              {JSON.stringify(state.data, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  )
}
