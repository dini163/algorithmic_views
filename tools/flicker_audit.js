/* 闪烁/交替审计：量化 board/geo 谜题相邻步骤的视觉连续性
   规则（对标 #80 的"元素常驻、增量变化"）：
   1) 相邻步骤匹配率 continuity = 配对元素数 / max(两步元素数)，过低 = 场景被整段换掉
   2) 闪烁事件：同一元素签名 出现→消失→再出现（交替切换的主犯）
   判定：minContinuity < 0.45 或 闪烁事件 >= 1 → 标记待修
   用法：node tools/flicker_audit.js */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.join(__dirname, '..');

const gsapStub = {
  to: function () { return { kill() {}, play() {}, pause() {}, timeScale() {} }; },
  delayedCall: function () { return { kill() {}, play() {}, pause() {}, timeScale() {} }; }
};
const win = { gsap: gsapStub, devicePixelRatio: 1, addEventListener: function () {} };
const winProxy = new Proxy(win, { set: function (t, k, v) { t[k] = v; sandbox[k] = v; return true; } });
const sandbox = { window: winProxy, gsap: gsapStub, console: console, Math: Math, performance: { now: function () { return 0; } }, requestAnimationFrame: function () {}, document: { getElementById: function () { return null; } }, IntersectionObserver: function () { return { observe: function () {} }; }, setTimeout: setTimeout, clearTimeout: clearTimeout };
vm.createContext(sandbox);
['core.js', 'util.js', 'engines.js', 'desc.js', 'idea.js', 'data_o.js', 'data_a.js', 'data_b.js', 'data_c.js', 'extra1.js', 'extra2.js']
  .forEach(function (f) { vm.runInContext('(function () {\n' + fs.readFileSync(path.join(root, 'js/pz/' + f), 'utf8') + '\n})();', sandbox, { filename: f }); });
const PZ = sandbox.PZ;

/* 与 engines.js 相同的签名逻辑（忽略底部字幕 cap 项——它每步必换，由字幕条承担） */
function sig(it) {
  if (it.cap) return null;
  if (it.t === 'txt') return it.t + '|' + it.s + '|' + it.size + '|' + it.color + '|' + (it.mono ? 1 : 0);
  if (it.t === 'circle') return it.t + '|' + Math.round(it.r) + '|' + (it.fill || '') + '|' + (it.stroke || '');
  if (it.t === 'line') return it.t + '|' + (it.stroke || '') + '|' + it.lw;
  if (it.t === 'rr') return it.t + '|' + Math.round(it.w) + 'x' + Math.round(it.h) + '|' + (it.fill || '');
  return it.t + '|' + (it.stroke || '') + '|' + Math.round(it.w || 0) + 'x' + Math.round(it.h || 0);
}
function posOf(it) { return it.t === 'line' ? [(it.x1 + it.x2) / 2, (it.y1 + it.y2) / 2] : [it.x, it.y]; }
function match(A, B) {
  const usedA = {}, bySig = {};
  let matched = 0;
  A.forEach(function (it, i) { const s = sig(it); if (s) (bySig[s] = bySig[s] || []).push(i); });
  B.forEach(function (b) {
    const s = sig(b); if (!s) return;
    const cands = bySig[s]; if (!cands) return;
    let bi = -1, bd = Infinity;
    const pb = posOf(b);
    cands.forEach(function (i) {
      if (usedA[i]) return;
      const pa = posOf(A[i]);
      const d = (pa[0] - pb[0]) * (pa[0] - pb[0]) + (pa[1] - pb[1]) * (pa[1] - pb[1]);
      if (d < bd) { bd = d; bi = i; }
    });
    if (bi >= 0) { usedA[bi] = 1; matched++; }
  });
  return matched;
}

const flagged = [];
PZ.defs.forEach(function (d) {
  if (d.e !== 'board' && d.e !== 'geo') return;
  const M = PZ.engines[d.e].build(d.p || {});
  const frames = M._frames;
  if (!frames || frames.length < 2) return;
  /* 逐步签名集（cap 除外） */
  const sigSets = frames.map(function (f) {
    const m = {};
    f.forEach(function (it) { const s = sig(it); if (s) m[s] = (m[s] || 0) + 1; });
    return m;
  });
  let minCont = 1, minAt = -1;
  for (let i = 1; i < frames.length; i++) {
    const a = sigSets[i - 1], b = sigSets[i];
    const na = Object.keys(a).reduce(function (s, k) { return s + a[k]; }, 0);
    const nb = Object.keys(b).reduce(function (s, k) { return s + b[k]; }, 0);
    if (!na && !nb) continue;
    const cont = match(frames[i - 1].filter(function (x) { return sig(x); }), frames[i].filter(function (x) { return sig(x); })) / Math.max(na, nb);
    if (cont < minCont) { minCont = cont; minAt = i; }
  }
  /* 闪烁：出现→消失→再出现 */
  let flicker = 0;
  const allSigs = {};
  sigSets.forEach(function (m) { Object.keys(m).forEach(function (s) { allSigs[s] = 1; }); });
  Object.keys(allSigs).forEach(function (s) {
    let seen = false, gap = false;
    for (let i = 0; i < sigSets.length; i++) {
      const has = !!sigSets[i][s];
      if (has && !seen) seen = true;
      else if (!has && seen) gap = true;
      else if (has && seen && gap) { flicker++; break; }
    }
  });
  const key = (d.g === 'o' ? '概' : '#') + d.no;
  if (minCont < 0.45 || flicker >= 1) {
    flagged.push({ key: key, title: d.title, e: d.e, steps: frames.length, minCont: minCont.toFixed(2), minAt: minAt, flicker: flicker });
  }
});
flagged.sort(function (a, b) { return (b.flicker - a.flicker) || (a.minCont - b.minCont); });
console.log('board/geo defs flagged:', flagged.length);
flagged.forEach(function (f) {
  console.log(' ' + f.key + ' ' + f.title + ' [' + f.e + '] steps=' + f.steps + ' minCont=' + f.minCont + '@step' + f.minAt + ' flicker=' + f.flicker);
});
