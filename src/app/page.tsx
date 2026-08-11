import CtaBanner from "@/components/cta-banner";
import EuropeNetwork from "@/components/europe-network";
import Hero from "@/components/hero";
import HowItWorks from "@/components/how-it-works";
import PainPoints from "@/components/pain-points";
import QuoteForm from "@/components/quote-form";
import RegionCards from "@/components/region-cards";
import RoutesSection from "@/components/routes-section";
import ServicesSection from "@/components/services-section";
import Solution from "@/components/solution";
import WhyMcars from "@/components/why-mcars";

export default function Home() {
  return (
    <div className="bg-white p-2">
      <Hero />
      <PainPoints />
      <Solution />
      <HowItWorks />
      <RoutesSection />
      <RegionCards />
      <WhyMcars />
      <QuoteForm />
      <CtaBanner />
      <ServicesSection />
      <EuropeNetwork />
    </div>
  );
}
