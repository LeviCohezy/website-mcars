/* Shared design primitives — keep every page speaking the same visual language. */
import Link from "next/link";
import type { ReactNode } from "react";

/** Small circular white chip with an arrow — the house CTA affordance. */
export function ArrowChip({ className = "", tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  const colors = tone === "dark" ? "bg-zinc-950 text-white" : "bg-white text-zinc-950";
  return (
    <span className={`flex size-8 flex-none items-center justify-center rounded-full ${colors} ${className}`}>
      <svg
        className="size-4 transition-transform duration-300 motion-safe:group-hover:translate-x-0.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </span>
  );
}

/** Primary pill button — black with a white arrow chip. */
export function ArrowButton({
  href,
  children,
  variant = "dark",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "dark" | "light";
  className?: string;
}) {
  const styles =
    variant === "dark"
      ? "bg-zinc-950 text-white hover:bg-zinc-800"
      : "bg-white text-zinc-950 hover:bg-zinc-100 ring-1 ring-zinc-200";
  const chip = variant === "dark" ? "bg-white text-zinc-950" : "bg-zinc-950 text-white";
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-3 rounded-full py-3 pr-3 pl-7 text-sm font-medium transition-colors ${styles} ${className}`}
    >
      {children}
      <span className={`flex size-8 flex-none items-center justify-center rounded-full ${chip}`}>
        <svg
          className="size-4 transition-transform duration-300 motion-safe:group-hover:translate-x-0.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </Link>
  );
}

/**
 * Small uppercase label used above section headings. A dot instead of a
 * pill keeps it quiet — the heading does the talking.
 */
export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`flex items-center gap-2.5 self-start text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase ${className}`}>
      <span aria-hidden className="size-1.5 flex-none rounded-full bg-zinc-950" />
      {children}
    </p>
  );
}

/**
 * Two-tone section heading. `lead` renders in near-black, `trail` in zinc-400 —
 * the signature MCARS headline treatment.
 */
export function SplitHeading({
  lead,
  trail,
  className = "",
}: {
  lead: string;
  trail?: string;
  className?: string;
}) {
  return (
    <h2 className={`text-3xl font-medium leading-[1.08] tracking-[-0.025em] text-balance sm:text-4xl lg:text-[3.25rem] ${className}`}>
      <span className="text-zinc-950">{lead} </span>
      {trail && <span className="text-zinc-400">{trail}</span>}
    </h2>
  );
}

/**
 * Editorial section opener: label in a narrow left column, heading (and an
 * optional intro / action) in the wide right column. Mirrors the homepage
 * "Over ons" layout so interior pages share its rhythm.
 */
export function SectionHeader({
  label,
  index,
  lead,
  trail,
  intro,
  action,
  className = "",
}: {
  label: string;
  index?: string;
  lead: string;
  trail?: string;
  intro?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`grid gap-6 border-t border-zinc-200 pt-6 lg:grid-cols-[1fr_3fr] lg:gap-10 ${className}`}>
      <div className="flex items-center justify-between gap-4 lg:items-start lg:justify-start">
        <Eyebrow>{label}</Eyebrow>
        {index && <span className="text-xs font-medium tabular-nums text-zinc-400 lg:hidden">{index}</span>}
      </div>
      <div className="lg:pt-0">
        <div className="flex items-start justify-between gap-8">
          <SplitHeading lead={lead} trail={trail} className="max-w-4xl" />
          {index && (
            <span className="hidden pt-2 text-xs font-medium tabular-nums text-zinc-400 lg:block">{index}</span>
          )}
        </div>
        {intro && <div className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-500">{intro}</div>}
        {action && <div className="mt-8">{action}</div>}
      </div>
    </div>
  );
}
