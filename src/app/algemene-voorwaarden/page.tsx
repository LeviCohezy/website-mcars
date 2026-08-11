import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/page-shell";
import PageHero from "@/components/page-hero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Algemene voorwaarden | Mcars",
  description:
    "De algemene voorwaarden van Mcars BV: toepassing, offertes, transport en CMR, aansprakelijkheid en verzekering, betaling, annulering, klachten en toepasselijk recht.",
};

export default function AlgemeneVoorwaardenPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Juridisch"
        title="Algemene voorwaarden"
        subtitle="De voorwaarden die van toepassing zijn op onze offertes en transporten."
        crumbs={[{ label: "Algemene voorwaarden" }]}
        image="/services/07.jpg"
      />

      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl bg-zinc-100 p-5 text-sm leading-relaxed text-zinc-600">
            <strong className="font-semibold text-zinc-950">Let op:</strong> Dit is een
            voorlopige tekst. Laat dit document juridisch nakijken vóór livegang.
          </div>

          <p className="mt-8 text-base leading-relaxed text-zinc-600">
            Deze algemene voorwaarden zijn van toepassing op alle offertes, overeenkomsten en
            transporten van {site.legalName}, met maatschappelijke zetel te{" "}
            {site.address.street}, {site.address.city}, {site.address.country} (BTW {site.vat}).
          </p>

          <h2 className="mt-10 text-xl font-semibold text-zinc-950">1. Toepassing</h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-600">
            Deze voorwaarden zijn van toepassing op elke offerte en overeenkomst tussen{" "}
            {site.legalName} en de klant, zowel particulier als onderneming. Afwijkingen gelden
            enkel indien ze schriftelijk werden overeengekomen. Door een aanvraag te plaatsen of
            een offerte te aanvaarden, aanvaardt de klant deze voorwaarden.
          </p>

          <h2 className="mt-10 text-xl font-semibold text-zinc-950">
            2. Offertes en prijzen
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-600">
            Onze prijzen worden steeds op aanvraag en op maat bepaald. Elke offerte wordt
            persoonlijk opgesteld op basis van onder meer het ophaal- en leveradres, de afstand,
            het type voertuig, de gekozen transportvorm en de gewenste termijn. Een offerte is
            geldig gedurende de erin vermelde termijn en bindt {site.legalName} pas na
            schriftelijke bevestiging van de opdracht.
          </p>

          <h2 className="mt-10 text-xl font-semibold text-zinc-950">
            3. Transport en CMR
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-600">
            Het transport wordt uitgevoerd overeenkomstig de van toepassing zijnde nationale en
            internationale transportregelgeving, waaronder het CMR-verdrag voor grensoverschrijdend
            wegvervoer. Bij ophaling wordt een CMR-vrachtbrief opgemaakt die de ophaling bevestigt
            en de staat van het voertuig documenteert. De klant zorgt ervoor dat het voertuig op
            het afgesproken tijdstip toegankelijk en beschikbaar is en dat de doorgegeven gegevens
            correct zijn.
          </p>

          <h2 className="mt-10 text-xl font-semibold text-zinc-950">
            4. Aansprakelijkheid en verzekering
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-600">
            {site.legalName} voert elke opdracht met de nodige zorg en professionaliteit uit. Onze
            aansprakelijkheid voor schade tijdens het transport is verzekerd en beperkt
            overeenkomstig de toepasselijke transportwetgeving (waaronder het CMR-verdrag). We zijn
            niet aansprakelijk voor schade die het gevolg is van door de klant verkeerd of
            onvolledig doorgegeven informatie, van reeds bestaande gebreken, of van overmacht.
          </p>

          <h2 className="mt-10 text-xl font-semibold text-zinc-950">5. Betaling</h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-600">
            Voor particuliere klanten gebeurt de betaling vóór de ophaling van het voertuig, tenzij
            uitdrukkelijk anders overeengekomen. Voor ondernemingen gebeurt de facturatie na de
            uitvoering van het transport, betaalbaar binnen de op de factuur vermelde termijn. Bij
            laattijdige betaling kunnen van rechtswege verwijlintresten en een forfaitaire
            schadevergoeding worden aangerekend conform de geldende wetgeving.
          </p>

          <h2 className="mt-10 text-xl font-semibold text-zinc-950">6. Annulering</h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-600">
            Annuleert de klant een bevestigde opdracht, dan kunnen reeds gemaakte kosten en, bij
            annulering kort vóór de geplande ophaling, een redelijke vergoeding worden aangerekend.
            {" "}{site.legalName} kan een opdracht annuleren in geval van overmacht of wanneer de
            klant zijn verplichtingen niet nakomt.
          </p>

          <h2 className="mt-10 text-xl font-semibold text-zinc-950">7. Klachten</h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-600">
            Eventuele zichtbare schade dient bij levering te worden vastgesteld en genoteerd op de
            CMR-vrachtbrief. Klachten over de uitvoering van het transport of over een factuur
            dienen zo snel mogelijk en binnen een redelijke termijn schriftelijk te worden gemeld
            via{" "}
            <a
              href={`mailto:${site.email}`}
              className="font-medium text-zinc-950 underline underline-offset-4 hover:text-zinc-600"
            >
              {site.email}
            </a>
            .
          </p>

          <h2 className="mt-10 text-xl font-semibold text-zinc-950">
            8. Toepasselijk recht en bevoegde rechtbank
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-600">
            Op alle overeenkomsten met {site.legalName} is het Belgisch recht van toepassing. Bij
            geschillen zijn uitsluitend de rechtbanken bevoegd van het gerechtelijk arrondissement
            waar de maatschappelijke zetel van {site.legalName} gevestigd is, onverminderd
            dwingende wettelijke bepalingen.
          </p>

          <p className="mt-10 text-base leading-relaxed text-zinc-600">
            Vragen bij deze voorwaarden? Neem gerust{" "}
            <Link
              href="/contact"
              className="font-medium text-zinc-950 underline underline-offset-4 hover:text-zinc-600"
            >
              contact
            </Link>{" "}
            met ons op.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
