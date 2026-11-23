import { z } from "zod";
import { isExternalUrl } from "./section-links";

export const MEDIA_BUCKET = "section-media";
export const MAX_MEDIA_BYTES = 50 * 1024 * 1024;
export const fileTypes: Record<string, string> = {
  mp4: "video/mp4", webm: "video/webm", ogg: "video/ogg",
  pdf: "application/pdf", doc: "application/msword", docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel", xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ppt: "application/vnd.ms-powerpoint", pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  txt: "text/plain", csv: "text/csv", zip: "application/zip",
};
export const emptyMedia = { video_title: "", video_url: "", video_path: "", file_title: "", file_path: "", file_name: "" };
export const mediaSchema = z.object({
  video_title: z.string().trim().max(200), video_url: z.string().trim().max(4096), video_path: z.string().max(240),
  file_title: z.string().trim().max(200), file_path: z.string().max(240), file_name: z.string().max(200),
}).refine((m) => !m.video_url || Boolean(videoSource(m.video_url)), "請填入 YouTube、Vimeo 或 MP4／WebM／Ogg 影片網址");
export type SectionMedia = z.infer<typeof mediaSchema>;

export function videoSource(raw: string): { kind: "file" | "iframe"; src: string } | null {
  if (!isExternalUrl(raw)) return null;
  const url = new URL(raw);
  if (/\.(mp4|webm|ogg)$/i.test(url.pathname)) return { kind: "file", src: raw };
  const host = url.hostname.replace(/^www\./, "");
  if (host === "youtube.com" || host === "m.youtube.com" || host === "youtu.be") {
    const id = host === "youtu.be" ? url.pathname.slice(1) : url.searchParams.get("v") || url.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]+)/)?.[1];
    if (id && /^[\w-]{6,}$/.test(id)) return { kind: "iframe", src: `https://www.youtube.com/embed/${id}` };
  }
  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const id = url.pathname.match(/(?:^\/|\/video\/)(\d+)/)?.[1];
    if (id) return { kind: "iframe", src: `https://player.vimeo.com/video/${id}` };
  }
  return null;
}
export function publishedMedia(m: SectionMedia): SectionMedia {
  const video = Boolean(m.video_path || m.video_url);
  const file = Boolean(m.file_path);
  return { video_title: video ? m.video_title : "", video_url: video && !m.video_path ? m.video_url : "", video_path: video ? m.video_path : "", file_title: file ? m.file_title : "", file_path: file ? m.file_path : "", file_name: file ? m.file_name : "" };
}
export function uploadType(name: string, kind: "video" | "file") {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const mime = fileTypes[ext];
  if (!mime || (kind === "video" && !mime.startsWith("video/"))) throw new Error("不支援此檔案格式");
  return { ext, mime };
}