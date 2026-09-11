import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
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
  const [referrer, setReferrer] = useState("");
  const [licenses, setLicenses] = useState("");
  const [agreeSelling, setAgreeSelling] = useState(false);
  const [agreeChatham, setAgreeChatham] = useState(false);

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
      if (coreValue.trim().length < 80) {
        toast.error("「核心稀缺價值」請以 80–200 字具體說明。");
        return false;
      }
      return true;
    }
    if (step === 3) {
      if (!agreeSelling || !agreeChatham) {
        toast.error("請確認並勾選兩項入會公約。");
        return false;
      }
      return true;
    }
    return true;
  };

  const next = () => {
    if (validateStep()) setStep((s) => Math.min(3, s + 1));
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
      const { error } = await supabase.from("membership_applications").insert({
        full_name: fullName.trim(),
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
        referrer: referrer.trim() || null,
        licenses: licenses.trim(),
        agree_no_selling: agreeSelling,
        agree_chatham: agreeChatham,
      });
      if (error) throw error;
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
              {["基本資歷", "資源交換", "入會公約"][i]}
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-16">
        <div className="glass-card space-y-7 rounded-2xl p-8 shadow-lux">
          {step === 1 && (
            <>
              <h2 className="font-display text-xl">第 1 階段｜基本資歷與聯絡管道</h2>
              <Field label="真實姓名" hint="需與護照／身分證件一致，以供背景初查。">
                <input className={inputClass} value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="王〇〇" />
              </Field>
              <Field label="現任職稱與所屬企業" hint="請填公司完整全稱或官方網站，如自由接案者或老師請填寫職稱／年資。">
                <input className={inputClass} value={titleCompany} onChange={(e) => setTitleCompany(e.target.value)} placeholder="執行長／〇〇股份有限公司 www.example.com" />
              </Field>
              <Field label="私人手機" hint="需可接收來電或簡訊，供秘書處聯繫。">
                <input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0912-345-678" />
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
                hint="獵光者是一個價值對等的圈層：請說明您或您的企業能為其他會員提供何種不可替代的資源、通路、技術或決策支持（80–200 字）。"
              >
                <textarea
                  className={`${inputClass} min-h-36`}
                  value={coreValue}
                  onChange={(e) => setCoreValue(e.target.value)}
                  maxLength={400}
                />
                <p className="mt-2 text-xs text-muted-foreground">{coreValue.trim().length} 字</p>
              </Field>
              <Field label="您過去參與過的高端商會或組織" hint="如 BNI、扶輪社、YPO、各大商會或校友會；若無請填「無」。">
                <input className={inputClass} value={priorOrgs} onChange={(e) => setPriorOrgs(e.target.value)} />
              </Field>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="font-display text-xl">第 3 階段｜入會承諾與審查公約</h2>
              <Field label="推薦人會籍編號（選填）" hint="若無推薦人，將自動轉入秘書處獨立背調與排隊清單。">
                <input className={inputClass} value={referrer} onChange={(e) => setReferrer(e.target.value)} placeholder="會員編號與姓名" />
              </Field>
              <label className="flex cursor-pointer gap-3 rounded-xl border border-border p-5 text-sm leading-relaxed text-muted-foreground">
                <input type="checkbox" checked={agreeSelling} onChange={(e) => setAgreeSelling(e.target.checked)} className="mt-1 size-4 accent-primary" />
                <span>
                  我充分理解獵光者未來俱樂部禁止任何未經授權的產品直銷、保險推銷或侵擾式拉客行為。經查證屬實者，俱樂部有權無條件終止其會籍且不予退款。
                </span>
              </label>
              <label className="flex cursor-pointer gap-3 rounded-xl border border-border p-5 text-sm leading-relaxed text-muted-foreground">
                <input type="checkbox" checked={agreeChatham} onChange={(e) => setAgreeChatham(e.target.checked)} className="mt-1 size-4 accent-primary" />
                <span>
                  我同意在所有會內私密會議與交流中遵守 Chatham House Rule（查特姆研究所守則），絕不對外洩露任何會員的商業機密與隱私言論。
                </span>
              </label>
              <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                送出後不代表入會成立。秘書處完成初審後，合格候選人將收到專屬邀請函與 1 對 1 會晤安排。
              </p>
            </>
          )}

          <div className="flex items-center justify-between gap-4 border-t border-border/70 pt-6">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
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
                {submitting ? "送出中…" : "提交審核申請"} <ArrowRight className="size-4" />
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
