import SiteFooterLight from "./site-footer-light";
import SiteNav from "./site-nav";

/** Standard interior page frame: floating nav + content canvas + the homepage footer. */
export default function PageShell({
  children,
  navTheme = "onDark",
  dark = false,
}: {
  children: React.ReactNode;
  navTheme?: "light" | "onDark";
  /** Full-black page canvas instead of the white frame. */
  dark?: boolean;
}) {
  return (
    <div className={`${dark ? "bg-zinc-950" : "bg-white"} p-2`}>
      <SiteNav theme={navTheme} inverted={dark} />
      {children}
      <SiteFooterLight seam={!dark} />
    </div>
  );
}
