import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { getAcademyPublic } from "@/lib/academy.functions";
import { REGIONS } from "@/lib/academy";
import { CourseCard, glass } from "@/components/academy-ui";

export const Route = createFileRoute("/teachers/")({
  head: () => ({
    meta: [
      { title: "名師賦能課程・師資與區域課表｜獵光者 未來俱樂部" },
      { name: "description", content: "每月 20+ 名師賦能課程：認識師資陣容，依北中南地區查看課表並線上報名。" },
      { property: "og:title", content: "名師賦能課程・師資與區域課表｜獵光者 未來俱樂部" },
      { property: "og:description", content: "認識師資陣容，依地區查看課表並線上報名。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: () => getAcademyPublic(),
  errorComponent: () => <div className="p-10 text-center text-muted-foreground">資料暫時無法載入，請稍後再試。</div>,
  notFoundComponent: () => <div className="p-10 text-center text-muted-foreground">找不到資料。</div>,
  component: TeachersPage,
});

function TeachersPage() {
  const { teachers, courses } = Route.useLoaderData();
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = courses.filter((c) => c.course_date >= today);
  const regions = REGIONS.filter((r) => upcoming.some((c) => c.region === r));
  const [region, setRegion] = useState<string>("全部");
  const list = region === "全部" ? upcoming : upcoming.filter((c) => c.region === region);
  const byId = new Map(teachers.map((t) => [t.id, t]));
  return (
    <div className="starburst mx-auto max-w-6xl px-5 py-20">
      <p className="text-xs tracking-[0.3em] text-primary">MASTERCLASS</p>
      <h1 className="mt-4 text-3xl sm:text-5xl">每月 20+ 名師賦能課程</h1>

      {upcoming.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl">區域課表</h2>
          {regions.length > 1 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {["全部", ...regions].map((r) => (
                <button key={r} type="button" onClick={() => setRegion(r)} className={`rounded-full border px-4 py-1.5 text-sm ${region === r ? "border-primary bg-primary/15 text-primary" : "border-border/70 text-muted-foreground"}`}>{r}</button>
              ))}
            </div>
          )}
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {list.map((c) => <CourseCard key={c.id} course={c} teacher={c.teacher_id ? byId.get(c.teacher_id) : undefined} onRegistered={() => router.invalidate()} />)}
          </div>
        </section>
      )}

      {teachers.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl">師資陣容</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {teachers.map((t) => (
              <Link key={t.id} to="/teachers/$id" params={{ id: t.id }} className={`${glass} block p-5 transition hover:-translate-y-1`}>
                {t.photo_url && <img src={t.photo_url} alt={t.name} className="aspect-[4/3] w-full rounded-xl object-cover" loading="lazy" />}
                <h3 className="mt-4 text-lg">{t.name}</h3>
                {t.title && <p className="text-xs text-primary">{t.title}</p>}
                {t.category && <p className="mt-1 text-sm text-gold-soft">{t.category}</p>}
                {t.summary && <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{t.summary}</p>}
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-16 rule-gold" />
      <p className="mt-8 text-sm text-muted-foreground">
        想成為授課老師？<Link to="/teachers/join" className="text-primary underline-offset-4 hover:underline">師資報名填寫</Link>
      </p>
    </div>
  );
}
