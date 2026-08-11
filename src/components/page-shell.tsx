import SiteFooter from "./site-footer";
import SiteNav from "./site-nav";

/** Standard interior page frame: floating nav + content canvas + footer. */
export default function PageShell({
  children,
  navTheme = "onDark",
}: {
  children: React.ReactNode;
  navTheme?: "light" | "onDark";
}) {
  return (
    <div className="bg-white p-2">
      <SiteNav theme={navTheme} />
      {children}
      <SiteFooter />
    </div>
  );
}
