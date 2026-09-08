/* 全量体检：文字六件套覆盖 + 引擎使用情况 + build 冒烟
   用法：node tools/audit_all.js */
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
  try {
    vm.runInContext('(function () {\n' + fs.readFileSync(path.join(root, 'js/pz/' + f), 'utf8') + '\n})();', sandbox, { filename: f });
  } catch (e) {
    console.log('LOAD-FAIL ' + f + ': ' + e.message);
    process.exit(1);
  }
}
const PZ = sandbox.PZ;
console.log('defs total:', PZ.defs.length);

const engUse = {};
const missDesc = [], missIdea = [], missExtra = [], missQ = [], missCp = [];
PZ.defs.forEach(function (d) {
  engUse[d.e] = (engUse[d.e] || 0) + 1;
  const key = (d.g === 'o' ? 'o' : '') + d.no;
  const de = PZ.desc && PZ.desc[key], id = PZ.idea && PZ.idea[key], ex = PZ.extra && PZ.extra[key];
  if (!de) missDesc.push(key); else { if (!de.q) missQ.push(key); if (!de.cp) missCp.push(key); }
  if(!id) missIdea.push(key);
  if (!ex || !ex.life || !ex.case) missExtra.push(key);
});
console.log('engines used:', JSON.stringify(engUse));
console.log('registered:', Object.keys(PZ.engines).join(','));
console.log('missing desc:', missDesc.length, missDesc.slice(0, 25).join(','));
console.log('missing q:', missQ.length, missQ.slice(0, 25).join(','));
console.log('missing cp:', missCp.length, missCp.slice(0, 25).join(','));
console.log('missing idea:', missIdea.length, missIdea.slice(0, 40).join(','));
console.log('missing extra(life/case):', missExtra.length, missExtra.slice(0, 40).join(','));

const errs = [];
const labelMiss = [];
PZ.defs.forEach(function (d) {
  try {
    const M = PZ.engines[d.e].build(d.p || {});
    if (!M || typeof M.steps !== 'number' || !isFinite(M.steps)) { errs.push(d.no + ':bad steps'); return; }
    if (typeof M.label !== 'function') labelMiss.push((d.g === 'o' ? 'o' : '') + d.no + ' ' + d.e);
  } catch (e) { errs.push((d.g === 'o' ? 'o' : '') + d.no + ' ' + d.e + ': ' + e.message); }
});
console.log('build errors:', errs.length); errs.slice(0, 20).forEach(function (e) { console.log('  ', e); });
console.log('engines without label():', labelMiss.length, labelMiss.slice(0, 20).join(','));
