import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { pillars } from "@/data/pillars";

export function PillarMatrix() {
  const [open, setOpen] = useState<string | null>("01");

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {pillars.map((p, i) => {
        const active = open === p.no;
        const wide = i >= 6; // 3 + 3 + 2 佈局
        return (
          <article
            key={p.no}
            className={`glass-card group rounded-2xl p-7 transition-all ${
              active ? "shadow-glow" : "hover:-translate-y-1 hover:shadow-glow"
            } ${wide ? "lg:col-span-3/2 lg:[grid-column:span_3_/_span_3] xl:[grid-column:span_3_/_span_3]" : ""}`}
            style={wide ? { gridColumn: "span 1" } : undefined}
          >
            <button
              type="button"
              onClick={() => setOpen(active ? null : p.no)}
              aria-expanded={active}
              className="w-full text-left"
            >
              <div className="flex items-start justify-between gap-4">
                <p.icon className="size-6 shrink-0 text-primary" />
                <span className="font-display text-sm tracking-[0.2em] text-muted-foreground">
                  {p.no}
                </span>
              </div>
              <h3 className="mt-5 font-display text-lg leading-snug">{p.title}</h3>
              <p className="mt-2 text-[10px] tracking-[0.24em] text-primary/80">{p.en}</p>
              <p className="mt-4 text-sm text-gold-soft">{p.slogan}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-xs tracking-widest text-primary">
                {active ? <Minus className="size-3.5" /> : <Plus className="size-3.5" />}
                {active ? "收起" : "展開細節"}
              </span>
            </button>

            {active && (
              <div className="mt-5 border-t border-border/70 pt-5">
                <p className="text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {p.deliverables.map((d) => (
                    <li
                      key={d}
                      className="rounded-full border border-primary/40 px-3 py-1 text-[11px] tracking-wide text-primary"
                    >
                      {d}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-[11px] tracking-[0.18em] text-muted-foreground">
                  證明元素・{p.proof}
                </p>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
