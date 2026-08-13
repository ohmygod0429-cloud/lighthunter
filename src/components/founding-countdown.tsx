import { useEffect, useState } from "react";

const DEADLINE = new Date("2026-10-12T23:59:59+08:00").getTime();

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function FoundingCountdown() {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setLeft(Math.max(0, DEADLINE - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const d = left === null ? null : Math.floor(left / 86400000);
  const h = left === null ? null : Math.floor((left % 86400000) / 3600000);
  const m = left === null ? null : Math.floor((left % 3600000) / 60000);
  const s = left === null ? null : Math.floor((left % 60000) / 1000);

  const cells = [
    { v: d, label: "DAYS" },
    { v: h, label: "HOURS" },
    { v: m, label: "MINS" },
    { v: s, label: "SECS" },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {cells.map((c) => (
        <div key={c.label} className="glass-card rounded-xl px-2 py-4 text-center">
          <p className="font-display text-2xl text-gold-gradient sm:text-3xl">
            {c.v === null ? "--" : pad(c.v)}
          </p>
          <p className="mt-1 text-[10px] tracking-[0.24em] text-muted-foreground">{c.label}</p>
        </div>
      ))}
    </div>
  );
}
