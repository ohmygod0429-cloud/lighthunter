import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ImagePlus, LoaderCircle, MapPin, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { prepareTeacherPhoto, registerCourse, submitReview } from "@/lib/academy.functions";
import { MAX_GALLERY, REGIONS, TEACHER_PHOTO_BUCKET, mapLink, seatsLeft, type TeacherInput } from "@/lib/academy";

export const field = "w-full rounded-xl border border-border/70 bg-background/60 px-4 py-2.5 text-sm";
export const glass = "glass-card rounded-2xl border border-border/60";

export function useTeacherUpload() {
  const prepare = useServerFn(prepareTeacherPhoto);
  return async (file: File) => {
    const mime = file.type as "image/jpeg" | "image/png" | "image/webp";
    if (!["image/jpeg", "image/png", "image/webp"].includes(mime)) throw new Error("僅支援 JPG／PNG／WebP");
    if (file.size > 10 * 1024 * 1024) throw new Error("單張照片上限 10MB");
    const p = await prepare({ data: { mime, size: file.size } });
    const { error } = await supabase.storage.from(TEACHER_PHOTO_BUCKET).uploadToSignedUrl(p.path, p.token, file, { contentType: p.mime });
    if (error) throw error;
    return p.path;
  };
}

export const emptyTeacher: TeacherInput = { name: "", title: "", category: "", summary: "", experience: "", contact: "", regions: [], photo_path: "", gallery_paths: [] };

/** 師資資料表單（前台自助填寫與後台編輯共用）；previews 用於顯示既有照片 */
export function TeacherFields({ value, onChange, previews = {} }: { value: TeacherInput; onChange: (v: TeacherInput) => void; previews?: Record<string, string> }) {
  const upload = useTeacherUpload();
  const [busy, setBusy] = useState(false);
  const [local, setLocal] = useState<Record<string, string>>({});
  const src = (p: string) => local[p] ?? previews[p] ?? "";
  const set = <K extends keyof TeacherInput>(k: K, v: TeacherInput[K]) => onChange({ ...value, [k]: v });
  const handle = async (files: FileList | null, main: boolean) => {
    if (!files?.length) return;
    setBusy(true);
    try {
      const list = Array.from(files).slice(0, main ? 1 : MAX_GALLERY - value.gallery_paths.length);
      const paths: string[] = [];
      const urls: Record<string, string> = {};
      for (const f of list) { const p = await upload(f); paths.push(p); urls[p] = URL.createObjectURL(f); }
      setLocal((l) => ({ ...l, ...urls }));
      if (main) set("photo_path", paths[0] ?? "");
      else set("gallery_paths", [...value.gallery_paths, ...paths]);
    } catch (e) { toast.error(e instanceof Error ? e.message : "上傳失敗"); }
    finally { setBusy(false); }
  };
  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-sm text-gold-soft">個人形象照（單張主照）</p>
        <div className="flex items-center gap-4">
          {value.photo_path ? (
            <div className="relative"><img src={src(value.photo_path)} alt="" className="size-24 rounded-xl object-cover" />
              <button type="button" onClick={() => set("photo_path", "")} className="absolute -right-2 -top-2 rounded-full bg-background p-1" aria-label="移除"><X className="size-3" /></button></div>
          ) : (
            <label className="flex size-24 cursor-pointer items-center justify-center rounded-xl border border-dashed border-primary/50 text-primary">
              <ImagePlus className="size-6" /><input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => handle(e.target.files, true)} />
            </label>
          )}
          {busy && <LoaderCircle className="size-5 animate-spin text-primary" />}
        </div>
      </div>
      <Input className={field} placeholder="老師姓名 *" value={value.name} onChange={(e) => set("name", e.target.value)} />
      <Input className={field} placeholder="頭銜（例：國際認證講師）" value={value.title} onChange={(e) => set("title", e.target.value)} />
      <Input className={field} placeholder="專業分類與領域" value={value.category} onChange={(e) => set("category", e.target.value)} />
      <Textarea className={field} rows={3} placeholder="簡介" value={value.summary} onChange={(e) => set("summary", e.target.value)} />
      <Textarea className={field} rows={6} placeholder="詳細經歷" value={value.experience} onChange={(e) => set("experience", e.target.value)} />
      <div>
        <p className="mb-2 text-sm text-gold-soft">可授課地區</p>
        <div className="flex flex-wrap gap-2">
          {REGIONS.map((r) => {
            const on = value.regions.includes(r);
            return <button type="button" key={r} onClick={() => set("regions", on ? value.regions.filter((x) => x !== r) : [...value.regions, r])}
              className={`rounded-full border px-4 py-1.5 text-sm ${on ? "border-primary bg-primary/15 text-primary" : "border-border/70 text-muted-foreground"}`}>{r}</button>;
          })}
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm text-gold-soft">證書與教學／活動照片集（最多 {MAX_GALLERY} 張）</p>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          {value.gallery_paths.map((p) => (
            <div key={p} className="relative"><img src={src(p)} alt="" className="aspect-square w-full rounded-lg object-cover" />
              <button type="button" onClick={() => set("gallery_paths", value.gallery_paths.filter((x) => x !== p))} className="absolute right-1 top-1 rounded-full bg-background/90 p-1" aria-label="移除"><X className="size-3" /></button></div>
          ))}
          {value.gallery_paths.length < MAX_GALLERY && (
            <label className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border border-dashed border-primary/50 text-primary">
              <ImagePlus className="size-5" /><input type="file" multiple accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => handle(e.target.files, false)} />
            </label>
          )}
        </div>
      </div>
      <Input className={field} placeholder="聯絡方式（僅後台可見）" value={value.contact} onChange={(e) => set("contact", e.target.value)} />
    </div>
  );
}

