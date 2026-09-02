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
      { title: "獵光者 未來俱樂部｜創始會籍限量招募" },
      {
        name: "description",
        content:
          "全球首創・全維度生命賦能【頂級共生未來生態圈】創始會員招募。八大頂級維度、一次入會終生傳承、介紹資源人才現拿 $12,000 獎勵。",
      },
      { property: "og:title", content: "獵光者 未來俱樂部｜創始會籍限量招募" },
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
          name: "獵光者 未來俱樂部",
          description: "全球菁英私人俱樂部，八大會員專屬權益板塊，跨界菁英對接與家族傳承。",
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
            全維度生命賦能【頂級未來生態圈】正式啟航！一次會費，終生傳承 代代相傳。
            <br className="hidden md:block" />
             這不只是一場商業革命，還是一份可傳承的家業，更是一張通往生命最高規格的終極門票。
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
          俱樂部以八大會員專屬權益板塊，串起「跨界菁英對接」與「家族傳承與資源共享」，
          進而影響整個社會的人類認知、商業、人文、生活方式與經濟發展。
          {"\n"}讓我們一起創造一個更美好的帝國，走向更幸福喜樂的未來吧！
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

      {/* 使命與願景 */}
      <section className="surface-royal border-y border-border py-24">
        <div className="mx-auto max-w-5xl px-5">
          <img
            src={clubLounge}
            alt="頂級私人俱樂部中的企業家身影，暖金光線映照大理石與夜景"
            loading="lazy"
            width={1600}
            height={1008}
            className="mb-14 rounded-2xl object-cover shadow-lux"
          />
          <p className="text-xs tracking-[0.3em] text-primary">MISSION & VISION</p>
          <h2 className="mt-4 text-2xl leading-snug sm:text-4xl">獵光者未來俱樂部｜使命與願景</h2>

          <div className="mt-12">
            <h3 className="text-lg text-gold-soft">【我們的核心使命】</h3>
            <p className="mt-4 leading-loose text-muted-foreground">
              跨越血緣與種族，重塑人類最深層的連結。為迷茫的心靈提供避風港，為破碎的世界點亮希望之火；讓每位走進來的靈魂，都能在愛、安全感與豐盛中共振，世世代代傳承不息。
            </p>
          </div>

          <div className="mt-12">
            <h3 className="text-lg text-gold-soft">【為什麼創立獵光者未來俱樂部？】</h3>
            <div className="mt-4 space-y-5 leading-loose text-muted-foreground">
              <p>
                時代更迭的速度已遠超人類心靈所能承受的極限。AI的飛速崛起、海量資訊的外部干擾，本該連結世界的科技，反而讓心與心之間築起高牆。
              </p>
              <p>
                放眼當下社會，詐騙猖獗、人心動盪、惡性案件頻傳。我們看清了動亂背後的根源——不是人心變壞，而是人們深陷在「缺愛、缺錢、缺乏安全感」的集體恐慌中。伴隨少子化趨勢，越來越多獨生子女在面對父母老去或離世時，獨自承受巨大的精神重壓與無助。血緣網絡日漸稀薄，現代人正淪為一座座在風雨中飄搖的孤島。
              </p>
              <p>這正是「獵光者未來俱樂部」誕生的原因。</p>
              <p>
                我們不只是一個社群，更是一個超越血緣、性別、種族與疆界的全球精神大家庭。我們要讓每個走進來的人，不再孤身對抗世界的風浪，而是找到同頻共振的至親家人，重新體會被深愛、被理解與被善待的溫度。
              </p>
            </div>
          </div>

          <div className="mt-12">
            <h3 className="text-lg text-gold-soft">【獵光者未來俱樂部的核心理念】</h3>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              <article className="glass-card rounded-2xl p-7 shadow-lux">
                <h4 className="text-base text-gold-soft">心靈療癒與歸屬：從孤島重回「大家庭」</h4>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  在這裡，真誠是唯一的通行證。我們提供最溫暖的包容與支持，讓破碎的心靈得以修復。無論原生家庭如何，你在這裡都能結識宛如結拜手足般的至親夥伴，建立終生不離不棄的情感支撐，告別孤獨與迷茫。
                </p>
              </article>
              <article className="glass-card rounded-2xl p-7 shadow-lux">
                <h4 className="text-base text-gold-soft">八大板塊賦能：終結焦慮，實現「身心自足」</h4>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  沒有物質的安全感，心靈難以真正安頓。俱樂部透過健全的八大賦能板塊，協助夥伴建立穩健的被動收入系統。當生存的恐慌被豐盛取代，你將能真正放下緊繃與恐懼，輕鬆自如地活出發光發熱的自己。
                </p>
              </article>
              <article className="glass-card rounded-2xl p-7 shadow-lux">
                <h4 className="text-base text-gold-soft">跨血緣的永恆守護：世世代代的家族傳承</h4>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  這份連結超越姓氏，超越時間。我們為下一代打造永續的避風港與資源網絡，即便面對家庭結構變遷與少子化挑戰，孩子們依然能在大生態的守護下成長，讓愛與豐盛成為可以世代延續的家業。
                </p>
              </article>
            </div>
          </div>

          <div className="mt-14 text-center">
            <p className="text-lg leading-loose text-gold-soft">
              讓世界因我們而和解，讓黑夜因光芒而退散。
              <br />
              我們是獵光者，在這裡，你永遠有家，永遠有光。
            </p>
          </div>
        </div>
        <VideoSlot slotId="home-origin" title="使命與願景影片" className="mt-14" />
      </section>

      {/* 八大維度 */}
      <section className="mx-auto max-w-7xl px-5 py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.3em] text-primary">EIGHT DIMENSIONS</p>
            <h2 className="mt-4 text-2xl sm:text-4xl">八大頂級維度藍圖 \ 最棒的傳家之寶</h2>
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
              <p className="mt-1 text-[10px] tracking-[0.2em] text-muted-foreground">{d.en}</p>
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
