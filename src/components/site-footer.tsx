import { Link } from "@tanstack/react-router";
import { MapPin, Phone, Clock } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <h2 className="font-display text-2xl">貓癒所</h2>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            台北市的一處暖光角落，讓咖啡香與貓咪的呼嚕聲替你按下暫停鍵。
          </p>
        </div>

        <div className="space-y-3 text-sm">
          <p className="flex items-start gap-2">
            <MapPin className="mt-0.5 size-4 text-primary" />
            台北市 XX 區 XX 路 XX 號
          </p>
          <p className="flex items-start gap-2">
            <Phone className="mt-0.5 size-4 text-primary" />
            <a href="tel:0212345678" className="hover:underline">
              02-1234-5678
            </a>
          </p>
          <p className="flex items-start gap-2">
            <Clock className="mt-0.5 size-4 text-primary" />
            週二至週日 11:00 – 21:00（週一公休）
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <Link to="/cats" className="block text-muted-foreground hover:text-foreground">
            貓咪成員
          </Link>
          <Link to="/menu" className="block text-muted-foreground hover:text-foreground">
            餐點菜單
          </Link>
          <Link to="/visit" className="block text-muted-foreground hover:text-foreground">
            消費方式與訪客須知
          </Link>
          <Link to="/reserve" className="block text-muted-foreground hover:text-foreground">
            線上預約
          </Link>
        </div>
      </div>
      <p className="border-t border-border/70 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} 貓癒所 Cat Healing House
      </p>
    </footer>
  );
}