import {
  Briefcase,
  UserSearch,
  HandHeart,
  GraduationCap,
  Wine,
  Plane,
  Crown,
  Repeat,
} from "lucide-react";

export type Pillar = {
  no: string;
  title: string;
  en: string;
  slogan: string;
  body: string;
  deliverables: string[];
  proof: string;
  icon: typeof Briefcase;
};

export const pillars: Pillar[] = [
  {
    no: "01",
    title: "商業媒合・商業版圖的生態重組",
    en: "ELITE DEAL FLOW",
    slogan: "跳過低效社交，直抵本質。",
    body:
      "摒棄無效的換名片式寒暄。俱樂部建立封閉式資源池與精準畫像演算法，聚焦於企業併購、跨國戰略聯盟、通路裂變與新興市場佈局。在這裡，每一次會晤皆以可落地的商業閉環為導向，讓資本與優質標的高效對齊。",
    deliverables: ["季席閉門路演", "跨國戰略合資", "頂層商業網絡"],
    proof: "商業併購與產業資源網絡圖解",
    icon: Briefcase,
  },
  {
    no: "02",
    title: "企業獵才・核心智囊的頂層配置",
    en: "EXECUTIVE TALENT",
    slogan: "千軍易得，為遠見者甄選定局之將。",
    body:
      "企業的天花板取決於核心團隊的心智維度。獵光者獵才板塊不走常規招聘渠道，專注於為會員企業引薦具備實戰戰功的高階操盤手、組織架構師與新科技商業轉譯人才，助您的事業在關鍵轉折點完成組織升級。",
    deliverables: ["C-Suite 核心智囊", "實戰操盤手引薦", "組織基因重構"],
    proof: "人才賦能雷達圖",
    icon: UserSearch,
  },
  {
    no: "03",
    title: "慈善公益・世家名望的精神厚度",
    en: "IMPACT & LEGACY",
    slogan: "以光照幽，是最高級的財富抵達。",
    body:
      "唯有超越自我的利他實踐，才能讓家族精神突破時間的洗禮。俱樂部發起具備實質社會回報的永續公益倡議，從偏鄉賦能到未來青年培育，讓會員以集體光芒推動社會向善，建立受人敬重的無形社會資本與家族美名。",
    deliverables: ["影響力慈善專案", "家族聲望積累", "ESG 永續實踐"],
    proof: "公益足跡與社會影響力項目",
    icon: HandHeart,
  },
  {
    no: "04",
    title: "賦能成長・每月 20+ 堂前瞻私塾",
    en: "240+ MASTERCLASSES / YEAR",
    slogan: "在認知邊界之外，重塑未來的競爭力。",
    body:
      "每月固定交付 20 堂以上實戰賦能課程，涵蓋 AI 商業落地、跨代傳承架構、個人與品牌超級 IP、資產保護及身心靈心智躍遷。拒絕空泛理論，由各領域一線操盤手親自授課，讓會員與家族成員始終位處資訊層的最頂端。",
    deliverables: ["每月 20+ 實戰私塾", "AI 與未來商業實操", "終身學習圈"],
    proof: "每月排程日曆與實戰導師陣容",
    icon: GraduationCap,
  },
  {
    no: "05",
    title: "高質聯誼・純粹溫度的生命同行",
    en: "VETTED FELLOWSHIP",
    slogan: "頂峰之上，亦能遇見純粹的知己。",
    body:
      "通過極為嚴苛的背景審查機制，俱樂部過濾掉投機者與銷售雜質，營造極具安全感與信任度的同儕環境。在私密晚宴、心智沙龍與專屬酒會中，會員放下面具交流真實困惑，找到同頻共振的合夥人與一生的摯友。",
    deliverables: ["閉門莊園晚宴", "嚴格審查機制", "同頻心靈對話"],
    proof: "私密晚宴與雪茄紅酒沙龍實景",
    icon: Wine,
  },
  {
    no: "06",
    title: "主題旅遊・探索極限的隱奢定制",
    en: "BESPOKE GLOBAL RETREATS",
    slogan: "以世界為客廳，重構生命的體驗邊界。",
    body:
      "超越一般旅行社的觀光路線，為會員提供全球獨家主題式考察與隱奢度假專屬禮遇。從私人島嶼野奢閉關、頂級遊艇跨海巡弋，到海外政商私密考察，皆享專屬綠色通道與極具競爭力的生態折扣，將生活品味轉化為家族共同記憶。",
    deliverables: ["海外政商考察", "極限隱奢路線", "專屬會員特權折扣"],
    proof: "全球秘境航線與主題考察",
    icon: Plane,
  },
  {
    no: "07",
    title: "健康特權・泰國皇室御用品牌終身 7 折",
    en: "ROYAL WELLNESS PRIVILEGE",
    slogan: "逆轉歲月痕跡，以極致健康承載雄圖。",
    body:
      "健康的身體是不可複製的終極資產。俱樂部會員獨家享有泰國皇室御用品牌之終身 7 折特權，全方位接軌多國政要與領袖青睞的世界級專利「肌轉抗衰保養」與「機能保健調理系統」，以源頭科技守護生命活力，尊榮無可替代。",
    deliverables: ["泰國皇室御用權益", "獨家專利肌轉抗衰", "終身 7 折專屬配額"],
    proof: "皇室尊榮級產品美學",
    icon: Crown,
  },
  {
    no: "08",
    title: "被動收益・可世代傳承的利益共同體",
    en: "HEREDITARY YIELD LOOP",
    slogan: "化消費為資本，讓收益在家族中代代延續。",
    body:
      "傳統商會是純費用支出，獵光者則是「共創共贏」的財富閉環。透過獨創的生態激勵機制，會員的資源投入與生活消費皆轉化為長期分紅資產。會籍權益更可世襲繼承，為下一代構建永不斷流的安全感底層資產。",
    deliverables: ["生態利益共享", "被動現金流分配", "會籍世代繼承權"],
    proof: "複利成長圖表與家族世襲憑證",
    icon: Repeat,
  },
];

