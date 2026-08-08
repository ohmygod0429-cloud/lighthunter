import { createFileRoute } from "@tanstack/react-router";
import menuCoffee from "@/assets/menu-coffee.jpg";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "餐點菜單｜貓癒所的咖啡、茶飲與點心" },
      {
        name: "description",
        content: "貓癒所菜單：手沖單品咖啡、拿鐵、季節茶飲與每日手作甜點，全部在獨立飲食區供應。",
      },
      { property: "og:title", content: "餐點菜單｜貓癒所" },
      { property: "og:description", content: "手沖單品、拿鐵、季節茶飲與手作甜點，價格與品項一次看。" },
      { property: "og:url", content: "/menu" },
    ],
    links: [{ rel: "canonical", href: "/menu" }],
  }),
  component: MenuPage,
});

const sections = [
  {
    title: "咖啡 Coffee",
    items: [
      { name: "貓癒所特調拿鐵", desc: "焦糖與榛果尾韻，附貓掌拉花", price: 160 },
      { name: "日曬衣索比亞手沖", desc: "花香與莓果酸甜，冷了更好喝", price: 180 },
      { name: "美式咖啡", desc: "中焙配方豆，可選冰／熱", price: 130 },
      { name: "黑糖歐蕾", desc: "自製黑糖漿與濃縮咖啡", price: 170 },
    ],
  },
  {
    title: "茶飲 Tea",
    items: [
      { name: "文山包種冷泡茶", desc: "清爽花香，無糖", price: 140 },
      { name: "蜜香紅茶鮮奶", desc: "台灣蜜香紅茶＋鮮奶", price: 160 },
      { name: "洋甘菊安神茶", desc: "無咖啡因，適合傍晚", price: 150 },
    ],
  },
  {
    title: "點心 Dessert",
    items: [
      { name: "肉球棉花糖可可", desc: "熱可可上漂著三顆肉球棉花糖", price: 180 },
      { name: "重乳酪蛋糕", desc: "每日限量，濃郁不甜膩", price: 150 },
      { name: "貓臉餅乾（2 片）", desc: "手工餅乾，可外帶", price: 90 },
      { name: "季節水果鬆餅", desc: "厚燒鬆餅佐當季水果", price: 220 },
    ],
  },
];

function MenuPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <h1 className="text-4xl">餐點菜單</h1>
      <p className="mt-4 max-w-2xl leading-loose text-muted-foreground">
        所有餐點皆於獨立飲食區製作與供應，貓咪不會接觸到食物。入場費已含一杯飲品折抵 100 元。
      </p>

      <img
        src={menuCoffee}
        alt="貓癒所的拿鐵與重乳酪蛋糕"
        loading="lazy"
        width={1200}
        height={800}
        className="mt-10 w-full rounded-3xl object-cover shadow-soft"
      />

      <div className="mt-14 space-y-12">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="border-b border-border pb-3 text-2xl">{s.title}</h2>
            <ul className="mt-6 space-y-5">
              {s.items.map((item) => (
                <li key={item.name} className="flex items-baseline gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg">{item.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <span className="whitespace-nowrap text-sm text-primary">NT$ {item.price}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}