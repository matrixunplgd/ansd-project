"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Bot,
  Building2,
  Compass,
  GraduationCap,
  HeartHandshake,
  HeartPulse,
  Ruler,
  Send,
  Sparkles,
  TrendingUp,
  Users,
  UsersRound,
} from "lucide-react"
import { REGION_BY_ID, THEME_LABELS, numberFmt, type ThemeKey } from "@/lib/senegal-data"
import { ANSD_THEMES, type AnsdThemeKey } from "@/lib/ansd-catalog"
import { answerQuery, SUGGESTED_QUERIES } from "@/lib/chatbot"

type CardRef = { regionId: string; theme: ThemeKey | null }

type ChatMessage = {
  id: string
  role: "user" | "assistant"
  text: string
  card?: CardRef
}

type Props = {
  focusRegionId: string | null
  onFocusRegion: (id: string) => void
}

const THEME_ICONS: Record<ThemeKey, React.ReactNode> = {
  demography: <UsersRound className="size-3.5" />,
  health: <HeartPulse className="size-3.5" />,
  economy: <TrendingUp className="size-3.5" />,
  education: <GraduationCap className="size-3.5" />,
}

const ANSD_ICONS: Record<AnsdThemeKey, React.ReactNode> = {
  economie: <TrendingUp className="size-3.5" />,
  demographie: <UsersRound className="size-3.5" />,
  societe: <HeartHandshake className="size-3.5" />,
}

const ANSD_THEME_ORDER: AnsdThemeKey[] = ["economie", "demographie", "societe"]

let idCounter = 0
function nextId() {
  idCounter += 1
  return `msg-${idCounter}`
}

export function RegionChatbot({ focusRegionId, onFocusRegion }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: nextId(),
      role: "assistant",
      text:
        "Bonjour ! Je suis l'assistant SEN MAP DATA. Demande-moi la population, la santé, l'économie ou l'éducation d'une région — je surligne la carte et t'affiche le tableau de bord.",
    },
  ])
  const [input, setInput] = useState("")
  const [pending, setPending] = useState(false)
  const lastAnnounced = useRef<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, pending])

  // Clicking a region on the map or in the list updates focusRegionId; reflect
  // that in the chat as an assistant card, without creating a loop when the
  // bot itself is the one that set the selection.
  useEffect(() => {
    if (!focusRegionId || focusRegionId === lastAnnounced.current) return
    lastAnnounced.current = focusRegionId
    const region = REGION_BY_ID[focusRegionId]
    if (!region) return
    setMessages((prev) => [
      ...prev,
      {
        id: nextId(),
        role: "assistant",
        text: `📍 Région sélectionnée sur la carte : ${region.name}.`,
        card: { regionId: focusRegionId, theme: null },
      },
    ])
  }, [focusRegionId])

  function send(raw: string) {
    const text = raw.trim()
    if (!text || pending) return
    setMessages((prev) => [...prev, { id: nextId(), role: "user", text }])
    setInput("")
    setPending(true)
    // Small simulated delay so the exchange reads like a real chat turn.
    window.setTimeout(() => {
      const answer = answerQuery(text)
      if (answer.regionId) {
        lastAnnounced.current = answer.regionId
        onFocusRegion(answer.regionId)
      }
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "assistant",
          text: answer.reply,
          card: answer.regionId ? { regionId: answer.regionId, theme: answer.theme } : undefined,
        },
      ])
      setPending(false)
    }, 350)
  }

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Bot className="size-4" aria-hidden="true" />
        </span>
        <div>
          <p className="font-serif text-sm font-semibold text-foreground">Assistant SEN MAP DATA</p>
          <p className="text-[11px] text-muted-foreground">Intentions guidées · sans IA externe</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        {pending && (
          <div className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground w-fit">
            <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.2s]" />
            <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground" />
            <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:0.2s]" />
          </div>
        )}
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {SUGGESTED_QUERIES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground transition-colors hover:bg-muted"
              >
                <Sparkles className="size-3" aria-hidden="true" />
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          send(input)
        }}
        className="flex items-center gap-2 border-t border-border p-2.5"
      >
        <label htmlFor="chat-input" className="sr-only">
          Poser une question
        </label>
        <input
          id="chat-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ex : population de Ziguinchor…"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
        />
        <button
          type="submit"
          disabled={!input.trim() || pending}
          className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
          aria-label="Envoyer"
        >
          <Send className="size-4" aria-hidden="true" />
        </button>
      </form>
    </div>
  )
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user"
  return (
    <div className={isUser ? "flex justify-end" : "flex justify-start"}>
      <div className={isUser ? "max-w-[88%]" : "max-w-[92%]"}>
        <div
          className={[
            "rounded-lg px-3 py-2 text-sm leading-relaxed",
            isUser ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
          ].join(" ")}
        >
          {message.text}
        </div>
        {message.card && <RegionCard card={message.card} />}
      </div>
    </div>
  )
}

