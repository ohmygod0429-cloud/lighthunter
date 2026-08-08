import { createFileRoute } from "@tanstack/react-router";
import { faqs } from "@/data/faqs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/visit")({
  head: () => ({
    meta: [
      { title: "消費方式與訪客須知｜貓癒所" },
      {
        name: "description",
        content: "貓癒所入場費用、時段規定、與貓咪互動的注意事項與常見問題 Q&A，來店前先讀一次更安心。",
      },
      { property: "og:title", content: "消費方式與訪客須知｜貓癒所" },
      { property: "og:description", content: "入場費、時段規則、互動禮儀與常見問題全整理。" },
      { property: "og:url", content: "/visit" },
    ],
    links: [{ rel: "canonical", href: "/visit" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: VisitPage,
});

function VisitPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <h1 className="text-4xl">消費方式與訪客須知</h1>

      <section className="mt-10 grid gap-5 sm:grid-cols-3">
        {[
          { t: "入場費", v: "NT$ 250 / 人", d: "含 90 分鐘貓咪互動，並可折抵飲品 100 元。" },
          { t: "延長時段", v: "NT$ 100 / 30 分", d: "現場依貓咪狀況與座位空位提供。" },
          { t: "兒童入場", v: "6 歲以上", d: "未滿 12 歲需家長全程陪同。" },
        ].map((c) => (
          <div key={c.t} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <p className="text-sm text-muted-foreground">{c.t}</p>
            <p className="mt-2 text-2xl text-primary">{c.v}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.d}</p>
          </div>
        ))}
      </section>

      <section className="mt-14 rounded-3xl surface-warm p-8">
        <h2 className="text-2xl">與貓咪相處的 6 個約定</h2>
        <ol className="mt-6 space-y-4 text-sm leading-relaxed">
          {[
            "入場前請先洗手與消毒，這是保護貓咪也保護你。",
            "請勿抱起、追逐或叫醒睡著的貓咪，讓牠們主動靠近你。",
            "禁止餵食自備食物，店內有專用零食可向店員索取。",
            "室內請放輕音量、不使用閃光燈拍照。",
            "貓咪進入休息室時代表想獨處，請不要打擾。",
            "隨身物品請放入置物櫃，避免貓咪誤食小物件。",
          ].map((r, i) => (
            <li key={r} className="flex gap-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-xs text-primary-foreground">
                {i + 1}
              </span>
              {r}
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl">常見問題 Q&amp;A</h2>
        <Accordion type="single" collapsible className="mt-6">
          {faqs.map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger className="text-left text-base">{f.q}</AccordionTrigger>
              <AccordionContent className="leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}