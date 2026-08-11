import { createFileRoute, Link } from "@tanstack/react-router";
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
          <p className="text-xs tracking-[0.28em] text-primary">未來生態圈</p>
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
              <th className="px-4 py-4 font-normal text-primary">未來生態圈</th>
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

      <p className="mt-10 max-w-3xl leading-loose text-muted-foreground">
        「跟上帝喝咖啡」之後，愛與資源仍能代代相傳——這是傳統會籍永遠給不了的投報率。
      </p>
      <Link
        to="/reserve"
        className="mt-8 inline-block rounded-full bg-gold-gradient px-8 py-3.5 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5"
      >
        立即卡位創始會員
      </Link>
    </div>
  );
}
