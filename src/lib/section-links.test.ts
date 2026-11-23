import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { isExternalUrl, sectionLinksSchema, visibleLinks } from "./section-links";

describe("section external links", () => {
  test("each section supports five through ten links, never eleven", () => {
    for (const count of [5, 10]) assert.equal(sectionLinksSchema.safeParse(Array.from({ length: count }, () => ({ title: "官網", url: "https://example.com" }))).success, true);
    assert.equal(sectionLinksSchema.safeParse(Array.from({ length: 11 }, () => ({ title: "官網", url: "https://example.com" }))).success, false);
  });
  test("only complete links appear, empty and partially cleared rows leave no item", () => {
    assert.deepEqual(visibleLinks([{ title: "", url: "" }, { title: "標題", url: "" }, { title: "", url: "https://example.com" }, { title: "官網", url: "https://example.com" }]), [{ title: "官網", url: "https://example.com" }]);
    assert.deepEqual(visibleLinks([]), []);
  });
  test("websites, Facebook, articles and videos are external URLs", () => {
    for (const url of ["https://facebook.com/posts/123", "https://example.com/article", "https://youtube.com/watch?v=123", "https://example.com/video.mp4", "http://example.com"]) assert.equal(isExternalUrl(url), true);
  });
  test("unsafe or invalid schemes cannot be saved", () => {
    for (const url of ["javascript:alert(1)", "data:text/html,test", "not a url"]) assert.equal(sectionLinksSchema.safeParse([{ title: "連結", url }]).success, false);
  });
});