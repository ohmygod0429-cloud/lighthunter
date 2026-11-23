import { test } from "node:test";
import { strict as assert } from "node:assert";
import { emptyMedia, mediaSchema, publishedMedia, uploadType, videoSource } from "./section-media";

test("an unset or cleared introduction video is entirely hidden", () => {
  assert.deepEqual(publishedMedia({ ...emptyMedia, video_title: "介紹" }), emptyMedia);
});
test("saved video title and source publish together", () => {
  assert.equal(publishedMedia({ ...emptyMedia, video_title: "介紹", video_url: "https://example.com/intro.mp4" }).video_title, "介紹");
  assert.equal(publishedMedia({ ...emptyMedia, video_title: "介紹", video_path: "pillar-01/video/test.mp4" }).video_path, "pillar-01/video/test.mp4");
});
test("attachments need an uploaded file", () => {
  assert.deepEqual(publishedMedia({ ...emptyMedia, file_title: "資料" }), emptyMedia);
  assert.equal(publishedMedia({ ...emptyMedia, file_title: "資料", file_path: "pillar-01/file/test.pdf", file_name: "test.pdf" }).file_title, "資料");
});
test("video links become in-page players, never arbitrary website embeds", () => {
  assert.equal(videoSource("https://youtu.be/abcdefghijk")?.src, "https://www.youtube.com/embed/abcdefghijk");
  assert.equal(videoSource("https://vimeo.com/123456")?.src, "https://player.vimeo.com/video/123456");
  assert.equal(videoSource("https://example.com/intro.mp4?token=1")?.kind, "file");
  assert.equal(mediaSchema.safeParse({ ...emptyMedia, video_url: "javascript:alert(1)" }).success, false);
  assert.equal(videoSource("https://youtube.com.evil.example/watch?v=abcdefghijk"), null);
});
test("local uploads accept videos and documents, not active web pages", () => {
  assert.equal(uploadType("介紹.mp4", "video").mime, "video/mp4");
  assert.equal(uploadType("資料.pdf", "file").mime, "application/pdf");
  assert.equal(uploadType("資料.docx", "file").ext, "docx");
  assert.throws(() => uploadType("資料.html", "file"));
  assert.throws(() => uploadType("資料.pdf", "video"));
});test("video and file show without titles", () => {
  assert.equal(publishedMedia({ ...emptyMedia, video_url: "https://youtu.be/abcdefg" }).video_url, "https://youtu.be/abcdefg");
  assert.equal(publishedMedia({ ...emptyMedia, file_path: "pillar-01/file/a.pdf", file_name: "a.pdf" }).file_path, "pillar-01/file/a.pdf");
  assert.equal(videoSource("https://youtube.com/shorts/abcdefg")?.src, "https://www.youtube.com/embed/abcdefg");
});
