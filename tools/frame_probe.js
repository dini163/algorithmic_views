/* 帧间"配对滑动"探针：量化每道题相邻帧之间被配对插值的元素位移有多大。

   为什么需要它：元素签名（itSig）不含位置，两帧签名相同就被就近配对后插值。
   如果这不是你想表达的"这一步的动作"，看起来就是一次非法的假动作 ——
   用户抓过两次：#107「兔子从 8 跳到 6」、#117「换场景时棋盘横滑 188px」。

   注意别误读：本库很多题本来就用元素位移做动画（棋子走一步、指针移动…），
   配对位移大 ≠ 有 bug。这个工具给的是数字，判断要人眼做：盯某个具体过渡，
   看位移是否恰好等于规则允许的那一步（#107 的 1→2 / 4→5 / 5→6 分别是
   狐 20px = 1 格、兔 60px = 3 格，就是对的）。

   用法：
     node tools/frame_probe.js 119        # 逐过渡列出 #119 的配对/新增/消失/最大位移
     node tools/frame_probe.js            # 全库，只列最大位移超阈值的题
     node tools/frame_probe.js 119 30     # 阈值改 30px（默认 60）

   "整帧切换 N 处"表示那几处配对数为 0（刻意的"无元素过渡帧"，见 #112/#117/#119），
   那是切断配对的标准做法，不是问题。 */
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..');

const gsapStub = {
  to: function () { return { kill() {}, play() {}, pause() {}, timeScale() {} }; },
  delayedCall: function () { return { kill() {}, play() {}, pause() {}, timeScale() {} }; }
};
const win = { gsap: gsapStub, devicePixelRatio: 1, addEventListener: function () {} };
const winProxy = new Proxy(win, { set: function (t, k, v) { t[k] = v; sandbox[k] = v; return true; } });
const sandbox = {
  window: winProxy, gsap: gsapStub, console: console, Math: Math,
  performance: { now: function () { return 0; } }, requestAnimationFrame: function () {},
  document: { getElementById: function () { return null; } },
  IntersectionObserver: function () { return { observe: function () {} }; },
  setTimeout: setTimeout, clearTimeout: clearTimeout
};
vm.createContext(sandbox);
['core.js', 'util.js', 'engines.js', 'desc.js', 'idea.js', 'data_o.js', 'data_a.js', 'data_b.js', 'data_c.js']
  .forEach(function (f) {
    vm.runInContext('(function () {\n' + fs.readFileSync(path.join(root, 'js/pz/' + f), 'utf8') + '\n})();', sandbox, { filename: f });
  });

const only = parseInt(process.argv[2] || '0', 10);
const THRESH = parseFloat(process.argv[3] || '60');

/* 与 engines.js 的 itPos 一致：取元素的代表点 */
function pos(it) {
  if (it.t === 'poly') {
    let sx = 0, sy = 0;
    it.pts.forEach(function (p) { sx += p[0]; sy += p[1]; });
    return [sx / it.pts.length, sy / it.pts.length];
  }
  if (it.t === 'line') return [(it.x1 + it.x2) / 2, (it.y1 + it.y2) / 2];
  return [it.x, it.y];
}
/* 与 engines.js 的 itSig 一致：配对只看签名，签名相同的元素才会被插值 */
function sig(it) {
  if (it.t === 'txt' || it.t === 'raw') return it.t + '|' + it.s + '|' + (it.size || '');
  if (it.t === 'circle') return 'circle|' + Math.round(it.r) + '|' + (it.fill || '') + '|' + (it.stroke || '');
  if (it.t === 'line') return 'line|' + (it.stroke || '') + '|' + it.lw;
  if (it.t === 'poly') return 'poly|' + it.pts.length + '|' + (it.fill || '') + '|' + (it.stroke || '');
  if (it.t === 'rr') return 'rr|' + Math.round(it.w) + 'x' + Math.round(it.h) + '|' + (it.fill || '');
  return it.t + '|' + (it.stroke || '') + '|' + Math.round(it.w || 0) + 'x' + Math.round(it.h || 0);
}

const problems = [];
sandbox.PZ.defs.forEach(function (d) {
  if (only && d.no !== only) return;
  const key = (d.g === 'o' ? '概' + d.no : '#' + d.no) + ' ' + d.title;
  let M;
  try { M = sandbox.PZ.engines[d.e].build(d.p || {}); } catch (e) { problems.push(key + ' → build 异常: ' + e.message); return; }
  const F = M._frames, MT = M._matches;
  if (!F || !MT) return;
  let worst = 0, worstAt = -1, cuts = 0;
  const rows = [];
  for (let i = 1; i < F.length; i++) {
    let mx = 0, cnt = 0;
    MT[i].forEach(function (pr) {
      if (pr.a < 0 || pr.b < 0) return;
      const pa = pos(F[i - 1][pr.a]), pb = pos(F[i][pr.b]);
      const dd = Math.max(Math.abs(pa[0] - pb[0]), Math.abs(pa[1] - pb[1]));
      cnt++;
      if (dd > mx) mx = dd;
      if (dd > THRESH) rows.push('      ' + sig(F[i - 1][pr.a]) + '  位移 ' + dd.toFixed(1) + 'px');
    });
    if (!cnt) cuts++;
    if (mx > worst) { worst = mx; worstAt = i - 1; }
  }
  const line = key + ' [' + d.e + '] 帧 ' + F.length + ' 最大位移 ' + worst.toFixed(1) + 'px'
    + (worstAt >= 0 ? ' @' + worstAt + '→' + (worstAt + 1) : '') + (cuts ? '（整帧切换 ' + cuts + ' 处）' : '');
  if (worst > THRESH) {
    console.log('⚠ ' + line);
    rows.slice(0, 8).forEach(function (r) { console.log(r); });
    problems.push(key);
  } else if (only) {
    console.log('✓ ' + line);
    for (let i = 1; i < F.length; i++) {
      const mx = MT[i].reduce(function (m, pr) {
        if (pr.a < 0 || pr.b < 0) return m;
        const pa = pos(F[i - 1][pr.a]), pb = pos(F[i][pr.b]);
        return Math.max(m, Math.abs(pa[0] - pb[0]), Math.abs(pa[1] - pb[1]));
      }, 0);
      console.log('   ' + (i - 1) + '→' + i + ' 配对 ' + MT[i].filter(function (p) { return p.a >= 0 && p.b >= 0; }).length
        + ' 新增 ' + MT[i].filter(function (p) { return p.a < 0; }).length
        + ' 消失 ' + MT[i].filter(function (p) { return p.b < 0; }).length
        + ' 最大位移 ' + mx.toFixed(1) + 'px');
    }
  }
});

if (!only) {
  console.log(problems.length
    ? '\n超阈值的题（' + problems.length + '）：\n - ' + problems.join('\n - ')
    : '\n全部题的最大位移都在 ' + THRESH + 'px 以内 ✓');
}
