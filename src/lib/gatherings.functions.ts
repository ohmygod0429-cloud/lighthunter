import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { TEACHER_PHOTO_BUCKET } from "./academy";
import { canRegister, normPhone, paymentOpen, seatsLeft, wishJoinSchema, gatheringRegistrationSchema, gatheringSchema, performerSchema, pollSchema, voteSchema, wishSchema, WISH_STATUSES } from "./gatherings";

async function admin() {
  return (await import("@/integrations/supabase/client.server")).supabaseAdmin;
}
function checkPass(passcode: string) {
  if (passcode.trim() !== (process.env["ADMIN_REVIEW_PASSCODE"] ?? "0429")) throw new Error("密碼錯誤");
}
type Sb = Awaited<ReturnType<typeof admin>>;
async function sign(sb: Sb, paths: string[]) {
  const map = new Map<string, string>();
  const u = [...new Set(paths.filter(Boolean))];
  if (!u.length) return map;
  const { data } = await sb.storage.from(TEACHER_PHOTO_BUCKET).createSignedUrls(u, 60 * 60 * 6);
  (data ?? []).forEach((d, i) => { const p = u[i]; if (p && d.signedUrl) map.set(p, d.signedUrl); });
  return map;
}
async function countBy(sb: Sb, table: "gathering_registrations" | "gathering_votes", col: "gathering_id" | "option_id", ids: string[]) {
  const out: Record<string, number> = {};
  if (!ids.length) return out;
  const { data } = await sb.from(table).select(col).in(col, ids);
  (data ?? []).forEach((r) => { const k = (r as unknown as Record<string, string>)[col]; if (k) out[k] = (out[k] ?? 0) + 1; });
  return out;
}

