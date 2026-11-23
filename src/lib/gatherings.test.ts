import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { canRegister, formedCount, paymentOpen, stillNeeded, gatheringRegistrationSchema, gatheringState, seatsLeft } from "./gatherings";

describe("gathering rules", () => {
  test("below minimum is 集氣中, reaching it is 已成團, 0 means no minimum", () => {
    assert.equal(gatheringState("open", 10, 9), "集氣中");
    assert.equal(gatheringState("open", 10, 10), "已成團");
    assert.equal(gatheringState("open", 0, 0), "已成團");
  });
  test("admin marks override counts", () => {
    assert.equal(gatheringState("failed", 0, 50), "未成團");
    assert.equal(gatheringState("cancelled", 1, 5), "已取消");
    assert.equal(gatheringState("rescheduled", 1, 5), "改期");
  });
  test("capacity limits signups, 0 means unlimited; cancelled closes signup", () => {
    assert.equal(canRegister("open", 20, 20), false);
    assert.equal(canRegister("open", 20, 19), true);
    assert.equal(canRegister("open", 0, 999), true);
    assert.equal(canRegister("cancelled", 0, 0), false);
  });
  test("paid events form only by paid count", () => {
    assert.equal(gatheringState("open", 10, formedCount(500, 30, 9)), "集氣中");
    assert.equal(stillNeeded(10, formedCount(500, 30, 9)), 1);
    assert.equal(gatheringState("open", 10, formedCount(500, 30, 10)), "已成團");
    assert.equal(gatheringState("open", 10, formedCount(0, 10, 0)), "已成團");
  });
  test("payment hidden until sign-ups reach minimum; never for free", () => {
    assert.equal(paymentOpen("open", 500, 10, 9), false);
    assert.equal(paymentOpen("open", 500, 10, 10), true);
    assert.equal(paymentOpen("open", 0, 0, 5), false);
  });
  test("ride seats: full car has 0 left", () => {
    assert.equal(seatsLeft(2, 1), 1);
    assert.equal(seatsLeft(2, 2), 0);
  });
  test("driver/passenger must agree to safety notice", () => {
    const base = { gathering_id: "11111111-1111-4111-8111-111111111111", name: "A", phone: "0912345678", email: "", messenger: "", note: "" };
    assert.equal(gatheringRegistrationSchema.safeParse({ ...base, ride_role: "driver", seats: 2, ride_meet_location: "台北車站" }).success, false);
    assert.equal(gatheringRegistrationSchema.safeParse({ ...base, ride_role: "driver", seats: 2, ride_meet_location: "台北車站", agree_ride_safety: true }).success, true);
    assert.equal(gatheringRegistrationSchema.safeParse({ ...base, ride_role: "passenger", agree_ride_safety: true }).success, false);
  });
});
