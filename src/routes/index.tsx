import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Award, Handshake, UserSearch } from "lucide-react";
import heroCosmos from "@/assets/hero-cosmos.jpg";
import clubLounge from "@/assets/club-lounge.jpg";
import royalGift from "@/assets/royal-gift.jpg";
import { dimensions, painPoints, compareRows } from "@/data/ecosystem";
import { FoundingCountdown } from "@/components/founding-countdown";
import { VideoSlot } from "@/components/video-slot";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "頂級共生未來生態圈｜創始會員限量招募" },
      {
        name: "description",
        content:
          "全球首創・全維度生命賦能【頂級共生未來生態圈】創始會員招募。八大頂級維度、一次入會終生傳承、介紹資源人才現拿 $12,000 獎勵。",
      },
      { property: "og:title", content: "頂級共生未來生態圈｜創始會員限量招募" },
      {
        property: "og:description",
        content: "一次入會，終生傳承。這不只是一場商業革命，更是一張通往生命最高規格的終極門票。",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "頂級共生未來生態圈",
          description: "全球首創・全維度生命賦能的共生共榮生態圈，八大板塊形成獨立經濟體。",
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <img
          src={heroCosmos}
          alt="金色星芒光暈在深邃曜石黑與皇家星空藍中綻放，象徵共生生態圈的能量網絡"
          width={1920}
          height={1088}
          className="absolute inset-0 size-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,oklch(0.13_0.017_265/0.72),oklch(0.13_0.017_265/0.94))]" />
        <div className="relative mx-auto max-w-5xl px-5 py-28 text-center md:py-40">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-5 py-2 text-[11px] tracking-[0.3em] text-primary">
            GLOBAL FIRST ・ 全球首創
          </p>
          <h1 className="mt-8 font-display text-3xl leading-[1.35] sm:text-5xl md:text-6xl">
            AI人工智能快速翻牌，
            <br className="hidden sm:block" />
            <span className="text-gold-gradient">你確定努力就不會被淘汰？</span>
          </h1>
          <p className="mx-auto mt-7 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            全維度生命賦能【頂級未來生態圈】正式啟航！一次入會，終生傳承。
            <br className="hidden md:block" />
            這不只是一場商業革命，更是一張通往生命最高規格的終極門票。
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/reserve"
              className="rounded-full bg-gold-gradient px-8 py-3.5 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5"
            >
              立即卡位創始會員
            </Link>
            <Link
              to="/reserve"
              className="rounded-full border border-primary/50 px-8 py-3.5 text-sm text-primary transition-colors hover:bg-primary/10"
            >
              預約專屬引路人一對一深度對接
            </Link>
          </div>
          <div className="mx-auto mt-14 max-w-xl">
            <p className="mb-4 text-xs tracking-[0.28em] text-muted-foreground">
              創始席位・全球限額搶位中
            </p>
            <FoundingCountdown />
          </div>
        </div>
      </section>

      <VideoSlot slotId="home-hero" title="品牌形象影片" className="pt-16" />

      {/* 時代痛點 */}
      <section className="starburst mx-auto max-w-7xl px-5 py-24">
        <p className="text-xs tracking-[0.3em] text-primary">THE TURNING POINT</p>
        <h2 className="mt-4 max-w-3xl text-2xl leading-snug sm:text-4xl">
          時代痛點與起源宣言：孤島的時代已經結束
        </h2>
        <p className="mt-6 max-w-3xl whitespace-pre-line leading-loose text-muted-foreground">
          九紫離火疊加少子化與人口老年化，人們越來越孤獨、越來越缺愛、越來越迷茫。
          共生共贏的生態圈結合八大板塊，形成一個獨立經濟體與「完美的被動收入閉環」，
          進而影響整個社會的人類認知、商業、人文、生活方式與經濟發展。
          {"\n"}讓我們一起創造一個更美好的帝國，一起走向更幸福喜樂的未來吧！
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {painPoints.map((p) => (
            <article key={p.title} className="glass-card rounded-2xl p-7 shadow-lux">
              <h3 className="text-lg text-gold-soft">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
            </article>
          ))}
        </div>
        <VideoSlot slotId="home-pain" title="時代痛點影片" className="mt-12 px-0" />
      </section>

      {/* 起源與使命 */}
      <section className="surface-royal border-y border-border py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:grid-cols-2">
          <img
            src={clubLounge}
            alt="頂級私人俱樂部中的企業家身影，暖金光線映照大理石與夜景"
            loading="lazy"
            width={1600}
            height={1008}
            className="rounded-2xl object-cover shadow-lux"
          />
          <div>
            <p className="text-xs tracking-[0.3em] text-primary">ORIGIN & MISSION</p>
            <h2 className="mt-4 text-2xl leading-snug sm:text-4xl">關於 獵光者：起源與使命</h2>
            <p className="mt-6 leading-loose text-muted-foreground">
              過膩了單打獨鬥日復一日的日子，「生態圈」是嶄新的未來。我們打破傳統商業與固有生存模式，透過吃喝玩樂．學習．互助共贏．一起做好事，搭配一套完善系統創造被動收入，終結生活的孤島與重蹈覆轍的死循環； 結合多位頂尖企業家與跨界領袖，打造全維度生命共同體， 實現商業賦能、跨界媒合、生命覺醒與大愛傳承。
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
              {["商業賦能", "跨界媒合", "生命覺醒", "大愛傳承"].map((t) => (
                <p key={t} className="rounded-xl border border-primary/25 px-4 py-3 text-gold-soft">
                  {t}
                </p>
              ))}
            </div>
          </div>
        </div>
        <VideoSlot slotId="home-origin" title="起源與使命影片" className="mt-14" />
      </section>

      {/* 八大維度 */}
      <section className="mx-auto max-w-7xl px-5 py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.3em] text-primary">EIGHT DIMENSIONS</p>
            <h2 className="mt-4 text-2xl sm:text-4xl">八大頂級維度藍圖\u3000世代傳承</h2>
          </div>
          <Link
            to="/dimensions"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            展開完整藍圖 <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {dimensions.map((d) => (
            <Link
              key={d.no}
              to="/dimensions"
              className="group glass-card rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-glow"
            >
              <div className="flex items-center justify-between">
                <d.icon className="size-6 text-primary" />
                <span className="font-display text-sm text-muted-foreground">{d.no}</span>
              </div>
              <h3 className="mt-5 text-lg">{d.title}</h3>
              <p className="mt-2 text-xs tracking-wide text-primary/90">{d.tagline}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{d.detail}</p>
            </Link>
          ))}
        </div>
        <VideoSlot slotId="home-dimensions" title="八大維度影片" className="mt-12 px-0" />
      </section>

      {/* 降維打擊 */}
      <section className="surface-royal border-y border-border py-24">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-xs tracking-[0.3em] text-primary">ROI COMPARISON</p>
          <h2 className="mt-4 text-2xl sm:text-4xl">降維打擊：終結傳統商會的隱形成本</h2>
          <div className="mt-10 overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-card/70 text-xs tracking-widest">
                <tr>
                  <th className="px-4 py-4 font-normal text-muted-foreground">項目</th>
                  <th className="px-4 py-4 font-normal text-muted-foreground">傳統商會</th>
                  <th className="px-4 py-4 font-normal text-primary">未來生態圈</th>
                </tr>
              </thead>
              <tbody>
                {compareRows.slice(0, 4).map((r) => (
                  <tr key={r.label} className="border-t border-border/70 align-top">
                    <td className="px-4 py-4 text-gold-soft">{r.label}</td>
                    <td className="px-4 py-4 text-muted-foreground line-through decoration-destructive/60">
                      {r.legacy}
                    </td>
                    <td className="whitespace-pre-line px-4 py-4">{r.eco}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link
            to="/compare"
            className="mt-8 inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            查看完整 ROI 對比表 <ArrowRight className="size-4" />
          </Link>
        </div>
        <VideoSlot slotId="home-compare" title="降維打擊影片" className="mt-12" />
      </section>

      {/* 人脈變現 */}
      <section className="mx-auto max-w-7xl px-5 py-24">
        <p className="text-xs tracking-[0.3em] text-primary">MONETIZE YOUR NETWORK</p>
        <h2 className="mt-4 text-2xl sm:text-4xl">最強人脈變現與人才媒合</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Award,
              title: "現拿 $12,000 提成獎勵",
              text: "推薦符合資格的資源人才共創未來，獎勵即時入袋，不再有無償的義務引薦。",
            },
            { icon: Handshake, title: "商業精準媒合", text: "跨界資源直接對接可落地的合作與訂單，超越傳統商會的引薦效率。" },
            { icon: UserSearch, title: "企業精準獵才", text: "會員企業免費媒合生態圈人才，把對的人放到對的位置。" },
          ].map((c) => (
            <article key={c.title} className="glass-card rounded-2xl p-7 shadow-lux">
              <c.icon className="size-6 text-primary" />
              <h3 className="mt-5 text-lg text-gold-soft">{c.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.text}</p>
            </article>
          ))}
        </div>
        <Link to="/network" className="mt-8 inline-flex items-center gap-2 text-sm text-primary hover:underline">
          了解人脈變現機制 <ArrowRight className="size-4" />
        </Link>
        <VideoSlot slotId="home-network" title="人脈變現影片" className="mt-12 px-0" />
      </section>

      {/* 創始禮遇 */}
      <section className="surface-royal border-t border-border py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:grid-cols-2">
          <div>
            <p className="text-xs tracking-[0.3em] text-primary">FOUNDING PRIVILEGE</p>
            <h2 className="mt-4 text-2xl leading-snug sm:text-4xl">
              限時創始禮遇：<span className="text-gold-gradient">泰國皇室御用商品四套</span>
            </h2>
            <p className="mt-6 leading-loose text-muted-foreground">
              現在加入，加碼免費贈送「泰國皇室御用保養品整整四套」（可加價換購保健食品）。
              創始會員同時擁有世代傳承權益——100% 資產與人脈可傳承給子女或愛人。
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/reserve"
                className="rounded-full bg-gold-gradient px-8 py-3.5 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5"
              >
                立即卡位創始會員
              </Link>
              <Link
                to="/founding"
                className="rounded-full border border-primary/50 px-8 py-3.5 text-sm text-primary transition-colors hover:bg-primary/10"
              >
                查看創始禮遇細節
              </Link>
            </div>
          </div>
          <img
            src={royalGift}
            alt="四套泰國皇室御用保養品禮盒陳列於黑色大理石與皇家藍絲綢上"
            loading="lazy"
            width={1408}
            height={1008}
            className="rounded-2xl object-cover shadow-lux"
          />
        </div>
        <VideoSlot slotId="home-founding" title="創始禮遇影片" className="mt-14" />
      </section>
    </div>
  );
}
