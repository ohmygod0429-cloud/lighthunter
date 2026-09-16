import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";

const links = [
  { to: "/", label: "首頁" },
  { to: "/dimensions", label: "八大板塊" },
  { to: "/compare", label: "降維打擊" },
  { to: "/network", label: "人脈變現" },
  { to: "/founding", label: "創始禮遇" },
  { to: "/qa", label: "創始會籍 Q&A" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
        setScrolled(window.scrollY > 12);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-border backdrop-blur-xl transition-colors duration-300 ${
        scrolled ? "bg-background/92 shadow-lux" : "bg-background/70"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-full border border-primary/50 text-primary">
            <Sparkles className="size-4" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-base tracking-[0.18em] text-gold-gradient">
              獵光者　未來俱樂部
            </span>
            <span className="block text-[10px] tracking-[0.32em] text-muted-foreground">
              THE LIGHTHUNTER PRIVATE CLUB
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/apply"
            className="ml-3 rounded-full bg-gold-gradient px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            申請審核預約
          </Link>
        </nav>

        <button
          type="button"
          aria-label={open ? "關閉選單" : "開啟選單"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="press grid size-11 place-items-center rounded-full border border-border text-foreground lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <div
        aria-hidden
        className="h-0.5 origin-left bg-gold-gradient transition-transform duration-150 ease-out"
        style={{ transform: `scaleX(${progress})` }}
      />

      {open && (
        <nav className="animate-rise border-t border-border bg-card px-5 pb-5 lg:hidden">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block border-b border-border/60 py-3 text-sm text-foreground"
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/apply"
            onClick={() => setOpen(false)}
            className="mt-4 block rounded-full bg-gold-gradient py-3 text-center text-sm font-medium text-primary-foreground"
          >
            申請入會席次審核
          </Link>
        </nav>
      )}
    </header>
  );
}
