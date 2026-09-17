/* 无头渲染：用 @napi-rs/canvas 把任意谜题的任意帧画成 PNG，便于肉眼比对 UI 风格。
   用法：
     node tools/render_pz.js 80                 # 渲染 #80 的一组代表帧
     node tools/render_pz.js 80 5               # 只渲染第 5 步（pp=1）
     node tools/render_pz.js 80,3,10 mid        # 多题，mid=中间帧
   输出到 tmp/rz/<key>_<k>.png */
const fs = require('fs'), path = require('path'), vm = require('vm');
const { createCanvas } = require(path.join(__dirname, '..', 'pdf_tools', 'node_modules', '@napi-rs', 'canvas'));
const root = path.join(__dirname, '..');

const gsapStub = {
  to: function () { return { kill() {}, play() {}, pause() {}, timeScale() {} }; },
  delayedCall: function () { return { kill() {}, play() {}, pause() {}, timeScale() {} }; }
};
const win = { gsap: gsapStub, devicePixelRatio: 1, addEventListener: function () {} };
const winProxy = new Proxy(win, { set: function (t, k, v) { t[k] = v; sandbox[k] = v; return true; } });
const sandbox = {
  window: winProxy, gsap: gsapStub, console: console, Math: Math, JSON: JSON,
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
const PZ = sandbox.PZ;

const outDir = path.join(root, 'tmp', 'rz');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function findDef(no) {
  const s = String(no);
  const isO = s[0] === 'o';
  const n = parseInt(isO ? s.slice(1) : s, 10);
  return PZ.defs.find(function (d) { return d.no === n && ((d.g === 'o') === isO); });
}

const W = 640, Hh = 330, DPR = 2;
function render(d, k, pp, file) {
  const canvas = createCanvas(W * DPR, Hh * DPR);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  ctx.fillStyle = '#101114'; ctx.fillRect(0, 0, W, Hh);
  const M = PZ.wrapModel(PZ.engines[d.e].build(d.p || {}), d);
  PZ.H.vignette(ctx, W, Hh);
  M.draw(ctx, W, Hh, k, pp, k * 100 + pp * 10);
  fs.writeFileSync(file, canvas.toBuffer('image/png'));
  return M;
}

const argNo = process.argv[2] || '80';
const argK = process.argv[3];
argNo.split(',').forEach(function (no) {
  const d = findDef(no.trim());
  if (!d) { console.log('not found: ' + no); return; }
  const M = PZ.wrapModel(PZ.engines[d.e].build(d.p || {}), d);
  const key = (d.g === 'o' ? 'o' : '') + d.no + '_' + d.e;
  let ks;
  if (argK === 'mid') ks = [0, Math.round(M.steps / 2), M.steps];
  else if (argK !== undefined) ks = [parseInt(argK, 10)];
  else ks = [0, Math.round(M.steps * 0.4), Math.round(M.steps * 0.75), M.steps];
  ks.forEach(function (k) {
    k = Math.max(0, Math.min(k, M.steps));
    const f = path.join(outDir, key + '_k' + k + '.png');
    render(d, k, 1, f);
    console.log('wrote ' + path.relative(root, f) + '  steps=' + M.steps + ' label=' + (M.label ? M.label(k) : ''));
  });
});
