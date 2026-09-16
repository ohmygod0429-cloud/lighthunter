import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { syncRowToSheet } from "@/lib/sheet-sync.functions";
import { pillars, vettingSteps } from "@/data/pillars";

export const Route = createFileRoute("/apply")({
  head: () => ({
    meta: [
      { title: "申請入會席次審核｜獵光者 未來俱樂部" },
      {
        name: "description",
        content:
          "獵光者未來俱樂部採推薦與審核入會制。提交企業背景、資產維度與可貢獻的稀缺價值，秘書處完成初審後由創始團隊安排閉門會晤。",
      },
      { property: "og:title", content: "申請入會席次審核｜獵光者 未來俱樂部" },
      {
        property: "og:description",
        content: "三階段審核申請表：基本資歷、資源交換、入會公約。",
      },
    ],
  }),
  component: Apply,
});

const industries = [
  "科技創新",
  "製造出口",
  "金融投資",
  "醫療大健康",
  "房地產建築",
  "新零售與通路",
  "其他專業服務",
];

const inputClass =
  "mt-2 w-full rounded-xl border border-input bg-card/60 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus:border-primary/70";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-sm text-gold-soft">{label}</label>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-left text-sm transition-colors ${
        active
          ? "border-primary bg-primary/15 text-primary"
          : "border-border text-muted-foreground hover:border-primary/50"
      }`}
    >
      {children}
    </button>
  );
}

function Apply() {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [titleCompany, setTitleCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [messenger, setMessenger] = useState("");
  const [email, setEmail] = useState("");
  const [lifePhoto, setLifePhoto] = useState<File | null>(null);
  const [headshotPhoto, setHeadshotPhoto] = useState<File | null>(null);
  const [industry, setIndustry] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [coreValue, setCoreValue] = useState("");
  const [priorOrgs, setPriorOrgs] = useState("");
  const [licenses, setLicenses] = useState("");
  const [agreeEtiquette, setAgreeEtiquette] = useState(false);
  const [agreeTruthful, setAgreeTruthful] = useState(false);
  const [agreeHouseRules, setAgreeHouseRules] = useState(false);
  const [meetingTimePref, setMeetingTimePref] = useState("");

  // 自動保存草稿（照片除外），避免中途離開後資料遺失
  const DRAFT_KEY = "lh-apply-draft";
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const d = JSON.parse(raw) as Record<string, unknown>;
      const s = (v: unknown) => (typeof v === "string" ? v : "");
      setFullName(s(d["fullName"]));
      setBirthDate(s(d["birthDate"]));
      setTitleCompany(s(d["titleCompany"]));
      setPhone(s(d["phone"]));
      setMessenger(s(d["messenger"]));
      setEmail(s(d["email"]));
      setIndustry(s(d["industry"]));
      setCoreValue(s(d["coreValue"]));
      setPriorOrgs(s(d["priorOrgs"]));
      setLicenses(s(d["licenses"]));
      setMeetingTimePref(s(d["meetingTimePref"]));
      const savedPicked = d["picked"];
      if (Array.isArray(savedPicked))
        setPicked(savedPicked.filter((x): x is string => typeof x === "string"));
      if (Object.values(d).some((v) => typeof v === "string" && v.trim())) {
        toast.success("已為您帶回上次填寫的內容，照片請重新上傳。");
      }
    } catch {
      /* 忽略無效草稿 */
    } finally {
      setRestored(true);
    }
  }, []);

  useEffect(() => {
    if (!restored) return;
    try {
      window.localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          fullName,
          birthDate,
          titleCompany,
          phone,
          messenger,
          email,
          industry,
          picked,
          coreValue,
          priorOrgs,
          licenses,
          meetingTimePref,
        }),
      );
    } catch {
      /* 儲存空間不可用時略過 */
    }
  }, [
    restored,
    fullName,
    birthDate,
    titleCompany,
    phone,
    messenger,
    email,
    industry,
    picked,
    coreValue,
    priorOrgs,
    licenses,
    meetingTimePref,
  ]);

  const togglePillar = (t: string) => {
    setPicked((prev) =>
      prev.includes(t) ? prev.filter((p) => p !== t) : prev.length >= 3 ? prev : [...prev, t],
    );
  };

  const validateStep = () => {
    if (step === 1) {
      if (!fullName.trim() || !titleCompany.trim() || !phone.trim() || !messenger.trim() || !email.trim()) {
        toast.error("請完整填寫第 1 階段所有欄位。");
        return false;
      }
      if (/\d/.test(fullName)) {
        toast.error("真實姓名不可包含數字。");
        return false;
      }
      if (!birthDate) {
        toast.error("請填寫出生年月日。");
        return false;
      }
      if (birthDate.replace(/\D/g, "").length !== 8) {
        toast.error("出生年月日請填寫完整 8 碼西元日期（年 4 碼／月 2 碼／日 2 碼）。");
        return false;
      }
      const phoneDigits = phone.replace(/\D/g, "");
      if (phoneDigits.length !== 10) {
        toast.error("私人手機請填寫完整 10 碼數字。");
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        toast.error("請輸入有效的電子郵件地址。");
        return false;
      }
      if (!licenses.trim()) {
        toast.error("請填寫持有證照欄位，若無請填「無」。");
        return false;
      }
      if (!industry) {
        toast.error("請選擇主要行業領域。");
        return false;
      }
      if (!lifePhoto || !headshotPhoto) {
        toast.error("請上傳一張生活照與一張大頭照。");
        return false;
      }
      return true;
    }
    if (step === 2) {
      if (picked.length === 0) {
        toast.error("請至少選擇 1 個最關注的板塊。");
        return false;
      }
      if (!coreValue.trim()) {
        toast.error("請填寫「核心稀缺價值」。");
        return false;
      }
      return true;
    }
    if (step === 3) {
      if (!agreeEtiquette || !agreeTruthful || !agreeHouseRules) {
        toast.error("請確認並勾選所有會員承諾與家規共識。");
        return false;
      }
      if (!meetingTimePref) {
        toast.error("請選擇方便進行專屬交流的時間。");
        return false;
      }
      return true;
    }
    return true;
  };

  const goTo = (n: number) => {
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const next = () => {
    if (validateStep()) goTo(Math.min(3, step + 1));
  };

  const uploadPhoto = async (file: File, folder: string) => {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("application-photos").upload(path, file);
    if (error) throw error;
    return path;
  };

  const submit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    try {
      const lifePath = lifePhoto ? await uploadPhoto(lifePhoto, "life") : null;
      const headshotPath = headshotPhoto ? await uploadPhoto(headshotPhoto, "headshot") : null;
      const record = {
        full_name: fullName.trim(),
        birth_date: birthDate,
        title_company: titleCompany.trim(),
        phone: phone.trim(),
        messenger: messenger.trim(),
        business_email: email.trim(),
        life_photo_path: lifePath,
        headshot_path: headshotPath,
        revenue_band: "未填",
        liquid_assets: "未填",
        industry,
        pillars: picked.join("、"),
        core_value: coreValue.trim(),
        prior_orgs: priorOrgs.trim() || null,
        licenses: licenses.trim(),
        agree_etiquette: agreeEtiquette,
        agree_truthful: agreeTruthful,
        agree_house_rules: agreeHouseRules,
        meeting_time_pref: meetingTimePref,
      };
      const { error } = await supabase.from("membership_applications").insert(record);
      if (error) throw error;
      const { life_photo_path: _lp, headshot_path: _hp, ...sheetRow } = record;
      void syncRowToSheet({
        data: {
          sheet: "applications",
          row: sheetRow,
          photoPaths: { life_photo_url: lifePath, headshot_url: headshotPath },
        },
      }).catch(() => undefined);
      try {
        window.localStorage.removeItem(DRAFT_KEY);
      } catch {
        /* 忽略 */
      }
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      toast.error("送出失敗，請稍後再試。");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-28 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full border border-primary/50 text-primary">
          <Check className="size-6" />
        </span>
        <h1 className="mt-8 font-display text-2xl leading-snug sm:text-4xl">
          申請已送達<span className="text-gold-gradient">秘書處</span>
        </h1>
        <p className="mt-6 leading-loose text-muted-foreground">
          感謝您的信任。秘書處將於 5 個工作日內完成商譽與背景初審；通過者將由專人以私人管道聯繫，安排 1
          對 1 視訊面談或閉門品茶會晤。俱樂部不開放線上直接付費入會，所有會籍均由創始團隊親自締結。
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/"
            className="rounded-full border border-primary/50 px-8 py-3.5 text-sm text-primary transition-colors hover:bg-primary/10"
          >
            回到首頁
          </Link>
          <Link
            to="/qa"
            className="rounded-full bg-gold-gradient px-8 py-3.5 text-sm font-medium text-primary-foreground"
          >
            閱讀創始會籍 Q&amp;A
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div>
      <section className="starburst mx-auto max-w-4xl px-5 pt-20 text-center">
        <p className="text-xs tracking-[0.3em] text-primary">REQUEST INVITATION</p>
        <h1 className="mt-4 font-display text-2xl leading-snug sm:text-4xl">
          申請入會<span className="text-gold-gradient">席次審核</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl leading-loose text-muted-foreground">
          獵光者未來俱樂部採推薦與審核入會制，席次稀缺。以下三個階段用於確認價值對等與圈層純度，請據實填寫。
        </p>
        <ol className="mt-10 flex flex-wrap items-center justify-center gap-3 text-xs">
          {vettingSteps.slice(0, 3).map((s, i) => (
            <li
              key={s.step}
              className={`rounded-full border px-4 py-2 tracking-wide ${
                step === i + 1
                  ? "border-primary bg-primary/15 text-primary"
                  : step > i + 1
                    ? "border-primary/40 text-primary/70"
                    : "border-border text-muted-foreground"
              }`}
            >
              {i + 1}・
              {["基本資歷", "資源交換", "會籍預審"][i]}
            </li>
          ))}
        </ol>
        <div className="mx-auto mt-6 h-1 w-full max-w-md overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-gold-gradient transition-[width] duration-500 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
        <p className="mt-3 text-[11px] tracking-[0.2em] text-muted-foreground">
          進度 {step} / 3　約需 3 分鐘完成
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-16">
        <div key={step} className="glass-card animate-rise space-y-7 rounded-2xl p-8 shadow-lux">
          {step === 1 && (
            <>
              <h2 className="font-display text-xl">第 1 階段｜基本資歷與聯絡管道</h2>
              <Field label="真實姓名" hint="需與護照／身分證件一致，以供背景初查。">
                <input className={inputClass} value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="王〇〇" />
              </Field>
              <Field label="出生年月日" hint="請填寫西元日期供年齡與身分核對之用。例：1989/04/02">
                <input
                  inputMode="numeric"
                  className={inputClass}
                  value={birthDate}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "").slice(0, 8);
                    let formatted = digits;
                    if (digits.length > 4) {
                      formatted = digits.slice(0, 4) + "/" + digits.slice(4);
                    }
                    if (digits.length > 6) {
                      formatted = digits.slice(0, 4) + "/" + digits.slice(4, 6) + "/" + digits.slice(6);
                    }
                    setBirthDate(formatted);
                  }}
                  placeholder="YYYY/MM/DD"
                />
              </Field>
              <Field label="現任職稱與所屬企業" hint="請填公司完整全稱或官方網站，如自由接案者或老師請填寫職稱／年資。">
                <input className={inputClass} value={titleCompany} onChange={(e) => setTitleCompany(e.target.value)} placeholder="執行長／〇〇股份有限公司 www.example.com" />
              </Field>
              <Field label="主要行業領域">
                <select className={inputClass} value={industry} onChange={(e) => setIndustry(e.target.value)}>
                  <option value="">請選擇</option>
                  {industries.map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="私人手機" hint="需可接收來電或簡訊，供秘書處聯繫（限 10 碼數字）。">
                <input
                  inputMode="numeric"
                  className={inputClass}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="0912345678"
                />
              </Field>
              <Field label="WeChat / LINE">
                <input className={inputClass} value={messenger} onChange={(e) => setMessenger(e.target.value)} placeholder="LINE ID 或 WeChat ID" />
              </Field>
              <Field label="電子郵件" hint="接受企業網域信箱，亦接受 Gmail、Yahoo 等公共信箱。">
                <input className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@yourcompany.com 或 you@gmail.com" />
              </Field>
              <Field label="是否持有任何類別證照？" hint="請列出您持有的專業證照或資格，若無請填「無」。">
                <input className={inputClass} value={licenses} onChange={(e) => setLicenses(e.target.value)} placeholder="如：會計師、律師、CFP、無" />
              </Field>
              <Field
                label="上傳生活照與大頭照"
                hint="請上傳一張真實生活照與一張大頭照，供審查身分與圈層純度。禁止過度美顏濾鏡與 AI 生成圖片，一經查證將駁回申請。"
              >
                <div className="mt-2 grid gap-4 sm:grid-cols-2">
                  <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-input bg-card/40 px-4 py-6 text-center text-xs text-muted-foreground transition-colors hover:border-primary/60">
                    <span className="text-gold-soft">生活照</span>
                    <span className="truncate">{lifePhoto ? lifePhoto.name : "點選上傳檔案"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setLifePhoto(e.target.files?.[0] ?? null)}
                    />
                  </label>
                  <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-input bg-card/40 px-4 py-6 text-center text-xs text-muted-foreground transition-colors hover:border-primary/60">
                    <span className="text-gold-soft">大頭照</span>
                    <span className="truncate">{headshotPhoto ? headshotPhoto.name : "點選上傳檔案"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setHeadshotPhoto(e.target.files?.[0] ?? null)}
                    />
                  </label>
                </div>
              </Field>
            </>
          )}


          {step === 2 && (
            <>
              <h2 className="font-display text-xl">第 2 階段｜資源交換與板塊適配</h2>
              <Field label="您最關注的八大板塊（最多 3 項）">
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {pillars.map((p) => (
                    <Chip key={p.no} active={picked.includes(p.title)} onClick={() => togglePillar(p.title)}>
                      {p.no}｜{p.title.split("・")[0]}
                    </Chip>
                  ))}
                </div>
              </Field>
              <Field
                label="您能為俱樂部貢獻的「核心稀缺價值」"
                hint="獵光者是一個價值對等的圈層：請說明您或您的企業能為其他會員提供何種不可替代的資源、通路、技術或決策支持。"
              >
                <textarea
                  className={`${inputClass} min-h-36`}
                  value={coreValue}
                  onChange={(e) => setCoreValue(e.target.value)}
                />
              </Field>
              <Field label="您過去參與過的高端商會或組織" hint="如 BNI、扶輪社、YPO、各大商會或校友會；若無請填「無」。">
                <input className={inputClass} value={priorOrgs} onChange={(e) => setPriorOrgs(e.target.value)} />
              </Field>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="font-display text-xl">第 3 階段｜會籍諮詢預審與交流預約</h2>
              <p className="leading-loose text-muted-foreground">
                感謝您完成前階段資料填寫。獵光者未來俱樂部採「嚴格實名審查與邀請面試制」，以確保每位入會夥伴皆具備極高的商務信用與共同成長願景。請完成最後的交流預約確認：
              </p>

              <div className="space-y-3">
                <p className="text-sm font-medium text-gold-soft">一、會員承諾與社群共識</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  <span className="text-foreground/80">隱私與誠信首重：</span>遵守高端社群交流禮儀，嚴格保守內部商務機密，杜絕任何未經授權的廣告騷擾。
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  <span className="text-foreground/80">生態活躍共榮機制：</span>本俱樂部為實質資源共享平台，採「活躍會籍維護制」，入會後享有完整專屬體驗期，後續僅需維持基本生態日常互動與支持，即可長期解鎖八大維度所有特權（具體細節將於一對一會晤時為您完整說明）。
                </p>
                <p className="text-sm font-medium text-gold-soft">二、會籍審核與專屬交流說明</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  <span className="text-foreground/80">依序審核通知：</span>由於申請人數眾多，為確保每位申請夥伴的背景資質與圈子純粹度，委員會將採「人工實名嚴審制」並依填表順序逐一評估。
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  <span className="text-foreground/80">通過初審安排：</span>凡通過線上初審者，我們將依序以個別專屬通知，邀約進行約 15 分鐘的線上或線下深度交流會晤。
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  <span className="text-foreground/80">未通過不另行通知：</span>若名額額滿或暫未符合現階段入會標準，將不另行發送未通過通知，敬請理解並感謝您的耐心等候。
                </p>
                <p className="text-sm font-medium text-gold-soft">三、家規共識</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  凡善良有愛，認同以下家規者，經過審核通過即可。
                </p>
                <div className="glass-card rounded-2xl p-6">
                  <p className="text-center text-gold-soft">我讚嘆宇宙與之同頻</p>
                  <div className="mt-4 grid gap-1 text-center text-sm leading-relaxed text-muted-foreground">
                    <p>以愛為始　以善為念</p>
                    <p>以信為本　堅守信念</p>
                    <p>知行合一　與道同行</p>
                    <p>起心動念　天地合一</p>
                    <p>互助護愛　不分彼此</p>
                    <p>不嚼口舌　不造紛爭</p>
                    <p>互為貴人　資源共享</p>
                    <p>相互托舉　一生同行</p>
                    <p>嚴守家規　守護家園</p>
                    <p>提好字　說好話</p>
                    <p>做好事　做好人</p>
                    <p className="text-gold-soft">走向光　成為光</p>
                    <p className="text-gold-soft">德到　得道　得到</p>
                  </div>
                </div>
              </div>

              <label className="flex cursor-pointer gap-3 rounded-xl border border-border p-5 text-sm leading-relaxed text-muted-foreground">
                <input type="checkbox" checked={agreeEtiquette} onChange={(e) => setAgreeEtiquette(e.target.checked)} className="mt-1 size-4 accent-primary" />
                <span>我承諾遵守高端商務交流禮儀與隱私規範。</span>
              </label>
              <label className="flex cursor-pointer gap-3 rounded-xl border border-border p-5 text-sm leading-relaxed text-muted-foreground">
                <input type="checkbox" checked={agreeTruthful} onChange={(e) => setAgreeTruthful(e.target.checked)} className="mt-1 size-4 accent-primary" />
                <span>我確認所填寫之個人與企業經歷屬實，並同意接受理事會的一對一交流審核。</span>
              </label>
              <label className="flex cursor-pointer gap-3 rounded-xl border border-border p-5 text-sm leading-relaxed text-muted-foreground">
                <input type="checkbox" checked={agreeHouseRules} onChange={(e) => setAgreeHouseRules(e.target.checked)} className="mt-1 size-4 accent-primary" />
                <span>我已閱讀並認同以上家規，承諾以愛為始、以善為念，與同頻人共同守護獵光者未來俱樂部。</span>
              </label>

              <Field label="方便進行 15 分鐘專屬交流的時間">
                <div className="mt-3 flex flex-wrap gap-3">
                  {["平日下午", "平日晚上", "週末時段"].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setMeetingTimePref(opt)}
                      className={`rounded-full border px-5 py-2.5 text-sm transition-colors ${
                        meetingTimePref === opt
                          ? "border-primary bg-primary/15 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </Field>

              <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                送出後不代表入會成立。通過線上初審者，創始理事將於 48 小時內與您聯繫安排專屬交流會晤。
              </p>
            </>
          )}

          <div className="flex items-center justify-between gap-4 border-t border-border/70 pt-6">
            <button
              type="button"
              onClick={() => goTo(Math.max(1, step - 1))}
              disabled={step === 1}
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
            >
              <ArrowLeft className="size-4" /> 上一步
            </button>
            {step < 3 ? (
              <button
                type="button"
                onClick={next}
                className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-7 py-3 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                下一步 <ArrowRight className="size-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-7 py-3 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              >
                {submitting ? "送出中…" : "送出審核資料，預約理事專屬交流會晤"} <ArrowRight className="size-4" />
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
