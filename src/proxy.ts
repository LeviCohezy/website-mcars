import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/** Locale routing: "/" and unprefixed paths are Dutch, /fr /en /de /es /it the other languages. */
export default createMiddleware(routing);

export const config = {
  // Everything except API routes, Next internals and files with an extension.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
