import { test } from "node:test";
import { strict as assert } from "node:assert";
import { applicationPhotoPath, applicationPhotoUploadSchema, applicationRecordSchema, MAX_APPLICATION_PHOTO_BYTES } from "./application-security";

const record = {
  full_name: "安全測試", birth_date: "1989/04/02", title_company: "測試企業",
  phone: "0912345678", messenger: "test", business_email: "security-test@example.com",
  life_photo_path: "life/12345678-1234-4234-8234-123456789abc.jpg",
  headshot_path: "headshot/12345678-1234-4234-8234-123456789abc.png",
  revenue_band: "未填", liquid_assets: "未填", industry: "科技創新", pillars: "健康特權",
  core_value: "資源分享", prior_orgs: null, licenses: "無", referrer: null,
  agree_etiquette: true, agree_truthful: true, agree_house_rules: true, meeting_time_pref: "平日下午",
};

test("applications require nonempty details and reject digits in names", () => {
  assert.equal(applicationRecordSchema.safeParse(record).success, true);
  assert.equal(applicationRecordSchema.safeParse({ ...record, full_name: "" }).success, false);
  assert.equal(applicationRecordSchema.safeParse({ ...record, full_name: "安全1" }).success, false);
});
test("application phone numbers contain exactly ten digits", () => {
  assert.equal(applicationRecordSchema.safeParse({ ...record, phone: "091234567" }).success, false);
  assert.equal(applicationRecordSchema.safeParse({ ...record, phone: "09123456789" }).success, false);
});
test("all three existing application commitments are required", () => {
  for (const field of ["agree_etiquette", "agree_truthful", "agree_house_rules"]) {
    assert.equal(applicationRecordSchema.safeParse({ ...record, [field]: false }).success, false);
  }
});
test("core contribution text retains its unlimited length", () => {
  assert.equal(applicationRecordSchema.safeParse({ ...record, core_value: "資源".repeat(100_000) }).success, true);
});
test("photo capabilities only cover JPG PNG WebP up to 10 MB", () => {
  assert.equal(MAX_APPLICATION_PHOTO_BYTES, 10 * 1024 * 1024);
  assert.equal(applicationPhotoUploadSchema.safeParse({ folder: "life", mime: "image/png", size: MAX_APPLICATION_PHOTO_BYTES }).success, true);
  assert.equal(applicationPhotoUploadSchema.safeParse({ folder: "life", mime: "image/png", size: MAX_APPLICATION_PHOTO_BYTES + 1 }).success, false);
  assert.equal(applicationPhotoUploadSchema.safeParse({ folder: "life", mime: "text/html", size: 10 }).success, false);
  assert.equal(applicationPhotoUploadSchema.safeParse({ folder: "../headshot", mime: "image/png", size: 10 }).success, false);
});
test("photo paths use a generated identifier rather than a submitted filename", () => {
  assert.equal(applicationPhotoPath({ folder: "headshot", mime: "image/png", size: 10 }, "12345678-1234-4234-8234-123456789abc"), "headshot/12345678-1234-4234-8234-123456789abc.png");
  assert.throws(() => applicationPhotoPath({ folder: "life", mime: "image/jpeg", size: 10 }, "../other-photo"));
});