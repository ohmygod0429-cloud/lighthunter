import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { canRegister, gatheringState } from "./gatherings";

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
});
