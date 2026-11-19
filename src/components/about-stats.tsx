"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import SectionPill from "./section-pill";

const stats = [
  { nr: "100%", key: "insured" },
  { nr: "10K+", key: "delivered" },
  { nr: "500+", key: "clients" },
  { nr: "25+", key: "countries" },
] as const;

export default function AboutStats() {
  const t = useTranslations("AboutStats");
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const rise = (order: number) => ({
    className: `transition-all duration-700 ease-out motion-reduce:transition-none ${
      inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
    }`,
    style: { transitionDelay: inView ? `${order * 150}ms` : "0ms" },
  });

  return (
    <section
      ref={sectionRef}
      className="dot-grid rounded-3xl bg-zinc-50 px-5 py-16 sm:px-8 sm:py-24"
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_3fr]">
        <div {...rise(0)}>
          <SectionPill label={t("pill")} />
        </div>
        <div>
          <h2
            {...rise(1)}
            className={`text-3xl font-medium leading-[1.15] tracking-tight text-zinc-950 sm:text-4xl lg:text-5xl ${rise(1).className}`}
          >
            {t("title")}
          </h2>

          <dl
            {...rise(2)}
            className={`mt-14 grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4 ${rise(2).className}`}
          >
            {stats.map((stat, i) => (
              <div
                key={stat.key}
                className={i > 0 ? "lg:border-l lg:border-zinc-300 lg:pl-8" : ""}
              >
                <dt className="sr-only">{t(`stats.${stat.key}`)}</dt>
                <dd className="text-4xl font-medium tracking-tight text-zinc-950 sm:text-5xl">
                  {stat.nr}
                </dd>
                <dd className="mt-3 text-base text-zinc-500">{t(`stats.${stat.key}`)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
