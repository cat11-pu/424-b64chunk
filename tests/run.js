import assert from "node:assert";
import { TABLE, encodeTriple, decodeQuad, padToTriple } from "../b64chunk.js";
import { step, close } from "../b64run.js";
import { render } from "../app.js";

const base = {
  budget: 1,
  state: { pending: [], out: [], dec: [], decOut: [], ledger: [], applied: [] },
  events: [{ id: 1, kind: "put", bytes: [77, 97, 110] }],
  bad_byte_code: "E_BAD_BYTE", bad_char_code: "E_BAD_CHAR",
  bad_pad_code: "E_BAD_PAD", event_error_code: "E_BAD_EVENT"
};

let failed = 0;
function check(name, fn) {
  try { fn(); console.log("ok " + name); } catch (e) { failed += 1; console.log("FAIL " + name + " :: " + e.message); }
}

check("TABLE has 64 characters", () => {
  assert.strictEqual(TABLE.length, 64);
});

check("encodeTriple returns a list", () => {
  assert.ok(Array.isArray(encodeTriple(77, 97, 110)));
});

check("decodeQuad returns a list", () => {
  assert.ok(Array.isArray(decodeQuad("Z2U=")));
});

check("padToTriple returns three items", () => {
  assert.strictEqual(padToTriple([35]).length, 3);
});

check("step returns a state", () => {
  assert.strictEqual(typeof step(base).state, "object");
});

check("render counts events", () => {
  assert.strictEqual(typeof render(base).count_events, "number");
});

console.log("6 cases, " + failed + " failed");
process.exit(failed === 0 ? 0 : 1);
