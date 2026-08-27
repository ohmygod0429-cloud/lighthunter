import { createFileRoute, Link } from "@tanstack/react-router";
import { VideoSlot } from "@/components/video-slot";
import { useState } from "react";
import { dimensions } from "@/data/ecosystem";

export const Route = createFileRoute("/dimensions")({
  head: () => ({
    meta: [
      { title: "八大頂級維度藍圖｜獵光者 未來俱樂部" },
      {
        name: "description",
        content:
          "商業媒合、個人成長、身心靈提升、全類別賦能課程、極致吃喝玩樂、高質量聯誼、慈善大愛與高端訂製旅遊，八大會員專屬權益板塊。",
      },
      { property: "og:title", content: "八大頂級維度藍圖｜獵光者 未來俱樂部" },
      { property: "og:description", content: "以互動式卡片展開俱樂部會員的八大專屬權益藍圖。" },
    ],
  }),
  component: DimensionsPage,
});

function DimensionsPage() {
  const [active, setActive] = useState<string>(dimensions[0]?.no ?? "01");

  return (
    <div className="starburst mx-auto max-w-7xl px-5 py-20">
      <p className="text-xs tracking-[0.3em] text-primary">EIGHT DIMENSIONS</p>
      <h1 className="mt-4 text-3xl sm:text-5xl">八大頂級維度藍圖</h1>
      <p className="mt-6 max-w-3xl leading-loose text-muted-foreground">
        為俱樂部會員專屬打造，鏈結全球跨界菁英人脈，解鎖高端商業合作、家族財富傳承，以及全人成長的頂級資源。點選任一維度，展開您在俱樂部的專屬權益。
      </p>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {dimensions.map((d) => {
          const open = active === d.no;
          return (
            <button
              key={d.no}
              type="button"
              onClick={() => setActive(d.no)}
              aria-expanded={open}
              className={`glass-card rounded-2xl p-6 text-left transition-all hover:-translate-y-1 ${
                open ? "shadow-glow" : "shadow-lux"
              }`}
            >
              <div className="flex items-center justify-between">
                <d.icon className={`size-6 ${open ? "text-primary" : "text-gold-soft"}`} />
                <span className="font-display text-sm text-muted-foreground">{d.no}</span>
              </div>
              <h2 className="mt-5 text-lg">{d.title}</h2>
              <p className="mt-2 text-xs tracking-wide text-primary/90">{d.tagline}</p>
              <p className="mt-1 text-[10px] tracking-[0.2em] text-muted-foreground">{d.en}</p>
              {open && (
                <div className="mt-4 border-t border-border/70 pt-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">{d.detail}</p>
                  <ul className="mt-4 space-y-1.5 text-sm text-gold-soft">
                    {d.points.map((p) => (
                      <li key={p}>・{p}</li>
                    ))}
                  </ul>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-16 rule-gold" />
      <div className="mt-12 flex flex-wrap items-center justify-between gap-6">
        <p className="max-w-xl leading-loose text-muted-foreground whitespace-pre-line">
          八大維度不是八張票券，而是一張會籍卡的完整權益。{"\n"}你需要的資源與人脈，俱樂部裡都有，並且可傳承給家人。
        </p>
        <Link
          to="/reserve"
          className="rounded-full bg-gold-gradient px-8 py-3.5 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5"
        >
          立即卡位創始會員
        </Link>
      </div>
    <VideoSlot slotId="dimensions-page" title="八大維度介紹影片" className="mt-16 px-0" />
      </div>
  );
}
