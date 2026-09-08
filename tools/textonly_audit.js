/* 全量审计：找出 board/geo 题中"整屏纯文字"的步骤（无图形元素，文字独占画面）
   用法：node tools/textonly_audit.js */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.join(__dirname, '..');

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

const files = ['core.js', 'util.js', 'engines.js', 'desc.js', 'idea.js', 'data_o.js', 'data_a.js', 'data_b.js', 'data_c.js', 'extra1.js', 'extra2.js'];
for (const f of files) {
  vm.runInContext('(function () {\n' + fs.readFileSync(path.join(root, 'js/pz/' + f), 'utf8') + '\n})();', sandbox, { filename: f });
}
const PZ = sandbox.PZ;

const bad = [];
PZ.defs.forEach(function (d) {
  if (d.e !== 'board' && d.e !== 'geo') return;
  const M = PZ.engines[d.e].build(d.p || {});
  if (!M._frames) return;
  M._frames.forEach(function (f, i) {
    const nonText = f.filter(function (it) { return it.t !== 'txt'; });
    if (nonText.length === 0 && f.length > 0) {
      bad.push((d.g === 'o' ? '概' : '#') + d.no + ' 第' + i + '步 | ' + (d.p.steps[i].cap || '').slice(0, 34));
    }
  });
});
console.log('text-only steps:', bad.length);
bad.forEach(function (b) { console.log(' ', b); });
