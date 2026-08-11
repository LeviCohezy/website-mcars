/* Shared design primitives — keep every page speaking the same visual language. */
import Link from "next/link";
import type { ReactNode } from "react";

/** Small circular white chip with an arrow — the house CTA affordance. */
export function ArrowChip({ className = "" }: { className?: string }) {
  return (
    <span className={`flex size-8 flex-none items-center justify-center rounded-full bg-white text-zinc-950 ${className}`}>
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

/** Uppercase tracked eyebrow used above section headings. */
export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`text-sm font-medium tracking-widest text-zinc-400 uppercase ${className}`}>
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
    <h2 className={`text-3xl font-medium leading-[1.15] tracking-tight sm:text-4xl lg:text-5xl ${className}`}>
      <span className="text-zinc-950">{lead} </span>
      {trail && <span className="text-zinc-400">{trail}</span>}
    </h2>
  );
}
