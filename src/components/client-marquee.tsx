import Image from "next/image";
import { clients } from "@/data/clients";

/**
 * "Onze klanten": an endless row of client logos (labelled for screen readers only).
 * Placed directly under every hero. Logos are greyed out for a calm strip.
 */
export default function ClientMarquee({ className = "", variant = "plain" }: { className?: string; variant?: "plain" | "card" }) {
  const card = variant === "card";
  if (clients.length === 0) return null;
  const row = (
    <ul className="flex shrink-0 animate-marquee items-center gap-20 pr-20 [animation-duration:30s]">
      {clients.map((c) => (
        <li key={c.name} className="flex h-14 flex-none items-center">
          {c.logo ? (
            <Image src={c.logo} alt={c.name} width={220} height={56} className={`h-12 w-auto grayscale ${card ? "opacity-70 brightness-0 invert" : "opacity-60"}`} />
          ) : (
            <span className={`text-3xl font-medium tracking-tight whitespace-nowrap ${card ? "text-white/35" : "text-zinc-300"}`}>{c.name}</span>
          )}
        </li>
      ))}
    </ul>
  );
  const strip = (
    <div className="marquee mt-6 flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      {row}
      <div aria-hidden className="flex">{row}</div>
    </div>
  );
  if (card) {
    return (
      <section aria-label="Onze klanten" className={`pt-2 ${className}`}>
        <div className="rounded-[2rem] bg-zinc-950 px-5 py-6 sm:px-8 sm:py-7 [&>.marquee]:mt-0">
          {strip}
        </div>
      </section>
    );
  }
  return (
    <section aria-label="Onze klanten" className={`px-5 pt-8 pb-2 sm:px-8 sm:pt-10 [&>.marquee]:mt-0 ${className}`}>
      {strip}
    </section>
  );
}
