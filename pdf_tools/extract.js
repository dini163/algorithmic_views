const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');
/* 用法：node extract.js <books目录下的PDF文件名> <输出txt> */
const book = process.argv[2] || '../算法谜题.pdf';
const out = process.argv[3] || 'pdf_text.txt';
const dataBuffer = fs.readFileSync(path.resolve(__dirname, '..', 'books', book));
(async () => {
  const parser = new PDFParse({ data: new Uint8Array(dataBuffer) });
  const result = await parser.getText();
  fs.writeFileSync(path.resolve(__dirname, out), result.text, 'utf8');
  console.log('pages:', result.pages || result.total, 'chars:', result.text.length);
})();
