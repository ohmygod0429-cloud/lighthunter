import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { MapPin } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { field, glass } from "@/components/academy-ui";
import { castVote, getGatheringsPublic, registerGathering, submitWish } from "@/lib/gatherings.functions";
import { THEMES, canRegister, gatheringState } from "@/lib/gatherings";
import { REGIONS, mapLink } from "@/lib/academy";

export const Route = createFileRoute("/gatherings")({
  head: () => ({
    meta: [
      { title: "高質量聯誼・生活聚會行事曆｜獵光者 未來俱樂部" },
      { name: "description", content: "逛夜市、踏青、遛狗、海邊烤肉、桌遊、聯誼與育嬰交流：投票集氣、查看成團進度並線上報名。" },
      { property: "og:title", content: "高質量聯誼・生活聚會行事曆｜獵光者 未來俱樂部" },
      { property: "og:description", content: "投票決定下一場聚會，查看成團進度並線上報名。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: () => getGatheringsPublic(),
  errorComponent: () => <div className="p-10 text-center text-muted-foreground">資料暫時無法載入，請稍後再試。</div>,
  component: GatheringsPage,
});

type Data = Awaited<ReturnType<typeof getGatheringsPublic>>;
type G = Data["gatherings"][number];
type P = Data["performers"][number];
const errMsg = (e: unknown, d: string) => (e instanceof Error ? e.message.replace(/^.*?"message":"([^"]+)".*$/s, "$1") : d);
const chip = (on: boolean) => `rounded-full border px-4 py-1.5 text-sm ${on ? "border-primary bg-primary/15 text-primary" : "border-border/70 text-muted-foreground"}`;
const fmtTime = (a: string, b: string) => [a, b].filter(Boolean).join("–");

function voterKey() {
  let k = localStorage.getItem("lh-voter");
  if (!k) { k = crypto.randomUUID(); localStorage.setItem("lh-voter", k); }
  return k;
}

function GatheringsPage() {
  const data = Route.useLoaderData();
  const router = useRouter();
  const refresh = () => router.invalidate();
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = data.gatherings.filter((g) => g.event_date >= today);
  const themes = THEMES.filter((t) => upcoming.some((g) => g.theme === t));
  const regions = REGIONS.filter((r) => upcoming.some((g) => g.region === r));
  const [theme, setTheme] = useState("全部");
  const [region, setRegion] = useState("全部");
  const list = upcoming.filter((g) => (theme === "全部" || g.theme === theme) && (region === "全部" || g.region === region));
  const perfMap = new Map(data.performers.map((p) => [p.id, p]));

  return (
    <div className="starburst mx-auto max-w-6xl px-5 py-20">
      <p className="text-xs tracking-[0.3em] text-primary">CURATED GATHERINGS</p>
      <h1 className="mt-4 text-3xl sm:text-5xl">高質量聯誼・生活聚會</h1>

      {upcoming.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl">活動行事曆</h2>
          {themes.length > 1 && <div className="mt-5 flex flex-wrap gap-2">{["全部", ...themes].map((t) => <button key={t} type="button" className={chip(theme === t)} onClick={() => setTheme(t)}>{t}</button>)}</div>}
          {regions.length > 1 && <div className="mt-3 flex flex-wrap gap-2">{["全部", ...regions].map((r) => <button key={r} type="button" className={chip(region === r)} onClick={() => setRegion(r)}>{r}</button>)}</div>}
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {list.map((g) => <EventCard key={g.id} g={g} performers={g.performer_ids.map((id) => perfMap.get(id)).filter((p): p is P => !!p)} onDone={refresh} />)}
          </div>
        </section>
      )}

      {data.polls.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl">活動提案與時段投票</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">{data.polls.map((p) => <PollCard key={p.id} poll={p} onDone={refresh} />)}</div>
        </section>
      )}

      <section className="mt-16"><WishForm /></section>
    </div>
  );
}

function EventCard({ g, performers, onDone }: { g: G; performers: P[]; onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [reg, setReg] = useState(false);
  const state = gatheringState(g.status, g.min_people, g.registered);
  const can = canRegister(g.status, g.capacity, g.registered);
  const map = mapLink(g.location, g.map_url);
  const time = fmtTime(g.start_time, g.end_time);
  const progress = [`已報名 ${g.registered} 人`, g.min_people > 0 && `最低成團 ${g.min_people} 人`, g.capacity > 0 && `上限 ${g.capacity} 人`].filter(Boolean).join("・");
  return (
    <article className={`${glass} p-5`}>
      <div className="flex flex-wrap items-center gap-2 text-xs text-primary">
        <span>{g.event_date.replaceAll("-", "/")}</span>{time && <span>{time}</span>}
        <span className="rounded-full border border-primary/40 px-2">{g.theme}</span><span className="rounded-full border border-primary/40 px-2">{g.region}</span>
        <span className={`rounded-full px-2 ${state === "已成團" ? "bg-gold-gradient text-primary-foreground" : "border border-border/70 text-muted-foreground"}`}>{state === "集氣中" ? "集氣中・尚未成團" : state}</span>
      </div>
      <h3 className="mt-2 text-lg">{g.title}</h3>
      {g.status_note && <p className="mt-1 text-sm text-gold-soft">{g.status_note}</p>}
      {g.location && (map ? <a href={map} target="_blank" rel="noreferrer" className="mt-3 flex items-center gap-1.5 text-sm text-gold-soft hover:text-primary"><MapPin className="size-4" />{g.location}</a>
        : <p className="mt-3 flex items-center gap-1.5 text-sm text-gold-soft"><MapPin className="size-4" />{g.location}</p>)}
      <p className="mt-3 text-xs text-muted-foreground">{progress}</p>
      {g.capacity > 0 && <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full bg-gold-gradient" style={{ width: `${Math.min(100, (g.registered / g.capacity) * 100)}%` }} /></div>}
      {g.fee > 0 && <p className="mt-3 text-sm text-gold-soft">費用 NT$ {g.fee.toLocaleString()}</p>}
      <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
        <Button variant="outline" onClick={() => setOpen(true)} className="rounded-full border-primary/50 text-primary">活動詳情</Button>
        <Button disabled={!can} onClick={() => setReg(true)} className="rounded-full bg-gold-gradient text-primary-foreground">{can ? "我要報名" : "暫停報名"}</Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-border/60 bg-background">
          <DialogHeader><DialogTitle>{g.title}</DialogTitle></DialogHeader>
          {g.description && <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{g.description}</p>}
          {g.perks && <div className="rounded-xl border border-primary/40 p-3"><p className="text-sm text-primary">抽獎／優惠</p><p className="mt-1 whitespace-pre-line text-sm text-gold-soft">{g.perks}</p></div>}
          {performers.length > 0 && <div className="space-y-3"><p className="text-sm text-primary">表演人員</p>
            {performers.map((p) => <div key={p.id} className="flex gap-3">{p.photo_url && <img src={p.photo_url} alt={p.name} className="size-14 rounded-full object-cover" />}
              <div><p className="text-gold-soft">{p.name}{p.kind && <span className="ml-2 text-xs text-muted-foreground">{p.kind}</span>}</p>{p.summary && <p className="whitespace-pre-line text-xs text-muted-foreground">{p.summary}</p>}</div></div>)}</div>}
          {g.fee > 0 && g.payment_note && <p className="whitespace-pre-line text-sm text-muted-foreground">{g.payment_note}</p>}
        </DialogContent>
      </Dialog>
      <RegisterDialog open={reg} onOpenChange={setReg} g={g} onDone={onDone} />
    </article>
  );
}

function RegisterDialog({ open, onOpenChange, g, onDone }: { open: boolean; onOpenChange: (o: boolean) => void; g: G; onDone: () => void }) {
  const send = useServerFn(registerGathering);
  const empty = { name: "", phone: "", email: "", messenger: "", note: "" };
  const [f, setF] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    try { await send({ data: { gathering_id: g.id, ...f } }); setF(empty); setDone(true); onDone(); }
    catch (err) { toast.error(errMsg(err, "報名失敗")); }
    finally { setBusy(false); }
  };
  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) setDone(false); }}>
      <DialogContent className="border-border/60 bg-background">
        <DialogHeader><DialogTitle>報名・{g.title}</DialogTitle></DialogHeader>
        {done ? (
          <div className="space-y-3 text-sm">
            <p className="text-gold-soft">報名成功，我們會與您聯繫確認。</p>
            {g.fee > 0 && <p>費用 NT$ {g.fee.toLocaleString()}</p>}
            {g.fee > 0 && g.payment_note && <p className="whitespace-pre-line text-muted-foreground">{g.payment_note}</p>}
            {g.fee > 0 && g.payment_url && <a href={g.payment_url} target="_blank" rel="noreferrer" className="block rounded-full bg-gold-gradient px-4 py-2.5 text-center text-primary-foreground">前往線上付款</a>}
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            {g.fee > 0 && <p className="text-sm text-gold-soft">費用 NT$ {g.fee.toLocaleString()}（送出後顯示付款方式）</p>}
            <Input required className={field} placeholder="姓名 *" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
            <Input required className={field} placeholder="手機 *" inputMode="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
            <Input className={field} placeholder="電子郵件" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
            <Input className={field} placeholder="LINE／WeChat ID" value={f.messenger} onChange={(e) => setF({ ...f, messenger: e.target.value })} />
            <Textarea className={field} rows={2} placeholder="備註" value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} />
            <Button type="submit" disabled={busy} className="w-full rounded-full bg-gold-gradient text-primary-foreground">{busy ? "送出中…" : "送出報名"}</Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function PollCard({ poll, onDone }: { poll: Data["polls"][number]; onDone: () => void }) {
  const vote = useServerFn(castVote);
  const total = poll.options.reduce((s, o) => s + o.votes, 0);
  const go = async (id: string) => {
    try { await vote({ data: { option_id: id, voter_key: voterKey() } }); toast.success("已投票，感謝集氣"); onDone(); }
    catch (e) { toast.error(errMsg(e, "投票失敗")); }
  };
  return (
    <article className={`${glass} p-5`}>
      <div className="flex gap-2 text-xs text-primary"><span className="rounded-full border border-primary/40 px-2">{poll.theme}</span>{poll.region && <span className="rounded-full border border-primary/40 px-2">{poll.region}</span>}</div>
      <h3 className="mt-2 text-lg">{poll.title}</h3>
      {poll.description && <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{poll.description}</p>}
      <div className="mt-4 space-y-2">
        {poll.options.map((o) => (
          <button key={o.id} type="button" onClick={() => go(o.id)} className="relative block w-full overflow-hidden rounded-xl border border-border/70 px-4 py-2.5 text-left text-sm hover:border-primary/60">
            <span className="absolute inset-y-0 left-0 bg-primary/15" style={{ width: `${total ? (o.votes / total) * 100 : 0}%` }} />
            <span className="relative flex justify-between"><span>{o.option_date.replaceAll("-", "/")} {fmtTime(o.start_time, o.end_time)}</span><span className="text-primary">{o.votes} 票</span></span>
          </button>
        ))}
      </div>
    </article>
  );
}

function WishForm() {
  const send = useServerFn(submitWish);
  const empty = { theme: THEMES[0] as (typeof THEMES)[number], content: "", nickname: "", contact: "" };
  const [f, setF] = useState(empty);
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    try { await send({ data: f }); toast.success("已收到您的活動許願"); setF(empty); }
    catch { toast.error("送出失敗，請填寫想參加的活動"); }
    finally { setBusy(false); }
  };
  return (
    <form onSubmit={submit} className={`${glass} space-y-3 p-5`}>
      <h2 className="text-2xl">活動許願</h2>
      <div className="flex flex-wrap gap-2">{THEMES.map((t) => <button key={t} type="button" className={chip(f.theme === t)} onClick={() => setF({ ...f, theme: t })}>{t}</button>)}</div>
      <Textarea required className={field} rows={3} placeholder="想參加什麼樣的聚會？時間、地點都可以寫" value={f.content} onChange={(e) => setF({ ...f, content: e.target.value })} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Input className={field} placeholder="暱稱（選填）" value={f.nickname} onChange={(e) => setF({ ...f, nickname: e.target.value })} />
        <Input className={field} placeholder="聯絡方式（選填，僅後台可見）" value={f.contact} onChange={(e) => setF({ ...f, contact: e.target.value })} />
      </div>
      <Button type="submit" disabled={busy} className="rounded-full bg-gold-gradient text-primary-foreground">{busy ? "送出中…" : "送出許願"}</Button>
    </form>
  );
}
