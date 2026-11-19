"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FORM_LABEL, STATUS_LABEL, STATUSES,
  type Car, type FileRef, type InboxItem, type Status, type Stop,
} from "@/lib/inbox/types";

/*
 * Mcars CMS — inbox of the requests sent through the site's forms.
 * Left: filters and the list. Clicking a request opens a side panel with the request laid out
 * (customer, route, cars with their photos and documents, message) plus status and an internal
 * note for the office. The open request is kept in ?id= so a link opens it directly.
 */

const API = "/api/inbox";

const STATUS_STYLE: Record<Status, string> = {
  nieuw: "bg-blue-600 text-white",
  "in-behandeling": "bg-amber-100 text-amber-900",
  "offerte-verstuurd": "bg-violet-100 text-violet-900",
  afgehandeld: "bg-emerald-100 text-emerald-900",
  archief: "bg-zinc-200 text-zinc-600",
};

type Kind = "alle" | "offerte" | "contact";

const fileUrl = (id: string, f: FileRef, download = false) =>
  `${API}/${id}/files/${encodeURIComponent(f.file)}${download ? "?download" : ""}`;

const isImage = (f: FileRef) => f.type.startsWith("image/") && !/hei[cf]/.test(f.type);
const kb = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} kB`);

function fmtDate(iso: string, withTime = true) {
  const d = new Date(iso);
  return d.toLocaleString("nl-BE", {
    day: "numeric", month: "short", year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

function relative(iso: string) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return "net nu";
  if (s < 3600) return `${Math.floor(s / 60)} min geleden`;
  if (s < 86400) return `${Math.floor(s / 3600)} u geleden`;
  if (s < 86400 * 7) return `${Math.floor(s / 86400)} d geleden`;
  return fmtDate(iso, false);
}

/** yyyy-mm-dd → 19/11/2026, anything else as is. */
const fmtDay = (v?: string) => (v && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v.split("-").reverse().join("/") : v);

const place = (s?: Stop) =>
  !s ? "" : s.depot ? "Depot Mcars" : s.stad || s.adres || s.land || "";

function summary(item: InboxItem) {
  if (item.kind === "contact") return item.onderwerp || item.bericht?.slice(0, 90) || "Contactaanvraag";
  const route = item.rit ? `${place(item.rit.van) || "?"} → ${place(item.rit.naar) || "?"}` : "";
  return route || item.service || "Offerteaanvraag";
}

const carCount = (item: InboxItem) => (item.autos ?? []).reduce((n, c) => n + (c.aantal || 1), 0);
const fileCount = (item: InboxItem) => (item.autos ?? []).reduce((n, c) => n + c.photos.length + c.docs.length, 0);
const firstPhoto = (item: InboxItem) => item.autos?.flatMap((c) => c.photos).find(isImage);

/* ------------------------------------------------------------------ */

export default function InboxApp({ initial, initialId }: { initial: InboxItem[]; initialId?: string }) {
  const [items, setItems] = useState(initial);
  const [kind, setKind] = useState<Kind>("alle");
  const [status, setStatus] = useState<Status | "open" | "alle">("open");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(initialId ?? null);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetch(API, { cache: "no-store" });
      if (res.ok) setItems(await res.json());
    } finally {
      setRefreshing(false);
    }
  }, []);

  // New requests show up without reloading.
  useEffect(() => {
    const t = setInterval(refresh, 20000);
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(t);
      window.removeEventListener("focus", onFocus);
    };
  }, [refresh]);

  // open request → ?id= (the page reads it back on load)
  useEffect(() => {
    const url = new URL(window.location.href);
    if (openId) url.searchParams.set("id", openId);
    else url.searchParams.delete("id");
    window.history.replaceState(null, "", url);
  }, [openId]);

  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter((it) => {
      if (kind !== "alle" && it.kind !== kind) return false;
      if (status === "open" && (it.status === "afgehandeld" || it.status === "archief")) return false;
      if (status !== "open" && status !== "alle" && it.status !== status) return false;
      if (!needle) return true;
      const hay = [
        it.klant.naam, it.klant.email, it.klant.telefoon, it.klant.bedrijf, it.onderwerp, it.bericht, it.service,
        place(it.rit?.van), place(it.rit?.naar), it.rit?.van.land, it.rit?.naar.land,
        ...(it.autos ?? []).flatMap((c) => [c.merk, c.model]),
      ].filter(Boolean).join(" ").toLowerCase();
      return hay.includes(needle);
    });
  }, [items, kind, status, q]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { alle: items.length, open: 0 };
    for (const s of STATUSES) c[s] = 0;
    for (const it of items) {
      c[it.status]++;
      if (it.status !== "afgehandeld" && it.status !== "archief") c.open++;
    }
    return c;
  }, [items]);

  const open = items.find((it) => it.id === openId) ?? null;
  const index = open ? visible.findIndex((it) => it.id === open.id) : -1;

  const patch = useCallback(async (id: string, body: { status?: Status; notitie?: string }) => {
    setItems((list) => list.map((it) => (it.id === id ? { ...it, ...body } : it)));
    const res = await fetch(`${API}/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) {
      const saved: InboxItem = await res.json();
      setItems((list) => list.map((it) => (it.id === id ? saved : it)));
    }
  }, []);

  const remove = useCallback(async (id: string) => {
    const res = await fetch(`${API}/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((list) => list.filter((it) => it.id !== id));
      setOpenId(null);
    }
  }, []);

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-zinc-950 text-xs font-bold text-white">M</span>
            <span className="font-medium">Mcars CMS</span>
            <span className="text-zinc-300">/</span>
            <span className="text-zinc-500">Aanvragen</span>
          </div>
          <button
            type="button"
            onClick={refresh}
            className="ml-auto flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-zinc-600 ring-1 ring-zinc-200 transition-colors hover:bg-zinc-50 hover:text-zinc-950"
          >
            <Icon d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7" className={`size-4 ${refreshing ? "animate-spin" : ""}`} />
            Vernieuwen
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">Aanvragen</h1>
            <p className="mt-1 text-sm text-zinc-500">
              {counts.nieuw > 0 ? <><b className="font-medium text-blue-600">{counts.nieuw} nieuw</b> · </> : null}
              {counts.open} open · {counts.alle} in totaal
            </p>
          </div>
          <label className="relative block w-full sm:w-72">
            <Icon d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-4.3-4.3" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Zoek naam, e-mail, stad, merk…"
              className="h-10 w-full rounded-xl bg-white pr-3 pl-9 text-sm ring-1 ring-zinc-200 outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-zinc-950"
            />
          </label>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <div className="flex rounded-xl bg-white p-1 ring-1 ring-zinc-200">
            {(["alle", "offerte", "contact"] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setKind(k)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${kind === k ? "bg-zinc-950 text-white" : "text-zinc-600 hover:text-zinc-950"}`}
              >
                {k === "alle" ? "Alles" : k === "offerte" ? "Offertes" : "Contact"}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(["open", ...STATUSES, "alle"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ring-1 transition-colors ${
                  status === s ? "bg-zinc-950 text-white ring-zinc-950" : "bg-white text-zinc-600 ring-zinc-200 hover:text-zinc-950"
                }`}
              >
                {s === "open" ? "Open" : s === "alle" ? "Alle statussen" : STATUS_LABEL[s]}
                <span className={`ml-1.5 tabular-nums ${status === s ? "text-white/60" : "text-zinc-400"}`}>{counts[s]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <ul className="mt-5 overflow-hidden rounded-2xl bg-white ring-1 ring-zinc-200">
          {visible.length === 0 && (
            <li className="px-6 py-16 text-center text-sm text-zinc-500">
              {items.length === 0 ? "Nog geen aanvragen. Verstuur een formulier op de site om er een te zien." : "Geen aanvragen voor deze filter."}
            </li>
          )}
          {visible.map((it) => {
            const photo = firstPhoto(it);
            const cars = carCount(it);
            const files = fileCount(it);
            return (
              <li key={it.id} className="border-b border-zinc-100 last:border-0">
                <button
                  type="button"
                  onClick={() => setOpenId(it.id)}
                  className={`flex w-full items-center gap-4 px-4 py-3.5 text-left transition-colors hover:bg-zinc-50 sm:px-5 ${openId === it.id ? "bg-zinc-50" : ""}`}
                >
                  <span className={`size-2 flex-none rounded-full ${it.status === "nieuw" ? "bg-blue-600" : "bg-transparent"}`} aria-label={it.status === "nieuw" ? "Nieuw" : undefined} />
                  <span className="relative flex size-11 flex-none items-center justify-center overflow-hidden rounded-xl bg-zinc-100 text-zinc-500">
                    {photo ? (
                      // eslint-disable-next-line @next/next/no-img-element -- uploaded file from the inbox API
                      <img src={fileUrl(it.id, photo)} alt="" className="size-full object-cover" />
                    ) : (
                      <Icon d={it.kind === "contact" ? ICON.mail : ICON.car} className="size-5" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className={`truncate text-sm ${it.status === "nieuw" ? "font-semibold" : "font-medium"}`}>
                        {it.klant.naam || it.klant.email}
                      </span>
                      {it.klant.bedrijf && <span className="hidden truncate text-sm text-zinc-500 sm:inline">· {it.klant.bedrijf}</span>}
                    </span>
                    <span className="mt-0.5 flex items-center gap-2 text-sm text-zinc-500">
                      <span className="truncate">{summary(it)}</span>
                    </span>
                  </span>
                  <span className="hidden flex-none items-center gap-3 text-xs text-zinc-500 md:flex">
                    {cars > 0 && <span className="flex items-center gap-1"><Icon d={ICON.car} className="size-3.5" />{cars}</span>}
                    {files > 0 && <span className="flex items-center gap-1"><Icon d={ICON.clip} className="size-3.5" />{files}</span>}
                  </span>
                  <span className="hidden w-28 flex-none sm:block">
                    <KindBadge kind={it.kind} />
                  </span>
                  <span className="flex w-24 flex-none flex-col items-end gap-1 sm:w-32">
                    <StatusPill status={it.status} />
                    <span className="text-xs text-zinc-400" title={fmtDate(it.createdAt)}>{relative(it.createdAt)}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-xs text-zinc-400">
          Lokaal opgeslagen in <code className="font-mono">.data/inbox</code>. Ververst elke 20 seconden.
        </p>
      </main>

      {open && (
        <Drawer
          key={open.id}
          item={open}
          onClose={() => setOpenId(null)}
          onPrev={index > 0 ? () => setOpenId(visible[index - 1].id) : undefined}
          onNext={index >= 0 && index < visible.length - 1 ? () => setOpenId(visible[index + 1].id) : undefined}
          onPatch={(body) => patch(open.id, body)}
          onDelete={() => remove(open.id)}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Drawer({
  item, onClose, onPrev, onNext, onPatch, onDelete,
}: {
  item: InboxItem;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  onPatch: (body: { status?: Status; notitie?: string }) => void;
  onDelete: () => void;
}) {
  const [lightbox, setLightbox] = useState<{ files: FileRef[]; i: number } | null>(null);
  const [note, setNote] = useState(item.notitie ?? "");
  const [noteState, setNoteState] = useState<"" | "saving" | "saved">("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    panel.current?.focus();
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightbox) return;
      const typing = (e.target as HTMLElement)?.closest("input, textarea, select");
      if (e.key === "Escape") onClose();
      if (typing) return;
      if ((e.key === "ArrowUp" || e.key === "k") && onPrev) onPrev();
      if ((e.key === "ArrowDown" || e.key === "j") && onNext) onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, onClose, onPrev, onNext]);

  const saveNote = () => {
    if (note === (item.notitie ?? "")) return;
    setNoteState("saving");
    onPatch({ notitie: note });
    setTimeout(() => setNoteState("saved"), 300);
  };

  const k = item.klant;
  const mailSubject = item.kind === "contact"
    ? `Re: ${item.onderwerp || "uw vraag aan Mcars"}`
    : `Uw offerteaanvraag${item.rit ? ` ${place(item.rit.van)} → ${place(item.rit.naar)}` : ""}`;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={`Aanvraag van ${k.naam}`}>
      <button type="button" aria-label="Sluiten" onClick={onClose} className="absolute inset-0 bg-zinc-950/40 backdrop-blur-[2px]" />
      <div
        ref={panel}
        tabIndex={-1}
        className="absolute inset-y-0 right-0 flex w-full max-w-2xl flex-col bg-zinc-50 shadow-2xl outline-none animate-[cms-slide_.22s_ease-out]"
      >
        <style>{`@keyframes cms-slide{from{transform:translateX(24px);opacity:.4}to{transform:none;opacity:1}}`}</style>

        {/* Header */}
        <div className="border-b border-zinc-200 bg-white px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <KindBadge kind={item.kind} />
            <span className="truncate text-xs text-zinc-500">{FORM_LABEL[item.form] ?? item.form}</span>
            <div className="ml-auto flex items-center gap-1">
              <IconButton label="Vorige (↑)" onClick={onPrev} d="M18 15l-6-6-6 6" />
              <IconButton label="Volgende (↓)" onClick={onNext} d="M6 9l6 6 6-6" />
              <IconButton label="Sluiten (Esc)" onClick={onClose} d="M6 6l12 12M18 6L6 18" />
            </div>
          </div>
          <h2 className="mt-3 text-xl font-medium tracking-tight sm:text-2xl">{k.naam || k.email}</h2>
          <p className="mt-0.5 text-sm text-zinc-500">
            {fmtDate(item.createdAt)} · <span className="font-mono text-xs">{item.id}</span>
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <label className="relative">
              <span className="sr-only">Status</span>
              <select
                value={item.status}
                onChange={(e) => onPatch({ status: e.target.value as Status })}
                className={`h-9 cursor-pointer appearance-none rounded-lg pr-8 pl-3 text-sm font-medium outline-none focus:ring-2 focus:ring-zinc-950 ${STATUS_STYLE[item.status]}`}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s} className="bg-white text-zinc-950">{STATUS_LABEL[s]}</option>
                ))}
              </select>
              <Icon d="M6 9l6 6 6-6" className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2" />
            </label>
            {k.email && (
              <a href={`mailto:${k.email}?subject=${encodeURIComponent(mailSubject)}`} className="flex h-9 items-center gap-2 rounded-lg bg-zinc-950 px-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800">
                <Icon d={ICON.mail} className="size-4" /> Antwoorden
              </a>
            )}
            {k.telefoon && (
              <a href={`tel:${k.telefoon.replace(/[^\d+]/g, "")}`} className="flex h-9 items-center gap-2 rounded-lg bg-white px-3 text-sm font-medium ring-1 ring-zinc-200 transition-colors hover:bg-zinc-50">
                <Icon d={ICON.phone} className="size-4" /> Bellen
              </a>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-4 overflow-y-auto overscroll-contain p-4 sm:p-6">
          <Section title="Klant" icon={ICON.user}>
            <Dl>
              <Row label="Naam" value={k.naam} />
              {k.type && <Row label="Type" value={k.type} />}
              {k.bedrijf && <Row label="Bedrijf" value={k.bedrijf} />}
              {k.btw && <Row label="Btw-nummer" value={k.btw} mono />}
              <Row label="E-mail" value={k.email} href={k.email ? `mailto:${k.email}` : undefined} copy />
              {k.telefoon && <Row label="Telefoon" value={k.telefoon} href={`tel:${k.telefoon.replace(/[^\d+]/g, "")}`} copy />}
            </Dl>
          </Section>

          {item.rit && (
            <Section title={item.rit.retour ? "Rit · heen en terug" : "Rit · enkele rit"} icon={ICON.route}>
              <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-stretch">
                <StopCard label="Vertrek" stop={item.rit.van} />
                <span className="hidden items-center text-zinc-300 sm:flex">
                  <Icon d={item.rit.retour ? "M4 8h14l-3-3M20 16H6l3 3" : "M4 12h15M13 6l6 6-6 6"} className="size-5" />
                </span>
                <StopCard label="Bestemming" stop={item.rit.naar} />
              </div>
              {item.rit.opties && <p className="mt-3 text-sm text-zinc-600"><span className="text-zinc-400">Opties: </span>{item.rit.opties}</p>}
            </Section>
          )}

          {item.service && !item.rit && (
            <Section title="Dienst" icon={ICON.route}><p className="text-sm">{item.service}</p></Section>
          )}

          {item.autos && item.autos.length > 0 && (
            <Section title={`Auto's (${carCount(item)})`} icon={ICON.car}>
              <div className="space-y-3">
                {item.autos.map((c, i) => (
                  <CarCard key={i} id={item.id} car={c} n={i + 1} onOpenPhoto={(j) => setLightbox({ files: c.photos.filter(isImage), i: j })} />
                ))}
              </div>
            </Section>
          )}

          {(item.onderwerp || item.bericht) && (
            <Section title="Bericht" icon={ICON.chat}>
              {item.onderwerp && <p className="text-sm font-medium">{item.onderwerp}</p>}
              {item.bericht && <p className="mt-1 text-sm leading-relaxed whitespace-pre-wrap text-zinc-700">{item.bericht}</p>}
            </Section>
          )}

          <Section title="Interne notitie" icon={ICON.note} aside={noteState === "saving" ? "Opslaan…" : noteState === "saved" ? "Opgeslagen" : undefined}>
            <textarea
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                setNoteState("");
              }}
              onBlur={saveNote}
              rows={3}
              placeholder="Prijs, afspraken, wie volgt op… (alleen zichtbaar in het CMS)"
              className="block w-full resize-y rounded-xl bg-zinc-50 px-3 py-2.5 text-sm ring-1 ring-zinc-200 outline-none placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-zinc-950"
            />
          </Section>

          <div className="flex flex-wrap items-center justify-between gap-3 px-1 pt-1 text-xs text-zinc-400">
            <span>
              {item.page && <>Pagina <span className="font-mono">{item.page}</span></>}
              {item.locale && <> · taal {item.locale.toUpperCase()}</>}
              {item.updatedAt && <> · bijgewerkt {relative(item.updatedAt)}</>}
            </span>
            {confirmDelete ? (
              <span className="flex items-center gap-2">
                <span className="text-zinc-600">Definitief verwijderen, met bestanden?</span>
                <button type="button" onClick={onDelete} className="rounded-md bg-red-600 px-2.5 py-1 font-medium text-white hover:bg-red-700">Verwijder</button>
                <button type="button" onClick={() => setConfirmDelete(false)} className="rounded-md px-2.5 py-1 font-medium text-zinc-600 ring-1 ring-zinc-200 hover:bg-white">Annuleer</button>
              </span>
            ) : (
              <button type="button" onClick={() => setConfirmDelete(true)} className="flex items-center gap-1.5 rounded-md px-2 py-1 hover:bg-red-50 hover:text-red-600">
                <Icon d={ICON.trash} className="size-3.5" /> Verwijderen
              </button>
            )}
          </div>
        </div>
      </div>

      {lightbox && lightbox.files.length > 0 && (
        <Lightbox id={item.id} files={lightbox.files} start={lightbox.i} onClose={() => setLightbox(null)} />
      )}
    </div>
  );
}

