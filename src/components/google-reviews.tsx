import { useFormatter, useTranslations } from "next-intl";
import { site } from "@/lib/site";

/** Google review score: logo, rating, stars and count. Shared by the heroes. */
export default function GoogleReviews() {
  const t = useTranslations("GoogleReviews");
  const format = useFormatter();
  return (
    <a href="#" className="flex items-center gap-4 rounded-2xl px-3 py-2 transition-colors hover:bg-zinc-50">
      <GoogleLogo />
      <div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-zinc-900">{format.number(4.7, { minimumFractionDigits: 1 })}</span>
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} />
            ))}
          </div>
        </div>
        <p className="text-sm text-zinc-500">{t("count", { count: site.reviews.count })}</p>
      </div>
    </a>
  );
}

export function GoogleLogo() {
  return (
    <svg className="size-9" viewBox="0 0 48 48" aria-label="Google">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

function Star() {
  return (
    <svg className="size-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l2.94 6.32 6.91.82-5.11 4.75 1.36 6.83L12 17.25l-6.1 3.47 1.36-6.83-5.11-4.75 6.91-.82L12 2z" />
    </svg>
  );
}
