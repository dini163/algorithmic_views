/* 演示 vs 描述 审计：找出"静态图+文字叙述"的伪演示题（对标旧 #89）
 * 指标（仅 board/geo 帧引擎）：
 *  gfxStatic: 相邻帧间非文本元素完全相同（签名+位置+颜色）的比例 → 高 = 图形从不演化
 *  txtRatio : 文本元素占全部元素比例均值 → 高 = 以文字为主
 *  cellOnly : 图形仅由棋盘格构成、变化只发生在格内文字符号上 → 典型"示意图"特征
 * 输出按嫌疑度排序 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ROOT = path.join(__dirname, '..');
const gsapStub = {
  to: function () { return { kill() {}, play() {}, pause() {}, timeScale() {} }; },
  delayedCall: function () { return { kill() {}, play() {}, pause() {}, timeScale() {} }; }
};
const win = { gsap: gsapStub, devicePixelRatio: 1, addEventListener: function () {} };
const winProxy = new Proxy(win, {
  set: function (t, k, v) { t[k] = v; sandbox[k] = v; return true; }
});
const sandbox = { window: winProxy, gsap: gsapStub, console: console, Math: Math, performance: { now: function () { return 0; } }, requestAnimationFrame: function () {}, document: { getElementById: function () { return null; } }, IntersectionObserver: function () { return { observe: function () {} }; }, setTimeout: setTimeout, clearTimeout: clearTimeout };
vm.createContext(sandbox);
const files = ['core.js', 'util.js', 'engines.js', 'desc.js', 'idea.js',
  'data_o.js', 'data_a.js', 'data_b.js', 'data_c.js', 'extra1.js', 'extra2.js'];
for (const f of files) {
  vm.runInContext('(function () {\n' + fs.readFileSync(path.join(ROOT, 'js/pz', f), 'utf8') + '\n})();', sandbox, { filename: f });
}
const PZ = sandbox.PZ;

function gfxSig(it) {
  /* 非文本元素的完整签名 */
  return JSON.stringify(it);
}
function txtOf(f) { return f.filter(it => it.t === 'txt'); }
function gfxOf(f) { return f.filter(it => it.t !== 'txt'); }

const rows = [];
PZ.defs.forEach(d => {
  if (d.e !== 'board' && d.e !== 'geo') return;
  const M = PZ.engines[d.e].build(d.p || {});
  const frames = M._frames;
  if (!frames || frames.length < 2) return;
  let same = 0, pairs = 0, txtSum = 0, totSum = 0;
  for (let i = 1; i < frames.length; i++) {
    const A = gfxOf(frames[i - 1]).map(gfxSig).sort().join('|');
    const B = gfxOf(frames[i]).map(gfxSig).sort().join('|');
    pairs++;
    if (A === B && A !== '') same++;
  }
  frames.forEach(f => { txtSum += txtOf(f).length; totSum += f.length; });
  /* 格内文字符号变化（文本内容变、位置不变）也算"无实质演化"：统计跨帧文本位置稳定率 */
  let txtStable = 0, txtPairs = 0;
  for (let i = 1; i < frames.length; i++) {
    const pa = txtOf(frames[i - 1]).map(t => t.x + ',' + t.y).sort().join('|');
    const pb = txtOf(frames[i]).map(t => t.x + ',' + t.y).sort().join('|');
    txtPairs++;
    if (pa === pb) txtStable++;
  }
  const key = (d.g === 'o' ? 'o' : '') + d.no;
  rows.push({
    key, title: d.title, steps: frames.length - 1,
    gfxStatic: pairs ? same / pairs : 0,
    txtPosStable: txtPairs ? txtStable / txtPairs : 0,
    txtRatio: totSum ? txtSum / totSum : 0
  });
});
/* 嫌疑度：图形静止 + 文本位置也静止（只有文字内容在变）→ 纯叙述 */
rows.forEach(r => {
  r.score = r.gfxStatic * 0.6 + r.txtPosStable * 0.3 + (r.steps <= 6 ? 0.1 : 0);
});
rows.sort((a, b) => b.score - a.score);
const suspects = rows.filter(r => r.score >= 0.85);
console.log('board/geo 共', rows.length, '题；高度疑似"描述型"(score>=0.85):', suspects.length);
suspects.forEach(r => console.log(
  ' ', r.key.padEnd(5), String(r.title).padEnd(12),
  'steps=' + String(r.steps).padEnd(3),
  'gfxStatic=' + r.gfxStatic.toFixed(2),
  'txtPosStable=' + r.txtPosStable.toFixed(2),
  'txtRatio=' + r.txtRatio.toFixed(2),
  'score=' + r.score.toFixed(2)));
console.log('--- 临界区(0.6~0.85) ---');
rows.filter(r => r.score >= 0.6 && r.score < 0.85).forEach(r => console.log(
  ' ', r.key.padEnd(5), String(r.title).padEnd(12),
  'steps=' + String(r.steps).padEnd(3),
  'gfxStatic=' + r.gfxStatic.toFixed(2),
  'score=' + r.score.toFixed(2)));