function StopCard({ label, stop }: { label: string; stop: Stop }) {
  const street = stop.depot ? undefined : stop.straat;
  const city = stop.depot ? undefined : [stop.postcode, stop.stad].filter(Boolean).join(" ");
  return (
    <div className="rounded-xl bg-zinc-50 p-4 ring-1 ring-zinc-200">
      <p className="text-xs font-medium tracking-wider text-zinc-400 uppercase">{label}</p>
      {stop.depot ? (
        <p className="mt-1.5 flex items-center gap-1.5 font-medium">
          <Icon d={ICON.home} className="size-4" /> Depot Mcars
        </p>
      ) : (
        <div className="mt-1.5 text-sm">
          {street && <p>{street}</p>}
          {city && <p className="font-medium">{city}</p>}
          {stop.adres && <p className="font-medium">{stop.adres}</p>}
          {stop.land && <p className="text-zinc-500">{stop.land}</p>}
          {!street && !city && !stop.adres && !stop.land && <p className="text-zinc-400">Niet ingevuld</p>}
        </div>
      )}
      <p className="mt-3 flex items-center gap-1.5 text-sm text-zinc-600">
        <Icon d={ICON.calendar} className="size-3.5 text-zinc-400" />
        {stop.zoSnelMogelijk ? "Zo snel mogelijk" : fmtDay(stop.datum) || <span className="text-zinc-400">Geen voorkeur</span>}
      </p>
    </div>
  );
}

