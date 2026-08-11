import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";

const searchSchema = z.object({
  name: z.string().optional(),
});

export const Route = createFileRoute("/reserve/success")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "預約成功｜專屬引路人將與你聯繫" },
      {
        name: "description",
        content: "你的卡位申請已成功送出，專屬引路人將於 3 天內與你聯繫，完成一對一深度對接。",
      },
      { property: "og:title", content: "預約成功｜獵光者共生共榮未來生態圈" },
      { property: "og:description", content: "你的卡位申請已成功送出，專屬引路人將於 3 天內與你聯繫。" },
    ],
  }),
  component: ReserveSuccessPage,
});

function ReserveSuccessPage() {
  const { name } = Route.useSearch<{ name?: string }>();

  return (
    <div className="mx-auto max-w-2xl px-5 py-20 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-4xl">
        ✓
      </div>
      <h1 className="mt-8 text-3xl font-semibold tracking-tight sm:text-4xl">
        預約已成功送出
      </h1>
      <p className="mt-4 leading-loose text-muted-foreground">
        {name ? `感謝 ${name} 的卡位申請，` : "感謝你的卡位申請，"}
        專屬引路人將於 3 天內與你聯繫，完成一對一深度對接。
      </p>

      <div className="mt-10 rounded-2xl border border-border bg-card/60 p-6 text-left">
        <h2 className="text-lg font-medium text-foreground">下一步</h2>
        <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <span className="text-primary">01</span>
            <span>請留意手機與電子郵件，引路人會主動與你確認時間。</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary">02</span>
            <span>加入官方 LINE 群，搶先接收說明會資訊與獨家創始禮遇。</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary">03</span>
            <span>準備好你的問題與需求，讓一對一對接更高效。</span>
          </li>
        </ul>
        <a
          href="https://line.me/ti/g/XXXXXX"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 block w-full rounded-full bg-gold-gradient py-3 text-center text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5"
        >
          加入官方 LINE 群
        </a>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          返回首頁
        </Link>
        <Link
          to="/founding"
          className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          了解創始禮遇
        </Link>
      </div>
    </div>
  );
}
