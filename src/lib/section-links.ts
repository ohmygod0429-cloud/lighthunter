import { z } from "zod";

export const MAX_SECTION_LINKS = 10;
export const externalLinkSchema = z.object({
  title: z.string().trim().max(200),
  url: z.string().trim().max(4096),
});
export type ExternalLink = z.infer<typeof externalLinkSchema>;

export function isExternalUrl(raw: string) {
  try {
    const url = new URL(raw);
    return (url.protocol === "https:" || url.protocol === "http:") && Boolean(url.hostname) && !url.username && !url.password;
  } catch {
    return false;
  }
}

export const sectionLinksSchema = z.array(externalLinkSchema).max(MAX_SECTION_LINKS)
  .refine((links) => links.every((link) => !link.url || isExternalUrl(link.url)), "請輸入完整的 http:// 或 https:// 外部網址");

export function visibleLinks(links: ExternalLink[]) {
  return links.filter((link) => link.title.trim() && link.url.trim() && isExternalUrl(link.url));
}