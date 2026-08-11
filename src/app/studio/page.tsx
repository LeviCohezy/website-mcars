"use client";

/**
 * MCARS CONTENT STUDIO — a lightweight visual CMS for the two page templates.
 *
 * Why this exists: the service and route pages are file-based (src/data/*),
 * which is fast, versioned and free to host. This studio lets a
 * non-developer choose copy, images, highlights and FAQ for every page and
 * preview the result live. Edits are stored in the browser (localStorage) and
 * can be exported as JSON to hand back to the developer (or wire to a headless
 * CMS / API route later — see docs/CMS.md).
 */

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { HighlightGrid, FaqAccordion, StatRow } from "@/components/blocks";
import Icon from "@/components/icon";
import type { IconKey, Service } from "@/data/services";
import { services as defaultServices } from "@/data/services";
import type { Route } from "@/data/routes";
import { routes as defaultRoutes } from "@/data/routes";

const STORAGE_KEY = "mcars.studio.v1";

const IMAGE_LIBRARY = [
  "/why-truck.jpg", "/truck-map.png", "/truck-no-trailer.png",
  "/truck-outline.png", "/fast-shipping.png",
  "/services/01.jpg", "/services/02.jpg", "/services/03.jpg", "/services/04.jpg",
  "/services/05.jpg", "/services/06.jpg", "/services/07.jpg",
  "/about/import.png", "/about/export.png", "/about/fleet.png",
];

const ICON_KEYS: IconKey[] = ["shield", "clock", "route", "truck", "car", "wrench", "star", "users", "globe", "check", "box", "map", "spark", "phone"];

type Store = { services: Record<string, Partial<Service>>; routes: Record<string, Partial<Route>> };
const emptyStore: Store = { services: {}, routes: {} };

