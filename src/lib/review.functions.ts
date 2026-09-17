import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({ passcode: z.string() });

const BUCKET = "application-photos";

/** 管理者專用：讀取申請與預約資料，照片轉成可直接顯示的網址 */
export const fetchReviewData = createServerFn({ method: "POST" })
  .inputValidator((data) => schema.parse(data))
  .handler(async ({ data }) => {
    const expected = process.env["ADMIN_REVIEW_PASSCODE"] ?? "0429";
    if (data.passcode.trim() !== expected) {
      return { ok: false as const, error: "passcode" };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const storage = supabaseAdmin.storage.from(BUCKET);

    const [apps, reservations] = await Promise.all([
      supabaseAdmin
        .from("membership_applications")
        .select("*")
        .order("created_at", { ascending: false }),
      supabaseAdmin.from("reservations").select("*").order("created_at", { ascending: false }),
    ]);

    if (apps.error) throw apps.error;
    if (reservations.error) throw reservations.error;

    const paths = Array.from(
      new Set(
        (apps.data ?? [])
          .flatMap((row) => [row.life_photo_path, row.headshot_path])
          .filter((path): path is string => Boolean(path)),
      ),
    );
    const signedUrls = new Map<string, string>();

    if (paths.length > 0) {
      const { data: signedData, error: signedError } = await storage.createSignedUrls(
        paths,
        60 * 60 * 24,
      );
      if (signedError) console.error("[review] photo links failed", signedError);
      (signedData ?? []).forEach((item, index) => {
        const path = paths[index];
        if (path && item.signedUrl) signedUrls.set(path, item.signedUrl);
      });
    }

    const applications = (apps.data ?? []).map((row) => ({
      ...row,
      life_photo_url: row.life_photo_path ? signedUrls.get(row.life_photo_path) ?? null : null,
      headshot_url: row.headshot_path ? signedUrls.get(row.headshot_path) ?? null : null,
    }));

    return { ok: true as const, applications, reservations: reservations.data ?? [] };
  });

const deleteSchema = z.object({
  passcode: z.string(),
  table: z.enum(["membership_applications", "reservations"]),
  ids: z.array(z.string().uuid()).min(1).max(200),
});

/** 管理者專用：刪除申請或預約資料（申請一併刪除照片） */
export const deleteReviewRows = createServerFn({ method: "POST" })
  .inputValidator((data) => deleteSchema.parse(data))
  .handler(async ({ data }) => {
    const expected = process.env["ADMIN_REVIEW_PASSCODE"] ?? "0429";
    if (data.passcode.trim() !== expected) {
      return { ok: false as const, error: "passcode" };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    if (data.table === "membership_applications") {
      const { data: rows } = await supabaseAdmin
        .from("membership_applications")
        .select("life_photo_path, headshot_path")
        .in("id", data.ids);
      const paths = (rows ?? [])
        .flatMap((row) => [row.life_photo_path, row.headshot_path])
        .filter((path): path is string => Boolean(path));
      if (paths.length > 0) {
        await supabaseAdmin.storage.from(BUCKET).remove(paths);
      }
    }

    const { error } = await supabaseAdmin.from(data.table).delete().in("id", data.ids);
    if (error) throw error;

    return { ok: true as const, deleted: data.ids.length };
  });
