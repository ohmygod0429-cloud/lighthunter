import { createFileRoute } from "@tanstack/react-router";
import { cats } from "@/data/cats";

export const Route = createFileRoute("/cats")({
  head: () => ({
    meta: [
      { title: "貓咪成員｜貓癒所的貓店員介紹" },
      {
        name: "description",
        content: "認識貓癒所的貓店員：撒嬌大王拿鐵、探險家布丁、沉穩的奧利歐。照片、個性與相處小提醒都在這裡。",
      },
      { property: "og:title", content: "貓咪成員｜貓癒所" },
      { property: "og:description", content: "拿鐵、布丁、奧利歐——貓癒所三位貓店員的個性介紹。" },
      { property: "og:url", content: "/cats" },
    ],
    links: [{ rel: "canonical", href: "/cats" }],
  }),
  component: CatsPage,
});

function CatsPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <h1 className="text-4xl">貓咪成員</h1>
      <p className="mt-4 max-w-2xl leading-loose text-muted-foreground">
        每隻貓都有自己的節奏。先讀讀牠們的個性，見面時會更容易變成朋友。
      </p>

      <div className="mt-14 space-y-14">
        {cats.map((cat, i) => (
          <article
            key={cat.name}
            className={`grid items-center gap-8 md:grid-cols-2 ${i % 2 ? "md:[&>img]:order-2" : ""}`}
          >
            <img
              src={cat.image}
              alt={`貓店員 ${cat.name}`}
              loading="lazy"
              width={900}
              height={900}
              className="aspect-square w-full rounded-3xl object-cover shadow-soft"
            />
            <div>
              <span className="rounded-full bg-accent/40 px-3 py-1 text-xs text-accent-foreground">
                {cat.personality}
              </span>
              <h2 className="mt-4 text-3xl">{cat.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {cat.breed} ・ {cat.age}
              </p>
              <p className="mt-5 leading-loose text-muted-foreground">{cat.description}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {cat.likes.map((l) => (
                  <li key={l} className="rounded-full border border-border bg-card px-3 py-1 text-xs">
                    喜歡 {l}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}