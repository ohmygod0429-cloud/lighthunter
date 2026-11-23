import { z } from "zod";
import { REGIONS, photoPathRe } from "./academy";

export const THEMES = ["逛夜市", "踏青", "遛狗", "海邊烤肉", "桌遊", "聯誼", "育嬰交流", "其他生活聚會"] as const;
export const PERFORMER_KINDS = ["DJ", "樂手", "其他"] as const;
export const STATUSES = ["open", "failed", "cancelled", "rescheduled"] as const;
const t = (max: number) => z.string().trim().max(max);
const time = z.string().regex(/^(\d{2}:\d{2})?$/);
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "請選擇日期");
const https = z.string().trim().max(1000).refine((u) => u === "" || /^https:\/\//.test(u), "連結需為 https 網址");

export const performerSchema = z.object({
  name: z.string().trim().min(1, "請填寫姓名／藝名").max(100),
  kind: t(50), summary: t(2000),
  photo_path: z.string().refine((p) => p === "" || photoPathRe.test(p)),
  is_published: z.boolean(),
});
export type PerformerInput = z.infer<typeof performerSchema>;

export const gatheringSchema = z.object({
  theme: z.enum(THEMES),
  title: z.string().trim().min(1, "請填寫活動名稱").max(200),
  description: t(5000),
  region: z.enum(REGIONS),
  event_date: date, start_time: time, end_time: time,
  location: t(300), map_url: https,
  min_people: z.number().int().min(0).max(100000),
  capacity: z.number().int().min(0).max(100000),
  fee: z.number().int().min(0).max(10000000),
  payment_note: t(2000), payment_url: https, perks: t(2000),
  performer_ids: z.array(z.string().uuid()).max(50),
  status: z.enum(STATUSES), status_note: t(500),
  is_published: z.boolean(),
  rideshare_enabled: z.boolean(), meet_point: t(300),
});
export type GatheringInput = z.infer<typeof gatheringSchema>;

export const gatheringRegistrationSchema = z.object({
  gathering_id: z.string().uuid(),
  name: z.string().trim().min(1, "請填寫姓名").max(100),
  phone: z.string().trim().regex(/^[0-9+\-\s]{8,20}$/, "請填寫正確電話"),
  email: z.string().trim().max(255).refine((e) => e === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e), "Email 格式不正確"),
  messenger: t(100), note: t(1000),
  ride_role: z.enum(["none", "driver", "passenger"]).default("none"),
  seats: z.number().int().min(0).max(8).default(0),
  ride_meet_location: t(300).default(""), ride_meet_time: time.default(""), ride_conditions: t(500).default(""),
  ride_driver_id: z.string().uuid().nullable().default(null),
  agree_ride_safety: z.boolean().default(false),
}).superRefine((v, ctx) => {
  const bad = (message: string) => ctx.addIssue({ code: "custom", message });
  if (v.ride_role !== "none" && !v.agree_ride_safety) bad("請勾選同意順道搭乘安全提醒");
  if (v.ride_role === "driver") {
    if (v.seats < 1) bad("請填寫可提供座位數");
    if (!v.ride_meet_location) bad("請填寫集合地點");
  }
  if (v.ride_role === "passenger" && !v.ride_driver_id) bad("請選擇要搭乘的車主");
});

export const pollSchema = z.object({
  theme: z.enum(THEMES),
  title: z.string().trim().min(1, "請填寫投票主題").max(200),
  description: t(2000),
  region: z.union([z.enum(REGIONS), z.literal("")]),
  is_open: z.boolean(),
  options: z.array(z.object({ id: z.string().uuid().nullable(), option_date: date, start_time: time, end_time: time })).max(20),
});
export type PollInput = z.infer<typeof pollSchema>;

export const voteSchema = z.object({ option_id: z.string().uuid(), voter_key: z.string().regex(/^[a-zA-Z0-9-]{8,64}$/) });
export const wishSchema = z.object({
  theme: z.enum(THEMES),
  content: z.string().trim().min(2, "請填寫想參加的活動").max(1000),
  nickname: t(50), contact: t(200),
  meet_location: t(300).default(""), conditions: t(500).default(""),
});
export const WISH_STATUSES = ["pending", "approved", "rejected"] as const;
export const WISH_LABEL: Record<string, string> = { pending: "待審核", approved: "已核准公開", rejected: "已駁回／隱藏" };

/** 順道搭乘剩餘座位（不會小於 0） */
export function seatsLeft(seats: number, taken: number) {
  return Math.max(0, seats - taken);
}

/** 成團狀態：管理者標記優先；否則未達最低人數為集氣中（0 代表不限） */
export function gatheringState(status: string, minPeople: number, count: number) {
  if (status === "cancelled") return "已取消";
  if (status === "rescheduled") return "改期";
  if (status === "failed") return "未成團";
  return minPeople > 0 && count < minPeople ? "集氣中" : "已成團";
}

/** 是否還能報名：取消／未成團不可；上限 0 代表不限 */
export function canRegister(status: string, capacity: number, count: number) {
  if (status === "cancelled" || status === "failed") return false;
  return capacity === 0 || count < capacity;
}
