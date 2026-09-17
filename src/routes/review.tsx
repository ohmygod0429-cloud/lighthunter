import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Copy,
  ExternalLink,
  ImageOff,
  LoaderCircle,
  Lock,
  Mail,
  MessageCircle,
  Phone,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteReviewRows, fetchReviewData } from "@/lib/review.functions";

export const Route = createFileRoute("/review")({
  head: () => ({
    meta: [
      { title: "會籍審核後台｜獵光者 未來俱樂部" },
      { name: "description", content: "獵光者未來俱樂部內部審核台：檢視入會申請、照片與預約諮詢名單。" },
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

function Photo({ label, url }: { label: string; url: string | null }) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">(url ? "loading" : "error");
  const [attempt, setAttempt] = useState(0);
  if (!url) return <div className="flex h-40 w-32 items-center justify-center rounded-xl border border-dashed border-border/60 text-xs text-muted-foreground">無{label}</div>;
  const src = attempt === 0 ? url : `${url}${url.includes("?") ? "&" : "?"}retry=${attempt}`;
  return (
    <div className="w-32">
      <a href={url} target="_blank" rel="noreferrer" className="relative block h-40 overflow-hidden rounded-xl border border-border/60 bg-muted/30">
        {status === "loading" && <span className="absolute inset-0 grid place-items-center"><LoaderCircle className="size-5 animate-spin text-primary" /></span>}
        {status === "error" && <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-2 text-center text-xs text-muted-foreground"><ImageOff className="size-5" />載入失敗</span>}
        <img key={attempt} src={src} alt={label} loading="eager" onLoad={() => setStatus("ready")} onError={() => setStatus("error")} className={`h-full w-full object-cover transition ${status === "ready" ? "opacity-100" : "opacity-0"}`} />
      </a>
      <div className="mt-1 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <span>{label}</span>
        {status === "error" ? <button type="button" className="text-primary" onClick={() => { setStatus("loading"); setAttempt((value) => value + 1); }}>重試</button> : <a href={url} target="_blank" rel="noreferrer" aria-label={`另開${label}`}><ExternalLink className="size-3" /></a>}
      </div>
    </div>
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

function Review() {
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState<Applications | null>(null);
  const [reservations, setReservations] = useState<Reservations | null>(null);
  const [tab, setTab] = useState<"applications" | "reservations">("applications");
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
    const label = tab === "applications" ? "入會申請" : "預約資料";
    if (!window.confirm(`確定要刪除 ${ids.length} 筆${label}嗎？刪除後無法復原。`)) return;
    setDeleting(true);
    try {
      const res = await deleteReviewRows({
        data: { passcode, table: tab === "applications" ? "membership_applications" : "reservations", ids },
      });
      if (!res.ok) { toast.error("密碼錯誤"); return; }
      if (tab === "applications") {
        setApplications((prev) => prev?.filter((a) => !ids.includes(a.id)) ?? prev);
      } else {
        setReservations((prev) => prev?.filter((r) => !ids.includes(r.id)) ?? prev);
      }
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
      setApplications(res.applications);
      setReservations(res.reservations);
    } catch { toast.error("讀取失敗，請稍後再試"); }
    finally { setLoading(false); }
  };

  const normalized = query.trim().toLowerCase();
  const visibleApplications = useMemo(() => (applications ?? []).filter((a) => !normalized || [a.full_name, a.phone, a.business_email, a.messenger, a.title_company].some((v) => String(v ?? "").toLowerCase().includes(normalized))), [applications, normalized]);
  const visibleReservations = useMemo(() => (reservations ?? []).filter((r) => !normalized || [r.name, r.phone, r.email, r.line_id, r.industry].some((v) => String(v ?? "").toLowerCase().includes(normalized))), [reservations, normalized]);
  const unlocked = applications !== null;

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-16">
      <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">會籍審核後台</h1>
      <p className="mt-2 text-sm text-muted-foreground">集中查看申請、照片與聯絡方式，一人也能快速完成後續聯繫。</p>

      {!unlocked ? (
        <form className={`mt-8 flex flex-col gap-3 sm:flex-row sm:items-center ${card}`} onSubmit={(event) => { event.preventDefault(); void load(passcode); }}>
          <div className="flex items-center gap-2 text-sm text-gold-soft"><Lock className="size-4" /> 管理者密碼</div>
          <input type="password" inputMode="numeric" value={passcode} onChange={(event) => setPasscode(event.target.value)} className="flex-1 rounded-xl border border-input bg-card/60 px-4 py-3 text-sm outline-none focus:border-primary/70" placeholder="請輸入密碼" />
          <Button type="submit" disabled={loading}>{loading ? "驗證中…" : "進入審核台"}</Button>
        </form>
      ) : (
        <>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button type="button" variant={tab === "applications" ? "default" : "outline"} onClick={() => { setTab("applications"); setSelected(new Set()); }}>入會申請（{applications?.length ?? 0}）</Button>
            <Button type="button" variant={tab === "reservations" ? "default" : "outline"} onClick={() => { setTab("reservations"); setSelected(new Set()); }}>預約名單（{reservations?.length ?? 0}）</Button>
            {selected.size > 0 && (
              <Button type="button" variant="destructive" onClick={() => void removeRows(Array.from(selected))} disabled={deleting}>
                <Trash2 />刪除所選（{selected.size}）
              </Button>
            )}
            <Button type="button" variant="outline" className="sm:ml-auto" onClick={() => void load(passcode)} disabled={loading}><RefreshCw className={loading ? "animate-spin" : ""} />重新整理</Button>
          </div>
          <label className="relative mt-4 block">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full rounded-xl border border-input bg-card/60 py-3 pl-10 pr-4 text-sm outline-none focus:border-primary/70" placeholder="搜尋姓名、電話、Email、LINE 或公司" />
          </label>

          {tab === "applications" && <div className="mt-6 space-y-5">
            {visibleApplications.length === 0 && <p className="text-sm text-muted-foreground">找不到符合的申請資料。</p>}
            {visibleApplications.map((a) => {
              const summary = [`入會申請｜${a.full_name}`, `送件：${new Date(a.created_at).toLocaleString("zh-TW")}`, `電話：${a.phone ?? "—"}`, `LINE / WeChat：${a.messenger ?? "—"}`, `Email：${a.business_email}`, `職稱／企業：${a.title_company}`, `關注板塊：${a.pillars}`, `交流時段：${a.meeting_time_pref ?? "—"}`].join("\n");
              return <article key={a.id} className={card}>
                <div className="flex flex-col gap-5 sm:flex-row">
                  <div className="flex gap-3"><Photo label="生活照" url={a.life_photo_url} /><Photo label="大頭照" url={a.headshot_url} /></div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3"><div className="flex items-start gap-2"><input type="checkbox" aria-label={`選取 ${a.full_name}`} checked={selected.has(a.id)} onChange={() => toggleSelect(a.id)} className="mt-1.5 h-4 w-4 accent-primary" /><div><h2 className="text-lg font-medium text-foreground">{a.full_name}</h2><p className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleString("zh-TW")}</p></div></div><div className="flex gap-2"><Button type="button" size="sm" variant="outline" onClick={() => void copyText(summary)}><Copy />複製摘要</Button><Button type="button" size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => void removeRows([a.id])} disabled={deleting}><Trash2 />刪除</Button></div></div>
                    <div className="mt-3 flex flex-wrap gap-2">{a.phone && <ContactLink icon={Phone} label="撥電話" href={`tel:${a.phone}`} />}{a.business_email && <ContactLink icon={Mail} label="寄 Email" href={`mailto:${a.business_email}`} />}{a.messenger && <ContactLink icon={MessageCircle} label="開啟 LINE" href={`https://line.me/ti/p/~${encodeURIComponent(a.messenger)}`} />}</div>
                    <div className="mt-3"><Row label="出生年月日" value={a.birth_date} /><Row label="職稱／企業" value={a.title_company} /><Row label="主要行業" value={a.industry} /><Row label="私人手機" value={a.phone} /><Row label="WeChat / LINE" value={a.messenger} /><Row label="電子郵件" value={a.business_email} /><Row label="持有證照" value={a.licenses} /><Row label="感興趣板塊" value={a.pillars} /><Row label="核心價值" value={a.core_value} /><Row label="過往社群" value={a.prior_orgs} /><Row label="推薦人" value={a.referrer} /><Row label="交流時段" value={a.meeting_time_pref} /><Row label="交流禮儀" value={a.agree_etiquette} /><Row label="資料屬實" value={a.agree_truthful} /><Row label="認同家規" value={a.agree_house_rules} /></div>
                  </div>
                </div>
              </article>;
            })}
          </div>}

          {tab === "reservations" && <div className="mt-6 space-y-5">
            {visibleReservations.length === 0 && <p className="text-sm text-muted-foreground">找不到符合的預約資料。</p>}
            {visibleReservations.map((r) => {
              const summary = [`預約｜${r.name}`, `送件：${new Date(r.created_at).toLocaleString("zh-TW")}`, `電話：${r.phone}`, `LINE：${r.line_id ?? "—"}`, `Email：${r.email}`, `需求：${r.intent}`, `方案：${r.plan}`].join("\n");
              return <article key={r.id} className={card}><div className="flex flex-wrap items-start justify-between gap-3"><div className="flex items-start gap-2"><input type="checkbox" aria-label={`選取 ${r.name}`} checked={selected.has(r.id)} onChange={() => toggleSelect(r.id)} className="mt-1.5 h-4 w-4 accent-primary" /><div><h2 className="text-lg font-medium text-foreground">{r.name}</h2><p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString("zh-TW")}</p></div></div><div className="flex gap-2"><Button type="button" size="sm" variant="outline" onClick={() => void copyText(summary)}><Copy />複製摘要</Button><Button type="button" size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => void removeRows([r.id])} disabled={deleting}><Trash2 />刪除</Button></div></div><div className="mt-3 flex flex-wrap gap-2"><ContactLink icon={Phone} label="撥電話" href={`tel:${r.phone}`} /><ContactLink icon={Mail} label="寄 Email" href={`mailto:${r.email}`} />{r.line_id && <ContactLink icon={MessageCircle} label="開啟 LINE" href={`https://line.me/ti/p/~${encodeURIComponent(r.line_id)}`} />}</div><div className="mt-3"><Row label="手機" value={r.phone} /><Row label="電子郵件" value={r.email} /><Row label="LINE ID" value={r.line_id} /><Row label="產業／職務" value={r.industry} /><Row label="興趣／專長" value={r.interests} /><Row label="感興趣原因" value={r.reasons} /><Row label="我想要" value={r.intent} /><Row label="方案" value={r.plan} /><Row label="留言" value={r.message} /></div></article>;
            })}
          </div>}
        </>
      )}
    </main>
  );
}