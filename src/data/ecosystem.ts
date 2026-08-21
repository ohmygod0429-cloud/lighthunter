import { Briefcase, TrendingUp, Sparkles, GraduationCap, Wine, HeartHandshake, HandHeart, Plane } from "lucide-react";

export type Dimension = {
  no: string;
  title: string;
  tagline: string;
  detail: string;
  points: string[];
  icon: typeof Briefcase;
};

export const dimensions: Dimension[] = [
  {
    no: "01",
    title: "商業資源媒合",
    tagline: "超越 BNI 的精準對接",
    detail: "跨界資源直接變現，「商業媒合」與「企業精準獵才」雙軌並行，讓每一次相遇都是一筆可落地的訂單。",
    points: ["跨界資源直接變現", "商業精準媒合", "企業精準獵才"],
    icon: Briefcase,
  },
  {
    no: "02",
    title: "個人成長",
    tagline: "鍛鍊國際視野與商業思維",
    detail: "從決策思維到領導語言，系統性地把你放進頂尖領袖的養成軌道，而非零散的一次性課程。",
    points: ["國際視野", "商業思維訓練", "頂尖領袖養成"],
    icon: TrendingUp,
  },
  {
    no: "03",
    title: "身心靈成長",
    tagline: "連結高能量顯化",
    detail: "在九紫離火運的時代，先照亮自己。活出喜悅、健康、內在豐盛，與宇宙同道同頻，事業才會長久，財富才會亨通。",
    points: ["高能量顯化", "喜悅與健康", "內在豐盛"],
    icon: Sparkles,
  },
  {
    no: "04",
    title: "全類別賦能課程",
    tagline: "頂尖大師終身引路",
    detail: "AI、自媒體、身心靈、行銷、品牌與管理、才藝、音樂，每月 20 堂以上，終身免費\u3000代代傳承。",
    points: ["AI 與自媒體", "行銷・品牌・管理", "才藝與音樂"],
    icon: GraduationCap,
  },
  {
    no: "05",
    title: "極致吃喝玩樂",
    tagline: "尊榮私人聚會",
    detail: "以不同活動主題找到興趣相投、喜好相近的伯樂，把品味與人脈一起養成。",
    points: ["主題私人聚會", "同好圈層", "品味極致人生"],
    icon: Wine,
  },
  {
    no: "06",
    title: "高質量聯誼交友",
    tagline: "遠離無效社交",
    detail: "匯聚同頻共振的精英圈子，頂峰相見。你的下一段關係，值得被嚴選。",
    points: ["同頻圈層", "精英聯誼", "頂峰相見"],
    icon: HeartHandshake,
  },
  {
    no: "07",
    title: "慈善大愛實踐",
    tagline: "用生命影響生命",
    detail: "將財富化為利益社會的力量，讓成就不只留在財報上，也留在人心裡。",
    points: ["公益專案", "生命影響生命", "大愛傳承"],
    icon: HandHeart,
  },
  {
    no: "08",
    title: "高端訂製旅遊",
    tagline: "在奢華旅程中談成千萬級合作",
    detail: "走遍世界級風景的主題旅遊，移動的董事會，最放鬆時談成最重要的事。",
    points: ["世界級路線", "主題旅遊", "旅程中的商機"],
    icon: Plane,
  },
];

export const painPoints = [
  {
    title: "單打獨鬥的天花板",
    text: "資源、人才、通路都靠自己一個個敲門，時間成本高、成交率低，努力被稀釋在無效的社交裡。",
  },
  {
    title: "傳統商會的隱形割韭菜",
    text: "年費年年續繳、應酬餐費不斷、義務引薦沒有獎勵，一旦退出，所有權益歸零。",
  },
  {
    title: "九紫離火運的時代孤獨",
    text: "少子化與人口老化交疊，人們越來越孤獨、越來越缺愛、越來越迷茫，需要的是一群有愛．善良的生命共同體，團結的超級大家庭，朋友遍布四海八方，走到哪都有自己人相挺，不再害怕被欺負．被孤立。",
  },
];

export const compareRows = [
  { label: "入會費用", legacy: "年費 $25,000 ~ $45,000，每年續繳", eco: "一次性終生會員 $79,500\n（可貸款分 36 期，每月只要2,606 ，一天不到１杯咖啡錢，每月可上價值超過$400的賦能課*20堂以上=8000，現買現賺！）" },
  { label: "五年總花費", legacy: "含應酬餐費，五年花費破 $300,000", eco: "終生免續費，全家都受惠。\n一次性終生會費 ，可透過程序免費擴充至三個名額，攜家帶眷一起享受生態圈福利！" },
  { label: "課程資源", legacy: "多為額外付費或零散講座", eco: "每月 20 堂以上免費課程，涵蓋八大維度" },
  { label: "引薦機制", legacy: "無獎勵的義務引薦", eco: "引薦符合資格的人才參與生態圈共創未來，發放 $12,000 獎勵" },
  { label: "人才招募", legacy: "自行付費委託獵頭", eco: "免費商業資源．機會媒合與精準獵才" },
  { label: "退出／傳承", legacy: "退出即權益歸零", eco: "100% 資產與人脈可傳承給子女或愛人" },
];
