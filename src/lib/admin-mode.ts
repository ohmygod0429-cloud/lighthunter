import { useCallback, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { emptyMedia, legacyVideoSlotId, videoSource } from "@/lib/section-media";
import { saveSectionMedia } from "@/lib/section-media.functions";

const ADMIN_KEY = "sfe-admin-unlocked";
const ADMIN_PASSCODE = "0429";
const EVENT = "sfe-admin-change";
let enteredAdminPasscode = "";

export function getEnteredAdminPasscode() {
  return enteredAdminPasscode;
}

export function rememberAdminPasscode(passcode: string) {
  enteredAdminPasscode = passcode;
}

export function isAdminUnlocked() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(ADMIN_KEY) === "1";
}

export function unlockAdmin(passcode: string) {
  if (passcode.trim() !== ADMIN_PASSCODE) return false;
  enteredAdminPasscode = passcode.trim();
  window.localStorage.setItem(ADMIN_KEY, "1");
  window.dispatchEvent(new Event(EVENT));
  return true;
}

export function lockAdmin() {
  enteredAdminPasscode = "";
  window.localStorage.removeItem(ADMIN_KEY);
  window.dispatchEvent(new Event(EVENT));
}

/** 只有輸入管理者密碼後才會回傳 true（訪客一律無法編輯內容） */
export function useAdminMode() {
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const sync = () => setAdmin(isAdminUnlocked());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return admin;
}

const SECTION_PREFIX = "sfe-section:";
const SECTION_EVENT = "sfe-section-change";

/** 區塊是否對一般訪客開放（預設隱藏） */
export function isSectionVisible(sectionId: string) {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(SECTION_PREFIX + sectionId) === "1";
}

export function setSectionVisible(sectionId: string, visible: boolean) {
  if (visible) window.localStorage.setItem(SECTION_PREFIX + sectionId, "1");
  else window.localStorage.removeItem(SECTION_PREFIX + sectionId);
  window.dispatchEvent(new Event(SECTION_EVENT));
}

export function useSectionVisible(sectionId: string) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const sync = () => setVisible(isSectionVisible(sectionId));
    sync();
    window.addEventListener(SECTION_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(SECTION_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [sectionId]);

  const toggle = useCallback(
    () => setSectionVisible(sectionId, !isSectionVisible(sectionId)),
    [sectionId],
  );

  return { visible, toggle };
}

const VIDEO_PREFIX = "sfe-video:";
const VIDEO_EVENT = "sfe-video-change";

export function getVideoUrl(slotId: string) {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(VIDEO_PREFIX + slotId) ?? "";
}

export function setVideoUrl(slotId: string, url: string) {
  if (url) window.localStorage.setItem(VIDEO_PREFIX + slotId, url);
  else window.localStorage.removeItem(VIDEO_PREFIX + slotId);
  window.dispatchEvent(new Event(VIDEO_EVENT));
}

export function useVideoUrl(slotId: string) {
  const admin = useAdminMode();
  const cache = useQueryClient();
  const persist = useServerFn(saveSectionMedia);
  const sharedSlotId = legacyVideoSlotId(slotId);
  const queryKey = ["section-video", slotId];
  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase.from("section_media").select("video_url").eq("slot_id", sharedSlotId).maybeSingle();
      if (error) throw error;
      return data?.video_url ?? null;
    },
    staleTime: 30_000,
  });
  const [localUrl, setLocalUrl] = useState("");

  useEffect(() => {
    const sync = () => setLocalUrl(getVideoUrl(slotId));
    sync();
    window.addEventListener(VIDEO_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(VIDEO_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [slotId]);

  async function save(next: string, password = "") {
    const passcode = getEnteredAdminPasscode() || password;
    if (!passcode) throw new Error("請輸入管理者密碼，將影片儲存至網站");
    const result = await persist({ data: { slotId: sharedSlotId, passcode, media: { ...emptyMedia, video_url: next.trim() } } });
    rememberAdminPasscode(passcode);
    cache.setQueryData(queryKey, result.video_url);
    setVideoUrl(slotId, "");
    await cache.invalidateQueries({ queryKey: ["section-media"] });
  }

  // Existing browser-only settings remain editable, but never masquerade as published data.
  return { url: query.data ?? (admin ? localUrl : ""), save, pending: query.isPending, error: query.isError };
}

/** 把常見影片連結轉成可嵌入的網址 */
export function toEmbedUrl(raw: string): { kind: "iframe" | "file" | "none"; src: string } {
  const url = raw.trim();
  if (!url) return { kind: "none", src: "" };
  const source = videoSource(url);
  if (source) return source;
  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url)) return { kind: "file", src: url };

  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{6,})/i,
  );
  if (yt) return { kind: "iframe", src: `https://www.youtube.com/embed/${yt[1]}` };

  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (vimeo) return { kind: "iframe", src: `https://player.vimeo.com/video/${vimeo[1]}` };

  const fb = url.match(/facebook\.com\/.+\/videos?\//i);
  if (fb)
    return {
      kind: "iframe",
      src: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}`,
    };

  return { kind: "iframe", src: url };
}
