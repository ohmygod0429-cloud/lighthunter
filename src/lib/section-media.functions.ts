import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { MAX_MEDIA_BYTES, MEDIA_BUCKET, mediaSchema, publishedMedia, uploadType } from "./section-media";

const identity = z.object({ slotId: z.string().regex(/^[a-z0-9-]{1,80}$/), passcode: z.string().min(1).max(128) });

export const prepareSectionUpload = createServerFn({ method: "POST" })
  .inputValidator((input) => identity.extend({ name: z.string().min(1).max(200), size: z.number().int().positive().max(MAX_MEDIA_BYTES), kind: z.enum(["video", "file"]) }).parse(input))
  .handler(async ({ data }) => {
    const expected = process.env["ADMIN_REVIEW_PASSCODE"];
    if (!expected || data.passcode.trim() !== expected) throw new Error("管理者密碼不正確");
    const { ext, mime } = uploadType(data.name, data.kind);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const path = `${data.slotId}/${data.kind}/${crypto.randomUUID()}.${ext}`;
    const { data: signed, error } = await supabaseAdmin.storage.from(MEDIA_BUCKET).createSignedUploadUrl(path);
    if (error || !signed) throw new Error("無法準備上傳，請稍後再試");
    return { path, token: signed.token, mime };
  });

export const saveSectionMedia = createServerFn({ method: "POST" })
  .inputValidator((input) => identity.extend({ media: mediaSchema }).parse(input))
  .handler(async ({ data }) => {
    const expected = process.env["ADMIN_REVIEW_PASSCODE"];
    if (!expected || data.passcode.trim() !== expected) throw new Error("管理者密碼不正確");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const media = publishedMedia(data.media);
    for (const [kind, path] of [["video", media.video_path], ["file", media.file_path]] as const) {
      if (!path) continue;
      const prefix = `${data.slotId}/${kind}/`;
      const filename = path.slice(prefix.length);
      if (!path.startsWith(prefix) || !/^[a-f0-9-]{36}\.[a-z0-9]+$/.test(filename)) throw new Error("檔案位置不正確");
      const { data: objects, error } = await supabaseAdmin.storage.from(MEDIA_BUCKET).list(prefix.slice(0, -1), { search: filename });
      const object = objects?.find((entry) => entry.name === filename);
      if (error || !object || Number(object.metadata?.['size'] ?? 0) > MAX_MEDIA_BYTES) throw new Error("檔案尚未完整上傳");
      uploadType(filename, kind);
    }
    const { data: old, error: readError } = await supabaseAdmin.from("section_media").select("video_path,file_path").eq("slot_id", data.slotId).maybeSingle();
    if (readError) throw new Error("無法讀取原有檔案");
    const { error } = await supabaseAdmin.from("section_media").upsert({ slot_id: data.slotId, ...media, updated_at: new Date().toISOString() });
    if (error) throw new Error("儲存失敗，請稍後再試");
    const retired = [old?.video_path, old?.file_path].filter((path): path is string => Boolean(path && path !== media.video_path && path !== media.file_path));
    if (retired.length) await supabaseAdmin.storage.from(MEDIA_BUCKET).remove(retired);
    return media;
  });

export const discardSectionUploads = createServerFn({ method: "POST" })
  .inputValidator((input) => identity.extend({ paths: z.array(z.string().max(240)).max(2) }).parse(input))
  .handler(async ({ data }) => {
    const expected = process.env["ADMIN_REVIEW_PASSCODE"];
    if (!expected || data.passcode.trim() !== expected) throw new Error("管理者密碼不正確");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: saved, error } = await supabaseAdmin.from("section_media").select("video_path,file_path").eq("slot_id", data.slotId).maybeSingle();
    if (error) return { ok: false };
    const paths = data.paths.filter((path) => path.startsWith(`${data.slotId}/`) && !path.includes("..") && path !== saved?.video_path && path !== saved?.file_path);
    if (paths.length) await supabaseAdmin.storage.from(MEDIA_BUCKET).remove(paths);
    return { ok: true };
  });