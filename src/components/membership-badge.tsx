import { Link } from "@tanstack/react-router";

export function MembershipBadge() {
  return (
    <Link
      to="/founding"
      aria-label="獵光者俱樂部會籍卡"
      className="group fixed bottom-20 right-5 z-40 hidden w-[150px] rounded-xl border border-primary/40 bg-[linear-gradient(135deg,oklch(0.28_0.03_265),oklch(0.18_0.02_265))] p-3 shadow-lux backdrop-blur-md transition-transform hover:-translate-y-0.5 sm:block"
    >
      <div className="flex items-center gap-2">
        <span className="grid size-9 shrink-0 place-items-center rounded-full border border-primary/60 bg-gold-gradient text-[9px] font-medium tracking-widest text-primary-foreground">
          LH
        </span>
        <span className="leading-tight">
          <span className="block text-[10px] tracking-[0.24em] text-primary">MEMBERSHIP</span>
          <span className="block text-[11px] text-muted-foreground">會籍卡・創始席位</span>
        </span>
      </div>
      <span className="mt-2 block border-t border-primary/25 pt-2 text-[10px] tracking-[0.18em] text-gold-soft">
        THE LIGHTHUNTER CLUB
      </span>
    </Link>
  );
}
