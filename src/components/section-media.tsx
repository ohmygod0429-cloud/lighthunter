import { useEffect, useId, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Save, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { getEnteredAdminPasscode, rememberAdminPasscode, useAdminMode } from "@/lib/admin-mode";
import { emptyMedia, MAX_MEDIA_BYTES, MEDIA_BUCKET, mediaSchema, uploadType, videoSource, type SectionMedia } from "@/lib/section-media";
import { discardSectionUploads, prepareSectionUpload, saveSectionMedia } from "@/lib/section-media.functions";

const queryKey = ["section-media"];
const inputClass = "mt-1 w-full min-w-0 rounded-md border border-input bg-background/70 px-3 py-2 text-sm text-foreground outline-none focus:border-primary";
type Published = SectionMedia & { videoSrc: string; fileSrc: string };

export function SectionMediaEditor({ slotId }: { slotId: string }) {
  const admin = useAdminMode();
  const id = useId();
  const cache = useQueryClient();
  const prepare = useServerFn(prepareSectionUpload);
  const persist = useServerFn(saveSectionMedia);
  const discard = useServerFn(discardSectionUploads);
  const query = useQuery({
    queryKey,
    queryFn: async (): Promise<Record<string, Published>> => {
      const { data, error } = await supabase.from("section_media").select("slot_id,video_title,video_url,video_path,file_title,file_path,file_name");
      if (error) throw error;
      const rows = data ?? [];
      const paths = rows.flatMap((row) => [row.video_path, row.file_path]).filter(Boolean);
      const urls = new Map<string, string>();
      if (paths.length) {
        const signed = await supabase.storage.from(MEDIA_BUCKET).createSignedUrls(paths, 86400);
        if (signed.error) throw signed.error;
        for (const item of signed.data ?? []) if (item.path && item.signedUrl) urls.set(item.path, item.signedUrl);
      }
      return Object.fromEntries(rows.map((row) => [row.slot_id, { ...row, videoSrc: urls.get(row.video_path) ?? row.video_url, fileSrc: urls.get(row.file_path) ?? "" }]));
    },
    staleTime: 600_000,
  });
  const saved = query.data?.[slotId];
  const [draft, setDraft] = useState<SectionMedia>(emptyMedia);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [password, setPassword] = useState("");
  const [needsPassword, setNeedsPassword] = useState(false);
  useEffect(() => { if (!dirty) setDraft(saved ?? emptyMedia); }, [saved, dirty]);

  function update(field: keyof SectionMedia, value: string) {
    setDirty(true);
    setDraft((previous) => ({ ...previous, [field]: value, ...(field === "video_url" ? { video_path: "" } : {}) }));
    if (field === "video_url") setVideoFile(null);
  }
  function choose(file: File | undefined, kind: "video" | "file") {
    if (!file) return;
    try {
      uploadType(file.name, kind);
      if (file.size === 0 || file.size > MAX_MEDIA_BYTES) throw new Error("請選擇非空白且不超過 50 MB 的檔案");
      setDirty(true);
      if (kind === "video") { setVideoFile(file); setDraft((m) => ({ ...m, video_url: "", video_path: "" })); }
      else { setAttachment(file); setDraft((m) => ({ ...m, file_path: "", file_name: file.name })); }
    } catch (error) { toast.error(error instanceof Error ? error.message : "無法選取檔案"); }
  }
  async function save() {
    const parsed = mediaSchema.safeParse(draft);
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message ?? "請檢查內容"); return; }
    const passcode = getEnteredAdminPasscode() || password;
    if (!passcode) { setNeedsPassword(true); return; }
    setBusy(true);
    const uploaded: string[] = [];
    try {
      const next = { ...parsed.data };
      for (const [kind, file] of [["video", videoFile], ["file", attachment]] as const) {
        if (!file) continue;
        setStatus(kind === "video" ? "影片上傳中…" : "檔案上傳中…");
        const prepared = await prepare({ data: { slotId, passcode, kind, name: file.name, size: file.size } });
        uploaded.push(prepared.path);
        const { error } = await supabase.storage.from(MEDIA_BUCKET).uploadToSignedUrl(prepared.path, prepared.token, file, { contentType: prepared.mime });
        if (error) throw new Error("上傳失敗，請確認網路後重試");
        if (kind === "video") next.video_path = prepared.path;
        else { next.file_path = prepared.path; next.file_name = file.name; }
      }
      setStatus("儲存中…");
      const result = await persist({ data: { slotId, passcode, media: next } });
      rememberAdminPasscode(passcode);
      setPassword(""); setNeedsPassword(false); setVideoFile(null); setAttachment(null); setDirty(false); setDraft(result);
      await cache.invalidateQueries({ queryKey });
      toast.success("介紹影片與夾帶檔案已儲存");
    } catch (error) {
      if (uploaded.length) await discard({ data: { slotId, passcode, paths: uploaded } }).catch(() => undefined);
      if (error instanceof Error && error.message.includes("密碼")) { setNeedsPassword(true); rememberAdminPasscode(""); }
      toast.error(error instanceof Error ? error.message : "儲存失敗，請稍後再試");
    } finally { setBusy(false); setStatus(""); }
  }

  const video = saved?.videoSrc ? (saved.video_path ? { kind: "file" as const, src: saved.videoSrc } : videoSource(saved.videoSrc)) : null;
  const showFile = Boolean(saved?.fileSrc);
  if (!admin && !video && !showFile) return null;

  return <div className="mt-5 min-w-0" data-section-media={slotId}>
    {video && <div className="min-w-0">
      {saved?.video_title && <p className="mb-3 break-words text-sm text-primary">{saved.video_title}</p>}
      <div className="aspect-video w-full overflow-hidden rounded-md border border-border bg-background">
        {video.kind === "file" ? <video key={video.src} src={video.src} controls playsInline preload="metadata" aria-label={saved?.video_title || "介紹影片"} className="size-full" /> : <iframe src={video.src} title={saved?.video_title || "介紹影片"} loading="lazy" allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen className="size-full" />}
      </div>
    </div>}
    {showFile && <Button asChild variant="outline" className="mt-3 h-auto max-w-full whitespace-normal border-primary/40 py-2 text-left text-primary"><a href={saved?.fileSrc} target="_blank" rel="noopener noreferrer"><span className="min-w-0 break-words [overflow-wrap:anywhere]">{saved?.file_title || saved?.file_name || "下載檔案"}</span></a></Button>}
    {admin && <fieldset className="mt-5 min-w-0 space-y-4 border-t border-border pt-4" disabled={busy || query.isPending || query.isError}>
      <legend className="text-sm text-primary">站內介紹影片與夾帶檔案</legend>
      {query.isError && <p role="alert" className="text-sm text-destructive">資料載入失敗，請重新整理後再編輯。</p>}
      <label className="block text-xs text-muted-foreground" htmlFor={`${id}-video-title`}>影片標題（選填）<input id={`${id}-video-title`} className={inputClass} value={draft.video_title} maxLength={200} onChange={(e) => update("video_title", e.target.value)} /></label>
      <label className="block text-xs text-muted-foreground" htmlFor={`${id}-video-url`}>影片連結<input id={`${id}-video-url`} type="url" className={inputClass} value={draft.video_url} placeholder="YouTube / Vimeo / MP4 / WebM / Ogg" onChange={(e) => update("video_url", e.target.value)} /></label>
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <Button asChild variant="outline"><label htmlFor={`${id}-video-upload`} className="cursor-pointer"><Upload />選擇本機影片</label></Button>
        <input id={`${id}-video-upload`} type="file" accept="video/mp4,video/webm,video/ogg,.mp4,.webm,.ogg" className="sr-only" onChange={(e) => { choose(e.target.files?.[0], "video"); e.target.value = ""; }} />
        <Button type="button" variant="ghost" size="icon" title="移除介紹影片" aria-label="移除介紹影片" onClick={() => { setDirty(true); setVideoFile(null); setDraft((m) => ({ ...m, video_title: "", video_url: "", video_path: "" })); }}><Trash2 /></Button>
        {(videoFile || draft.video_path) && <span className="min-w-0 break-all text-xs text-muted-foreground">{videoFile?.name ?? "已儲存影片"}</span>}
      </div>
      <div className="border-t border-border pt-4">
        <label className="block text-xs text-muted-foreground" htmlFor={`${id}-file-title`}>檔案標題（選填）<input id={`${id}-file-title`} className={inputClass} value={draft.file_title} maxLength={200} onChange={(e) => update("file_title", e.target.value)} /></label>
        <div className="mt-3 flex min-w-0 flex-wrap items-center gap-2">
          <Button asChild variant="outline"><label htmlFor={`${id}-file-upload`} className="cursor-pointer"><Upload />選擇夾帶檔案</label></Button>
          <input id={`${id}-file-upload`} type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip" className="sr-only" onChange={(e) => { choose(e.target.files?.[0], "file"); e.target.value = ""; }} />
          <Button type="button" variant="ghost" size="icon" title="移除夾帶檔案" aria-label="移除夾帶檔案" onClick={() => { setDirty(true); setAttachment(null); setDraft((m) => ({ ...m, file_title: "", file_path: "", file_name: "" })); }}><Trash2 /></Button>
          {draft.file_name && <span className="min-w-0 break-all text-xs text-muted-foreground">{draft.file_name}</span>}
        </div>
      </div>
      {needsPassword && <label className="block text-xs text-muted-foreground">管理者密碼<input type="password" autoComplete="current-password" className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} /></label>}
      <Button type="button" onClick={save}><Save />{busy ? status : "儲存影片與檔案"}</Button>
    </fieldset>}
  </div>;
}