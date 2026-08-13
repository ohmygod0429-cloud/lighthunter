import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { VideoSlot } from "@/components/video-slot";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/reserve")({
  head: () => ({
    meta: [
      { title: "立即卡位創始會員｜預約專屬引路人一對一對接" },
      {
        name: "description",
        content:
          "線上預約與卡位系統：選擇一次付清或 36 期分期方案，快速對接專屬引路人，完成創始會員席位登記。",
      },
      { property: "og:title", content: "立即卡位創始會員｜頂級共生未來生態圈" },
      { property: "og:description", content: "填寫表單，專屬引路人將於 3天內與你一對一深度對接。" },
    ],
  }),
  component: ReservePage,
});

const plans = [
  { id: "full", label: "一次付清 $79,500", note: "終生會員・終生免續費" },
  { id: "12", label: "分 12 期", note: "每期約 $7,011" },
  { id: "36", label: "分 36 期", note: "每期約 $2,606" },
];

const intents = ["立即卡位創始會員", "預約專屬引路人一對一深度對接", "先加入LINE群，等待對外公開說明會。"];

function ReservePage() {
  const [plan, setPlan] = useState("36");
  const [intent, setIntent] = useState(intents[0]);
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-3xl px-5 py-20">
      <p className="text-xs tracking-[0.3em] text-primary">RESERVE YOUR SEAT</p>
      <h1 className="mt-4 text-3xl sm:text-5xl">線上預約與卡位</h1>
      <p className="mt-6 leading-loose text-muted-foreground">
        創始席位全球限額搶位中。填寫以下資訊，專屬引路人將於 3天內與你聯繫，完成一對一深度對接。
      </p>

      <form
        className="mt-12 space-y-7"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const name = String(formData.get("name") ?? "");
          toast.success("已收到你的卡位申請", {
            description: "專屬引路人將於 3天內與你聯繫。",
          });
          void navigate({
            to: "/reserve/success",
            search: { name: name || undefined },
          });
        }}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-gold-soft">姓名</span>
            <input
              required
              name="name"
              className="mt-2 w-full rounded-xl border border-input bg-card/60 px-4 py-3 outline-none focus:border-primary/70"
              placeholder="您的姓名"
            />
          </label>
          <label className="block text-sm">
            <span className="text-gold-soft">聯絡電話</span>
            <input
              required
              name="phone"
              type="tel"
              className="mt-2 w-full rounded-xl border border-input bg-card/60 px-4 py-3 outline-none focus:border-primary/70"
              placeholder="09xx-xxx-xxx"
            />
          </label>
          <label className="block text-sm">
            <span className="text-gold-soft">電子郵件</span>
            <input
              required
              name="email"
              type="email"
              className="mt-2 w-full rounded-xl border border-input bg-card/60 px-4 py-3 outline-none focus:border-primary/70"
              placeholder="you@example.com"
            />
          </label>
          <label className="block text-sm">
            <span className="text-gold-soft">LINE ID</span>
            <input
              name="lineId"
              maxLength={50}
              pattern="^[a-zA-Z0-9_.-]+$"
              className="mt-2 w-full rounded-xl border border-input bg-card/60 px-4 py-3 outline-none focus:border-primary/70"
              placeholder="例如：light.hunter"
            />
          </label>
          <label className="block text-sm">
            <span className="text-gold-soft">產業／職務</span>
            <input
              name="industry"
              className="mt-2 w-full rounded-xl border border-input bg-card/60 px-4 py-3 outline-none focus:border-primary/70"
              placeholder="例如：科技業／創辦人"
            />
          </label>
        </div>

        <fieldset>
          <legend className="text-sm text-gold-soft">我想要</legend>
          <div className="mt-3 grid gap-3">
            {intents.map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIntent(i)}
                className={`rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                  intent === i
                    ? "border-primary/70 bg-primary/10 text-foreground"
                    : "border-border text-muted-foreground hover:border-primary/40"
                }`}
              >
                {i}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm text-gold-soft">付款方案</legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {plans.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlan(p.id)}
                className={`rounded-xl border px-4 py-4 text-left transition-colors ${
                  plan === p.id
                    ? "border-primary/70 bg-primary/10"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <span className="block text-sm">{p.label}</span>
                <span className="mt-1 block text-xs text-muted-foreground">{p.note}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <label className="block text-sm">
          <span className="text-gold-soft">想優先了解的維度或需求</span>
          <textarea
            name="message"
            rows={4}
            className="mt-2 w-full rounded-xl border border-input bg-card/60 px-4 py-3 outline-none focus:border-primary/70"
            placeholder="例如：希望媒合供應鏈資源、想參與身心靈成長課程…"
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-full bg-gold-gradient py-4 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5"
        >
          送出卡位申請
        </button>
        <p className="text-center text-xs text-muted-foreground">
          送出後將由專屬引路人與你確認席位與付款方案，資料僅供本次對接使用。
        </p>
      </form>
    <VideoSlot slotId="reserve-page" title="預約說明影片" className="mt-16 px-0" />
      </div>
  );
}
