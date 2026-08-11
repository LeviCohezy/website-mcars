import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/page-shell";
import PageHero from "@/components/page-hero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacybeleid | Mcars",
  description:
    "Hoe Mcars BV omgaat met uw persoonsgegevens: welke gegevens we verwerken, waarom, hoe lang we ze bewaren en welke rechten u heeft onder de GDPR.",
};

export default function PrivacybeleidPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Juridisch"
        title="Privacybeleid"
        subtitle="Hoe we omgaan met uw persoonsgegevens en uw privacy beschermen."
        crumbs={[{ label: "Privacybeleid" }]}
        image="/fleet/sunset-field.jpg"
      />

      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl bg-zinc-100 p-5 text-sm leading-relaxed text-zinc-600">
            <strong className="font-semibold text-zinc-950">Let op:</strong> Dit is een
            voorlopige tekst. Laat dit document juridisch nakijken vóór livegang.
          </div>

          <p className="mt-8 text-base leading-relaxed text-zinc-600">
            {site.legalName} hecht veel belang aan de bescherming van uw persoonsgegevens en
            respecteert uw privacy. In dit privacybeleid leggen we uit welke gegevens we
            verzamelen, waarom we dat doen en hoe u uw rechten kan uitoefenen. Dit beleid is
            opgesteld in overeenstemming met de Algemene Verordening Gegevensbescherming (AVG /
            GDPR).
          </p>

          <h2 className="mt-10 text-xl font-semibold text-zinc-950">
            1. Verwerkingsverantwoordelijke
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-600">
            {site.legalName}, met maatschappelijke zetel te {site.address.street},{" "}
            {site.address.city}, {site.address.country} (BTW {site.vat}), is de
            verwerkingsverantwoordelijke voor de persoonsgegevens die via deze website en in het
            kader van onze dienstverlening worden verwerkt. Voor vragen kan u ons bereiken via{" "}
            <a
              href={`mailto:${site.email}`}
              className="font-medium text-zinc-950 underline underline-offset-4 hover:text-zinc-600"
            >
              {site.email}
            </a>{" "}
            of {site.phone}.
          </p>

          <h2 className="mt-10 text-xl font-semibold text-zinc-950">
            2. Welke gegevens verzamelen we?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-600">
            Afhankelijk van uw contact met ons kunnen we de volgende gegevens verwerken:
            identificatie- en contactgegevens (naam, adres, e-mailadres, telefoonnummer),
            gegevens over uw transportaanvraag (ophaal- en leveradres, voertuiggegevens),
            correspondentie die u met ons voert en, in voorkomend geval, facturatie- en
            bedrijfsgegevens (ondernemingsnummer, BTW-nummer).
          </p>

          <h2 className="mt-10 text-xl font-semibold text-zinc-950">
            3. Doeleinden van de verwerking
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-600">
            We verwerken uw gegevens om uw offerteaanvraag te behandelen en te beantwoorden, om
            het transport te plannen en uit te voeren, om met u te communiceren, om onze
            facturatie en boekhouding te verzorgen en om te voldoen aan onze wettelijke
            verplichtingen. De rechtsgrond hiervoor is de uitvoering van een overeenkomst, ons
            gerechtvaardigd belang, het naleven van een wettelijke verplichting of, waar van
            toepassing, uw toestemming.
          </p>

          <h2 className="mt-10 text-xl font-semibold text-zinc-950">4. Bewaartermijn</h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-600">
            We bewaren uw persoonsgegevens niet langer dan noodzakelijk voor de doeleinden
            waarvoor ze werden verzameld. Facturatie- en boekhoudkundige gegevens worden bewaard
            gedurende de wettelijk voorgeschreven termijn. Aanvragen die niet tot een
            overeenkomst leiden, worden na een redelijke termijn verwijderd.
          </p>

          <h2 className="mt-10 text-xl font-semibold text-zinc-950">
            5. Delen met derden
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-600">
            We verkopen uw gegevens nooit. We delen ze enkel met partijen die noodzakelijk zijn
            voor onze dienstverlening (zoals onze IT-, boekhoud- of transportpartners) en enkel
            in de mate dat dit nodig is. Deze partijen zijn gebonden aan vertrouwelijkheid en
            verwerken uw gegevens uitsluitend in onze opdracht.
          </p>

          <h2 className="mt-10 text-xl font-semibold text-zinc-950">
            6. Uw rechten (GDPR)
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-600">
            U heeft het recht op inzage, verbetering, verwijdering en beperking van uw
            persoonsgegevens, het recht op overdraagbaarheid en het recht om bezwaar te maken
            tegen de verwerking. Waar de verwerking op toestemming berust, kan u die op elk moment
            intrekken. Om een recht uit te oefenen contacteert u ons via{" "}
            <a
              href={`mailto:${site.email}`}
              className="font-medium text-zinc-950 underline underline-offset-4 hover:text-zinc-600"
            >
              {site.email}
            </a>
            . U heeft daarnaast het recht om een klacht in te dienen bij de Gegevensbeschermings­autoriteit
            (www.gegevensbeschermingsautoriteit.be).
          </p>

          <h2 className="mt-10 text-xl font-semibold text-zinc-950">7. Cookies</h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-600">
            Onze website maakt gebruik van cookies. Meer informatie over welke cookies we
            gebruiken en hoe u ze kan beheren, vindt u in ons{" "}
            <Link
              href="/cookiebeleid"
              className="font-medium text-zinc-950 underline underline-offset-4 hover:text-zinc-600"
            >
              cookiebeleid
            </Link>
            .
          </p>

          <h2 className="mt-10 text-xl font-semibold text-zinc-950">8. Contact</h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-600">
            Heeft u vragen over dit privacybeleid of over de verwerking van uw gegevens? Neem
            gerust{" "}
            <Link
              href="/contact"
              className="font-medium text-zinc-950 underline underline-offset-4 hover:text-zinc-600"
            >
              contact
            </Link>{" "}
            met ons op via {site.email} of {site.phone}.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
