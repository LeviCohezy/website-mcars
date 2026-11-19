import { asset } from "@/lib/asset";
import { footerOntdek, nav, routeLinks, site } from "@/lib/site";
import { comboIndex } from "@/data/combos";
import { corridorRoutes } from "@/data/routes";
import WhatsAppIcon from "./whatsapp-icon";
// Every page of the site, by group (absolute links: this footer closes every
// page, not just the homepage).
type FooterLink = { label: string; href: string };
const columns: { title: string; links: FooterLink[]; more?: FooterLink }[] = [
  { title: "Diensten", links: nav[0].children!, more: { label: "Alle diensten", href: "/diensten" } },
  // Country pages vs. the A → B route pages
  { title: "Locaties", links: routeLinks.filter((r) => !r.label.includes("→")) },
  { title: "Routes", links: routeLinks.filter((r) => r.label.includes("→")), more: { label: "Alle routes", href: "/routes" } },
  {
    title: "Pagina's",
    links: [
      { label: "Home", href: "/" },
      ...footerOntdek.filter((l) => l.href !== "/routes"),
      { label: "Blog", href: "/blog" },
      { label: "Offerte aanvragen", href: "/offerte" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

const legal: FooterLink[] = [
  { label: "Algemene voorwaarden", href: "/algemene-voorwaarden" },
  { label: "Privacybeleid", href: "/privacybeleid" },
  { label: "Cookiebeleid", href: "/cookiebeleid" },
];

export default function SiteFooterLight({ seam = true }: { seam?: boolean }) {
  return (
    <footer className="relative z-10 px-0 pt-10 pb-0">
      {/* White ring = the page frame: where the footer overlaps a closing CTA
          (QuoteCta pulls itself under the footer) it draws a rounded seam. */}
      <div className={`overflow-hidden rounded-t-3xl bg-zinc-950 ${seam ? "shadow-[0_0_0_8px_white]" : ""}`}>
        {/* Giant brand word above the menu, in the display font, with the
            cab (no trailer) to its left at the same cap height. Fades
            top-white → bottom-dark so it dissolves into the zinc-950 base. */}
        <div className="flex items-end justify-center gap-[2vw] px-2 pt-16 sm:px-4 lg:pt-20">
          <img
            src={asset("/truck-no-trailer.png")}
            alt=""
            aria-hidden
            className="w-auto flex-none select-none object-contain"
            style={{
              height: "18.5vw",
              transform: "translateY(-3vw)",
              WebkitMaskImage:
                "linear-gradient(to bottom, #000 25%, rgba(0,0,0,0.45) 62%, transparent 100%)",
              maskImage:
                "linear-gradient(to bottom, #000 25%, rgba(0,0,0,0.45) 62%, transparent 100%)",
            }}
          />
          <p
            aria-hidden
            className="font-display bg-clip-text text-center leading-[0.8] tracking-tight whitespace-nowrap text-transparent select-none"
            style={{
              fontSize: "27vw",
              backgroundImage:
                "linear-gradient(to bottom, #ffffff 25%, #a1a1aa 62%, #3f3f46 100%)",
            }}
          >
            MCARS
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-12 px-8 pt-16 pb-14 sm:px-12 md:grid-cols-3 lg:grid-cols-6 lg:gap-x-0 lg:px-16 lg:pt-20">
          {columns.map((col, i) => (
            <nav
              key={col.title}
              aria-label={col.title}
              className={i === 0 ? "col-span-2 lg:pr-8" : "lg:border-l lg:border-white/10 lg:px-8"}
            >
              <ColumnHead title={col.title} count={col.links.length} />
              <ul className={`mt-5 grid gap-x-8 gap-y-2.5 ${i === 0 ? "sm:grid-flow-col sm:grid-cols-2 sm:grid-rows-6" : ""}`}>
                {col.links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="text-sm text-zinc-400 transition-colors hover:text-white">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
              {col.more && (
                <a href={col.more.href} className="mt-5 inline-block text-sm font-medium text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white">
                  {col.more.label}
                </a>
              )}
            </nav>
          ))}

          {/* Info & legal */}
          <div className="lg:border-l lg:border-white/10 lg:pl-8">
            <ColumnHead title="Info & legal" />
            <ul className="mt-5 flex flex-col gap-3 text-sm text-zinc-400">
              <li className="flex items-start gap-3">
                <svg
                  className="mt-0.5 size-4 flex-none"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Moorseelsesteenweg 16B,
                <br />
                8800 Roeselare, België
              </li>
              <li className="flex items-center gap-3">
                <WhatsAppIcon className="size-4 flex-none text-[#25D366]" />
                <a
                  href={site.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                >
                  WhatsApp {site.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <svg
                  className="size-4 flex-none"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 7l9 6 9-6" />
                </svg>
                <a
                  href="mailto:info@mcars.be"
                  className="transition-colors hover:text-white"
                >
                  info@mcars.be
                </a>
              </li>
              <li className="flex items-center gap-3">
                <svg
                  className="size-4 flex-none"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
                Ma–vr: 8u – 18u
              </li>
            </ul>
            <ul className="mt-6 flex flex-col gap-2.5 border-t border-white/10 pt-5">
              {legal.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-zinc-400 transition-colors hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Full index, collapsed: every route and every service per country.
            Not in the navigation; the links are in the HTML for crawlers and
            open with the toggle. Service × route lives on /alle-paginas. */}
        <details className="group border-t border-white/10 px-8 sm:px-12 lg:px-16">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-sm text-zinc-500 transition-colors hover:text-white [&::-webkit-details-marker]:hidden">
            <span>Alle diensten per land en route</span>
            <span className="flex items-center gap-2 rounded-full px-3 py-1 ring-1 ring-white/15">
              <span className="group-open:hidden">Toon alles</span>
              <span className="hidden group-open:inline">Verberg</span>
              <svg className="size-3.5 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
          </summary>
          <div className="grid gap-x-8 gap-y-10 pb-12 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2 lg:col-span-4">
              <p className="text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase">Routes</p>
              <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5 text-[13px] sm:grid-cols-3 lg:grid-cols-6">
                {corridorRoutes.map((r) => (
                  <li key={r.slug}>
                    <a href={`/routes/${r.slug}`} className="text-zinc-500 transition-colors hover:text-white">{r.nav}</a>
                  </li>
                ))}
              </ul>
            </div>
            {comboIndex().map((svc) => (
              <div key={svc.slug}>
                <p className="text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase">{svc.nav}</p>
                <ul className="mt-3 flex flex-col gap-1.5 text-[13px]">
                  {svc.countries.map((l) => (
                    <li key={l.href}>
                      <a href={l.href} className="text-zinc-500 transition-colors hover:text-white">{l.label}</a>
                    </li>
                  ))}
                  <li>
                    <a href={`/alle-paginas#${svc.slug}`} className="text-white/80 underline decoration-white/30 underline-offset-4 hover:decoration-white">
                      + {svc.routes.length} routes
                    </a>
                  </li>
                </ul>
              </div>
            ))}
            <a href="/alle-paginas" className="text-sm font-medium text-white underline decoration-white/30 underline-offset-4 hover:decoration-white sm:col-span-2 lg:col-span-4">
              Alle pagina&apos;s bekijken
            </a>
          </div>
        </details>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 border-t border-white/10 px-8 py-6 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-12 lg:px-16">
          <p>© 2026 Mcars BV — BTW BE 0816.739.802</p>
          <div className="flex gap-3">
            {[
              {
                label: "Facebook",
                href: "https://facebook.com",
                path: "M13.5 21v-7h2.3l.4-3h-2.7V9.1c0-.9.3-1.5 1.6-1.5H16.3V5c-.3 0-1.2-.1-2.2-.1-2.2 0-3.6 1.3-3.6 3.8V11H8.2v3h2.3v7z",
              },
              {
                label: "Instagram",
                href: "https://instagram.com",
                path: "M12 8.4A3.6 3.6 0 1 0 12 15.6 3.6 3.6 0 0 0 12 8.4zm0 5.9a2.3 2.3 0 1 1 0-4.6 2.3 2.3 0 0 1 0 4.6zm4.6-6a.84.84 0 1 1-1.7 0 .84.84 0 0 1 1.7 0zM12 5.4c-1.8 0-2 0-2.7.05-.7.03-1.2.14-1.6.3-.4.17-.8.4-1.1.75-.35.34-.58.7-.75 1.1-.16.4-.27.9-.3 1.6C5.5 10 5.5 10.2 5.5 12s0 2 .05 2.7c.03.7.14 1.2.3 1.6.17.4.4.8.75 1.1.34.35.7.58 1.1.75.4.16.9.27 1.6.3.7.05.9.05 2.7.05s2 0 2.7-.05c.7-.03 1.2-.14 1.6-.3.4-.17.8-.4 1.1-.75.35-.34.58-.7.75-1.1.16-.4.27-.9.3-1.6.05-.7.05-.9.05-2.7s0-2-.05-2.7c-.03-.7-.14-1.2-.3-1.6a3.1 3.1 0 0 0-.75-1.1 3.1 3.1 0 0 0-1.1-.75c-.4-.16-.9-.27-1.6-.3C14 5.4 13.8 5.4 12 5.4z",
              },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="flex size-9 items-center justify-center rounded-full text-zinc-400 ring-1 ring-white/15 transition-colors hover:text-white"
              >
                <svg className="size-4.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d={social.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/** Column head: title over a hairline, with an optional link count. */
function ColumnHead({ title, count }: { title: string; count?: number }) {
  return (
    <p className="flex items-baseline justify-between gap-3 border-b border-white/10 pb-3 text-base font-semibold text-white">
      {title}
      {count !== undefined && <span className="text-xs font-normal tabular-nums text-zinc-500">{String(count).padStart(2, "0")}</span>}
    </p>
  );
}
