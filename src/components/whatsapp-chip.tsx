import { site } from "@/lib/site";

/**
 * Small WhatsApp contact for the top-left of the header (phones/tablets, where
 * the link pill is hidden). Opens a chat with Mcars in a new tab. The number is
 * the main line — per the intake, WhatsApp runs on the same number.
 * Phones show the short local format so it never collides with the logo tab.
 */
export default function WhatsAppChip({ className = "" }: { className?: string }) {
  const local = site.phone.replace(/^\+32\s?/, "0");
  return (
    <a
      href={site.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`WhatsApp Mcars: ${site.phone}`}
      className={`flex h-10 items-center gap-1 rounded-2xl bg-zinc-900/85 px-2.5 text-[11px] font-medium sm:gap-1.5 sm:px-3 sm:text-xs text-white backdrop-blur-xl transition-colors hover:bg-zinc-800 ${className}`}
    >
      <svg className="size-4 flex-none text-[#25D366]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.48.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.5h-.01a9.4 9.4 0 0 1-4.79-1.31l-.34-.2-3.56.93.95-3.47-.22-.36a9.41 9.41 0 0 1-1.44-5.02c0-5.2 4.23-9.43 9.44-9.43 2.52 0 4.89.98 6.67 2.77a9.37 9.37 0 0 1 2.76 6.67c0 5.2-4.24 9.43-9.44 9.43zm8.03-17.46A11.27 11.27 0 0 0 12.05.72C5.8.72.71 5.8.71 12.05c0 2 .52 3.95 1.51 5.67L.62 23.28l5.7-1.5a11.3 11.3 0 0 0 5.42 1.38h.01c6.25 0 11.34-5.08 11.34-11.33 0-3.03-1.18-5.88-3.31-8.02z" />
      </svg>
      <span className="sm:hidden">{local}</span>
      <span className="hidden sm:inline">{site.phone}</span>
    </a>
  );
}
