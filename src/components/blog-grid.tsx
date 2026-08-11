import SectionPill from "./section-pill";

const posts = [
  {
    img: "01",
    tag: "Documenten",
    date: "12 juli 2026",
    title: "Wat is een CMR en waarom is het zo belangrijk?",
    excerpt:
      "De vrachtbrief bewijst dat uw wagen is opgehaald en documenteert de staat bij vertrek. Zo werkt het.",
    href: "/blog/wat-is-een-cmr",
  },
  {
    img: "06",
    tag: "Routes",
    date: "28 juni 2026",
    title: "Uw auto laten transporteren naar Spanje: zo werkt het",
    excerpt:
      "Van offerte tot levering aan uw tweede verblijf: dit mag u verwachten van een transport richting Spanje.",
    href: "/blog/auto-transporteren-naar-spanje",
  },
  {
    img: "04",
    tag: "Niet-rijdend",
    date: "14 juni 2026",
    title: "Niet-rijdende wagen verplaatsen? Dit zijn uw opties",
    excerpt:
      "Met een winch trekken we ook wagens zonder draaiende motor veilig op de oplegger. Dit moet u weten.",
    href: "/blog/niet-rijdende-wagen-verplaatsen",
  },
];

export default function BlogGrid() {
  return (
    <section id="blog" className="px-5 py-16 sm:px-8 sm:py-24">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-16">
        <div>
          <SectionPill label="Blog" />
          <h2 className="mt-6 text-3xl font-medium leading-[1.15] tracking-tight sm:text-4xl lg:text-5xl">
            <span className="text-zinc-950">Kennis uit de cabine, </span>
            <span className="text-zinc-400">op papier.</span>
          </h2>
        </div>
        <p className="text-base leading-relaxed text-zinc-500">
          Alles wat u wil weten over autotransport, verzameld door mensen die
          er elke dag mee op de baan zitten.
        </p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {posts.map((post) => (
          <a
            key={post.href}
            href={post.href}
            className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-shadow hover:shadow-lg focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:outline-none"
          >
            <div className="overflow-hidden">
              <img
                src={`/services/${post.img}.jpg`}
                alt=""
                loading="lazy"
                className="aspect-[3/2] w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <div className="flex items-center gap-3 text-xs font-medium">
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-zinc-600">
                  {post.tag}
                </span>
                <span className="text-zinc-400">{post.date}</span>
              </div>
              <h3 className="mt-4 text-lg leading-snug font-semibold text-zinc-950">
                {post.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-500">
                {post.excerpt}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-zinc-950">
                Lees verder
                <svg
                  className="size-4 transition-transform duration-300 motion-safe:group-hover:translate-x-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
