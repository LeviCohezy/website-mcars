import CinematicSequence from "@/components/cinematic-sequence";
import EuropeNetwork from "@/components/europe-network";
import ScrollVideoSection from "@/components/scroll-video-section";
import SiteFooterLight from "@/components/site-footer-light";
import VariantSwitcher from "@/components/variant-switcher";

// Home 02 — one continuous scroll-controlled film (hero → wireframe → black
// line → service cards → Europe map), then the full-screen location picker,
// then a second scroll-controlled fleet film, releasing into the footer.
export default function Home() {
  return (
    <div className="bg-white p-2">
      <CinematicSequence />

      {/* Dark Europe-map location section */}
      <EuropeNetwork
        eyebrow="Locaties"
        title="Mcars transporteert auto's in heel Europa."
      />

      {/* Second scroll-controlled film — the fleet */}
      <ScrollVideoSection
        videoSrc="/fleet-scrub.mp4"
        poster="/fleet-poster.jpg"
        headline="Wij beschikken over een grote vloot, maak u geen zorgen."
      />

      <SiteFooterLight />
      <VariantSwitcher sectionId="home" />
    </div>
  );
}