/** 訪客：公開活動、開放中的投票（含得票數）、公開表演人員 */
export const getGatheringsPublic = createServerFn({ method: "GET" }).handler(async () => {
  const sb = await admin();
  const [g, p, o, f] = await Promise.all([
    sb.from("gatherings").select("id,theme,title,description,region,event_date,start_time,end_time,location,map_url,min_people,capacity,fee,payment_note,payment_url,perks,performer_ids,status,status_note,rideshare_enabled,meet_point,location_photo_path,payment_qr_path").eq("is_published", true).order("event_date").order("start_time"),
    sb.from("gathering_polls").select("id,theme,title,description,region").eq("is_open", true).order("created_at", { ascending: false }),
    sb.from("gathering_poll_options").select("id,poll_id,option_date,start_time,end_time").order("option_date"),
    sb.from("performers").select("id,name,kind,summary,photo_path").eq("is_published", true).order("created_at"),
  ]);
  if (g.error || p.error || o.error || f.error) throw new Error("資料載入失敗");
  const rideIds = (g.data ?? []).filter((x) => x.rideshare_enabled).map((x) => x.id);
  const [drv, pas, wsh] = await Promise.all([
    rideIds.length ? sb.from("gathering_registrations").select("id,gathering_id,name,seats,ride_meet_location,ride_meet_time,ride_conditions").eq("ride_role", "driver").in("gathering_id", rideIds).order("created_at") : Promise.resolve({ data: [] as never[] }),
    rideIds.length ? sb.from("gathering_registrations").select("ride_driver_id").not("ride_driver_id", "is", null).in("gathering_id", rideIds) : Promise.resolve({ data: [] as never[] }),
    sb.from("gathering_wishes").select("id,theme,content,nickname,meet_location,conditions,min_people").eq("status", "approved").order("created_at", { ascending: false }),
  ]);
  const taken: Record<string, number> = {};
  ((pas.data ?? []) as { ride_driver_id: string | null }[]).forEach((r) => { if (r.ride_driver_id) taken[r.ride_driver_id] = (taken[r.ride_driver_id] ?? 0) + 1; });
  // 只公開車主稱呼與集合資訊，不公開任何聯絡方式或乘客名單
  const rides = ((drv.data ?? []) as { id: string; gathering_id: string; name: string; seats: number; ride_meet_location: string; ride_meet_time: string; ride_conditions: string }[])
    .map((d) => ({ ...d, left: seatsLeft(d.seats, taken[d.id] ?? 0) }));
  const pollIds = new Set((p.data ?? []).map((x) => x.id));
  const options = (o.data ?? []).filter((x) => pollIds.has(x.poll_id));
  const gIds = (g.data ?? []).map((x) => x.id);
  const wishIds = ((wsh.data ?? []) as { id: string }[]).map((x) => x.id);
  const [regs, votes, urls, paidRows, joinRows] = await Promise.all([
    countBy(sb, "gathering_registrations", "gathering_id", gIds),
    countBy(sb, "gathering_votes", "option_id", options.map((x) => x.id)),
    sign(sb, [...(f.data ?? []).map((x) => x.photo_path), ...(g.data ?? []).flatMap((x) => [x.location_photo_path, x.payment_qr_path])]),
    gIds.length ? sb.from("gathering_registrations").select("gathering_id").eq("paid", true).in("gathering_id", gIds) : Promise.resolve({ data: [] as { gathering_id: string }[] }),
    wishIds.length ? sb.from("gathering_wish_joins").select("wish_id").in("wish_id", wishIds) : Promise.resolve({ data: [] as { wish_id: string }[] }),
  ]);
  const paid: Record<string, number> = {};
  (paidRows.data ?? []).forEach((r) => { paid[r.gathering_id] = (paid[r.gathering_id] ?? 0) + 1; });
  const joins: Record<string, number> = {};
  (joinRows.data ?? []).forEach((r) => { joins[r.wish_id] = (joins[r.wish_id] ?? 0) + 1; });
  return {
    gatherings: (g.data ?? []).map(({ location_photo_path, payment_qr_path, payment_url, payment_note, ...x }) => {
      const registered = regs[x.id] ?? 0;
      const pay = paymentOpen(x.status, x.fee, x.min_people, registered);
      // 未開放付款前，付款連結／QR／說明一律不送到前台
      return { ...x, registered, paid: paid[x.id] ?? 0, pay_open: pay,
        payment_url: pay ? payment_url : "", payment_note: pay ? payment_note : "", payment_qr_url: pay ? urls.get(payment_qr_path) ?? "" : "",
        location_photo_url: urls.get(location_photo_path) ?? "", rides: rides.filter((r) => r.gathering_id === x.id) };
    }),
    wishes: ((wsh.data ?? []) as { id: string; theme: string; content: string; nickname: string; meet_location: string; conditions: string; min_people: number }[]).map((w) => ({ ...w, joined: joins[w.id] ?? 0 })),
    polls: (p.data ?? []).map((x) => ({ ...x, options: options.filter((y) => y.poll_id === x.id).map((y) => ({ ...y, votes: votes[y.id] ?? 0 })) })),
    performers: (f.data ?? []).map(({ photo_path, ...x }) => ({ ...x, photo_url: urls.get(photo_path) ?? "" })),
  };
});

