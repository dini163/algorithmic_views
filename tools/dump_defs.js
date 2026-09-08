/* 导出指定题目的完整定义源码，供人工审查 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ROOT = path.join(__dirname, '..');
const gsapStub = {
  to: function () { return { kill() {}, play() {}, pause() {}, timeScale() {} }; },
  delayedCall: function () { return { kill() {}, play() {}, pause() {}, timeScale() {} }; }
};
const win = { gsap: gsapStub, devicePixelRatio: 1, addEventListener: function () {} };
const winProxy = new Proxy(win, { set: function (t, k, v) { t[k] = v; sandbox[k] = v; return true; } });
const sandbox = { window: winProxy, gsap: gsapStub, console: console, Math: Math, performance: { now: function () { return 0; } }, requestAnimationFrame: function () {}, document: { getElementById: function () { return null; } }, IntersectionObserver: function () { return { observe: function () {} }; }, setTimeout: setTimeout, clearTimeout: clearTimeout };
vm.createContext(sandbox);
const files = ['core.js', 'util.js', 'engines.js', 'desc.js', 'idea.js', 'data_o.js', 'data_a.js', 'data_b.js', 'data_c.js', 'extra1.js', 'extra2.js'];
for (const f of files) {
  vm.runInContext('(function () {\n' + fs.readFileSync(path.join(ROOT, 'js/pz', f), 'utf8') + '\n})();', sandbox, { filename: f });
}
const PZ = sandbox.PZ;
const want = process.argv[2].split(',');
PZ.defs.forEach(d => {
  const key = (d.g === 'o' ? 'o' : '') + d.no;
  if (!want.includes(key)) return;
  console.log('===== ' + key + ' ' + d.title + ' (engine=' + d.e + ') =====');
  const steps = (d.p && d.p.steps) || [];
  console.log('plain: ' + d.plain);
  steps.forEach((st, i) => {
    console.log('  [' + i + '] cap: ' + st.cap);
  });
  if (!steps.length) console.log('  (params: ' + JSON.stringify(d.p).slice(0, 300) + ')');
});
