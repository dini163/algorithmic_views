/* 用文本层里幸存的英文代码记号定位各栏签名算法所在页（中文正文乱码、代码保留）。
   用法：node pdf_tools/scan_cols.mjs <txt> */
import fs from 'fs';
const txt = fs.readFileSync(process.argv[2], 'utf8');
const pages = txt.split(/-- (\d+) of \d+ --/);
// pages: ['', '1', body1, '2', body2, ...]
const toks = ['BITSPERWORD', 'anagram', 'rot', 'Jane', 'maxsofar', 'rule of 72', '72', 'heapsort', 'siftup', 'markov', 'Markov', 'quicksort', 'partition', 'sentinel', 'randint', 'Floyd', 'hash', 'sign', 'invariant', 'Huffman', 'sparse', 'McIlroy', 'binary search'];
const hits = {};
for (let i = 1; i < pages.length; i += 2) {
  const p = parseInt(pages[i], 10), body = pages[i + 1] || '';
  for (const t of toks) if (body.includes(t)) (hits[t] = hits[t] || []).push(p);
}
for (const t of toks) console.log(t.padEnd(14), (hits[t] || []).slice(0, 14).join(','));
