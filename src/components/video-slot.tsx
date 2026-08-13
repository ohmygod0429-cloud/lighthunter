import { useEffect, useState } from "react";
import { Film, Link2, Trash2 } from "lucide-react";
import { useAdminMode, useVideoUrl, toEmbedUrl } from "@/lib/admin-mode";

type Props = {
  /** 每個區塊唯一的識別碼 */
  slotId: string;
  title?: string;
  className?: string;
};

export function VideoSlot({ slotId, title = "區塊影片", className = "" }: Props) {
  const admin = useAdminMode();
  const { url, save } = useVideoUrl(slotId);
  const [draft, setDraft] = useState(url);

  useEffect(() => setDraft(url), [url]);

  const embed = toEmbedUrl(url);

  // 訪客且尚未設定影片時，完全不顯示這個區塊
  if (!admin && embed.kind === "none") return null;

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
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
              className="size-full"
            />
          </div>
        )}

        {embed.kind === "file" && (
          <video src={embed.src} controls className="mt-4 w-full rounded-xl border border-border" />
        )}

        {admin && (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              <Link2 className="size-4" /> 影片連結
            </span>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="貼上 YouTube / Vimeo / MP4 連結"
              className="min-w-0 flex-1 rounded-full border border-border bg-background/70 px-4 py-2 text-sm outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={() => save(draft)}
              className="rounded-full bg-gold-gradient px-5 py-2 text-xs font-medium text-primary-foreground"
            >
              儲存影片
            </button>
            {url && (
              <button
                type="button"
                onClick={() => save("")}
                aria-label="移除影片"
                className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            )}
          </div>
        )}

        {admin && embed.kind === "none" && (
          <p className="mt-3 text-xs text-muted-foreground">
            尚未設定影片，訪客不會看到此區塊。
          </p>
        )}
      </div>
    </section>
  );
}
