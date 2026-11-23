import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  TEACHER_PHOTO_BUCKET, courseSchema, registrationSchema, reviewSchema, teacherPhotoSchema, teacherSchema,
} from "./academy";

async function admin() {
  return (await import("@/integrations/supabase/client.server")).supabaseAdmin;
}
function checkPass(passcode: string) {
  if (passcode.trim() !== (process.env["ADMIN_REVIEW_PASSCODE"] ?? "0429")) throw new Error("密碼錯誤");
}
type Sb = Awaited<ReturnType<typeof admin>>;
async function signPaths(sb: Sb, paths: string[]) {
  const map = new Map<string, string>();
  const unique = [...new Set(paths.filter(Boolean))];
  if (!unique.length) return map;
  const { data } = await sb.storage.from(TEACHER_PHOTO_BUCKET).createSignedUrls(unique, 60 * 60 * 6);
  (data ?? []).forEach((d, i) => { const p = unique[i]; if (p && d.signedUrl) map.set(p, d.signedUrl); });
  return map;
}
type TeacherRow = { photo_path: string; gallery_paths: string[] };
function withUrls<T extends TeacherRow>(rows: T[], map: Map<string, string>) {
  return rows.map((r) => ({
    ...r,
    photo_url: map.get(r.photo_path) ?? "",
    gallery_urls: r.gallery_paths.map((p) => map.get(p) ?? "").filter(Boolean),
  }));
}

/** 老師自助上傳：伺服器產生路徑並發出一次性上傳權限 */
export const prepareTeacherPhoto = createServerFn({ method: "POST" })
  .inputValidator((i) => teacherPhotoSchema.parse(i))
  .handler(async ({ data }) => {
    const ext = data.mime === "image/jpeg" ? "jpg" : data.mime === "image/png" ? "png" : "webp";
    const path = `teachers/${crypto.randomUUID()}.${ext}`;
    const sb = await admin();
    const { data: s, error } = await sb.storage.from(TEACHER_PHOTO_BUCKET).createSignedUploadUrl(path, { upsert: false });
    if (error || !s) throw new Error("無法準備照片上傳，請稍後再試");
    return { path, token: s.token, mime: data.mime };
  });

export const submitTeacher = createServerFn({ method: "POST" })
  .inputValidator((i) => teacherSchema.parse(i))
  .handler(async ({ data }) => {
    const sb = await admin();
    const { error } = await sb.from("teachers").insert({ ...data, is_published: false });
    if (error) throw new Error("送出失敗，請稍後再試");
    return { ok: true };
  });

/** 訪客資料：只回傳已公開的老師、課程與評價 */
export const getAcademyPublic = createServerFn({ method: "GET" }).handler(async () => {
  const sb = await admin();
  const [t, c, r] = await Promise.all([
    sb.from("teachers").select("id,name,title,category,summary,experience,regions,photo_path,gallery_paths").eq("is_published", true).order("created_at"),
    sb.from("courses").select("id,teacher_id,name,description,region,course_date,start_time,end_time,location,map_url,capacity").eq("is_published", true).order("course_date").order("start_time"),
    sb.from("teacher_reviews").select("id,teacher_id,course_id,nickname,content,created_at").eq("is_published", true).order("created_at", { ascending: false }),
  ]);
  if (t.error || c.error || r.error) throw new Error("資料載入失敗");
  const teachers = t.data ?? [];
  const ids = new Set(teachers.map((x) => x.id));
  const courseIds = (c.data ?? []).map((x) => x.id);
  const counts: Record<string, number> = {};
  if (courseIds.length) {
    const { data: regs } = await sb.from("course_registrations").select("course_id").in("course_id", courseIds);
    (regs ?? []).forEach((x) => { counts[x.course_id] = (counts[x.course_id] ?? 0) + 1; });
  }
  const map = await signPaths(sb, teachers.flatMap((x) => [x.photo_path, ...x.gallery_paths]));
  return {
    teachers: withUrls(teachers, map),
    courses: (c.data ?? []).map((x) => ({ ...x, teacher_id: x.teacher_id && ids.has(x.teacher_id) ? x.teacher_id : null, registered: counts[x.id] ?? 0 })),
    reviews: (r.data ?? []).filter((x) => ids.has(x.teacher_id)),
  };
});

export const registerCourse = createServerFn({ method: "POST" })
  .inputValidator((i) => registrationSchema.parse(i))
  .handler(async ({ data }) => {
    const sb = await admin();
    const { data: course } = await sb.from("courses").select("capacity,is_published").eq("id", data.course_id).maybeSingle();
    if (!course?.is_published) throw new Error("此課程目前無法報名");
    if (course.capacity > 0) {
      const { count } = await sb.from("course_registrations").select("id", { count: "exact", head: true }).eq("course_id", data.course_id);
      if ((count ?? 0) >= course.capacity) throw new Error("此課程名額已滿");
    }
    const { error } = await sb.from("course_registrations").insert(data);
    if (error) throw new Error("報名失敗，請稍後再試");
    return { ok: true };
  });

