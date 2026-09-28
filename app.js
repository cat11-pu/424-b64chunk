// app.js：渲染结果
import { encodeTriple, decodeQuad, padToTriple } from "./b64chunk.js";
import { step, close } from "./b64run.js";

export function render(spec) {
  const events = spec.events || [];
  const half = Math.ceil(events.length / 2);
  const first = step(spec);
  const closed = close(Object.assign({}, spec, { state: first.state }));
  const r1 = step(Object.assign({}, spec, { events: events.slice(0, half) }));
  const r2 = step(Object.assign({}, spec, { state: r1.state, events: events.slice(half) }));
  const closedTwo = close(Object.assign({}, spec, { state: r2.state }));
  const replay = step(Object.assign({}, spec, { state: closed.state }));
  const wide = step(Object.assign({}, spec, { budget: spec.budget + 2 }));
  const full = step(Object.assign({}, spec, { events: events, budget: events.length + 2 }));
  const fullClosed = close(Object.assign({}, spec, { state: full.state }));
  const fingerprint = function (state) {
    return JSON.stringify({
      pending: state.pending, out: state.out, dec: state.dec, decOut: state.decOut,
      ledger: state.ledger, applied: state.applied.length
    });
  };
  const rows = function (list) {
    return (list || []).map(function (row) { return row.slice(); });
  };
  return { out: (closed.state.out || []).join(""), bytes: (closed.state.decOut || []).slice(),
           groups: (closed.state.out || []).length / 4,
           dec_bytes: (closed.state.decOut || []).length,
           served_first: first.served, served_wide: wide.served,
           pair_differs: first.served !== wide.served,
           ledger_before: first.ledger_before, ledger: rows(first.ledger),
           catchup_n: closed.catchup, ledger_after: closed.state.ledger.length,
           mid_differs: fingerprint(r2.state) !== fingerprint(first.state),
           closed_equal: fingerprint(closedTwo.state) === fingerprint(closed.state),
           replay_new: replay.served, judged: first.judged, judged_bound: first.judged_bound,
           full_diff: fingerprint(closed.state) === fingerprint(fullClosed.state) ? 0 : 1,
           count_events: events.length,
           tail: encodeTriple(77, 97, 110).length
                 + decodeQuad("Z2U=").length
                 + padToTriple([35]).length };
}
