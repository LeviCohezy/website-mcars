import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import PageShell from "@/components/page-shell";
import PageHero from "@/components/page-hero";
import { localize } from "@/i18n/data";
import { site } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "PageAlgemeneVoorwaarden" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function AlgemeneVoorwaardenPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("PageAlgemeneVoorwaarden");
  const rich = {
    legalName: site.legalName,
    street: site.address.street,
    city: site.address.city,
    country: localize(locale, site.address.country),
    vat: site.vat,
    email: site.email,
    phone: site.phone,
    mail: (c: React.ReactNode) => (
      <a href={`mailto:${site.email}`} className="font-medium text-zinc-950 underline underline-offset-4 hover:text-zinc-600">
        {c}
      </a>
    ),
    contact: (c: React.ReactNode) => <Link href="/contact" className="font-medium text-zinc-950 underline underline-offset-4 hover:text-zinc-600">{c}</Link>,
  };

  return (
    <PageShell>
      <PageHero
        eyebrow={t("heroEyebrow")}
        title={t("heroTitle")}
        subtitle={t("heroSubtitle")}
        crumbs={[{ label: t("crumb") }]}
        image="/fleet/sunset-field.jpg"
      />

      <section className="px-5 py-20 sm:px-8 sm:py-32">
        <div className="grid gap-10 border-t border-zinc-950 pt-6 lg:grid-cols-[1fr_3fr] lg:gap-10">
          <p className="flex items-center gap-2.5 self-start text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase lg:sticky lg:top-28">
            <span aria-hidden className="size-1.5 rounded-full bg-zinc-950" />
            {t("sideLabel")}
          </p>
        <div className="max-w-3xl">
          <div className="border-l-2 border-zinc-950 py-1 pl-5 text-sm leading-relaxed text-zinc-600">
            <strong className="font-semibold text-zinc-950">{t("noticeLabel")}</strong> {t("noticeText")}
          </div>

          <p className="mt-8 text-base leading-relaxed text-zinc-600">{t.rich("intro", rich)}</p>

          <h2 className="mt-14 border-t border-zinc-200 pt-8 text-2xl font-medium tracking-tight text-zinc-950">{t("sections.s1.title")}</h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-600">{t.rich("sections.s1.body", rich)}</p>

          <h2 className="mt-14 border-t border-zinc-200 pt-8 text-2xl font-medium tracking-tight text-zinc-950">{t("sections.s2.title")}</h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-600">{t.rich("sections.s2.body", rich)}</p>

          <h2 className="mt-14 border-t border-zinc-200 pt-8 text-2xl font-medium tracking-tight text-zinc-950">{t("sections.s3.title")}</h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-600">{t.rich("sections.s3.body", rich)}</p>

          <h2 className="mt-14 border-t border-zinc-200 pt-8 text-2xl font-medium tracking-tight text-zinc-950">{t("sections.s4.title")}</h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-600">{t.rich("sections.s4.body", rich)}</p>

          <h2 className="mt-14 border-t border-zinc-200 pt-8 text-2xl font-medium tracking-tight text-zinc-950">{t("sections.s5.title")}</h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-600">{t.rich("sections.s5.body", rich)}</p>

          <h2 className="mt-14 border-t border-zinc-200 pt-8 text-2xl font-medium tracking-tight text-zinc-950">{t("sections.s6.title")}</h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-600">{t.rich("sections.s6.body", rich)}</p>

          <h2 className="mt-14 border-t border-zinc-200 pt-8 text-2xl font-medium tracking-tight text-zinc-950">{t("sections.s7.title")}</h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-600">{t.rich("sections.s7.body", rich)}</p>

          <h2 className="mt-14 border-t border-zinc-200 pt-8 text-2xl font-medium tracking-tight text-zinc-950">{t("sections.s8.title")}</h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-600">{t.rich("sections.s8.body", rich)}</p>

          <p className="mt-10 text-base leading-relaxed text-zinc-600">{t.rich("closing", rich)}</p>
        </div>
        </div>
      </section>
    </PageShell>
  );
}
