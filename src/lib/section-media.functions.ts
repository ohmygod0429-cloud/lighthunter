import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { MAX_MEDIA_BYTES, MEDIA_BUCKET, hasPublishedMedia, mediaSchema, publishedMedia, publishedSectionPaths, uploadType } from "./section-media";

const identity = z.object({ slotId: z.string().regex(/^[a-z0-9-]{1,80}$/), passcode: z.string().min(1).max(128) });

// Never accept caller-selected object paths. Only public, saved section references may be signed.
export const getPublishedSectionFileUrls = createServerFn({ method: "GET" })
  .handler(async () => {
    const url = process.env["SUPABASE_URL"];
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"] || process.env["SUPABASE_ANON_KEY"];
    if (!url || !key) throw new Error("無法讀取已發布檔案");
    const publicClient = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      } },
    });
    const { data, error } = await publicClient.from("section_media").select("slot_id,video_path,file_path");
    if (error) throw new Error("無法讀取已發布檔案");
    const paths = publishedSectionPaths(data ?? []);
    if (paths.length === 0) return {} as Record<string, string>;
    // The publishable client above authorizes the exact allowlist before privileged signing.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const signed = await supabaseAdmin.storage.from(MEDIA_BUCKET).createSignedUrls(paths, 3600);
    if (signed.error) throw new Error("無法開啟已發布檔案");
    return Object.fromEntries((signed.data ?? []).flatMap((item) => item.path && item.signedUrl ? [[item.path, item.signedUrl]] : [])) as Record<string, string>;
  });

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
    const { error } = await supabaseAdmin.from("section_media").upsert({ slot_id: data.slotId, ...media, is_published: hasPublishedMedia(media), updated_at: new Date().toISOString() });
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