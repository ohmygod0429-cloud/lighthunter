import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import lineQr from "@/assets/line-qr.png";

const LINE_GROUP_URL =
  "https://line.me/ti/g2/bIUtx1-DK-hRNLLSJRi7mcJ3g8RKROP3D6HjHQ?utm_source=invitation&utm_medium=link_copy&utm_campaign=default";

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
        content: "你的卡位申請已成功送出，專屬引路人將依序與你聯繫，完成一對一深度對接。",
      },
      { property: "og:title", content: "預約成功｜獵光者共生共榮未來生態圈" },
      { property: "og:description", content: "你的卡位申請已成功送出，專屬引路人將依序與你聯繫。" },
    ],
  }),
  component: ReserveSuccessPage,
});

function ReserveSuccessPage() {
  const { name } = Route.useSearch();

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

        <div className="mt-6 flex flex-col items-center gap-5 rounded-2xl border border-primary/25 bg-background/60 p-6 sm:flex-row sm:items-center sm:gap-6">
          <img
            src={lineQr}
            alt="獵光者 LINE 官方群 QR Code，掃碼即可加入社群"
            width={180}
            height={180}
            className="size-44 rounded-xl bg-white p-2 shadow-lux sm:size-48"
            loading="lazy"
          />
          <div className="flex-1 text-center sm:text-left">
            <p className="text-base font-medium text-foreground">掃碼立即加入 LINE 群</p>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              開啟 LINE 相機掃描左方 QR Code，或點選下方按鈕一鍵加入「獵光者　共生共榮未來生態圈」社群。
            </p>
            <a
              href={LINE_GROUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center justify-center rounded-full bg-gold-gradient px-7 py-3 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5"
            >
              一鍵加入 LINE 群
            </a>
          </div>
        </div>
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
