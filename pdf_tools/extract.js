const fs = require('fs');
const { PDFParse } = require('pdf-parse');
const dataBuffer = fs.readFileSync('../算法谜题.pdf');
(async () => {
  const parser = new PDFParse({ data: new Uint8Array(dataBuffer) });
  const result = await parser.getText();
  fs.writeFileSync('pdf_text.txt', result.text, 'utf8');
  console.log('pages:', result.pages || result.total, 'chars:', result.text.length);
})();