export const submitReview = createServerFn({ method: "POST" })
  .inputValidator((i) => reviewSchema.parse(i))
  .handler(async ({ data }) => {
    const sb = await admin();
    const { data: t } = await sb.from("teachers").select("is_published").eq("id", data.teacher_id).maybeSingle();
    if (!t?.is_published) throw new Error("找不到這位老師");
    const { error } = await sb.from("teacher_reviews").insert({ ...data, is_published: false });
    if (error) throw new Error("送出失敗，請稍後再試");
    return { ok: true };
  });

/** 管理者：讀取全部資料 */
export const getAcademyAdmin = createServerFn({ method: "POST" })
  .inputValidator((i) => z.object({ passcode: z.string() }).parse(i))
  .handler(async ({ data }) => {
    checkPass(data.passcode);
    const sb = await admin();
    const [t, c, g, r] = await Promise.all([
      sb.from("teachers").select("*").order("created_at", { ascending: false }),
      sb.from("courses").select("*").order("course_date", { ascending: false }),
      sb.from("course_registrations").select("*").order("created_at", { ascending: false }),
      sb.from("teacher_reviews").select("*").order("created_at", { ascending: false }),
    ]);
    if (t.error || c.error || g.error || r.error) throw new Error("資料載入失敗");
    const teachers = t.data ?? [];
    const map = await signPaths(sb, teachers.flatMap((x) => [x.photo_path, ...x.gallery_paths]));
    return { teachers: withUrls(teachers, map), courses: c.data ?? [], registrations: g.data ?? [], reviews: r.data ?? [] };
  });

const actionSchema = z.object({ passcode: z.string() }).and(z.discriminatedUnion("type", [
  z.object({ type: z.literal("saveTeacher"), id: z.string().uuid().nullable(), teacher: teacherSchema, is_published: z.boolean() }),
  z.object({ type: z.literal("setTeacherPublished"), id: z.string().uuid(), value: z.boolean() }),
  z.object({ type: z.literal("deleteTeacher"), id: z.string().uuid() }),
  z.object({ type: z.literal("saveCourse"), id: z.string().uuid().nullable(), course: courseSchema }),
  z.object({ type: z.literal("deleteCourse"), id: z.string().uuid() }),
  z.object({ type: z.literal("setAttended"), id: z.string().uuid(), value: z.boolean() }),
  z.object({ type: z.literal("deleteRegistration"), id: z.string().uuid() }),
  z.object({ type: z.literal("setReviewPublished"), id: z.string().uuid(), value: z.boolean() }),
  z.object({ type: z.literal("deleteReview"), id: z.string().uuid() }),
]));

export const academyAdminAction = createServerFn({ method: "POST" })
  .inputValidator((i) => actionSchema.parse(i))
  .handler(async ({ data }) => {
    checkPass(data.passcode);
    const sb = await admin();
    const run = async (p: PromiseLike<{ error: unknown }>) => { const { error } = await p; if (error) throw new Error("操作失敗"); };
    switch (data.type) {
      case "saveTeacher": {
        const row = { ...data.teacher, is_published: data.is_published };
        if (data.id) {
          const { data: old } = await sb.from("teachers").select("photo_path,gallery_paths").eq("id", data.id).maybeSingle();
          await run(sb.from("teachers").update(row).eq("id", data.id));
          const keep = new Set([row.photo_path, ...row.gallery_paths]);
          const gone = old ? [old.photo_path, ...old.gallery_paths].filter((p) => p && !keep.has(p)) : [];
          if (gone.length) await sb.storage.from(TEACHER_PHOTO_BUCKET).remove(gone);
        } else await run(sb.from("teachers").insert(row));
        break;
      }
      case "setTeacherPublished": await run(sb.from("teachers").update({ is_published: data.value }).eq("id", data.id)); break;
      case "deleteTeacher": {
        const { data: old } = await sb.from("teachers").select("photo_path,gallery_paths").eq("id", data.id).maybeSingle();
        await run(sb.from("teachers").delete().eq("id", data.id));
        const paths = old ? [old.photo_path, ...old.gallery_paths].filter(Boolean) : [];
        if (paths.length) await sb.storage.from(TEACHER_PHOTO_BUCKET).remove(paths);
        break;
      }
      case "saveCourse":
        await run(data.id ? sb.from("courses").update(data.course).eq("id", data.id) : sb.from("courses").insert(data.course));
        break;
      case "deleteCourse": await run(sb.from("courses").delete().eq("id", data.id)); break;
      case "setAttended": await run(sb.from("course_registrations").update({ attended: data.value }).eq("id", data.id)); break;
      case "deleteRegistration": await run(sb.from("course_registrations").delete().eq("id", data.id)); break;
      case "setReviewPublished": await run(sb.from("teacher_reviews").update({ is_published: data.value }).eq("id", data.id)); break;
      case "deleteReview": await run(sb.from("teacher_reviews").delete().eq("id", data.id)); break;
    }
    return { ok: true };
  });
