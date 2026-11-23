import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { sectionLinksSchema, visibleLinks } from "@/lib/section-links";

const saveSchema = z.object({
  slotId: z.string().regex(/^[a-z0-9-]{1,80}$/),
  passcode: z.string().min(1).max(128),
  links: sectionLinksSchema,
});

export const saveSectionLinks = createServerFn({ method: "POST" })
  .inputValidator((data) => saveSchema.parse(data))
  .handler(async ({ data }) => {
    const expected = process.env["ADMIN_REVIEW_PASSCODE"];
    if (!expected || data.passcode.trim() !== expected) throw new Error("管理者密碼不正確");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("section_external_links").upsert({
      slot_id: data.slotId,
      links: visibleLinks(data.links),
      updated_at: new Date().toISOString(),
    });
    if (error) throw new Error("儲存失敗，請稍後再試");
    return visibleLinks(data.links);
  });