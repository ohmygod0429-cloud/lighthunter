import { z } from "zod";

export const APPLICATION_PHOTO_BUCKET = "application-photos";
export const MAX_APPLICATION_PHOTO_BYTES = 10 * 1024 * 1024;
export const applicationPhotoUploadSchema = z.object({
  folder: z.enum(["life", "headshot"]),
  mime: z.enum(["image/jpeg", "image/png", "image/webp"]),
  size: z.number().int().positive().max(MAX_APPLICATION_PHOTO_BYTES),
});

export function applicationPhotoPath(input: z.infer<typeof applicationPhotoUploadSchema>, id: string) {
  const valid = applicationPhotoUploadSchema.parse(input);
  const uuid = z.string().uuid().parse(id);
  const ext = valid.mime === "image/jpeg" ? "jpg" : valid.mime === "image/png" ? "png" : "webp";
  return `${valid.folder}/${uuid}.${ext}`;
}

const required = z.string().trim().min(1);
export const applicationRecordSchema = z.object({
  full_name: required.refine((value) => !/[0-9]/.test(value)),
  birth_date: z.string().regex(/^[0-9]{4}\/[0-9]{2}\/[0-9]{2}$/),
  title_company: required,
  phone: z.string().regex(/^[0-9]{10}$/),
  messenger: required,
  business_email: z.string().trim().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  life_photo_path: z.string().regex(/^life\/[a-zA-Z0-9-]+\.(jpg|jpeg|png|webp)$/),
  headshot_path: z.string().regex(/^headshot\/[a-zA-Z0-9-]+\.(jpg|jpeg|png|webp)$/),
  revenue_band: required,
  liquid_assets: required,
  industry: required,
  pillars: required,
  core_value: required,
  prior_orgs: z.string().nullable(),
  licenses: required,
  referrer: z.string().nullable(),
  agree_etiquette: z.literal(true),
  agree_truthful: z.literal(true),
  agree_house_rules: z.literal(true),
  meeting_time_pref: required,
});