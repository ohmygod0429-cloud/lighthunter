import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { getAcademyPublic } from "@/lib/academy.functions";
import { CourseCard, Gallery, ReviewForm, glass } from "@/components/academy-ui";

export const Route = createFileRoute("/teachers/$id")({
  loader: async ({ params }) => {
    const d = await getAcademyPublic();
    const teacher = d.teachers.find((t) => t.id === params.id);
    if (!teacher) throw notFound();
    const today = new Date().toISOString().slice(0, 10);
    return {
      teacher,
      courses: d.courses.filter((c) => c.teacher_id === teacher.id),
      upcoming: d.courses.filter((c) => c.teacher_id === teacher.id && c.course_date >= today),
      reviews: d.reviews.filter((r) => r.teacher_id === teacher.id),
    };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.teacher.name ?? "師資介紹";
    const desc = loaderData?.teacher.summary || "獵光者未來俱樂部名師賦能課程師資介紹。";
    return {
      meta: [
        { title: `${name}｜獵光者 名師賦能課程` },
        { name: "description", content: desc },
        { property: "og:title", content: `${name}｜獵光者 名師賦能課程` },
        { property: "og:description", content: desc },
        { property: "og:type", content: "profile" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  errorComponent: () => <div className="p-10 text-center text-muted-foreground">資料暫時無法載入，請稍後再試。</div>,
  notFoundComponent: () => <div className="p-10 text-center text-muted-foreground">找不到這位老師。<Link to="/teachers" className="text-primary">回師資專區</Link></div>,
  component: TeacherPage,
});

function TeacherPage() {
  const { teacher: t, courses, upcoming, reviews } = Route.useLoaderData();
  const router = useRouter();
  return (
    <div className="starburst mx-auto max-w-5xl px-5 py-20">
      <Link to="/teachers" className="text-sm text-muted-foreground hover:text-primary">← 師資專區</Link>
      <div className="mt-6 flex flex-col gap-8 sm:flex-row">
        {t.photo_url && <img src={t.photo_url} alt={t.name} className="w-full rounded-2xl object-cover sm:w-72" />}
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl sm:text-4xl">{t.name}</h1>
          {t.title && <p className="mt-2 text-primary">{t.title}</p>}
          {t.category && <p className="mt-1 text-gold-soft">{t.category}</p>}
          {t.regions.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{t.regions.map((r) => <span key={r} className="rounded-full border border-primary/40 px-3 py-0.5 text-xs text-primary">{r}</span>)}</div>}
          {t.summary && <p className="mt-5 whitespace-pre-line leading-loose text-muted-foreground">{t.summary}</p>}
        </div>
      </div>
      {t.experience && <section className={`${glass} mt-10 p-6`}><h2 className="text-xl">詳細經歷</h2><p className="mt-3 whitespace-pre-line leading-loose text-muted-foreground">{t.experience}</p></section>}
      {t.gallery_urls.length > 0 && <section className="mt-10"><h2 className="mb-4 text-xl">證書與教學／活動照片</h2><Gallery urls={t.gallery_urls} /></section>}
      {upcoming.length > 0 && <section className="mt-10"><h2 className="mb-4 text-xl">近期課程</h2><div className="grid gap-5 md:grid-cols-2">{upcoming.map((c) => <CourseCard key={c.id} course={c} onRegistered={() => router.invalidate()} />)}</div></section>}
      {reviews.length > 0 && (
        <section className="mt-10"><h2 className="mb-4 text-xl">學員評價</h2>
          <div className="space-y-3">{reviews.map((r) => <div key={r.id} className={`${glass} p-4`}><p className="text-sm text-gold-soft">{r.nickname}{r.course_id && courses.find((c) => c.id === r.course_id) && <span className="ml-2 text-xs text-muted-foreground">{courses.find((c) => c.id === r.course_id)?.name}</span>}</p><p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{r.content}</p></div>)}</div>
        </section>
      )}
      <div className="mt-10"><ReviewForm teacherId={t.id} courses={courses.map((c) => ({ id: c.id, name: c.name }))} /></div>
    </div>
  );
}
