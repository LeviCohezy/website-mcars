import { setRequestLocale } from "next-intl/server";
import { NavProvider } from "@/components/nav-pill";
import { localize } from "@/i18n/data";
import { nav } from "@/lib/site";
import AboutStats from "@/components/about-stats";
import ClientMarquee from "@/components/client-marquee";
import Hero from "@/components/hero";
import ProcessSection from "@/components/process-section";
import QuoteContact from "@/components/quote-contact";
import ServicesPhilosophy from "@/components/services-philosophy";
import SiteFooterLight from "@/components/site-footer-light";
import VariantSwitcher from "@/components/variant-switcher";
import WhyChooseUs from "@/components/why-choose-us";

// Homepage = the "Home 2" design (logo in the nav links here).
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="bg-white p-2">
      <NavProvider items={localize(locale, nav)}>
        <Hero />
      </NavProvider>
      <ClientMarquee />
      <AboutStats />
      <ServicesPhilosophy />
      <WhyChooseUs />
      {/* Slides over the pinned video section (sticky, z-20) */}
      <div className="relative z-30 -mx-2 bg-white px-2">
        <ProcessSection />
        <QuoteContact />
        <SiteFooterLight />
      </div>
      <VariantSwitcher sectionId="home" />
    </div>
  );
}
