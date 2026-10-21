import Link from "next/link";
import { nav, site } from "@/lib/site";
import { asset } from "@/lib/asset";

const services = nav[0].children!.slice(0, 7);
const routes = nav[1].children!.slice(0, 6);
const ontdek = nav[3].children!;

export default function SiteFooter() {
  return (
    <footer className="relative z-10 px-0 pt-14 pb-0">
      {/* White ring = the page frame; where the footer overlaps the closing CTA
          it draws a rounded seam, so the CTA sits just behind the footer. */}
      <div className="overflow-hidden rounded-t-[2rem] bg-zinc-950 shadow-[0_0_0_8px_white]">
        <div className="grid gap-12 px-6 py-16 sm:px-12 sm:py-14 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1.2fr] lg:gap-8 lg:px-16">
          {/* Brand */}
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element -- inverted logo, intrinsic width */}
            <img src={asset("/logo.png")} alt="Mcars" className="h-12 w-auto invert mix-blend-screen" />
            <p className="mt-6 max-w-xs text-base leading-[1.6] text-zinc-400 sm:mt-5 sm:text-sm sm:leading-relaxed">
              Autotransport van A naar B, op uw wensen afgestemd. Betrouwbaar,
              transparant en persoonlijk — al sinds {site.founded}.
            </p>
            <div className="mt-6 flex gap-3 max-md:hidden">
              {[
                { label: "Facebook", href: site.social.facebook, path: "M13.5 21v-7h2.3l.4-3h-2.7V9.1c0-.9.3-1.5 1.6-1.5H16.3V5c-.3 0-1.2-.1-2.2-.1-2.2 0-3.6 1.3-3.6 3.8V11H8.2v3h2.3v7z" },
                { label: "Instagram", href: site.social.instagram, path: "M12 8.4A3.6 3.6 0 1 0 12 15.6 3.6 3.6 0 0 0 12 8.4zm0 5.9a2.3 2.3 0 1 1 0-4.6 2.3 2.3 0 0 1 0 4.6zm4.6-6a.84.84 0 1 1-1.7 0 .84.84 0 0 1 1.7 0zM12 5.4c-1.8 0-2 0-2.7.05-.7.03-1.2.14-1.6.3-.4.17-.8.4-1.1.75-.35.34-.58.7-.75 1.1-.16.4-.27.9-.3 1.6C5.5 10 5.5 10.2 5.5 12s0 2 .05 2.7c.03.7.14 1.2.3 1.6.17.4.4.8.75 1.1.34.35.7.58 1.1.75.4.16.9.27 1.6.3.7.05.9.05 2.7.05s2 0 2.7-.05c.7-.03 1.2-.14 1.6-.3.4-.17.8-.4 1.1-.75.35-.34.58-.7.75-1.1.16-.4.27-.9.3-1.6.05-.7.05-.9.05-2.7s0-2-.05-2.7c-.03-.7-.14-1.2-.3-1.6a3.1 3.1 0 0 0-.75-1.1 3.1 3.1 0 0 0-1.1-.75c-.4-.16-.9-.27-1.6-.3C14 5.4 13.8 5.4 12 5.4z" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex size-11 items-center justify-center rounded-full bg-white/5 text-zinc-400 ring-1 ring-white/10 transition-colors hover:text-white"
                >
                  <svg className="size-5" viewBox="0 0 24 24" fill="currentColor"><path d={social.path} /></svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns are desktop-only: on phones the menu drawer carries navigation */}
          <div className="contents max-md:hidden">
            <FooterCol title="Diensten" links={services} />
            <FooterCol title="Routes" links={routes} />
            <FooterCol title="Ontdek" links={ontdek} />
          </div>

          {/* Contact */}
          <div>
            <p className="text-sm font-medium tracking-widest text-zinc-500 uppercase max-md:hidden">Contact</p>
            <ul className="flex flex-col gap-2 text-lg text-zinc-300 sm:mt-5 sm:gap-3 sm:text-sm sm:text-zinc-400">
              <li><a href={site.phoneHref} className="inline-block py-3 transition-colors hover:text-white sm:py-0">{site.phone}</a></li>
              <li><a href={`mailto:${site.email}`} className="inline-block py-3 transition-colors hover:text-white sm:py-0">{site.email}</a></li>
              <li className="mt-4 text-base leading-[1.6] text-zinc-500 sm:mt-0 sm:text-sm sm:text-zinc-400">{site.address.street}<br />{site.address.city}, {site.address.country}</li>
              <li className="max-md:hidden">{site.hours}</li>
              <li className="text-zinc-500 max-md:hidden">{site.hoursNote}</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-3 border-t border-white/10 px-6 pt-8 pb-28 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-12 sm:py-6 sm:text-xs md:pb-6 lg:px-16">
          <p>© 2026 {site.legalName} — BTW {site.vat}</p>
          <div className="flex flex-wrap gap-x-6">
            <Link href="/privacybeleid" className="py-3 transition-colors hover:text-white sm:py-0">Privacybeleid</Link>
            <Link href="/cookiebeleid" className="py-3 transition-colors hover:text-white sm:py-0">Cookiebeleid</Link>
            <Link href="/algemene-voorwaarden" className="py-3 transition-colors hover:text-white sm:py-0">Algemene voorwaarden</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="text-sm font-medium tracking-widest text-zinc-500 uppercase">{title}</p>
      <ul className="mt-3 flex flex-col sm:mt-5 sm:gap-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="block py-3 text-sm text-zinc-400 transition-colors hover:text-white sm:inline sm:py-0">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
