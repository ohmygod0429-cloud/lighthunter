import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { mapLink, seatsLeft, studentKey, teacherSchema } from "./academy";

describe("academy rules", () => {
  test("capacity limits seats, 0 means unlimited", () => {
    assert.equal(seatsLeft(20, 18), 2);
    assert.equal(seatsLeft(20, 25), 0);
    assert.equal(seatsLeft(0, 99), null);
  });
  test("location without map url falls back to Google Maps search", () => {
    assert.ok(mapLink("台北101", "").includes("google.com/maps/search"));
    assert.equal(mapLink("", ""), "");
  });
  test("same phone with different formatting is the same student", () => {
    assert.equal(studentKey("0912-345 678"), studentKey("0912345678"));
  });
  test("teacher requires a name", () => {
    assert.equal(teacherSchema.safeParse({ name: "", title: "", category: "", summary: "", experience: "", contact: "", regions: [], photo_path: "", gallery_paths: [] }).success, false);
  });
});
