import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Copy, Lock, Mail, MessageCircle, Phone, RefreshCw, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteReviewRows, fetchReviewData } from "@/lib/review.functions";

export const Route = createFileRoute("/consult")({
  head: () => ({
    meta: [
      { title: "預約諮詢資料庫｜獵光者 未來俱樂部" },
      { name: "description", content: "獵光者未來俱樂部內部諮詢資料庫：檢視線上預約諮詢名單與聯絡方式。" },
      { property: "og:title", content: "預約諮詢資料庫｜獵光者 未來俱樂部" },
      { property: "og:description", content: "內部諮詢資料庫：線上預約諮詢名單與聯絡方式。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Consult,
});

type ReviewData = Awaited<ReturnType<typeof fetchReviewData>>;
type Reservations = Extract<ReviewData, { ok: true }>["reservations"];

const card = "rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur supports-[backdrop-filter]:bg-card/40";

function Row({ label, value }: { label: string; value: string | null | undefined | boolean }) {
  const text = typeof value === "boolean" ? (value ? "是" : "否") : value && String(value).trim() ? value : "—";
  return (
    <div className="flex gap-3 border-b border-border/40 py-1.5 text-sm last:border-0">
      <span className="w-28 shrink-0 text-gold-soft">{label}</span>
      <span className="flex-1 whitespace-pre-wrap break-words text-foreground/90">{text}</span>
    </div>
  );
}

function ContactLink({ icon: Icon, label, href }: { icon: typeof Phone; label: string; href: string }) {
  return (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-border/60 px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/50 hover:text-primary">
      <Icon className="size-3.5" /> {label}
    </a>
  );
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("已複製，可直接貼到 LINE 或備忘錄");
  } catch {
    toast.error("複製失敗，請手動選取資料");
  }
}

function Consult() {
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);
  const [reservations, setReservations] = useState<Reservations | null>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const removeRows = async (ids: string[]) => {
    if (ids.length === 0 || deleting) return;
    if (!window.confirm(`確定要刪除 ${ids.length} 筆預約資料嗎？刪除後無法復原。`)) return;
    setDeleting(true);
    try {
      const res = await deleteReviewRows({ data: { passcode, table: "reservations", ids } });
      if (!res.ok) { toast.error("密碼錯誤"); return; }
      setReservations((prev) => prev?.filter((r) => !ids.includes(r.id)) ?? prev);
      setSelected((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.delete(id));
        return next;
      });
      toast.success(`已刪除 ${res.deleted} 筆資料`);
    } catch {
      toast.error("刪除失敗，請稍後再試");
    } finally {
      setDeleting(false);
    }
  };

  const load = async (code: string) => {
    setLoading(true);
    try {
      const res = await fetchReviewData({ data: { passcode: code } });
      if (!res.ok) { toast.error("密碼錯誤"); return; }
      setReservations(res.reservations);
    } catch { toast.error("讀取失敗，請稍後再試"); }
    finally { setLoading(false); }
  };

  const normalized = query.trim().toLowerCase();
  const visibleReservations = useMemo(() => (reservations ?? []).filter((r) => !normalized || [r.name, r.phone, r.email, r.line_id, r.industry].some((v) => String(v ?? "").toLowerCase().includes(normalized))), [reservations, normalized]);
  const unlocked = reservations !== null;

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-16">
      <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">預約諮詢</h1>
      <p className="mt-2 text-sm text-muted-foreground">集中查看線上預約諮詢名單與聯絡方式，一人也能快速完成後續聯繫。</p>

      {!unlocked ? (
        <form className={`mt-8 flex flex-col gap-3 sm:flex-row sm:items-center ${card}`} onSubmit={(event) => { event.preventDefault(); void load(passcode); }}>
          <div className="flex items-center gap-2 text-sm text-gold-soft"><Lock className="size-4" /> 管理者密碼</div>
          <input type="password" inputMode="numeric" value={passcode} onChange={(event) => setPasscode(event.target.value)} className="flex-1 rounded-xl border border-input bg-card/60 px-4 py-3 text-sm outline-none focus:border-primary/70" placeholder="請輸入密碼" />
          <Button type="submit" disabled={loading}>{loading ? "驗證中…" : "進入諮詢資料庫"}</Button>
        </form>
      ) : (
        <>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-border/60 px-4 py-2 text-sm text-muted-foreground">預約名單（{reservations?.length ?? 0}）</span>
            {selected.size > 0 && (
              <Button type="button" variant="destructive" onClick={() => void removeRows(Array.from(selected))} disabled={deleting}>
                <Trash2 />刪除所選（{selected.size}）
              </Button>
            )}
            <Button type="button" variant="outline" className="sm:ml-auto" onClick={() => void load(passcode)} disabled={loading}><RefreshCw className={loading ? "animate-spin" : ""} />重新整理</Button>
          </div>
          <label className="relative mt-4 block">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full rounded-xl border border-input bg-card/60 py-3 pl-10 pr-4 text-sm outline-none focus:border-primary/70" placeholder="搜尋姓名、電話、Email、LINE 或產業" />
          </label>

          <div className="mt-6 space-y-5">
            {visibleReservations.length === 0 && <p className="text-sm text-muted-foreground">找不到符合的預約資料。</p>}
            {visibleReservations.map((r) => {
              const summary = [`預約｜${r.name}`, `送件：${new Date(r.created_at).toLocaleString("zh-TW")}`, `電話：${r.phone}`, `LINE：${r.line_id ?? "—"}`, `Email：${r.email}`, `介紹人：${r.referrer ?? "—"}`, `需求：${r.intent}`, `方案：${r.plan}`].join("\n");
              return <article key={r.id} className={card}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-2"><input type="checkbox" aria-label={`選取 ${r.name}`} checked={selected.has(r.id)} onChange={() => toggleSelect(r.id)} className="mt-1.5 h-4 w-4 accent-primary" /><div><h2 className="text-lg font-medium text-foreground">{r.name}</h2><p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString("zh-TW")}</p></div></div>
                  <div className="flex gap-2"><Button type="button" size="sm" variant="outline" onClick={() => void copyText(summary)}><Copy />複製摘要</Button><Button type="button" size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => void removeRows([r.id])} disabled={deleting}><Trash2 />刪除</Button></div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <ContactLink icon={Phone} label="撥電話" href={`tel:${r.phone}`} />
                  <ContactLink icon={Mail} label="寄 Email" href={`mailto:${r.email}`} />
                  {r.line_id && <ContactLink icon={MessageCircle} label="開啟 LINE" href={`https://line.me/ti/p/~${encodeURIComponent(r.line_id)}`} />}
                </div>
                <div className="mt-3">
                  <Row label="手機" value={r.phone} />
                  <Row label="電子郵件" value={r.email} />
                  <Row label="LINE ID" value={r.line_id} />
                  <Row label="產業／職務" value={r.industry} />
                  <Row label="興趣／專長" value={r.interests} />
                  <Row label="介紹人" value={r.referrer} />
                  <Row label="感興趣原因" value={r.reasons} />
                  <Row label="我想要" value={r.intent} />
                  <Row label="方案" value={r.plan} />
                  <Row label="留言" value={r.message} />
                </div>
              </article>;
            })}
          </div>
        </>
      )}
    </main>
  );
}
