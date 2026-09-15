import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  sheet: z.enum(["applications", "reservations"]),
  row: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])),
  photoPaths: z.record(z.string(), z.string().nullable()).optional(),
});

/** 把一筆表單資料同步到 Google 試算表（透過使用者提供的 Apps Script 網址） */
export const syncRowToSheet = createServerFn({ method: "POST" })
  .inputValidator((data) => schema.parse(data))
  .handler(async ({ data }) => {
    const url = process.env["GOOGLE_SHEET_WEBHOOK_URL"];
    if (!url) return { ok: false, error: "missing_webhook_url" };

    // 照片轉成長效期可直接開啟的網址，方便在試算表中點開檢視
    const photoUrls: Record<string, string | null> = {};
    if (data.photoPaths && Object.keys(data.photoPaths).length > 0) {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const storage = supabaseAdmin.storage.from("application-photos");
      for (const [key, path] of Object.entries(data.photoPaths)) {
        if (!path) {
          photoUrls[key] = null;
          continue;
        }
        const { data: signed } = await storage.createSignedUrl(path, 60 * 60 * 24 * 365 * 5);
        photoUrls[key] = signed?.signedUrl ?? null;
      }
    }

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sheet: data.sheet,
          submitted_at: new Date().toISOString(),
          ...data.row,
        }),
        redirect: "follow",
      });
      const body = await res.text();
      if (!res.ok) {
        console.error(`[sheet-sync] failed [${res.status}]: ${body}`);
        return { ok: false, error: `${res.status}: ${body.slice(0, 200)}` };
      }
      return { ok: true };
    } catch (err) {
      console.error("[sheet-sync] error", err);
      return { ok: false, error: String(err) };
    }
  });
