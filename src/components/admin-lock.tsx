import { useState } from "react";
import { Lock, LockOpen, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";
import { lockAdmin, unlockAdmin, useAdminMode } from "@/lib/admin-mode";

export function AdminLock() {
  const admin = useAdminMode();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (unlockAdmin(code)) {
      toast.success("管理者模式已開啟，可編輯各區塊影片連結");
      setOpen(false);
      setCode("");
    } else {
      toast.error("管理者密碼錯誤");
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && !admin && (
        <form
          onSubmit={submit}
          className="glass-card mb-3 w-64 rounded-2xl p-5 shadow-lux"
        >
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 text-xs tracking-[0.24em] text-primary">
              <ShieldCheck className="size-4" /> 管理者登入
            </p>
            <button type="button" aria-label="關閉" onClick={() => setOpen(false)}>
              <X className="size-4 text-muted-foreground" />
            </button>
          </div>
          <input
            type="password"
            inputMode="numeric"
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="請輸入管理者密碼"
            className="mt-4 w-full rounded-full border border-border bg-background/70 px-4 py-2 text-sm outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="mt-3 w-full rounded-full bg-gold-gradient py-2 text-xs font-medium text-primary-foreground"
          >
            解鎖編輯
          </button>
          <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
            訪客只能瀏覽，無法更改網頁內容。
          </p>
        </form>
      )}

      <button
        type="button"
        onClick={() => (admin ? (lockAdmin(), toast.success("已鎖定，回到訪客模式")) : setOpen((v) => !v))}
        aria-label={admin ? "鎖定管理者模式" : "開啟管理者登入"}
        className="grid size-11 place-items-center rounded-full border border-primary/50 bg-card/80 text-primary backdrop-blur-xl transition-colors hover:bg-primary/10"
      >
        {admin ? <LockOpen className="size-5" /> : <Lock className="size-5" />}
      </button>
    </div>
  );
}
