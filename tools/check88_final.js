/* 用真实引擎代码复现 #88：逐步打印数组快照与空位位置 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ROOT = path.join(__dirname, '..');
const files = ['core.js', 'util.js', 'engines.js', 'desc.js', 'idea.js', 'data_o.js', 'data_a.js', 'data_b.js', 'data_c.js', 'extra1.js', 'extra2.js'];
const win = { gsap: null };
const winProxy = new Proxy(win, {
  set: function (t, k, v) { t[k] = v; sandbox[k] = v; return true; }
});
const sandbox = { window: winProxy, console: console };
vm.createContext(sandbox);
files.forEach(f => vm.runInContext(fs.readFileSync(path.join(ROOT, 'js/pz', f), 'utf8'), sandbox, { filename: f }));
const PZ = sandbox.window.PZ;

const defs88 = PZ.defs.filter(d => d.no === 88);
console.log('#88 defs 数量:', defs88.length);
const d = defs88[0];
console.log('ops 数量:', d.p.ops.length, ' op 类型:', d.p.ops.map(o => o.t).join(','));

/* 复刻引擎 arrAt/apply 逻辑逐步验证 */
const a = d.p.init.slice();
console.log('初始:', a.join(' '), ' 空位@', a.indexOf('_'));
d.p.ops.forEach(function (o, k) {
  const t = a[o.i]; a[o.i] = a[o.j]; a[o.j] = t;   /* swap */
  console.log('第' + String(k + 1).padStart(2) + '步 swap(' + o.i + ',' + o.j + '):', a.join(' '), ' 空位@' + a.indexOf('_'));
});
console.log('终局:', a.join(' '), a.indexOf('_') === 3 ? '✓ 空位在中间(第4格)' : '✗ 空位不在中间');

/* 引擎 build 冒烟 */
const M = PZ.engines[d.e].build(d.p);
console.log('引擎 steps =', M.steps);
