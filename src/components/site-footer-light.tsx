const quickLinks = [
  ["Home", "#"],
  ["Diensten", "#diensten"],
  ["Proces", "#proces"],
  ["Waarom Mcars", "#waarom"],
  ["Offerte", "#offerte"],
];

const support = [
  ["Algemene voorwaarden", "/voorwaarden"],
  ["Privacybeleid", "/privacy"],
  ["FAQ", "#faq"],
];

export default function SiteFooterLight() {
  return (
    <footer className="px-0 pt-10 pb-0">
      <div className="overflow-hidden rounded-t-3xl bg-zinc-950">
        {/* Giant brand word above the menu, in the display font, with the
            cab (no trailer) to its left at the same cap height. Fades
            top-white → bottom-dark so it dissolves into the zinc-950 base. */}
        <div className="flex items-end justify-center gap-[2vw] px-2 pt-16 sm:px-4 lg:pt-20">
          <img
            src="/truck-no-trailer.png"
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

        <div className="grid gap-12 px-8 pt-16 pb-14 sm:px-12 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr] lg:gap-8 lg:px-16 lg:pt-20">
          {/* Mission */}
          <p className="max-w-xs text-lg leading-relaxed font-medium text-white">
            Auto&apos;s eenvoudig transporteren van A naar B — betrouwbaar,
            transparant en op uw wensen afgestemd.
          </p>

          {/* Quick links */}
          <div>
            <p className="text-base font-semibold text-white">Navigatie</p>
            <ul className="mt-5 flex flex-col gap-3">
              {quickLinks.map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-sm text-zinc-400 transition-colors hover:text-white"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className="text-base font-semibold text-white">Support</p>
            <ul className="mt-5 flex flex-col gap-3">
              {support.map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-sm text-zinc-400 transition-colors hover:text-white"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-base font-semibold text-white">Contact</p>
            <ul className="mt-5 flex flex-col gap-4 text-sm text-zinc-400">
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
          </div>
        </div>

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
