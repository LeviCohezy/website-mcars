import Image from "next/image";
import { Link } from "@/i18n/navigation";
import Icon from "@/components/icon";
import { Reveal } from "@/components/scroll";
import { ArrowButton, Eyebrow } from "@/components/ui";
import { blogDate, type BlogPost } from "@/data/blog";
import type { Flow } from "@/data/flow";
import type { Review } from "@/data/reviews";
import type { IconKey } from "@/data/services";
import { site } from "@/lib/site";

/* Sections of the service × place pages (/diensten/[slug]/[place]). */

/** The customer's problem: statement left, three recognisable situations right. */
export function ProblemSection({ problem }: { problem: Flow["problem"] }) {
  return (
    <div className="grid gap-12 border-t border-zinc-200 pt-6 lg:grid-cols-[1fr_1fr] lg:gap-20">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <Reveal>
          <Eyebrow>Uw situatie</Eyebrow>
          <h2 className="mt-6 text-4xl leading-[1.05] font-light tracking-[-0.03em] text-balance text-zinc-950 sm:text-5xl lg:text-6xl">{problem.title}</h2>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-zinc-500">{problem.body}</p>
        </Reveal>
      </div>
      <ul className="space-y-4">
        {problem.situations.map((s, i) => (
          <Reveal as="li" key={s.title} delay={i * 90} className="rounded-[1.5rem] bg-zinc-100 p-7 sm:p-9">
            <span className="flex size-10 items-center justify-center rounded-full bg-zinc-950 text-sm font-medium text-white tabular-nums">{i + 1}</span>
            <h3 className="mt-8 text-2xl font-medium tracking-tight text-zinc-950">{s.title}</h3>
            <p className="mt-3 text-base leading-relaxed text-zinc-500">{s.body}</p>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}

const PILLARS: { key: keyof Flow["pillars"]; title: string; icon: IconKey }[] = [
  { key: "betrouwbaar", title: "Betrouwbaar", icon: "check" },
  { key: "snel", title: "Snel", icon: "clock" },
  { key: "volgbaar", title: "Te volgen", icon: "route" },
  { key: "verzekerd", title: "Verzekerd", icon: "shield" },
];

/** Our solution on a photo: what we do, then the four promises as glass cards. */
export function SolutionSection({ solution, pillars, image }: { solution: Flow["solution"]; pillars: Flow["pillars"]; image: string }) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-zinc-950 text-white">
      <Image src={image} alt="" fill sizes="100vw" className="object-cover opacity-35" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/60 to-zinc-950" />
      <div className="relative px-6 py-16 sm:px-10 sm:py-24 lg:px-14">
        <Reveal className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <Eyebrow dark>Onze oplossing</Eyebrow>
            <h2 className="mt-6 text-4xl leading-[1.05] font-light tracking-[-0.03em] text-balance sm:text-5xl lg:text-6xl">{solution.title}</h2>
          </div>
          <p className="text-lg leading-relaxed text-white/70 lg:pt-12">{solution.body}</p>
        </Reveal>
        <ul className="mt-14 grid gap-3 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <Reveal as="li" key={p.key} delay={i * 80} className="flex flex-col rounded-[1.5rem] bg-white/[0.08] p-7 ring-1 ring-white/15 backdrop-blur-xl">
              <span className="flex size-11 items-center justify-center rounded-full bg-white text-zinc-950">
                <Icon name={p.icon} className="size-5" />
              </span>
              <h3 className="mt-10 text-2xl font-medium tracking-tight">{p.title}</h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-white/65">{pillars[p.key]}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Stars({ count }: { count: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${count} op 5 sterren`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`size-4 ${i < count ? "text-amber-400" : "text-zinc-300"}`} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.3l-5.8 3.05 1.11-6.46-4.7-4.58 6.49-.94z" />
        </svg>
      ))}
    </span>
  );
}

/** Google score beside three customer quotes. */
export function ReviewsSection({ items }: { items: Review[] }) {
  return (
    <div className="grid gap-10 border-t border-zinc-200 pt-6 lg:grid-cols-[1fr_3fr]">
      <Reveal>
        <Eyebrow>Reviews</Eyebrow>
        <p className="mt-8 text-8xl leading-[0.85] font-light tracking-[-0.05em] text-zinc-950">{site.reviews.score}</p>
        <div className="mt-5 flex items-center gap-3">
          <Stars count={5} />
          <span className="text-sm text-zinc-500">{site.reviews.count} Google reviews</span>
        </div>
        <div className="mt-8">
          <ArrowButton href="/reviews">Alle reviews</ArrowButton>
        </div>
      </Reveal>
      <ul className="grid gap-4 md:grid-cols-3">
        {items.map((r, i) => (
          <Reveal as="li" key={r.quote} delay={i * 90} className="flex flex-col rounded-[1.5rem] border border-zinc-200 p-7">
            <Stars count={r.stars} />
            <blockquote className="mt-6 flex-1 text-lg leading-snug tracking-tight text-zinc-950">&ldquo;{r.quote}&rdquo;</blockquote>
            <p className="mt-8 border-t border-zinc-200 pt-4 text-sm text-zinc-500">{r.author}</p>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}

/** Three articles from the blog. */
export function BlogSection({ posts }: { posts: BlogPost[] }) {
  return (
    <ul className="grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((p, i) => (
        <Reveal as="li" key={p.slug} delay={i * 90}>
          <Link href={`/blog/${p.slug}`} className="group block">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-zinc-100">
              <Image
                src={p.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:scale-[1.04]"
              />
              <span className="absolute top-3 left-3 rounded-md bg-white px-2.5 py-1 text-xs font-medium text-zinc-950">{p.category}</span>
            </div>
            <p className="mt-5 text-sm text-zinc-500">{blogDate(p.date)} · {p.minutes} min lezen</p>
            <h3 className="mt-2 text-xl leading-snug font-medium tracking-tight text-zinc-950">{p.title}</h3>
            <p className="mt-2 text-[0.95rem] leading-relaxed text-zinc-500">{p.excerpt}</p>
          </Link>
        </Reveal>
      ))}
    </ul>
  );
}
