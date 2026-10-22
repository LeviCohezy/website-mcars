import CinematicSequence from "@/components/cinematic-sequence";
import HeroQuoteBar from "@/components/hero-quote-bar";
import ScrollVideoSection from "@/components/scroll-video-section";
import SiteFooterLight from "@/components/site-footer-light";
import VariantSwitcher from "@/components/variant-switcher";

// Home 02 — one continuous scroll-controlled film (hero → wireframe → black
// line → service cards → Europe map), then a second scroll-controlled fleet
// film, the quote form and the footer.
export default function Home() {
  return (
    <div className="bg-white p-2">
      <CinematicSequence />

      {/* Second scroll-controlled film — the fleet */}
      <ScrollVideoSection
        videoSrc="/fleet-scrub.mp4"
        poster="/fleet-poster.jpg"
        headline="Wij beschikken over een grote vloot, maak u geen zorgen."
      />

      {/* Quote form after the fleet film (same three-step form as the heroes) */}
      <section id="offerte" className="px-3 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 rounded-[2rem] bg-zinc-950 p-6 sm:p-10 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16 lg:p-14">
          <div>
            <p className="text-sm font-medium tracking-widest text-zinc-500 uppercase">Offerte aanvragen</p>
            <h2 className="mt-4 text-3xl leading-[1.1] font-medium tracking-tight text-white sm:text-4xl">
              Waar mag uw wagen heen? <span className="text-zinc-500">Binnen 24 uur een persoonlijk antwoord.</span>
            </h2>
          </div>
          <HeroQuoteBar layout="card" />
        </div>
      </section>

      <SiteFooterLight />
      <VariantSwitcher sectionId="home" />
    </div>
  );
}
