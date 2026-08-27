import { createFileRoute, Link } from "@tanstack/react-router";
import { VideoSlot } from "@/components/video-slot";
import { Award, Handshake, UserSearch } from "lucide-react";
import clubLounge from "@/assets/club-lounge.jpg";

export const Route = createFileRoute("/network")({
  head: () => ({
    meta: [
      { title: "人脈變現與人才精準媒合｜頂級共生未來生態圈" },
      {
        name: "description",
        content:
          "介紹符合資格的資源人才現拿 $12,000 提成獎勵，加上商業精準媒合與企業精準獵才，讓人脈成為可計算的現金流。",
      },
      { property: "og:title", content: "人脈變現與人才精準媒合｜頂級共生未來生態圈" },
      { property: "og:description", content: "三大核爆級優勢：現金獎勵、商業媒合、企業獵才。" },
    ],
  }),
  component: NetworkPage,
});

const cards = [
  {
    icon: Award,
    title: "介紹資源人才 現拿 $12,000",
    text: "每成功介紹一位符合資格的資源人才加入獵光者未來俱樂部共創未來，提成獎勵即時發放。你的人脈第一次有了明確的市場價格。",
    points: ["即時發放", "無上限推薦", "終身有效資格"],
  },
  {
    icon: Handshake,
    title: "商業精準媒合",
    text: "以需求為導向的跨界對接：獵光者未來俱樂部替你做完前置篩選，你只負責說清楚講明白。",
    points: ["需求導向配對", "跨界資源直接變現", "由引路人全程陪跑"],
  },
  {
    icon: UserSearch,
    title: "企業精準獵才",
    text: "會員企業免費媒合生態圈人才，從高階經理人到專業職能，用同頻文化篩選出真正合適的人。",
    points: ["免費使用", "同頻文化篩選", "高階職能媒合"],
  },
];

function NetworkPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-20">
      <p className="text-xs tracking-[0.3em] text-primary">MONETIZE YOUR NETWORK</p>
      <h1 className="mt-4 text-3xl sm:text-5xl">最強人脈變現與人才媒合</h1>
      <p className="mt-6 max-w-3xl leading-loose text-muted-foreground">
         在傳統商會，引薦是義務；在獵光者未來俱樂部，引薦是資產。三大核爆級優勢，讓善意與商業同時成立。
      </p>

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {cards.map((c) => (
          <article key={c.title} className="glass-card rounded-2xl p-7 shadow-lux">
            <c.icon className="size-7 text-primary" />
            <h2 className="mt-5 text-xl text-gold-soft">{c.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.text}</p>
            <ul className="mt-5 space-y-1.5 border-t border-border/70 pt-4 text-sm text-muted-foreground">
              {c.points.map((p) => (
                <li key={p}>・{p}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="mt-20 grid items-center gap-12 md:grid-cols-2">
        <img
          src={clubLounge}
          alt="精英會員於高端俱樂部中交流合作的場景"
          loading="lazy"
          width={1600}
          height={1008}
          className="rounded-2xl object-cover shadow-lux"
        />
        <div>
          <h2 className="text-2xl sm:text-3xl">你的下一筆合作，可能就在下一場聚會</h2>
          <p className="mt-6 leading-loose text-muted-foreground">
             從主題旅遊到私人聚會，從賦能課程到公益專案，每一個場景都在建立深層的信任與媒合入口。
            資源不再靠運氣流動，而是靠系統流動。
          </p>
          <Link
            to="/reserve"
            className="mt-8 inline-block rounded-full bg-gold-gradient px-8 py-3.5 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5"
          >
            預約專屬引路人一對一深度對接
          </Link>
        </div>
      </div>
    <VideoSlot slotId="network-page" title="人脈變現影片" className="mt-16 px-0" />
      </div>
  );
}
