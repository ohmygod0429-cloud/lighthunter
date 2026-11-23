import { describe, expect, it } from "vitest";
import { mapLink, seatsLeft, studentKey, teacherSchema } from "./academy";

describe("academy rules", () => {
  it("capacity limits seats, 0 means unlimited", () => {
    expect(seatsLeft(20, 18)).toBe(2);
    expect(seatsLeft(20, 25)).toBe(0);
    expect(seatsLeft(0, 99)).toBeNull();
  });
  it("location without map url falls back to Google Maps search", () => {
    expect(mapLink("台北101", "")).toContain("google.com/maps/search");
    expect(mapLink("", "")).toBe("");
  });
  it("same phone with different formatting is the same student", () => {
    expect(studentKey("0912-345 678")).toBe(studentKey("0912345678"));
  });
  it("teacher requires a name", () => {
    expect(teacherSchema.safeParse({ name: "", title: "", category: "", summary: "", experience: "", contact: "", regions: [], photo_path: "", gallery_paths: [] }).success).toBe(false);
  });
});
