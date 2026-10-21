import type { Metadata } from "next";
import ContactFlow from "@/components/contact-flow";
import PageShell from "@/components/page-shell";
import VariantSwitcher from "@/components/variant-switcher";

// Contact 01 — one composed flow (see contact-flow.tsx); versions differ in hero and tone rhythm.
export const metadata: Metadata = {
  title: "Contact | Mcars",
  description:
    "Liever rechtstreeks contact? Bel, mail of app Mcars. Bekijk onze openingsuren, ons depot in Roeselare en neem vrijblijvend contact op voor uw autotransport.",
};

export default function ContactPage() {
  return (
    <PageShell>
      <ContactFlow version={1} />
      <VariantSwitcher sectionId="contact" />
    </PageShell>
  );
}
