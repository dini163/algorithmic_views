/* 过渡中途证明：以 pp=0.5 绘制每个过渡，检查是否有矩形/圆点出现在
   "既不属于上一帧、也不属于当前帧"的位置（即被 lerp 到半途 = 视觉滑动）。
   用法：node tools/diagdrift.js <puzzleNo> */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.join(__dirname, '..');
const gsapStub = { to: function () { return { kill() {}, play() {}, pause() {}, timeScale() {} }; }, delayedCall: function () { return { kill() {}, play() {}, pause() {}, timeScale() {} }; } };
const win = { gsap: gsapStub, devicePixelRatio: 1, addEventListener: function () {} };
const winProxy = new Proxy(win, { set: function (t, k, v) { t[k] = v; sandbox[k] = v; return true; } });
const sandbox = { window: winProxy, gsap: gsapStub, console: console, Math: Math, performance: { now: function () { return 0; } }, requestAnimationFrame: function () {}, document: { getElementById: function () { return null; } }, IntersectionObserver: function () { return { observe: function () {} }; }, setTimeout: setTimeout, clearTimeout: clearTimeout };
vm.createContext(sandbox);
['core.js', 'util.js', 'engines.js', 'desc.js', 'idea.js', 'data_o.js', 'data_a.js', 'data_b.js', 'data_c.js', 'extra1.js', 'extra2.js']
  .forEach(function (f) { vm.runInContext('(function () {\n' + fs.readFileSync(path.join(root, 'js/pz/' + f), 'utf8') + '\n})();', sandbox, { filename: f }); });
const PZ = sandbox.PZ, H = PZ.H;

const no = Number(process.argv[2]);
const d = PZ.defs.find(function (x) { return x.no === no && (x.e === 'board' || x.e === 'geo'); });
const M = PZ.engines[d.e].build(d.p || {});
const frames = M._frames;

function rrKey(x, y, w, h) { return Math.round(x) + ',' + Math.round(y) + ',' + Math.round(w) + 'x' + Math.round(h); }
function circleKey(x, y, r) { return Math.round(x) + ',' + Math.round(y) + ',r' + Math.round(r); }

const oRR = H.rr, oCircle = H.circle;
let bufRR = [], bufC = [];
H.rr = function (c, x, y, w, h, r) { bufRR.push([x, y, w, h]); return oRR.apply(this, arguments); };
H.circle = function (c, x, y, r, fill, stroke) { bufC.push([x, y, r, fill]); return oCircle.apply(this, arguments); };

const ctx = new Proxy({ measureText: function (s) { return { width: String(s).length * 7 }; }, createRadialGradient: function () { return { addColorStop: function () {} }; }, createLinearGradient: function () { return { addColorStop: function () {} }; } }, {
  get: function (t, k) { return (k in t) ? t[k] : function () {}; },
  set: function (t, k, v) { t[k] = v; return true; }
});

let totalDrift = 0, totalC = 0;
console.log('=== #' + no + ' 过渡中途"飞行元素"检查（pp=0.5） ===');
for (let i = 1; i < frames.length; i++) {
  const A = frames[i - 1], B = frames[i];
  const setRR = {}, setC = {};
  A.concat(B).forEach(function (it) {
    if (it.t === 'rr') setRR[rrKey(it.x, it.y, it.w, it.h)] = 1;
    if (it.t === 'circle') setC[circleKey(it.x, it.y, it.r)] = 1;
  });
  bufRR = []; bufC = [];
  M.draw(ctx, 640, 330, i, 0.5, 12345);
  const driftRR = [];
  bufRR.forEach(function (p) { if (!setRR[rrKey(p[0], p[1], p[2], p[3])]) driftRR.push(rrKey(p[0], p[1], p[2], p[3])); });
  const driftC = [];
  bufC.forEach(function (p) { if (!setC[circleKey(p[0], p[1], p[2])]) driftC.push(circleKey(p[0], p[1], p[2]) + ' ' + p[3]); });
  totalDrift += driftRR.length; totalC += driftC.length;
  if (driftRR.length || driftC.length)
    console.log(' t' + i + ': 飞行矩形 ' + driftRR.length + (driftRR.length ? ' [' + driftRR.join(' ; ') + ']' : '') + '  飞行圆点 ' + driftC.length + (driftC.length ? ' [' + driftC.join(' ; ') + ']' : ''));
}
H.rr = oRR; H.circle = oCircle;
console.log('合计：飞行矩形 ' + totalDrift + ' 个，飞行圆点 ' + totalC + ' 个');
