import { Instagram, Facebook, Youtube, Music2, AtSign, type LucideIcon } from "lucide-react";

export type SocialLink = {
  label: string;
  /** 填入實際帳號網址即視為「已綁定」，會自動公開顯示；留空字串則隱藏 */
  href: string;
  icon: LucideIcon;
};

/** 社群平台連結：綁定方式＝把 href 填上你的實際帳號網址；未填（空字串）的平台不會顯示 */
export const socialLinks: SocialLink[] = [
  { label: "Instagram", href: "", icon: Instagram },
  { label: "Facebook", href: "", icon: Facebook },
  { label: "YouTube", href: "", icon: Youtube },
  { label: "TikTok", href: "", icon: Music2 },
  { label: "Threads", href: "", icon: AtSign },
];

/** 已綁定（有填網址）的社群連結 */
export const boundSocialLinks = socialLinks.filter((s) => s.href.trim() !== "");
