const fs = require('fs');
const path = require('path');
const pdfjs = require('pdfjs-dist/legacy/build/pdf.js');
const { PNG } = require('pngjs');

const pdfPath = '../算法谜题.pdf';
const outDir = path.join(__dirname, 'pages');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

const start = parseInt(process.argv[2] || '1', 10);
const end = parseInt(process.argv[3] || '10', 10);

async function main() {
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const doc = await pdfjs.getDocument({ data }).promise;
  for (let p = start; p <= end; p++) {
    const page = await doc.getPage(p);
    const ops = await page.getOperatorList();
    let saved = 0;
    for (let i = 0; i < ops.fnArray.length; i++) {
      if (ops.fnArray[i] === pdfjs.OPS.paintImageXObject) {
        const imgName = ops.argsArray[i][0];
        let img;
        try { img = await page.objs.get(imgName); } catch (e) { continue; }
        if (!img || !img.data) continue;
        const { width, height, kind, data: raw } = img;
        const png = new PNG({ width, height });
        if (kind === 3) { // RGBA
          Buffer.from(raw.buffer, raw.byteOffset, raw.byteLength).copy(png.data);
        } else if (kind === 2) { // RGB
          for (let j = 0, k = 0; j < raw.length; j += 3, k += 4) {
            png.data[k] = raw[j]; png.data[k+1] = raw[j+1]; png.data[k+2] = raw[j+2]; png.data[k+3] = 255;
          }
        } else if (kind === 1) { // grayscale 1bpp
          for (let px = 0; px < width * height; px++) {
            const v = (raw[px >> 3] >> (7 - (px & 7))) & 1 ? 255 : 0;
            png.data[px*4] = v; png.data[px*4+1] = v; png.data[px*4+2] = v; png.data[px*4+3] = 255;
          }
        } else { continue; }
        const file = path.join(outDir, `p${p}_${saved}.png`);
        fs.writeFileSync(file, PNG.sync.write(png));
        saved++;
      }
    }
    console.log(`page ${p}: ${saved} images`);
  }
}
main().catch(e => { console.error(e); process.exit(1); });
