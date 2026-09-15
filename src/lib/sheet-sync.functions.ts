import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  sheet: z.enum(["applications", "reservations"]),
  row: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])),
});

/** 把一筆表單資料同步到 Google 試算表（透過使用者提供的 Apps Script 網址） */
export const syncRowToSheet = createServerFn({ method: "POST" })
  .inputValidator((data) => schema.parse(data))
  .handler(async ({ data }) => {
    const url = process.env["GOOGLE_SHEET_WEBHOOK_URL"];
    if (!url) return { ok: false, error: "missing_webhook_url" };

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
