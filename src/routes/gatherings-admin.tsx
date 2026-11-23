import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { field, glass, useTeacherUpload } from "@/components/academy-ui";
import { getGatheringsAdmin, gatheringsAdminAction } from "@/lib/gatherings.functions";
import { formedCount, WISH_LABEL, PERFORMER_KINDS, STATUSES, THEMES, gatheringSchema, gatheringState, performerSchema, pollSchema, type GatheringInput, type PerformerInput, type PollInput } from "@/lib/gatherings";
import { REGIONS, studentKey } from "@/lib/academy";
import { getEnteredAdminPasscode } from "@/lib/admin-mode";

export const Route = createFileRoute("/gatherings-admin")({
  head: () => ({
    meta: [
      { title: "聚會後台｜獵光者 未來俱樂部" },
      { name: "description", content: "高質量聯誼內部後台：投票成團、活動、表演人員、報名付款出席與統計。" },
      { property: "og:title", content: "聚會後台｜獵光者 未來俱樂部" },
      { property: "og:description", content: "投票成團、活動與表演人員、報名統計管理。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type Data = Awaited<ReturnType<typeof getGatheringsAdmin>>;
type Action = Record<string, unknown> & { type: string };
const TABS = ["活動", "投票", "表演人員", "名單與統計", "許願"] as const;
const STATUS_LABEL: Record<string, string> = { open: "正常（依人數自動判斷）", failed: "未成團", cancelled: "取消", rescheduled: "改期" };
const emptyG: GatheringInput = { theme: "聯誼", title: "", description: "", region: "北部", event_date: "", start_time: "", end_time: "", location: "", map_url: "", min_people: 0, capacity: 0, fee: 0, payment_note: "", payment_url: "", perks: "", performer_ids: [], status: "open", status_note: "", is_published: true, rideshare_enabled: true, meet_point: "", location_photo_path: "", payment_qr_path: "" };
const emptyP: PerformerInput = { name: "", kind: "DJ", summary: "", photo_path: "", is_published: true };
const emptyPoll: PollInput = { theme: "聯誼", title: "", description: "", region: "", is_open: true, options: [] };
const chip = (on: boolean) => `rounded-full border px-3 py-1 text-sm ${on ? "border-primary bg-primary/15 text-primary" : "border-border/70 text-muted-foreground"}`;
const L = ({ children }: { children: React.ReactNode }) => <p className="mb-1 text-xs text-gold-soft">{children}</p>;

function AdminPage() {
  const load = useServerFn(getGatheringsAdmin);
  const act = useServerFn(gatheringsAdminAction);
  const upload = useTeacherUpload();
  const [pass, setPass] = useState("");
  useEffect(() => { setPass(getEnteredAdminPasscode() ?? ""); }, []);
  const [data, setData] = useState<Data | null>(null);
  const [tab, setTab] = useState<(typeof TABS)[number]>("活動");
  const [editG, setEditG] = useState<{ id: string | null; v: GatheringInput; closePollId: string | null } | null>(null);
  const [pv, setPv] = useState<{ loc: string; qr: string }>({ loc: "", qr: "" });
  const [editP, setEditP] = useState<{ id: string | null; v: PerformerInput; preview: string } | null>(null);
  const [editPoll, setEditPoll] = useState<{ id: string | null; v: PollInput } | null>(null);
  const [fG, setFG] = useState("全部"); const [fT, setFT] = useState("全部"); const [fM, setFM] = useState("");

  const refresh = async (p = pass) => { try { setData(await load({ data: { passcode: p } })); } catch { toast.error("密碼錯誤或資料載入失敗"); } };
  const run = async (a: Action, ok = "已更新") => {
    try { await act({ data: { passcode: pass, ...a } as never }); toast.success(ok); await refresh(); return true; }
    catch { toast.error("操作失敗"); return false; }
  };
  const del = (a: Action) => { if (confirm("確定刪除？此動作無法復原")) void run(a, "已刪除"); };

  if (!data) return (
    <div className="mx-auto max-w-sm px-5 py-24">
      <h1 className="text-2xl">聚會後台</h1>
      <form className="mt-6 space-y-3" onSubmit={(e) => { e.preventDefault(); void refresh(); }}>
        <Input type="password" className={field} placeholder="管理者密碼" value={pass} onChange={(e) => setPass(e.target.value)} />
        <Button type="submit" className="w-full rounded-full bg-gold-gradient text-primary-foreground">進入</Button>
      </form>
    </div>
  );

  const counts: Record<string, number> = {};
  const paidC: Record<string, number> = {};
  data.registrations.forEach((r) => { counts[r.gathering_id] = (counts[r.gathering_id] ?? 0) + 1; if (r.paid) paidC[r.gathering_id] = (paidC[r.gathering_id] ?? 0) + 1; });
  const gMap = new Map(data.gatherings.map((g) => [g.id, g]));
  const regs = data.registrations.filter((r) => {
    const g = gMap.get(r.gathering_id);
    return g && (fG === "全部" || g.id === fG) && (fT === "全部" || g.theme === fT) && (!fM || g.event_date.startsWith(fM));
  });
  const shownG = data.gatherings.filter((g) => (fG === "全部" || g.id === fG) && (fT === "全部" || g.theme === fT) && (!fM || g.event_date.startsWith(fM)));
  const regulars = Object.values(regs.reduce<Record<string, { name: string; phone: string; n: number; att: number }>>((m, r) => {
    const k = studentKey(r.phone); const x = m[k] ?? { name: r.name, phone: r.phone, n: 0, att: 0 };
    x.n += 1; if (r.attended) x.att += 1; m[k] = x; return m;
  }, {})).sort((a, b) => b.n - a.n);

  const saveG = async () => {
    if (!editG) return;
    const p = gatheringSchema.safeParse(editG.v);
    if (!p.success) { toast.error(p.error.issues[0]?.message ?? "請檢查欄位"); return; }
    if (await run({ type: "saveGathering", id: editG.id, gathering: p.data, closePollId: editG.closePollId }, "活動已儲存")) setEditG(null);
  };
  const saveP = async () => {
    if (!editP) return;
    const p = performerSchema.safeParse(editP.v);
    if (!p.success) { toast.error(p.error.issues[0]?.message ?? "請檢查欄位"); return; }
    if (await run({ type: "savePerformer", id: editP.id, performer: p.data }, "已儲存")) setEditP(null);
  };
  const savePoll = async () => {
    if (!editPoll) return;
    const p = pollSchema.safeParse(editPoll.v);
    if (!p.success) { toast.error(p.error.issues[0]?.message ?? "請檢查欄位"); return; }
    if (await run({ type: "savePoll", id: editPoll.id, poll: p.data }, "投票已儲存")) setEditPoll(null);
  };
  const setG = <K extends keyof GatheringInput>(k: K, v: GatheringInput[K]) => editG && setEditG({ ...editG, v: { ...editG.v, [k]: v } });

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <h1 className="text-3xl">聚會後台</h1>
      <div className="mt-6 flex flex-wrap gap-2">{TABS.map((t) => <button key={t} type="button" onClick={() => setTab(t)} className={chip(tab === t)}>{t}</button>)}</div>

      {tab === "活動" && (
        <div className="mt-6 space-y-3">
          <Button onClick={() => { setPv({ loc: "", qr: "" }); setEditG({ id: null, v: emptyG, closePollId: null }); }} className="rounded-full bg-gold-gradient text-primary-foreground">新增活動</Button>
          {data.gatherings.length === 0 && <p className="text-muted-foreground">尚無活動</p>}
          {data.gatherings.map((g) => (
            <div key={g.id} className={`${glass} flex flex-wrap items-center gap-3 p-4`}>
              <div className="min-w-0 flex-1">
                <p className="text-gold-soft">{g.title} <span className="text-xs text-muted-foreground">{g.event_date} {g.theme}・{g.region}</span></p>
                <p className="text-xs text-muted-foreground">報名 {counts[g.id] ?? 0}{g.fee > 0 && `・已付款 ${paidC[g.id] ?? 0}`}{g.min_people > 0 && ` / 成團 ${g.min_people}`}{g.capacity > 0 && ` / 上限 ${g.capacity}`}・{gatheringState(g.status, g.min_people, formedCount(g.fee, counts[g.id] ?? 0, paidC[g.id] ?? 0))}{!g.is_published && "・未公開"}</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => { const { id, created_at, location_photo_url, payment_qr_url, ...v } = g; void created_at; setPv({ loc: location_photo_url, qr: payment_qr_url }); setEditG({ id, v: v as GatheringInput, closePollId: null }); }}>編輯</Button>
              <Button size="sm" variant="destructive" onClick={() => del({ type: "deleteGathering", id: g.id })}>刪除</Button>
            </div>
          ))}
        </div>
      )}

      {tab === "投票" && (
        <div className="mt-6 space-y-3">
          <Button onClick={() => setEditPoll({ id: null, v: emptyPoll })} className="rounded-full bg-gold-gradient text-primary-foreground">新增投票</Button>
          {data.polls.length === 0 && <p className="text-muted-foreground">尚無投票</p>}
          {data.polls.map((p) => (
            <div key={p.id} className={`${glass} p-4`}>
              <div className="flex flex-wrap items-center gap-2">
                <p className="flex-1 text-gold-soft">{p.title} <span className="text-xs text-muted-foreground">{p.theme}{p.region && `・${p.region}`}・{p.is_open ? "開放中" : "已關閉"}</span></p>
                <Button size="sm" variant="outline" onClick={() => run({ type: "savePoll", id: p.id, poll: { theme: p.theme, title: p.title, description: p.description, region: p.region, is_open: !p.is_open, options: p.options.map((o) => ({ id: o.id, option_date: o.option_date, start_time: o.start_time, end_time: o.end_time })) } })}>{p.is_open ? "關閉投票" : "重新開放"}</Button>
                <Button size="sm" variant="outline" onClick={() => setEditPoll({ id: p.id, v: { theme: p.theme as PollInput["theme"], title: p.title, description: p.description, region: p.region as PollInput["region"], is_open: p.is_open, options: p.options.map((o) => ({ id: o.id, option_date: o.option_date, start_time: o.start_time, end_time: o.end_time })) } })}>編輯</Button>
                <Button size="sm" variant="destructive" onClick={() => del({ type: "deletePoll", id: p.id })}>刪除</Button>
              </div>
              <div className="mt-3 space-y-1.5">
                {p.options.map((o) => (
                  <div key={o.id} className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="flex-1">{o.option_date} {[o.start_time, o.end_time].filter(Boolean).join("–")}　<span className="text-primary">{o.votes} 票</span></span>
                    <Button size="sm" className="rounded-full bg-gold-gradient text-primary-foreground" onClick={() => setEditG({ id: null, closePollId: p.id, v: { ...emptyG, theme: p.theme as GatheringInput["theme"], title: p.title, description: p.description, region: (p.region || "北部") as GatheringInput["region"], event_date: o.option_date, start_time: o.start_time, end_time: o.end_time } })}>一鍵轉為正式活動</Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "表演人員" && (
        <div className="mt-6 space-y-3">
          <Button onClick={() => setEditP({ id: null, v: emptyP, preview: "" })} className="rounded-full bg-gold-gradient text-primary-foreground">新增表演人員</Button>
          {data.performers.length === 0 && <p className="text-muted-foreground">尚無表演人員</p>}
          {data.performers.map((p) => (
            <div key={p.id} className={`${glass} flex flex-wrap items-center gap-3 p-4`}>
              {p.photo_url ? <img src={p.photo_url} alt="" className="size-12 rounded-full object-cover" /> : <div className="size-12 rounded-full bg-muted" />}
              <p className="flex-1 text-gold-soft">{p.name} <span className="text-xs text-muted-foreground">{p.kind}</span></p>
              <label className="flex items-center gap-1.5 text-sm"><input type="checkbox" checked={p.is_published} onChange={(e) => run({ type: "savePerformer", id: p.id, performer: { name: p.name, kind: p.kind, summary: p.summary, photo_path: p.photo_path, is_published: e.target.checked } })} />公開</label>
              <Button size="sm" variant="outline" onClick={() => setEditP({ id: p.id, v: { name: p.name, kind: p.kind, summary: p.summary, photo_path: p.photo_path, is_published: p.is_published }, preview: p.photo_url })}>編輯</Button>
              <Button size="sm" variant="destructive" onClick={() => del({ type: "deletePerformer", id: p.id })}>刪除</Button>
            </div>
          ))}
        </div>
      )}

      {tab === "名單與統計" && (
        <div className="mt-6 space-y-6">
          <div className="flex flex-wrap gap-2">
            <select className={`${field} w-auto`} value={fG} onChange={(e) => setFG(e.target.value)}><option value="全部">全部活動</option>{data.gatherings.map((g) => <option key={g.id} value={g.id}>{g.event_date} {g.title}</option>)}</select>
            <select className={`${field} w-auto`} value={fT} onChange={(e) => setFT(e.target.value)}><option value="全部">全部主題</option>{THEMES.map((t) => <option key={t}>{t}</option>)}</select>
            <Input type="month" className={`${field} w-auto`} value={fM} onChange={(e) => setFM(e.target.value)} />
          </div>
          <div className={`${glass} overflow-x-auto p-4`}>
            <h2 className="text-lg">各場次統計</h2>
            <table className="mt-3 w-full text-sm"><thead className="text-left text-xs text-muted-foreground"><tr><th>活動</th><th>報名</th><th>已付款</th><th>已出席</th><th>成團狀態</th></tr></thead>
              <tbody>{shownG.map((g) => { const rs = data.registrations.filter((r) => r.gathering_id === g.id); return (
                <tr key={g.id} className="border-t border-border/40"><td className="py-1.5">{g.event_date} {g.title}</td><td>{rs.length}</td><td>{rs.filter((r) => r.paid).length}</td><td>{rs.filter((r) => r.attended).length}</td><td>{gatheringState(g.status, g.min_people, formedCount(g.fee, rs.length, rs.filter((r) => r.paid).length))}</td></tr>); })}</tbody></table>
          </div>
          {regulars.length > 0 && <div className={`${glass} p-4`}><h2 className="text-lg">常客紀錄</h2>
            <div className="mt-3 space-y-1 text-sm">{regulars.slice(0, 30).map((s) => <p key={s.phone}>{s.name}・{s.phone}　<span className="text-primary">報名 {s.n} 次・出席 {s.att} 次</span></p>)}</div></div>}
          <div className="space-y-2">
            <h2 className="text-lg">報名名單（{regs.length}）</h2>
            {regs.map((r) => (
              <div key={r.id} className={`${glass} flex flex-wrap items-center gap-3 p-3 text-sm`}>
                <div className="min-w-0 flex-1"><p className="text-gold-soft">{r.ride_role === "driver" && <span className="mr-1 rounded-full border border-primary/50 px-2 text-xs text-primary">車主 {r.seats} 座</span>}{r.ride_role === "passenger" && <span className="mr-1 rounded-full border border-primary/50 px-2 text-xs text-primary">乘客</span>}{r.name}・{r.phone}{r.messenger && `・${r.messenger}`}{r.email && `・${r.email}`}</p>
                  <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString("zh-TW")}・{gMap.get(r.gathering_id)?.title}{r.note && `｜${r.note}`}</p>
                  {r.ride_role === "driver" && <p className="text-xs text-muted-foreground">集合 {r.ride_meet_location}{r.ride_meet_time && ` ${r.ride_meet_time}`}{r.ride_conditions && `｜${r.ride_conditions}`}・查詢碼 {r.driver_code}・已載 {data.registrations.filter((x) => x.ride_driver_id === r.id).length} 人{r.agree_ride_safety && "・已同意安全提醒"}</p>}
                  {r.ride_role === "passenger" && <p className="text-xs text-muted-foreground">搭乘 {data.registrations.find((x) => x.id === r.ride_driver_id)?.name ?? "（車主紀錄已刪除）"}{r.agree_ride_safety && "・已同意安全提醒"}</p>}</div>
                <label className="flex items-center gap-1"><input type="checkbox" checked={r.paid} onChange={(e) => run({ type: "setRegFlag", id: r.id, field: "paid", value: e.target.checked })} />已付款</label>
                <label className="flex items-center gap-1"><input type="checkbox" checked={r.attended} onChange={(e) => run({ type: "setRegFlag", id: r.id, field: "attended", value: e.target.checked })} />已出席</label>
                <Button size="sm" variant="destructive" onClick={() => del({ type: "deleteRegistration", id: r.id })}>刪除</Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "許願" && (
        <div className="mt-6 space-y-2">
          {data.wishes.length === 0 && <p className="text-muted-foreground">尚無許願</p>}
          {data.wishes.map((w) => (
            <div key={w.id} className={`${glass} flex flex-wrap items-center gap-3 p-3 text-sm`}>
              <div className="min-w-0 flex-1"><p className="text-gold-soft"><span className="mr-2 rounded-full border border-primary/50 px-2 text-xs text-primary">{WISH_LABEL[w.status] ?? w.status}</span>{w.theme}{w.nickname && `・${w.nickname}`}{w.contact && `・${w.contact}`}</p>
                <p className="whitespace-pre-line text-muted-foreground">{w.content}</p>
                {w.meet_location && <p className="text-xs text-muted-foreground">建議集合地點：{w.meet_location}</p>}
                {w.conditions && <p className="text-xs text-muted-foreground">參與條件／限制：{w.conditions}</p>}
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">已集氣 {w.joins.length} 人・最低成團
                  <input type="number" min={0} defaultValue={w.min_people} className="w-16 rounded border border-border bg-background px-1" onBlur={(e) => { const n = Number(e.target.value) || 0; if (n !== w.min_people) void run({ type: "setWishMin", id: w.id, min_people: n }, "已更新成團人數"); }} /> 人（0 不限）</div>
                <p className="text-xs text-muted-foreground">{new Date(w.created_at).toLocaleString("zh-TW")}</p></div>
              {w.status !== "approved" && <Button size="sm" variant="outline" onClick={() => run({ type: "setWishStatus", id: w.id, status: "approved" }, "已核准公開")}>核准公開</Button>}
              {w.status === "approved" && <Button size="sm" variant="outline" onClick={() => setEditPoll({ id: null, v: { ...emptyPoll, theme: w.theme as PollInput["theme"], title: w.content.slice(0, 60), description: [w.content, w.meet_location && `建議集合地點：${w.meet_location}`, w.conditions && `參與條件／限制：${w.conditions}`].filter(Boolean).join("\n") } })}>轉入投票</Button>}
              {w.status === "approved" && <Button size="sm" className="rounded-full bg-gold-gradient text-primary-foreground" onClick={() => { setPv({ loc: "", qr: "" }); setEditG({ id: null, closePollId: null, v: { ...emptyG, theme: w.theme as GatheringInput["theme"], title: w.content.slice(0, 60), description: [w.content, w.conditions && `參與條件／限制：${w.conditions}`].filter(Boolean).join("\n"), meet_point: w.meet_location, min_people: w.min_people } }); }}>一鍵轉為正式活動</Button>}
              {w.status !== "rejected" && <Button size="sm" variant="outline" onClick={() => run({ type: "setWishStatus", id: w.id, status: "rejected" }, "已駁回並隱藏")}>駁回／隱藏</Button>}
              <Button size="sm" variant="destructive" onClick={() => del({ type: "deleteWish", id: w.id })}>刪除</Button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!editG} onOpenChange={(o) => !o && setEditG(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-border/60 bg-background">
          <DialogHeader><DialogTitle>{editG?.id ? "編輯活動" : "新增活動"}</DialogTitle></DialogHeader>
          {editG && <div className="space-y-3">
            <div className="flex flex-wrap gap-1.5">{THEMES.map((t) => <button key={t} type="button" className={chip(editG.v.theme === t)} onClick={() => setG("theme", t)}>{t}</button>)}</div>
            <Input className={field} placeholder="活動名稱 *" value={editG.v.title} onChange={(e) => setG("title", e.target.value)} />
            <Textarea className={field} rows={4} placeholder="活動介紹" value={editG.v.description} onChange={(e) => setG("description", e.target.value)} />
            <div className="flex flex-wrap gap-1.5">{REGIONS.map((r) => <button key={r} type="button" className={chip(editG.v.region === r)} onClick={() => setG("region", r)}>{r}</button>)}</div>
            <div className="grid grid-cols-3 gap-2"><Input type="date" className={field} value={editG.v.event_date} onChange={(e) => setG("event_date", e.target.value)} /><Input type="time" className={field} value={editG.v.start_time} onChange={(e) => setG("start_time", e.target.value)} /><Input type="time" className={field} value={editG.v.end_time} onChange={(e) => setG("end_time", e.target.value)} /></div>
            <Input className={field} placeholder="活動地址（海邊、公園可填大概位置）" value={editG.v.location} onChange={(e) => setG("location", e.target.value)} />
            <Input className={field} placeholder="Google 地圖連結（選填，不填會用地點自動搜尋）" value={editG.v.map_url} onChange={(e) => setG("map_url", e.target.value)} />
            <PhotoPick label="地點參考照片（選填）" path={editG.v.location_photo_path} preview={pv.loc} upload={upload} onChange={(path, url) => { setG("location_photo_path", path); setPv({ ...pv, loc: url }); }} />
            <div className="grid grid-cols-3 gap-2">
              <div><L>最低成團人數（0 不限）</L><Input type="number" min={0} className={field} value={editG.v.min_people} onChange={(e) => setG("min_people", Number(e.target.value) || 0)} /></div>
              <div><L>人數上限（0 不限）</L><Input type="number" min={0} className={field} value={editG.v.capacity} onChange={(e) => setG("capacity", Number(e.target.value) || 0)} /></div>
              <div><L>費用 NT$（0 免費）</L><Input type="number" min={0} className={field} value={editG.v.fee} onChange={(e) => setG("fee", Number(e.target.value) || 0)} /></div>
            </div>
            <Textarea className={field} rows={2} placeholder="付款說明（例：轉帳帳號、現場付款）" value={editG.v.payment_note} onChange={(e) => setG("payment_note", e.target.value)} />
            <Input className={field} placeholder="線上付款連結（https，選填）" value={editG.v.payment_url} onChange={(e) => setG("payment_url", e.target.value)} />
            <PhotoPick label="付款 QR／條碼圖片（選填，成團後才對訪客顯示）" path={editG.v.payment_qr_path} preview={pv.qr} upload={upload} onChange={(path, url) => { setG("payment_qr_path", path); setPv({ ...pv, qr: url }); }} />
            {editG.v.fee > 0 && <p className="text-xs text-muted-foreground">付費活動：報名達最低成團人數才顯示付款；在名單勾選「已付款」達門檻才算成團。</p>}
            <Textarea className={field} rows={2} placeholder="抽獎／優惠資訊（選填）" value={editG.v.perks} onChange={(e) => setG("perks", e.target.value)} />
            {data.performers.length > 0 && <div><L>表演人員</L><div className="flex flex-wrap gap-1.5">{data.performers.map((p) => { const on = editG.v.performer_ids.includes(p.id); return <button key={p.id} type="button" className={chip(on)} onClick={() => setG("performer_ids", on ? editG.v.performer_ids.filter((x) => x !== p.id) : [...editG.v.performer_ids, p.id])}>{p.name}</button>; })}</div></div>}
            <div><L>成團狀態</L><select className={field} value={editG.v.status} onChange={(e) => setG("status", e.target.value as GatheringInput["status"])}>{STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}</select></div>
            <Input className={field} placeholder="狀態說明（例：改期至 12/20，選填）" value={editG.v.status_note} onChange={(e) => setG("status_note", e.target.value)} />
            <Input className={field} placeholder="集合地點（選填）" value={editG.v.meet_point} onChange={(e) => setG("meet_point", e.target.value)} />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editG.v.rideshare_enabled} onChange={(e) => setG("rideshare_enabled", e.target.checked)} />開放順道搭乘／載人</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editG.v.is_published} onChange={(e) => setG("is_published", e.target.checked)} />公開於行事曆</label>
            <Button onClick={saveG} className="w-full rounded-full bg-gold-gradient text-primary-foreground">儲存活動</Button>
          </div>}
        </DialogContent>
      </Dialog>

      <Dialog open={!!editPoll} onOpenChange={(o) => !o && setEditPoll(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-border/60 bg-background">
          <DialogHeader><DialogTitle>{editPoll?.id ? "編輯投票" : "新增投票"}</DialogTitle></DialogHeader>
          {editPoll && <div className="space-y-3">
            <div className="flex flex-wrap gap-1.5">{THEMES.map((t) => <button key={t} type="button" className={chip(editPoll.v.theme === t)} onClick={() => setEditPoll({ ...editPoll, v: { ...editPoll.v, theme: t } })}>{t}</button>)}</div>
            <Input className={field} placeholder="投票主題 *" value={editPoll.v.title} onChange={(e) => setEditPoll({ ...editPoll, v: { ...editPoll.v, title: e.target.value } })} />
            <Textarea className={field} rows={2} placeholder="說明（選填）" value={editPoll.v.description} onChange={(e) => setEditPoll({ ...editPoll, v: { ...editPoll.v, description: e.target.value } })} />
            <div className="flex flex-wrap gap-1.5">{(["", ...REGIONS] as const).map((r) => <button key={r || "none"} type="button" className={chip(editPoll.v.region === r)} onClick={() => setEditPoll({ ...editPoll, v: { ...editPoll.v, region: r } })}>{r || "不限地區"}</button>)}</div>
            <L>候選日期／時段</L>
            {editPoll.v.options.map((o, i) => (
              <div key={o.id ?? i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2">
                {(["option_date", "start_time", "end_time"] as const).map((k) => <Input key={k} type={k === "option_date" ? "date" : "time"} className={field} value={o[k]} onChange={(e) => setEditPoll({ ...editPoll, v: { ...editPoll.v, options: editPoll.v.options.map((x, j) => (j === i ? { ...x, [k]: e.target.value } : x)) } })} />)}
                <button type="button" aria-label="移除" onClick={() => setEditPoll({ ...editPoll, v: { ...editPoll.v, options: editPoll.v.options.filter((_, j) => j !== i) } })}><X className="size-4" /></button>
              </div>
            ))}
            <Button variant="outline" onClick={() => setEditPoll({ ...editPoll, v: { ...editPoll.v, options: [...editPoll.v.options, { id: null, option_date: "", start_time: "", end_time: "" }] } })}>新增時段</Button>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editPoll.v.is_open} onChange={(e) => setEditPoll({ ...editPoll, v: { ...editPoll.v, is_open: e.target.checked } })} />開放投票</label>
            <Button onClick={savePoll} className="w-full rounded-full bg-gold-gradient text-primary-foreground">儲存投票</Button>
          </div>}
        </DialogContent>
      </Dialog>

      <Dialog open={!!editP} onOpenChange={(o) => !o && setEditP(null)}>
        <DialogContent className="border-border/60 bg-background">
          <DialogHeader><DialogTitle>{editP?.id ? "編輯表演人員" : "新增表演人員"}</DialogTitle></DialogHeader>
          {editP && <div className="space-y-3">
            {editP.v.photo_path ? <div className="relative w-fit"><img src={editP.preview} alt="" className="size-24 rounded-xl object-cover" /><button type="button" aria-label="移除" onClick={() => setEditP({ ...editP, v: { ...editP.v, photo_path: "" }, preview: "" })} className="absolute -right-2 -top-2 rounded-full bg-background p-1"><X className="size-3" /></button></div>
              : <label className="flex size-24 cursor-pointer items-center justify-center rounded-xl border border-dashed border-primary/50 text-primary"><ImagePlus className="size-6" />
                <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; try { const p = await upload(f); setEditP({ ...editP, v: { ...editP.v, photo_path: p }, preview: URL.createObjectURL(f) }); } catch (err) { toast.error(err instanceof Error ? err.message : "上傳失敗"); } }} /></label>}
            <Input className={field} placeholder="姓名／藝名 *" value={editP.v.name} onChange={(e) => setEditP({ ...editP, v: { ...editP.v, name: e.target.value } })} />
            <div className="flex flex-wrap gap-1.5">{PERFORMER_KINDS.map((k) => <button key={k} type="button" className={chip(editP.v.kind === k)} onClick={() => setEditP({ ...editP, v: { ...editP.v, kind: k } })}>{k}</button>)}</div>
            <Textarea className={field} rows={3} placeholder="簡介" value={editP.v.summary} onChange={(e) => setEditP({ ...editP, v: { ...editP.v, summary: e.target.value } })} />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editP.v.is_published} onChange={(e) => setEditP({ ...editP, v: { ...editP.v, is_published: e.target.checked } })} />公開</label>
            <Button onClick={saveP} className="w-full rounded-full bg-gold-gradient text-primary-foreground">儲存</Button>
          </div>}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PhotoPick({ label, path, preview, upload, onChange }: { label: string; path: string; preview: string; upload: (f: File) => Promise<string>; onChange: (path: string, url: string) => void }) {
  return (
    <div><L>{label}</L>
      {path ? <div className="relative w-fit"><img src={preview} alt="" className="h-24 rounded-xl object-cover" /><button type="button" aria-label="移除" onClick={() => onChange("", "")} className="absolute -right-2 -top-2 rounded-full bg-background p-1"><X className="size-3" /></button></div>
        : <label className="flex size-24 cursor-pointer items-center justify-center rounded-xl border border-dashed border-primary/50 text-primary"><ImagePlus className="size-6" />
          <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; try { onChange(await upload(f), URL.createObjectURL(f)); } catch (err) { toast.error(err instanceof Error ? err.message : "上傳失敗"); } }} /></label>}
    </div>
  );
}
