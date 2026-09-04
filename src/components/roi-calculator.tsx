import { useMemo, useState } from "react";

const fmt = (n: number) => `NT$ ${Math.round(n).toLocaleString("en-US")}`;

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  display: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label className="text-sm text-muted-foreground">{label}</label>
        <span className="font-display text-base text-gold-soft">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-primary"
      />
    </div>
  );
}

export function RoiCalculator() {
  const [wellness, setWellness] = useState(180000);
  const [trips, setTrips] = useState(3);
  const [training, setTraining] = useState(120000);

  const result = useMemo(() => {
    const wellnessSaving = wellness * 0.3; // 皇室御用品牌終身 7 折
    const travelSaving = trips * 18000; // 獨家旅遊專案折扣
    const courseValue = 20 * 12 * 400 * 35; // 每月 20 堂 × 12 月 × 約 US$400 課程市值
    const yieldLow = (wellnessSaving + travelSaving) * 0.35;
    const yieldHigh = (wellnessSaving + travelSaving) * 1.2 + 120000;
    return {
      directSaving: wellnessSaving + travelSaving,
      courseValue,
      yieldLow,
      yieldHigh,
    };
  }, [wellness, trips, training]);

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="glass-card space-y-8 rounded-2xl p-8 shadow-lux">
        <Slider
          label="全家年度保養保健消費"
          value={wellness}
          min={30000}
          max={1200000}
          step={10000}
          onChange={setWellness}
          display={fmt(wellness)}
        />
        <Slider
          label="年度旅遊次數"
          value={trips}
          min={0}
          max={12}
          step={1}
          onChange={setTrips}
          display={`${trips} 次`}
        />
        <Slider
          label="年度學習培訓預算"
          value={training}
          min={0}
          max={1000000}
          step={10000}
          onChange={setTraining}
          display={fmt(training)}
        />
      </div>

      <div className="space-y-4">
        <div className="glass-card rounded-2xl p-7 shadow-lux">
          <p className="text-xs tracking-[0.24em] text-primary">DIRECT SAVING</p>
          <p className="mt-3 font-display text-3xl text-gold-gradient">{fmt(result.directSaving)}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            年度直接省下金額（皇室品牌終身 7 折 ＋ 獨家旅遊專案折扣）
          </p>
        </div>
        <div className="glass-card rounded-2xl p-7 shadow-lux">
          <p className="text-xs tracking-[0.24em] text-primary">MASTERCLASS VALUE</p>
          <p className="mt-3 font-display text-3xl text-gold-gradient">{fmt(result.courseValue)}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            賦能課程等值市場價值（每月 20+ 堂 × 12 個月，年均 240+ 堂）
            {training > 0 && `；可直接取代您原本 ${fmt(training)} 的培訓預算`}
          </p>
        </div>
        <div className="glass-card rounded-2xl p-7 shadow-lux">
          <p className="text-xs tracking-[0.24em] text-primary">PARTNER YIELD RANGE</p>
          <p className="mt-3 font-display text-2xl text-gold-gradient">
            {fmt(result.yieldLow)} – {fmt(result.yieldHigh)}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            生態合夥人潛在被動收益區間（依實際參與度與生態導流成果而定，僅為情境試算）
          </p>
        </div>
        <p className="pt-2 text-center font-display text-base leading-relaxed text-gold-soft">
          「加入不是一筆消費，而是一場讓資產與身心同時增值的配置。」
        </p>
      </div>
    </div>
  );
}
