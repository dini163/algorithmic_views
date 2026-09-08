/* #89 构造法验证：中行作"高速公路"留到最后，5 行各做一次一维蟾蛙换位 */
const N = 5, n = 2;
function initBoard() {
  const b = [];
  for (let r = 0; r < N; r++) {
    const row = [];
    for (let c = 0; c < N; c++) {
      if (r === n && c === n) row.push('_');
      else {
        const w = c <= (r < n ? n : n - (r === n ? 0 : -1)) && c < (r === n ? n : n + (r < n ? 1 : 0));
        row.push(w ? 'W' : 'B');
      }
    }
    b.push(row);
  }
  return b;
}
function goalBoard() {
  const b = [];
  for (let r = 0; r < N; r++) {
    const row = [];
    for (let c = 0; c < N; c++) {
      if (r === n && c === n) row.push('_');
      else row.push(c < (r < n ? n + 1 : n) ? 'B' : 'W');
    }
    b.push(row);
  }
  return b;
}
const seq = []; // {fr,fc,tr,tc,phase}
function mv(b, fr, fc, tr, tc, phase) {
  const v = b[fr][fc];
  if (v !== 'W' && v !== 'B') throw new Error('no piece at ' + fr + ',' + fc);
  if (b[tr][tc] !== '_') throw new Error('target not empty ' + tr + ',' + tc + ' at move ' + (seq.length + 1));
  const dr = tr - fr, dc = tc - fc;
  const jump = Math.abs(dr) + Math.abs(dc) === 2;
  if (!(Math.abs(dr) + Math.abs(dc) === 1 || jump)) throw new Error('bad dist');
  if (v === 'W' && !(dc > 0 || dr > 0)) throw new Error('W backwards');
  if (v === 'B' && !(dc < 0 || dr < 0)) throw new Error('B backwards');
  if (jump) {
    const mid = b[(fr + tr) / 2][(fc + tc) / 2];
    if (mid === '_' || mid === v) throw new Error('bad jump over ' + mid);
  }
  b[tr][tc] = v; b[fr][fc] = '_';
  seq.push({ fr, fc, tr, tc, jump, v, phase });
}
/* 一维蟾蛙换位 8 步走法（行内列下标 from->to） */
const LINE = [[1, 2], [3, 1], [4, 3], [2, 4], [0, 2], [1, 0], [3, 1], [2, 3]];
function sweepRow(b, r, phase) {
  const line = b[r].join('');
  if (line !== 'WW_BB') throw new Error('row ' + r + ' not in toad-frog form: ' + line);
  LINE.forEach(([f, t], i) => mv(b, r, f, r, t, phase + '·行' + r + ' 换位 ' + (i + 1) + '/8'));
}
const b = initBoard();
console.log('初始:'); b.forEach(r => console.log('  ' + r.join(' ')));
/* ① 空位上移到第 1 行，横扫 */
mv(b, 1, 2, 2, 2, '空位上移到第 1 行');
sweepRow(b, 1, '① 第 1 行');
/* ② B 跳过中行的 W → 空位跨进第 3 行，横扫 */
mv(b, 3, 2, 1, 2, 'B 跳过中行 W，空位跨进第 3 行');
sweepRow(b, 3, '② 第 3 行');
/* ③ B 上滑 → 空位进第 4 行，横扫 */
mv(b, 4, 2, 3, 2, '空位下移到第 4 行');
sweepRow(b, 4, '③ 第 4 行');
/* ④ W 跳回中行 → 再 W 跳上第 0 行，横扫 */
mv(b, 2, 2, 4, 2, 'W 跳回，空位回到中行');
mv(b, 0, 2, 2, 2, 'W 跳上，空位直上第 0 行');
sweepRow(b, 0, '④ 第 0 行');
/* ⑤ 三连归位：B 滑、B 跳、W 滑 → 空位回中行，横扫收尾 */
mv(b, 1, 2, 0, 2, 'B 上滑归位');
mv(b, 3, 2, 1, 2, 'B 跳回归位');
mv(b, 2, 2, 3, 2, 'W 下滑，空位回到中行');
sweepRow(b, 2, '⑤ 中行收尾');
console.log('结束:'); b.forEach(r => console.log('  ' + r.join(' ')));
const ok = b.every((row, r) => row.join('') === goalBoard()[r].join(''));
console.log('总步数:', seq.length, ' 达到目标:', ok);
if (ok) {
  console.log('\n=== MOVES ===');
  seq.forEach((m, i) => console.log(`${i + 1}|${m.v}|${m.fr},${m.fc}|${m.tr},${m.tc}|${m.jump ? '跳' : '滑'}|${m.phase}`));
}
