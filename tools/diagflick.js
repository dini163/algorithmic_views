/* 帧间"错误滑动"诊断：复刻引擎的 matchItems（按 B 顺序贪心取最近同签名），
   统计每个过渡里"被配对但两点距离过大"的元素数——这些会被 lerp 插值成滑动动画，
   正是静态格子莫名闪动的根因。
   用法：node tools/diagflick.js [puzzleNo...] */
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

function sig(it) {
  if (it.t === 'txt') return it.t + '|' + it.s + '|' + it.size + '|' + it.color + '|' + (it.mono ? 1 : 0);
  if (it.t === 'circle') return it.t + '|' + Math.round(it.r) + '|' + (it.fill || '') + '|' + (it.stroke || '');
  if (it.t === 'line') return it.t + '|' + (it.stroke || '') + '|' + it.lw;
  if (it.t === 'rr') return it.t + '|' + Math.round(it.w) + 'x' + Math.round(it.h) + '|' + (it.fill || '');
  if (it.t === 'poly') return it.t + '|' + it.pts.length + '|' + (it.fill || '') + '|' + (it.stroke || '');
  return it.t + '|' + (it.stroke || '') + '|' + Math.round(it.w || 0) + 'x' + Math.round(it.h || 0);
}
function polyC(it) { let sx = 0, sy = 0; it.pts.forEach(function (p) { sx += p[0]; sy += p[1]; }); return [sx / it.pts.length, sy / it.pts.length]; }
function posOf(it) { if (it.t === 'poly') return polyC(it); return it.t === 'line' ? [(it.x1 + it.x2) / 2, (it.y1 + it.y2) / 2] : [it.x, it.y]; }

/* 旧逻辑：按 B 顺序贪心匹配最近同签名元素 */
function oldMatch(A, B) {
  const pairs = [], usedA = {}, bySig = {};
  A.forEach(function (it, i) { const s = sig(it); (bySig[s] = bySig[s] || []).push(i); });
  B.forEach(function (b, j) {
    const cands = bySig[sig(b)];
    let bi = -1, bd = Infinity;
    if (cands) {
      const pb = posOf(b);
      for (let ci = 0; ci < cands.length; ci++) {
        const i = cands[ci];
        if (usedA[i]) continue;
        const pa = posOf(A[i]);
        const d = (pa[0] - pb[0]) * (pa[0] - pb[0]) + (pa[1] - pb[1]) * (pa[1] - pb[1]);
        if (d < bd) { bd = d; bi = i; }
      }
    }
    if (bi >= 0) { usedA[bi] = 1; pairs.push({ a: bi, b: j }); }
    else pairs.push({ a: -1, b: j });
  });
  A.forEach(function (_, i) { if (!usedA[i]) pairs.push({ a: i, b: -1 }); });
  return pairs;
}

/* 新逻辑：按距离升序全局贪心（应在 engines.js 中生效） */
function newMatch(A, B) {
  const pairs = [], usedA = {}, usedB = {}, bySig = {}, posA = [];
  A.forEach(function (it, i) { posA[i] = posOf(it); const s = sig(it); if (s) (bySig[s] = bySig[s] || []).push(i); });
  const cand = [];
  B.forEach(function (b, j) {
    const s = sig(b); if (!s) return;
    const list = bySig[s]; if (!list) return;
    const pb = posOf(b);
    for (let ci = 0; ci < list.length; ci++) { const i = list[ci], pa = posA[i]; const dx = pa[0] - pb[0], dy = pa[1] - pb[1]; cand.push({ i: i, j: j, d: dx * dx + dy * dy }); }
  });
  cand.sort(function (x, y) { return x.d - y.d; });
  for (let ci = 0; ci < cand.length; ci++) { const c = cand[ci]; if (usedA[c.i] || usedB[c.j]) continue; usedA[c.i] = 1; usedB[c.j] = 1; pairs.push({ a: c.i, b: c.j }); }
  B.forEach(function (_, j) { if (!usedB[j]) pairs.push({ a: -1, b: j }); });
  A.forEach(function (_, i) { if (!usedA[i]) pairs.push({ a: i, b: -1 }); });
  return pairs;
}
function slideCount(A, B, matcher) {
  const pairs = matcher(A, B); let cnt = 0;
  pairs.forEach(function (pr) {
    if (pr.a < 0 || pr.b < 0) return;
    const pa = posOf(A[pr.a]), pb = posOf(B[pr.b]);
    if (Math.hypot(pa[0] - pb[0], pa[1] - pb[1]) > 4) cnt++;
  });
  return cnt;
}

const targets = process.argv.slice(2).map(Number);
const results = [];
PZ.defs.forEach(function (d) {
  if (d.e !== 'board' && d.e !== 'geo') return;
  if (targets.length && targets.indexOf(d.no) < 0) return;
  const M = PZ.engines[d.e].build(d.p || {});
  const frames = M._frames;
  if (!frames || frames.length < 2) return;
  let oldS = 0, newS = 0, worstOld = 0, worstNew = 0, worstAt = -1;
  for (let i = 1; i < frames.length; i++) {
    const A = frames[i - 1], B = frames[i];
    const o = slideCount(A, B, oldMatch), n = slideCount(A, B, newMatch);
    oldS += o; newS += n;
    if (o > worstOld) { worstOld = o; worstAt = i; }
    if (n > worstNew) worstNew = n;
  }
  results.push({ key: (d.g === 'o' ? '概' : '#') + d.no, e: d.e, steps: frames.length, oldS: oldS, newS: newS, worstOld: worstOld, worstNew: worstNew, worstAt: worstAt });
});
results.sort(function (a, b) { return b.oldS - a.oldS; });
console.log('=== 误滑动配对（>4px）对比：旧顺序贪心 vs 新距离升序 ===');
results.forEach(function (r) {
  if (r.oldS > 0) console.log(' ' + r.key + ' [' + r.e + '] steps=' + r.steps + '  旧=' + r.oldS + ' → 新=' + r.newS + '   最严重过渡@' + r.worstAt + '（旧 ' + r.worstOld + ' → 新 ' + r.worstNew + '）');
});
console.log('旧总量:', results.reduce(function (s, r) { return s + r.oldS; }, 0),
            ' 新总量:', results.reduce(function (s, r) { return s + r.newS; }, 0));

/* 单目标时打印逐过渡明细，便于确认残余滑动的具体元素 */
if (targets.length === 1) {
  const d = PZ.defs.find(function (x) { return x.no === targets[0] && (x.e === 'board' || x.e === 'geo'); });
  const M = PZ.engines[d.e].build(d.p || {});
  const frames = M._frames;
  console.log('\n=== ' + ('#' + d.no) + ' 逐过渡明细（新逻辑下 >4px 的配对） ===');
  for (let i = 1; i < frames.length; i++) {
    const A = frames[i - 1], B = frames[i];
    const pairs = newMatch(A, B);
    const rows = [];
    pairs.forEach(function (pr) {
      if (pr.a < 0 || pr.b < 0) return;
      const pa = posOf(A[pr.a]), pb = posOf(B[pr.b]);
      const dist = Math.round(Math.hypot(pa[0] - pb[0], pa[1] - pb[1]));
      if (dist > 4) rows.push(A[pr.a].t + ' ' + sig(A[pr.a]).slice(0, 34) + '  dist=' + dist);
    });
    if (rows.length) console.log(' t' + i + ': ' + rows.join(' | '));
  }
}