export const registerGathering = createServerFn({ method: "POST" })
  .inputValidator((i) => gatheringRegistrationSchema.parse(i))
  .handler(async ({ data }) => {
    const sb = await admin();
    const { data: g } = await sb.from("gatherings").select("capacity,status,is_published,fee,payment_url,payment_note,payment_qr_path,min_people,rideshare_enabled").eq("id", data.gathering_id).maybeSingle();
    if (!g?.is_published) throw new Error("此活動目前無法報名");
    const { count } = await sb.from("gathering_registrations").select("id", { count: "exact", head: true }).eq("gathering_id", data.gathering_id);
    if (!canRegister(g.status, g.capacity, count ?? 0)) throw new Error("此活動已額滿或暫停報名");
    const { data: same } = await sb.from("gathering_registrations").select("phone").eq("gathering_id", data.gathering_id);
    if ((same ?? []).some((r) => normPhone(r.phone) === normPhone(data.phone))) throw new Error("此電話已報名過這場活動");
    if (data.ride_role !== "none" && !g.rideshare_enabled) throw new Error("此活動未開放順道搭乘");
    const driver_code = data.ride_role === "driver" ? String(crypto.getRandomValues(new Uint32Array(1))[0]! % 900000 + 100000) : "";
    const row = data.ride_role === "driver" ? { ...data, ride_driver_id: null, driver_code }
      : data.ride_role === "passenger" ? { ...data, seats: 0, ride_meet_location: "", ride_meet_time: "", ride_conditions: "" }
      : { ...data, seats: 0, ride_meet_location: "", ride_meet_time: "", ride_conditions: "", ride_driver_id: null, agree_ride_safety: false };
    const { error } = await sb.from("gathering_registrations").insert(row);
    if (error) throw new Error(error.message.includes("seats full") ? "這台車已滿座，請選擇其他車主" : "報名失敗，請稍後再試");
    const pay = paymentOpen(g.status, g.fee, g.min_people, (count ?? 0) + 1);
    const qr = pay && g.payment_qr_path ? (await sign(sb, [g.payment_qr_path])).get(g.payment_qr_path) ?? "" : "";
    return { ok: true, fee: g.fee, pay_open: pay, payment_url: pay ? g.payment_url : "", payment_note: pay ? g.payment_note : "", payment_qr_url: qr, driver_code };
  });

/** 車主自助查詢：以登記時的電話、LINE ID 或專屬查詢碼核對，只回傳自己車上的乘客 */
export const getMyPassengers = createServerFn({ method: "POST" })
  .inputValidator((i) => z.object({ gathering_id: z.string().uuid(), credential: z.string().trim().min(4).max(100) }).parse(i))
  .handler(async ({ data }) => {
    const sb = await admin();
    const { data: drivers } = await sb.from("gathering_registrations").select("id,phone,messenger,driver_code").eq("gathering_id", data.gathering_id).eq("ride_role", "driver");
    const norm = (v: string) => v.replace(/[\s-]/g, "").toLowerCase();
    const c = norm(data.credential);
    const mine = (drivers ?? []).filter((d) => [d.phone, d.messenger, d.driver_code].some((v) => v && norm(v) === c)).map((d) => d.id);
    if (!mine.length) return { found: false, passengers: [] as { name: string; phone: string; messenger: string }[] };
    const { data: ps } = await sb.from("gathering_registrations").select("name,phone,messenger").in("ride_driver_id", mine).order("created_at");
    return { found: true, passengers: ps ?? [] };
  });

export const castVote = createServerFn({ method: "POST" })
  .inputValidator((i) => voteSchema.parse(i))
  .handler(async ({ data }) => {
    const sb = await admin();
    const { data: opt } = await sb.from("gathering_poll_options").select("poll_id").eq("id", data.option_id).maybeSingle();
    if (!opt) throw new Error("找不到此時段");
    const { data: poll } = await sb.from("gathering_polls").select("is_open").eq("id", opt.poll_id).maybeSingle();
    if (!poll?.is_open) throw new Error("投票已結束");
    const { error } = await sb.from("gathering_votes").insert(data);
    if (error) throw new Error(error.code === "23505" ? "您已投過這個時段" : "投票失敗");
    return { ok: true };
  });

export const submitWish = createServerFn({ method: "POST" })
  .inputValidator((i) => wishSchema.parse(i))
  .handler(async ({ data }) => {
    const sb = await admin();
    const { error } = await sb.from("gathering_wishes").insert(data);
    if (error) throw new Error("送出失敗");
    return { ok: true };
  });

