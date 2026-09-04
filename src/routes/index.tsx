import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowDown, ShieldCheck, Crown } from "lucide-react";
import heroCosmos from "@/assets/hero-cosmos.jpg";
import clubLounge from "@/assets/club-lounge.jpg";
import { legacyCompare, vettingSteps } from "@/data/pillars";
import { PillarMatrix } from "@/components/pillar-matrix";
import { RoiCalculator } from "@/components/roi-calculator";
import { FoundingCountdown } from "@/components/founding-countdown";
import { VideoSlot } from "@/components/video-slot";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "獵光者 未來俱樂部｜全球頂級生命生態圈・席次審核制" },
      {
        name: "description",
        content:
          "8 大核心賦能維度 × 跨代財富傳承 × 全球頂級生活特權。獵光者未來俱樂部整合跨國商業對接、前瞻心智賦能、極致健康特權與世襲被動收益，採推薦與審核入會制。",
      },
      { property: "og:title", content: "獵光者 未來俱樂部｜超越傳統商會維度的生命生態圈" },
      {
        property: "og:description",
        content: "不隨時代逐流，我們聚合點亮未來的光。8 大權益矩陣、年均 240+ 堂賦能、跨代世襲會籍。",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "獵光者 未來俱樂部",
          description:
            "全球頂級私人俱樂部，八大核心賦能維度、跨代世襲會籍與嚴格推薦審查制度。",
        }),
      },
    ],
  }),
  component: Index,
});

const trustBadges = [
  "8 大全維度權益矩陣",
  "年均 240+ 堂前瞻賦能交付",
  "跨代世襲權益機制",
  "嚴格推薦審查制度",
];

