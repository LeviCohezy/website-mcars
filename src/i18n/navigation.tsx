import { createNavigation } from "next-intl/navigation";
import type { ComponentProps } from "react";
import { isDutchOnly, routing } from "./routing";

const nav = createNavigation(routing);

export const { redirect, usePathname, useRouter, getPathname } = nav;

/**
 * Locale-aware <Link>: keeps the visitor in the current language. Pages that
 * only exist in Dutch (see `isDutchOnly`) are linked in Dutch.
 */
export function Link({ href, locale, ...rest }: ComponentProps<typeof nav.Link>) {
  const dutch = typeof href === "string" && isDutchOnly(href);
  return <nav.Link href={href} locale={locale ?? (dutch ? "nl" : undefined)} {...rest} />;
}
