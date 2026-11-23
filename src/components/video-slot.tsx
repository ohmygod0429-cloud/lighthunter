import { useEffect, useState } from "react";
import { Film, Link2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAdminMode, useVideoUrl, toEmbedUrl } from "@/lib/admin-mode";
import { SectionExternalLinks } from "@/components/section-external-links";

type Props = {
  /** 每個區塊唯一的識別碼 */
  slotId: string;
  title?: string;
  className?: string;
};

export function VideoSlot({ slotId, title = "區塊影片", className = "" }: Props) {
  const admin = useAdminMode();
  const { url, save, pending, error } = useVideoUrl(slotId);
  const [draft, setDraft] = useState(url);
  const [saving, setSaving] = useState(false);
  const [password, setPassword] = useState("");
  const [needsPassword, setNeedsPassword] = useState(false);

  async function publish(next: string) {
    setSaving(true);
    try {
      await save(next, password);
      setNeedsPassword(false);
      setPassword("");
      toast.success("影片已儲存，訪客可直接觀看");
    } catch (error) {
      if (error instanceof Error && error.message.includes("密碼")) setNeedsPassword(true);
      toast.error(error instanceof Error ? error.message : "影片儲存失敗，請稍後再試");
    } finally { setSaving(false); }
  }

  useEffect(() => setDraft(url), [url]);

  const embed = toEmbedUrl(url);

  // 訪客且尚未設定影片時，完全不顯示這個區塊
  if (!admin && embed.kind === "none") return (
    <div className={`mx-auto max-w-4xl px-5 ${className} empty:hidden`}>
      <SectionExternalLinks slotId={slotId} />
    </div>
  );

  return (
    <section className={`mx-auto max-w-4xl px-5 ${className}`}>
      <div className="glass-card rounded-2xl p-5 shadow-lux">
        <p className="flex items-center gap-2 text-xs tracking-[0.28em] text-primary">
          <Film className="size-4" /> {title}
        </p>

        {embed.kind === "iframe" && (
          <div className="mt-4 aspect-video overflow-hidden rounded-xl border border-border">
            <iframe
              src={embed.src}
              title={title}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share; fullscreen"
              allowFullScreen
              className="size-full"
            />
          </div>
        )}

        {embed.kind === "file" && (
          <video src={embed.src} controls playsInline preload="metadata" aria-label={title} className="mt-4 w-full rounded-xl border border-border" />
        )}

        {admin && (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              <Link2 className="size-4" /> 影片連結
            </span>
            <input
              value={draft}
              aria-label={`${title}影片連結`}
              disabled={saving || pending || error}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="貼上 YouTube / Vimeo / MP4 連結"
              className="min-w-0 flex-1 rounded-full border border-border bg-background/70 px-4 py-2 text-sm outline-none focus:border-primary"
            />
            <Button
              type="button"
              disabled={saving || pending || error}
              onClick={() => publish(draft)}
              className="rounded-full bg-gold-gradient px-5 py-2 text-xs font-medium text-primary-foreground"
            >
              {saving ? "儲存中…" : "儲存影片"}
            </Button>
            {url && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={saving || pending || error}
                onClick={() => publish("")}
                aria-label="移除影片"
                className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>
        )}
        {admin && needsPassword && <label className="mt-3 block text-xs text-muted-foreground">管理者密碼<input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-md border border-border bg-background/70 px-3 py-2 text-sm" /></label>}
        {admin && error && <p role="alert" className="mt-3 text-xs text-destructive">影片資料載入失敗，請重新整理後再編輯。</p>}

        {admin && embed.kind === "none" && (
          <p className="mt-3 text-xs text-muted-foreground">
            尚未設定影片，訪客不會看到此區塊。
          </p>
        )}
      </div>
      <SectionExternalLinks slotId={slotId} />
    </section>
  );
}
