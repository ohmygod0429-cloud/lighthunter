import { createFileRoute, Link } from "@tanstack/react-router";
import { VideoSlot } from "@/components/video-slot";
import { compareRows } from "@/data/ecosystem";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "降維打擊對比表與 ROI｜頂級共生未來生態圈" },
      {
        name: "description",
        content:
          "傳統商會五年花費破 30 萬且退出權益歸零；未來生態圈一次性 $79,500 終生免續費、可分 36 期、100% 可代代傳承。",
      },
      { property: "og:title", content: "降維打擊對比表與 ROI｜頂級共生未來生態圈" },
      { property: "og:description", content: "直觀呈現傳統商會的隱形成本與生態圈的超高投報率。" },
    ],
  }),
  component: ComparePage,
});

function ComparePage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-20">
      <p className="text-xs tracking-[0.3em] text-primary">ROI COMPARISON</p>
      <h1 className="mt-4 text-3xl sm:text-5xl">降維打擊對比表</h1>
      <p className="mt-6 max-w-3xl leading-loose text-muted-foreground">
        把兩種選擇放在同一張桌上：一邊是年年續繳的隱形成本，一邊是一次入會、終生傳承的資產。
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="glass-card rounded-2xl p-7">
          <p className="text-xs tracking-[0.28em] text-muted-foreground">傳統商會</p>
          <p className="mt-4 font-display text-3xl text-muted-foreground">5 年 &gt; $300,000</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            年費 $25,000～$45,000 每年續繳，加上每次應酬餐費，退出後權益歸零。
          </p>
        </div>
        <div className="glass-card rounded-2xl p-7 shadow-glow">
          <p className="text-xs tracking-[0.28em] text-primary">獵光者未來俱樂部</p>
          <p className="mt-4 font-display text-3xl text-gold-gradient">一次 $79,500</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            可分 36 期，終生免續費。每月 20 堂以上免費課程，人脈與權益 100% 可傳承。
          </p>
        </div>
      </div>

      <div className="mt-12 overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-card/70 text-xs tracking-widest">
            <tr>
              <th className="px-4 py-4 font-normal text-muted-foreground">項目</th>
              <th className="px-4 py-4 font-normal text-muted-foreground">傳統商會</th>
              <th className="px-4 py-4 font-normal text-primary">獵光者未來俱樂部</th>
            </tr>
          </thead>
          <tbody>
            {compareRows.map((r) => (
              <tr key={r.label} className="border-t border-border/70 align-top">
                <td className="px-4 py-4 text-gold-soft">{r.label}</td>
                <td className="px-4 py-4 text-muted-foreground">{r.legacy}</td>
                <td className="whitespace-pre-line px-4 py-4">{r.eco}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>



      {/* 育兒與學習的隱形黑洞 */}
      <div className="mt-24">
        <p className="text-xs tracking-[0.3em] text-primary">COURSE ADVANTAGE</p>
        <h2 className="mt-4 text-2xl sm:text-4xl">育兒與學習的隱形黑洞</h2>
        <p className="mt-4 max-w-3xl whitespace-pre-line leading-loose text-muted-foreground">
          當代父母最深的焦慮，不是「不夠努力」，而是「錢花得極快，卻看不到未來」。讓我們攤開現實的帳單，看看每個家庭在不知不覺中吞下了多麼龐大的財務黑洞。{"\n"}
          一般小家庭 房租12000/月{"\n"}
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 水電1000/月{"\n"}
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 伙食費300/天 →9000/月{"\n"}
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 不包含停車費.尿布.學雜費.管理費.通勤費.稅費.保險費.交際費.{"\n"}
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 突如其來的醫療費或其他開銷...就已足夠花掉半個月的薪資，&nbsp;{"\n"}
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 如何破圈脫離現狀？
        </p>

        <p className="mt-10 font-display text-lg text-gold-soft">📊 不可承受的年度財務黑洞</p>
        <p className="mt-3 max-w-3xl leading-loose text-muted-foreground">
          無論是孩子的才藝、學科補習，還是父母自身為了成長必須進修的專業課程，在當今市場上：單堂課基本底線至少 $800 元／堂，每週孩子與自己各安排 2 堂（每週共 4 堂）。
        </p>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-card/70 text-xs tracking-widest">
              <tr>
                <th className="px-4 py-4 font-normal text-muted-foreground">項目</th>
                <th className="px-4 py-4 font-normal text-muted-foreground">計算公式（每堂 $800 基準）</th>
                <th className="px-4 py-4 font-normal text-primary">年度總花費</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: "孩子學習與才藝", formula: "2 堂/週 × 52 週 × $800", total: "$83,200" },
                { label: "成人專業／心靈進修", formula: "2 堂/週 × 52 週 × $800", total: "$83,200" },
                { label: "隱形教材、交通與時間成本", formula: "額外衍生開銷與試錯成本", total: "$94,400" },
                { label: "市場傳統總計", formula: "年復一年，無止盡的現金流出", total: "💥 $260,800 / 年" },
                { label: "3-5 年長期累積", formula: "學習與育兒的無底洞", total: "📉 $1,304,000 以上" },
              ].map((r) => (
                <tr key={r.label} className="border-t border-border/70 align-top">
                  <td className="px-4 py-4 text-gold-soft">{r.label}</td>
                  <td className="px-4 py-4 text-muted-foreground">{r.formula}</td>
                  <td className="px-4 py-4 text-gold-gradient font-display">{r.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          殘酷現實：這還只是「基本開銷」。若加上通膨、名師加價、私校學費，一個家庭在教育上的消耗輕則破百萬，重則將家族幾十年的積蓄在不知不覺中掏空。
        </p>

        <p className="mt-12 font-display text-lg text-gold-soft">🛡️ 獵光者未來俱樂部的降維打擊絕對優勢</p>
        <p className="mt-3 max-w-3xl leading-loose text-muted-foreground">
          當別人還在用每堂 800 元的價格在紅海中苦苦掙扎、買心安時，獵光者生態圈直接打破傳統邏輯，提供不可被反駁的降維賦能。
        </p>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-card/70 text-xs tracking-widest">
              <tr>
                <th className="px-4 py-4 font-normal text-muted-foreground">比較維度</th>
                <th className="px-4 py-4 font-normal text-muted-foreground">傳統育兒與學習</th>
                <th className="px-4 py-4 font-normal text-primary">獵光者未來俱樂部</th>
              </tr>
            </thead>
            <tbody>
              {[
                { dim: "師資陣容", legacy: "無實戰經驗、實力參差不齊的講師，學到的不只有限，還不確定是否正確。", eco: "透過俱樂部層層把關各領域頂尖、身價千萬的資深創始人與導師親授" },
                { dim: "課程費用", legacy: "每堂 $800～$2,000 不等，堂堂計費", eco: "會員專屬權益：20堂頂級課程$1999解鎖" },
                { dim: "資產屬性", legacy: "消費支出：錢花完就沒了，知識帶不走", eco: "家族資產：一次性席位，百年權益終身世襲" },
                { dim: "核心差異", legacy: "讓你越學越窮的「現金流黑洞」", eco: "讓子孫代代侵泡在愛裡的「財富與智慧防護網」" },
              ].map((r) => (
                <tr key={r.dim} className="border-t border-border/70 align-top">
                  <td className="px-4 py-4 text-gold-soft">{r.dim}</td>
                  <td className="px-4 py-4 text-muted-foreground">{r.legacy}</td>
                  <td className="px-4 py-4">{r.eco}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { icon: "💎", title: "零成本獲取頂級資源", text: "省下每年高達 $260,800 以上的重複學費與育兒支出，把本該被市場剝削的血汗錢，轉化為家族的底氣。" },
            { icon: "🎓", title: "資深導師免費授課", text: "我們邀請的不是普通老師，而是實戰贏家。用共生共贏的機制，讓孩子與您直接站在巨人的肩膀上。" },
            { icon: "📈", title: "世襲式複利累積", text: "傳統教育花錢買心安，獵光者未來俱樂部買的是「世襲數位資產」。30 年後，您留給子孫的是一個龐大、自動運轉的智庫與人脈金庫。" },
          ].map((c) => (
            <div key={c.title} className="glass-card rounded-2xl p-6">
              <p className="text-2xl">{c.icon}</p>
              <p className="mt-3 font-display text-base text-gold-soft">{c.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.text}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 max-w-3xl leading-loose text-muted-foreground">
          「與其把錢砸在無止盡的市場內耗，不如一次看懂格局，將資產留給真正值得的未來。」
        </p>
      </div>

      <p className="mt-10 max-w-3xl leading-loose text-muted-foreground">
        「跟上帝喝咖啡」之後，愛與資源仍能代代相傳——這是傳統會籍永遠給不了的投報率。
      </p>
      <Link
        to="/reserve"
        className="mt-8 inline-block rounded-full bg-gold-gradient px-8 py-3.5 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5"
      >
        立即卡位創始會員
      </Link>
    <VideoSlot slotId="compare-page" title="ROI 對比影片" className="mt-16 px-0" />
      </div>
  );
}
