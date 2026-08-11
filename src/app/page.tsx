import AboutStats from "@/components/about-stats";
import Hero from "@/components/hero";
import PainPoints from "@/components/pain-points";
import ProcessSection from "@/components/process-section";
import QuoteContact from "@/components/quote-contact";
import ServicesPhilosophy from "@/components/services-philosophy";
import SiteFooterLight from "@/components/site-footer-light";
import WhyChooseUs from "@/components/why-choose-us";

// Homepage = the "Home 2" design (logo in the nav links here).
export default function Home() {
  return (
    <div className="bg-white p-2">
      <Hero />
      <AboutStats />
      <PainPoints />
      <ServicesPhilosophy />
      <WhyChooseUs />
      <ProcessSection />
      <QuoteContact />
      <SiteFooterLight />
    </div>
  );
}