function CarCard({ id, car, n, onOpenPhoto }: { id: string; car: Car; n: number; onOpenPhoto: (i: number) => void }) {
  const images = car.photos.filter(isImage);
  const otherPhotos = car.photos.filter((f) => !isImage(f));
  const title = [car.merk, car.model].filter(Boolean).join(" ") || `Auto ${n}`;
  return (
    <div className="rounded-xl ring-1 ring-zinc-200">
      <div className="flex items-start justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="text-xs text-zinc-400">Auto {n}</p>
          <p className="font-medium">
            {title}
            {car.bouwjaar && <span className="font-normal text-zinc-500"> · {car.bouwjaar}</span>}
          </p>
          {car.staat && <p className="mt-1 text-sm text-zinc-600">{car.staat}</p>}
        </div>
        {car.aantal > 1 && <span className="flex-none rounded-full bg-zinc-950 px-2.5 py-1 text-xs font-medium text-white">× {car.aantal}</span>}
      </div>
      {car.extra && <p className="mx-4 mb-4 rounded-lg bg-zinc-50 px-3 py-2 text-sm whitespace-pre-wrap text-zinc-700">{car.extra}</p>}

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-1.5 px-4 pb-4 sm:grid-cols-4">
          {images.map((f, i) => (
            <button
              key={f.file}
              type="button"
              onClick={() => onOpenPhoto(i)}
              className={`group relative overflow-hidden rounded-lg bg-zinc-100 ring-1 ring-zinc-200 ${i === 0 && images.length >= 3 ? "col-span-2 row-span-2" : ""}`}
              aria-label={`Foto ${f.name} openen`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- uploaded file from the inbox API */}
              <img src={fileUrl(id, f)} alt={f.name} loading="lazy" className="aspect-[4/3] size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
            </button>
          ))}
        </div>
      )}

      {(car.docs.length > 0 || otherPhotos.length > 0) && (
        <ul className="divide-y divide-zinc-100 border-t border-zinc-100">
          {[...otherPhotos, ...car.docs].map((f) => (
            <li key={f.file} className="flex items-center gap-3 px-4 py-2.5">
              <span className={`flex size-9 flex-none items-center justify-center rounded-lg text-[10px] font-bold ${f.type === "application/pdf" ? "bg-red-50 text-red-600" : "bg-zinc-100 text-zinc-500"}`}>
                {f.type === "application/pdf" ? "PDF" : (f.name.split(".").pop() ?? "").toUpperCase().slice(0, 4)}
              </span>
              <span className="min-w-0 flex-1">
                <a href={fileUrl(id, f)} target="_blank" rel="noreferrer" className="block truncate text-sm font-medium hover:underline">{f.name}</a>
                <span className="text-xs text-zinc-400">{car.docs.includes(f) ? "Document" : "Foto"} · {kb(f.size)}</span>
              </span>
              <a href={fileUrl(id, f)} target="_blank" rel="noreferrer" className="rounded-md px-2 py-1 text-xs font-medium text-zinc-600 ring-1 ring-zinc-200 hover:bg-zinc-50">Openen</a>
              <a href={fileUrl(id, f, true)} className="rounded-md p-1.5 text-zinc-500 ring-1 ring-zinc-200 hover:bg-zinc-50" aria-label={`${f.name} downloaden`}>
                <Icon d="M12 4v12M7 11l5 5 5-5M5 20h14" className="size-3.5" />
              </a>
            </li>
          ))}
        </ul>
      )}
      {car.photos.length === 0 && car.docs.length === 0 && (
        <p className="px-4 pb-4 text-xs text-zinc-400">Geen foto&apos;s of documenten</p>
      )}
    </div>
  );
}

