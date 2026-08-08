import { createFileRoute } from "@tanstack/react-router";
import heroCafe from "@/assets/hero-cafe.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "關於我們｜貓癒所的理念與空間" },
      {
        name: "description",
        content: "貓癒所不只是咖啡廳，更是人與貓咪建立深刻連結的橋樑。認識我們的理念、空間規劃與聯絡方式。",
      },
      { property: "og:title", content: "關於我們｜貓癒所" },
      { property: "og:description", content: "舒適、乾淨的空間，讓每位客人找到片刻的寧靜與快樂。" },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <h1 className="text-4xl">關於我們</h1>
      <p className="mt-6 text-lg leading-loose">
        「貓癒所」不僅是一家咖啡廳，更是人與貓咪建立深刻連結的橋樑。
      </p>
      <p className="mt-4 leading-loose text-muted-foreground">
        我們致力於提供一個舒適、乾淨的環境，讓每一位客人都能在這裡找到片刻的寧靜與快樂。
        店內的貓咪都經過健康檢查、疫苗與驅蟲，並擁有屬於自己的休息區——當牠們躲進小房間時，
        代表今天想安靜一點，我們也請客人一起尊重牠們的心情。
      </p>

      <img
        src={heroCafe}
        alt="貓癒所的木質空間與大片採光窗"
        loading="lazy"
        width={1600}
        height={1008}
        className="mt-10 w-full rounded-3xl object-cover shadow-soft"
      />

      <div className="mt-14 grid gap-6 sm:grid-cols-3">
        {[
          { t: "貓咪優先", d: "空間動線、貓跳台與躲藏處都以貓咪的安全感為出發點設計。" },
          { t: "乾淨衛生", d: "每日多次清潔與消毒，飲食區與貓咪活動區完全分離。" },
          { t: "慢下來的時間", d: "沒有低消時間壓力，讓你安心待到心情放鬆為止。" },
        ].map((c) => (
          <div key={c.t} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="text-xl">{c.t}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.d}</p>
          </div>
        ))}
      </div>

      <section className="mt-16 rounded-3xl surface-warm p-8">
        <h2 className="text-2xl">聯絡方式</h2>
        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex gap-3">
            <dt className="w-24 text-muted-foreground">地址</dt>
            <dd>台北市 XX 區 XX 路 XX 號</dd>
          </div>
          <div className="flex gap-3">
            <dt className="w-24 text-muted-foreground">電話</dt>
            <dd>
              <a href="tel:0212345678" className="hover:underline">
                02-1234-5678
              </a>
            </dd>
          </div>
          <div className="flex gap-3">
            <dt className="w-24 text-muted-foreground">營業時間</dt>
            <dd>週二至週日 11:00 – 21:00（週一公休）</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}