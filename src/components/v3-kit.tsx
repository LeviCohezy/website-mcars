import Image from "next/image";
import Link from "next/link";
import Icon from "./icon";
import { Reveal } from "./scroll";

/*
 * Design kit for every "03 — Donker & premium" page: the whole page sits on
 * black, light-weight oversized type, translucent white hairlines and big
 * figures. Same primitives as Dienst 03 so all 03-pages read as one family.
 * Wrap the page body in <V3Page> so the black canvas is consistent.
 */

export function V3Page({ children }: { children: React.ReactNode }) {
  return <div className="overflow-clip rounded-[1rem] bg-zinc-950 text-white">{children}</div>;
}

export function V3Head({ label, lead, trail, intro, center = false }: { label: string; lead: string; trail?: string; intro?: string; center?: boolean }) {
  return (
    <Reveal className={`mb-12 sm:mb-14 ${center ? "mx-auto max-w-3xl text-center" : "max-w-4xl"}`}>
      <p className={`flex items-center gap-2.5 text-xs font-medium tracking-[0.2em] text-white/50 uppercase ${center ? "justify-center" : ""}`}>
        <span aria-hidden className="h-px w-6 bg-white/40" />
        {label}
      </p>
      <h2 className="mt-6 text-4xl font-light leading-[1.04] tracking-[-0.035em] text-balance text-white sm:text-5xl lg:text-6xl">
        {lead} {trail && <span className="text-white/35">{trail}</span>}
      </h2>
      {intro && <p className={`mt-6 text-base leading-relaxed text-white/55 sm:text-lg ${center ? "mx-auto max-w-xl" : "max-w-xl"}`}>{intro}</p>}
    </Reveal>
  );
}

export function V3Block({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  return <section id={id} className={`px-5 py-20 sm:px-10 sm:py-32 lg:px-14 ${className}`}>{children}</section>;
}

export function V3Tick() {
  return (
    <span className="mt-0.5 flex size-5 flex-none items-center justify-center rounded-full border border-white/30 text-white">
      <Icon name="check" className="size-3" />
    </span>
  );
}

export function V3Star() {
  return <svg className="size-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 2l2.9 6.3 6.9.8-5.1 4.8 1.4 6.8L12 17.3 5.9 20.7l1.4-6.8L2.2 9.1l6.9-.8z" /></svg>;
}

export function V3Arrow({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/** Centred cinematic hero over a dimmed photo, fading into the black page. */
export function V3Hero({
  image,
  crumbs,
  title,
  intro,
  children,
  short = false,
}: {
  image: string;
  crumbs: { href?: string; label: string }[];
  title: string;
  intro?: string;
  children?: React.ReactNode;
  /** Shorter hero (~70svh) for utility pages like FAQ/contact. */
  short?: boolean;
}) {
  return (
    <section className={`relative flex flex-col items-center justify-end px-5 pt-36 pb-12 text-center sm:px-10 ${short ? "min-h-[70svh]" : "min-h-[calc(100svh-1rem)]"}`}>
      <Image src={image} alt="" fill priority sizes="100vw" className="object-cover opacity-60" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-zinc-950/70 via-zinc-950/30 to-zinc-950" />
      <div className="relative w-full">
        <nav aria-label="Breadcrumb" className="flex flex-wrap justify-center gap-2 text-sm text-white/50">
          {crumbs.map((c, i) => (
            <span key={c.label} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden>/</span>}
              {c.href ? <Link href={c.href} className="hover:text-white">{c.label}</Link> : <span className="text-white/80">{c.label}</span>}
            </span>
          ))}
        </nav>
        <h1 className="mx-auto mt-6 max-w-5xl text-[2.75rem] leading-[0.98] font-light tracking-[-0.045em] text-balance text-white sm:text-7xl lg:text-[6.5rem]">{title}</h1>
        {intro && <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">{intro}</p>}
        {children}
      </div>
    </section>
  );
}

/** Pill button for dark pages (≥44px tall). */
export function V3Button({ href, children, variant = "light" }: { href: string; children: React.ReactNode; variant?: "light" | "ghost" }) {
  const cls = variant === "light" ? "bg-white text-zinc-950 hover:bg-zinc-200" : "border border-white/25 text-white hover:border-white/60";
  return (
    <Link href={href} className={`inline-flex min-h-11 items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors ${cls}`}>
      {children} <V3Arrow />
    </Link>
  );
}