export function Gallery({ urls }: { urls: string[] }) {
  const [open, setOpen] = useState<string | null>(null);
  if (!urls.length) return null;
  return (
    <>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {urls.map((u) => <button key={u} type="button" onClick={() => setOpen(u)}><img src={u} alt="證書與活動照片" className="aspect-square w-full rounded-lg object-cover transition hover:opacity-80" loading="lazy" /></button>)}
      </div>
      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-4xl border-border/60 bg-background p-2">
          <DialogHeader className="sr-only"><DialogTitle>照片</DialogTitle></DialogHeader>
          {open && <img src={open} alt="" className="max-h-[85vh] w-full object-contain" />}
        </DialogContent>
      </Dialog>
    </>
  );
}

export type PublicCourse = { id: string; name: string; description: string; region: string; course_date: string; start_time: string; end_time: string; location: string; map_url: string; capacity: number; registered: number; teacher_id: string | null };
export type PublicTeacher = { id: string; name: string; title: string; category: string; summary: string; photo_url: string };

export function CourseCard({ course, teacher, onRegistered }: { course: PublicCourse; teacher?: PublicTeacher | undefined; onRegistered?: () => void }) {
  const [open, setOpen] = useState(false);
  const left = seatsLeft(course.capacity, course.registered);
  const map = mapLink(course.location, course.map_url);
  const time = [course.start_time, course.end_time].filter(Boolean).join("–");
  return (
    <article className={`${glass} p-5`}>
      <div className="flex flex-wrap items-center gap-2 text-xs text-primary"><span>{course.course_date.replaceAll("-", "/")}</span>{time && <span>{time}</span>}<span className="rounded-full border border-primary/40 px-2">{course.region}</span></div>
      <h3 className="mt-2 text-lg">{course.name}</h3>
      {course.description && <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{course.description}</p>}
      {teacher && (
        <a href={`/teachers/${teacher.id}`} className="mt-4 flex items-center gap-3 rounded-xl border border-border/50 p-3 hover:border-primary/50">
          {teacher.photo_url && <img src={teacher.photo_url} alt={teacher.name} className="size-12 rounded-full object-cover" />}
          <div className="min-w-0"><p className="text-sm text-gold-soft">{teacher.name}{teacher.title && <span className="ml-2 text-xs text-muted-foreground">{teacher.title}</span>}</p>
            {teacher.summary && <p className="line-clamp-2 text-xs text-muted-foreground">{teacher.summary}</p>}</div>
        </a>
      )}
      {course.location && (
        map ? <a href={map} target="_blank" rel="noreferrer" className="mt-3 flex items-center gap-1.5 text-sm text-gold-soft hover:text-primary"><MapPin className="size-4" />{course.location}</a>
          : <p className="mt-3 flex items-center gap-1.5 text-sm text-gold-soft"><MapPin className="size-4" />{course.location}</p>
      )}
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground">{left === null ? "" : left > 0 ? `剩餘 ${left} 位` : "名額已滿"}</span>
        <Button disabled={left === 0} onClick={() => setOpen(true)} className="rounded-full bg-gold-gradient text-primary-foreground">我要報名</Button>
      </div>
      <RegisterDialog open={open} onOpenChange={setOpen} course={course} onDone={onRegistered} />
    </article>
  );
}

