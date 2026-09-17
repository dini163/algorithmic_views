/* 拼图：把 tmp/rz 下若干 PNG 拼成一张联系表，便于一次性肉眼比对风格。
   用法：node tools/montage.js "a.png,b.png,..." [cols] [out] */
const fs = require('fs'), path = require('path');
const { createCanvas, loadImage } = require(path.join(__dirname, '..', 'pdf_tools', 'node_modules', '@napi-rs', 'canvas'));
const root = path.join(__dirname, '..');
const files = (process.argv[2] || '').split(',').filter(Boolean);
const cols = parseInt(process.argv[3] || '4', 10);
const out = process.argv[4] || path.join(root, 'tmp', 'rz', '_montage.png');
const CW = 320, CH = 165;
const rows = Math.ceil(files.length / cols);
(async function () {
  const canvas = createCanvas(cols * CW, rows * CH);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, cols * CW, rows * CH);
  for (let i = 0; i < files.length; i++) {
    const img = await loadImage(path.join(root, 'tmp', 'rz', files[i]));
    const cx = (i % cols) * CW, cy = Math.floor(i / cols) * CH;
    ctx.drawImage(img, cx, cy, CW, CH);
    ctx.strokeStyle = '#333'; ctx.strokeRect(cx + 0.5, cy + 0.5, CW - 1, CH - 1);
  }
  fs.writeFileSync(out, canvas.toBuffer('image/png'));
  console.log('wrote ' + path.relative(root, out) + '  ' + cols + 'x' + rows);
})();