function Index() {
  return (
    <div>
      {/* 1. Hero：身分認同與格局定調 */}
      <section className="relative isolate overflow-hidden">
        <img
          src={heroCosmos}
          alt="金色光影粒子在深曜黑夜空中緩慢流動，中央為帶有十字光芒的獵光者徽標意象"
          width={1920}
          height={1088}
          className="absolute inset-0 size-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,oklch(0.11_0.014_265/0.78),oklch(0.11_0.014_265/0.96))]" />
        <div className="relative mx-auto max-w-5xl px-5 py-28 text-center md:py-40">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-5 py-2 text-[10px] tracking-[0.28em] text-primary sm:text-[11px]">
            GLOBAL GLOW FUTURE CLUB ｜ 超越傳統商會維度的全球生命生態圈
          </p>
          <h1 className="mt-8 font-display text-3xl leading-[1.35] sm:text-5xl md:text-6xl">
            不隨時代逐流，
            <br className="hidden sm:block" />
            <span className="text-gold-gradient">我們聚合點亮未來的光。</span>
          </h1>
          <p className="mx-auto mt-7 max-w-3xl text-sm leading-loose text-muted-foreground sm:text-base">
            打破傳統商會的社交耗損與單向付出。獵光者未來俱樂部，整合「跨國商業對接、前瞻心智賦能、極致健康特權與世襲被動收益」，為少數遠見者建構世代傳承的生態護城河。
          </p>
          <p className="mt-6 text-xs tracking-[0.24em] text-primary/90 sm:text-sm">
            8 大核心賦能維度 × 跨代財富傳承 × 全球頂級生活特權
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/apply"
              className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-8 py-3.5 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5"
            >
              申請入會席次審核 <ArrowRight className="size-4" />
            </Link>
            <a
              href="#pillars"
              className="inline-flex items-center gap-2 rounded-full border border-primary/50 px-8 py-3.5 text-sm text-primary transition-colors hover:bg-primary/10"
            >
              探索八大核心板塊 <ArrowDown className="size-4" />
            </a>
          </div>
          <ul className="mx-auto mt-14 flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[11px] tracking-[0.18em] text-muted-foreground">
            {trustBadges.map((b) => (
              <li key={b} className="flex items-center gap-2">
                <span className="size-1 rounded-full bg-primary" />
                {b}
              </li>
            ))}
          </ul>
          <div className="mx-auto mt-14 max-w-xl">
            <p className="mb-4 text-xs tracking-[0.28em] text-muted-foreground">
              創始席次・全球限額審核中
            </p>
            <FoundingCountdown />
          </div>
        </div>
      </section>

      <VideoSlot slotId="home-hero" title="品牌形象影片" className="pt-16" />

      {/* 2. 痛點對比 */}
      <section className="starburst mx-auto max-w-7xl px-5 py-24">
        <p className="text-xs tracking-[0.3em] text-primary">WHY LEGACY NETWORKS FAIL</p>
        <h2 className="mt-4 max-w-3xl font-display text-2xl leading-snug sm:text-4xl">
          為什麼傳統商會已經過時？
        </h2>
        <p className="mt-6 max-w-3xl leading-loose text-muted-foreground">
          時間、人情與金錢都在流失，卻換不到可傳承的資產。我們用生態閉環，取代單向付出的社交耗損。
        </p>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {legacyCompare.map((c) => (
            <article
              key={c.name}
              className={`rounded-2xl p-8 ${
                c.tone === "club"
                  ? "glass-card border-primary/40 shadow-glow"
                  : "border border-border bg-card/40"
              }`}
            >
              <h3
                className={`font-display text-lg ${
                  c.tone === "club" ? "text-gold-gradient" : "text-muted-foreground"
                }`}
              >
                {c.name}
              </h3>
              <ul className="mt-6 space-y-3 text-sm leading-relaxed">
                {c.points.map((p) => (
                  <li
                    key={p}
                    className={
                      c.tone === "club"
                        ? "flex gap-2 text-foreground"
                        : "flex gap-2 text-muted-foreground"
                    }
                  >
                    <span
                      className={`mt-2 size-1 shrink-0 rounded-full ${
                        c.tone === "club" ? "bg-primary" : "bg-muted-foreground/60"
                      }`}
                    />
                    {p}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="mt-8">
          <Link
            to="/compare"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            查看完整成本與 ROI 對比 <ArrowRight className="size-4" />
          </Link>
        </div>
        <VideoSlot slotId="home-pain" title="痛點對比影片" className="mt-12 px-0" />
      </section>

      {/* 3. 八大板塊互動矩陣 */}
      <section id="pillars" className="surface-royal scroll-mt-24 border-y border-border py-24">
        <div className="mx-auto max-w-7xl px-5">
          <p className="text-xs tracking-[0.3em] text-primary">THE 8 PILLARS</p>
          <h2 className="mt-4 font-display text-2xl leading-snug sm:text-4xl">
            八大核心賦能維度<span className="text-gold-gradient">・互動權益矩陣</span>
          </h2>
          <p className="mt-6 max-w-3xl leading-loose text-muted-foreground">
            八大板塊不是八張票券，而是一張會籍卡的完整權益。點選任一板塊展開交付細節與證明元素。
          </p>
          <div className="mt-12">
            <PillarMatrix />
          </div>
          <div className="mt-8">
            <Link
              to="/dimensions"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              展開完整板塊藍圖 <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
        <VideoSlot slotId="home-dimensions" title="八大板塊影片" className="mt-14" />
      </section>

      {/* 4. 價值試算計算器 */}
      <section className="mx-auto max-w-7xl px-5 py-24">
        <p className="text-xs tracking-[0.3em] text-primary">INTERACTIVE ROI CALCULATOR</p>
        <h2 className="mt-4 font-display text-2xl leading-snug sm:text-4xl">
          價值試算：<span className="text-gold-gradient">你的會籍到底值多少？</span>
        </h2>
        <p className="mt-6 max-w-3xl leading-loose text-muted-foreground">
          拉動下方參數，即時看見年度可省下的實質金額、賦能課程的等值市場價值，以及生態合夥人的潛在被動收益區間。
        </p>
        <div className="mt-12">
          <RoiCalculator />
        </div>
      </section>

      {/* 5. 跨代傳承與身心靈精神 */}
      <section className="surface-royal border-y border-border py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2">
          <div>
            <p className="text-xs tracking-[0.3em] text-primary">ECOSYSTEM PHILOSOPHY</p>
            <h2 className="mt-4 font-display text-2xl leading-snug sm:text-4xl">
              超越血緣與國界的<span className="text-gold-gradient">心智共同體</span>
            </h2>
            <div className="mt-8 space-y-5 leading-loose text-muted-foreground">
              <p>
                獵光者的精神內核，是一個超越血緣、性別、種族與疆界的全球心智共同體。我們相信，真正的頂級圈層不只交換資源，更彼此點亮——讓每個走進來的人，不再孤身對抗世界的風浪。
              </p>
              <p>
                我們奉行「世襲制度」：會籍權益具備傳承性，不僅服務這一代創始人，更為下一代鋪墊最高規格的起跑點與人脈護城河。你留給子孫的，不是一次性的消費紀錄，而是一座持續運轉的智庫與人脈金庫。
              </p>
              <p className="font-display text-lg text-gold-soft">
                讓世界因我們而和解，讓黑夜因光芒而退散。
                <br />
                我們是獵光者，在這裡，你永遠有家，永遠有光。
              </p>
            </div>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/qa"
                className="inline-flex items-center gap-2 rounded-full border border-primary/50 px-7 py-3 text-sm text-primary transition-colors hover:bg-primary/10"
              >
                <Crown className="size-4" /> 創始會籍 Q&amp;A
              </Link>
            </div>
          </div>
          <img
            src={clubLounge}
            alt="頂級私人俱樂部閉門沙龍，暖金光線映照大理石與城市夜景"
            loading="lazy"
            width={1600}
            height={1008}
            className="rounded-2xl object-cover shadow-lux"
          />
        </div>
        <VideoSlot slotId="home-origin" title="精神內核影片" className="mt-14" />
      </section>

      {/* 6. 嚴格入會流程 */}
      <section className="mx-auto max-w-7xl px-5 py-24">
        <p className="text-xs tracking-[0.3em] text-primary">VETTING &amp; APPLICATION FLOW</p>
        <h2 className="mt-4 font-display text-2xl leading-snug sm:text-4xl">
          嚴格入會流程：<span className="text-gold-gradient">四道審核，一次授階</span>
        </h2>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {vettingSteps.map((s) => (
            <article key={s.step} className="glass-card rounded-2xl p-7 shadow-lux">
              <p className="font-display text-3xl text-gold-gradient">{s.step}</p>
              <h3 className="mt-4 font-display text-lg">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            </article>
          ))}
        </div>
        <div className="glass-card mt-14 flex flex-col items-center gap-6 rounded-2xl p-10 text-center shadow-glow">
          <ShieldCheck className="size-7 text-primary" />
          <h3 className="font-display text-xl leading-snug sm:text-2xl">
            席次有限，且僅開放給價值對等的遠見者。
          </h3>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            我們不開放線上直接付費入會。完成申請後，秘書處將進行背景與商譽初審，合格者由創始團隊親自安排 1
            對 1 視訊面談或閉門品茶會晤。
          </p>
          <Link
            to="/apply"
            className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-8 py-3.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            申請入會席次審核 <ArrowRight className="size-4" />
          </Link>
        </div>
        <VideoSlot slotId="home-founding" title="入會流程影片" className="mt-14 px-0" />
      </section>
    </div>
  );
}