function Lightbox({ id, files, start, onClose }: { id: string; files: FileRef[]; start: number; onClose: () => void }) {
  const [i, setI] = useState(start);
  const go = useCallback((d: number) => setI((x) => (x + d + files.length) % files.length), [files.length]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [go, onClose]);
  const f = files[i];
  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-zinc-950/95 text-white" role="dialog" aria-modal="true" aria-label="Foto's">
      <div className="flex items-center gap-3 px-4 py-3">
        <span className="min-w-0 truncate text-sm text-white/70">{f.name}</span>
        <span className="text-sm text-white/40 tabular-nums">{i + 1} / {files.length}</span>
        <a href={fileUrl(id, f, true)} className="ml-auto rounded-lg px-3 py-1.5 text-sm ring-1 ring-white/20 hover:bg-white/10">Download</a>
        <button type="button" onClick={onClose} aria-label="Sluiten" className="rounded-lg p-2 ring-1 ring-white/20 hover:bg-white/10">
          <Icon d="M6 6l12 12M18 6L6 18" className="size-4" />
        </button>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4">
        {/* eslint-disable-next-line @next/next/no-img-element -- uploaded file from the inbox API */}
        <img src={fileUrl(id, f)} alt={f.name} className="max-h-full max-w-full rounded-lg object-contain" />
        {files.length > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label="Vorige foto" className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-white/10 p-3 hover:bg-white/20">
              <Icon d="M15 18l-6-6 6-6" className="size-5" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Volgende foto" className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-white/10 p-3 hover:bg-white/20">
              <Icon d="M9 18l6-6-6-6" className="size-5" />
            </button>
          </>
        )}
      </div>
      {files.length > 1 && (
        <div className="flex justify-center gap-2 overflow-x-auto px-4 pb-4">
          {files.map((x, j) => (
            <button key={x.file} type="button" onClick={() => setI(j)} className={`size-14 flex-none overflow-hidden rounded-md ring-2 ${j === i ? "ring-white" : "ring-transparent opacity-50 hover:opacity-100"}`}>
              {/* eslint-disable-next-line @next/next/no-img-element -- uploaded file from the inbox API */}
              <img src={fileUrl(id, x)} alt="" className="size-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Section({ title, icon, aside, children }: { title: string; icon: string; aside?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-4 ring-1 ring-zinc-200 sm:p-5">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-500">
        <Icon d={icon} className="size-4" /> {title}
        {aside && <span className="ml-auto text-xs font-normal text-zinc-400">{aside}</span>}
      </h3>
      {children}
    </section>
  );
}

function Dl({ children }: { children: React.ReactNode }) {
  return <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">{children}</dl>;
}

function Row({ label, value, href, mono, copy }: { label: string; value?: string; href?: string; mono?: boolean; copy?: boolean }) {
  const [copied, setCopied] = useState(false);
  if (!value) return null;
  return (
    <div className="min-w-0">
      <dt className="text-xs text-zinc-400">{label}</dt>
      <dd className={`group mt-0.5 flex items-center gap-1.5 text-sm ${mono ? "font-mono" : ""}`}>
        {href ? <a href={href} className="truncate font-medium hover:underline">{value}</a> : <span className="truncate font-medium">{value}</span>}
        {copy && (
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(value);
              setCopied(true);
              setTimeout(() => setCopied(false), 1200);
            }}
            className="rounded p-0.5 text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-zinc-950 focus:opacity-100"
            aria-label={`${label} kopiëren`}
          >
            <Icon d={copied ? "M5 12l5 5L20 7" : "M9 9h11v11H9zM5 15V4h11"} className="size-3.5" />
          </button>
        )}
      </dd>
    </div>
  );
}

function KindBadge({ kind }: { kind: InboxItem["kind"] }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${kind === "offerte" ? "bg-zinc-950 text-white" : "bg-sky-100 text-sky-900"}`}>
      {kind === "offerte" ? "Offerte" : "Contact"}
    </span>
  );
}

function StatusPill({ status }: { status: Status }) {
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ${STATUS_STYLE[status]}`}>{STATUS_LABEL[status]}</span>;
}

