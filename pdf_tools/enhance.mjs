/* 扫描页增强：对 tmp/book 下过曝的 PNG 做百分位对比度拉伸 + gamma，输出 *_enh.png 便于肉眼读取目录。
   用法：node pdf_tools/enhance.mjs <png路径...> */
import fs from 'fs';
import path from 'path';
import pkg from 'pngjs';
const { PNG } = pkg;

for (const file of process.argv.slice(2)) {
  const src = PNG.sync.read(fs.readFileSync(file));
  const { width, height, data } = src;
  const hist = new Array(256).fill(0);
  for (let i = 0; i < width * height; i++) {
    const lum = (data[i * 4] * 299 + data[i * 4 + 1] * 587 + data[i * 4 + 2] * 114) / 1000;
    hist[Math.max(0, Math.min(255, lum | 0))]++;
  }
  const total = width * height;
  const pick = (q) => {
    let acc = 0;
    for (let v = 0; v < 256; v++) { acc += hist[v]; if (acc >= total * q) return v; }
    return 255;
  };
  const lo = pick(0.02), hi = pick(0.92);
  const span = Math.max(8, hi - lo);
  const out = new PNG({ width, height });
  for (let i = 0; i < width * height; i++) {
    const lum = (data[i * 4] * 299 + data[i * 4 + 1] * 587 + data[i * 4 + 2] * 114) / 1000;
    let t = (lum - lo) / span;
    t = Math.max(0, Math.min(1, t));
    const v = Math.round(255 * Math.pow(t, 1.6));
    out.data[i * 4] = v; out.data[i * 4 + 1] = v; out.data[i * 4 + 2] = v; out.data[i * 4 + 3] = 255;
  }
  const dst = file.replace(/\.png$/i, '_enh.png');
  fs.writeFileSync(dst, PNG.sync.write(out));
  console.log(path.basename(dst) + ' lo=' + lo + ' hi=' + hi);
}
