import { z } from "zod";

export const TEACHER_PHOTO_BUCKET = "teacher-photos";
export const MAX_TEACHER_PHOTO_BYTES = 10 * 1024 * 1024;
export const MAX_GALLERY = 30;
export const REGIONS = ["北部", "中部", "南部", "東部", "線上"] as const;
export const photoPathRe = /^teachers\/[a-f0-9-]{36}\.(jpg|png|webp)$/;

export const teacherPhotoSchema = z.object({
  mime: z.enum(["image/jpeg", "image/png", "image/webp"]),
  size: z.number().int().positive().max(MAX_TEACHER_PHOTO_BYTES),
});

const t = (max: number) => z.string().trim().max(max);
export const teacherSchema = z.object({
  name: z.string().trim().min(1, "請填寫老師姓名").max(100),
  title: t(200), category: t(200), summary: t(2000), experience: t(10000), contact: t(300),
  regions: z.array(z.enum(REGIONS)).max(REGIONS.length),
  photo_path: z.string().refine((p) => p === "" || photoPathRe.test(p)),
  gallery_paths: z.array(z.string().regex(photoPathRe)).max(MAX_GALLERY),
});
export type TeacherInput = z.infer<typeof teacherSchema>;

export const courseSchema = z.object({
  teacher_id: z.string().uuid().nullable(),
  name: z.string().trim().min(1, "請填寫課程名稱").max(200),
  description: t(3000),
  region: z.enum(REGIONS),
  course_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "請選擇日期"),
  start_time: z.string().regex(/^(\d{2}:\d{2})?$/),
  end_time: z.string().regex(/^(\d{2}:\d{2})?$/),
  location: t(300),
  map_url: z.string().trim().max(1000).refine((u) => u === "" || /^https:\/\//.test(u), "地圖連結需為 https 網址"),
  capacity: z.number().int().min(0).max(10000),
  is_published: z.boolean(),
});
export type CourseInput = z.infer<typeof courseSchema>;

export const registrationSchema = z.object({
  course_id: z.string().uuid(),
  name: z.string().trim().min(1, "請填寫姓名").max(100),
  phone: z.string().trim().regex(/^[0-9+\-\s]{8,20}$/, "請填寫正確電話"),
  email: z.string().trim().max(255).refine((e) => e === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e), "Email 格式不正確"),
  messenger: t(100), note: t(1000),
});

export const reviewSchema = z.object({
  teacher_id: z.string().uuid(),
  course_id: z.string().uuid().nullable(),
  nickname: z.string().trim().min(1, "請填寫暱稱").max(50),
  content: z.string().trim().min(2, "請填寫心得").max(1000),
});

/** 地點連結：優先用管理者填的 Google 地圖網址，否則以地點文字搜尋 */
export function mapLink(location: string, mapUrl: string) {
  if (mapUrl) return mapUrl;
  if (!location) return "";
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
}

/** 剩餘名額；capacity 0 代表不限 */
export function seatsLeft(capacity: number, count: number) {
  return capacity > 0 ? Math.max(0, capacity - count) : null;
}

/** 學員識別：以電話（去除符號）合併同一人 */
export function studentKey(phone: string) {
  return phone.replace(/[^0-9]/g, "");
}