function IconButton({ label, onClick, d }: { label: string; onClick?: () => void; d: string }) {
  return (
    <button type="button" onClick={onClick} disabled={!onClick} aria-label={label} title={label} className="flex size-8 items-center justify-center rounded-lg text-zinc-500 ring-1 ring-zinc-200 transition-colors hover:bg-zinc-50 hover:text-zinc-950 disabled:opacity-30 disabled:hover:bg-transparent">
      <Icon d={d} className="size-4" />
    </button>
  );
}

const ICON = {
  car: "M4 13l1.7-5a2 2 0 0 1 1.9-1.4h8.8a2 2 0 0 1 1.9 1.4L20 13v5h-2.5v-2h-11v2H4zM4 13h16",
  mail: "M3 5h18v14H3zM3 7l9 6 9-6",
  phone: "M5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5V20a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0",
  route: "M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM8 17h7a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7",
  chat: "M4 5h16v11H9l-5 4z",
  note: "M5 4h14v16H5zM9 9h6M9 13h6M9 17h3",
  clip: "M21 11l-8.5 8.5a5 5 0 0 1-7-7L14 4a3.5 3.5 0 0 1 5 5l-8.5 8.5a2 2 0 0 1-3-3L15 7",
  home: "M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z",
  calendar: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
  trash: "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3",
};

function Icon({ d, className = "size-4" }: { d: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}
