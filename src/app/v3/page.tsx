import AboutStats from "@/components/about-stats";
import BlogGrid from "@/components/blog-grid";
import CtaBanner from "@/components/cta-banner";
import EuropeNetworkLight from "@/components/europe-network-light";
import FaqSection from "@/components/faq-section";
import Hero from "@/components/hero";
import ProblemsGrid from "@/components/problems-grid";
import QuoteMultistep from "@/components/quote-multistep";
import ServicesAccordion from "@/components/services-accordion";
import SiteFooter from "@/components/site-footer";
import WhyMcars from "@/components/why-mcars";

export default function Home() {
  return (
    <div className="bg-white p-2">
      <Hero />
      <AboutStats />
      <ProblemsGrid />
      <ServicesAccordion />
      <EuropeNetworkLight withTrucks marquee dark />
      <WhyMcars />
      <QuoteMultistep />
      <CtaBanner />
      <BlogGrid />
      <FaqSection />
      <SiteFooter />
    </div>
  );
}