export default function Studio() {
  const [store, setStore] = useState<Store>(emptyStore);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState<"services" | "routes">("services");
  const [slug, setSlug] = useState(defaultServices[0].slug);
  const [saved, setSaved] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  // Load overrides once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setStore({ ...emptyStore, ...JSON.parse(raw) });
    } catch {}
    setLoaded(true);
  }, []);

  // Persist on every change.
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    setSaved(true);
    const t = setTimeout(() => setSaved(false), 1200);
    return () => clearTimeout(t);
  }, [store, loaded]);

  const collection = tab === "services" ? defaultServices : defaultRoutes;
  const overrides = tab === "services" ? store.services : store.routes;

  // Merged current item = defaults overlaid with edits.
  const base = collection.find((c) => c.slug === slug) ?? collection[0];
  const current = { ...base, ...(overrides[slug] ?? {}) } as Service & Route;

  const patch = (changes: Partial<Service & Route>) => {
    setStore((s) => {
      const key = tab;
      return {
        ...s,
        [key]: { ...s[key], [slug]: { ...(s[key] as Record<string, object>)[slug], ...changes } },
      } as Store;
    });
  };

  const resetItem = () => {
    setStore((s) => {
      const next = { ...(s[tab] as Record<string, unknown>) };
      delete next[slug];
      return { ...s, [tab]: next } as Store;
    });
  };

  const editCount = Object.keys(store.services).length + Object.keys(store.routes).length;

  const switchTab = (t: "services" | "routes") => {
    setTab(t);
    setSlug((t === "services" ? defaultServices : defaultRoutes)[0].slug);
  };

  return (
    <div className="min-h-dvh bg-zinc-50 text-zinc-900">
      {/* Top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-zinc-200 bg-white/90 px-4 py-3 backdrop-blur-xl sm:px-6">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Mcars" width={120} height={40} className="h-8 w-auto" />
          <span className="rounded-full bg-zinc-950 px-2.5 py-1 text-xs font-medium tracking-wide text-white">STUDIO</span>
          <span className="hidden text-sm text-zinc-400 sm:inline">Content-editor voor diensten & routes</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs transition-opacity ${saved ? "opacity-100 text-emerald-600" : "opacity-0"}`}>Opgeslagen ✓</span>
          <Link href={tab === "services" ? `/diensten/${slug}` : `/routes/${slug}`} target="_blank" className="hidden rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 sm:block">
            Open live pagina ↗
          </Link>
          <button onClick={() => setExportOpen(true)} className="rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800">
            Exporteren ({editCount})
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1600px] gap-0 lg:grid-cols-[260px_minmax(0,1fr)_minmax(0,1fr)]">
        {/* Sidebar: collection + items */}
        <aside className="border-r border-zinc-200 bg-white lg:h-[calc(100dvh-57px)] lg:overflow-y-auto lg:sticky lg:top-[57px]">
          <div className="flex gap-1 p-3">
            {(["services", "routes"] as const).map((t) => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium capitalize transition-colors ${tab === t ? "bg-zinc-950 text-white" : "text-zinc-500 hover:bg-zinc-100"}`}
              >
                {t === "services" ? "Diensten" : "Routes"}
              </button>
            ))}
          </div>
          <nav className="px-2 pb-4">
            {collection.map((item) => {
              const edited = !!overrides[item.slug];
              return (
                <button
                  key={item.slug}
                  onClick={() => setSlug(item.slug)}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${slug === item.slug ? "bg-zinc-100 font-medium text-zinc-950" : "text-zinc-600 hover:bg-zinc-50"}`}
                >
                  <span className="flex-1 truncate">{item.nav}</span>
                  {edited && <span className="size-1.5 flex-none rounded-full bg-amber-500" title="Bewerkt" />}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Editor */}
        <section className="border-r border-zinc-200 p-5 lg:h-[calc(100dvh-57px)] lg:overflow-y-auto sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium tracking-widest text-zinc-400 uppercase">Bewerken</p>
              <h1 className="text-lg font-semibold">{base.nav}</h1>
            </div>
            {overrides[slug] && (
              <button onClick={resetItem} className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-500 hover:bg-zinc-100">
                Herstel origineel
              </button>
            )}
          </div>

          <Field label="Titel"><TextInput value={current.title} onChange={(v) => patch({ title: v })} /></Field>
          <Field label="Subtitel"><TextInput value={current.subtitle} onChange={(v) => patch({ subtitle: v })} /></Field>
          <Field label={tab === "services" ? "Categorie (eyebrow)" : "Frequentie"}>
            {tab === "services"
              ? <TextInput value={(current as Service).category} onChange={(v) => patch({ category: v } as Partial<Service>)} />
              : <TextInput value={(current as Route).frequency} onChange={(v) => patch({ frequency: v } as Partial<Route>)} />}
          </Field>
          <Field label="Intro"><TextArea value={current.intro} onChange={(v) => patch({ intro: v })} /></Field>

          <Field label="Hero-afbeelding">
            <ImagePicker value={current.heroImage} onChange={(v) => patch({ heroImage: v })} />
          </Field>

          <Field label="Highlights">
            <HighlightEditor
              items={current.highlights ?? []}
              onChange={(items) => patch({ highlights: items })}
            />
          </Field>

          {tab === "services" && (
            <Field label="Voordelen (checklist)">
              <StringListEditor items={(current as Service).benefits ?? []} onChange={(items) => patch({ benefits: items } as Partial<Service>)} placeholder="Nieuw voordeel…" />
            </Field>
          )}
          {tab === "routes" && (
            <Field label="Steden / punten">
              <StringListEditor items={(current as Route).cities ?? []} onChange={(items) => patch({ cities: items } as Partial<Route>)} placeholder="Nieuwe stad…" />
            </Field>
          )}

          <Field label="FAQ">
            <FaqEditor items={current.faq ?? []} onChange={(items) => patch({ faq: items })} />
          </Field>

          <Field label="SEO">
            <TextInput value={current.seo?.title ?? ""} onChange={(v) => patch({ seo: { ...current.seo, title: v } })} placeholder="Meta title" />
            <div className="h-2" />
            <TextArea value={current.seo?.description ?? ""} onChange={(v) => patch({ seo: { ...current.seo, description: v } })} placeholder="Meta description" />
          </Field>
        </section>

        {/* Live preview */}
        <section className="hidden bg-white lg:block lg:h-[calc(100dvh-57px)] lg:overflow-y-auto">
          <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-zinc-100 bg-white/90 px-5 py-2.5 text-xs font-medium tracking-widest text-zinc-400 uppercase backdrop-blur">
            <span className="size-1.5 rounded-full bg-emerald-500" /> Live voorbeeld
          </div>
          <Preview item={current} kind={tab} />
        </section>
      </div>

      {exportOpen && <ExportDialog store={store} onClose={() => setExportOpen(false)} />}
    </div>
  );
}

