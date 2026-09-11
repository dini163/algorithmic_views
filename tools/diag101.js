/* #101 帧级诊断：直接读引擎录制的 _frames，核对每帧主盘的黑/白格数与字幕 */
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..');
const gsapStub = { to: function () { return { kill() {}, play() {}, pause() {}, timeScale() {} }; }, delayedCall: function () { return { kill() {}, play() {}, pause() {}, timeScale() {} }; } };
const win = { gsap: gsapStub, devicePixelRatio: 1, addEventListener: function () {} };
const winProxy = new Proxy(win, { set: function (t, k, v) { t[k] = v; sandbox[k] = v; return true; } });
const sandbox = { window: winProxy, gsap: gsapStub, console: console, Math: Math, performance: { now: function () { return 0; } }, requestAnimationFrame: function () {}, document: { getElementById: function () { return null; } }, IntersectionObserver: function () { return { observe: function () {} }; }, setTimeout: setTimeout, clearTimeout: clearTimeout };
vm.createContext(sandbox);
['core.js', 'util.js', 'engines.js', 'desc.js', 'idea.js', 'data_o.js', 'data_a.js', 'data_b.js', 'data_c.js'].forEach(function (f) {
  vm.runInContext('(function (){\n' + fs.readFileSync(path.join(root, 'js/pz/' + f), 'utf8') + '\n})();', sandbox, { filename: f });
});

const d = sandbox.PZ.defs.find(function (x) { return x.no === 101; });
const M = sandbox.PZ.engines[d.e].build(d.p || {});
const F = M._frames;
const BLACK = '#232c52', WHITE = '#e7e2d4';
console.log('frames =', F.length, ' steps =', M.steps, ' baseMs =', M.baseMs);

let bad = 0, prevB = 0;
F.forEach(function (f, i) {
  let mb = 0, mw = 0, miniB = 0, caps = [], trails = 0, walkers = 0, rings = 0;
  f.forEach(function (it) {
    if (it.t === 'rr' && Math.abs((it.w || 0) - 26) < 1) { if (it.fill === BLACK) mb++; else if (it.fill === WHITE) mw++; }
    else if (it.t === 'rr' && Math.abs((it.w || 0) - 13) < 1 && it.fill === BLACK) miniB++;
    else if (it.t === 'line' && it.stroke === 'rgba(94,234,212,.55)') trails++;
    else if (it.t === 'circle' && it.fill === '#fbbf24' && it.r >= 7 && it.r <= 8) walkers++;
    else if (it.t === 'recto' && (it.stroke === '#5eead4' || it.stroke === '#fbbf24')) rings++;
    if (it.cap) caps.push(it.s);
  });
  const ok = mb + mw === 64;
  if (!ok) bad++;
  console.log(String(i).padStart(3), 'B=' + String(mb).padStart(2), 'W=' + String(mw).padStart(2),
    'miniB=' + miniB, 'trail=' + trails, 'walker=' + walkers, 'ring=' + rings,
    'cap=', caps.join('|').slice(0, 46));
  if (mb < prevB) console.log('   !!! black count decreased');
  prevB = mb;
});
console.log(bad ? ('BAD frames: ' + bad) : 'every frame has exactly 64 main cells');
