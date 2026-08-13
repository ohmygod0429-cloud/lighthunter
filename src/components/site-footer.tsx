import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-3">
        <div>
          <h2 className="font-display text-2xl text-gold-gradient">頂級共生未來生態圈</h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            全球首創・全維度生命賦能。一次承諾，終生傳承　代代世襲——商業賦能、跨界媒合、生命覺醒與大愛傳承的全維度生命共同體。
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <p className="mb-3 text-xs tracking-[0.28em] text-primary">導覽</p>
          <Link to="/dimensions" className="block text-muted-foreground hover:text-foreground">
            八大頂級維度
          </Link>
          <Link to="/compare" className="block text-muted-foreground hover:text-foreground">
            降維打擊對比與 ROI
          </Link>
          <Link to="/network" className="block text-muted-foreground hover:text-foreground">
            人脈變現與人才媒合
          </Link>
          <Link to="/founding" className="block text-muted-foreground hover:text-foreground">
            創始會員限時禮遇
          </Link>
          <Link to="/reserve" className="block text-muted-foreground hover:text-foreground">
            線上預約與卡位
          </Link>
        </div>

        <div className="space-y-3 text-sm text-muted-foreground">
          <p className="mb-3 text-xs tracking-[0.28em] text-primary">創始席位</p>
          <p>全球限額搶位中，名額遞減。</p>
          <p>一次性終生會員 $79,500（可分 36 期）</p>
          <Link
            to="/reserve"
            className="mt-2 inline-block rounded-full border border-primary/60 px-5 py-2.5 text-primary transition-colors hover:bg-primary/10"
          >
            預約專屬引路人一對一深度對接
          </Link>
        </div>
      </div>
      <p className="border-t border-border/70 py-6 text-center text-xs tracking-widest text-muted-foreground">
        © {new Date().getFullYear()} SYMBIOTIC FUTURE ECOSYSTEM ・ 頂級共生未來生態圈
      </p>
    </footer>
  );
}
