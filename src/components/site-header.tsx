import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Cat, Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "首頁" },
  { to: "/about", label: "關於我們" },
  { to: "/cats", label: "貓咪成員" },
  { to: "/menu", label: "餐點菜單" },
  { to: "/visit", label: "消費與須知" },
  { to: "/reserve", label: "線上預約" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground">
            <Cat className="size-5" />
          </span>
          <span className="font-display text-xl font-semibold tracking-wide">貓癒所</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-secondary text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          aria-label="開啟選單"
          onClick={() => setOpen((v) => !v)}
          className="grid size-10 place-items-center rounded-full border border-border text-foreground md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-border bg-card px-5 pb-4 md:hidden">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block border-b border-border/60 py-3 text-sm text-foreground last:border-0"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}