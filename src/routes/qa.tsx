import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { VideoSlot } from "@/components/video-slot";

export const Route = createFileRoute("/qa")({
  head: () => ({
    meta: [
      { title: "常見問題 Q&A｜獵光者生態圈" },
      {
        name: "description",
        content:
          "破除所有懷疑，看懂時代格局。獵光者生態圈常見問題完整解答，涵蓋會員價值、費用、世襲傳承、申請條件與貸款分期。",
      },
      { property: "og:title", content: "常見問題 Q&A｜獵光者生態圈" },
      {
        property: "og:description",
        content: "破除所有懷疑，看懂時代格局。一次看懂獵光者生態圈的價值與加入方式。",
      },
    ],
  }),
  component: QAPage,
});

type QA = { q: string; a: React.ReactNode };

const faqs: QA[] = [
  {
    q: "Q1：現在市面上有這麼多社群、商會和課程，為什麼我一定要加入「獵光者生態圈」？",
    a: (
      <div className="space-y-4">
        <p>
          傳統的商會或學習社群，本質上是「一次性消費與內耗的場所」。你每年繳交會費、花錢去應酬、買幾十萬的碎片化課程，結果人脈隨時間斷鏈，知識隨親人逝去，錢花完了什麼也留不下。
        </p>
        <p>
          而「獵光者生態圈」買的不是短暫的服務，而是「家族數位資產」。我們結合了全球商業媒合、跨世代智庫、真愛互助與永續網店。這是一套讓你的子孫代代「侵泡在愛裡、自動運轉的財富與智慧防護網」。
        </p>
      </div>
    ),
  },
  {
    q: "Q2：加入生態圈提到的「創始席位費用」或各項學習，真的能省下幾十萬嗎？",
    a: (
      <div className="space-y-4">
        <p>我們用最保守的數學來算給你聽：</p>
        <ul className="space-y-2 text-muted-foreground">
          <li>孩子學習與才藝：每週 2 堂，每堂至少 800 元起跳 × 52 週 = $83,200 元/年。</li>
          <li>成人專業與心靈進修：每週 2 堂，每堂至少 800 元起跳 × 52 週 = $83,200 元/年。</li>
          <li>隱形教材、交通與試錯成本：至少 $94,400 元/年。</li>
          <li>市場傳統總計：單人或小家庭一年無止盡地流出至少 $260,800 元，3 年到 5 年累積下來就是 $130 萬至數百萬的無底洞。</li>
        </ul>
        <p>
          在生態圈中，這些頂級的商業與成長資源，夥伴享有專屬解鎖權。你省下的不僅是每年數十萬的血汗錢，更是家族免於被市場剝削的底氣。
        </p>
      </div>
    ),
  },
  {
    q: "Q3：生態圈強調的「世襲」到底是什麼意思？真的能傳給下一代嗎？",
    a: (
      <div className="space-y-4">
        <p>是的，這正是我們與一般平台最大的不同。</p>
        <p>
          傳統教育與商業人脈最大的痛點在於「人走茶涼、世代斷鏈」。你在外面花大錢建立的人脈，退休就歸零；你買的課程，帳號不能繼承。
        </p>
        <p>
          而在這，你獲得的是一整套「數位資產護照與永續網店經營權」。30 年後，當別人家的孩子還要背負學貸、重頭摸索社會時，你的孩子可以直接「一鍵接手」這個運作成熟的智庫、全球商業信用池與自動化金庫。
        </p>
      </div>
    ),
  },
  {
    q: "Q4：這會不會是另一種變相的直銷或龐式騙局？",
    a: (
      <div className="space-y-4">
        <p>
          完全不是。直銷與騙局的核心特徵是「靠拉下線賺取暴利、產品毫無價值、資金流向不明」。
        </p>
        <p>而獵光者生態圈的本質是「高頻共振的生命與商業共同體」：</p>
        <ul className="space-y-2 text-muted-foreground">
          <li>價值透明：我們提供的是真真實實的商業戰略、頂級導師親授與實體互助防護網。</li>
          <li>資產化：你的每一分投入，都是在為自己建立永續的數位網店與智庫資產，而非幫別人繳會費。</li>
          <li>嚴格篩選：我們不收閒雜人等，採全網預約審核制，確保進來的每一位都是善良有愛的高質量創始夥伴。</li>
        </ul>
      </div>
    ),
  },
  {
    q: "Q5：我應該如何加入？所有人都可以申請嗎？",
    a: (
      <div className="space-y-4">
        <p>
          我們不對外全面開放，因為「高頻共振」需要極致的質量把關。
        </p>
        <p>
          如果您已經看懂這場少子化與經濟洗牌的大局，不希望自己的下一代繼續走冤枉路，您可以透過點擊下方的按鈕，填寫您的真實背景與對家族未來的願景。審核通過後，將由專人引導您進入 2026 年的全球創始席位（G100）。
        </p>
      </div>
    ),
  },
  {
    q: "Q6：想共襄盛舉但手頭緊，一定要一次性給付 $79,500 嗎？",
    a: (
      <div className="space-y-4">
        <p>
          如是同頻人且通過審核，企業已為您準備了【貸款分期】通道，最多可分 36 期，2,606／期。
        </p>
      </div>
    ),
  },
  {
    q: "Q7：【貸款分期】有什麼條件嗎？",
    a: (
      <div className="space-y-3">
        <p>如是同頻人且通過審核。</p>
        <ol className="list-inside list-decimal space-y-1 text-muted-foreground">
          <li>凡年滿 20 歲，未滿 70 歲。</li>
          <li>無政府罰單未繳。</li>
        </ol>
      </div>
    ),
  },
  {
    q: "Q8：加入『獵光者　共生共榮未來生態圈』有什麼條件嗎？",
    a: (
      <div className="space-y-5">
        <p>凡善良有愛，認同以下家規者，經過審核通過即可。</p>
        <div className="glass-card rounded-2xl p-6">
          <p className="text-center text-gold-soft">我讚嘆宇宙與之同頻</p>
          <div className="mt-4 grid gap-1 text-center text-sm leading-relaxed text-muted-foreground">
            <p>以愛為始　以善為念</p>
            <p>以信為本　堅守信念</p>
            <p>知行合一　與道同行</p>
            <p>起心動念　天地合一</p>
            <p>互助護愛　不分彼此</p>
            <p>不嚼口舌　不造紛爭</p>
            <p>互為貴人　資源共享</p>
            <p>相互托舉　一生同行</p>
            <p>嚴守家規　守護家園</p>
            <p>提好字　說好話</p>
            <p>做好事　做好人</p>
            <p className="text-gold-soft">走向光　成為光</p>
            <p className="text-gold-soft">德到　得道　得到</p>
          </div>
        </div>
      </div>
    ),
  },
];

