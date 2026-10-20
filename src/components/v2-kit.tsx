import Link from "next/link";
import Icon from "./icon";
import { Reveal } from "./scroll";

/*
 * Design kit for every "02 — Licht & strak" page: white Swiss grid, hairlines,
 * bordered cells, small radii, black as the only accent. Same primitives as
 * Dienst 02 so all 02-pages read as one family.
 */

export function V2Head({ index, label, lead, trail, intro, dark = false }: { index: string; label: string; lead: string; trail?: string; intro?: string; dark?: boolean }) {
  return (
    <Reveal className={`mb-12 grid gap-6 border-t pt-6 sm:mb-16 lg:grid-cols-[1fr_3fr] lg:gap-10 ${dark ? "border-white/15" : "border-zinc-950"}`}>
      <p className={`flex gap-3 text-xs font-medium tracking-[0.18em] uppercase ${dark ? "text-white/50" : "text-zinc-500"}`}>
        <span className={dark ? "text-white" : "text-zinc-950"}>{index}</span>
        {label}
      </p>
      <div>
        <h2 className={`max-w-4xl text-3xl font-medium leading-[1.08] tracking-[-0.025em] text-balance sm:text-4xl lg:text-5xl ${dark ? "text-white" : "text-zinc-950"}`}>
          {lead} {trail && <span className={dark ? "text-white/40" : "text-zinc-400"}>{trail}</span>}
        </h2>
        {intro && <p className={`mt-5 max-w-2xl text-base leading-relaxed sm:text-lg ${dark ? "text-white/60" : "text-zinc-500"}`}>{intro}</p>}
      </div>
    </Reveal>
  );
}

export function V2Block({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  return <section id={id} className={`px-5 py-20 sm:px-12 sm:py-32 lg:px-16 ${className}`}>{children}</section>;
}

export function V2Check({ className = "" }: { className?: string }) {
  return (
    <span className={`flex size-5 flex-none items-center justify-center rounded-sm bg-zinc-950 text-white ${className}`}>
      <Icon name="check" className="size-3" />
    </span>
  );
}

/** Light hero: breadcrumb, huge light-weight title, optional intro + index number on the right. */
export function V2Hero({
  crumbs,
  title,
  intro,
  count,
  children,
}: {
  crumbs: { href?: string; label: string }[];
  title: string;
  intro?: string;
  /** Big "(05)"-style counter on the right, e.g. number of items on the page. */
  count?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="px-5 pt-32 pb-12 sm:px-12 sm:pt-40 sm:pb-16 lg:px-16">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-zinc-500">
        {crumbs.map((c, i) => (
          <span key={c.label} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden>/</span>}
            {c.href ? <Link href={c.href} className="hover:text-zinc-950">{c.label}</Link> : <span className="text-zinc-950">{c.label}</span>}
          </span>
        ))}
      </nav>
      <div className="mt-8 flex items-end justify-between gap-6 border-b border-zinc-950 pb-8">
        <h1 className="max-w-5xl text-[2.75rem] leading-[0.98] font-light tracking-[-0.045em] text-balance text-zinc-950 sm:text-7xl lg:text-[6rem]">{title}</h1>
        {count && <span className="hidden flex-none text-5xl font-light tracking-[-0.04em] text-zinc-950 sm:block lg:text-[6rem] lg:leading-none">({count})</span>}
      </div>
      {(intro || children) && (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_3fr] lg:gap-10">
          <span aria-hidden />
          <div>
            {intro && <p className="max-w-2xl text-lg leading-relaxed text-zinc-500">{intro}</p>}
            {children}
          </div>
        </div>
      )}
    </section>
  );
}

export function V2Arrow({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/** Primary light-theme button (black, small radius, ≥44px tall). */
export function V2Button({ href, children, variant = "dark" }: { href: string; children: React.ReactNode; variant?: "dark" | "outline" }) {
  const cls =
    variant === "dark"
      ? "bg-zinc-950 text-white hover:bg-zinc-800"
      : "border border-zinc-950 text-zinc-950 hover:bg-zinc-950 hover:text-white";
  return (
    <Link href={href} className={`inline-flex min-h-11 items-center gap-2 rounded-lg px-5 py-3 text-sm font-medium transition-colors ${cls}`}>
      {children} <V2Arrow />
    </Link>
  );
}
