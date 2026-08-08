import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/reserve")({
  head: () => ({
    meta: [
      { title: "線上預約｜貓癒所貓咪咖啡廳訂位" },
      {
        name: "description",
        content: "線上預約貓癒所的來店時段：選擇日期、時段與人數，我們會在一個工作日內電話確認。",
      },
      { property: "og:title", content: "線上預約｜貓癒所" },
      { property: "og:description", content: "選好日期與時段，把療癒的 90 分鐘先留給自己。" },
      { property: "og:url", content: "/reserve" },
    ],
    links: [{ rel: "canonical", href: "/reserve" }],
  }),
  component: ReservePage,
});

const slots = ["11:00 – 12:30", "13:00 – 14:30", "15:00 – 16:30", "17:00 – 18:30", "19:00 – 20:30"];

function ReservePage() {
  const [slot, setSlot] = useState("");
  const [people, setPeople] = useState("2");

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="text-4xl">線上預約</h1>
      <p className="mt-4 leading-loose text-muted-foreground">
        每個時段為 90 分鐘，同時段最多接待 12 位客人。送出後我們會於一個工作日內以電話或簡訊確認，
        當日預約請直接來電 02-1234-5678。
      </p>

      <form
        className="mt-10 space-y-6 rounded-3xl border border-border bg-card p-8 shadow-soft"
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          if (!slot) {
            toast.error("請選擇來店時段");
            return;
          }
          toast.success("預約申請已送出，我們會盡快與你確認！");
          form.reset();
          setSlot("");
          setPeople("2");
        }}
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">姓名</Label>
            <Input id="name" name="name" required placeholder="王小貓" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">聯絡電話</Label>
            <Input id="phone" name="phone" type="tel" required placeholder="0912-345-678" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">預約日期</Label>
            <Input id="date" name="date" type="date" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="people">人數</Label>
            <Select value={people} onValueChange={setPeople}>
              <SelectTrigger id="people">
                <SelectValue placeholder="選擇人數" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n} 位
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          <Label>來店時段</Label>
          <div className="flex flex-wrap gap-2">
            {slots.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSlot(s)}
                aria-pressed={slot === s}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  slot === s
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:bg-secondary"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">※ 週一為貓咪的公休日，不開放預約。</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="note">備註</Label>
          <Textarea id="note" name="note" rows={3} placeholder="例如：想見布丁、有帶小孩、對貓毛過敏…" />
        </div>

        <Button type="submit" className="w-full rounded-full py-6 text-base">
          送出預約申請
        </Button>
      </form>
    </div>
  );
}