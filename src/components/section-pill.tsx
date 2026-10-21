/* Eyebrow badge: a small white pill with a sparkle and an uppercase label */
export default function SectionPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-medium tracking-widest text-zinc-950 uppercase shadow-sm">
      <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" />
      </svg>
      {label}
    </span>
  );
}
