"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export type TocItem = { id: string; text: string; level: 2 | 3 };

/** "In dit artikel" card: chapter links, the one being read highlighted. */
export default function BlogToc({ items }: { items: TocItem[] }) {
  const t = useTranslations("BlogToc");
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const headings = items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => !!el);
    // The current chapter is the last heading that has passed the upper third of the screen.
    const onScroll = () => {
      const line = window.innerHeight * 0.33;
      let current = headings[0]?.id;
      for (const h of headings) if (h.getBoundingClientRect().top <= line) current = h.id;
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

  return (
    <nav aria-label={t("title")} className="rounded-[1.5rem] border border-zinc-200 bg-white p-6 shadow-[0_24px_48px_-32px_rgb(0_0_0/0.25)]">
      <p className="text-[0.8125rem] font-semibold tracking-[0.16em] text-zinc-500 uppercase">{t("title")}</p>
      <ol className="mt-4 space-y-0.5">
        {items.map((it) => {
          const on = it.id === active;
          return (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                aria-current={on ? "location" : undefined}
                className={`flex items-start gap-2.5 rounded-lg py-2 text-sm leading-snug transition-colors ${it.level === 3 ? "pl-6" : "pl-2"} pr-2 ${
                  on ? "bg-zinc-100 font-medium text-zinc-950" : "text-zinc-500 hover:text-zinc-950"
                }`}
              >
                <span aria-hidden className={`mt-[0.45em] size-1.5 flex-none rounded-full transition-colors ${on ? "bg-zinc-950" : "bg-zinc-300"}`} />
                {it.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
