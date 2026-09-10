import { Briefcase, UserSearch, HandHeart, GraduationCap, Wine, Plane, Crown, Repeat } from "lucide-react";

export type Dimension = {
  no: string;
  title: string;
  tagline: string;
  en: string;
  detail: string;
  points: string[];
  icon: typeof Briefcase;
};

export const dimensions: Dimension[] = [
  {
    no: "01",
    title: "商業媒合",
    tagline: "跨界資源直接變現",
    en: "ELITE DEAL FLOW & MATCHING",
    detail: "精準對接企業家、創業者與高淨值人群，打破傳統商務拓展的信任壁壘，讓每一次相遇都是一筆可落地的訂單。",
    points: ["跨界資源變現", "高淨值人群對接", "打破信任壁壘"],
    icon: Briefcase,
  },
  {
    no: "02",
    title: "企業獵才",
    tagline: "解決「找對人」的瓶頸",
    en: "EXECUTIVE TALENT SOURCING",
    detail: "會員企業可免費透過俱樂部招募人才與關鍵合夥人，解決企業經營中最核心的「找對人」瓶頸。",
    points: ["高階人才匹配", "關鍵合夥人媒合", "免費獵才服務"],
    icon: UserSearch,
  },
  {
    no: "03",
    title: "慈善公益",
    tagline: "提升影響力與 ESG 形象",
    en: "PHILANTHROPY CIRCLE",
    detail: "不定期舉辦公益行動與公益快閃活動，提昌在實踐中傳愛．與宇宙眾生共舞，同時建立更高維度的精神共鳴。",
    points: ["公益行動＆快閃公益", "企業家品牌 ESG 形象", "高維精神共鳴"],
    icon: HandHeart,
  },
  {
    no: "04",
    title: "每月 20+ 免費賦能課程",
    tagline: "持續迭代升級",
    en: "LIFETIME MASTERCLASS ACCESS",
    detail: "涵蓋 AI 應用、商業模式、自媒體、音樂、各類才藝、身心靈成長等熱門領域，讓會員與團隊持續迭代升級。",
    points: ["AI 應用與商業模式", "自媒體・音樂・才藝", "身心靈成長"],
    icon: GraduationCap,
  },
  {
    no: "05",
    title: "高質量聯誼交友（吃喝玩樂）",
    tagline: "擺脫嚴肅無趣的傳統交際",
    en: "CURATED MEMBER GATHERINGS",
    detail: "透過桌遊、私廚派對、品酒、戶外活動與各種不同類別的活動，依照個人喜好找到伯樂與同好，在輕鬆氛圍中建立深厚情誼。",
    points: ["私廚派對與品酒", "桌遊與戶外活動", "輕鬆氛圍深交"],
    icon: Wine,
  },
  {
    no: "06",
    title: "國內外獨家主題式旅遊專屬折扣",
    tagline: "告別趕行程與強制購物",
    en: "BESPOKE GLOBAL RETREATS",
    detail:
      "傳統旅行社行程零散、為湊景點拉車數小時，甚至安排強制購物站，讓出國比上班還累。獵光者俱樂部摒棄傳統跟團模式，依會員的「年齡層」與「偏好主題」進行專屬深度訂製，讓旅遊成為一場身心沉浸與高品質社交。",
    points: [
      "身心靈成長與靈修之旅：高能量氣場景點、冥想與心靈導師",
      "高質量聯誼與品味社交遊：輕鬆氛圍中結識優質夥伴",
      "放鬆型戶外與獨家秘境遊：避開人潮，開闢私人景點",
      "跨世代家族深度奢旅：彈性步調，長輩與年輕人都滿意",
    ],
    icon: Plane,
  },
  {
    no: "07",
    title: "泰國皇室御用品牌終身會員 7 折",
    tagline: "元首級保養與保健，終身 7 折",
    en: "ROYAL BEAUTY & WELLNESS PRIVILEGE",
    detail:
      "享用世界元首級的頂級保養與保健，肌膚與健康一步到位，再享終身 7 折尊榮特權。",
    points: [
      "元首與皇室級品質背書：多國總統、政商領袖指名使用",
      "世界第一獨家專利「肌轉」技術：深度修護、逆轉肌齡",
      "外在美顏 ✕ 內在健康：從細胞源頭到肌膚全方位調理",
      "會員終身 7 折：省下的金額遠超會費價值",
    ],
    icon: Crown,
  },
  {
    no: "08",
    title: "被動收入閉環",
    tagline: "把會費轉化為資產與收益",
    en: "PASSIVE INCOME LOOP",
    detail:
      "透過生態圈內各板塊互相導流與收益共享機制，讓會員不僅能安心學習、有效拓展人脈，還能與同頻人深度連結找到志同道合的朋友，更能建立可持續的被動收益流。",
    points: ["板塊互相導流", "收益共享機制", "可持續被動收益"],
    icon: Repeat,
  },
];

export const clubEdgeRows = [
  {
    label: "時間與精神成本",
    bni: "早起打卡、繁重的引薦 KPI，壓力極大",
    learning: "買課後自行觀看，缺乏互動與人脈延續",
    club: "無強制 KPI 壓力，在質感社交（吃喝玩樂）中自然對接資源",
  },
  {
    label: "財務回報機制",
    bni: "僅靠會員私下轉介紹，無系統回饋",
    learning: "純消費支出，無商業變現與收益機制",
    club: "內建「被動收入閉環」，讓入會費轉化為資產與收益",
  },
  {
    label: "權益覆蓋廣度",
    bni: "純商務交流，缺乏生活與靈性成長",
    learning: "純知識傳授，缺乏實體商業資源與優惠",
    club: "全方位覆蓋（商業＋獵才＋每月 20+ 課程＋獨家旅遊折扣＋7 折尊榮權益）",
  },
];


export const painPoints = [
  {
    title: "單打獨鬥的天花板",
    text: "資源、人才、通路都靠自己一個個敲門，時間成本高、成交率低，沒有信任的努力只會被稀釋在無效的社交與價格戰裡。",
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