export const legacyCompare = [
  {
    name: "傳統商會 / BNI",
    tone: "legacy" as const,
    points: [
      "每週早起打卡、簽到制的引薦 KPI",
      "人情壓力大，社交耗損高",
      "犧牲生活品質換取曝光",
      "只有付出，沒有被動收益",
    ],
  },
  {
    name: "傳統社交社團（扶輪／獅子）",
    tone: "legacy" as const,
    points: [
      "偏向單向捐款與虛名社交",
      "實質商業回報率低",
      "資源難以跨代延續",
      "缺乏系統化的賦能交付",
    ],
  },
  {
    name: "全球真愛(獵光者)未來俱樂部",
    tone: "club" as const,
    points: [
      "生態閉環：省錢＋賦能＋收益同時成立",
      "皇室品牌終身 7 折＋獨家旅遊折扣",
      "每月 20+ 堂實戰賦能課，年均 240+ 堂",
      "被動收益與會籍權益可世襲傳承",
    ],
  },
];

export const vettingSteps = [
  {
    step: "01",
    title: "線上提交申請",
    text: "填寫企業背景、個人專長與可貢獻的稀缺資源，秘書處建立初步檔案。",
  },
  {
    step: "02",
    title: "秘書處資格初審",
    text: "進行商譽查核與背景盡職調查，確保圈層純度與安全感。",
  },
  {
    step: "03",
    title: "理事會閉門會晤",
    text: "1 對 1 視訊面談或閉門品茶會晤，雙向確認價值觀與適配度。",
  },
  {
    step: "04",
    title: "授階與頒發憑證",
    text: "正式納入俱樂部，啟動八大板塊權益與世襲會籍機制。",
  },
];
