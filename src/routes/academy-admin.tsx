import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TeacherFields, emptyTeacher, field, glass } from "@/components/academy-ui";
import { academyAdminAction, getAcademyAdmin } from "@/lib/academy.functions";
import { REGIONS, courseSchema, studentKey, teacherSchema, type CourseInput, type TeacherInput } from "@/lib/academy";
import { getEnteredAdminPasscode } from "@/lib/admin-mode";

export const Route = createFileRoute("/academy-admin")({
  head: () => ({
    meta: [
      { title: "課程後台｜獵光者 未來俱樂部" },
      { name: "description", content: "名師賦能課程內部後台：師資審核、課表、報名統計與學員評價管理。" },
      { property: "og:title", content: "課程後台｜獵光者 未來俱樂部" },
      { property: "og:description", content: "師資審核、課表、報名統計與學員評價管理。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type Data = Awaited<ReturnType<typeof getAcademyAdmin>>;
type Action = Record<string, unknown> & { type: string };
const TABS = ["師資", "課表", "報名名單", "統計", "評價"] as const;
const emptyCourse: CourseInput = { teacher_id: null, name: "", description: "", region: "北部", course_date: "", start_time: "", end_time: "", location: "", map_url: "", capacity: 0, is_published: true };

function AdminPage() {
  const load = useServerFn(getAcademyAdmin);
  const act = useServerFn(academyAdminAction);
  const [pass, setPass] = useState("");
  useEffect(() => { setPass(getEnteredAdminPasscode() ?? ""); }, []);
  const [data, setData] = useState<Data | null>(null);
  const [tab, setTab] = useState<(typeof TABS)[number]>("師資");
  const [editT, setEditT] = useState<{ id: string | null; v: TeacherInput; pub: boolean; previews: Record<string, string> } | null>(null);
  const [editC, setEditC] = useState<{ id: string | null; v: CourseInput } | null>(null);

  const refresh = async (p = pass) => {
    try { setData(await load({ data: { passcode: p } })); } catch { toast.error("密碼錯誤或資料載入失敗"); }
  };
  const run = async (a: Action, ok = "已更新") => {
    try { await act({ data: { passcode: pass, ...a } as never }); toast.success(ok); await refresh(); return true; }
    catch { toast.error("操作失敗"); return false; }
  };
  const confirmRun = (a: Action) => { if (confirm("確定刪除？此動作無法復原")) void run(a, "已刪除"); };

  if (!data) return (
    <div className="mx-auto max-w-sm px-5 py-24">
      <h1 className="text-2xl">課程後台</h1>
      <form className="mt-6 space-y-3" onSubmit={(e) => { e.preventDefault(); void refresh(); }}>
        <Input type="password" className={field} placeholder="管理者密碼" value={pass} onChange={(e) => setPass(e.target.value)} />
        <Button type="submit" className="w-full rounded-full bg-gold-gradient text-primary-foreground">進入</Button>
      </form>
    </div>
  );

  const tName = new Map(data.teachers.map((t) => [t.id, t.name]));
  const cMap = new Map(data.courses.map((c) => [c.id, c]));

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <h1 className="text-3xl">課程後台</h1>
      <div className="mt-6 flex flex-wrap gap-2">
        {TABS.map((t) => <button key={t} type="button" onClick={() => setTab(t)} className={`rounded-full border px-4 py-1.5 text-sm ${tab === t ? "border-primary bg-primary/15 text-primary" : "border-border/70 text-muted-foreground"}`}>{t}</button>)}
      </div>

      {tab === "師資" && (
        <div className="mt-6 space-y-3">
          <Button onClick={() => setEditT({ id: null, v: emptyTeacher, pub: true, previews: {} })} className="rounded-full bg-gold-gradient text-primary-foreground">新增老師</Button>
          {data.teachers.length === 0 && <p className="text-muted-foreground">尚無老師資料</p>}
          {data.teachers.map((t) => (
            <div key={t.id} className={`${glass} flex flex-wrap items-center gap-4 p-4`}>
              {t.photo_url ? <img src={t.photo_url} alt="" className="size-14 rounded-full object-cover" /> : <div className="size-14 rounded-full bg-muted" />}
              <div className="min-w-0 flex-1">
                <p>{t.name} <span className="text-xs text-muted-foreground">{t.title}</span></p>
                <p className="text-xs text-muted-foreground">{t.category}{t.contact && `｜聯絡：${t.contact}`}｜{new Date(t.created_at).toLocaleDateString("zh-TW")}</p>
              </div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={t.is_published} onChange={(e) => run({ type: "setTeacherPublished", id: t.id, value: e.target.checked })} />公開</label>
              <Button variant="outline" size="sm" onClick={() => {
                const previews: Record<string, string> = {};
                if (t.photo_path) previews[t.photo_path] = t.photo_url;
                t.gallery_paths.forEach((p, i) => { const u = t.gallery_urls[i]; if (u) previews[p] = u; });
                setEditT({ id: t.id, pub: t.is_published, previews, v: { name: t.name, title: t.title, category: t.category, summary: t.summary, experience: t.experience, contact: t.contact, regions: t.regions as TeacherInput["regions"], photo_path: t.photo_path, gallery_paths: t.gallery_paths } });
              }}>編輯</Button>
              <Button variant="destructive" size="sm" onClick={() => confirmRun({ type: "deleteTeacher", id: t.id })}>刪除</Button>
            </div>
          ))}
        </div>
      )}

      {tab === "課表" && (
        <div className="mt-6 space-y-3">
          <Button onClick={() => setEditC({ id: null, v: emptyCourse })} className="rounded-full bg-gold-gradient text-primary-foreground">新增課程</Button>
          {data.courses.length === 0 && <p className="text-muted-foreground">尚無課程</p>}
          {data.courses.map((c) => {
            const n = data.registrations.filter((r) => r.course_id === c.id).length;
            return (
              <div key={c.id} className={`${glass} flex flex-wrap items-center gap-4 p-4`}>
                <div className="min-w-0 flex-1">
                  <p>{c.name} <span className="text-xs text-primary">{c.region}</span>{!c.is_published && <span className="ml-2 text-xs text-muted-foreground">（未公開）</span>}</p>
                  <p className="text-xs text-muted-foreground">{c.course_date} {c.start_time}{c.end_time && `–${c.end_time}`}｜{c.teacher_id ? tName.get(c.teacher_id) ?? "—" : "未指定老師"}｜報名 {n}{c.capacity > 0 && ` / ${c.capacity}`}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setEditC({ id: c.id, v: { teacher_id: c.teacher_id, name: c.name, description: c.description, region: c.region as CourseInput["region"], course_date: c.course_date, start_time: c.start_time, end_time: c.end_time, location: c.location, map_url: c.map_url, capacity: c.capacity, is_published: c.is_published } })}>編輯</Button>
                <Button variant="destructive" size="sm" onClick={() => confirmRun({ type: "deleteCourse", id: c.id })}>刪除</Button>
              </div>
            );
          })}
        </div>
      )}

      {tab === "報名名單" && (
        <div className="mt-6 space-y-3">
          {data.registrations.length === 0 && <p className="text-muted-foreground">尚無報名</p>}
          {data.registrations.map((r) => {
            const c = cMap.get(r.course_id);
            return (
              <div key={r.id} className={`${glass} flex flex-wrap items-center gap-4 p-4`}>
                <div className="min-w-0 flex-1">
                  <p>{r.name} <a href={`tel:${r.phone}`} className="ml-2 text-sm text-primary">{r.phone}</a></p>
                  <p className="text-xs text-muted-foreground">{c ? `${c.course_date} ${c.name}` : "課程已刪除"}{r.email && `｜${r.email}`}{r.messenger && `｜${r.messenger}`}{r.note && `｜${r.note}`}</p>
                </div>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={r.attended} onChange={(e) => run({ type: "setAttended", id: r.id, value: e.target.checked })} />已出席</label>
                <Button variant="destructive" size="sm" onClick={() => confirmRun({ type: "deleteRegistration", id: r.id })}>刪除</Button>
              </div>
            );
          })}
        </div>
      )}

      {tab === "統計" && <Stats data={data} />}

      {tab === "評價" && (
        <div className="mt-6 space-y-3">
          {data.reviews.length === 0 && <p className="text-muted-foreground">尚無評價</p>}
          {data.reviews.map((r) => (
            <div key={r.id} className={`${glass} flex flex-wrap items-center gap-4 p-4`}>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gold-soft">{r.nickname}<span className="ml-2 text-xs text-muted-foreground">{tName.get(r.teacher_id) ?? "—"}{r.course_id && cMap.get(r.course_id) && `・${cMap.get(r.course_id)?.name}`}</span></p>
                <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{r.content}</p>
              </div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={r.is_published} onChange={(e) => run({ type: "setReviewPublished", id: r.id, value: e.target.checked })} />公開</label>
              <Button variant="destructive" size="sm" onClick={() => confirmRun({ type: "deleteReview", id: r.id })}>刪除</Button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!editT} onOpenChange={(o) => !o && setEditT(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-border/60 bg-background">
          <DialogHeader><DialogTitle>{editT?.id ? "編輯老師" : "新增老師"}</DialogTitle></DialogHeader>
          {editT && <>
            <TeacherFields value={editT.v} previews={editT.previews} onChange={(v) => setEditT({ ...editT, v })} />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editT.pub} onChange={(e) => setEditT({ ...editT, pub: e.target.checked })} />公開顯示</label>
            <Button className="rounded-full bg-gold-gradient text-primary-foreground" onClick={async () => {
              const p = teacherSchema.safeParse(editT.v);
              if (!p.success) { toast.error(p.error.issues[0]?.message ?? "資料有誤"); return; }
              if (await run({ type: "saveTeacher", id: editT.id, teacher: p.data, is_published: editT.pub }, "已儲存")) setEditT(null);
            }}>儲存</Button>
          </>}
        </DialogContent>
      </Dialog>

      <Dialog open={!!editC} onOpenChange={(o) => !o && setEditC(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-border/60 bg-background">
          <DialogHeader><DialogTitle>{editC?.id ? "編輯課程" : "新增課程"}</DialogTitle></DialogHeader>
          {editC && <CourseForm v={editC.v} teachers={data.teachers} onChange={(v) => setEditC({ ...editC, v })} onSave={async () => {
            const p = courseSchema.safeParse(editC.v);
            if (!p.success) { toast.error(p.error.issues[0]?.message ?? "資料有誤"); return; }
            if (await run({ type: "saveCourse", id: editC.id, course: p.data }, "已儲存")) setEditC(null);
          }} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CourseForm({ v, teachers, onChange, onSave }: { v: CourseInput; teachers: { id: string; name: string }[]; onChange: (v: CourseInput) => void; onSave: () => void }) {
  const set = <K extends keyof CourseInput>(k: K, x: CourseInput[K]) => onChange({ ...v, [k]: x });
  return (
    <div className="space-y-3">
      <Input className={field} placeholder="課程名稱 *" value={v.name} onChange={(e) => set("name", e.target.value)} />
      <select className={field} value={v.teacher_id ?? ""} onChange={(e) => set("teacher_id", e.target.value || null)}>
        <option value="">選擇老師</option>
        {teachers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
      </select>
      <select className={field} value={v.region} onChange={(e) => set("region", e.target.value as CourseInput["region"])}>
        {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
      </select>
      <div className="grid grid-cols-3 gap-2">
        <Input type="date" className={field} value={v.course_date} onChange={(e) => set("course_date", e.target.value)} />
        <Input type="time" className={field} value={v.start_time} onChange={(e) => set("start_time", e.target.value)} />
        <Input type="time" className={field} value={v.end_time} onChange={(e) => set("end_time", e.target.value)} />
      </div>
      <Input className={field} placeholder="上課地點（例：台北市信義區松仁路 100 號）" value={v.location} onChange={(e) => set("location", e.target.value)} />
      <Input className={field} placeholder="Google 地圖連結（選填，未填自動用地點搜尋）" value={v.map_url} onChange={(e) => set("map_url", e.target.value)} />
      <Input type="number" min={0} className={field} placeholder="名額上限（0 = 不限）" value={v.capacity} onChange={(e) => set("capacity", Number(e.target.value) || 0)} />
      <Textarea className={field} rows={3} placeholder="課程說明" value={v.description} onChange={(e) => set("description", e.target.value)} />
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={v.is_published} onChange={(e) => set("is_published", e.target.checked)} />公開在課表</label>
      <Button onClick={onSave} className="rounded-full bg-gold-gradient text-primary-foreground">儲存</Button>
    </div>
  );
}

function Stats({ data }: { data: Data }) {
  const months = useMemo(() => [...new Set(data.courses.map((c) => c.course_date.slice(0, 7)))].sort().reverse(), [data]);
  const [month, setMonth] = useState("全部");
  const cMap = new Map(data.courses.map((c) => [c.id, c]));
  const regs = data.registrations.filter((r) => month === "全部" || cMap.get(r.course_id)?.course_date.startsWith(month));
  const tName = new Map(data.teachers.map((t) => [t.id, t.name]));
  const count = (key: (r: (typeof regs)[number]) => string) => {
    const m = new Map<string, number>();
    regs.forEach((r) => { const k = key(r); m.set(k, (m.get(k) ?? 0) + 1); });
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  };
  const byCourse = count((r) => cMap.get(r.course_id)?.name ?? "（已刪除課程）");
  const byTeacher = count((r) => { const t = cMap.get(r.course_id)?.teacher_id; return t ? tName.get(t) ?? "—" : "未指定老師"; });
  const students = new Map<string, { name: string; phone: string; total: number; attended: number; courses: string[] }>();
  data.registrations.forEach((r) => {
    const k = studentKey(r.phone);
    const s = students.get(k) ?? { name: r.name, phone: r.phone, total: 0, attended: 0, courses: [] };
    s.total++; if (r.attended) s.attended++;
    const c = cMap.get(r.course_id); if (c) s.courses.push(`${c.course_date} ${c.name}${r.attended ? "（出席）" : ""}`);
    students.set(k, s);
  });
  const topStudents = [...students.values()].sort((a, b) => b.total - a.total);
  const List = ({ title, rows }: { title: string; rows: [string, number][] }) => (
    <div className={`${glass} p-5`}><h3 className="text-lg">{title}</h3>
      {rows.length === 0 ? <p className="mt-2 text-sm text-muted-foreground">尚無資料</p> :
        <ol className="mt-3 space-y-1.5 text-sm">{rows.map(([k, n], i) => <li key={k} className="flex justify-between gap-3"><span>{i + 1}. {k}</span><span className="text-primary">{n} 人</span></li>)}</ol>}
    </div>
  );
  return (
    <div className="mt-6 space-y-5">
      <select className={`${field} max-w-xs`} value={month} onChange={(e) => setMonth(e.target.value)}>
        <option value="全部">全部月份</option>
        {months.map((m) => <option key={m} value={m}>{m.replace("-", " 年 ")} 月</option>)}
      </select>
      <p className="text-sm text-muted-foreground">報名總數：<span className="text-primary">{regs.length}</span></p>
      <div className="grid gap-5 md:grid-cols-2">
        <List title="老師報名排行" rows={byTeacher} />
        <List title="課程報名排行" rows={byCourse} />
      </div>
      <div className={`${glass} p-5`}><h3 className="text-lg">學員累計（全部月份）</h3>
        {topStudents.length === 0 ? <p className="mt-2 text-sm text-muted-foreground">尚無資料</p> :
          <div className="mt-3 space-y-3">{topStudents.map((s) => (
            <details key={s.phone} className="border-b border-border/40 pb-2 text-sm">
              <summary className="flex cursor-pointer justify-between gap-3"><span>{s.name}・{s.phone}</span><span className="text-primary">報名 {s.total}・出席 {s.attended}</span></summary>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">{s.courses.map((c, i) => <li key={i}>{c}</li>)}</ul>
            </details>
          ))}</div>}
      </div>
    </div>
  );
}
