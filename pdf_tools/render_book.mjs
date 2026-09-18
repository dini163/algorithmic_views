/* 书籍页面抽取：扫描版 PDF 每页就是一张内嵌图，直接把指定页的内嵌图存成 PNG，便于肉眼读取目录/题面。
   用法：node pdf_tools/render_book.mjs <book.pdf> <start> [end]
   输出到 tmp/book/<name前6字>_p<N>_<i>.png */
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import pkg from 'pngjs';
const { PNG } = pkg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const book = process.argv[2];
const start = parseInt(process.argv[3] || '1', 10);
const end = parseInt(process.argv[4] || String(start), 10);
const pdfPath = path.join(__dirname, '..', 'books', book);
const outDir = path.join(__dirname, '..', 'tmp', 'book');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const data = new Uint8Array(fs.readFileSync(pdfPath));
/* JPX/JPEG2000 页面图需要 pdfjs 自带的 openjpeg.wasm，通过 wasmUrl 指定 */
const wasmUrl = pathToFileURL(path.join(__dirname, 'node_modules', 'pdfjs-dist', 'wasm') + path.sep).href;
const doc = await pdfjs.getDocument({ data, wasmUrl }).promise;
for (let p = start; p <= end; p++) {
  const page = await doc.getPage(p);
  const ops = await page.getOperatorList();
  let saved = 0;
  for (let i = 0; i < ops.fnArray.length; i++) {
    if (ops.fnArray[i] !== pdfjs.OPS.paintImageXObject) continue;
    const imgName = ops.argsArray[i][0];
    let img;
    try { img = await page.objs.get(imgName); } catch (e) { continue; }
    if (!img || !img.data) continue;
    const { width, height, kind, data: raw } = img;
    if (width < 200 || height < 200) continue;
    const png = new PNG({ width, height });
    if (kind === 3) {
      Buffer.from(raw.buffer, raw.byteOffset, raw.byteLength).copy(png.data);
    } else if (kind === 2) {
      for (let j = 0, k = 0; j < raw.length; j += 3, k += 4) {
        png.data[k] = raw[j]; png.data[k + 1] = raw[j + 1]; png.data[k + 2] = raw[j + 2]; png.data[k + 3] = 255;
      }
    } else if (kind === 1) {
      for (let px = 0; px < width * height; px++) {
        const v = (raw[px >> 3] >> (7 - (px & 7))) & 1 ? 255 : 0;
        png.data[px * 4] = v; png.data[px * 4 + 1] = v; png.data[px * 4 + 2] = v; png.data[px * 4 + 3] = 255;
      }
    } else { continue; }
    const name = book.replace(/\.pdf$/i, '').slice(0, 6) + '_p' + p + '_' + saved + '.png';
    fs.writeFileSync(path.join(outDir, name), PNG.sync.write(png));
    saved++;
  }
  console.log('page ' + p + ': ' + saved + ' images');
}
