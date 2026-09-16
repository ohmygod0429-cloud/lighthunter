import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { VideoSlot } from "@/components/video-slot";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { syncRowToSheet } from "@/lib/sheet-sync.functions";


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

const intents = ["立即卡位創始會員", "預約專屬引路人一對一深度對接", "先加入LINE群，等待公開說明會。"];

const reasonOptions = [
  "商會／結盟",
  "找志同道合的朋友／聯誼",
  "跟著皇室一起變美／變健康",
  "免費課程",
  "獨家旅遊折扣",
  "被動收入／創業",
];

const LINE_GROUP_URL =
  "https://line.me/ti/g2/bIUtx1-DK-hRNLLSJRi7mcJ3g8RKROP3D6HjHQ?utm_source=invitation&utm_medium=link_copy&utm_campaign=default";

const LINE_OFFICIAL_URL = "https://lin.ee/9n0cOis";

const reservationSchema = z.object({
  name: z.string().trim().min(1, "請填寫姓名").max(100, "姓名過長"),
  phone: z.string().trim().min(6, "請填寫正確的聯絡電話").max(40, "電話過長"),
  email: z.string().trim().email("電子郵件格式不正確").max(255),
  line_id: z
    .string()
    .trim()
    .max(50, "LINE ID 過長")
    .regex(/^[a-zA-Z0-9_.-]*$/, "LINE ID 格式不正確"),
  industry: z.string().trim().max(100, "產業／職務過長"),
  interests: z.string().trim().max(200, "興趣／專長過長"),
  reasons: z.string().max(500, "感興趣的原因過長"),
  intent: z.string().max(200),
  plan: z.string().max(40),
  message: z.string().trim().max(1000, "內容請控制在 1000 字以內"),
});

function ReservePage() {
  const [plan, setPlan] = useState("36");
  const [intent, setIntent] = useState(intents[0]);
  const [submitting, setSubmitting] = useState(false);
  const [reasons, setReasons] = useState<string[]>([]);
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
        onSubmit={async (e) => {
          e.preventDefault();
          if (submitting) return;
          const formData = new FormData(e.currentTarget);
          const parsed = reservationSchema.safeParse({
            name: String(formData.get("name") ?? ""),
            phone: String(formData.get("phone") ?? ""),
            email: String(formData.get("email") ?? ""),
            line_id: String(formData.get("lineId") ?? ""),
            industry: String(formData.get("industry") ?? ""),
            interests: String(formData.get("interests") ?? ""),
            reasons: reasons.join("・"),
            intent,
            plan: plans.find((p) => p.id === plan)?.label ?? plan,
            message: String(formData.get("message") ?? ""),
          });

          if (!parsed.success) {
            toast.error("資料有誤，請確認後再送出", {
              description: parsed.error.issues[0]?.message,
            });
            return;
          }

          const payload = parsed.data;
          setSubmitting(true);
          const { error } = await supabase.from("reservations").insert({
            name: payload.name,
            phone: payload.phone,
            email: payload.email,
            line_id: payload.line_id || null,
            industry: payload.industry || null,
            interests: payload.interests || null,
            reasons: payload.reasons || null,
            intent: payload.intent,
            plan: payload.plan,
            message: payload.message || null,
          });
          setSubmitting(false);

          if (error) {
            toast.error("送出失敗，請稍後再試", {
              description: "若持續發生，請直接透過 LINE 與我們聯繫。",
            });
            return;
          }

          void syncRowToSheet({
            data: { sheet: "reservations", row: { ...payload } },
          }).catch(() => undefined);

          toast.success("已收到你的卡位申請", {
            description: "專屬引路人將於 3天內與你聯繫。",
          });
          void navigate({
            to: "/reserve/success",
            search: { name: payload.name || undefined },
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
          <label className="block text-sm">
            <span className="text-gold-soft">興趣／專長</span>
            <input
              name="interests"
              maxLength={200}
              className="mt-2 w-full rounded-xl border border-input bg-card/60 px-4 py-3 outline-none focus:border-primary/70"
              placeholder="例如：投資、簡報設計、瑜伽"
            />
          </label>
        </div>

        <fieldset>
          <legend className="text-sm text-gold-soft">感興趣的原因？（可複選）</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {reasonOptions.map((r) => (
              <label
                key={r}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${
                  reasons.includes(r)
                    ? "border-primary/70 bg-primary/10 text-foreground"
                    : "border-border text-muted-foreground hover:border-primary/40"
                }`}
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-primary"
                  checked={reasons.includes(r)}
                  onChange={() => {
                    setReasons((prev) =>
                      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r],
                    );
                  }}
                />
                {r}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm text-gold-soft">我想要</legend>
          <div className="mt-3 grid gap-3">
            {intents.map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setIntent(i);
                  if (i === intents[1] && typeof window !== "undefined") {
                    window.open(LINE_OFFICIAL_URL, "_blank", "noopener,noreferrer");
                  }
                }}
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

        {intent === intents[2] ? (
          <div className="rounded-2xl border border-primary/40 bg-card/60 p-8 text-center">
            <p className="text-base text-gold-soft">您已被邀請加入「獵光者　未來俱樂部」！</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              請點選以下連結加入社群，我們將在 LINE 群內公告公開說明會時間。
            </p>
            <a
              href={LINE_GROUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block rounded-full bg-gold-gradient px-8 py-3 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5"
            >
              加入 LINE 社群
            </a>
          </div>
        ) : intent === intents[1] ? (
          <div className="rounded-2xl border border-primary/40 bg-card/60 p-8 text-center">
            <p className="text-base text-gold-soft">已為你開啟 LINE 官方帳號</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              專屬引路人將在 LINE 上與你聯繫，安排一對一深度對接。若未自動開啟，請點選下方連結手動加入。
            </p>
            <a
              href={LINE_OFFICIAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block rounded-full bg-gold-gradient px-8 py-3 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5"
            >
              直接加入 LINE 官方
            </a>
          </div>
        ) : (
          <>
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
              disabled={submitting}
              className="w-full rounded-full bg-gold-gradient py-4 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {submitting ? "送出中…" : "送出卡位申請"}
            </button>

            <p className="text-center text-xs text-muted-foreground">
              送出後將由專屬引路人與你確認席位與付款方案，資料僅供本次對接使用。
            </p>
          </>
        )}
      </form>
    <VideoSlot slotId="reserve-page" title="預約說明影片" className="mt-16 px-0" />
      </div>
  );
}
