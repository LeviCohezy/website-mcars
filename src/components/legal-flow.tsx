import Link from "next/link";
import { site } from "@/lib/site";
import { Chapter, FlowClose, FlowGrid, FlowPage } from "./flow";
import QuoteFlow from "./quote-flow";

/*
 * Legal pages (privacy, cookies, terms) on the flow kit: a short type-only
 * hero chapter, one reading chapter whose column sits on the frame's
 * quarter line, and the shared dark close. The legal text itself stays in
 * the page files, unchanged.
 */
export default function LegalFlow({
  title,
  subtitle,
  label,
  updated,
  children,
}: {
  title: string;
  subtitle: string;
  /** Chapter label for the text, e.g. "Privacy". */
  label: string;
  /** Human-readable "last updated" moment, e.g. "augustus 2026". */
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <FlowPage tone="light">
      <Chapter tone="light" space="none" className="pt-32 pb-16 sm:pt-44 sm:pb-24">
        <FlowGrid>
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-zinc-500">
            <Link href="/" className="py-2 hover:text-zinc-950">Home</Link>
            <span aria-hidden>/</span>
            <span className="text-zinc-950">{title}</span>
          </nav>
          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-end">
            <h1 className="text-[2.9rem] leading-[0.96] font-light tracking-[-0.05em] text-balance sm:text-7xl lg:text-[5.5rem]">{title}</h1>
            <div>
              <p className="max-w-md text-base leading-relaxed text-zinc-500 sm:text-lg">{subtitle}</p>
              <p className="mt-5 font-mono text-[11px] tracking-[0.2em] text-zinc-400 uppercase">
                Juridisch · Laatst bijgewerkt {updated}
              </p>
            </div>
          </div>
        </FlowGrid>
      </Chapter>

      <Chapter n="01" label={label} tone="light">
        <FlowGrid>
          <div className="max-w-prose lg:ml-[25%]">{children}</div>
        </FlowGrid>
      </Chapter>

      <FlowClose
        lead="Een vraag over uw gegevens"
        trail="of uw transport?"
        body={`Mail ons op ${site.email} of vraag meteen een prijs aan — u krijgt binnen 24 uur een persoonlijk antwoord.`}
        form={<QuoteFlow tone="dark" />}
        contact={
          <dl className="grid gap-5 text-sm sm:grid-cols-2">
            <div><dt className="text-white/40">Rechtstreeks bellen</dt><dd className="mt-1"><a href={site.phoneHref} className="inline-block py-2 text-lg text-white">{site.phone}</a></dd></div>
            <div><dt className="text-white/40">Mailen</dt><dd className="mt-1"><a href={`mailto:${site.email}`} className="inline-block py-2 text-lg text-white">{site.email}</a></dd></div>
          </dl>
        }
      />
    </FlowPage>
  );
}