/** 訪客替已核准的許願集氣；同一瀏覽器每則限一次 */
export const joinWish = createServerFn({ method: "POST" })
  .inputValidator((i) => wishJoinSchema.parse(i))
  .handler(async ({ data }) => {
    const sb = await admin();
    const { data: w } = await sb.from("gathering_wishes").select("status").eq("id", data.wish_id).maybeSingle();
    if (w?.status !== "approved") throw new Error("此許願目前無法集氣");
    const { data: same } = await sb.from("gathering_wish_joins").select("phone").eq("wish_id", data.wish_id);
    if ((same ?? []).some((r) => r.phone && normPhone(r.phone) === normPhone(data.phone))) throw new Error("您已集氣過這則許願");
    const { error } = await sb.from("gathering_wish_joins").insert(data);
    if (error) throw new Error(error.code === "23505" ? "您已集氣過這則許願" : "集氣失敗");
    return { ok: true };
  });

export const getGatheringsAdmin = createServerFn({ method: "POST" })
  .inputValidator((i) => z.object({ passcode: z.string() }).parse(i))
  .handler(async ({ data }) => {
    checkPass(data.passcode);
    const sb = await admin();
    const [g, r, p, o, f, w, j] = await Promise.all([
      sb.from("gatherings").select("*").order("event_date", { ascending: false }),
      sb.from("gathering_registrations").select("*").order("created_at", { ascending: false }),
      sb.from("gathering_polls").select("*").order("created_at", { ascending: false }),
      sb.from("gathering_poll_options").select("*").order("option_date"),
      sb.from("performers").select("*").order("created_at", { ascending: false }),
      sb.from("gathering_wishes").select("*").order("created_at", { ascending: false }),
      sb.from("gathering_wish_joins").select("id,wish_id,name,phone,messenger,created_at").order("created_at"),
    ]);
    if (g.error || r.error || p.error || o.error || f.error || w.error || j.error) throw new Error("資料載入失敗");
    const [votes, urls] = await Promise.all([
      countBy(sb, "gathering_votes", "option_id", (o.data ?? []).map((x) => x.id)),
      sign(sb, [...(f.data ?? []).map((x) => x.photo_path), ...(g.data ?? []).flatMap((x) => [x.location_photo_path, x.payment_qr_path])]),
    ]);
    return {
      gatherings: (g.data ?? []).map((x) => ({ ...x, location_photo_url: urls.get(x.location_photo_path) ?? "", payment_qr_url: urls.get(x.payment_qr_path) ?? "" })),
      registrations: r.data ?? [],
      wishes: (w.data ?? []).map((x) => ({ ...x, joins: (j.data ?? []).filter((y) => y.wish_id === x.id) })),
      polls: (p.data ?? []).map((x) => ({ ...x, options: (o.data ?? []).filter((y) => y.poll_id === x.id).map((y) => ({ ...y, votes: votes[y.id] ?? 0 })) })),
      performers: (f.data ?? []).map((x) => ({ ...x, photo_url: urls.get(x.photo_path) ?? "" })),
    };
  });

const actionSchema = z.object({ passcode: z.string() }).and(z.discriminatedUnion("type", [
  z.object({ type: z.literal("saveGathering"), id: z.string().uuid().nullable(), gathering: gatheringSchema, closePollId: z.string().uuid().nullable() }),
  z.object({ type: z.literal("deleteGathering"), id: z.string().uuid() }),
  z.object({ type: z.literal("savePerformer"), id: z.string().uuid().nullable(), performer: performerSchema }),
  z.object({ type: z.literal("deletePerformer"), id: z.string().uuid() }),
  z.object({ type: z.literal("savePoll"), id: z.string().uuid().nullable(), poll: pollSchema }),
  z.object({ type: z.literal("deletePoll"), id: z.string().uuid() }),
  z.object({ type: z.literal("setRegFlag"), id: z.string().uuid(), field: z.enum(["paid", "attended"]), value: z.boolean() }),
  z.object({ type: z.literal("deleteRegistration"), id: z.string().uuid() }),
  z.object({ type: z.literal("deleteWish"), id: z.string().uuid() }),
  z.object({ type: z.literal("deleteWishJoin"), id: z.string().uuid() }),
  z.object({ type: z.literal("setWishStatus"), id: z.string().uuid(), status: z.enum(WISH_STATUSES) }),
  z.object({ type: z.literal("setWishMin"), id: z.string().uuid(), min_people: z.number().int().min(0).max(100000) }),
]));

