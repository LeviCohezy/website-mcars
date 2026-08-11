import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/page-shell";
import PageHero from "@/components/page-hero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cookiebeleid | Mcars",
  description:
    "Welke cookies Mcars gebruikt: functionele, analytische en marketingcookies, waarvoor ze dienen en hoe u uw toestemming beheert of intrekt.",
};

export default function CookiebeleidPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Juridisch"
        title="Cookiebeleid"
        subtitle="Welke cookies we gebruiken en hoe u ze beheert."
        crumbs={[{ label: "Cookiebeleid" }]}
        image="/fleet/sunset-field.jpg"
      />

      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl bg-zinc-100 p-5 text-sm leading-relaxed text-zinc-600">
            <strong className="font-semibold text-zinc-950">Let op:</strong> Dit is een
            voorlopige tekst. Laat dit document juridisch nakijken vóór livegang.
          </div>

          <p className="mt-8 text-base leading-relaxed text-zinc-600">
            Dit cookiebeleid legt uit hoe {site.legalName} cookies en gelijkaardige technieken
            gebruikt op deze website. Door onze website te gebruiken en waar nodig uw toestemming
            te geven, stemt u in met het gebruik van cookies zoals hieronder beschreven.
          </p>

          <h2 className="mt-10 text-xl font-semibold text-zinc-950">1. Wat zijn cookies?</h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-600">
            Cookies zijn kleine tekstbestanden die bij een bezoek aan een website op uw toestel
            worden geplaatst. Ze zorgen ervoor dat de website goed werkt, onthouden uw voorkeuren
            en helpen ons begrijpen hoe de website wordt gebruikt. Naast cookies kunnen ook
            vergelijkbare technieken zoals pixels en local storage worden ingezet.
          </p>

          <h2 className="mt-10 text-xl font-semibold text-zinc-950">
            2. Welke soorten cookies gebruiken we?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-600">
            <strong className="font-semibold text-zinc-950">Functionele cookies</strong> zijn
            noodzakelijk om de website correct te laten werken. Ze kunnen niet worden
            uitgeschakeld. <br />
            <strong className="font-semibold text-zinc-950">Analytische cookies</strong> helpen
            ons de website te verbeteren door anoniem bij te houden hoe bezoekers onze pagina&apos;s
            gebruiken. <br />
            <strong className="font-semibold text-zinc-950">Marketingcookies</strong> worden
            gebruikt om advertenties relevanter te maken en het bereik van onze campagnes te
            meten. Deze worden enkel geplaatst na uw toestemming.
          </p>

          <h2 className="mt-10 text-xl font-semibold text-zinc-950">
            3. Toestemming en beheer
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-600">
            Bij uw eerste bezoek vragen we uw toestemming voor niet-noodzakelijke cookies. U kan
            uw voorkeuren op elk moment aanpassen of intrekken via de cookie-instellingen op de
            website. Daarnaast kan u cookies beheren of verwijderen via de instellingen van uw
            browser. Het uitschakelen van bepaalde cookies kan wel invloed hebben op de werking
            van de website.
          </p>

          <h2 className="mt-10 text-xl font-semibold text-zinc-950">
            4. Cookies van derden
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-600">
            Sommige cookies worden geplaatst door diensten van derden die we op onze website
            gebruiken, bijvoorbeeld voor het insluiten van kaarten of het meten van
            websitegebruik. Deze partijen kunnen een eigen privacy- en cookiebeleid hanteren.
          </p>

          <h2 className="mt-10 text-xl font-semibold text-zinc-950">5. Wijzigingen</h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-600">
            We kunnen dit cookiebeleid van tijd tot tijd aanpassen, bijvoorbeeld wanneer we onze
            website of de gebruikte technieken wijzigen. De meest recente versie is steeds op deze
            pagina beschikbaar.
          </p>

          <h2 className="mt-10 text-xl font-semibold text-zinc-950">6. Contact</h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-600">
            Meer weten over hoe we met uw gegevens omgaan? Lees ons{" "}
            <Link
              href="/privacybeleid"
              className="font-medium text-zinc-950 underline underline-offset-4 hover:text-zinc-600"
            >
              privacybeleid
            </Link>{" "}
            of neem{" "}
            <Link
              href="/contact"
              className="font-medium text-zinc-950 underline underline-offset-4 hover:text-zinc-600"
            >
              contact
            </Link>{" "}
            met ons op via {site.email}.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
