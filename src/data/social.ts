import { Instagram, Facebook, Youtube, Music2, AtSign, type LucideIcon } from "lucide-react";

export type SocialLink = {
  label: string;
  href: string;
  icon: LucideIcon;
};

/** 社群平台連結：把 href 換成你的實際帳號網址即可 */
export const socialLinks: SocialLink[] = [
  { label: "Instagram", href: "https://www.instagram.com/", icon: Instagram },
  { label: "Facebook", href: "https://www.facebook.com/", icon: Facebook },
  { label: "YouTube", href: "https://www.youtube.com/", icon: Youtube },
  { label: "TikTok", href: "https://www.tiktok.com/", icon: Music2 },
  { label: "Threads", href: "https://www.threads.net/", icon: AtSign },
];
