/* #80 王子之旅 路线独立校验（不依赖浏览器）
   校验点：
     1. 构造出的巡游长度恰为 n²，每格恰好走一次、不出界；
     2. 每相邻两格的位移都属于王子的三种走法（→ 右 / ↓ 下 / ↖ 左上斜）；
     3. 三段结构顺序正确且连续：上半螺旋(c>r) → 主对角线(r=c) → 下半螺旋(r>c)，
        且上下两段各 n(n−1)/2 格、主对角线 n 格；
     4. 谜题 #80 的模型步数 = 走法数 + 2 个收尾帧，且每一帧的 label 都能取到。
   用法：node tools/check_prince.js */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.join(__dirname, '..');

/* 与 tools/validate.js 同款最小沙箱：core.js 建 PZ，engines.js 注册引擎 */
const gsapStub = { to: function () { return { kill() {} }; }, delayedCall: function () { return { kill() {} }; } };
const win = { gsap: gsapStub, devicePixelRatio: 1, addEventListener: function () {} };
const sandbox = {
  window: null, gsap: gsapStub, console: console, Math: Math,
  performance: { now: function () { return 0; } }, requestAnimationFrame: function () {},
  document: { getElementById: function () { return null; } },
  IntersectionObserver: function () { return { observe: function () {} }; },
  setTimeout: setTimeout, clearTimeout: clearTimeout
};
sandbox.window = new Proxy(win, { set: function (t, k, v) { t[k] = v; sandbox[k] = v; return true; } });
vm.createContext(sandbox);
for (const f of ['core.js', 'engines.js', 'desc.js', 'idea.js', 'data_o.js', 'data_a.js', 'data_b.js', 'data_c.js']) {
  vm.runInContext('(function () {\n' + fs.readFileSync(path.join(root, 'js/pz/' + f), 'utf8') + '\n})();', sandbox, { filename: f });
}

const PZ = sandbox.PZ;
const DIRS = [[0, 1, '→'], [1, 0, '↓'], [-1, -1, '↖']];
const fails = [];

function checkTour(N) {
  const seq = PZ.engines.prince.tour(N);
  const tag = 'n=' + N;
  if (!seq) { fails.push(tag + ' → 构造失败（未找到巡游）'); return null; }
  if (seq.length !== N * N) fails.push(tag + ' → 长度 ' + seq.length + '，应为 ' + N * N);
  const seen = {};
  seq.forEach(function (q, i) {
    const r = q[0], c = q[1];
    if (r < 0 || r >= N || c < 0 || c >= N) fails.push(tag + ' → 第 ' + (i + 1) + ' 格 (' + r + ',' + c + ') 出界');
    const key = r + ',' + c;
    if (seen[key]) fails.push(tag + ' → 格子 (' + r + ',' + c + ') 被走了两次');
    seen[key] = 1;
    if (i === 0) return;
    const dr = r - seq[i - 1][0], dc = c - seq[i - 1][1];
    if (!DIRS.some(function (d) { return d[0] === dr && d[1] === dc; })) {
      fails.push(tag + ' → 第 ' + i + ' 步位移 (' + dr + ',' + dc + ') 不是王子的合法走法');
    }
  });
  /* 三段结构：相位必须单调不减（0 上半 → 1 对角线 → 2 下半） */
  const ph = seq.map(function (q) { return q[1] > q[0] ? 0 : (q[0] === q[1] ? 1 : 2); });
  const cnt = [0, 0, 0];
  ph.forEach(function (x, i) {
    cnt[x]++;
    if (i > 0 && x < ph[i - 1]) fails.push(tag + ' → 第 ' + (i + 1) + ' 格相位回退（' + ph[i - 1] + '→' + x + '）');
  });
  const tri = N * (N - 1) / 2;
  if (cnt[0] !== tri || cnt[2] !== tri || cnt[1] !== N) {
    fails.push(tag + ' → 三段格数 ' + cnt.join('/') + '，应为 ' + tri + '/' + N + '/' + tri);
  }
  return seq;
}

for (const N of [2, 3, 4, 5, 6, 7, 8, 9]) checkTour(N);

/* 谜题 #80：模型步数与逐帧 label */
const d80 = PZ.defs.filter(function (d) { return d.g !== 'o' && d.no === 80; })[0];
if (!d80) fails.push('#80 → 谜题定义缺失');
else if (d80.e !== 'prince') fails.push('#80 → 引擎为 ' + d80.e + '，应为 prince');
else {
  const N = d80.p.n;
  const M = PZ.engines.prince.build(d80.p);
  const want = N * N - 1 + 2;
  if (M.steps !== want) fails.push('#80 → 步数 ' + M.steps + '，应为 ' + want);
  for (let k = 0; k <= M.steps; k++) {
    const s = M.label(k);
    if (!s || /undefined|NaN/.test(s)) fails.push('#80 → 第 ' + k + ' 帧字幕异常: ' + s);
  }
  const seq = PZ.engines.prince.tour(N);
  if (seq) {
    console.log('#80 演示路线（' + N + '×' + N + '，格内数字 = 第几格走到）：');
    const grid = [];
    for (let r = 0; r < N; r++) grid.push(Array(N).fill('.'));
    seq.forEach(function (q, i) { grid[q[0]][q[1]] = String(i + 1); });
    grid.forEach(function (row) { console.log('  ' + row.map(function (v) { return ('  ' + v).slice(-4); }).join('')); });
    console.log('走法序列：' + seq.slice(1).map(function (q, i) {
      const dr = q[0] - seq[i][0], dc = q[1] - seq[i][1];
      return DIRS.filter(function (d) { return d[0] === dr && d[1] === dc; })[0][2];
    }).join(''));
  }
}

if (fails.length) {
  console.log('\nFAILURES (' + fails.length + '):');
  fails.forEach(function (f) { console.log(' - ' + f); });
  process.exit(1);
}
console.log('\nALL-PASS: n=2..9 巡游构造合法，#80 模型 ' + (d80 ? PZ.engines.prince.build(d80.p).steps : 0) + ' 帧字幕完整。');