function RegionCard({ card }: { card: CardRef }) {
  const region = REGION_BY_ID[card.regionId]
  if (!region) return null
  const density = Math.round(region.population / region.area)
  const activeTheme = card.theme ? region.themes?.find((t) => t.key === card.theme) : null

  return (
    <div className="mt-1.5 rounded-lg border border-border bg-card p-3">
      <p className="font-serif text-sm font-semibold text-foreground">{region.name}</p>

      <dl className="mt-2 grid grid-cols-2 gap-2">
        <MiniStat icon={<Building2 className="size-3.5" />} label="Capitale" value={region.capital} />
        <MiniStat icon={<Compass className="size-3.5" />} label="Densité" value={`${numberFmt.format(density)}/km²`} />
        <MiniStat icon={<Users className="size-3.5" />} label="Population" value={numberFmt.format(region.population)} />
        <MiniStat icon={<Ruler className="size-3.5" />} label="Superficie" value={`${numberFmt.format(region.area)} km²`} />
      </dl>

      {activeTheme && (
        <div className="mt-3 border-t border-border pt-2.5">
          <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {THEME_ICONS[activeTheme.key]}
            {activeTheme.label}
          </p>
          <ul className="mt-1.5 space-y-1">
            {activeTheme.indicators.map((ind) => (
              <li key={ind.label} className="flex items-center justify-between gap-3 text-xs">
                <span className="text-muted-foreground">{ind.label}</span>
                <span className="font-medium text-foreground">{ind.value}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* The 3 ANSD categories, shown as real navigation links as soon as a
          region is selected — matches the site's Économie / Démographie /
          Société menu structure. */}
      <div className="mt-3 flex flex-col gap-1.5 border-t border-border pt-2.5">
        {ANSD_THEME_ORDER.map((key) => (
          <Link
            key={key}
            href={`/region/${region.id}/${key}`}
            className="flex items-center justify-between gap-2 rounded-lg border border-border bg-secondary px-3 py-2 text-xs font-medium text-secondary-foreground transition-colors hover:bg-muted"
          >
            <span className="flex items-center gap-1.5">
              {ANSD_ICONS[key]}
              {ANSD_THEMES[key].label}
            </span>
            <ArrowRight className="size-3.5 text-muted-foreground" aria-hidden="true" />
          </Link>
        ))}
      </div>

      {!activeTheme && (!region.themes || region.themes.length === 0) && (
        <ul className="mt-3 flex flex-wrap gap-1.5 border-t border-border pt-2.5">
          {region.highlights.map((h) => (
            <li key={h} className="rounded-full border border-border bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground">
              {h}
            </li>
          ))}
        </ul>
      )}

      {region.source && (
        <p className="mt-2.5 text-[10px] text-muted-foreground">Source : {region.source}</p>
      )}
    </div>
  )
}

function MiniStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-background px-2 py-1.5">
      <dt className="flex items-center gap-1 text-[10px] text-muted-foreground">
        <span className="text-primary" aria-hidden="true">
          {icon}
        </span>
        {label}
      </dt>
      <dd className="mt-0.5 text-xs font-semibold text-foreground">{value}</dd>
    </div>
  )
}