function FAQItem({ qa, index }: { qa: QA; index: number }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <div className="glass-card overflow-hidden rounded-2xl">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start gap-4 px-6 py-5 text-left"
      >
        <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border border-primary/40 text-xs text-primary">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="flex-1 text-sm leading-relaxed sm:text-base">{qa.q}</span>
        <ChevronDown
          className={`mt-1 size-5 shrink-0 text-primary transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="border-t border-border/60 px-6 pb-6 pt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {qa.a}
        </div>
      )}
    </div>
  );
}

function QAPage() {
  return (
    <div>
      <section className="surface-royal border-b border-border py-20">
        <div className="mx-auto max-w-4xl px-5 text-center">
          <p className="text-xs tracking-[0.3em] text-primary">FAQ</p>
          <h1 className="mt-4 font-display text-3xl leading-snug sm:text-4xl">
            獵光者生態圈常見問題
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            破除所有懷疑，看懂時代格局
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-16">
        <div className="space-y-4">
          {faqs.map((qa, i) => (
            <FAQItem key={i} qa={qa} index={i} />
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link
            to="/reserve"
            className="rounded-full bg-gold-gradient px-8 py-3.5 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5"
          >
            立即卡位創始會員
          </Link>
        </div>
      </section>

      <VideoSlot slotId="qa-bottom" title="常見問題影片" />
    </div>
  );
}