export const gatheringsAdminAction = createServerFn({ method: "POST" })
  .inputValidator((i) => actionSchema.parse(i))
  .handler(async ({ data }) => {
    checkPass(data.passcode);
    const sb = await admin();
    const run = async (p: PromiseLike<{ error: unknown }>) => { const { error } = await p; if (error) throw new Error("操作失敗"); };
    switch (data.type) {
      case "saveGathering":
        if (data.id) {
          const { data: old } = await sb.from("gatherings").select("location_photo_path,payment_qr_path").eq("id", data.id).maybeSingle();
          await run(sb.from("gatherings").update(data.gathering).eq("id", data.id));
          const gone = [old?.location_photo_path, old?.payment_qr_path].filter((p): p is string => !!p && p !== data.gathering.location_photo_path && p !== data.gathering.payment_qr_path);
          if (gone.length) await sb.storage.from(TEACHER_PHOTO_BUCKET).remove(gone);
        } else await run(sb.from("gatherings").insert(data.gathering));
        if (data.closePollId) await run(sb.from("gathering_polls").update({ is_open: false }).eq("id", data.closePollId));
        break;
      case "deleteGathering": await run(sb.from("gatherings").delete().eq("id", data.id)); break;
      case "savePerformer": {
        if (data.id) {
          const { data: old } = await sb.from("performers").select("photo_path").eq("id", data.id).maybeSingle();
          await run(sb.from("performers").update(data.performer).eq("id", data.id));
          if (old?.photo_path && old.photo_path !== data.performer.photo_path) await sb.storage.from(TEACHER_PHOTO_BUCKET).remove([old.photo_path]);
        } else await run(sb.from("performers").insert(data.performer));
        break;
      }
      case "deletePerformer": {
        const { data: old } = await sb.from("performers").select("photo_path").eq("id", data.id).maybeSingle();
        await run(sb.from("performers").delete().eq("id", data.id));
        if (old?.photo_path) await sb.storage.from(TEACHER_PHOTO_BUCKET).remove([old.photo_path]);
        break;
      }
      case "savePoll": {
        const { options, ...poll } = data.poll;
        let id = data.id;
        if (id) await run(sb.from("gathering_polls").update(poll).eq("id", id));
        else {
          const { data: row, error } = await sb.from("gathering_polls").insert(poll).select("id").single();
          if (error || !row) throw new Error("操作失敗");
          id = row.id;
        }
        const keep = options.filter((o) => o.id).map((o) => o.id as string);
        const { data: existing } = await sb.from("gathering_poll_options").select("id").eq("poll_id", id);
        const drop = (existing ?? []).map((x) => x.id).filter((x) => !keep.includes(x));
        if (drop.length) await run(sb.from("gathering_poll_options").delete().in("id", drop));
        for (const o of options) {
          const row = { option_date: o.option_date, start_time: o.start_time, end_time: o.end_time };
          await run(o.id ? sb.from("gathering_poll_options").update(row).eq("id", o.id) : sb.from("gathering_poll_options").insert({ ...row, poll_id: id }));
        }
        break;
      }
      case "deletePoll": await run(sb.from("gathering_polls").delete().eq("id", data.id)); break;
      case "setRegFlag": await run(sb.from("gathering_registrations").update(data.field === "paid" ? { paid: data.value } : { attended: data.value }).eq("id", data.id)); break;
      case "deleteRegistration": await run(sb.from("gathering_registrations").delete().eq("id", data.id)); break;
      case "setWishStatus": await run(sb.from("gathering_wishes").update({ status: data.status }).eq("id", data.id)); break;
      case "setWishMin": await run(sb.from("gathering_wishes").update({ min_people: data.min_people }).eq("id", data.id)); break;
      case "deleteWishJoin": await run(sb.from("gathering_wish_joins").delete().eq("id", data.id)); break;
      case "deleteWish": await run(sb.from("gathering_wishes").delete().eq("id", data.id)); break;
    }
    return { ok: true };
  });
