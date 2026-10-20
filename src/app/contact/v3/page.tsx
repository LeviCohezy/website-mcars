import type { Metadata } from "next";
import ContactV3 from "@/components/contact-v3";
import PageShell from "@/components/page-shell";
import VariantSwitcher from "@/components/variant-switcher";

// Contact 03 — "Donker & premium". Same content as /contact, different design.
export const metadata: Metadata = {
  title: "Contact | Mcars",
  description:
    "Liever rechtstreeks contact? Bel, mail of app Mcars. Bekijk onze openingsuren, ons depot in Roeselare en neem vrijblijvend contact op voor uw autotransport.",
};

export default function ContactPageV2() {
  return (
    <PageShell>
      <ContactV3 />
      <VariantSwitcher sectionId="contact" />
    </PageShell>
  );
}
