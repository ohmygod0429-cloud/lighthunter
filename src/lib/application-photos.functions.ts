import { createServerFn } from "@tanstack/react-start";
import { APPLICATION_PHOTO_BUCKET, applicationPhotoPath, applicationPhotoUploadSchema } from "./application-security";

// Public applicants receive a capability for one server-chosen photo path, not bucket write access.
export const prepareApplicationPhoto = createServerFn({ method: "POST" })
  .inputValidator((input) => applicationPhotoUploadSchema.parse(input))
  .handler(async ({ data }) => {
    const path = applicationPhotoPath(data, crypto.randomUUID());
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: signed, error } = await supabaseAdmin.storage
      .from(APPLICATION_PHOTO_BUCKET).createSignedUploadUrl(path, { upsert: false });
    if (error || !signed) throw new Error("無法準備照片上傳，請稍後再試");
    return { path, token: signed.token, mime: data.mime };
  });