/* ── Preview ─────────────────────────────────────────────── */
function Preview({ item, kind }: { item: Service & Route; kind: "services" | "routes" }) {
  return (
    <div className="p-2">
      {/* Simplified hero */}
      <div className="relative overflow-hidden rounded-[1.5rem] bg-zinc-900" style={{ minHeight: 300 }}>
        {item.heroImage && (
          <Image src={item.heroImage} alt="" fill className="object-cover" sizes="600px" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-zinc-950/40 to-zinc-950/50" />
        <div className="relative z-10 flex min-h-[300px] flex-col justify-end p-7">
          <span className="mb-3 w-fit rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-medium tracking-widest text-white/90 uppercase">
            {kind === "services" ? item.category : item.frequency}
          </span>
          <h2 className="text-3xl font-light leading-tight tracking-tight text-white">{item.title}</h2>
          <p className="mt-3 max-w-md text-sm text-white/75">{item.subtitle}</p>
        </div>
      </div>

      <div className="px-4 py-8">
        <p className="text-xl font-light leading-relaxed tracking-tight text-zinc-950">{item.intro}</p>
      </div>

      {item.stats && <div className="px-4 pb-8"><StatRow items={item.stats} /></div>}

      {!!item.highlights?.length && (
        <div className="px-4 pb-8">
          <HighlightGrid items={item.highlights} />
        </div>
      )}

      {kind === "routes" && !!item.cities?.length && (
        <div className="px-4 pb-8">
          <div className="rounded-2xl bg-zinc-950 p-6">
            <div className="flex flex-wrap gap-2">
              {item.cities.map((c) => (
                <span key={c} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-200">{c}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {!!item.faq?.length && (
        <div className="px-4 pb-10">
          <FaqAccordion items={item.faq} />
        </div>
      )}
    </div>
  );
}

/* ── Field primitives ────────────────────────────────────── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <label className="mb-2 block text-xs font-semibold tracking-wide text-zinc-500 uppercase">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition-colors focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10";

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <input className={inputCls} value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />;
}
function TextArea({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <textarea rows={4} className={`${inputCls} resize-y`} value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />;
}

function ImagePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-3">
        <div className="relative size-16 flex-none overflow-hidden rounded-lg bg-zinc-100 ring-1 ring-zinc-200">
          {value && <Image src={value} alt="" fill className="object-cover" sizes="64px" />}
        </div>
        <input className={inputCls} value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder="/pad/naar/afbeelding.jpg" />
      </div>
      <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
        {IMAGE_LIBRARY.map((src) => (
          <button
            key={src}
            onClick={() => onChange(src)}
            className={`relative aspect-square overflow-hidden rounded-lg ring-2 transition-all ${value === src ? "ring-zinc-950" : "ring-transparent hover:ring-zinc-300"}`}
            title={src}
          >
            <Image src={src} alt="" fill className="object-cover" sizes="60px" />
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-zinc-400">Kies uit de bibliotheek of plak een pad naar een afbeelding in <code>/public</code>.</p>
    </div>
  );
}

function HighlightEditor({ items, onChange }: { items: { title: string; body: string; icon: IconKey }[]; onChange: (i: { title: string; body: string; icon: IconKey }[]) => void }) {
  const update = (i: number, changes: Partial<{ title: string; body: string; icon: IconKey }>) =>
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...changes } : it)));
  return (
    <div className="flex flex-col gap-3">
      {items.map((h, i) => (
        <div key={i} className="rounded-xl border border-zinc-200 p-3">
          <div className="mb-2 flex items-center gap-2">
            <select value={h.icon} onChange={(e) => update(i, { icon: e.target.value as IconKey })} className="rounded-lg border border-zinc-200 px-2 py-1.5 text-xs">
              {ICON_KEYS.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
            <span className="flex size-7 items-center justify-center rounded-md bg-zinc-100 text-zinc-700"><Icon name={h.icon} className="size-4" /></span>
            <button onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="ml-auto text-xs text-red-500 hover:underline">Verwijderen</button>
          </div>
          <input className={`${inputCls} mb-2`} value={h.title} onChange={(e) => update(i, { title: e.target.value })} placeholder="Titel" />
          <textarea rows={2} className={`${inputCls} resize-y`} value={h.body} onChange={(e) => update(i, { body: e.target.value })} placeholder="Beschrijving" />
        </div>
      ))}
      <button onClick={() => onChange([...items, { title: "", body: "", icon: "shield" }])} className="rounded-xl border border-dashed border-zinc-300 py-2.5 text-sm font-medium text-zinc-500 hover:bg-zinc-50">
        + Highlight toevoegen
      </button>
    </div>
  );
}

function StringListEditor({ items, onChange, placeholder }: { items: string[]; onChange: (i: string[]) => void; placeholder?: string }) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((s, i) => (
        <div key={i} className="flex gap-2">
          <input className={inputCls} value={s} onChange={(e) => onChange(items.map((it, idx) => (idx === i ? e.target.value : it)))} />
          <button onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="flex-none rounded-lg border border-zinc-200 px-3 text-sm text-zinc-400 hover:bg-zinc-100">×</button>
        </div>
      ))}
      <button onClick={() => onChange([...items, ""])} className="w-fit rounded-lg border border-dashed border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-500 hover:bg-zinc-50">
        + Toevoegen
      </button>
      <p className="text-xs text-zinc-400">{placeholder}</p>
    </div>
  );
}

function FaqEditor({ items, onChange }: { items: { q: string; a: string }[]; onChange: (i: { q: string; a: string }[]) => void }) {
  const update = (i: number, changes: Partial<{ q: string; a: string }>) =>
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...changes } : it)));
  return (
    <div className="flex flex-col gap-3">
      {items.map((f, i) => (
        <div key={i} className="rounded-xl border border-zinc-200 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Vraag {i + 1}</span>
            <button onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="text-xs text-red-500 hover:underline">Verwijderen</button>
          </div>
          <input className={`${inputCls} mb-2`} value={f.q} onChange={(e) => update(i, { q: e.target.value })} placeholder="Vraag" />
          <textarea rows={2} className={`${inputCls} resize-y`} value={f.a} onChange={(e) => update(i, { a: e.target.value })} placeholder="Antwoord" />
        </div>
      ))}
      <button onClick={() => onChange([...items, { q: "", a: "" }])} className="rounded-xl border border-dashed border-zinc-300 py-2.5 text-sm font-medium text-zinc-500 hover:bg-zinc-50">
        + Vraag toevoegen
      </button>
    </div>
  );
}

/* ── Export ──────────────────────────────────────────────── */
function ExportDialog({ store, onClose }: { store: Store; onClose: () => void }) {
  const json = useMemo(() => JSON.stringify(store, null, 2), [store]);
  const [copied, setCopied] = useState(false);
  const download = () => {
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mcars-content-overrides.json";
    a.click();
    URL.revokeObjectURL(url);
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(json); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 p-4" onClick={onClose}>
      <div className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
          <h2 className="text-base font-semibold">Content exporteren</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100">✕</button>
        </div>
        <div className="overflow-y-auto p-5">
          <p className="mb-3 text-sm text-zinc-500">
            Uw wijzigingen zijn in de browser opgeslagen. Download of kopieer dit bestand en bezorg het aan de
            ontwikkelaar om ze definitief in de website te verwerken (zie <code>docs/CMS.md</code>).
          </p>
          <pre className="max-h-72 overflow-auto rounded-xl bg-zinc-950 p-4 text-xs leading-relaxed text-zinc-100">{json}</pre>
        </div>
        <div className="flex justify-end gap-2 border-t border-zinc-100 px-5 py-4">
          <button onClick={copy} className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium hover:bg-zinc-100">{copied ? "Gekopieerd ✓" : "Kopiëren"}</button>
          <button onClick={download} className="rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800">Download JSON</button>
        </div>
      </div>
    </div>
  );
}
