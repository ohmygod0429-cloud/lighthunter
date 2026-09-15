import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({ passcode: z.string() });

const BUCKET = "application-photos";

async function signed(
  storage: { createSignedUrl: (path: string, expiresIn: number) => Promise<{ data: { signedUrl: string } | null }> },
  path: string | null,
) {
  if (!path) return null;
  const { data } = await storage.createSignedUrl(path, 60 * 60 * 8);
  return data?.signedUrl ?? null;
}

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

    const applications = await Promise.all(
      (apps.data ?? []).map(async (row) => ({
        ...row,
        life_photo_url: await signed(storage, row.life_photo_path),
        headshot_url: await signed(storage, row.headshot_path),
      })),
    );

    return { ok: true as const, applications, reservations: reservations.data ?? [] };
  });
