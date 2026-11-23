import { useEffect, useId, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { getEnteredAdminPasscode, rememberAdminPasscode, useAdminMode } from "@/lib/admin-mode";
import { MAX_SECTION_LINKS, sectionLinksSchema, visibleLinks, type ExternalLink } from "@/lib/section-links";
import { saveSectionLinks } from "@/lib/section-links.functions";

const queryKey = ["section-external-links"];
const inputClass = "w-full min-w-0 rounded-md border border-input bg-background/70 px-3 py-2 text-sm text-foreground outline-none focus:border-primary";
function editableRows(links: ExternalLink[]) {
  return [...links, ...Array.from({ length: Math.max(0, 5 - links.length) }, () => ({ title: "", url: "" }))];
}

export function SectionExternalLinks({ slotId }: { slotId: string }) {
  const admin = useAdminMode();
  const id = useId();
  const queryClient = useQueryClient();
  const saveFn = useServerFn(saveSectionLinks);
  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase.from("section_external_links").select("slot_id, links");
      if (error) throw error;
      return Object.fromEntries((data ?? []).map((row) => {
        const parsed = sectionLinksSchema.safeParse(row.links);
        return [row.slot_id, parsed.success ? visibleLinks(parsed.data) : []];
      })) as Record<string, ExternalLink[]>;
    },
    staleTime: 30_000,
  });
  const [drafts, setDrafts] = useState<ExternalLink[]>(editableRows([]));
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [password, setPassword] = useState("");
  const [needsPassword, setNeedsPassword] = useState(false);
  const saved = query.data?.[slotId];
  useEffect(() => {
    if (!dirty) setDrafts(editableRows(saved ?? []));
  }, [saved, dirty]);

  const update = (index: number, field: keyof ExternalLink, value: string) => {
    setDirty(true);
    setDrafts((rows) => rows.map((row, i) => i === index ? { ...row, [field]: value } : row));
  };

  async function save() {
    const parsed = sectionLinksSchema.safeParse(drafts);
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message ?? "請檢查連結內容"); return; }
    const passcode = getEnteredAdminPasscode() || password;
    if (!passcode) { setNeedsPassword(true); return; }
    setSaving(true);
    try {
      const links = await saveFn({ data: { slotId, passcode, links: parsed.data } });
      rememberAdminPasscode(passcode);
      setPassword("");
      setNeedsPassword(false);
      queryClient.setQueryData<Record<string, ExternalLink[]>>(queryKey, (previous) => ({ ...previous, [slotId]: links }));
      setDirty(false);
      setDrafts(editableRows(links));
      toast.success("外部連結已儲存");
    } catch (error) {
      setNeedsPassword(true);
      rememberAdminPasscode("");
      toast.error(error instanceof Error ? error.message : "儲存失敗，請稍後再試");
    } finally { setSaving(false); }
  }

  const links = saved ?? [];
  if (!admin && links.length === 0) return null;

  return (
    <div className="mt-5 min-w-0" data-section-links={slotId}>
      {links.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {links.map((link, index) => (
            <Button key={`${index}-${link.url}`} asChild variant="outline" className="h-auto max-w-full justify-start whitespace-normal border-primary/40 py-2 text-left text-primary">
              <a href={link.url} target="_blank" rel="noopener noreferrer"><span className="min-w-0 break-words [overflow-wrap:anywhere]">{link.title}</span></a>
            </Button>
          ))}
        </div>
      )}
      {admin && (
        <fieldset className="mt-5 min-w-0 border-t border-border pt-4" disabled={saving || query.isPending || query.isError}>
          <legend className="text-sm text-primary">自訂外部連結清單</legend>
          {query.isError && <p role="alert" className="mb-3 text-sm text-destructive">連結載入失敗，請重新整理後再編輯。</p>}
          <div className="space-y-4">
            {drafts.map((row, index) => (
              <div key={index} className="grid min-w-0 gap-2 sm:grid-cols-[1fr_1.5fr_auto]">
                <label htmlFor={`${id}-title-${index}`} className="min-w-0 text-xs text-muted-foreground">連結標題 {index + 1}
                  <input id={`${id}-title-${index}`} className={`${inputClass} mt-1`} value={row.title} maxLength={200} onChange={(e) => update(index, "title", e.target.value)} />
                </label>
                <label htmlFor={`${id}-url-${index}`} className="min-w-0 text-xs text-muted-foreground">連結網址 {index + 1}
                  <input id={`${id}-url-${index}`} type="url" className={`${inputClass} mt-1`} value={row.url} maxLength={4096} placeholder="https://" onChange={(e) => update(index, "url", e.target.value)} />
                </label>
                <Button type="button" variant="ghost" size="icon" className="self-end text-muted-foreground hover:text-destructive" aria-label={`刪除連結 ${index + 1}`} title={`刪除連結 ${index + 1}`} onClick={() => { setDirty(true); setDrafts((rows) => rows.filter((_, i) => i !== index)); }}><Trash2 /></Button>
              </div>
            ))}
          </div>
          {needsPassword && <label className="mt-4 block text-xs text-muted-foreground">管理者密碼<input type="password" autoComplete="current-password" className={`${inputClass} mt-1`} value={password} onChange={(e) => setPassword(e.target.value)} /></label>}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button type="button" variant="outline" disabled={drafts.length >= MAX_SECTION_LINKS} onClick={() => { setDirty(true); setDrafts((rows) => [...rows, { title: "", url: "" }]); }}><Plus />新增連結</Button>
            <Button type="button" onClick={save}><Save />{saving ? "儲存中…" : "儲存外部連結"}</Button>
            <span className="text-xs text-muted-foreground">{drafts.length} / {MAX_SECTION_LINKS}</span>
          </div>
        </fieldset>
      )}
    </div>
  );
}