import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TeacherFields, emptyTeacher, glass } from "@/components/academy-ui";
import { submitTeacher } from "@/lib/academy.functions";
import { teacherSchema } from "@/lib/academy";

export const Route = createFileRoute("/teachers/join")({
  head: () => ({
    meta: [
      { title: "師資報名填寫｜獵光者 未來俱樂部" },
      { name: "description", content: "邀請各領域老師填寫資料與上傳照片，加入獵光者未來俱樂部名師賦能課程。" },
      { property: "og:title", content: "師資報名填寫｜獵光者 未來俱樂部" },
      { property: "og:description", content: "填寫資料與上傳照片，加入名師賦能課程師資陣容。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JoinPage,
});

function JoinPage() {
  const send = useServerFn(submitTeacher);
  const [v, setV] = useState(emptyTeacher);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const submit = async () => {
    const p = teacherSchema.safeParse(v);
    if (!p.success) { toast.error(p.error.issues[0]?.message ?? "資料有誤"); return; }
    setBusy(true);
    try { await send({ data: p.data }); setDone(true); window.scrollTo({ top: 0 }); }
    catch { toast.error("送出失敗，請稍後再試"); }
    finally { setBusy(false); }
  };
  return (
    <div className="starburst mx-auto max-w-2xl px-5 py-20">
      <p className="text-xs tracking-[0.3em] text-primary">TEACHER APPLICATION</p>
      <h1 className="mt-4 text-3xl sm:text-4xl">師資報名填寫</h1>
      {done ? (
        <div className={`${glass} mt-10 p-8 text-center`}>
          <p className="text-lg text-gold-soft">已收到您的資料，審核後將與您聯繫。</p>
          <Link to="/teachers" className="mt-6 inline-block text-sm text-primary">回師資專區</Link>
        </div>
      ) : (
        <div className={`${glass} mt-10 p-6`}>
          <TeacherFields value={v} onChange={setV} />
          <Button onClick={submit} disabled={busy} className="mt-6 w-full rounded-full bg-gold-gradient text-primary-foreground">{busy ? "送出中…" : "送出資料"}</Button>
        </div>
      )}
    </div>
  );
}
