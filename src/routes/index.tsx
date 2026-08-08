import { createFileRoute, Link } from "@tanstack/react-router";
import { Coffee, HeartHandshake, Sparkles } from "lucide-react";
import heroCafe from "@/assets/hero-cafe.jpg";
import menuCoffee from "@/assets/menu-coffee.jpg";
import { cats } from "@/data/cats";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "貓癒所｜台北貓咪咖啡廳・被貓咪療癒的溫暖角落" },
      {
        name: "description",
        content:
          "貓癒所是台北市的貓咪咖啡廳，提供手沖咖啡、暖心點心與三隻貓店員的陪伴。線上預約時段，享受片刻寧靜與療癒。",
      },
      { property: "og:title", content: "貓癒所｜台北貓咪咖啡廳" },
      {
        property: "og:description",
        content: "咖啡香、木質暖光與貓咪的呼嚕聲，在台北為你留一個療癒角落。",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CafeOrCoffeeShop",
          name: "貓癒所",
          telephone: "02-1234-5678",
          address: {
            "@type": "PostalAddress",
            streetAddress: "XX 路 XX 號",
            addressLocality: "台北市",
            addressCountry: "TW",
          },
          openingHours: "Tu-Su 11:00-21:00",
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <img
          src={heroCafe}
          alt="貓癒所店內的木質座位，一隻橘貓在陽光下打盹"
          width={1600}
          height={1008}
          className="h-[78vh] min-h-[460px] w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,oklch(0.29_0.035_45/0.82),oklch(0.29_0.035_45/0.25))]" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-6xl px-5 pb-14">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-cream/90 px-4 py-1.5 text-xs tracking-widest text-wood">
              TAIPEI CAT CAFE ・ 貓癒所
            </p>
            <h1 className="max-w-3xl text-4xl leading-tight text-cream sm:text-5xl md:text-6xl">
              歡迎來到「貓癒所」，一個讓你被貓咪療癒的溫暖角落。
            </h1>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/reserve"
                className="rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground shadow-lift transition-transform hover:-translate-y-0.5"
              >
                線上預約時段
              </Link>
              <Link
                to="/cats"
                className="rounded-full border border-cream/60 px-7 py-3 text-sm text-cream transition-colors hover:bg-cream/15"
              >
                認識貓咪成員
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-10 md:grid-cols-[1.1fr_1fr] md:items-center">
          <div>
            <h2 className="text-3xl">關於我們</h2>
            <p className="mt-6 leading-loose text-muted-foreground">
              「貓癒所」不僅是一家咖啡廳，更是人與貓咪建立深刻連結的橋樑。
            </p>
            <p className="mt-3 leading-loose text-muted-foreground">
              我們致力於提供一個舒適、乾淨的環境，讓每一位客人都能在這裡找到片刻的寧靜與快樂。
            </p>
            <Link
              to="/about"
              className="mt-8 inline-block text-sm text-primary underline-offset-4 hover:underline"
            >
              更多關於貓癒所 →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-1">
            {[
              { icon: HeartHandshake, title: "有溫度的相遇", text: "每隻貓都有自己的步調，我們陪你慢慢認識。" },
              { icon: Coffee, title: "認真的咖啡", text: "淺中焙單品與手作甜點，不只是配角。" },
              { icon: Sparkles, title: "乾淨的空間", text: "每日消毒、獨立飲食區，安心又舒適。" },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <f.icon className="size-6 text-primary" />
                <h3 className="mt-3 text-lg">{f.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="surface-warm py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl">今天想見哪一位貓店員？</h2>
            <Link to="/cats" className="text-sm text-primary underline-offset-4 hover:underline">
              全部貓咪成員 →
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cats.map((cat) => (
              <article
                key={cat.name}
                className="overflow-hidden rounded-3xl bg-card shadow-soft transition-shadow hover:shadow-lift"
              >
                <img
                  src={cat.image}
                  alt={`貓店員 ${cat.name}`}
                  loading="lazy"
                  width={900}
                  height={900}
                  className="aspect-square w-full object-cover"
                />
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl">{cat.name}</h3>
                    <span className="rounded-full bg-accent/40 px-3 py-1 text-xs text-accent-foreground">
                      {cat.personality}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{cat.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-20 md:grid-cols-2">
        <img
          src={menuCoffee}
          alt="手沖咖啡與起司蛋糕擺在木質桌面上"
          loading="lazy"
          width={1200}
          height={800}
          className="rounded-3xl object-cover shadow-soft"
        />
        <div>
          <h2 className="text-3xl">咖啡與甜點，也值得專程來一趟</h2>
          <p className="mt-5 leading-loose text-muted-foreground">
            我們自家烘焙的中淺焙豆子、每日手作甜點，全部在獨立的飲食區供應，貓咪不會靠近餐點，安心又衛生。
          </p>
          <Link
            to="/menu"
            className="mt-8 inline-block rounded-full bg-primary px-7 py-3 text-sm text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            查看完整菜單
          </Link>
        </div>
      </section>
    </div>
  );
}
