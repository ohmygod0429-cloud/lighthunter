import { createFileRoute, Link } from "@tanstack/react-router";
import royalGift from "@/assets/royal-gift.jpg";
import { FoundingCountdown } from "@/components/founding-countdown";

export const Route = createFileRoute("/founding")({
  head: () => ({
    meta: [
      { title: "創始會員限時禮遇與世代傳承｜頂級共生未來生態圈" },
      {
        name: "description",
        content:
          "創始會員限量贈送泰國皇室御用保養品四套（可加價換購保健食品），並享終生免續費與 100% 可傳承的世代權益。",
      },
      { property: "og:title", content: "創始會員限時禮遇與世代傳承" },
      { property: "og:description", content: "全球限額搶位中，名額遞減。限時禮遇與世代傳承權益一次擁有。" },
    ],
  }),
  component: FoundingPage,
});

const privileges = [
  { title: "泰國皇室御用保養品 四套", text: "限量加碼贈送，整整四套；亦可加價換購保健食品。" },
  { title: "終生免續費", text: "一次性終生會員 $79,500，可貸款分 36 期，每月2606。" },
  { title: "每月 20 堂以上免費課程", text: "AI、自媒體、身心靈、行銷品牌管理、才藝與音樂，終身引路。" },
  { title: "世代傳承權益", text: "100% 資產與人脈可傳承給子女或愛人，愛能代代相傳。" },
];

function FoundingPage() {
  return (
    <div className="starburst mx-auto max-w-7xl px-5 py-20">
      <p className="text-xs tracking-[0.3em] text-primary">FOUNDING PRIVILEGE</p>
      <h1 className="mt-4 text-3xl sm:text-5xl">創始會員限時禮遇</h1>
      <p className="mt-6 max-w-3xl leading-loose text-muted-foreground">
        創始席位全球限額搶位中，名額遞減。創始身份只發生一次，之後再也無法補回。
      </p>

      <div className="mt-12 max-w-xl">
        <FoundingCountdown />
      </div>

      <div className="mt-16 grid items-center gap-12 md:grid-cols-2">
        <img
          src={royalGift}
          alt="四套泰國皇室御用保養品禮盒，金色壓紋黑盒陳列於皇家藍絲綢上"
          loading="lazy"
          width={1408}
          height={1008}
          className="rounded-2xl object-cover shadow-lux"
        />
        <div className="space-y-5">
          {privileges.map((p) => (
            <article key={p.title} className="glass-card rounded-2xl p-6">
              <h2 className="text-lg text-gold-soft">{p.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-16 rule-gold" />
      <div className="mt-12 flex flex-wrap items-center justify-between gap-6">
        <p className="max-w-xl leading-loose text-muted-foreground">
          一次入會，終生傳承。這不只是一場商業革命，更是一張通往生命最高規格的終極門票。
        </p>
        <Link
          to="/reserve"
          className="rounded-full bg-gold-gradient px-8 py-3.5 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5"
        >
          立即卡位創始會員
        </Link>
      </div>
    </div>
  );
}
