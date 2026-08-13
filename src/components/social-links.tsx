import { socialLinks } from "@/data/social";

export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {socialLinks.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
          title={s.label}
          className="grid size-10 place-items-center rounded-full border border-primary/40 text-primary transition-all hover:-translate-y-0.5 hover:bg-primary/10"
        >
          <s.icon className="size-4" />
        </a>
      ))}
    </div>
  );
}
