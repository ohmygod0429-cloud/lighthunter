import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { fetchReviewData } from "@/lib/review.functions";

export const Route = createFileRoute("/review")({
  head: () => ({
    meta: [
      { title: "會籍審核後台｜獵光者 未來俱樂部" },
      {
        name: "description",
        content: "獵光者未來俱樂部內部審核台：檢視入會申請、生活照與大頭照，以及預約諮詢名單。",
      },
      { property: "og:title", content: "會籍審核後台｜獵光者 未來俱樂部" },
      { property: "og:description", content: "內部審核台：入會申請、照片與預約名單。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Review,
});

type ReviewData = Awaited<ReturnType<typeof fetchReviewData>>;
type Applications = Extract<ReviewData, { ok: true }>["applications"];
type Reservations = Extract<ReviewData, { ok: true }>["reservations"];

const card =
  "rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur supports-[backdrop-filter]:bg-card/40";

function Row({ label, value }: { label: string; value: string | null | undefined | boolean }) {
  const text =
    typeof value === "boolean" ? (value ? "是" : "否") : value && String(value).trim() ? value : "—";
  return (
    <div className="flex gap-3 border-b border-border/40 py-1.5 text-sm last:border-0">
      <span className="w-28 shrink-0 text-gold-soft">{label}</span>
      <span className="flex-1 whitespace-pre-wrap break-words text-foreground/90">{text}</span>
    </div>
  );
}

function Photo({ label, url }: { label: string; url: string | null }) {
  if (!url)
    return (
      <div className="flex h-40 w-32 items-center justify-center rounded-xl border border-dashed border-border/60 text-xs text-muted-foreground">
        無{label}
      </div>
    );
  return (
    <a href={url} target="_blank" rel="noreferrer" className="block">
      <img
        src={url}
        alt={label}
        loading="lazy"
        className="h-40 w-32 rounded-xl border border-border/60 object-cover transition hover:opacity-80"
      />
      <span className="mt-1 block text-center text-xs text-muted-foreground">{label}</span>
    </a>
  );
}

function Review() {
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState<Applications | null>(null);
  const [reservations, setReservations] = useState<Reservations | null>(null);
  const [tab, setTab] = useState<"applications" | "reservations">("applications");

  const load = async (code: string) => {
    setLoading(true);
    try {
      const res = await fetchReviewData({ data: { passcode: code } });
      if (!res.ok) {
        toast.error("密碼錯誤");
        return;
      }
      setApplications(res.applications);
      setReservations(res.reservations);
    } catch {
      toast.error("讀取失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  const unlocked = applications !== null;

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-16">
      <h1 className="text-2xl font-semibold tracking-wide text-foreground sm:text-3xl">
        會籍審核後台
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        僅供理事會使用。輸入管理者密碼後可檢視申請資料與照片。
      </p>

      {!unlocked ? (
        <form
          className={`mt-8 flex flex-col gap-3 sm:flex-row sm:items-center ${card}`}
          onSubmit={(e) => {
            e.preventDefault();
            void load(passcode);
          }}
        >
          <div className="flex items-center gap-2 text-sm text-gold-soft">
            <Lock className="h-4 w-4" /> 管理者密碼
          </div>
          <input
            type="password"
            inputMode="numeric"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="flex-1 rounded-xl border border-input bg-card/60 px-4 py-3 text-sm outline-none focus:border-primary/70"
            placeholder="請輸入密碼"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            {loading ? "驗證中…" : "進入審核台"}
          </button>
        </form>
      ) : (
        <>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {(
              [
                ["applications", `入會申請（${applications?.length ?? 0}）`],
                ["reservations", `預約名單（${reservations?.length ?? 0}）`],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  tab === key
                    ? "border-primary/70 bg-primary/10 text-foreground"
                    : "border-border/60 text-muted-foreground"
                }`}
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => void load(passcode)}
              disabled={loading}
              className="ml-auto inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 text-sm text-muted-foreground"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> 重新整理
            </button>
          </div>

          {tab === "applications" && (
            <div className="mt-6 space-y-5">
              {(applications ?? []).length === 0 && (
                <p className="text-sm text-muted-foreground">目前尚無申請資料。</p>
              )}
              {(applications ?? []).map((a) => (
                <article key={a.id} className={card}>
                  <div className="flex flex-col gap-5 sm:flex-row">
                    <div className="flex gap-3">
                      <Photo label="生活照" url={a.life_photo_url} />
                      <Photo label="大頭照" url={a.headshot_url} />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-medium text-foreground">{a.full_name}</h2>
                      <p className="text-xs text-muted-foreground">
                        {new Date(a.created_at).toLocaleString("zh-TW")}
                      </p>
                      <div className="mt-3">
                        <Row label="出生年月日" value={a.birth_date} />
                        <Row label="職稱／企業" value={a.title_company} />
                        <Row label="主要行業" value={a.industry} />
                        <Row label="私人手機" value={a.phone} />
                        <Row label="WeChat / LINE" value={a.messenger} />
                        <Row label="電子郵件" value={a.business_email} />
                        <Row label="持有證照" value={a.licenses} />
                        <Row label="感興趣板塊" value={a.pillars} />
                        <Row label="核心價值" value={a.core_value} />
                        <Row label="過往社群" value={a.prior_orgs} />
                        <Row label="推薦人" value={a.referrer} />
                        <Row label="交流時段" value={a.meeting_time_pref} />
                        <Row label="交流禮儀" value={a.agree_etiquette} />
                        <Row label="資料屬實" value={a.agree_truthful} />
                        <Row label="認同家規" value={a.agree_house_rules} />
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {tab === "reservations" && (
            <div className="mt-6 space-y-5">
              {(reservations ?? []).length === 0 && (
                <p className="text-sm text-muted-foreground">目前尚無預約資料。</p>
              )}
              {(reservations ?? []).map((r) => (
                <article key={r.id} className={card}>
                  <h2 className="text-lg font-medium text-foreground">{r.name}</h2>
                  <p className="text-xs text-muted-foreground">
                    {new Date(r.created_at).toLocaleString("zh-TW")}
                  </p>
                  <div className="mt-3">
                    <Row label="手機" value={r.phone} />
                    <Row label="電子郵件" value={r.email} />
                    <Row label="LINE ID" value={r.line_id} />
                    <Row label="產業／職務" value={r.industry} />
                    <Row label="興趣／專長" value={r.interests} />
                    <Row label="感興趣原因" value={r.reasons} />
                    <Row label="我想要" value={r.intent} />
                    <Row label="方案" value={r.plan} />
                    <Row label="留言" value={r.message} />
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}
