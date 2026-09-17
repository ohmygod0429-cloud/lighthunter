import { Link } from "@tanstack/react-router";
import { SocialLinks } from "@/components/social-links";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-3">
        <div>
          <h2 className="font-display text-2xl text-gold-gradient">獵光者　未來俱樂部</h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            全球菁英私人俱樂部。一次會籍，終生傳承　代代世襲——會員專屬權益、跨界菁英對接、家族傳承與資源共享。
          </p>
          <p className="mt-6 text-xs tracking-[0.28em] text-primary">追蹤我們</p>
          <SocialLinks className="mt-3" />
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
          <Link to="/apply" className="block text-muted-foreground hover:text-foreground">
            申請入會席次審核
          </Link>
          <Link to="/reserve" className="block text-muted-foreground hover:text-foreground">
            線上一對一諮詢預約
          </Link>
        </div>

        <div className="space-y-3 text-sm text-muted-foreground">
          <p className="mb-3 text-xs tracking-[0.28em] text-primary">創始席位</p>
          <p>全球限額審核中，席次遞減。</p>
          <p>一次性終生會員 $79,500（可分 36 期）</p>
          <Link
            to="/apply"
            className="mt-2 inline-block rounded-full border border-primary/60 px-5 py-2.5 text-primary transition-colors hover:bg-primary/10"
          >
            申請入會席次審核
          </Link>

        </div>
      </div>
      <p className="border-t border-border/70 py-6 text-center text-xs tracking-widest text-muted-foreground">
        © {new Date().getFullYear()} THE LIGHTHUNTER PRIVATE CLUB ・ 獵光者　未來俱樂部
      </p>
    </footer>
  );
}