function RegisterDialog({ open, onOpenChange, course, onDone }: { open: boolean; onOpenChange: (o: boolean) => void; course: PublicCourse; onDone?: (() => void) | undefined }) {
  const reg = useServerFn(registerCourse);
  const [f, setF] = useState({ name: "", phone: "", email: "", messenger: "", note: "" });
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    try { await reg({ data: { course_id: course.id, ...f } }); toast.success("報名成功，我們會與您聯繫確認"); setF({ name: "", phone: "", email: "", messenger: "", note: "" }); onOpenChange(false); onDone?.(); }
    catch (err) { toast.error(err instanceof Error ? err.message.replace(/^.*?"message":"([^"]+)".*$/s, "$1") : "報名失敗"); }
    finally { setBusy(false); }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border/60 bg-background">
        <DialogHeader><DialogTitle>預約報名・{course.name}</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <Input required className={field} placeholder="姓名 *" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          <Input required className={field} placeholder="手機 *" inputMode="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
          <Input className={field} placeholder="電子郵件" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
          <Input className={field} placeholder="LINE／WeChat ID" value={f.messenger} onChange={(e) => setF({ ...f, messenger: e.target.value })} />
          <Textarea className={field} rows={2} placeholder="備註" value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} />
          <Button type="submit" disabled={busy} className="w-full rounded-full bg-gold-gradient text-primary-foreground">{busy ? "送出中…" : "送出報名"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ReviewForm({ teacherId, courses }: { teacherId: string; courses: { id: string; name: string }[] }) {
  const send = useServerFn(submitReview);
  const [f, setF] = useState({ nickname: "", content: "", course_id: "" });
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    try { await send({ data: { teacher_id: teacherId, course_id: f.course_id || null, nickname: f.nickname, content: f.content } }); toast.success("感謝您的評價，審核後將公開顯示"); setF({ nickname: "", content: "", course_id: "" }); }
    catch { toast.error("送出失敗，請確認暱稱與心得都有填寫"); }
    finally { setBusy(false); }
  };
  return (
    <form onSubmit={submit} className={`${glass} space-y-3 p-5`}>
      <h3 className="text-lg">留下課後評價</h3>
      <Input required className={field} placeholder="暱稱／姓名 *" value={f.nickname} onChange={(e) => setF({ ...f, nickname: e.target.value })} />
      {courses.length > 0 && (
        <select className={field} value={f.course_id} onChange={(e) => setF({ ...f, course_id: e.target.value })}>
          <option value="">選擇上過的課程（選填）</option>
          {courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      )}
      <Textarea required className={field} rows={3} placeholder="您的心得，例如：老師超級用心、講解非常細心" value={f.content} onChange={(e) => setF({ ...f, content: e.target.value })} />
      <Button type="submit" disabled={busy} className="rounded-full bg-gold-gradient text-primary-foreground">{busy ? "送出中…" : "送出評價"}</Button>
    </form>
  );
}
