/* 无头校验：按页面顺序加载全部脚本，扫描每个谜题的每一帧（含补间中间帧）
   用法：node tools/validate.js */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.join(__dirname, '..');

const gsapStub = {
  to: function () { return { kill() {}, play() {}, pause() {}, timeScale() {} }; },
  delayedCall: function () { return { kill() {}, play() {}, pause() {}, timeScale() {} }; }
};
const win = {
  gsap: gsapStub,
  devicePixelRatio: 1,
  addEventListener: function () {}
};
/* core.js 会执行 window.PZ = {...}，必须同步回全局，否则后续脚本的裸 PZ 指向旧对象 */
const winProxy = new Proxy(win, {
  set: function (t, k, v) { t[k] = v; sandbox[k] = v; return true; }
});
const sandbox = { window: winProxy, gsap: gsapStub, console: console, Math: Math, performance: { now: function () { return 0; } }, requestAnimationFrame: function () {}, document: { getElementById: function () { return null; } }, IntersectionObserver: function () { return { observe: function () {} }; }, setTimeout: setTimeout, clearTimeout: clearTimeout };
vm.createContext(sandbox);

const files = ['core.js', 'util.js', 'engines.js', 'desc.js', 'idea.js', 'data_o.js', 'data_a.js', 'data_b.js', 'data_c.js'];
for (const f of files) {
  try {
    /* 包一层 IIFE，模拟浏览器中每个 <script> 独立的词法作用域（vm 会让 const 跨脚本泄漏） */
    vm.runInContext('(function () {\n' + fs.readFileSync(path.join(root, 'js/pz/' + f), 'utf8') + '\n})();', sandbox, { filename: f });
  } catch (e) {
    console.log('LOAD-FAIL ' + f + ': ' + e.message);
    process.exit(1);
  }
}
console.log('loaded: ' + files.join(', '));
console.log('defs = ' + sandbox.PZ.defs.length + ' | engines = ' + Object.keys(sandbox.PZ.engines).join(','));

function makeCtx() {
  const grad = { addColorStop: function () {} };
  const fn = function () { return undefined; };
  const target = {
    measureText: function (s) { return { width: String(s).length * 7 }; },
    createRadialGradient: function () { return grad; },
    createLinearGradient: function () { return grad; },
    setTransform: fn, save: fn, restore: fn, translate: fn, rotate: fn, scale: fn,
    beginPath: fn, closePath: fn, moveTo: fn, lineTo: fn, arc: fn, arcTo: fn,
    quadraticCurveTo: fn, bezierCurveTo: fn, ellipse: fn, rect: fn,
    fill: fn, stroke: fn, clip: fn,
    fillRect: fn, strokeRect: fn, clearRect: fn, fillText: fn, strokeText: fn
  };
  return new Proxy(target, {
    get: function (t, k) { if (k in t) return t[k]; return function () { return undefined; }; },
    set: function (t, k, v) { t[k] = v; return true; }
  });
}

const fails = [];
let frames = 0;
sandbox.PZ.defs.forEach(function (d) {
  const key = (d.g === 'o' ? '概' + d.no : '#' + d.no) + ' ' + d.title + ' [' + d.e + ']';
  const eng = sandbox.PZ.engines[d.e];
  if (!eng) { fails.push(key + ' → 缺少引擎'); return; }
  let M;
  try {
    M = eng.build(d.p || {});
  } catch (e) {
    fails.push(key + ' → build 异常: ' + e.message);
    return;
  }
  if (typeof M.draw !== 'function') { fails.push(key + ' → 模型无 draw'); return; }
  const n = M.steps || 0;
  try {
    for (let k = 0; k <= n; k++) {
      for (const p of [0, 0.25, 0.5, 0.8, 1]) {
        M.draw(makeCtx(), 640, 330, k, p, k * 100 + p * 10);
        frames++;
      }
      if (typeof M.label === 'function') M.label(k);
    }
  } catch (e) {
    fails.push(key + ' → draw 异常: ' + e.message + '\n' + (e.stack || '').split('\n').slice(1, 4).join(''));
  }
});

console.log('frames swept: ' + frames);
if (fails.length) {
  console.log('\nFAILURES (' + fails.length + '):');
  fails.forEach(function (f) { console.log(' - ' + f); });
  process.exit(1);
}
console.log('ALL-PASS: ' + sandbox.PZ.defs.length + ' defs swept clean.');
